  import React, { useRef, useState, useEffect } from "react";
  import { FaCalendarAlt, FaClock } from "react-icons/fa";
  import DatePicker from "react-datepicker";
  import "react-datepicker/dist/react-datepicker.css";
  import axios from "axios";
  import { Search, X } from "lucide-react";
  import { toast } from "react-toastify";

  const ModalCalendar = ({ isOpen,onClose,activityToEdit,onactivityAdded,onEdit,}) => {
    if (!isOpen) return null;
    const [selectedActivity, setSelectedActivity] = useState("Call");
    const [search, setSearch] = useState("");
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);
    const [showStartTimePicker, setShowStartTimePicker] = useState(false);
    const [showEndTimePicker, setShowEndTimePicker] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedOwner, setSelectedOwner] = useState(null);
    const [reminder, setReminder] = useState("No reminder");

    const [formData, setFormData] = useState({
      activityCategory: "Call", // Default category
      title: "", 
      description: "",
      activityType: "", // Empty string since it's an ObjectId reference
      activityModel: "", // Ensure activityModel is included
      startDate: "", // Empty string instead of null
      endDate: "",
      startTime: "",
      endTime: "",
      collaborators: [], // Array instead of empty string
      reminder: "", // Default to empty string (or null if optional)
    });

    const [organizations, setOrganizations] = useState([]);
    const [persons, setPersons] = useState([]);
    const [deals, setDeals] = useState([]);
    const [filteredOrganization, setFilteredOrganization] = useState([]);

    useEffect(() => {
      const fetchData = async () => {
        try {
          const personsRes = await axios.get("http://localhost:5000/api/person");
          setPersons(personsRes.data);

          const organizationsRes = await axios.get(
            "http://localhost:5000/api/organization"
          );
          setOrganizations(organizationsRes.data);
          setFilteredOrganization(organizationsRes.data);

          const dealsRes = await axios.get("http://localhost:5000/api/alldeals");
          setDeals(dealsRes.data);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
      fetchData();
    }, []);

    useEffect(() => {
      setFilteredOrganization(
        filteredOrganization.filter((org) =>
          org.owner.toLowerCase().includes(search.toLowerCase())
        )
      );
    }, [search, organizations]);

    const handleAddButtonClick = (event) => {
      event.preventDefault(); // Prevents form submission
      setShowDropdown(!showDropdown);
    };
    const handleSelectOwner = (owner) => {
      setSelectedOwner(owner);
      setShowDropdown(false); // Close dropdown after selection
    };
    // Handle owner removal
    const handleRemoveOwner = () => {
      setSelectedOwner(null);
    };

    useEffect(() => {
      if (activityToEdit) {
        setFormData({
          activityCategory: activityToEdit.activityCategory || "Call",
          title: activityToEdit.title || "",
          description: activityToEdit.description || "",
          activityType: activityToEdit.activityType || "Deal",
          startDate: activityToEdit.startDate
            ? new Date(activityToEdit.startDate)
            : null,
          endDate: activityToEdit.endDate
            ? new Date(activityToEdit.endDate)
            : null,
          startTime: activityToEdit.startTime || "",
          endTime: activityToEdit.endTime || "",

          collaborators: activityToEdit.collaborators || "",
          reminder: activityToEdit.reminder || "",
        });
      }
    }, [activityToEdit]);

    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleDateChange = (name, date) => {
      setFormData((prev) => ({
        ...prev,
        [name]: date, 
      }));
    };
    const handleTimeChange = (name, time) => {
      setFormData((prev) => ({
        ...prev,
        [name]: time, 
      }));
    };

    const handleSubmit = async (e) => {
      e.preventDefault();

      if (!formData.startDate || !formData.endDate) {
        toast.error("Start Date and End Date are required!");
        return;
      }
    if (!formData.startTime || !formData.endTime) {
        toast.error("Start Time and End Time are required!");
        return;
      }

      try {
        if (activityToEdit) {
          await axios.put(
            `http://localhost:5000/api/activity/update/${activityToEdit._id}`,
            formData
          );
          onEdit(formData);
          toast.success("Activity updated successfully!");
        } else {
          const res = await axios.post(
            "http://localhost:5000/api/activity/add",
            formData
          );
          if (!res.data || !res.data.data || !res.data.data._id) {
            toast.error("Error: API response does not contain _id.");
            return;
          }
          onactivityAdded(res.data.data); 
          toast.success("Activity added successfully!");
        }
        onClose();
      } catch (error) {
        toast.error("Error saving activity");
        console.error("Error:", error);
      }
    };
    const startTimeRef = useRef(null);
    const endTimeRef = useRef(null);
    const generateTimeOptions = () => {
      let times = [];
      for (let h = 0; h < 24; h++) {
        for (let m = 0; m < 60; m += 10) {
          const hour = h.toString().padStart(2, "0");
          const minute = m.toString().padStart(2, "0");
          times.push(`${hour}:${minute}`);
        }
      }
      return times;
    };

    const timeOptions = generateTimeOptions();
    // Handle Click Outside
    useEffect(() => {
      function handleClickOutside(event) {
        if (
          startTimeRef.current &&
          !startTimeRef.current.contains(event.target)
        ) {
          setShowStartTimePicker(false);
        }
        if (endTimeRef.current && !endTimeRef.current.contains(event.target)) {
          setShowEndTimePicker(false);
        }
      }
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
      <>
        {/* Background Overlay */}
        <div
          className="fixed inset-0  bg-opacity-50 backdrop-blur-sm z-50"
          onClick={onClose}
        ></div>
        {/* Modal Content */}
        <div className="fixed inset-0 flex justify-center items-center z-50">
          <div className="bg-white w-[900px] h-[600px] rounded-lg shadow-lg flex flex-col">
            {/* Modal Header */}
            <div className="flex justify-between items-center border-b p-4">
              <h2 className="text-lg font-semibold">
                {activityToEdit ? "Edit Activity" : "Add Activity"}
              </h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-black cursor-pointer">
                ✖
              </button>
            </div>
            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-8">
              <form onSubmit={handleSubmit}>
                {/* Activity Type */}
                <div className="flex items-center gap-28 mb-6 ">
                  <label className="text-gray-600 font-small">Activity</label>
                  <div className="flex items-center rounded mt-2 gap-1">
                    {["Call","Meeting","Email","Task","Deadline","Others",].map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => {
                          setSelectedActivity(type);
                          setFormData({ ...formData, activityCategory: type });
                        }}
                        className={`px-4 py-2 border rounded   ${
                          selectedActivity === type
                            ? "bg-blue-500 text-white"
                            : "text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
                {/* Title */}
                <div className="flex items-center gap-36 mb-6">
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

                {/* Description */}
                <div className="flex items-center gap-24 mb-6">
                  <label className="text-gray-600 font-small">Description</label>
                  <textarea
                    name="description"
                    placeholder="Description here"
                    className="w-full p-2 border rounded-md mt-2 h-32"
                    value={formData.description}
                    onChange={handleInputChange}
                  ></textarea>
                </div>

                {/* Set Schedule */}
                <div className="flex items-center ">
                  <label className="text-gray-600 font-small ">
                     Schedule
                  </label>
                  <div className="flex flex-col gap-4 mb-6 ml-28">
                    {/* Start Date & Time */}
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 border rounded-md px-3 py-2 w-[300px]">
                        <FaCalendarAlt className="text-blue-500" />
                        <DatePicker
                          selected={formData.startDate}
                          onChange={(date) => handleDateChange("startDate", date)}
                          className="w-full border-none outline-none text-gray-600"
                          placeholderText="Start date"
                        />
                      </div>

                      {/* Custom Time Picker - Start Time (Dropdown on Top) */}
                      <div className="relative" ref={startTimeRef}>
                        <div
                          className="flex items-center gap-2 border rounded-md px-3 py-2 w-[300px] cursor-pointer"
                          onClick={() =>
                            setShowStartTimePicker(!showStartTimePicker)
                          }>
                          <FaClock className="text-blue-500" />
                          <input
                            type="text"
                            className="w-full border-none outline-none text-gray-600"
                            value={formData.startTime || "Start time"}
                            readOnly
                          />
                        </div>
                        {showStartTimePicker && (
                          <div className="absolute bottom-12 left-0 w-[300px] bg-white shadow-lg border rounded-md max-h-60 overflow-y-auto">
                            {timeOptions.map((time) => (
                              <div
                                key={time}
                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                onClick={() => {
                                  handleTimeChange("startTime", time); // Update formData
                                  setShowStartTimePicker(false);
                                }}  >
                                {time}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* End Date & Time */}
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 border rounded-md px-3 py-2 w-[300px]">
                        <FaCalendarAlt className="text-blue-500" />
                        <DatePicker
                          selected={formData.endDate}
                          onChange={(date) => handleDateChange("endDate", date)}
                          className="w-full border-none outline-none text-gray-600"
                          placeholderText="End date"
                        />
                      </div>
                      {/* Custom Time Picker - End Time (Dropdown on Bottom) */}
                      <div className="relative" ref={endTimeRef}>
                        <div
                          className="flex items-center gap-2 border rounded-md px-3 py-2 w-[300px] cursor-pointer"
                          onClick={() => setShowEndTimePicker(!showEndTimePicker)}
                        >
                          <FaClock className="text-blue-500" />
                          <input
                            type="text"
                            className="w-full border-none outline-none text-gray-600"
                            value={formData.endTime || "End time"}
                            readOnly
                          />
                        </div>

                        {showEndTimePicker && (
                          <div className="absolute bottom-full mb-2 left-0 w-[300px] bg-white shadow-lg border rounded-md max-h-60 overflow-y-auto">
                            {timeOptions.map((time) => (
                              <div
                                key={time}
                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                onClick={() => {
                                  handleTimeChange("endTime", time); // Update formData
                                  setShowEndTimePicker(false);
                                }}
                              >
                                {time}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2 mt-2">
                      {["00:15 H", "00:30 H", "00:45 H", "10:00 H"].map(
                        (time) => (
                          <button
                            key={time}
                            type="button"
                            className="px-2 py-1 border rounded-full bg-gray-200 text-gray-600 hover:bg-blue-500 hover:text-white"
                          >
                            {time}
                          </button>
                        )
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-36 mb-8">
                  <label className="text-gray-600 font-small">
                     Type
                  </label>
                  <select
                    name="activityModel"
                    value={formData.activityModel}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md mt-2"
                  >
                    <option value="Deal">Deal</option>
                    <option value="Person">Person</option>
                    <option value="Organization">Organization</option>
                  </select>
                </div>

                {/* Dynamic Selection based on Activity Type */}
                {formData.activityModel === "Deal" && (
                  <div className="flex items-center gap-36 mb-6">
                    <label className="text-gray-600">Deal</label>
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
                  <div className="flex items-center gap-34 mb-6">
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
                  <div className="flex items-center gap-22 mb-6">
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

              {/* Collaborations */}
              <div className="flex items-center gap-20 mb-6">
                {/* Label */}
                <label className="text-gray-600 font-small">
                  Collaborators
                </label>

                {/* Collaboration Box */}
                <div className="border border-gray-300 bg-gray-100 p-4 rounded-md w-full flex justify-between items-center cursor-pointer relative">
                  {/* Show Selected Owner or Add Button */}
                  {selectedOwner ? (
                    <div className="flex items-center justify-between w-[150px] px-2 py-1 bg-white border rounded-md">
                      <span className="text-gray-700">{selectedOwner}</span>
                      <button
                        onClick={handleRemoveOwner}
                        className="text-red-500"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={handleAddButtonClick}
                      
                    >
                      + Add
                    </button>
                  )}

                  {/* Dropdown */}
                  {showDropdown && (
                    <div className="absolute top-full left-0 w-72 mt-2 bg-white border rounded-lg shadow-lg p-2 z-10">
                      {/* Search Input */}
                      <div className="flex items-center border border-gray-300 rounded-md px-3 py-2">
                        <Search className="h-4 w-4 text-gray-500" />
                        <input
                          type="text"
                          className="w-full outline-none border-none px-2 text-sm"
                          placeholder="Search..."
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                        />
                      </div>

                      {/* Owner List */}
                      <ul className="mt-2">
                        {filteredOrganization.length > 0 ? (
                          filteredOrganization.map((org) => (
                            <li
                              key={org.id}
                              onClick={() => handleSelectOwner(org.owner)}
                              className="px-3 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer rounded-md"
                            >
                              {org.owner}
                            </li>
                          ))
                        ) : (
                          <li className="px-3 py-2 text-gray-400">
                            No owners found
                          </li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              {/* Set Schedule */}
              <div className="flex items-center gap-22 mb-6">
                <label className="text-gray-600 font-small">Set reminder</label>
                <select
                  className="w-[350px] p-2 border rounded-md mt-2"
                  value={reminder}
                  onChange={(e) => {
                    console.log("Selected Reminder:", e.target.value);
                    setReminder(e.target.value);
                  }}
                >
                  <option value="No reminder">No reminder</option>
                  <option value="15min">15 minutes before</option>
                  <option value="30min">30 minutes before</option>
                  <option value="1hour">1 hour before</option>
                  <option value="1day">1 day before</option>
                </select>
              </div>

              {/* Modal Actions */}
              <div className="border-t p-4 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-400 text-white rounded-md cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-md cursor-pointer"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ModalCalendar;
