

// import React, { useState, useEffect, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import axios from "axios";
// import { TourProvider, useTour } from "@reactour/tour";
// import {
//   MoreVertical, Trash2, Edit, Handshake, Search, Plus, Eye, Calendar,
// } from "lucide-react";
// import { initSocket } from "../../utils/socket";
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../components/ui/dialog";

// const API_URL = import.meta.env.VITE_API_URL;
// const ITEMS_PER_PAGE = 10;

// const tourSteps = [
//   { selector: ".tour-lead-header",  content: "Welcome to the Leads Management page! Here you can view, manage, and convert your leads." },
//   { selector: ".tour-create-lead",  content: "Click here to create a new lead." },
//   { selector: ".tour-search",       content: "Use this search bar to quickly find leads." },
//   { selector: ".tour-filters",      content: "Filter your leads by status, assignee, or source." },
//   { selector: ".tour-lead-table",   content: "This is your leads table with all key information." },
//   { selector: ".tour-checkbox",     content: "Select individual leads or use the header checkbox to select all." },
//   { selector: ".tour-lead-actions", content: "Click the three-dot menu to edit, convert, or delete a lead." },
//   { selector: ".tour-finish",       content: "You've completed the tour!" },
// ];

// function LeadTableComponent() {
//   const navigate      = useNavigate();
//   const { setIsOpen } = useTour();

//   // ── Data ───────────────────────────────────────────────────────────────
//   const [leads,         setLeads]         = useState([]);
//   const [selectedLeads, setSelectedLeads] = useState([]);
//   const [loading,       setLoading]       = useState(true);
//   const [userRole,      setUserRole]      = useState("");
//   const [assignees,     setAssignees]     = useState([]);

//   // ── Pagination — all server-driven ────────────────────────────────────
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages,  setTotalPages]  = useState(1);
//   const [totalLeads,  setTotalLeads]  = useState(0);

//   // ── Filters ───────────────────────────────────────────────────────────
//   const [searchQuery,    setSearchQuery]    = useState("");
//   const [debouncedSearch,setDebouncedSearch]= useState("");
//   const [statusFilter,   setStatusFilter]   = useState("");
//   const [sourceFilter,   setSourceFilter]   = useState("");
//   const [assigneeFilter, setAssigneeFilter] = useState("");
//   const searchTimer = useRef(null);

//   // ── UI ────────────────────────────────────────────────────────────────
//   const [menuOpen,     setMenuOpen]     = useState(null);
//   const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });

//   // ── Modals ────────────────────────────────────────────────────────────
//   const [showDeleteModal,  setShowDeleteModal]  = useState(false);
//   const [leadToDelete,     setLeadToDelete]     = useState(null);
//   const [convertModalOpen, setConvertModalOpen] = useState(false);
//   const [selectedLead,     setSelectedLead]     = useState(null);
//   const [converting,       setConverting]       = useState(false);
//   const [dealData,         setDealData]         = useState({
//     value: 0, currency: "USD", notes: "", stage: "Qualification",
//   });

//   // ── Follow-up ─────────────────────────────────────────────────────────
//   const dateInputRefs                              = useRef({});
//   const [editingFollowUpId, setEditingFollowUpId] = useState(null);
//   const [followUpSavingId,  setFollowUpSavingId]  = useState(null);

//   const allowedCurrencies = [
//     { code: "USD", symbol: "$"   },
//     { code: "EUR", symbol: "€"   },
//     { code: "INR", symbol: "₹"   },
//     { code: "GBP", symbol: "£"   },
//     { code: "JPY", symbol: "¥"   },
//     { code: "AUD", symbol: "A$"  },
//     { code: "CAD", symbol: "C$"  },
//     { code: "CHF", symbol: "CHF" },
//     { code: "MYR", symbol: "RM"  },
//     { code: "AED", symbol: "د.إ" },
//     { code: "SGD", symbol: "S$"  },
//     { code: "ZAR", symbol: "R"   },
//     { code: "SAR", symbol: "﷼"   },
//   ];

//   // ── Load user role ─────────────────────────────────────────────────────
//   useEffect(() => {
//     try {
//       const user = JSON.parse(localStorage.getItem("user") || "{}");
//       setUserRole(user.role?.name || "");
//     } catch {}
//   }, []);

//   useEffect(() => { initSocket(); }, []);

//   // ── Debounce search ───────────────────────────────────────────────────
//   useEffect(() => {
//     if (searchTimer.current) clearTimeout(searchTimer.current);
//     searchTimer.current = setTimeout(() => {
//       setDebouncedSearch(searchQuery);
//       setCurrentPage(1);
//     }, 500);
//     return () => clearTimeout(searchTimer.current);
//   }, [searchQuery]);

//   // ── Reset page when filters change ───────────────────────────────────
//   useEffect(() => { setCurrentPage(1); }, [statusFilter, sourceFilter, assigneeFilter]);

//   // ── FETCH (server-side pagination + filters) ──────────────────────────
//   useEffect(() => {
//     const fetchLeads = async () => {
//       try {
//         setLoading(true);
//         const token = localStorage.getItem("token");

//         const params = new URLSearchParams({
//           page:  currentPage,
//           limit: ITEMS_PER_PAGE,
//         });

//         if (debouncedSearch) params.append("search",   debouncedSearch);
//         if (statusFilter)    params.append("status",   statusFilter);
//         if (sourceFilter)    params.append("source",   sourceFilter);
//         if (assigneeFilter)  params.append("assignee", assigneeFilter);

//         const { data } = await axios.get(
//           `${API_URL}/leads/getAllLead?${params.toString()}`,
//           { headers: { Authorization: `Bearer ${token}` } }
//         );

//         // ✅ Handle both response shapes:
//         //   Shape A (new): { leads, totalLeads, totalPages, currentPage }
//         //   Shape B (old): plain array
//         const isNew     = data && !Array.isArray(data) && Array.isArray(data.leads);
//         const leadsArr  = isNew ? data.leads      : (Array.isArray(data) ? data : []);
//         const total     = isNew ? data.totalLeads : leadsArr.length;
//         const pages     = isNew ? data.totalPages : Math.ceil(leadsArr.length / ITEMS_PER_PAGE);

//         setLeads(leadsArr);
//         setTotalLeads(total);
//         setTotalPages(pages);

//         // Collect assignees for filter dropdown
//         const seen = new Set();
//         const unique = [];
//         leadsArr.forEach((lead) => {
//           if (!lead.assignTo) return;
//           const name =
//             typeof lead.assignTo === "object" && lead.assignTo.firstName
//               ? `${lead.assignTo.firstName} ${lead.assignTo.lastName}`
//               : "Assigned User";
//           if (!seen.has(name)) { seen.add(name); unique.push(name); }
//         });
//         setAssignees(unique);

//       } catch (err) {
//         console.error("Fetch leads error:", err);
//         toast.error("Failed to fetch leads");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchLeads();
//   }, [currentPage, debouncedSearch, statusFilter, sourceFilter, assigneeFilter]);

