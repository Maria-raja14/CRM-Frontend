

// import React, { useState, useEffect, useRef } from "react";
// import DatePicker from "react-datepicker";
// import {
//   FaEllipsisV,
//   FaRupeeSign,
//   FaDollarSign,
//   FaEuroSign,
//   FaPoundSign,
//   FaChevronLeft,
//   FaChevronRight,
// } from "react-icons/fa";
// import { MdDeleteSweep } from "react-icons/md";
// import { useModal } from "../../context/ModalContext.jsx";
// import InvoiceModal from "./InvoiceModal.jsx";
// import axios from "axios";
// import ReactDOM from "react-dom";
// import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
// import "react-datepicker/dist/react-datepicker.css";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "../../components/ui/dialog";
// import toast, { Toaster } from "react-hot-toast";
// import { useNavigate } from "react-router-dom";

// const ITEMS_PER_PAGE = 10;

// const InvoiceHead = () => {
//   const API_URL = import.meta.env.VITE_API_URL;

//   const { openModal } = useModal();
//   const [startDate, setStartDate] = useState(null);
//   const [invoices, setInvoices] = useState([]);
//   const [filteredInvoices, setFilteredInvoices] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filterAssignTo, setFilterAssignTo] = useState("");
//   const [filterStatus, setFilterStatus] = useState("");
//   const [filterMethod, setFilterMethod] = useState("");
//   const [openIndex, setOpenIndex] = useState(null);
//   const [sendingEmailId, setSendingEmailId] = useState(null);
//   const [refreshTrigger, setRefreshTrigger] = useState(0);
//   const [editingInvoice, setEditingInvoice] = useState(null);
//   const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
//   const [invoiceToDelete, setInvoiceToDelete] = useState(null);
//   const [dropdownButton, setDropdownButton] = useState(null);

//   const [selectedIds, setSelectedIds] = useState(new Set());
//   const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);

//   const [currentPage, setCurrentPage] = useState(1);

//   const [emailModalOpen, setEmailModalOpen] = useState(false);
//   const [emailMessage, setEmailMessage] = useState("Sending invoice email...");
//   const [emailStatus, setEmailStatus] = useState("loading");

//   const [downloadingId, setDownloadingId] = useState(null);

//   const dropdownRef = useRef(null);
//   const currencyScrollRef = useRef(null);
//   const navigate = useNavigate();

//   const user = JSON.parse(localStorage.getItem("user"));

//   useEffect(() => {
//     fetchInvoices();
//   }, [refreshTrigger]);

//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
//         setOpenIndex(null);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   // Reset to page 1 whenever filters change
//   useEffect(() => {
//     applyFilters();
//     setCurrentPage(1);
//   }, [searchTerm, startDate, filterAssignTo, filterStatus, filterMethod, invoices]);

//   const groupedTotals = filteredInvoices.reduce((acc, inv) => {
//     const cur   = inv.currency || "INR";
//     const total = Number(inv.total) || 0;
//     const paid  = inv.status === "paid" ? total : 0;
//     const due   = inv.status !== "paid" ? total : 0;
//     if (!acc[cur]) acc[cur] = { totalAmount: 0, totalPaid: 0, totalDue: 0, count: 0, paidCount: 0, dueCount: 0 };
//     acc[cur].totalAmount += total;
//     acc[cur].totalPaid   += paid;
//     acc[cur].totalDue    += due;
//     acc[cur].count       += 1;
//     inv.status === "paid" ? acc[cur].paidCount++ : acc[cur].dueCount++;
//     return acc;
//   }, {});

//   const fetchInvoices = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const response = await axios.get(
//         `${API_URL}/invoice/getInvoice?assignTo=${user?._id}`,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       const all = response.data.invoices || response.data || [];
//       setInvoices(all);
//       setFilteredInvoices(all);
//     } catch (error) {
//       toast.error("Error fetching invoices!");
//       console.error("Error fetching invoices:", error.response?.data || error);
//     }
//   };

//   const handleSendEmail = async (invoiceId) => {
//     try {
//       setSendingEmailId(invoiceId);
//       setEmailModalOpen(true);
//       setEmailStatus("loading");
//       setEmailMessage("📨 Sending invoice email...");
//       await axios.post(`${API_URL}/invoice/sendEmail/${invoiceId}`);
//       setEmailStatus("success");
//       setEmailMessage("✅ Invoice sent to customer email!");
//     } catch (error) {
//       setEmailStatus("error");
//       setEmailMessage("❌ Failed to send email. Please try again.");
//       toast.error("Failed to send invoice email.");
//     } finally {
//       setSendingEmailId(null);
//       setOpenIndex(null);
//       setTimeout(() => setEmailModalOpen(false), 2000);
//     }
//   };

//   // ── Fixed date filter: compare year/month/day to avoid timezone mismatches ──
//   const isSameLocalDate = (dateA, dateB) => {
//     const a = new Date(dateA);
//     const b = new Date(dateB);
//     return (
//       a.getFullYear() === b.getFullYear() &&
//       a.getMonth()    === b.getMonth()    &&
//       a.getDate()     === b.getDate()
//     );
//   };

//   const applyFilters = () => {
//     let filtered = invoices;

//     if (searchTerm.trim()) {
//       const s = searchTerm.trim().toLowerCase();
//       filtered = filtered.filter(
//         (inv) => inv.invoicenumber?.toLowerCase().includes(s)
//       );
//     }

//     // ✅ Fixed: use isSameLocalDate instead of toDateString() to avoid timezone drift
//     if (startDate) {
//       filtered = filtered.filter(
//         (inv) => inv.createdAt && isSameLocalDate(inv.createdAt, startDate)
//       );
//     }

//     if (filterAssignTo) {
//       filtered = filtered.filter((inv) => inv.assignTo?._id === filterAssignTo);
//     }

//     if (filterStatus) {
//       filtered = filtered.filter((inv) => inv.status === filterStatus);
//     }

//     if (filterMethod) {
//       filtered = filtered.filter((inv) => inv.paymentMethod === filterMethod);
//     }

//     setFilteredInvoices(filtered);
//   };

//   const handleDelete = async (invoiceId) => {
//     try {
//       await axios.delete(`${API_URL}/invoice/delete/${invoiceId}`);
//       toast.success("Invoice deleted successfully!");
//       setRefreshTrigger((prev) => prev + 1);
//       setDeleteConfirmOpen(false);
//       setSelectedIds((prev) => { const s = new Set(prev); s.delete(invoiceId); return s; });
//     } catch (error) {
//       toast.error("Failed to delete invoice.");
//     }
//   };

