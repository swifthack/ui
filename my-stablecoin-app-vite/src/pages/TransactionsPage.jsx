import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const TransactionsPage = ({ filterCurrency }) => { // Accept filterCurrency prop
  // Mock transaction data
  const allTransactions = [
    { id: 'tx001', type: 'Send', amount: '50.00', stablecoin: 'USDC', counterparty: 'Alice', date: '2023-07-20 14:30' },
    { id: 'tx002', type: 'Receive', amount: '150.00', stablecoin: 'USDT', counterparty: 'Bob', date: '2023-07-19 10:15' },
    { id: 'tx003', type: 'Send', amount: '25.00', stablecoin: 'DAI', counterparty: 'Charlie', date: '2023-07-18 18:00' },
    { id: 'tx004', type: 'Receive', amount: '75.00', stablecoin: 'USDC', counterparty: 'David', date: '2023-07-18 09:45' },
    { id: 'tx005', type: 'Send', amount: '100.00', stablecoin: 'BUSD', counterparty: 'Eve', date: '2023-07-17 11:20' },
    { id: 'tx006', type: 'Receive', amount: '200.00', stablecoin: 'USDC', counterparty: 'Frank', date: '2023-07-16 16:00' },
    { id: 'tx007', type: 'Send', amount: '30.00', stablecoin: 'USDT', counterparty: 'Grace', date: '2023-07-15 13:10' },
    { id: 'tx008', type: 'Receive', amount: '90.00', stablecoin: 'DAI', counterparty: 'Heidi', date: '2023-07-14 08:55' },
    { id: 'tx009', type: 'Send', amount: '60.00', stablecoin: 'USDC', counterparty: 'Ivan', date: '2023-07-13 20:00' },
    { id: 'tx010', type: 'Receive', amount: '120.00', stablecoin: 'BUSD', counterparty: 'Judy', date: '2023-07-12 14:00' },
  ];

  // Filter transactions based on filterCurrency prop
  const transactions = filterCurrency
    ? allTransactions.filter(tx => tx.stablecoin === filterCurrency)
    : allTransactions;

  // Mock data for stablecoin volume over time for the graph (can be filtered too if needed)
  const graphData = [
    { name: 'Day 1', USDC: 400, USDT: 240, DAI: 100, BUSD: 200 },
    { name: 'Day 2', USDC: 300, USDT: 139, DAI: 200, BUSD: 150 },
    { name: 'Day 3', USDC: 200, USDT: 980, DAI: 300, BUSD: 250 },
    { name: 'Day 4', USDC: 278, USDT: 390, DAI: 278, BUSD: 180 },
    { name: 'Day 5', USDC: 189, USDT: 480, DAI: 189, BUSD: 300 },
    { name: 'Day 6', USDC: 239, USDT: 380, DAI: 239, BUSD: 220 },
    { name: 'Day 7', USDC: 349, USDT: 430, DAI: 349, BUSD: 280 },
  ];

  const pageTitle = filterCurrency ? `Transactions for ${filterCurrency} Wallet` : 'All Transactions';

  return (
    <div className="p-6">
      <h2 className="text-3xl font-extrabold text-gray-800 mb-6">{pageTitle}</h2>

      {/* Stablecoin Volume Graph */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 mb-8">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">Stablecoin Transaction Volume</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={graphData}
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
              <Line type="monotone" dataKey="USDC" stroke="#8884d8" strokeWidth={2} />
              <Line type="monotone" dataKey="USDT" stroke="#82ca9d" strokeWidth={2} />
              <Line type="monotone" dataKey="DAI" stroke="#ffc658" strokeWidth={2} />
              <Line type="monotone" dataKey="BUSD" stroke="#ff7300" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Latest Transactions Table */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">Latest Transactions</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tl-lg">
                  Transaction ID
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stablecoin
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Counterparty
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tr-lg">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transactions.map((tx) => (
                <tr key={tx.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{tx.id}</td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${tx.type === 'Send' ? 'text-red-600' : 'text-green-600'}`}>
                    {tx.type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {tx.type === 'Send' ? '-' : '+'}${tx.amount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{tx.stablecoin}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{tx.counterparty}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tx.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TransactionsPage;
