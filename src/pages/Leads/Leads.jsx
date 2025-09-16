// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import axios from "axios";

// import {
//   MoreVertical,
//   Trash2,
//   Edit,
//   Handshake,
//   Search,
//   Plus,
// } from "lucide-react";
// import { initSocket } from "../../utils/socket";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "../../components/ui/dialog";
// import CurrencyInput from "react-currency-input-field";
// import currencyCodes from "currency-codes";

// const API_URL = import.meta.env.VITE_API_URL;

// export default function LeadTable() {
//   const navigate = useNavigate();

//   const [leads, setLeads] = useState([]);
//   const [allLeads, setAllLeads] = useState([]); // Store all leads for filtering
//   const [selectedLeads, setSelectedLeads] = useState([]);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [leadToDelete, setLeadToDelete] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [totalLeads, setTotalLeads] = useState(0);
//   const [menuOpen, setMenuOpen] = useState(null);
//   const [userRole, setUserRole] = useState("");

//   // Filter states
//   const [searchQuery, setSearchQuery] = useState("");
//   const [assigneeFilter, setAssigneeFilter] = useState("");
//   const [statusFilter, setStatusFilter] = useState("");
//   const [sourceFilter, setSourceFilter] = useState("");
//   const [showFilters, setShowFilters] = useState(false);
//   const [assignees, setAssignees] = useState([]);
//   const [converting, setConverting] = useState(false);
//   const itemsPerPage = 10;

//   // Convert Deal Modal state
//   const [convertModalOpen, setConvertModalOpen] = useState(false);
//   const [selectedLead, setSelectedLead] = useState(null);
//   const [dealData, setDealData] = useState({
//     value: 0,
//     currency: "USD",
//     notes: "",
//     stage: "Qualification",
//   });

//   const [attachmentsModalOpen, setAttachmentsModalOpen] = useState(false);
//   const [selectedAttachments, setSelectedAttachments] = useState([]);
//   const [selectedLeadName, setSelectedLeadName] = useState("");
//   const [menuPosition, setMenuPosition] = useState({ top: 0, left: 1 });

//   // Get user role from localStorage

//   useEffect(() => {
//     const userData = localStorage.getItem("user");
//     if (userData) {
//       const user = JSON.parse(userData);
//       setUserRole(user.role?.name || "");
//     }
//   }, []);

//   // Define your 10 allowed currencies
//   const allowedCurrencies = [
//     { code: "USD", symbol: "$", name: "US Dollar" },
//     { code: "EUR", symbol: "€", name: "Euro" },
//     { code: "INR", symbol: "₹", name: "Indian Rupee" },
//     { code: "GBP", symbol: "£", name: "British Pound" },
//     { code: "JPY", symbol: "¥", name: "Japanese Yen" },
//     { code: "AUD", symbol: "A$", name: "Australian Dollar" },
//     { code: "CAD", symbol: "C$", name: "Canadian Dollar" },
//     { code: "CHF", symbol: "CHF", name: "Swiss Franc" },
//     { code: "MYR", symbol: "RM", name: "Malaysian Ringgit" },
//     { code: "AED", symbol: "د.إ", name: "UAE Dirham" },
//     { code: "SGD", symbol: "S$", name: "Singapore Dollar" },
//     { code: "ZAR", symbol: "R", name: "South African Rand" }, // Added Aprffrica
//     { code: "SAR", symbol: "﷼", name: "Saudi Riyal" }, // Added Saudi Arabia
//   ];

//   const openAttachmentsModal = (attachments, leadName) => {
//     setSelectedAttachments(attachments || []);
//     setSelectedLeadName(leadName || "Attachments");
//     setAttachmentsModalOpen(true);
//   };

//   useEffect(() => {
//     initSocket();
//   }, []);

//   // Fetch leads with pagination only
//   useEffect(() => {
//     const fetchLeads = async () => {
//       try {
//         setLoading(true);
//         const token = localStorage.getItem("token");

//         const params = new URLSearchParams();
//         params.append("page", currentPage);
//         params.append("limit", itemsPerPage);

//         const response = await axios.get(
//           `${API_URL}/leads/getAllLead?${params.toString()}`,
//           {
//             headers: { Authorization: `Bearer ${token}` },
//           }
//         );

//         if (response.data) {
//           const leadsData = response.data.leads || response.data;
//           setLeads(leadsData);
//           setAllLeads(leadsData); // Store all leads for client-side filtering
//           setTotalPages(response.data.totalPages || 1);
//           setTotalLeads(response.data.totalLeads || response.data.length || 0);

