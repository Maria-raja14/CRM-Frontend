// import React, { useState, useEffect } from "react";
// import ReactDOM from "react-dom";
// import DatePicker from "react-datepicker";
// import { FaCalendarAlt, FaEye, FaTrash, FaEdit } from "react-icons/fa";
// import { MdDeleteSweep } from "react-icons/md";
// import { Link, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import "react-datepicker/dist/react-datepicker.css";
// import { TourProvider, useTour } from "@reactour/tour";

// const STATUS_STYLES = {
//   draft:      "bg-orange-50 text-orange-700 border-orange-200",
//   sent:       "bg-blue-50 text-blue-700 border-blue-200",
//   "no reply": "bg-gray-50 text-gray-500 border-gray-200",
//   rejection:  "bg-red-50 text-red-600 border-red-200",
//   success:    "bg-green-50 text-green-700 border-green-200",
// };

// const PAGE_SIZE = 10;

// const tourSteps = [
//   { selector: ".tour-header",         content: "This is your proposal dashboard where you can manage all your proposals." },
//   { selector: ".tour-drafts",         content: "View your draft proposals that are not yet sent to clients." },
//   { selector: ".tour-new-proposal",   content: "Create a new proposal to send to your clients." },
//   { selector: ".tour-filters",        content: "Filter proposals by status, creation date, or search for specific proposals." },
//   { selector: ".tour-proposal-table", content: "This table lists all your proposals with their details." },
//   { selector: ".tour-deal-title",     content: "Click on a deal title to view the full proposal details." },
//   { selector: ".tour-status",         content: "Change the status of your proposals." },
//   { selector: ".tour-actions",        content: "Use the view, edit and delete icons to manage each proposal." },
//   { selector: ".tour-finish",         content: "You've completed the tour! Click 'Take Tour' anytime to review features again." },
// ];

// /* ─── Delete Confirmation Modal ────────────────────────────────────── */
// const DeleteModal = ({ proposal, isBulk, count, onCancel, onConfirm }) => (
//   <div
//     style={{
//       position: "fixed", inset: 0, background: "rgba(15,23,42,0.45)",
//       display: "flex", alignItems: "center", justifyContent: "center",
//       zIndex: 99999, backdropFilter: "blur(4px)",
//       animation: "dmOvIn 0.15s ease",
//     }}
//     onClick={onCancel}
//   >
//     <style>{`
//       @keyframes dmOvIn  { from { opacity:0 } to { opacity:1 } }
//       @keyframes dmBoxIn { from { transform:scale(.84); opacity:0 } to { transform:scale(1); opacity:1 } }
//     `}</style>
//     <div
//       style={{
//         background: "#fff", borderRadius: 18, padding: "32px 36px",
//         maxWidth: 420, width: "90%", textAlign: "center",
//         boxShadow: "0 28px 72px rgba(15,23,42,0.22)",
//         animation: "dmBoxIn 0.2s cubic-bezier(.34,1.56,.64,1)",
//       }}
//       onClick={(e) => e.stopPropagation()}
//     >
//       <div style={{
//         width: 64, height: 64, borderRadius: "50%",
//         background: "linear-gradient(135deg,#fee2e2,#fecaca)",
//         display: "flex", alignItems: "center", justifyContent: "center",
//         margin: "0 auto 18px", fontSize: 28,
//       }}>🗑️</div>

//       <h2 style={{ fontFamily: "Georgia, serif", fontSize: 20, fontWeight: 700, color: "#0f172a", marginBottom: 10 }}>
//         {isBulk ? "Delete Selected Proposals?" : "Delete Proposal?"}
//       </h2>

//       <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.65, marginBottom: 8 }}>
//         {isBulk
//           ? `You are about to permanently delete ${count} selected proposal(s).`
//           : "You are about to delete:"}
//       </p>

//       {!isBulk && (
//         <p style={{
//           fontSize: 14, fontWeight: 600, color: "#334155",
//           background: "#f8fafc", border: "1px solid #e2e8f0",
//           borderRadius: 8, padding: "8px 14px", marginBottom: 24,
//           fontFamily: "system-ui, sans-serif",
//         }}>
//           "{proposal?.title}"
//         </p>
//       )}

//       <p style={{ fontSize: 13, color: "#94a3b8", marginBottom: 26, lineHeight: 1.5 }}>
//         This action is permanent and cannot be undone.
//       </p>

//       <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
//         <button
//           onClick={onCancel}
//           style={{
//             padding: "10px 26px", borderRadius: 10,
//             border: "1.5px solid #e2e8f0", background: "transparent",
//             color: "#64748b", fontSize: 14, fontWeight: 600,
//             cursor: "pointer", fontFamily: "system-ui, sans-serif",
//             transition: "background 0.13s",
//           }}
//           onMouseEnter={(e) => e.currentTarget.style.background = "#f1f5f9"}
//           onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
//         >
//           Cancel
//         </button>
//         <button
//           onClick={onConfirm}
//           style={{
//             padding: "10px 26px", borderRadius: 10, border: "none",
//             background: "linear-gradient(135deg,#ef4444,#dc2626)",
//             color: "#fff", fontSize: 14, fontWeight: 600,
//             cursor: "pointer", fontFamily: "system-ui, sans-serif",
//             boxShadow: "0 4px 14px rgba(239,68,68,0.38)",
//             transition: "opacity 0.13s",
//           }}
//           onMouseEnter={(e) => e.currentTarget.style.opacity = "0.88"}
//           onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}
//         >
//           Yes, Delete
//         </button>
//       </div>
//     </div>
//   </div>
// );

