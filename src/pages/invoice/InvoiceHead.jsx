// import React, { useState, useEffect, useRef } from "react";
// import DatePicker from "react-datepicker";
// import { FaEllipsisV } from "react-icons/fa";
// import { useModal } from "../../context/ModalContext.jsx";
// import InvoiceModal from "./InvoiceModal.jsx";
// import axios from "axios";
// import jsPDF from "jspdf";
// import autoTable from "jspdf-autotable";
// import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
// import "react-datepicker/dist/react-datepicker.css";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "../../components/ui/dialog";

// const InvoiceHead = () => {
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

//   // modal state for email sending
//   const [emailModalOpen, setEmailModalOpen] = useState(false);
//   const [emailMessage, setEmailMessage] = useState("Sending invoice email...");
//   const [emailStatus, setEmailStatus] = useState("loading"); // loading | success | error

//   const dropdownRef = useRef(null);

//   useEffect(() => {
//     fetchInvoices();
//   }, []);

//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
//         setOpenIndex(null);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   useEffect(() => {
//     applyFilters();
//   }, [
//     searchTerm,
//     startDate,
//     filterAssignTo,
//     filterStatus,
//     filterMethod,
//     invoices,
//   ]);

//   const fetchInvoices = async () => {
//     try {
//       const response = await axios.get(
//         "http://localhost:5000/api/invoice/getInvoice"
//       );
//       setInvoices(response.data);
//       setFilteredInvoices(response.data);
//     } catch (error) {
//       console.error("Error fetching invoices:", error);
//     }
//   };

//   const handleSendEmail = async (invoiceId) => {
//     try {
//       setSendingEmailId(invoiceId);
//       setEmailModalOpen(true);
//       setEmailStatus("loading");
//       setEmailMessage("📨 Sending invoice email...");

//       await axios.post(
//         `http://localhost:5000/api/invoice/sendEmail/${invoiceId}`
//       );

//       setEmailStatus("success");
//       setEmailMessage("✅ Invoice sent to customer email!");
//     } catch (error) {
//       console.error("Error sending invoice:", error);
//       setEmailStatus("error");
//       setEmailMessage("❌ Failed to send email. Please try again.");
//     } finally {
//       setSendingEmailId(null);
//       setOpenIndex(null);

//       // auto close modal after 2 seconds if success/error
//       setTimeout(() => {
//         setEmailModalOpen(false);
//       }, 2000);
//     }
//   };

//   const applyFilters = () => {
//     let filtered = invoices;

//     if (searchTerm) {
//       filtered = filtered.filter((invoice) =>
//         invoice.invoicenumber.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//     }

//     if (startDate) {
//       const selectedDate = new Date(startDate).toDateString();
//       filtered = filtered.filter((invoice) => {
//         const invoiceDate = new Date(invoice.createdAt).toDateString();
//         return invoiceDate === selectedDate;
//       });
//     }

//     if (filterAssignTo) {
//       filtered = filtered.filter(
//         (invoice) => invoice.assignTo?._id === filterAssignTo
//       );
//     }

//     if (filterStatus) {
//       filtered = filtered.filter((invoice) => invoice.status === filterStatus);
//     }

//     if (filterMethod) {
//       filtered = filtered.filter(
//         (invoice) => invoice.paymentMethod === filterMethod
//       );
//     }

//     setFilteredInvoices(filtered);
//   };

//   const handleDelete = async (invoiceId) => {
//     try {
//       await axios.delete(
//         `http://localhost:5000/api/auth/invoice/delete/${invoiceId}`
//       );
//       const updated = invoices.filter((invoice) => invoice._id !== invoiceId);
//       setInvoices(updated);
//     } catch (error) {
//       console.error("Error deleting invoice:", error);
//     }
//   };

//   const createInvoice = async (invoiceData) => {
//     try {
//       const response = await axios.post(
//         "http://localhost:5000/api/invoices",
//         invoiceData
//       );
//       const updated = [...invoices, response.data];
//       setInvoices(updated);
//     } catch (error) {
//       console.error("Error creating invoice:", error);
//     }
//   };

//   const generatePDF = (invoice) => {
//     const doc = new jsPDF();
//     doc.setFontSize(18);
//     doc.text("Invoice", 105, 20, { align: "center" });
//     doc.rect(10, 10, 190, 30);