//   // ── Pagination helpers ────────────────────────────────────────────────
//   const goToPage = (page) => {
//     if (page < 1 || page > totalPages) return;
//     setCurrentPage(page);
//     setSelectedLeads([]);
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   };

//   const pageNumbers = () => {
//     if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
//     const pages = [];
//     const left  = Math.max(2, currentPage - 1);
//     const right = Math.min(totalPages - 1, currentPage + 1);
//     pages.push(1);
//     if (left > 2) pages.push("...");
//     for (let i = left; i <= right; i++) pages.push(i);
//     if (right < totalPages - 1) pages.push("...");
//     pages.push(totalPages);
//     return pages;
//   };

//   // ── Delete single ─────────────────────────────────────────────────────
//   const handleDeleteLead = async (id) => {
//     try {
//       const token = localStorage.getItem("token");
//       await axios.delete(`${API_URL}/leads/deleteLead/${id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setLeads((prev) => prev.filter((l) => l._id !== id));
//       setTotalLeads((prev) => prev - 1);
//       toast.success("Lead deleted successfully");
//       if (leads.length === 1 && currentPage > 1) setCurrentPage((p) => p - 1);
//     } catch {
//       toast.error("Error deleting lead");
//     } finally {
//       setShowDeleteModal(false);
//       setLeadToDelete(null);
//     }
//   };

//   // ── Bulk delete ───────────────────────────────────────────────────────
//   const handleBulkDelete = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       await Promise.all(
//         selectedLeads.map((id) =>
//           axios.delete(`${API_URL}/leads/deleteLead/${id}`, {
//             headers: { Authorization: `Bearer ${token}` },
//           })
//         )
//       );
//       setLeads((prev) => prev.filter((l) => !selectedLeads.includes(l._id)));
//       setTotalLeads((prev) => prev - selectedLeads.length);
//       toast.success(`${selectedLeads.length} leads deleted`);
//       setSelectedLeads([]);
//       if (leads.length === selectedLeads.length && currentPage > 1)
//         setCurrentPage((p) => p - 1);
//     } catch {
//       toast.error("Error deleting leads");
//     } finally {
//       setShowDeleteModal(false);
//     }
//   };

//   // ── Selection ─────────────────────────────────────────────────────────
//   const handleSelectLead = (id) =>
//     setSelectedLeads((prev) =>
//       prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
//     );
//   const handleSelectAll = (e) =>
//     setSelectedLeads(e.target.checked ? leads.map((l) => l._id) : []);

//   // ── Menu ──────────────────────────────────────────────────────────────
//   const handleMenuToggle = (leadId, e) => {
//     e.stopPropagation();
//     const rect = e.currentTarget.getBoundingClientRect();
//     let top  = rect.bottom + window.scrollY + 4;
//     let left = rect.right  + window.scrollX - 160;
//     if (rect.bottom + 120 > window.innerHeight)
//       top = rect.top + window.scrollY - 124;
//     setMenuPosition({ top, left });
//     setMenuOpen(menuOpen === leadId ? null : leadId);
//   };

//   useEffect(() => {
//     const close = () => setMenuOpen(null);
//     document.addEventListener("click", close);
//     return () => document.removeEventListener("click", close);
//   }, []);

//   const handleEdit        = (id) => { navigate(`/createleads?id=${id}`); setMenuOpen(null); };
//   const handleDeleteClick = (id) => { setLeadToDelete(id); setShowDeleteModal(true); setMenuOpen(null); };

//   // ── Convert ───────────────────────────────────────────────────────────
//   const openConvertModal = (lead) => {
//     setSelectedLead(lead);
//     setDealData({ value: lead.value || 0, currency: lead.currency || "USD", notes: lead.notes || "", stage: "Qualification" });
//     setConvertModalOpen(true);
//     setMenuOpen(null);
//   };

//   const handleConvertDeal = async () => {
//     if (!selectedLead) return;
//     try {
//       setConverting(true);
//       const token   = localStorage.getItem("token");
//       const toastId = toast.loading("Converting lead to deal...");
//       const res     = await axios.patch(
//         `${API_URL}/leads/${selectedLead._id}/convert`,
//         dealData,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       toast.update(toastId, {
//         render: res.data.message || "Lead converted successfully",
//         type: "success", isLoading: false, autoClose: 3000,
//       });
//       setLeads((prev) => prev.filter((l) => l._id !== selectedLead._id));
//       setTotalLeads((prev) => prev - 1);
//       setConvertModalOpen(false);
//       setSelectedLead(null);
//     } catch (err) {
//       toast.dismiss();
//       toast.error(err.response?.data?.message || "Conversion failed");
//     } finally {
//       setConverting(false);
//     }
//   };

//   // ── Status change ─────────────────────────────────────────────────────
//   const handleStatusChange = async (leadId, newStatus) => {
//     try {
//       const token = localStorage.getItem("token");
//       await axios.patch(
//         `${API_URL}/leads/${leadId}/status`,
//         { status: newStatus },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setLeads((prev) => prev.map((l) => l._id === leadId ? { ...l, status: newStatus } : l));
//       toast.success("Status updated");
//     } catch {
//       toast.error("Failed to update status");
//     }
//   };

//   // ── Follow-up ─────────────────────────────────────────────────────────
//   const openFollowUpPicker = (leadId) => {
//     setEditingFollowUpId(leadId);
//     setTimeout(() => {
//       const el = dateInputRefs.current[leadId];
//       if (!el) return;
//       el.focus(); el.click();
//       if (typeof el.showPicker === "function") el.showPicker();
//     }, 0);
//   };

//   const updateFollowUpDateInline = async (leadId, newDate) => {
//     if (!newDate) return;
//     try {
//       setFollowUpSavingId(leadId);
//       const token = localStorage.getItem("token");
//       await axios.patch(
//         `${API_URL}/leads/${leadId}/followup`,
//         { followUpDate: newDate },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setLeads((prev) => prev.map((l) => l._id === leadId ? { ...l, followUpDate: newDate } : l));
//       toast.success("Follow-up date updated");
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Failed to update follow-up date");
//     } finally {
//       setFollowUpSavingId(null);
//       setEditingFollowUpId(null);
//     }
//   };

//   // ── Formatters ────────────────────────────────────────────────────────
//   const formatDate = (d) => {
//     if (!d) return "-";
//     return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
//   };

//   const toDateInputValue = (d) => {
//     if (!d) return "";
//     const date = new Date(d);
//     return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().split("T")[0];
//   };

//   const statusClasses = {
//     Hot:       "bg-red-50 text-red-700 border-red-200 hover:bg-red-100",
//     Warm:      "bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100",
//     Cold:      "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100",
//     Junk:      "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100",
//     Converted: "bg-green-50 text-green-700 border-green-200 hover:bg-green-100",
//   };