// /* ═══════════════════════════════════════════════════════════════════ */
// const ProposalHeadContent = () => {
//   const API_URL = import.meta.env.VITE_API_URL;

//   const [proposals,         setProposals]         = useState([]);
//   const [loading,           setLoading]           = useState(false);
//   const [searchTerm,        setSearchTerm]        = useState("");
//   const [filterStatus,      setFilterStatus]      = useState("");
//   const [filterCreatedDate, setFilterCreatedDate] = useState(null);
//   const [currentPage,       setCurrentPage]       = useState(1);
//   const [draftCount,        setDraftCount]        = useState(0);

//   // Single delete
//   const [deleteTarget,      setDeleteTarget]      = useState(null);

//   // Bulk selection
//   const [selectedIds,       setSelectedIds]       = useState(new Set());
//   const [bulkDeleteOpen,    setBulkDeleteOpen]    = useState(false);

//   const navigate = useNavigate();
//   const { setIsOpen, setCurrentStep } = useTour();

//   /* ── Fetch ── */
//   const fetchProposals = async () => {
//     setLoading(true);
//     try {
//       const { data } = await axios.get(`${API_URL}/proposal/getall`);
//       setProposals(data);
//       setDraftCount(data.filter((p) => p.status === "draft").length);
//     } catch {
//       toast.error("Failed to load proposals.");
//     }
//     setLoading(false);
//   };

//   useEffect(() => { fetchProposals(); }, []);

//   /* ── Status change ── */
//   const handleStatusChange = async (id, newStatus) => {
//     try {
//       await axios.put(`${API_URL}/proposal/updatestatus/${id}`, { status: newStatus });
//       setProposals((prev) =>
//         prev.map((p) => p._id === id ? { ...p, status: newStatus } : p)
//       );
//       const old = proposals.find((p) => p._id === id);
//       if (newStatus === "draft" && old?.status !== "draft") setDraftCount((n) => n + 1);
//       if (newStatus !== "draft" && old?.status === "draft") setDraftCount((n) => n - 1);
//       toast.success(`Status updated to "${newStatus}"`);
//     } catch {
//       toast.error("Failed to update status.");
//     }
//   };

//   /* ── Single delete confirm ── */
//   const confirmDelete = async () => {
//     if (!deleteTarget) return;
//     const { _id: id, status } = deleteTarget;
//     setDeleteTarget(null);
//     try {
//       await axios.delete(`${API_URL}/proposal/delete/${id}`);
//       setProposals((prev) => prev.filter((p) => p._id !== id));
//       setSelectedIds((prev) => { const s = new Set(prev); s.delete(id); return s; });
//       if (status === "draft") setDraftCount((n) => n - 1);
//       toast.success("Proposal deleted successfully.");
//     } catch {
//       toast.error("Failed to delete proposal.");
//     }
//   };

//   /* ── Bulk delete confirm ── */
//   const confirmBulkDelete = async () => {
//     setBulkDeleteOpen(false);
//     const ids = Array.from(selectedIds);
//     try {
//       await axios.delete(`${API_URL}/proposal/deletemany`, { data: { ids } });
//       const deletedDraftCount = proposals.filter(
//         (p) => ids.includes(p._id) && p.status === "draft"
//       ).length;
//       setProposals((prev) => prev.filter((p) => !ids.includes(p._id)));
//       setDraftCount((n) => n - deletedDraftCount);
//       setSelectedIds(new Set());
//       toast.success(`${ids.length} proposal(s) deleted.`);
//     } catch {
//       toast.error("Bulk delete failed.");
//     }
//   };

//   /* ── Edit ── */
//   const handleEdit = async (id) => {
//     try {
//       const { data: proposal } = await axios.get(`${API_URL}/proposal/${id}`);
//       navigate("/proposal/sendproposal", { state: { proposal, isEditing: true } });
//     } catch {
//       toast.error("Failed to load proposal for editing.");
//     }
//   };

//   /* ── Checkbox helpers ── */
//   const toggleSelect = (id) => {
//     setSelectedIds((prev) => {
//       const s = new Set(prev);
//       s.has(id) ? s.delete(id) : s.add(id);
//       return s;
//     });
//   };

//   /* ── Filters ── */
//   const filtered = proposals.filter((p) => {
//     const s = searchTerm.toLowerCase();
//     const matchSearch =
//       p.title?.toLowerCase().includes(s) ||
//       p.email?.toLowerCase().includes(s) ||
//       p.dealTitle?.toLowerCase().includes(s);
//     const matchStatus = !filterStatus || p.status === filterStatus;
//     const matchDate   = !filterCreatedDate ||
//       (p.createdAt &&
//         new Date(p.createdAt).toLocaleDateString() ===
//         new Date(filterCreatedDate).toLocaleDateString());
//     return matchSearch && matchStatus && matchDate;
//   });

//   const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
//   const paginated  = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

//   const allOnPageSelected =
//     paginated.length > 0 && paginated.every((p) => selectedIds.has(p._id));
//   const someOnPageSelected =
//     paginated.some((p) => selectedIds.has(p._id)) && !allOnPageSelected;

