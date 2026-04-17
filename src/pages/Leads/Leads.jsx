// import React, { useState, useEffect, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import axios from "axios";
// import { TourProvider, useTour } from "@reactour/tour";
// import {
//   MoreVertical, Trash2, Edit, Handshake, Search, Plus, Eye, Calendar,
//   TrendingUp, TrendingDown, Users,
// } from "lucide-react";
// import { initSocket, getSocket } from "../../utils/socket"; // ✅ CHANGED: import getSocket too
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../components/ui/dialog";

// const API_URL = import.meta.env.VITE_API_URL;
// const ITEMS_PER_PAGE = 10;

// const tourSteps = [
//   { selector: ".tour-lead-header",  content: "Welcome to the Leads Management page! Here you can view, manage, and convert your leads." },
//   { selector: ".tour-create-lead",  content: "Click here to create a new lead." },
//   { selector: ".tour-search",       content: "Use this search bar to quickly find leads." },
//   { selector: ".tour-filters",      content: "Filter your leads by status, assignee, or source." },
//   { selector: ".tour-lead-table",   content: "This is your leads table with all key information. Facebook leads are marked with a blue 'FB' badge." },
//   { selector: ".tour-checkbox",     content: "Select individual leads or use the header checkbox to select all." },
//   { selector: ".tour-lead-actions", content: "Click the three-dot menu to edit, convert, or delete a lead." },
//   { selector: ".tour-finish",       content: "You've completed the tour!" },
// ];

// /* ── Avatar helpers ──────────────────────────────────────────────────────── */
// const getInitials = (name) => {
//   if (!name || typeof name !== "string") return "?";
//   const trimmed = name.trim();
//   if (!trimmed) return "?";
//   const letters = trimmed.replace(/[^a-zA-Z]/g, "");
//   if (letters.length === 0) return trimmed.slice(0, 2).toUpperCase();
//   if (letters.length === 1) return letters[0].toUpperCase();
//   const words = trimmed.split(/[\s._\-]+/).filter(Boolean);
//   if (words.length >= 2) {
//     const a = words[0].replace(/[^a-zA-Z]/g, "")[0] || "";
//     const b = words[1].replace(/[^a-zA-Z]/g, "")[0] || "";
//     return (a + b).toUpperCase();
//   }
//   return letters.slice(0, 2).toUpperCase();
// };

// const AVATAR_COLORS = [
//   { bg: "bg-blue-100",   text: "text-blue-700"   },
//   { bg: "bg-purple-100", text: "text-purple-700"  },
//   { bg: "bg-green-100",  text: "text-green-700"   },
//   { bg: "bg-orange-100", text: "text-orange-700"  },
//   { bg: "bg-pink-100",   text: "text-pink-700"    },
//   { bg: "bg-teal-100",   text: "text-teal-700"    },
//   { bg: "bg-indigo-100", text: "text-indigo-700"  },
//   { bg: "bg-red-100",    text: "text-red-700"     },
//   { bg: "bg-yellow-100", text: "text-yellow-700"  },
//   { bg: "bg-cyan-100",   text: "text-cyan-700"    },
// ];

// const getAvatarColor = (name) => {
//   if (!name) return AVATAR_COLORS[0];
//   let hash = 0;
//   for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
//   return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
// };

// const LeadAvatar = ({ name }) => {
//   const initials = getInitials(name);
//   const color    = getAvatarColor(name);
//   return (
//     <div
//       className={`h-9 w-9 rounded-full flex-shrink-0 flex items-center justify-center font-semibold text-xs select-none ${color.bg} ${color.text}`}
//       style={{ minWidth: "2.25rem", minHeight: "2.25rem" }}
//       title={name || ""}
//     >
//       {initials}
//     </div>
//   );
// };

// /* ── Facebook badge ─────────────────────────────────────────────────────── */
// const FacebookBadge = () => (
//   <span
//     title="Lead from Facebook Ad"
//     className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-600 text-white leading-none select-none"
//     style={{ letterSpacing: "0.02em" }}
//   >
//     <svg
//       viewBox="0 0 24 24"
//       className="w-2.5 h-2.5 fill-white flex-shrink-0"
//       xmlns="http://www.w3.org/2000/svg"
//       aria-hidden="true"
//     >
//       <path d="M22 12a10 10 0 1 0-11.563 9.874v-6.988H7.898V12h2.539V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.886h-2.33v6.988A10.003 10.003 0 0 0 22 12z"/>
//     </svg>
//     FB
//   </span>
// );

// const fmt = (n) =>
//   new Intl.NumberFormat("en-IN", { maximumFractionDigits: 2 }).format(n);

// /* ═══════════════════════════════════════════════════════════════
//    MAIN COMPONENT
//    ═══════════════════════════════════════════════════════════════ */
// function LeadTableComponent() {
//   const navigate      = useNavigate();
//   const { setIsOpen } = useTour();

//   const [leads,         setLeads]         = useState([]);
//   const [selectedLeads, setSelectedLeads] = useState([]);
//   const [loading,       setLoading]       = useState(true);
//   const [userRole,      setUserRole]      = useState("");
//   const [assignees,     setAssignees]     = useState([]);

//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages,  setTotalPages]  = useState(1);
//   const [totalLeads,  setTotalLeads]  = useState(0);

//   const [searchQuery,     setSearchQuery]     = useState("");
//   const [debouncedSearch, setDebouncedSearch] = useState("");
//   const [statusFilter,    setStatusFilter]    = useState("");
//   const [sourceFilter,    setSourceFilter]    = useState("");
//   const [assigneeFilter,  setAssigneeFilter]  = useState("");
//   const searchTimer = useRef(null);

//   const [menuOpen,     setMenuOpen]     = useState(null);
//   const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });

//   const [showDeleteModal,  setShowDeleteModal]  = useState(false);
//   const [leadToDelete,     setLeadToDelete]     = useState(null);
//   const [convertModalOpen, setConvertModalOpen] = useState(false);
//   const [selectedLead,     setSelectedLead]     = useState(null);
//   const [converting,       setConverting]       = useState(false);

//   /* ── Convert deal state ── */
//   const [dealData, setDealData] = useState({
//     value: "", currency: "USD", notes: "", stage: "Qualification",
//     purchasingLandCost: "", purchasingTicketCost: "",
//     sellingLandCost:    "", sellingTicketCost:    "",
//     noOfTravellers: "", travelDate: "",
//   });

//   const dateInputRefs                              = useRef({});
//   const [editingFollowUpId, setEditingFollowUpId] = useState(null);
//   const [followUpSavingId,  setFollowUpSavingId]  = useState(null);

//   const allowedCurrencies = [
//     { code: "USD", symbol: "$"   }, { code: "EUR", symbol: "€"   },
//     { code: "INR", symbol: "₹"   }, { code: "GBP", symbol: "£"   },
//     { code: "JPY", symbol: "¥"   }, { code: "AUD", symbol: "A$"  },
//     { code: "CAD", symbol: "C$"  }, { code: "CHF", symbol: "CHF" },
//     { code: "MYR", symbol: "RM"  }, { code: "AED", symbol: "د.إ" },
//     { code: "SGD", symbol: "S$"  }, { code: "ZAR", symbol: "R"   },
//     { code: "SAR", symbol: "﷼"   },
//   ];

//   const parseCost = (v) => {
//     const n = parseFloat(String(v || "").replace(/,/g, ""));
//     return isNaN(n) ? 0 : n;
//   };

//   const totalPurchasing = parseCost(dealData.purchasingLandCost) + parseCost(dealData.purchasingTicketCost);
//   const totalSelling    = parseCost(dealData.sellingLandCost)    + parseCost(dealData.sellingTicketCost);
//   const profit          = totalSelling - totalPurchasing;

//   // ✅ CHANGED: Get userId once and store in ref so it's available for socket
//   const userIdRef = useRef(null);

//   useEffect(() => {
//     try {
//       const user = JSON.parse(localStorage.getItem("user") || "{}");
//       setUserRole(user.role?.name || "");
//       userIdRef.current = user._id || user.id || null; // ✅ CHANGED: store userId
//     } catch {}
//   }, []);

//   // ✅ CHANGED: Initialize socket WITH userId, then listen for new Facebook leads
//   useEffect(() => {
//     // Wait a tick so the user effect above has run first
//     const timer = setTimeout(() => {
//       const userId = userIdRef.current;
//       const socket = initSocket(userId);
//       if (!socket) return;

//       const handleNewLead = (newLead) => {
//         // Only prepend if we're on page 1 with no active filters
//         // (otherwise the lead's position in the list would be confusing)
//         setLeads((prev) => {
//           // Avoid duplicate if somehow the lead already exists
//           if (prev.some((l) => l._id === newLead._id)) return prev;
//           return [newLead, ...prev];
//         });
//         setTotalLeads((prev) => prev + 1);

//         // Show a toast so the user knows a new lead just arrived
//         // toast.info(
//         //   `🆕 New Facebook lead: ${newLead.leadName || "Unknown"}`,
//         //   {
//         //     autoClose: 5000,
//         //     icon: "📋",
//         //   }
//         // );
//       };

//       socket.on("new_facebook_lead", handleNewLead);

//       // Cleanup: remove listener when component unmounts
//       return () => {
//         socket.off("new_facebook_lead", handleNewLead);
//       };
//     }, 100);

//     return () => clearTimeout(timer);
//   }, []); // ✅ runs once on mount

//   useEffect(() => {
//     if (searchTimer.current) clearTimeout(searchTimer.current);
//     searchTimer.current = setTimeout(() => { setDebouncedSearch(searchQuery); setCurrentPage(1); }, 500);
//     return () => clearTimeout(searchTimer.current);
//   }, [searchQuery]);

//   useEffect(() => { setCurrentPage(1); }, [statusFilter, sourceFilter, assigneeFilter]);

//   useEffect(() => {
//     const fetchLeads = async () => {
//       try {
//         setLoading(true);
//         const params = new URLSearchParams({ page: currentPage, limit: ITEMS_PER_PAGE });
//         if (debouncedSearch) params.append("search",   debouncedSearch);
//         if (statusFilter)    params.append("status",   statusFilter);
//         if (sourceFilter)    params.append("source",   sourceFilter);
//         if (assigneeFilter)  params.append("assignee", assigneeFilter);

//         const { data } = await axios.get(
//           `${API_URL}/leads/getAllLead?${params.toString()}`,
//           { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
//         );

//         const isNew    = data && !Array.isArray(data) && Array.isArray(data.leads);
//         const leadsArr = isNew ? data.leads : (Array.isArray(data) ? data : []);
//         const total    = isNew ? data.totalLeads : leadsArr.length;
//         const pages    = isNew ? data.totalPages : Math.ceil(leadsArr.length / ITEMS_PER_PAGE);

//         setLeads(leadsArr);
//         setTotalLeads(total);
//         setTotalPages(pages);

//         const seen = new Set();
//         const unique = [];
//         leadsArr.forEach((lead) => {
//           if (!lead.assignTo) return;
//           const name = typeof lead.assignTo === "object" && lead.assignTo.firstName
//             ? `${lead.assignTo.firstName} ${lead.assignTo.lastName}` : "Assigned User";
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

//   // ... rest of your handlers are unchanged below ...
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

//   const handleDeleteLead = async (id) => {
//     try {
//       await axios.delete(`${API_URL}/leads/deleteLead/${id}`, {
//         headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
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

//   const handleBulkDelete = async () => {
//     try {
//       await Promise.all(selectedLeads.map((id) =>
//         axios.delete(`${API_URL}/leads/deleteLead/${id}`, {
//           headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
//         })
//       ));
//       setLeads((prev) => prev.filter((l) => !selectedLeads.includes(l._id)));
//       setTotalLeads((prev) => prev - selectedLeads.length);
//       toast.success(`${selectedLeads.length} leads deleted`);
//       setSelectedLeads([]);
//       if (leads.length === selectedLeads.length && currentPage > 1) setCurrentPage((p) => p - 1);
//     } catch {
//       toast.error("Error deleting leads");
//     } finally {
//       setShowDeleteModal(false);
//     }
//   };

//   const handleSelectLead = (id) =>
//     setSelectedLeads((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
//   const handleSelectAll = (e) =>
//     setSelectedLeads(e.target.checked ? leads.map((l) => l._id) : []);

//   const handleMenuToggle = (leadId, e) => {
//     e.stopPropagation();
//     const rect = e.currentTarget.getBoundingClientRect();
//     let top  = rect.bottom + window.scrollY + 4;
//     let left = rect.right  + window.scrollX - 160;
//     if (rect.bottom + 120 > window.innerHeight) top = rect.top + window.scrollY - 124;
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

//   const openConvertModal = (lead) => {
//     setSelectedLead(lead);
//     setDealData({
//       value: lead.value || "",
//       currency: lead.currency || "USD",
//       notes: lead.notes || "",
//       stage: "Qualification",
//       purchasingLandCost: "", purchasingTicketCost: "",
//       sellingLandCost:    "", sellingTicketCost:    "",
//       noOfTravellers: lead.noOfTravellers != null ? String(lead.noOfTravellers) : "",
//       travelDate: lead.travelDate
//         ? new Date(lead.travelDate).toISOString().split("T")[0]
//         : "",
//     });
//     setConvertModalOpen(true);
//     setMenuOpen(null);
//   };

//   const handleConvertDeal = async () => {
//     if (!selectedLead) return;
//     try {
//       setConverting(true);
//       const toastId = toast.loading("Converting lead to deal...");
//       const res     = await axios.patch(
//         `${API_URL}/leads/${selectedLead._id}/convert`,
//         dealData,
//         { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
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

//   const handleStatusChange = async (leadId, newStatus) => {
//     try {
//       await axios.patch(
//         `${API_URL}/leads/${leadId}/status`,
//         { status: newStatus },
//         { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
//       );
//       setLeads((prev) => prev.map((l) => l._id === leadId ? { ...l, status: newStatus } : l));
//       toast.success("Status updated");
//     } catch {
//       toast.error("Failed to update status");
//     }
//   };

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
//       await axios.patch(
//         `${API_URL}/leads/${leadId}/followup`,
//         { followUpDate: newDate },
//         { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
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
//     `w-full px-3 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-1 ${statusClasses[status] || statusClasses.Junk} ${
//       status === "Hot" ? "focus:ring-red-300" : status === "Warm" ? "focus:ring-yellow-300" : status === "Cold" ? "focus:ring-blue-300" : "focus:ring-gray-300"
//     }`;

//   const SourceBadge = ({ source }) => {
//     if (!source) return <span className="text-gray-400 text-xs">-</span>;
//     if (source === "Facebook") {
//       return (
//         <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200 whitespace-nowrap">
//           <svg viewBox="0 0 24 24" className="w-2.5 h-2.5 fill-blue-600 flex-shrink-0" xmlns="http://www.w3.org/2000/svg">
//             <path d="M22 12a10 10 0 1 0-11.563 9.874v-6.988H7.898V12h2.539V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.886h-2.33v6.988A10.003 10.003 0 0 0 22 12z"/>
//           </svg>
//           Facebook
//         </span>
//       );
//     }
//     return <span className="text-sm text-gray-700">{source}</span>;
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
//       </div>
//     );
//   }

//   const firstItem = totalLeads === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1;
//   const lastItem  = Math.min(currentPage * ITEMS_PER_PAGE, totalLeads);

//   return (
//     <div className="p-6">
//       <ToastContainer position="top-right" autoClose={3000} newestOnTop closeOnClick draggable pauseOnHover theme="light" />

//       {/* Header */}
//       <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4 tour-lead-header">
//         <div className="flex items-center gap-3">
//           <h2 className="text-2xl font-bold text-gray-800">Leads</h2>
//           {totalLeads > 0 && (
//             <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-xs font-semibold">
//               {totalLeads} total
//             </span>
//           )}
//         </div>
//         <div className="flex flex-wrap gap-3 items-center">
//           <button onClick={() => setIsOpen(true)} className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 tour-finish">
//             <Eye className="w-4 h-4" /> Take Tour
//           </button>
//           {selectedLeads.length > 0 && (
//             <button onClick={() => { setLeadToDelete(null); setShowDeleteModal(true); }} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow flex items-center gap-2">
//               <Trash2 className="w-4 h-4" /> Delete Selected ({selectedLeads.length})
//             </button>
//           )}
//           {(userRole === "Admin" || userRole === "Sales") && (
//             <button onClick={() => navigate("/createleads")} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow flex items-center gap-2 tour-create-lead">
//               <Plus className="w-4 h-4" /> Create Lead
//             </button>
//           )}
//         </div>
//       </div>

//       {/* Filters */}
//       <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4 tour-filters">
//         <div className="relative tour-search">
//           <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
//           <input
//             type="text"
//             placeholder="Search leads..."
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             className="w-full pl-10 pr-4 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//         </div>
//         {userRole === "Admin" && (
//           <select
//             value={assigneeFilter}
//             onChange={(e) => setAssigneeFilter(e.target.value)}
//             className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
//           >
//             <option value="">All Assignees</option>
//             {assignees.map((a, i) => <option key={i} value={a}>{a}</option>)}
//           </select>
//         )}
//         <select
//           value={statusFilter}
//           onChange={(e) => setStatusFilter(e.target.value)}
//           className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
//         >
//           <option value="">All Status</option>
//           <option value="Hot">Hot</option>
//           <option value="Warm">Warm</option>
//           <option value="Cold">Cold</option>
//           <option value="Junk">Junk</option>
//           <option value="Converted">Converted</option>
//         </select>
//         <select
//           value={sourceFilter}
//           onChange={(e) => setSourceFilter(e.target.value)}
//           className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
//         >
//           <option value="">All Sources</option>
//           <option value="Website">Website</option>
//           <option value="Referral">Referral</option>
//           <option value="Social Media">Social Media</option>
//           <option value="Email">Email</option>
//           <option value="Cold Call">Cold Call</option>
//           <option value="Facebook">Facebook</option>
//           <option value="Other">Other</option>
//         </select>
//       </div>

//       {/* Table - unchanged from your original */}
//       <div className="tour-lead-table rounded-xl border border-gray-200 shadow-sm overflow-hidden">
//         <div className="overflow-x-auto overflow-y-auto max-h-[calc(100vh-280px)]">
//           <table className="min-w-max w-full table-auto divide-y divide-gray-200">
//             <thead className="sticky top-0 bg-gray-50 z-10">
//               <tr className="whitespace-nowrap">
//                 <th className="px-4 py-3 tour-checkbox">
//                   <input
//                     type="checkbox"
//                     className="h-4 w-4 text-blue-600 border-gray-300 rounded"
//                     checked={leads.length > 0 && selectedLeads.length === leads.length}
//                     onChange={handleSelectAll}
//                   />
//                 </th>
//                 <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Lead</th>
//                 <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Contact</th>
//                 <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Destination</th>
//                 <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Country</th>
//                 <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Source</th>
//                 <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Travellers</th>
//                 <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Travel Date</th>
//                 <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
//                 <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Assignee</th>
//                 <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Created</th>
//                 <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Follow-Up</th>
//                 <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tour-lead-actions sticky right-0 bg-gray-50 shadow-[-4px_0_8px_-2px_rgba(0,0,0,0.08)] z-20">
//                   Actions
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-200 bg-white">
//               {leads.length > 0 ? leads.map((lead, idx) => {
//                 const isFacebook = lead.source === "Facebook";
//                 return (
//                   <tr
//                     key={lead._id}
//                     className={`hover:bg-blue-50/30 transition-colors whitespace-nowrap ${
//                       selectedLeads.includes(lead._id)
//                         ? "bg-blue-50"
//                         : idx % 2 === 0
//                           ? "bg-white"
//                           : "bg-gray-50/50"
//                     }`}
//                   >
//                     <td className="px-4 py-3">
//                       <input
//                         type="checkbox"
//                         className="h-4 w-4 text-blue-600 border-gray-300 rounded"
//                         checked={selectedLeads.includes(lead._id)}
//                         onChange={() => handleSelectLead(lead._id)}
//                       />
//                     </td>
//                     <td className="px-4 py-3">
//                       <div className="flex items-center gap-3">
//                         <LeadAvatar name={lead.leadName} />
//                         <div className="flex flex-col min-w-0">
//                           <div className="flex items-center gap-1.5 flex-wrap">
//                             <span
//                               onClick={() => navigate(`/leads/view/${lead._id}`)}
//                               className="font-medium text-blue-600 text-sm cursor-pointer hover:underline truncate max-w-[140px]"
//                               title={lead.leadName || "Unnamed Lead"}
//                             >
//                               {lead.leadName || "Unnamed Lead"}
//                             </span>
//                             {isFacebook && <FacebookBadge />}
//                           </div>
//                           <span className="text-gray-400 text-xs truncate max-w-[160px]">
//                             {lead.email || "-"}
//                           </span>
//                         </div>
//                       </div>
//                     </td>
//                     <td className="px-4 py-3 text-sm text-gray-700">{lead.phoneNumber || "-"}</td>
//                     <td className="px-4 py-3 text-sm text-gray-700">{lead.destination  || "-"}</td>
//                     <td className="px-4 py-3 text-sm text-gray-700">{lead.country      || "-"}</td>
//                     <td className="px-4 py-3"><SourceBadge source={lead.source} /></td>
//                     <td className="px-4 py-3 text-sm text-gray-700">
//                       {lead.noOfTravellers != null ? (
//                         <span className="inline-flex items-center gap-1">
//                           <Users className="w-3.5 h-3.5 text-gray-400" />{lead.noOfTravellers}
//                         </span>
//                       ) : "-"}
//                     </td>
//                     <td className="px-4 py-3 text-sm text-gray-700">{formatDate(lead.travelDate)}</td>
//                     <td className="px-4 py-3">
//                       <select
//                         value={lead.status}
//                         onChange={(e) => handleStatusChange(lead._id, e.target.value)}
//                         className={getStatusClass(lead.status)}
//                       >
//                         <option value="Hot">Hot</option>
//                         <option value="Warm">Warm</option>
//                         <option value="Cold">Cold</option>
//                         <option value="Junk">Junk</option>
//                       </select>
//                     </td>
//                     <td className="px-4 py-3 text-sm text-gray-700">
//                       {lead.assignTo
//                         ? typeof lead.assignTo === "object"
//                           ? `${lead.assignTo.firstName} ${lead.assignTo.lastName}`
//                           : "Assigned User"
//                         : <span className="text-gray-400 italic text-xs">Unassigned</span>}
//                     </td>
//                     <td className="px-4 py-3 text-sm text-gray-700">{formatDate(lead.createdAt)}</td>
//                     <td className="px-4 py-3 text-sm text-gray-700">
//                       <div className="relative flex items-center gap-1">
//                         <button
//                           type="button"
//                           onClick={() => openFollowUpPicker(lead._id)}
//                           disabled={followUpSavingId === lead._id}
//                           className="inline-flex items-center gap-2 px-2 py-1 rounded-md hover:bg-gray-100 transition"
//                         >
//                           <Calendar className="w-4 h-4 text-gray-500" />
//                           <span className="text-sm">
//                             {followUpSavingId === lead._id ? "Saving..." : formatDate(lead.followUpDate)}
//                           </span>
//                         </button>
//                         {editingFollowUpId === lead._id && (
//                           <input
//                             ref={(el) => (dateInputRefs.current[lead._id] = el)}
//                             type="date"
//                             defaultValue={toDateInputValue(lead.followUpDate)}
//                             className="absolute left-0 top-0 w-0 h-0 opacity-0"
//                             onChange={(e) => updateFollowUpDateInline(lead._id, e.target.value)}
//                             onBlur={() => setEditingFollowUpId(null)}
//                           />
//                         )}
//                       </div>
//                     </td>
//                     <td className={`px-4 py-3 text-right relative sticky right-0 z-10 shadow-[-4px_0_8px_-2px_rgba(0,0,0,0.06)] ${
//                       selectedLeads.includes(lead._id)
//                         ? "bg-blue-50"
//                         : idx % 2 === 0
//                           ? "bg-white"
//                           : "bg-gray-50/80"
//                     }`}>
//                       <button
//                         className="p-2 rounded-lg hover:bg-gray-200 transition-colors"
//                         onClick={(e) => handleMenuToggle(lead._id, e)}
//                       >
//                         <MoreVertical className="w-5 h-5 text-gray-600" />
//                       </button>
//                       {menuOpen === lead._id && (
//                         <div
//                           className="fixed z-50 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-1"
//                           style={{ top: `${menuPosition.top}px`, left: `${menuPosition.left}px` }}
//                         >
//                           <button
//                             onClick={(e) => { e.stopPropagation(); handleEdit(lead._id); }}
//                             className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
//                           >
//                             <Edit className="w-4 h-4 mr-2" /> Edit
//                           </button>
//                           {lead.status !== "Converted" && (
//                             <button
//                               onClick={(e) => { e.stopPropagation(); openConvertModal(lead); }}
//                               className="flex items-center w-full px-3 py-2 text-sm text-green-600 hover:bg-gray-100"
//                             >
//                               <Handshake className="w-4 h-4 mr-2" /> Convert
//                             </button>
//                           )}
//                           <button
//                             onClick={(e) => { e.stopPropagation(); handleDeleteClick(lead._id); }}
//                             className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-gray-100"
//                           >
//                             <Trash2 className="w-4 h-4 mr-2" /> Delete
//                           </button>
//                         </div>
//                       )}
//                     </td>
//                   </tr>
//                 );
//               }) : (
//                 <tr>
//                   <td colSpan={13} className="px-4 py-16 text-center">
//                     <div className="flex flex-col items-center gap-2 text-gray-400">
//                       <Search className="w-10 h-10 opacity-30" />
//                       <p className="text-sm font-medium">No leads found</p>
//                       <p className="text-xs text-gray-300">
//                         {sourceFilter === "Facebook"
//                           ? "No Facebook leads yet. They appear automatically when someone submits your Facebook Lead Ad form."
//                           : "Try adjusting your search or filters"}
//                       </p>
//                     </div>
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* Pagination - unchanged */}
//       {totalPages > 1 && (
//         <div className="flex flex-col sm:flex-row items-center justify-between mt-4 gap-3">
//           <p className="text-sm text-gray-500">
//             Showing <span className="font-semibold text-gray-700">{firstItem}</span>–
//             <span className="font-semibold text-gray-700">{lastItem}</span> of{" "}
//             <span className="font-semibold text-gray-700">{totalLeads}</span>
//           </p>
//           <div className="flex items-center gap-1">
//             <button onClick={() => goToPage(1)} disabled={currentPage === 1} className="px-2 py-1.5 text-sm border rounded-lg hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed">«</button>
//             <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1} className="px-3 py-1.5 text-sm border rounded-lg hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed">‹ Prev</button>
//             {pageNumbers().map((p, i) =>
//               p === "..." ? <span key={`d${i}`} className="px-2 text-gray-400">…</span> : (
//                 <button key={p} onClick={() => goToPage(p)} className={`min-w-[36px] px-2 py-1.5 text-sm border rounded-lg transition-colors ${currentPage === p ? "bg-blue-600 text-white border-blue-600 font-semibold" : "hover:bg-gray-100 text-gray-700"}`}>{p}</button>
//               )
//             )}
//             <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages} className="px-3 py-1.5 text-sm border rounded-lg hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed">Next ›</button>
//             <button onClick={() => goToPage(totalPages)} disabled={currentPage === totalPages} className="px-2 py-1.5 text-sm border rounded-lg hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed">»</button>
//           </div>
//         </div>
//       )}

