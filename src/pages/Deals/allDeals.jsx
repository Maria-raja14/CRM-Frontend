// import { useEffect, useState } from "react";
// import axios from "axios";
// import { toast } from "react-toastify";
// import { Edit, Trash2, Eye, Plus, TrendingUp, TrendingDown, Users, Calendar } from "lucide-react";
// import {
//   Dialog, DialogContent, DialogHeader, DialogTitle,
// } from "../../components/ui/dialog";
// import { useNavigate } from "react-router-dom";
// import { TourProvider, useTour } from "@reactour/tour";

// const API_URL = import.meta.env.VITE_API_URL;

// const dealTourSteps = [
//   { selector: ".tour-deals-header",  content: "Welcome to the Deals Management page! Here you can view, edit, and manage all your deals." },
//   { selector: ".tour-create-deal",   content: "Click here to create a new deal and add important details like value, stage, and assigned user." },
//   { selector: ".tour-filters",       content: "Use these filters to narrow down deals by stage, assigned user, or name." },
//   { selector: ".tour-deals-table",   content: "This is your deals table. It shows all your deals with their details such as stage, value, and assignee." },
//   { selector: ".tour-deal-name",     content: "Click a Deal Name to view its detailed information." },
//   { selector: ".tour-deal-actions",  content: "Use the Edit or Delete icons to quickly manage a deal." },
//   { selector: ".tour-finish",        content: "That's the end of the tour! Click the button below to finish it anytime." },
// ];

// /* ── Cost helpers ── */
// const parseCost = (v) => {
//   const n = parseFloat(String(v || "0").replace(/,/g, ""));
//   return isNaN(n) ? 0 : n;
// };

// /* ── Stage badge ── */
// const stageBadge = (stage) => {
//   const map = {
//     "Qualification": "bg-blue-100 text-blue-700",
//     "Proposal":      "bg-purple-100 text-purple-700",
//     "Proposal Sent": "bg-indigo-100 text-indigo-700",
//     "Negotiation":   "bg-yellow-100 text-yellow-700",
//     "Closed Won":    "bg-green-100 text-green-700",
//     "Closed Lost":   "bg-red-100 text-red-700",
//   };
//   return map[stage] || "bg-gray-100 text-gray-700";
// };

// /* ── Display cost cell ── */
// const CostCell = ({ raw }) => {
//   if (!raw && raw !== 0) return <span className="text-gray-300">—</span>;
//   const str = String(raw).trim();
//   if (!str || str === "0") return <span className="text-gray-300">—</span>;
//   const numeric = parseFloat(str.replace(/,/g, ""));
//   if (!isNaN(numeric) && numeric > 0) {
//     return <span className="text-gray-700 font-medium">{new Intl.NumberFormat("en-IN").format(numeric)}</span>;
//   }
//   return <span className="text-gray-700">{str}</span>;
// };

// /* ════════════════════════════════════════════════════════
//    COMPONENT
//    ════════════════════════════════════════════════════════ */
// function AllDealsComponent() {
//   const navigate = useNavigate();
//   const { setIsOpen, setSteps, setCurrentStep } = useTour();

//   const [deals, setDeals]                         = useState([]);
//   const [loading, setLoading]                     = useState(true);
//   const [currentPage, setCurrentPage]             = useState(1);
//   const [selectedDeals, setSelectedDeals]         = useState([]);
//   const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
//   const [deleteDeal, setDeleteDeal]               = useState(null);
//   const [users, setUsers]                         = useState([]);
//   const [userRole, setUserRole]                   = useState("");
//   const [filters, setFilters]                     = useState({ stage: "", assignedTo: "" });
//   const [searchTerm, setSearchTerm]               = useState("");
//   const [isDeleting, setIsDeleting]               = useState(false);
//   const [isBulkDeleting, setIsBulkDeleting]       = useState(false);
//   const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);

//   const itemsPerPage = 10;

//   // useEffect(() => {
//   //   const token = localStorage.getItem("token");
//   //   let role = "";
//   //   if (token) {
//   //     try {
//   //       const payload = JSON.parse(atob(token.split(".")[1]));
//   //       if (typeof payload.role === "string") {
//   //         role = payload.role.toLowerCase();
//   //       } else if (payload.role?.name) {
//   //         role = payload.role.name.toLowerCase();
//   //       } else {
//   //         role = "";
//   //       }
//   //     } catch (err) {
//   //       console.error("Error decoding token:", err);
//   //     }
//   //   }
//   //   setUserRole(role);
//   // }, []);

// useEffect(() => {
//     const userData = localStorage.getItem("user");
//     let role = "";
//     if (userData) {
//       try {
//         const user = JSON.parse(userData);
//         role = user.role?.name || "";
//       } catch (err) {
//         console.error("Error parsing user data:", err);
//       }
//     }
//     setUserRole(role);
//     const hasTakenTour = localStorage.getItem("dealsTourCompleted");
//     if (!hasTakenTour && role === "Sales") {
//       setSteps(dealTourSteps);
//       setTimeout(() => setIsOpen(true), 1000);
//     }
//   }, [setIsOpen, setSteps]);


//   const startTour = () => {
//     setSteps(dealTourSteps);
//     setCurrentStep(0);
//     setIsOpen(true);
//     localStorage.setItem("dealsTourCompleted", "true");
//   };

//   const formatCurrencyValue = (val) => {
//     if (!val) return "-";
//     const match = val.match(/^([\d,]+)\s*([A-Z]+)$/i);
//     if (!match) return val;
//     const number   = match[1].replace(/,/g, "");
//     const currency = match[2].toUpperCase();
//     return `${Number(number).toLocaleString("en-IN")} ${currency}`;
//   };

//   const formatDate = (date) =>
//     date
//       ? new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
//       : "-";

//   const fetchDeals = async () => {
//     try {
//       setLoading(true);
//       const token = localStorage.getItem("token");
//       const res   = await axios.get(`${API_URL}/deals/getAll`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setDeals(res.data || []);
//     } catch (err) {
//       console.error("Fetch deals error:", err);
//       toast.error("Failed to fetch deals");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchUsers = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const res   = await axios.get(`${API_URL}/users`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const filteredSales = (res.data.users || []).filter(
//         (u) => u.role?.name?.toLowerCase() === "sales"
//       );
//       setUsers(filteredSales);
//     } catch (err) { console.error("Fetch users error:", err); }
//   };

//   useEffect(() => { fetchDeals(); fetchUsers(); }, []);

//   const filteredDeals = deals
//     .filter((d) => d.dealName?.toLowerCase().includes(searchTerm.toLowerCase()))
//     .filter((d) => (filters.stage      ? d.stage           === filters.stage      : true))
//     .filter((d) => (filters.assignedTo ? d.assignedTo?._id === filters.assignedTo : true));

