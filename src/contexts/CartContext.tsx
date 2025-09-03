import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../types/supabase';

type Item = Database['public']['Tables']['items']['Row'];

type CartItem = {
  id: string;
  itemId: string;
  quantity: number;
  width?: number;
  height?: number;
  notes?: string;
  item: Item;
};

type CartContextType = {
  cartItems: CartItem[];
  cartTotal: number;
  addToCart: (itemId: string, quantity?: number, width?: number, height?: number, notes?: string) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  isLoading: boolean;
};

const CartContext = createContext<CartContextType>({
  cartItems: [],
  cartTotal: 0,
  addToCart: async () => {},
  removeFromCart: async () => {},
  updateQuantity: async () => {},
  clearCart: async () => {},
  isLoading: false,
});

export const useCart = () => useContext(CartContext);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCart = async () => {
      setIsLoading(true);
      try {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
          const parsedCart = JSON.parse(savedCart);
          const updatedCart = await Promise.all(
            parsedCart.map(async (parsedItem: CartItem) => {
              const { data: item } = await supabase
                .from('items')
                .select('*')
                .eq('id', parsedItem.itemId)
                .single();
              return {
                ...parsedItem,
                item: item!
              };
            })
          );
          setCartItems(updatedCart);
          calculateTotal(updatedCart);
        }
      } catch (error) {
        console.error('Error loading cart:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadCart();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('cart', JSON.stringify(cartItems));
    }
  }, [cartItems, isLoading]);

  const calculateTotal = (items: CartItem[]) => {
    const total = items.reduce((sum, item) => {
      const area = item.width && item.height ? (item.width * item.height) / 929.03 : 0;
      return sum + (area * item.item.price_per_sqft * item.quantity);
    }, 0);
    setCartTotal(total);
  };

  const addToCart = async (
    itemId: string,
    quantity: number = 1,
    width?: number,
    height?: number,
    notes?: string
  ) => {
    try {
      const { data: item } = await supabase
        .from('items')
        .select('*')
        .eq('id', itemId)
        .single();

      if (!item) throw new Error('Item not found');

      const existingItem = cartItems.find(cartItem => cartItem.itemId === itemId);
      
      if (existingItem) {
        const updatedItems = cartItems.map(cartItem =>
          cartItem.itemId === itemId
            ? { ...cartItem, quantity: cartItem.quantity + quantity, width, height, notes }
            : cartItem
        );
        setCartItems(updatedItems);
        calculateTotal(updatedItems);
      } else {
        const newItem: CartItem = {
          id: crypto.randomUUID(),
          itemId,
          quantity,
          width,
          height,
          notes,
          item
        };
        const updatedItems = [...cartItems, newItem];
        setCartItems(updatedItems);
        calculateTotal(updatedItems);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  };

  const removeFromCart = async (itemId: string) => {
    const updatedItems = cartItems.filter(item => item.id !== itemId);
    setCartItems(updatedItems);
    calculateTotal(updatedItems);
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    const updatedItems = cartItems.map(item =>
      item.id === itemId ? { ...item, quantity } : item
    );
    setCartItems(updatedItems);
    calculateTotal(updatedItems);
  };

  const clearCart = async () => {
    setCartItems([]);
    setCartTotal(0);
    localStorage.removeItem('cart');
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      cartTotal,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      isLoading,
    }}>
      {children}
    </CartContext.Provider>
  );
};