//       {/* Delete Modal - unchanged */}
//       <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle className="flex items-center gap-2 text-red-600">
//               <Trash2 className="w-5 h-5" /> Confirm Delete
//             </DialogTitle>
//           </DialogHeader>
//           <p className="mb-6 text-gray-700">
//             Are you sure you want to delete{" "}
//             {leadToDelete ? "this lead" : `${selectedLeads.length} selected leads`}? This action cannot be undone.
//           </p>
//           <div className="flex justify-end gap-3">
//             <button
//               onClick={() => { setShowDeleteModal(false); setLeadToDelete(null); }}
//               className="px-4 py-2 rounded-lg border hover:bg-gray-100 text-gray-700"
//             >
//               Cancel
//             </button>
//             <button
//               onClick={() => leadToDelete ? handleDeleteLead(leadToDelete) : handleBulkDelete()}
//               className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 flex items-center gap-2"
//             >
//               <Trash2 className="w-4 h-4" /> Delete
//             </button>
//           </div>
//         </DialogContent>
//       </Dialog>

//       {/* Convert Modal - unchanged */}
//       <Dialog open={convertModalOpen} onOpenChange={setConvertModalOpen}>
//         <DialogContent className="!max-w-3xl w-full p-0 overflow-hidden">
//           <div className="px-6 pt-5 pb-3 border-b border-gray-100">
//             <DialogTitle className="flex items-center gap-2 text-green-600 text-lg font-semibold">
//               <Handshake className="w-5 h-5" /> Convert Lead to Deal
//             </DialogTitle>
//           </div>
//           {selectedLead && (
//             <div className="px-6 py-5 space-y-5 max-h-[78vh] overflow-y-auto">
//               <div className={`p-3 rounded-lg border ${selectedLead.source === "Facebook" ? "bg-blue-50 border-blue-200" : "bg-blue-50 border-blue-100"}`}>
//                 <div className="flex items-center gap-2 flex-wrap">
//                   <p className="text-sm text-blue-800">
//                     Converting: <strong>{selectedLead.leadName}</strong>
//                     {selectedLead.destination && ` — ${selectedLead.destination}`}
//                   </p>
//                   {selectedLead.source === "Facebook" && (
//                     <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-600 text-white">
//                       <svg viewBox="0 0 24 24" className="w-2.5 h-2.5 fill-white" xmlns="http://www.w3.org/2000/svg">
//                         <path d="M22 12a10 10 0 1 0-11.563 9.874v-6.988H7.898V12h2.539V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.886h-2.33v6.988A10.003 10.003 0 0 0 22 12z"/>
//                       </svg>
//                       Facebook Lead
//                     </span>
//                   )}
//                 </div>
//               </div>
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                 <div className="md:col-span-2">
//                   <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Deal Value</label>
//                   <div className="flex gap-2">
//                     <select
//                       value={dealData.currency}
//                       onChange={(e) => setDealData((p) => ({ ...p, currency: e.target.value }))}
//                       className="w-28 px-2 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none bg-white"
//                     >
//                       {allowedCurrencies.map((c) => <option key={c.code} value={c.code}>{c.symbol} {c.code}</option>)}
//                     </select>
//                     <input
//                       type="number"
//                       value={dealData.value}
//                       onChange={(e) => setDealData((p) => ({ ...p, value: e.target.value }))}
//                       placeholder="Enter value"
//                       className="flex-1 min-w-0 px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
//                     />
//                   </div>
//                 </div>
//                 <div>
//                   <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Stage</label>
//                   <select
//                     value={dealData.stage}
//                     onChange={(e) => setDealData((p) => ({ ...p, stage: e.target.value }))}
//                     className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none bg-white"
//                   >
//                     <option value="Qualification">Qualification</option>
//                     <option value="Proposal">Proposal</option>
//                     <option value="Negotiation">Negotiation</option>
//                     <option value="Closed Won">Closed Won</option>
//                     <option value="Closed Lost">Closed Lost</option>
//                   </select>
//                 </div>
//               </div>
//               <div className="grid grid-cols-2 gap-4">
//                 <div className="flex items-center gap-2">
//                   <span className="text-xs font-bold text-gray-600 uppercase tracking-wide whitespace-nowrap">Purchasing Cost</span>
//                   <div className="flex-1 h-px bg-gray-200" />
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <span className="text-xs font-bold text-gray-600 uppercase tracking-wide whitespace-nowrap">Selling Cost</span>
//                   <div className="flex-1 h-px bg-gray-200" />
//                 </div>
//               </div>
//               <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                 <div>
//                   <label className="block text-xs font-medium text-gray-600 mb-1.5">Land Part</label>
//                   <input type="text" placeholder="e.g. 5000" value={dealData.purchasingLandCost}
//                     onChange={(e) => setDealData((p) => ({ ...p, purchasingLandCost: e.target.value }))}
//                     className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none" />
//                 </div>
//                 <div>
//                   <label className="block text-xs font-medium text-gray-600 mb-1.5">Ticket</label>
//                   <input type="text" placeholder="e.g. 2000" value={dealData.purchasingTicketCost}
//                     onChange={(e) => setDealData((p) => ({ ...p, purchasingTicketCost: e.target.value }))}
//                     className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none" />
//                 </div>
//                 <div>
//                   <label className="block text-xs font-medium text-gray-600 mb-1.5">Land Part</label>
//                   <input type="text" placeholder="e.g. 7000" value={dealData.sellingLandCost}
//                     onChange={(e) => setDealData((p) => ({ ...p, sellingLandCost: e.target.value }))}
//                     className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none" />
//                 </div>
//                 <div>
//                   <label className="block text-xs font-medium text-gray-600 mb-1.5">Ticket</label>
//                   <input type="text" placeholder="e.g. 3000" value={dealData.sellingTicketCost}
//                     onChange={(e) => setDealData((p) => ({ ...p, sellingTicketCost: e.target.value }))}
//                     className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none" />
//                 </div>
//               </div>
//               <div className="grid grid-cols-2 gap-4">
//                 <div className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 overflow-hidden">
//                   <span className="text-xs font-medium text-gray-500 whitespace-nowrap">Total Purchasing</span>
//                   <span className="text-sm font-bold text-gray-700 ml-2 truncate">{dealData.currency} {fmt(totalPurchasing)}</span>
//                 </div>
//                 <div className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 overflow-hidden">
//                   <span className="text-xs font-medium text-gray-500 whitespace-nowrap">Total Selling</span>
//                   <span className="text-sm font-bold text-gray-700 ml-2 truncate">{dealData.currency} {fmt(totalSelling)}</span>
//                 </div>
//               </div>
//               {(totalPurchasing > 0 || totalSelling > 0) && (
//                 <div className={`flex items-center justify-between px-4 py-3 rounded-lg border overflow-hidden ${profit >= 0 ? "bg-emerald-50 border-emerald-200" : "bg-red-50 border-red-200"}`}>
//                   <div className="flex items-center gap-2 flex-shrink-0">
//                     {profit >= 0 ? <TrendingUp size={16} className="text-emerald-600" /> : <TrendingDown size={16} className="text-red-600" />}
//                     <span className={`text-sm font-semibold ${profit >= 0 ? "text-emerald-700" : "text-red-700"}`}>
//                       {profit >= 0 ? "Net Profit" : "Net Loss"}
//                     </span>
//                   </div>
//                   <span className={`text-base font-bold ml-4 truncate ${profit >= 0 ? "text-emerald-700" : "text-red-700"}`}>
//                     {profit >= 0 ? "+" : "-"}{dealData.currency} {fmt(Math.abs(profit))}
//                   </span>
//                 </div>
//               )}
//               <div>
//                 <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Notes</label>
//                 <textarea
//                   value={dealData.notes}
//                   rows={4}
//                   placeholder="Add any notes..."
//                   onChange={(e) => setDealData((p) => ({ ...p, notes: e.target.value }))}
//                   className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none resize-y"
//                 />
//               </div>
//               <div className="flex justify-end gap-3 pt-1 border-t border-gray-100">
//                 <button
//                   onClick={() => setConvertModalOpen(false)}
//                   disabled={converting}
//                   className="px-5 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 text-gray-700 text-sm font-medium"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={handleConvertDeal}
//                   disabled={converting}
//                   className="px-5 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 flex items-center gap-2 text-sm font-medium disabled:opacity-50"
//                 >
//                   <Handshake size={15} />
//                   {converting ? "Converting..." : "Convert to Deal"}
//                 </button>
//               </div>
//             </div>
//           )}
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }

// export default function LeadTable() {
//   return (
//     <TourProvider
//       steps={tourSteps}
//       afterOpen={() => (document.body.style.overflow = "hidden")}
//       beforeClose={() => (document.body.style.overflow = "unset")}
//       styles={{
//         popover:  (base) => ({ ...base, backgroundColor: "#fff", color: "#1f1f1f" }),
//         maskArea: (base) => ({ ...base, rx: 8 }),
//         badge:    (base) => ({ ...base, display: "none" }),
//         close:    (base) => ({ ...base, right: "auto", left: 8, top: 8 }),
//       }}
//     >
//       <LeadTableComponent />
//     </TourProvider>
//   );
// }//without refresh data come correctly..


// import React, { useState, useEffect, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import axios from "axios";
// import { TourProvider, useTour } from "@reactour/tour";
// import {
//   MoreVertical, Trash2, Edit, Handshake, Search, Plus, Eye, Calendar,
//   TrendingUp, TrendingDown, Users,
// } from "lucide-react";
// import { initSocket, getSocket } from "../../utils/socket";
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../components/ui/dialog";

// const API_URL = import.meta.env.VITE_API_URL;
// const ITEMS_PER_PAGE = 10;

// const tourSteps = [
//   { selector: ".tour-lead-header",  content: "Welcome to the Leads Management page! Here you can view, manage, and convert your leads." },
//   { selector: ".tour-create-lead",  content: "Click here to create a new lead." },
//   { selector: ".tour-search",       content: "Use this search bar to quickly find leads." },
//   { selector: ".tour-filters",      content: "Filter your leads by status, assignee, or source." },
//   { selector: ".tour-lead-table",   content: "This is your leads table with all key information. Facebook leads are marked with a blue 'FB' badge." },
//   { selector: ".tour-checkbox",     content: "Select individual leads or use the header checkbox to select all." },
//   { selector: ".tour-lead-actions", content: "Click the three-dot menu to edit, convert, or delete a lead." },
//   { selector: ".tour-finish",       content: "You've completed the tour!" },
// ];

// /* ── Avatar helpers ── */
// const getInitials = (name) => {
//   if (!name || typeof name !== "string") return "?";
//   const trimmed = name.trim();
//   if (!trimmed) return "?";
//   const letters = trimmed.replace(/[^a-zA-Z]/g, "");
//   if (letters.length === 0) return trimmed.slice(0, 2).toUpperCase();
//   if (letters.length === 1) return letters[0].toUpperCase();
//   const words = trimmed.split(/[\s._\-]+/).filter(Boolean);
//   if (words.length >= 2) {
//     const a = words[0].replace(/[^a-zA-Z]/g, "")[0] || "";
//     const b = words[1].replace(/[^a-zA-Z]/g, "")[0] || "";
//     return (a + b).toUpperCase();
//   }
//   return letters.slice(0, 2).toUpperCase();
// };

// const AVATAR_COLORS = [
//   { bg: "bg-blue-100",   text: "text-blue-700"   },
//   { bg: "bg-purple-100", text: "text-purple-700"  },
//   { bg: "bg-green-100",  text: "text-green-700"   },
//   { bg: "bg-orange-100", text: "text-orange-700"  },
//   { bg: "bg-pink-100",   text: "text-pink-700"    },
//   { bg: "bg-teal-100",   text: "text-teal-700"    },
//   { bg: "bg-indigo-100", text: "text-indigo-700"  },
//   { bg: "bg-red-100",    text: "text-red-700"     },
//   { bg: "bg-yellow-100", text: "text-yellow-700"  },
//   { bg: "bg-cyan-100",   text: "text-cyan-700"    },
// ];

// const getAvatarColor = (name) => {
//   if (!name) return AVATAR_COLORS[0];
//   let hash = 0;
//   for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
//   return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
// };

// const LeadAvatar = ({ name }) => {
//   const initials = getInitials(name);
//   const color    = getAvatarColor(name);
//   return (
//     <div
//       className={`h-9 w-9 rounded-full flex-shrink-0 flex items-center justify-center font-semibold text-xs select-none ${color.bg} ${color.text}`}
//       style={{ minWidth: "2.25rem", minHeight: "2.25rem" }}
//       title={name || ""}
//     >
//       {initials}
//     </div>
//   );
// };

// /* ── Facebook badge ── */
// const FacebookBadge = () => (
//   <span
//     title="Lead from Facebook Ad"
//     className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-600 text-white leading-none select-none"
//     style={{ letterSpacing: "0.02em" }}
//   >
//     <svg viewBox="0 0 24 24" className="w-2.5 h-2.5 fill-white flex-shrink-0" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
//       <path d="M22 12a10 10 0 1 0-11.563 9.874v-6.988H7.898V12h2.539V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.886h-2.33v6.988A10.003 10.003 0 0 0 22 12z"/>
//     </svg>
//     FB
//   </span>
// );

// const fmt = (n) => new Intl.NumberFormat("en-IN", { maximumFractionDigits: 2 }).format(n);

// /* ═══════════════════════════════════════════════════════════════
//    MAIN COMPONENT
//    ═══════════════════════════════════════════════════════════════ */
// function LeadTableComponent() {
//   const navigate      = useNavigate();
//   const { setIsOpen } = useTour();

//   const [leads,         setLeads]         = useState([]);
//   const [selectedLeads, setSelectedLeads] = useState([]);
//   const [loading,       setLoading]       = useState(true);
//   const [userRole,      setUserRole]      = useState("");
//   const [assignees,     setAssignees]     = useState([]);

//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages,  setTotalPages]  = useState(1);
//   const [totalLeads,  setTotalLeads]  = useState(0);

//   const [searchQuery,     setSearchQuery]     = useState("");
//   const [debouncedSearch, setDebouncedSearch] = useState("");
//   const [statusFilter,    setStatusFilter]    = useState("");
//   const [sourceFilter,    setSourceFilter]    = useState("");
//   const [assigneeFilter,  setAssigneeFilter]  = useState("");
//   const searchTimer = useRef(null);

//   const [menuOpen,     setMenuOpen]     = useState(null);
//   const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });

//   const [showDeleteModal,  setShowDeleteModal]  = useState(false);
//   const [leadToDelete,     setLeadToDelete]     = useState(null);
//   const [convertModalOpen, setConvertModalOpen] = useState(false);
//   const [selectedLead,     setSelectedLead]     = useState(null);
//   const [converting,       setConverting]       = useState(false);

//   /* ── Convert deal state — updated with noOfAdults + noOfChildren ── */
//   const [dealData, setDealData] = useState({
//     value: "", currency: "USD", notes: "", stage: "Qualification",
//     purchasingLandCost: "", purchasingTicketCost: "",
//     sellingLandCost:    "", sellingTicketCost:    "",
//     noOfAdults:   "",
//     noOfChildren: "",
//     travelDate:   "",
//   });

//   const dateInputRefs                              = useRef({});
//   const [editingFollowUpId, setEditingFollowUpId] = useState(null);
//   const [followUpSavingId,  setFollowUpSavingId]  = useState(null);

//   const allowedCurrencies = [
//     { code: "USD", symbol: "$"   }, { code: "EUR", symbol: "€"   },
//     { code: "INR", symbol: "₹"   }, { code: "GBP", symbol: "£"   },
//     { code: "JPY", symbol: "¥"   }, { code: "AUD", symbol: "A$"  },
//     { code: "CAD", symbol: "C$"  }, { code: "CHF", symbol: "CHF" },
//     { code: "MYR", symbol: "RM"  }, { code: "AED", symbol: "د.إ" },
//     { code: "SGD", symbol: "S$"  }, { code: "ZAR", symbol: "R"   },
//     { code: "SAR", symbol: "﷼"   },
//   ];

//   const parseCost = (v) => {
//     const n = parseFloat(String(v || "").replace(/,/g, ""));
//     return isNaN(n) ? 0 : n;
//   };

//   const totalPurchasing = parseCost(dealData.purchasingLandCost) + parseCost(dealData.purchasingTicketCost);
//   const totalSelling    = parseCost(dealData.sellingLandCost)    + parseCost(dealData.sellingTicketCost);
//   const profit          = totalSelling - totalPurchasing;

//   const userIdRef = useRef(null);

//   useEffect(() => {
//     try {
//       const user = JSON.parse(localStorage.getItem("user") || "{}");
//       setUserRole(user.role?.name || "");
//       userIdRef.current = user._id || user.id || null;
//     } catch {}
//   }, []);

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       const userId = userIdRef.current;
//       const socket = initSocket(userId);
//       if (!socket) return;

//       const handleNewLead = (newLead) => {
//         setLeads((prev) => {
//           if (prev.some((l) => l._id === newLead._id)) return prev;
//           return [newLead, ...prev];
//         });
//         setTotalLeads((prev) => prev + 1);
//       };

//       socket.on("new_facebook_lead", handleNewLead);
//       return () => { socket.off("new_facebook_lead", handleNewLead); };
//     }, 100);

//     return () => clearTimeout(timer);
//   }, []);

//   useEffect(() => {
//     if (searchTimer.current) clearTimeout(searchTimer.current);
//     searchTimer.current = setTimeout(() => { setDebouncedSearch(searchQuery); setCurrentPage(1); }, 500);
//     return () => clearTimeout(searchTimer.current);
//   }, [searchQuery]);

//   useEffect(() => { setCurrentPage(1); }, [statusFilter, sourceFilter, assigneeFilter]);

//   useEffect(() => {
//     const fetchLeads = async () => {
//       try {
//         setLoading(true);
//         const params = new URLSearchParams({ page: currentPage, limit: ITEMS_PER_PAGE });
//         if (debouncedSearch) params.append("search",   debouncedSearch);
//         if (statusFilter)    params.append("status",   statusFilter);
//         if (sourceFilter)    params.append("source",   sourceFilter);
//         if (assigneeFilter)  params.append("assignee", assigneeFilter);

