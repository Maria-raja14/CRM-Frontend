

import React, { useState, useEffect } from "react";
import { Search, Upload, Download, Plus, Settings } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ModalOrganization from "./ModalOrganization";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddOrganization = ({ search, setSearch, addNewOrganization }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState([new Date(), new Date()]);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [leadGroups, setLeadGroups] = useState([]);
  const [showLeadGroupDropdown, setShowLeadGroupDropdown] = useState(false);
  const [selectedLeadGroups, setSelectedLeadGroups] = useState([]);

  const navigate = useNavigate();

  const fetchLeadGroups = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/leadGroup");
      setLeadGroups(response.data);
    } catch (error) {
      console.error("Error fetching lead groups:", error);
    }
  };

  useEffect(() => {
    fetchLeadGroups();
  }, []);

  const handleLeadGroupChange = (groupName) => {
    setSelectedLeadGroups((prevSelected) =>
      prevSelected.includes(groupName)
        ? prevSelected.filter((name) => name !== groupName)
        : [...prevSelected, groupName]
    );
  };

  const handleApplyFilters = () => {
    console.log("Selected lead groups:", selectedLeadGroups);
    // TODO: Call filter API or apply logic here
    setShowLeadGroupDropdown(false);
  };

  return (
    <div>
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold">Organizations</h2>

        {/* Buttons */}
        <div className="flex gap-2">
          {/* Actions Dropdown */}
          <div className="relative">
            <button
              className="bg-green-500 text-white px-6 py-2 rounded flex items-center gap-2 cursor-pointer"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              Actions ▼
            </button>
            {isDropdownOpen && (
              <div className="absolute mt-2 bg-white shadow-md rounded-md w-56 z-50">
                <button
                  className="flex items-center gap-2 px-4 py-2 w-full text-left hover:bg-gray-200"
                  onClick={() => navigate("/import-persons")}
                >
                  <Upload size={16} /> Import persons
                </button>
                <button className="flex items-center gap-2 px-4 py-2 w-full text-left hover:bg-gray-200">
                  <Download size={16} /> Export person
                </button>
                <button className="flex items-center gap-2 px-4 py-2 w-full text-left hover:bg-gray-200">
                  <Plus size={16} /> Add lead group
                </button>
                <button className="flex items-center gap-2 px-4 py-2 w-full text-left hover:bg-gray-200">
                  <Settings size={16} /> Manage lead groups
                </button>
              </div>
            )}
          </div>

          {/* Add Organization Button */}
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer"
            onClick={() => setIsModalOpen(true)}
          >
            Add organization
          </button>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-2 flex-wrap mb-8 items-center justify-between">
        <div className="flex gap-2 flex-wrap">
          {/* Created Date Filter */}
          {/* Created Date Filter */}
          <div className="relative">
            <button
              className="border border-gray-100 bg-white shadow-lg px-4 py-2 rounded-4xl flex items-center gap-2"
              onClick={() => setShowDatePicker(!showDatePicker)}
            >
              Created date
            </button>
            {showDatePicker && (
              <div className="absolute z-50 mt-2 bg-white p-4 shadow-md rounded-md w-[360px] flex gap-4">
                {/* Date range calendar */}
                <div>
                  <DatePicker
                    selected={selectedDate? selectedDate[0] : null}
                    onChange={(date) => setSelectedDate(date)}
                    startDate={selectedDate?.[0]}
                    endDate={selectedDate?.[1]}
                    selectsRange
                    inline
                    monthsShown={2}
                  />
                  <button
                    onClick={() => {
                      console.log("Date Range:", selectedDate);
                      setShowDatePicker(false);
                    }}
                    className="mt-2 px-4 py-2 bg-blue-600 text-white rounded shadow"
                  >
                    Apply
                  </button>
                </div>

                {/* Shortcut options */}
                <div className=" pl-4 flex flex-col gap-3 justify-center text-sm">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="quickDate"
                      onClick={() => {
                        const today = new Date();
                        setSelectedDate([today, today]);
                      }}
                    />
                    Today
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="quickDate"
                      onClick={() => {
                        const today = new Date();
                        const past7 = new Date();
                        past7.setDate(today.getDate() - 7);
                        setSelectedDate([past7, today]);
                      }}
                    />
                    Last 7 Days
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="quickDate"
                      onClick={() => {
                        const start = new Date(
                          new Date().getFullYear(),
                          new Date().getMonth(),
                          1
                        );
                        const end = new Date(
                          new Date().getFullYear(),
                          new Date().getMonth() + 1,
                          0
                        );
                        setSelectedDate([start, end]);
                      }}
                    />
                    This Month
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="quickDate"
                      onClick={() => {
                        const start = new Date(new Date().getFullYear(), 0, 1);
                        const end = new Date(new Date().getFullYear(), 11, 31);
                        setSelectedDate([start, end]);
                      }}
                    />
                    This Year
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* Owner Button */}
          <button className="border border-gray-100 bg-white shadow-lg px-4 py-2 rounded-4xl flex items-center gap-2">
            Owner
          </button>

          {/* Lead Group Dropdown Filter */}
          <div className="relative">
            <button
              className="border border-gray-100 bg-white shadow-lg px-4 py-2 rounded-4xl flex items-center gap-2"
              onClick={() => setShowLeadGroupDropdown(!showLeadGroupDropdown)}
            >
              Lead group
            </button>

            {showLeadGroupDropdown && (
              <div className="absolute z-50 mt-2 max-h-80 w-64 bg-white border border-gray-200 shadow-md rounded-md p-4">
                <div className="max-h-48 grid grid-cols-1 gap-2">
                  {leadGroups.length > 0 ? (
                    leadGroups.map((group, index) => (
                      <label
                        key={index}
                        className="flex items-center gap-2 text-sm"
                      >
                        <input
                          type="checkbox"
                          checked={selectedLeadGroups.includes(group.name)}
                          onChange={() => handleLeadGroupChange(group.name)}
                          className="accent-blue-500"
                        />
                        <span>{group.name}</span>
                      </label>
                    ))
                  ) : (
                    <div className="text-gray-400 text-sm">
                      No lead groups available
                    </div>
                  )}
                </div>
                <button
                  className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition"
                  onClick={handleApplyFilters}
                >
                  Apply
                </button>
              </div>
            )}
          </div>

          {/* Tags Button */}
          <button className="border border-gray-100 bg-white shadow-lg px-4 py-2 rounded-4xl flex items-center gap-2">
            Tags
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

      {/* Modal for adding organizations */}
      <ModalOrganization
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        addNewOrganization={addNewOrganization}
      />
    </div>
  );
};

export default AddOrganization;




