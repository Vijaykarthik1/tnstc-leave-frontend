import React, { useEffect, useState } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

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

  // ✅ Export to Excel
  const handleExportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(leaves.map(leave => ({
      Employee: leave.fullName,
      Route: `${leave.routeFrom} → ${leave.routeTo}`,
      Dates: `${new Date(leave.fromDate).toLocaleDateString()} - ${new Date(leave.toDate).toLocaleDateString()}`,
      Type: leave.leaveType,
      Reason: leave.reason || '',
      Reliever: leave.reliever || '',
      Status: leave.status,
    })));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Leave Report');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const fileData = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(fileData, 'Leave_Report.xlsx');
  };

  // ✅ Export to PDF
  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text('TNSTC Leave Report', 14, 10);
    autoTable(doc, {
      startY: 20,
      head: [['Employee', 'Route', 'Dates', 'Type', 'Reason', 'Reliever', 'Status']],
      body: leaves.map((leave) => [
        leave.fullName,
        `${leave.routeFrom} → ${leave.routeTo}`,
        `${new Date(leave.fromDate).toLocaleDateString()} - ${new Date(leave.toDate).toLocaleDateString()}`,
        leave.leaveType,
        leave.reason || '',
        leave.reliever || '',
        leave.status
      ]),
    });
    doc.save('Leave_Report.pdf');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-6xl mx-auto bg-white shadow-xl rounded-xl p-6">
        <h2 className="text-3xl font-bold text-indigo-600 mb-6 text-center">Admin Panel</h2>

        {/* Export Buttons */}
        <div className="flex justify-end gap-4 mb-4">
          <button
            onClick={handleExportExcel}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow"
          >
            Export to Excel
          </button>
          <button
            onClick={handleExportPDF}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded shadow"
          >
            Export to PDF
          </button>
        </div>

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

        {/* Leave Table */}
        {leaves.length === 0 ? (
          <p className="text-center text-gray-500">No leave requests found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="table-auto w-full border text-sm">
              <thead className="bg-indigo-100 text-indigo-700">
                <tr>
                  <th className="p-2">Employee</th>
                  <th className="p-2">Route</th>
                  <th className="p-2">Dates</th>
                  <th className="p-2">Type</th>
                  <th className="p-2">Reason</th>
                  <th className="p-2">Reliever</th>
                  <th className="p-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {leaves.map((leave) => (
                  <tr key={leave._id} className="text-center border-t">
                    <td className="p-2">{leave.fullName}</td>
                    <td className="p-2">{leave.routeFrom} → {leave.routeTo}</td>
                    <td className="p-2">
                      {new Date(leave.fromDate).toLocaleDateString()} -{' '}
                      {new Date(leave.toDate).toLocaleDateString()}
                    </td>
                    <td className="p-2">{leave.leaveType}</td>
                    <td className="p-2">{leave.reason || '—'}</td>
                    <td className="p-2">{leave.reliever || '—'}</td>
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
