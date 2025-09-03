import React from 'react';
import TransactionHistory from '../components/TransactionHistory';
import AuthRequired from '../components/AuthRequired';

const TransactionHistoryPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          <TransactionHistory />
        </div>
      </div>
    </div>
  );
};

export default TransactionHistoryPage;