//         const { data } = await axios.get(
//           `${API_URL}/leads/getAllLead?${params.toString()}`,
//           { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
//         );

//         const isNew    = data && !Array.isArray(data) && Array.isArray(data.leads);
//         const leadsArr = isNew ? data.leads : (Array.isArray(data) ? data : []);
//         const total    = isNew ? data.totalLeads : leadsArr.length;
//         const pages    = isNew ? data.totalPages : Math.ceil(leadsArr.length / ITEMS_PER_PAGE);

//         setLeads(leadsArr);
//         setTotalLeads(total);
//         setTotalPages(pages);

//         const seen = new Set();
//         const unique = [];
//         leadsArr.forEach((lead) => {
//           if (!lead.assignTo) return;
//           const name = typeof lead.assignTo === "object" && lead.assignTo.firstName
//             ? `${lead.assignTo.firstName} ${lead.assignTo.lastName}` : "Assigned User";
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

//   const handleDeleteLead = async (id) => {
//     try {
//       await axios.delete(`${API_URL}/leads/deleteLead/${id}`, {
//         headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
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

//   const handleBulkDelete = async () => {
//     try {
//       await Promise.all(selectedLeads.map((id) =>
//         axios.delete(`${API_URL}/leads/deleteLead/${id}`, {
//           headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
//         })
//       ));
//       setLeads((prev) => prev.filter((l) => !selectedLeads.includes(l._id)));
//       setTotalLeads((prev) => prev - selectedLeads.length);
//       toast.success(`${selectedLeads.length} leads deleted`);
//       setSelectedLeads([]);
//       if (leads.length === selectedLeads.length && currentPage > 1) setCurrentPage((p) => p - 1);
//     } catch {
//       toast.error("Error deleting leads");
//     } finally {
//       setShowDeleteModal(false);
//     }
//   };

//   const handleSelectLead = (id) =>
//     setSelectedLeads((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
//   const handleSelectAll = (e) =>
//     setSelectedLeads(e.target.checked ? leads.map((l) => l._id) : []);

//   const handleMenuToggle = (leadId, e) => {
//     e.stopPropagation();
//     const rect = e.currentTarget.getBoundingClientRect();
//     let top  = rect.bottom + window.scrollY + 4;
//     let left = rect.right  + window.scrollX - 160;
//     if (rect.bottom + 120 > window.innerHeight) top = rect.top + window.scrollY - 124;
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

//   const openConvertModal = (lead) => {
//     setSelectedLead(lead);
//     setDealData({
//       value:    lead.value    || "",
//       currency: lead.currency || "USD",
//       notes:    lead.notes    || "",
//       stage:    "Qualification",
//       purchasingLandCost:   "",
//       purchasingTicketCost: "",
//       sellingLandCost:      "",
//       sellingTicketCost:    "",
//       // ── UPDATED: noOfAdults + noOfChildren from lead ──
//       noOfAdults:   lead.noOfAdults   != null ? String(lead.noOfAdults)   : "",
//       noOfChildren: lead.noOfChildren != null ? String(lead.noOfChildren) : "",
//       travelDate:   lead.travelDate
//         ? new Date(lead.travelDate).toISOString().split("T")[0]
//         : "",
//     });
//     setConvertModalOpen(true);
//     setMenuOpen(null);
//   };

//   const handleConvertDeal = async () => {
//     if (!selectedLead) return;
//     try {
//       setConverting(true);
//       const toastId = toast.loading("Converting lead to deal...");
//       const res     = await axios.patch(
//         `${API_URL}/leads/${selectedLead._id}/convert`,
//         dealData,
//         { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
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

//   const handleStatusChange = async (leadId, newStatus) => {
//     try {
//       await axios.patch(
//         `${API_URL}/leads/${leadId}/status`,
//         { status: newStatus },
//         { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
//       );
//       setLeads((prev) => prev.map((l) => l._id === leadId ? { ...l, status: newStatus } : l));
//       toast.success("Status updated");
//     } catch {
//       toast.error("Failed to update status");
//     }
//   };

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
//       await axios.patch(
//         `${API_URL}/leads/${leadId}/followup`,
//         { followUpDate: newDate },
//         { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
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
//     `w-full px-3 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-1 ${statusClasses[status] || statusClasses.Junk} ${
//       status === "Hot" ? "focus:ring-red-300" : status === "Warm" ? "focus:ring-yellow-300" : status === "Cold" ? "focus:ring-blue-300" : "focus:ring-gray-300"
//     }`;

//   const SourceBadge = ({ source }) => {
//     if (!source) return <span className="text-gray-400 text-xs">-</span>;
//     if (source === "Facebook") {
//       return (
//         <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200 whitespace-nowrap">
//           <svg viewBox="0 0 24 24" className="w-2.5 h-2.5 fill-blue-600 flex-shrink-0" xmlns="http://www.w3.org/2000/svg">
//             <path d="M22 12a10 10 0 1 0-11.563 9.874v-6.988H7.898V12h2.539V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.886h-2.33v6.988A10.003 10.003 0 0 0 22 12z"/>
//           </svg>
//           Facebook
//         </span>
//       );
//     }
//     return <span className="text-sm text-gray-700">{source}</span>;
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
//       </div>
//     );
//   }

//   const firstItem = totalLeads === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1;
//   const lastItem  = Math.min(currentPage * ITEMS_PER_PAGE, totalLeads);

//   return (
//     <div className="p-6">
//       <ToastContainer position="top-right" autoClose={3000} newestOnTop closeOnClick draggable pauseOnHover theme="light" />

//       {/* Header */}
//       <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4 tour-lead-header">
//         <div className="flex items-center gap-3">
//           <h2 className="text-2xl font-bold text-gray-800">Leads</h2>
//           {totalLeads > 0 && (
//             <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-xs font-semibold">
//               {totalLeads} total
//             </span>
//           )}
//         </div>
//         <div className="flex flex-wrap gap-3 items-center">
//           <button onClick={() => setIsOpen(true)} className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 tour-finish">
//             <Eye className="w-4 h-4" /> Take Tour
//           </button>
//           {selectedLeads.length > 0 && (
//             <button onClick={() => { setLeadToDelete(null); setShowDeleteModal(true); }} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow flex items-center gap-2">
//               <Trash2 className="w-4 h-4" /> Delete Selected ({selectedLeads.length})
//             </button>
//           )}
//           {(userRole === "Admin" || userRole === "Sales") && (
//             <button onClick={() => navigate("/createleads")} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow flex items-center gap-2 tour-create-lead">
//               <Plus className="w-4 h-4" /> Create Lead
//             </button>
//           )}
//         </div>
//       </div>

//       {/* Filters */}
//       <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4 tour-filters">
//         <div className="relative tour-search">
//           <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
//           <input
//             type="text"
//             placeholder="Search leads..."
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             className="w-full pl-10 pr-4 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
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
//           <option value="Facebook">Facebook</option>
//           <option value="Other">Other</option>
//         </select>
//       </div>

//       {/* Table */}
//       <div className="tour-lead-table rounded-xl border border-gray-200 shadow-sm overflow-hidden">
//         <div className="overflow-x-auto overflow-y-auto max-h-[calc(100vh-280px)]">
//           <table className="min-w-max w-full table-auto divide-y divide-gray-200">
//             <thead className="sticky top-0 bg-gray-50 z-10">
//               <tr className="whitespace-nowrap">
//                 <th className="px-4 py-3 tour-checkbox">
//                   <input type="checkbox" className="h-4 w-4 text-blue-600 border-gray-300 rounded"
//                     checked={leads.length > 0 && selectedLeads.length === leads.length}
//                     onChange={handleSelectAll} />
//                 </th>
//                 <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Lead</th>
//                 <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Contact</th>
//                 <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Destination</th>
//                 <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Country</th>
//                 <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Source</th>
//                 {/* ── UPDATED: Adults + Children columns ── */}
//                 <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Adults</th>
//                 <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Children</th>
//                 <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Travel Date</th>
//                 <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
//                 <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Assignee</th>
//                 <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Created</th>
//                 <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Follow-Up</th>
//                 <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tour-lead-actions sticky right-0 bg-gray-50 shadow-[-4px_0_8px_-2px_rgba(0,0,0,0.08)] z-20">
//                   Actions
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-200 bg-white">
//               {leads.length > 0 ? leads.map((lead, idx) => {
//                 const isFacebook = lead.source === "Facebook";
//                 return (
//                   <tr key={lead._id}
//                     className={`hover:bg-blue-50/30 transition-colors whitespace-nowrap ${
//                       selectedLeads.includes(lead._id) ? "bg-blue-50" : idx % 2 === 0 ? "bg-white" : "bg-gray-50/50"
//                     }`}>
//                     <td className="px-4 py-3">
//                       <input type="checkbox" className="h-4 w-4 text-blue-600 border-gray-300 rounded"
//                         checked={selectedLeads.includes(lead._id)}
//                         onChange={() => handleSelectLead(lead._id)} />
//                     </td>
//                     <td className="px-4 py-3">
//                       <div className="flex items-center gap-3">
//                         <LeadAvatar name={lead.leadName} />
//                         <div className="flex flex-col min-w-0">
//                           <div className="flex items-center gap-1.5 flex-wrap">
//                             <span
//                               onClick={() => navigate(`/leads/view/${lead._id}`)}
//                               className="font-medium text-blue-600 text-sm cursor-pointer hover:underline truncate max-w-[140px]"
//                               title={lead.leadName || "Unnamed Lead"}
//                             >
//                               {lead.leadName || "Unnamed Lead"}
//                             </span>
//                             {isFacebook && <FacebookBadge />}
//                           </div>
//                           <span className="text-gray-400 text-xs truncate max-w-[160px]">{lead.email || "-"}</span>
//                         </div>
//                       </div>
//                     </td>
//                     <td className="px-4 py-3 text-sm text-gray-700">{lead.phoneNumber || "-"}</td>
//                     <td className="px-4 py-3 text-sm text-gray-700">{lead.destination  || "-"}</td>
//                     <td className="px-4 py-3 text-sm text-gray-700">{lead.country      || "-"}</td>
//                     <td className="px-4 py-3"><SourceBadge source={lead.source} /></td>

//                     {/* ── Adults ── */}
//                     <td className="px-4 py-3 text-sm text-gray-700">
//                       {lead.noOfAdults != null ? (
//                         <span className="inline-flex items-center gap-1">
//                           <Users className="w-3.5 h-3.5 text-blue-400" />{lead.noOfAdults}
//                         </span>
//                       ) : "-"}
//                     </td>

//                     {/* ── Children ── */}
//                     <td className="px-4 py-3 text-sm text-gray-700">
//                       {lead.noOfChildren != null ? (
//                         <span className="inline-flex items-center gap-1">
//                           <Users className="w-3.5 h-3.5 text-purple-400" />{lead.noOfChildren}
//                         </span>
//                       ) : "-"}
//                     </td>

//                     <td className="px-4 py-3 text-sm text-gray-700">{formatDate(lead.travelDate)}</td>
//                     <td className="px-4 py-3">
//                       <select value={lead.status} onChange={(e) => handleStatusChange(lead._id, e.target.value)}
//                         className={getStatusClass(lead.status)}>
//                         <option value="Hot">Hot</option>
//                         <option value="Warm">Warm</option>
//                         <option value="Cold">Cold</option>
//                         <option value="Junk">Junk</option>
//                       </select>
//                     </td>
//                     <td className="px-4 py-3 text-sm text-gray-700">
//                       {lead.assignTo
//                         ? typeof lead.assignTo === "object"
//                           ? `${lead.assignTo.firstName} ${lead.assignTo.lastName}`
//                           : "Assigned User"
//                         : <span className="text-gray-400 italic text-xs">Unassigned</span>}
//                     </td>
//                     <td className="px-4 py-3 text-sm text-gray-700">{formatDate(lead.createdAt)}</td>
//                     <td className="px-4 py-3 text-sm text-gray-700">
//                       <div className="relative flex items-center gap-1">
//                         <button type="button" onClick={() => openFollowUpPicker(lead._id)}
//                           disabled={followUpSavingId === lead._id}
//                           className="inline-flex items-center gap-2 px-2 py-1 rounded-md hover:bg-gray-100 transition">
//                           <Calendar className="w-4 h-4 text-gray-500" />
//                           <span className="text-sm">{followUpSavingId === lead._id ? "Saving..." : formatDate(lead.followUpDate)}</span>
//                         </button>
//                         {editingFollowUpId === lead._id && (
//                           <input
//                             ref={(el) => (dateInputRefs.current[lead._id] = el)}
//                             type="date"
//                             defaultValue={toDateInputValue(lead.followUpDate)}
//                             className="absolute left-0 top-0 w-0 h-0 opacity-0"
//                             onChange={(e) => updateFollowUpDateInline(lead._id, e.target.value)}
//                             onBlur={() => setEditingFollowUpId(null)}
//                           />
//                         )}
//                       </div>
//                     </td>
//                     <td className={`px-4 py-3 text-right relative sticky right-0 z-10 shadow-[-4px_0_8px_-2px_rgba(0,0,0,0.06)] ${
//                       selectedLeads.includes(lead._id) ? "bg-blue-50" : idx % 2 === 0 ? "bg-white" : "bg-gray-50/80"
//                     }`}>
//                       <button className="p-2 rounded-lg hover:bg-gray-200 transition-colors"
//                         onClick={(e) => handleMenuToggle(lead._id, e)}>
//                         <MoreVertical className="w-5 h-5 text-gray-600" />
//                       </button>
//                       {menuOpen === lead._id && (
//                         <div className="fixed z-50 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-1"
//                           style={{ top: `${menuPosition.top}px`, left: `${menuPosition.left}px` }}>
//                           <button onClick={(e) => { e.stopPropagation(); handleEdit(lead._id); }}
//                             className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100">
//                             <Edit className="w-4 h-4 mr-2" /> Edit
//                           </button>
//                           {lead.status !== "Converted" && (
//                             <button onClick={(e) => { e.stopPropagation(); openConvertModal(lead); }}
//                               className="flex items-center w-full px-3 py-2 text-sm text-green-600 hover:bg-gray-100">
//                               <Handshake className="w-4 h-4 mr-2" /> Convert
//                             </button>
//                           )}
//                           <button onClick={(e) => { e.stopPropagation(); handleDeleteClick(lead._id); }}
//                             className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-gray-100">
//                             <Trash2 className="w-4 h-4 mr-2" /> Delete
//                           </button>
//                         </div>
//                       )}
//                     </td>
//                   </tr>
//                 );
//               }) : (
//                 <tr>
//                   <td colSpan={14} className="px-4 py-16 text-center">
//                     <div className="flex flex-col items-center gap-2 text-gray-400">
//                       <Search className="w-10 h-10 opacity-30" />
//                       <p className="text-sm font-medium">No leads found</p>
//                       <p className="text-xs text-gray-300">
//                         {sourceFilter === "Facebook"
//                           ? "No Facebook leads yet. They appear automatically when someone submits your Facebook Lead Ad form."
//                           : "Try adjusting your search or filters"}
//                       </p>
//                     </div>
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* Pagination */}
//       {totalPages > 1 && (
//         <div className="flex flex-col sm:flex-row items-center justify-between mt-4 gap-3">
//           <p className="text-sm text-gray-500">
//             Showing <span className="font-semibold text-gray-700">{firstItem}</span>–
//             <span className="font-semibold text-gray-700">{lastItem}</span> of{" "}
//             <span className="font-semibold text-gray-700">{totalLeads}</span>
//           </p>
//           <div className="flex items-center gap-1">
//             <button onClick={() => goToPage(1)} disabled={currentPage === 1} className="px-2 py-1.5 text-sm border rounded-lg hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed">«</button>
//             <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1} className="px-3 py-1.5 text-sm border rounded-lg hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed">‹ Prev</button>
//             {pageNumbers().map((p, i) =>
//               p === "..." ? <span key={`d${i}`} className="px-2 text-gray-400">…</span> : (
//                 <button key={p} onClick={() => goToPage(p)}
//                   className={`min-w-[36px] px-2 py-1.5 text-sm border rounded-lg transition-colors ${currentPage === p ? "bg-blue-600 text-white border-blue-600 font-semibold" : "hover:bg-gray-100 text-gray-700"}`}>
//                   {p}
//                 </button>
//               )
//             )}
//             <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages} className="px-3 py-1.5 text-sm border rounded-lg hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed">Next ›</button>
//             <button onClick={() => goToPage(totalPages)} disabled={currentPage === totalPages} className="px-2 py-1.5 text-sm border rounded-lg hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed">»</button>
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
//             {leadToDelete ? "this lead" : `${selectedLeads.length} selected leads`}? This action cannot be undone.
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

//       {/* Convert Modal — updated with noOfAdults + noOfChildren fields */}
//       <Dialog open={convertModalOpen} onOpenChange={setConvertModalOpen}>
//         <DialogContent className="!max-w-3xl w-full p-0 overflow-hidden">
//           <div className="px-6 pt-5 pb-3 border-b border-gray-100">
//             <DialogTitle className="flex items-center gap-2 text-green-600 text-lg font-semibold">
//               <Handshake className="w-5 h-5" /> Convert Lead to Deal
//             </DialogTitle>
//           </div>
//           {selectedLead && (
//             <div className="px-6 py-5 space-y-5 max-h-[78vh] overflow-y-auto">
//               <div className={`p-3 rounded-lg border ${selectedLead.source === "Facebook" ? "bg-blue-50 border-blue-200" : "bg-blue-50 border-blue-100"}`}>
//                 <div className="flex items-center gap-2 flex-wrap">
//                   <p className="text-sm text-blue-800">
//                     Converting: <strong>{selectedLead.leadName}</strong>
//                     {selectedLead.destination && ` — ${selectedLead.destination}`}
//                   </p>
//                   {selectedLead.source === "Facebook" && (
//                     <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-600 text-white">
//                       <svg viewBox="0 0 24 24" className="w-2.5 h-2.5 fill-white" xmlns="http://www.w3.org/2000/svg">
//                         <path d="M22 12a10 10 0 1 0-11.563 9.874v-6.988H7.898V12h2.539V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.886h-2.33v6.988A10.003 10.003 0 0 0 22 12z"/>
//                       </svg>
//                       Facebook Lead
//                     </span>
//                   )}
//                 </div>
//               </div>

//               {/* Deal Value + Stage */}
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                 <div className="md:col-span-2">
//                   <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Deal Value</label>
//                   <div className="flex gap-2">
//                     <select value={dealData.currency}
//                       onChange={(e) => setDealData((p) => ({ ...p, currency: e.target.value }))}
//                       className="w-28 px-2 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none bg-white">
//                       {allowedCurrencies.map((c) => <option key={c.code} value={c.code}>{c.symbol} {c.code}</option>)}
//                     </select>
//                     <input type="number" value={dealData.value}
//                       onChange={(e) => setDealData((p) => ({ ...p, value: e.target.value }))}
//                       placeholder="Enter value"
//                       className="flex-1 min-w-0 px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none" />
//                   </div>
//                 </div>
//                 <div>
//                   <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Stage</label>
//                   <select value={dealData.stage}
//                     onChange={(e) => setDealData((p) => ({ ...p, stage: e.target.value }))}
//                     className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none bg-white">
//                     <option value="Qualification">Qualification</option>
//                     <option value="Proposal">Proposal</option>
//                     <option value="Negotiation">Negotiation</option>
//                     <option value="Closed Won">Closed Won</option>
//                     <option value="Closed Lost">Closed Lost</option>
//                   </select>
//                 </div>
//               </div>



//               {/* Cost labels */}
//               <div className="grid grid-cols-2 gap-4">
//                 <div className="flex items-center gap-2">
//                   <span className="text-xs font-bold text-gray-600 uppercase tracking-wide whitespace-nowrap">Purchasing Cost</span>
//                   <div className="flex-1 h-px bg-gray-200" />
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <span className="text-xs font-bold text-gray-600 uppercase tracking-wide whitespace-nowrap">Selling Cost</span>
//                   <div className="flex-1 h-px bg-gray-200" />
//                 </div>
//               </div>

//               {/* Cost fields */}
//               <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                 <div>
//                   <label className="block text-xs font-medium text-gray-600 mb-1.5">Land Part</label>
//                   <input type="text" placeholder="e.g. 5000" value={dealData.purchasingLandCost}
//                     onChange={(e) => setDealData((p) => ({ ...p, purchasingLandCost: e.target.value }))}
//                     className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none" />
//                 </div>
//                 <div>
//                   <label className="block text-xs font-medium text-gray-600 mb-1.5">Ticket</label>
//                   <input type="text" placeholder="e.g. 2000" value={dealData.purchasingTicketCost}
//                     onChange={(e) => setDealData((p) => ({ ...p, purchasingTicketCost: e.target.value }))}
//                     className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none" />
//                 </div>
//                 <div>
//                   <label className="block text-xs font-medium text-gray-600 mb-1.5">Land Part</label>
//                   <input type="text" placeholder="e.g. 7000" value={dealData.sellingLandCost}
//                     onChange={(e) => setDealData((p) => ({ ...p, sellingLandCost: e.target.value }))}
//                     className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none" />
//                 </div>
//                 <div>
//                   <label className="block text-xs font-medium text-gray-600 mb-1.5">Ticket</label>
//                   <input type="text" placeholder="e.g. 3000" value={dealData.sellingTicketCost}
//                     onChange={(e) => setDealData((p) => ({ ...p, sellingTicketCost: e.target.value }))}
//                     className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none" />
//                 </div>
//               </div>

//               {/* Totals */}
//               <div className="grid grid-cols-2 gap-4">
//                 <div className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 overflow-hidden">
//                   <span className="text-xs font-medium text-gray-500 whitespace-nowrap">Total Purchasing</span>
//                   <span className="text-sm font-bold text-gray-700 ml-2 truncate">{dealData.currency} {fmt(totalPurchasing)}</span>
//                 </div>
//                 <div className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 overflow-hidden">
//                   <span className="text-xs font-medium text-gray-500 whitespace-nowrap">Total Selling</span>
//                   <span className="text-sm font-bold text-gray-700 ml-2 truncate">{dealData.currency} {fmt(totalSelling)}</span>
//                 </div>
//               </div>
//               {(totalPurchasing > 0 || totalSelling > 0) && (
//                 <div className={`flex items-center justify-between px-4 py-3 rounded-lg border overflow-hidden ${profit >= 0 ? "bg-emerald-50 border-emerald-200" : "bg-red-50 border-red-200"}`}>
//                   <div className="flex items-center gap-2 flex-shrink-0">
//                     {profit >= 0 ? <TrendingUp size={16} className="text-emerald-600" /> : <TrendingDown size={16} className="text-red-600" />}
//                     <span className={`text-sm font-semibold ${profit >= 0 ? "text-emerald-700" : "text-red-700"}`}>
//                       {profit >= 0 ? "Net Profit" : "Net Loss"}
//                     </span>
//                   </div>
//                   <span className={`text-base font-bold ml-4 truncate ${profit >= 0 ? "text-emerald-700" : "text-red-700"}`}>
//                     {profit >= 0 ? "+" : "-"}{dealData.currency} {fmt(Math.abs(profit))}
//                   </span>
//                 </div>
//               )}

