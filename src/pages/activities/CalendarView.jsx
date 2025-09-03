// import React, { useState, useEffect } from "react";
// import { Search } from "lucide-react";
// import AddActivityModal from "./ModalCalendar";
// import CalendarComponent from "./CalendarComponent";
// import axios from "axios";

// const CalendarView = () => {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [activities, setActivities] = useState([]);
//   const [activityToEdit, setActivityToEdit] = useState(null);
//   const [dealToEdit, setDealToEdit] = useState(null);
//   const [allActivities, setAllActivities] = useState([]);
//   const [showDoneActivityModal, setShowDoneActivityModal] = useState(false);
//   const [showOnlyDone, setShowOnlyDone] = useState(false);

//   const [showTypeDropdown, setShowTypeDropdown] = useState(false);
//   const [selectedType, setSelectedType] = useState("Any");

//   useEffect(() => {
//     fetchCalendar();
//   }, []);

//   useEffect(() => {
//     handleSearchFilter();
//   }, [searchQuery, showOnlyDone, allActivities, selectedType]);

//   const fetchCalendar = async () => {
//     try {
//       const res = await axios.get("http://localhost:5000/api/activity");
//       setAllActivities(res.data);
//     } catch (error) {
//       console.error("Error fetching deals:", error);
//     }
//   };
//   const handleSearchFilter = () => {
//     console.log("Before filtering, all activities:", allActivities); // Log all activities before filtering
//     let filtered = [...allActivities];

//     // Filter by 'done' status if selected
//     if (showOnlyDone) {
//       console.log("Filtering by done status...");
//       filtered = filtered.filter((activity) => {
//         console.log(`Activity status: ${activity.status}`); // Log status of each activity
//         return activity.status === "done"; // Ensure the status is exactly "done"
//       });
//     }

//     // Filter by selected type (Deal, Person, Organization)
//     if (selectedType !== "Any") {
//       console.log(`Filtering by type: ${selectedType}`);
//       filtered = filtered.filter((activity) => {
//         // Log the entire activity to check if `activityModel` exists
//         console.log("Activity:", activity); // Log the full activity to inspect its structure
//         const activityModel = activity.activityModel || "Unknown"; // Default to "Unknown" if `activityModel` is missing
//         console.log(`Activity model: ${activityModel}`); // Log the activity model before filtering
//         return activityModel.toLowerCase() === selectedType.toLowerCase(); // Compare case-insensitively
//       });
//     }

//     // Filter by search query (activity title)
//     if (searchQuery.trim()) {
//       const lowerSearch = searchQuery.toLowerCase();
//       console.log(`Filtering by search query: ${lowerSearch}`);
//       filtered = filtered.filter(
//         (activity) =>
//           activity.title && activity.title.toLowerCase().includes(lowerSearch) // Ensure `title` exists and is compared case-insensitively
//       );
//     }

//     console.log("After filtering, activities:", filtered); // Log filtered activities

//     setActivities(filtered);
//   };

//   const handleApplyFilter = () => {
//     setShowDoneActivityModal(false);
//     handleSearchFilter();
//   };

//   const handleClearDoneFilter = () => {
//     setShowOnlyDone(false);
//     setShowDoneActivityModal(false);
//   };

//   const handleAddActivity = (newActivity) => {
//     setAllActivities((prev) => [...prev, newActivity]);
//   };

//   const handleEditActivity = (updatedActivity) => {
//     const updatedAll = allActivities.map((act) =>
//       act._id === updatedActivity._id ? updatedActivity : act
//     );
//     setAllActivities(updatedAll);
//     setActivityToEdit(null);
//   };

//   return (
//     <div className="p-6">
//       <div className="flex flex-wrap justify-between items-center gap-4">
//         <h1 className="text-lg font-semibold text-gray-600">Calendar View</h1>
//         <div className="flex flex-wrap gap-4"></div>
//       </div>

//       <div className="flex flex-wrap items-center justify-between gap-4 mt-4">
//         <div className="flex flex-wrap items-center gap-4">
//           {/* Type Dropdown */}
//           <div className="relative">
//             <button
//               onClick={() => setShowTypeDropdown(!showTypeDropdown)}
//               className="bg-white border border-gray-200 shadow-lg px-4 py-2 rounded-md text-sm flex items-center gap-2"
//             >
//               {selectedType}
//               <svg
//                 className={`w-4 h-4 transition-transform duration-200 ${
//                   showTypeDropdown ? "rotate-180" : ""
//                 }`}
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//                 xmlns="http://www.w3.org/2000/svg"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M19 9l-7 7-7-7"
//                 />
//               </svg>
//             </button>
//           </div>

//           {/* Filter Buttons */}
//           <div className="flex flex-wrap gap-4">
//             {["Done Activity", "Activity", "Schedule", "Owner"].map(
//               (item, index) => (
//                 <span
//                   key={index}
//                   onClick={() =>
//                     item === "Done Activity" && setShowDoneActivityModal(true)
//                   }
//                   className="bg-white shadow-lg px-4 py-2 rounded-full text-md cursor-pointer"
//                 >
//                   {item}
//                 </span>
//               )
//             )}
//           </div>
//         </div>

//         {/* Search Bar */}
//         <div className="relative w-full sm:w-64 ml-28">
//           <Search
//             className="absolute left-14 top-2.5 text-gray-400"
//             size={16}
//           />
//           <input
//             type="text"
//             placeholder="Search"
//             className="pl-10 ml-10 py-2 w-56 border border-gray-200 bg-white shadow-lg rounded-4xl focus:outline-none focus:ring-2 focus:ring-blue-400"
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//           />
//         </div>
//       </div>

//       {/* Done Activity Filter Modal */}
//       {showDoneActivityModal && (
//         <div className="fixed inset-0 flex items-center justify-center z-50 mr-[300px] mt-8">
//           <div className="bg-white rounded-xl shadow-lg w-[70%] max-w-sm p-8">
//             <h2 className="text-lg font-semibold text-gray-800 mb-4">
//               Do you want to see done activity?
//             </h2>

//             <div className="flex items-center mb-6">
//               <input
//                 id="showDone"
//                 type="radio"
//                 checked={showOnlyDone}
//                 onChange={() => setShowOnlyDone(!showOnlyDone)}
//                 className="form-radio text-blue-600 mr-2"
//               />
//               <label htmlFor="showDone" className="text-gray-700">
//                 Show done activity
//               </label>
//             </div>

//             <button
//               className="text-gray-400 font-medium hover:text-gray-600 mr-48"
//               onClick={handleClearDoneFilter}
//             >
//               Clear
//             </button>

//             <button
//               className="bg-blue-600 text-white px-4 py-1 rounded cursor-pointer hover:bg-blue-700 shadow-2xl"
//               onClick={handleApplyFilter}
//             >
//               Apply
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Add / Edit Activity Modal */}
//       {isModalOpen && (
//         <AddActivityModal
//           isOpen={isModalOpen}
//           onClose={() => {
//             setIsModalOpen(false);
//             setDealToEdit(null);
//           }}
//           activityToEdit={activityToEdit}
//           onactivityAdded={handleAddActivity}
//           onEdit={handleEditActivity}
//         />
//       )}

//       {/* Calendar Display */}
//       <CalendarComponent activities={activities} />
//     </div>
//   );
// };

// export default CalendarView;

import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import AddActivityModal from "./ModalCalendar";
import CalendarComponent from "./CalendarComponent";
import axios from "axios";

const CalendarView = () => {
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
      const res = await axios.get("http://localhost:5000/api/activity");
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
            className="border rounded p-2"
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
            className="border rounded p-2"
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
