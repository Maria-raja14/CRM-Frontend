import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ModalPerson from "./ModalPerson";
import PersonTable from "./PersonTable";
import axios from "axios";
import { toast } from "react-toastify";

const AddPerson = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
   const [selectedDate, setSelectedDate] = useState([new Date(), new Date()]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [persons, setPersons] = useState([]);
  const [search, setSearch] = useState("");
  const [leadGroups, setLeadGroups] = useState([]);
  const [showLeadGroupDropdown, setShowLeadGroupDropdown] = useState(false);
  const [filteredPersons, setFilteredPersons] = useState([]); //
  const [selectedLeadGroups, setSelectedLeadGroups] = useState([]); // State to hold selected lead groups

  // Function to handle checkbox change for selecting lead groups
  const handleLeadGroupChange = (groupName) => {
    setSelectedLeadGroups(
      (prev) =>
        prev.includes(groupName)
          ? prev.filter((group) => group !== groupName) // Remove the group if already selected
          : [...prev, groupName] // Add the group if not already selected
    );
  };

  // Function to apply filters
  const handleApplyFilters = () => {
    setShowLeadGroupDropdown(false); // Close the dropdown after applying filters
    filterPersons()
  };

  // Modify the filteredPersons logic to filter based on selected lead groups
  const filterPersons = () => {
    const result = persons.filter((person) => {
      const matchesLeadGroup =
        selectedLeadGroups.length === 0 || // If no lead group is selected, show all
        selectedLeadGroups.includes(person.leadGroup?.name);
      return (
        person.personName?.toLowerCase().includes(search.toLowerCase()) &&
        matchesLeadGroup
      );
    });
    setFilteredPersons(result);
  };

  useEffect(() => {
 
    fetchPersons();
  }, []);

  const fetchPersons = async () => {
    try {
      console.log("fetchPersons function called...");
      const res = await axios.get("http://localhost:5000/api/person");
      const data = res.data;
      setPersons(data);
      setFilteredPersons(data);
    } catch (error) {
      console.error("Error fetching persons:", error.message);
    }
  };

  const fetchLeadGroups = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/leadGroup");
      setLeadGroups(response.data);
      console.log(leadGroups);
    } catch (error) {
      console.error("Error fetching lead groups:", error);
    }
  };

  useEffect(() => {
    fetchLeadGroups();
  }, []);

  const handleAddOrUpdatePerson = (newPerson) => {
    setPersons((prevPersons) => {
      if (newPerson._id) {
        return prevPersons.map((person) =>
          person._id === newPerson._id ? newPerson : person
        );
      } else {
        return [newPerson, ...prevPersons];
      }
    });
    filterPersons(); // Re-filter the persons after adding/updating a person
  };

  const handleDelete = async (personId) => {
    if (window.confirm("Are you sure you want to delete this person?")) {
      try {
        await axios.delete(`http://localhost:5000/api/person/${personId}`);
        toast.success("Person deleted successfully!");
        setPersons(persons.filter((person) => person._id !== personId));
      } catch (error) {
        toast.error("Failed to delete person!");
        console.error("Error deleting person:", error);
      }
    }
  };

  // const filteredPersons = persons.filter((person) =>
  //   person.personName?.toLowerCase().includes(search.toLowerCase())
  // );

  return (
    <div>
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold">Persons</h2>

        {/* Buttons */}
        <div className="flex gap-2">
          <div className="relative">
            <button className="bg-green-500 text-white px-6 py-2 rounded cursor-pointer shadow-2xl">
              Actions{" "}
            </button>
            <div className="absolute mt-2 bg-white shadow-md rounded-md hidden group-hover:block">
              <button className="block px-4 py-2 w-full text-left hover:bg-gray-200">
                Export Data
              </button>
              <button className="block px-4 py-2 w-full text-left hover:bg-gray-200">
                Import Data
              </button>
            </div>
          </div>

          <button
            className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer"
            onClick={() => setIsModalOpen(true)}
          >
            Add Person
          </button>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-2 flex-wrap mb-8 items-center justify-between">
              <div className="flex gap-2 flex-wrap">
                {/* Created Date Filter */}
                {/* Created Date Filter */}
                <div className="relative">
                  <button
                    className="border border-gray-100 bg-white shadow-lg px-2 py-2 rounded-4xl flex items-center gap-2"
                    onClick={() => setShowDatePicker(!showDatePicker)}
                  >
                    Created date
                  </button>
                  {showDatePicker && (
                    <div className="absolute z-50 mt-2 bg-white p-4 shadow-md rounded-md w-[360px] flex gap-4">
                      {/* Date range calendar */}
                      <div>
                        <DatePicker
                          selected={selectedDate? selectedDate[0] : null}
                          onChange={(date) => setSelectedDate(date)}
                          startDate={selectedDate?.[0]}
                          endDate={selectedDate?.[1]}
                          selectsRange
                          inline
                          monthsShown={2}
                        />
                        <button
                          onClick={() => {
                            console.log("Date Range:", selectedDate);
                            setShowDatePicker(false);
                          }}
                          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded shadow"
                        >
                          Apply
                        </button>
                      </div>
      
                      {/* Shortcut options */}
                      <div className="pl-4 flex flex-col gap-3 justify-center text-sm">
                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="quickDate"
                            onClick={() => {
                              const today = new Date();
                              setSelectedDate([today, today]);
                            }}
                          />
                          Today
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="quickDate"
                            onClick={() => {
                              const today = new Date();
                              const past7 = new Date();
                              past7.setDate(today.getDate() - 7);
                              setSelectedDate([past7, today]);
                            }}
                          />
                          Last 7 Days
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="quickDate"
                            onClick={() => {
                              const start = new Date(
                                new Date().getFullYear(),
                                new Date().getMonth(),
                                1
                              );
                              const end = new Date(
                                new Date().getFullYear(),
                                new Date().getMonth() + 1,
                                0
                              );
                              setSelectedDate([start, end]);
                            }}
                          />
                          This Month
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="quickDate"
                            onClick={() => {
                              const start = new Date(new Date().getFullYear(), 0, 1);
                              const end = new Date(new Date().getFullYear(), 11, 31);
                              setSelectedDate([start, end]);
                            }}
                          />
                          This Year
                        </label>
                      </div>
                    </div>
                  )}
                </div>
      
                {/* Owner Button */}
                <button className="border border-gray-100 bg-white shadow-lg px-4 py-2 rounded-4xl flex items-center gap-2">
                  Owner
                </button>
      
                {/* Lead Group Dropdown Filter */}
                <div className="relative">
                  <button
                    className="border border-gray-100 bg-white shadow-lg px-4 py-2 rounded-4xl flex items-center gap-2"
                    onClick={() => setShowLeadGroupDropdown(!showLeadGroupDropdown)}
                  >
                    Lead group
                  </button>
      
                  {showLeadGroupDropdown && (
                    <div className="absolute z-50 mt-2 max-h-80 w-64 bg-white border border-gray-200 shadow-md rounded-md p-4">
                      <div className="max-h-48  grid grid-cols-1 gap-2">
                        {leadGroups.length > 0 ? (
                          leadGroups.map((group, index) => (
                            <label
                              key={index}
                              className="flex items-center gap-2 text-sm"
                            >
                              <input
                                type="checkbox"
                                checked={selectedLeadGroups.includes(group.name)}
                                onChange={() => handleLeadGroupChange(group.name)}
                                className="accent-blue-500"
                              />
                              <span>{group.name}</span>
                            </label>
                          ))
                        ) : (
                          <div className="text-gray-400 text-sm">
                            No lead groups available
                          </div>
                        )}
                      </div>
                      <button
                        className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition"
                        onClick={handleApplyFilters}
                      >
                        Apply
                      </button>
                    </div>
                  )}
                </div>
      
                {/* Tags Button */}
                <button className="border border-gray-100 bg-white shadow-lg px-4 py-2 rounded-4xl flex items-center gap-2">
                  Tags
                </button>
              </div>
      
              {/* Search Bar */}
              <div className="relative w-56">
                <Search className="absolute left-2 top-2.5 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="Search"
                  className="pl-8 py-2 w-full border border-gray-100 bg-white shadow-lg rounded-4xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
      <PersonTable
        persons={filteredPersons}
        onDelete={handleDelete}
        onUpdate={handleAddOrUpdatePerson}
      />
      <ModalPerson
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUpdate={handleAddOrUpdatePerson}
      />
    </div>
  );
};

export default AddPerson;
