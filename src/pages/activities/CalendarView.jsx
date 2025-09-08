

import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import AddActivityModal from "./ModalCalendar";
import CalendarComponent from "./CalendarComponent";
import axios from "axios";

const CalendarView = () => {

const API_URL = import.meta.env.VITE_API_URL;


  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [allActivities, setAllActivities] = useState([]);
  const [activities, setActivities] = useState([]);
  const [activityToEdit, setActivityToEdit] = useState(null);

  const [selectedType, setSelectedType] = useState("Any");
  const [selectedCategory, setSelectedCategory] = useState("Any");
  const [selectedAssigned, setSelectedAssigned] = useState("Any");
  const [showOnlyDone, setShowOnlyDone] = useState(false);
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);

  useEffect(() => {
    fetchCalendar();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [
    searchQuery,
    selectedType,
    selectedCategory,
    selectedAssigned,
    showOnlyDone,
    allActivities,
  ]);

  const fetchCalendar = async () => {
    try {
      const res = await axios.get(`${API_URL}/activity`);
      setAllActivities(res.data);
    } catch (error) {
      console.error("Error fetching activities:", error);
    }
  };

  const handleAddActivity = (newActivity) => {
    setAllActivities((prev) => [...prev, newActivity]);
  };

  const handleEditActivity = (updatedActivity) => {
    setAllActivities((prev) =>
      prev.map((act) =>
        act._id === updatedActivity._id ? updatedActivity : act
      )
    );
    setActivityToEdit(null);
  };

  // Dynamic filters
  const uniqueTypes = [
    "Any",
    ...new Set(allActivities.map((a) => a.activityModel).filter(Boolean)),
  ];
  const uniqueCategories = [
    "All Activities",
    ...new Set(allActivities.map((a) => a.activityCategory).filter(Boolean)),
  ];
  const uniqueAssigned = [
    "All Assigned",
    ...new Set(
      allActivities
        .map((a) =>
          a.assignedTo
            ? `${a.assignedTo.firstName} ${a.assignedTo.lastName}`
            : null
        )
        .filter(Boolean)
    ),
  ];

  const applyFilters = () => {
    let filtered = [...allActivities];

    if (selectedCategory !== "Any") {
      filtered = filtered.filter(
        (a) => a.activityCategory === selectedCategory
      );
    }

    if (selectedAssigned !== "Any") {
      filtered = filtered.filter(
        (a) =>
          a.assignedTo &&
          `${a.assignedTo.firstName} ${a.assignedTo.lastName}` ===
            selectedAssigned
      );
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter((a) => a.title?.toLowerCase().includes(q));
    }

    setActivities(filtered);
  };

  return (
    <div className="p-6">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <h1 className="text-lg font-semibold text-gray-600">Calendar View</h1>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded shadow"
          onClick={() => setIsModalOpen(true)}
        >
          Add activity
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center justify-between gap-4 mt-4">
        <div className="flex flex-wrap items-center gap-4">
          {/* Category filter */}
          <select
            className="border p-2 rounded-md bg-white px-2"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {uniqueCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {/* Assigned filter */}
          <select
            className="border rounded-md bg-white  p-2"
            value={selectedAssigned}
            onChange={(e) => setSelectedAssigned(e.target.value)}
          >
            {uniqueAssigned.map((user) => (
              <option key={user} value={user}>
                {user}
              </option>
            ))}
          </select>
        </div>

        {/* Search bar */}
        <div className="relative w-full sm:w-64 ml-0 sm:ml-28">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search by title"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 py-2 w-56 border border-gray-200 bg-white rounded-4xl focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
      </div>

      {/* Add / Edit Activity Modal */}
      {isModalOpen && (
        <AddActivityModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          activityToEdit={activityToEdit}
          onactivityAdded={handleAddActivity}
          onEdit={handleEditActivity}
        />
      )}

      {/* Calendar Display */}
      <CalendarComponent activities={activities} />
    </div>
  );
};

export default CalendarView;