//   const totalPages     = Math.max(1, Math.ceil(filteredDeals.length / itemsPerPage));
//   const safePage       = Math.min(currentPage, totalPages);
//   const paginatedDeals = filteredDeals.slice((safePage - 1) * itemsPerPage, safePage * itemsPerPage);

//   useEffect(() => { setCurrentPage(1); }, [searchTerm, filters]);

//   const getPageNumbers = () => {
//     if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
//     const half  = 2;
//     let start   = Math.max(1, safePage - half);
//     let end     = Math.min(totalPages, safePage + half);
//     if (safePage <= half + 1)          end   = Math.min(5, totalPages);
//     if (safePage >= totalPages - half) start = Math.max(1, totalPages - 4);
//     return Array.from({ length: end - start + 1 }, (_, i) => start + i);
//   };

//   const handlePageChange     = (page) => { if (page >= 1 && page <= totalPages) setCurrentPage(page); };
//   const handleCheckboxChange = (id)   => setSelectedDeals((prev) => prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]);
//   const handleSelectAll      = (e)    => {
//     if (e.target.checked) setSelectedDeals(filteredDeals.map((d) => d._id));
//     else setSelectedDeals([]);
//   };

//   const isAllSelected   = filteredDeals.length > 0 && filteredDeals.every((d) => selectedDeals.includes(d._id));
//   const isIndeterminate = selectedDeals.length > 0 && !isAllSelected;

//   const handleBulkDelete = async () => {
//     if (!selectedDeals.length) return toast.info("Select deals to delete");
//     setIsBulkDeleteModalOpen(true);
//   };

//   const handleBulkDeleteConfirm = async () => {
//     try {
//       setIsBulkDeleting(true);
//       const token = localStorage.getItem("token");
//       await axios.delete(`${API_URL}/deals/bulk-delete`, {
//         headers: { Authorization: `Bearer ${token}` },
//         data: { ids: selectedDeals },
//       });
//       toast.success(`Successfully deleted ${selectedDeals.length} deal(s)`);
//       setSelectedDeals([]);
//       setIsBulkDeleteModalOpen(false);
//       await fetchDeals();
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Failed to delete deals");
//     } finally {
//       setIsBulkDeleting(false);
//     }
//   };

//   const handleEdit        = (deal) => navigate("/createDeal", { state: { deal } });
//   const handleDeleteClick = (deal) => { setDeleteDeal(deal); setIsDeleteModalOpen(true); };

//   const handleDeleteConfirm = async () => {
//     try {
//       setIsDeleting(true);
//       const token = localStorage.getItem("token");
//       await axios.delete(`${API_URL}/deals/delete-deal/${deleteDeal._id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       toast.success("Deal deleted successfully");
//       setIsDeleteModalOpen(false);
//       await fetchDeals();
//       setSelectedDeals((prev) => prev.filter((d) => d !== deleteDeal._id));
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Failed to delete deal");
//     } finally {
//       setIsDeleting(false);
//     }
//   };

//   /* ── Grand totals (numeric only) ── */
//   const grandTotalPurchasing = filteredDeals.reduce((acc, d) =>
//     acc + parseCost(d.purchasingLandCost) + parseCost(d.purchasingTicketCost), 0);
//   const grandTotalSelling = filteredDeals.reduce((acc, d) =>
//     acc + parseCost(d.sellingLandCost) + parseCost(d.sellingTicketCost), 0);
//   const grandProfit = grandTotalSelling - grandTotalPurchasing;

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
//       </div>
//     );
//   }

//   const pageNumbers = getPageNumbers();

//   return (
//     <div className="p-4">

//       {/* Header */}
//       <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-3 tour-deals-header">
//         <h2 className="text-xl font-semibold text-gray-800">All Deals</h2>
//         <div className="flex items-center gap-3">
//           <button onClick={startTour} className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 tour-finish">
//             <Eye className="w-4 h-4" /> Take Tour
//           </button>
          
//           {/* <button onClick={() => navigate("/createDeal")} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 tour-create-deal">
//             <Plus className="w-4 h-4" /> Create Deal
//           </button> */}
//           {userRole === "Admin" && (
//             <button
//               onClick={() => navigate("/createDeal")}
//               className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 tour-create-deal"
//             >
//               <Plus className="w-4 h-4" /> Create Deal
//             </button>
//           )}
//         </div>
//       </div>

//       {/* Summary Cards */}
//       <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
//         <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-3 shadow-sm">
//           <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-bold text-sm flex-shrink-0">P</div>
//           <div>
//             <p className="text-xs text-gray-500 font-medium">Total Purchasing Cost</p>
//             <p className="text-base font-bold text-gray-800">{new Intl.NumberFormat("en-IN").format(grandTotalPurchasing)}</p>
//           </div>
//         </div>
//         <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-3 shadow-sm">
//           <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-bold text-sm flex-shrink-0">S</div>
//           <div>
//             <p className="text-xs text-gray-500 font-medium">Total Selling Cost</p>
//             <p className="text-base font-bold text-gray-800">{new Intl.NumberFormat("en-IN").format(grandTotalSelling)}</p>
//           </div>
//         </div>
//         <div className="border rounded-xl p-4 flex items-center gap-3 shadow-sm bg-white border-gray-200">
//           <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${grandProfit >= 0 ? "bg-emerald-100 text-emerald-600" : "bg-red-100 text-red-600"}`}>
//             {grandProfit >= 0 ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
//           </div>
//           <div>
//             <p className="text-xs text-gray-500 font-medium">Net Profit / Loss</p>
//             <p className={`text-base font-bold ${grandProfit >= 0 ? "text-emerald-700" : "text-red-700"}`}>
//               {grandProfit >= 0 ? "+" : "-"}{new Intl.NumberFormat("en-IN").format(Math.abs(grandProfit))}
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* Filters */}
//       <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-3 tour-filters">
//         <div className="flex flex-wrap gap-4 items-center">
//           <select value={filters.stage} onChange={(e) => setFilters((prev) => ({ ...prev, stage: e.target.value }))} className="border rounded-md px-4 py-2 bg-white text-sm">
//             <option value="">All Stages</option>
//             <option value="Qualification">Qualification</option>
//             <option value="Negotiation">Negotiation</option>
//             <option value="Proposal Sent">Proposal Sent</option>
//             <option value="Closed Won">Closed Won</option>
//             <option value="Closed Lost">Closed Lost</option>
//           </select>
//           <select value={filters.assignedTo} onChange={(e) => setFilters((prev) => ({ ...prev, assignedTo: e.target.value }))} className="border rounded-md bg-white px-4 py-2 text-sm">
//             <option value="">All Assigned</option>
//             {users.map((u) => <option key={u._id} value={u._id}>{u.firstName} {u.lastName}</option>)}
//           </select>
//           <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search Deal Name..."
//             className="border rounded-full px-4 py-2 bg-white text-sm" />
//         </div>
//       </div>