//     doc.setFontSize(12);
//     const details = [
//       ["Invoice #", invoice.invoicenumber || "N/A"],
//       [
//         "Assigned To",
//         invoice.assignTo
//           ? `${invoice.assignTo.firstName} ${invoice.assignTo.lastName}`
//           : "N/A",
//       ],
//       ["Status", invoice.status || "N/A"],
//     ];

//     let y = 50;
//     details.forEach(([key, value]) => {
//       doc.text(`${key}: ${value}`, 14, y);
//       y += 10;
//     });

//     autoTable(doc, {
//       startY: y + 10,
//       head: [["Deal Name", "Amount (Rs.)"]],
//       body:
//         invoice.items?.map((item) => [
//           item.deal?.dealName || "N/A",
//           item.amount || "0",
//         ]) || [],
//       theme: "grid",
//       styles: { halign: "center", fontSize: 10 },
//       headStyles: {
//         fontSize: 12,
//         fillColor: [40, 116, 166],
//         textColor: [255, 255, 255],
//       },
//       alternateRowStyles: { fillColor: [240, 240, 240] },
//     });

//     const finalY = doc.lastAutoTable.finalY + 10;
//     doc.setFontSize(14).setTextColor(40, 116, 166);
//     doc.text(`Total Amount: Rs. ${invoice.total || 0}`, 14, finalY);
//     doc.setFontSize(12).setTextColor(0, 0, 0);
//     doc.text(`Tax: Rs. ${invoice.tax || 0}`, 14, finalY + 10);

//     const footerY = finalY + 25;
//     doc.setFontSize(10);
//     doc.text("Company Name | Address | Phone | Email", 105, footerY, {
//       align: "center",
//     });
//     doc.setFontSize(8).setTextColor(169, 169, 169);
//     doc.text(
//       "Terms & Conditions: Payment due within 30 days.",
//       105,
//       footerY + 10,
//       {
//         align: "center",
//       }
//     );

//     doc.save(`Invoice_${invoice.invoicenumber}.pdf`);
//   };

//   const totalAmount = filteredInvoices.reduce(
//     (acc, invoice) => acc + (Number(invoice.total) || 0),
//     0
//   );
//   const totalPaid = filteredInvoices
//     .filter((inv) => inv.status === "paid")
//     .reduce((acc, inv) => acc + (Number(inv.total) || 0), 0);
//   const totalDue = filteredInvoices
//     .filter((inv) => inv.status !== "paid")
//     .reduce((acc, inv) => acc + (Number(inv.total) || 0), 0);

//   return (
//     <div className="p-4">
//       <div className="flex justify-between items-center">
//         <h1 className="text-2xl font-semibold">Invoices</h1>
//         <button
//           onClick={openModal}
//           className="bg-[#4466f2] p-2 px-4 text-white rounded-sm"
//         >
//           Create invoices
//         </button>
//       </div>

//       <InvoiceModal onSubmit={createInvoice} />

//       {/* Summary Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
//         <div className="bg-[#4466f2] p-6 rounded-xl text-white shadow-md">
//           <h3 className="text-lg font-medium">Total Amount</h3>
//           <p className="text-2xl font-bold mt-2">₹{totalAmount.toFixed(2)}</p>
//         </div>
//         <div className="bg-[#46c35f] p-6 rounded-xl text-white shadow-md">
//           <h3 className="text-lg font-medium">Total Paid</h3>
//           <p className="text-2xl font-bold mt-2">₹{totalPaid.toFixed(2)}</p>
//         </div>
//         <div className="bg-[#fc6510] p-6 rounded-xl text-white shadow-md">
//           <h3 className="text-lg font-medium">Total Due</h3>
//           <p className="text-2xl font-bold mt-2">₹{totalDue.toFixed(2)}</p>
//         </div>
//       </div>

//       {/* Filters */}
//       <div className="flex flex-wrap gap-4 mt-8 items-center justify-between">
//         <div className="flex flex-wrap gap-3">
//           <DatePicker
//             selected={startDate}
//             onChange={(date) => setStartDate(date)}
//             className="px-4 py-2 rounded-lg border shadow-sm focus:ring-2 focus:ring-blue-400"
//             placeholderText="Filter by Date"
//           />
//           <select
//             className="px-4 py-2 rounded-lg border shadow-sm text-gray-600"
//             value={filterAssignTo}
//             onChange={(e) => setFilterAssignTo(e.target.value)}
//           >
//             <option value="">All Users</option>
//             {[...new Set(invoices.map((inv) => inv.assignTo?._id))].map(
//               (userId) => {
//                 const user = invoices.find(
//                   (inv) => inv.assignTo?._id === userId
//                 )?.assignTo;
//                 return (
//                   <option key={userId} value={userId}>
//                     {user ? `${user.firstName} ${user.lastName}` : "Unknown"}
//                   </option>
//                 );
//               }
//             )}
//           </select>
//           <select
//             className="px-4 py-2 rounded-lg border shadow-sm text-gray-600"
//             value={filterStatus}
//             onChange={(e) => setFilterStatus(e.target.value)}
//           >
//             <option value="">All Status</option>
//             <option value="paid">Paid</option>
//             <option value="unpaid">Unpaid</option>
//           </select>
//         </div>

