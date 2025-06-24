// components/UserStatsModal.jsx
import React from 'react';

const UserStatsModal = ({ user, stats, onClose }) => {
  if (!user || !stats) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-lg p-6 w-80 relative">
        <button className="absolute top-2 right-2 text-gray-600" onClick={onClose}>✕</button>

        <img src={user.profilePhoto || 'https://ui-avatars.com/api/?name=TNSTC'} className="w-20 h-20 rounded-full mx-auto border" alt="Profile" />
        <h2 className="text-xl font-semibold text-center mt-2">{user.name}</h2>
        <p className="text-sm text-center text-gray-500 mb-4 capitalize">{user.role}</p>

        <div className="space-y-2 text-center">
          <p>Total Applied: <strong>{stats.total}</strong></p>
          <p>Approved: <strong>{stats.approved}</strong></p>
          <p>Rejected: <strong>{stats.rejected}</strong></p>
        </div>
      </div>
    </div>
  );
};

export default UserStatsModal;