//   const getStatusClass = (status) =>
//     `w-full px-3 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-1 ${
//       statusClasses[status] || statusClasses.Junk
//     } ${
//       status === "Hot"  ? "focus:ring-red-300"    :
//       status === "Warm" ? "focus:ring-yellow-300"  :
//       status === "Cold" ? "focus:ring-blue-300"    : "focus:ring-gray-300"
//     }`;

//   // ── Loading spinner ───────────────────────────────────────────────────
//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
//       </div>
//     );
//   }

//   const firstItem = totalLeads === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1;
//   const lastItem  = Math.min(currentPage * ITEMS_PER_PAGE, totalLeads);

//   // ── Render ────────────────────────────────────────────────────────────
//   return (
//     <div className="p-6">
//       <ToastContainer position="top-right" autoClose={3000} newestOnTop closeOnClick draggable pauseOnHover theme="light" />

//       {/* Header */}
//       <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4 tour-lead-header">
//         <h2 className="text-2xl font-bold text-gray-800">Leads</h2>

//         <div className="flex flex-wrap gap-3 items-center">
//           <button onClick={() => setIsOpen(true)}
//             className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 tour-finish">
//             <Eye className="w-4 h-4" /> Take Tour
//           </button>

//           {selectedLeads.length > 0 && (
//             <button onClick={() => { setLeadToDelete(null); setShowDeleteModal(true); }}
//               className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow flex items-center gap-2">
//               <Trash2 className="w-4 h-4" /> Delete Selected ({selectedLeads.length})
//             </button>
//           )}

//           {(userRole === "Admin" || userRole === "Sales") && (
//             <button onClick={() => navigate("/createleads")}
//               className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow flex items-center gap-2 tour-create-lead">
//               <Plus className="w-4 h-4" /> Create Lead
//             </button>
//           )}
//         </div>
//       </div>

//       {/* Filters */}
//       <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4 tour-filters">
//         <div className="relative tour-search">
//           <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
//           <input type="text" placeholder="Search leads..." value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             className="w-full pl-10 pr-4 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
//         </div>

//         {userRole === "Admin" && (
//           <select value={assigneeFilter} onChange={(e) => setAssigneeFilter(e.target.value)}
//             className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
//             <option value="">All Assignees</option>
//             {assignees.map((a, i) => <option key={i} value={a}>{a}</option>)}
//           </select>
//         )}

//         <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
//           className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
//           <option value="">All Status</option>
//           <option value="Hot">Hot</option>
//           <option value="Warm">Warm</option>
//           <option value="Cold">Cold</option>
//           <option value="Junk">Junk</option>
//           <option value="Converted">Converted</option>
//         </select>

//         <select value={sourceFilter} onChange={(e) => setSourceFilter(e.target.value)}
//           className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
//           <option value="">All Sources</option>
//           <option value="Website">Website</option>
//           <option value="Referral">Referral</option>
//           <option value="Social Media">Social Media</option>
//           <option value="Email">Email</option>
//           <option value="Cold Call">Cold Call</option>
//           <option value="Other">Other</option>
//         </select>
//       </div>

//       {/* Table */}
//       <div className="overflow-x-auto tour-lead-table rounded-xl border border-gray-200 shadow-sm">
//         <table className="min-w-max w-full table-auto divide-y divide-gray-200">
//           <thead className="bg-gray-50">
//             <tr className="whitespace-nowrap">
//               <th className="px-4 py-3 tour-checkbox">
//                 <input type="checkbox" className="h-4 w-4 text-blue-600 border-gray-300 rounded"
//                   checked={leads.length > 0 && selectedLeads.length === leads.length}
//                   onChange={handleSelectAll} />
//               </th>
//               <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Lead</th>
//               <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Contact</th>
//               <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Destination</th>
//               <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Country</th>
//               <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Source</th>
//               <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
//               <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Assignee</th>
//               <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Created</th>
//               <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Follow-Up</th>
//               <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tour-lead-actions">Actions</th>
//             </tr>
//           </thead>

//           <tbody className="divide-y divide-gray-200 bg-white">
//             {leads.length > 0 ? leads.map((lead, idx) => (
//               <tr key={lead._id}
//                 className={`hover:bg-blue-50/30 transition-colors whitespace-nowrap ${idx % 2 === 0 ? "bg-white" : "bg-gray-50/50"}`}>

//                 <td className="px-4 py-3">
//                   <input type="checkbox" className="h-4 w-4 text-blue-600 border-gray-300 rounded"
//                     checked={selectedLeads.includes(lead._id)}
//                     onChange={() => handleSelectLead(lead._id)} />
//                 </td>

//                 <td className="px-4 py-3">
//                   <div className="flex items-center gap-2">
//                     <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-sm flex-shrink-0">
//                       {lead.leadName?.charAt(0)?.toUpperCase() || "L"}
//                     </div>
//                     <div className="flex flex-col">
//                       <span onClick={() => navigate(`/leads/view/${lead._id}`)}
//                         className="font-medium text-blue-600 text-sm cursor-pointer hover:underline">
//                         {lead.leadName || "Unnamed Lead"}
//                       </span>
//                       <span className="text-gray-400 text-xs">{lead.email || "-"}</span>
//                     </div>
//                   </div>
//                 </td>

//                 <td className="px-4 py-3 text-sm text-gray-700">{lead.phoneNumber  || "-"}</td>
//                 <td className="px-4 py-3 text-sm text-gray-700">{lead.destination  || "-"}</td>
//                 <td className="px-4 py-3 text-sm text-gray-700">{lead.country      || "-"}</td>
//                 <td className="px-4 py-3 text-sm text-gray-700">{lead.source       || "-"}</td>

//                 <td className="px-4 py-3">
//                   <select value={lead.status} onChange={(e) => handleStatusChange(lead._id, e.target.value)}
//                     className={getStatusClass(lead.status)}>
//                     <option value="Hot">Hot</option>
//                     <option value="Warm">Warm</option>
//                     <option value="Cold">Cold</option>
//                     <option value="Junk">Junk</option>
//                   </select>
//                 </td>

//                 <td className="px-4 py-3 text-sm text-gray-700">
//                   {lead.assignTo
//                     ? typeof lead.assignTo === "object"
//                       ? `${lead.assignTo.firstName} ${lead.assignTo.lastName}`
//                       : "Assigned User"
//                     : "-"}
//                 </td>

//                 <td className="px-4 py-3 text-sm text-gray-700">{formatDate(lead.createdAt)}</td>

