
import { useState } from 'react';
function Icon({ name, className = "w-6 h-6" }) {
  // Simple SVG icons for each section
  switch (name) {
    case "wallet":
      return <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="4" fill="#475569"/><path d="M2 9V7a4 4 0 0 1 4-4h12a4 4 0 0 1 4 4v2" stroke="#1e293b" strokeWidth="2"/></svg>;
    case "deposit":
      return <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#64748b"/><path d="M12 8v8m0 0l-4-4m4 4l4-4" stroke="#fff" strokeWidth="2"/></svg>;
    case "approve":
      return <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="4" fill="#334155"/><path d="M8 12l2 2 4-4" stroke="#fff" strokeWidth="2"/></svg>;
    case "transfer":
      return <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="10" rx="5" fill="#1e293b"/><path d="M8 12h8m0 0l-3-3m3 3l-3 3" stroke="#fff" strokeWidth="2"/></svg>;
    default:
      return null;
  }
}

function App() {
  // State for each section
  const [email, setEmail] = useState("");
  const [wallet, setWallet] = useState(null);
  const [deposit, setDeposit] = useState("");
  const [allowance, setAllowance] = useState("");
  const [recipient, setRecipient] = useState("");
  const [transferAmount, setTransferAmount] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Handlers
  const handleCreateWallet = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");
    try {
      const response = await fetch('/api/wallets/createOwnerAddress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_name: email
        })
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setWallet({ 
        email, 
        address: data.address,
        privateKey: data.privateKey // Note: In a production app, handle private key securely
      });
      setMessage("Wallet created successfully!");
      // Auto dismiss success message after 5 seconds
      setTimeout(() => setMessage(""), 5000);
    } catch (error) {
      console.error('Error creating wallet:', error);
      setMessage("Failed to create wallet. Please try again.");
      // Auto dismiss error message after 7 seconds
      setTimeout(() => setMessage(""), 7000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeposit = (e) => {
    e.preventDefault();
    setMessage(`Deposited ${deposit} tokens.`);
  };
  const handleApprove = (e) => {
    e.preventDefault();
    setMessage(`Approved allowance of ${allowance} tokens.`);
  };
  const handleTransfer = (e) => {
    e.preventDefault();
    setMessage(`Transferred ${transferAmount} tokens to ${recipient}.`);
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-100 via-gray-200 to-gray-100 flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-gray-300/30 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-gray-400/30 blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="w-full max-w-3xl bg-white/80 rounded-3xl shadow-2xl p-12 space-y-12 backdrop-blur-xl border border-white/50 relative z-10">
        <div className="text-center space-y-4">
          <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-700 to-gray-800 tracking-tight">
            DEX Simulator
          </h1>
          <p className="text-gray-600 text-lg">Your gateway to decentralized trading</p>
        </div>

        {/* Section 1: Create Wallet */}
        <section className="bg-white/95 rounded-2xl shadow-md p-8 flex items-center gap-6 border border-gray-200 hover:shadow-xl transition-all">
          <div className="flex-shrink-0"><Icon name="wallet" className="w-12 h-12" /></div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-800 mb-3">1. Create Crypto Wallet</h2>
            <form onSubmit={handleCreateWallet} className="flex flex-col gap-3">
              <input
                type="email"
                required
                placeholder="Enter your email"
                className="px-5 py-3 rounded-lg bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-400 border border-gray-200 shadow-sm"
                value={email}
                onChange={e => setEmail(e.target.value)}
                disabled={!!wallet}
              />
              <button
                type="submit"
                className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 rounded-lg shadow transition disabled:opacity-50 relative"
                disabled={!!wallet || isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="opacity-0">Create Wallet</span>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  </>
                ) : wallet ? (
                  "Wallet Created"
                ) : (
                  "Create Wallet"
                )}
              </button>
              {wallet && (
                <div className="space-y-2 mt-2">
                  <div className="text-gray-700 text-xs">
                    Wallet Address: <span className="font-mono break-all">{wallet.address}</span>
                  </div>
                  <div className="text-gray-700 text-xs">
                    Private Key: <span className="font-mono break-all">{wallet.privateKey}</span>
                  </div>
                  <div className="text-amber-600 text-xs mt-1">
                    ⚠️ Save your private key securely. You'll need it for transactions.
                  </div>
                </div>
              )}
            </form>
          </div>
        </section>

        {/* Section 2: Deposit Amount */}
        <section className="bg-white/95 rounded-2xl shadow-md p-8 flex items-center gap-6 border border-gray-200 hover:shadow-xl transition-all">
          <div className="flex-shrink-0"><Icon name="deposit" className="w-12 h-12" /></div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-800 mb-3">2. Deposit Amount</h2>
            <form onSubmit={handleDeposit} className="flex gap-3">
              <input
                type="number"
                min="0"
                step="any"
                required
                placeholder="Amount"
                className="px-5 py-3 rounded-lg bg-gray-50 text-gray-900 flex-1 focus:outline-none focus:ring-2 focus:ring-gray-400 border border-gray-200 shadow-sm"
                value={deposit}
                onChange={e => setDeposit(e.target.value)}
                disabled={!wallet}
              />
              <button
                type="submit"
                className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg shadow transition disabled:opacity-50"
                disabled={!wallet}
              >Deposit</button>
            </form>
          </div>
        </section>

        {/* Section 3: Approve Allowance */}
        <section className="bg-white/95 rounded-2xl shadow-md p-8 flex items-center gap-6 border border-gray-200 hover:shadow-xl transition-all">
          <div className="flex-shrink-0"><Icon name="approve" className="w-12 h-12" /></div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-800 mb-3">3. Approve Allowance</h2>
            <form onSubmit={handleApprove} className="flex gap-3">
              <input
                type="number"
                min="0"
                step="any"
                required
                placeholder="Allowance Amount"
                className="px-5 py-3 rounded-lg bg-gray-50 text-gray-900 flex-1 focus:outline-none focus:ring-2 focus:ring-gray-400 border border-gray-200 shadow-sm"
                value={allowance}
                onChange={e => setAllowance(e.target.value)}
                disabled={!wallet}
              />
              <button
                type="submit"
                className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg shadow transition disabled:opacity-50"
                disabled={!wallet}
              >Approve</button>
            </form>
          </div>
        </section>

        {/* Section 4: Transfer Amount */}
        <section className="bg-white/95 rounded-2xl shadow-md p-8 flex items-center gap-6 border border-gray-200 hover:shadow-xl transition-all">
          <div className="flex-shrink-0"><Icon name="transfer" className="w-12 h-12" /></div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-800 mb-3">4. Transfer Amount</h2>
            <form onSubmit={handleTransfer} className="flex flex-col gap-3">
              <input
                type="text"
                required
                placeholder="Recipient Wallet Address"
                className="px-5 py-3 rounded-lg bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-400 border border-gray-200 shadow-sm"
                value={recipient}
                onChange={e => setRecipient(e.target.value)}
                disabled={!wallet}
              />
              <input
                type="number"
                min="0"
                step="any"
                required
                placeholder="Amount"
                className="px-5 py-3 rounded-lg bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-400 border border-gray-200 shadow-sm"
                value={transferAmount}
                onChange={e => setTransferAmount(e.target.value)}
                disabled={!wallet}
              />
              <button
                type="submit"
                className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 rounded-lg shadow transition disabled:opacity-50"
                disabled={!wallet}
              >Transfer</button>
            </form>
          </div>
        </section>

      </div>
      
      {/* Toast Message */}
      {message && (
        <div className="fixed bottom-4 right-4 max-w-sm w-full animate-toast">
          <div className={`p-4 rounded-lg shadow-lg border ${
            message.includes('success') 
              ? 'bg-green-50 border-green-200 text-green-800'
              : message.includes('Failed') || message.includes('failed')
              ? 'bg-red-50 border-red-200 text-red-800'
              : 'bg-blue-50 border-blue-200 text-blue-800'
          } flex items-center gap-2`}>
            <div className="flex-shrink-0">
              {message.includes('success') ? (
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                </svg>
              ) : message.includes('Failed') || message.includes('failed') ? (
                <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              ) : (
                <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              )}
            </div>
            <p className="flex-1">{message}</p>
            <button 
              onClick={() => setMessage("")} 
              className="flex-shrink-0 ml-4 text-gray-400 hover:text-gray-600 transition"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
        </div>
      )}
      
      <footer className="mt-10 text-gray-400 text-xs text-center opacity-90">
        &copy; {new Date().getFullYear()} DEX Simulator. All rights reserved.
      </footer>
    </div>
  );
}

export default App