//   const toggleSelectAllPage = () => {
//     if (allOnPageSelected) {
//       setSelectedIds((prev) => {
//         const s = new Set(prev);
//         paginated.forEach((p) => s.delete(p._id));
//         return s;
//       });
//     } else {
//       setSelectedIds((prev) => {
//         const s = new Set(prev);
//         paginated.forEach((p) => s.add(p._id));
//         return s;
//       });
//     }
//   };

//   return (
//     <div className="min-h-screen py-8 px-4 md:px-10">

//       {/* ── Single Delete Modal ── */}
//       {deleteTarget && ReactDOM.createPortal(
//         <DeleteModal
//           proposal={deleteTarget}
//           isBulk={false}
//           onCancel={() => setDeleteTarget(null)}
//           onConfirm={confirmDelete}
//         />,
//         document.body
//       )}

//       {/* ── Bulk Delete Modal ── */}
//       {bulkDeleteOpen && ReactDOM.createPortal(
//         <DeleteModal
//           isBulk={true}
//           count={selectedIds.size}
//           onCancel={() => setBulkDeleteOpen(false)}
//           onConfirm={confirmBulkDelete}
//         />,
//         document.body
//       )}

//       {/* Header */}
//       <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 tour-header">
//         <h1 className="text-2xl font-bold text-gray-800">Proposal List</h1>
//         <div className="flex gap-3 flex-wrap">
//           <button
//             onClick={() => { setIsOpen(true); setCurrentStep(0); }}
//             className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 tour-finish"
//           >
//             <FaEye className="w-4 h-4" /> Take Tour
//           </button>
//           <Link to="/proposal/drafts" className="tour-drafts">
//             <button className="bg-gray-600 text-white px-5 py-2 rounded-lg shadow hover:bg-gray-700 transition">
//               Drafts ({draftCount})
//             </button>
//           </Link>
//           <Link to="/proposal/sendproposal" className="tour-new-proposal">
//             <button className="bg-blue-600 text-white px-5 py-2 rounded-lg shadow hover:bg-blue-700 transition">
//               + New Proposal
//             </button>
//           </Link>
//         </div>
//       </div>

//       {/* Filters */}
//       <div className="flex flex-col md:flex-row gap-4 mb-4 items-center tour-filters flex-wrap">
//         <select
//           value={filterStatus}
//           onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1); }}
//           className="border rounded-md px-4 py-2 bg-white focus:ring-2 focus:ring-blue-400"
//         >
//           <option value="">All Status</option>
//           <option value="draft">Draft</option>
//           <option value="sent">Sent</option>
//           <option value="no reply">No Reply</option>
//           <option value="rejection">Rejection</option>
//           <option value="success">Success</option>
//         </select>

//         <div className="relative">
//           <FaCalendarAlt className="absolute left-3 top-3 text-gray-400 z-10 pointer-events-none" />
//           <DatePicker
//             selected={filterCreatedDate}
//             onChange={(d) => { setFilterCreatedDate(d); setCurrentPage(1); }}
//             placeholderText="Created Date"
//             className="border rounded-md bg-white pl-9 pr-3 py-2 focus:ring-2 focus:ring-blue-400"
//           />
//         </div>

//         <input
//           type="text"
//           value={searchTerm}
//           onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
//           placeholder="Search by title, email, or deal"
//           className="border rounded-full px-4 py-2 bg-white focus:ring-2 focus:ring-blue-400 md:w-1/3"
//         />
//       </div>

//       {/* Bulk Delete Action Bar — visible when items selected */}
//       {selectedIds.size > 0 && (
//         <div className="flex items-center gap-3 mb-3 bg-red-50 border border-red-200 rounded-lg px-4 py-2.5">
//           <span className="text-sm font-semibold text-red-700">
//             {selectedIds.size} proposal(s) selected
//           </span>
//           <button
//             onClick={() => setBulkDeleteOpen(true)}
//             className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold px-4 py-1.5 rounded-lg transition shadow-sm"
//           >
//             <MdDeleteSweep className="text-lg" />
//             Delete Selected
//           </button>
//           <button
//             onClick={() => setSelectedIds(new Set())}
//             className="ml-auto text-sm text-gray-500 hover:text-gray-700 underline"
//           >
//             Clear selection
//           </button>
//         </div>
//       )}

//       {/* Table */}
//       <div className="overflow-x-auto bg-white shadow rounded-lg tour-proposal-table">
//         {loading ? (
//           <div className="text-center py-10 text-gray-400">Loading proposals…</div>
//         ) : (
//           <table className="min-w-full border-collapse text-sm">
//             <thead className="bg-gray-100 sticky top-0">
//               <tr>
//                 <th className="px-4 py-3 w-10 text-center">
//                   <input
//                     type="checkbox"
//                     checked={allOnPageSelected}
//                     ref={(el) => { if (el) el.indeterminate = someOnPageSelected; }}
//                     onChange={toggleSelectAllPage}
//                     className="w-4 h-4 accent-blue-600 cursor-pointer"
//                     title="Select / deselect all on this page"
//                   />
//                 </th>
//                 <th className="px-4 py-2 text-left font-medium text-gray-700">Title</th>
//                 <th className="px-4 py-2 text-left font-medium text-gray-700">Deal Title</th>
//                 <th className="px-4 py-2 text-left font-medium text-gray-700">Email</th>
//                 <th className="px-4 py-2 text-left font-medium text-gray-700">Status</th>
//                 <th className="px-4 py-2 text-left font-medium text-gray-700 tour-actions">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {paginated.length === 0 ? (
//                 <tr>
//                   <td colSpan="6" className="text-center py-8 text-gray-400">
//                     No proposals found
//                   </td>
//                 </tr>
//               ) : (
//                 paginated.map((proposal) => (
//                   <tr
//                     key={proposal._id}
//                     className={`border-b transition-colors ${
//                       selectedIds.has(proposal._id)
//                         ? "bg-blue-50"
//                         : "hover:bg-gray-50"
//                     }`}
//                   >
//                     {/* Checkbox */}
//                     <td className="px-4 py-3 text-center">
//                       <input
//                         type="checkbox"
//                         checked={selectedIds.has(proposal._id)}
//                         onChange={() => toggleSelect(proposal._id)}
//                         className="w-4 h-4 accent-blue-600 cursor-pointer"
//                       />
//                     </td>

