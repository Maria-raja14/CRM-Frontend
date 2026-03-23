// import { useEffect, useState } from "react";
// import axios from "axios";
// import { toast } from "react-toastify";
// import { Edit, Trash2, Eye, Plus } from "lucide-react";
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

// function AllDealsComponent() {
//   const navigate = useNavigate();
//   const { setIsOpen, setSteps, setCurrentStep } = useTour();

//   const [deals, setDeals]                         = useState([]);
//   const [loading, setLoading]                     = useState(true);
//   const [currentPage, setCurrentPage]             = useState(1);
//   const [totalPages, setTotalPages]               = useState(1);
//   const [selectedDeals, setSelectedDeals]         = useState([]);
//   const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
//   const [deleteDeal, setDeleteDeal]               = useState(null);
//   const [users, setUsers]                         = useState([]);
//   const [userRole, setUserRole]                   = useState("");
//   const [filters, setFilters]                     = useState({ stage: "", assignedTo: "" });
//   const [searchTerm, setSearchTerm]               = useState("");
//   const [isDeleting, setIsDeleting]               = useState(false);
//   const [isBulkDeleting, setIsBulkDeleting]       = useState(false);

//   // ✅ NEW: Bulk delete confirmation modal state
//   const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);

//   const itemsPerPage = 10;

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     let role = "";
//     if (token) {
//       try {
//         const payload = JSON.parse(atob(token.split(".")[1]));
//         role = payload.role || "";
//       } catch (err) {
//         console.error("Error decoding token:", err);
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

//   const fetchDeals = async () => {
//     try {
//       setLoading(true);
//       const token = localStorage.getItem("token");
//       const res   = await axios.get(`${API_URL}/deals/getAll`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setDeals(res.data || []);
//       setTotalPages(Math.ceil((res.data?.length || 0) / itemsPerPage));
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
//     } catch (err) {
//       console.error("Fetch users error:", err);
//     }
//   };

//   useEffect(() => { fetchDeals(); fetchUsers(); }, []);

//   const formatDate = (date) =>
//     date
//       ? new Date(date).toLocaleDateString("en-US", {
//           month: "short", day: "numeric", year: "numeric",
//         })
//       : "-";

//   const handlePageChange = (newPage) => {
//     if (newPage > 0 && newPage <= totalPages) setCurrentPage(newPage);
//   };

//   const filteredDeals = deals
//     .filter((d) => d.dealName?.toLowerCase().includes(searchTerm.toLowerCase()))
//     .filter((d) => (filters.stage      ? d.stage           === filters.stage      : true))
//     .filter((d) => (filters.assignedTo ? d.assignedTo?._id === filters.assignedTo : true));

//   const paginatedDeals = filteredDeals.slice(
//     (currentPage - 1) * itemsPerPage,
//     currentPage * itemsPerPage
//   );

//   // ── Checkbox helpers ─────────────────────────────────────
//   const handleCheckboxChange = (id) =>
//     setSelectedDeals((prev) =>
//       prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]
//     );

//   // ✅ FIXED: Select All selects ALL filtered deals across all pages, not just current page
//   const handleSelectAll = (e) => {
//     if (e.target.checked) {
//       // Select ALL filtered deals (entire dataset, not just current page)
//       const allFilteredIds = filteredDeals.map((d) => d._id);
//       setSelectedDeals(allFilteredIds);
//     } else {
//       setSelectedDeals([]);
//     }
//   };

//   // ✅ FIXED: Check if ALL filtered deals are selected
//   const isAllSelected =
//     filteredDeals.length > 0 &&
//     filteredDeals.every((d) => selectedDeals.includes(d._id));

//   const isIndeterminate =
//     selectedDeals.length > 0 && !isAllSelected;

//   // ── Bulk Delete — ✅ FIXED: Both Admin AND Sales can bulk delete ─
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

//   // ── Single Delete ────────────────────────────────────────
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

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
//       </div>
//     );
//   }

//   return (
//     <div className="p-4">

//       {/* ── Header ─────────────────────────────────────────── */}
//       <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-3 tour-deals-header">
//         <h2 className="text-xl font-semibold text-gray-800">All Deals</h2>
//         <div className="flex items-center gap-3">
//           <button
//             onClick={startTour}
//             className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 tour-finish"
//           >
//             <Eye className="w-4 h-4" /> Take Tour
//           </button>
//           <button
//             onClick={() => navigate("/createDeal")}
//             className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 tour-create-deal"
//           >
//             <Plus className="w-4 h-4" /> Create Deal
//           </button>
//         </div>
//       </div>

