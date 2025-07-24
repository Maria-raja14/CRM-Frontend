import React, { useState, useEffect, useRef } from "react";
import DatePicker from "react-datepicker";
import { FaCalendarAlt, FaEllipsisV } from "react-icons/fa";
import { useModal } from "../../context/ModalContext.jsx";
import InvoiceModal from "./InvoiceModal.jsx";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import "react-datepicker/dist/react-datepicker.css";

const InvoiceHead = () => {
  const { openModal } = useModal();
  const [startDate, setStartDate] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterOwner, setFilterOwner] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterMethod, setFilterMethod] = useState("");
  const [openIndex, setOpenIndex] = useState(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    fetchInvoices();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchTerm, startDate, filterOwner, filterStatus, filterMethod, invoices]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenIndex(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchInvoices = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/auth/invoice/getInvoice");
      setInvoices(response.data);
      setFilteredInvoices(response.data);
    } catch (error) {
      console.error("Error fetching invoices:", error);
    }
  };

  const applyFilters = () => {
    let filtered = invoices;

    if (searchTerm) {
      filtered = filtered.filter((invoice) =>
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

    if (filterOwner) {
      filtered = filtered.filter((invoice) => invoice.owner === filterOwner);
    }

    if (filterStatus) {
      filtered = filtered.filter((invoice) => invoice.status === filterStatus);
    }

    if (filterMethod) {
      filtered = filtered.filter((invoice) => invoice.paymentMethod === filterMethod);
    }

    setFilteredInvoices(filtered);
  };

  const handleDelete = async (invoiceId) => {
    try {
      await axios.delete(`http://localhost:5000/api/auth/invoice/delete/${invoiceId}`);
      const updated = invoices.filter((invoice) => invoice._id !== invoiceId);
      setInvoices(updated);
    } catch (error) {
      console.error("Error deleting invoice:", error);
    }
  };

  const createInvoice = async (invoiceData) => {
    try {
      const response = await axios.post("http://localhost:5000/api/invoices", invoiceData);
      const updated = [...invoices, response.data];
      setInvoices(updated);
    } catch (error) {
      console.error("Error creating invoice:", error);
    }
  };

  const generatePDF = (invoice) => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Invoice", 105, 20, { align: "center" });
    doc.rect(10, 10, 190, 30);

    doc.setFontSize(12);
    const details = [
      ["Invoice #", invoice.invoicenumber || "N/A"],
      ["Owner", invoice.owner || "N/A"],
      ["Status", invoice.status || "N/A"],
      ["Payment Method", invoice.paymentMethod || "N/A"],
    ];

    let y = 50;
    details.forEach(([key, value]) => {
      doc.text(`${key}: ${value}`, 14, y);
      y += 10;
    });

    autoTable(doc, {
      startY: y + 10,
      head: [["Deal Name", "Amount (Rs.)"]],
      body: invoice.items?.map((item) => [item.deal || "N/A", item.amount || "0"]) || [],
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
    doc.text(`Total Amount: Rs. ${invoice.total || 0}`, 14, finalY);
    doc.setFontSize(12).setTextColor(0, 0, 0);
    doc.text(`Tax: Rs. ${invoice.tax || 0}`, 14, finalY + 10);

    const footerY = finalY + 25;
    doc.setFontSize(10);
    doc.text("Company Name | Address | Phone | Email", 105, footerY, { align: "center" });
    doc.setFontSize(8).setTextColor(169, 169, 169);
    doc.text("Terms & Conditions: Payment due within 30 days.", 105, footerY + 10, {
      align: "center",
    });

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

  return (
    <div className="p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Invoices</h1>
        <button onClick={openModal} className="bg-[#4466f2] p-2 px-4 text-white rounded-sm">
          Create invoices
        </button>
      </div>

      <InvoiceModal onSubmit={createInvoice} />

      <div className="flex justify-between gap-5 items-center mt-10">
        <div className="bg-[#4466f2] p-6 py-5 pl-9 pr-[250px] text-white rounded-sm">
          <h3 className="text-lg">Total Amount</h3>
          <p className="text-sm">Rs.{totalAmount.toFixed(2)}</p>
        </div>
        <div className="bg-[#46c35f] py-5 pl-5 pr-[250px] text-white rounded-sm">
          <h3 className="text-lg">Total Paid</h3>
          <p className="text-sm">Rs.{totalPaid.toFixed(2)}</p>
        </div>
        <div className="bg-[#fc6510] py-5 pl-5 pr-[250px] text-white rounded-sm">
          <h3 className="text-lg">Total Due</h3>
          <p className="text-sm">Rs.{totalDue.toFixed(2)}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap justify-between gap-4 mt-10">
        <div className="flex flex-wrap gap-2">
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            className="text-center py-2 shadow-2xl text-gray-400 bg-white rounded-3xl"
            placeholderText="Filter by Date"
          />
          <select
            className="px-7 py-2 shadow-2xl text-gray-400 bg-white rounded-3xl"
            value={filterOwner}
            onChange={(e) => setFilterOwner(e.target.value)}
          >
            <option value="">All Owners</option>
            {[...new Set(invoices.map((inv) => inv.owner))].map((owner) => (
              <option key={owner}>{owner}</option>
            ))}
          </select>
          <select
            className="px-7 py-2 shadow-2xl text-gray-400 bg-white rounded-3xl"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="paid">Paid</option>
            <option value="unpaid">Unpaid</option>
          </select>
          <select
            className="px-7 py-2 shadow-2xl text-gray-400 bg-white rounded-3xl"
            value={filterMethod}
            onChange={(e) => setFilterMethod(e.target.value)}
          >
            <option value="">All Methods</option>
            {[...new Set(invoices.map((inv) => inv.paymentMethod))].map((method) => (
              <option key={method}>{method}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center border rounded-3xl bg-white w-[250px] px-2">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search Invoice #"
            className="p-1.5 pl-2 w-full outline-none bg-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <p className="mt-4 text-gray-500">
        Showing {filteredInvoices.length} of {invoices.length} invoices
      </p>

      {/* Table */}
      <div className="bg-white mt-4 rounded-md overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left p-3 text-gray-600">Invoice #</th>
              <th className="text-left p-3 text-gray-600">Deal</th>
              <th className="text-left p-3 text-gray-600">Status</th>
              <th className="text-left p-3 text-gray-600">Method</th>
              <th className="text-left p-3 text-gray-600">Amount</th>
              <th className="text-left p-3 text-gray-600">Owner</th>
              <th className="text-left p-3 text-gray-600">Tax</th>
              <th className="text-left p-3 text-gray-600">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredInvoices.map((invoice, index) => (
              <tr key={invoice._id} className="border-t hover:bg-gray-100">
                <td className="p-2">{invoice.invoicenumber}</td>
                <td className="p-2">
                  {invoice.items?.[0]?.deal || "N/A"}
                </td>
                <td
                  className={`text-center px-5 text-white rounded ${
                    invoice.status === "paid" ? "bg-green-500" : "bg-red-500"
                  }`}
                >
                  {invoice.status}
                </td>
                <td className="p-5">{invoice.paymentMethod}</td>
                <td className="p-2">Rs.{invoice.total}</td>
                <td className="p-2">{invoice.owner}</td>
                <td className="py-2">Rs.{invoice.tax}</td>
                <td className="p-2 relative" ref={dropdownRef}>
                  <button
                    onClick={() =>
                      setOpenIndex(openIndex === index ? null : index)
                    }
                    className="text-gray-600"
                  >
                    <FaEllipsisV />
                  </button>
                  {openIndex === index && (
                    <div className="absolute right-0 bg-white shadow-md rounded border mt-2 z-10">
                      <button
                        className="block w-full text-left px-4 py-2 hover:bg-gray-200"
                        onClick={() => generatePDF(invoice)}
                      >
                        Download
                      </button>
                      <button
                        className="block w-full text-left px-4 py-2 hover:bg-gray-200"
                        onClick={() => handleDelete(invoice._id)}
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
                <td colSpan="8" className="text-center py-4 text-gray-400">
                  No invoices found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InvoiceHead;