//       {/* Bulk Delete Bar */}
//       {selectedDeals.length > 0 && (
//         <div className="mb-3 flex items-center gap-3 bg-red-50 border border-red-200 rounded-lg px-4 py-2.5">
//           <span className="text-sm font-semibold text-red-700">{selectedDeals.length} deal{selectedDeals.length > 1 ? "s" : ""} selected</span>
//           <button onClick={handleBulkDelete} disabled={isBulkDeleting}
//             className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold px-4 py-1.5 rounded-lg transition shadow-sm disabled:opacity-60 disabled:cursor-not-allowed">
//             <Trash2 size={15} />
//             {isBulkDeleting ? "Deleting..." : `Delete Selected (${selectedDeals.length})`}
//           </button>
//           <button onClick={() => setSelectedDeals([])} className="ml-auto text-sm text-gray-500 hover:text-gray-700 underline">Clear selection</button>
//         </div>
//       )}

//       {/* ── Table ── */}
//       <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm tour-deals-table">
//         <table className="min-w-full text-sm text-gray-700">
//           <thead className="bg-gray-100">
//             <tr>
//               <th className="px-4 py-3 w-10">
//                 <input type="checkbox" onChange={handleSelectAll} checked={isAllSelected}
//                   ref={(el) => { if (el) el.indeterminate = isIndeterminate; }}
//                   className="cursor-pointer w-4 h-4 accent-blue-600" />
//               </th>
//               <th className="px-4 py-3 text-left font-semibold whitespace-nowrap">Deal Name</th>
//               <th className="px-4 py-3 text-left font-semibold whitespace-nowrap">Assigned To</th>
//               <th className="px-4 py-3 text-left font-semibold whitespace-nowrap">Stage</th>
//               <th className="px-4 py-3 text-left font-semibold whitespace-nowrap">Deal Value</th>
//               {/* ── NEW COLUMNS ── */}
//               <th className="px-4 py-3 text-left font-semibold whitespace-nowrap">Travellers</th>
//               <th className="px-4 py-3 text-left font-semibold whitespace-nowrap">Travel Date</th>
//               {/* ── Cost columns ── */}
//               <th className="px-4 py-3 text-left font-semibold whitespace-nowrap">Purch. Land</th>
//               <th className="px-4 py-3 text-left font-semibold whitespace-nowrap">Purch. Ticket</th>
//               <th className="px-4 py-3 text-left font-semibold whitespace-nowrap">Sell. Land</th>
//               <th className="px-4 py-3 text-left font-semibold whitespace-nowrap">Sell. Ticket</th>
//               <th className="px-4 py-3 text-left font-semibold whitespace-nowrap">Profit / Loss</th>
//               <th className="px-4 py-3 text-left font-semibold whitespace-nowrap">Created At</th>
//               <th className="px-4 py-3 text-left font-semibold whitespace-nowrap tour-deal-actions">Actions</th>
//             </tr>
//           </thead>

//           <tbody className="divide-y divide-gray-200">
//             {paginatedDeals.length > 0 ? (
//               paginatedDeals.map((deal, idx) => {
//                 const purchLand   = parseCost(deal.purchasingLandCost);
//                 const purchTicket = parseCost(deal.purchasingTicketCost);
//                 const sellLand    = parseCost(deal.sellingLandCost);
//                 const sellTicket  = parseCost(deal.sellingTicketCost);
//                 const totalPurch  = purchLand + purchTicket;
//                 const totalSell   = sellLand  + sellTicket;
//                 const profit      = totalSell - totalPurch;
//                 const hasProfit   = profit > 0;
//                 const hasLoss     = profit < 0;
//                 const hasCostData = totalPurch > 0 || totalSell > 0;

//                 return (
//                   <tr key={deal._id}
//                     className={`transition-colors ${selectedDeals.includes(deal._id) ? "bg-blue-50" : idx % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-blue-50`}>
//                     <td className="px-4 py-3">
//                       <input type="checkbox" onChange={() => handleCheckboxChange(deal._id)} checked={selectedDeals.includes(deal._id)} className="cursor-pointer w-4 h-4 accent-blue-600" />
//                     </td>

//                     <td className="px-4 py-3">
//                       <button onClick={() => navigate(`/Pipelineview/${deal._id}`)}
//                         className="text-blue-600 hover:text-blue-800 hover:underline font-medium tour-deal-name">
//                         {deal.dealName || "-"}
//                       </button>
//                     </td>

//                     <td className="px-4 py-3">{deal.assignedTo ? `${deal.assignedTo.firstName} ${deal.assignedTo.lastName}` : "-"}</td>

//                     <td className="px-4 py-3">
//                       <span className={`px-2 py-1 rounded-full text-xs font-medium ${stageBadge(deal.stage)}`}>{deal.stage || "-"}</span>
//                     </td>

//                     <td className="px-4 py-3 font-medium">{formatCurrencyValue(deal.value)}</td>

//                     {/* ── Travellers ── */}
//                     <td className="px-4 py-3">
//                       {deal.noOfTravellers != null && deal.noOfTravellers !== "" ? (
//                         <span className="inline-flex items-center gap-1 text-gray-700">
//                           <Users size={14} className="text-gray-400" />
//                           {deal.noOfTravellers}
//                         </span>
//                       ) : <span className="text-gray-300">—</span>}
//                     </td>

//                     {/* ── Travel Date ── */}
//                     <td className="px-4 py-3">
//                       {deal.travelDate ? (
//                         <span className="inline-flex items-center gap-1 text-gray-700">
//                           <Calendar size={14} className="text-gray-400" />
//                           {formatDate(deal.travelDate)}
//                         </span>
//                       ) : <span className="text-gray-300">—</span>}
//                     </td>

//                     {/* Cost columns */}
//                     <td className="px-4 py-3"><CostCell raw={deal.purchasingLandCost} /></td>
//                     <td className="px-4 py-3"><CostCell raw={deal.purchasingTicketCost} /></td>
//                     <td className="px-4 py-3"><CostCell raw={deal.sellingLandCost} /></td>
//                     <td className="px-4 py-3"><CostCell raw={deal.sellingTicketCost} /></td>

