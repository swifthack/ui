import React, { useState, useEffect } from 'react';
import CustomAlert from '../components/CustomAlert';
import { Wallet, PlusCircle, MinusCircle } from 'lucide-react';
// import DepositModal from '../components/DepositModal.jsx';
// import WithdrawModal from '../components/WithdrawModal.jsx';

const WalletsPage = ({ navigateToTransactionsForWallet }) => { // Receive new prop
  // Wallets state from API
  const [wallets, setWallets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch('/api/wallet', { headers: { 'accept': '*/*' } })
      .then(res => res.json())
      .then(data => {
        setWallets(Array.isArray(data) ? data : []);
        setError(null);
      })
      .catch(err => setError('Failed to load wallets'))
      .finally(() => setLoading(false));
  }, []);

  // Accordion state
  const [accordionOpen, setAccordionOpen] = useState({
    create: false,
    list: true,
  });
  const [depositInputs, setDepositInputs] = useState({});
  const [approveInputs, setApproveInputs] = useState({});
  const [transferInputs, setTransferInputs] = useState({});
  // New wallet creation state
  const [newWalletAddress, setNewWalletAddress] = useState('');
  const [newWalletPrivateKey, setNewWalletPrivateKey] = useState('');
  const [createWalletLoading, setCreateWalletLoading] = useState(false);
  // Loading and alert state for deposit
  const [depositLoading, setDepositLoading] = useState({}); // { [walletId]: boolean }
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertType, setAlertType] = useState('success');
  const [alertMessage, setAlertMessage] = useState('');
  // Custodial wallet loading state per wallet
  const [custodialLoading, setCustodialLoading] = useState({});
  // Create Custodial Wallet handler
  const handleCreateCustodialWallet = async (walletId) => {
    const wallet = wallets.find(w => w.wallet_id === walletId);
    if (!wallet) return;
    setCustodialLoading(l => ({ ...l, [walletId]: true }));
    setAlertOpen(false);
    try {
      const res = await fetch('/api/createCustodialWallet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'accept': '*/*' },
        body: JSON.stringify({ ownerAddress: wallet.wallet_address })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Create custodial wallet failed');
      setAlertType('success');
      setAlertMessage(data.message || 'Custodial wallet created successfully!');
    } catch (err) {
      setAlertType('error');
      setAlertMessage('Create custodial wallet failed: ' + (err.message || 'Unknown error'));
    } finally {
      setAlertOpen(true);
      setCustodialLoading(l => ({ ...l, [walletId]: false }));
    }
  };

  // Inline deposit handler
  const handleDeposit = async (walletId, currency) => {
    const amount = parseFloat(depositInputs[walletId] || '');
    if (!amount || amount <= 0) return;
    const wallet = wallets.find(w => w.wallet_id === walletId);
    if (!wallet) return;
    setDepositLoading(l => ({ ...l, [walletId]: true }));
    setAlertOpen(false);
    try {
      const res = await fetch('/api/mint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'accept': '*/*' },
        body: JSON.stringify({ toAddress: wallet.wallet_address, amount }),
      });
      if (!res.ok) throw new Error('Mint failed');
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
          ? { ...w, balance: newBalance !== null ? newBalance : (parseFloat(w.balance) + amount).toFixed(2) }
          : w
      ));
      setDepositInputs({ ...depositInputs, [walletId]: '' });
      setAlertType('success');
      setAlertMessage(`Successfully deposited ${amount} ${currency}`);
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
    const amount = parseFloat(approveInputs[walletId] || '');
    if (!amount || amount <= 0) return;
    const wallet = wallets.find(w => w.wallet_id === walletId);
    if (!wallet) return;
    setAlertOpen(false);
    try {
      const res = await fetch('/api/wallet/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'accept': '*/*' },
        body: JSON.stringify({
          ownerWallet: wallet.wallet_address,
          amount,
          ownerPrivateKey: wallet.privateKey
        })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Approve failed');
      setAlertType('success');
      setAlertMessage(data.message || `Approved allowance of ${amount} ${currency}`);
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

  // Create new wallet handler
  const handleCreateWallet = async () => {
    if (!newWalletAddress || !newWalletPrivateKey) {
      setAlertType('error');
      setAlertMessage('Both address and private key are required.');
      setAlertOpen(true);
      return;
    }
    setCreateWalletLoading(true);
    setAlertOpen(false);
    try {
      const res = await fetch('/api/wallets/createOwnerAddress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'accept': '*/*' },
        body: JSON.stringify({ address: newWalletAddress, privateKey: newWalletPrivateKey }),
      });
      if (!res.ok) throw new Error('Failed to create wallet');
      setAlertType('success');
      setAlertMessage('Wallet created successfully!');
      setAlertOpen(true);
      setNewWalletAddress('');
      setNewWalletPrivateKey('');
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

      {/* Accordion: Create Wallet */}
      <div className="mb-4 bg-white rounded-xl shadow-md border border-gray-200 max-w-xl">
        <button
          className="w-full flex justify-between items-center px-6 py-4 text-lg font-semibold text-gray-700 focus:outline-none"
          onClick={() => setAccordionOpen(a => ({ ...a, create: !a.create }))}
        >
          <span>Create New Wallet</span>
          <span>{accordionOpen.create ? '▲' : '▼'}</span>
        </button>
        {accordionOpen.create && (
          <div className="px-6 pb-6 flex flex-col gap-3">
            <input
              type="text"
              maxLength={50}
              placeholder="Blockchain Address"
              value={newWalletAddress}
              onChange={e => setNewWalletAddress(e.target.value)}
              className="border p-2 rounded w-full text-sm"
            />
            <input
              type="text"
              maxLength={50}
              placeholder="Private Key"
              value={newWalletPrivateKey}
              onChange={e => setNewWalletPrivateKey(e.target.value)}
              className="border p-2 rounded w-full text-sm"
            />
            <button
              onClick={handleCreateWallet}
              className={`bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 text-base font-semibold ${createWalletLoading ? 'opacity-60 cursor-not-allowed' : ''}`}
              disabled={createWalletLoading}
            >
              {createWalletLoading ? 'Creating...' : 'Create Wallet'}
            </button>
          </div>
        )}
      </div>

      {/* Accordion: Wallet List */}
      <div className="mb-8 bg-white rounded-xl shadow-md border border-gray-200">
        <button
          className="w-full flex justify-between items-center px-6 py-4 text-lg font-semibold text-gray-700 focus:outline-none"
          onClick={() => setAccordionOpen(a => ({ ...a, list: !a.list }))}
        >
          <span>Wallet List</span>
          <span>{accordionOpen.list ? '▲' : '▼'}</span>
        </button>
        {accordionOpen.list && (
          <div className="px-6 pb-6">


            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {loading ? (
                <div className="col-span-full text-center text-gray-500">Loading wallets...</div>
              ) : error ? (
                <div className="col-span-full text-center text-red-500">{error}</div>
              ) : wallets.length === 0 ? (
                <div className="col-span-full text-center text-gray-500">No wallets found.</div>
              ) : (
                wallets.map((wallet) => (
                  <div
                    key={wallet.wallet_id}
                    className="bg-white p-6 rounded-xl shadow-md border border-gray-200 flex flex-col justify-between cursor-pointer hover:shadow-lg transition-shadow duration-200 min-w-[340px] w-full"
                    onClick={() => navigateToTransactionsForWallet(wallet.stablecoin_currency)}
                  >
                    <div>
                      <div className="flex items-center mb-3">
                        <Wallet size={24} className={`mr-3 text-blue-500`} />
                        <h3 className="text-xl font-semibold text-gray-700">{wallet.stablecoin_currency} Wallet</h3>
                      </div>
                      <p className="text-3xl font-bold text-indigo-700 mb-4">
                        ${wallet.balance} <span className="text-lg text-gray-500">{wallet.stablecoin_currency}</span>
                      </p>
                      <div className="text-xs text-gray-500 break-all">{wallet.wallet_address}</div>
                    </div>
                    {/* Linear wallet actions: Deposit -> Approve Allowance (if balance) -> Transfer */}
                    <div className="mt-4 flex flex-col gap-3">
                      {/* Deposit Section */}
                      <div className="bg-gray-50 p-4 rounded-lg border border-green-200 flex flex-col gap-2">
                        <div className="font-semibold text-gray-700 mb-2">Deposit</div>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          placeholder={`Amount (${wallet.stablecoin_currency})`}
                          value={depositInputs[wallet.wallet_id] || ''}
                          onChange={e => setDepositInputs({ ...depositInputs, [wallet.wallet_id]: e.target.value })}
                          className="border p-1 rounded w-full text-sm"
                        />
                        <button
                          onClick={e => { e.stopPropagation(); handleDeposit(wallet.wallet_id, wallet.stablecoin_currency); }}
                          className={`bg-green-500 text-white py-1 px-3 rounded hover:bg-green-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 text-sm w-full ${depositLoading[wallet.wallet_id] ? 'opacity-60 cursor-not-allowed' : ''}`}
                          disabled={depositLoading[wallet.wallet_id]}
                        >
                          {depositLoading[wallet.wallet_id] ? 'Processing...' : 'Deposit Funds'}
                        </button>
                      </div>
                      {/* Approve Allowance Section (show if balance is defined and >= 0) */}
                      {wallet.balance !== undefined && !isNaN(parseFloat(wallet.balance)) && parseFloat(wallet.balance) >= 0 && (
                        <div className="bg-gray-50 p-4 rounded-lg border border-blue-200 flex flex-col gap-2">
                          <div className="font-semibold text-gray-700 mb-2">Approve Allowance</div>
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder={`Amount (${wallet.stablecoin_currency})`}
                            value={approveInputs[wallet.wallet_id] || ''}
                            onChange={e => setApproveInputs({ ...approveInputs, [wallet.wallet_id]: e.target.value })}
                            className="border p-1 rounded w-full text-sm"
                          />
                          <button
                            onClick={e => { e.stopPropagation(); handleApprove(wallet.wallet_id, wallet.stablecoin_currency); }}
                            className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 text-sm w-full"
                          >
                            Approve
                          </button>
                        </div>
                      )}
                      {/* Create Custodial Wallet Section (before Transfer) */}
                      {wallet.balance !== undefined && !isNaN(parseFloat(wallet.balance)) && parseFloat(wallet.balance) >= 0 && (
                        <div className="bg-gray-50 p-4 rounded-lg border border-yellow-200 flex flex-col gap-2">
                          <div className="font-semibold text-gray-700 mb-2">Create Custodial Wallet</div>
                          <button
                            onClick={e => { e.stopPropagation(); handleCreateCustodialWallet(wallet.wallet_id); }}
                            className={`bg-yellow-500 text-white py-1 px-3 rounded hover:bg-yellow-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50 text-sm w-full ${custodialLoading[wallet.wallet_id] ? 'opacity-60 cursor-not-allowed' : ''}`}
                            disabled={custodialLoading[wallet.wallet_id]}
                          >
                            {custodialLoading[wallet.wallet_id] ? 'Processing...' : 'Create Custodial Wallet'}
                          </button>
                        </div>
                      )}
                      {/* Transfer Section (show if balance is defined and >= 0) */}
                      {wallet.balance !== undefined && !isNaN(parseFloat(wallet.balance)) && parseFloat(wallet.balance) >= 0 && (
                        <div className="bg-gray-50 p-4 rounded-lg border border-purple-200 flex flex-col gap-2">
                          <div className="font-semibold text-gray-700 mb-2">Transfer</div>
                          <input
                            type="text"
                            placeholder="Blockchain Address"
                            value={(transferInputs[wallet.wallet_id]?.address) || ''}
                            onChange={e => setTransferInputs({
                              ...transferInputs,
                              [wallet.wallet_id]: {
                                ...(transferInputs[wallet.wallet_id] || {}),
                                address: e.target.value
                              }
                            })}
                            className="border p-1 rounded w-full text-sm"
                          />
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder={`Amount (${wallet.stablecoin_currency})`}
                            value={(transferInputs[wallet.wallet_id]?.amount) || ''}
                            onChange={e => setTransferInputs({
                              ...transferInputs,
                              [wallet.wallet_id]: {
                                ...(transferInputs[wallet.wallet_id] || {}),
                                amount: e.target.value
                              }
                            })}
                            className="border p-1 rounded w-full text-sm"
                          />
                          <button
                            onClick={e => { e.stopPropagation(); handleTransfer(wallet.wallet_id, wallet.stablecoin_currency); }}
                            className="bg-purple-500 text-white py-1 px-3 rounded hover:bg-purple-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 text-sm w-full"
                          >
                            Transfer Funds
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
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
