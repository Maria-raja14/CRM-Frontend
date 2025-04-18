import React, { useState,useEffect } from "react";
import { Search } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ModalPerson from "./ModalPerson";
import PersonTable from "./PersonTable";
import axios from "axios";
import { toast } from "react-toastify";


const AddPerson = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [persons, setPersons] = useState([]);
  const [search, setSearch] = useState("");


  
  useEffect(() => {
    console.log("useEffect running...");
    fetchPersons();
  }, []);


  const fetchPersons = async () => {
    try {
      console.log("fetchPersons function called...");
      const res = await axios.get("http://localhost:5000/api/person");
       const data = res.data;  
       setPersons(data);

    } catch (error) {
      console.error("Error fetching persons:", error.message);
    }
  };
  console.log("Passing onUpdate function:", fetchPersons);


const handleAddOrUpdatePerson = (newPerson) => {
  console.log('New or Updated Person:', newPerson);  // Log the data coming back

  setPersons((prevPersons) => {
    if (newPerson._id) {
      // If the person has an ID, we are updating an existing person
      return prevPersons.map((person) =>
        person._id === newPerson._id ? newPerson : person
      );
    } else {
      // If there's no ID, it's a new person
      return [newPerson, ...prevPersons]; // Add the new person to the list
    }
  });
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

  const filteredPersons = persons.filter((person) =>
    person.personName?.toLowerCase().includes(search.toLowerCase())
  );

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
          {/* Created Date Button */}
          <div className="relative">
            <button
              className="border border-gray-100 bg-white shadow-lg px-4 py-2 rounded-4xl flex items-center gap-2"
              onClick={() => setShowDatePicker(!showDatePicker)}
            >
              Created date
            </button>
            {showDatePicker && (
              <div className="absolute mt-2 bg-white p-2 shadow-md rounded-md">
                <DatePicker
                  selected={selectedDate}
                  onChange={(date) => {
                    setSelectedDate(date);
                    setShowDatePicker(false);
                  }}
                  dateFormat="yyyy-MM-dd"
                  className="border p-2 rounded-md"
                />
              </div>
            )}
          </div>

          {/* Owner Button (Opens Owner Modal) */}
          <button
            className="border border-gray-100 bg-white shadow-lg px-4 py-2 rounded-4xl flex items-center gap-2"
           
          >
            Owner
          </button>

          <button className="border border-gray-100 bg-white shadow-lg px-4 py-2 rounded-4xl flex items-center gap-2">
            Lead group
          </button>
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
      <PersonTable persons={filteredPersons} onDelete={handleDelete} onUpdate={handleAddOrUpdatePerson}/>
      <ModalPerson
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUpdate={handleAddOrUpdatePerson}
      />

     
    </div>
  );
};

export default AddPerson;