// src/pages/Leads/Leads.jsx (or Leads.jsx)
// FULL UPDATED FRONTEND CODE (with inline follow-up calendar update)

import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { TourProvider, useTour } from "@reactour/tour";

import {
  MoreVertical,
  Trash2,
  Edit,
  Handshake,
  Search,
  Plus,
  Eye,
  Calendar,
} from "lucide-react";

import { initSocket } from "../../utils/socket";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";

const API_URL = import.meta.env.VITE_API_URL;

const tourSteps = [
  {
    selector: ".tour-lead-header",
    content:
      "Welcome to the Leads Management page! Here you can view, manage, and convert your leads.",
  },
  {
    selector: ".tour-create-lead",
    content:
      "Click here to create a new lead. You'll be able to add all the necessary details about a potential customer.",
  },
  {
    selector: ".tour-search",
    content:
      "Use this search bar to quickly find leads by name, email, phone, company, or source.",
  },
  {
    selector: ".tour-filters",
    content:
      "Filter your leads by status, assignee, or source to focus on specific segments of your pipeline.",
  },
  {
    selector: ".tour-lead-table",
    content:
      "This is your leads table. It shows all your leads with their key information and status.",
  },
  {
    selector: ".tour-checkbox",
    content:
      "Select individual leads by checking these boxes, or use the header checkbox to select all visible leads.",
  },
  {
    selector: ".tour-lead-actions",
    content:
      "Click the three-dot menu to edit, convert, or delete a lead. Converting a lead turns it into a deal.",
  },
  {
    selector: ".tour-finish",
    content:
      "You've completed the tour! Click here anytime to review the features again.",
  },
];