//           // Extract unique assignees
//           const uniqueAssignees = [
//             ...new Set(
//               leadsData
//                 .filter((lead) => lead.assignTo)
//                 .map((lead) => {
//                   if (
//                     typeof lead.assignTo === "object" &&
//                     lead.assignTo.firstName
//                   ) {
//                     return `${lead.assignTo.firstName} ${lead.assignTo.lastName}`;
//                   }
//                   return "Assigned User";
//                 })
//             ),
//           ];
//           setAssignees(uniqueAssignees);
//         }
//         setLoading(false);
//       } catch (error) {
//         console.error("Error fetching leads:", error);
//         setLoading(false);
//         toast.error("Failed to fetch leads");
//       }
//     };
//     fetchLeads();
//   }, [currentPage]);

//   // Apply filters whenever filter criteria change
//   useEffect(() => {
//     const filtered = allLeads.filter((lead) => {
//       // Search filter
//       const matchesSearch =
//         !searchQuery ||
//         lead.leadName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         lead.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         lead.phoneNumber?.includes(searchQuery) ||
//         lead.companyName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         lead.source?.toLowerCase().includes(searchQuery.toLowerCase());

//       // Assignee filter
//       const matchesAssignee =
//         !assigneeFilter ||
//         (lead.assignTo &&
//           ((typeof lead.assignTo === "object" &&
//             lead.assignTo.firstName &&
//             `${lead.assignTo.firstName} ${lead.assignTo.lastName}` ===
//               assigneeFilter) ||
//             (typeof lead.assignTo === "string" &&
//               assigneeFilter === "Assigned User")));

//       // Status filter
//       const matchesStatus = !statusFilter || lead.status === statusFilter;

//       // Source filter
//       const matchesSource = !sourceFilter || lead.source === sourceFilter;

//       return matchesSearch && matchesAssignee && matchesStatus && matchesSource;
//     });

//     setLeads(filtered);
//     setCurrentPage(1); // Reset to first page when filters change
//   }, [searchQuery, assigneeFilter, statusFilter, sourceFilter, allLeads]);

//   const handleMenuToggle = (leadId, e) => {
//     e.stopPropagation();
//     const rect = e.currentTarget.getBoundingClientRect();
//     const menuHeight = 120; // approx menu height (adjust if needed)
//     const viewportHeight = window.innerHeight;

//     let top = rect.bottom + window.scrollY + 4; // default bottom placement
//     let left = rect.right + window.scrollX - 160;

//     // Check if menu will overflow bottom
//     if (rect.bottom + menuHeight > viewportHeight) {
//       top = rect.top + window.scrollY - menuHeight - 4; // open above
//     }

//     setMenuPosition({ top, left });
//     setMenuOpen(menuOpen === leadId ? null : leadId);
//   };

//   const handleEdit = (leadId) => {
//     navigate(`/createleads?id=${leadId}`);
//     setMenuOpen(null);
//   };

//   const handleDeleteClick = (leadId) => {
//     setLeadToDelete(leadId);
//     setShowDeleteModal(true);
//     setMenuOpen(null);
//   };

//   const handleDealFieldChange = (field, value) => {
//     setDealData((prev) => ({
//       ...prev,
//       [field]: value,
//     }));
//   };

//   const handleDeleteLead = async (id) => {
//     try {
//       const token = localStorage.getItem("token");
//       const response = await axios.delete(`${API_URL}/leads/deleteLead/${id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (response.status === 200) {
//         setLeads(leads.filter((lead) => lead._id !== id));
//         setAllLeads(allLeads.filter((lead) => lead._id !== id));
//         toast.success("Lead deleted successfully");
//         if (leads.length === 1 && currentPage > 1)
//           setCurrentPage(currentPage - 1);
//       } else toast.error("Failed to delete lead");
//     } catch (error) {
//       toast.error("Error deleting lead");
//     } finally {
//       setShowDeleteModal(false);
//       setLeadToDelete(null);
//     }
//   };

//   const handleBulkDelete = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const responses = await Promise.all(
//         selectedLeads.map((id) =>
//           axios.delete(`${API_URL}/leads/deleteLead/${id}`, {
//             headers: { Authorization: `Bearer ${token}` },
//           })
//         )
//       );
//       const allSuccess = responses.every((res) => res.status === 200);
//       if (allSuccess) {
//         setLeads(leads.filter((lead) => !selectedLeads.includes(lead._id)));
//         setAllLeads(
//           allLeads.filter((lead) => !selectedLeads.includes(lead._id))
//         );
//         setSelectedLeads([]);
//         toast.success(`${selectedLeads.length} leads deleted successfully`);
//         if (leads.length === selectedLeads.length && currentPage > 1)
//           setCurrentPage(currentPage - 1);
//       } else toast.error("Failed to delete some leads");
//     } catch (error) {
//       toast.error("Error deleting leads");
//     } finally {
//       setShowDeleteModal(false);
//     }
//   };

//   const handleSelectLead = (id) => {
//     setSelectedLeads((prev) =>
//       prev.includes(id) ? prev.filter((leadId) => leadId !== id) : [...prev, id]
//     );
//   };

//   const handleSelectAll = (e) => {
//     if (e.target.checked) setSelectedLeads(leads.map((lead) => lead._id));
//     else setSelectedLeads([]);
//   };

