import React from 'react';
import { User, Wallet, DollarSign, Clock, Users } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const BankAdminDashboardPage = () => {
  // Mock statistics data for the admin dashboard
  const stats = [
    { title: 'Total Customers', value: '5,230', icon: <Users size={24} className="text-blue-500" /> },
    { title: 'Active Wallets', value: '12,500', icon: <Wallet size={24} className="text-green-500" /> },
    { title: 'Total Volume (USD)', value: '$25M', icon: <DollarSign size={24} className="text-indigo-500" /> },
    { title: 'Pending KYC', value: '45', icon: <Clock size={24} className="text-yellow-500" /> },
  ];

  // Mock data for transaction volume over time (for the new graph)
  const transactionVolumeData = [
    { name: 'Day 1', USDC: 4000, USDT: 2400, DAI: 1000, BUSD: 2000 },
    { name: 'Day 2', USDC: 3000, USDT: 1398, DAI: 2000, BUSD: 1500 },
    { name: 'Day 3', USDC: 2000, USDT: 9800, DAI: 3000, BUSD: 2500 },
    { name: 'Day 4', USDC: 2780, USDT: 3908, DAI: 2780, BUSD: 1800 },
    { name: 'Day 5', USDC: 1890, USDT: 4800, DAI: 1890, BUSD: 3000 },
    { name: 'Day 6', USDC: 2390, USDT: 3800, DAI: 2390, BUSD: 2200 },
    { name: 'Day 7', USDC: 3490, USDT: 4300, DAI: 3490, BUSD: 2800 },
    { name: 'Day 8', USDC: 4200, USDT: 2100, DAI: 1500, BUSD: 3100 },
    { name: 'Day 9', USDC: 3800, USDT: 2900, DAI: 2800, BUSD: 2700 },
    { name: 'Day 10', USDC: 5000, USDT: 3500, DAI: 4000, BUSD: 3900 },
  ];


  return (
    <div className="p-6">
      <h2 className="text-3xl font-extrabold text-gray-800 mb-6">Bank Admin Dashboard</h2>

      {/* Statistics Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow-md border border-gray-200 flex items-center space-x-4">
            <div className="p-3 bg-gray-100 rounded-full">
              {stat.icon}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">{stat.title}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Transaction Volume Graph Section */}
      <section className="bg-white p-6 rounded-xl shadow-md border border-gray-200 mb-8">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">Daily Stablecoin Transaction Volume</h3>
        <div className="h-80"> {/* Set a fixed height for the chart */}
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={transactionVolumeData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="name" tickLine={false} axisLine={{ stroke: '#ccc' }} />
              <YAxis tickLine={false} axisLine={{ stroke: '#ccc' }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '8px', padding: '10px' }}
                labelStyle={{ fontWeight: 'bold', color: '#333' }}
                itemStyle={{ color: '#555' }}
              />
              <Legend wrapperStyle={{ paddingTop: '10px' }} />
              <Line type="monotone" dataKey="USDC" stroke="#8884d8" activeDot={{ r: 8 }} strokeWidth={2} />
              <Line type="monotone" dataKey="USDT" stroke="#82ca9d" strokeWidth={2} />
              <Line type="monotone" dataKey="DAI" stroke="#ffc658" strokeWidth={2} />
              <Line type="monotone" dataKey="BUSD" stroke="#ff7300" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Admin Overview Section (existing) */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">Admin Overview</h3>
        <p className="text-gray-600">
          Welcome, Bank Admin. From here, you can manage various aspects of the platform, including user accounts,
          wallet statuses, and system configurations. Use the navigation on the left to access specific tools.
        </p>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg flex items-center">
            <User size={20} className="text-blue-600 mr-3" />
            <span className="font-medium text-blue-800">Manage Users</span>
          </div>
          <div className="bg-green-50 p-4 rounded-lg flex items-center">
            <Shield size={20} className="text-green-600 mr-3" />
            <span className="font-medium text-green-800">System Logs</span>
          </div>
          {/* More admin widgets can be added here */}
        </div>
      </div>
    </div>
  );
};

export default BankAdminDashboardPage;
