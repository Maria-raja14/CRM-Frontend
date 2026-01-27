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
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
const CustomCalendarInput = React.forwardRef(({ value, onClick, placeholder }, ref) => (
  <div
    onClick={onClick}
    ref={ref}
    className="flex items-center justify-between bg-white border border-gray-200 rounded-2xl px-5 py-2.5 cursor-pointer shadow-sm hover:border-blue-400 transition-all min-w-[260px] h-[48px]"
  >
    {/* Left Icon - Light Gray Outline */}
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>

    {/* Center Text */}
    <span className="text-gray-600 text-[17px] font-normal">
      {value || placeholder}
    </span>

    {/* Right Icon - Bold Black */}
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  </div>
));
const InvoiceHead = () => {
  const API_URL = import.meta.env.VITE_API_URL;

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
  const [dropdownButton, setDropdownButton] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  // modal state for email sending
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [emailMessage, setEmailMessage] = useState("Sending invoice email...");
  const [emailStatus, setEmailStatus] = useState("loading"); // loading | success | error

  const [downloadModalOpen, setDownloadModalOpen] = useState(false);
  const [downloadMessage, setDownloadMessage] = useState(
    "Downloading invoice..."
  );
  const [downloadStatus, setDownloadStatus] = useState("loading"); // loading | success | error

  const dropdownRef = useRef(null);
  const currencyScrollRef = useRef(null);
  const navigate = useNavigate();
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

  // Group by currency with enhanced data
  const groupedTotals = filteredInvoices.reduce((acc, inv) => {
    const cur = inv.currency || "INR"; // default INR
    const total = Number(inv.total) || 0;
    const paid = inv.status === "paid" ? total : 0;
    const due = inv.status !== "paid" ? total : 0;

    if (!acc[cur]) {
      acc[cur] = {
        totalAmount: 0,
        totalPaid: 0,
        totalDue: 0,
        count: 0,
        paidCount: 0,
        dueCount: 0,
      };
    }

    acc[cur].totalAmount += total;
    acc[cur].totalPaid += paid;
    acc[cur].totalDue += due;
    acc[cur].count += 1;

    if (inv.status === "paid") {
      acc[cur].paidCount += 1;
    } else {
      acc[cur].dueCount += 1;
    }

    return acc;
  }, {});


  const fetchInvoices = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const token = localStorage.getItem("token"); // make sure you saved token at login

      const response = await axios.get(
        `${API_URL}/invoice/getInvoice?page=${currentPage}&limit=${itemsPerPage}&assignTo=${user?._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setInvoices(response.data.invoices || response.data);
      setFilteredInvoices(response.data.invoices || response.data);
      setTotalCount(response.data.totalCount || response.data.length);
    } catch (error) {
      toast.error("Error fetching invoices!");
      console.error("Error fetching invoices:", error.response?.data || error);
    }
  };
  const user = JSON.parse(localStorage.getItem("user")); // already exists

  const handleSendEmail = async (invoiceId) => {
    try {
      setSendingEmailId(invoiceId);
      setEmailModalOpen(true);
      setEmailStatus("loading");
      setEmailMessage("📨 Sending invoice email...");

      await axios.post(`${API_URL}/invoice/sendEmail/${invoiceId}`);

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
  {/*if (startDate) {
  const selectedMonth = startDate.getMonth(); // 0-indexed
  const selectedYear = startDate.getFullYear();

  filtered = filtered.filter((invoice) => {
    const invoiceDate = new Date(invoice.createdAt);
    return (
      invoiceDate.getMonth() === selectedMonth &&
      invoiceDate.getFullYear() === selectedYear
    );
  });
}*/}

const applyFilters = () => {
  let filtered = [...invoices];

  // 1. Search Logic
  if (searchTerm) {
    filtered = filtered.filter((inv) =>
      inv.invoicenumber?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  // 2. Date Logic (Year, Month, and Day)
  if (startDate) {
    const sDate = new Date(startDate);
    const sDay = sDate.getDate();
    const sMonth = sDate.getMonth();
    const sYear = sDate.getFullYear();

    filtered = filtered.filter((invoice) => {
      // Check both Created Date and Due Date
      const createdDate = invoice.createdAt ? new Date(invoice.createdAt) : null;
      const dueDate = invoice.dueDate ? new Date(invoice.dueDate) : null;

      const checkMatch = (targetDate) => {
        if (!targetDate || isNaN(targetDate.getTime())) return false;
        return (
          targetDate.getDate() === sDay &&
          targetDate.getMonth() === sMonth &&
          targetDate.getFullYear() === sYear
        );
      };

      // Returns true if either the creation date OR the due date matches the selection
      return checkMatch(createdDate) || checkMatch(dueDate);
    });
  }

  // 3. Status Logic
  if (filterStatus) {
    filtered = filtered.filter((inv) => inv.status === filterStatus);
  }

  // 4. User Logic
  if (filterAssignTo) {
    filtered = filtered.filter((inv) => inv.assignTo?._id === filterAssignTo);
  }

  setFilteredInvoices(filtered);
};
  const handleDelete = async (invoiceId) => {
    try {
      await axios.delete(`${API_URL}/invoice/delete/${invoiceId}`);
      toast.success("Invoice deleted successfully!");
      setRefreshTrigger((prev) => prev + 1);
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
    setRefreshTrigger((prev) => prev + 1);
    setEditingInvoice(null);
  };

  const downloadInvoice = async (invoiceId, invoiceNumber) => {
    try {
      setDownloadModalOpen(true);
      setDownloadStatus("loading");
      setDownloadMessage("📥 Downloading invoice PDF...");

      const response = await axios.get(
        `${API_URL}/invoice/download/${invoiceId}`,
        { responseType: "blob" }
      );
      console.log(response);

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Invoice_${invoiceNumber}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      setDownloadStatus("success");
      setDownloadMessage("Invoice downloaded successfully!");
    } catch (error) {
      setDownloadStatus("error");
      setDownloadMessage(" Failed to download invoice.");
      toast.error("Failed to download invoice.");
      console.error("Error downloading invoice:", error);
    } finally {
      // auto close after 2s
      setTimeout(() => {
        setDownloadModalOpen(false);
      }, 2000);
    }
  };

  // Currency icon mapping
  const getCurrencyIcon = (currency) => {
    switch (currency) {
      case "INR":
        return <FaRupeeSign className="text-indigo-600" />;
      case "USD":
        return <FaDollarSign className="text-teal-600" />;
      case "EUR":
        return <FaEuroSign className="text-rose-600" />;
      case "GBP":
        return <FaPoundSign className="text-amber-600" />;
      default:
        return <FaDollarSign className="text-gray-600" />;
    }
  };

  // Currency background color mapping with unique colors
  const getCurrencyBgColor = (currency) => {
    switch (currency) {
      case "INR":
        return "bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200";
      case "USD":
        return "bg-gradient-to-br from-teal-50 to-teal-100 border-teal-200";
      case "EUR":
        return "bg-gradient-to-br from-rose-50 to-rose-100 border-rose-200";
      case "GBP":
        return "bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200";
      default:
        return "bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200";
    }
  };

  // Currency text color mapping
  const getCurrencyTextColor = (currency) => {
    switch (currency) {
      case "INR":
        return "text-indigo-800";
      case "USD":
        return "text-teal-800";
      case "EUR":
        return "text-rose-800";
      case "GBP":
        return "text-amber-800";
      default:
        return "text-gray-800";
    }
  };
  // Scroll functions for currency cards
  const scrollLeft = () => {
    if (currencyScrollRef.current) {
      currencyScrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (currencyScrollRef.current) {
      currencyScrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  // Pagination functions
  const totalPages = Math.ceil(totalCount / itemsPerPage);
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const handleInvoiceClick = (invoiceId) => {
    navigate(`/invoice/${invoiceId}`);
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Invoices</h1>
        {user?.role.name === "Admin" && (
          <button
            onClick={() => {
              setEditingInvoice(null);
              openModal();
            }}
            className="bg-[#4466f2] p-2 px-4 text-white rounded-sm"
          >
            Create invoices
          </button>
        )}
      </div>

      <InvoiceModal
        onInvoiceSaved={handleInvoiceSaved}
        editingInvoice={editingInvoice}
      />

      {/* Enhanced Multi-Currency Summary Cards with Horizontal Scroll */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Financial Summary
          </h2>
          {Object.keys(groupedTotals).length > 0 && (
            <div className="flex space-x-2 mt-2">
              <button
                onClick={scrollLeft}
                className="p-2  rounded-full bg-white border hover:bg-gray-50 transition-colors shadow-sm"
              >
                <FaChevronLeft className="text-gray-600" />
              </button>
              <button
                onClick={scrollRight}
                className="p-2 rounded-full bg-white border hover:bg-gray-50 transition-colors shadow-sm"
              >
                <FaChevronRight className="text-gray-600" />
              </button>
            </div>
          )}
        </div>

        {Object.keys(groupedTotals).length === 0 ? (
          <div className="bg-white p-8 rounded-xl shadow-sm border text-center">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <p className="text-gray-500">No invoice data available</p>
            <p className="text-gray-400 text-sm mt-1">
              Create your first invoice to see financial insights
            </p>
          </div>
        ) : (
          <div className="relative">
            <div
              ref={currencyScrollRef}
              className="flex overflow-x-auto scrollbar-hide space-4 pb-4 -mx-2 px-2"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {Object.entries(groupedTotals).map(([currency, data]) => (
                <div
                  key={currency}
                  className={`${getCurrencyBgColor(
                    currency
                  )} flex-shrink-0 w-80 p-6 rounded-xl shadow-sm border relative overflow-hidden mx-2 transition-transform hover:scale-[1.02] hover:shadow-md`}
                >
                  {/* Currency header */}
                  <div className="flex justify-between items-start mb-5">
                    <div>
                      <h3
                        className={`text-lg font-semibold ${getCurrencyTextColor(
                          currency
                        )} mb-1`}
                      >
                        {currency}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {data.count} invoice{data.count !== 1 ? "s" : ""}
                      </p>
                    </div>
                    <div className="text-2xl p-2 bg-white rounded-lg shadow-sm">
                      {getCurrencyIcon(currency)}
                    </div>
                  </div>

                  {/* Amount metrics */}
                  <div className="space-y-3 mb-5">
                    {/* Total Amount */}
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-600">
                        Total Amount
                      </span>
                      <span className="font-semibold text-gray-800">
                        {data.totalAmount.toLocaleString()} {currency}
                      </span>
                    </div>

                    {/* Paid Amount */}
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-600">
                        Paid ({data.paidCount})
                      </span>
                      <span className="font-semibold text-green-600">
                        {data.totalPaid.toLocaleString()} {currency}
                      </span>
                    </div>

                    {/* Due Amount */}
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-600">
                        Due ({data.dueCount})
                      </span>
                      <span className="font-semibold text-rose-600">
                        {data.totalDue.toLocaleString()} {currency}
                      </span>
                    </div>
                  </div>

                  {/* Progress bar showing paid vs due */}
                  <div className="mb-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full transition-all duration-500"
                        style={{
                          width: `${data.totalAmount > 0
                              ? (data.totalPaid / data.totalAmount) * 100
                              : 0
                            }%`,
                        }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>
                        {Math.round((data.totalPaid / data.totalAmount) * 100)}%
                        Paid
                      </span>
                      <span>
                        {Math.round((data.totalDue / data.totalAmount) * 100)}%
                        Due
                      </span>
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
        <div className="flex flex-wrap gap-12">
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            dateFormat="dd-MM-yyyy"        // Shows full date (e.g., 22-02-2026)
            placeholderText="dd-mm-yyyy"
            showMonthDropdown             // Allows month selection in header
            showYearDropdown              // Allows year selection in header
            dropdownMode="select"         // Makes them searchable select boxes
            todayButton="Today"           // Adds the 'Today'
            isClearable                   // Adds the 'Clear' option 
            customInput={<CustomCalendarInput />}
          />
          <select
            className="px-4 py-2 rounded-md bg-white border  text-gray-600"
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
            className="px-4 py-2 rounded-md bg-white border  text-gray-600"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="paid">Paid</option>
            <option value="unpaid">Unpaid</option>
          </select>
        </div>

        {/* Search */}
        <div className="flex items-center border rounded-full bg-white px-3  w-[250px]">
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
              <th className="px-6 py-3">Due Date</th>
              <th className="px-6 py-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredInvoices.map((invoice, index) => (
              <tr
                key={invoice._id}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleInvoiceClick(invoice._id)}
                    className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
                  >
                    {invoice.invoicenumber}
                  </button>
                </td>

                <td className="px-6 py-4">
                  {invoice.items?.[0]?.deal?.dealName || "N/A"}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 text-xs font-semibold rounded-full ${invoice.status === "paid"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                      }`}
                  >
                    {invoice.status}
                  </span>
                </td>
                <td className="px-6 py-4 font-semibold">
                  {invoice.total
                    ? Number(invoice.total).toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })
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
                    ? new Date(invoice.dueDate).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })
                    : "-"}
                </td>

                <td className="px-6 py-4 text-center relative">
                  <button
                    onClick={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const spaceBelow = window.innerHeight - rect.bottom;
                      const spaceAbove = rect.top;

                      const position = spaceBelow > 200 ? "below" : "above"; // if not enough space, open above

                      setOpenIndex(openIndex === index ? null : index);
                      setDropdownButton({
                        rect,
                        position,
                      });
                    }}
                    className="p-2 rounded-full hover:bg-gray-100 text-gray-500"
                  >
                    <FaEllipsisV />
                  </button>

                  {openIndex === index &&
                    ReactDOM.createPortal(
                      <div
                        ref={dropdownRef}
                        className="absolute z-50 bg-white border rounded-md shadow-lg"
                        style={{
                          top:
                            dropdownButton?.position === "below"
                              ? dropdownButton.rect.bottom + window.scrollY
                              : dropdownButton.rect.top +
                              window.scrollY -
                              (dropdownRef.current?.offsetHeight || 150),
                          left: dropdownButton
                            ? dropdownButton.rect.left + window.scrollX
                            : 0,
                          minWidth: "8rem",
                        }}
                      >
                        <button
                          className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                          onClick={() => handleSendEmail(invoice._id)}
                        >
                          Send to Email
                        </button>
                        <button
                          className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                          onClick={() =>
                            downloadInvoice(invoice._id, invoice.invoicenumber)
                          }
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
                      </div>,
                      document.body
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
            Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
            {Math.min(currentPage * itemsPerPage, totalCount)} of {totalCount}{" "}
            entries
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
                  className={`px-3 py-1 rounded-md border text-sm ${currentPage === pageNum ? "bg-blue-500 text-white" : ""
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
            <p>
              Are you sure you want to delete invoice #
              {invoiceToDelete?.invoicenumber}?
            </p>
            <p className="text-sm text-gray-500 mt-2">
              This action cannot be undone.
            </p>
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
      {/* Download PDF Modal */}
      <Dialog open={downloadModalOpen} onOpenChange={setDownloadModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Download Status</DialogTitle>
          </DialogHeader>
          <div className="py-6 text-center">
            {downloadStatus === "loading" && (
              <p className="text-blue-600 font-medium animate-pulse">
                {downloadMessage}
              </p>
            )}
            {downloadStatus === "success" && (
              <p className="text-green-600 font-semibold">{downloadMessage}</p>
            )}
            {downloadStatus === "error" && (
              <p className="text-red-600 font-semibold">{downloadMessage}</p>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
      />

      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default InvoiceHead;
