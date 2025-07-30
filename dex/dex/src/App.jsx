import React, { useState, useEffect } from 'react';
import './index.css';

// Add auto-hide functionality for toasts
const TOAST_DURATION = 5000; // 5 seconds

// Main App component
const App = () => {
  // State for wallet connection
  const [walletAddress, setWalletAddress] = useState('');
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  // State for email
  const [email, setEmail] = useState('');
  // State for wallet data
  const [walletData, setWalletData] = useState(null);
  // Loading and toast state
  const [isCreatingWallet, setIsCreatingWallet] = useState(false);
  const [toast, setToast] = useState({ show: false, type: '', message: '' });

  // State for token deposit/buy
  const [tokenType, setTokenType] = useState('USDC');
  const [depositAmount, setDepositAmount] = useState('');
  const [buyAmount, setBuyAmount] = useState('');

  // State for token approval/transfer
  const [availableTokens, setAvailableTokens] = useState(0); // Simulated available tokens
  const [approveAmount, setApproveAmount] = useState(''); // Amount for approval
  const [transferAmount, setTransferAmount] = useState(''); // Amount for transfer
  const [isApproved, setIsApproved] = useState(false);
  const [approvedAmount, setApprovedAmount] = useState(0); // Track the amount that has been approved
  const [targetAddress, setTargetAddress] = useState(''); // State for target address, now primarily for transfer
  const [message, setMessage] = useState(''); // General message for user feedback

  // Mock custodial addresses
  const mockCustodialAddresses = [
    '0xCustodial1A2B3C4D5E6F7G8H9I0J1K2L3M4N5O6P7Q8R9S0T',
    '0xCustodial2B3C4D5E6F7G8H9I0J1K2L3M4N5O6P7Q8R9S0T1U',
    '0xCustodial3C4D5E6F7G8H9I0J1K2L3M4N5O6P7Q8R9S0T1U2V',
  ];

  // Function to fetch wallet balance
  const fetchWalletBalance = async () => {
    if (!walletAddress) return;
    
    try {
      const response = await fetch(`/api/${walletAddress}/balance`);
      if (response.ok) {
        const data = await response.json();
        const balance = data?.balance ? parseFloat(data.balance) : 0;
        setAvailableTokens(balance);
      } else {
        console.error('Failed to fetch balance');
      }
    } catch (error) {
      console.error('Error fetching balance:', error);
    }
  };

  // Fetch balance periodically when wallet is connected
  useEffect(() => {
    if (isWalletConnected) {
      // Initial fetch
      fetchWalletBalance();
      
      // Set up periodic fetching
      const intervalId = setInterval(fetchWalletBalance, 30000); // Every 30 seconds
      
      // Cleanup interval on unmount or when wallet disconnects
      return () => clearInterval(intervalId);
    }
  }, [isWalletConnected, walletAddress]);

  // Auto-hide toast after duration
  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => {
        setToast({ ...toast, show: false });
      }, TOAST_DURATION);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Create wallet with fetch
  const handleCreateWallet = async () => {
    if (!email) {
      setToast({ show: true, type: 'error', message: 'Please enter your email.' });
      return;
    }
    setIsCreatingWallet(true);
    setToast({ show: false, type: '', message: '' });
    setMessage('');
    try {
      const response = await fetch('/api/wallet/createOwnerAddress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_name: email
        })
      });
      if (!response.ok) {
        throw new Error('Failed to create wallet');
      }
      const data = await response.json();
      // Store complete wallet data
      if (data && data.address && data.privateKey) {
        setWalletData(data);
        setWalletAddress(data.address);
        setIsWalletConnected(true);
        setMessage('New wallet created successfully!');
        setToast({ show: true, type: 'success', message: 'Wallet created successfully!' });
        
        // Fetch initial balance
        try {
          const balanceResponse = await fetch(`/api/${data.address}/balance`);
          if (balanceResponse.ok) {
            const balanceData = await balanceResponse.json();
            const balance = balanceData?.balance ? parseFloat(balanceData.balance) : 0;
            setAvailableTokens(balance);
          }
        } catch (balanceErr) {
          console.error('Failed to fetch initial balance:', balanceErr);
        }
        
        // Reset approval states
        setIsApproved(false);
        setApproveAmount('');
        setTransferAmount('');
        setApprovedAmount(0);
        setTargetAddress(''); // Clear target address
      } else {
        throw new Error('Invalid wallet data returned');
      }
    } catch (err) {
      setToast({ show: true, type: 'error', message: err.message || 'Failed to create wallet.' });
    } finally {
      setIsCreatingWallet(false);
    }
  };

  // State for deposit loading
  const [isDepositing, setIsDepositing] = useState(false);

  // Handle token deposit with mint API
  const handleDeposit = async () => {
    if (!isWalletConnected) {
      setMessage('Please create or connect your wallet first.');
      return;
    }
    if (depositAmount <= 0 || isNaN(parseFloat(depositAmount))) {
      setMessage('Deposit amount must be a positive number.');
      return;
    }

    setIsDepositing(true);
    setMessage('');
    
    try {
      const response = await fetch('/api/mint', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          toAddress: walletAddress,
          amount: depositAmount,
          user_name: email,
          coinType: tokenType
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to mint tokens');
      }

      setToast({ show: true, type: 'success', message: 'Tokens minted successfully!' });
      
      // Refresh balance
      await fetchWalletBalance();
      
      setDepositAmount(''); // Clear input
      setIsApproved(false); // Reset approval after new deposit
      setApprovedAmount(0); // Reset approved amount

    } catch (err) {
      setToast({ show: true, type: 'error', message: err.message || 'Failed to mint tokens.' });
      console.error('Mint error:', err);
    } finally {
      setIsDepositing(false);
    }
  };

  // Simulate buying tokens (this would typically involve swapping)
  const handleBuy = () => {
    if (!isWalletConnected) {
      setMessage('Please create or connect your wallet first.');
      return;
    }
    if (buyAmount <= 0 || isNaN(parseFloat(buyAmount))) {
      setMessage('Buy amount must be a positive number.');
      return;
    }
    // In a real DEX, this would involve a swap, for now, just a message
    setMessage(`Attempting to buy ${parseFloat(buyAmount).toFixed(2)} ${tokenType}. (Simulation: No actual swap occurred)`);
    setBuyAmount(''); // Clear input
  };

  // State for approve loading
  const [isApproving, setIsApproving] = useState(false);

  // Handle token approval with API
  const handleApprove = async () => {
    // Reset message
    setMessage('');

    // Validate wallet connection
    if (!isWalletConnected) {
      setMessage('Please create or connect your wallet first.');
      return;
    }

    // Validate owner address
    if (!walletAddress || !walletAddress.trim()) {
      setMessage('Please enter a valid owner address.');
      return;
    }

    // Validate approve amount
    if (!approveAmount || approveAmount.trim() === '') {
      setMessage('Please enter an amount to approve.');
      return;
    }

    const amount = parseFloat(approveAmount);
    if (isNaN(amount) || amount <= 0) {
      setMessage('Please enter a valid positive number for approval.');
      return;
    }

    if (amount > availableTokens) {
      setMessage(`Insufficient tokens for approval. Available: ${availableTokens} ${tokenType}`);
      return;
    }
    
    setIsApproving(true);

    try {
      const response = await fetch('/api/wallet/approve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_name: email,
          ownerPrivateKey: walletData?.privateKey,
          ownerAddress: walletAddress,
          amount: approveAmount
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to approve tokens');
      }

      setIsApproved(true);
      setApprovedAmount(parseFloat(approveAmount));
      setToast({ show: true, type: 'success', message: 'Tokens approved successfully!' });
    } catch (err) {
      setToast({ show: true, type: 'error', message: err.message || 'Failed to approve tokens.' });
      console.error('Approve error:', err);
      setIsApproved(false);
      setApprovedAmount(0);
    } finally {
      setIsApproving(false);
    }
  };

  // Simulate transferring tokens to custodial wallet
  const handleTransfer = () => {
    if (!isWalletConnected) {
      setMessage('Please create or connect your wallet first.');
      return;
    }
    if (!isApproved || approvedAmount === 0) {
      setMessage('Please approve tokens first before transferring.');
      return;
    }
    if (transferAmount <= 0 || isNaN(parseFloat(transferAmount))) {
      setMessage('Please enter a valid amount to transfer.');
      return;
    }
    if (parseFloat(transferAmount) > availableTokens) {
      setMessage('Insufficient tokens in your wallet for this transfer.');
      return;
    }
    if (parseFloat(transferAmount) > approvedAmount) {
      setMessage(`You can only transfer up to the approved amount of ${approvedAmount.toFixed(2)} ${tokenType}.`);
      return;
    }
    if (!targetAddress) {
      setMessage('Please select a target custodial address.');
      return;
    }

    // Simulate deducting tokens and resetting approval
    setAvailableTokens(prev => prev - parseFloat(transferAmount));
    setMessage(`${parseFloat(transferAmount).toFixed(2)} ${tokenType} transferred to custodial wallet (${targetAddress}). Remaining: ${(availableTokens - parseFloat(transferAmount)).toFixed(2)} ${tokenType}.`);
    setTransferAmount(''); // Clear input
    setIsApproved(false); // Reset approval after transfer
    setApprovedAmount(0); // Reset approved amount
    setTargetAddress(''); // Clear target address after transfer
  };

  return (
    <>
      {/* Toast Notification */}
      {toast.show && (
        <div
          className={`fixed top-4 right-4 z-[9999] px-6 py-3 rounded-xl shadow-xl text-white text-lg font-semibold transition-all duration-300 animate-slide-in
            ${toast.type === 'success' ? 'bg-green-600' : ''}
            ${toast.type === 'error' ? 'bg-red-600' : ''}
          `}
          role="alert"
        >
          <div className="flex items-center">
            {toast.type === 'success' && (
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            )}
            {toast.type === 'error' && (
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            )}
            {toast.message}
          </div>
        </div>
      )}
      
      <div className="min-h-screen bg-gradient-to-br from-purple-900 to-blue-900 flex items-center justify-center p-4 font-inter">
        <div className="bg-gray-800 bg-opacity-70 backdrop-blur-lg p-8 rounded-3xl shadow-2xl w-full max-w-2xl border border-gray-700">
        <h1 className="text-4xl font-extrabold text-white text-center mb-4">
          DEXI
        </h1>
        <h2 className="text-xl font-semibold text-gray-300 text-center mb-8">
          DEXI plays Payer role to purchase stablecoins and transfer to Custodial wallet at Payer bank
        </h2>

        {/* Wallet Section */}
        <div className="mb-8 p-6 bg-gray-700 bg-opacity-50 rounded-2xl border border-gray-600">
          <h2 className="text-2xl font-semibold text-white mb-4 flex items-center">
            <svg className="w-6 h-6 mr-2 text-yellow-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1.586l3.293 3.293a1 1 0 010 1.414l-3.293 3.293V17a1 1 0 11-2 0v-1.586l-3.293-3.293a1 1 0 010-1.414L9 4.586V3a1 1 0 011-1zM4 12a2 2 0 100-4 2 2 0 000 4zm12 0a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path>
            </svg>
            Wallet
          </h2>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-300 text-sm font-bold mb-2">
              Email:
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="shadow appearance-none border border-gray-600 rounded-xl w-full py-3 px-4 text-gray-200 leading-tight focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-gray-700"
            />
          </div>
          {!isWalletConnected ? (
            <button
              onClick={handleCreateWallet}
              disabled={isCreatingWallet}
              className={`w-full bg-gradient-to-r from-green-500 to-teal-600 text-white py-3 px-6 rounded-xl text-lg font-bold hover:from-green-600 hover:to-teal-700 transition duration-300 transform hover:scale-105 shadow-lg ${isCreatingWallet ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isCreatingWallet ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                  </svg>
                  Creating Wallet...
                </span>
              ) : (
                'Create Wallet'
              )}
            </button>
          ) : (
            <p className="text-gray-300 text-center break-all">
              Connected: <span className="font-mono text-yellow-300">{walletAddress}</span>
            </p>
          )}

          {isWalletConnected && (
            <p className="text-gray-300 text-center mt-2">
              Available {tokenType}: <span className="font-bold text-green-400">{availableTokens.toFixed(2)}</span>
            </p>
          )}
        </div>

        {/* Deposit & Buy Tokens Section */}
        <div className="mb-8 p-6 bg-gray-700 bg-opacity-50 rounded-2xl border border-gray-600">
          <h2 className="text-2xl font-semibold text-white mb-4 flex items-center">
            <svg className="w-6 h-6 mr-2 text-blue-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path d="M8.433 7.412A2.001 2.001 0 0010 6a2 2 0 00-1.567 3.412L10 12l-1.567 2.588A2.001 2.001 0 0010 14a2 2 0 001.567-3.412L10 8l1.567-2.588A2.001 2.001 0 0010 6a2 2 0 00-1.567 3.412z"></path>
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm0 2a10 10 0 100-20 10 10 0 000 20z" clipRule="evenodd"></path>
            </svg>
            Deposit & Buy Tokens
          </h2>
          <div className="mb-4 p-4 bg-gray-800 bg-opacity-50 rounded-xl">
            <p className="text-gray-300 text-sm break-all">
              <span className="font-semibold">Wallet:</span> <span className="font-mono text-yellow-300">{walletAddress}</span>
            </p>
            <p className="text-gray-300 text-sm mt-2">
              <span className="font-semibold">Balance:</span> <span className="font-mono text-green-400">{availableTokens.toFixed(2)}</span> {tokenType}
            </p>
          </div>
          <div className="mb-4">
            <label htmlFor="tokenType" className="block text-gray-300 text-sm font-bold mb-2">
              Token Type:
            </label>
            <select
              id="tokenType"
              value={tokenType}
              onChange={(e) => setTokenType(e.target.value)}
              className="shadow appearance-none border border-gray-600 rounded-xl w-full py-3 px-4 text-gray-200 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700"
            >
              <option value="USDC">USDC</option>
              <option value="ETH">ETH</option>
              <option value="DAI">DAI</option>
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="depositAmount" className="block text-gray-300 text-sm font-bold mb-2">
              Amount to Deposit:
            </label>
            <input
              type="number"
              id="depositAmount"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              placeholder="e.g., 100"
              className="shadow appearance-none border border-gray-600 rounded-xl w-full py-3 px-4 text-gray-200 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700"
              min="0"
              step="0.01"
            />
          </div>
          <button
            onClick={handleDeposit}
            disabled={!isWalletConnected || isDepositing}
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 px-6 rounded-xl text-lg font-bold hover:from-indigo-600 hover:to-purple-700 transition duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDepositing ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                </svg>
                Minting...
              </span>
            ) : (
              `Deposit ${tokenType}`
            )}
          </button>

          <div className="mt-6 mb-4 hidden">
            <label htmlFor="buyAmount" className="block text-gray-300 text-sm font-bold mb-2">
              Amount to Buy:
            </label>
            <input
              type="number"
              id="buyAmount"
              value={buyAmount}
              onChange={(e) => setBuyAmount(e.target.value)}
              placeholder="e.g., 50"
              className="shadow appearance-none border border-gray-600 rounded-xl w-full py-3 px-4 text-gray-200 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700"
              min="0"
              step="0.01"
            />
          </div>
          <button
            onClick={handleBuy}
            disabled={!isWalletConnected}
            className="hidden w-full bg-gradient-to-r from-pink-500 to-red-600 text-white py-3 px-6 rounded-xl text-lg font-bold hover:from-pink-600 hover:to-red-700 transition duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Buy {tokenType}
          </button>
        </div>

        {/* Approve Tokens Section */}
        <div className="mb-8 p-6 bg-gray-700 bg-opacity-50 rounded-2xl border border-gray-600">
          <h2 className="text-2xl font-semibold text-white mb-4 flex items-center">
            <svg className="w-6 h-6 mr-2 text-orange-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd"></path>
            </svg>
            Approve Tokens
          </h2>
          <div className="mb-4">
            <label htmlFor="ownerAddress" className="block text-gray-300 text-sm font-bold mb-2">
              Owner Address:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                id="ownerAddress"
                defaultValue={walletAddress}
                onChange={(e) => {
                  setWalletAddress(e.target.value);
                  setIsApproved(false); // Reset approval if address changes
                  setApprovedAmount(0);
                }}
                placeholder="Enter owner address"
                className="flex-1 shadow appearance-none border border-gray-600 rounded-xl py-3 px-4 text-gray-200 leading-tight focus:outline-none focus:ring-2 focus:ring-orange-500 bg-gray-700"
              />
              <button
                onClick={async () => {
                  if (!walletAddress || !walletAddress.trim()) {
                    setMessage('Please enter a valid address');
                    return;
                  }
                  try {
                    const response = await fetch(`/api/${walletAddress}/balance`);
                    if (response.ok) {
                      const data = await response.json();
                      const balance = data?.balance ? parseFloat(data.balance) : 0;
                      setAvailableTokens(balance);
                      setMessage(`Address connected. Balance: ${balance.toFixed(2)} ${tokenType}`);
                    } else {
                      throw new Error('Failed to fetch balance');
                    }
                  } catch (error) {
                    setMessage('Failed to connect to address');
                    console.error('Error:', error);
                  }
                }}
                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-6 rounded-xl font-bold hover:from-blue-600 hover:to-blue-700 transition duration-300 shadow-lg"
              >
                Connect
              </button>
            </div>
          </div>
          <div className="mb-4">
            <label htmlFor="approveAmount" className="block text-gray-300 text-sm font-bold mb-2">
              Amount to Approve:
            </label>
            <input
              type="number"
              id="approveAmount"
              value={approveAmount}
              onChange={(e) => {
                setApproveAmount(e.target.value);
                setIsApproved(false); // Reset approval if amount changes
                setApprovedAmount(0);
              }}
              placeholder="e.g., 25"
              className="shadow appearance-none border border-gray-600 rounded-xl w-full py-3 px-4 text-gray-200 leading-tight focus:outline-none focus:ring-2 focus:ring-orange-500 bg-gray-700"
              min="0"
              step="0.01"
            />
          </div>
          <button
            onClick={handleApprove}
            disabled={
              !isWalletConnected || 
              !walletAddress || 
              !approveAmount || 
              isNaN(parseFloat(approveAmount)) || 
              parseFloat(approveAmount) <= 0 || 
              parseFloat(approveAmount) > availableTokens || 
              isApproving
            }
            className="w-full bg-gradient-to-r from-yellow-500 to-orange-600 text-white py-3 px-6 rounded-xl text-lg font-bold hover:from-yellow-600 hover:to-orange-700 transition duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isApproving ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                </svg>
                Approving...
              </span>
            ) : isApproved ? (
              `Approved ${approvedAmount.toFixed(2)} ${tokenType}!`
            ) : (
              'Approve Tokens'
            )}
          </button>
          {isApproved && (
            <p className="text-gray-400 text-center mt-2 text-sm">
              <span className="font-bold text-green-300">{approvedAmount.toFixed(2)} {tokenType}</span> approved for transfer.
            </p>
          )}
        </div>

        {/* Transfer Tokens Section */}
        <div className="mb-8 p-6 bg-gray-700 bg-opacity-50 rounded-2xl border border-gray-600">
          <h2 className="text-2xl font-semibold text-white mb-4 flex items-center">
            <svg className="w-6 h-6 mr-2 text-teal-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd"></path>
            </svg>
            Transfer Tokens
          </h2>
          <div className="mb-4">
            <label htmlFor="targetAddressTransfer" className="block text-gray-300 text-sm font-bold mb-2">
              Target Custodial Address:
            </label>
            <select
              id="targetAddressTransfer"
              value={targetAddress}
              onChange={(e) => {
                setTargetAddress(e.target.value);
                // No need to reset approval here, as approval is for the amount, not the address
              }}
              className="shadow appearance-none border border-gray-600 rounded-xl w-full py-3 px-4 text-gray-200 leading-tight focus:outline-none focus:ring-2 focus:ring-teal-500 bg-gray-700"
            >
              <option value="">Select an address</option>
              {mockCustodialAddresses.map((address, index) => (
                <option key={index} value={address}>
                  {address}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="transferAmount" className="block text-gray-300 text-sm font-bold mb-2">
              Amount to Transfer:
            </label>
            <input
              type="number"
              id="transferAmount"
              value={transferAmount}
              onChange={(e) => setTransferAmount(e.target.value)}
              placeholder={`Max ${approvedAmount.toFixed(2)}`}
              className="shadow appearance-none border border-gray-600 rounded-xl w-full py-3 px-4 text-gray-200 leading-tight focus:outline-none focus:ring-2 focus:ring-teal-500 bg-gray-700"
              min="0"
              step="0.01"
            />
          </div>
          <p className="text-gray-400 text-sm mb-4">
            Approved for transfer: <span className="font-bold text-green-300">{approvedAmount.toFixed(2)} {tokenType}</span>
          </p>
          <button
            onClick={handleTransfer}
            disabled={!isWalletConnected || !isApproved || transferAmount <= 0 || parseFloat(transferAmount) > approvedAmount || !targetAddress}
            className="w-full bg-gradient-to-r from-teal-500 to-blue-600 text-white py-3 px-6 rounded-xl text-lg font-bold hover:from-teal-600 hover:to-blue-700 transition duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Transfer Tokens
          </button>
        </div>

        {/* Message Display */}
        {message && (
          <div className="mt-8 p-4 bg-blue-900 bg-opacity-50 rounded-xl border border-blue-800 text-white text-center">
            <p className="text-lg font-medium">{message}</p>
          </div>
        )}
      </div>
    </div>
    </>
  );
};

export default App;
