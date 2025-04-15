import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import { FaCalendarAlt, FaEdit, FaTrash } from "react-icons/fa";
import { useModal } from "../../context/ModalContext";
import LastreasonsModel from "./LastreasonsModel.jsx";
import EditLostReasonModal from "./EditLostReasonModal.jsx"; // Import the new modal
import axios from "axios";
import { FaSearch } from "react-icons/fa";

const Lastreasons = () => {
  const { openModal } = useModal();
  const [startDate, setStartDate] = useState(null);
  const [lostReasons, setLostReasons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // ✅ New state for edit modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedReason, setSelectedReason] = useState(null);

  const fetchLostReasons = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:5000/api/auth/lastname/getName"
      );
      setLostReasons(response.data);
    } catch (error) {
      console.error("Error fetching lost reasons:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLostReasons();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/auth/lastname/deleteName/${id}`
      );
      fetchLostReasons();
    } catch (error) {
      console.error("Error deleting lost reason:", error);
    }
  };

  const filteredLostReasons = lostReasons.filter((reason) =>
    reason.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <div className="flex flex-col gap-5">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl">Lost Reasons</h1>
          <button
            onClick={openModal}
            className="bg-[#4466f2] p-2 px-4 text-white rounded-sm"
          >
            Add Lost Reason
          </button>
        </div>

        <LastreasonsModel fetchLostReasons={fetchLostReasons} />

        {/* Edit Modal */}
        {selectedReason && (
          <EditLostReasonModal
            isOpen={isEditModalOpen}
            closeModal={() => setIsEditModalOpen(false)}
            reason={selectedReason}
            fetchLostReasons={fetchLostReasons}
          />
        )}
        <div className="flex items-center gap-2">
          {/* Date Picker */}
          <div className="relative">
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              dateFormat="yyyy/MM/dd"
              className="hidden"
              isOpen={false}
            />
            <button
              className="px-3 py-2 text-gray-400 shadow-2xl bg-white rounded-lg"
              onClick={() => setStartDate(null)}
            >
              <FaCalendarAlt className="text-xl" />
            </button>
          </div>

          {/* Filters */}
          <button className="px-7 py-2 shadow-2xl text-gray-400 bg-white rounded-3xl">
            Created by
          </button>
          <button className="px-7 py-2 shadow-2xl text-gray-400 bg-white rounded-3xl">
            Created date
          </button>
        </div>

        {/* Search Bar */}
        <div className="  p-3 rounded-md ">
          <h2 className="text-sm font-semibold text-end items-center text-gray-400">
            Showing 1 To 4 items of: {filteredLostReasons.length}
          </h2>
        </div>
        <div className="flex items-center border rounded-3xl w-[250px]  bg-white px-3 py-1.5">
          <FaSearch className="text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Search"
            className="outline-none w-full bg-transparent"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
       

        {/* Table Section */}
        {loading ? (
          <p>Loading lost reasons...</p>
        ) : (
          <div className="bg-white w-full mt-1">
            <div className="pt-5 flex justify-between items-center px-[50px]">
              <table className="w-full p-5">
                <thead>
                  <tr>
                    <td className="pb-5 text-left font-semibold text-gray-400">
                      Name
                    </td>
                    <td className="pb-5 text-left font-semibold text-gray-400">
                      Created by
                    </td>
                    <td className="pb-5 text-left font-semibold text-gray-400">
                      Actions
                    </td>
                  </tr>
                </thead>
                <tbody>
                  {filteredLostReasons.length > 0 ? (
                    filteredLostReasons.map((reason) => (
                      <tr key={reason._id} className="border-b">
                        <td className="py-3">{reason.name}</td>
                        <td>Zehrila aadmi</td>
                        <td className="py-3 flex text-left gap-2">
                          <button
                            onClick={() => {
                              setSelectedReason(reason);
                              setIsEditModalOpen(true);
                            }}
                          >
                            <FaEdit className="text-xl" />
                          </button>
                          <button onClick={() => handleDelete(reason._id)}>
                            <FaTrash className="text-xl" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="3"
                        className="text-center py-5 text-gray-500"
                      >
                        No results found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Lastreasons;
