import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const LeaveHistoryPage = () => {
  const [leaves, setLeaves] = useState([]);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [userId, setUserId] = useState('');

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('tnstc-user'));
    const uid = userData?.user?._id;
    setUserId(uid);
    if (uid) fetchLeaves(uid);
  }, []);

  const fetchLeaves = async (uid) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/leave/user/${uid}`);
      setLeaves(res.data);

      const latest = res.data[0];
      if (latest && latest.status !== 'Pending') {
        toast.info(`Your latest leave is ${latest.status}`, {
          toastId: 'latest-leave-status',
        });
      }
    } catch (error) {
      console.error('Error fetching leave history:', error);
    }
  };

  const filterLeaves = async () => {
    if (!fromDate || !toDate) return toast.warning('Please select both dates.');

    try {
      const res = await axios.get(
        `http://localhost:5000/api/leave/user/${userId}/filter?from=${fromDate}&to=${toDate}`
      );
      setLeaves(res.data);
    } catch (error) {
      console.error('Error filtering leave history:', error);
      toast.error('Failed to filter leaves');
    }
  };

  const handleCancelLeave = async (id) => {
    const confirmCancel = window.confirm('Are you sure you want to cancel this leave?');
    if (!confirmCancel) return;

    try {
      await axios.patch(`http://localhost:5000/api/leave/${id}/cancel`);
      toast.success('Leave cancelled successfully');
      fetchLeaves(userId);
    } catch (error) {
      console.error('Error cancelling leave:', error);
      toast.error('Failed to cancel leave');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-5xl mx-auto bg-white shadow-xl rounded-xl p-6">
        <h2 className="text-3xl font-bold text-indigo-600 mb-6 text-center">My Leave History</h2>

        {/* Date Range Filter */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-6">
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="border px-3 py-2 rounded"
          />
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="border px-3 py-2 rounded"
          />
          <button
            onClick={filterLeaves}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            Filter
          </button>
          <button
            onClick={() => fetchLeaves(userId)}
            className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
          >
            Clear
          </button>
        </div>

        {leaves.length === 0 ? (
          <p className="text-center text-gray-500">No leaves applied yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="table-auto w-full border text-sm sm:text-base">
              <thead className="bg-indigo-100 text-indigo-700">
                <tr>
                  <th className="p-3">From → To</th>
                  <th className="p-3">Route</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Reason</th>
                  <th className="p-3">Reliever</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {leaves.map((leave) => (
                  <tr key={leave._id} className="text-center border-t">
                    <td className="p-3">
                      {new Date(leave.fromDate).toLocaleDateString()} →{' '}
                      {new Date(leave.toDate).toLocaleDateString()}
                    </td>
                    <td className="p-3">{leave.routeFrom} → {leave.routeTo}</td>
                    <td className="p-3">{leave.leaveType}</td>
                    <td className="p-3">
                      <span
                        className={`px-3 py-1 rounded-full text-sm text-white font-semibold ${
                          leave.status === 'Approved'
                            ? 'bg-green-600'
                            : leave.status === 'Rejected'
                            ? 'bg-red-500'
                            : leave.status === 'Cancelled'
                            ? 'bg-gray-400'
                            : 'bg-yellow-500'
                        }`}
                      >
                        {leave.status}
                      </span>
                    </td>
                    <td className="p-3 break-words">{leave.reason || '—'}</td>
                    <td className="p-3">{leave.reliever || '—'}</td>
                    <td className="p-3">
                      {leave.status === 'Pending' && (
                        <button
                          onClick={() => handleCancelLeave(leave._id)}
                          className="text-white bg-red-500 px-3 py-1 rounded hover:bg-red-600 text-sm"
                        >
                          Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeaveHistoryPage;
