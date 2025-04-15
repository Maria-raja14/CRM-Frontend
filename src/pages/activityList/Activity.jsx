
import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import AddActivityModal from './ModalCalender';
import ListActivity from "./ListActivity";
import axios from "axios";

const CalendarView = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activities, setActivities] = useState([]);
  const [activityToEdit, setActivityToEdit] = useState(null);
  const [dealToEdit, setDealToEdit] = useState(null);
  const [selectedType, setSelectedType] = useState("Any");  // New state for the type filter
  const [showTypeDropdown, setShowTypeDropdown] = useState(false); // For dropdown visibility

  useEffect(() => {
    fetchCalendar();
  }, []);

  const fetchCalendar = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/activity");
      setActivities(res.data);
      console.log("Fetched data:", res.data);
    } catch (error) {
      console.error("Error fetching activities:", error);
    }
  };

  const handleAddActivity = (newActivity) => {
    setActivities([...activities, newActivity]);
  };

  const handleEditActivity = (updatedActivity) => {
    setActivities(
      activities.map((act) =>
        act._id === updatedActivity._id ? updatedActivity : act
      )
    );
    setActivityToEdit(null);
  };

  // Filter activities based on search query and selected type
  const filteredActivities = activities.filter((activity) => {
    const matchesSearchQuery =
      activity.title?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType =
      selectedType === "Any" || activity.activityModel?.toLowerCase() === selectedType.toLowerCase();

    return matchesSearchQuery && matchesType;
  });

  return (
    <div className="p-6">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <h1 className="text-lg font-semibold text-gray-600">Calendar View</h1>
        <div className="flex flex-wrap gap-4">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded shadow"
            onClick={() => setIsModalOpen(true)}
          >
            Add activity
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 mt-4">
        <div className="flex flex-wrap items-center gap-4">
          {/* Type Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowTypeDropdown(!showTypeDropdown)}
              className="bg-white border border-gray-200 shadow-lg px-4 py-2 rounded-md text-sm flex items-center gap-2"
            >
              {selectedType}
              <svg
                className={`w-4 h-4 transition-transform duration-200 ${showTypeDropdown ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {showTypeDropdown && (
              <div className="absolute z-10 mt-2 w-34 bg-white  shadow-lg p-3">
                {["Any", "Deal", "Person", "Organization"].map((type) => (
                  <div
                    key={type}
                    onClick={() => {
                      setSelectedType(type);
                      setShowTypeDropdown(false);
                    }}
                    className={`px-4 py-2 cursor-pointer rounded hover:bg-gray-100 ${
                      selectedType === type ? "text-blue-600 font-semibold" : "text-gray-800"
                    }`}
                  >
                    {type}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-4">
            {["Done Activity", "Activity", "Schedule", "Owner"].map(
              (item, index) => (
                <span
                  key={index}
                  className="bg-white shadow-lg text-gray-500 px-4 py-2 rounded-full text-md"
                >
                  {item}
                </span>
              )
            )}
          </div>
        </div>

        <div className="relative w-full sm:w-64 ml-28">
          <Search className="absolute left-14 top-2.5 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search"
            className="pl-10 ml-10 py-2 w-56 border border-gray-200 bg-white shadow-lg rounded-4xl focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {isModalOpen && (
        <AddActivityModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setDealToEdit(null);
          }}
          activityToEdit={activityToEdit}
          onactivityAdded={handleAddActivity}
          onEdit={handleEditActivity}
        />
      )}

      <ListActivity
        activities={filteredActivities}
        setActivities={setActivities}
      />
    </div>
  );
};

export default CalendarView;