//               {/* Notes */}
//               <div>
//                 <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Notes</label>
//                 <textarea value={dealData.notes} rows={4} placeholder="Add any notes..."
//                   onChange={(e) => setDealData((p) => ({ ...p, notes: e.target.value }))}
//                   className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none resize-y" />
//               </div>

//               {/* Action buttons */}
//               <div className="flex justify-end gap-3 pt-1 border-t border-gray-100">
//                 <button onClick={() => setConvertModalOpen(false)} disabled={converting}
//                   className="px-5 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 text-gray-700 text-sm font-medium">
//                   Cancel
//                 </button>
//                 <button onClick={handleConvertDeal} disabled={converting}
//                   className="px-5 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 flex items-center gap-2 text-sm font-medium disabled:opacity-50">
//                   <Handshake size={15} />
//                   {converting ? "Converting..." : "Convert to Deal"}
//                 </button>
//               </div>
//             </div>
//           )}
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }

// export default function LeadTable() {
//   return (
//     <TourProvider
//       steps={tourSteps}
//       afterOpen={() => (document.body.style.overflow = "hidden")}
//       beforeClose={() => (document.body.style.overflow = "unset")}
//       styles={{
//         popover:  (base) => ({ ...base, backgroundColor: "#fff", color: "#1f1f1f" }),
//         maskArea: (base) => ({ ...base, rx: 8 }),
//         badge:    (base) => ({ ...base, display: "none" }),
//         close:    (base) => ({ ...base, right: "auto", left: 8, top: 8 }),
//       }}
//     >
//       <LeadTableComponent />
//     </TourProvider>
//   );
// }//original code: all correct come..



// import React, { useState, useEffect, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import axios from "axios";
// import { TourProvider, useTour } from "@reactour/tour";
// import {
//   MoreVertical, Trash2, Edit, Handshake, Search, Plus, Eye, Calendar,
//   TrendingUp, TrendingDown, Users,
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
//   { selector: ".tour-lead-table",   content: "This is your leads table with all key information. Facebook leads are marked with a blue 'FB' badge." },
//   { selector: ".tour-checkbox",     content: "Select individual leads or use the header checkbox to select all." },
//   { selector: ".tour-lead-actions", content: "Click the three-dot menu to edit, convert, or delete a lead." },
//   { selector: ".tour-finish",       content: "You've completed the tour!" },
// ];

// /* ── Avatar helpers ── */
// const getInitials = (name) => {
//   if (!name || typeof name !== "string") return "?";
//   const trimmed = name.trim();
//   if (!trimmed) return "?";
//   const letters = trimmed.replace(/[^a-zA-Z]/g, "");
//   if (letters.length === 0) return trimmed.slice(0, 2).toUpperCase();
//   if (letters.length === 1) return letters[0].toUpperCase();
//   const words = trimmed.split(/[\s._\-]+/).filter(Boolean);
//   if (words.length >= 2) {
//     const a = words[0].replace(/[^a-zA-Z]/g, "")[0] || "";
//     const b = words[1].replace(/[^a-zA-Z]/g, "")[0] || "";
//     return (a + b).toUpperCase();
//   }
//   return letters.slice(0, 2).toUpperCase();
// };

// const AVATAR_COLORS = [
//   { bg: "bg-blue-100",   text: "text-blue-700"   },
//   { bg: "bg-purple-100", text: "text-purple-700"  },
//   { bg: "bg-green-100",  text: "text-green-700"   },
//   { bg: "bg-orange-100", text: "text-orange-700"  },
//   { bg: "bg-pink-100",   text: "text-pink-700"    },
//   { bg: "bg-teal-100",   text: "text-teal-700"    },
//   { bg: "bg-indigo-100", text: "text-indigo-700"  },
//   { bg: "bg-red-100",    text: "text-red-700"     },
//   { bg: "bg-yellow-100", text: "text-yellow-700"  },
//   { bg: "bg-cyan-100",   text: "text-cyan-700"    },
// ];

// const getAvatarColor = (name) => {
//   if (!name) return AVATAR_COLORS[0];
//   let hash = 0;
//   for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
//   return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
// };

// const LeadAvatar = ({ name }) => {
//   const initials = getInitials(name);
//   const color    = getAvatarColor(name);
//   return (
//     <div
//       className={`h-9 w-9 rounded-full flex-shrink-0 flex items-center justify-center font-semibold text-xs select-none ${color.bg} ${color.text}`}
//       style={{ minWidth: "2.25rem", minHeight: "2.25rem" }}
//       title={name || ""}
//     >
//       {initials}
//     </div>
//   );
// };

// /* ── Facebook badge ── */
// const FacebookBadge = () => (
//   <span
//     title="Lead from Facebook Ad"
//     className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-600 text-white leading-none select-none"
//     style={{ letterSpacing: "0.02em" }}
//   >
//     <svg viewBox="0 0 24 24" className="w-2.5 h-2.5 fill-white flex-shrink-0" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
//       <path d="M22 12a10 10 0 1 0-11.563 9.874v-6.988H7.898V12h2.539V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.886h-2.33v6.988A10.003 10.003 0 0 0 22 12z"/>
//     </svg>
//     FB
//   </span>
// );

// const fmt = (n) => new Intl.NumberFormat("en-IN", { maximumFractionDigits: 2 }).format(n);

// /* ── Helper: extract assignee display name from a lead object ── */
// const getAssigneeName = (assignTo) => {
//   if (!assignTo) return null;
//   if (typeof assignTo === "object" && assignTo.firstName)
//     return `${assignTo.firstName} ${assignTo.lastName || ""}`.trim();
//   return "Assigned User";
// };

// /* ═══════════════════════════════════════════════════════════════
//    MAIN COMPONENT
//    ═══════════════════════════════════════════════════════════════ */
// function LeadTableComponent() {
//   const navigate      = useNavigate();
//   const { setIsOpen } = useTour();

//   const [leads,         setLeads]         = useState([]);
//   const [selectedLeads, setSelectedLeads] = useState([]);
//   const [loading,       setLoading]       = useState(true);
//   const [userRole,      setUserRole]      = useState("");

//   /* ─────────────────────────────────────────────────────────────
//      FIX: assignees is now fetched ONCE from ALL leads at mount,
//      completely separate from the paginated fetchLeads call.
//      This ensures every salesperson appears in the dropdown
//      regardless of which page you are currently on.
//   ───────────────────────────────────────────────────────────── */
//   const [assignees,        setAssignees]        = useState([]);
//   const [assigneesLoading, setAssigneesLoading] = useState(false);

//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages,  setTotalPages]  = useState(1);
//   const [totalLeads,  setTotalLeads]  = useState(0);

//   const [searchQuery,     setSearchQuery]     = useState("");
//   const [debouncedSearch, setDebouncedSearch] = useState("");
//   const [statusFilter,    setStatusFilter]    = useState("");
//   const [sourceFilter,    setSourceFilter]    = useState("");
//   const [assigneeFilter,  setAssigneeFilter]  = useState("");
//   const searchTimer = useRef(null);

//   const [menuOpen,     setMenuOpen]     = useState(null);
//   const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });

//   const [showDeleteModal,  setShowDeleteModal]  = useState(false);
//   const [leadToDelete,     setLeadToDelete]     = useState(null);
//   const [convertModalOpen, setConvertModalOpen] = useState(false);
//   const [selectedLead,     setSelectedLead]     = useState(null);
//   const [converting,       setConverting]       = useState(false);

//   const [dealData, setDealData] = useState({
//     value: "", currency: "USD", notes: "", stage: "Qualification",
//     purchasingLandCost: "", purchasingTicketCost: "",
//     sellingLandCost:    "", sellingTicketCost:    "",
//     noOfAdults:   "",
//     noOfChildren: "",
//     travelDate:   "",
//   });

//   const dateInputRefs                              = useRef({});
//   const [editingFollowUpId, setEditingFollowUpId] = useState(null);
//   const [followUpSavingId,  setFollowUpSavingId]  = useState(null);

//   const allowedCurrencies = [
//     { code: "USD", symbol: "$"   }, { code: "EUR", symbol: "€"   },
//     { code: "INR", symbol: "₹"   }, { code: "GBP", symbol: "£"   },
//     { code: "JPY", symbol: "¥"   }, { code: "AUD", symbol: "A$"  },
//     { code: "CAD", symbol: "C$"  }, { code: "CHF", symbol: "CHF" },
//     { code: "MYR", symbol: "RM"  }, { code: "AED", symbol: "د.إ" },
//     { code: "SGD", symbol: "S$"  }, { code: "ZAR", symbol: "R"   },
//     { code: "SAR", symbol: "﷼"   },
//   ];

//   const parseCost = (v) => {
//     const n = parseFloat(String(v || "").replace(/,/g, ""));
//     return isNaN(n) ? 0 : n;
//   };

//   const totalPurchasing = parseCost(dealData.purchasingLandCost) + parseCost(dealData.purchasingTicketCost);
//   const totalSelling    = parseCost(dealData.sellingLandCost)    + parseCost(dealData.sellingTicketCost);
//   const profit          = totalSelling - totalPurchasing;

//   const userIdRef = useRef(null);

//   /* ── 1. Read user from localStorage ── */
//   useEffect(() => {
//     try {
//       const user = JSON.parse(localStorage.getItem("user") || "{}");
//       setUserRole(user.role?.name || "");
//       userIdRef.current = user._id || user.id || null;
//     } catch {}
//   }, []);

//   /* ── 2. Fetch ALL assignees once on mount (Admin only) ──────────
//      KEY FIX: We call getAllLead with a very high limit so we get
//      every lead's assignee in one shot, independent of pagination.
//      The `assignees` state is never touched by fetchLeads below.

//      TIP FOR BACKEND DEV: Add GET /leads/assignees that returns
//      unique user objects. Replace this block with that call for
//      a much lighter request.
//   ────────────────────────────────────────────────────────────── */
//   useEffect(() => {
//     if (!userRole || userRole !== "Admin") return;

//     const fetchAllAssignees = async () => {
//       try {
//         setAssigneesLoading(true);

//         const { data } = await axios.get(
//           `${API_URL}/leads/getAllLead?page=1&limit=99999`,
//           { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
//         );

//         const isNew    = data && !Array.isArray(data) && Array.isArray(data.leads);
//         const leadsArr = isNew ? data.leads : (Array.isArray(data) ? data : []);

//         const seen  = new Set();
//         const names = [];
//         leadsArr.forEach((lead) => {
//           const name = getAssigneeName(lead.assignTo);
//           if (name && !seen.has(name)) {
//             seen.add(name);
//             names.push(name);
//           }
//         });

//         names.sort((a, b) => a.localeCompare(b));
//         setAssignees(names);
//       } catch (err) {
//         console.error("Fetch assignees error:", err);
//       } finally {
//         setAssigneesLoading(false);
//       }
//     };

//     fetchAllAssignees();
//   }, [userRole]);

//   /* ── 3. Socket: real-time Facebook leads ── */
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       const userId = userIdRef.current;
//       const socket = initSocket(userId);
//       if (!socket) return;

//       const handleNewLead = (newLead) => {
//         setLeads((prev) => {
//           if (prev.some((l) => l._id === newLead._id)) return prev;
//           return [newLead, ...prev];
//         });
//         setTotalLeads((prev) => prev + 1);

//         // Add new assignee to filter list in real time if not already there
//         const name = getAssigneeName(newLead.assignTo);
//         if (name) {
//           setAssignees((prev) =>
//             prev.includes(name) ? prev : [...prev, name].sort((a, b) => a.localeCompare(b))
//           );
//         }
//       };

//       socket.on("new_facebook_lead", handleNewLead);
//       return () => { socket.off("new_facebook_lead", handleNewLead); };
//     }, 100);

//     return () => clearTimeout(timer);
//   }, []);

//   /* ── 4. Search debounce ── */
//   useEffect(() => {
//     if (searchTimer.current) clearTimeout(searchTimer.current);
//     searchTimer.current = setTimeout(() => {
//       setDebouncedSearch(searchQuery);
//       setCurrentPage(1);
//     }, 500);
//     return () => clearTimeout(searchTimer.current);
//   }, [searchQuery]);

//   /* ── 5. Reset to page 1 when filters change ── */
//   useEffect(() => { setCurrentPage(1); }, [statusFilter, sourceFilter, assigneeFilter]);

//   /* ── 6. Paginated lead fetch — does NOT touch assignees ── */
//   useEffect(() => {
//     const fetchLeads = async () => {
//       try {
//         setLoading(true);
//         const params = new URLSearchParams({ page: currentPage, limit: ITEMS_PER_PAGE });
//         if (debouncedSearch) params.append("search",   debouncedSearch);
//         if (statusFilter)    params.append("status",   statusFilter);
//         if (sourceFilter)    params.append("source",   sourceFilter);
//         if (assigneeFilter)  params.append("assignee", assigneeFilter);

//         const { data } = await axios.get(
//           `${API_URL}/leads/getAllLead?${params.toString()}`,
//           { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
//         );

//         const isNew    = data && !Array.isArray(data) && Array.isArray(data.leads);
//         const leadsArr = isNew ? data.leads : (Array.isArray(data) ? data : []);
//         const total    = isNew ? data.totalLeads : leadsArr.length;
//         const pages    = isNew ? data.totalPages  : Math.ceil(leadsArr.length / ITEMS_PER_PAGE);

//         setLeads(leadsArr);
//         setTotalLeads(total);
//         setTotalPages(pages);

//         // ✅ assignees is NOT updated here — it comes from the
//         //    separate full-fetch above so all pages are covered.

//       } catch (err) {
//         console.error("Fetch leads error:", err);
//         toast.error("Failed to fetch leads");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchLeads();
//   }, [currentPage, debouncedSearch, statusFilter, sourceFilter, assigneeFilter]);

//   /* ── Pagination helpers ── */
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

//   /* ── CRUD handlers ── */
//   const handleDeleteLead = async (id) => {
//     try {
//       await axios.delete(`${API_URL}/leads/deleteLead/${id}`, {
//         headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
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

//   const handleBulkDelete = async () => {
//     try {
//       await Promise.all(selectedLeads.map((id) =>
//         axios.delete(`${API_URL}/leads/deleteLead/${id}`, {
//           headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
//         })
//       ));
//       setLeads((prev) => prev.filter((l) => !selectedLeads.includes(l._id)));
//       setTotalLeads((prev) => prev - selectedLeads.length);
//       toast.success(`${selectedLeads.length} leads deleted`);
//       setSelectedLeads([]);
//       if (leads.length === selectedLeads.length && currentPage > 1) setCurrentPage((p) => p - 1);
//     } catch {
//       toast.error("Error deleting leads");
//     } finally {
//       setShowDeleteModal(false);
//     }
//   };

//   const handleSelectLead = (id) =>
//     setSelectedLeads((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);

//   const handleSelectAll = (e) =>
//     setSelectedLeads(e.target.checked ? leads.map((l) => l._id) : []);

//   const handleMenuToggle = (leadId, e) => {
//     e.stopPropagation();
//     const rect = e.currentTarget.getBoundingClientRect();
//     let top  = rect.bottom + window.scrollY + 4;
//     let left = rect.right  + window.scrollX - 160;
//     if (rect.bottom + 120 > window.innerHeight) top = rect.top + window.scrollY - 124;
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

//   const openConvertModal = (lead) => {
//     setSelectedLead(lead);
//     setDealData({
//       value:    lead.value    || "",
//       currency: lead.currency || "USD",
//       notes:    lead.notes    || "",
//       stage:    "Qualification",
//       purchasingLandCost:   "",
//       purchasingTicketCost: "",
//       sellingLandCost:      "",
//       sellingTicketCost:    "",
//       noOfAdults:   lead.noOfAdults   != null ? String(lead.noOfAdults)   : "",
//       noOfChildren: lead.noOfChildren != null ? String(lead.noOfChildren) : "",
//       travelDate:   lead.travelDate
//         ? new Date(lead.travelDate).toISOString().split("T")[0]
//         : "",
//     });
//     setConvertModalOpen(true);
//     setMenuOpen(null);
//   };

//   const handleConvertDeal = async () => {
//     if (!selectedLead) return;
//     try {
//       setConverting(true);
//       const toastId = toast.loading("Converting lead to deal...");
//       const res     = await axios.patch(
//         `${API_URL}/leads/${selectedLead._id}/convert`,
//         dealData,
//         { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
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

//   const handleStatusChange = async (leadId, newStatus) => {
//     try {
//       await axios.patch(
//         `${API_URL}/leads/${leadId}/status`,
//         { status: newStatus },
//         { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
//       );
//       setLeads((prev) => prev.map((l) => l._id === leadId ? { ...l, status: newStatus } : l));
//       toast.success("Status updated");
//     } catch {
//       toast.error("Failed to update status");
//     }
//   };

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
//       await axios.patch(
//         `${API_URL}/leads/${leadId}/followup`,
//         { followUpDate: newDate },
//         { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
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

//   /* ── Formatting helpers ── */
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
//     `w-full px-3 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-1 ${statusClasses[status] || statusClasses.Junk} ${
//       status === "Hot"  ? "focus:ring-red-300"    :
//       status === "Warm" ? "focus:ring-yellow-300" :
//       status === "Cold" ? "focus:ring-blue-300"   : "focus:ring-gray-300"
//     }`;

//   const SourceBadge = ({ source }) => {
//     if (!source) return <span className="text-gray-400 text-xs">-</span>;
//     if (source === "Facebook") {
//       return (
//         <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200 whitespace-nowrap">
//           <svg viewBox="0 0 24 24" className="w-2.5 h-2.5 fill-blue-600 flex-shrink-0" xmlns="http://www.w3.org/2000/svg">
//             <path d="M22 12a10 10 0 1 0-11.563 9.874v-6.988H7.898V12h2.539V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.886h-2.33v6.988A10.003 10.003 0 0 0 22 12z"/>
//           </svg>
//           Facebook
//         </span>
//       );
//     }
//     return <span className="text-sm text-gray-700">{source}</span>;
//   };

//   /* ── Initial loading spinner ── */
//   if (loading && leads.length === 0) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
//       </div>
//     );
//   }

//   const firstItem = totalLeads === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1;
//   const lastItem  = Math.min(currentPage * ITEMS_PER_PAGE, totalLeads);

//   return (
//     <div className="p-6">
//       <ToastContainer position="top-right" autoClose={3000} newestOnTop closeOnClick draggable pauseOnHover theme="light" />

//       {/* ── Header ── */}
//       <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4 tour-lead-header">
//         <div className="flex items-center gap-3">
//           <h2 className="text-2xl font-bold text-gray-800">Leads</h2>
//           {totalLeads > 0 && (
//             <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-xs font-semibold">
//               {totalLeads} total
//             </span>
//           )}
//         </div>
//         <div className="flex flex-wrap gap-3 items-center">
//           <button
//             onClick={() => setIsOpen(true)}
//             className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 tour-finish"
//           >
//             <Eye className="w-4 h-4" /> Take Tour
//           </button>
//           {selectedLeads.length > 0 && (
//             <button
//               onClick={() => { setLeadToDelete(null); setShowDeleteModal(true); }}
//               className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow flex items-center gap-2"
//             >
//               <Trash2 className="w-4 h-4" /> Delete Selected ({selectedLeads.length})
//             </button>
//           )}
//           {(userRole === "Admin" || userRole === "Sales") && (
//             <button
//               onClick={() => navigate("/createleads")}
//               className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow flex items-center gap-2 tour-create-lead"
//             >
//               <Plus className="w-4 h-4" /> Create Lead
//             </button>
//           )}
//         </div>
//       </div>

//       {/* ── Filters ── */}
//       <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4 tour-filters">

//         {/* Search */}
//         <div className="relative tour-search">
//           <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
//           <input
//             type="text"
//             placeholder="Search leads..."
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             className="w-full pl-10 pr-4 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//         </div>

//         {/* ── Assignee filter (Admin only) ──────────────────────────
//             Now shows ALL salespersons from every page because
//             `assignees` is fetched independently with limit=99999.
//         ─────────────────────────────────────────────────────────── */}
//         {userRole === "Admin" && (
//           <select
//             value={assigneeFilter}
//             onChange={(e) => setAssigneeFilter(e.target.value)}
//             disabled={assigneesLoading}
//             className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white disabled:opacity-60"
//           >
//             <option value="">
//               {assigneesLoading ? "Loading assignees…" : "All Assignees"}
//             </option>
//             {assignees.map((a, i) => (
//               <option key={i} value={a}>{a}</option>
//             ))}
//           </select>
//         )}

//         {/* Status filter */}
//         <select
//           value={statusFilter}
//           onChange={(e) => setStatusFilter(e.target.value)}
//           className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
//         >
//           <option value="">All Status</option>
//           <option value="Hot">Hot</option>
//           <option value="Warm">Warm</option>
//           <option value="Cold">Cold</option>
//           <option value="Junk">Junk</option>
//           <option value="Converted">Converted</option>
//         </select>

//         {/* Source filter */}
//         <select
//           value={sourceFilter}
//           onChange={(e) => setSourceFilter(e.target.value)}
//           className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
//         >
//           <option value="">All Sources</option>
//           <option value="Website">Website</option>
//           <option value="Referral">Referral</option>
//           <option value="Social Media">Social Media</option>
//           <option value="Email">Email</option>
//           <option value="Cold Call">Cold Call</option>
//           <option value="Facebook">Facebook</option>
//           <option value="Other">Other</option>
//         </select>
//       </div>