//   // Convert Deal Modal handlers
//   const openConvertModal = (lead) => {
//     setSelectedLead(lead);
//     setDealData({
//       value: lead.value || 0,
//       currency: lead.currency || "USD", // <-- set default currency here
//       notes: lead.notes || "",
//       stage: "Qualification",
//     });
//     setConvertModalOpen(true);
//     setMenuOpen(null);
//   };

//   const handleDealChange = (e) => {
//     const { name, value } = e.target;
//     setDealData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleConvertDeal = async () => {
//     if (!selectedLead) return;
//     try {
//       setConverting(true);
//       const token = localStorage.getItem("token");
//       const payload = { ...dealData };

//       // Show loading toast
//       const toastId = toast.loading("Converting lead to deal...");

//       const response = await axios.patch(
//         `${API_URL}/leads/${selectedLead._id}/convert`,
//         payload,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );

//       // Update toast to success
//       toast.update(toastId, {
//         render: response.data.message || "Lead converted to deal successfully",
//         type: "success",
//         isLoading: false,
//         autoClose: 3000,
//         closeButton: true,
//       });

//       // Remove converted lead from UI
//       setLeads(leads.filter((l) => l._id !== selectedLead._id));
//       setAllLeads(allLeads.filter((l) => l._id !== selectedLead._id));

//       // Close modal
//       setConvertModalOpen(false);
//       setSelectedLead(null);
//     } catch (err) {
//       toast.dismiss();
//       toast.error(
//         err.response?.data?.message || "Conversion failed. Please try again."
//       );
//       console.error("Conversion error:", err);
//     } finally {
//       setConverting(false);
//     }
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return "-";
//     const date = new Date(dateString);
//     return date.toLocaleDateString("en-US", {
//       month: "short",
//       day: "numeric",
//       year: "numeric",
//     });
//   };

//   const formatDateTime = (dateString) => {
//     if (!dateString) return "No follow-up";
//     const date = new Date(dateString);
//     return date.toLocaleString("en-US", {
//       month: "short",
//       day: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//     });
//   };

//   const getStatusBadge = (status) => {
//     const classes = {
//       Hot: "bg-red-100 text-red-800",
//       Warm: "bg-yellow-100 text-yellow-800",
//       Cold: "bg-blue-100 text-blue-800",
//       Junk: "bg-gray-100 text-gray-800",
//       Converted: "bg-green-100 text-green-800",
//     };
//     return (
//       <span
//         className={`px-2 py-1 rounded-full text-xs font-medium ${
//           classes[status] || "bg-gray-100 text-gray-800"
//         }`}
//       >
//         {status}
//       </span>
//     );
//   };

//   const handlePageChange = (newPage) => {
//     if (newPage > 0 && newPage <= totalPages) setCurrentPage(newPage);
//   };

//   const clearFilters = () => {
//     setSearchQuery("");
//     setAssigneeFilter("");
//     setStatusFilter("");
//     setSourceFilter("");
//   };

//   useEffect(() => {
//     const handleClickOutside = () => setMenuOpen(null);
//     document.addEventListener("click", handleClickOutside);
//     return () => document.removeEventListener("click", handleClickOutside);
//   }, []);

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="p-6">
//       {/* Toast Container - This is required for toast notifications to work */}
//       <ToastContainer
//         position="top-right"
//         autoClose={3000}
//         hideProgressBar={false}
//         newestOnTop
//         closeOnClick
//         rtl={false}
//         pauseOnFocusLoss
//         draggable
//         pauseOnHover
//         theme="light"
//       />

//       {/* Header */}
//       <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
//         <div>
//           <h2 className="text-2xl font-bold text-gray-800">Leads</h2>
//         </div>

//         <div className="flex flex-wrap gap-3 items-center">
//           {selectedLeads.length > 0 && (
//             <button
//               onClick={() => {
//                 setLeadToDelete(null);
//                 setShowDeleteModal(true);
//               }}
//               className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow flex items-center gap-2"
//             >
//               <Trash2 className="w-4 h-4" />
//               Delete Selected ({selectedLeads.length})
//             </button>
//           )}
//           {/* Only show create button for admin and sales users */}
//           {(userRole === "Admin" || userRole === "Sales") && (
//             <button
//               className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow flex items-center gap-2"
//               onClick={() => navigate("/createleads")}
//             >
//               <Plus className="w-4 h-4" /> Create Lead
//             </button>
//           )}
//         </div>
//       </div>

//       {/* Search and Filters */}
//       <div className="mb-6 ">
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
//           {/* Assignee - Only show for admin */}
//           {userRole === "Admin" && (
//             <div>
//               <select
//                 value={assigneeFilter}
//                 onChange={(e) => setAssigneeFilter(e.target.value)}
//                 className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
//               >
//                 <option value="">All Assignees</option>
//                 {assignees.map((assignee, index) => (
//                   <option key={index} value={assignee}>
//                     {assignee}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           )}

