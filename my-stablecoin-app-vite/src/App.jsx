  // Function to navigate to the Transactions page for a specific wallet currency
  const navigateToTransactionsForWallet = (currency) => {
    setFilterCurrencyForTransactions(currency);
    setActivePage('transactions');
  };
import React, { useState, useEffect } from 'react';
import { Home, DollarSign, Repeat, Wallet, Settings, TrendingUp, Menu, X, User, LogOut } from 'lucide-react';

// Import page components - all with .jsx extension
import WalletsPage from './pages/WalletsPage.jsx';
import PaymentsPage from './pages/PaymentsPage.jsx';
import TransactionsPage from './pages/TransactionsPage.jsx';
import BankAdminDashboardPage from './pages/BankAdminDashboardPage.jsx';
import WalletsMaintenancePage from './pages/WalletsMaintenancePage.jsx';
import CustomerManagementPage from './pages/CustomerManagementPage.jsx';
import DigitalExchangePage from './pages/DigitalExchangePage.jsx';
import { ArrowRightLeft } from 'lucide-react';

// Main App component for the Stablecoin Payments Dashboard
const App = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State to manage sidebar visibility on mobile
  const [activePage, setActivePage] = useState('dashboard'); // State to manage active page
  const [currentPersona, setCurrentPersona] = useState(null); // Null means not logged in
  const [customerIdList, setCustomerIdList] = useState([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false); // New state for login status
  const [filterCurrencyForTransactions, setFilterCurrencyForTransactions] = useState(null); // New state for transaction filtering

  // Centralized customer data state
  const [customers, setCustomers] = useState([
    { id: 'cust001', name: 'Alice Smith', email: 'alice@example.com', organization: 'Acme Corp', glei: '54930000000000000000', status: 'Active', wallets: 3, lastLogin: '2023-07-23' },
    { id: 'cust002', name: 'Bob Johnson', email: 'bob@example.com', organization: 'Globex Inc.', glei: '549300ABCD1234567890', status: 'Active', wallets: 1, lastLogin: '2023-07-22' },
    { id: 'cust003', name: 'Charlie Brown', email: 'charlie@example.com', organization: 'Snoopy Co.', glei: '549300XYZ78901234567', status: 'Suspended', wallets: 2, lastLogin: '2023-07-15' },
    { id: 'cust004', name: 'David Lee', email: 'david@example.com', organization: 'Acme Corp', glei: '549300ABCDEF12345678', status: 'Active', wallets: 1, lastLogin: '2023-07-23' },
    { id: 'cust005', name: 'Eve Davis', email: 'eve@example.com', organization: 'Wayne Enterprises', glei: '', status: 'Pending KYC', wallets: 0, lastLogin: '2023-07-20' },
  ]);

  // Function to handle saving a customer (add or edit)
  const handleSaveCustomer = (customerToSave) => {
    if (customers.some(cust => cust.id === customerToSave.id)) {
      // Editing existing customer
      setCustomers(customers.map(cust =>
        cust.id === customerToSave.id ? customerToSave : cust
      ));
    } else {
      // Adding new customer
      setCustomers([...customers, customerToSave]);
    }
  };

  // Function to handle deleting a customer
  const handleDeleteCustomer = (customerId) => {
    if (window.confirm('Are you sure you want to delete this customer? This action cannot be undone.')) {
      setCustomers(customers.filter(cust => cust.id !== customerId));
    }
  };

  // Function to update customer's wallet count (e.g., when a new wallet is added for them)
  const handleAddCustomerWallet = (customerId) => {
    setCustomers(customers.map(cust =>
      cust.id === customerId ? { ...cust, wallets: cust.wallets + 1 } : cust
    ));
  };

  // Placeholder for suspend/activate functionality
  const handleUpdateCustomerWallets = (customerId, action) => {
    alert(`${action.charAt(0).toUpperCase() + action.slice(1)} customer with ID: ${customerId}`);
    // In a real app, you'd update the customer's status in your backend/state here
  };

  // Login function passed to LoginPage
  const handleLogin = (personaType) => {
    setCurrentPersona(personaType);
    setIsLoggedIn(true);
    // Set initial page based on persona
    setActivePage(personaType === 'customer' ? 'dashboard' : 'admin-dashboard');
    setFilterCurrencyForTransactions(null); // Clear any transaction filters on login
  };

  // Fetch customer IDs when persona is set to customer
  useEffect(() => {
    if (currentPersona === 'customer') {
      fetch('/api/customers', { headers: { 'accept': '*/*' } })
        .then(res => res.json())
        .then(data => {
          const list = Array.isArray(data.data) ? data.data : [];
          setCustomerIdList(list.map(c => c.CUST_ID));
        })
        .catch(() => setCustomerIdList([]));
    }
  }, [currentPersona]);

  // Logout function
  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentPersona(null);
    setActivePage('dashboard'); // Reset to default page or login page
    setFilterCurrencyForTransactions(null); // Clear any transaction filters on logout
  };


  // Function to toggle sidebar visibility
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Function to render the active page component based on persona
  const renderPage = () => {
    if (!isLoggedIn) {
      return <LoginPage onLogin={handleLogin} />;
    }

    if (activePage === 'digital-exchange') {
      return <DigitalExchangePage />;
    }
    if (currentPersona === 'customer') {
      switch (activePage) {
        case 'dashboard':
          return (
            <>
              {/* Page Header */}
              <header className="mb-8 pb-4 border-b border-gray-200 flex justify-between items-center">
                <h1 className="text-3xl font-extrabold text-gray-800">Dashboard Overview</h1>
                <div className="flex items-center space-x-4">
                  {/* Placeholder for user profile/notifications */}
                  <div className="w-10 h-10 bg-indigo-200 rounded-full flex items-center justify-center text-indigo-700 font-semibold">
                    JD
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
                    title="Logout"
                  >
                    <LogOut size={20} />
                  </button>
                </div>
              </header>

              {/* Dashboard Widgets/Cards */}
              <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {/* Total Balance Card */}
                <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">Total Balance</h3>
                  <p className="text-4xl font-bold text-indigo-700">$12,345.67 <span className="text-xl text-gray-500">USDC</span></p>
                  <p className="text-sm text-gray-500 mt-2">+5.2% from last month</p>
                </div>

                {/* Recent Transactions Card */}
                <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">Recent Transactions</h3>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex justify-between items-center">
                      <span>Payment to Alice</span>
                      <span className="font-semibold text-green-600">+$50.00 USDC</span>
                    </li>
                    <li className="flex justify-between items-center">
                      <span>Transfer to Exchange</span>
                      <span className="font-semibold text-red-600">-$200.00 USDC</span>
                    </li>
                    <li className="flex justify-between items-center">
                      <span>Received from Bob</span>
                      <span className="font-semibold text-green-600">+$150.00 USDC</span>
                    </li>
                  </ul>
                  <button className="mt-4 w-full bg-indigo-500 text-white py-2 px-4 rounded-lg hover:bg-indigo-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50">
                    View All Transactions
                  </button>
                </div>

                {/* Payment Trends Card */}
                <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">Payment Trends (Last 30 Days)</h3>
                  {/* Placeholder for a chart */}
                  <div className="h-40 bg-gray-200 rounded-lg mx-auto flex items-center justify-center text-gray-500">
                    Chart Placeholder
                  </div>
                  <p className="text-sm text-gray-500 mt-3">Overall payment volume increased by 10%</p>
                </div>
              </section>

              {/* Additional Sections */}
              <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Quick Actions Card */}
                <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-600 mb-4">Quick Actions</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <button className="bg-green-500 text-white py-3 px-4 rounded-lg hover:bg-green-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 flex items-center justify-center">
                      <DollarSign size={18} className="mr-2" /> Send Payment
                    </button>
                    <button className="bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 flex items-center justify-center">
                      <Wallet size={18} className="mr-2" /> Deposit Funds
                    </button>
                    <button className="bg-yellow-500 text-white py-3 px-4 rounded-lg hover:bg-yellow-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50 flex items-center justify-center">
                      <Repeat size={18} className="mr-2" /> Request Payment
                    </button>
                    <button className="bg-purple-500 text-white py-3 px-4 rounded-lg hover:bg-purple-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 flex items-center justify-center">
                      <Settings size={18} className="mr-2" /> Manage Wallets
                    </button>
                  </div>
                </div>

                {/* Notifications Card */}
                <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-600 mb-4">Notifications</h3>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-start">
                      <span className="text-blue-500 mr-2">&bull;</span> Your payment to "Merchant X" for $75.00 USDC was successful.
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">&bull;</span> New deposit of $100.00 USDC received.
                    </li>
                    <li className="flex items-start">
                      <span className="text-orange-500 mr-2">&bull;</span> Action required: Verify your identity for higher limits.
                    </li>
                  </ul>
                  <button className="mt-4 w-full bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50">
                    View All Notifications
                  </button>
                </div>
              </section>
            </>
          );
        case 'wallets':
          return <WalletsPage navigateToTransactionsForWallet={navigateToTransactionsForWallet} />;
        case 'payments':
          return <PaymentsPage />;
        case 'transactions':
          return <TransactionsPage filterCurrency={filterCurrencyForTransactions} />;
        case 'settings':
            return (
                <div className="p-6">
                    <h2 className="text-3xl font-extrabold text-gray-800 mb-6">Settings</h2>
                    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                        <p className="text-gray-600">Customer specific settings will go here.</p>
                    </div>
                </div>
            );
        default:
          return null;
      }
    } else if (currentPersona === 'bankAdmin') {
      switch (activePage) {
        case 'admin-dashboard':
          return (
            <>
              <header className="mb-8 pb-4 border-b border-gray-200 flex justify-between items-center">
                <h1 className="text-3xl font-extrabold text-gray-800">Bank Admin Dashboard</h1>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={handleLogout}
                    className="p-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
                    title="Logout"
                  >
                    <LogOut size={20} />
                  </button>
                </div>
              </header>
              <BankAdminDashboardPage />
            </>
          );
        case 'wallets-maintenance':
          return <WalletsMaintenancePage
                    customers={customers}
                    onAddCustomerWallet={handleAddCustomerWallet}
                 />;
        case 'customer-management':
          return <CustomerManagementPage
                    customers={customers}
                    onSaveCustomer={handleSaveCustomer}
                    onDeleteCustomer={handleDeleteCustomer}
                    onUpdateCustomerWallets={handleUpdateCustomerWallets}
                 />;
        case 'admin-settings':
            return (
                <div className="p-6">
                    <h2 className="text-3xl font-extrabold text-gray-800 mb-6">Admin Settings</h2>
                    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                        <p className="text-gray-600">Bank Admin specific settings will go here.</p>
                    </div>
                </div>
            );
        default:
          return (
            <>
              <header className="mb-8 pb-4 border-b border-gray-200 flex justify-between items-center">
                <h1 className="text-3xl font-extrabold text-gray-800">Bank Admin Dashboard</h1>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={handleLogout}
                    className="p-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
                    title="Logout"
                  >
                    <LogOut size={20} />
                  </button>
                </div>
              </header>
              <BankAdminDashboardPage />
            </>
          );
      }
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans text-gray-900 flex flex-col lg:flex-row">
      {/* Mobile Menu Button and Persona Selector */}
      <div className="lg:hidden p-4 bg-white shadow-sm flex justify-between items-center">
        <h1 className="text-xl font-bold text-indigo-700">StablePay</h1>
        {isLoggedIn && (
          <div className="flex items-center space-x-3">
            <select
              value={currentPersona}
              onChange={e => {
                setCurrentPersona(e.target.value);
                setActivePage(e.target.value === 'customer' ? 'dashboard' : 'admin-dashboard');
                setIsSidebarOpen(false);
              }}
              className="p-2 rounded-md bg-white border border-gray-300 text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="customer">Customer</option>
              <option value="bankAdmin">Bank Admin</option>
            </select>
            {/* Customer ID dropdown for mobile */}
            {currentPersona === 'customer' && customerIdList.length > 0 && (
              <select
                value={selectedCustomerId}
                onChange={e => setSelectedCustomerId(e.target.value)}
                className="p-2 rounded-md bg-white border border-gray-300 text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Select Customer ID</option>
                {customerIdList.map(id => (
                  <option key={id} value={id}>{id}</option>
                ))}
              </select>
            )}
            <button onClick={toggleSidebar} className="p-2 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500">
              {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        )}
      </div>

      {/* Left Navigation Sidebar */}
      {isLoggedIn && (
        <aside
          className={`fixed inset-y-0 left-0 z-50 w-64 bg-indigo-800 text-white p-6 flex flex-col shadow-lg
                     transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                     lg:relative lg:translate-x-0 lg:flex lg:shadow-none transition-transform duration-300 ease-in-out`}
        >
          {/* Platform Logo/Name */}
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-extrabold text-indigo-100">StablePay</h2>
            <p className="text-indigo-300 text-sm">Payments Platform</p>
          </div>

          {/* Persona Selector for Desktop */}
          <div className="hidden lg:block mb-6 text-center">
            <select
              value={currentPersona}
              onChange={e => {
                setCurrentPersona(e.target.value);
                setActivePage(e.target.value === 'customer' ? 'dashboard' : 'admin-dashboard');
              }}
              className="w-full p-2 rounded-md bg-indigo-700 border border-indigo-600 text-white text-base focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="customer">Customer</option>
              <option value="bankAdmin">Bank Admin</option>
            </select>
            {/* Customer ID dropdown for desktop */}
            {currentPersona === 'customer' && customerIdList.length > 0 && (
              <select
                value={selectedCustomerId}
                onChange={e => setSelectedCustomerId(e.target.value)}
                className="w-full mt-2 p-2 rounded-md bg-indigo-700 border border-indigo-600 text-white text-base focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Select Customer ID</option>
                {customerIdList.map(id => (
                  <option key={id} value={id}>{id}</option>
                ))}
              </select>
            )}
          </div>

          {/* Navigation Links */}
          <nav className="flex-grow">
            <ul>
              {currentPersona === 'customer' ? (
                <>
                  {/* Customer Navigation */}
                  <li className="mb-4">
                    <a
                      href="#"
                      onClick={() => { setActivePage('dashboard'); setIsSidebarOpen(false); }}
                      className={`flex items-center p-3 rounded-lg transition-colors duration-200 group
                                 ${activePage === 'dashboard' ? 'bg-indigo-700' : 'hover:bg-indigo-700'}`}
                    >
                      <Home size={20} className="mr-3 text-indigo-300 group-hover:text-white" />
                      <span className="font-medium text-lg">Dashboard</span>
                    </a>
                  </li>
                  <li className="mb-4">
                    <a
                      href="#"
                      onClick={() => { setActivePage('payments'); setIsSidebarOpen(false); }}
                      className={`flex items-center p-3 rounded-lg transition-colors duration-200 group
                                 ${activePage === 'payments' ? 'bg-indigo-700' : 'hover:bg-indigo-700'}`}
                    >
                      <DollarSign size={20} className="mr-3 text-indigo-300 group-hover:text-white" />
                      <span className="font-medium text-lg">Payments</span>
                    </a>
                  </li>
                  <li className="mb-4">
                    <a
                      href="#"
                      onClick={() => { setActivePage('transactions'); setIsSidebarOpen(false); setFilterCurrencyForTransactions(null); }}
                      className={`flex items-center p-3 rounded-lg transition-colors duration-200 group
                                 ${activePage === 'transactions' ? 'bg-indigo-700' : 'hover:bg-indigo-700'}`}
                    >
                      <Repeat size={20} className="mr-3 text-indigo-300 group-hover:text-white" />
                      <span className="font-medium text-lg">Transactions</span>
                    </a>
                  </li>
                  <li className="mb-4">
                    <a
                      href="#"
                      onClick={() => { setActivePage('wallets'); setIsSidebarOpen(false); }}
                      className={`flex items-center p-3 rounded-lg transition-colors duration-200 group
                                 ${activePage === 'wallets' ? 'bg-indigo-700' : 'hover:bg-indigo-700'}`}
                    >
                      <Wallet size={20} className="mr-3 text-indigo-300 group-hover:text-white" />
                      <span className="font-medium text-lg">Wallets</span>
                    </a>
                  </li>
                  <li className="mb-4">
                    <a
                      href="#"
                      onClick={() => { setActivePage('analytics'); setIsSidebarOpen(false); }}
                      className={`flex items-center p-3 rounded-lg transition-colors duration-200 group
                                 ${activePage === 'analytics' ? 'bg-indigo-700' : 'hover:bg-indigo-700'}`}
                    >
                      <TrendingUp size={20} className="mr-3 text-indigo-300 group-hover:text-white" />
                      <span className="font-medium text-lg">Analytics</span>
                    </a>
                  </li>
                  <li className="mb-4">
                    <a
                      href="#"
                      onClick={() => { setActivePage('settings'); setIsSidebarOpen(false); }}
                      className={`flex items-center p-3 rounded-lg transition-colors duration-200 group
                                 ${activePage === 'settings' ? 'bg-indigo-700' : 'hover:bg-indigo-700'}`}
                    >
                      <Settings size={20} className="mr-3 text-indigo-300 group-hover:text-white" />
                      <span className="font-medium text-lg">Settings</span>
                    </a>
                  </li>
                </>
              ) : (
                <>
                  {/* Bank Admin Navigation */}
                  <li className="mb-4">
                    <a
                      href="#"
                      onClick={() => { setActivePage('admin-dashboard'); setIsSidebarOpen(false); }}
                      className={`flex items-center p-3 rounded-lg transition-colors duration-200 group
                                 ${activePage === 'admin-dashboard' ? 'bg-indigo-700' : 'hover:bg-indigo-700'}`}
                    >
                      <Home size={20} className="mr-3 text-indigo-300 group-hover:text-white" />
                      <span className="font-medium text-lg">Admin Dashboard</span>
                    </a>
                  </li>
                  <li className="mb-4">
                    <a
                      href="#"
                      onClick={() => { setActivePage('wallets-maintenance'); setIsSidebarOpen(false); }}
                      className={`flex items-center p-3 rounded-lg transition-colors duration-200 group
                                 ${activePage === 'wallets-maintenance' ? 'bg-indigo-700' : 'hover:bg-indigo-700'}`}
                    >
                      <Wallet size={20} className="mr-3 text-indigo-300 group-hover:text-white" />
                      <span className="font-medium text-lg">Wallets Maintenance</span>
                    </a>
                  </li>
                  <li className="mb-4">
                    <a
                      href="#"
                      onClick={() => { setActivePage('customer-management'); setIsSidebarOpen(false); }}
                      className={`flex items-center p-3 rounded-lg transition-colors duration-200 group
                                 ${activePage === 'customer-management' ? 'bg-indigo-700' : 'hover:bg-indigo-700'}`}
                    >
                      <User size={20} className="mr-3 text-indigo-300 group-hover:text-white" />
                      <span className="font-medium text-lg">Customer Management</span>
                    </a>
                  </li>
                  <li className="mb-4">
                    <a
                      href="#"
                      onClick={() => { setActivePage('admin-settings'); setIsSidebarOpen(false); }}
                      className={`flex items-center p-3 rounded-lg transition-colors duration-200 group
                                 ${activePage === 'admin-settings' ? 'bg-indigo-700' : 'hover:bg-indigo-700'}`}
                    >
                      <Settings size={20} className="mr-3 text-indigo-300 group-hover:text-white" />
                      <span className="font-medium text-lg">Admin Settings</span>
                    </a>
                  </li>
                </>
              )}
            </ul>
            {/* Exchange User Category - visible to all personas */}
            <div className="mt-8">
              <h4 className="text-xs font-semibold text-indigo-200 uppercase mb-2">Exchange User</h4>
              <ul>
                <li>
                  <a
                    href="#"
                    onClick={() => { setActivePage('digital-exchange'); setIsSidebarOpen(false); }}
                    className={`flex items-center p-3 rounded-lg transition-colors duration-200 group
                      ${activePage === 'digital-exchange' ? 'bg-indigo-700' : 'hover:bg-indigo-700'}`}
                  >
                    <ArrowRightLeft size={20} className="mr-3 text-indigo-300 group-hover:text-white" />
                    <span className="font-medium text-lg">Digital Exchange</span>
                  </a>
                </li>
              </ul>
            </div>
          </nav>

          {/* Close button for mobile sidebar */}
          <div className="lg:hidden mt-auto text-center">
            <button
              onClick={toggleSidebar}
              className="p-3 bg-indigo-700 rounded-lg text-white hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <X size={20} className="inline-block mr-2" /> Close Menu
            </button>
          </div>
        </aside>
      )}

      {/* Main Content Area */}
      <main className="flex-1 p-6 lg:p-10 overflow-y-auto">
        {renderPage()} {/* Render the active page */}
      </main>
    </div>
  );
};

export default App;
