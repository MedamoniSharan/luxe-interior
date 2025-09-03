import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useCheckout } from '../contexts/CheckoutContext';
import { useCart } from '../contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import PaymentModal from './PaymentModal';

interface CheckoutFormProps {
  onClose?: () => void;
  onAddressAdded?: () => void;
}

const indianStates = {
  'Andhra Pradesh': [
    'Anantapur', 'Chittoor', 'East Godavari', 'Guntur', 'Krishna', 'Kurnool',
    'Prakasam', 'Srikakulam', 'Visakhapatnam', 'Vizianagaram', 'West Godavari',
    'YSR Kadapa'
  ],
  'Telangana': [
    'Adilabad', 'Bhadradri Kothagudem', 'Hyderabad', 'Jagtial', 'Jangaon',
    'Jayashankar Bhupalpally', 'Jogulamba Gadwal', 'Kamareddy', 'Karimnagar',
    'Khammam', 'Kumuram Bheem', 'Mahabubabad', 'Mahabubnagar', 'Mancherial',
    'Medak', 'Medchal–Malkajgiri', 'Mulugu', 'Nagarkurnool', 'Nalgonda',
    'Narayanpet', 'Nirmal', 'Nizamabad', 'Peddapalli', 'Rajanna Sircilla',
    'Rangareddy', 'Sangareddy', 'Siddipet', 'Suryapet', 'Vikarabad',
    'Wanaparthy', 'Warangal Rural', 'Warangal Urban', 'Yadadri Bhuvanagiri'
  ]
};

