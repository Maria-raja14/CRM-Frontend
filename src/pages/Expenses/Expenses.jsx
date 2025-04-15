import React, { useState } from "react";
import { Search } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ExpensesTable from "./Expenses_Pagination";
import ExpenseModal from "./Expenses_modal_popup";

const Pipeline = ({ search, setSearch }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // State to handle modal visibility

  return (
    <div>
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold">Expenses</h2>
        <div className="flex gap-2">
          {/* <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={() => setIsModalOpen(true)} // Open modal on click
          >
            Add Expenses
          </button> */}
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-2 flex-wrap mb-8 items-center justify-between">
        <div className="flex gap-2 flex-wrap">
          {/* Date Filter */}
          <div className="relative">
            <button
              className="border border-gray-100 bg-white shadow-lg px-4 py-2 rounded-4xl flex items-center gap-2"
              onClick={() => setShowDatePicker(!showDatePicker)}
            >
              Date
            </button>
            {showDatePicker && (
              <div className="absolute mt-2 bg-white p-2 shadow-md rounded-md">
                <DatePicker
                  selected={selectedDate}
                  onChange={(date) => {
                    setSelectedDate(date);
                    setShowDatePicker(false);
                  }}
                  dateFormat="yyyy-MM-dd"
                  className="border p-2 rounded-md"
                />
              </div>
            )}
          </div>

          <button className="border border-gray-100 bg-white shadow-lg px-4 py-2 rounded-4xl flex items-center gap-2">
            Expense Date
          </button>

          <button className="border border-gray-100 bg-white shadow-lg px-4 py-2 rounded-4xl flex items-center gap-2">
            Expense Area
          </button>

          <button className="border border-gray-100 bg-white shadow-lg px-4 py-2 rounded-4xl flex items-center gap-2">
            Created By
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative w-56">
          <Search className="absolute left-2 top-2.5 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search"
            className="pl-8 py-2 w-full border border-gray-100 bg-white shadow-lg rounded-4xl focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <ExpensesTable />

      {/* Expense Modal */}
      <ExpenseModal open={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default Pipeline;