//           {/* Status */}
//           <div>
//             <select
//               value={statusFilter}
//               onChange={(e) => setStatusFilter(e.target.value)}
//               className="w-full p-2 border  rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
//             >
//               <option value="">All Statuses</option>
//               <option value="Hot">Hot</option>
//               <option value="Warm">Warm</option>
//               <option value="Cold">Cold</option>
//               <option value="Junk">Junk</option>
//               <option value="Converted">Converted</option>
//             </select>
//           </div>

//           {/* Search */}
//           <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg ml-64">
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//             <input
//               type="text"
//               placeholder="Search leads..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="w-full pl-8 pr-4 py-2 border rounded-full bg-white  focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>
//         </div>
//       </div>

//       {/* Table */}
//       <div className="overflow-x-auto">
//         <table className="min-w-max w-full table-auto divide-y divide-gray-200">
//           <thead className="bg-gray-50">
//             <tr className="whitespace-nowrap">
//               <th className="px-4 py-3">
//                 <input
//                   type="checkbox"
//                   className="h-4 w-4 text-blue-600 border-gray-300 rounded"
//                   checked={
//                     selectedLeads.length === leads.length && leads.length > 0
//                   }
//                   onChange={handleSelectAll}
//                 />
//               </th>
//               <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
//                 Lead
//               </th>
//               <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
//                 Contact
//               </th>
//               <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
//                 Company
//               </th>
//               <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
//                 Country
//               </th>
//               <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
//                 Source
//               </th>
//               <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
//                 Status
//               </th>
//               {/* Only show Assignee column for admin */}
//               {userRole === "Admin" && (
//                 <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
//                   Assignee
//                 </th>
//               )}
//               <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
//                 Created
//               </th>
//               <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
//                 Follow-Up
//               </th>

//               <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">
//                 Actions
//               </th>
//             </tr>
//           </thead>

//           <tbody className="divide-y divide-gray-200">
//             {leads.length > 0 ? (
//               leads.map((lead, idx) => (
//                 <tr
//                   key={lead._id}
//                   className={`hover:bg-gray-50 ${
//                     idx % 2 === 0 ? "bg-white" : "bg-gray-50"
//                   } whitespace-nowrap`}
//                 >
//                   <td className="px-4 py-3">
//                     <input
//                       type="checkbox"
//                       className="h-4 w-4 text-blue-600 border-gray-300 rounded"
//                       checked={selectedLeads.includes(lead._id)}
//                       onChange={() => handleSelectLead(lead._id)}
//                     />
//                   </td>

//                   <td className="px-4 py-3 flex items-center gap-2">
//                     <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
//                       {lead.leadName?.charAt(0) || "L"}
//                     </div>
//                     <div className="flex flex-col">
//                       <span
//                         onClick={() => navigate(`/leads/view/${lead._id}`)}
//                         className="font-medium text-blue-600 text-sm cursor-pointer hover:underline"
//                       >
//                         {lead.leadName || "Unnamed Lead"}
//                       </span>

//                       <span className="text-gray-400 text-xs">
//                         {lead.email || "-"}
//                       </span>
//                     </div>
//                   </td>

//                   <td className="px-4 py-3 text-sm text-gray-700">
//                     {lead.phoneNumber || "-"}
//                   </td>
//                   <td className="px-4 py-3 text-sm text-gray-700">
//                     {lead.companyName || "-"}
//                   </td>
//                   <td className="px-4 py-3 text-sm text-gray-700">
//                     {lead.country || "-"}
//                   </td>
//                   <td className="px-4 py-3 text-sm text-gray-700">
//                     {lead.source || "-"}
//                   </td>
//                   <td className="px-4 py-3">{getStatusBadge(lead.status)}</td>

//                   {/* Only show Assignee column for admin */}
//                   {userRole === "Admin" && (
//                     <td className="px-4 py-3 text-sm text-gray-700">
//                       {lead.assignTo
//                         ? typeof lead.assignTo === "object"
//                           ? `${lead.assignTo.firstName} ${lead.assignTo.lastName}`
//                           : "Assigned User"
//                         : "-"}
//                     </td>
//                   )}

//                   <td className="px-4 py-3 text-sm text-gray-700">
//                     {formatDate(lead.createdAt)}
//                   </td>
//                   <td className="px-4 py-3 text-sm text-gray-700">
//                     {formatDate(lead.followUpDate)}
//                   </td>

//                   <td className="px-4 py-3 text-right relative">
//                     <div className="relative inline-block text-left">
//                       {/* Trigger Button */}
//                       <button
//                         className="p-2 rounded-lg hover:bg-gray-200 transition-colors"
//                         onClick={(e) => handleMenuToggle(lead._id, e)}
//                       >
//                         <MoreVertical className="w-5 h-5 text-gray-600" />
//                       </button>
//                     </div>

