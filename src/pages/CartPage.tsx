import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useCheckout } from '../contexts/CheckoutContext';
import PaymentModal from '../components/PaymentModal';
import CheckoutForm from '../components/CheckoutForm';

const CartPage = () => {
  const { cartItems, cartTotal, removeFromCart, updateQuantity } = useCart();
  const { selectedAddress, addresses, loadAddresses } = useCheckout();
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);

  const handleQuantityChange = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    setIsUpdating(itemId);
    await updateQuantity(itemId, newQuantity);
    setIsUpdating(null);
  };

  const handleRemove = async (itemId: string) => {
    setIsUpdating(itemId);
    await removeFromCart(itemId);
    setIsUpdating(null);
  };

  // Load addresses when component mounts
  useEffect(() => {
    loadAddresses();
  }, [loadAddresses]);

  // Function to convert square centimeters to square feet
  const cmToSqFt = (width: number, height: number) => {
    const sqCm = width * height;
    return sqCm / 929.03; // 1 sq ft = 929.03 sq cm
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container-custom">
        <div className="flex items-center justify-between mb-8">
          <Link to="/services" className="inline-flex items-center text-primary-600 hover:text-primary-700">
            <ArrowLeft size={18} className="mr-2" />
            Continue Shopping
          </Link>
          <h1 className="text-2xl font-serif font-bold text-primary-800">Shopping Cart</h1>
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-elegant">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="space-y-4"
            >
              <ShoppingBag size={48} className="mx-auto text-gray-300" />
              <h2 className="text-xl font-serif font-semibold text-gray-800">Your cart is empty</h2>
              <p className="text-gray-600 mb-8">Browse our collection and add some items to your cart.</p>
              <Link to="/services" className="btn btn-primary">
                Browse Products
              </Link>
            </motion.div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-white rounded-xl shadow-elegant p-6"
                >
                  <div className="flex gap-4">
                    <img
                      src={item.item.images[0]}
                      alt={item.item.title}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                    <div className="flex-grow">
                      <h3 className="text-lg font-serif font-semibold">{item.item.title}</h3>
                      <p className="text-gray-600 text-sm mb-2">₹{item.item.price_per_sqft}/sqft</p>
                      
                      {item.width && item.height && (
                        <p className="text-sm text-gray-500">
                          Dimensions: {item.width}cm × {item.height}cm
                          <span className="ml-2 text-gray-400">
                            ({cmToSqFt(item.width, item.height).toFixed(2)} sq.ft)
                          </span>
                        </p>
                      )}

                      {item.notes && (
                        <p className="text-sm text-gray-500 mt-1">
                          Notes: {item.notes}
                        </p>
                      )}
                      
                      <div className="flex items-center mt-4">
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          className="p-1 rounded-full hover:bg-gray-100"
                          disabled={!!isUpdating}
                        >
                          <Minus size={16} />
                        </button>
                        <span className="mx-4">{item.quantity}</span>
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          className="p-1 rounded-full hover:bg-gray-100"
                          disabled={!!isUpdating}
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-col items-end justify-between">
                      <button
                        onClick={() => handleRemove(item.id)}
                        className="text-gray-400 hover:text-error-500 transition-colors"
                        disabled={!!isUpdating}
                      >
                        <Trash2 size={18} />
                      </button>
                      {item.width && item.height && (
                        <p className="font-medium text-lg">
                          ₹{(cmToSqFt(item.width, item.height) * item.item.price_per_sqft * item.quantity).toFixed(2)}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="bg-white rounded-xl shadow-elegant p-6 h-fit">
              <h3 className="text-xl font-serif font-semibold mb-6">Order Summary</h3>
              <div className="space-y-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Installation Charges</span>
                  <span>Free</span>
                </div>
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between font-medium text-lg">
                    <span>Total</span>
                    <span>₹{cartTotal.toFixed(2)}</span>
                  </div>
                </div>
                
                {!selectedAddress && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-yellow-800 text-sm">⚠️ Delivery address required</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowCheckoutForm(true)}
                        className="text-sm text-yellow-600 hover:text-yellow-800 underline"
                      >
                        Add Address
                      </button>
                    </div>
                  </div>
                )}
                
                <button 
                  className="btn btn-primary w-full mt-6"
                  onClick={() => {
                    if (!selectedAddress) {
                      setShowCheckoutForm(true);
                    } else {
                      setShowPaymentModal(true);
                    }
                  }}
                >
                  Proceed to Payment
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {showCheckoutForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-elegant max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <CheckoutForm 
              onClose={() => setShowCheckoutForm(false)}
              onAddressAdded={() => {
                setShowCheckoutForm(false);
                setShowPaymentModal(true);
              }}
            />
          </div>
        </div>
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

export default CartPage;