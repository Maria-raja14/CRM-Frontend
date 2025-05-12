import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import ModalCalendar from "./ModalCalendar";
import axios from "axios";
import { toast } from "react-toastify"; // Add this if not already
import "react-toastify/dist/ReactToastify.css";

const localizer = momentLocalizer(moment);

const CalendarComponent = ({ activities }) => {
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const personsRes = await axios.get("http://localhost:5000/api/person");
        setPersons(personsRes.data);

        const organizationsRes = await axios.get(
          "http://localhost:5000/api/organization"
        );
        setOrganizations(organizationsRes.data);

        const dealsRes = await axios.get("http://localhost:5000/api/alldeals");
        setDeals(dealsRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
    fetchCalendar();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:5000/api/activity/add",
        formData
      );
      toast.success("Activity added successfully!");
      fetchCalendar(); // refresh activities
      resetForm();
      closeModal(); // close modal
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
      const res = await axios.get("http://localhost:5000/api/activity");
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
      "#F0E5FF",
      "#FFD9CC",
      "#D8F5C5",
      "#FCE7EB",
      "#D6E3F3",
      "#CDE7F0",
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
        color: "#333",
        borderRadius: "8px",
        padding: "5px",
        fontWeight: 600,
        fontSize: "14px",
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

  return (
    <div className="mt-4 flex justify-center">
      <div className="shadow-xl border border-gray-50 p-6 bg-white w-full max-w-screen-xl rounded">
        <div className="flex justify-center items-center mb-4 gap-4">
          <button
            onClick={() => navigateCalendar("prev")}
            className="p-2 text-gray-600 rounded hover:bg-gray-200"
          >
            <FaArrowLeft />
          </button>
          <button
            onClick={() => navigateCalendar("next")}
            className="p-2 text-gray-600 rounded hover:bg-gray-200"
          >
            <FaArrowRight />
          </button>
        </div>   

        <Calendar
          selectable
          localizer={localizer}
          events={formattedEvents}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 900, backgroundColor: "white" }}
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
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded p-7 w-full max-w-lg shadow-2xl border border-gray-50">
            <div className="flex justify-between mb-2"></div>

            <div className="flex mb-4 flex-wrap">
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
                    className={`px-3.5 py-2 border ${
                      selectedType === type
                        ? "bg-blue-500 text-white rounded"
                        : "text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {type}
                  </button>
                )
              )}
            </div>

            <div className="flex items-center gap-12 mb-6">
              <label className="text-gray-600 font-small">Title</label>
              <input
                type="text"
                name="title"
                placeholder="Title"
                className="w-full p-2 border rounded-md mt-2"
                value={formData.title}
                onChange={handleInputChange}
              />
            </div>

            <div className="flex items-center gap-3 mb-8">
              <label className="text-gray-600 font-small">Activity Type</label>
              <select
                name="activityModel"
                value={formData.activityModel}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md mt-2"
              >
                <option value="">Select Type</option>
                <option value="Deals">Deals</option>
                <option value="Person">Person</option>
                <option value="Organization">Organization</option>
              </select>
            </div>

            {formData.activityModel === "Deals" && (
              <div className="flex items-center gap-12 mb-6">
                <label className="text-gray-600">Deals</label>
                <select
                  name="activityType"
                  value={formData.activityType}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
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
              <div className="flex items-center gap-12 mb-6">
                <label className="text-gray-600">Person</label>
                <select
                  name="activityType"
                  value={formData.activityType}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
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
              <div className="flex items-center gap-6 mb-6">
                <label className="text-gray-600">Organization</label>
                <select
                  name="activityType"
                  value={formData.activityType}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
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

            <div className="flex items-center mb-4">
              <input type="checkbox" className="mr-2" />
              <label>Save as done</label>
            </div>

            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={handleAddDetailsClick}
                className="px-2 mr-48 bg-gray-50 border border-gray-50 shadow rounded hover:bg-gray-200"
              >
                Add Details
              </button>
              <button
                onClick={closeModal}
                className="bg-gray-300 px-4 py- rounded hover:bg-gray-400 shadow"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 shadow"
              >
                Save
              </button>
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