//                 <td className="px-4 py-3 text-sm text-gray-700">
//                   <div className="relative flex items-center gap-1">
//                     <button type="button" onClick={() => openFollowUpPicker(lead._id)}
//                       disabled={followUpSavingId === lead._id}
//                       className="inline-flex items-center gap-2 px-2 py-1 rounded-md hover:bg-gray-100 transition">
//                       <Calendar className="w-4 h-4 text-gray-500" />
//                       <span className="text-sm">
//                         {followUpSavingId === lead._id ? "Saving..." : formatDate(lead.followUpDate)}
//                       </span>
//                     </button>
//                     {editingFollowUpId === lead._id && (
//                       <input ref={(el) => (dateInputRefs.current[lead._id] = el)}
//                         type="date" defaultValue={toDateInputValue(lead.followUpDate)}
//                         className="absolute left-0 top-0 w-0 h-0 opacity-0"
//                         onChange={(e) => updateFollowUpDateInline(lead._id, e.target.value)}
//                         onBlur={() => setEditingFollowUpId(null)} />
//                     )}
//                   </div>
//                 </td>

//                 <td className="px-4 py-3 text-right relative">
//                   <button className="p-2 rounded-lg hover:bg-gray-200 transition-colors"
//                     onClick={(e) => handleMenuToggle(lead._id, e)}>
//                     <MoreVertical className="w-5 h-5 text-gray-600" />
//                   </button>

//                   {menuOpen === lead._id && (
//                     <div className="fixed z-50 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-1"
//                       style={{ top: `${menuPosition.top}px`, left: `${menuPosition.left}px` }}>
//                       <button onClick={(e) => { e.stopPropagation(); handleEdit(lead._id); }}
//                         className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100">
//                         <Edit className="w-4 h-4 mr-2" /> Edit
//                       </button>
//                       {lead.status !== "Converted" && (
//                         <button onClick={(e) => { e.stopPropagation(); openConvertModal(lead); }}
//                           className="flex items-center w-full px-3 py-2 text-sm text-green-600 hover:bg-gray-100">
//                           <Handshake className="w-4 h-4 mr-2" /> Convert
//                         </button>
//                       )}
//                       <button onClick={(e) => { e.stopPropagation(); handleDeleteClick(lead._id); }}
//                         className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-gray-100">
//                         <Trash2 className="w-4 h-4 mr-2" /> Delete
//                       </button>
//                     </div>
//                   )}
//                 </td>
//               </tr>
//             )) : (
//               <tr>
//                 <td colSpan={11} className="px-4 py-16 text-center">
//                   <div className="flex flex-col items-center gap-2 text-gray-400">
//                     <Search className="w-10 h-10 opacity-30" />
//                     <p className="text-sm font-medium">No leads found</p>
//                   </div>
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* ── Pagination ── */}
//       {totalPages > 1 && (
//         <div className="flex flex-col sm:flex-row items-center justify-between mt-4 gap-3">

//           {/* Showing X - Y of Z */}
//           <p className="text-sm text-gray-500">
//             Showing <span className="font-semibold text-gray-700">{firstItem}</span>–<span className="font-semibold text-gray-700">{lastItem}</span> of <span className="font-semibold text-gray-700">{totalLeads}</span>
//           </p>

//           {/* Page buttons */}
//           <div className="flex items-center gap-1">
//             {/* First + Prev */}
//             <button onClick={() => goToPage(1)} disabled={currentPage === 1}
//               className="px-2 py-1.5 text-sm border rounded-lg hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed">«</button>
//             <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}
//               className="px-3 py-1.5 text-sm border rounded-lg hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed">‹ Prev</button>

//             {/* Page numbers */}
//             {pageNumbers().map((p, i) =>
//               p === "..." ? (
//                 <span key={`d${i}`} className="px-2 text-gray-400">…</span>
//               ) : (
//                 <button key={p} onClick={() => goToPage(p)}
//                   className={`min-w-[36px] px-2 py-1.5 text-sm border rounded-lg transition-colors ${
//                     currentPage === p
//                       ? "bg-blue-600 text-white border-blue-600 font-semibold"
//                       : "hover:bg-gray-100 text-gray-700"
//                   }`}>
//                   {p}
//                 </button>
//               )
//             )}

//             {/* Next + Last */}
//             <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}
//               className="px-3 py-1.5 text-sm border rounded-lg hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed">Next ›</button>
//             <button onClick={() => goToPage(totalPages)} disabled={currentPage === totalPages}
//               className="px-2 py-1.5 text-sm border rounded-lg hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed">»</button>
//           </div>
//         </div>
//       )}

//       {/* Delete Modal */}
//       <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle className="flex items-center gap-2 text-red-600">
//               <Trash2 className="w-5 h-5" /> Confirm Delete
//             </DialogTitle>
//           </DialogHeader>
//           <p className="mb-6 text-gray-700">
//             Are you sure you want to delete{" "}
//             {leadToDelete ? "this lead" : `${selectedLeads.length} selected leads`}?
//             This action cannot be undone.
//           </p>
//           <div className="flex justify-end gap-3">
//             <button onClick={() => { setShowDeleteModal(false); setLeadToDelete(null); }}
//               className="px-4 py-2 rounded-lg border hover:bg-gray-100 text-gray-700">Cancel</button>
//             <button onClick={() => leadToDelete ? handleDeleteLead(leadToDelete) : handleBulkDelete()}
//               className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 flex items-center gap-2">
//               <Trash2 className="w-4 h-4" /> Delete
//             </button>
//           </div>
//         </DialogContent>
//       </Dialog>

//       {/* Convert Modal */}
//       <Dialog open={convertModalOpen} onOpenChange={setConvertModalOpen}>
//         <DialogContent className="max-w-md">
//           <DialogHeader>
//             <DialogTitle className="flex items-center gap-2 text-green-600">
//               <Handshake className="w-5 h-5" /> Convert Lead to Deal
//             </DialogTitle>
//           </DialogHeader>
//           {selectedLead && (
//             <>
//               <div className="mb-4 p-3 bg-blue-50 rounded-lg">
//                 <p className="text-sm text-blue-800">
//                   Converting: <strong>{selectedLead.leadName}</strong>
//                   {selectedLead.destination && ` — ${selectedLead.destination}`}
//                 </p>
//               </div>
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Deal Value</label>
//                 <div className="flex gap-2">
//                   <input type="number" value={dealData.value}
//                     onChange={(e) => setDealData((p) => ({ ...p, value: e.target.value }))}
//                     placeholder="Enter value"
//                     className="flex-1 px-3 py-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:outline-none" />
//                   <select value={dealData.currency}
//                     onChange={(e) => setDealData((p) => ({ ...p, currency: e.target.value }))}
//                     className="px-3 py-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:outline-none">
//                     {allowedCurrencies.map((c) => (
//                       <option key={c.code} value={c.code}>{c.symbol} {c.code}</option>
//                     ))}
//                   </select>
//                 </div>
//               </div>
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Stage</label>
//                 <select value={dealData.stage}
//                   onChange={(e) => setDealData((p) => ({ ...p, stage: e.target.value }))}
//                   className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:outline-none">
//                   <option value="Qualification">Qualification</option>
//                   <option value="Proposal">Proposal</option>
//                   <option value="Negotiation">Negotiation</option>
//                   <option value="Closed Won">Closed Won</option>
//                   <option value="Closed Lost">Closed Lost</option>
//                 </select>
//               </div>
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
//                 <textarea value={dealData.notes} rows={3} placeholder="Add any notes..."
//                   onChange={(e) => setDealData((p) => ({ ...p, notes: e.target.value }))}
//                   className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:outline-none" />
//               </div>
//               <div className="flex justify-end gap-3">
//                 <button onClick={() => setConvertModalOpen(false)} disabled={converting}
//                   className="px-4 py-2 rounded-lg border hover:bg-gray-100 text-gray-700">Cancel</button>
//                 <button onClick={handleConvertDeal} disabled={converting}
//                   className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 flex items-center gap-2 disabled:opacity-50">
//                   {converting ? "Converting..." : "Convert"}
//                 </button>
//               </div>
//             </>
//           )}
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }

// export default function LeadTable() {
//   return (
//     <TourProvider steps={tourSteps}
//       afterOpen={() => (document.body.style.overflow = "hidden")}
//       beforeClose={() => (document.body.style.overflow = "unset")}
//       styles={{
//         popover:  (base) => ({ ...base, backgroundColor: "#fff", color: "#1f1f1f" }),
//         maskArea: (base) => ({ ...base, rx: 8 }),
//         badge:    (base) => ({ ...base, display: "none" }),
//         close:    (base) => ({ ...base, right: "auto", left: 8, top: 8 }),
//       }}>
//       <LeadTableComponent />
//     </TourProvider>
//   );
// }//all work perfectly..



import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { TourProvider, useTour } from "@reactour/tour";
import {
  MoreVertical, Trash2, Edit, Handshake, Search, Plus, Eye, Calendar,
} from "lucide-react";
import { initSocket } from "../../utils/socket";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../components/ui/dialog";

const API_URL = import.meta.env.VITE_API_URL;
const ITEMS_PER_PAGE = 10;

const tourSteps = [
  { selector: ".tour-lead-header",  content: "Welcome to the Leads Management page! Here you can view, manage, and convert your leads." },
  { selector: ".tour-create-lead",  content: "Click here to create a new lead." },
  { selector: ".tour-search",       content: "Use this search bar to quickly find leads." },
  { selector: ".tour-filters",      content: "Filter your leads by status, assignee, or source." },
  { selector: ".tour-lead-table",   content: "This is your leads table with all key information." },
  { selector: ".tour-checkbox",     content: "Select individual leads or use the header checkbox to select all." },
  { selector: ".tour-lead-actions", content: "Click the three-dot menu to edit, convert, or delete a lead." },
  { selector: ".tour-finish",       content: "You've completed the tour!" },
];

/* ─────────────────────────────────────────────────────────────────────────
   AVATAR HELPER
   ─────────────────────────────────────────────────────────────────────────
   Extracts the best 1–2 initials from any name string, regardless of
   whether it starts with a number, symbol, or mixed characters.
   Examples:
     "sheetalsuthar2788" → "SH"
     "s.rajan3"          → "SR"
     "pgvrreddy"         → "PG"
     "agvenu0918"        → "AG"
     "123abc"            → "12"  (fallback: first two chars uppercased)
     ""  / null          → "?"
   ──────────────────────────────────────────────────────────────────────── */
const getInitials = (name) => {
  if (!name || typeof name !== "string") return "?";

  // Remove leading/trailing spaces
  const trimmed = name.trim();
  if (!trimmed) return "?";

  // Extract only alphabetic characters from the name
  const letters = trimmed.replace(/[^a-zA-Z]/g, "");

  if (letters.length === 0) {
    // No letters at all — fall back to first 1–2 raw characters, uppercased
    return trimmed.slice(0, 2).toUpperCase();
  }

  if (letters.length === 1) {
    return letters[0].toUpperCase();
  }

  // Split by word boundaries (spaces, dots, underscores, dashes)
  const words = trimmed.split(/[\s._\-]+/).filter(Boolean);

  if (words.length >= 2) {
    // Multi-word name: first letter of first two words
    const a = words[0].replace(/[^a-zA-Z]/g, "")[0] || "";
    const b = words[1].replace(/[^a-zA-Z]/g, "")[0] || "";
    return (a + b).toUpperCase();
  }

  // Single-word name: first two letters
  return letters.slice(0, 2).toUpperCase();
};

/* Deterministic color based on name so each person always gets the same color */
const AVATAR_COLORS = [
  { bg: "bg-blue-100",   text: "text-blue-700"   },
  { bg: "bg-purple-100", text: "text-purple-700"  },
  { bg: "bg-green-100",  text: "text-green-700"   },
  { bg: "bg-orange-100", text: "text-orange-700"  },
  { bg: "bg-pink-100",   text: "text-pink-700"    },
  { bg: "bg-teal-100",   text: "text-teal-700"    },
  { bg: "bg-indigo-100", text: "text-indigo-700"  },
  { bg: "bg-red-100",    text: "text-red-700"     },
  { bg: "bg-yellow-100", text: "text-yellow-700"  },
  { bg: "bg-cyan-100",   text: "text-cyan-700"    },
];

const getAvatarColor = (name) => {
  if (!name) return AVATAR_COLORS[0];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
};