//                     {/* Dropdown Menu outside table (using fixed) */}
//                     {menuOpen === lead._id && (
//                       <div
//                         className="fixed z-50 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-1"
//                         style={{
//                           top: `${menuPosition.top}px`,
//                           left: `${menuPosition.left}px`,
//                         }}
//                       >
//                         <button
//                           onClick={(e) => {
//                             e.stopPropagation();
//                             handleEdit(lead._id);
//                           }}
//                           className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
//                         >
//                           <Edit className="w-4 h-4 mr-2" /> Edit
//                         </button>

//                         {lead.status !== "Converted" && (
//                           <button
//                             onClick={(e) => {
//                               e.stopPropagation();
//                               openConvertModal(lead);
//                             }}
//                             className="flex items-center w-full px-3 py-2 text-sm text-green-600 hover:bg-gray-100"
//                           >
//                             <Handshake className="w-4 h-4 mr-2" /> Convert
//                           </button>
//                         )}

//                         <button
//                           onClick={(e) => {
//                             e.stopPropagation();
//                             handleDeleteClick(lead._id);
//                           }}
//                           className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-gray-100"
//                         >
//                           <Trash2 className="w-4 h-4 mr-2" /> Delete
//                         </button>
//                       </div>
//                     )}
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td
//                   colSpan={userRole === "Admin" ? "12" : "11"}
//                   className="px-4 py-12 text-center text-gray-500 text-sm"
//                 >
//                   No leads found.
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* Pagination */}
//       {totalPages > 1 && (
//         <div className="flex flex-col sm:flex-row items-center justify-between mt-6 px-4 py-3 bg-white border-t border-gray-200 rounded-b-xl">
//           <div className="mb-4 sm:mb-0">
//             <p className="text-sm text-gray-700">
//               Showing{" "}
//               <span className="font-medium">
//                 {(currentPage - 1) * itemsPerPage + 1}
//               </span>{" "}
//               to{" "}
//               <span className="font-medium">
//                 {Math.min(currentPage * itemsPerPage, totalLeads)}
//               </span>{" "}
//               of <span className="font-medium">{totalLeads}</span> results
//             </p>
//           </div>
//           <div className="flex gap-2">
//             <button
//               onClick={() => handlePageChange(currentPage - 1)}
//               disabled={currentPage === 1}
//               className="px-4 py-2 border rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
//             >
//               Previous
//             </button>
//             <div className="flex items-center">
//               <span className="px-2 py-2 text-gray-600">Page</span>
//               <span className="px-2 py-1 border rounded bg-gray-50 font-medium">
//                 {currentPage}
//               </span>
//               <span className="px-2 py-2 text-gray-600">of {totalPages}</span>
//             </div>
//             <button
//               onClick={() => handlePageChange(currentPage + 1)}
//               disabled={currentPage === totalPages}
//               className="px-4 py-2 border rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
//             >
//               Next
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Delete Modal */}
//       <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle className="flex items-center gap-2 text-red-600">
//               <Trash2 className="w-5 h-5" />
//               Confirm Delete
//             </DialogTitle>
//           </DialogHeader>
//           <p className="mb-6 text-gray-700">
//             Are you sure you want to delete{" "}
//             {leadToDelete
//               ? "this lead"
//               : `${selectedLeads.length} selected leads`}
//             ? This action cannot be undone.
//           </p>
//           <div className="flex justify-end gap-3">
//             <button
//               onClick={() => {
//                 setShowDeleteModal(false);
//                 setLeadToDelete(null);
//               }}
//               className="px-4 py-2 rounded-lg border hover:bg-gray-100 text-gray-700"
//             >
//               Cancel
//             </button>
//             <button
//               onClick={() =>
//                 leadToDelete
//                   ? handleDeleteLead(leadToDelete)
//                   : handleBulkDelete()
//               }
//               className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 flex items-center gap-2"
//             >
//               <Trash2 className="w-4 h-4" />
//               Delete
//             </button>
//           </div>
//         </DialogContent>
//       </Dialog>

//       {/* Convert Lead to Deal Modal */}
//       <Dialog open={convertModalOpen} onOpenChange={setConvertModalOpen}>
//         <DialogContent className="max-w-md">
//           <DialogHeader>
//             <DialogTitle className="flex items-center gap-2 text-green-600">
//               <Handshake className="w-5 h-5" />
//               Convert Lead to Deal
//             </DialogTitle>
//           </DialogHeader>

//           {selectedLead && (
//             <>
//               <div className="mb-4 p-3 bg-blue-50 rounded-lg">
//                 <p className="text-sm text-blue-800">
//                   Converting: <strong>{selectedLead.leadName}</strong>
//                   {selectedLead.companyName &&
//                     ` from ${selectedLead.companyName}`}
//                 </p>
//               </div>

