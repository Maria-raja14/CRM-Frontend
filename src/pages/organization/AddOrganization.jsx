import React, { useState,useEffect } from "react";
import { Search, Upload, Download, Plus, Settings } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ModalOrganization from "./ModalOrganization"; // Import the modal
import axios from "axios";

import { useNavigate } from "react-router-dom";

const AddOrganization = ({ search, setSearch, addNewOrganization }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [organizations, setOrganizations] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const navigate = useNavigate();

  const refreshOrganizations = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/organization"
      );
      setOrganizations(response.data || []);
      console.log("Organizations refreshed:", response.data);
    } catch (error) {
      console.error("Error refreshing organizations:", error);
    }
  };
  useEffect(() => {
    refreshOrganizations();
  }, []);
  
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
              className="bg-green-500 text-white px-6 py-2 rounded flex items-center gap-2"
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
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={() => setIsModalOpen(true)}
          >
            Add organization
          </button>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-2 flex-wrap mb-8 items-center justify-between">
        <div className="flex gap-2 flex-wrap">
          {/* Created Date Button */}
          <div className="relative">
            <button
              className="border border-gray-100 bg-white shadow-lg px-4 py-2 rounded-4xl flex items-center gap-2"
              onClick={() => setShowDatePicker(!showDatePicker)}
            >
              Created date
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
            Owner
          </button>
          <button className="border border-gray-100 bg-white shadow-lg px-4 py-2 rounded-4xl flex items-center gap-2">
            Lead group
          </button>
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

      {/* Modal */}
      <ModalOrganization
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        addNewOrganization={addNewOrganization}
        refreshOrganizations={refreshOrganizations}
      />
    </div>
  );
};

export default AddOrganization;
