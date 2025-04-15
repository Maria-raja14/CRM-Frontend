

import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash, FaChevronLeft, FaChevronRight, FaSearch } from "react-icons/fa";
import { toast } from "react-toastify";
import axios from "axios";
import AddLeadGroup from "./AddLeadGroup";

const LeadGroupsTable = ({ onOpen, leadGroups, setLeadGroups }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [leadGroupToEdit, setLeadGroupToEdit] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchLeadGroups();
  }, []);

  const fetchLeadGroups = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/leadGroup");
      setLeadGroups(response.data);
    } catch (error) {
      console.error("Error fetching lead groups:", error);
    }
  };

  const deleteLeadGroup = async (id) => {
    if (!window.confirm("Are you sure you want to delete this lead group?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/leadGroup/${id}`);
      setLeadGroups((prev) => prev.filter((group) => group._id !== id));
      toast.success("Lead deleted successfully");
    } catch (error) {
      toast.error("Error deleting lead group");
    }
  };

  const handleEdit = (group) => {
    setLeadGroupToEdit(group);
    setIsEditModalOpen(true);
  };

  const filteredLeadGroups = Array.isArray(leadGroups)
    ? leadGroups.filter((group) =>
        group.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const totalPages = Math.ceil(filteredLeadGroups.length / entriesPerPage);
  const displayedLeadGroups = filteredLeadGroups.slice(
    (currentPage - 1) * entriesPerPage,
    currentPage * entriesPerPage
  );

  const classColors = {
    primary: "bg-blue-500",
    success: "bg-green-500",
    secondary: "bg-gray-500",
    danger: "bg-red-500",
    purple: "bg-purple-500",
    warning: "bg-orange-500",
    info: "bg-cyan-500",
    light: "bg-gray-200",
    dark: "bg-black text-white",
    link: "bg-blue-200",
  };

  return (
    <div className="container mx-auto p-4 ">
      <div className="flex justify-between items-center mb-4 ">
        <h2 className="text-2xl font-semibold text-gray-800">Lead Groups</h2>
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow-lg"
          onClick={onOpen}
        >
          Add Lead Group
        </button>
      </div>

      <div className="mb-4 flex justify-between items-center">
        <select
          className="border border-gray-300 rounded px-2 py-1"
          value={entriesPerPage}
          onChange={(e) => {
            setEntriesPerPage(Number(e.target.value));
            setCurrentPage(1);
          }}
        >
          <option value={2}>2</option>
          <option value={5}>5</option>
          <option value={15}>15</option>
          <option value={25}>25</option>
        </select>

        <div className="relative">
            <input
              type="text"
              placeholder="Search"
              className="border border-gray-50 shadow-sm bg-white rounded-4xl pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <FaSearch className="absolute left-3 top-3 text-gray-500" />
          </div>
      </div>

      <table className="min-w-full bg-white rounded-lg shadow-lg">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-4 px-6 text-left">Name</th>
            <th className="py-4 px-6 text-left">Class</th>
            <th className="py-4 px-6 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {displayedLeadGroups.map((group) => (
            <tr key={group._id} className="border border-gray-50">
              <td className="py-4 px-6">{group.name}</td>
              <td className="py-4 px-5">
                <span className={`px-3 py-1 rounded-full text-white ${classColors[group.leadClass] || "bg-gray-400"}`}>
                  {group.leadClass?.charAt(0).toUpperCase() + group.leadClass?.slice(1) || "N/A"}
                </span>
              </td>
              <td className="py-4 px-6 text-right">
                <button
                  className="text-gray-500 mr-4 hover:text-blue-700 cursor-pointer"
                  onClick={() => handleEdit(group)}
                >
                  <FaEdit />
                </button>
                <button
                  className="text-gray-500 hover:text-red-700 cursor-pointer"
                  onClick={() => deleteLeadGroup(group._id)}
                >
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isEditModalOpen && (
        <AddLeadGroup
          onClose={() => setIsEditModalOpen(false)}
          onAdd={(updatedGroup) => {
            setLeadGroups((prev) =>
              prev.map((group) =>
                group._id === updatedGroup._id ? updatedGroup : group
              )
            );
          }}
          leadGroupToEdit={leadGroupToEdit}
        />
      )}
    </div>
  );
};

export default LeadGroupsTable;
