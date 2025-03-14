// import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import axios from "axios";
// import { FaEdit, FaTrash, FaCalendarAlt, FaSearch } from "react-icons/fa";
// import AddLeadGroup from "./AddLeadGroup";

// const LeadGroupsTable = ({ onOpen, leadGroups, setLeadGroups }) => {
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//   const [leadGroupToEdit, setLeadGroupToEdit] = useState(null);
//   const [searchQuery, setSearchQuery] = useState(""); // 🔹 State for search input

//   useEffect(() => {
//     fetchLeadGroups();
//   }, []);

//   const fetchLeadGroups = async () => {
//     try {
//       const response = await axios.get("http://localhost:5000/api/leadGroup");
//       setLeadGroups(response.data);
//     } catch (error) {
//       console.error("Error fetching lead groups:", error);
//     }
//   };

//   const deleteLeadGroup = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this lead group?")) return;

//     try {
//       await axios.delete(`http://localhost:5000/api/leadGroup/${id}`);
//       setLeadGroups((prev) => prev.filter((group) => group._id !== id));
//     } catch (error) {
//       console.error("Error deleting lead group:", error);
//     }
//   };

//   const handleEdit = (group) => {
//     setLeadGroupToEdit(group);
//     setIsEditModalOpen(true);
//   };

//   const filteredLeadGroups = leadGroups.filter((group) =>
//     group.name.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   const classColors = {
//     primary: "bg-blue-500",
//     success: "bg-green-500",
//     secondary: "bg-gray-500",
//     danger: "bg-red-500",
//     purple: "bg-purple-500",
//     warning: "bg-orange-500",
//     info: "bg-cyan-500",
//     light: "",
//     dark: "bg-black text-white",
//     link: "",
//   };

//   return (
//     <div className="container mx-auto p- ">
//       {/* Header Section */}
//       <div className="flex justify-between items-center">
//         <h2 className="text-2xl font-semibold">Lead Groups</h2>
//         <button
//           className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-1.5 rounded-sm"
//           onClick={onOpen}
//         >
//           Add lead group
//         </button>
//       </div>

//       <div className="p-2 text-blue-500">
//         <Link to="/dashboard">dashboard</Link> / lead group
//       </div>

//       {/* Filters Section */}
//       <div className="flex justify-between items-center mt-4">
//         <div className="flex items-center space-x-2">
//           <div className="bg-white p-2 rounded-md shadow">
//             <FaCalendarAlt className="text-gray-600" size={18} />
//           </div>
//           <div className="flex items-center space-x-2 bg-white px-6 py-2 rounded-4xl shadow-md border border-gray-50">
//             <span className="text-gray-600">Created date</span>
//           </div>
//         </div>

//         <div className="relative">
//           <input
//             type="text"
//             placeholder="Search"
//             className="border border-gray-50 shadow-sm bg-white rounded-4xl pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//           />
//           <FaSearch className="absolute left-3 top-3 text-gray-500" />
//         </div>
//       </div>

//       <p className="text-gray-400 mt-2">
//         Showing {filteredLeadGroups.length} of {leadGroups.length} items
//       </p>

//       {/* Table Section */}
//       <div className="mt-4 bg-white p-4 shadow-2xl rounded-lg">
//         <table className="min-w-full">
//           <thead>
//             <tr className="border-b border-gray-100">
//               <th className="py-4 px-4 text-left font-medium">Name</th>
//               <th className="py-4 px-6 text-left font-medium">Class</th>
//               <th className="py-4 px-6 text-end font-medium">Action</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredLeadGroups.map((group) => (
//               <tr key={group._id} className="border-b border-gray-50">
//                 <td className="py-6 px-4">{group.name}</td>
//                 <td className="py-6 px-4">
//                   <span
//                     className={`px-3 py-1 rounded-2xl text-white ${
//                       classColors[group.leadClass] || "bg-gray-500"
//                     }`}
//                   >
//                     {group.leadClass.charAt(0).toUpperCase() + group.leadClass.slice(1)}
//                   </span>
//                 </td>
//                 <td className="py-3 px-4 text-end">
//                   <button className="hover:text-blue-300 mr-8" onClick={() => handleEdit(group)}>
//                     <FaEdit />
//                   </button>
//                   <button className="hover:text-blue-300" onClick={() => deleteLeadGroup(group._id)}>
//                     <FaTrash />
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* Edit Modal */}
//       {isEditModalOpen && (
//         <AddLeadGroup
//           onClose={() => setIsEditModalOpen(false)}
//           onAdd={(updatedGroup) => {
//             setLeadGroups((prev) =>
//               prev.map((group) => (group._id === updatedGroup._id ? updatedGroup : group))
//             );
//           }}
//           leadGroupToEdit={leadGroupToEdit}
//         />
//       )}
//     </div>
//   );
// };

