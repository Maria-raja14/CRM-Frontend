import React, { useState, useEffect, useRef } from "react";
import Proposalgraf from "./Proposalgraf";
import Proposaldetails from "./Proposaldetails";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Proposal = () => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const datePickerRef = useRef(null);

  const dropdownRefs = {
    sales: useRef(null),
    proposal: useRef(null),
    dealStatus: useRef(null),
  };

  const dropdownItems = [
    "Reports",
    "Invoices",
    "Deals",
    "Estimates",
    "Analytics",
    "Performance",
    "Summary",
    "Forecast",
    "Target",
    "Revenue",
    "Leads",
    "Opportunities",
    "Close Rate",
    "Conversion",
    "Pipeline",
  ];

  const handleButtonClick = () => {
    datePickerRef.current.setOpen(true);
  };

  // Handle click outside all dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      const clickedInside = Object.values(dropdownRefs).some(
        (ref) => ref.current && ref.current.contains(event.target)
      );
      if (!clickedInside) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Reusable Dropdown
  const renderDropdown = (label, refKey) => (
    <div
      className="relative inline-block text-left mr-4 mb-4"
      ref={dropdownRefs[refKey]}
    >
      <button
        onClick={() =>
          setOpenDropdown(openDropdown === refKey ? null : refKey)
        }
        className="px-5 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm  text-gray-400 hover:bg-gray-100"
      >
        {label}
        <svg
          className="inline ml-2 w-4 h-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {openDropdown === refKey && (
        <div className="absolute mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10 max-h-48 overflow-y-scroll">
          <div className="py-1">
            {dropdownItems.map((item, index) => (
              <a
                key={index}
                href="#"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="p-4">
      <h1 className="text-[25px] mb-4">Proposal have been sent</h1>

      <div className="flex flex-wrap">
        {renderDropdown("Sales", "sales")}
        {renderDropdown("Proposal have been Send", "proposal")}
        {renderDropdown("Deal Status", "dealStatus")}

        <div className="relative">
          <button
            onClick={handleButtonClick}
            className="px-7 py-2 bg-white border border-gray-300 rounded-xl shadow-sm text-sm text-gray-400 hover:bg-gray-100"
          >
            Created date
          </button>

          <DatePicker
            ref={datePickerRef}
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            className="hidden"
            calendarClassName="rounded-md shadow-md border border-gray-200"
            popperPlacement="bottom-start"
          />
        </div>
      </div>

      <Proposalgraf />
      <Proposaldetails />
    </div>
  );
};

export default Proposal;
