
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Editor } from "@tinymce/tinymce-react";
import { toast } from "react-toastify";

const ModalDeals = ({ isOpen, onClose,onDealAdded,onEdit,dealToEdit   }) => {
  const [leadType, setLeadType] = useState("person");
  const [selectedStage, setSelectedStage] = useState("Visit Scheduled");
  const [hoveredStage, setHoveredStage] = useState(null);
  const [persons, setPersons] = useState([]);
  const [organizations, setOrganizations] = useState([]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    leadType: "person",
    personId: "",
    organizationId: "",
    stage: "Visit Scheduled",
    dealsValue: "",
    expectingClosingDate: "",
    owner: "",
  });

  const stages = ["Visit Scheduled", "Visit Completed", "Customer No Show"];

  useEffect(() => {
    fetchPersons();
    fetchOrganizations();
   
  }, []);

  const fetchPersons = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/person");
      console.log("Persons Response:", res.data);
      setPersons(res.data);
    } catch (error) {
      console.error("Error fetching persons:", error);
    }
  };

  const fetchOrganizations = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/organization");
      setOrganizations(res.data);
    } catch (error) {
      console.error("Error fetching organizations:", error);
    }
  };

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if (dealToEdit) {
      setFormData(dealToEdit); // Populate form with existing deal data
    } else {
      setFormData({
        title: "",
        description: "",
        leadType: "person",
        personId: "",
        organizationId: "",
        stage: "Visit Scheduled",
        dealsValue: "",
        expectingClosingDate: "",
        owner: "",
      });
    }
  }, [dealToEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.title.trim() === "") {
      toast.error("Title is required!");
      return;
    }

    try {
      if (dealToEdit) {
        await axios.put(`http://localhost:5000/api/alldeals/update/${dealToEdit._id}`, formData);
        console.log("Updated deal response:", res.data);
        onEdit(formData);
        toast.success("Deal updated successfully!");
      } else {
        const res = await axios.post("http://localhost:5000/api/alldeals/add", formData);
        console.log("API Response:", res.data);

        if (!res.data || !res.data._id) {
            console.error("API response is missing _id:", res.data);
            toast.error("Error: API response does not contain _id.");
            return;
        }

        onDealAdded(res.data); 
        onClose();
        toast.success("Deal added successfully!");

      }

      
      // window.location.reload();
    } catch (error) {
      toast.error("Error saving deal");
      console.error("Error:", error);
    }
  };
    
  

  return (
    <>
      {/* Background Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="fixed inset-0 flex justify-center items-center z-50">
        <div className="bg-white w-[1030px] h-[610px] rounded-lg shadow-lg flex flex-col">
          {/* Modal Header */}
          <div className="flex justify-between items-center border-b p-4">
          <h2 className="text-lg font-semibold">{dealToEdit ? "Edit Deal" : "Add Deal"}</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-black"
            >
              ✖
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-8">
            <form onSubmit={handleSubmit}>
              {/* Title */}
              <div className="flex items-center gap-4 mb-6">
                <label className="text-gray-600 w-56">Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter deal title"
                  className="flex-1 p-2 border rounded-md"
                  required
                />
              </div>

              {/* Description (WYSIWYG Editor) */}
              <div className="flex items-start gap-4 mb-6">
                <label className="text-gray-600 w-56 mt-2">Description</label>
                <div className="flex-1">
                  <Editor
                    apiKey="f4387hl2q3tdy6tmqpbcd0petpv1auib0u15bczuzdp9wvvp"
                    init={{
                      height: 200,
                      menubar: false,
                      plugins: [
                        "advlist autolink lists link charmap preview anchor",
                        "searchreplace visualblocks code fullscreen",
                        "insertdatetime media table code help wordcount",
                      ],
                      toolbar:
                        "undo redo | bold italic underline | alignleft aligncenter alignright alignjustify | outdent indent | bullist numlist",
                    }}
                    onEditorChange={(content) =>
                      setFormData({ ...formData, description: content })
                    }
                  />
                </div>
              </div>

              {/* Lead Type (Radio Buttons) */}
              <div className="flex items-center gap-4 mb-6">
                <label className="text-gray-600 w-56">Lead Type</label>
                <div className="flex gap-6">
                  {["person", "organization"].map((type) => (
                    <label key={type} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="leadType"
                        value={type}
                        checked={formData.leadType === type}
                        onChange={handleChange}
                        className="accent-blue-500"
                      />
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </label>
                  ))}
                </div>
              </div>

              {/* Person / Organization Dropdown */}
              {formData.leadType === "person" ? (
                <div className="flex items-center gap-4 mb-6">
                  <label className="text-gray-600 w-56">Person</label>
                  <select
                    name="personId"
                    value={formData.personId}
                    onChange={handleChange}
                    className="flex-1 p-2 border rounded-md"
                  >
                    <option value="">Choose a Person</option>
                    {persons.map((person) => (
                      <option key={person._id} value={person._id}>
                        {person.personName}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="flex items-center gap-4 mb-6">
                  <label className="text-gray-600 w-56">Organization</label>
                  <select
                    name="organizationId"
                    value={formData.organizationId}
                    onChange={handleChange}
                    className="flex-1 p-2 border rounded-md"
                  >
                    <option value="">Choose an Organization</option>
                    {organizations.map((org) => (
                      <option key={org._id} value={org._id}>
                        {org.organizationName}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Deal Value */}
              <div className="flex items-center gap-4 mb-6">
                <label className="text-gray-600 w-56">Deal value</label>
                <input
                  type="number"
                  name="dealsValue"
                  value={formData.dealsValue}
                  onChange={handleChange}
                  placeholder="Enter deal value"
                  className="flex-1 p-2 border rounded-md"
                />
              </div>

              {/* Stage Selection */}
              <div className="flex items-center gap-8 mb-6 relative">
                <label className="text-gray-600 w-56">Stage</label>
                <div className="flex space-x-2">
                  {stages.map((stage) => (
                    <button
                    key={stage}
                    type="button"  // Add this to prevent form submission
                    onClick={(e) => {
                      e.preventDefault(); // Prevents unintended form submission
                      setFormData({ ...formData, stage });
                    }}
                    className={`px-4 py-2 border rounded transition-all duration-300 ${
                      formData.stage === stage
                        ? "bg-blue-500 text-white"
                        : "text-gray-600 hover:bg-blue-500 hover:text-white"
                    }`}
                  >
                    {stage}
                  </button>
                  
                  ))}
                </div>
              </div>

              {/* Closing Date */}
              <div className="flex items-center gap-4 mb-6">
                <label className="text-gray-600 w-56">Closing Date</label>
                <input
                  type="date"
                  name="expectingClosingDate"
                  value={formData.expectingClosingDate}
                  onChange={handleChange}
                  className="flex-1 p-2 border rounded-md"
                />
              </div>

              {/* Owner Selection */}
              <div className="flex items-center gap-4 mb-6">
                <label className="text-gray-600 w-56">Owner</label>
                <select
                  name="owner"
                  value={formData.owner}
                  onChange={handleChange}
                  className="flex-1 p-2 border rounded-md"
                >
                  <option value="">Choose an Owner</option>
                  <option>General Manager</option>
                  <option>Rosy Martin</option>
                </select>
              </div>

              {/* Modal Actions */}
              <div className="border-t p-4 flex justify-end gap-2">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-400 text-white rounded-md">
                  Cancel
                </button>
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md">
                {dealToEdit ? "Update Deal" : "Add Deal"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ModalDeals;