//   const handleEdit = (invoice) => { setEditingInvoice(invoice); openModal(); setOpenIndex(null); };
//   const confirmDelete = (invoice) => { setInvoiceToDelete(invoice); setDeleteConfirmOpen(true); setOpenIndex(null); };
//   const handleInvoiceSaved = () => { setRefreshTrigger((prev) => prev + 1); setEditingInvoice(null); };

//   const downloadInvoice = async (invoiceId, invoiceNumber) => {
//     if (downloadingId === invoiceId) return;
//     const toastId = toast.loading(`Downloading Invoice ${invoiceNumber}...`);
//     try {
//       setDownloadingId(invoiceId);
//       setOpenIndex(null);
//       const response = await axios.get(`${API_URL}/invoice/download/${invoiceId}`, {
//         responseType: "blob",
//       });
//       const url  = window.URL.createObjectURL(new Blob([response.data], { type: "application/pdf" }));
//       const link = document.createElement("a");
//       link.href  = url;
//       link.setAttribute("download", `Invoice_${invoiceNumber}.pdf`);
//       document.body.appendChild(link);
//       link.click();
//       link.remove();
//       window.URL.revokeObjectURL(url);
//       toast.success(`Invoice ${invoiceNumber} downloaded!`, { id: toastId });
//     } catch (error) {
//       toast.error("Failed to download invoice.", { id: toastId });
//     } finally {
//       setDownloadingId(null);
//     }
//   };

//   const toggleSelect = (id) => {
//     setSelectedIds((prev) => {
//       const s = new Set(prev);
//       s.has(id) ? s.delete(id) : s.add(id);
//       return s;
//     });
//   };

//   const totalCount    = filteredInvoices.length;
//   const totalPages    = Math.max(1, Math.ceil(totalCount / ITEMS_PER_PAGE));
//   const startIndex    = (currentPage - 1) * ITEMS_PER_PAGE;
//   const endIndex      = startIndex + ITEMS_PER_PAGE;
//   const pagedInvoices = filteredInvoices.slice(startIndex, endIndex);

//   const allOnPageSelected =
//     pagedInvoices.length > 0 && pagedInvoices.every((inv) => selectedIds.has(inv._id));
//   const someOnPageSelected =
//     pagedInvoices.some((inv) => selectedIds.has(inv._id)) && !allOnPageSelected;

//   const toggleSelectAll = () => {
//     if (allOnPageSelected) {
//       setSelectedIds((prev) => {
//         const s = new Set(prev);
//         pagedInvoices.forEach((inv) => s.delete(inv._id));
//         return s;
//       });
//     } else {
//       setSelectedIds((prev) => {
//         const s = new Set(prev);
//         pagedInvoices.forEach((inv) => s.add(inv._id));
//         return s;
//       });
//     }
//   };

//   const confirmBulkDelete = async () => {
//     setBulkDeleteOpen(false);
//     const ids = Array.from(selectedIds);
//     try {
//       await axios.delete(`${API_URL}/invoice/deletemany`, { data: { ids } });
//       setInvoices((prev)         => prev.filter((inv) => !ids.includes(inv._id)));
//       setFilteredInvoices((prev) => prev.filter((inv) => !ids.includes(inv._id)));
//       setSelectedIds(new Set());
//       toast.success(`${ids.length} invoice(s) deleted.`);
//       setCurrentPage((p) => {
//         const newTotal = totalCount - ids.length;
//         const newTotalPages = Math.max(1, Math.ceil(newTotal / ITEMS_PER_PAGE));
//         return p > newTotalPages ? newTotalPages : p;
//       });
//     } catch {
//       toast.error("Bulk delete failed.");
//     }
//   };

//   const getCurrencyIcon = (c) => {
//     const map = {
//       INR: <FaRupeeSign className="text-indigo-600" />,
//       USD: <FaDollarSign className="text-teal-600" />,
//       EUR: <FaEuroSign className="text-rose-600" />,
//       GBP: <FaPoundSign className="text-amber-600" />,
//     };
//     return map[c] || <FaDollarSign className="text-gray-600" />;
//   };
//   const getCurrencyBgColor   = (c) => ({ INR: "bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200", USD: "bg-gradient-to-br from-teal-50 to-teal-100 border-teal-200", EUR: "bg-gradient-to-br from-rose-50 to-rose-100 border-rose-200", GBP: "bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200" }[c] || "bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200");
//   const getCurrencyTextColor = (c) => ({ INR: "text-indigo-800", USD: "text-teal-800", EUR: "text-rose-800", GBP: "text-amber-800" }[c] || "text-gray-800");

//   const scrollLeft  = () => currencyScrollRef.current?.scrollBy({ left: -300, behavior: "smooth" });
//   const scrollRight = () => currencyScrollRef.current?.scrollBy({ left:  300, behavior: "smooth" });

//   const handleInvoiceClick = (id) => navigate(`/invoice/${id}`);

//   const getPageNumbers = () => {
//     if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
//     const pages = [];
//     if (currentPage <= 4) {
//       pages.push(1, 2, 3, 4, 5, "...", totalPages);
//     } else if (currentPage >= totalPages - 3) {
//       pages.push(1, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
//     } else {
//       pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
//     }
//     return pages;
//   };

//   return (
//     <div className="p-4">
//       <Toaster position="top-right" toastOptions={{ duration: 3000 }} />

//       {/* Bulk Delete Confirm Portal */}
//       {bulkDeleteOpen && ReactDOM.createPortal(
//         <div
//           style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 99999, backdropFilter: "blur(4px)" }}
//           onClick={() => setBulkDeleteOpen(false)}
//         >
//           <div
//             style={{ background: "#fff", borderRadius: 18, padding: "32px 36px", maxWidth: 420, width: "90%", textAlign: "center", boxShadow: "0 28px 72px rgba(15,23,42,0.22)" }}
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div style={{ width: 64, height: 64, borderRadius: "50%", background: "linear-gradient(135deg,#fee2e2,#fecaca)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 18px", fontSize: 28 }}>🗑️</div>
//             <h2 style={{ fontSize: 20, fontWeight: 700, color: "#0f172a", marginBottom: 10 }}>Delete Selected Invoices?</h2>
//             <p style={{ fontSize: 14, color: "#64748b", marginBottom: 8 }}>
//               You are about to permanently delete <strong>{selectedIds.size}</strong> invoice(s).
//             </p>
//             <p style={{ fontSize: 13, color: "#94a3b8", marginBottom: 26 }}>This action cannot be undone.</p>
//             <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
//               <button onClick={() => setBulkDeleteOpen(false)} style={{ padding: "10px 26px", borderRadius: 10, border: "1.5px solid #e2e8f0", background: "transparent", color: "#64748b", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Cancel</button>
//               <button onClick={confirmBulkDelete} style={{ padding: "10px 26px", borderRadius: 10, border: "none", background: "linear-gradient(135deg,#ef4444,#dc2626)", color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer", boxShadow: "0 4px 14px rgba(239,68,68,0.38)" }}>Yes, Delete</button>
//             </div>
//           </div>
//         </div>,
//         document.body
//       )}