//         {/* Search */}
//         <div className="flex items-center border rounded-lg bg-white px-3 shadow-sm w-[250px]">
//           <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
//           <input
//             type="text"
//             placeholder="Search Invoice #"
//             className="ml-2 w-full py-2 outline-none text-gray-700"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//         </div>
//       </div>

//       {/* Table */}
//       <div className="bg-white mt-6 rounded-xl shadow-md overflow-x-auto">
//         <table className="w-full text-sm text-left">
//           <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
//             <tr>
//               <th className="px-6 py-3">Invoice #</th>
//               <th className="px-6 py-3">Deal</th>
//               <th className="px-6 py-3">Status</th>
//               <th className="px-6 py-3">Amount</th>
//               <th className="px-6 py-3">Assigned To</th>
//               <th className="px-6 py-3">Tax</th>
//               <th className="px-6 py-3 text-center">Action</th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-gray-200">
//             {filteredInvoices.map((invoice, index) => (
//               <tr
//                 key={invoice._id}
//                 className="hover:bg-gray-50 transition-colors"
//               >
//                 <td className="px-6 py-4">{invoice.invoicenumber}</td>
//                 <td className="px-6 py-4">
//                   {invoice.items?.[0]?.deal?.dealName || "N/A"}
//                 </td>
//                 <td className="px-6 py-4">
//                   <span
//                     className={`px-3 py-1 text-xs font-semibold rounded-full ${
//                       invoice.status === "paid"
//                         ? "bg-green-100 text-green-700"
//                         : "bg-red-100 text-red-700"
//                     }`}
//                   >
//                     {invoice.status}
//                   </span>
//                 </td>
//                 <td className="px-6 py-4 font-semibold">₹{invoice.total}</td>
//                 <td className="px-6 py-4">
//                   {invoice.assignTo
//                     ? `${invoice.assignTo.firstName} ${invoice.assignTo.lastName}`
//                     : "N/A"}
//                 </td>
//                 <td className="px-6 py-4">₹{invoice.tax}</td>
//                 <td className="px-6 py-4 text-center relative">
//                   <button
//                     onClick={() =>
//                       setOpenIndex(openIndex === index ? null : index)
//                     }
//                     className="p-2 rounded-full hover:bg-gray-100 text-gray-500"
//                   >
//                     <FaEllipsisV />
//                   </button>

//                   {openIndex === index && (
//                     <div
//                       ref={dropdownRef}
//                       className="absolute right-0 mt-2 w-32 bg-white border rounded-md shadow-lg z-50"
//                     >
//                       <button
//                         className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
//                         onClick={() => handleSendEmail(invoice._id)}
//                       >
//                         Send to Email
//                       </button>

//                       <button
//                         className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
//                         onClick={() => generatePDF(invoice)}
//                       >
//                         Download
//                       </button>
//                       <button className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100">
//                         Edit
//                       </button>
//                       <button
//                         className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
//                         onClick={() => handleDelete(invoice._id)}
//                       >
//                         Delete
//                       </button>
//                     </div>
//                   )}
//                 </td>
//               </tr>
//             ))}

//             {filteredInvoices.length === 0 && (
//               <tr>
//                 <td colSpan="7" className="text-center py-6 text-gray-400">
//                   No invoices found.
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* Email Sending Modal */}
//       <Dialog open={emailModalOpen} onOpenChange={setEmailModalOpen}>
//         <DialogContent className="sm:max-w-md">
//           <DialogHeader>
//             <DialogTitle>Email Status</DialogTitle>
//           </DialogHeader>
//           <div className="py-6 text-center">
//             {emailStatus === "loading" && (
//               <p className="text-blue-600 font-medium animate-pulse">
//                 {emailMessage}
//               </p>
//             )}
//             {emailStatus === "success" && (
//               <p className="text-green-600 font-semibold">{emailMessage}</p>
//             )}
//             {emailStatus === "error" && (
//               <p className="text-red-600 font-semibold">{emailMessage}</p>
//             )}
//           </div>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// };