//                     <td className="px-4 py-3 font-medium text-gray-800">{proposal.title}</td>

//                     <td className="px-4 py-3 text-blue-600 hover:underline cursor-pointer tour-deal-title">
//                       <Link to={`/proposal/view/${proposal._id}`}>
//                         {proposal.dealTitle || "No Deal"}
//                       </Link>
//                     </td>

//                     <td className="px-4 py-3 text-gray-600">{proposal.email}</td>

//                     <td className="px-4 py-3 tour-status">
//                       <select
//                         value={proposal.status}
//                         onChange={(e) => handleStatusChange(proposal._id, e.target.value)}
//                         className={`border px-2 py-1 rounded text-xs font-medium ${STATUS_STYLES[proposal.status]}`}
//                       >
//                         <option value="draft">Draft</option>
//                         <option value="sent">Sent</option>
//                         <option value="no reply">No Reply</option>
//                         <option value="rejection">Rejection</option>
//                         <option value="success">Success</option>
//                       </select>
//                     </td>

//                     {/* Actions — icon buttons (no dropdown) */}
//                     <td className="px-4 py-3">
//                       <div className="flex items-center gap-1">
//                         {/* View */}
//                         <button
//                           onClick={() => navigate(`/proposal/view/${proposal._id}`)}
//                           title="View"
//                           className="p-2 rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition"
//                         >
//                           <FaEye className="w-3.5 h-3.5" />
//                         </button>

//                         {/* Edit */}
//                         <button
//                           onClick={() => handleEdit(proposal._id)}
//                           title="Edit"
//                           className="p-2 rounded-md text-blue-500 hover:bg-blue-50 hover:text-blue-700 transition"
//                         >
//                           <FaEdit className="w-3.5 h-3.5" />
//                         </button>

//                         {/* Delete */}
//                         <button
//                           onClick={() => setDeleteTarget(proposal)}
//                           title="Delete"
//                           className="p-2 rounded-md text-red-400 hover:bg-red-50 hover:text-red-600 transition"
//                         >
//                           <FaTrash className="w-3.5 h-3.5" />
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         )}
//       </div>

//       {/* Pagination */}
//       {totalPages > 1 && (
//         <div className="flex justify-center items-center gap-2 mt-6">
//           <button
//             onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
//             disabled={currentPage === 1}
//             className={`px-3 py-1.5 rounded-lg border text-sm transition ${
//               currentPage === 1
//                 ? "bg-gray-100 text-gray-400 cursor-not-allowed"
//                 : "bg-white text-gray-700 hover:bg-gray-50 border-gray-300"
//             }`}
//           >Prev</button>

//           {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
//             <button
//               key={page}
//               onClick={() => setCurrentPage(page)}
//               className={`px-3 py-1.5 rounded-lg text-sm transition ${
//                 currentPage === page
//                   ? "bg-blue-600 text-white font-medium shadow-sm"
//                   : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
//               }`}
//             >
//               {page}
//             </button>
//           ))}

//           <button
//             onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
//             disabled={currentPage === totalPages}
//             className={`px-3 py-1.5 rounded-lg border text-sm transition ${
//               currentPage === totalPages
//                 ? "bg-gray-100 text-gray-400 cursor-not-allowed"
//                 : "bg-white text-gray-700 hover:bg-gray-50 border-gray-300"
//             }`}
//           >Next</button>
//         </div>
//       )}

//       <ToastContainer position="top-right" autoClose={3000} />
//     </div>
//   );
// };

// /* ─── Wrapper with Tour ─────────────────────────────────────────────── */
// const ProposalHead = () => (
//   <TourProvider
//     steps={tourSteps}
//     afterOpen={() => (document.body.style.overflow = "hidden")}
//     beforeClose={() => (document.body.style.overflow = "unset")}
//     disableInteraction={true}
//     styles={{
//       popover:  (base) => ({ ...base, backgroundColor: "#fff", color: "#1f1f1f", borderRadius: "12px" }),
//       maskArea: (base) => ({ ...base, rx: 8 }),
//       badge:    (base) => ({ ...base, display: "none" }),
//       close:    (base) => ({ ...base, right: "auto", left: 8, top: 8 }),
//       controls: (base) => ({ ...base, marginTop: 16 }),
//     }}
//   >
//     <ProposalHeadContent />
//   </TourProvider>
// );

// export default ProposalHead;//original


