import React, { useState, useCallback } from 'react';
import { PlusCircle, Wallet, X, Eye, Pencil, Snowflake } from 'lucide-react';
import AddWalletModal from '../components/AddWalletModal.jsx';

const WalletsMaintenancePage = ({ customers, onAddCustomerWallet }) => {
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility

  // Fetch all wallets from server
  const [allWallets, setAllWallets] = useState([]);
  const [loadingWallets, setLoadingWallets] = useState(true);
  const [walletsError, setWalletsError] = useState(null);

  const fetchWallets = useCallback(async (reverse = false) => {
    setLoadingWallets(true);
    setWalletsError(null);
    try {
      const res = await fetch('/api/bankAdmin/custodialWallets', {
        headers: { 'accept': '*/*' }
      });
      if (!res.ok) throw new Error('Network response was not ok');
      const data = await res.json();
      const custodialWalletList = data.data || [];
      setAllWallets(reverse ? custodialWalletList.slice().reverse() : custodialWalletList); 

    } catch (err) {
      setWalletsError(err.message);
    } finally {
      setLoadingWallets(false);
    }
  }, []);

  React.useEffect(() => {
    fetchWallets();
  }, [fetchWallets]);

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

  // // Filtered wallets based on filters (support new JSON fields)
  // const filteredWallets = allWallets.filter((wallet) => {
  //   const id = (wallet.wallet_id || wallet.id || '').toLowerCase();
  //   const owner = (wallet.owner || '').toLowerCase();
  //   const address = (wallet.wallet_address || wallet.address || '').toLowerCase();
  //   const currency = (wallet.stablecoin_currency || wallet.currency || '').toLowerCase();
  //   const status = (wallet.status || '').toLowerCase();
  //   const balance = wallet.balance ? wallet.balance.toString().toLowerCase() : '';
  //   return (
  //     (filters.id === '' || id.includes(filters.id.toLowerCase())) &&
  //     (filters.owner === '' || owner.includes(filters.owner.toLowerCase())) &&
  //     (filters.address === '' || address.includes(filters.address.toLowerCase())) &&
  //     (filters.currency === '' || currency === filters.currency.toLowerCase()) &&
  //     (filters.status === '' || status === filters.status.toLowerCase()) &&
  //     (filters.balance === '' || balance.includes(filters.balance.toLowerCase()))
  //   );
  // });

  const handleSaveWallet = (newWallet, customerId) => {
    fetchWallets(true);
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
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tl-lg">Wallet ID</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Owner (Email)</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Coin Type</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created On</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
               
              </tr>
              {/* Filter row (update as needed for new columns) */}
              <tr>
                <th className="px-6 py-2"><input type="text" name="id" value={filters.id} onChange={handleFilterChange} placeholder="Search ID" className="w-full border border-gray-300 rounded px-2 py-1 text-xs" /></th>
                <th className="px-6 py-2"><input type="text" name="owner" value={filters.owner} onChange={handleFilterChange} placeholder="Search Owner" className="w-full border border-gray-300 rounded px-2 py-1 text-xs" /></th>
                <th className="px-6 py-2"><input type="text" name="address" value={filters.address} onChange={handleFilterChange} placeholder="Search Address" className="w-full border border-gray-300 rounded px-2 py-1 text-xs font-mono" /></th>
                <th className="px-6 py-2"><select name="currency" value={filters.currency} onChange={handleFilterChange} className="w-full border border-gray-300 rounded px-2 py-1 text-xs"><option value="">All</option><option value="USDC">USDC</option><option value="USDT">USDT</option><option value="DAI">DAI</option><option value="BUSD">BUSD</option></select></th>
                <th className="px-6 py-2"><select name="status" value={filters.status} onChange={handleFilterChange} className="w-full border border-gray-300 rounded px-2 py-1 text-xs"><option value="">All</option><option value="Active">Active</option><option value="Suspended">Suspended</option></select></th>
                <th className="px-6 py-2"><input type="text" name="created_by" placeholder="Created By" className="w-full border border-gray-300 rounded px-2 py-1 text-xs" disabled /></th>
                    <th></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {allWallets.map((wallet) => (
                <tr key={wallet.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{ wallet.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{wallet.username}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-mono">{wallet.wallet_address ? wallet.wallet_address.substring(0, 6) + '...' + wallet.wallet_address.slice(-3) : ''}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{wallet.coin_type}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                      ${wallet.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {wallet.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{wallet.txn_date}</td>
                  
                  
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-indigo-600 hover:text-indigo-900 mr-3" title="View">
                      <Eye size={18} />
                    </button>
                    <button className="text-yellow-600 hover:text-yellow-900 mr-3" title="Edit">
                      <Pencil size={18} />
                    </button>
                    <button className="text-red-600 hover:text-red-900" title="Freeze">
                      <Snowflake size={18} />
                    </button>
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