/* ─── Avatar Component ──────────────────────────────────────────────── */
const LeadAvatar = ({ name }) => {
  const initials = getInitials(name);
  const color    = getAvatarColor(name);

  return (
    <div
      className={`
        h-9 w-9 rounded-full flex-shrink-0
        flex items-center justify-center
        font-semibold text-xs select-none
        ${color.bg} ${color.text}
      `}
      style={{ minWidth: "2.25rem", minHeight: "2.25rem" }}
      title={name || ""}
    >
      {initials}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════════════ */
function LeadTableComponent() {
  const navigate      = useNavigate();
  const { setIsOpen } = useTour();

  // ── Data ───────────────────────────────────────────────────────────────
  const [leads,         setLeads]         = useState([]);
  const [selectedLeads, setSelectedLeads] = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [userRole,      setUserRole]      = useState("");
  const [assignees,     setAssignees]     = useState([]);

  // ── Pagination ────────────────────────────────────────────────────────
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages,  setTotalPages]  = useState(1);
  const [totalLeads,  setTotalLeads]  = useState(0);

  // ── Filters ───────────────────────────────────────────────────────────
  const [searchQuery,     setSearchQuery]     = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter,    setStatusFilter]    = useState("");
  const [sourceFilter,    setSourceFilter]    = useState("");
  const [assigneeFilter,  setAssigneeFilter]  = useState("");
  const searchTimer = useRef(null);

  // ── UI ────────────────────────────────────────────────────────────────
  const [menuOpen,     setMenuOpen]     = useState(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });

  // ── Modals ────────────────────────────────────────────────────────────
  const [showDeleteModal,  setShowDeleteModal]  = useState(false);
  const [leadToDelete,     setLeadToDelete]     = useState(null);
  const [convertModalOpen, setConvertModalOpen] = useState(false);
  const [selectedLead,     setSelectedLead]     = useState(null);
  const [converting,       setConverting]       = useState(false);
  const [dealData,         setDealData]         = useState({
    value: 0, currency: "USD", notes: "", stage: "Qualification",
  });

  // ── Follow-up ─────────────────────────────────────────────────────────
  const dateInputRefs                              = useRef({});
  const [editingFollowUpId, setEditingFollowUpId] = useState(null);
  const [followUpSavingId,  setFollowUpSavingId]  = useState(null);

  const allowedCurrencies = [
    { code: "USD", symbol: "$"   },
    { code: "EUR", symbol: "€"   },
    { code: "INR", symbol: "₹"   },
    { code: "GBP", symbol: "£"   },
    { code: "JPY", symbol: "¥"   },
    { code: "AUD", symbol: "A$"  },
    { code: "CAD", symbol: "C$"  },
    { code: "CHF", symbol: "CHF" },
    { code: "MYR", symbol: "RM"  },
    { code: "AED", symbol: "د.إ" },
    { code: "SGD", symbol: "S$"  },
    { code: "ZAR", symbol: "R"   },
    { code: "SAR", symbol: "﷼"   },
  ];

  // ── Load user role ─────────────────────────────────────────────────────
  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      setUserRole(user.role?.name || "");
    } catch {}
  }, []);

  useEffect(() => { initSocket(); }, []);

  // ── Debounce search ───────────────────────────────────────────────────
  useEffect(() => {
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(searchTimer.current);
  }, [searchQuery]);

  // ── Reset page when filters change ───────────────────────────────────
  useEffect(() => { setCurrentPage(1); }, [statusFilter, sourceFilter, assigneeFilter]);

  // ── FETCH ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const fetchLeads = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        const params = new URLSearchParams({ page: currentPage, limit: ITEMS_PER_PAGE });
        if (debouncedSearch) params.append("search",   debouncedSearch);
        if (statusFilter)    params.append("status",   statusFilter);
        if (sourceFilter)    params.append("source",   sourceFilter);
        if (assigneeFilter)  params.append("assignee", assigneeFilter);

        const { data } = await axios.get(
          `${API_URL}/leads/getAllLead?${params.toString()}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const isNew    = data && !Array.isArray(data) && Array.isArray(data.leads);
        const leadsArr = isNew ? data.leads      : (Array.isArray(data) ? data : []);
        const total    = isNew ? data.totalLeads : leadsArr.length;
        const pages    = isNew ? data.totalPages : Math.ceil(leadsArr.length / ITEMS_PER_PAGE);

        setLeads(leadsArr);
        setTotalLeads(total);
        setTotalPages(pages);

        const seen = new Set();
        const unique = [];
        leadsArr.forEach((lead) => {
          if (!lead.assignTo) return;
          const name = typeof lead.assignTo === "object" && lead.assignTo.firstName
            ? `${lead.assignTo.firstName} ${lead.assignTo.lastName}`
            : "Assigned User";
          if (!seen.has(name)) { seen.add(name); unique.push(name); }
        });
        setAssignees(unique);
      } catch (err) {
        console.error("Fetch leads error:", err);
        toast.error("Failed to fetch leads");
      } finally {
        setLoading(false);
      }
    };

    fetchLeads();
  }, [currentPage, debouncedSearch, statusFilter, sourceFilter, assigneeFilter]);

  // ── Pagination helpers ────────────────────────────────────────────────
  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    setSelectedLeads([]);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const pageNumbers = () => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages = [];
    const left  = Math.max(2, currentPage - 1);
    const right = Math.min(totalPages - 1, currentPage + 1);
    pages.push(1);
    if (left > 2) pages.push("...");
    for (let i = left; i <= right; i++) pages.push(i);
    if (right < totalPages - 1) pages.push("...");
    pages.push(totalPages);
    return pages;
  };

  // ── Delete single ─────────────────────────────────────────────────────
  const handleDeleteLead = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}/leads/deleteLead/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLeads((prev) => prev.filter((l) => l._id !== id));
      setTotalLeads((prev) => prev - 1);
      toast.success("Lead deleted successfully");
      if (leads.length === 1 && currentPage > 1) setCurrentPage((p) => p - 1);
    } catch {
      toast.error("Error deleting lead");
    } finally {
      setShowDeleteModal(false);
      setLeadToDelete(null);
    }
  };

  // ── Bulk delete ───────────────────────────────────────────────────────
  const handleBulkDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      await Promise.all(
        selectedLeads.map((id) =>
          axios.delete(`${API_URL}/leads/deleteLead/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
        )
      );
      setLeads((prev) => prev.filter((l) => !selectedLeads.includes(l._id)));
      setTotalLeads((prev) => prev - selectedLeads.length);
      toast.success(`${selectedLeads.length} leads deleted`);
      setSelectedLeads([]);
      if (leads.length === selectedLeads.length && currentPage > 1)
        setCurrentPage((p) => p - 1);
    } catch {
      toast.error("Error deleting leads");
    } finally {
      setShowDeleteModal(false);
    }
  };

  // ── Selection ─────────────────────────────────────────────────────────
  const handleSelectLead = (id) =>
    setSelectedLeads((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  const handleSelectAll = (e) =>
    setSelectedLeads(e.target.checked ? leads.map((l) => l._id) : []);

  // ── Menu ──────────────────────────────────────────────────────────────
  const handleMenuToggle = (leadId, e) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    let top  = rect.bottom + window.scrollY + 4;
    let left = rect.right  + window.scrollX - 160;
    if (rect.bottom + 120 > window.innerHeight)
      top = rect.top + window.scrollY - 124;
    setMenuPosition({ top, left });
    setMenuOpen(menuOpen === leadId ? null : leadId);
  };

  useEffect(() => {
    const close = () => setMenuOpen(null);
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, []);

  const handleEdit        = (id) => { navigate(`/createleads?id=${id}`); setMenuOpen(null); };
  const handleDeleteClick = (id) => { setLeadToDelete(id); setShowDeleteModal(true); setMenuOpen(null); };

  // ── Convert ───────────────────────────────────────────────────────────
  const openConvertModal = (lead) => {
    setSelectedLead(lead);
    setDealData({ value: lead.value || 0, currency: lead.currency || "USD", notes: lead.notes || "", stage: "Qualification" });
    setConvertModalOpen(true);
    setMenuOpen(null);
  };

  const handleConvertDeal = async () => {
    if (!selectedLead) return;
    try {
      setConverting(true);
      const token   = localStorage.getItem("token");
      const toastId = toast.loading("Converting lead to deal...");
      const res     = await axios.patch(
        `${API_URL}/leads/${selectedLead._id}/convert`,
        dealData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.update(toastId, {
        render: res.data.message || "Lead converted successfully",
        type: "success", isLoading: false, autoClose: 3000,
      });
      setLeads((prev) => prev.filter((l) => l._id !== selectedLead._id));
      setTotalLeads((prev) => prev - 1);
      setConvertModalOpen(false);
      setSelectedLead(null);
    } catch (err) {
      toast.dismiss();
      toast.error(err.response?.data?.message || "Conversion failed");
    } finally {
      setConverting(false);
    }
  };

  // ── Status change ─────────────────────────────────────────────────────
  const handleStatusChange = async (leadId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `${API_URL}/leads/${leadId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setLeads((prev) => prev.map((l) => l._id === leadId ? { ...l, status: newStatus } : l));
      toast.success("Status updated");
    } catch {
      toast.error("Failed to update status");
    }
  };

  // ── Follow-up ─────────────────────────────────────────────────────────
  const openFollowUpPicker = (leadId) => {
    setEditingFollowUpId(leadId);
    setTimeout(() => {
      const el = dateInputRefs.current[leadId];
      if (!el) return;
      el.focus(); el.click();
      if (typeof el.showPicker === "function") el.showPicker();
    }, 0);
  };

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
      setLeads((prev) => prev.map((l) => l._id === leadId ? { ...l, followUpDate: newDate } : l));
      toast.success("Follow-up date updated");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update follow-up date");
    } finally {
      setFollowUpSavingId(null);
      setEditingFollowUpId(null);
    }
  };

  // ── Formatters ────────────────────────────────────────────────────────
  const formatDate = (d) => {
    if (!d) return "-";
    return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const toDateInputValue = (d) => {
    if (!d) return "";
    const date = new Date(d);
    return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().split("T")[0];
  };

  const statusClasses = {
    Hot:       "bg-red-50 text-red-700 border-red-200 hover:bg-red-100",
    Warm:      "bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100",
    Cold:      "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100",
    Junk:      "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100",
    Converted: "bg-green-50 text-green-700 border-green-200 hover:bg-green-100",
  };

  const getStatusClass = (status) =>
    `w-full px-3 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-1 ${
      statusClasses[status] || statusClasses.Junk
    } ${
      status === "Hot"  ? "focus:ring-red-300"   :
      status === "Warm" ? "focus:ring-yellow-300" :
      status === "Cold" ? "focus:ring-blue-300"   : "focus:ring-gray-300"
    }`;

  // ── Loading ───────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
      </div>
    );
  }

  const firstItem = totalLeads === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1;
  const lastItem  = Math.min(currentPage * ITEMS_PER_PAGE, totalLeads);

  // ── Render ────────────────────────────────────────────────────────────
  return (
    <div className="p-6">
      <ToastContainer position="top-right" autoClose={3000} newestOnTop closeOnClick draggable pauseOnHover theme="light" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4 tour-lead-header">
        <h2 className="text-2xl font-bold text-gray-800">Leads</h2>

        <div className="flex flex-wrap gap-3 items-center">
          <button
            onClick={() => setIsOpen(true)}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 tour-finish"
          >
            <Eye className="w-4 h-4" /> Take Tour
          </button>

          {selectedLeads.length > 0 && (
            <button
              onClick={() => { setLeadToDelete(null); setShowDeleteModal(true); }}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" /> Delete Selected ({selectedLeads.length})
            </button>
          )}

          {(userRole === "Admin" || userRole === "Sales") && (
            <button
              onClick={() => navigate("/createleads")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow flex items-center gap-2 tour-create-lead"
            >
              <Plus className="w-4 h-4" /> Create Lead
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4 tour-filters">
        <div className="relative tour-search">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text" placeholder="Search leads..." value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {userRole === "Admin" && (
          <select value={assigneeFilter} onChange={(e) => setAssigneeFilter(e.target.value)}
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
            <option value="">All Assignees</option>
            {assignees.map((a, i) => <option key={i} value={a}>{a}</option>)}
          </select>
        )}

        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
          <option value="">All Status</option>
          <option value="Hot">Hot</option>
          <option value="Warm">Warm</option>
          <option value="Cold">Cold</option>
          <option value="Junk">Junk</option>
          <option value="Converted">Converted</option>
        </select>

        <select value={sourceFilter} onChange={(e) => setSourceFilter(e.target.value)}
          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
          <option value="">All Sources</option>
          <option value="Website">Website</option>
          <option value="Referral">Referral</option>
          <option value="Social Media">Social Media</option>
          <option value="Email">Email</option>
          <option value="Cold Call">Cold Call</option>
          <option value="Other">Other</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto tour-lead-table rounded-xl border border-gray-200 shadow-sm">
        <table className="min-w-max w-full table-auto divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr className="whitespace-nowrap">
              <th className="px-4 py-3 tour-checkbox">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                  checked={leads.length > 0 && selectedLeads.length === leads.length}
                  onChange={handleSelectAll}
                />
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Lead</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Contact</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Destination</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Country</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Source</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Assignee</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Created</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Follow-Up</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tour-lead-actions">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200 bg-white">
            {leads.length > 0 ? leads.map((lead, idx) => (
              <tr
                key={lead._id}
                className={`hover:bg-blue-50/30 transition-colors whitespace-nowrap ${
                  selectedLeads.includes(lead._id)
                    ? "bg-blue-50"
                    : idx % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                }`}
              >
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                    checked={selectedLeads.includes(lead._id)}
                    onChange={() => handleSelectLead(lead._id)}
                  />
                </td>

                {/* ── Lead cell with fixed avatar ── */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {/* Avatar — always shows initials */}
                    <LeadAvatar name={lead.leadName} />

                    <div className="flex flex-col min-w-0">
                      <span
                        onClick={() => navigate(`/leads/view/${lead._id}`)}
                        className="font-medium text-blue-600 text-sm cursor-pointer hover:underline truncate max-w-[160px]"
                        title={lead.leadName || "Unnamed Lead"}
                      >
                        {lead.leadName || "Unnamed Lead"}
                      </span>
                      <span className="text-gray-400 text-xs truncate max-w-[160px]">
                        {lead.email || "-"}
                      </span>
                    </div>
                  </div>
                </td>

                <td className="px-4 py-3 text-sm text-gray-700">{lead.phoneNumber || "-"}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{lead.destination  || "-"}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{lead.country      || "-"}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{lead.source       || "-"}</td>

                <td className="px-4 py-3">
                  <select
                    value={lead.status}
                    onChange={(e) => handleStatusChange(lead._id, e.target.value)}
                    className={getStatusClass(lead.status)}
                  >
                    <option value="Hot">Hot</option>
                    <option value="Warm">Warm</option>
                    <option value="Cold">Cold</option>
                    <option value="Junk">Junk</option>
                  </select>
                </td>

                <td className="px-4 py-3 text-sm text-gray-700">
                  {lead.assignTo
                    ? typeof lead.assignTo === "object"
                      ? `${lead.assignTo.firstName} ${lead.assignTo.lastName}`
                      : "Assigned User"
                    : "-"}
                </td>

                <td className="px-4 py-3 text-sm text-gray-700">{formatDate(lead.createdAt)}</td>

                <td className="px-4 py-3 text-sm text-gray-700">
                  <div className="relative flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => openFollowUpPicker(lead._id)}
                      disabled={followUpSavingId === lead._id}
                      className="inline-flex items-center gap-2 px-2 py-1 rounded-md hover:bg-gray-100 transition"
                    >
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">
                        {followUpSavingId === lead._id ? "Saving..." : formatDate(lead.followUpDate)}
                      </span>
                    </button>
                    {editingFollowUpId === lead._id && (
                      <input
                        ref={(el) => (dateInputRefs.current[lead._id] = el)}
                        type="date"
                        defaultValue={toDateInputValue(lead.followUpDate)}
                        className="absolute left-0 top-0 w-0 h-0 opacity-0"
                        onChange={(e) => updateFollowUpDateInline(lead._id, e.target.value)}
                        onBlur={() => setEditingFollowUpId(null)}
                      />
                    )}
                  </div>
                </td>

                <td className="px-4 py-3 text-right relative">
                  <button
                    className="p-2 rounded-lg hover:bg-gray-200 transition-colors"
                    onClick={(e) => handleMenuToggle(lead._id, e)}
                  >
                    <MoreVertical className="w-5 h-5 text-gray-600" />
                  </button>

                  {menuOpen === lead._id && (
                    <div
                      className="fixed z-50 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-1"
                      style={{ top: `${menuPosition.top}px`, left: `${menuPosition.left}px` }}
                    >
                      <button
                        onClick={(e) => { e.stopPropagation(); handleEdit(lead._id); }}
                        className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <Edit className="w-4 h-4 mr-2" /> Edit
                      </button>
                      {lead.status !== "Converted" && (
                        <button
                          onClick={(e) => { e.stopPropagation(); openConvertModal(lead); }}
                          className="flex items-center w-full px-3 py-2 text-sm text-green-600 hover:bg-gray-100"
                        >
                          <Handshake className="w-4 h-4 mr-2" /> Convert
                        </button>
                      )}
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDeleteClick(lead._id); }}
                        className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-gray-100"
                      >
                        <Trash2 className="w-4 h-4 mr-2" /> Delete
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={11} className="px-4 py-16 text-center">
                  <div className="flex flex-col items-center gap-2 text-gray-400">
                    <Search className="w-10 h-10 opacity-30" />
                    <p className="text-sm font-medium">No leads found</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between mt-4 gap-3">
          <p className="text-sm text-gray-500">
            Showing{" "}
            <span className="font-semibold text-gray-700">{firstItem}</span>–
            <span className="font-semibold text-gray-700">{lastItem}</span> of{" "}
            <span className="font-semibold text-gray-700">{totalLeads}</span>
          </p>

          <div className="flex items-center gap-1">
            <button onClick={() => goToPage(1)} disabled={currentPage === 1}
              className="px-2 py-1.5 text-sm border rounded-lg hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed">«</button>
            <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}
              className="px-3 py-1.5 text-sm border rounded-lg hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed">‹ Prev</button>

            {pageNumbers().map((p, i) =>
              p === "..." ? (
                <span key={`d${i}`} className="px-2 text-gray-400">…</span>
              ) : (
                <button key={p} onClick={() => goToPage(p)}
                  className={`min-w-[36px] px-2 py-1.5 text-sm border rounded-lg transition-colors ${
                    currentPage === p
                      ? "bg-blue-600 text-white border-blue-600 font-semibold"
                      : "hover:bg-gray-100 text-gray-700"
                  }`}>
                  {p}
                </button>
              )
            )}

            <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}
              className="px-3 py-1.5 text-sm border rounded-lg hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed">Next ›</button>
            <button onClick={() => goToPage(totalPages)} disabled={currentPage === totalPages}
              className="px-2 py-1.5 text-sm border rounded-lg hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed">»</button>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <Trash2 className="w-5 h-5" /> Confirm Delete
            </DialogTitle>
          </DialogHeader>
          <p className="mb-6 text-gray-700">
            Are you sure you want to delete{" "}
            {leadToDelete ? "this lead" : `${selectedLeads.length} selected leads`}?
            This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => { setShowDeleteModal(false); setLeadToDelete(null); }}
              className="px-4 py-2 rounded-lg border hover:bg-gray-100 text-gray-700"
            >Cancel</button>
            <button
              onClick={() => leadToDelete ? handleDeleteLead(leadToDelete) : handleBulkDelete()}
              className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" /> Delete
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Convert Modal */}
      <Dialog open={convertModalOpen} onOpenChange={setConvertModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-green-600">
              <Handshake className="w-5 h-5" /> Convert Lead to Deal
            </DialogTitle>
          </DialogHeader>
          {selectedLead && (
            <>
              <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  Converting: <strong>{selectedLead.leadName}</strong>
                  {selectedLead.destination && ` — ${selectedLead.destination}`}
                </p>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Deal Value</label>
                <div className="flex gap-2">
                  <input
                    type="number" value={dealData.value}
                    onChange={(e) => setDealData((p) => ({ ...p, value: e.target.value }))}
                    placeholder="Enter value"
                    className="flex-1 px-3 py-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:outline-none"
                  />
                  <select
                    value={dealData.currency}
                    onChange={(e) => setDealData((p) => ({ ...p, currency: e.target.value }))}
                    className="px-3 py-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:outline-none"
                  >
                    {allowedCurrencies.map((c) => (
                      <option key={c.code} value={c.code}>{c.symbol} {c.code}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Stage</label>
                <select
                  value={dealData.stage}
                  onChange={(e) => setDealData((p) => ({ ...p, stage: e.target.value }))}
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  value={dealData.notes} rows={3} placeholder="Add any notes..."
                  onChange={(e) => setDealData((p) => ({ ...p, notes: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:outline-none"
                />
              </div>
              <div className="flex justify-end gap-3">
                <button onClick={() => setConvertModalOpen(false)} disabled={converting}
                  className="px-4 py-2 rounded-lg border hover:bg-gray-100 text-gray-700">Cancel</button>
                <button onClick={handleConvertDeal} disabled={converting}
                  className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 flex items-center gap-2 disabled:opacity-50">
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

/* ─── Wrapper ───────────────────────────────────────────────────────── */
export default function LeadTable() {
  return (
    <TourProvider
      steps={tourSteps}
      afterOpen={() => (document.body.style.overflow = "hidden")}
      beforeClose={() => (document.body.style.overflow = "unset")}
      styles={{
        popover:  (base) => ({ ...base, backgroundColor: "#fff", color: "#1f1f1f" }),
        maskArea: (base) => ({ ...base, rx: 8 }),
        badge:    (base) => ({ ...base, display: "none" }),
        close:    (base) => ({ ...base, right: "auto", left: 8, top: 8 }),
      }}
    >
      <LeadTableComponent />
    </TourProvider>
  );
}