import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import DatePicker from "react-datepicker";
import { FaCalendarAlt, FaEye, FaTrash, FaEdit } from "react-icons/fa";
import { MdDeleteSweep } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-datepicker/dist/react-datepicker.css";
import { TourProvider, useTour } from "@reactour/tour";

const STATUS_STYLES = {
  draft:      "bg-orange-50 text-orange-700 border-orange-200",
  sent:       "bg-blue-50 text-blue-700 border-blue-200",
  "no reply": "bg-gray-50 text-gray-500 border-gray-200",
  rejection:  "bg-red-50 text-red-600 border-red-200",
  success:    "bg-green-50 text-green-700 border-green-200",
};

const PAGE_SIZE = 10;

const tourSteps = [
  { selector: ".tour-header",         content: "This is your proposal dashboard where you can manage all your proposals." },
  { selector: ".tour-drafts",         content: "View your draft proposals that are not yet sent to clients." },
  { selector: ".tour-new-proposal",   content: "Create a new proposal to send to your clients." },
  { selector: ".tour-filters",        content: "Filter proposals by status, creation date, or search for specific proposals." },
  { selector: ".tour-proposal-table", content: "This table lists all your proposals with their details." },
  { selector: ".tour-deal-title",     content: "Click on a deal title to view the full proposal details." },
  { selector: ".tour-status",         content: "Change the status of your proposals." },
  { selector: ".tour-actions",        content: "Use the view, edit and delete icons to manage each proposal." },
  { selector: ".tour-finish",         content: "You've completed the tour! Click 'Take Tour' anytime to review features again." },
];

/* ─── Delete Confirmation Modal ────────────────────────────────────── */
const DeleteModal = ({ proposal, isBulk, count, onCancel, onConfirm }) => (
  <div
    style={{
      position: "fixed", inset: 0, background: "rgba(15,23,42,0.45)",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 99999, backdropFilter: "blur(4px)",
      animation: "dmOvIn 0.15s ease",
    }}
    onClick={onCancel}
  >
    <style>{`
      @keyframes dmOvIn  { from { opacity:0 } to { opacity:1 } }
      @keyframes dmBoxIn { from { transform:scale(.84); opacity:0 } to { transform:scale(1); opacity:1 } }
    `}</style>
    <div
      style={{
        background: "#fff", borderRadius: 18, padding: "32px 36px",
        maxWidth: 420, width: "90%", textAlign: "center",
        boxShadow: "0 28px 72px rgba(15,23,42,0.22)",
        animation: "dmBoxIn 0.2s cubic-bezier(.34,1.56,.64,1)",
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <div style={{
        width: 64, height: 64, borderRadius: "50%",
        background: "linear-gradient(135deg,#fee2e2,#fecaca)",
        display: "flex", alignItems: "center", justifyContent: "center",
        margin: "0 auto 18px", fontSize: 28,
      }}>🗑️</div>

      <h2 style={{ fontFamily: "Georgia, serif", fontSize: 20, fontWeight: 700, color: "#0f172a", marginBottom: 10 }}>
        {isBulk ? "Delete Selected Proposals?" : "Delete Proposal?"}
      </h2>

      <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.65, marginBottom: 8 }}>
        {isBulk
          ? `You are about to permanently delete ${count} selected proposal(s).`
          : "You are about to delete:"}
      </p>

      {!isBulk && (
        <p style={{
          fontSize: 14, fontWeight: 600, color: "#334155",
          background: "#f8fafc", border: "1px solid #e2e8f0",
          borderRadius: 8, padding: "8px 14px", marginBottom: 24,
          fontFamily: "system-ui, sans-serif",
        }}>
          "{proposal?.title}"
        </p>
      )}

      <p style={{ fontSize: 13, color: "#94a3b8", marginBottom: 26, lineHeight: 1.5 }}>
        This action is permanent and cannot be undone.
      </p>

      <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
        <button
          onClick={onCancel}
          style={{
            padding: "10px 26px", borderRadius: 10,
            border: "1.5px solid #e2e8f0", background: "transparent",
            color: "#64748b", fontSize: 14, fontWeight: 600,
            cursor: "pointer", fontFamily: "system-ui, sans-serif",
            transition: "background 0.13s",
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = "#f1f5f9"}
          onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          style={{
            padding: "10px 26px", borderRadius: 10, border: "none",
            background: "linear-gradient(135deg,#ef4444,#dc2626)",
            color: "#fff", fontSize: 14, fontWeight: 600,
            cursor: "pointer", fontFamily: "system-ui, sans-serif",
            boxShadow: "0 4px 14px rgba(239,68,68,0.38)",
            transition: "opacity 0.13s",
          }}
          onMouseEnter={(e) => e.currentTarget.style.opacity = "0.88"}
          onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}
        >
          Yes, Delete
        </button>
      </div>
    </div>
  </div>
);

