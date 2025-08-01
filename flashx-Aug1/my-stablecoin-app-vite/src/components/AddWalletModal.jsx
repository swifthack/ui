import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

// fetchCustomers utility (copy from CustomerManagementPage)
const fetchCustomers = async () => {
  try {
    const res = await fetch('/api/bankAdmin/customers', {
      headers: { 'accept': '*/*' }
    });
    if (!res.ok) throw new Error('Network response was not ok');
    const data = await res.json();
    return data.data || [];
  } catch {
    return [];
  }
};

const AddWalletModal = ({ isOpen, onClose, onSaveWallet }) => {
  const [ownerId, setOwnerId] = useState('');
  const [currency, setCurrency] = useState('USDC');
  const [customers, setCustomers] = useState([]);

  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchCustomers().then(setCustomers);
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!ownerId) {
      alert('Please select an owner for the new wallet.');
      return;
    }

    const selectedCustomer = customers.find(cust => cust.id === ownerId || cust.CUST_ID === ownerId);
    if (!selectedCustomer) {
      alert('Selected customer not found.');
      return;
    }

    // Prepare wallet data for API
    const walletData = {
      walletId: `w${Date.now()}`,
      owner: selectedCustomer.email,
      walletAddress: `0x${Math.random().toString(16).slice(2, 11)}${Math.random().toString(16).slice(2, 5)}`,
      stablecoinCurrency: currency,
      balance: '0.00',
      status: 'Active',
      createdBy: 'admin',
      approvers: [
        '0xA1B2C3D4E5F6G7H8I9J0K1L2M3N4O5P6Q7R8S9T0',
        '0xZ9Y8X7W6V5U4T3S2R1Q0P9O8N7M6L5K4J3I2H1G0'
      ],
      approvalRequired: 2,
    };

    setIsCreating(true);
    try {
      // 1. Get address/privateKey for the selected customer
      const email = selectedCustomer.email;
      let response = await fetch(`/api/bankAdmin/getOwnerAddress?username=${encodeURIComponent(email)}`, {
        headers: { 'accept': '*/*', 'Content-Type': 'application/json' }
      });
      console.log(response.ok, "Response status:", response.status);
      if(response.status==200){
        const data = await response.json();
        console.log("Fetched data:", data.address, data.privateKey);
        if (!data.address || !data.privateKey) {
          alert('Owner address or private key not found for this user.');
          setIsCreating(false);
          return; 
        }
        const ownerAddress = data.address;
        const privateKey = data.privateKey;

         // 2. Create custodial wallet with the fetched address and required fields
        const createRes = await fetch('/api/bankAdmin/createCustodialWallet', {
        method: 'POST',
        headers: {
          'accept': '*/*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_name: email,
          ownerAddress: ownerAddress,
          coinType: currency,
          vaspUser: 'admin',
        }),
      });
      if (!createRes.ok) {
        const error = await createRes.json().catch(() => ({}));
        alert(error.message || 'Failed to create custodial wallet');
        setIsCreating(false);
        return;
      }
      }else{
        alert('Failed to fetch owner address. Please try again.');
        setIsCreating(false);
        return;
      }
           

     
      // Optionally handle response
      onSaveWallet(walletData, ownerId);
      onClose();
      setOwnerId('');
      setCurrency('USDC');
    } catch (err) {
      alert('Network error: ' + err.message);
    } finally {
      setIsCreating(false);
    }
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
            <label htmlFor="walletOwner" className="block text-sm font-medium text-gray-700 mb-1">Wallet Owner (Email)</label>
            <select
              id="walletOwner"
              value={ownerId}
              onChange={(e) => setOwnerId(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 bg-white"
              required
            >
              <option value="">Select an owner</option>
              {customers.map((customer) => (
                <option key={customer.CUST_ID || customer.id} value={customer.CUST_ID || customer.id}>
                  {customer.email}
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
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 flex items-center justify-center"
            disabled={isCreating}
          >
            {isCreating ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating...
              </>
            ) : (
              'Create Wallet'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddWalletModal;
