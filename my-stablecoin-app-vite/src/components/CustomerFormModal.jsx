import React, { useState } from 'react';
import { X } from 'lucide-react';

const CustomerFormModal = ({ isOpen, onClose, customerData, onSave }) => {
  const [name, setName] = useState(customerData?.name || '');
  const [email, setEmail] = useState(customerData?.email || '');
  const [organization, setOrganization] = useState(customerData?.organization || '');
  const [glei, setGlei] = useState(customerData?.glei || ''); // New state for GLEI
  const [status, setStatus] = useState(customerData?.status || 'Active');

  const handleSubmit = (e) => {
    e.preventDefault();
    const newCustomer = {
      id: customerData?.id || `cust${Date.now()}`, // Simple ID generation
      name,
      email,
      organization,
      glei, // Include GLEI in the new customer object
      status,
      wallets: customerData?.wallets || 0, // Preserve existing wallet count or set to 0
      lastLogin: customerData?.lastLogin || new Date().toISOString().slice(0, 10), // Current date for new, preserve for existing
    };
    onSave(newCustomer);
    onClose(); // Close modal after saving
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-bold text-gray-800">{customerData ? 'Edit Customer' : 'Add New Customer'}</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300 rounded-md"
          >
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="customerName" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              id="customerName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Customer Name"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          <div>
            <label htmlFor="customerEmail" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              id="customerEmail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="customer@example.com"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          <div>
            <label htmlFor="customerOrganization" className="block text-sm font-medium text-gray-700 mb-1">Organization</label>
            <input
              type="text"
              id="customerOrganization"
              value={organization}
              onChange={(e) => setOrganization(e.target.value)}
              placeholder="Organization Name"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="customerGlei" className="block text-sm font-medium text-gray-700 mb-1">GLEI</label>
            <input
              type="text"
              id="customerGlei"
              value={glei}
              onChange={(e) => setGlei(e.target.value)}
              placeholder="Global Legal Entity Identifier"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="customerStatus" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              id="customerStatus"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 bg-white"
            >
              <option value="Active">Active</option>
              <option value="Suspended">Suspended</option>
              <option value="Pending KYC">Pending KYC</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
          >
            {customerData ? 'Save Changes' : 'Add Customer'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CustomerFormModal;