// export default InvoiceHead;//original





import React, { useState, useEffect, useRef } from "react";
import DatePicker from "react-datepicker";
import { FaEllipsisV } from "react-icons/fa";
import { useModal } from "../../context/ModalContext.jsx";
import InvoiceModal from "./InvoiceModal.jsx";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import "react-datepicker/dist/react-datepicker.css";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
//import { toast } from "react-toastify";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const InvoiceHead = () => {
  const { openModal } = useModal();
  const [startDate, setStartDate] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterAssignTo, setFilterAssignTo] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterMethod, setFilterMethod] = useState("");
  const [openIndex, setOpenIndex] = useState(null);
  const [sendingEmailId, setSendingEmailId] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [editingInvoice, setEditingInvoice] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [invoiceToDelete, setInvoiceToDelete] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  // modal state for email sending
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [emailMessage, setEmailMessage] = useState("Sending invoice email...");
  const [emailStatus, setEmailStatus] = useState("loading"); // loading | success | error

  const dropdownRef = useRef(null);

  useEffect(() => {
    fetchInvoices();
  }, [refreshTrigger, currentPage, itemsPerPage]); // Add pagination dependencies

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
  }, [
    searchTerm,
    startDate,
    filterAssignTo,
    filterStatus,
    filterMethod,
    invoices,
  ]);

  const fetchInvoices = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/invoice/getInvoice?page=${currentPage}&limit=${itemsPerPage}`
      );
      setInvoices(response.data.invoices || response.data);
      setFilteredInvoices(response.data.invoices || response.data);
      setTotalCount(response.data.totalCount || response.data.length);
    } catch (error) {
      toast.error("Error fetching invoices!");
      console.error("Error fetching invoices:", error);
    }
  };

  const handleSendEmail = async (invoiceId) => {
    try {
      setSendingEmailId(invoiceId);
      setEmailModalOpen(true);
      setEmailStatus("loading");
      setEmailMessage("📨 Sending invoice email...");

      await axios.post(
        `http://localhost:5000/api/invoice/sendEmail/${invoiceId}`
      );

      setEmailStatus("success");
      setEmailMessage("✅ Invoice sent to customer email!");
    } catch (error) {
      setEmailStatus("error");
      setEmailMessage("❌ Failed to send email. Please try again.");
      toast.error("Failed to send invoice email.");
      console.error("Error sending invoice:", error);
    } finally {
      setSendingEmailId(null);
      setOpenIndex(null);

      // auto close modal after 2 seconds if success/error
      setTimeout(() => {
        setEmailModalOpen(false);
      }, 2000);
    }
  };

  const applyFilters = () => {
    let filtered = invoices;

    if (searchTerm) {
      filtered = filtered.filter((invoice) =>
        invoice.invoicenumber &&
        invoice.invoicenumber.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (startDate) {
      const selectedDate = new Date(startDate).toDateString();
      filtered = filtered.filter((invoice) => {
        const invoiceDate = new Date(invoice.createdAt).toDateString();
        return invoiceDate === selectedDate;
      });
    }

    if (filterAssignTo) {
      filtered = filtered.filter(
        (invoice) => invoice.assignTo?._id === filterAssignTo
      );
    }

    if (filterStatus) {
      filtered = filtered.filter((invoice) => invoice.status === filterStatus);
    }

    if (filterMethod) {
      filtered = filtered.filter(
        (invoice) => invoice.paymentMethod === filterMethod
      );
    }

    setFilteredInvoices(filtered);
  };

  const handleDelete = async (invoiceId) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/invoice/delete/${invoiceId}`
      );
      toast.success("Invoice deleted successfully!");
      setRefreshTrigger(prev => prev + 1);
      setDeleteConfirmOpen(false);
    } catch (error) {
      console.error("Error deleting invoice:", error);
      toast.error("Failed to delete invoice.");
    }
  };

  const handleEdit = (invoice) => {
    setEditingInvoice(invoice);
    openModal();
  };

  const confirmDelete = (invoice) => {
    setInvoiceToDelete(invoice);
    setDeleteConfirmOpen(true);
    setOpenIndex(null);
  };

  // Callback function to refresh invoices after creating/updating
  const handleInvoiceSaved = () => {
    setRefreshTrigger(prev => prev + 1);
    setEditingInvoice(null);
  };

  const generatePDF = (invoice) => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Invoice", 105, 20, { align: "center" });
    doc.rect(10, 10, 190, 30);

    doc.setFontSize(12);
    const details = [
      ["Invoice #", invoice.invoicenumber || "N/A"],
      [
        "Assigned To",
        invoice.assignTo
          ? `${invoice.assignTo.firstName} ${invoice.assignTo.lastName}`
          : "N/A",
      ],
      ["Status", invoice.status || "N/A"],
    ];

    let y = 50;
    details.forEach(([key, value]) => {
      doc.text(`${key}: ${value}`, 14, y);
      y += 10;
    });

    autoTable(doc, {
      startY: y + 10,
      head: [["Deal Name", "Amount (Rs.)"]],
      body:
        invoice.items?.map((item) => [
          item.deal?.dealName || "N/A",
          Number(item.amount).toFixed(2),
        ]) || [],
      theme: "grid",
      styles: { halign: "center", fontSize: 10 },
      headStyles: {
        fontSize: 12,
        fillColor: [40, 116, 166],
        textColor: [255, 255, 255],
      },
      alternateRowStyles: { fillColor: [240, 240, 240] },
    });

    const finalY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(14).setTextColor(40, 116, 166);
    doc.text(`Total Amount: Rs. ${Number(invoice.total).toFixed(2)}`, 14, finalY);
    doc.setFontSize(12).setTextColor(0, 0, 0);
    doc.text(`Tax: Rs. ${Number(invoice.tax).toFixed(2)}`, 14, finalY + 10);

    const footerY = finalY + 25;
    doc.setFontSize(10);
    doc.text("Company Name | Address | Phone | Email", 105, footerY, {
      align: "center",
    });
    doc.setFontSize(8).setTextColor(169, 169, 169);
    doc.text(
      "Terms & Conditions: Payment due within 30 days.",
      105,
      footerY + 10,
      {
        align: "center",
      }
    );

    doc.save(`Invoice_${invoice.invoicenumber}.pdf`);
  };

  const totalAmount = filteredInvoices.reduce(
    (acc, invoice) => acc + (Number(invoice.total) || 0),
    0
  );
  const totalPaid = filteredInvoices
    .filter((inv) => inv.status === "paid")
    .reduce((acc, inv) => acc + (Number(inv.total) || 0), 0);
  const totalDue = filteredInvoices
    .filter((inv) => inv.status !== "paid")
    .reduce((acc, inv) => acc + (Number(inv.total) || 0), 0);

  // Pagination functions
  const totalPages = Math.ceil(totalCount / itemsPerPage);
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Invoices</h1>
        <button
          onClick={() => {
            setEditingInvoice(null);
            openModal();
          }}
          className="bg-[#4466f2] p-2 px-4 text-white rounded-sm"
        >
          Create invoices
        </button>
      </div>

      <InvoiceModal 
        onInvoiceSaved={handleInvoiceSaved} 
        editingInvoice={editingInvoice}
      />

      {/* Summary Cards (show decimals) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
        <div className="bg-[#4466f2] p-6 rounded-xl text-white shadow-md">
          <h3 className="text-lg font-medium">Total Amount</h3>
          <p className="text-2xl font-bold mt-2">₹{totalAmount.toFixed(2)}</p>
        </div>
        <div className="bg-[#46c35f] p-6 rounded-xl text-white shadow-md">
          <h3 className="text-lg font-medium">Total Paid</h3>
          <p className="text-2xl font-bold mt-2">₹{totalPaid.toFixed(2)}</p>
        </div>
        <div className="bg-[#fc6510] p-6 rounded-xl text-white shadow-md">
          <h3 className="text-lg font-medium">Total Due</h3>
          <p className="text-2xl font-bold mt-2">₹{totalDue.toFixed(2)}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mt-8 items-center justify-between">
        <div className="flex flex-wrap gap-3">
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            className="px-4 py-2 rounded-lg border shadow-sm focus:ring-2 focus:ring-blue-400"
            placeholderText="Filter by Date"
          />
          <select
            className="px-4 py-2 rounded-lg border shadow-sm text-gray-600"
            value={filterAssignTo}
            onChange={(e) => setFilterAssignTo(e.target.value)}
          >
            <option value="">All Users</option>
            {[...new Set(invoices.map((inv) => inv.assignTo?._id))].map(
              (userId) => {
                const user = invoices.find(
                  (inv) => inv.assignTo?._id === userId
                )?.assignTo;
                return (
                  <option key={userId} value={userId}>
                    {user ? `${user.firstName} ${user.lastName}` : "Unknown"}
                  </option>
                );
              }
            )}
          </select>
          <select
            className="px-4 py-2 rounded-lg border shadow-sm text-gray-600"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="paid">Paid</option>
            <option value="unpaid">Unpaid</option>
          </select>
        </div>

        {/* Search */}
        <div className="flex items-center border rounded-lg bg-white px-3 shadow-sm w-[250px]">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search Invoice #"
            className="ml-2 w-full py-2 outline-none text-gray-700"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white mt-6 rounded-xl shadow-md overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-6 py-3">Invoice #</th>
              <th className="px-6 py-3">Deal</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Amount</th>
              <th className="px-6 py-3">Assigned To</th>
              <th className="px-6 py-3">Tax</th>
              <th className="px-6 py-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredInvoices.map((invoice, index) => (
              <tr
                key={invoice._id}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4">{invoice.invoicenumber}</td>
                <td className="px-6 py-4">
                  {invoice.items?.[0]?.deal?.dealName || "N/A"}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 text-xs font-semibold rounded-full ${
                      invoice.status === "paid"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {invoice.status}
                  </span>
                </td>
                <td className="px-6 py-4 font-semibold">
                  ₹{Number(invoice.total).toFixed(2)}
                </td>
                <td className="px-6 py-4">
                  {invoice.assignTo
                    ? `${invoice.assignTo.firstName} ${invoice.assignTo.lastName}`
                    : "N/A"}
                </td>
                <td className="px-6 py-4">
                  ₹{Number(invoice.tax).toFixed(2)}
                </td>
                <td className="px-6 py-4 text-center relative">
                  <button
                    onClick={() =>
                      setOpenIndex(openIndex === index ? null : index)
                    }
                    className="p-2 rounded-full hover:bg-gray-100 text-gray-500"
                  >
                    <FaEllipsisV />
                  </button>

                  {openIndex === index && (
                    <div
                      ref={dropdownRef}
                      className="absolute right-0 mt-2 w-32 bg-white border rounded-md shadow-lg z-50"
                    >
                      <button
                        className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                        onClick={() => handleSendEmail(invoice._id)}
                      >
                        Send to Email
                      </button>

                      <button
                        className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                        onClick={() => generatePDF(invoice)}
                      >
                        Download
                      </button>
                      <button 
                        className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                        onClick={() => handleEdit(invoice)}
                      >
                        Edit
                      </button>
                      <button
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                        onClick={() => confirmDelete(invoice)}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}

            {filteredInvoices.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center py-6 text-gray-400">
                  No invoices found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center">
          <span className="text-sm text-gray-700 mr-2">Show</span>
          <select
            value={itemsPerPage}
            onChange={handleItemsPerPageChange}
            className="border rounded-md p-1 text-sm"
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
          </select>
          <span className="text-sm text-gray-700 ml-2">entries</span>
        </div>
        
        <div className="flex items-center">
          <span className="text-sm text-gray-700 mr-4">
            Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, totalCount)} of {totalCount} entries
          </span>
          
          <div className="flex space-x-1">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded-md border text-sm disabled:opacity-50"
            >
              Previous
            </button>
            
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              
              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`px-3 py-1 rounded-md border text-sm ${
                    currentPage === pageNum ? "bg-blue-500 text-white" : ""
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded-md border text-sm disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Email Sending Modal */}
      <Dialog open={emailModalOpen} onOpenChange={setEmailModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Email Status</DialogTitle>
          </DialogHeader>
          <div className="py-6 text-center">
            {emailStatus === "loading" && (
              <p className="text-blue-600 font-medium animate-pulse">
                {emailMessage}
              </p>
            )}
            {emailStatus === "success" && (
              <p className="text-green-600 font-semibold">{emailMessage}</p>
            )}
            {emailStatus === "error" && (
              <p className="text-red-600 font-semibold">{emailMessage}</p>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Are you sure you want to delete invoice #{invoiceToDelete?.invoicenumber}?</p>
            <p className="text-sm text-gray-500 mt-2">This action cannot be undone.</p>
          </div>
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setDeleteConfirmOpen(false)}
              className="px-4 py-2 border rounded-md text-sm"
            >
              Cancel
            </button>
            <button
              onClick={() => handleDelete(invoiceToDelete?._id)}
              className="px-4 py-2 bg-red-600 text-white rounded-md text-sm"
            >
              Delete
            </button>
          </div>
        </DialogContent>
      </Dialog>
       <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
    </div>
  );
};

export default InvoiceHead;