//       {/* ── Table ── */}
//       <div className="tour-lead-table rounded-xl border border-gray-200 shadow-sm overflow-hidden">
//         <div className="overflow-x-auto overflow-y-auto max-h-[calc(100vh-280px)]">
//           <table className="min-w-max w-full table-auto divide-y divide-gray-200">
//             <thead className="sticky top-0 bg-gray-50 z-10">
//               <tr className="whitespace-nowrap">
//                 <th className="px-4 py-3 tour-checkbox">
//                   <input
//                     type="checkbox"
//                     className="h-4 w-4 text-blue-600 border-gray-300 rounded"
//                     checked={leads.length > 0 && selectedLeads.length === leads.length}
//                     onChange={handleSelectAll}
//                   />
//                 </th>
//                 <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Lead</th>
//                 <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Contact</th>
//                 <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Destination</th>
//                 <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Country</th>
//                 <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Source</th>
//                 <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Adults</th>
//                 <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Children</th>
//                 <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Travel Date</th>
//                 <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
//                 <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Assignee</th>
//                 <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Created</th>
//                 <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Follow-Up</th>
//                 <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tour-lead-actions sticky right-0 bg-gray-50 shadow-[-4px_0_8px_-2px_rgba(0,0,0,0.08)] z-20">
//                   Actions
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-200 bg-white">
//               {leads.length > 0 ? leads.map((lead, idx) => {
//                 const isFacebook = lead.source === "Facebook";
//                 return (
//                   <tr
//                     key={lead._id}
//                     className={`hover:bg-blue-50/30 transition-colors whitespace-nowrap ${
//                       selectedLeads.includes(lead._id) ? "bg-blue-50" : idx % 2 === 0 ? "bg-white" : "bg-gray-50/50"
//                     }`}
//                   >
//                     <td className="px-4 py-3">
//                       <input
//                         type="checkbox"
//                         className="h-4 w-4 text-blue-600 border-gray-300 rounded"
//                         checked={selectedLeads.includes(lead._id)}
//                         onChange={() => handleSelectLead(lead._id)}
//                       />
//                     </td>

//                     {/* Lead name + email */}
//                     <td className="px-4 py-3">
//                       <div className="flex items-center gap-3">
//                         <LeadAvatar name={lead.leadName} />
//                         <div className="flex flex-col min-w-0">
//                           <div className="flex items-center gap-1.5 flex-wrap">
//                             <span
//                               onClick={() => navigate(`/leads/view/${lead._id}`)}
//                               className="font-medium text-blue-600 text-sm cursor-pointer hover:underline truncate max-w-[140px]"
//                               title={lead.leadName || "Unnamed Lead"}
//                             >
//                               {lead.leadName || "Unnamed Lead"}
//                             </span>
//                             {isFacebook && <FacebookBadge />}
//                           </div>
//                           <span className="text-gray-400 text-xs truncate max-w-[160px]">{lead.email || "-"}</span>
//                         </div>
//                       </div>
//                     </td>

//                     <td className="px-4 py-3 text-sm text-gray-700">{lead.phoneNumber || "-"}</td>
//                     <td className="px-4 py-3 text-sm text-gray-700">{lead.destination  || "-"}</td>
//                     <td className="px-4 py-3 text-sm text-gray-700">{lead.country      || "-"}</td>
//                     <td className="px-4 py-3"><SourceBadge source={lead.source} /></td>

//                     {/* Adults */}
//                     <td className="px-4 py-3 text-sm text-gray-700">
//                       {lead.noOfAdults != null ? (
//                         <span className="inline-flex items-center gap-1">
//                           <Users className="w-3.5 h-3.5 text-blue-400" />{lead.noOfAdults}
//                         </span>
//                       ) : "-"}
//                     </td>

//                     {/* Children */}
//                     <td className="px-4 py-3 text-sm text-gray-700">
//                       {lead.noOfChildren != null ? (
//                         <span className="inline-flex items-center gap-1">
//                           <Users className="w-3.5 h-3.5 text-purple-400" />{lead.noOfChildren}
//                         </span>
//                       ) : "-"}
//                     </td>

//                     <td className="px-4 py-3 text-sm text-gray-700">{formatDate(lead.travelDate)}</td>

//                     {/* Status */}
//                     <td className="px-4 py-3">
//                       <select
//                         value={lead.status}
//                         onChange={(e) => handleStatusChange(lead._id, e.target.value)}
//                         className={getStatusClass(lead.status)}
//                       >
//                         <option value="Hot">Hot</option>
//                         <option value="Warm">Warm</option>
//                         <option value="Cold">Cold</option>
//                         <option value="Junk">Junk</option>
//                       </select>
//                     </td>

//                     {/* Assignee */}
//                     <td className="px-4 py-3 text-sm text-gray-700">
//                       {getAssigneeName(lead.assignTo) || (
//                         <span className="text-gray-400 italic text-xs">Unassigned</span>
//                       )}
//                     </td>

//                     <td className="px-4 py-3 text-sm text-gray-700">{formatDate(lead.createdAt)}</td>

//                     {/* Follow-up inline date picker */}
//                     <td className="px-4 py-3 text-sm text-gray-700">
//                       <div className="relative flex items-center gap-1">
//                         <button
//                           type="button"
//                           onClick={() => openFollowUpPicker(lead._id)}
//                           disabled={followUpSavingId === lead._id}
//                           className="inline-flex items-center gap-2 px-2 py-1 rounded-md hover:bg-gray-100 transition"
//                         >
//                           <Calendar className="w-4 h-4 text-gray-500" />
//                           <span className="text-sm">
//                             {followUpSavingId === lead._id ? "Saving..." : formatDate(lead.followUpDate)}
//                           </span>
//                         </button>
//                         {editingFollowUpId === lead._id && (
//                           <input
//                             ref={(el) => (dateInputRefs.current[lead._id] = el)}
//                             type="date"
//                             defaultValue={toDateInputValue(lead.followUpDate)}
//                             className="absolute left-0 top-0 w-0 h-0 opacity-0"
//                             onChange={(e) => updateFollowUpDateInline(lead._id, e.target.value)}
//                             onBlur={() => setEditingFollowUpId(null)}
//                           />
//                         )}
//                       </div>
//                     </td>

//                     {/* Actions menu */}
//                     <td className={`px-4 py-3 text-right relative sticky right-0 z-10 shadow-[-4px_0_8px_-2px_rgba(0,0,0,0.06)] ${
//                       selectedLeads.includes(lead._id) ? "bg-blue-50" : idx % 2 === 0 ? "bg-white" : "bg-gray-50/80"
//                     }`}>
//                       <button
//                         className="p-2 rounded-lg hover:bg-gray-200 transition-colors"
//                         onClick={(e) => handleMenuToggle(lead._id, e)}
//                       >
//                         <MoreVertical className="w-5 h-5 text-gray-600" />
//                       </button>
//                       {menuOpen === lead._id && (
//                         <div
//                           className="fixed z-50 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-1"
//                           style={{ top: `${menuPosition.top}px`, left: `${menuPosition.left}px` }}
//                         >
//                           <button
//                             onClick={(e) => { e.stopPropagation(); handleEdit(lead._id); }}
//                             className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
//                           >
//                             <Edit className="w-4 h-4 mr-2" /> Edit
//                           </button>
//                           {lead.status !== "Converted" && (
//                             <button
//                               onClick={(e) => { e.stopPropagation(); openConvertModal(lead); }}
//                               className="flex items-center w-full px-3 py-2 text-sm text-green-600 hover:bg-gray-100"
//                             >
//                               <Handshake className="w-4 h-4 mr-2" /> Convert
//                             </button>
//                           )}
//                           <button
//                             onClick={(e) => { e.stopPropagation(); handleDeleteClick(lead._id); }}
//                             className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-gray-100"
//                           >
//                             <Trash2 className="w-4 h-4 mr-2" /> Delete
//                           </button>
//                         </div>
//                       )}
//                     </td>
//                   </tr>
//                 );
//               }) : (
//                 <tr>
//                   <td colSpan={14} className="px-4 py-16 text-center">
//                     <div className="flex flex-col items-center gap-2 text-gray-400">
//                       <Search className="w-10 h-10 opacity-30" />
//                       <p className="text-sm font-medium">No leads found</p>
//                       <p className="text-xs text-gray-300">
//                         {sourceFilter === "Facebook"
//                           ? "No Facebook leads yet. They appear automatically when someone submits your Facebook Lead Ad form."
//                           : "Try adjusting your search or filters"}
//                       </p>
//                     </div>
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* ── Pagination ── */}
//       {totalPages > 1 && (
//         <div className="flex flex-col sm:flex-row items-center justify-between mt-4 gap-3">
//           <p className="text-sm text-gray-500">
//             Showing <span className="font-semibold text-gray-700">{firstItem}</span>–
//             <span className="font-semibold text-gray-700">{lastItem}</span> of{" "}
//             <span className="font-semibold text-gray-700">{totalLeads}</span>
//           </p>
//           <div className="flex items-center gap-1">
//             <button onClick={() => goToPage(1)} disabled={currentPage === 1}
//               className="px-2 py-1.5 text-sm border rounded-lg hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed">«</button>
//             <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}
//               className="px-3 py-1.5 text-sm border rounded-lg hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed">‹ Prev</button>
//             {pageNumbers().map((p, i) =>
//               p === "..." ? (
//                 <span key={`d${i}`} className="px-2 text-gray-400">…</span>
//               ) : (
//                 <button key={p} onClick={() => goToPage(p)}
//                   className={`min-w-[36px] px-2 py-1.5 text-sm border rounded-lg transition-colors ${
//                     currentPage === p ? "bg-blue-600 text-white border-blue-600 font-semibold" : "hover:bg-gray-100 text-gray-700"
//                   }`}>
//                   {p}
//                 </button>
//               )
//             )}
//             <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}
//               className="px-3 py-1.5 text-sm border rounded-lg hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed">Next ›</button>
//             <button onClick={() => goToPage(totalPages)} disabled={currentPage === totalPages}
//               className="px-2 py-1.5 text-sm border rounded-lg hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed">»</button>
//           </div>
//         </div>
//       )}

//       {/* ── Delete Confirmation Modal ── */}
//       <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle className="flex items-center gap-2 text-red-600">
//               <Trash2 className="w-5 h-5" /> Confirm Delete
//             </DialogTitle>
//           </DialogHeader>
//           <p className="mb-6 text-gray-700">
//             Are you sure you want to delete{" "}
//             {leadToDelete ? "this lead" : `${selectedLeads.length} selected leads`}? This action cannot be undone.
//           </p>
//           <div className="flex justify-end gap-3">
//             <button
//               onClick={() => { setShowDeleteModal(false); setLeadToDelete(null); }}
//               className="px-4 py-2 rounded-lg border hover:bg-gray-100 text-gray-700"
//             >
//               Cancel
//             </button>
//             <button
//               onClick={() => leadToDelete ? handleDeleteLead(leadToDelete) : handleBulkDelete()}
//               className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 flex items-center gap-2"
//             >
//               <Trash2 className="w-4 h-4" /> Delete
//             </button>
//           </div>
//         </DialogContent>
//       </Dialog>

//       {/* ── Convert Lead to Deal Modal ── */}
//       <Dialog open={convertModalOpen} onOpenChange={setConvertModalOpen}>
//         <DialogContent className="!max-w-3xl w-full p-0 overflow-hidden">
//           <div className="px-6 pt-5 pb-3 border-b border-gray-100">
//             <DialogTitle className="flex items-center gap-2 text-green-600 text-lg font-semibold">
//               <Handshake className="w-5 h-5" /> Convert Lead to Deal
//             </DialogTitle>
//           </div>
//           {selectedLead && (
//             <div className="px-6 py-5 space-y-5 max-h-[78vh] overflow-y-auto">

//               {/* Lead info banner */}
//               <div className={`p-3 rounded-lg border ${selectedLead.source === "Facebook" ? "bg-blue-50 border-blue-200" : "bg-blue-50 border-blue-100"}`}>
//                 <div className="flex items-center gap-2 flex-wrap">
//                   <p className="text-sm text-blue-800">
//                     Converting: <strong>{selectedLead.leadName}</strong>
//                     {selectedLead.destination && ` — ${selectedLead.destination}`}
//                   </p>
//                   {selectedLead.source === "Facebook" && (
//                     <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-600 text-white">
//                       <svg viewBox="0 0 24 24" className="w-2.5 h-2.5 fill-white" xmlns="http://www.w3.org/2000/svg">
//                         <path d="M22 12a10 10 0 1 0-11.563 9.874v-6.988H7.898V12h2.539V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.886h-2.33v6.988A10.003 10.003 0 0 0 22 12z"/>
//                       </svg>
//                       Facebook Lead
//                     </span>
//                   )}
//                 </div>
//               </div>

//               {/* Deal Value + Stage */}
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                 <div className="md:col-span-2">
//                   <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Deal Value</label>
//                   <div className="flex gap-2">
//                     <select
//                       value={dealData.currency}
//                       onChange={(e) => setDealData((p) => ({ ...p, currency: e.target.value }))}
//                       className="w-28 px-2 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none bg-white"
//                     >
//                       {allowedCurrencies.map((c) => <option key={c.code} value={c.code}>{c.symbol} {c.code}</option>)}
//                     </select>
//                     <input
//                       type="number"
//                       value={dealData.value}
//                       onChange={(e) => setDealData((p) => ({ ...p, value: e.target.value }))}
//                       placeholder="Enter value"
//                       className="flex-1 min-w-0 px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
//                     />
//                   </div>
//                 </div>
//                 <div>
//                   <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Stage</label>
//                   <select
//                     value={dealData.stage}
//                     onChange={(e) => setDealData((p) => ({ ...p, stage: e.target.value }))}
//                     className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none bg-white"
//                   >
//                     <option value="Qualification">Qualification</option>
//                     <option value="Proposal">Proposal</option>
//                     <option value="Negotiation">Negotiation</option>
//                     <option value="Closed Won">Closed Won</option>
//                     <option value="Closed Lost">Closed Lost</option>
//                   </select>
//                 </div>
//               </div>

//               {/* Cost section headers */}
//               <div className="grid grid-cols-2 gap-4">
//                 <div className="flex items-center gap-2">
//                   <span className="text-xs font-bold text-gray-600 uppercase tracking-wide whitespace-nowrap">Purchasing Cost</span>
//                   <div className="flex-1 h-px bg-gray-200" />
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <span className="text-xs font-bold text-gray-600 uppercase tracking-wide whitespace-nowrap">Selling Cost</span>
//                   <div className="flex-1 h-px bg-gray-200" />
//                 </div>
//               </div>

//               {/* Cost fields */}
//               <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                 <div>
//                   <label className="block text-xs font-medium text-gray-600 mb-1.5">Land Part</label>
//                   <input type="text" placeholder="e.g. 5000" value={dealData.purchasingLandCost}
//                     onChange={(e) => setDealData((p) => ({ ...p, purchasingLandCost: e.target.value }))}
//                     className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none" />
//                 </div>
//                 <div>
//                   <label className="block text-xs font-medium text-gray-600 mb-1.5">Ticket</label>
//                   <input type="text" placeholder="e.g. 2000" value={dealData.purchasingTicketCost}
//                     onChange={(e) => setDealData((p) => ({ ...p, purchasingTicketCost: e.target.value }))}
//                     className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none" />
//                 </div>
//                 <div>
//                   <label className="block text-xs font-medium text-gray-600 mb-1.5">Land Part</label>
//                   <input type="text" placeholder="e.g. 7000" value={dealData.sellingLandCost}
//                     onChange={(e) => setDealData((p) => ({ ...p, sellingLandCost: e.target.value }))}
//                     className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none" />
//                 </div>
//                 <div>
//                   <label className="block text-xs font-medium text-gray-600 mb-1.5">Ticket</label>
//                   <input type="text" placeholder="e.g. 3000" value={dealData.sellingTicketCost}
//                     onChange={(e) => setDealData((p) => ({ ...p, sellingTicketCost: e.target.value }))}
//                     className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none" />
//                 </div>
//               </div>

//               {/* Totals */}
//               <div className="grid grid-cols-2 gap-4">
//                 <div className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 overflow-hidden">
//                   <span className="text-xs font-medium text-gray-500 whitespace-nowrap">Total Purchasing</span>
//                   <span className="text-sm font-bold text-gray-700 ml-2 truncate">{dealData.currency} {fmt(totalPurchasing)}</span>
//                 </div>
//                 <div className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 overflow-hidden">
//                   <span className="text-xs font-medium text-gray-500 whitespace-nowrap">Total Selling</span>
//                   <span className="text-sm font-bold text-gray-700 ml-2 truncate">{dealData.currency} {fmt(totalSelling)}</span>
//                 </div>
//               </div>

//               {/* Profit / Loss banner */}
//               {(totalPurchasing > 0 || totalSelling > 0) && (
//                 <div className={`flex items-center justify-between px-4 py-3 rounded-lg border overflow-hidden ${profit >= 0 ? "bg-emerald-50 border-emerald-200" : "bg-red-50 border-red-200"}`}>
//                   <div className="flex items-center gap-2 flex-shrink-0">
//                     {profit >= 0
//                       ? <TrendingUp size={16} className="text-emerald-600" />
//                       : <TrendingDown size={16} className="text-red-600" />}
//                     <span className={`text-sm font-semibold ${profit >= 0 ? "text-emerald-700" : "text-red-700"}`}>
//                       {profit >= 0 ? "Net Profit" : "Net Loss"}
//                     </span>
//                   </div>
//                   <span className={`text-base font-bold ml-4 truncate ${profit >= 0 ? "text-emerald-700" : "text-red-700"}`}>
//                     {profit >= 0 ? "+" : "-"}{dealData.currency} {fmt(Math.abs(profit))}
//                   </span>
//                 </div>
//               )}

//               {/* Notes */}
//               <div>
//                 <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Notes</label>
//                 <textarea
//                   value={dealData.notes}
//                   rows={4}
//                   placeholder="Add any notes..."
//                   onChange={(e) => setDealData((p) => ({ ...p, notes: e.target.value }))}
//                   className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none resize-y"
//                 />
//               </div>

//               {/* Action buttons */}
//               <div className="flex justify-end gap-3 pt-1 border-t border-gray-100">
//                 <button
//                   onClick={() => setConvertModalOpen(false)}
//                   disabled={converting}
//                   className="px-5 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 text-gray-700 text-sm font-medium"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={handleConvertDeal}
//                   disabled={converting}
//                   className="px-5 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 flex items-center gap-2 text-sm font-medium disabled:opacity-50"
//                 >
//                   <Handshake size={15} />
//                   {converting ? "Converting..." : "Convert to Deal"}
//                 </button>
//               </div>
//             </div>
//           )}
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }

// /* ═══════════════════════════════════════════════════════════════
//    EXPORT WITH TOUR PROVIDER
//    ═══════════════════════════════════════════════════════════════ */
// export default function LeadTable() {
//   return (
//     <TourProvider
//       steps={tourSteps}
//       afterOpen={() => (document.body.style.overflow = "hidden")}
//       beforeClose={() => (document.body.style.overflow = "unset")}
//       styles={{
//         popover:  (base) => ({ ...base, backgroundColor: "#fff", color: "#1f1f1f" }),
//         maskArea: (base) => ({ ...base, rx: 8 }),
//         badge:    (base) => ({ ...base, display: "none" }),
//         close:    (base) => ({ ...base, right: "auto", left: 8, top: 8 }),
//       }}
//     >
//       <LeadTableComponent />
//     </TourProvider>
//   );
// }//assign name show all correctly show all names in dropdown..




// import React, { useState, useEffect, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import axios from "axios";
// import { TourProvider, useTour } from "@reactour/tour";
// import {
//   MoreVertical, Trash2, Edit, Handshake, Search, Plus, Eye, Calendar,
//   TrendingUp, TrendingDown, Users,
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
//   { selector: ".tour-lead-table",   content: "This is your leads table with all key information. Facebook leads are marked with a blue 'FB' badge." },
//   { selector: ".tour-checkbox",     content: "Select individual leads or use the header checkbox to select all." },
//   { selector: ".tour-lead-actions", content: "Click the three-dot menu to edit, convert, or delete a lead." },
//   { selector: ".tour-finish",       content: "You've completed the tour!" },
// ];

// /* ── Avatar helpers ── */
// const getInitials = (name) => {
//   if (!name || typeof name !== "string") return "?";
//   const trimmed = name.trim();
//   if (!trimmed) return "?";
//   const letters = trimmed.replace(/[^a-zA-Z]/g, "");
//   if (letters.length === 0) return trimmed.slice(0, 2).toUpperCase();
//   if (letters.length === 1) return letters[0].toUpperCase();
//   const words = trimmed.split(/[\s._\-]+/).filter(Boolean);
//   if (words.length >= 2) {
//     const a = words[0].replace(/[^a-zA-Z]/g, "")[0] || "";
//     const b = words[1].replace(/[^a-zA-Z]/g, "")[0] || "";
//     return (a + b).toUpperCase();
//   }
//   return letters.slice(0, 2).toUpperCase();
// };

// const AVATAR_COLORS = [
//   { bg: "bg-blue-100",   text: "text-blue-700"   },
//   { bg: "bg-purple-100", text: "text-purple-700"  },
//   { bg: "bg-green-100",  text: "text-green-700"   },
//   { bg: "bg-orange-100", text: "text-orange-700"  },
//   { bg: "bg-pink-100",   text: "text-pink-700"    },
//   { bg: "bg-teal-100",   text: "text-teal-700"    },
//   { bg: "bg-indigo-100", text: "text-indigo-700"  },
//   { bg: "bg-red-100",    text: "text-red-700"     },
//   { bg: "bg-yellow-100", text: "text-yellow-700"  },
//   { bg: "bg-cyan-100",   text: "text-cyan-700"    },
// ];

// const getAvatarColor = (name) => {
//   if (!name) return AVATAR_COLORS[0];
//   let hash = 0;
//   for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
//   return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
// };

// const LeadAvatar = ({ name }) => {
//   const initials = getInitials(name);
//   const color    = getAvatarColor(name);
//   return (
//     <div
//       className={`h-9 w-9 rounded-full flex-shrink-0 flex items-center justify-center font-semibold text-xs select-none ${color.bg} ${color.text}`}
//       style={{ minWidth: "2.25rem", minHeight: "2.25rem" }}
//       title={name || ""}
//     >
//       {initials}
//     </div>
//   );
// };

// /* ── Facebook badge ── */
// const FacebookBadge = () => (
//   <span
//     title="Lead from Facebook Ad"
//     className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-600 text-white leading-none select-none"
//     style={{ letterSpacing: "0.02em" }}
//   >
//     <svg viewBox="0 0 24 24" className="w-2.5 h-2.5 fill-white flex-shrink-0" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
//       <path d="M22 12a10 10 0 1 0-11.563 9.874v-6.988H7.898V12h2.539V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.886h-2.33v6.988A10.003 10.003 0 0 0 22 12z"/>
//     </svg>
//     FB
//   </span>
// );

// const fmt = (n) => new Intl.NumberFormat("en-IN", { maximumFractionDigits: 2 }).format(n);

// /* ── Helper: extract assignee display name from a lead object ── */
// const getAssigneeName = (assignTo) => {
//   if (!assignTo) return null;
//   if (typeof assignTo === "object" && assignTo.firstName)
//     return `${assignTo.firstName} ${assignTo.lastName || ""}`.trim();
//   return "Assigned User";
// };