// export default LeadGroupsTable;

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { FaEdit, FaTrash, FaCalendarAlt, FaSearch } from "react-icons/fa";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

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
    if (!window.confirm("Are you sure you want to delete this lead group?"))
      return;

    try {
      await axios.delete(`http://localhost:5000/api/leadGroup/${id}`);
      setLeadGroups((prev) => prev.filter((group) => group._id !== id));
    } catch (error) {
      console.error("Error deleting lead group:", error);
    }
  };

  const handleEdit = (group) => {
    setLeadGroupToEdit(group);
    setIsEditModalOpen(true);
  };

  const filteredLeadGroups = leadGroups.filter((group) =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination Logic
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
    light: "",
    dark: "bg-black text-white",
    link: "",
  };

  return (
    <div className="container mx-auto p-">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-500">Lead Groups</h2>
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-1.5 rounded-sm"
          onClick={onOpen}
        >
          Add lead group
        </button>
      </div>

      <div className="p-2 text-blue-500">
        <Link to="/dashboard">dashboard</Link> / lead group
      </div>

      <p className="text-gray-400 mt-2">
        Showing {displayedLeadGroups.length} of {leadGroups.length} items
      </p>

      {/* Table Section */}
      <div className="mt-4 bg-white p-4 shadow-2xl rounded-lg ">
        <div className="border-b border-gray-50 p-4  flex justify-between items-center  ">
          <h2 className="text-2xl  text-gray-500">Find Lead Groups</h2>
          <div className="flex items-center space-x-2">
            <div className="bg-white p-2 rounded-md shadow">
              <FaCalendarAlt className="text-gray-600" size={18} />
            </div>
            <div className="flex items-center space-x-2 bg-white px-6 py-2 rounded-4xl shadow-md border border-gray-50">
              <span className="text-gray-600">Created date</span>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center mt-6 border-b border-gray-50">
          {/* Entries Per Page Dropdown */}
          <div className="flex items-center space-x-3 px-2">
            <select
              className="border border-gray-300 rounded p-1 px-1"
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
            <span className="text-gray-600">entries per page</span>
          </div>

          {/* Search Input */}
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

        <table className="min-w-full mt-6">
          <thead>
            <tr className="">
              <th className="py-4 px-4 text-left font-medium">Name</th>
              <th className="py-4 px-6 text-left font-medium">Class</th>
              <th className="py-4 px-6 text-end font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {displayedLeadGroups.map((group) => (
              <tr key={group._id} className="border-b border-gray-50">
                <td className="py-6 px-4">{group.name}</td>
                <td className="py-6 px-4">
                  <span
                    className={`px-3 py-1 rounded-2xl text-white ${
                      classColors[group.leadClass] || "bg-gray-500"
                    }`}
                  >
                    {group.leadClass.charAt(0).toUpperCase() +
                      group.leadClass.slice(1)}
                  </span>
                </td>
                <td className="py-3 px-4 text-end">
                  <button
                    className="hover:text-blue-300 mr-8"
                    onClick={() => handleEdit(group)}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="hover:text-blue-300"
                    onClick={() => deleteLeadGroup(group._id)}
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination Controls */}
        {/* Pagination Controls */}
        <div className="mt-4 flex justify-end items-center space-x-2 text-gray-600">
          {/* "Go to page" label */}
          <span>Go to page</span>

          {/* Page Input Field */}
          <input
            type="number"
            min="1"
            max={totalPages}
            value={currentPage}
            onChange={(e) => {
              const page = Number(e.target.value);
              if (page >= 1 && page <= totalPages) {
                setCurrentPage(page);
              }
            }}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                const page = Number(e.target.value);
                if (page >= 1 && page <= totalPages) {
                  setCurrentPage(page);
                }
              }
            }}
            className="border border-gray-300 px-2 py-1 rounded w-12 text-center outline-none"
          />

          {/* Previous Page Button */}
          <button
            className={`px-3 py-1 rounded-full ${
              currentPage === 1
                ? "text-gray-400 cursor-not-allowed"
                : "text-blue-500"
            }`}
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            <FaChevronLeft />
          </button>

          {/* Page Numbers */}
          {[...Array(totalPages)].map((_, index) => {
            const pageNumber = index + 1;
            return (
              <button
                key={pageNumber}
                className={`px-3 py-1 rounded-full ${
                  currentPage === pageNumber
                    ? "bg-blue-500 text-white"
                    : "text-blue-500 hover:bg-blue-100"
                }`}
                onClick={() => setCurrentPage(pageNumber)}
              >
                {pageNumber}
              </button>
            );
          })}

          {/* Next Page Button */}
          <button
            className={`px-3 py-2 rounded-full ${
              currentPage === totalPages
                ? "text-gray-400 cursor-not-allowed"
                : "text-blue-500"
            }`}
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            <FaChevronRight />
          </button>
        </div>
      </div>

      {/* Edit Modal */}
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