//                     {/* Profit / Loss */}
//                     <td className="px-4 py-3">
//                       {hasCostData ? (
//                         <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${hasProfit ? "bg-emerald-100 text-emerald-700" : hasLoss ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-600"}`}>
//                           {hasProfit ? <TrendingUp size={12} /> : hasLoss ? <TrendingDown size={12} /> : null}
//                           {hasProfit ? "+" : hasLoss ? "-" : ""}
//                           {new Intl.NumberFormat("en-IN").format(Math.abs(profit))}
//                         </div>
//                       ) : <span className="text-gray-300">—</span>}
//                     </td>

//                     <td className="px-4 py-3">{formatDate(deal.createdAt)}</td>

//                     <td className="px-4 py-3">
//                       <div className="flex items-center gap-2">
//                         <button onClick={() => handleEdit(deal)} title="Edit Deal" className="p-1.5 rounded-md hover:bg-blue-100 text-blue-600 transition-colors">
//                           <Edit size={16} />
//                         </button>
//                         <button onClick={() => handleDeleteClick(deal)} title="Delete Deal" className="p-1.5 rounded-md hover:bg-red-100 text-red-600 transition-colors">
//                           <Trash2 size={16} />
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 );
//               })
//             ) : (
//               <tr>
//                 <td colSpan={14} className="px-6 py-8 text-center text-gray-500">No deals found</td>
//               </tr>
//             )}
//           </tbody>

//           {/* Grand totals footer */}
//           {filteredDeals.length > 0 && (
//             <tfoot>
//               <tr className="bg-gray-100 border-t-2 border-gray-300 font-semibold text-sm">
//                 <td colSpan={7} className="px-4 py-3 text-gray-700">Grand Total ({filteredDeals.length} deals)</td>
//                 <td className="px-4 py-3 text-gray-800">
//                   {new Intl.NumberFormat("en-IN").format(filteredDeals.reduce((a, d) => a + parseCost(d.purchasingLandCost), 0))}
//                 </td>
//                 <td className="px-4 py-3 text-gray-800">
//                   {new Intl.NumberFormat("en-IN").format(filteredDeals.reduce((a, d) => a + parseCost(d.purchasingTicketCost), 0))}
//                 </td>
//                 <td className="px-4 py-3 text-gray-800">
//                   {new Intl.NumberFormat("en-IN").format(filteredDeals.reduce((a, d) => a + parseCost(d.sellingLandCost), 0))}
//                 </td>
//                 <td className="px-4 py-3 text-gray-800">
//                   {new Intl.NumberFormat("en-IN").format(filteredDeals.reduce((a, d) => a + parseCost(d.sellingTicketCost), 0))}
//                 </td>
//                 <td className={`px-4 py-3 ${grandProfit >= 0 ? "text-emerald-700" : "text-red-700"}`}>
//                   <div className="flex items-center gap-1">
//                     {grandProfit >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
//                     {grandProfit >= 0 ? "+" : "-"}{new Intl.NumberFormat("en-IN").format(Math.abs(grandProfit))}
//                   </div>
//                 </td>
//                 <td colSpan={2} className="px-4 py-3" />
//               </tr>
//             </tfoot>
//           )}
//         </table>
//       </div>

//       {/* Pagination */}
//       {totalPages > 1 && (
//         <div className="flex items-center justify-between mt-4 flex-wrap gap-2">
//           <p className="text-sm text-gray-600">
//             Showing <span className="font-medium">{Math.min((safePage - 1) * itemsPerPage + 1, filteredDeals.length)}</span>–
//             <span className="font-medium">{Math.min(safePage * itemsPerPage, filteredDeals.length)}</span> of{" "}
//             <span className="font-medium">{filteredDeals.length}</span>
//           </p>
//           <div className="flex items-center gap-1">
//             <button onClick={() => handlePageChange(1)} disabled={safePage === 1}
//               className={`px-2.5 py-1.5 rounded-md border text-sm font-medium transition-colors ${safePage === 1 ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed" : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"}`}>«</button>
//             <button onClick={() => handlePageChange(safePage - 1)} disabled={safePage === 1}
//               className={`px-3 py-1.5 rounded-md border text-sm font-medium transition-colors ${safePage === 1 ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed" : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"}`}>Previous</button>
//             {pageNumbers[0] > 1 && (
//               <>
//                 <button onClick={() => handlePageChange(1)} className="px-3 py-1.5 rounded-md border text-sm font-medium bg-white text-gray-600 border-gray-300 hover:bg-gray-50">1</button>
//                 {pageNumbers[0] > 2 && <span className="px-1 py-1.5 text-gray-400 text-sm">…</span>}
//               </>
//             )}
//             {pageNumbers.map((page) => (
//               <button key={page} onClick={() => handlePageChange(page)}
//                 className={`px-3 py-1.5 rounded-md border text-sm font-medium transition-colors ${safePage === page ? "bg-blue-600 text-white border-blue-600 shadow-sm" : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"}`}>
//                 {page}
//               </button>
//             ))}
//             {pageNumbers[pageNumbers.length - 1] < totalPages && (
//               <>
//                 {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && <span className="px-1 py-1.5 text-gray-400 text-sm">…</span>}
//                 <button onClick={() => handlePageChange(totalPages)} className="px-3 py-1.5 rounded-md border text-sm font-medium bg-white text-gray-600 border-gray-300 hover:bg-gray-50">{totalPages}</button>
//               </>
//             )}
//             <button onClick={() => handlePageChange(safePage + 1)} disabled={safePage === totalPages}
//               className={`px-3 py-1.5 rounded-md border text-sm font-medium transition-colors ${safePage === totalPages ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed" : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"}`}>Next</button>
//             <button onClick={() => handlePageChange(totalPages)} disabled={safePage === totalPages}
//               className={`px-2.5 py-1.5 rounded-md border text-sm font-medium transition-colors ${safePage === totalPages ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed" : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"}`}>»</button>
//           </div>
//         </div>
//       )}

//       {/* Single Delete Modal */}
//       <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
//         <DialogContent className="max-w-sm p-6">
//           <DialogHeader><DialogTitle>Confirm Delete</DialogTitle></DialogHeader>
//           <p>Are you sure you want to delete <strong>{deleteDeal?.dealName}</strong>?</p>
//           <div className="mt-6 flex justify-end space-x-3">
//             <button onClick={() => setIsDeleteModalOpen(false)} className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300">Cancel</button>
//             <button onClick={handleDeleteConfirm} disabled={isDeleting} className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 disabled:bg-red-400 disabled:cursor-not-allowed">
//               {isDeleting ? "Deleting..." : "Delete"}
//             </button>
//           </div>
//         </DialogContent>
//       </Dialog>

