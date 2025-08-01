// import React, { useState } from "react";
// import { Search } from "lucide-react";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
// import ExpensesTable from "./Expenses_Pagination";
// import ExpenseModal from "./Expenses_modal_popup";

// const Pipeline = ({ search, setSearch }) => {
//   const [selectedDate, setSelectedDate] = useState(null);
//   const [showDatePicker, setShowDatePicker] = useState(false);
//   const [isModalOpen, setIsModalOpen] = useState(false); // State to handle modal visibility

//   return (
//     <div>
//       {/* Header Section */}
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-lg font-semibold">Expenses</h2>
//         <div className="flex gap-2">
//           {/* <button
//             className="bg-blue-500 text-white px-4 py-2 rounded"
//             onClick={() => setIsModalOpen(true)} // Open modal on click
//           >
//             Add Expenses
//           </button> */}
//         </div>
//       </div>

//       {/* Filter Buttons */}
//       <div className="flex gap-2 flex-wrap mb-8 items-center justify-between">
//         <div className="flex gap-2 flex-wrap">
//           {/* Date Filter */}
//           <div className="relative">
//             <button
//               className="border border-gray-100 bg-white shadow-lg px-4 py-2 rounded-4xl flex items-center gap-2"
              
//             >
//               Date
//             </button>
            
//           </div>

//           <button className="border border-gray-100 bg-white shadow-lg px-4 py-2 rounded-4xl flex items-center gap-2">
//             Expense Date
//           </button>

//           <button className="border border-gray-100 bg-white shadow-lg px-4 py-2 rounded-4xl flex items-center gap-2">
//             Expense Area
//           </button>

//           <button className="border border-gray-100 bg-white shadow-lg px-4 py-2 rounded-4xl flex items-center gap-2">
//             Created By
//           </button>
//         </div>

//         {/* Search Bar */}
//         <div className="relative w-56">
//           <Search className="absolute left-2 top-2.5 text-gray-400" size={16} />
//           <input
//             type="text"
//             placeholder="Search"
//             className="pl-8 py-2 w-full border border-gray-100 bg-white shadow-lg rounded-4xl focus:outline-none focus:ring-2 focus:ring-blue-400"
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//           />
//         </div>
//       </div>

//       <ExpensesTable />

//       {/* Expense Modal */}
//       <ExpenseModal open={isModalOpen} onClose={() => setIsModalOpen(false)} />
//     </div>
//   );
// };

// export default Pipeline;//fc



import React, { useState, useRef, useEffect } from "react";
import { Search } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ExpensesTable from "./Expenses_Pagination";
import ExpenseModal from "./Expenses_modal_popup";

const Pipeline = ({ search, setSearch }) => {
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const [activeDatePicker, setActiveDatePicker] = useState(null); // 'date' or 'expenseDate'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const datePickerRef = useRef(null);

  // Handle click outside to close date picker
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target)) {
        setActiveDatePicker(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleDateButtonClick = (type) => {
    setActiveDatePicker(activeDatePicker === type ? null : type);
  };

  const handleDateChange = (update) => {
    setDateRange(update);
    if (update[0] && update[1]) {
      setActiveDatePicker(null);
    }
  };

  const clearDates = () => {
    setDateRange([null, null]);
    setActiveDatePicker(null);
  };

  return (
    <div>
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold">Expenses</h2>
        <div className="flex gap-2">
          {/* Add Expenses button can be uncommented when needed */}
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-2 flex-wrap mb-8 items-center justify-between">
        <div className="flex gap-2 flex-wrap">
          {/* Date Filter */}
          <div className="relative" ref={datePickerRef}>
            <button
              className={`border border-gray-100 bg-white shadow-lg px-4 py-2 rounded-4xl flex items-center gap-2 ${
                activeDatePicker === 'date' ? 'ring-2 ring-blue-400' : ''
              }`}
              onClick={() => handleDateButtonClick('date')}
            >
              Date
              {(startDate || endDate) && (
                <span className="text-xs text-gray-500">
                  {startDate?.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  {endDate && ` - ${endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`}
                </span>
              )}
            </button>
            
            {activeDatePicker === 'date' && (
              <div className="absolute z-50 mt-2 bg-white p-4 shadow-xl rounded-lg border border-gray-200">
                <div className="flex">
                  <DatePicker
                    selectsRange={true}
                    startDate={startDate}
                    endDate={endDate}
                    onChange={handleDateChange}
                    isClearable={true}
                    monthsShown={2}
                    inline
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                    calendarClassName="flex space-x-4"
                    wrapperClassName="date-picker"
                  />
                </div>
                <div className="flex justify-between mt-3 border-t pt-3">
                  <button
                    className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded"
                    onClick={clearDates}
                  >
                    Clear
                  </button>
                  <button
                    className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                    onClick={() => setActiveDatePicker(null)}
                  >
                    Apply
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Expense Date Filter */}
          <div className="relative" ref={datePickerRef}>
            <button
              className={`border border-gray-100 bg-white shadow-lg px-4 py-2 rounded-4xl flex items-center gap-2 ${
                activeDatePicker === 'expenseDate' ? 'ring-2 ring-blue-400' : ''
              }`}
              onClick={() => handleDateButtonClick('expenseDate')}
            >
              Expense Date
              {(startDate || endDate) && (
                <span className="text-xs text-gray-500">
                  {startDate?.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  {endDate && ` - ${endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`}
                </span>
              )}
            </button>
            
            {activeDatePicker === 'expenseDate' && (
              <div className="absolute z-50 mt-2 bg-white p-4 shadow-xl rounded-lg border border-gray-200">
                <div className="flex">
                  <DatePicker
                    selectsRange={true}
                    startDate={startDate}
                    endDate={endDate}
                    onChange={handleDateChange}
                    isClearable={true}
                    monthsShown={2}
                    inline
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                    calendarClassName="flex space-x-4"
                    wrapperClassName="date-picker"
                  />
                </div>
                <div className="flex justify-between mt-3 border-t pt-3">
                  <button
                    className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded"
                    onClick={clearDates}
                  >
                    Clear
                  </button>
                  <button
                    className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                    onClick={() => setActiveDatePicker(null)}
                  >
                    Apply
                  </button>
                </div>
              </div>
            )}
          </div>

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

      {/* Display selected date range */}
      {startDate && endDate && (
        <div className="mb-4 text-sm text-gray-600">
          Showing expenses from {startDate.toLocaleDateString()} to {endDate.toLocaleDateString()}
        </div>
      )}

      <ExpensesTable dateRange={dateRange} />

      {/* Expense Modal */}
      <ExpenseModal open={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default Pipeline;//final filter come..




