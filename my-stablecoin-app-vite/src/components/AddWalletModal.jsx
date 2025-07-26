import React, { useState } from 'react';
import { X } from 'lucide-react';

const AddWalletModal = ({ isOpen, onClose, customers, onSaveWallet }) => {
  const [ownerId, setOwnerId] = useState('');
  const [currency, setCurrency] = useState('USDC');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!ownerId) {
      alert('Please select an owner for the new wallet.');
      return;
    }

    const selectedCustomer = customers.find(cust => cust.id === ownerId);
    if (!selectedCustomer) {
      alert('Selected customer not found.');
      return;
    }

    const newWallet = {
      id: `w${Date.now()}`, // Simple ID generation
      owner: selectedCustomer.name,
      address: `0x${Math.random().toString(16).slice(2, 11)}...${Math.random().toString(16).slice(2, 5)}`, // Mock address
      currency: currency,
      balance: '0.00',
      status: 'Active',
    };
    onSaveWallet(newWallet, selectedCustomer.id);
    onClose();
    setOwnerId('');
    setCurrency('USDC');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-bold text-gray-800">Add New Wallet</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300 rounded-md"
          >
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="walletOwner" className="block text-sm font-medium text-gray-700 mb-1">Wallet Owner</label>
            <select
              id="walletOwner"
              value={ownerId}
              onChange={(e) => setOwnerId(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 bg-white"
              required
            >
              <option value="">Select an owner</option>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.name} ({customer.email})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="newWalletCurrency" className="block text-sm font-medium text-gray-700 mb-1">Stablecoin Type</label>
            <select
              id="newWalletCurrency"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 bg-white"
            >
              <option value="USDC">USDC</option>
              <option value="USDT">USDT</option>
              <option value="DAI">DAI</option>
              <option value="BUSD">BUSD</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
          >
            Create Wallet
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddWalletModal;