//       {/* Header */}
//       <div className="flex justify-between items-center">
//         <h1 className="text-2xl font-semibold">Invoices</h1>
//         {user?.role?.name?.toLowerCase() === "admin" && (
//           <button onClick={() => { setEditingInvoice(null); openModal(); }} className="bg-[#4466f2] p-2 px-4 text-white rounded-sm">
//             Create invoices
//           </button>
//         )}
//       </div>

//       <InvoiceModal onInvoiceSaved={handleInvoiceSaved} editingInvoice={editingInvoice} />

//       {/* Financial Summary Cards */}
//       <div className="mb-8">
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-xl font-semibold text-gray-800">Financial Summary</h2>
//           {Object.keys(groupedTotals).length > 0 && (
//             <div className="flex space-x-2 mt-2">
//               <button onClick={scrollLeft}  className="p-2 rounded-full bg-white border hover:bg-gray-50 shadow-sm"><FaChevronLeft  className="text-gray-600" /></button>
//               <button onClick={scrollRight} className="p-2 rounded-full bg-white border hover:bg-gray-50 shadow-sm"><FaChevronRight className="text-gray-600" /></button>
//             </div>
//           )}
//         </div>

//         {Object.keys(groupedTotals).length === 0 ? (
//           <div className="bg-white p-8 rounded-xl shadow-sm border text-center">
//             <p className="text-gray-500">No invoice data available</p>
//             <p className="text-gray-400 text-sm mt-1">Create your first invoice to see financial insights</p>
//           </div>
//         ) : (
//           <div className="relative">
//             <div ref={currencyScrollRef} className="flex overflow-x-auto pb-4 -mx-2 px-2" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
//               {Object.entries(groupedTotals).map(([currency, data]) => (
//                 <div key={currency} className={`${getCurrencyBgColor(currency)} flex-shrink-0 w-80 p-6 rounded-xl shadow-sm border relative overflow-hidden mx-2 transition-transform hover:scale-[1.02] hover:shadow-md`}>
//                   <div className="flex justify-between items-start mb-5">
//                     <div>
//                       <h3 className={`text-lg font-semibold ${getCurrencyTextColor(currency)} mb-1`}>{currency}</h3>
//                       <p className="text-sm text-gray-500">{data.count} invoice{data.count !== 1 ? "s" : ""}</p>
//                     </div>
//                     <div className="text-2xl p-2 bg-white rounded-lg shadow-sm">{getCurrencyIcon(currency)}</div>
//                   </div>
//                   <div className="space-y-3 mb-5">
//                     <div className="flex justify-between items-center">
//                       <span className="text-sm font-medium text-gray-600">Total Amount</span>
//                       <span className="font-semibold text-gray-800">{data.totalAmount.toLocaleString()} {currency}</span>
//                     </div>
//                     <div className="flex justify-between items-center">
//                       <span className="text-sm font-medium text-gray-600">Paid ({data.paidCount})</span>
//                       <span className="font-semibold text-green-600">{data.totalPaid.toLocaleString()} {currency}</span>
//                     </div>
//                     <div className="flex justify-between items-center">
//                       <span className="text-sm font-medium text-gray-600">Due ({data.dueCount})</span>
//                       <span className="font-semibold text-rose-600">{data.totalDue.toLocaleString()} {currency}</span>
//                     </div>
//                   </div>
//                   <div className="mb-2">
//                     <div className="w-full bg-gray-200 rounded-full h-2">
//                       <div className="bg-green-500 h-2 rounded-full transition-all duration-500" style={{ width: `${data.totalAmount > 0 ? (data.totalPaid / data.totalAmount) * 100 : 0}%` }} />
//                     </div>
//                     <div className="flex justify-between text-xs text-gray-500 mt-1">
//                       <span>{Math.round((data.totalPaid / data.totalAmount) * 100)}% Paid</span>
//                       <span>{Math.round((data.totalDue / data.totalAmount) * 100)}% Due</span>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Filters */}
//       <div className="flex flex-wrap gap-4 mt-8 items-center justify-between">
//         <div className="flex flex-wrap gap-4">
//           {/* ✅ isClearable lets users reset the date picker easily */}
//           <DatePicker
//             selected={startDate}
//             onChange={(date) => setStartDate(date)}
//             className="px-4 py-2 rounded-md border bg-white focus:ring-2 focus:ring-blue-400"
//             placeholderText="Filter by Date"
//             dateFormat="dd/MM/yyyy"
//             isClearable
//           />
//           <select className="px-4 py-2 rounded-md bg-white border text-gray-600" value={filterAssignTo} onChange={(e) => setFilterAssignTo(e.target.value)}>
//             <option value="">All Users</option>
//             {[...new Set(invoices.map((inv) => inv.assignTo?._id))].map((userId) => {
//               const u = invoices.find((inv) => inv.assignTo?._id === userId)?.assignTo;
//               return <option key={userId} value={userId}>{u ? `${u.firstName} ${u.lastName}` : "Unknown"}</option>;
//             })}
//           </select>
//           <select className="px-4 py-2 rounded-md bg-white border text-gray-600" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
//             <option value="">All Status</option>
//             <option value="paid">Paid</option>
//             <option value="unpaid">Unpaid</option>
//           </select>
//         </div>
//         <div className="flex items-center border rounded-full bg-white px-3 w-[250px]">
//           <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
//           <input
//             type="text"
//             placeholder="Search Invoice #"
//             className="ml-2 w-full py-2 rounded-full outline-none text-gray-700"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//         </div>
//       </div>

//       {/* Bulk Delete Action Bar */}
//       {selectedIds.size > 0 && (
//         <div className="flex items-center gap-3 mt-4 bg-red-50 border border-red-200 rounded-lg px-4 py-2.5">
//           <span className="text-sm font-semibold text-red-700">{selectedIds.size} invoice(s) selected</span>
//           <button
//             onClick={() => setBulkDeleteOpen(true)}
//             className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold px-4 py-1.5 rounded-lg transition shadow-sm"
//           >
//             <MdDeleteSweep className="text-lg" />
//             Delete Selected
//           </button>
//           <button onClick={() => setSelectedIds(new Set())} className="ml-auto text-sm text-gray-500 hover:text-gray-700 underline">
//             Clear selection
//           </button>
//         </div>
//       )}