//       {/* ── Filters ────────────────────────────────────────── */}
//       <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-3 tour-filters">
//         <div className="flex flex-wrap gap-4 items-center">
//           <select
//             value={filters.stage}
//             onChange={(e) => setFilters((prev) => ({ ...prev, stage: e.target.value }))}
//             className="border rounded-md px-4 py-2 bg-white text-sm"
//           >
//             <option value="">All Stages</option>
//             <option value="Qualification">Qualification</option>
//             <option value="Negotiation">Negotiation</option>
//             <option value="Proposal Sent">Proposal Sent</option>
//             <option value="Closed Won">Closed Won</option>
//             <option value="Closed Lost">Closed Lost</option>
//           </select>

//           <select
//             value={filters.assignedTo}
//             onChange={(e) => setFilters((prev) => ({ ...prev, assignedTo: e.target.value }))}
//             className="border rounded-md bg-white px-4 py-2 text-sm"
//           >
//             <option value="">All Assigned</option>
//             {users.map((u) => (
//               <option key={u._id} value={u._id}>
//                 {u.firstName} {u.lastName}
//               </option>
//             ))}
//           </select>

//           <input
//             type="text"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             placeholder="Search Deal Name..."
//             className="border rounded-full px-4 py-2 bg-white text-sm"
//           />
//         </div>
//       </div>

//       {/* ✅ FIXED: Bulk Delete Button — visible for BOTH Admin AND Sales when rows are selected */}
//       {selectedDeals.length > 0 && (
//         <div className="mb-3 flex items-center gap-3">
//           <span className="text-sm text-gray-600 font-medium">
//             {selectedDeals.length} deal{selectedDeals.length > 1 ? "s" : ""} selected
//           </span>
//           <button
//             onClick={handleBulkDelete}
//             disabled={isBulkDeleting}
//             className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-red-400 disabled:cursor-not-allowed text-sm font-medium flex items-center gap-2"
//           >
//             <Trash2 size={15} />
//             {isBulkDeleting
//               ? "Deleting..."
//               : `Delete Selected (${selectedDeals.length})`}
//           </button>
//           <button
//             onClick={() => setSelectedDeals([])}
//             className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
//           >
//             Clear selection
//           </button>
//         </div>
//       )}

//       {/* ── Table ──────────────────────────────────────────── */}
//       <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm tour-deals-table">
//         <table className="min-w-full text-sm text-gray-700">
//           <thead className="bg-gray-100">
//             <tr>
//               {/* ✅ FIXED: Select All checkbox — selects all filtered deals */}
//               <th className="px-4 py-3 w-10">
//                 <input
//                   type="checkbox"
//                   onChange={handleSelectAll}
//                   checked={isAllSelected}
//                   ref={(el) => {
//                     if (el) el.indeterminate = isIndeterminate;
//                   }}
//                   className="cursor-pointer w-4 h-4 accent-blue-600"
//                   title={isAllSelected ? "Deselect all" : "Select all"}
//                 />
//               </th>
//               <th className="px-6 py-3 text-left font-semibold">Deal Name</th>
//               <th className="px-6 py-3 text-left font-semibold">Assigned To</th>
//               <th className="px-6 py-3 text-left font-semibold">Stage</th>
//               <th className="px-6 py-3 text-left font-semibold">Value</th>
//               <th className="px-6 py-3 text-left font-semibold">Created At</th>
//               <th className="px-6 py-3 text-left font-semibold tour-deal-actions">Actions</th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-gray-200">
//             {paginatedDeals.length > 0 ? (
//               paginatedDeals.map((deal, idx) => (
//                 <tr
//                   key={deal._id}
//                   className={`${
//                     selectedDeals.includes(deal._id)
//                       ? "bg-blue-50"
//                       : idx % 2 === 0
//                       ? "bg-white"
//                       : "bg-gray-50"
//                   } hover:bg-blue-50 transition-colors`}
//                 >
//                   <td className="px-4 py-3">
//                     <input
//                       type="checkbox"
//                       onChange={() => handleCheckboxChange(deal._id)}
//                       checked={selectedDeals.includes(deal._id)}
//                       className="cursor-pointer w-4 h-4 accent-blue-600"
//                     />
//                   </td>

