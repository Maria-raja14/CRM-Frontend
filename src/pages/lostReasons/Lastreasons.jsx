import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import { FaCalendarAlt, FaEdit, FaTrash } from "react-icons/fa";
import { useModal } from "../../context/ModalContext";
import LastreasonsModel from "./LastreasonsModel.jsx";
import axios from "axios";

const Lastreasons = () => {
  const { openModal } = useModal();
  const [startDate, setStartDate] = useState(null);
  const [lostReasons, setLostReasons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [searchQuery, setSearchQuery] = useState(""); // ✅ Search State

  // ✅ Fetch lost reasons from API
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

  // ✅ Handle Update (PUT Request)
  const handleUpdate = async (id) => {
    if (!editName) return;
    try {
      await axios.put(
        `http://localhost:5000/api/auth/lastname/updateName/${id}`,
        { name: editName }
      );
      setEditingId(null);
      fetchLostReasons();
    } catch (error) {
      console.error("Error updating lost reason:", error);
    }
  };

  // ✅ Handle Delete (DELETE Request)
  const handleDelete = async (id) => {
    // if (!window.confirm("Are you sure you want to delete this item?")) return;
    try {
      await axios.delete(
        `http://localhost:5000/api/auth/lastname/deleteName/${id}`
      );
      fetchLostReasons();
    } catch (error) {
      console.error("Error deleting lost reason:", error);
    }
  };

  // ✅ Filter lost  reasons  based  on  search  query
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

        <div className="flex flex-col lg:flex-row justify-between items-center gap-4 mt-3">
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

          {/* ✅ Search Input */}
          <div className="flex items-center">
            <input
              type="text"
              placeholder="Search"
              className="p-1.5 border rounded-3xl w-[200px] bg-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Display the count above the table */}
        <div className="mt-3  p-3 rounded-md ">
          <h2 className="text-sm font-semibold text-gray-400">
          Showing 1 To 4 items of: {filteredLostReasons.length}
          </h2>
        </div>

        {/* Table Section */}
        {loading ? (
          <p>Loading lost reasons...</p>
        ) : (
          <div className="bg-white w-full mt-1">
            <div className="pt-5 flex   justify-between items-center px-[50px]">
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
                        <td className="py-3">
                          {editingId === reason._id ? (
                            <input
                              type="text"
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                              className="border p-2 w-full"
                            />
                          ) : (
                            reason.name
                          )}
                        </td>

                        <td>Zehrila aadmi</td>
                        <td className="py-3 mr-[0px] flex text-left gap-2">
                          {editingId === reason._id ? (
                            <button
                              className="bg-green-500 text-white px-4 py-1 rounded"
                              onClick={() => handleUpdate(reason._id)}
                            >
                              Save
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                setEditingId(reason._id);
                                setEditName(reason.name);
                              }}
                            >
                              <FaEdit className="text-xl" />
                            </button>
                          )}

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
