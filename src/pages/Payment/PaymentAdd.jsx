import React, { useState } from "react";
import { Search } from "lucide-react";
import * as XLSX from "xlsx";

const PaymentAdd = () => {
  const [search, setSearch] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);

  const exportToExcel = () => {
    const sampleData = [
        ["Invoice No", "Deal Name", "Leads", "Payment method", "Amount","Owner"], // headers
      
      ];
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet([]);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, "Payment_report.csv");
  };

  return (
    <div>
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold">Payment</h2>

        {/* Buttons */}
        <div className="flex gap-2">
          <button
            onClick={exportToExcel}
            className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer"
          >
            Export
          </button>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-2 flex-wrap mb-8 items-center justify-between">
        <div className="flex gap-2 flex-wrap">
          <div className="relative">
            <button
              className="border border-gray-100 bg-white shadow-lg px-5 py-1.5 rounded-4xl flex items-center gap-2"
              onClick={() => setShowDatePicker(!showDatePicker)}
            >
              Created date
            </button>
          </div>

          <button className="border border-gray-100 bg-white shadow-lg px-5 py-1.5 rounded-4xl flex items-center gap-2">
            Owner
          </button>

          <button className="border border-gray-100 bg-white shadow-lg px-5 py-1.5 rounded-4xl flex items-center gap-2">
            Deals
          </button>

          <button className="border border-gray-100 bg-white shadow-lg px-5 py-1.5 rounded-4xl flex items-center gap-2">
            Payment Method
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative w-56">
          <Search className="absolute left-2 top-2.5 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search invoice"
            className="pl-8 py-1.5 w-full border border-gray-100 bg-white shadow-lg rounded-4xl focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Table Section */}
<div className="bg-white shadow-md rounded-lg overflow-x-auto">
  <table className="min-w-full table-auto text-sm text-left">
    <thead className="bg-gray-100 text-gray-700 font-medium">
      <tr>
        <th className="px-4 py-3">Invoice number</th>
        <th className="px-4 py-3">Deal name</th>
        <th className="px-4 py-3">Leads</th>
        <th className="px-4 py-3">Payment method</th>
        <th className="px-4 py-3">Amount</th>
        <th className="px-4 py-3">Owner</th>
      </tr>
    </thead>

    {/* Empty state */}
    <tbody>
      <tr>
        <td colSpan="6" className="text-center py-10 text-gray-500">
          <div className="flex flex-col items-center gap-2">
            <img
              src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png"
              alt="Empty"
              className="w-12 h-12 opacity-40"
            />
            <div className="font-medium">Nothing to show here</div>
            <p className="text-sm text-gray-400">
              Please add a new entity or manage the data table to see the content here<br />Thank you
            </p>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</div>

    </div>
  );
};

export default PaymentAdd;
