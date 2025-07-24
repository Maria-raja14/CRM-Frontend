import React, { useState } from "react";
import { HiDotsVertical } from "react-icons/hi";
import ModalPerson from "./ModalPerson";

const PersonTable = ({ persons = [], onDelete, onUpdate }) => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Adjust as needed

  const totalPages = Math.ceil(persons.length / itemsPerPage);
  const paginatedPersons = persons.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const toggleDropdown = (id) => {
    setOpenDropdown((prev) => (prev === id ? null : id));
  };

  const handleEdit = (person) => {
    setSelectedPerson(person);
    setModalOpen(true);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg overflow-y-auto">
      <h2 className="text-lg font-semibold mb-4">All Persons</h2>
      <table className="min-w-full bg-white border border-gray-50 shadow">
        <thead>
          <tr className="bg-gray-200 text-gray-700">
            <th className="py-3 px-4">Name</th>
            <th className="py-3 px-4">Lead Group</th>
            <th className="py-3 px-4">Organization</th>
            <th className="py-3 px-4">Owner</th>
            <th className="py-3 px-4">Card Lead</th>
            <th className="py-3 px-4">Admin</th>
            <th className="py-3 px-4">DBUT</th>
            <th className="py-3 px-4">FIN</th>
            <th className="py-3 px-4">Action</th>
          </tr>
        </thead>
        <tbody>
          {paginatedPersons.length > 0 ? (
            paginatedPersons.map((person) => (
              <tr key={person._id} className="text-center border-b border-gray-50">
                <td className="py-3 px-4">{person.personName || "NA" }</td>
                <td className="p-3">
                  {person.leadGroup?.name ? (
                    <span
                      className={`px-3 py-1 text-sm font-semibold rounded-full text-white ${
                        person.leadGroup.name === "Warm Lead"
                          ? "bg-blue-600"
                          : person.leadGroup.name === "Cold Lead"
                          ? "bg-orange-500"
                          : "bg-gray-500"
                      }`}
                    >
                      {person.leadGroup.name}
                    </span>
                  ) : (
                    "N/A"
                  )}
                </td>
                <td className="py-3 px-4">{person.organization?.organizationName || "N/A"}</td>
                <td className="py-3 px-4">{person.owner || "N/A"}</td>
                <td className="py-3 px-4">{person?.customFields?.cardlead ?? "N/A"}</td>
                <td className="py-3 px-4">{person?.customFields?.admin ?? "N/A"}</td>
                <td className="py-3 px-4">{person?.customFields?.dbut ?? "N/A"}</td>
                <td className="py-3 px-4">{person?.customFields?.fin ?? "N/A"}</td>
                <td className="p-3 relative">
                  <button className="text-gray-500 hover:text-black" onClick={() => toggleDropdown(person._id)}>
                    <HiDotsVertical size={18} />
                  </button>
                  {openDropdown === person._id && (
                    <div className="absolute right-0 mt-2 w-24 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                      <button
                        className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
                        onClick={() => {
                          toggleDropdown(null);
                          handleEdit(person);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="w-full px-4 py-2 text-left text-red-600 hover:bg-gray-100"
                        onClick={() => {
                          toggleDropdown(null);
                          onDelete(person._id);
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
              <td colSpan="9" className="py-4 text-center">
                No persons found
              </td>
            </tr>
          )}
        </tbody>
      </table>
      
      {/* Pagination */}
      <div className="flex justify-end mt-4 space-x-2">
        <button
          className="px-4 py-1 rounded-4xl disabled:opacity-50"
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          ←
        </button>

        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            className={`px-4 py-1 border rounded-4xl ${
              currentPage === index + 1 ? "bg-blue-500 text-white" : "bg-gray-200 hover:bg-gray-300"
            }`}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </button>
        ))}

        <button
          className="px-4 py-1 disabled:opacity-50"
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          →
        </button>
      </div>

      {/* Modal */}
      <ModalPerson isOpen={modalOpen} onClose={() => setModalOpen(false)} person={selectedPerson} onUpdate={onUpdate} />
    </div>
  );
};

export default PersonTable;