//                   <td className="px-6 py-4">
//                     <button
//                       onClick={() => navigate(`/Pipelineview/${deal._id}`)}
//                       className="text-blue-600 hover:text-blue-800 hover:underline font-medium tour-deal-name"
//                     >
//                       {deal.dealName || "-"}
//                     </button>
//                   </td>

//                   <td className="px-6 py-4">
//                     {deal.assignedTo
//                       ? `${deal.assignedTo.firstName} ${deal.assignedTo.lastName}`
//                       : "-"}
//                   </td>

//                   <td className="px-6 py-4">{deal.stage || "-"}</td>
//                   <td className="px-6 py-4">{formatCurrencyValue(deal.value)}</td>
//                   <td className="px-6 py-4">{formatDate(deal.createdAt)}</td>

//                   <td className="px-6 py-4">
//                     <div className="flex items-center gap-2">
//                       <button
//                         onClick={() => handleEdit(deal)}
//                         title="Edit Deal"
//                         className="p-1.5 rounded-md hover:bg-blue-100 text-blue-600 transition-colors"
//                       >
//                         <Edit size={16} />
//                       </button>
//                       <button
//                         onClick={() => handleDeleteClick(deal)}
//                         title="Delete Deal"
//                         className="p-1.5 rounded-md hover:bg-red-100 text-red-600 transition-colors"
//                       >
//                         <Trash2 size={16} />
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
//                   No deals found
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* ── Pagination ─────────────────────────────────────── */}
//       {totalPages > 1 && (
//         <div className="flex justify-between items-center mt-4">
//           <button
//             onClick={() => handlePageChange(currentPage - 1)}
//             disabled={currentPage === 1}
//             className="px-3 py-1 rounded border bg-white hover:bg-gray-100 disabled:opacity-50"
//           >
//             Previous
//           </button>
//           <span className="text-sm text-gray-600">
//             Page {currentPage} of {totalPages}
//           </span>
//           <button
//             onClick={() => handlePageChange(currentPage + 1)}
//             disabled={currentPage === totalPages}
//             className="px-3 py-1 rounded border bg-white hover:bg-gray-100 disabled:opacity-50"
//           >
//             Next
//           </button>
//         </div>
//       )}

//       {/* ── Single Delete Confirmation Modal ───────────────── */}
//       <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
//         <DialogContent className="max-w-sm p-6">
//           <DialogHeader>
//             <DialogTitle>Confirm Delete</DialogTitle>
//           </DialogHeader>
//           <p>
//             Are you sure you want to delete{" "}
//             <strong>{deleteDeal?.dealName}</strong>?
//           </p>
//           <div className="mt-6 flex justify-end space-x-3">
//             <button
//               onClick={() => setIsDeleteModalOpen(false)}
//               className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
//             >
//               Cancel
//             </button>
//             <button
//               onClick={handleDeleteConfirm}
//               disabled={isDeleting}
//               className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 disabled:bg-red-400 disabled:cursor-not-allowed"
//             >
//               {isDeleting ? "Deleting..." : "Delete"}
//             </button>
//           </div>
//         </DialogContent>
//       </Dialog>

//       {/* ✅ NEW: Bulk Delete Confirmation Modal */}
//       <Dialog open={isBulkDeleteModalOpen} onOpenChange={setIsBulkDeleteModalOpen}>
//         <DialogContent className="max-w-sm p-6">
//           <DialogHeader>
//             <DialogTitle>Confirm Bulk Delete</DialogTitle>
//           </DialogHeader>
//           <p>
//             Are you sure you want to delete{" "}
//             <strong>{selectedDeals.length}</strong> selected deal
//             {selectedDeals.length > 1 ? "s" : ""}? This action cannot be undone.
//           </p>
//           <div className="mt-6 flex justify-end space-x-3">
//             <button
//               onClick={() => setIsBulkDeleteModalOpen(false)}
//               disabled={isBulkDeleting}
//               className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
//             >
//               Cancel
//             </button>
//             <button
//               onClick={handleBulkDeleteConfirm}
//               disabled={isBulkDeleting}
//               className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 disabled:bg-red-400 disabled:cursor-not-allowed flex items-center gap-2"
//             >
//               {isBulkDeleting ? (
//                 <>
//                   <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
//                   Deleting...
//                 </>
//               ) : (
//                 <>
//                   <Trash2 size={15} />
//                   Delete All
//                 </>
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
//       popover:     (base) => ({ ...base, backgroundColor: "#fff", color: "#1f1f1f" }),
//       maskArea:    (base) => ({ ...base, rx: 8 }),
//       badge:       (base) => ({ ...base, display: "none" }),
//       close:       (base) => ({ ...base, right: "auto", left: 8, top: 8 }),
//       footer:      (base) => ({ ...base, justifyContent: "space-between" }),
//       buttonClose: (base) => ({ ...base, display: "none" }),
//     }}
//     footer={({ close }) => (
//       <div className="flex justify-between items-center w-full px-4 py-2 border-t border-gray-200">
//         <button
//           onClick={close}
//           className="text-gray-700 hover:text-gray-900 font-semibold"
//         >
//           Finish Tour
//         </button>
//         <div />
//       </div>
//     )}
//   >
//     <AllDealsComponent />
//   </TourProvider>
// );//original