function LeadTableComponent() {
  const navigate = useNavigate();
  const { setIsOpen } = useTour();

  const [leads, setLeads] = useState([]);
  const [allLeads, setAllLeads] = useState([]);
  const [selectedLeads, setSelectedLeads] = useState([]);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [leadToDelete, setLeadToDelete] = useState(null);

  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalLeads, setTotalLeads] = useState(0);
  const itemsPerPage = 10;

  const [menuOpen, setMenuOpen] = useState(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 1 });

  const [userRole, setUserRole] = useState("");

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [assigneeFilter, setAssigneeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sourceFilter, setSourceFilter] = useState("");
  const [assignees, setAssignees] = useState([]);

  // Convert Deal Modal
  const [convertModalOpen, setConvertModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [converting, setConverting] = useState(false);

  const [dealData, setDealData] = useState({
    value: 0,
    currency: "USD",
    notes: "",
    stage: "Qualification",
  });

  // ✅ Inline follow-up editor state
  const dateInputRefs = useRef({});
  const [editingFollowUpId, setEditingFollowUpId] = useState(null);
  const [followUpSavingId, setFollowUpSavingId] = useState(null);

  const startTour = () => setIsOpen(true);

  // user role
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData);
      setUserRole(user.role?.name || "");
    }
  }, []);

  // currencies
  const allowedCurrencies = [
    { code: "USD", symbol: "$", name: "US Dollar" },
    { code: "EUR", symbol: "€", name: "Euro" },
    { code: "INR", symbol: "₹", name: "Indian Rupee" },
    { code: "GBP", symbol: "£", name: "British Pound" },
    { code: "JPY", symbol: "¥", name: "Japanese Yen" },
    { code: "AUD", symbol: "A$", name: "Australian Dollar" },
    { code: "CAD", symbol: "C$", name: "Canadian Dollar" },
    { code: "CHF", symbol: "CHF", name: "Swiss Franc" },
    { code: "MYR", symbol: "RM", name: "Malaysian Ringgit" },
    { code: "AED", symbol: "د.إ", name: "UAE Dirham" },
    { code: "SGD", symbol: "S$", name: "Singapore Dollar" },
    { code: "ZAR", symbol: "R", name: "South African Rand" },
    { code: "SAR", symbol: "﷼", name: "Saudi Riyal" },
  ];

  useEffect(() => {
    initSocket();
  }, []);

  // fetch leads
  useEffect(() => {
    const fetchLeads = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        const params = new URLSearchParams();
        params.append("page", currentPage);
        params.append("limit", itemsPerPage);

        const response = await axios.get(
          `${API_URL}/leads/getAllLead?${params.toString()}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const leadsData = response.data?.leads || response.data || [];
        setLeads(leadsData);
        setAllLeads(leadsData);

        setTotalPages(response.data?.totalPages || 1);
        setTotalLeads(response.data?.totalLeads || leadsData.length || 0);

        const uniqueAssignees = [
          ...new Set(
            leadsData
              .filter((lead) => lead.assignTo)
              .map((lead) => {
                if (
                  typeof lead.assignTo === "object" &&
                  lead.assignTo.firstName
                ) {
                  return `${lead.assignTo.firstName} ${lead.assignTo.lastName}`;
                }
                return "Assigned User";
              })
          ),
        ];
        setAssignees(uniqueAssignees);
      } catch (error) {
        console.error("Error fetching leads:", error);
        toast.error("Failed to fetch leads");
      } finally {
        setLoading(false);
      }
    };

    fetchLeads();
  }, [currentPage]);

  // filters
  useEffect(() => {
    const filtered = allLeads.filter((lead) => {
      const q = searchQuery.toLowerCase();

      const matchesSearch =
        !searchQuery ||
        lead.leadName?.toLowerCase().includes(q) ||
        lead.email?.toLowerCase().includes(q) ||
        lead.phoneNumber?.includes(searchQuery) ||
        lead.companyName?.toLowerCase().includes(q) ||
        lead.source?.toLowerCase().includes(q);

      const matchesAssignee =
        !assigneeFilter ||
        (lead.assignTo &&
          ((typeof lead.assignTo === "object" &&
            lead.assignTo.firstName &&
            `${lead.assignTo.firstName} ${lead.assignTo.lastName}` ===
              assigneeFilter) ||
            (typeof lead.assignTo === "string" &&
              assigneeFilter === "Assigned User")));

      const matchesStatus = !statusFilter || lead.status === statusFilter;
      const matchesSource = !sourceFilter || lead.source === sourceFilter;

      return matchesSearch && matchesAssignee && matchesStatus && matchesSource;
    });

    setLeads(filtered);
    setCurrentPage(1);
  }, [searchQuery, assigneeFilter, statusFilter, sourceFilter, allLeads]);

  const handleMenuToggle = (leadId, e) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    const menuHeight = 120;
    const viewportHeight = window.innerHeight;

    let top = rect.bottom + window.scrollY + 4;
    let left = rect.right + window.scrollX - 160;

    if (rect.bottom + menuHeight > viewportHeight) {
      top = rect.top + window.scrollY - menuHeight - 4;
    }

    setMenuPosition({ top, left });
    setMenuOpen(menuOpen === leadId ? null : leadId);
  };

  const handleEdit = (leadId) => {
    navigate(`/createleads?id=${leadId}`);
    setMenuOpen(null);
  };

  const handleDeleteClick = (leadId) => {
    setLeadToDelete(leadId);
    setShowDeleteModal(true);
    setMenuOpen(null);
  };

  const handleDeleteLead = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(`${API_URL}/leads/deleteLead/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        setLeads((prev) => prev.filter((lead) => lead._id !== id));
        setAllLeads((prev) => prev.filter((lead) => lead._id !== id));
        toast.success("Lead deleted successfully");
        if (leads.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
      } else {
        toast.error("Failed to delete lead");
      }
    } catch (error) {
      toast.error("Error deleting lead");
    } finally {
      setShowDeleteModal(false);
      setLeadToDelete(null);
    }
  };

  const handleBulkDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      const responses = await Promise.all(
        selectedLeads.map((id) =>
          axios.delete(`${API_URL}/leads/deleteLead/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
        )
      );

      const allSuccess = responses.every((res) => res.status === 200);
      if (allSuccess) {
        setLeads((prev) => prev.filter((l) => !selectedLeads.includes(l._id)));
        setAllLeads((prev) =>
          prev.filter((l) => !selectedLeads.includes(l._id))
        );
        toast.success(`${selectedLeads.length} leads deleted successfully`);
        setSelectedLeads([]);
        if (leads.length === selectedLeads.length && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
      } else {
        toast.error("Failed to delete some leads");
      }
    } catch (error) {
      toast.error("Error deleting leads");
    } finally {
      setShowDeleteModal(false);
    }
  };

  const handleSelectLead = (id) => {
    setSelectedLeads((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) setSelectedLeads(leads.map((l) => l._id));
    else setSelectedLeads([]);
  };

  // Convert Modal
  const openConvertModal = (lead) => {
    setSelectedLead(lead);
    setDealData({
      value: lead.value || 0,
      currency: lead.currency || "USD",
      notes: lead.notes || "",
      stage: "Qualification",
    });
    setConvertModalOpen(true);
    setMenuOpen(null);
  };

  const handleDealFieldChange = (field, value) => {
    setDealData((prev) => ({ ...prev, [field]: value }));
  };

  const handleConvertDeal = async () => {
    if (!selectedLead) return;

    try {
      setConverting(true);
      const token = localStorage.getItem("token");
      const toastId = toast.loading("Converting lead to deal...");

      const response = await axios.patch(
        `${API_URL}/leads/${selectedLead._id}/convert`,
        { ...dealData },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.update(toastId, {
        render: response.data.message || "Lead converted to deal successfully",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });

      setLeads((prev) => prev.filter((l) => l._id !== selectedLead._id));
      setAllLeads((prev) => prev.filter((l) => l._id !== selectedLead._id));

      setConvertModalOpen(false);
      setSelectedLead(null);
    } catch (err) {
      toast.dismiss();
      toast.error(
        err.response?.data?.message || "Conversion failed. Please try again."
      );
    } finally {
      setConverting(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const toDateInputValue = (dateString) => {
    if (!dateString) return "";
    const d = new Date(dateString);
    return new Date(d.getTime() - d.getTimezoneOffset() * 60000)
      .toISOString()
      .split("T")[0];
  };

  // ✅ Follow-up API update (MUST MATCH BACKEND ROUTE: PATCH /leads/:id/followup)
  const updateFollowUpDateInline = async (leadId, newDate) => {
    if (!newDate) return;

    try {
      setFollowUpSavingId(leadId);
      const token = localStorage.getItem("token");

      await axios.patch(
        `${API_URL}/leads/${leadId}/followup`,
        { followUpDate: newDate },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const patch = (list) =>
        list.map((l) => (l._id === leadId ? { ...l, followUpDate: newDate } : l));

      setLeads((prev) => patch(prev));
      setAllLeads((prev) => patch(prev));

      toast.success("Follow-up date updated");
    } catch (err) {
      console.error("Follow-up update error:", err);
      toast.error(
        err.response?.data?.message || "Failed to update follow-up date"
      );
    } finally {
      setFollowUpSavingId(null);
      setEditingFollowUpId(null);
    }
  };

  // ✅ open calendar
  const openFollowUpPicker = (leadId) => {
    setEditingFollowUpId(leadId);

    setTimeout(() => {
      const el = dateInputRefs.current[leadId];
      if (!el) return;

      el.focus();
      el.click(); // helps some browsers

      if (typeof el.showPicker === "function") {
        el.showPicker();
      }
    }, 0);
  };

  const handleStatusChange = async (leadId, newStatus) => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.patch(
        `${API_URL}/leads/${leadId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.status === 200) {
        setLeads((prev) =>
          prev.map((l) => (l._id === leadId ? { ...l, status: newStatus } : l))
        );
        setAllLeads((prev) =>
          prev.map((l) => (l._id === leadId ? { ...l, status: newStatus } : l))
        );
        toast.success("Status updated successfully");
      }
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const statusClasses = {
    Hot: "bg-red-50 text-red-700 border-red-200 hover:bg-red-100",
    Warm: "bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100",
    Cold: "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100",
    Junk: "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100",
    Converted: "bg-green-50 text-green-700 border-green-200 hover:bg-green-100",
  };

  const getStatusSelectClass = (status) => {
    return `w-full px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-1 ${
      statusClasses[status] ||
      "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
    } ${
      status === "Hot"
        ? "focus:ring-red-300"
        : status === "Warm"
        ? "focus:ring-yellow-300"
        : status === "Cold"
        ? "focus:ring-blue-300"
        : status === "Junk"
        ? "focus:ring-gray-300"
        : "focus:ring-green-300"
    }`;
  };

  useEffect(() => {
    const handleClickOutside = () => setMenuOpen(null);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) setCurrentPage(newPage);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        newestOnTop
        closeOnClick
        draggable
        pauseOnHover
        theme="light"
      />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div className="tour-lead-header">
          <h2 className="text-2xl font-bold text-gray-800">Leads</h2>
        </div>

        <div className="flex flex-wrap gap-3 items-center">
          <button
            onClick={startTour}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 tour-finish"
          >
            <Eye className="w-4 h-4" /> Take Tour
          </button>

          {selectedLeads.length > 0 && (
            <button
              onClick={() => {
                setLeadToDelete(null);
                setShowDeleteModal(true);
              }}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Delete Selected ({selectedLeads.length})
            </button>
          )}

          {(userRole === "Admin" || userRole === "Sales") && (
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow flex items-center gap-2 tour-create-lead"
              onClick={() => navigate("/createleads")}
            >
              <Plus className="w-4 h-4" /> Create Lead
            </button>
          )}
        </div>
      </div>

      {/* Search & Filters */}
      <div className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 tour-filters">
          <div className="relative w-full tour-search">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search leads..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {userRole === "Admin" && (
            <div>
              <select
                value={assigneeFilter}
                onChange={(e) => setAssigneeFilter(e.target.value)}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="">All Assignees</option>
                {assignees.map((assignee, idx) => (
                  <option key={idx} value={assignee}>
                    {assignee}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="">All Status</option>
              <option value="Hot">Hot</option>
              <option value="Warm">Warm</option>
              <option value="Cold">Cold</option>
              <option value="Junk">Junk</option>
              <option value="Converted">Converted</option>
            </select>
          </div>

          <div>
            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="">All Sources</option>
              <option value="Website">Website</option>
              <option value="Referral">Referral</option>
              <option value="Social Media">Social Media</option>
              <option value="Email">Email</option>
              <option value="Cold Call">Cold Call</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto tour-lead-table">
        <table className="min-w-max w-full table-auto divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr className="whitespace-nowrap">
              <th className="px-4 py-3 tour-checkbox">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                  checked={
                    selectedLeads.length === leads.length && leads.length > 0
                  }
                  onChange={handleSelectAll}
                />
              </th>

              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                Lead
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                Contact
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                Company
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                Country
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                Source
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                Assignee
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                Created
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                Follow-Up
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tour-lead-actions">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {leads.length > 0 ? (
              leads.map((lead, idx) => (
                <tr
                  key={lead._id}
                  className={`hover:bg-gray-50 ${
                    idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } whitespace-nowrap`}
                >
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                      checked={selectedLeads.includes(lead._id)}
                      onChange={() => handleSelectLead(lead._id)}
                    />
                  </td>

                  <td className="px-4 py-3 flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                      {lead.leadName?.charAt(0) || "L"}
                    </div>
                    <div className="flex flex-col">
                      <span
                        onClick={() => navigate(`/leads/view/${lead._id}`)}
                        className="font-medium text-blue-600 text-sm cursor-pointer hover:underline"
                      >
                        {lead.leadName || "Unnamed Lead"}
                      </span>
                      <span className="text-gray-400 text-xs">
                        {lead.email || "-"}
                      </span>
                    </div>
                  </td>

                  <td className="px-4 py-3 text-sm text-gray-700">
                    {lead.phoneNumber || "-"}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {lead.companyName || "-"}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {lead.country || "-"}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {lead.source || "-"}
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3">
                    <select
                      value={lead.status}
                      onChange={(e) =>
                        handleStatusChange(lead._id, e.target.value)
                      }
                      className={getStatusSelectClass(lead.status)}
                    >
                      <option value="Hot">Hot</option>
                      <option value="Warm">Warm</option>
                      <option value="Cold">Cold</option>
                      <option value="Junk">Junk</option>
                    </select>
                  </td>

                  {/* Assignee */}
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {lead.assignTo
                      ? typeof lead.assignTo === "object"
                        ? `${lead.assignTo.firstName} ${lead.assignTo.lastName}`
                        : "Assigned User"
                      : "-"}
                  </td>

                  {/* Created */}
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {formatDate(lead.createdAt)}
                  </td>

                  {/* ✅ Follow-Up (Calendar) */}
                  <td className="px-4 py-3 text-sm text-gray-700">
                    <div className="relative flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => openFollowUpPicker(lead._id)}
                        className="inline-flex items-center gap-2 px-2 py-1 rounded-md hover:bg-gray-100 transition"
                        title="Click to update follow-up date"
                        disabled={followUpSavingId === lead._id}
                      >
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span className="text-sm">
                          {followUpSavingId === lead._id
                            ? "Saving..."
                            : formatDate(lead.followUpDate)}
                        </span>
                      </button>

                      {editingFollowUpId === lead._id && (
                        <input
                          ref={(el) => (dateInputRefs.current[lead._id] = el)}
                          type="date"
                          defaultValue={toDateInputValue(lead.followUpDate)}
                          className="absolute left-0 top-0 w-0 h-0 opacity-0"
                          onChange={(e) =>
                            updateFollowUpDateInline(lead._id, e.target.value)
                          }
                          onBlur={() => setEditingFollowUpId(null)}
                        />
                      )}
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3 text-right relative">
                    <div className="relative inline-block text-left">
                      <button
                        className="p-2 rounded-lg hover:bg-gray-200 transition-colors"
                        onClick={(e) => handleMenuToggle(lead._id, e)}
                      >
                        <MoreVertical className="w-5 h-5 text-gray-600" />
                      </button>
                    </div>

                    {menuOpen === lead._id && (
                      <div
                        className="fixed z-50 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-1"
                        style={{
                          top: `${menuPosition.top}px`,
                          left: `${menuPosition.left}px`,
                        }}
                      >
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(lead._id);
                          }}
                          className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <Edit className="w-4 h-4 mr-2" /> Edit
                        </button>

                        {lead.status !== "Converted" && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openConvertModal(lead);
                            }}
                            className="flex items-center w-full px-3 py-2 text-sm text-green-600 hover:bg-gray-100"
                          >
                            <Handshake className="w-4 h-4 mr-2" /> Convert
                          </button>
                        )}

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteClick(lead._id);
                          }}
                          className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-gray-100"
                        >
                          <Trash2 className="w-4 h-4 mr-2" /> Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={11}
                  className="px-4 py-12 text-center text-gray-500 text-sm"
                >
                  No leads found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between mt-6 px-4 py-3 bg-white border-t border-gray-200 rounded-b-xl">
          <div className="mb-4 sm:mb-0">
            <p className="text-sm text-gray-700">
              Showing{" "}
              <span className="font-medium">
                {(currentPage - 1) * itemsPerPage + 1}
              </span>{" "}
              to{" "}
              <span className="font-medium">
                {Math.min(currentPage * itemsPerPage, totalLeads)}
              </span>{" "}
              of <span className="font-medium">{totalLeads}</span> results
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 border rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              Previous
            </button>

            <div className="flex items-center">
              <span className="px-2 py-2 text-gray-600">Page</span>
              <span className="px-2 py-1 border rounded bg-gray-50 font-medium">
                {currentPage}
              </span>
              <span className="px-2 py-2 text-gray-600">of {totalPages}</span>
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <Trash2 className="w-5 h-5" />
              Confirm Delete
            </DialogTitle>
          </DialogHeader>

          <p className="mb-6 text-gray-700">
            Are you sure you want to delete{" "}
            {leadToDelete
              ? "this lead"
              : `${selectedLeads.length} selected leads`}
            ? This action cannot be undone.
          </p>

          <div className="flex justify-end gap-3">
            <button
              onClick={() => {
                setShowDeleteModal(false);
                setLeadToDelete(null);
              }}
              className="px-4 py-2 rounded-lg border hover:bg-gray-100 text-gray-700"
            >
              Cancel
            </button>

            <button
              onClick={() =>
                leadToDelete
                  ? handleDeleteLead(leadToDelete)
                  : handleBulkDelete()
              }
              className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Convert Modal */}
      <Dialog open={convertModalOpen} onOpenChange={setConvertModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-green-600">
              <Handshake className="w-5 h-5" />
              Convert Lead to Deal
            </DialogTitle>
          </DialogHeader>

          {selectedLead && (
            <>
              <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  Converting: <strong>{selectedLead.leadName}</strong>
                  {selectedLead.companyName &&
                    ` from ${selectedLead.companyName}`}
                </p>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Deal Value
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={dealData.value}
                    onChange={(e) =>
                      handleDealFieldChange("value", e.target.value)
                    }
                    placeholder="Enter value"
                    className="flex-1 px-3 py-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:outline-none"
                  />

                  <select
                    value={dealData.currency}
                    onChange={(e) =>
                      handleDealFieldChange("currency", e.target.value)
                    }
                    className="px-3 py-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:outline-none"
                  >
                    {allowedCurrencies.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.symbol} {c.code}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Stage
                </label>
                <select
                  name="stage"
                  value={dealData.stage}
                  onChange={(e) =>
                    handleDealFieldChange("stage", e.target.value)
                  }
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:outline-none"
                >
                  <option value="Qualification">Qualification</option>
                  <option value="Proposal">Proposal</option>
                  <option value="Negotiation">Negotiation</option>
                  <option value="Closed Won">Closed Won</option>
                  <option value="Closed Lost">Closed Lost</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  name="notes"
                  value={dealData.notes}
                  onChange={(e) =>
                    handleDealFieldChange("notes", e.target.value)
                  }
                  rows={3}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:outline-none"
                  placeholder="Add any notes..."
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setConvertModalOpen(false)}
                  className="px-4 py-2 rounded-lg border hover:bg-gray-100 text-gray-700"
                  disabled={converting}
                >
                  Cancel
                </button>

                <button
                  onClick={handleConvertDeal}
                  className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 flex items-center gap-2 disabled:opacity-50"
                  disabled={converting}
                >
                  {converting ? "Converting..." : "Convert"}
                </button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function LeadTable() {
  return (
    <TourProvider
      steps={tourSteps}
      afterOpen={() => (document.body.style.overflow = "hidden")}
      beforeClose={() => (document.body.style.overflow = "unset")}
      styles={{
        popover: (base) => ({
          ...base,
          backgroundColor: "#fff",
          color: "#1f1f1f",
        }),
        maskArea: (base) => ({ ...base, rx: 8 }),
        badge: (base) => ({ ...base, display: "none" }),
        close: (base) => ({ ...base, right: "auto", left: 8, top: 8 }),
      }}
    >
      <LeadTableComponent />
    </TourProvider>
  );
}
