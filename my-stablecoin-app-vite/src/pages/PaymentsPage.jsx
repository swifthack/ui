import React, { useState } from 'react';
import { Send, QrCode } from 'lucide-react';

const PaymentsPage = () => {
  const [sendAmount, setSendAmount] = useState('');
  const [sendRecipient, setSendRecipient] = useState('');
  const [sendStablecoin, setSendStablecoin] = useState('USDC');
  const [senderWallet, setSenderWallet] = useState('USDC Wallet'); // New state for sender wallet
  const [bankName, setBankName] = useState(''); // New state for bank name
  const [recipientName, setRecipientName] = useState(''); // New state for recipient name
  const [receiveStablecoin, setReceiveStablecoin] = useState('USDC');
  const [walletAddress, setWalletAddress] = useState('0xAbCdEf1234567890AbCdEf1234567890AbCdEf12'); // Mock address

  // Mock sender wallets data - should ideally come from a global state or API
  const senderWallets = [
    { id: 'usdc_wallet', name: 'USDC Wallet (0x...1234)', currency: 'USDC' },
    { id: 'usdt_wallet', name: 'USDT Wallet (0x...5678)', currency: 'USDT' },
    { id: 'dai_wallet', name: 'DAI Wallet (0x...90ab)', currency: 'DAI' },
  ];

  const handleSendPayment = (e) => {
    e.preventDefault();
    // In a real app, you would integrate with a blockchain wallet or API here
    console.log(`Sending ${sendAmount} ${sendStablecoin} from ${senderWallet} to ${recipientName} (${sendRecipient}) via ${bankName}`);
    alert(`Payment of ${sendAmount} ${sendStablecoin} from ${senderWallet} to ${recipientName} (${sendRecipient}) via ${bankName} initiated.`);
    setSendAmount('');
    setSendRecipient('');
    setRecipientName('');
    setBankName('');
    // Optionally reset sender wallet to default or first option
    setSenderWallet('USDC Wallet');
  };

  const handleCopyAddress = () => {
    // This is a workaround for clipboard access in some iframe environments
    const el = document.createElement('textarea');
    el.value = walletAddress;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    alert('Wallet address copied to clipboard!');
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-extrabold text-gray-800 mb-6">Payments</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Send Payment Section */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
            <Send size={20} className="mr-2 text-indigo-600" /> Send Payment
          </h3>
          <form onSubmit={handleSendPayment} className="space-y-4">
            {/* Sender Wallet Selection */}
            <div>
              <label htmlFor="senderWallet" className="block text-sm font-medium text-gray-700 mb-1">Sender Wallet</label>
              <select
                id="senderWallet"
                value={senderWallet}
                onChange={(e) => setSenderWallet(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 bg-white"
              >
                {senderWallets.map((wallet) => (
                  <option key={wallet.id} value={wallet.name}>
                    {wallet.name}
                  </option>
                ))}
              </select>
            </div>
            {/* Bank Name Dropdown */}
            <div>
              <label htmlFor="bankName" className="block text-sm font-medium text-gray-700 mb-1">Bank Name</label>
              <select
                id="bankName"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                required
              >
                <option value="">Select Bank</option>
                <option value="Bank A">Bank A</option>
                <option value="Bank B">Bank B</option>
                <option value="Bank C">Bank C</option>
              </select>
            </div>
            {/* Recipient Name Input */}
            <div>
              <label htmlFor="recipientName" className="block text-sm font-medium text-gray-700 mb-1">Recipient Name</label>
              <input
                type="text"
                id="recipientName"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                placeholder="Enter Recipient Name"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
            <div>
              <label htmlFor="sendRecipient" className="block text-sm font-medium text-gray-700 mb-1">Recipient Address</label>
              <input
                type="text"
                id="sendRecipient"
                value={sendRecipient}
                onChange={(e) => setSendRecipient(e.target.value)}
                placeholder="Enter wallet address or ENS"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
            <div>
              <label htmlFor="sendAmount" className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
              <input
                type="number"
                id="sendAmount"
                value={sendAmount}
                onChange={(e) => setSendAmount(e.target.value)}
                placeholder="0.00"
                step="0.01"
                min="0"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
            <div>
              <label htmlFor="sendStablecoin" className="block text-sm font-medium text-gray-700 mb-1">Stablecoin</label>
            <select
              id="sendStablecoin"
              value={sendStablecoin}
              onChange={(e) => setSendStablecoin(e.target.value)}
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
            Send Payment
          </button>
        </form>
      </div>

      {/* Receive Payment Section */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
          <QrCode size={20} className="mr-2 text-indigo-600" /> Receive Payment
        </h3>
        <div className="space-y-4">
          <div>
            <label htmlFor="receiveStablecoin" className="block text-sm font-medium text-gray-700 mb-1">Stablecoin to Receive</label>
            <select
              id="receiveStablecoin"
              value={receiveStablecoin}
              onChange={(e) => setReceiveStablecoin(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 bg-white"
            >
              <option value="USDC">USDC</option>
              <option value="USDT">USDT</option>
              <option value="DAI">DAI</option>
              <option value="BUSD">BUSD</option>
            </select>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">Your {receiveStablecoin} Wallet Address:</p>
            <div className="bg-gray-100 p-3 rounded-md break-all font-mono text-sm text-gray-800 flex items-center justify-between">
              <span>{walletAddress}</span>
              <button
                onClick={handleCopyAddress}
                className="ml-2 p-1 bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 text-xs"
              >
                Copy
              </button>
            </div>
            {/* Placeholder for QR Code */}
            <div className="mt-4 w-40 h-40 bg-gray-200 rounded-lg mx-auto flex items-center justify-center text-gray-500">
              QR Code for {receiveStablecoin}
            </div>
            <p className="text-sm text-gray-500 mt-2">Scan this QR code to send {receiveStablecoin} to your wallet.</p>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default PaymentsPage;
