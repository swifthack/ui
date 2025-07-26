import React from 'react';

export default function CustomAlert({ open, onClose, type = 'error', message }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div className={`bg-white rounded-lg shadow-lg p-6 min-w-[300px] max-w-xs border ${type === 'error' ? 'border-red-400' : 'border-green-400'}`}> 
        <div className="flex items-center mb-4">
          <span className={`mr-2 text-lg ${type === 'error' ? 'text-red-600' : 'text-green-600'}`}>{type === 'error' ? '⛔' : '✅'}</span>
          <span className="font-semibold text-gray-800">{type === 'error' ? 'Error' : 'Success'}</span>
        </div>
        <div className="text-gray-700 mb-4">{message}</div>
        <button
          onClick={onClose}
          className={`w-full py-2 rounded bg-${type === 'error' ? 'red' : 'green'}-600 text-white hover:bg-${type === 'error' ? 'red' : 'green'}-700 transition-colors`}
        >
          Close
        </button>
      </div>
    </div>
  );
}