//               {/* Deal Value + Currency */}
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Deal Value
//                 </label>
//                 <div className="flex gap-2">
//                   <input
//                     type="number"
//                     value={dealData.value}
//                     onChange={(e) =>
//                       handleDealFieldChange("value", e.target.value)
//                     }
//                     placeholder="Enter value"
//                     className="flex-1 px-3 py-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:outline-none"
//                   />
//                   <select
//                     value={dealData.currency}
//                     onChange={(e) =>
//                       handleDealFieldChange("currency", e.target.value)
//                     }
//                     className="px-3 py-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:outline-none"
//                   >
//                     {allowedCurrencies.map((c) => (
//                       <option key={c.code} value={c.code}>
//                         {c.symbol} {c.code}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//               </div>

//               {/* Stage */}
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Stage
//                 </label>
//                 <select
//                   name="stage"
//                   value={dealData.stage}
//                   onChange={(e) =>
//                     handleDealFieldChange("stage", e.target.value)
//                   }
//                   className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:outline-none"
//                 >
//                   <option value="Qualification">Qualification</option>
//                   <option value="Proposal">Proposal</option>
//                   <option value="Negotiation">Negotiation</option>
//                   <option value="Closed Won">Closed Won</option>
//                   <option value="Closed Lost">Closed Lost</option>
//                 </select>
//               </div>

//               {/* Notes */}
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Notes
//                 </label>
//                 <textarea
//                   name="notes"
//                   value={dealData.notes}
//                   onChange={(e) =>
//                     handleDealFieldChange("notes", e.target.value)
//                   }
//                   rows={3}
//                   className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:outline-none"
//                   placeholder="Add any notes..."
//                 />
//               </div>

//               {/* Actions */}
//               <div className="flex justify-end gap-3">
//                 <button
//                   onClick={() => setConvertModalOpen(false)}
//                   className="px-4 py-2 rounded-lg border hover:bg-gray-100 text-gray-700"
//                   disabled={converting}
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={handleConvertDeal}
//                   className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 flex items-center gap-2 disabled:opacity-50"
//                   disabled={converting}
//                 >
//                   {converting ? "Converting..." : "Convert"}
//                 </button>
//               </div>
//             </>
//           )}
//         </DialogContent>
//       </Dialog>

//     </div>
//   );
// }//original normal code..

import React, { useState, useEffect } from "react";
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
  Filter,
  X,
  ChevronDown,
  ChevronUp,
  Plus,
} from "lucide-react";
import { initSocket } from "../../utils/socket";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { Eye } from "lucide-react";
const API_URL = import.meta.env.VITE_API_URL;
const API_SI = import.meta.env.VITE_SI_URI;

// Tour steps configuration
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
  // {
  //   selector: ".tour-bulk-actions",
  //   content: "When you select leads, bulk action buttons appear here allowing you to delete multiple leads at once.",
  // },
  {
    selector: ".tour-lead-actions",
    content:
      "Click the three-dot menu to edit, convert, or delete a lead. Converting a lead turns it into a deal.",
  },
  // {
  //   selector: ".tour-pagination",
  //   content: "Navigate through multiple pages of leads using these pagination controls.",
  // },
  {
    selector: ".tour-finish",
    content:
      "You've completed the tour! Click here anytime to review the features again.",
  },
];