// /* ═══════════════════════════════════════════════════════════════
//    MAIN COMPONENT
//    ═══════════════════════════════════════════════════════════════ */
// function LeadTableComponent() {
//   const navigate      = useNavigate();
//   const { setIsOpen } = useTour();

//   const [leads,         setLeads]         = useState([]);
//   const [selectedLeads, setSelectedLeads] = useState([]);
//   const [loading,       setLoading]       = useState(true);
//   const [userRole,      setUserRole]      = useState("");

//   const [assignees,        setAssignees]        = useState([]);
//   const [assigneesLoading, setAssigneesLoading] = useState(false);

//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages,  setTotalPages]  = useState(1);
//   const [totalLeads,  setTotalLeads]  = useState(0);

//   const [searchQuery,     setSearchQuery]     = useState("");
//   const [debouncedSearch, setDebouncedSearch] = useState("");
//   const [statusFilter,    setStatusFilter]    = useState("");
//   const [sourceFilter,    setSourceFilter]    = useState("");
//   const [assigneeFilter,  setAssigneeFilter]  = useState("");
//   const searchTimer = useRef(null);

//   const [menuOpen,     setMenuOpen]     = useState(null);
//   const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });

//   const [showDeleteModal,  setShowDeleteModal]  = useState(false);
//   const [leadToDelete,     setLeadToDelete]     = useState(null);
//   const [convertModalOpen, setConvertModalOpen] = useState(false);
//   const [selectedLead,     setSelectedLead]     = useState(null);
//   const [converting,       setConverting]       = useState(false);

//   const [dealData, setDealData] = useState({
//     value: "", currency: "USD", notes: "", stage: "Qualification",
//     purchasingLandCost: "", purchasingTicketCost: "",
//     sellingLandCost:    "", sellingTicketCost:    "",
//     noOfAdults:   "",
//     noOfChildren: "",
//     travelDate:   "",
//   });

//   const dateInputRefs                              = useRef({});
//   const [editingFollowUpId, setEditingFollowUpId] = useState(null);
//   const [followUpSavingId,  setFollowUpSavingId]  = useState(null);

//   const allowedCurrencies = [
//     { code: "USD", symbol: "$"   }, { code: "EUR", symbol: "€"   },
//     { code: "INR", symbol: "₹"   }, { code: "GBP", symbol: "£"   },
//     { code: "JPY", symbol: "¥"   }, { code: "AUD", symbol: "A$"  },
//     { code: "CAD", symbol: "C$"  }, { code: "CHF", symbol: "CHF" },
//     { code: "MYR", symbol: "RM"  }, { code: "AED", symbol: "د.إ" },
//     { code: "SGD", symbol: "S$"  }, { code: "ZAR", symbol: "R"   },
//     { code: "SAR", symbol: "﷼"   },
//   ];

//   const parseCost = (v) => {
//     const n = parseFloat(String(v || "").replace(/,/g, ""));
//     return isNaN(n) ? 0 : n;
//   };

//   const totalPurchasing = parseCost(dealData.purchasingLandCost) + parseCost(dealData.purchasingTicketCost);
//   const totalSelling    = parseCost(dealData.sellingLandCost)    + parseCost(dealData.sellingTicketCost);
//   const profit          = totalSelling - totalPurchasing;

//   const userIdRef = useRef(null);

//   /* ── 1. Read user from localStorage ── */
//   useEffect(() => {
//     try {
//       const user = JSON.parse(localStorage.getItem("user") || "{}");
//       setUserRole(user.role?.name || "");
//       userIdRef.current = user._id || user.id || null;
//     } catch {}
//   }, []);

//   /* ── 2. Fetch ALL assignees once on mount (Admin only) ── */
//   useEffect(() => {
//     if (!userRole || userRole !== "Admin") return;

//     const fetchAllAssignees = async () => {
//       try {
//         setAssigneesLoading(true);

//         const { data } = await axios.get(
//           `${API_URL}/leads/getAllLead?page=1&limit=99999`,
//           { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
//         );

//         const isNew    = data && !Array.isArray(data) && Array.isArray(data.leads);
//         const leadsArr = isNew ? data.leads : (Array.isArray(data) ? data : []);

//         const seen  = new Map();
//         const assigneeList = [];
        
//         leadsArr.forEach((lead) => {
//           const assignee = lead.assignTo;
//           if (assignee && assignee._id && !seen.has(assignee._id)) {
//             seen.set(assignee._id, true);
//             const name = `${assignee.firstName || ""} ${assignee.lastName || ""}`.trim();
//             assigneeList.push({
//               id: assignee._id,
//               name: name || "Unnamed User"
//             });
//           }
//         });

//         assigneeList.sort((a, b) => a.name.localeCompare(b.name));
//         setAssignees(assigneeList);
//       } catch (err) {
//         console.error("Fetch assignees error:", err);
//       } finally {
//         setAssigneesLoading(false);
//       }
//     };

//     fetchAllAssignees();
//   }, [userRole]);

//   /* ── 3. Socket: real-time Facebook leads ── */
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       const userId = userIdRef.current;
//       const socket = initSocket(userId);
//       if (!socket) return;

//       const handleNewLead = (newLead) => {
//         setLeads((prev) => {
//           if (prev.some((l) => l._id === newLead._id)) return prev;
//           return [newLead, ...prev];
//         });
//         setTotalLeads((prev) => prev + 1);

//         const assignee = newLead.assignTo;
//         if (assignee && assignee._id) {
//           setAssignees((prev) => {
//             if (prev.some(a => a.id === assignee._id)) return prev;
//             const name = `${assignee.firstName || ""} ${assignee.lastName || ""}`.trim();
//             const newAssignees = [...prev, { id: assignee._id, name: name || "Unnamed User" }];
//             return newAssignees.sort((a, b) => a.name.localeCompare(b.name));
//           });
//         }
//       };

//       socket.on("new_facebook_lead", handleNewLead);
//       return () => { socket.off("new_facebook_lead", handleNewLead); };
//     }, 100);

//     return () => clearTimeout(timer);
//   }, []);

//   /* ── 4. Search debounce ── */
//   useEffect(() => {
//     if (searchTimer.current) clearTimeout(searchTimer.current);
//     searchTimer.current = setTimeout(() => {
//       setDebouncedSearch(searchQuery);
//       setCurrentPage(1);
//     }, 500);
//     return () => clearTimeout(searchTimer.current);
//   }, [searchQuery]);

//   /* ── 5. Reset to page 1 when filters change ── */
//   useEffect(() => { setCurrentPage(1); }, [statusFilter, sourceFilter, assigneeFilter]);

//   /* ── 6. Paginated lead fetch ── */
//   useEffect(() => {
//     const fetchLeads = async () => {
//       try {
//         setLoading(true);
//         const params = new URLSearchParams({ page: currentPage, limit: ITEMS_PER_PAGE });
//         if (debouncedSearch) params.append("search",   debouncedSearch);
//         if (statusFilter)    params.append("status",   statusFilter);
//         if (sourceFilter)    params.append("source",   sourceFilter);
//         if (assigneeFilter)  params.append("assignee", assigneeFilter);

//         const { data } = await axios.get(
//           `${API_URL}/leads/getAllLead?${params.toString()}`,
//           { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
//         );

//         const isNew    = data && !Array.isArray(data) && Array.isArray(data.leads);
//         const leadsArr = isNew ? data.leads : (Array.isArray(data) ? data : []);
//         const total    = isNew ? data.totalLeads : leadsArr.length;
//         const pages    = isNew ? data.totalPages  : Math.ceil(leadsArr.length / ITEMS_PER_PAGE);

//         setLeads(leadsArr);
//         setTotalLeads(total);
//         setTotalPages(pages);

//       } catch (err) {
//         console.error("Fetch leads error:", err);
//         toast.error("Failed to fetch leads");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchLeads();
//   }, [currentPage, debouncedSearch, statusFilter, sourceFilter, assigneeFilter]);

//   /* ── Pagination helpers ── */
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

//   /* ── CRUD handlers ── */
//   const handleDeleteLead = async (id) => {
//     try {
//       await axios.delete(`${API_URL}/leads/deleteLead/${id}`, {
//         headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
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

//   const handleBulkDelete = async () => {
//     try {
//       await Promise.all(selectedLeads.map((id) =>
//         axios.delete(`${API_URL}/leads/deleteLead/${id}`, {
//           headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
//         })
//       ));
//       setLeads((prev) => prev.filter((l) => !selectedLeads.includes(l._id)));
//       setTotalLeads((prev) => prev - selectedLeads.length);
//       toast.success(`${selectedLeads.length} leads deleted`);
//       setSelectedLeads([]);
//       if (leads.length === selectedLeads.length && currentPage > 1) setCurrentPage((p) => p - 1);
//     } catch {
//       toast.error("Error deleting leads");
//     } finally {
//       setShowDeleteModal(false);
//     }
//   };

//   const handleSelectLead = (id) =>
//     setSelectedLeads((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);

//   const handleSelectAll = (e) =>
//     setSelectedLeads(e.target.checked ? leads.map((l) => l._id) : []);

//   const handleMenuToggle = (leadId, e) => {
//     e.stopPropagation();
//     const rect = e.currentTarget.getBoundingClientRect();
//     let top  = rect.bottom + window.scrollY + 4;
//     let left = rect.right  + window.scrollX - 160;
//     if (rect.bottom + 120 > window.innerHeight) top = rect.top + window.scrollY - 124;
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

//   const openConvertModal = (lead) => {
//     setSelectedLead(lead);
//     setDealData({
//       value:    lead.value    || "",
//       currency: lead.currency || "USD",
//       notes:    lead.notes    || "",
//       stage:    "Qualification",
//       purchasingLandCost:   "",
//       purchasingTicketCost: "",
//       sellingLandCost:      "",
//       sellingTicketCost:    "",
//       noOfAdults:   lead.noOfAdults   != null ? String(lead.noOfAdults)   : "",
//       noOfChildren: lead.noOfChildren != null ? String(lead.noOfChildren) : "",
//       travelDate:   lead.travelDate
//         ? new Date(lead.travelDate).toISOString().split("T")[0]
//         : "",
//     });
//     setConvertModalOpen(true);
//     setMenuOpen(null);
//   };

//   const handleConvertDeal = async () => {
//     if (!selectedLead) return;
//     try {
//       setConverting(true);
//       const toastId = toast.loading("Converting lead to deal...");
//       const res     = await axios.patch(
//         `${API_URL}/leads/${selectedLead._id}/convert`,
//         dealData,
//         { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
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

//   const handleStatusChange = async (leadId, newStatus) => {
//     try {
//       await axios.patch(
//         `${API_URL}/leads/${leadId}/status`,
//         { status: newStatus },
//         { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
//       );
//       setLeads((prev) => prev.map((l) => l._id === leadId ? { ...l, status: newStatus } : l));
//       toast.success("Status updated");
//     } catch {
//       toast.error("Failed to update status");
//     }
//   };

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
//       await axios.patch(
//         `${API_URL}/leads/${leadId}/followup`,
//         { followUpDate: newDate },
//         { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
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

//   /* ── Formatting helpers ── */
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
//     `w-full px-3 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-1 ${statusClasses[status] || statusClasses.Junk} ${
//       status === "Hot"  ? "focus:ring-red-300"    :
//       status === "Warm" ? "focus:ring-yellow-300" :
//       status === "Cold" ? "focus:ring-blue-300"   : "focus:ring-gray-300"
//     }`;

//   const SourceBadge = ({ source }) => {
//     if (!source) return <span className="text-gray-400 text-xs">-</span>;
//     if (source === "Facebook") {
//       return (
//         <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200 whitespace-nowrap">
//           <svg viewBox="0 0 24 24" className="w-2.5 h-2.5 fill-blue-600 flex-shrink-0" xmlns="http://www.w3.org/2000/svg">
//             <path d="M22 12a10 10 0 1 0-11.563 9.874v-6.988H7.898V12h2.539V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.886h-2.33v6.988A10.003 10.003 0 0 0 22 12z"/>
//           </svg>
//           Facebook
//         </span>
//       );
//     }
//     return <span className="text-sm text-gray-700">{source}</span>;
//   };

//   /* ── Initial loading spinner ── */
//   if (loading && leads.length === 0) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
//       </div>
//     );
//   }

//   const firstItem = totalLeads === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1;
//   const lastItem  = Math.min(currentPage * ITEMS_PER_PAGE, totalLeads);

//   return (
//     <div className="p-6">
//       <ToastContainer position="top-right" autoClose={3000} newestOnTop closeOnClick draggable pauseOnHover theme="light" />

//       {/* ── Header ── */}
//       <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4 tour-lead-header">
//         <div className="flex items-center gap-3">
//           <h2 className="text-2xl font-bold text-gray-800">Leads</h2>
//           {totalLeads > 0 && (
//             <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-xs font-semibold">
//               {totalLeads} total
//             </span>
//           )}
//         </div>
//         <div className="flex flex-wrap gap-3 items-center">
//           <button
//             onClick={() => setIsOpen(true)}
//             className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 tour-finish"
//           >
//             <Eye className="w-4 h-4" /> Take Tour
//           </button>
//           {selectedLeads.length > 0 && (
//             <button
//               onClick={() => { setLeadToDelete(null); setShowDeleteModal(true); }}
//               className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow flex items-center gap-2"
//             >
//               <Trash2 className="w-4 h-4" /> Delete Selected ({selectedLeads.length})
//             </button>
//           )}
//           {(userRole === "Admin" || userRole === "Sales") && (
//             <button
//               onClick={() => navigate("/createleads")}
//               className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow flex items-center gap-2 tour-create-lead"
//             >
//               <Plus className="w-4 h-4" /> Create Lead
//             </button>
//           )}
//         </div>
//       </div>

//       {/* ── Filters ── */}
//       <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4 tour-filters">

//         {/* Search */}
//         <div className="relative tour-search">
//           <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
//           <input
//             type="text"
//             placeholder="Search leads..."
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             className="w-full pl-10 pr-4 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//         </div>

//         {/* Assignee filter (Admin only) */}
//         {userRole === "Admin" && (
//           <select
//             value={assigneeFilter}
//             onChange={(e) => setAssigneeFilter(e.target.value)}
//             disabled={assigneesLoading}
//             className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white disabled:opacity-60"
//           >
//             <option value="">
//               {assigneesLoading ? "Loading assignees…" : "All Assignees"}
//             </option>
//             {assignees.map((assignee) => (
//               <option key={assignee.id} value={assignee.id}>
//                 {assignee.name}
//               </option>
//             ))}
//           </select>
//         )}

//         {/* Status filter */}
//         <select
//           value={statusFilter}
//           onChange={(e) => setStatusFilter(e.target.value)}
//           className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
//         >
//           <option value="">All Status</option>
//           <option value="Hot">Hot</option>
//           <option value="Warm">Warm</option>
//           <option value="Cold">Cold</option>
//           <option value="Junk">Junk</option>
//           <option value="Converted">Converted</option>
//         </select>

//         {/* Source filter */}
//         <select
//           value={sourceFilter}
//           onChange={(e) => setSourceFilter(e.target.value)}
//           className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
//         >
//           <option value="">All Sources</option>
//           <option value="Website">Website</option>
//           <option value="Referral">Referral</option>
//           <option value="Social Media">Social Media</option>
//           <option value="Email">Email</option>
//           <option value="Cold Call">Cold Call</option>
//           <option value="Facebook">Facebook</option>
//           <option value="Other">Other</option>
//         </select>
//       </div>

//       {/* ── Table ── */}
//       <div className="tour-lead-table rounded-xl border border-gray-200 shadow-sm overflow-hidden">
//         <div className="overflow-x-auto overflow-y-auto max-h-[calc(100vh-280px)]">
//           <table className="min-w-max w-full table-auto divide-y divide-gray-200">
//             <thead className="sticky top-0 bg-gray-50 z-10">
//               <tr className="whitespace-nowrap">
//                 <th className="px-4 py-3 tour-checkbox">
//                   <input
//                     type="checkbox"
//                     className="h-4 w-4 text-blue-600 border-gray-300 rounded"
//                     checked={leads.length > 0 && selectedLeads.length === leads.length}
//                     onChange={handleSelectAll}
//                   />
//                 </th>
//                 <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Lead</th>
//                 <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Contact</th>
//                 <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Destination</th>
//                 <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Country</th>
//                 <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Source</th>
//                 <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Adults</th>
//                 <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Children</th>
//                 <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Travel Date</th>
//                 <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
//                 <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Assignee</th>
//                 <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Created</th>
//                 <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Follow-Up</th>
//                 <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tour-lead-actions sticky right-0 bg-gray-50 shadow-[-4px_0_8px_-2px_rgba(0,0,0,0.08)] z-20">
//                   Actions
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-200 bg-white">
//               {leads.length > 0 ? leads.map((lead, idx) => {
//                 const isFacebook = lead.source === "Facebook";
//                 return (
//                   <tr
//                     key={lead._id}
//                     className={`hover:bg-blue-50/30 transition-colors whitespace-nowrap ${
//                       selectedLeads.includes(lead._id) ? "bg-blue-50" : idx % 2 === 0 ? "bg-white" : "bg-gray-50/50"
//                     }`}
//                   >
//                     <td className="px-4 py-3">
//                       <input
//                         type="checkbox"
//                         className="h-4 w-4 text-blue-600 border-gray-300 rounded"
//                         checked={selectedLeads.includes(lead._id)}
//                         onChange={() => handleSelectLead(lead._id)}
//                       />
//                     </td>

//                     {/* Lead name + email */}
//                     <td className="px-4 py-3">
//                       <div className="flex items-center gap-3">
//                         <LeadAvatar name={lead.leadName} />
//                         <div className="flex flex-col min-w-0">
//                           <div className="flex items-center gap-1.5 flex-wrap">
//                             <span
//                               onClick={() => navigate(`/leads/view/${lead._id}`)}
//                               className="font-medium text-blue-600 text-sm cursor-pointer hover:underline truncate max-w-[140px]"
//                               title={lead.leadName || "Unnamed Lead"}
//                             >
//                               {lead.leadName || "Unnamed Lead"}
//                             </span>
//                             {isFacebook && <FacebookBadge />}
//                           </div>
//                           <span className="text-gray-400 text-xs truncate max-w-[160px]">{lead.email || "-"}</span>
//                         </div>
//                       </div>
//                     </td>

//                     <td className="px-4 py-3 text-sm text-gray-700">{lead.phoneNumber || "-"}</td>
//                     <td className="px-4 py-3 text-sm text-gray-700">{lead.destination  || "-"}</td>
//                     <td className="px-4 py-3 text-sm text-gray-700">{lead.country      || "-"}</td>
//                     <td className="px-4 py-3"><SourceBadge source={lead.source} /></td>

//                     {/* Adults */}
//                     <td className="px-4 py-3 text-sm text-gray-700">
//                       {lead.noOfAdults != null ? (
//                         <span className="inline-flex items-center gap-1">
//                           <Users className="w-3.5 h-3.5 text-blue-400" />{lead.noOfAdults}
//                         </span>
//                       ) : "-"}
//                     </td>

//                     {/* Children */}
//                     <td className="px-4 py-3 text-sm text-gray-700">
//                       {lead.noOfChildren != null ? (
//                         <span className="inline-flex items-center gap-1">
//                           <Users className="w-3.5 h-3.5 text-purple-400" />{lead.noOfChildren}
//                         </span>
//                       ) : "-"}
//                     </td>

//                     <td className="px-4 py-3 text-sm text-gray-700">{formatDate(lead.travelDate)}</td>

//                     {/* Status */}
//                     <td className="px-4 py-3">
//                       <select
//                         value={lead.status}
//                         onChange={(e) => handleStatusChange(lead._id, e.target.value)}
//                         className={getStatusClass(lead.status)}
//                       >
//                         <option value="Hot">Hot</option>
//                         <option value="Warm">Warm</option>
//                         <option value="Cold">Cold</option>
//                         <option value="Junk">Junk</option>
//                       </select>
//                     </td>

//                     {/* Assignee */}
//                     <td className="px-4 py-3 text-sm text-gray-700">
//                       {getAssigneeName(lead.assignTo) || (
//                         <span className="text-gray-400 italic text-xs">Unassigned</span>
//                       )}
//                     </td>

//                     <td className="px-4 py-3 text-sm text-gray-700">{formatDate(lead.createdAt)}</td>

//                     {/* Follow-up inline date picker */}
//                     <td className="px-4 py-3 text-sm text-gray-700">
//                       <div className="relative flex items-center gap-1">
//                         <button
//                           type="button"
//                           onClick={() => openFollowUpPicker(lead._id)}
//                           disabled={followUpSavingId === lead._id}
//                           className="inline-flex items-center gap-2 px-2 py-1 rounded-md hover:bg-gray-100 transition"
//                         >
//                           <Calendar className="w-4 h-4 text-gray-500" />
//                           <span className="text-sm">
//                             {followUpSavingId === lead._id ? "Saving..." : formatDate(lead.followUpDate)}
//                           </span>
//                         </button>
//                         {editingFollowUpId === lead._id && (
//                           <input
//                             ref={(el) => (dateInputRefs.current[lead._id] = el)}
//                             type="date"
//                             defaultValue={toDateInputValue(lead.followUpDate)}
//                             className="absolute left-0 top-0 w-0 h-0 opacity-0"
//                             onChange={(e) => updateFollowUpDateInline(lead._id, e.target.value)}
//                             onBlur={() => setEditingFollowUpId(null)}
//                           />
//                         )}
//                       </div>
//                     </td>

//                     {/* Actions menu */}
//                     <td className={`px-4 py-3 text-right relative sticky right-0 z-10 shadow-[-4px_0_8px_-2px_rgba(0,0,0,0.06)] ${
//                       selectedLeads.includes(lead._id) ? "bg-blue-50" : idx % 2 === 0 ? "bg-white" : "bg-gray-50/80"
//                     }`}>
//                       <button
//                         className="p-2 rounded-lg hover:bg-gray-200 transition-colors"
//                         onClick={(e) => handleMenuToggle(lead._id, e)}
//                       >
//                         <MoreVertical className="w-5 h-5 text-gray-600" />
//                       </button>
//                       {menuOpen === lead._id && (
//                         <div
//                           className="fixed z-50 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-1"
//                           style={{ top: `${menuPosition.top}px`, left: `${menuPosition.left}px` }}
//                         >
//                           <button
//                             onClick={(e) => { e.stopPropagation(); handleEdit(lead._id); }}
//                             className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
//                           >
//                             <Edit className="w-4 h-4 mr-2" /> Edit
//                           </button>
//                           {lead.status !== "Converted" && (
//                             <button
//                               onClick={(e) => { e.stopPropagation(); openConvertModal(lead); }}
//                               className="flex items-center w-full px-3 py-2 text-sm text-green-600 hover:bg-gray-100"
//                             >
//                               <Handshake className="w-4 h-4 mr-2" /> Convert
//                             </button>
//                           )}
//                           <button
//                             onClick={(e) => { e.stopPropagation(); handleDeleteClick(lead._id); }}
//                             className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-gray-100"
//                           >
//                             <Trash2 className="w-4 h-4 mr-2" /> Delete
//                           </button>
//                         </div>
//                       )}
//                     </td>
//                   </tr>
//                 );
//               }) : (
//                 <tr>
//                   <td colSpan={14} className="px-4 py-16 text-center">
//                     <div className="flex flex-col items-center gap-2 text-gray-400">
//                       <Search className="w-10 h-10 opacity-30" />
//                       <p className="text-sm font-medium">No leads found</p>
//                       <p className="text-xs text-gray-300">
//                         {sourceFilter === "Facebook"
//                           ? "No Facebook leads yet. They appear automatically when someone submits your Facebook Lead Ad form."
//                           : "Try adjusting your search or filters"}
//                       </p>
//                     </div>
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//            </table>
//         </div>
//       </div>