/* ─── Pagination Component ──────────────────────────────────────────── */
const Pagination = ({ currentPage, totalPages, totalItems, pageSize, onPageChange }) => {
  if (totalPages <= 1) return null;

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem   = Math.min(currentPage * pageSize, totalItems);

  // Build page number array with ellipsis logic
  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");
      const start = Math.max(2, currentPage - 1);
      const end   = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  const btnBase = {
    display: "inline-flex", alignItems: "center", justifyContent: "center",
    minWidth: 36, height: 36, padding: "0 10px",
    borderRadius: 8, border: "1px solid #e2e8f0",
    fontSize: 13, fontWeight: 500, cursor: "pointer",
    transition: "all 0.15s", fontFamily: "system-ui, sans-serif",
    background: "#fff", color: "#374151",
  };

  const btnActive = {
    ...btnBase,
    background: "#2563eb", color: "#fff",
    border: "1px solid #2563eb",
    boxShadow: "0 2px 8px rgba(37,99,235,0.25)",
    fontWeight: 700,
  };

  const btnDisabled = {
    ...btnBase,
    background: "#f9fafb", color: "#d1d5db",
    cursor: "not-allowed", border: "1px solid #f3f4f6",
  };

  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      marginTop: 20, flexWrap: "wrap", gap: 12,
    }}>
      {/* Showing X – Y of Z */}
      <span style={{ fontSize: 13, color: "#6b7280", fontFamily: "system-ui, sans-serif" }}>
        Showing{" "}
        <strong style={{ color: "#111827", fontWeight: 700 }}>{startItem}</strong>
        {" – "}
        <strong style={{ color: "#111827", fontWeight: 700 }}>{endItem}</strong>
        {" of "}
        <strong style={{ color: "#111827", fontWeight: 700 }}>{totalItems}</strong>
      </span>

      {/* Controls */}
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        {/* « First */}
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          style={currentPage === 1 ? btnDisabled : btnBase}
          title="First page"
        >«</button>

        {/* Previous */}
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          style={currentPage === 1 ? btnDisabled : btnBase}
        >Previous</button>

        {/* Page numbers */}
        {getPageNumbers().map((page, idx) =>
          page === "..." ? (
            <span
              key={`ellipsis-${idx}`}
              style={{ minWidth: 36, textAlign: "center", color: "#9ca3af", fontSize: 13 }}
            >…</span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              style={currentPage === page ? btnActive : btnBase}
              onMouseEnter={(e) => {
                if (currentPage !== page) {
                  e.currentTarget.style.background = "#f3f4f6";
                  e.currentTarget.style.borderColor = "#d1d5db";
                }
              }}
              onMouseLeave={(e) => {
                if (currentPage !== page) {
                  e.currentTarget.style.background = "#fff";
                  e.currentTarget.style.borderColor = "#e2e8f0";
                }
              }}
            >{page}</button>
          )
        )}

        {/* Next */}
        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          style={currentPage === totalPages ? btnDisabled : btnBase}
        >Next</button>

        {/* » Last */}
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          style={currentPage === totalPages ? btnDisabled : btnBase}
          title="Last page"
        >»</button>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════ */