//       {/* Bulk Delete Modal */}
//       <Dialog open={isBulkDeleteModalOpen} onOpenChange={setIsBulkDeleteModalOpen}>
//         <DialogContent className="max-w-sm p-6">
//           <DialogHeader><DialogTitle>Confirm Bulk Delete</DialogTitle></DialogHeader>
//           <p>Are you sure you want to delete <strong>{selectedDeals.length}</strong> selected deal{selectedDeals.length > 1 ? "s" : ""}? This action cannot be undone.</p>
//           <div className="mt-6 flex justify-end space-x-3">
//             <button onClick={() => setIsBulkDeleteModalOpen(false)} disabled={isBulkDeleting} className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50">Cancel</button>
//             <button onClick={handleBulkDeleteConfirm} disabled={isBulkDeleting} className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 disabled:bg-red-400 disabled:cursor-not-allowed flex items-center gap-2">
//               {isBulkDeleting ? (
//                 <><span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Deleting...</>
//               ) : (
//                 <><Trash2 size={15} /> Delete All</>
//               )}
//             </button>
//           </div>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }

// export const AllDeals = () => (
//   <TourProvider
//     steps={dealTourSteps}
//     afterOpen={() => (document.body.style.overflow = "hidden")}
//     beforeClose={() => (document.body.style.overflow = "unset")}
//     showNumber={false}
//     styles={{
//       popover:  (base) => ({ ...base, backgroundColor: "#fff", color: "#1f1f1f" }),
//       maskArea: (base) => ({ ...base, rx: 8 }),
//       badge:    (base) => ({ ...base, display: "none" }),
//       close:    (base) => ({ ...base, right: "auto", left: 8, top: 8 }),
//     }}
//   >
//     <AllDealsComponent />
//   </TourProvider>
// );//all work correctly..





import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Edit, Trash2, Eye, Plus, TrendingUp, TrendingDown, Users, Calendar } from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "../../components/ui/dialog";
import { useNavigate } from "react-router-dom";
import { TourProvider, useTour } from "@reactour/tour";

const API_URL = import.meta.env.VITE_API_URL;

const dealTourSteps = [
  { selector: ".tour-deals-header",  content: "Welcome to the Deals Management page! Here you can view, edit, and manage all your deals." },
  { selector: ".tour-create-deal",   content: "Click here to create a new deal and add important details like value, stage, and assigned user." },
  { selector: ".tour-filters",       content: "Use these filters to narrow down deals by stage, assigned user, or name." },
  { selector: ".tour-deals-table",   content: "This is your deals table. It shows all your deals with their details such as stage, value, and assignee." },
  { selector: ".tour-deal-name",     content: "Click a Deal Name to view its detailed information." },
  { selector: ".tour-deal-actions",  content: "Use the Edit or Delete icons to quickly manage a deal." },
  { selector: ".tour-finish",        content: "That's the end of the tour! Click the button below to finish it anytime." },
];

/* ── Cost helpers ── */
const parseCost = (v) => {
  const n = parseFloat(String(v || "0").replace(/,/g, ""));
  return isNaN(n) ? 0 : n;
};

/* ── Stage badge ── */
const stageBadge = (stage) => {
  const map = {
    "Qualification": "bg-blue-100 text-blue-700",
    "Proposal":      "bg-purple-100 text-purple-700",
    "Proposal Sent": "bg-indigo-100 text-indigo-700",
    "Negotiation":   "bg-yellow-100 text-yellow-700",
    "Closed Won":    "bg-green-100 text-green-700",
    "Closed Lost":   "bg-red-100 text-red-700",
  };
  return map[stage] || "bg-gray-100 text-gray-700";
};

/* ── Display cost cell ── */
const CostCell = ({ raw }) => {
  if (!raw && raw !== 0) return <span className="text-gray-300">—</span>;
  const str = String(raw).trim();
  if (!str || str === "0") return <span className="text-gray-300">—</span>;
  const numeric = parseFloat(str.replace(/,/g, ""));
  if (!isNaN(numeric) && numeric > 0) {
    return <span className="text-gray-700 font-medium">{new Intl.NumberFormat("en-IN").format(numeric)}</span>;
  }
  return <span className="text-gray-700">{str}</span>;
};

/* ════════════════════════════════════════════════════════
   COMPONENT
   ════════════════════════════════════════════════════════ */
