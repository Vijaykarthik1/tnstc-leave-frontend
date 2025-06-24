import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const LeaveAnalyticsPage = () => {
  const [stats, setStats] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/leave/monthly-stats');
        const formatted = res.data.map(item => ({
          month: new Date(2025, item._id - 1).toLocaleString('default', { month: 'short' }),
          total: item.total,
          approved: item.approved,
          rejected: item.rejected
        }));
        setStats(formatted);
      } catch (err) {
        console.error('Error fetching chart data:', err);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="bg-white max-w-5xl mx-auto shadow-xl p-6 rounded-xl">
        <h2 className="text-2xl font-bold text-center text-indigo-700 mb-4">
          Monthly Leave Analytics
        </h2>
        {stats.length > 0 ? (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={stats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="total" fill="#4f46e5" name="Total" />
              <Bar dataKey="approved" fill="#22c55e" name="Approved" />
              <Bar dataKey="rejected" fill="#ef4444" name="Rejected" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-center text-gray-500">No data to display.</p>
        )}
      </div>
    </div>
  );
};

export default LeaveAnalyticsPage;
