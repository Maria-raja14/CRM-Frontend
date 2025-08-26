import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import ModalCalendar from "./ModalCalender";

const formatDateTime = (dateStr) => {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  return date.toLocaleString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const ListActivity = ({ activities, setActivities }) => {
  const [openMenuIndex, setOpenMenuIndex] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activityToEdit, setActivityToEdit] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const menuRefs = useRef({});
  const buttonRefs = useRef({});

  useEffect(() => {
    const handleClickOutside = (event) => {
      const isScrollbar =
        event.target === document.body ||
        event.target.classList.contains("overflow-x-auto");

      if (
        openMenuIndex !== null &&
        !isScrollbar &&
        menuRefs.current[openMenuIndex] &&
        !menuRefs.current[openMenuIndex].contains(event.target) &&
        buttonRefs.current[openMenuIndex] &&
        !buttonRefs.current[openMenuIndex].contains(event.target)
      ) {
        setOpenMenuIndex(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openMenuIndex]);

  useEffect(() => {
    document.body.style.overflow = isModalOpen ? "hidden" : "auto";
  }, [isModalOpen]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this activity?"))
      return;
    try {
      await axios.delete(`http://localhost:5000/api/activity/delete/${id}`);
      setActivities((prev) => prev.filter((act) => act._id !== id));
      toast.success("Activity deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete activity");
    }
  };

  const handleEditActivity = (updatedActivity) => {
    setActivities((prev) =>
      prev.map((activity) =>
        activity._id === updatedActivity._id ? updatedActivity : activity
      )
    );
  };

  // Pagination logic
  const totalPages = Math.ceil(activities.length / itemsPerPage);
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = activities.slice(indexOfFirst, indexOfLast);

  return (
    <>
      <div className=" mt-6 shadow rounded-lg bg-white ">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-700 text-sm">
            <tr>
              <th className="p-3">Done</th>
              <th className="p-3">Activity</th>
              <th className="p-3">Title</th>
              <th className="p-3">Assign to</th>
              <th className="p-3">Starting schedule</th>
              <th className="p-3">Ending schedule</th>
              <th className="p-3">Reminder</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {currentItems.map((activity, index) => (
              <tr
                key={activity._id}
                className="border-t hover:bg-gray-50 relative"
              >
                <td className="p-3 text-center">
                  <input type="checkbox" />
                </td>
                <td className="p-3">{activity.activityCategory}</td>
                <td className="p-3 cursor-pointer">{activity.title}</td>
                <td className="p-3">
                  {activity.assignedTo
                    ? `${activity.assignedTo.firstName} ${activity.assignedTo.lastName}`
                    : "-"}
                </td>

                <td className="p-3">{formatDateTime(activity.startDate)}</td>
                <td className="p-3">{formatDateTime(activity.endDate)}</td>
                <td className="p-3 ">{activity.reminder || "-"}</td>
                <td className="p-3 text-right relative">
                  <button
                    ref={(el) => (buttonRefs.current[index] = el)}
                    onClick={() =>
                      setOpenMenuIndex(openMenuIndex === index ? null : index)
                    }
                    className="text-gray-500 mr-8 text-xl hover:text-blue-700"
                  >
                    ⋮
                  </button>
                  {openMenuIndex === index && (
                    <div
                      ref={(el) => (menuRefs.current[index] = el)}
                      className="absolute right-0 mt-2 w-24 bg-white border border-gray-200 rounded-lg shadow-lg z-10"
                    >
                      <button
                        className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
                        onClick={() => {
                          setActivityToEdit(activity);
                          setIsModalOpen(true);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="w-full px-4 py-2 text-left text-red-600 hover:bg-gray-100"
                        onClick={() => handleDelete(activity._id)}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination Controls */}
        <div className="flex justify-between items-center p-4 bg-gray-50 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <select
              className="border rounded p-1"
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
            >
              {[5, 10, 20, 50].map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
            <span>Items showing per page</span>
          </div>

          <div className="flex items-center space-x-2">
            <span>Go to page</span>
            <input
              type="number"
              value={currentPage}
              onChange={(e) => {
                const page = Math.min(
                  Math.max(1, Number(e.target.value)),
                  totalPages
                );
                setCurrentPage(page);
              }}
              className="w-12 border rounded px-2 py-1"
            />

            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-2 text-xl disabled:text-gray-400"
            >
              &larr;
            </button>

            {[...Array(totalPages).keys()].map((num) => (
              <button
                key={num + 1}
                onClick={() => setCurrentPage(num + 1)}
                className={`px-2 py-1 rounded-full ${
                  currentPage === num + 1
                    ? "bg-blue-500 text-white"
                    : "text-blue-500 hover:bg-blue-100"
                }`}
              >
                {num + 1}
              </button>
            ))}

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="px-2 text-xl disabled:text-gray-400"
            >
              &rarr;
            </button>
          </div>
        </div>
      </div>

      <ModalCalendar
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setActivityToEdit(null);
        }}
        activityToEdit={activityToEdit}
        onEdit={handleEditActivity}
      />
    </>
  );
};

export default ListActivity;