function AllDealsComponent() {
  const navigate = useNavigate();
  const { setIsOpen, setSteps, setCurrentStep } = useTour();

  const [deals, setDeals]                         = useState([]);
  const [loading, setLoading]                     = useState(true);
  const [currentPage, setCurrentPage]             = useState(1);
  const [selectedDeals, setSelectedDeals]         = useState([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteDeal, setDeleteDeal]               = useState(null);
  const [users, setUsers]                         = useState([]);
  const [userRole, setUserRole]                   = useState("");
  const [filters, setFilters]                     = useState({ stage: "", assignedTo: "" });
  const [searchTerm, setSearchTerm]               = useState("");
  const [isDeleting, setIsDeleting]               = useState(false);
  const [isBulkDeleting, setIsBulkDeleting]       = useState(false);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);

  const itemsPerPage = 10;

  // useEffect(() => {
  //   const token = localStorage.getItem("token");
  //   let role = "";
  //   if (token) {
  //     try {
  //       const payload = JSON.parse(atob(token.split(".")[1]));
  //       if (typeof payload.role === "string") {
  //         role = payload.role.toLowerCase();
  //       } else if (payload.role?.name) {
  //         role = payload.role.name.toLowerCase();
  //       }
  //     } catch (err) {
  //       console.error("Error decoding token:", err);
  //     }
  //   }
  //   setUserRole(role);
  // }, []);

useEffect(() => {
    const userData = localStorage.getItem("user");
    let role = "";
    if (userData) {
      try {
        const user = JSON.parse(userData);
        role = user.role?.name || "";
      } catch (err) {
        console.error("Error parsing user data:", err);
      }
    }
    setUserRole(role);
    const hasTakenTour = localStorage.getItem("dealsTourCompleted");
    if (!hasTakenTour && role === "Sales") {
      setSteps(dealTourSteps);
      setTimeout(() => setIsOpen(true), 1000);
    }
  }, [setIsOpen, setSteps]);



  const startTour = () => {
    setSteps(dealTourSteps);
    setCurrentStep(0);
    setIsOpen(true);
    localStorage.setItem("dealsTourCompleted", "true");
  };

  const formatCurrencyValue = (val) => {
    if (!val) return "-";
    const match = val.match(/^([\d,]+)\s*([A-Z]+)$/i);
    if (!match) return val;
    const number   = match[1].replace(/,/g, "");
    const currency = match[2].toUpperCase();
    return `${Number(number).toLocaleString("en-IN")} ${currency}`;
  };

  const formatDate = (date) =>
    date
      ? new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
      : "-";

  const fetchDeals = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res   = await axios.get(`${API_URL}/deals/getAll`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDeals(res.data || []);
    } catch (err) {
      console.error("Fetch deals error:", err);
      toast.error("Failed to fetch deals");
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const res   = await axios.get(`${API_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const filteredSales = (res.data.users || []).filter(
        (u) => u.role?.name?.toLowerCase() === "sales"
      );
      setUsers(filteredSales);
    } catch (err) { console.error("Fetch users error:", err); }
  };

  useEffect(() => { fetchDeals(); fetchUsers(); }, []);

  const filteredDeals = deals
    .filter((d) => d.dealName?.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter((d) => (filters.stage      ? d.stage           === filters.stage      : true))
    .filter((d) => (filters.assignedTo ? d.assignedTo?._id === filters.assignedTo : true));

  const totalPages     = Math.max(1, Math.ceil(filteredDeals.length / itemsPerPage));
  const safePage       = Math.min(currentPage, totalPages);
  const paginatedDeals = filteredDeals.slice((safePage - 1) * itemsPerPage, safePage * itemsPerPage);

  useEffect(() => { setCurrentPage(1); }, [searchTerm, filters]);

  const getPageNumbers = () => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const half  = 2;
    let start   = Math.max(1, safePage - half);
    let end     = Math.min(totalPages, safePage + half);
    if (safePage <= half + 1)          end   = Math.min(5, totalPages);
    if (safePage >= totalPages - half) start = Math.max(1, totalPages - 4);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const handlePageChange     = (page) => { if (page >= 1 && page <= totalPages) setCurrentPage(page); };
  const handleCheckboxChange = (id)   => setSelectedDeals((prev) => prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]);
  const handleSelectAll      = (e)    => {
    if (e.target.checked) setSelectedDeals(filteredDeals.map((d) => d._id));
    else setSelectedDeals([]);
  };

  const isAllSelected   = filteredDeals.length > 0 && filteredDeals.every((d) => selectedDeals.includes(d._id));
  const isIndeterminate = selectedDeals.length > 0 && !isAllSelected;

  const handleBulkDelete = async () => {
    if (!selectedDeals.length) return toast.info("Select deals to delete");
    setIsBulkDeleteModalOpen(true);
  };

  const handleBulkDeleteConfirm = async () => {
    try {
      setIsBulkDeleting(true);
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}/deals/bulk-delete`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { ids: selectedDeals },
      });
      toast.success(`Successfully deleted ${selectedDeals.length} deal(s)`);
      setSelectedDeals([]);
      setIsBulkDeleteModalOpen(false);
      await fetchDeals();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete deals");
    } finally {
      setIsBulkDeleting(false);
    }
  };

  const handleEdit        = (deal) => navigate("/createDeal", { state: { deal } });
  const handleDeleteClick = (deal) => { setDeleteDeal(deal); setIsDeleteModalOpen(true); };

  const handleDeleteConfirm = async () => {
    try {
      setIsDeleting(true);
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}/deals/delete-deal/${deleteDeal._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Deal deleted successfully");
      setIsDeleteModalOpen(false);
      await fetchDeals();
      setSelectedDeals((prev) => prev.filter((d) => d !== deleteDeal._id));
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete deal");
    } finally {
      setIsDeleting(false);
    }
  };

  /* ── Grand totals ── */
  const grandTotalPurchasing = filteredDeals.reduce((acc, d) =>
    acc + parseCost(d.purchasingLandCost) + parseCost(d.purchasingTicketCost), 0);
  const grandTotalSelling = filteredDeals.reduce((acc, d) =>
    acc + parseCost(d.sellingLandCost) + parseCost(d.sellingTicketCost), 0);
  const grandProfit = grandTotalSelling - grandTotalPurchasing;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
      </div>
    );
  }

  const pageNumbers = getPageNumbers();

  return (
    <div className="p-4">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-3 tour-deals-header">
        <h2 className="text-xl font-semibold text-gray-800">All Deals</h2>
        <div className="flex items-center gap-3">
          <button onClick={startTour} className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 tour-finish">
            <Eye className="w-4 h-4" /> Take Tour
          </button>
          {/* <button onClick={() => navigate("/createDeal")} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 tour-create-deal">
            <Plus className="w-4 h-4" /> Create Deal
          </button> */}
          {userRole === "Admin" && (
            <button
              onClick={() => navigate("/createDeal")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 tour-create-deal"
            >
              <Plus className="w-4 h-4" /> Create Deal
            </button>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
        <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-3 shadow-sm">
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-bold text-sm flex-shrink-0">P</div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Total Purchasing Cost</p>
            <p className="text-base font-bold text-gray-800">{new Intl.NumberFormat("en-IN").format(grandTotalPurchasing)}</p>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-3 shadow-sm">
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-bold text-sm flex-shrink-0">S</div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Total Selling Cost</p>
            <p className="text-base font-bold text-gray-800">{new Intl.NumberFormat("en-IN").format(grandTotalSelling)}</p>
          </div>
        </div>
        <div className="border rounded-xl p-4 flex items-center gap-3 shadow-sm bg-white border-gray-200">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${grandProfit >= 0 ? "bg-emerald-100 text-emerald-600" : "bg-red-100 text-red-600"}`}>
            {grandProfit >= 0 ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Net Profit / Loss</p>
            <p className={`text-base font-bold ${grandProfit >= 0 ? "text-emerald-700" : "text-red-700"}`}>
              {grandProfit >= 0 ? "+" : "-"}{new Intl.NumberFormat("en-IN").format(Math.abs(grandProfit))}
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-3 tour-filters">
        <div className="flex flex-wrap gap-4 items-center">
          <select value={filters.stage} onChange={(e) => setFilters((prev) => ({ ...prev, stage: e.target.value }))}
            className="border rounded-md px-4 py-2 bg-white text-sm">
            <option value="">All Stages</option>
            <option value="Qualification">Qualification</option>
            <option value="Negotiation">Negotiation</option>
            <option value="Proposal Sent">Proposal Sent</option>
            <option value="Closed Won">Closed Won</option>
            <option value="Closed Lost">Closed Lost</option>
          </select>
          <select value={filters.assignedTo} onChange={(e) => setFilters((prev) => ({ ...prev, assignedTo: e.target.value }))}
            className="border rounded-md bg-white px-4 py-2 text-sm">
            <option value="">All Assigned</option>
            {users.map((u) => <option key={u._id} value={u._id}>{u.firstName} {u.lastName}</option>)}
          </select>
          <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search Deal Name..."
            className="border rounded-full px-4 py-2 bg-white text-sm" />
        </div>
      </div>

      {/* Bulk Delete Bar */}
      {selectedDeals.length > 0 && (
        <div className="mb-3 flex items-center gap-3 bg-red-50 border border-red-200 rounded-lg px-4 py-2.5">
          <span className="text-sm font-semibold text-red-700">{selectedDeals.length} deal{selectedDeals.length > 1 ? "s" : ""} selected</span>
          <button onClick={handleBulkDelete} disabled={isBulkDeleting}
            className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold px-4 py-1.5 rounded-lg transition shadow-sm disabled:opacity-60 disabled:cursor-not-allowed">
            <Trash2 size={15} />
            {isBulkDeleting ? "Deleting..." : `Delete Selected (${selectedDeals.length})`}
          </button>
          <button onClick={() => setSelectedDeals([])} className="ml-auto text-sm text-gray-500 hover:text-gray-700 underline">Clear selection</button>
        </div>
      )}

      {/* ── Table ── */}
      <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm tour-deals-table">
        <table className="min-w-full text-sm text-gray-700">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 w-10">
                <input type="checkbox" onChange={handleSelectAll} checked={isAllSelected}
                  ref={(el) => { if (el) el.indeterminate = isIndeterminate; }}
                  className="cursor-pointer w-4 h-4 accent-blue-600" />
              </th>
              <th className="px-4 py-3 text-left font-semibold whitespace-nowrap">Deal Name</th>
              <th className="px-4 py-3 text-left font-semibold whitespace-nowrap">Assigned To</th>
              <th className="px-4 py-3 text-left font-semibold whitespace-nowrap">Stage</th>
              <th className="px-4 py-3 text-left font-semibold whitespace-nowrap">Deal Value</th>
              {/* ── UPDATED: Adults + Children columns ── */}
              <th className="px-4 py-3 text-left font-semibold whitespace-nowrap">Adults</th>
              <th className="px-4 py-3 text-left font-semibold whitespace-nowrap">Children</th>
              <th className="px-4 py-3 text-left font-semibold whitespace-nowrap">Travel Date</th>
              {/* Cost columns */}
              <th className="px-4 py-3 text-left font-semibold whitespace-nowrap">Purch. Land</th>
              <th className="px-4 py-3 text-left font-semibold whitespace-nowrap">Purch. Ticket</th>
              <th className="px-4 py-3 text-left font-semibold whitespace-nowrap">Sell. Land</th>
              <th className="px-4 py-3 text-left font-semibold whitespace-nowrap">Sell. Ticket</th>
              <th className="px-4 py-3 text-left font-semibold whitespace-nowrap">Profit / Loss</th>
              <th className="px-4 py-3 text-left font-semibold whitespace-nowrap">Created At</th>
              <th className="px-4 py-3 text-left font-semibold whitespace-nowrap tour-deal-actions">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {paginatedDeals.length > 0 ? (
              paginatedDeals.map((deal, idx) => {
                const purchLand   = parseCost(deal.purchasingLandCost);
                const purchTicket = parseCost(deal.purchasingTicketCost);
                const sellLand    = parseCost(deal.sellingLandCost);
                const sellTicket  = parseCost(deal.sellingTicketCost);
                const totalPurch  = purchLand + purchTicket;
                const totalSell   = sellLand  + sellTicket;
                const profit      = totalSell - totalPurch;
                const hasProfit   = profit > 0;
                const hasLoss     = profit < 0;
                const hasCostData = totalPurch > 0 || totalSell > 0;

                return (
                  <tr key={deal._id}
                    className={`transition-colors ${selectedDeals.includes(deal._id) ? "bg-blue-50" : idx % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-blue-50`}>
                    <td className="px-4 py-3">
                      <input type="checkbox" onChange={() => handleCheckboxChange(deal._id)}
                        checked={selectedDeals.includes(deal._id)}
                        className="cursor-pointer w-4 h-4 accent-blue-600" />
                    </td>

                    <td className="px-4 py-3">
                      <button onClick={() => navigate(`/Pipelineview/${deal._id}`)}
                        className="text-blue-600 hover:text-blue-800 hover:underline font-medium tour-deal-name">
                        {deal.dealName || "-"}
                      </button>
                    </td>

                    <td className="px-4 py-3">{deal.assignedTo ? `${deal.assignedTo.firstName} ${deal.assignedTo.lastName}` : "-"}</td>

                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${stageBadge(deal.stage)}`}>{deal.stage || "-"}</span>
                    </td>

                    <td className="px-4 py-3 font-medium">{formatCurrencyValue(deal.value)}</td>

                    {/* ── Adults ── */}
                    <td className="px-4 py-3">
                      {deal.noOfAdults != null && deal.noOfAdults !== "" ? (
                        <span className="inline-flex items-center gap-1 text-gray-700">
                          <Users size={14} className="text-blue-400" />
                          {deal.noOfAdults}
                        </span>
                      ) : <span className="text-gray-300">—</span>}
                    </td>

                    {/* ── Children ── */}
                    <td className="px-4 py-3">
                      {deal.noOfChildren != null && deal.noOfChildren !== "" ? (
                        <span className="inline-flex items-center gap-1 text-gray-700">
                          <Users size={14} className="text-purple-400" />
                          {deal.noOfChildren}
                        </span>
                      ) : <span className="text-gray-300">—</span>}
                    </td>

                    {/* ── Travel Date ── */}
                    <td className="px-4 py-3">
                      {deal.travelDate ? (
                        <span className="inline-flex items-center gap-1 text-gray-700">
                          <Calendar size={14} className="text-gray-400" />
                          {formatDate(deal.travelDate)}
                        </span>
                      ) : <span className="text-gray-300">—</span>}
                    </td>

                    {/* Cost columns */}
                    <td className="px-4 py-3"><CostCell raw={deal.purchasingLandCost} /></td>
                    <td className="px-4 py-3"><CostCell raw={deal.purchasingTicketCost} /></td>
                    <td className="px-4 py-3"><CostCell raw={deal.sellingLandCost} /></td>
                    <td className="px-4 py-3"><CostCell raw={deal.sellingTicketCost} /></td>

                    {/* Profit / Loss */}
                    <td className="px-4 py-3">
                      {hasCostData ? (
                        <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${hasProfit ? "bg-emerald-100 text-emerald-700" : hasLoss ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-600"}`}>
                          {hasProfit ? <TrendingUp size={12} /> : hasLoss ? <TrendingDown size={12} /> : null}
                          {hasProfit ? "+" : hasLoss ? "-" : ""}
                          {new Intl.NumberFormat("en-IN").format(Math.abs(profit))}
                        </div>
                      ) : <span className="text-gray-300">—</span>}
                    </td>

                    <td className="px-4 py-3">{formatDate(deal.createdAt)}</td>

                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleEdit(deal)} title="Edit Deal"
                          className="p-1.5 rounded-md hover:bg-blue-100 text-blue-600 transition-colors">
                          <Edit size={16} />
                        </button>
                        <button onClick={() => handleDeleteClick(deal)} title="Delete Deal"
                          className="p-1.5 rounded-md hover:bg-red-100 text-red-600 transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={15} className="px-6 py-8 text-center text-gray-500">No deals found</td>
              </tr>
            )}
          </tbody>

          {/* Grand totals footer */}
          {filteredDeals.length > 0 && (
            <tfoot>
              <tr className="bg-gray-100 border-t-2 border-gray-300 font-semibold text-sm">
                <td colSpan={8} className="px-4 py-3 text-gray-700">Grand Total ({filteredDeals.length} deals)</td>
                <td className="px-4 py-3 text-gray-800">
                  {new Intl.NumberFormat("en-IN").format(filteredDeals.reduce((a, d) => a + parseCost(d.purchasingLandCost), 0))}
                </td>
                <td className="px-4 py-3 text-gray-800">
                  {new Intl.NumberFormat("en-IN").format(filteredDeals.reduce((a, d) => a + parseCost(d.purchasingTicketCost), 0))}
                </td>
                <td className="px-4 py-3 text-gray-800">
                  {new Intl.NumberFormat("en-IN").format(filteredDeals.reduce((a, d) => a + parseCost(d.sellingLandCost), 0))}
                </td>
                <td className="px-4 py-3 text-gray-800">
                  {new Intl.NumberFormat("en-IN").format(filteredDeals.reduce((a, d) => a + parseCost(d.sellingTicketCost), 0))}
                </td>
                <td className={`px-4 py-3 ${grandProfit >= 0 ? "text-emerald-700" : "text-red-700"}`}>
                  <div className="flex items-center gap-1">
                    {grandProfit >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                    {grandProfit >= 0 ? "+" : "-"}{new Intl.NumberFormat("en-IN").format(Math.abs(grandProfit))}
                  </div>
                </td>
                <td colSpan={2} className="px-4 py-3" />
              </tr>
            </tfoot>
          )}
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 flex-wrap gap-2">
          <p className="text-sm text-gray-600">
            Showing <span className="font-medium">{Math.min((safePage - 1) * itemsPerPage + 1, filteredDeals.length)}</span>–
            <span className="font-medium">{Math.min(safePage * itemsPerPage, filteredDeals.length)}</span> of{" "}
            <span className="font-medium">{filteredDeals.length}</span>
          </p>
          <div className="flex items-center gap-1">
            <button onClick={() => handlePageChange(1)} disabled={safePage === 1}
              className={`px-2.5 py-1.5 rounded-md border text-sm font-medium transition-colors ${safePage === 1 ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed" : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"}`}>«</button>
            <button onClick={() => handlePageChange(safePage - 1)} disabled={safePage === 1}
              className={`px-3 py-1.5 rounded-md border text-sm font-medium transition-colors ${safePage === 1 ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed" : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"}`}>Previous</button>
            {pageNumbers[0] > 1 && (
              <>
                <button onClick={() => handlePageChange(1)} className="px-3 py-1.5 rounded-md border text-sm font-medium bg-white text-gray-600 border-gray-300 hover:bg-gray-50">1</button>
                {pageNumbers[0] > 2 && <span className="px-1 py-1.5 text-gray-400 text-sm">…</span>}
              </>
            )}
            {pageNumbers.map((page) => (
              <button key={page} onClick={() => handlePageChange(page)}
                className={`px-3 py-1.5 rounded-md border text-sm font-medium transition-colors ${safePage === page ? "bg-blue-600 text-white border-blue-600 shadow-sm" : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"}`}>
                {page}
              </button>
            ))}
            {pageNumbers[pageNumbers.length - 1] < totalPages && (
              <>
                {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && <span className="px-1 py-1.5 text-gray-400 text-sm">…</span>}
                <button onClick={() => handlePageChange(totalPages)} className="px-3 py-1.5 rounded-md border text-sm font-medium bg-white text-gray-600 border-gray-300 hover:bg-gray-50">{totalPages}</button>
              </>
            )}
            <button onClick={() => handlePageChange(safePage + 1)} disabled={safePage === totalPages}
              className={`px-3 py-1.5 rounded-md border text-sm font-medium transition-colors ${safePage === totalPages ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed" : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"}`}>Next</button>
            <button onClick={() => handlePageChange(totalPages)} disabled={safePage === totalPages}
              className={`px-2.5 py-1.5 rounded-md border text-sm font-medium transition-colors ${safePage === totalPages ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed" : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"}`}>»</button>
          </div>
        </div>
      )}

      {/* Single Delete Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="max-w-sm p-6">
          <DialogHeader><DialogTitle>Confirm Delete</DialogTitle></DialogHeader>
          <p>Are you sure you want to delete <strong>{deleteDeal?.dealName}</strong>?</p>
          <div className="mt-6 flex justify-end space-x-3">
            <button onClick={() => setIsDeleteModalOpen(false)} className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300">Cancel</button>
            <button onClick={handleDeleteConfirm} disabled={isDeleting}
              className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 disabled:bg-red-400 disabled:cursor-not-allowed">
              {isDeleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Bulk Delete Modal */}
      <Dialog open={isBulkDeleteModalOpen} onOpenChange={setIsBulkDeleteModalOpen}>
        <DialogContent className="max-w-sm p-6">
          <DialogHeader><DialogTitle>Confirm Bulk Delete</DialogTitle></DialogHeader>
          <p>Are you sure you want to delete <strong>{selectedDeals.length}</strong> selected deal{selectedDeals.length > 1 ? "s" : ""}? This action cannot be undone.</p>
          <div className="mt-6 flex justify-end space-x-3">
            <button onClick={() => setIsBulkDeleteModalOpen(false)} disabled={isBulkDeleting}
              className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50">Cancel</button>
            <button onClick={handleBulkDeleteConfirm} disabled={isBulkDeleting}
              className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 disabled:bg-red-400 disabled:cursor-not-allowed flex items-center gap-2">
              {isBulkDeleting ? (
                <><span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Deleting...</>
              ) : (
                <><Trash2 size={15} /> Delete All</>
              )}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export const AllDeals = () => (
  <TourProvider
    steps={dealTourSteps}
    afterOpen={() => (document.body.style.overflow = "hidden")}
    beforeClose={() => (document.body.style.overflow = "unset")}
    showNumber={false}
    styles={{
      popover:  (base) => ({ ...base, backgroundColor: "#fff", color: "#1f1f1f" }),
      maskArea: (base) => ({ ...base, rx: 8 }),
      badge:    (base) => ({ ...base, display: "none" }),
      close:    (base) => ({ ...base, right: "auto", left: 8, top: 8 }),
    }}
  >
    <AllDealsComponent />
  </TourProvider>
);