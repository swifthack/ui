import React, { useState } from 'react';
import { Wallet, PlusCircle, MinusCircle } from 'lucide-react';
import DepositModal from '../components/DepositModal.jsx';
import WithdrawModal from '../components/WithdrawModal.jsx';

const WalletsPage = ({ navigateToTransactionsForWallet }) => { // Receive new prop
  // Mock data for stablecoin wallets
  const [wallets, setWallets] = useState([
    { id: 'usdc', name: 'USDC Wallet', balance: '10,500.00', currency: 'USDC', iconColor: 'text-blue-500' },
    { id: 'usdt', name: 'USDT Wallet', balance: '5,200.50', currency: 'USDT', iconColor: 'text-green-500' },
    { id: 'dai', name: 'DAI Wallet', balance: '2,100.75', currency: 'DAI', iconColor: 'text-yellow-500' },
    { id: 'busd', name: 'BUSD Wallet', balance: '7,800.00', currency: 'BUSD', iconColor: 'text-purple-500' },
  ]);

  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false); // New state for withdraw modal
  const [selectedWallet, setSelectedWallet] = useState(null);

  const handleDepositClick = (wallet) => {
    setSelectedWallet(wallet);
    setIsDepositModalOpen(true);
  };

  const handleWithdrawClick = (wallet) => { // New handler for withdraw
    setSelectedWallet(wallet);
    setIsWithdrawModalOpen(true);
  };

  const handleDeposit = (walletId, amount) => {
    setWallets(wallets.map(wallet =>
      wallet.id === walletId
        ? { ...wallet, balance: (parseFloat(wallet.balance) + amount).toFixed(2) }
        : wallet
    ));
    alert(`Successfully deposited ${amount} ${wallets.find(w => w.id === walletId).currency} to ${wallets.find(w => w.id === walletId).name}.`);
  };

  const handleWithdraw = (walletId, amount) => { // New handler for withdraw
    setWallets(wallets.map(wallet =>
      wallet.id === walletId
        ? { ...wallet, balance: (parseFloat(wallet.balance) - amount).toFixed(2) }
        : wallet
    ));
    alert(`Successfully withdrew ${amount} ${wallets.find(w => w.id === walletId).currency} from ${wallets.find(w => w.id === walletId).name}.`);
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-extrabold text-gray-800 mb-6">Your Wallets</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {wallets.map((wallet) => (
          <div
            key={wallet.id}
            className="bg-white p-6 rounded-xl shadow-md border border-gray-200 flex flex-col justify-between cursor-pointer hover:shadow-lg transition-shadow duration-200"
            onClick={() => navigateToTransactionsForWallet(wallet.currency)} // Navigate to transactions on card click
          >
            <div>
              <div className="flex items-center mb-3">
                <Wallet size={24} className={`mr-3 ${wallet.iconColor}`} />
                <h3 className="text-xl font-semibold text-gray-700">{wallet.name}</h3>
              </div>
              {/* Reduced font size for the balance amount */}
              <p className="text-3xl font-bold text-indigo-700 mb-4">
                ${wallet.balance} <span className="text-lg text-gray-500">{wallet.currency}</span> {/* Reduced currency font size */}
              </p>
            </div>
            {/* Adjusted button layout for responsiveness: removed flex-1 to reduce width */}
            <div className="flex flex-col flex-wrap space-y-3 mt-4 sm:flex-row sm:space-x-3 sm:space-y-0">
              <button
                onClick={(e) => { e.stopPropagation(); handleDepositClick(wallet); }} // Stop propagation to prevent card click
                className="bg-green-500 text-white py-1 px-2 rounded-lg hover:bg-green-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 flex items-center justify-center text-xs sm:text-sm"
              >
                <PlusCircle size={14} className="mr-1" /> Deposit
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); handleWithdrawClick(wallet); }} // Stop propagation and attach withdraw handler
                className="bg-red-500 text-white py-1 px-2 rounded-lg hover:bg-red-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 flex items-center justify-center text-xs sm:text-sm"
              >
                <MinusCircle size={14} className="mr-1" /> Withdraw
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 p-6 bg-white rounded-xl shadow-md border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">Wallet Management Tips</h3>
        <ul className="list-disc list-inside text-gray-600 space-y-2">
          <li>Always double-check the wallet address before initiating any transaction.</li>
          <li>Keep your private keys secure and never share them with anyone.</li>
          <li>Enable two-factor authentication (2FA) for added security.</li>
          <li>Monitor your transaction history regularly for any suspicious activity.</li>
        </ul>
      </div>

      {/* Deposit Modal */}
      {selectedWallet && (
        <DepositModal
          isOpen={isDepositModalOpen}
          onClose={() => setIsDepositModalOpen(false)}
          wallet={selectedWallet}
          onDeposit={handleDeposit}
        />
      )}

      {/* Withdraw Modal */}
      {selectedWallet && (
        <WithdrawModal
          isOpen={isWithdrawModalOpen}
          onClose={() => setIsWithdrawModalOpen(false)}
          wallet={selectedWallet}
          onWithdraw={handleWithdraw}
        />
      )}
    </div>
  );
};

export default WalletsPage;
