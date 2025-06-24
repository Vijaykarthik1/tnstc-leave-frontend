import React, { useEffect, useState } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const AdminPanelPage = () => {
  const [leaves, setLeaves] = useState([]);
  const [filteredLeaves, setFilteredLeaves] = useState([]);
  const [summary, setSummary] = useState({ total: 0, approved: 0, pending: 0, rejected: 0 });

  const [relievers, setRelievers] = useState({});
  const relieverOptions = ['Ravi Kumar', 'Sathish M', 'Arunraj D', 'Karthick S'];

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  // User popup
  const [selectedUser, setSelectedUser] = useState(null);
  const [userStats, setUserStats] = useState(null);

  const fetchLeaves = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/leave/all');
      setLeaves(res.data);
      setFilteredLeaves(res.data);
    } catch (error) {
      console.error('Error fetching leave requests:', error);
    }
  };

  const fetchSummary = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/leave/summary');
      setSummary(res.data);
    } catch (err) {
      console.error('Error fetching summary:', err);
    }
  };

  const fetchUserStats = (userId) => {
    const userLeaves = leaves.filter((leave) => leave.userId === userId);
    const totalApplied = userLeaves.length;
    const approved = userLeaves.filter((l) => l.status === 'Approved').length;
    const rejected = userLeaves.filter((l) => l.status === 'Rejected').length;
    setUserStats({ totalApplied, approved, rejected });
  };

  const openUserPopup = (leave) => {
    setSelectedUser(leave);
    fetchUserStats(leave.userId);
  };

  useEffect(() => {
    fetchLeaves();
    fetchSummary();
  }, []);

  useEffect(() => {
    let filtered = leaves;

    if (searchTerm) {
      filtered = filtered.filter((leave) =>
        leave.fullName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter) {
      filtered = filtered.filter((leave) => leave.status === statusFilter);
    }

    setFilteredLeaves(filtered);
    setCurrentPage(1);
  }, [searchTerm, statusFilter, leaves]);

  const updateStatus = async (id, newStatus) => {
    const reliever = relievers[id];

    if (newStatus === 'Approved' && !reliever) {
      alert('Please select a reliever before approving.');
      return;
    }

    try {
      await axios.patch(`http://localhost:5000/api/leave/${id}/status`, {
        status: newStatus,
        reliever: newStatus === 'Approved' ? reliever : '',
      });

      fetchLeaves();
      fetchSummary();
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update leave. Please try again.');
    }
  };

  const exportToExcel = () => {
    const data = filteredLeaves.map((leave) => ({
      Name: leave.fullName,
      Route: `${leave.routeFrom} → ${leave.routeTo}`,
      Dates: `${new Date(leave.fromDate).toLocaleDateString()} - ${new Date(
        leave.toDate
      ).toLocaleDateString()}`,
      Type: leave.leaveType,
      Reason: leave.reason,
      Status: leave.status,
      Reliever: leave.reliever || '',
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Leave Report');
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const file = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(file, 'LeaveReport.xlsx');
  };

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredLeaves.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(filteredLeaves.length / recordsPerPage);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-6xl mx-auto bg-white shadow-xl rounded-xl p-6">
        <h2 className="text-3xl font-bold text-indigo-600 mb-6 text-center">Admin Panel</h2>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6 text-white text-center">
          {['Total Requests', 'Approved', 'Pending', 'Rejected'].map((label, i) => {
            const color = ['bg-blue-600', 'bg-green-500', 'bg-yellow-500', 'bg-red-500'][i];
            const value = [summary.total, summary.approved, summary.pending, summary.rejected][i];
            return (
              <div key={label} className={`${color} p-4 rounded-lg shadow`}>
                <h3 className="text-xl font-bold">{value}</h3>
                <p>{label}</p>
              </div>
            );
          })}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
          <input
            type="text"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border rounded px-3 py-2 w-full sm:w-1/2"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border rounded px-3 py-2 w-full sm:w-1/3"
          >
            <option value="">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
          <button
            onClick={exportToExcel}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            Export Excel
          </button>
        </div>

        {/* Table */}
        {currentRecords.length === 0 ? (
          <p className="text-center text-gray-500">No matching leave records.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="table-auto w-full border text-sm">
              <thead className="bg-indigo-100 text-indigo-700">
                <tr>
                  <th className="p-2">User</th>
                  <th className="p-2">Route</th>
                  <th className="p-2">Dates</th>
                  <th className="p-2">Type</th>
                  <th className="p-2">Reason</th>
                  <th className="p-2">Reliever</th>
                  <th className="p-2">Status</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentRecords.map((leave) => (
                  <tr key={leave._id} className="border-t text-center">
                    <td className="p-2 flex items-center gap-2 justify-center">
                      <img
                        src={leave.profilePhoto || 'https://ui-avatars.com/api/?name=' + leave.fullName}
                        className="w-8 h-8 rounded-full cursor-pointer border"
                        alt="profile"
                        onClick={() => openUserPopup(leave)}
                      />
                      <span>{leave.fullName}</span>
                    </td>
                    <td className="p-2">{leave.routeFrom} → {leave.routeTo}</td>
                    <td className="p-2">
                      {new Date(leave.fromDate).toLocaleDateString()} -{' '}
                      {new Date(leave.toDate).toLocaleDateString()}
                    </td>
                    <td className="p-2">{leave.leaveType}</td>
                    <td className="p-2">{leave.reason || '—'}</td>
                    <td className="p-2">
                      {leave.status === 'Pending' ? (
                        <select
                          value={relievers[leave._id] || ''}
                          onChange={(e) =>
                            setRelievers({ ...relievers, [leave._id]: e.target.value })
                          }
                          className="border rounded px-2 py-1 text-sm"
                        >
                          <option value="">Select</option>
                          {relieverOptions.map((name) => (
                            <option key={name} value={name}>
                              {name}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <span>{leave.reliever || '—'}</span>
                      )}
                    </td>
                    <td className="p-2">
                      <span
                        className={`px-2 py-1 rounded text-white text-sm ${
                          leave.status === 'Approved'
                            ? 'bg-green-500'
                            : leave.status === 'Rejected'
                            ? 'bg-red-500'
                            : 'bg-yellow-500'
                        }`}
                      >
                        {leave.status}
                      </span>
                    </td>
                    <td className="p-2 space-x-2">
                      <button
                        onClick={() => updateStatus(leave._id, 'Approved')}
                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => updateStatus(leave._id, 'Rejected')}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="flex justify-center mt-4 gap-4">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <span className="self-center">Page {currentPage} of {totalPages}</span>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* User Info Popup */}
      {selectedUser && userStats && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl p-6 w-80 text-center shadow-xl relative">
            <button
              onClick={() => setSelectedUser(null)}
              className="absolute top-2 right-3 text-gray-500 text-xl font-bold"
            >
              ×
            </button>
            <img
              src={selectedUser.profilePhoto || 'https://ui-avatars.com/api/?name=' + selectedUser.fullName}
              className="w-24 h-24 rounded-full mx-auto mb-4 border"
              alt="User"
            />
            <h3 className="text-lg font-bold">{selectedUser.fullName}</h3>
            <p className="text-sm text-gray-600 mb-4 capitalize">{selectedUser.role}</p>

            <div className="text-left space-y-1 text-sm">
              <p>Total Applied: <strong>{userStats.totalApplied}</strong></p>
              <p>Approved: <strong>{userStats.approved}</strong></p>
              <p>Rejected: <strong>{userStats.rejected}</strong></p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanelPage;
