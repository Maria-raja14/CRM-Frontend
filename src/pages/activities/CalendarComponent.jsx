


import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { FaArrowLeft, FaArrowRight, FaCalendarAlt, FaTimes } from "react-icons/fa";
import ModalCalendar from "./ModalCalendar";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const localizer = momentLocalizer(moment);

const CalendarComponent = ({ activities }) => {
 
  const API_URL = import.meta.env.VITE_API_URL;


  const [view, setView] = useState("month");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedType, setSelectedType] = useState("Call");

  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  const [organizations, setOrganizations] = useState([]);
  const [persons, setPersons] = useState([]);
  const [deals, setDeals] = useState([]);
  const [allActivities, setActivities] = useState([]);
  
  const [formData, setFormData] = useState({
    activityCategory: "Call",
    title: "",
    description: "",
    activityType: "",
    activityModel: "",
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
    collaborators: [],
    reminder: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${API_URL}/activity/add`,
        formData
      );
      toast.success("Activity added successfully!");
      fetchCalendar();
      resetForm();
      closeModal();
    } catch (error) {
      toast.error("Error saving activity");
      console.error("Error:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      activityCategory: "Call",
      title: "",
      description: "",
      activityType: "",
      activityModel: "",
      startDate: "",
      endDate: "",
      startTime: "",
      endTime: "",
      collaborators: [],
      reminder: "",
    });
  };

  const fetchCalendar = async () => {
    try {
      const res = await axios.get(`${API_URL}/activity`);
      setActivities(res.data);
    } catch (error) {
      console.error("Error fetching activities:", error);
    }
  };

  const handleAddDetailsClick = () => {
    setShowModal(false);
    setShowDetailsModal(true);
  };

  const getRandomColor = () => {
    const colors = [
      "#E3F2FD",
      "#E8F5E9",
      "#FFF3E0",
      "#FBE9E7",
      "#EDE7F6",
      "#E0F2F1",
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const formattedEvents = activities.map((activity) => {
    let start = moment.utc(activity.startDate).local();
    let end = moment.utc(activity.endDate).local();

    if (activity.startTime) {
      const [hours, minutes] = activity.startTime.split(":").map(Number);
      start.set({ hour: hours, minute: minutes });
    }

    if (activity.endTime) {
      const [hours, minutes] = activity.endTime.split(":").map(Number);
      end.set({ hour: hours, minute: minutes });
    }

    return {
      title: `${start.format("hh:mm A")} - ${activity.title}`,
      start: start.toDate(),
      end: end.toDate(),
      color: getRandomColor(),
    };
  });

  const navigateCalendar = (direction) => {
    let newDate = moment(currentDate);
    if (view === "month") {
      newDate =
        direction === "next"
          ? newDate.add(1, "month")
          : newDate.subtract(1, "month");
    } else if (view === "week") {
      newDate =
        direction === "next"
          ? newDate.add(1, "week")
          : newDate.subtract(1, "week");
    } else if (view === "day") {
      newDate =
        direction === "next"
          ? newDate.add(1, "day")
          : newDate.subtract(1, "day");
    }
    setCurrentDate(newDate.toDate());
  };

  const eventStyleGetter = (event) => {
    return {
      style: {
        backgroundColor: event.color,
        color: "#2D3748",
        borderRadius: "6px",
        padding: "6px",
        fontWeight: 500,
        fontSize: "13px",
        borderLeft: `4px solid ${event.color.replace(")", ", 0.8)").replace("rgb", "rgba")}`,
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      },
    };
  };

  const handleSelectSlot = (slotInfo) => {
    setSelectedDate(slotInfo.start);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedDate(null);
  };

  // Format date for display
  const formatDate = (date) => {
    return moment(date).format("MMMM D, YYYY");
  };

  return (
    <div className="mt-6 flex justify-center">
      <div className="shadow-lg border border-gray-100 p-6 bg-white w-full max-w-screen-xl rounded-xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center">
            <FaCalendarAlt className="mr-3 text-blue-500" />
            Calendar
          </h2>
          
          
        </div>   

        <Calendar
          selectable
          localizer={localizer}
          events={formattedEvents}
          startAccessor="start"
          endAccessor="end"
          style={{ 
            height: 700, 
            backgroundColor: "white",
            borderRadius: "12px",
          }}
          view={view}
          date={currentDate}
          views={["month", "week", "day"]}
          onView={(newView) => setView(newView)}
          onNavigate={(date) => setCurrentDate(date)}
          eventPropGetter={eventStyleGetter}
          onSelectSlot={handleSelectSlot}
        />
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-800">
                Add New Activity
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes />
              </button>
            </div>

            <div className="flex mb-4 overflow-x-auto pb-2">
              {["Call", "Meeting", "Email", "Task", "Deadline", "Others"].map(
                (type) => (
                  <button
                    key={type}
                    onClick={() => {
                      setSelectedType(type);
                      setFormData((prev) => ({
                        ...prev,
                        activityCategory: type,
                      }));
                    }}
                    className={`px-3 py-1.5 text-sm rounded-full mr-2 whitespace-nowrap ${
                      selectedType === type
                        ? "bg-blue-500 text-white shadow-sm"
                        : "text-gray-600 bg-gray-100 hover:bg-gray-200"
                    }`}
                  >
                    {type}
                  </button>
                )
              )}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                name="title"
                placeholder="Activity title"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.title}
                onChange={handleInputChange}
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Activity Type
              </label>
              <select
                name="activityModel"
                value={formData.activityModel}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Type</option>
                <option value="Deals">Deals</option>
                <option value="Person">Person</option>
                <option value="Organization">Organization</option>
              </select>
            </div>

            {formData.activityModel === "Deals" && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Deals
                </label>
                <select
                  name="activityType"
                  value={formData.activityType}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Choose a deal</option>
                  {deals.map((deal) => (
                    <option key={deal._id} value={deal._id}>
                      {deal.title}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {formData.activityModel === "Person" && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Person
                </label>
                <select
                  name="activityType"
                  value={formData.activityType}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Choose a person</option>
                  {persons.map((person) => (
                    <option key={person._id} value={person._id}>
                      {person.personName}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {formData.activityModel === "Organization" && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Organization
                </label>
                <select
                  name="activityType"
                  value={formData.activityType}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Choose an organization</option>
                  {organizations.map((org) => (
                    <option key={org._id} value={org._id}>
                      {org.organizationName}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="flex items-center mb-6">
              <input 
                type="checkbox" 
                id="saveAsDone"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" 
              />
              <label htmlFor="saveAsDone" className="ml-2 block text-sm text-gray-700">
                Save as done
              </label>
            </div>

            <div className="flex justify-between items-center">
              <button
                onClick={handleAddDetailsClick}
                className="px-4 py-2 bg-gray-100 border border-gray-200 rounded-lg hover:bg-gray-200 text-gray-700 font-medium"
              >
                Add Details
              </button>
              <div className="space-x-3">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 text-gray-700 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium shadow-sm"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ModalCalendar */}
      {showDetailsModal && (
        <ModalCalendar
          isOpen={true}
          onClose={() => setShowDetailsModal(false)}
          activityToEdit={null}
          onactivityAdded={(newActivity) => {
            fetchCalendar();
            setShowDetailsModal(false);
          }}
          onEdit={(updatedActivity) => {
            fetchCalendar();
            setShowDetailsModal(false);
          }}
        />
      )}
    </div>
  );
};

export default CalendarComponent;