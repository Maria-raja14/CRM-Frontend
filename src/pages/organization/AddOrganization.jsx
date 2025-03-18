import React, { useState } from "react";
import { Calendar, User, Tag, ListFilter, Search } from "lucide-react";
import ModalOrganization from "./ModalOrganization"; // Import the modal


const AddOrganization = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Organizations</h2>

        {/* Buttons */}
        <div className="flex gap-2">
          {/* Actions Dropdown (Basic) */}
          <div className="relative">
            <button className="bg-green-500 text-white px-4 py-2 rounded-md">Actions ⌄</button>
            <div className="absolute mt-2 bg-white shadow-md rounded-md hidden group-hover:block">
              <button className="block px-4 py-2 w-full text-left hover:bg-gray-200">Export Data</button>
              <button className="block px-4 py-2 w-full text-left hover:bg-gray-200">Import Data</button>
            </div>
          </div>

          {/* Add Organization Button */}
          <button className="bg-blue-500 text-white px-4 py-2 rounded-md" onClick={() => setIsModalOpen(true)} >Add organization</button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap mb-4">
        <button className="border px-4 py-2 rounded-md flex items-center gap-2">
          <Calendar size={16} /> Created date
        </button>
        <button className="border px-4 py-2 rounded-md flex items-center gap-2">
          <User size={16} /> Owner
        </button>
        <button className="border px-4 py-2 rounded-md flex items-center gap-2">
          <ListFilter size={16} /> Lead group
        </button>
        <button className="border px-4 py-2 rounded-md flex items-center gap-2">
          <Tag size={16} /> Tags
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative w-64">
        <Search className="absolute left-2 top-2.5 text-gray-400" size={16} />
        <input
          type="text"
          placeholder="Search"
          className="pl-8 py-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>
      <ModalOrganization isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default AddOrganization;
