import React, { useState, useEffect } from 'react';
import CustomAlert from '../components/CustomAlert';
import { Wallet, PlusCircle, MinusCircle } from 'lucide-react';
import DepositModal from '../components/DepositModal.jsx';
import WithdrawModal from '../components/WithdrawModal.jsx';

const WalletsPage = ({ selectedCustomerId,navigateToTransactionsForWallet }) => { // Receive new prop
  // Wallets state from API
  const [wallets, setWallets] = useState([]);
  const [loadingWallets, setLoadingWallets] = useState(true);
  const [walletsError, setWalletsError] = useState(null);
  
  React.useEffect(() => {
    const fetchWallets = async () => {
      setLoadingWallets(true);
      setWalletsError(null);
      console.log("Fetching wallets from API...for user ,",selectedCustomerId);
      try {

        const url = `/api/customers/getCustodialWallet?username=${selectedCustomerId}`;
        const res = await fetch(url, {
          headers: { 'accept': '*/*' }
        });

        if (!res.ok) throw new Error('Network response was not ok');
        const data = await res.json();
        const custodialWalletList = data.data || [];
        console.log("Fetched wallets:", data.data, custodialWalletList);
        setWallets(custodialWalletList); 

      } catch (err) {
        setWalletsError(err.message);
      } finally {
        setLoadingWallets(false);
      }
    };
      fetchWallets();
  }, []);

  // Accordion state
  const [accordionOpen, setAccordionOpen] = useState({
    create: false,
    list: true,
  });
  const [depositInputs, setDepositInputs] = useState({});
  const [approveInputs, setApproveInputs] = useState({});
  const [transferInputs, setTransferInputs] = useState({});
  // New wallet creation loading state
  const [createWalletLoading, setCreateWalletLoading] = useState(false);
  // Loading and alert state for deposit
  const [depositLoading, setDepositLoading] = useState({}); // { [walletId]: boolean }
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertType, setAlertType] = useState('success');
  const [alertMessage, setAlertMessage] = useState('');
  // Custodial wallet loading state per wallet
  const [custodialLoading, setCustodialLoading] = useState({});
  // Create Custodial Wallet handler
  

  // Inline deposit handler
  const handleDeposit = async (walletId, currency) => {
    const amount = depositInputs[walletId];
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) return;
    const wallet = wallets.find(w => w.wallet_id === walletId);
    if (!wallet) return;
    // Use first wallet's owner as user_name (as in create wallet)
    const userName = wallets.length && wallets[0].owner ? wallets[0].owner : undefined;
    if (!userName) {
      setAlertType('error');
      setAlertMessage('No user_name found in wallet list.');
      setAlertOpen(true);
      return;
    }
    setDepositLoading(l => ({ ...l, [walletId]: true }));
    setAlertOpen(false);
    try {
      const res = await fetch('/api/mint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'accept': '*/*' },
        body: JSON.stringify({
          user_name: userName,
          toAddress: wallet.wallet_address,
          amount: amount,
          coinType: wallet.stablecoin_currency
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Mint failed');
      // Fetch updated balance from /api/<wallet_address>/balance
      let newBalance = null;
      try {
        const balRes = await fetch(`/api/${wallet.wallet_address}/balance`, { headers: { 'accept': '*/*' } });
        if (balRes.ok) {
          const balData = await balRes.json();
          newBalance = balData.balance;
        }
      } catch {}
      setWallets(wallets.map(w =>
        w.wallet_id === walletId
          ? { ...w, balance: newBalance !== null ? newBalance : (parseFloat(w.balance) + parseFloat(amount)).toFixed(2) }
          : w
      ));
      setDepositInputs({ ...depositInputs, [walletId]: '' });
      setAlertType('success');
      setAlertMessage(
        data.txHash
          ? <span>Deposit successful! TxHash: <span className="break-all">{data.txHash}</span></span>
          : `Successfully deposited ${amount} ${currency}`
      );
      setAlertOpen(true);
    } catch (err) {
      setAlertType('error');
      setAlertMessage('Deposit failed: ' + (err.message || 'Unknown error'));
      setAlertOpen(true);
    } finally {
      setDepositLoading(l => ({ ...l, [walletId]: false }));
    }
  };

  // Inline approve allowance handler
  // Inline approve allowance handler (API call)
  const handleApprove = async (walletId, currency) => {
    const amount = approveInputs[walletId];
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) return;
    const wallet = wallets.find(w => w.wallet_id === walletId);
    if (!wallet) return;
    // Use first wallet's owner as user_name
    const userName = wallets.length && wallets[0].owner ? wallets[0].owner : undefined;
    if (!userName) {
      setAlertType('error');
      setAlertMessage('No user_name found in wallet list.');
      setAlertOpen(true);
      return;
    }
    setAlertOpen(false);
    try {
      const res = await fetch('/api/wallet/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'accept': '*/*' },
        body: JSON.stringify({
          user_name: userName,
          amount: amount,
          ownerPrivateKey: wallet.wallet_address
        })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Approve failed');
      setAlertType('success');
      setAlertMessage(
        data.txHash
          ? <span>Approve successful! TxHash: <span className="break-all">{data.txHash}</span></span>
          : data.message || `Approved allowance of ${amount} ${currency}`
      );
    } catch (err) {
      setAlertType('error');
      setAlertMessage('Approve failed: ' + (err.message || 'Unknown error'));
    } finally {
      setAlertOpen(true);
      setApproveInputs({ ...approveInputs, [walletId]: '' });
    }
  };

  // Inline transfer handler
  const handleTransfer = (walletId, currency) => {
    const { address = '', amount = '' } = transferInputs[walletId] || {};
    const amt = parseFloat(amount);
    if (!address || !amt || amt <= 0) return;
    setWallets(wallets.map(wallet =>
      wallet.wallet_id === walletId
        ? { ...wallet, balance: (parseFloat(wallet.balance) - amt).toFixed(2) }
        : wallet
    ));
    setTransferInputs({ ...transferInputs, [walletId]: { address: '', amount: '' } });
    alert(`Transferred ${amt} ${currency} to ${address}`);
  };

  // Create new wallet handler (button, uses first wallet's owner as user_name)
  const handleCreateWallet = async () => {
    if (!wallets.length || !wallets[0].owner) {
      setAlertType('error');
      setAlertMessage('No owner found in wallet list.');
      setAlertOpen(true);
      return;
    }
    setCreateWalletLoading(true);
    setAlertOpen(false);
    try {
      const res = await fetch('/api/wallet/createOwnerAddress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'accept': '*/*' },
        body: JSON.stringify({ user_name: wallets[0].owner }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Failed to create wallet');
      setAlertType('success');
      setAlertMessage(data.message || 'Wallet created successfully!');
      setAlertOpen(true);
      // Refresh wallets
      setLoading(true);
      fetch('/api/wallet', { headers: { 'accept': '*/*' } })
        .then(res => res.json())
        .then(data => {
          setWallets(Array.isArray(data) ? data : []);
          setError(null);
        })
        .catch(err => setError('Failed to load wallets'))
        .finally(() => setLoading(false));
    } catch (err) {
      setAlertType('error');
      setAlertMessage('Create wallet failed: ' + (err.message || 'Unknown error'));
      setAlertOpen(true);
    } finally {
      setCreateWalletLoading(false);
    }
  };

  return (

    
    <div className="p-6">
      <h2 className="text-3xl font-extrabold text-gray-800 mb-6">Your Wallets</h2>


      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {wallets.map((wallet) => (
          <div
            key={wallet.id}
            className="bg-white p-6 rounded-xl shadow-md border border-gray-200 flex flex-col justify-between cursor-pointer hover:shadow-lg transition-shadow duration-200"
            onClick={() => navigateToTransactionsForWallet(wallet.username)} // Navigate to transactions on card click
          >
            <div>
              <div className="flex items-center mb-3">
                <Wallet size={24} className={`mr-3 ${wallet.iconColor}`} />
                <h3 className="text-xl font-semibold text-gray-700">{wallet.username}</h3>
              </div>
              {/* Reduced font size for the balance amount */}
              <p className="text-3xl font-bold text-indigo-700 mb-4">
                ${wallet.balance} <span className="text-lg text-gray-500">{wallet.coin_type}</span> {/* Reduced currency font size */}
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

      {/* Custom Alert for deposit result */}
      <CustomAlert
        open={alertOpen}
        onClose={() => setAlertOpen(false)}
        type={alertType}
        message={alertMessage}
      />
      {/* Modals removed, all actions are inline */}
    </div>
  );
};

export default WalletsPage;