//       {/* Table */}
//       <div className="bg-white mt-4 rounded-xl shadow-md overflow-x-auto">
//         <table className="w-full text-sm text-left">
//           <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
//             <tr>
//               <th className="px-4 py-3 w-10 text-center">
//                 <input
//                   type="checkbox"
//                   checked={allOnPageSelected}
//                   ref={(el) => { if (el) el.indeterminate = someOnPageSelected; }}
//                   onChange={toggleSelectAll}
//                   className="w-4 h-4 accent-blue-600 cursor-pointer"
//                   title="Select / deselect all on this page"
//                 />
//               </th>
//               <th className="px-6 py-3">Invoice</th>
//               <th className="px-6 py-3">Deal Name</th>
//               <th className="px-6 py-3">Status</th>
//               <th className="px-6 py-3">Amount</th>
//               <th className="px-6 py-3">Assigned To</th>
//               <th className="px-6 py-3">Due Date</th>
//               <th className="px-6 py-3 text-center">Action</th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-gray-200">
//             {pagedInvoices.map((invoice, index) => (
//               <tr key={invoice._id} className={`transition-colors ${selectedIds.has(invoice._id) ? "bg-blue-50" : "hover:bg-gray-50"}`}>
//                 <td className="px-4 py-4 text-center">
//                   <input type="checkbox" checked={selectedIds.has(invoice._id)} onChange={() => toggleSelect(invoice._id)} className="w-4 h-4 accent-blue-600 cursor-pointer" />
//                 </td>
//                 <td className="px-6 py-4">
//                   <button onClick={() => handleInvoiceClick(invoice._id)} className="text-blue-600 hover:text-blue-800 hover:underline font-medium">
//                     {invoice.invoicenumber}
//                   </button>
//                 </td>
//                 <td className="px-6 py-4">{invoice.items?.[0]?.deal?.dealName || "N/A"}</td>
//                 <td className="px-6 py-4">
//                   <span className={`px-3 py-1 text-xs font-semibold rounded-full ${invoice.status === "paid" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
//                     {invoice.status}
//                   </span>
//                 </td>
//                 <td className="px-6 py-4 font-semibold">
//                   {invoice.total ? Number(invoice.total).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "-"} {invoice.currency}
//                 </td>
//                 <td className="px-6 py-4">
//                   {invoice.assignTo ? `${invoice.assignTo.firstName} ${invoice.assignTo.lastName}` : "N/A"}
//                 </td>
//                 <td className="px-6 py-4">
//                   {invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "-"}
//                 </td>
//                 <td className="px-6 py-4 text-center relative">
//                   <button
//                     onClick={(e) => {
//                       const rect = e.currentTarget.getBoundingClientRect();
//                       const spaceBelow = window.innerHeight - rect.bottom;
//                       setOpenIndex(openIndex === index ? null : index);
//                       setDropdownButton({ rect, position: spaceBelow > 200 ? "below" : "above" });
//                     }}
//                     className="p-2 rounded-full hover:bg-gray-100 text-gray-500"
//                   >
//                     <FaEllipsisV />
//                   </button>

//                   {openIndex === index && ReactDOM.createPortal(
//                     <div
//                       ref={dropdownRef}
//                       className="absolute z-50 bg-white border rounded-md shadow-lg"
//                       style={{
//                         top: dropdownButton?.position === "below"
//                           ? dropdownButton.rect.bottom + window.scrollY
//                           : dropdownButton.rect.top + window.scrollY - (dropdownRef.current?.offsetHeight || 150),
//                         left: dropdownButton ? dropdownButton.rect.left + window.scrollX : 0,
//                         minWidth: "8rem",
//                       }}
//                     >
//                       <button className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100" onClick={() => handleSendEmail(invoice._id)}>Send to Email</button>
//                       <button
//                         className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm hover:bg-gray-100 disabled:opacity-60"
//                         disabled={downloadingId === invoice._id}
//                         onClick={() => downloadInvoice(invoice._id, invoice.invoicenumber)}
//                       >
//                         {downloadingId === invoice._id ? (
//                           <>
//                             <svg className="animate-spin h-3.5 w-3.5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                               <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
//                               <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
//                             </svg>
//                             Downloading...
//                           </>
//                         ) : "Download"}
//                       </button>
//                       <button className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100" onClick={() => handleEdit(invoice)}>Edit</button>
//                       <button className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50" onClick={() => confirmDelete(invoice)}>Delete</button>
//                     </div>,
//                     document.body
//                   )}
//                 </td>
//               </tr>
//             ))}
//             {pagedInvoices.length === 0 && (
//               <tr>
//                 <td colSpan="8" className="text-center py-6 text-gray-400">
//                   {startDate || searchTerm || filterAssignTo || filterStatus || filterMethod
//                     ? "No invoices match your filters."
//                     : "No invoices found."}
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* Pagination */}
//       {totalCount > 0 && (
//         <div className="flex items-center justify-between mt-4 px-1">
//           {/* Showing X–Y of Z */}
//           <span className="text-sm text-gray-600">
//             Showing{" "}
//             <span className="font-semibold text-gray-800">{startIndex + 1}</span>
//             {" "}–{" "}
//             <span className="font-semibold text-gray-800">{Math.min(endIndex, totalCount)}</span>
//             {" "}of{" "}
//             <span className="font-semibold text-gray-800">{totalCount}</span>
//           </span>

//           {/* Page buttons */}
//           <div className="flex items-center gap-1">
//             {/* First */}
//             <button
//               onClick={() => setCurrentPage(1)}
//               disabled={currentPage === 1}
//               className="px-2 py-1.5 rounded-md border text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
//               title="First page"
//             >«</button>

//             {/* Previous */}
//             <button
//               onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
//               disabled={currentPage === 1}
//               className="px-3 py-1.5 rounded-md border text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
//             >Previous</button>

//             {/* Page numbers with ellipsis */}
//             {getPageNumbers().map((page, idx) =>
//               page === "..." ? (
//                 <span key={`ellipsis-${idx}`} className="px-2 py-1.5 text-sm text-gray-400 select-none">...</span>
//               ) : (
//                 <button
//                   key={page}
//                   onClick={() => setCurrentPage(page)}
//                   className={`px-3 py-1.5 rounded-md border text-sm font-medium transition-colors ${
//                     currentPage === page
//                       ? "bg-blue-500 text-white border-blue-500"
//                       : "text-gray-600 hover:bg-gray-100"
//                   }`}
//                 >
//                   {page}
//                 </button>
//               )
//             )}

//             {/* Next */}
//             <button
//               onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
//               disabled={currentPage === totalPages}
//               className="px-3 py-1.5 rounded-md border text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
//             >Next</button>