import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Edit, Trash2, Eye, Plus } from "lucide-react";
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

  useEffect(() => {
    const token = localStorage.getItem("token");
    let role = "";
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        role = payload.role || "";
      } catch (err) {
        console.error("Error decoding token:", err);
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
    } catch (err) {
      console.error("Fetch users error:", err);
    }
  };

  useEffect(() => { fetchDeals(); fetchUsers(); }, []);

  const formatDate = (date) =>
    date
      ? new Date(date).toLocaleDateString("en-US", {
          month: "short", day: "numeric", year: "numeric",
        })
      : "-";

  // ── Filtered deals ───────────────────────────────────────
  const filteredDeals = deals
    .filter((d) => d.dealName?.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter((d) => (filters.stage      ? d.stage           === filters.stage      : true))
    .filter((d) => (filters.assignedTo ? d.assignedTo?._id === filters.assignedTo : true));

  // ── Pagination ───────────────────────────────────────────
  const totalPages   = Math.max(1, Math.ceil(filteredDeals.length / itemsPerPage));
  const safePage     = Math.min(currentPage, totalPages);
  const paginatedDeals = filteredDeals.slice(
    (safePage - 1) * itemsPerPage,
    safePage * itemsPerPage
  );

  // Reset to page 1 when filters change
  useEffect(() => { setCurrentPage(1); }, [searchTerm, filters]);

  // ── Page window (show max 5 page buttons) ────────────────
  const getPageNumbers = () => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const half  = 2;
    let start   = Math.max(1, safePage - half);
    let end     = Math.min(totalPages, safePage + half);
    if (safePage <= half + 1)           end   = Math.min(5, totalPages);
    if (safePage >= totalPages - half)  start = Math.max(1, totalPages - 4);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  // ── Checkbox helpers ─────────────────────────────────────
  const handleCheckboxChange = (id) =>
    setSelectedDeals((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]
    );

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedDeals(filteredDeals.map((d) => d._id));
    } else {
      setSelectedDeals([]);
    }
  };

  const isAllSelected =
    filteredDeals.length > 0 &&
    filteredDeals.every((d) => selectedDeals.includes(d._id));

  const isIndeterminate =
    selectedDeals.length > 0 && !isAllSelected;

  // ── Bulk Delete ──────────────────────────────────────────
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

  // ── Single Delete ────────────────────────────────────────
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

      {/* ── Header ─────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-3 tour-deals-header">
        <h2 className="text-xl font-semibold text-gray-800">All Deals</h2>
        <div className="flex items-center gap-3">
          <button
            onClick={startTour}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 tour-finish"
          >
            <Eye className="w-4 h-4" /> Take Tour
          </button>
          <button
            onClick={() => navigate("/createDeal")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 tour-create-deal"
          >
            <Plus className="w-4 h-4" /> Create Deal
          </button>
        </div>
      </div>

      {/* ── Filters ────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-3 tour-filters">
        <div className="flex flex-wrap gap-4 items-center">
          <select
            value={filters.stage}
            onChange={(e) => setFilters((prev) => ({ ...prev, stage: e.target.value }))}
            className="border rounded-md px-4 py-2 bg-white text-sm"
          >
            <option value="">All Stages</option>
            <option value="Qualification">Qualification</option>
            <option value="Negotiation">Negotiation</option>
            <option value="Proposal Sent">Proposal Sent</option>
            <option value="Closed Won">Closed Won</option>
            <option value="Closed Lost">Closed Lost</option>
          </select>

          <select
            value={filters.assignedTo}
            onChange={(e) => setFilters((prev) => ({ ...prev, assignedTo: e.target.value }))}
            className="border rounded-md bg-white px-4 py-2 text-sm"
          >
            <option value="">All Assigned</option>
            {users.map((u) => (
              <option key={u._id} value={u._id}>
                {u.firstName} {u.lastName}
              </option>
            ))}
          </select>

          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search Deal Name..."
            className="border rounded-full px-4 py-2 bg-white text-sm"
          />
        </div>
      </div>

      {/* ── Bulk Delete Bar ─────────────────────────────────── */}
      {selectedDeals.length > 0 && (
        <div className="mb-3 flex items-center gap-3 bg-red-50 border border-red-200 rounded-lg px-4 py-2.5">
          <span className="text-sm font-semibold text-red-700">
            {selectedDeals.length} deal{selectedDeals.length > 1 ? "s" : ""} selected
          </span>
          <button
            onClick={handleBulkDelete}
            disabled={isBulkDeleting}
            className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold px-4 py-1.5 rounded-lg transition shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <Trash2 size={15} />
            {isBulkDeleting ? "Deleting..." : `Delete Selected (${selectedDeals.length})`}
          </button>
          <button
            onClick={() => setSelectedDeals([])}
            className="ml-auto text-sm text-gray-500 hover:text-gray-700 underline"
          >
            Clear selection
          </button>
        </div>
      )}

      {/* ── Table ──────────────────────────────────────────── */}
      <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm tour-deals-table">
        <table className="min-w-full text-sm text-gray-700">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 w-10">
                <input
                  type="checkbox"
                  onChange={handleSelectAll}
                  checked={isAllSelected}
                  ref={(el) => { if (el) el.indeterminate = isIndeterminate; }}
                  className="cursor-pointer w-4 h-4 accent-blue-600"
                  title={isAllSelected ? "Deselect all" : "Select all"}
                />
              </th>
              <th className="px-6 py-3 text-left font-semibold">Deal Name</th>
              <th className="px-6 py-3 text-left font-semibold">Assigned To</th>
              <th className="px-6 py-3 text-left font-semibold">Stage</th>
              <th className="px-6 py-3 text-left font-semibold">Value</th>
              <th className="px-6 py-3 text-left font-semibold">Created At</th>
              <th className="px-6 py-3 text-left font-semibold tour-deal-actions">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {paginatedDeals.length > 0 ? (
              paginatedDeals.map((deal, idx) => (
                <tr
                  key={deal._id}
                  className={`transition-colors ${
                    selectedDeals.includes(deal._id)
                      ? "bg-blue-50"
                      : idx % 2 === 0
                      ? "bg-white"
                      : "bg-gray-50"
                  } hover:bg-blue-50`}
                >
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      onChange={() => handleCheckboxChange(deal._id)}
                      checked={selectedDeals.includes(deal._id)}
                      className="cursor-pointer w-4 h-4 accent-blue-600"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => navigate(`/Pipelineview/${deal._id}`)}
                      className="text-blue-600 hover:text-blue-800 hover:underline font-medium tour-deal-name"
                    >
                      {deal.dealName || "-"}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    {deal.assignedTo
                      ? `${deal.assignedTo.firstName} ${deal.assignedTo.lastName}`
                      : "-"}
                  </td>
                  <td className="px-6 py-4">{deal.stage || "-"}</td>
                  <td className="px-6 py-4">{formatCurrencyValue(deal.value)}</td>
                  <td className="px-6 py-4">{formatDate(deal.createdAt)}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(deal)}
                        title="Edit Deal"
                        className="p-1.5 rounded-md hover:bg-blue-100 text-blue-600 transition-colors"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(deal)}
                        title="Delete Deal"
                        className="p-1.5 rounded-md hover:bg-red-100 text-red-600 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                  No deals found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ── ✅ FIXED Pagination ─────────────────────────────── */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 flex-wrap gap-2">

          {/* Left: showing info */}
          <p className="text-sm text-gray-600">
            Showing{" "}
            <span className="font-medium">
              {Math.min((safePage - 1) * itemsPerPage + 1, filteredDeals.length)}
            </span>
            –
            <span className="font-medium">
              {Math.min(safePage * itemsPerPage, filteredDeals.length)}
            </span>
            {" "}of{" "}
            <span className="font-medium">{filteredDeals.length}</span>
          </p>

          {/* Right: page buttons */}
          <div className="flex items-center gap-1">

            {/* First page */}
            <button
              onClick={() => handlePageChange(1)}
              disabled={safePage === 1}
              title="First page"
              className={`px-2.5 py-1.5 rounded-md border text-sm font-medium transition-colors ${
                safePage === 1
                  ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                  : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
              }`}
            >«</button>

            {/* Previous page */}
            <button
              onClick={() => handlePageChange(safePage - 1)}
              disabled={safePage === 1}
              title="Previous page"
              className={`px-3 py-1.5 rounded-md border text-sm font-medium transition-colors ${
                safePage === 1
                  ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                  : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
              }`}
            >Previous</button>

            {/* First page ellipsis */}
            {pageNumbers[0] > 1 && (
              <>
                <button
                  onClick={() => handlePageChange(1)}
                  className="px-3 py-1.5 rounded-md border text-sm font-medium bg-white text-gray-600 border-gray-300 hover:bg-gray-50 transition-colors"
                >1</button>
                {pageNumbers[0] > 2 && (
                  <span className="px-1 py-1.5 text-gray-400 text-sm select-none">…</span>
                )}
              </>
            )}

            {/* Page number buttons */}
            {pageNumbers.map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-3 py-1.5 rounded-md border text-sm font-medium transition-colors ${
                  safePage === page
                    ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                    : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
                }`}
              >
                {page}
              </button>
            ))}

            {/* Last page ellipsis */}
            {pageNumbers[pageNumbers.length - 1] < totalPages && (
              <>
                {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
                  <span className="px-1 py-1.5 text-gray-400 text-sm select-none">…</span>
                )}
                <button
                  onClick={() => handlePageChange(totalPages)}
                  className="px-3 py-1.5 rounded-md border text-sm font-medium bg-white text-gray-600 border-gray-300 hover:bg-gray-50 transition-colors"
                >
                  {totalPages}
                </button>
              </>
            )}

            {/* Next page */}
            <button
              onClick={() => handlePageChange(safePage + 1)}
              disabled={safePage === totalPages}
              title="Next page"
              className={`px-3 py-1.5 rounded-md border text-sm font-medium transition-colors ${
                safePage === totalPages
                  ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                  : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
              }`}
            >Next</button>

            {/* Last page */}
            <button
              onClick={() => handlePageChange(totalPages)}
              disabled={safePage === totalPages}
              title="Last page"
              className={`px-2.5 py-1.5 rounded-md border text-sm font-medium transition-colors ${
                safePage === totalPages
                  ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                  : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
              }`}
            >»</button>

          </div>
        </div>
      )}

      {/* ── Single Delete Confirmation Modal ───────────────── */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="max-w-sm p-6">
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
          </DialogHeader>
          <p>
            Are you sure you want to delete{" "}
            <strong>{deleteDeal?.dealName}</strong>?
          </p>
          <div className="mt-6 flex justify-end space-x-3">
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 disabled:bg-red-400 disabled:cursor-not-allowed"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Bulk Delete Confirmation Modal ─────────────────── */}
      <Dialog open={isBulkDeleteModalOpen} onOpenChange={setIsBulkDeleteModalOpen}>
        <DialogContent className="max-w-sm p-6">
          <DialogHeader>
            <DialogTitle>Confirm Bulk Delete</DialogTitle>
          </DialogHeader>
          <p>
            Are you sure you want to delete{" "}
            <strong>{selectedDeals.length}</strong> selected deal
            {selectedDeals.length > 1 ? "s" : ""}? This action cannot be undone.
          </p>
          <div className="mt-6 flex justify-end space-x-3">
            <button
              onClick={() => setIsBulkDeleteModalOpen(false)}
              disabled={isBulkDeleting}
              className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleBulkDeleteConfirm}
              disabled={isBulkDeleting}
              className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 disabled:bg-red-400 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isBulkDeleting ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 size={15} />
                  Delete All
                </>
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
      popover:     (base) => ({ ...base, backgroundColor: "#fff", color: "#1f1f1f" }),
      maskArea:    (base) => ({ ...base, rx: 8 }),
      badge:       (base) => ({ ...base, display: "none" }),
      close:       (base) => ({ ...base, right: "auto", left: 8, top: 8 }),
      footer:      (base) => ({ ...base, justifyContent: "space-between" }),
      buttonClose: (base) => ({ ...base, display: "none" }),
    }}
  >
    <AllDealsComponent />
  </TourProvider>
);