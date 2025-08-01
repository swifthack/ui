import React, { useState } from 'react';
import { X } from 'lucide-react';

const truncateAddress = (address) => {
  if (!address) return '';
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
};

const WithdrawModal = ({ isOpen, onClose, wallet, onWithdraw }) => {
  const [withdrawAmount, setWithdrawAmount] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const amount = parseFloat(withdrawAmount);
    const currentBalance = parseFloat(wallet.balance);

    if (amount <= 0 || isNaN(amount)) {
      alert('Please enter a valid withdrawal amount.');
      return;
    }
    if (amount > currentBalance) {
      alert('Insufficient balance for this withdrawal.');
      return;
    }
    onWithdraw(wallet.id, amount);
    onClose();
    setWithdrawAmount('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-bold text-gray-800">Withdraw from {wallet.name}</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300 rounded-md"
          >
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="text-sm text-gray-500 mb-4">
            <div className="flex justify-between">
              <span className="font-medium text-gray-700">From Address:</span>
              <span className="font-mono">{truncateAddress(wallet.owner_address)}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-700">To Address:</span>
              <span className="font-mono">{truncateAddress(wallet.wallet_address)}</span>
            </div>
          </div>
          <div>
            <label htmlFor="withdrawAmount" className="block text-sm font-medium text-gray-700 mb-1">Amount ({wallet.currency})</label>
            <input
              type="number"
              id="withdrawAmount"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              placeholder="0.00"
              step="0.01"
              min="0.01"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          <p className="text-sm text-gray-500">Current Balance: ${wallet.balance} {wallet.currency}</p>
          <button
            type="submit"
            className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
          >
            Confirm Withdrawal
          </button>
        </form>
      </div>
    </div>
  );
};

export default WithdrawModal;
