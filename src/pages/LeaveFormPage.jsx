import React, { useState } from "react";
import axios from "axios";

const LeaveFormPage = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    role: "Driver",
    routeFrom: "",
    routeTo: "",
    fromDate: "",
    toDate: "",
    leaveType: "Casual Leave",
    reason: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const userData = JSON.parse(localStorage.getItem("tnstc-user"));

      const res = await axios.post("http://localhost:5000/api/leave/apply", {
        ...formData,
        userId: userData?.user?._id,
      });

      alert("Leave request submitted successfully!");
      setFormData({
        fullName: "",
        role: "Driver",
        routeFrom: "",
        routeTo: "",
        fromDate: "",
        toDate: "",
        leaveType: "Casual Leave",
        reason: "",
      });
    } catch (error) {
      console.error("Error submitting leave:", error);
      alert("Something went wrong. Please try again.");
    }
  };

 return (
  <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-xl p-6 rounded-2xl w-full max-w-xl space-y-5"
    >
      <h2 className="text-2xl font-bold text-indigo-600 text-center mb-4">
        Apply Leave
      </h2>

      {/* Name + Role */}
      <div className="flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          name="fullName"
          placeholder="Full Name"
          value={formData.fullName}
          onChange={handleChange}
          required
          className="w-full sm:w-1/2 border p-2 rounded"
        />

        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="w-full sm:w-1/2 border p-2 rounded"
        >
          <option>Driver</option>
          <option>Conductor</option>
        </select>
      </div>

      {/* Route From + To */}
      <div className="flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          name="routeFrom"
          placeholder="From (Place)"
          value={formData.routeFrom}
          onChange={handleChange}
          required
          className="w-full sm:w-1/2 border p-2 rounded"
        />
        <input
          type="text"
          name="routeTo"
          placeholder="To (Place)"
          value={formData.routeTo}
          onChange={handleChange}
          required
          className="w-full sm:w-1/2 border p-2 rounded"
        />
      </div>

      {/* From Date + To Date */}
      <div className="flex flex-col sm:flex-row gap-4">
        <input
          type="date"
          name="fromDate"
          value={formData.fromDate}
          onChange={handleChange}
          required
          className="w-full sm:w-1/2 border p-2 rounded"
        />
        <input
          type="date"
          name="toDate"
          value={formData.toDate}
          onChange={handleChange}
          required
          className="w-full sm:w-1/2 border p-2 rounded"
        />
      </div>

      {/* Leave Type */}
      <select
        name="leaveType"
        value={formData.leaveType}
        onChange={handleChange}
        className="w-full border p-2 rounded"
      >
        <option>Casual Leave</option>
        <option>Medical Leave</option>
        <option>Emergency Leave</option>
      </select>

      {/* Reason */}
      <textarea
        name="reason"
        value={formData.reason}
        onChange={handleChange}
        placeholder="Reason (optional)"
        rows="3"
        className="w-full border p-2 rounded"
      />

      <button
        type="submit"
        className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700"
      >
        Submit Leave Request
      </button>
    </form>
  </div>
);

};

export default LeaveFormPage;