//       {/* ── Pagination ── */}
//       {totalPages > 1 && (
//         <div className="flex flex-col sm:flex-row items-center justify-between mt-4 gap-3">
//           <p className="text-sm text-gray-500">
//             Showing <span className="font-semibold text-gray-700">{firstItem}</span>–
//             <span className="font-semibold text-gray-700">{lastItem}</span> of{" "}
//             <span className="font-semibold text-gray-700">{totalLeads}</span>
//           </p>
//           <div className="flex items-center gap-1">
//             <button onClick={() => goToPage(1)} disabled={currentPage === 1}
//               className="px-2 py-1.5 text-sm border rounded-lg hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed">«</button>
//             <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}
//               className="px-3 py-1.5 text-sm border rounded-lg hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed">‹ Prev</button>
//             {pageNumbers().map((p, i) =>
//               p === "..." ? (
//                 <span key={`d${i}`} className="px-2 text-gray-400">…</span>
//               ) : (
//                 <button key={p} onClick={() => goToPage(p)}
//                   className={`min-w-[36px] px-2 py-1.5 text-sm border rounded-lg transition-colors ${
//                     currentPage === p ? "bg-blue-600 text-white border-blue-600 font-semibold" : "hover:bg-gray-100 text-gray-700"
//                   }`}>
//                   {p}
//                 </button>
//               )
//             )}
//             <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}
//               className="px-3 py-1.5 text-sm border rounded-lg hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed">Next ›</button>
//             <button onClick={() => goToPage(totalPages)} disabled={currentPage === totalPages}
//               className="px-2 py-1.5 text-sm border rounded-lg hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed">»</button>
//           </div>
//         </div>
//       )}

//       {/* ── Delete Confirmation Modal ── */}
//       <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle className="flex items-center gap-2 text-red-600">
//               <Trash2 className="w-5 h-5" /> Confirm Delete
//             </DialogTitle>
//           </DialogHeader>
//           <p className="mb-6 text-gray-700">
//             Are you sure you want to delete{" "}
//             {leadToDelete ? "this lead" : `${selectedLeads.length} selected leads`}? This action cannot be undone.
//           </p>
//           <div className="flex justify-end gap-3">
//             <button
//               onClick={() => { setShowDeleteModal(false); setLeadToDelete(null); }}
//               className="px-4 py-2 rounded-lg border hover:bg-gray-100 text-gray-700"
//             >
//               Cancel
//             </button>
//             <button
//               onClick={() => leadToDelete ? handleDeleteLead(leadToDelete) : handleBulkDelete()}
//               className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 flex items-center gap-2"
//             >
//               <Trash2 className="w-4 h-4" /> Delete
//             </button>
//           </div>
//         </DialogContent>
//       </Dialog>

//       {/* ── Convert Lead to Deal Modal ── */}
//       <Dialog open={convertModalOpen} onOpenChange={setConvertModalOpen}>
//         <DialogContent className="!max-w-3xl w-full p-0 overflow-hidden">
//           <div className="px-6 pt-5 pb-3 border-b border-gray-100">
//             <DialogTitle className="flex items-center gap-2 text-green-600 text-lg font-semibold">
//               <Handshake className="w-5 h-5" /> Convert Lead to Deal
//             </DialogTitle>
//           </div>
//           {selectedLead && (
//             <div className="px-6 py-5 space-y-5 max-h-[78vh] overflow-y-auto">

//               {/* Lead info banner */}
//               <div className={`p-3 rounded-lg border ${selectedLead.source === "Facebook" ? "bg-blue-50 border-blue-200" : "bg-blue-50 border-blue-100"}`}>
//                 <div className="flex items-center gap-2 flex-wrap">
//                   <p className="text-sm text-blue-800">
//                     Converting: <strong>{selectedLead.leadName}</strong>
//                     {selectedLead.destination && ` — ${selectedLead.destination}`}
//                   </p>
//                   {selectedLead.source === "Facebook" && (
//                     <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-600 text-white">
//                       <svg viewBox="0 0 24 24" className="w-2.5 h-2.5 fill-white" xmlns="http://www.w3.org/2000/svg">
//                         <path d="M22 12a10 10 0 1 0-11.563 9.874v-6.988H7.898V12h2.539V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.886h-2.33v6.988A10.003 10.003 0 0 0 22 12z"/>
//                       </svg>
//                       Facebook Lead
//                     </span>
//                   )}
//                 </div>
//               </div>

//               {/* Deal Value + Stage */}
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                 <div className="md:col-span-2">
//                   <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Deal Value</label>
//                   <div className="flex gap-2">
//                     <select
//                       value={dealData.currency}
//                       onChange={(e) => setDealData((p) => ({ ...p, currency: e.target.value }))}
//                       className="w-28 px-2 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none bg-white"
//                     >
//                       {allowedCurrencies.map((c) => <option key={c.code} value={c.code}>{c.symbol} {c.code}</option>)}
//                     </select>
//                     <input
//                       type="number"
//                       value={dealData.value}
//                       onChange={(e) => setDealData((p) => ({ ...p, value: e.target.value }))}
//                       placeholder="Enter value"
//                       className="flex-1 min-w-0 px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
//                     />
//                   </div>
//                 </div>
//                 <div>
//                   <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Stage</label>
//                   <select
//                     value={dealData.stage}
//                     onChange={(e) => setDealData((p) => ({ ...p, stage: e.target.value }))}
//                     className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none bg-white"
//                   >
//                     <option value="Qualification">Qualification</option>
//                     <option value="Proposal">Proposal</option>
//                     <option value="Negotiation">Negotiation</option>
//                     <option value="Closed Won">Closed Won</option>
//                     <option value="Closed Lost">Closed Lost</option>
//                   </select>
//                 </div>
//               </div>

//               {/* Cost section headers */}
//               <div className="grid grid-cols-2 gap-4">
//                 <div className="flex items-center gap-2">
//                   <span className="text-xs font-bold text-gray-600 uppercase tracking-wide whitespace-nowrap">Purchasing Cost</span>
//                   <div className="flex-1 h-px bg-gray-200" />
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <span className="text-xs font-bold text-gray-600 uppercase tracking-wide whitespace-nowrap">Selling Cost</span>
//                   <div className="flex-1 h-px bg-gray-200" />
//                 </div>
//               </div>

//               {/* Cost fields */}
//               <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                 <div>
//                   <label className="block text-xs font-medium text-gray-600 mb-1.5">Land Part</label>
//                   <input type="text" placeholder="e.g. 5000" value={dealData.purchasingLandCost}
//                     onChange={(e) => setDealData((p) => ({ ...p, purchasingLandCost: e.target.value }))}
//                     className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none" />
//                 </div>
//                 <div>
//                   <label className="block text-xs font-medium text-gray-600 mb-1.5">Ticket</label>
//                   <input type="text" placeholder="e.g. 2000" value={dealData.purchasingTicketCost}
//                     onChange={(e) => setDealData((p) => ({ ...p, purchasingTicketCost: e.target.value }))}
//                     className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none" />
//                 </div>
//                 <div>
//                   <label className="block text-xs font-medium text-gray-600 mb-1.5">Land Part</label>
//                   <input type="text" placeholder="e.g. 7000" value={dealData.sellingLandCost}
//                     onChange={(e) => setDealData((p) => ({ ...p, sellingLandCost: e.target.value }))}
//                     className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none" />
//                 </div>
//                 <div>
//                   <label className="block text-xs font-medium text-gray-600 mb-1.5">Ticket</label>
//                   <input type="text" placeholder="e.g. 3000" value={dealData.sellingTicketCost}
//                     onChange={(e) => setDealData((p) => ({ ...p, sellingTicketCost: e.target.value }))}
//                     className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none" />
//                 </div>
//               </div>

//               {/* Totals */}
//               <div className="grid grid-cols-2 gap-4">
//                 <div className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 overflow-hidden">
//                   <span className="text-xs font-medium text-gray-500 whitespace-nowrap">Total Purchasing</span>
//                   <span className="text-sm font-bold text-gray-700 ml-2 truncate">{dealData.currency} {fmt(totalPurchasing)}</span>
//                 </div>
//                 <div className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 overflow-hidden">
//                   <span className="text-xs font-medium text-gray-500 whitespace-nowrap">Total Selling</span>
//                   <span className="text-sm font-bold text-gray-700 ml-2 truncate">{dealData.currency} {fmt(totalSelling)}</span>
//                 </div>
//               </div>

//               {/* Profit / Loss banner */}
//               {(totalPurchasing > 0 || totalSelling > 0) && (
//                 <div className={`flex items-center justify-between px-4 py-3 rounded-lg border overflow-hidden ${profit >= 0 ? "bg-emerald-50 border-emerald-200" : "bg-red-50 border-red-200"}`}>
//                   <div className="flex items-center gap-2 flex-shrink-0">
//                     {profit >= 0
//                       ? <TrendingUp size={16} className="text-emerald-600" />
//                       : <TrendingDown size={16} className="text-red-600" />}
//                     <span className={`text-sm font-semibold ${profit >= 0 ? "text-emerald-700" : "text-red-700"}`}>
//                       {profit >= 0 ? "Net Profit" : "Net Loss"}
//                     </span>
//                   </div>
//                   <span className={`text-base font-bold ml-4 truncate ${profit >= 0 ? "text-emerald-700" : "text-red-700"}`}>
//                     {profit >= 0 ? "+" : "-"}{dealData.currency} {fmt(Math.abs(profit))}
//                   </span>
//                 </div>
//               )}

//               {/* Notes */}
//               <div>
//                 <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Notes</label>
//                 <textarea
//                   value={dealData.notes}
//                   rows={4}
//                   placeholder="Add any notes..."
//                   onChange={(e) => setDealData((p) => ({ ...p, notes: e.target.value }))}
//                   className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none resize-y"
//                 />
//               </div>

//               {/* Action buttons */}
//               <div className="flex justify-end gap-3 pt-1 border-t border-gray-100">
//                 <button
//                   onClick={() => setConvertModalOpen(false)}
//                   disabled={converting}
//                   className="px-5 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 text-gray-700 text-sm font-medium"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={handleConvertDeal}
//                   disabled={converting}
//                   className="px-5 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 flex items-center gap-2 text-sm font-medium disabled:opacity-50"
//                 >
//                   <Handshake size={15} />
//                   {converting ? "Converting..." : "Convert to Deal"}
//                 </button>
//               </div>
//             </div>
//           )}
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }

// /* ═══════════════════════════════════════════════════════════════
//    EXPORT WITH TOUR PROVIDER
//    ═══════════════════════════════════════════════════════════════ */
// export default function LeadTable() {
//   return (
//     <TourProvider
//       steps={tourSteps}
//       afterOpen={() => (document.body.style.overflow = "hidden")}
//       beforeClose={() => (document.body.style.overflow = "unset")}
//       styles={{
//         popover:  (base) => ({ ...base, backgroundColor: "#fff", color: "#1f1f1f" }),
//         maskArea: (base) => ({ ...base, rx: 8 }),
//         badge:    (base) => ({ ...base, display: "none" }),
//         close:    (base) => ({ ...base, right: "auto", left: 8, top: 8 }),
//       }}
//     >
//       <LeadTableComponent />
//     </TourProvider>
//   );
// }//all work perfectly and correctly assign all come correctly..




// LeadTable.jsx  (UPDATED — shows Email Leads alongside regular leads with email badge)

import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { TourProvider, useTour } from "@reactour/tour";
import {
  MoreVertical, Trash2, Edit, Handshake, Search, Plus, Eye, Calendar,
  TrendingUp, TrendingDown, Users, Mail,
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
  { selector: ".tour-lead-table",   content: "This is your leads table. Facebook leads show a blue FB badge; Email leads show an envelope badge." },
  { selector: ".tour-checkbox",     content: "Select individual leads or use the header checkbox to select all." },
  { selector: ".tour-lead-actions", content: "Click the three-dot menu to edit, convert, or delete a lead." },
  { selector: ".tour-finish",       content: "You've completed the tour!" },
];

/* ── Avatar helpers ── */
const getInitials = (name) => {
  if (!name || typeof name !== "string") return "?";
  const trimmed = name.trim();
  if (!trimmed) return "?";
  const letters = trimmed.replace(/[^a-zA-Z]/g, "");
  if (letters.length === 0) return trimmed.slice(0, 2).toUpperCase();
  if (letters.length === 1) return letters[0].toUpperCase();
  const words = trimmed.split(/[\s._\-]+/).filter(Boolean);
  if (words.length >= 2) {
    const a = words[0].replace(/[^a-zA-Z]/g, "")[0] || "";
    const b = words[1].replace(/[^a-zA-Z]/g, "")[0] || "";
    return (a + b).toUpperCase();
  }
  return letters.slice(0, 2).toUpperCase();
};

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
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
};

const LeadAvatar = ({ name }) => {
  const initials = getInitials(name);
  const color    = getAvatarColor(name);
  return (
    <div
      className={`h-9 w-9 rounded-full flex-shrink-0 flex items-center justify-center font-semibold text-xs select-none ${color.bg} ${color.text}`}
      style={{ minWidth: "2.25rem", minHeight: "2.25rem" }}
      title={name || ""}
    >
      {initials}
    </div>
  );
};

/* ── Facebook badge ── */
const FacebookBadge = () => (
  <span
    title="Lead from Facebook Ad"
    className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-600 text-white leading-none select-none"
    style={{ letterSpacing: "0.02em" }}
  >
    <svg viewBox="0 0 24 24" className="w-2.5 h-2.5 fill-white flex-shrink-0" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M22 12a10 10 0 1 0-11.563 9.874v-6.988H7.898V12h2.539V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.886h-2.33v6.988A10.003 10.003 0 0 0 22 12z"/>
    </svg>
    FB
  </span>
);

/* ── Email Lead badge (NEW) ── */
const EmailLeadBadge = () => (
  <span
    title="Lead from Email (TripMagics)"
    className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold leading-none select-none"
    style={{
      background: "linear-gradient(135deg, #ea4335 0%, #c5221f 100%)",
      color: "#fff",
      letterSpacing: "0.02em",
    }}
  >
    {/* Gmail-style envelope icon */}
    <svg viewBox="0 0 24 24" className="w-2.5 h-2.5 fill-white flex-shrink-0" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
    </svg>
    EMAIL
  </span>
);

const fmt = (n) => new Intl.NumberFormat("en-IN", { maximumFractionDigits: 2 }).format(n);

const getAssigneeName = (assignTo) => {
  if (!assignTo) return null;
  if (typeof assignTo === "object" && assignTo.firstName)
    return `${assignTo.firstName} ${assignTo.lastName || ""}`.trim();
  return "Assigned User";
};