function LeadTableComponent() {
  const navigate = useNavigate();
  const { setIsOpen, setSteps, setCurrentStep } = useTour();

  const [leads, setLeads] = useState([]);
  const [allLeads, setAllLeads] = useState([]); // Store all leads for filtering
  const [selectedLeads, setSelectedLeads] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [leadToDelete, setLeadToDelete] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalLeads, setTotalLeads] = useState(0);
  const [menuOpen, setMenuOpen] = useState(null);
  const [userRole, setUserRole] = useState("");

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [assigneeFilter, setAssigneeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sourceFilter, setSourceFilter] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [assignees, setAssignees] = useState([]);
  const [converting, setConverting] = useState(false);
  const itemsPerPage = 10;

  // Convert Deal Modal state
  const [convertModalOpen, setConvertModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [dealData, setDealData] = useState({
    value: 0,
    notes: "",
    stage: "Qualification", // ✓ default stage
  });

  const [attachmentsModalOpen, setAttachmentsModalOpen] = useState(false);
  const [selectedAttachments, setSelectedAttachments] = useState([]);
  const [selectedLeadName, setSelectedLeadName] = useState("");
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 1 });

  // Get user role from localStorage
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData);
      setUserRole(user.role?.name || "");

      // Check if user has taken the tour before
      const hasTakenTour = localStorage.getItem("leadTourCompleted");
      if (!hasTakenTour && user.role?.name === "Sales") {
        // Set up and start the tour
        setSteps(tourSteps);
        setTimeout(() => setIsOpen(true), 1000);
      }
    }
  }, [setIsOpen, setSteps]);

  const startTour = () => {
    setSteps(tourSteps);
    setCurrentStep(0);
    setIsOpen(true);
    // Mark tour as completed for this session
    localStorage.setItem("leadTourCompleted", "true");
  };

  const finishTour = () => {
    setIsOpen(false);
    // Mark tour as completed
    localStorage.setItem("leadTourCompleted", "true");
    toast.success(
      "Tour completed! You can always restart it using the 'Take Tour' button."
    );
  };

  const openAttachmentsModal = (attachments, leadName) => {
    setSelectedAttachments(attachments || []);
    setSelectedLeadName(leadName || "Attachments");
    setAttachmentsModalOpen(true);
  };

  useEffect(() => {
    initSocket();
  }, []);

  // Fetch leads with pagination only
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
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.data) {
          const leadsData = response.data.leads || response.data;
          setLeads(leadsData);
          setAllLeads(leadsData); // Store all leads for client-side filtering
          setTotalPages(response.data.totalPages || 1);
          setTotalLeads(response.data.totalLeads || response.data.length || 0);

          // Extract unique assignees
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
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching leads:", error);
        setLoading(false);
        toast.error("Failed to fetch leads");
      }
    };
    fetchLeads();
  }, [currentPage]);

  // Apply filters whenever filter criteria change
  useEffect(() => {
    const filtered = allLeads.filter((lead) => {
      // Search filter
      const matchesSearch =
        !searchQuery ||
        lead.leadName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.phoneNumber?.includes(searchQuery) ||
        lead.companyName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.source?.toLowerCase().includes(searchQuery.toLowerCase());

      // Assignee filter
      const matchesAssignee =
        !assigneeFilter ||
        (lead.assignTo &&
          ((typeof lead.assignTo === "object" &&
            lead.assignTo.firstName &&
            `${lead.assignTo.firstName} ${lead.assignTo.lastName}` ===
              assigneeFilter) ||
            (typeof lead.assignTo === "string" &&
              assigneeFilter === "Assigned User")));

      // Status filter
      const matchesStatus = !statusFilter || lead.status === statusFilter;

      // Source filter
      const matchesSource = !sourceFilter || lead.source === sourceFilter;

      return matchesSearch && matchesAssignee && matchesStatus && matchesSource;
    });

    setLeads(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchQuery, assigneeFilter, statusFilter, sourceFilter, allLeads]);

  const handleMenuToggle = (leadId, e) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    const menuHeight = 120; // approx menu height (adjust if needed)
    const viewportHeight = window.innerHeight;

    let top = rect.bottom + window.scrollY + 4; // default bottom placement
    let left = rect.right + window.scrollX - 160;

    // Check if menu will overflow bottom
    if (rect.bottom + menuHeight > viewportHeight) {
      top = rect.top + window.scrollY - menuHeight - 4; // open above
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
        setLeads(leads.filter((lead) => lead._id !== id));
        setAllLeads(allLeads.filter((lead) => lead._id !== id));
        toast.success("Lead deleted successfully");
        if (leads.length === 1 && currentPage > 1)
          setCurrentPage(currentPage - 1);
      } else toast.error("Failed to delete lead");
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
        setLeads(leads.filter((lead) => !selectedLeads.includes(lead._id)));
        setAllLeads(
          allLeads.filter((lead) => !selectedLeads.includes(lead._id))
        );
        setSelectedLeads([]);
        toast.success(`${selectedLeads.length} leads deleted successfully`);
        if (leads.length === selectedLeads.length && currentPage > 1)
          setCurrentPage(currentPage - 1);
      } else toast.error("Failed to delete some leads");
    } catch (error) {
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
    if (e.target.checked) setSelectedLeads(leads.map((lead) => lead._id));
    else setSelectedLeads([]);
  };

  // Convert Deal Modal handlers
  const openConvertModal = (lead) => {
    setSelectedLead(lead);
    setDealData({
      value: lead.value || 0,
      notes: lead.notes || "",
      stage: "Qualification",
    });
    setConvertModalOpen(true);
    setMenuOpen(null);
  };

  const handleDealChange = (e) => {
    const { name, value } = e.target;
    setDealData((prev) => ({ ...prev, [name]: value }));
  };

  const handleConvertDeal = async () => {
    if (!selectedLead) return;
    try {
      setConverting(true);
      const token = localStorage.getItem("token");
      const payload = { ...dealData };

      // Show loading toast
      const toastId = toast.loading("Converting lead to deal...");

      const response = await axios.patch(
        `${API_URL}/leads/${selectedLead._id}/convert`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Update toast to success
      toast.update(toastId, {
        render: response.data.message || "Lead converted to deal successfully",
        type: "success",
        isLoading: false,
        autoClose: 3000,
        closeButton: true,
      });

      // Remove converted lead from UI
      setLeads(leads.filter((l) => l._id !== selectedLead._id));
      setAllLeads(allLeads.filter((l) => l._id !== selectedLead._id));

      // Close modal
      setConvertModalOpen(false);
      setSelectedLead(null);
    } catch (err) {
      toast.dismiss();
      toast.error(
        err.response?.data?.message || "Conversion failed. Please try again."
      );
      console.error("Conversion error:", err);
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

  const formatDateTime = (dateString) => {
    if (!dateString) return "No follow-up";
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
      Junk: "bg-gray-100 text-gray-800",
      Converted: "bg-green-100 text-green-800",
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

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) setCurrentPage(newPage);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setAssigneeFilter("");
    setStatusFilter("");
    setSourceFilter("");
  };

  useEffect(() => {
    const handleClickOutside = () => setMenuOpen(null);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Toast Container - This is required for toast notifications to work */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4 tour-lead-header">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Leads</h2>
          <p className="text-sm text-gray-500 mt-1">
            Manage and track your potential customers through the sales pipeline
          </p>
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
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow flex items-center gap-2 tour-bulk-actions"
            >
              <Trash2 className="w-4 h-4" />
              Delete Selected ({selectedLeads.length})
            </button>
          )}
          {/* Only show create button for admin and sales users */}
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

      {/* Search and Filters */}
      <div className="mb-6 tour-filters">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Assignee - Only show for admin */}
          {userRole === "Admin" && (
            <div>
              <select
                value={assigneeFilter}
                onChange={(e) => setAssigneeFilter(e.target.value)}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="">All Assignees</option>
                {assignees.map((assignee, index) => (
                  <option key={index} value={assignee}>
                    {assignee}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Status */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full p-2 border  rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="">All Statuses</option>
              <option value="Hot">Hot</option>
              <option value="Warm">Warm</option>
              <option value="Cold">Cold</option>
              <option value="Junk">Junk</option>
              <option value="Converted">Converted</option>
            </select>
          </div>

          {/* Search */}
          <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg ml-64 tour-search">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search leads..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-4 py-2 border rounded-full bg-white  focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
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
              {/* Only show Assignee column for admin */}
              {userRole === "Admin" && (
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Assignee
                </th>
              )}
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
                  <td className="px-4 py-3 tour-checkbox">
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
                  <td className="px-4 py-3">{getStatusBadge(lead.status)}</td>

                  {/* Only show Assignee column for admin */}
                  {userRole === "Admin" && (
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {lead.assignTo
                        ? typeof lead.assignTo === "object"
                          ? `${lead.assignTo.firstName} ${lead.assignTo.lastName}`
                          : "Assigned User"
                        : "-"}
                    </td>
                  )}

                  <td className="px-4 py-3 text-sm text-gray-700">
                    {formatDate(lead.createdAt)}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {formatDate(lead.followUpDate)}
                  </td>

                  <td className="px-4 py-3 text-right relative">
                    <div className="relative inline-block text-left">
                      {/* Trigger Button */}
                      <button
                        className="p-2 rounded-lg hover:bg-gray-200 transition-colors"
                        onClick={(e) => handleMenuToggle(lead._id, e)}
                      >
                        <MoreVertical className="w-5 h-5 text-gray-600" />
                      </button>
                    </div>

                    {/* Dropdown Menu outside table (using fixed) */}
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
                  colSpan={userRole === "Admin" ? "12" : "11"}
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
        <div className="flex flex-col sm:flex-row items-center justify-between mt-6 px-4 py-3 bg-white border-t border-gray-200 rounded-b-xl tour-pagination">
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

      {/* Convert Deal Modal */}
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
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-gray-500">
                    $
                  </span>
                  <input
                    type="number"
                    name="value"
                    value={dealData.value}
                    onChange={handleDealChange}
                    className="w-full pl-7 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Stage
                </label>
                <select
                  name="stage"
                  value={dealData.stage || "Qualification"}
                  onChange={handleDealChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  onChange={handleDealChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Add any additional details about this deal..."
                />
              </div>

              <div className="flex justify-end gap-3">
                {/* Cancel Button */}
                <button
                  onClick={() => {
                    setConvertModalOpen(false);
                    setSelectedLead(null);
                  }}
                  className="px-4 py-2 rounded-lg border text-gray-700 hover:bg-gray-100"
                  disabled={converting} // disable while converting
                >
                  Cancel
                </button>

                {/* Convert Button */}
                <button
                  onClick={handleConvertDeal}
                  disabled={converting}
                  className={`flex items-center px-4 py-2 rounded-lg text-white transition ${
                    converting
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700"
                  }`}
                >
                  {converting ? (
                    <div className="flex items-center gap-2">
                      <svg
                        className="animate-spin h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z"
                        ></path>
                      </svg>
                      <span>Converting...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Handshake className="w-4 h-4" />
                      <span>Convert</span>
                    </div>
                  )}
                </button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Wrap the component with TourProvider
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
     badge: (base) => ({ 
  ...base, 
  display: "none" // This hides the step number badge
}),
        close: (base) => ({
          ...base,
          right: "auto",
          left: 8,
          top: 8,
        }),
      }}
    >
      <LeadTableComponent />
    </TourProvider>
  );
}
