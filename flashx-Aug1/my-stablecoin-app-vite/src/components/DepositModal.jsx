import React, { useState } from 'react';
import { X } from 'lucide-react';

const truncateAddress = (address) => {
  if (!address) return '';
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
};

const DepositModal = ({ isOpen, onClose, wallet, onSuccess }) => {
  const [depositAmount, setDepositAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleClose = () => {
    setError(null);
    setDepositAmount('');
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    const amount = parseFloat(depositAmount);
    if (amount <= 0 || isNaN(amount)) {
      setError('Please enter a valid deposit amount.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/dex/transferFrom', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'accept': '*/*' },
        body: JSON.stringify({
          user_name: wallet.username,
          fromAddress: wallet.owner_address,
          toAddress: wallet.wallet_address,
          amount: amount,
          tnxType: 'deposit'
        })
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Deposit failed:'+errorData.error || 'Unknown error');
      }
      onSuccess();
      setDepositAmount('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-bold text-gray-800">Deposit to {wallet.name}</h3>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300 rounded-md"
          >
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
              <strong className="font-bold">Error:</strong>
              <span className="block sm:inline"> {error}</span>
            </div>
          )}
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
            <label htmlFor="depositAmount" className="block text-sm font-medium text-gray-700 mb-1">Amount ({wallet.coin_type})</label>
            <input
              type="number"
              id="depositAmount"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              placeholder="0.00"
              step="0.01"
              min="0.01"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
            disabled={loading}
          >
            {loading ? 'Depositing...' : 'Confirm Deposit'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default DepositModal;