/* ═══════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════ */
function LeadTableComponent() {
  const navigate      = useNavigate();
  const { setIsOpen } = useTour();

  const [leads,         setLeads]         = useState([]);
  const [selectedLeads, setSelectedLeads] = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [userRole,      setUserRole]      = useState("");

  const [assignees,        setAssignees]        = useState([]);
  const [assigneesLoading, setAssigneesLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages,  setTotalPages]  = useState(1);
  const [totalLeads,  setTotalLeads]  = useState(0);

  const [searchQuery,     setSearchQuery]     = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter,    setStatusFilter]    = useState("");
  const [sourceFilter,    setSourceFilter]    = useState("");
  const [assigneeFilter,  setAssigneeFilter]  = useState("");
  const searchTimer = useRef(null);

  const [menuOpen,     setMenuOpen]     = useState(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });

  const [showDeleteModal,  setShowDeleteModal]  = useState(false);
  const [leadToDelete,     setLeadToDelete]     = useState(null);
  const [convertModalOpen, setConvertModalOpen] = useState(false);
  const [selectedLead,     setSelectedLead]     = useState(null);
  const [converting,       setConverting]       = useState(false);

  const [dealData, setDealData] = useState({
    value: "", currency: "USD", notes: "", stage: "Qualification",
    purchasingLandCost: "", purchasingTicketCost: "",
    sellingLandCost:    "", sellingTicketCost:    "",
    noOfAdults:   "",
    noOfChildren: "",
    travelDate:   "",
  });

  const dateInputRefs                              = useRef({});
  const [editingFollowUpId, setEditingFollowUpId] = useState(null);
  const [followUpSavingId,  setFollowUpSavingId]  = useState(null);

  const allowedCurrencies = [
    { code: "USD", symbol: "$"   }, { code: "EUR", symbol: "€"   },
    { code: "INR", symbol: "₹"   }, { code: "GBP", symbol: "£"   },
    { code: "JPY", symbol: "¥"   }, { code: "AUD", symbol: "A$"  },
    { code: "CAD", symbol: "C$"  }, { code: "CHF", symbol: "CHF" },
    { code: "MYR", symbol: "RM"  }, { code: "AED", symbol: "د.إ" },
    { code: "SGD", symbol: "S$"  }, { code: "ZAR", symbol: "R"   },
    { code: "SAR", symbol: "﷼"   },
  ];

  const parseCost = (v) => {
    const n = parseFloat(String(v || "").replace(/,/g, ""));
    return isNaN(n) ? 0 : n;
  };

  const totalPurchasing = parseCost(dealData.purchasingLandCost) + parseCost(dealData.purchasingTicketCost);
  const totalSelling    = parseCost(dealData.sellingLandCost)    + parseCost(dealData.sellingTicketCost);
  const profit          = totalSelling - totalPurchasing;

  const userIdRef = useRef(null);

  /* ── 1. Read user from localStorage ── */
  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      setUserRole(user.role?.name || "");
      userIdRef.current = user._id || user.id || null;
    } catch {}
  }, []);

  /* ── 2. Fetch ALL assignees once on mount (Admin only) ── */
  useEffect(() => {
    if (!userRole || userRole !== "Admin") return;

    const fetchAllAssignees = async () => {
      try {
        setAssigneesLoading(true);
        const { data } = await axios.get(
          `${API_URL}/leads/getAllLead?page=1&limit=99999`,
          { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
        );
        const isNew    = data && !Array.isArray(data) && Array.isArray(data.leads);
        const leadsArr = isNew ? data.leads : (Array.isArray(data) ? data : []);
        const seen  = new Map();
        const assigneeList = [];
        leadsArr.forEach((lead) => {
          const assignee = lead.assignTo;
          if (assignee && assignee._id && !seen.has(assignee._id)) {
            seen.set(assignee._id, true);
            const name = `${assignee.firstName || ""} ${assignee.lastName || ""}`.trim();
            assigneeList.push({ id: assignee._id, name: name || "Unnamed User" });
          }
        });
        assigneeList.sort((a, b) => a.name.localeCompare(b.name));
        setAssignees(assigneeList);
      } catch (err) {
        console.error("Fetch assignees error:", err);
      } finally {
        setAssigneesLoading(false);
      }
    };
    fetchAllAssignees();
  }, [userRole]);

  /* ── 3. Socket: real-time Facebook leads + Email leads (NEW) ── */
  useEffect(() => {
    const timer = setTimeout(() => {
      const userId = userIdRef.current;
      const socket = initSocket(userId);
      if (!socket) return;

      // Existing: Facebook leads
      const handleNewLead = (newLead) => {
        setLeads((prev) => {
          if (prev.some((l) => l._id === newLead._id)) return prev;
          return [newLead, ...prev];
        });
        setTotalLeads((prev) => prev + 1);
        const assignee = newLead.assignTo;
        if (assignee && assignee._id) {
          setAssignees((prev) => {
            if (prev.some(a => a.id === assignee._id)) return prev;
            const name = `${assignee.firstName || ""} ${assignee.lastName || ""}`.trim();
            const newAssignees = [...prev, { id: assignee._id, name: name || "Unnamed User" }];
            return newAssignees.sort((a, b) => a.name.localeCompare(b.name));
          });
        }
      };

      // NEW: Email leads real-time
      const handleNewEmailLead = (newLead) => {
        // Tag it so the table knows to show the email badge
        const tagged = { ...newLead, _isEmailLead: true, source: "Email Lead" };
        setLeads((prev) => {
          if (prev.some((l) => l._id === tagged._id)) return prev;
          return [tagged, ...prev];
        });
        setTotalLeads((prev) => prev + 1);
        toast.info(`📧 New Email Lead: ${tagged.leadName}`, { autoClose: 5000 });
      };

      socket.on("new_facebook_lead", handleNewLead);
      socket.on("new_email_lead", handleNewEmailLead);          // ← NEW

      return () => {
        socket.off("new_facebook_lead", handleNewLead);
        socket.off("new_email_lead", handleNewEmailLead);       // ← NEW
      };
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  /* ── 4. Search debounce ── */
  useEffect(() => {
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(searchTimer.current);
  }, [searchQuery]);

  /* ── 5. Reset to page 1 when filters change ── */
  useEffect(() => { setCurrentPage(1); }, [statusFilter, sourceFilter, assigneeFilter]);

  /* ── 6. Paginated lead fetch — combines regular leads + email leads (NEW) ── */
  useEffect(() => {
    const fetchLeads = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };

        const params = new URLSearchParams({ page: currentPage, limit: ITEMS_PER_PAGE });
        if (debouncedSearch) params.append("search",   debouncedSearch);
        if (statusFilter)    params.append("status",   statusFilter);
        if (assigneeFilter)  params.append("assignee", assigneeFilter);

        // Decide which API(s) to call based on source filter
        let combinedLeads = [];
        let total = 0;
        let pages = 1;

        if (sourceFilter === "Email Lead") {
          // Only email leads
          const emailParams = new URLSearchParams({ page: currentPage, limit: ITEMS_PER_PAGE });
          if (debouncedSearch) emailParams.append("search", debouncedSearch);
          if (statusFilter)    emailParams.append("status", statusFilter);

          const { data } = await axios.get(
            `${API_URL}/email-leads?${emailParams.toString()}`,
            { headers }
          );
          combinedLeads = (data.leads || []).map(l => ({ ...l, _isEmailLead: true }));
          total = data.totalLeads || 0;
          pages = data.totalPages  || 1;

        } else if (!sourceFilter || sourceFilter === "") {
          // Fetch BOTH regular leads and email leads, merge, then paginate client-side
          // For large datasets consider server-side merge; this is fine for typical CRM size
          const [regularRes, emailRes] = await Promise.allSettled([
            axios.get(`${API_URL}/leads/getAllLead?${params.toString()}`, { headers }),
            axios.get(`${API_URL}/email-leads?page=1&limit=99999${debouncedSearch ? `&search=${debouncedSearch}` : ""}${statusFilter ? `&status=${statusFilter}` : ""}`, { headers }),
          ]);

          // Regular leads
          let regularLeads = [];
          let regularTotal = 0;
          if (regularRes.status === "fulfilled") {
            const d = regularRes.value.data;
            const isNew = d && !Array.isArray(d) && Array.isArray(d.leads);
            regularLeads = isNew ? d.leads : (Array.isArray(d) ? d : []);
            regularTotal = isNew ? d.totalLeads : regularLeads.length;
          }

          // Email leads
          let emailLeads = [];
          if (emailRes.status === "fulfilled") {
            emailLeads = (emailRes.value.data.leads || []).map(l => ({ ...l, _isEmailLead: true, source: "Email Lead" }));
          }

          // Combine and sort by createdAt descending (newest first)
          const all = [...regularLeads, ...emailLeads].sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );

          total = all.length;
          pages = Math.ceil(total / ITEMS_PER_PAGE) || 1;

          // Client-side paginate the merged array
          const skip = (currentPage - 1) * ITEMS_PER_PAGE;
          combinedLeads = all.slice(skip, skip + ITEMS_PER_PAGE);

        } else {
          // Specific source filter (Facebook, Website, etc.) — regular leads only
          const { data } = await axios.get(
            `${API_URL}/leads/getAllLead?${params.toString()}&source=${sourceFilter}`,
            { headers }
          );
          const isNew = data && !Array.isArray(data) && Array.isArray(data.leads);
          combinedLeads = isNew ? data.leads : (Array.isArray(data) ? data : []);
          total = isNew ? data.totalLeads : combinedLeads.length;
          pages = isNew ? data.totalPages  : Math.ceil(total / ITEMS_PER_PAGE);
        }

        setLeads(combinedLeads);
        setTotalLeads(total);
        setTotalPages(pages);

      } catch (err) {
        console.error("Fetch leads error:", err);
        toast.error("Failed to fetch leads");
      } finally {
        setLoading(false);
      }
    };
    fetchLeads();
  }, [currentPage, debouncedSearch, statusFilter, sourceFilter, assigneeFilter]);

  /* ── Pagination helpers ── */
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

  /* ── CRUD handlers ── */

  // Delete: works for both regular and email leads
  const handleDeleteLead = async (id, isEmailLead = false) => {
    try {
      const endpoint = isEmailLead
        ? `${API_URL}/email-leads/${id}`
        : `${API_URL}/leads/deleteLead/${id}`;
      await axios.delete(endpoint, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
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

  const handleBulkDelete = async () => {
    try {
      await Promise.all(selectedLeads.map((id) => {
        const lead = leads.find(l => l._id === id);
        const endpoint = lead?._isEmailLead
          ? `${API_URL}/email-leads/${id}`
          : `${API_URL}/leads/deleteLead/${id}`;
        return axios.delete(endpoint, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
      }));
      setLeads((prev) => prev.filter((l) => !selectedLeads.includes(l._id)));
      setTotalLeads((prev) => prev - selectedLeads.length);
      toast.success(`${selectedLeads.length} leads deleted`);
      setSelectedLeads([]);
      if (leads.length === selectedLeads.length && currentPage > 1) setCurrentPage((p) => p - 1);
    } catch {
      toast.error("Error deleting leads");
    } finally {
      setShowDeleteModal(false);
    }
  };

  const handleSelectLead = (id) =>
    setSelectedLeads((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);

  const handleSelectAll = (e) =>
    setSelectedLeads(e.target.checked ? leads.map((l) => l._id) : []);

  const handleMenuToggle = (leadId, e) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    let top  = rect.bottom + window.scrollY + 4;
    let left = rect.right  + window.scrollX - 160;
    if (rect.bottom + 120 > window.innerHeight) top = rect.top + window.scrollY - 124;
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

  const openConvertModal = (lead) => {
    setSelectedLead(lead);
    setDealData({
      value:    lead.value    || "",
      currency: lead.currency || "USD",
      notes:    lead.notes    || "",
      stage:    "Qualification",
      purchasingLandCost:   "",
      purchasingTicketCost: "",
      sellingLandCost:      "",
      sellingTicketCost:    "",
      noOfAdults:   lead.noOfAdults   != null ? String(lead.noOfAdults)   : "",
      noOfChildren: lead.noOfChildren != null ? String(lead.noOfChildren) : "",
      travelDate:   lead.travelDate
        ? new Date(lead.travelDate).toISOString().split("T")[0]
        : "",
    });
    setConvertModalOpen(true);
    setMenuOpen(null);
  };

  const handleConvertDeal = async () => {
    if (!selectedLead) return;
    try {
      setConverting(true);
      const toastId = toast.loading("Converting lead to deal...");
      const res     = await axios.patch(
        `${API_URL}/leads/${selectedLead._id}/convert`,
        dealData,
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
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

  // Status update: works for both regular and email leads
  const handleStatusChange = async (leadId, newStatus, isEmailLead = false) => {
    try {
      const endpoint = isEmailLead
        ? `${API_URL}/email-leads/${leadId}/status`
        : `${API_URL}/leads/${leadId}/status`;
      await axios.patch(
        endpoint,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      setLeads((prev) => prev.map((l) => l._id === leadId ? { ...l, status: newStatus } : l));
      toast.success("Status updated");
    } catch {
      toast.error("Failed to update status");
    }
  };

  const openFollowUpPicker = (leadId) => {
    setEditingFollowUpId(leadId);
    setTimeout(() => {
      const el = dateInputRefs.current[leadId];
      if (!el) return;
      el.focus(); el.click();
      if (typeof el.showPicker === "function") el.showPicker();
    }, 0);
  };

  // Follow-up update: works for both regular and email leads
  const updateFollowUpDateInline = async (leadId, newDate, isEmailLead = false) => {
    if (!newDate) return;
    try {
      setFollowUpSavingId(leadId);
      const endpoint = isEmailLead
        ? `${API_URL}/email-leads/${leadId}/followup`
        : `${API_URL}/leads/${leadId}/followup`;
      await axios.patch(
        endpoint,
        { followUpDate: newDate },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
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

  /* ── Formatting helpers ── */
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
    `w-full px-3 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-1 ${statusClasses[status] || statusClasses.Junk} ${
      status === "Hot"  ? "focus:ring-red-300"    :
      status === "Warm" ? "focus:ring-yellow-300" :
      status === "Cold" ? "focus:ring-blue-300"   : "focus:ring-gray-300"
    }`;

  const SourceBadge = ({ source }) => {
    if (!source) return <span className="text-gray-400 text-xs">-</span>;
    if (source === "Facebook") {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200 whitespace-nowrap">
          <svg viewBox="0 0 24 24" className="w-2.5 h-2.5 fill-blue-600 flex-shrink-0" xmlns="http://www.w3.org/2000/svg">
            <path d="M22 12a10 10 0 1 0-11.563 9.874v-6.988H7.898V12h2.539V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.886h-2.33v6.988A10.003 10.003 0 0 0 22 12z"/>
          </svg>
          Facebook
        </span>
      );
    }
    if (source === "Email Lead") {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold whitespace-nowrap"
          style={{ background: "#fde8e8", color: "#c5221f", border: "1px solid #fca5a5" }}>
          <svg viewBox="0 0 24 24" className="w-2.5 h-2.5 flex-shrink-0" style={{ fill: "#c5221f" }} xmlns="http://www.w3.org/2000/svg">
            <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
          </svg>
          Email Lead
        </span>
      );
    }
    return <span className="text-sm text-gray-700">{source}</span>;
  };

  /* ── Initial loading spinner ── */
  if (loading && leads.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
      </div>
    );
  }

  const firstItem = totalLeads === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1;
  const lastItem  = Math.min(currentPage * ITEMS_PER_PAGE, totalLeads);

  return (
    <div className="p-6">
      <ToastContainer position="top-right" autoClose={3000} newestOnTop closeOnClick draggable pauseOnHover theme="light" />

      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4 tour-lead-header">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold text-gray-800">Leads</h2>
          {totalLeads > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-xs font-semibold">
              {totalLeads} total
            </span>
          )}
        </div>
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

      {/* ── Filters ── */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4 tour-filters">

        {/* Search */}
        <div className="relative tour-search">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search leads..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Assignee filter (Admin only) */}
        {userRole === "Admin" && (
          <select
            value={assigneeFilter}
            onChange={(e) => setAssigneeFilter(e.target.value)}
            disabled={assigneesLoading}
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white disabled:opacity-60"
          >
            <option value="">
              {assigneesLoading ? "Loading assignees…" : "All Assignees"}
            </option>
            {assignees.map((assignee) => (
              <option key={assignee.id} value={assignee.id}>{assignee.name}</option>
            ))}
          </select>
        )}

        {/* Status filter */}
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

        {/* Source filter — now includes "Email Lead" */}
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
          <option value="Email Lead">📧 Email Lead (TripMagics)</option>
          <option value="Cold Call">Cold Call</option>
          <option value="Facebook">Facebook</option>
          <option value="Other">Other</option>
        </select>
      </div>

      {/* ── Table ── */}
      <div className="tour-lead-table rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto overflow-y-auto max-h-[calc(100vh-280px)]">
          <table className="min-w-max w-full table-auto divide-y divide-gray-200">
            <thead className="sticky top-0 bg-gray-50 z-10">
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
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Adults</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Children</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Travel Date</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Assignee</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Created</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Follow-Up</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tour-lead-actions sticky right-0 bg-gray-50 shadow-[-4px_0_8px_-2px_rgba(0,0,0,0.08)] z-20">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {leads.length > 0 ? leads.map((lead, idx) => {
                const isFacebook  = lead.source === "Facebook";
                const isEmailLead = lead._isEmailLead || lead.source === "Email Lead";

                return (
                  <tr
                    key={lead._id}
                    className={`hover:bg-blue-50/30 transition-colors whitespace-nowrap ${
                      selectedLeads.includes(lead._id) ? "bg-blue-50" : idx % 2 === 0 ? "bg-white" : "bg-gray-50/50"
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

                    {/* Lead name + email + badge */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <LeadAvatar name={lead.leadName} />
                        <div className="flex flex-col min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span
                              onClick={() => navigate(`/leads/view/${lead._id}`)}
                              className="font-medium text-blue-600 text-sm cursor-pointer hover:underline truncate max-w-[140px]"
                              title={lead.leadName || "Unnamed Lead"}
                            >
                              {lead.leadName || "Unnamed Lead"}
                            </span>
                            {/* Facebook badge */}
                            {isFacebook && !isEmailLead && <FacebookBadge />}
                            {/* Email Lead badge (NEW) */}
                            {isEmailLead && <EmailLeadBadge />}
                          </div>
                          <span className="text-gray-400 text-xs truncate max-w-[160px]">{lead.email || "-"}</span>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3 text-sm text-gray-700">{lead.phoneNumber || "-"}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{lead.destination  || "-"}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{lead.country      || "-"}</td>
                    <td className="px-4 py-3"><SourceBadge source={lead.source} /></td>

                    {/* Adults */}
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {lead.noOfAdults != null ? (
                        <span className="inline-flex items-center gap-1">
                          <Users className="w-3.5 h-3.5 text-blue-400" />{lead.noOfAdults}
                        </span>
                      ) : "-"}
                    </td>

                    {/* Children */}
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {lead.noOfChildren != null ? (
                        <span className="inline-flex items-center gap-1">
                          <Users className="w-3.5 h-3.5 text-purple-400" />{lead.noOfChildren}
                        </span>
                      ) : "-"}
                    </td>

                    <td className="px-4 py-3 text-sm text-gray-700">{formatDate(lead.travelDate)}</td>

                    {/* Status */}
                    <td className="px-4 py-3">
                      <select
                        value={lead.status}
                        onChange={(e) => handleStatusChange(lead._id, e.target.value, isEmailLead)}
                        className={getStatusClass(lead.status)}
                      >
                        <option value="Hot">Hot</option>
                        <option value="Warm">Warm</option>
                        <option value="Cold">Cold</option>
                        <option value="Junk">Junk</option>
                      </select>
                    </td>

                    {/* Assignee */}
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {getAssigneeName(lead.assignTo) || (
                        <span className="text-gray-400 italic text-xs">Unassigned</span>
                      )}
                    </td>

                    <td className="px-4 py-3 text-sm text-gray-700">{formatDate(lead.createdAt)}</td>

                    {/* Follow-up inline date picker */}
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
                            onChange={(e) => updateFollowUpDateInline(lead._id, e.target.value, isEmailLead)}
                            onBlur={() => setEditingFollowUpId(null)}
                          />
                        )}
                      </div>
                    </td>

                    {/* Actions menu */}
                    <td className={`px-4 py-3 text-right relative sticky right-0 z-10 shadow-[-4px_0_8px_-2px_rgba(0,0,0,0.06)] ${
                      selectedLeads.includes(lead._id) ? "bg-blue-50" : idx % 2 === 0 ? "bg-white" : "bg-gray-50/80"
                    }`}>
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
                          {/* Email leads don't have an edit page yet — skip edit for them */}
                          {!isEmailLead && (
                            <button
                              onClick={(e) => { e.stopPropagation(); handleEdit(lead._id); }}
                              className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              <Edit className="w-4 h-4 mr-2" /> Edit
                            </button>
                          )}
                          {lead.status !== "Converted" && !isEmailLead && (
                            <button
                              onClick={(e) => { e.stopPropagation(); openConvertModal(lead); }}
                              className="flex items-center w-full px-3 py-2 text-sm text-green-600 hover:bg-gray-100"
                            >
                              <Handshake className="w-4 h-4 mr-2" /> Convert
                            </button>
                          )}
                          {isEmailLead && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                // View raw email body
                                toast.info(
                                  lead.rawEmailSubject
                                    ? `Subject: ${lead.rawEmailSubject}`
                                    : "No email subject",
                                  { autoClose: 6000 }
                                );
                              }}
                              className="flex items-center w-full px-3 py-2 text-sm text-blue-600 hover:bg-gray-100"
                            >
                              <Mail className="w-4 h-4 mr-2" /> View Email
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
                );
              }) : (
                <tr>
                  <td colSpan={14} className="px-4 py-16 text-center">
                    <div className="flex flex-col items-center gap-2 text-gray-400">
                      <Search className="w-10 h-10 opacity-30" />
                      <p className="text-sm font-medium">No leads found</p>
                      <p className="text-xs text-gray-300">
                        {sourceFilter === "Facebook"
                          ? "No Facebook leads yet. They appear automatically when someone submits your Facebook Lead Ad form."
                          : sourceFilter === "Email Lead"
                          ? "No email leads yet. They appear automatically when TripMagics sends a new enquiry to your Gmail."
                          : "Try adjusting your search or filters"}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
           </table>
        </div>
      </div>

      {/* ── Pagination ── */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between mt-4 gap-3">
          <p className="text-sm text-gray-500">
            Showing <span className="font-semibold text-gray-700">{firstItem}</span>–
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
                    currentPage === p ? "bg-blue-600 text-white border-blue-600 font-semibold" : "hover:bg-gray-100 text-gray-700"
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

      {/* ── Delete Confirmation Modal ── */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <Trash2 className="w-5 h-5" /> Confirm Delete
            </DialogTitle>
          </DialogHeader>
          <p className="mb-6 text-gray-700">
            Are you sure you want to delete{" "}
            {leadToDelete ? "this lead" : `${selectedLeads.length} selected leads`}? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => { setShowDeleteModal(false); setLeadToDelete(null); }}
              className="px-4 py-2 rounded-lg border hover:bg-gray-100 text-gray-700"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                if (leadToDelete) {
                  const lead = leads.find(l => l._id === leadToDelete);
                  handleDeleteLead(leadToDelete, lead?._isEmailLead || lead?.source === "Email Lead");
                } else {
                  handleBulkDelete();
                }
              }}
              className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" /> Delete
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Convert Lead to Deal Modal ── */}
      <Dialog open={convertModalOpen} onOpenChange={setConvertModalOpen}>
        <DialogContent className="!max-w-3xl w-full p-0 overflow-hidden">
          <div className="px-6 pt-5 pb-3 border-b border-gray-100">
            <DialogTitle className="flex items-center gap-2 text-green-600 text-lg font-semibold">
              <Handshake className="w-5 h-5" /> Convert Lead to Deal
            </DialogTitle>
          </div>
          {selectedLead && (
            <div className="px-6 py-5 space-y-5 max-h-[78vh] overflow-y-auto">

              {/* Lead info banner */}
              <div className={`p-3 rounded-lg border ${selectedLead.source === "Facebook" ? "bg-blue-50 border-blue-200" : "bg-blue-50 border-blue-100"}`}>
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm text-blue-800">
                    Converting: <strong>{selectedLead.leadName}</strong>
                    {selectedLead.destination && ` — ${selectedLead.destination}`}
                  </p>
                  {selectedLead.source === "Facebook" && (
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-600 text-white">
                      <svg viewBox="0 0 24 24" className="w-2.5 h-2.5 fill-white" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22 12a10 10 0 1 0-11.563 9.874v-6.988H7.898V12h2.539V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.886h-2.33v6.988A10.003 10.003 0 0 0 22 12z"/>
                      </svg>
                      Facebook Lead
                    </span>
                  )}
                </div>
              </div>

              {/* Deal Value + Stage */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Deal Value</label>
                  <div className="flex gap-2">
                    <select
                      value={dealData.currency}
                      onChange={(e) => setDealData((p) => ({ ...p, currency: e.target.value }))}
                      className="w-28 px-2 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none bg-white"
                    >
                      {allowedCurrencies.map((c) => <option key={c.code} value={c.code}>{c.symbol} {c.code}</option>)}
                    </select>
                    <input
                      type="number"
                      value={dealData.value}
                      onChange={(e) => setDealData((p) => ({ ...p, value: e.target.value }))}
                      placeholder="Enter value"
                      className="flex-1 min-w-0 px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Stage</label>
                  <select
                    value={dealData.stage}
                    onChange={(e) => setDealData((p) => ({ ...p, stage: e.target.value }))}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none bg-white"
                  >
                    <option value="Qualification">Qualification</option>
                    <option value="Proposal">Proposal</option>
                    <option value="Negotiation">Negotiation</option>
                    <option value="Closed Won">Closed Won</option>
                    <option value="Closed Lost">Closed Lost</option>
                  </select>
                </div>
              </div>

              {/* Cost section headers */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-gray-600 uppercase tracking-wide whitespace-nowrap">Purchasing Cost</span>
                  <div className="flex-1 h-px bg-gray-200" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-gray-600 uppercase tracking-wide whitespace-nowrap">Selling Cost</span>
                  <div className="flex-1 h-px bg-gray-200" />
                </div>
              </div>

              {/* Cost fields */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Land Part</label>
                  <input type="text" placeholder="e.g. 5000" value={dealData.purchasingLandCost}
                    onChange={(e) => setDealData((p) => ({ ...p, purchasingLandCost: e.target.value }))}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Ticket</label>
                  <input type="text" placeholder="e.g. 2000" value={dealData.purchasingTicketCost}
                    onChange={(e) => setDealData((p) => ({ ...p, purchasingTicketCost: e.target.value }))}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Land Part</label>
                  <input type="text" placeholder="e.g. 7000" value={dealData.sellingLandCost}
                    onChange={(e) => setDealData((p) => ({ ...p, sellingLandCost: e.target.value }))}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Ticket</label>
                  <input type="text" placeholder="e.g. 3000" value={dealData.sellingTicketCost}
                    onChange={(e) => setDealData((p) => ({ ...p, sellingTicketCost: e.target.value }))}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none" />
                </div>
              </div>

              {/* Totals */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 overflow-hidden">
                  <span className="text-xs font-medium text-gray-500 whitespace-nowrap">Total Purchasing</span>
                  <span className="text-sm font-bold text-gray-700 ml-2 truncate">{dealData.currency} {fmt(totalPurchasing)}</span>
                </div>
                <div className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 overflow-hidden">
                  <span className="text-xs font-medium text-gray-500 whitespace-nowrap">Total Selling</span>
                  <span className="text-sm font-bold text-gray-700 ml-2 truncate">{dealData.currency} {fmt(totalSelling)}</span>
                </div>
              </div>

              {/* Profit / Loss banner */}
              {(totalPurchasing > 0 || totalSelling > 0) && (
                <div className={`flex items-center justify-between px-4 py-3 rounded-lg border overflow-hidden ${profit >= 0 ? "bg-emerald-50 border-emerald-200" : "bg-red-50 border-red-200"}`}>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {profit >= 0
                      ? <TrendingUp size={16} className="text-emerald-600" />
                      : <TrendingDown size={16} className="text-red-600" />}
                    <span className={`text-sm font-semibold ${profit >= 0 ? "text-emerald-700" : "text-red-700"}`}>
                      {profit >= 0 ? "Net Profit" : "Net Loss"}
                    </span>
                  </div>
                  <span className={`text-base font-bold ml-4 truncate ${profit >= 0 ? "text-emerald-700" : "text-red-700"}`}>
                    {profit >= 0 ? "+" : "-"}{dealData.currency} {fmt(Math.abs(profit))}
                  </span>
                </div>
              )}

              {/* Notes */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Notes</label>
                <textarea
                  value={dealData.notes}
                  rows={4}
                  placeholder="Add any notes..."
                  onChange={(e) => setDealData((p) => ({ ...p, notes: e.target.value }))}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none resize-y"
                />
              </div>

              {/* Action buttons */}
              <div className="flex justify-end gap-3 pt-1 border-t border-gray-100">
                <button
                  onClick={() => setConvertModalOpen(false)}
                  disabled={converting}
                  className="px-5 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 text-gray-700 text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConvertDeal}
                  disabled={converting}
                  className="px-5 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 flex items-center gap-2 text-sm font-medium disabled:opacity-50"
                >
                  <Handshake size={15} />
                  {converting ? "Converting..." : "Convert to Deal"}
                </button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   EXPORT WITH TOUR PROVIDER
   ═══════════════════════════════════════════════════════════════ */
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
}//email lead old code..