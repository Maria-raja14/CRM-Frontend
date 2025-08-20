import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { Pencil, MoreVertical, Trash2 } from "lucide-react";
import { initSocket } from "../../utils/socket";

export default function LeadTable() {
  const navigate = useNavigate();
  const [leads, setLeads] = useState([]);
  const [selectedLeads, setSelectedLeads] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [leadToDelete, setLeadToDelete] = useState(null);
  const [loading, setLoading] = useState(true);

  // Follow-up state
  const [currentLeadId, setCurrentLeadId] = useState(null);
  const [nextFollowUp, setNextFollowUp] = useState("");
  const [showFollowUpModal, setShowFollowUpModal] = useState(false);


    useEffect(() => {
    // ✅ Initialize socket
    initSocket();
  }, []);
  // Fetch leads from API
  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/leads/getAllLead"
        );
        const data = await response.json();
        setLeads(data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };
    fetchLeads();
  }, []);

  const saveFollowUp = async () => {
    if (!nextFollowUp || !currentLeadId) return;
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `http://localhost:5000/api/leads/${currentLeadId}/followup`,
        { followUpDate: nextFollowUp },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Next follow-up updated");

      setLeads((prev) =>
        prev.map((lead) =>
          lead._id === currentLeadId
            ? { ...lead, followUpDate: nextFollowUp }
            : lead
        )
      );
      setCurrentLeadId(null);
      setNextFollowUp("");
    } catch (err) {
      toast.error("Failed to update follow-up");
    }
  };

  const handleDeleteLead = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/leads/deleteLead/${id}`,
        { method: "DELETE" }
      );
      if (response.ok) {
        setLeads(leads.filter((lead) => lead._id !== id));
        toast.success("Lead deleted successfully");
      } else {
        toast.error("Failed to delete lead");
      }
    } catch {
      toast.error("Error deleting lead");
    } finally {
      setShowDeleteModal(false);
    }
  };

  const handleBulkDelete = async () => {
    try {
      const responses = await Promise.all(
        selectedLeads.map((id) =>
          fetch(`http://localhost:5000/api/leads/deleteLead/${id}`, {
            method: "DELETE",
          })
        )
      );
      const allSuccess = responses.every((res) => res.ok);
      if (allSuccess) {
        setLeads(leads.filter((lead) => !selectedLeads.includes(lead._id)));
        setSelectedLeads([]);
        toast.success(`${selectedLeads.length} leads deleted successfully`);
      } else {
        toast.error("Failed to delete some leads");
      }
    } catch {
      toast.error("Error deleting leads");
    } finally {
      setShowDeleteModal(false);
    }
  };

  const handleSelectLead = (id) => {
    setSelectedLeads((prev) =>
      prev.includes(id) ? prev.filter((leadId) => leadId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedLeads(leads.map((lead) => lead._id));
    } else {
      setSelectedLeads([]);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status) => {
    const classes = {
      Hot: "bg-red-100 text-red-800",
      Warm: "bg-yellow-100 text-yellow-800",
      Cold: "bg-blue-100 text-blue-800",
    };
    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${
          classes[status] || "bg-gray-100 text-gray-800"
        }`}
      >
        {status}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
   <div className="p-2 ">
  {/* Header */}
  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
    <h2 className="text-xl font-semibold text-gray-800">Leads</h2>
    <div className="flex gap-3">
      {selectedLeads.length > 0 && (
        <button
          onClick={() => {
            setLeadToDelete(null);
            setShowDeleteModal(true);
          }}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow transition"
        >
          Delete Selected ({selectedLeads.length})
        </button>
      )}
      <button
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow transition"
        onClick={() => navigate("/createleads")}
      >
        + Create Lead
      </button>
    </div>
  </div>

  {/* Table */}
  <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
    <table className="min-w-full text-sm text-gray-700">
      <thead className="bg-gray-100 sticky top-0 shadow-sm">
        <tr>
          <th className="px-6 py-3 text-left">
            <input
              type="checkbox"
              className="h-4 w-4 text-blue-600 border-gray-300 rounded"
              checked={selectedLeads.length === leads.length && leads.length > 0}
              onChange={handleSelectAll}
            />
          </th>
          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
            Lead
          </th>
          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
            Contact
          </th>
          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
            Company
          </th>
          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
            Source
          </th>
          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
            Status
          </th>
          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
            Created
          </th>
          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
            Follow Up
          </th>
          <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
            Actions
          </th>
        </tr>
      </thead>

      <tbody className="divide-y divide-gray-200">
        {leads.length > 0 ? (
          leads.map((lead, idx) => (
            <tr
              key={lead._id}
              className={`transition hover:bg-blue-50 ${
                idx % 2 === 0 ? "bg-white" : "bg-gray-50"
              }`}
            >
              {/* Checkbox */}
              <td className="px-6 py-4">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                  checked={selectedLeads.includes(lead._id)}
                  onChange={() => handleSelectLead(lead._id)}
                />
              </td>

              {/* Lead Name */}
              <td className="px-6 py-4 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center shadow-sm">
                  <span className="text-blue-600 font-semibold">
                    {lead.leadName.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <div className="font-medium text-gray-900">
                    {lead.leadName}
                  </div>
                  <div className="text-xs text-gray-500">
                    {lead.email}
                  </div>
                </div>
              </td>

              {/* Contact */}
              <td className="px-6 py-4">
                <div className="text-gray-800">{lead.phoneNumber}</div>
              </td>

              {/* Company */}
              <td className="px-6 py-4 text-gray-600">
                {lead.companyName || "-"}
              </td>

              {/* Source */}
              <td className="px-6 py-4 text-gray-600">{lead.source || "-"}</td>

              {/* Status */}
              <td className="px-6 py-4">{getStatusBadge(lead.status)}</td>

              {/* Created Date */}
              <td className="px-6 py-4 text-gray-600">
                {lead.createdAt ? formatDate(lead.createdAt) : "-"}
              </td>

              {/* Follow-up */}
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <span className="text-gray-700">
                    {lead.followUpDate
                      ? formatDateTime(lead.followUpDate)
                      : "No follow-up"}
                  </span>
                  <button
                    onClick={() => {
                      setCurrentLeadId(lead._id);
                      setNextFollowUp(
                        lead.followUpDate
                          ? new Date(lead.followUpDate)
                              .toISOString()
                              .slice(0, 16)
                          : ""
                      );
                      setShowFollowUpModal(true);
                    }}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                </div>
              </td>

              {/* Actions */}
              <td className="px-6 py-4 text-right">
                <button className="p-2 rounded-lg hover:bg-gray-200 transition">
                  <MoreVertical className="w-5 h-5 text-gray-600" />
                </button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td
              colSpan="9"
              className="px-6 py-8 text-center text-gray-500 text-sm"
            >
              No leads found. Create your first lead!
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
</div>

  );
}
