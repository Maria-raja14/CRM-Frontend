import React, { useState, useEffect } from "react";
import axios from "axios";
import { HiDotsVertical } from "react-icons/hi";
import ModalOrganization from "./ModalOrganization";

import { toast } from "react-toastify";

const OrganizationTable = ({
  search,
  setOrganizations,
  organizations,
  refreshOrganizations,
  selectedLeadGroups = [],
}) => {
  // const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Change this number as per your requirement

 

  const filteredOrganizations = organizations.filter((org) => {
    const matchesSearch =
      org.organizationName?.toLowerCase().includes(search.toLowerCase()) ||
      org.leadGroup?.name?.toLowerCase().includes(search.toLowerCase());
  
    const matchesLeadGroup =
      selectedLeadGroups.length === 0 ||
      selectedLeadGroups.includes(org.leadGroup?.name);
  
    return matchesSearch && matchesLeadGroup;
  });
  
  

  // Pagination Logic
  const totalPages = Math.ceil(filteredOrganizations.length / itemsPerPage);
  const paginatedOrganizations = filteredOrganizations.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this organization?"))
      return;
    try {
      await axios.delete(`http://localhost:5000/api/organization/${id}`);
      setOrganizations(organizations.filter((org) => org._id !== id));
      toast.success("Organization deleted successfully!");
    } catch (error) {
      console.error("Error deleting organization:", error);
      toast.error("Failed to delete organization");
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md overflow-y-auto">
      <h2 className="text-lg font-semibold mb-6">Organizations</h2>

      {/* Responsive Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-full border-collapse border-gray-50 bg-white shadow">
          <thead>
            <tr className="bg-gray-200 text-gray-700">
              <th className="p-3 text-left">
                <input
                  type="checkbox"
                  className="form-checkbox h-4 w-4 text-blue-600"
                />
              </th>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">LeadGroup</th>
              <th className="p-3 text-left">Owner</th>
              <th className="p-3 text-left">Address</th>
              <th className="p-3 text-left">Loan</th>
              <th className="p-3 text-left">AAs</th>
              <th className="p-3 text-left">Sites</th>
              <th className="p-3 text-left">Testing </th>
              <th className="p-3 text-left">Kiona </th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedOrganizations.length > 0 ? (
              paginatedOrganizations.map((org) => (
                <tr
                  key={org._id}
                  className="border-b border-gray-50 hover:bg-gray-100"
                >
                  <th className="p-3 text-left">
                    <input
                      type="checkbox"
                      className="form-checkbox h-4 w-4 text-blue-600"
                    />
                  </th>
                  <td className="p-3 flex items-center space-x-2">
                    <div className="w-8 h-8 mt-3 flex items-center justify-center rounded-full bg-gray-400 text-white font-semibold uppercase">
                      {org.organizationName
                        ? org.organizationName.slice(0, 2)
                        : "NA"}
                    </div>
                    <a
                      href="#"
                      className="text-blue-600 font-medium hover:underline truncate"
                    >
                      {org.organizationName || "N/A"}
                    </a>
                  </td>
                  <td className="p-3">
                    {org.leadGroup?.name ? (
                      <span
                        className={`px-3 py-1 text-sm font-semibold rounded-full text-white ${
                          org.leadGroup.name === "Warm Lead"
                            ? "bg-blue-600"
                            : org.leadGroup.name === "Cold Lead"
                            ? "bg-orange-500"
                            : "bg-gray-500"
                        }`}
                      >
                        {org.leadGroup.name}
                      </span>
                    ) : (
                      "N/A"
                    )}
                  </td>
                  <td className="p-3">{org.owner || "N/A"}</td>
                  <td className="p-3 truncate">
                    {org.addressDetails
                      ? `${org.addressDetails.area}, ${org.addressDetails.city}`
                      : "N/A"}
                  </td>
                  <td className="p-3">{org.customFields?.loan || "-"}</td>
                  <td className="p-3">{org.customFields?.AAs || "-"}</td>
                  <td className="p-3">{org.customFields?.Sites || "-"}</td>
                  <td className="p-3">{org.customFields?.testing || "-"}</td>
                  <td className="p-3">{org.customFields?.kiona || "-"}</td>
                  <td className="p-3 relative">
                    <button
                      className="text-gray-500 hover:text-black"
                      onClick={() =>
                        setOpenDropdown(
                          openDropdown === org._id ? null : org._id
                        )
                      }
                    >
                      <HiDotsVertical size={18} />
                    </button>
                    {openDropdown === org._id && (
                      <div className="absolute right-0 mt-2 w-24 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                        <button
                          className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
                          onClick={() => {
                            setOpenDropdown(null);
                            setModalOpen(true);
                            setSelectedOrg(org);
                          }}
                        >
                          Edit
                        </button>
                        <button
                          className="w-full px-4 py-2 text-left text-red-600 hover:bg-gray-100"
                          onClick={() => {
                            setOpenDropdown(null);
                            handleDelete(org._id);
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="13" className="p-3 text-center text-gray-500">
                  No organizations found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-end mt-4 space-x-2 flex-wrap">
        <button
          className="px-4 py-1  rounded-full hover:bg-gray-300 disabled:opacity-50"
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          ←
        </button>
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            className={`px-2 py-1 border rounded-full ${
              currentPage === index + 1
                ? "bg-blue-500 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </button>
        ))}

        <button
          className="px-4 py-1  rounded-full hover:bg-gray-300 disabled:opacity-50"
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          →
        </button>
      </div>

      {modalOpen && (
        <ModalOrganization
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          refreshOrganizations={refreshOrganizations} // ✅ Correct
          organizationData={selectedOrg}
        />
      )}

      
    </div>
  );
};

export default OrganizationTable;



