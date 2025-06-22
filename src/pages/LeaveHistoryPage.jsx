import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify'; // 👈 for notification

const LeaveHistoryPage = () => {
  const [leaves, setLeaves] = useState([]);

  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem('tnstc-user'));
        const res = await axios.get(`http://localhost:5000/api/leave/user/${userData?.user?._id}`);
        setLeaves(res.data);

        // 🔔 Show toast for latest leave status (if not pending)
        const latestLeave = res.data[res.data.length - 1];
        if (latestLeave && latestLeave.status !== 'Pending') {
          toast.info(`Your latest leave is ${latestLeave.status}`, {
            toastId: 'latest-leave-status'
          });
        }
      } catch (error) {
        console.error('Error fetching leave history:', error);
      }
    };

    fetchLeaves();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-5xl mx-auto bg-white shadow-xl rounded-xl p-6">
        <h2 className="text-3xl font-bold text-indigo-600 mb-6 text-center">My Leave History</h2>

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
                            : 'bg-yellow-500'
                        }`}
                      >
                        {leave.status}
                      </span>
                    </td>
                    <td className="p-3 break-words">{leave.reason || '—'}</td>
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
