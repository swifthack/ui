import React, { useState, useEffect } from 'react';
import { PlusCircle, Edit, Shield, Trash2 } from 'lucide-react';
import CustomerFormModal from '../components/CustomerFormModal.jsx';

const CustomerManagementPage = ({ onSaveCustomer, onDeleteCustomer, onUpdateCustomerWallets }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState(null); // Holds data of customer being edited

  const handleAddCustomerClick = () => {
    setCurrentCustomer(null); // Clear any previous customer data for "Add" mode
    setIsModalOpen(true);
  };

  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/customers', {
      headers: {
        'accept': '*/*'
      }
    })
      .then((res) => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then((data) => {
        setCustomers(data.data || []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleEditCustomerClick = (customer) => {
    setCurrentCustomer(customer); // Set customer data for "Edit" mode
    setIsModalOpen(true);
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-extrabold text-gray-800 mb-6">Customer Management</h2>

      <div className="flex justify-end mb-4">
        <button
          onClick={handleAddCustomerClick}
          className="bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 flex items-center"
        >
          <PlusCircle size={20} className="mr-2" /> Add Customer
        </button>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">All Customers</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tl-lg">
                  Customer ID
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Organization
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  GLEI
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Wallets
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Login
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tr-lg">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {customers.map((customer) => (
                <tr key={customer.CUST_ID}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{customer.CUST_ID}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{customer.UserName || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{customer.email || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{customer.organization || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{customer.GLEI || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                      ${customer.status === 'Active' ? 'bg-green-100 text-green-800' :
                        customer.status === 'Suspended' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {customer.status || '-'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{customer.wallets || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{customer.last_login || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEditCustomerClick(customer)}
                      className="text-indigo-600 hover:text-indigo-900 mr-3 inline-flex items-center"
                      title="Edit Customer"
                    >
                      <Edit size={16} />
                    </button>
                    {customer.status === 'Active' ? (
                      <button
                        onClick={() => onUpdateCustomerWallets(customer.CUST_ID, 'suspend')} // Placeholder action
                        className="text-red-600 hover:text-red-900 mr-3 inline-flex items-center"
                        title="Suspend Customer"
                      >
                        <Shield size={16} />
                      </button>
                    ) : (
                      <button
                        onClick={() => onUpdateCustomerWallets(customer.CUST_ID, 'activate')} // Placeholder action
                        className="text-green-600 hover:text-green-900 mr-3 inline-flex items-center"
                        title="Activate Customer"
                      >
                        <Shield size={16} />
                      </button>
                    )}
                    <button
                      onClick={() => onDeleteCustomer(customer.CUST_ID)}
                      className="text-gray-600 hover:text-gray-900 inline-flex items-center"
                      title="Delete Customer"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Add/Edit Modal */}
      <CustomerFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        customerData={currentCustomer}
        onSave={onSaveCustomer}
      />
    </div>
  );
};

export default CustomerManagementPage;
