import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const ModalPerson = ({ isOpen, onClose, person, onUpdate }) => {
  console.log("onUpdate received in ModalPerson:", onUpdate);

  const [formData, setFormData] = useState({
    personName: "",
    leadGroupId: "",
    organizationId: "",
    owner: "",
    phone: "",
    phoneType: "",
    email: "",
    emailType: "",
    customFields: {
      cardlead: "",
      admin: "",
      dbut: "",
      fin: "",
    },
  });

  const [leadGroups, setLeadGroups] = useState([]);
  const [organizations, setOrganizations] = useState([]);

  useEffect(() => {
    if (person) {
      setFormData({
        personName: person.personName || "",
        leadGroupId: person.leadGroup?._id || "",
        organizationId: person.organization?._id || "",
        owner: person.owner || "",
        phone: person.phone || "",
        phoneType: person.phoneType || "",
        email: person.email || "",
        emailType: person.emailType || "",
        customFields: {
          cardlead: person.customFields?.cardlead || "",
          admin: person.customFields?.admin || "",
          dbut: person.customFields?.dbut || "",
          fin: person.customFields?.fin || "",
        },
      });
    }
  }, [person]);

  useEffect(() => {
    if (isOpen) {
      fetchLeadGroups();
      fetchOrganizations();
    }
  }, [isOpen]);

  useEffect(() => {
    if (person) {
      setFormData(person); // Pre-fill form with the person data if editing
    }
  }, [person]);

  const fetchLeadGroups = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/leadGroup");
      setLeadGroups(res.data);
    } catch (error) {
      console.error("Error fetching lead groups:", error);
    }
  };

  const fetchOrganizations = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/organization");
      //console.log("res",res)
      setOrganizations(res.data);
      console.log("Organizations Data:", res.data);
    } catch (error) {
      console.error("Error fetching organizations:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Check if it's a custom field
    if (name.startsWith("customFields.")) {
      const fieldName = name.split(".")[1]; // Extract field name after "customFields."
      setFormData((prev) => ({
        ...prev,
        customFields: {
          ...prev.customFields,
          [fieldName]: value, // Update only the specific custom field
        },
      }));
    } else {
      // For normal fields
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedData = { ...formData };

      if (person) {
        // Updating an existing person
        await axios.put(
          `http://localhost:5000/api/person/${person._id}`,
          updatedData
        );
        toast.success("Person update Successfully")
      } else {
        // Adding a new person
        await axios.post("http://localhost:5000/api/person/add", updatedData);
        toast.success("Person Added Successfully")
      }

      console.log("Updated Person:", updatedData); // Log updated person data

      // Now use onUpdate to send the updated or new person back to the parent
      if (onUpdate) {
        console.log("Calling onUpdate with:", updatedData); // Log onUpdate data
        onUpdate(updatedData); // Call the onUpdate function passed from parent
      }

      onClose(); // Close the modal after submitting
    } catch (error) {
        toast.error("Error saving person")
      console.error("Error saving person:", error);
    }
  };

  if (!isOpen) return null;
  return (
    <>
      {/* Background Overlay */}
      <div
        className="fixed inset-0 bg-gray-300 bg-opacity-50 backdrop-blur-sm z-50"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="fixed inset-0 flex justify-center items-center z-50">
        <div className="bg-white w-[700px] h-[600px] rounded-lg shadow-lg flex flex-col">
          {/* Modal Header */}
          <div className="flex justify-between items-center border-b p-4">
            <h2 className="text-lg font-semibold">
              {person ? "Edit Person" : "Add Person"}
            </h2>
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
              {/* Name */}
              <div className="flex items-center gap-4 mb-6">
                <label className="text-gray-600 w-42">Name</label>
                <input
                  type="text"
                  placeholder="Enter name"
                  name="personName"
                  value={formData.personName}
                  onChange={handleChange}
                  className="flex-1 p-2 border rounded-md"
                />
              </div>

              {/* Lead group */}
              <div className="flex items-center gap-4 mb-6">
                <label className="text-gray-600 w-42">Lead group</label>
                <select
                  name="leadGroupId"
                  value={formData.leadGroupId}
                  onChange={handleChange}
                  className="flex-1 p-2 border rounded-md"
                >
                  <option value="">Choose a lead group</option>
                  {leadGroups.map((group) => (
                    <option key={group._id} value={group._id}>
                      {group.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Owner */}
              <div className="flex items-center gap-4 mb-6">
                <label className="text-gray-600 w-42">Organization</label>
                <select
                  name="organizationId"
                  value={formData.organizationId}
                  onChange={handleChange}
                  className="flex-1 p-2 border rounded-md"
                >
                  <option value="">Choose an organization</option>
                  {organizations.map((org) => (
                    <option key={org._id} value={org._id}>
                      {org.organizationName}
                    </option>
                  ))}
                </select>
              </div>
              {/* Contact Info Section */}
              {/* Contact Info Section */}
              <div className="mt-6">
                <h3 className="text-md font-semibold text-gray-700 mb-2">
                  Contact info
                </h3>

                {/* Phone Input */}
                <div className="flex items-center gap-4 mb-4">
                  <label className="text-gray-600 w-38">Phone</label>
                  <div className="flex-1 flex items-center border rounded-md p-2">
                    <span className="mr-2">🇮🇳</span> {/* Country Flag */}
                    <input
                      type="text"
                      name="phone"
                      placeholder="Enter number"
                      className="w-full border-none outline-none"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>
                  <select className="p-2 border rounded-md w-38">
                    <option value="">Type</option>
                    <option value="Work">Work</option>
                    <option value="Home">Home</option>
                    <option value="Office">Office</option>
                  </select>
                </div>
                <button className="text-blue-500 text-sm font-semibold  ml-42">
                  + add more
                </button>

                {/* Email Input */}
                <div className="flex items-center gap-4 mt-4">
                  <label className="text-gray-600 w-38">Email</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter email"
                    className="flex-1 p-2 border rounded-md"
                    value={formData.email}
                    onChange={handleChange}
                  />
                  <select
                    name="emailType"
                    value={formData.emailType}
                    onChange={handleChange}
                    className="p-2 border rounded-md w-38"
                  >
                    <option value="">Type</option>
                    <option value="Work">Work</option>
                    <option value="Personal">Personal</option>
                  </select>
                </div>
                <button className="text-blue-500 text-sm font-semibold  ml-42">
                  + add more
                </button>

                {/* Owner Dropdown */}
                <div className="flex items-center gap-4 mt-4">
                  <label className="text-gray-600 w-38">Owner</label>
                  <select
                    name="owner"
                    value={formData.owner}
                    onChange={handleChange}
                    className="flex-1 p-2 border rounded-md"
                  >
                    <option value="">Choose an owner</option>
                    <option value="Karm Pradhan">Karm Pradhan</option>
                  </select>
                </div>

                {/* Add Address Button */}
                <button className="text-blue-500 text-sm font-semibold ml-42 mt-2">
                  + Add address
                </button>
              </div>

              {/* Custom Fields */}
              <h3 className="text-md font-semibold mt-4">Custom fields</h3>

              <div className="flex items-center gap-4 mb-6">
                <label className="text-gray-600 w-42">Card Lead</label>
                <input
                  type="text"
                  name="customFields.cardlead"
                  className="flex-1 p-2 border rounded-md"
                  value={formData.customFields.cardlead}
                  onChange={handleChange}
                />
              </div>
              <div className="flex items-center gap-4 mb-6">
                <label className="text-gray-600 w-42">admin</label>
                <input
                  type="text"
                  name="customFields.admin"
                  className="flex-1 p-2 border rounded-md"
                  value={formData.customFields.admin}
                  onChange={handleChange}
                />
              </div>
              <div className="flex items-center gap-4 mb-6">
                <label className="text-gray-600 w-42">dbut contract</label>
                <input
                  type="text"
                  name="customFields.dbut"
                  className="flex-1 p-2 border rounded-md"
                  value={formData.customFields.dbut}
                  onChange={handleChange}
                />
              </div>
              <div className="flex items-center gap-4 mb-6">
                <label className="text-gray-600 w-42">fin contract</label>
                <input
                  type="text"
                  name="customFields.fin"
                  className="flex-1 p-2 border rounded-md"
                  value={formData.customFields.fin}
                  onChange={handleChange}
                />
              </div>

              {/* Modal Actions */}
              <div className="border-t p-4 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-400 text-white rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-md"
                >
                  {person ? "Update" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ModalPerson;