const CheckoutForm = ({ onClose, onAddressAdded }: CheckoutFormProps) => {
  const { addAddress, selectedAddress, selectAddress, addresses, loadAddresses, orderCompletionStatus, resetOrderStatus } = useCheckout();
  const { cartTotal } = useCart();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    state: '',
    district: '',
    address: '',
    pincode: ''
  });
  
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'ONLINE'>('ONLINE');
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);

  // Load addresses on component mount
  useEffect(() => {
    loadAddresses();
  }, [loadAddresses]);

  // Auto-select default address or first address when addresses are loaded
  useEffect(() => {
    if (addresses.length > 0 && !selectedAddress) {
      const defaultAddress = addresses.find(addr => addr.is_default) || addresses[0];
      if (defaultAddress) {
        selectAddress(defaultAddress);
      }
    }
  }, [addresses, selectedAddress, selectAddress]);

  // Handle order completion status changes
  useEffect(() => {
    if (orderCompletionStatus === 'success') {
      // Show success notification
      alert('🎉 Order placed successfully! \n\nYour order has been confirmed and you will receive a confirmation email shortly. Our team will contact you within 24 hours to schedule the installation.');
      navigate('/');
      resetOrderStatus();
    } else if (orderCompletionStatus === 'failed') {
      setError('Failed to create order. Please try again.');
      resetOrderStatus();
    }
  }, [orderCompletionStatus, navigate, resetOrderStatus]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (name === 'state') {
      setFormData(prev => ({ ...prev, district: '' }));
    }
  };

  const handleAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    console.log('🔍 Submitting address form:', formData);

    if (!formData.state || !formData.district) {
      setError('Please select both state and district');
      return;
    }

    if (formData.state !== 'Andhra Pradesh' && formData.state !== 'Telangana') {
      setError('Sorry, we are currently available only in Andhra Pradesh and Telangana');
      return;
    }

    try {
      await addAddress(formData);
      setShowAddressForm(false);
      if (onAddressAdded) {
        onAddressAdded();
      } else {
        setShowPaymentModal(true);
      }
    } catch (error) {
      console.error('🔍 Error adding address:', error);
      setError('Failed to save address. Please try again.');
    }
  };


  
  return (
    <div className="max-w-2xl mx-auto">
      {onClose && (
        <div className="flex justify-end mb-4">
          <button
            type="button"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕ Close
          </button>
        </div>
      )}
      
      {showAddressForm ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-serif font-bold text-gray-800">Add Delivery Address</h2>
            <button
              type="button"
              onClick={() => {
                if (onClose) {
                  onClose();
                } else {
                  setShowAddressForm(false);
                }
              }}
              className="text-gray-500 hover:text-gray-700"
            >
              Cancel
            </button>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <span className="text-blue-800">ℹ️</span>
              <span className="text-blue-800 text-sm">
                Please add your delivery address below. After adding the address, you'll be taken directly to the payment page.
              </span>
            </div>
          </div>

          {addresses.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-700">Or Select Existing Address</h3>
              <div className="space-y-3">
                {addresses.map(address => (
                  <div
                    key={address.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedAddress?.id === address.id
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-primary-300'
                    }`}
                    onClick={() => {
                      selectAddress(address);
                      setShowAddressForm(false);
                      if (onAddressAdded) {
                        onAddressAdded();
                      } else {
                        setShowPaymentModal(true);
                      }
                    }}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{address.name}</span>
                      <div className="flex items-center space-x-2">
                        {selectedAddress?.id === address.id && (
                          <span className="text-sm text-green-600 font-medium">✓ Selected</span>
                        )}
                        {address.is_default && (
                          <span className="text-sm text-primary-600">Default</span>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{address.address}</p>
                    <p className="text-sm text-gray-600">
                      {address.district}, {address.state} - {address.pincode}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      {address.mobile} | {address.email}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-white p-6 rounded-xl shadow-elegant">
            <h3 className="text-lg font-medium text-gray-700 mb-4">
              {addresses.length > 0 ? 'Add New Address' : 'Enter Delivery Address'}
            </h3>

            <form onSubmit={handleAddressSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mobile Number
                  </label>
                  <input
                    type="tel"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    pattern="[6-9][0-9]{9}"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State
                  </label>
                  <select
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                    required
                  >
                    <option value="">Select State</option>
                    {Object.keys(indianStates).map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    District
                  </label>
                  <select
                    name="district"
                    value={formData.district}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                    required
                    disabled={!formData.state}
                  >
                    <option value="">Select District</option>
                    {formData.state && indianStates[formData.state as keyof typeof indianStates]?.map(district => (
                      <option key={district} value={district}>{district}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pincode
                </label>
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  pattern="[0-9]{6}"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                  required
                />
              </div>

              {error && (
                <p className="text-error-500 text-sm">{error}</p>
              )}

              <button type="submit" className="btn btn-primary w-full">
                Add Address & Continue to Payment
              </button>
            </form>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <h2 className="text-2xl font-serif font-bold text-gray-800">Payment Method</h2>
          
          {/* Selected Address Summary */}
          {selectedAddress ? (
            <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-medium text-primary-800">Delivery Address</h3>
                <button
                  type="button"
                  onClick={() => setShowAddressForm(true)}
                  className="text-sm text-primary-600 hover:text-primary-800 underline"
                >
                  Change Address
                </button>
              </div>
              <div className="text-primary-700">
                <p className="font-medium">{selectedAddress.name}</p>
                <p className="text-sm">{selectedAddress.address}</p>
                <p className="text-sm">{selectedAddress.district}, {selectedAddress.state} - {selectedAddress.pincode}</p>
                <p className="text-sm">{selectedAddress.mobile} | {selectedAddress.email}</p>
              </div>
            </div>
          ) : (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-red-800 font-medium">⚠️ Delivery Address Required</span>
                  <span className="text-red-600 text-sm">You must add a delivery address before proceeding to payment</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddressForm(true)}
                  className="btn btn-primary btn-sm"
                >
                  Add Address Now
                </button>
              </div>
            </div>
          )}

          <div className="bg-white p-6 rounded-xl shadow-elegant space-y-6">
            <div className="space-y-4">
              <label className="flex items-center space-x-3">
                <input
                  type="radio"
                  value="ONLINE"
                  checked={paymentMethod === 'ONLINE'}
                  onChange={(e) => setPaymentMethod(e.target.value as 'ONLINE' | 'COD')}
                  className="form-radio text-primary-600"
                  disabled={isProcessing}
                />
                <span>Pay Online (Full Payment)</span>
              </label>
              <label className="flex items-center space-x-3">
                <input
                  type="radio"
                  value="COD"
                  checked={paymentMethod === 'COD'}
                  onChange={(e) => setPaymentMethod(e.target.value as 'ONLINE' | 'COD')}
                  className="form-radio text-primary-600"
                  disabled={isProcessing}
                />
                <span>Cash on Delivery (20% Advance Payment Required)</span>
              </label>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Subtotal</span>
                <span>₹{cartTotal.toFixed(2)}</span>
              </div>
              {paymentMethod === 'COD' && (
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Advance Payment (20%)</span>
                  <span>₹{(cartTotal * 0.2).toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between font-medium text-lg mt-4">
                <span>Total</span>
                <span>₹{cartTotal.toFixed(2)}</span>
              </div>
            </div>

            {error && (
              <p className="text-error-500 text-sm">{error}</p>
            )}

            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => setShowAddressForm(true)}
                className="btn btn-outline flex-1"
              >
                Back to Address
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!selectedAddress) {
                    setShowAddressForm(true);
                  } else {
                    setShowPaymentModal(true);
                  }
                }}
                className="btn btn-primary flex-1"
              >
                Proceed to Payment
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {selectedAddress && (
        <PaymentModal 
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          selectedAddress={selectedAddress}
        />
      )}
    </div>
  );
};

export default CheckoutForm;