import React, { useState, useEffect } from 'react';
import CustomAlert from '../components/CustomAlert';
import { Wallet, PlusCircle, MinusCircle } from 'lucide-react';
import DepositModal from '../components/DepositModal.jsx';
import WithdrawModal from '../components/WithdrawModal.jsx';

const WalletsPage = ({ selectedCustomerId, navigateToTransactionsForWallet }) => {
  const [wallets, setWallets] = useState([]);
  const [loadingWallets, setLoadingWallets] = useState(true);
  const [walletsError, setWalletsError] = useState(null);
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState(null);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertType, setAlertType] = useState('success');
  const [alertMessage, setAlertMessage] = useState('');

  const fetchWallets = async () => {
    setLoadingWallets(true);
    setWalletsError(null);
    try {
      const url = `/api/customers/getCustodialWallet?username=${selectedCustomerId}`;
      const res = await fetch(url, { headers: { 'accept': '*/*' } });
      if (!res.ok) throw new Error('Network response was not ok');
      const data = await res.json();
      setWallets(data.data || []);
    } catch (err) {
      setWalletsError(err.message);
    } finally {
      setLoadingWallets(false);
    }
  };

  useEffect(() => {
    fetchWallets();
  }, [selectedCustomerId]);

  const handleDepositClick = (wallet) => {
    setSelectedWallet(wallet);
    setIsDepositModalOpen(true);
  };

  const handleWithdrawClick = (wallet) => {
    setSelectedWallet(wallet);
    setIsWithdrawModalOpen(true);
  };

  const handleCloseModals = () => {
    setIsDepositModalOpen(false);
    setIsWithdrawModalOpen(false);
    setSelectedWallet(null);
  };

  const handleDepositSuccess = () => {
    handleCloseModals();
    fetchWallets(); // Re-fetch wallets to update the balance
    setAlertType('success');
    setAlertMessage('Deposit successful!');
    setAlertOpen(true);
  };

  const handleWithdraw = async (walletId, amount) => {
    // Implement withdrawal logic here
    console.log(`Withdrawing ${amount} from wallet ${walletId}`);
    handleCloseModals();
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-extrabold text-gray-800 mb-6">Your Wallets</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {wallets.map((wallet) => (
          <div
            key={wallet.id}
            className="bg-white p-6 rounded-xl shadow-md border border-gray-200 flex flex-col justify-between cursor-pointer hover:shadow-lg transition-shadow duration-200"
            onClick={() => navigateToTransactionsForWallet(wallet.username)}
          >
            <div>
              <div className="flex items-center mb-3">
                <Wallet size={24} className={`mr-3 ${wallet.iconColor || 'text-indigo-500'}`} />
                <h3 className="text-xl font-semibold text-gray-700">{wallet.username}</h3>
              </div>
              <p className="text-3xl font-bold text-indigo-700 mb-4">
                ${wallet.balance} <span className="text-lg text-gray-500">{wallet.coin_type}</span>
              </p>
            </div>
            <div className="flex flex-col flex-wrap space-y-3 mt-4 sm:flex-row sm:space-x-3 sm:space-y-0">
              <button
                onClick={(e) => { e.stopPropagation(); handleDepositClick(wallet); }}
                className="bg-green-500 text-white py-1 px-2 rounded-lg hover:bg-green-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 flex items-center justify-center text-xs sm:text-sm"
              >
                <PlusCircle size={14} className="mr-1" /> Deposit
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); handleWithdrawClick(wallet); }}
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

      <CustomAlert
        open={alertOpen}
        onClose={() => setAlertOpen(false)}
        type={alertType}
        message={alertMessage}
      />

      {selectedWallet && (
        <>
          <DepositModal
            isOpen={isDepositModalOpen}
            onClose={handleCloseModals}
            wallet={selectedWallet}
            onSuccess={handleDepositSuccess}
          />
          <WithdrawModal
            isOpen={isWithdrawModalOpen}
            onClose={handleCloseModals}
            wallet={selectedWallet}
            onWithdraw={handleWithdraw}
          />
        </>
      )}
    </div>
  );
};

export default WalletsPage;
