import React, { useState } from 'react';
import { PlusCircle, Wallet, X } from 'lucide-react';
import AddWalletModal from '../components/AddWalletModal.jsx';

const WalletsMaintenancePage = ({ customers, onAddCustomerWallet }) => {
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility

  // Mock data for all wallets for admin view


  const [allWallets, setAllWallets] = useState([
    { id: 'w001', owner: 'Alice Smith', address: '0xabc...123', currency: 'USDC', balance: '10500.00', status: 'Active' },
    { id: 'w002', owner: 'Bob Johnson', address: '0xdef...456', currency: 'USDT', balance: '5200.50', status: 'Active' },
    { id: 'w003', owner: 'Charlie Brown', address: '0xghi...789', currency: 'DAI', balance: '2100.75', status: 'Active' },
    { id: 'w004', owner: 'David Lee', address: '0xjkl...012', currency: 'USDC', balance: '75.00', status: 'Active' },
    { id: 'w005', owner: 'Eve Davis', address: '0xmnp...345', currency: 'BUSD', balance: '100.00', status: 'Suspended' },
    { id: 'w006', owner: 'Frank White', address: '0xqrs...678', currency: 'USDC', balance: '200.00', status: 'Active' },
    { id: 'w007', owner: 'Grace Taylor', address: '0xtuv...901', currency: 'USDT', balance: '30.00', status: 'Active' },
    { id: 'w008', owner: 'Heidi Clark', address: '0xwxy...234', currency: 'DAI', balance: '90.00', status: 'Active' },
    { id: 'w009', owner: 'Ivan Miller', address: '0xzaq...567', currency: 'USDC', balance: '60.00', status: 'Active' },
    { id: 'w010', owner: 'Judy Wilson', address: '0xwsx...890', currency: 'BUSD', balance: '120.00', status: 'Active' },
  ]);

  // Filter states for each column
  const [filters, setFilters] = useState({
    id: '',
    owner: '',
    address: '',
    currency: '',
    balance: '',
    status: '',
  });

  // Handle filter input changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // Filtered wallets based on filters
  const filteredWallets = allWallets.filter((wallet) => {
    return (
      wallet.id.toLowerCase().includes(filters.id.toLowerCase()) &&
      wallet.owner.toLowerCase().includes(filters.owner.toLowerCase()) &&
      wallet.address.toLowerCase().includes(filters.address.toLowerCase()) &&
      (filters.currency === '' || wallet.currency === filters.currency) &&
      (filters.status === '' || wallet.status === filters.status) &&
      (filters.balance === '' || wallet.balance.includes(filters.balance))
    );
  });

  const handleSaveWallet = (newWallet, customerId) => {
    setAllWallets([newWallet, ...allWallets]); // Add new wallet to the top
    onAddCustomerWallet(customerId); // Notify App to update customer's wallet count
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-extrabold text-gray-800 mb-6">Wallet Maintenance</h2>

      <div className="flex justify-end mb-4">
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 flex items-center"
        >
          <PlusCircle size={20} className="mr-2" /> Add Wallet
        </button>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">All Stablecoin Wallets</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tl-lg">
                  Wallet ID
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Owner
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Address
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Currency
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Balance
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tr-lg">
                  Actions
                </th>
              </tr>
              {/* Filter row */}
              <tr>
                <th className="px-6 py-2">
                  <input
                    type="text"
                    name="id"
                    value={filters.id}
                    onChange={handleFilterChange}
                    placeholder="Search ID"
                    className="w-full border border-gray-300 rounded px-2 py-1 text-xs"
                  />
                </th>
                <th className="px-6 py-2">
                  <input
                    type="text"
                    name="owner"
                    value={filters.owner}
                    onChange={handleFilterChange}
                    placeholder="Search Owner"
                    className="w-full border border-gray-300 rounded px-2 py-1 text-xs"
                  />
                </th>
                <th className="px-6 py-2">
                  <input
                    type="text"
                    name="address"
                    value={filters.address}
                    onChange={handleFilterChange}
                    placeholder="Search Address"
                    className="w-full border border-gray-300 rounded px-2 py-1 text-xs font-mono"
                  />
                </th>
                <th className="px-6 py-2">
                  <select
                    name="currency"
                    value={filters.currency}
                    onChange={handleFilterChange}
                    className="w-full border border-gray-300 rounded px-2 py-1 text-xs"
                  >
                    <option value="">All</option>
                    <option value="USDC">USDC</option>
                    <option value="USDT">USDT</option>
                    <option value="DAI">DAI</option>
                    <option value="BUSD">BUSD</option>
                  </select>
                </th>
                <th className="px-6 py-2">
                  <input
                    type="text"
                    name="balance"
                    value={filters.balance}
                    onChange={handleFilterChange}
                    placeholder="Search Balance"
                    className="w-full border border-gray-300 rounded px-2 py-1 text-xs"
                  />
                </th>
                <th className="px-6 py-2">
                  <select
                    name="status"
                    value={filters.status}
                    onChange={handleFilterChange}
                    className="w-full border border-gray-300 rounded px-2 py-1 text-xs"
                  >
                    <option value="">All</option>
                    <option value="Active">Active</option>
                    <option value="Suspended">Suspended</option>
                  </select>
                </th>
                <th></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredWallets.map((wallet) => (
                <tr key={wallet.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{wallet.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{wallet.owner}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-mono">{wallet.address.substring(0, 6)}...{wallet.address.slice(-3)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{wallet.currency}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">${parseFloat(wallet.balance).toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                      ${wallet.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {wallet.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-indigo-600 hover:text-indigo-900 mr-3">View</button>
                    <button className="text-yellow-600 hover:text-yellow-900 mr-3">Edit</button>
                    <button className="text-red-600 hover:text-red-900">Freeze</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Wallet Modal */}
      <AddWalletModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        customers={customers}
        onSaveWallet={handleSaveWallet}
      />
    </div>
  );
};

export default WalletsMaintenancePage;
