import React, { createContext, useContext, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useCart } from './CartContext';
import { useAuth } from './AuthContext';

interface Address {
  id: string;
  name: string;
  mobile: string;
  email: string;
  state: string;
  district: string;
  address: string;
  pincode: string;
  is_default: boolean;
}

interface CheckoutContextType {
  addresses: Address[];
  selectedAddress: Address | null;
  orderCompletionStatus: 'idle' | 'processing' | 'success' | 'failed';
  loadAddresses: () => Promise<void>;
  addAddress: (address: Omit<Address, 'id' | 'is_default'>) => Promise<void>;
  selectAddress: (address: Address) => void;
  createOrder: (paymentMethod: 'COD' | 'ONLINE', totalAmount: number, paymentDetails?: any) => Promise<any>;
  resetOrderStatus: () => void;
}

const CheckoutContext = createContext<CheckoutContextType>({
  addresses: [],
  selectedAddress: null,
  orderCompletionStatus: 'idle',
  loadAddresses: async () => {},
  addAddress: async () => {},
  selectAddress: () => {},
  createOrder: async () => {},
  resetOrderStatus: () => {},
});

export const useCheckout = () => useContext(CheckoutContext);

export const CheckoutProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [orderCompletionStatus, setOrderCompletionStatus] = useState<'idle' | 'processing' | 'success' | 'failed'>('idle');
  const { clearCart, cartItems } = useCart();
  const { user } = useAuth();

  const loadAddresses = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('addresses')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAddresses(data || []);
    } catch (error) {
      console.error('Error loading addresses:', error);
    }
  };

  const addAddress = async (address: Omit<Address, 'id' | 'is_default'>) => {
    if (!user) throw new Error('User not authenticated');
    
    try {
      const { data, error } = await supabase
        .from('addresses')
        .insert({
          user_id: user.id,
          ...address,
          is_default: addresses.length === 0
        })
        .select()
        .single();

      if (error) throw error;
      
      const newAddress = data as Address;
      setAddresses([newAddress, ...addresses]);
      setSelectedAddress(newAddress);
    } catch (error) {
      console.error('Error adding address:', error);
      throw error;
    }
  };

  const selectAddress = (address: Address) => {
    setSelectedAddress(address);
  };

  const resetOrderStatus = () => {
    setOrderCompletionStatus('idle');
  };

  const createOrder = async (paymentMethod: 'COD' | 'ONLINE', totalAmount: number, paymentDetails?: any) => {
    if (!user || !selectedAddress) {
      throw new Error('User not authenticated or no address selected');
    }

    try {
      setOrderCompletionStatus('processing');

      // Create order in database
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          address_id: selectedAddress.id,
          total_amount: totalAmount,
          payment_method: paymentMethod,
          payment_status: paymentMethod === 'COD' ? 'partially_paid' : 'paid',
          order_status: 'confirmed',
          razorpay_payment_id: paymentDetails?.razorpay_payment_id,
          razorpay_order_id: paymentDetails?.razorpay_order_id,
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = cartItems.map(item => ({
        order_id: orderData.id,
        item_id: item.itemId,
        quantity: item.quantity,
        width: item.width,
        height: item.height,
        price_per_sqft: item.item.price_per_sqft,
        total_price: item.width && item.height 
          ? (item.width * item.height / 929.03) * item.item.price_per_sqft * item.quantity
          : 0,
        notes: item.notes,
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Clear cart after successful order creation
      await clearCart();
      
      setOrderCompletionStatus('success');
      console.log('Order created successfully:', orderData.id);
      
      // Return order data for payment verification
      return orderData;
    } catch (error) {
      console.error('Error creating order:', error);
      setOrderCompletionStatus('failed');
      throw error;
    }
  };

  return (
    <CheckoutContext.Provider value={{
      addresses,
      selectedAddress,
      orderCompletionStatus,
      loadAddresses,
      addAddress,
      selectAddress,
      createOrder,
      resetOrderStatus,
    }}>
      {children}
    </CheckoutContext.Provider>
  );
};