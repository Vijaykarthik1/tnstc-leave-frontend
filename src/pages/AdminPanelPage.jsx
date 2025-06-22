import React, { useEffect, useState } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const AdminPanelPage = () => {
  const [leaves, setLeaves] = useState([]);
  const [summary, setSummary] = useState({
    total: 0,
    approved: 0,
    pending: 0,
    rejected: 0,
  });

  const fetchLeaves = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/leave/all');
      setLeaves(res.data);
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

  useEffect(() => {
    fetchLeaves();
    fetchSummary();
  }, []);

  const updateStatus = async (id, newStatus) => {
    try {
      await axios.patch(`http://localhost:5000/api/leave/${id}/status`, { status: newStatus });
      fetchLeaves();
      fetchSummary();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const exportToExcel = () => {
    const exportData = leaves.map((leave) => ({
      Employee: leave.fullName,
      Route: `${leave.routeFrom} → ${leave.routeTo}`,
      From: new Date(leave.fromDate).toLocaleDateString(),
      To: new Date(leave.toDate).toLocaleDateString(),
      Type: leave.leaveType,
      Reason: leave.reason || '—',
      Status: leave.status,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Leaves');

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(data, 'leave-requests.xlsx');
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    const tableColumn = ['Employee', 'Route', 'From', 'To', 'Type', 'Reason', 'Status'];
    const tableRows = leaves.map((leave) => [
      leave.fullName,
      `${leave.routeFrom} → ${leave.routeTo}`,
      new Date(leave.fromDate).toLocaleDateString(),
      new Date(leave.toDate).toLocaleDateString(),
      leave.leaveType,
      leave.reason || '—',
      leave.status,
    ]);

    doc.text('TNSTC Leave Requests Report', 14, 15);
    doc.autoTable({
      startY: 20,
      head: [tableColumn],
      body: tableRows,
      styles: { fontSize: 8 },
    });

    doc.save('leave-requests.pdf');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-6xl mx-auto bg-white shadow-xl rounded-xl p-6">
        <h2 className="text-3xl font-bold text-indigo-600 mb-6 text-center">Admin Panel</h2>

        {/* Analytics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6 text-white text-center">
          <div className="bg-blue-600 p-4 rounded-lg shadow">
            <h3 className="text-xl font-bold">{summary.total}</h3>
            <p>Total Requests</p>
          </div>
          <div className="bg-green-500 p-4 rounded-lg shadow">
            <h3 className="text-xl font-bold">{summary.approved}</h3>
            <p>Approved</p>
          </div>
          <div className="bg-yellow-500 p-4 rounded-lg shadow">
            <h3 className="text-xl font-bold">{summary.pending}</h3>
            <p>Pending</p>
          </div>
          <div className="bg-red-500 p-4 rounded-lg shadow">
            <h3 className="text-xl font-bold">{summary.rejected}</h3>
            <p>Rejected</p>
          </div>
        </div>

        {/* Export Buttons */}
        <div className="flex justify-end gap-4 mb-4">
          <button
            onClick={exportToExcel}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            📥 Export to Excel
          </button>
          <button
            onClick={exportToPDF}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            📄 Export to PDF
          </button>
        </div>

        {/* Leave Table */}
        {leaves.length === 0 ? (
          <p className="text-center text-gray-500">No leave requests found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="table-auto w-full border">
              <thead className="bg-indigo-100 text-indigo-700">
                <tr>
                  <th className="p-2">Employee</th>
                  <th className="p-2">Route</th>
                  <th className="p-2">Dates</th>
                  <th className="p-2">Type</th>
                  <th className="p-2">Reason</th>
                  <th className="p-2">Status</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {leaves.map((leave) => (
                  <tr key={leave._id} className="border-t text-center">
                    <td className="p-2">{leave.fullName}</td>
                    <td className="p-2">{leave.routeFrom} → {leave.routeTo}</td>
                    <td className="p-2">
                      {new Date(leave.fromDate).toLocaleDateString()} -{' '}
                      {new Date(leave.toDate).toLocaleDateString()}
                    </td>
                    <td className="p-2">{leave.leaveType}</td>
                    <td className="p-2">{leave.reason || '—'}</td>
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
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanelPage;