//             {/* Last */}
//             <button
//               onClick={() => setCurrentPage(totalPages)}
//               disabled={currentPage === totalPages}
//               className="px-2 py-1.5 rounded-md border text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
//               title="Last page"
//             >»</button>
//           </div>
//         </div>
//       )}

//       {/* Email Status Modal */}
//       <Dialog open={emailModalOpen} onOpenChange={setEmailModalOpen}>
//         <DialogContent className="sm:max-w-md">
//           <DialogHeader><DialogTitle>Email Status</DialogTitle></DialogHeader>
//           <div className="py-6 text-center">
//             {emailStatus === "loading" && <p className="text-blue-600 font-medium animate-pulse">{emailMessage}</p>}
//             {emailStatus === "success" && <p className="text-green-600 font-semibold">{emailMessage}</p>}
//             {emailStatus === "error"   && <p className="text-red-600 font-semibold">{emailMessage}</p>}
//           </div>
//         </DialogContent>
//       </Dialog>

//       {/* Single Delete Confirm */}
//       <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
//         <DialogContent className="sm:max-w-md">
//           <DialogHeader><DialogTitle>Confirm Delete</DialogTitle></DialogHeader>
//           <div className="py-4">
//             <p>Are you sure you want to delete invoice #{invoiceToDelete?.invoicenumber}?</p>
//             <p className="text-sm text-gray-500 mt-2">This action cannot be undone.</p>
//           </div>
//           <div className="flex justify-end space-x-3">
//             <button onClick={() => setDeleteConfirmOpen(false)} className="px-4 py-2 border rounded-md text-sm">Cancel</button>
//             <button onClick={() => handleDelete(invoiceToDelete?._id)} className="px-4 py-2 bg-red-600 text-white rounded-md text-sm">Delete</button>
//           </div>
//         </DialogContent>
//       </Dialog>

//       <style jsx>{`
//         .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
//         .scrollbar-hide::-webkit-scrollbar { display: none; }
//       `}</style>
//     </div>
//   );
// };

// export default InvoiceHead;//original code..


import React, { useState, useEffect, useRef } from "react";
import DatePicker from "react-datepicker";
import {
  FaEllipsisV,
  FaRupeeSign,
  FaDollarSign,
  FaEuroSign,
  FaPoundSign,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { MdDeleteSweep } from "react-icons/md";
import { useModal } from "../../context/ModalContext.jsx";
import InvoiceModal from "./InvoiceModal.jsx";
import axios from "axios";
import ReactDOM from "react-dom";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import "react-datepicker/dist/react-datepicker.css";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const ITEMS_PER_PAGE = 10;

// ✅ Helper: get role from stored user object in localStorage
const getUserRole = () => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    return user?.role?.name?.toLowerCase()?.trim() || "";
  } catch {
    return "";
  }
};