const ProposalHeadContent = () => {
  const API_URL = import.meta.env.VITE_API_URL;

  const [proposals,         setProposals]         = useState([]);
  const [loading,           setLoading]           = useState(false);
  const [searchTerm,        setSearchTerm]        = useState("");
  const [filterStatus,      setFilterStatus]      = useState("");
  const [filterCreatedDate, setFilterCreatedDate] = useState(null);
  const [currentPage,       setCurrentPage]       = useState(1);
  const [draftCount,        setDraftCount]        = useState(0);

  // Single delete
  const [deleteTarget,      setDeleteTarget]      = useState(null);

  // Bulk selection
  const [selectedIds,       setSelectedIds]       = useState(new Set());
  const [bulkDeleteOpen,    setBulkDeleteOpen]    = useState(false);

  const navigate = useNavigate();
  const { setIsOpen, setCurrentStep } = useTour();

  /* ── Fetch ── */
  const fetchProposals = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API_URL}/proposal/getall`);
      setProposals(data);
      setDraftCount(data.filter((p) => p.status === "draft").length);
    } catch {
      toast.error("Failed to load proposals.");
    }
    setLoading(false);
  };

  useEffect(() => { fetchProposals(); }, []);

  /* ── Status change ── */
  const handleStatusChange = async (id, newStatus) => {
    const old = proposals.find((p) => p._id === id);
    try {
      await axios.put(`${API_URL}/proposal/updatestatus/${id}`, { status: newStatus });
      setProposals((prev) =>
        prev.map((p) => p._id === id ? { ...p, status: newStatus } : p)
      );
      if (newStatus === "draft" && old?.status !== "draft") setDraftCount((n) => n + 1);
      if (newStatus !== "draft" && old?.status === "draft") setDraftCount((n) => n - 1);
      toast.success(`Status updated to "${newStatus}"`);
    } catch {
      toast.error("Failed to update status.");
    }
  };

  /* ── Single delete confirm ── */
  const confirmDelete = async () => {
    if (!deleteTarget) return;
    const { _id: id, status } = deleteTarget;
    setDeleteTarget(null);
    try {
      await axios.delete(`${API_URL}/proposal/delete/${id}`);
      setProposals((prev) => prev.filter((p) => p._id !== id));
      setSelectedIds((prev) => { const s = new Set(prev); s.delete(id); return s; });
      if (status === "draft") setDraftCount((n) => n - 1);
      toast.success("Proposal deleted successfully.");
    } catch {
      toast.error("Failed to delete proposal.");
    }
  };

  /* ── Bulk delete confirm ── */
  const confirmBulkDelete = async () => {
    setBulkDeleteOpen(false);
    const ids = Array.from(selectedIds);
    try {
      await axios.delete(`${API_URL}/proposal/deletemany`, { data: { ids } });
      const deletedDraftCount = proposals.filter(
        (p) => ids.includes(p._id) && p.status === "draft"
      ).length;
      setProposals((prev) => prev.filter((p) => !ids.includes(p._id)));
      setDraftCount((n) => n - deletedDraftCount);
      setSelectedIds(new Set());
      toast.success(`${ids.length} proposal(s) deleted.`);
    } catch {
      toast.error("Bulk delete failed.");
    }
  };

  /* ── Edit ── */
  const handleEdit = async (id) => {
    try {
      const { data: proposal } = await axios.get(`${API_URL}/proposal/${id}`);
      navigate("/proposal/sendproposal", { state: { proposal, isEditing: true } });
    } catch {
      toast.error("Failed to load proposal for editing.");
    }
  };

  /* ── Checkbox helpers ── */
  const toggleSelect = (id) => {
    setSelectedIds((prev) => {
      const s = new Set(prev);
      s.has(id) ? s.delete(id) : s.add(id);
      return s;
    });
  };

  /* ── Filters — reset to page 1 whenever any filter changes ── */
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleStatusFilter = (e) => {
    setFilterStatus(e.target.value);
    setCurrentPage(1);
  };

  const handleDateFilter = (date) => {
    setFilterCreatedDate(date);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setFilterStatus("");
    setFilterCreatedDate(null);
    setCurrentPage(1);
  };

  /* ── Derived filtered list ── */
  const filtered = proposals.filter((p) => {
    const s = searchTerm.trim().toLowerCase();

    // Search: match title, email, or dealTitle (all optional fields)
    const matchSearch = !s || (
      (p.title     && p.title.toLowerCase().includes(s)) ||
      (p.email     && p.email.toLowerCase().includes(s)) ||
      (p.dealTitle && p.dealTitle.toLowerCase().includes(s))
    );

    // Status filter: exact match
    const matchStatus = !filterStatus || p.status === filterStatus;

    // Date filter: compare only the date portion (ignoring time)
    const matchDate = !filterCreatedDate || (() => {
      if (!p.createdAt) return false;
      const propDate   = new Date(p.createdAt);
      const filterDate = new Date(filterCreatedDate);
      return (
        propDate.getFullYear() === filterDate.getFullYear() &&
        propDate.getMonth()    === filterDate.getMonth()    &&
        propDate.getDate()     === filterDate.getDate()
      );
    })();

    return matchSearch && matchStatus && matchDate;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));

  // Clamp currentPage in case filters reduce total pages
  const safePage  = Math.min(currentPage, totalPages);
  const paginated = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const allOnPageSelected =
    paginated.length > 0 && paginated.every((p) => selectedIds.has(p._id));
  const someOnPageSelected =
    paginated.some((p) => selectedIds.has(p._id)) && !allOnPageSelected;

  const toggleSelectAllPage = () => {
    if (allOnPageSelected) {
      setSelectedIds((prev) => {
        const s = new Set(prev);
        paginated.forEach((p) => s.delete(p._id));
        return s;
      });
    } else {
      setSelectedIds((prev) => {
        const s = new Set(prev);
        paginated.forEach((p) => s.add(p._id));
        return s;
      });
    }
  };

  const hasActiveFilters = searchTerm || filterStatus || filterCreatedDate;

  return (
    <div className="min-h-screen py-8 px-4 md:px-10">

      {/* ── Single Delete Modal ── */}
      {deleteTarget && ReactDOM.createPortal(
        <DeleteModal
          proposal={deleteTarget}
          isBulk={false}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={confirmDelete}
        />,
        document.body
      )}

      {/* ── Bulk Delete Modal ── */}
      {bulkDeleteOpen && ReactDOM.createPortal(
        <DeleteModal
          isBulk={true}
          count={selectedIds.size}
          onCancel={() => setBulkDeleteOpen(false)}
          onConfirm={confirmBulkDelete}
        />,
        document.body
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 tour-header">
        <h1 className="text-2xl font-bold text-gray-800">Proposal List</h1>
        <div className="flex gap-3 flex-wrap">
          <button
            onClick={() => { setIsOpen(true); setCurrentStep(0); }}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 tour-finish"
          >
            <FaEye className="w-4 h-4" /> Take Tour
          </button>
          <Link to="/proposal/drafts" className="tour-drafts">
            <button className="bg-gray-600 text-white px-5 py-2 rounded-lg shadow hover:bg-gray-700 transition">
              Drafts ({draftCount})
            </button>
          </Link>
          <Link to="/proposal/sendproposal" className="tour-new-proposal">
            <button className="bg-blue-600 text-white px-5 py-2 rounded-lg shadow hover:bg-blue-700 transition">
              + New Proposal
            </button>
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-4 items-center tour-filters flex-wrap">
        <select
          value={filterStatus}
          onChange={handleStatusFilter}
          className="border rounded-md px-4 py-2 bg-white focus:ring-2 focus:ring-blue-400"
        >
          <option value="">All Status</option>
          <option value="draft">Draft</option>
          <option value="sent">Sent</option>
          <option value="no reply">No Reply</option>
          <option value="rejection">Rejection</option>
          <option value="success">Success</option>
        </select>

        <div className="relative">
          <FaCalendarAlt className="absolute left-3 top-3 text-gray-400 z-10 pointer-events-none" />
          <DatePicker
            selected={filterCreatedDate}
            onChange={handleDateFilter}
            placeholderText="Created Date"
            className="border rounded-md bg-white pl-9 pr-3 py-2 focus:ring-2 focus:ring-blue-400"
            isClearable
          />
        </div>

        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search by title, email, or deal"
          className="border rounded-full px-4 py-2 bg-white focus:ring-2 focus:ring-blue-400 md:w-1/3"
        />

        {/* Clear filters button */}
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-red-500 hover:text-red-700 underline whitespace-nowrap"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Bulk Delete Action Bar */}
      {selectedIds.size > 0 && (
        <div className="flex items-center gap-3 mb-3 bg-red-50 border border-red-200 rounded-lg px-4 py-2.5">
          <span className="text-sm font-semibold text-red-700">
            {selectedIds.size} proposal(s) selected
          </span>
          <button
            onClick={() => setBulkDeleteOpen(true)}
            className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold px-4 py-1.5 rounded-lg transition shadow-sm"
          >
            <MdDeleteSweep className="text-lg" />
            Delete Selected
          </button>
          <button
            onClick={() => setSelectedIds(new Set())}
            className="ml-auto text-sm text-gray-500 hover:text-gray-700 underline"
          >
            Clear selection
          </button>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto bg-white shadow rounded-lg tour-proposal-table">
        {loading ? (
          <div className="text-center py-10 text-gray-400">Loading proposals…</div>
        ) : (
          <table className="min-w-full border-collapse text-sm">
            <thead className="bg-gray-100 sticky top-0">
              <tr>
                <th className="px-4 py-3 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={allOnPageSelected}
                    ref={(el) => { if (el) el.indeterminate = someOnPageSelected; }}
                    onChange={toggleSelectAllPage}
                    className="w-4 h-4 accent-blue-600 cursor-pointer"
                    title="Select / deselect all on this page"
                  />
                </th>
                <th className="px-4 py-2 text-left font-medium text-gray-700">Title</th>
                <th className="px-4 py-2 text-left font-medium text-gray-700">Deal Title</th>
                <th className="px-4 py-2 text-left font-medium text-gray-700">Email</th>
                <th className="px-4 py-2 text-left font-medium text-gray-700">Status</th>
                <th className="px-4 py-2 text-left font-medium text-gray-700 tour-actions">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-gray-400">
                    {hasActiveFilters
                      ? "No proposals match your filters."
                      : "No proposals found."}
                  </td>
                </tr>
              ) : (
                paginated.map((proposal) => (
                  <tr
                    key={proposal._id}
                    className={`border-b transition-colors ${
                      selectedIds.has(proposal._id)
                        ? "bg-blue-50"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    {/* Checkbox */}
                    <td className="px-4 py-3 text-center">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(proposal._id)}
                        onChange={() => toggleSelect(proposal._id)}
                        className="w-4 h-4 accent-blue-600 cursor-pointer"
                      />
                    </td>

                    <td className="px-4 py-3 font-medium text-gray-800">{proposal.title}</td>

                    <td className="px-4 py-3 text-blue-600 hover:underline cursor-pointer tour-deal-title">
                      <Link to={`/proposal/view/${proposal._id}`}>
                        {proposal.dealTitle || "No Deal"}
                      </Link>
                    </td>

                    <td className="px-4 py-3 text-gray-600">{proposal.email}</td>

                    <td className="px-4 py-3 tour-status">
                      <select
                        value={proposal.status}
                        onChange={(e) => handleStatusChange(proposal._id, e.target.value)}
                        className={`border px-2 py-1 rounded text-xs font-medium ${STATUS_STYLES[proposal.status]}`}
                      >
                        <option value="draft">Draft</option>
                        <option value="sent">Sent</option>
                        <option value="no reply">No Reply</option>
                        <option value="rejection">Rejection</option>
                        <option value="success">Success</option>
                      </select>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => navigate(`/proposal/view/${proposal._id}`)}
                          title="View"
                          className="p-2 rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition"
                        >
                          <FaEye className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleEdit(proposal._id)}
                          title="Edit"
                          className="p-2 rounded-md text-blue-500 hover:bg-blue-50 hover:text-blue-700 transition"
                        >
                          <FaEdit className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => setDeleteTarget(proposal)}
                          title="Delete"
                          className="p-2 rounded-md text-red-400 hover:bg-red-50 hover:text-red-600 transition"
                        >
                          <FaTrash className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* ── Pagination ── */}
      <Pagination
        currentPage={safePage}
        totalPages={totalPages}
        totalItems={filtered.length}
        pageSize={PAGE_SIZE}
        onPageChange={setCurrentPage}
      />

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

/* ─── Wrapper with Tour ─────────────────────────────────────────────── */
const ProposalHead = () => (
  <TourProvider
    steps={tourSteps}
    afterOpen={() => (document.body.style.overflow = "hidden")}
    beforeClose={() => (document.body.style.overflow = "unset")}
    disableInteraction={true}
    styles={{
      popover:  (base) => ({ ...base, backgroundColor: "#fff", color: "#1f1f1f", borderRadius: "12px" }),
      maskArea: (base) => ({ ...base, rx: 8 }),
      badge:    (base) => ({ ...base, display: "none" }),
      close:    (base) => ({ ...base, right: "auto", left: 8, top: 8 }),
      controls: (base) => ({ ...base, marginTop: 16 }),
    }}
  >
    <ProposalHeadContent />
  </TourProvider>
);

export default ProposalHead;