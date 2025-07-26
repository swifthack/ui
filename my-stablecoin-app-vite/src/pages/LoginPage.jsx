import React, { useState } from 'react';

const LoginPage = ({ onLogin }) => {
  // Default credentials for quick testing
  // Customer: username 'customer', password 'password'
  // Bank Admin: username 'admin', password 'adminpassword'
  const [username, setUsername] = useState('customer'); // Default to 'customer'
  const [password, setPassword] = useState('password'); // Default to 'password'
  const [persona, setPersona] = useState('customer'); // 'customer' or 'bankAdmin'

  const handleSubmit = (e) => {
    e.preventDefault();
    // Mock authentication logic
    if (username === 'customer' && password === 'password' && persona === 'customer') {
      onLogin('customer');
    } else if (username === 'admin' && password === 'adminpassword' && persona === 'bankAdmin') {
      onLogin('bankAdmin');
    } else {
      alert('Invalid credentials or persona selected.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 font-sans">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-extrabold text-center text-indigo-700 mb-6">StablePay Login</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          <div>
            <label htmlFor="persona" className="block text-sm font-medium text-gray-700 mb-1">Login As</label>
            <select
              id="persona"
              value={persona}
              onChange={(e) => setPersona(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 bg-white"
            >
              <option value="customer">Customer</option>
              <option value="bankAdmin">Bank Admin</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 font-semibold text-lg"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
