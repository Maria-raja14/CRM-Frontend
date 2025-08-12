


import React from "react";
import { useNavigate } from "react-router-dom";

export default function LeadTable() {
  const navigate = useNavigate();

  const leads = [
    {
      date: "Today",
      leadName: "Arjun Kumar",
      phoneNumber: "9876543210",
      email: "arjun@example.com",
      source: "Instagram",
      companyName: "Nil",
      status: "New",
      priorityLevel: "Warm",
      followUpDate: "2025-08-15T10:00:00.000Z",
    },
    {
      date: "Today",
      leadName: "Priya Sharma",
      phoneNumber: "9876501234",
      email: "priya@example.com",
      source: "LinkedIn",
      companyName: "ABC Pvt Ltd",
      status: "In Progress",
      priorityLevel: "Hot",
      followUpDate: "2025-08-18T14:00:00.000Z",
    },
    {
      date: "Today",
      leadName: "Ravi Kumar",
      phoneNumber: "9876598765",
      email: "ravi@example.com",
      source: "Facebook",
      companyName: "XYZ Traders",
      status: "New",
      priorityLevel: "Cold",
      followUpDate: "2025-08-20T09:30:00.000Z",
    },
  ];

  return (
    <div className="p-4">
      {/* Header controls */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <select className="border rounded px-2 py-1 text-sm">
            <option>10 Records per page</option>
          </select>
          <span className="text-sm">1 - {leads.length}</span>
        </div>
        <div className="flex gap-2">
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded"
            onClick={() => navigate("/createleads")}
          >
            Create Lead
          </button>
          <button className="border px-4 py-1 rounded hover:bg-gray-100">
            Actions
          </button>
        </div>
      </div>

      {/* Table layout */}
      <div className="flex border rounded overflow-hidden">
        {/* Fixed date column */}
        <table className="text-sm border-collapse">
          <thead>
            <tr>
              <th className="bg-gray-50 border-r p-2 w-20"></th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead, idx) => (
              <tr key={idx} className="border-b">
                <td className="bg-white border-r p-2 text-center">
                  <span className="bg-orange-100 text-orange-700 text-xs px-2 py-0.5 rounded">
                    {lead.date}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Scrollable data section */}
        <div className="overflow-x-auto w-full">
          <table className="min-w-full text-sm border-collapse">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-2">Lead Name</th>
                <th className="p-2">Phone Number</th>
                <th className="p-2">Email</th>
                <th className="p-2">Source</th>
                <th className="p-2">Company Name</th>
                <th className="p-2">Status</th>
                <th className="p-2">Priority Level</th>
                <th className="p-2">Follow Up Date</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead, idx) => (
                <tr key={idx} className="border-b hover:bg-gray-50">
                  <td className="p-2 whitespace-nowrap">{lead.leadName}</td>
                  <td className="p-2 whitespace-nowrap">{lead.phoneNumber}</td>
                  <td className="p-2 text-blue-600 whitespace-nowrap">
                    {lead.email}
                  </td>
                  <td className="p-2 whitespace-nowrap">{lead.source}</td>
                  <td className="p-2 whitespace-nowrap">{lead.companyName}</td>
                  <td className="p-2 whitespace-nowrap">{lead.status}</td>
                  <td className="p-2 whitespace-nowrap">
                    {lead.priorityLevel}
                  </td>
                  <td className="p-2 whitespace-nowrap">
                    {new Date(lead.followUpDate).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