const InvoiceHead = () => {
  const API_URL = import.meta.env.VITE_API_URL;

  const { openModal } = useModal();
  const [startDate, setStartDate]             = useState(null);
  const [invoices, setInvoices]               = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [searchTerm, setSearchTerm]           = useState("");
  const [filterAssignTo, setFilterAssignTo]   = useState("");
  const [filterStatus, setFilterStatus]       = useState("");
  const [filterMethod, setFilterMethod]       = useState("");
  const [openIndex, setOpenIndex]             = useState(null);
  const [sendingEmailId, setSendingEmailId]   = useState(null);
  const [refreshTrigger, setRefreshTrigger]   = useState(0);
  const [editingInvoice, setEditingInvoice]   = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [invoiceToDelete, setInvoiceToDelete] = useState(null);
  const [dropdownButton, setDropdownButton]   = useState(null);

  const [selectedIds, setSelectedIds]         = useState(new Set());
  const [bulkDeleteOpen, setBulkDeleteOpen]   = useState(false);

  const [currentPage, setCurrentPage]         = useState(1);

  const [emailModalOpen, setEmailModalOpen]   = useState(false);
  const [emailMessage, setEmailMessage]       = useState("Sending invoice email...");
  const [emailStatus, setEmailStatus]         = useState("loading");

  const [downloadingId, setDownloadingId]     = useState(null);

  const dropdownRef      = useRef(null);
  const currencyScrollRef = useRef(null);
  const navigate         = useNavigate();

  // ✅ Get role once on mount
  const userRole = getUserRole();

  // ✅ Only Admin and Manager can create/delete invoices
  const canCreateInvoice = userRole === "admin" || userRole === "manager" || userRole === "accounts"; ;
  const canDeleteInvoice = userRole === "admin" || userRole === "manager" ||  userRole === "accounts";;

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchInvoices();
  }, [refreshTrigger]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenIndex(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    applyFilters();
    setCurrentPage(1);
  }, [searchTerm, startDate, filterAssignTo, filterStatus, filterMethod, invoices]);

  const groupedTotals = filteredInvoices.reduce((acc, inv) => {
    const cur   = inv.currency || "INR";
    const total = Number(inv.total) || 0;
    const paid  = inv.status === "paid" ? total : 0;
    const due   = inv.status !== "paid" ? total : 0;
    if (!acc[cur]) acc[cur] = { totalAmount: 0, totalPaid: 0, totalDue: 0, count: 0, paidCount: 0, dueCount: 0 };
    acc[cur].totalAmount += total;
    acc[cur].totalPaid   += paid;
    acc[cur].totalDue    += due;
    acc[cur].count       += 1;
    inv.status === "paid" ? acc[cur].paidCount++ : acc[cur].dueCount++;
    return acc;
  }, {});

  const fetchInvoices = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${API_URL}/invoice/getInvoice`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const all = response.data.invoices || response.data || [];
      setInvoices(all);
      setFilteredInvoices(all);
    } catch (error) {
      toast.error("Error fetching invoices!");
      console.error("Error fetching invoices:", error.response?.data || error);
    }
  };

  const handleSendEmail = async (invoiceId) => {
    try {
      setSendingEmailId(invoiceId);
      setEmailModalOpen(true);
      setEmailStatus("loading");
      setEmailMessage("📨 Sending invoice email...");
      const token = localStorage.getItem("token");
      await axios.post(`${API_URL}/invoice/sendEmail/${invoiceId}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEmailStatus("success");
      setEmailMessage("✅ Invoice sent to customer email!");
    } catch (error) {
      setEmailStatus("error");
      setEmailMessage("❌ Failed to send email. Please try again.");
      toast.error("Failed to send invoice email.");
    } finally {
      setSendingEmailId(null);
      setOpenIndex(null);
      setTimeout(() => setEmailModalOpen(false), 2000);
    }
  };

  const isSameLocalDate = (dateA, dateB) => {
    const a = new Date(dateA);
    const b = new Date(dateB);
    return (
      a.getFullYear() === b.getFullYear() &&
      a.getMonth()    === b.getMonth()    &&
      a.getDate()     === b.getDate()
    );
  };

  const applyFilters = () => {
    let filtered = invoices;

    if (searchTerm.trim()) {
      const s = searchTerm.trim().toLowerCase();
      filtered = filtered.filter(
        (inv) => inv.invoicenumber?.toLowerCase().includes(s)
      );
    }

    if (startDate) {
      filtered = filtered.filter(
        (inv) => inv.createdAt && isSameLocalDate(inv.createdAt, startDate)
      );
    }

    if (filterAssignTo) {
      filtered = filtered.filter((inv) => inv.assignTo?._id === filterAssignTo);
    }

    if (filterStatus) {
      filtered = filtered.filter((inv) => inv.status === filterStatus);
    }

    if (filterMethod) {
      filtered = filtered.filter((inv) => inv.paymentMethod === filterMethod);
    }

    setFilteredInvoices(filtered);
  };

  const handleDelete = async (invoiceId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}/invoice/delete/${invoiceId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Invoice deleted successfully!");
      setRefreshTrigger((prev) => prev + 1);
      setDeleteConfirmOpen(false);
      setSelectedIds((prev) => { const s = new Set(prev); s.delete(invoiceId); return s; });
    } catch (error) {
      toast.error("Failed to delete invoice.");
    }
  };

  const handleEdit        = (invoice) => { setEditingInvoice(invoice); openModal(); setOpenIndex(null); };
  const confirmDelete     = (invoice) => { setInvoiceToDelete(invoice); setDeleteConfirmOpen(true); setOpenIndex(null); };
  const handleInvoiceSaved = () => { setRefreshTrigger((prev) => prev + 1); setEditingInvoice(null); };

  const downloadInvoice = async (invoiceId, invoiceNumber) => {
    if (downloadingId === invoiceId) return;
    const toastId = toast.loading(`Downloading Invoice ${invoiceNumber}...`);
    try {
      setDownloadingId(invoiceId);
      setOpenIndex(null);
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_URL}/invoice/download/${invoiceId}`, {
        responseType: "blob",
        headers: { Authorization: `Bearer ${token}` },
      });
      const url  = window.URL.createObjectURL(new Blob([response.data], { type: "application/pdf" }));
      const link = document.createElement("a");
      link.href  = url;
      link.setAttribute("download", `Invoice_${invoiceNumber}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success(`Invoice ${invoiceNumber} downloaded!`, { id: toastId });
    } catch (error) {
      toast.error("Failed to download invoice.", { id: toastId });
    } finally {
      setDownloadingId(null);
    }
  };

  const toggleSelect = (id) => {
    setSelectedIds((prev) => {
      const s = new Set(prev);
      s.has(id) ? s.delete(id) : s.add(id);
      return s;
    });
  };

  const totalCount    = filteredInvoices.length;
  const totalPages    = Math.max(1, Math.ceil(totalCount / ITEMS_PER_PAGE));
  const startIndex    = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex      = startIndex + ITEMS_PER_PAGE;
  const pagedInvoices = filteredInvoices.slice(startIndex, endIndex);

  const allOnPageSelected =
    pagedInvoices.length > 0 && pagedInvoices.every((inv) => selectedIds.has(inv._id));
  const someOnPageSelected =
    pagedInvoices.some((inv) => selectedIds.has(inv._id)) && !allOnPageSelected;

  const toggleSelectAll = () => {
    if (allOnPageSelected) {
      setSelectedIds((prev) => {
        const s = new Set(prev);
        pagedInvoices.forEach((inv) => s.delete(inv._id));
        return s;
      });
    } else {
      setSelectedIds((prev) => {
        const s = new Set(prev);
        pagedInvoices.forEach((inv) => s.add(inv._id));
        return s;
      });
    }
  };

  const confirmBulkDelete = async () => {
    setBulkDeleteOpen(false);
    const ids = Array.from(selectedIds);
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}/invoice/deletemany`, {
        data: { ids },
        headers: { Authorization: `Bearer ${token}` },
      });
      setInvoices((prev)         => prev.filter((inv) => !ids.includes(inv._id)));
      setFilteredInvoices((prev) => prev.filter((inv) => !ids.includes(inv._id)));
      setSelectedIds(new Set());
      toast.success(`${ids.length} invoice(s) deleted.`);
      setCurrentPage((p) => {
        const newTotal = totalCount - ids.length;
        const newTotalPages = Math.max(1, Math.ceil(newTotal / ITEMS_PER_PAGE));
        return p > newTotalPages ? newTotalPages : p;
      });
    } catch {
      toast.error("Bulk delete failed.");
    }
  };

  const getCurrencyIcon = (c) => {
    const map = {
      INR: <FaRupeeSign className="text-indigo-600" />,
      USD: <FaDollarSign className="text-teal-600" />,
      EUR: <FaEuroSign className="text-rose-600" />,
      GBP: <FaPoundSign className="text-amber-600" />,
    };
    return map[c] || <FaDollarSign className="text-gray-600" />;
  };

  const getCurrencyBgColor   = (c) => ({ INR: "bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200", USD: "bg-gradient-to-br from-teal-50 to-teal-100 border-teal-200", EUR: "bg-gradient-to-br from-rose-50 to-rose-100 border-rose-200", GBP: "bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200" }[c] || "bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200");
  const getCurrencyTextColor = (c) => ({ INR: "text-indigo-800", USD: "text-teal-800", EUR: "text-rose-800", GBP: "text-amber-800" }[c] || "text-gray-800");

  const scrollLeft  = () => currencyScrollRef.current?.scrollBy({ left: -300, behavior: "smooth" });
  const scrollRight = () => currencyScrollRef.current?.scrollBy({ left:  300, behavior: "smooth" });

  const handleInvoiceClick = (id) => navigate(`/invoice/${id}`);

  const getPageNumbers = () => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages = [];
    if (currentPage <= 4) {
      pages.push(1, 2, 3, 4, 5, "...", totalPages);
    } else if (currentPage >= totalPages - 3) {
      pages.push(1, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
    } else {
      pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
    }
    return pages;
  };

  return (
    <div className="p-4">
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />

      {/* Bulk Delete Confirm Portal */}
      {bulkDeleteOpen && ReactDOM.createPortal(
        <div
          style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 99999, backdropFilter: "blur(4px)" }}
          onClick={() => setBulkDeleteOpen(false)}
        >
          <div
            style={{ background: "#fff", borderRadius: 18, padding: "32px 36px", maxWidth: 420, width: "90%", textAlign: "center", boxShadow: "0 28px 72px rgba(15,23,42,0.22)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ width: 64, height: 64, borderRadius: "50%", background: "linear-gradient(135deg,#fee2e2,#fecaca)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 18px", fontSize: 28 }}>🗑️</div>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: "#0f172a", marginBottom: 10 }}>Delete Selected Invoices?</h2>
            <p style={{ fontSize: 14, color: "#64748b", marginBottom: 8 }}>
              You are about to permanently delete <strong>{selectedIds.size}</strong> invoice(s).
            </p>
            <p style={{ fontSize: 13, color: "#94a3b8", marginBottom: 26 }}>This action cannot be undone.</p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
              <button onClick={() => setBulkDeleteOpen(false)} style={{ padding: "10px 26px", borderRadius: 10, border: "1.5px solid #e2e8f0", background: "transparent", color: "#64748b", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Cancel</button>
              <button onClick={confirmBulkDelete} style={{ padding: "10px 26px", borderRadius: 10, border: "none", background: "linear-gradient(135deg,#ef4444,#dc2626)", color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer", boxShadow: "0 4px 14px rgba(239,68,68,0.38)" }}>Yes, Delete</button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* ✅ Header — Create Invoice button only for Admin and Manager */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Invoices</h1>
        {canCreateInvoice && (
          <button
            onClick={() => { setEditingInvoice(null); openModal(); }}
            className="bg-[#4466f2] p-2 px-4 text-white rounded-sm"
          >
            Create Invoice
          </button>
        )}
      </div>

      <InvoiceModal onInvoiceSaved={handleInvoiceSaved} editingInvoice={editingInvoice} />

      {/* Financial Summary Cards */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Financial Summary</h2>
          {Object.keys(groupedTotals).length > 0 && (
            <div className="flex space-x-2 mt-2">
              <button onClick={scrollLeft}  className="p-2 rounded-full bg-white border hover:bg-gray-50 shadow-sm"><FaChevronLeft  className="text-gray-600" /></button>
              <button onClick={scrollRight} className="p-2 rounded-full bg-white border hover:bg-gray-50 shadow-sm"><FaChevronRight className="text-gray-600" /></button>
            </div>
          )}
        </div>

        {Object.keys(groupedTotals).length === 0 ? (
          <div className="bg-white p-8 rounded-xl shadow-sm border text-center">
            <p className="text-gray-500">No invoice data available</p>
            <p className="text-gray-400 text-sm mt-1">Create your first invoice to see financial insights</p>
          </div>
        ) : (
          <div className="relative">
            <div ref={currencyScrollRef} className="flex overflow-x-auto pb-4 -mx-2 px-2" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
              {Object.entries(groupedTotals).map(([currency, data]) => (
                <div key={currency} className={`${getCurrencyBgColor(currency)} flex-shrink-0 w-80 p-6 rounded-xl shadow-sm border relative overflow-hidden mx-2 transition-transform hover:scale-[1.02] hover:shadow-md`}>
                  <div className="flex justify-between items-start mb-5">
                    <div>
                      <h3 className={`text-lg font-semibold ${getCurrencyTextColor(currency)} mb-1`}>{currency}</h3>
                      <p className="text-sm text-gray-500">{data.count} invoice{data.count !== 1 ? "s" : ""}</p>
                    </div>
                    <div className="text-2xl p-2 bg-white rounded-lg shadow-sm">{getCurrencyIcon(currency)}</div>
                  </div>
                  <div className="space-y-3 mb-5">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-600">Total Amount</span>
                      <span className="font-semibold text-gray-800">{data.totalAmount.toLocaleString()} {currency}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-600">Paid ({data.paidCount})</span>
                      <span className="font-semibold text-green-600">{data.totalPaid.toLocaleString()} {currency}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-600">Due ({data.dueCount})</span>
                      <span className="font-semibold text-rose-600">{data.totalDue.toLocaleString()} {currency}</span>
                    </div>
                  </div>
                  <div className="mb-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full transition-all duration-500" style={{ width: `${data.totalAmount > 0 ? (data.totalPaid / data.totalAmount) * 100 : 0}%` }} />
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>{Math.round((data.totalPaid / data.totalAmount) * 100)}% Paid</span>
                      <span>{Math.round((data.totalDue / data.totalAmount) * 100)}% Due</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mt-8 items-center justify-between">
        <div className="flex flex-wrap gap-4">
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            className="px-4 py-2 rounded-md border bg-white focus:ring-2 focus:ring-blue-400"
            placeholderText="Filter by Date"
            dateFormat="dd/MM/yyyy"
            isClearable
          />
          <select
            className="px-4 py-2 rounded-md bg-white border text-gray-600"
            value={filterAssignTo}
            onChange={(e) => setFilterAssignTo(e.target.value)}
          >
            <option value="">All Users</option>
            {[...new Set(invoices.map((inv) => inv.assignTo?._id))].map((userId) => {
              const u = invoices.find((inv) => inv.assignTo?._id === userId)?.assignTo;
              return (
                <option key={userId} value={userId}>
                  {u ? `${u.firstName} ${u.lastName}` : "Unknown"}
                </option>
              );
            })}
          </select>
          <select
            className="px-4 py-2 rounded-md bg-white border text-gray-600"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="paid">Paid</option>
            <option value="unpaid">Unpaid</option>
          </select>
        </div>
        <div className="flex items-center border rounded-full bg-white px-3 w-[250px]">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search Invoice #"
            className="ml-2 w-full py-2 rounded-full outline-none text-gray-700"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* ✅ Bulk Delete Action Bar — only for Admin/Manager */}
      {selectedIds.size > 0 && canDeleteInvoice && (
        <div className="flex items-center gap-3 mt-4 bg-red-50 border border-red-200 rounded-lg px-4 py-2.5">
          <span className="text-sm font-semibold text-red-700">{selectedIds.size} invoice(s) selected</span>
          <button
            onClick={() => setBulkDeleteOpen(true)}
            className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold px-4 py-1.5 rounded-lg transition shadow-sm"
          >
            <MdDeleteSweep className="text-lg" />
            Delete Selected
          </button>
          <button onClick={() => setSelectedIds(new Set())} className="ml-auto text-sm text-gray-500 hover:text-gray-700 underline">
            Clear selection
          </button>
        </div>
      )}

      {/* Table */}
      <div className="bg-white mt-4 rounded-xl shadow-md overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
            <tr>
              {/* ✅ Show checkbox column only for Admin/Manager */}
              {canDeleteInvoice && (
                <th className="px-4 py-3 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={allOnPageSelected}
                    ref={(el) => { if (el) el.indeterminate = someOnPageSelected; }}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 accent-blue-600 cursor-pointer"
                    title="Select / deselect all on this page"
                  />
                </th>
              )}
              <th className="px-6 py-3">Invoice</th>
              <th className="px-6 py-3">Deal Name</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Amount</th>
              <th className="px-6 py-3">Assigned To</th>
              <th className="px-6 py-3">Due Date</th>
              <th className="px-6 py-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {pagedInvoices.map((invoice, index) => (
              <tr
                key={invoice._id}
                className={`transition-colors ${selectedIds.has(invoice._id) ? "bg-blue-50" : "hover:bg-gray-50"}`}
              >
                {/* ✅ Checkbox only for Admin/Manager */}
                {canDeleteInvoice && (
                  <td className="px-4 py-4 text-center">
                    <input
                      type="checkbox"
                      checked={selectedIds.has(invoice._id)}
                      onChange={() => toggleSelect(invoice._id)}
                      className="w-4 h-4 accent-blue-600 cursor-pointer"
                    />
                  </td>
                )}
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleInvoiceClick(invoice._id)}
                    className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
                  >
                    {invoice.invoicenumber}
                  </button>
                </td>
                <td className="px-6 py-4">{invoice.items?.[0]?.deal?.dealName || "N/A"}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${invoice.status === "paid" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                    {invoice.status}
                  </span>
                </td>
                <td className="px-6 py-4 font-semibold">
                  {invoice.total
                    ? Number(invoice.total).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                    : "-"}{" "}
                  {invoice.currency}
                </td>
                <td className="px-6 py-4">
                  {invoice.assignTo
                    ? `${invoice.assignTo.firstName} ${invoice.assignTo.lastName}`
                    : "N/A"}
                </td>
                <td className="px-6 py-4">
                  {invoice.dueDate
                    ? new Date(invoice.dueDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
                    : "-"}
                </td>
                <td className="px-6 py-4 text-center relative">
                  <button
                    onClick={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const spaceBelow = window.innerHeight - rect.bottom;
                      setOpenIndex(openIndex === index ? null : index);
                      setDropdownButton({ rect, position: spaceBelow > 200 ? "below" : "above" });
                    }}
                    className="p-2 rounded-full hover:bg-gray-100 text-gray-500"
                  >
                    <FaEllipsisV />
                  </button>

                  {openIndex === index && ReactDOM.createPortal(
                    <div
                      ref={dropdownRef}
                      className="absolute z-50 bg-white border rounded-md shadow-lg"
                      style={{
                        top: dropdownButton?.position === "below"
                          ? dropdownButton.rect.bottom + window.scrollY
                          : dropdownButton.rect.top + window.scrollY - (dropdownRef.current?.offsetHeight || 150),
                        left: dropdownButton ? dropdownButton.rect.left + window.scrollX : 0,
                        minWidth: "8rem",
                      }}
                    >
                      <button className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100" onClick={() => handleSendEmail(invoice._id)}>
                        Send to Email
                      </button>
                      <button
                        className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm hover:bg-gray-100 disabled:opacity-60"
                        disabled={downloadingId === invoice._id}
                        onClick={() => downloadInvoice(invoice._id, invoice.invoicenumber)}
                      >
                        {downloadingId === invoice._id ? (
                          <>
                            <svg className="animate-spin h-3.5 w-3.5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                            </svg>
                            Downloading...
                          </>
                        ) : "Download"}
                      </button>
                      {/* ✅ Edit & Delete only for Admin/Manager */}
                      {canCreateInvoice && (
                        <button className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100" onClick={() => handleEdit(invoice)}>
                          Edit
                        </button>
                      )}
                      {canDeleteInvoice && (
                        <button className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50" onClick={() => confirmDelete(invoice)}>
                          Delete
                        </button>
                      )}
                    </div>,
                    document.body
                  )}
                </td>
              </tr>
            ))}
            {pagedInvoices.length === 0 && (
              <tr>
                <td colSpan={canDeleteInvoice ? 8 : 7} className="text-center py-6 text-gray-400">
                  {startDate || searchTerm || filterAssignTo || filterStatus || filterMethod
                    ? "No invoices match your filters."
                    : "No invoices found."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalCount > 0 && (
        <div className="flex items-center justify-between mt-4 px-1">
          <span className="text-sm text-gray-600">
            Showing{" "}
            <span className="font-semibold text-gray-800">{startIndex + 1}</span>
            {" "}–{" "}
            <span className="font-semibold text-gray-800">{Math.min(endIndex, totalCount)}</span>
            {" "}of{" "}
            <span className="font-semibold text-gray-800">{totalCount}</span>
          </span>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="px-2 py-1.5 rounded-md border text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
              title="First page"
            >«</button>

            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 rounded-md border text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
            >Previous</button>

            {getPageNumbers().map((page, idx) =>
              page === "..." ? (
                <span key={`ellipsis-${idx}`} className="px-2 py-1.5 text-sm text-gray-400 select-none">...</span>
              ) : (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1.5 rounded-md border text-sm font-medium transition-colors ${
                    currentPage === page
                      ? "bg-blue-500 text-white border-blue-500"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {page}
                </button>
              )
            )}

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 rounded-md border text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
            >Next</button>

            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className="px-2 py-1.5 rounded-md border text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
              title="Last page"
            >»</button>
          </div>
        </div>
      )}

      {/* Email Status Modal */}
      <Dialog open={emailModalOpen} onOpenChange={setEmailModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>Email Status</DialogTitle></DialogHeader>
          <div className="py-6 text-center">
            {emailStatus === "loading" && <p className="text-blue-600 font-medium animate-pulse">{emailMessage}</p>}
            {emailStatus === "success" && <p className="text-green-600 font-semibold">{emailMessage}</p>}
            {emailStatus === "error"   && <p className="text-red-600 font-semibold">{emailMessage}</p>}
          </div>
        </DialogContent>
      </Dialog>

      {/* Single Delete Confirm */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>Confirm Delete</DialogTitle></DialogHeader>
          <div className="py-4">
            <p>Are you sure you want to delete invoice #{invoiceToDelete?.invoicenumber}?</p>
            <p className="text-sm text-gray-500 mt-2">This action cannot be undone.</p>
          </div>
          <div className="flex justify-end space-x-3">
            <button onClick={() => setDeleteConfirmOpen(false)} className="px-4 py-2 border rounded-md text-sm">Cancel</button>
            <button onClick={() => handleDelete(invoiceToDelete?._id)} className="px-4 py-2 bg-red-600 text-white rounded-md text-sm">Delete</button>
          </div>
        </DialogContent>
      </Dialog>

      <style jsx>{`
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};

export default InvoiceHead;