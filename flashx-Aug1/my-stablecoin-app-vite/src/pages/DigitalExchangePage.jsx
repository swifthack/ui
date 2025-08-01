import React, { useState } from 'react';
import { PlusCircle, Send, Wallet, ArrowRight } from 'lucide-react';

const DigitalExchangePage = () => {
  const [wallet, setWallet] = useState(null);
  const [depositAmount, setDepositAmount] = useState('');
  const [transferAddress, setTransferAddress] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  const [message, setMessage] = useState('');

  // Mock wallet creation
  const handleCreateWallet = () => {
    setWallet({
      id: `exw${Date.now()}`,
      address: `0x${Math.random().toString(16).slice(2, 11)}${Math.random().toString(16).slice(2, 5)}`,
      balance: 0,
    });
    setMessage('Wallet created successfully!');
  };

  // Mock deposit
  const handleDeposit = () => {
    if (!wallet) return setMessage('Create a wallet first.');
    const amt = parseFloat(depositAmount);
    if (isNaN(amt) || amt <= 0) return setMessage('Enter a valid deposit amount.');
    setWallet({ ...wallet, balance: wallet.balance + amt });
    setDepositAmount('');
    setMessage(`Deposited $${amt.toFixed(2)} successfully!`);
  };

  // Mock transfer
  const handleTransfer = () => {
    if (!wallet) return setMessage('Create a wallet first.');
    const amt = parseFloat(transferAmount);
    if (!transferAddress) return setMessage('Enter a blockchain address.');
    if (isNaN(amt) || amt <= 0) return setMessage('Enter a valid transfer amount.');
    if (amt > wallet.balance) return setMessage('Insufficient balance.');
    setWallet({ ...wallet, balance: wallet.balance - amt });
    setTransferAmount('');
    setTransferAddress('');
    setMessage(`Transferred $${amt.toFixed(2)} to ${transferAddress}`);
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-3xl font-extrabold text-gray-800 mb-6">Digital Exchange</h2>
      {message && <div className="mb-4 p-2 bg-blue-100 text-blue-800 rounded">{message}</div>}
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 mb-6">
        <h3 className="text-xl font-semibold text-gray-700 mb-4 flex items-center"><Wallet className="mr-2" /> My Exchange Wallet</h3>
        {wallet ? (
          <div className="mb-4">
            <div className="mb-2 font-mono text-xs">Wallet Address: {wallet.address}</div>
            <div className="mb-2">Balance: <span className="font-bold">${wallet.balance.toFixed(2)}</span></div>
          </div>
        ) : (
          <button onClick={handleCreateWallet} className="bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 flex items-center"><PlusCircle className="mr-2" /> Create Wallet</button>
        )}
      </div>
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-2 flex items-center"><ArrowRight className="mr-2" /> Deposit Funds</h3>
        <div className="flex items-center space-x-2">
          <input type="number" min="0" value={depositAmount} onChange={e => setDepositAmount(e.target.value)} placeholder="Amount" className="border p-2 rounded w-32" />
          <button onClick={handleDeposit} className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700">Deposit</button>
        </div>
      </div>
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-700 mb-2 flex items-center"><Send className="mr-2" /> Transfer to Blockchain</h3>
        <div className="flex flex-col space-y-2">
          <input type="text" value={transferAddress} onChange={e => setTransferAddress(e.target.value)} placeholder="Blockchain Address" className="border p-2 rounded" />
          <input type="number" min="0" value={transferAmount} onChange={e => setTransferAmount(e.target.value)} placeholder="Amount" className="border p-2 rounded w-32" />
          <button onClick={handleTransfer} className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">Transfer</button>
        </div>
      </div>
    </div>
  );
};

export default DigitalExchangePage;
