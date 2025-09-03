import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, CreditCard, Wallet, AlertCircle, Loader2 } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useCheckout } from '../contexts/CheckoutContext';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedAddress?: any; // Add selectedAddress prop
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

const PaymentModal = ({ isOpen, onClose, selectedAddress }: PaymentModalProps) => {
  const [paymentMethod, setPaymentMethod] = useState<'ONLINE' | 'COD'>('ONLINE');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const { cartTotal } = useCart();
  const { createOrder } = useCheckout();
  
  // Create Razorpay order using Supabase Edge Function
  const createRazorpayOrder = async (amount: number, address: any) => {
    try {
      // Call our Supabase Edge Function
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-razorpay-order`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amount,
          currency: 'INR',
          receipt: `receipt_${Date.now()}`,
          notes: {
            address_id: address?.id,
            customer_name: address?.name,
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ Edge Function Error Response:', errorData);
        throw new Error(`Failed to create payment order: ${errorData.error || 'Unknown error'}`);
      }

      const orderData = await response.json();
      console.log('📦 Edge Function order created:', orderData);
      
      // Validate the response data
      if (!orderData.data?.order_id || !orderData.data?.amount) {
        throw new Error('Invalid response from Edge Function');
      }
      
      return {
        success: true,
        data: {
          order_id: orderData.data.order_id,
          amount: orderData.data.amount,
          currency: orderData.data.currency || 'INR',
          key_id: orderData.data.key_id
        }
      };
    } catch (error) {
      console.error('❌ Error creating order via Edge Function:', error);
      throw new Error(`Failed to create payment order: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  // Test Edge Function connectivity
  const testEdgeFunction = async () => {
    try {
      console.log('🧪 Testing Edge Function connectivity...');
      
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/test-body`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          test: 'data', 
          number: 123,
          timestamp: new Date().toISOString(),
          source: 'PaymentModal'
        }),
      });

      const result = await response.json();
      console.log('🧪 Test function response:', result);
      
      if (result.success) {
        setError('✅ Test function working! Check console for details.');
      } else {
        setError(`❌ Test function failed: ${result.error}`);
      }
    } catch (error) {
      console.error('🧪 Test function error:', error);
      setError(`❌ Test function error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handlePayment = async () => {
    if (!selectedAddress) {
      setError('Please select an address');
      return;
    }

    // Check if Razorpay is loaded
    if (!window.Razorpay) {
      setError('Payment gateway not loaded. Please refresh the page and try again.');
      return;
    }

    // Check if Supabase environment variables are configured
    if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
      setError('Payment configuration error. Please check your environment setup.');
      return;
    }

    setError('');
    setIsProcessing(true);

    try {
      if (paymentMethod === 'ONLINE') {
        console.log('🔍 Starting online payment process...');
        console.log('🔑 Razorpay Key ID:', import.meta.env.VITE_RAZORPAY_KEY_ID);
        console.log('💰 Cart Total:', cartTotal);
        console.log('📍 Selected Address:', selectedAddress);
        console.log('🌐 Razorpay available:', !!window.Razorpay);
        
        // Create Razorpay order (temporary frontend implementation)
        const result = await createRazorpayOrder(Math.round(cartTotal * 100), selectedAddress);
        console.log('📦 Order creation result:', result);

        if (!result.success) {
          throw new Error('Failed to create payment order');
        }

        // Initialize Razorpay
        const options = {
          key: result.data.key_id,
          amount: result.data.amount,
          currency: result.data.currency,
          name: 'Luxe Interiors',
          description: 'Interior Design Products',
          order_id: result.data.order_id,
          handler: function (response: any) {
            console.log('🎉 Payment successful! Response:', response);
            // Handle successful payment
            handlePaymentSuccess(response);
          },
          prefill: {
            name: selectedAddress.name,
            email: selectedAddress.email || 'customer@example.com',
            contact: selectedAddress.mobile,
          },
          theme: {
            color: '#4a5db3',
          },
          modal: {
            ondismiss: function() {
              console.log('❌ Razorpay modal dismissed');
              setIsProcessing(false);
            }
          }
        };

        console.log('🎯 Razorpay options:', options);
        console.log('🚀 Opening Razorpay modal...');
        
        const razorpay = new window.Razorpay(options);
        razorpay.open();
        
        console.log('✅ Razorpay.open() called');
      } else {
        // COD - directly create order
        await createOrder('COD', cartTotal);
        onClose();
      }
    } catch (error) {
      console.error('Payment error:', error);
      setError(error instanceof Error ? error.message : 'Failed to process payment');
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle payment success and verify with backend
  const handlePaymentSuccess = async (response: any) => {
    try {
      console.log('🎉 Razorpay payment response:', response);
      
      // Validate Razorpay response
      if (!response.razorpay_payment_id || !response.razorpay_order_id || !response.razorpay_signature) {
        console.error('❌ Invalid Razorpay response:', response);
        throw new Error('Invalid payment response from Razorpay');
      }
      
      // First create order in database
      const order = await createOrder('ONLINE', cartTotal, {
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_order_id: response.razorpay_order_id,
      });
      
      console.log('📋 Order created in database:', order);
      console.log('🔍 Order details:', {
        id: order?.id,
        user_id: order?.user_id,
        type: typeof order,
        keys: order ? Object.keys(order) : 'No order object'
      });
      
      // Validate order data
      if (!order || !order.id || !order.user_id) {
        console.error('❌ Invalid order data:', order);
        throw new Error('Failed to create order in database');
      }
      
      // Prepare verification data
      const verificationData = {
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_order_id: response.razorpay_order_id,
        razorpay_signature: response.razorpay_signature,
        order_id: order.id,
        user_id: order.user_id,
        amount: Math.round(cartTotal * 100), // Convert to paise for consistency with Razorpay
        currency: 'INR',
        payment_method: 'ONLINE'
      };
      
      console.log('🔍 Sending verification data:', verificationData);
      console.log('📤 Request URL:', `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/verify-payment`);
      console.log('🔑 Authorization header:', `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY.substring(0, 20)}...`);
      console.log('📦 Request body (stringified):', JSON.stringify(verificationData));
      
      // Test with a simple request first
      console.log('🧪 Testing simple request...');
      const testResponse = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/verify-payment`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          razorpay_payment_id: 'test_payment_id',
          razorpay_order_id: 'test_order_id',
          razorpay_signature: 'test_signature',
          order_id: 'test_order_id',
          user_id: 'test_user_id',
          amount: 100,
          currency: 'INR',
          payment_method: 'ONLINE'
        }),
      });
      
      console.log('🧪 Test response status:', testResponse.status);
      const testResult = await testResponse.json();
      console.log('🧪 Test response:', testResult);
      
      // Now verify payment with our backend
      const verificationResponse = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/verify-payment`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(verificationData),
      });

      console.log('📡 Response status:', verificationResponse.status);
      console.log('📡 Response headers:', Object.fromEntries(verificationResponse.headers.entries()));
      
      const verificationResult = await verificationResponse.json();
      console.log('📡 Verification response:', verificationResult);
      
      if (!verificationResult.success) {
        throw new Error(`Payment verification failed: ${verificationResult.error}`);
      }
      
      console.log('✅ Payment verified successfully:', verificationResult);
      onClose();
    } catch (error) {
      console.error('Error processing payment success:', error);
      setError('Payment successful but failed to process. Please contact support.');
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-xl shadow-elegant max-w-md w-full p-6"
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-serif font-semibold">Payment Options</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            disabled={isProcessing}
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col gap-3">
            <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="paymentMethod"
                value="ONLINE"
                checked={paymentMethod === 'ONLINE'}
                onChange={(e) => setPaymentMethod(e.target.value as 'ONLINE')}
                className="form-radio text-primary-600"
                disabled={isProcessing}
              />
              <div className="ml-3 flex items-center">
                <CreditCard size={20} className="text-primary-600 mr-2" />
                <div>
                  <p className="font-medium">Pay Online</p>
                  <p className="text-sm text-gray-500">Full payment: ₹{cartTotal.toFixed(2)}</p>
                </div>
              </div>
            </label>

            <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="paymentMethod"
                value="COD"
                checked={paymentMethod === 'COD'}
                onChange={(e) => setPaymentMethod(e.target.value as 'COD')}
                className="form-radio text-primary-600"
                disabled={isProcessing}
              />
              <div className="ml-3 flex items-center">
                <Wallet size={20} className="text-primary-600 mr-2" />
                <div>
                  <p className="font-medium">Cash on Delivery</p>
                  <p className="text-sm text-gray-500">
                    Advance payment (20%): ₹{(cartTotal * 0.2).toFixed(2)}
                  </p>
                </div>
              </div>
            </label>
          </div>

          {error && (
            <div className="bg-error-50 text-error-700 p-3 rounded-lg flex items-start">
              <AlertCircle size={20} className="mr-2 flex-shrink-0 mt-0.5" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* Test Button for Debugging */}
          <button
            onClick={testEdgeFunction}
            className="btn btn-secondary w-full mb-2"
            disabled={isProcessing}
          >
            🧪 Test Edge Function
          </button>

          <button
            onClick={handlePayment}
            disabled={isProcessing}
            className="btn btn-primary w-full"
          >
            {isProcessing ? (
              <span className="flex items-center justify-center">
                <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                Processing...
              </span>
            ) : (
              'Pay & Place Order'
            )}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PaymentModal;