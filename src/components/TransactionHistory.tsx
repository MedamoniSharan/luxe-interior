import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, CreditCard, Wallet, CheckCircle, XCircle, Clock, DollarSign } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface Transaction {
  id: string;
  transaction_id: string;
  payment_method: string;
  amount: number;
  currency: string;
  status: string;
  created_at: string;
  gateway_response: any;
  order: {
    id: string;
    total_amount: number;
    order_status: string;
    items: Array<{
      item: {
        title: string;
        images: string[];
      };
      quantity: number;
      width?: number;
      height?: number;
    }>;
  };
}

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadTransactions();
    }
  }, [user]);

  const loadTransactions = async () => {
    try {
      setIsLoading(true);
      setError('');

      const { data, error: fetchError } = await supabase
        .from('transaction_history')
        .select(`
          *,
          order:orders(
            id,
            total_amount,
            order_status,
            items:order_items(
              quantity,
              width,
              height,
              item:items(
                title,
                images
              )
            )
          )
        `)
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      setTransactions(data || []);
    } catch (err) {
      console.error('Error loading transactions:', err);
      setError('Failed to load transaction history');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return <CheckCircle className="text-green-500" size={20} />;
      case 'pending':
        return <Clock className="text-yellow-500" size={20} />;
      case 'failed':
        return <XCircle className="text-red-500" size={20} />;
      default:
        return <Clock className="text-gray-500" size={20} />;
    }
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method.toLowerCase()) {
      case 'online':
        return <CreditCard className="text-blue-500" size={20} />;
      case 'cod':
        return <Wallet className="text-green-500" size={20} />;
      default:
        return <CreditCard className="text-gray-500" size={20} />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={loadTransactions}
          className="btn btn-primary"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="text-center py-12">
        <DollarSign className="mx-auto h-16 w-16 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions yet</h3>
        <p className="text-gray-500">Your transaction history will appear here once you make your first purchase.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 pb-4">
        <h2 className="text-2xl font-serif font-semibold text-gray-900">Transaction History</h2>
        <p className="text-gray-600 mt-1">View all your payment transactions and order details</p>
      </div>

      <div className="space-y-4">
        {transactions.map((transaction) => (
          <motion.div
            key={transaction.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                {getPaymentMethodIcon(transaction.payment_method)}
                <div>
                  <h3 className="font-medium text-gray-900">
                    Transaction #{transaction.transaction_id.slice(-8)}
                  </h3>
                  <p className="text-sm text-gray-500 capitalize">
                    {transaction.payment_method} Payment
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {getStatusIcon(transaction.status)}
                <span className={`text-sm font-medium capitalize px-2 py-1 rounded-full ${
                  transaction.status === 'completed' ? 'bg-green-100 text-green-800' :
                  transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {transaction.status}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="flex items-center space-x-2">
                <Calendar className="text-gray-400" size={16} />
                <span className="text-sm text-gray-600">
                  {formatDate(transaction.created_at)}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <DollarSign className="text-gray-400" size={16} />
                <span className="text-sm text-gray-600">
                  {formatAmount(transaction.amount)}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">
                  Order #{transaction.order.id.slice(-8)}
                </span>
              </div>
            </div>

            {transaction.order && (
              <div className="border-t border-gray-100 pt-4">
                <h4 className="font-medium text-gray-900 mb-2">Order Items</h4>
                <div className="space-y-2">
                  {transaction.order.items.map((item, index) => (
                    <div key={index} className="flex items-center space-x-3 text-sm">
                      {item.item.images && item.item.images.length > 0 && (
                        <img
                          src={item.item.images[0]}
                          alt={item.item.title}
                          className="w-8 h-8 rounded object-cover"
                        />
                      )}
                      <span className="text-gray-900">{item.item.title}</span>
                      <span className="text-gray-500">x{item.quantity}</span>
                      {item.width && item.height && (
                        <span className="text-gray-500">
                          ({item.width}" × {item.height}")
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {transaction.gateway_response && (
              <div className="border-t border-gray-100 pt-4 mt-4">
                <details className="group">
                  <summary className="cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900">
                    Payment Details
                  </summary>
                  <div className="mt-2 text-sm text-gray-600 space-y-1">
                    {Object.entries(transaction.gateway_response).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="capitalize">{key.replace(/_/g, ' ')}:</span>
                        <span className="font-mono">{String(value)}</span>
                      </div>
                    ))}
                  </div>
                </details>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default TransactionHistory;
