



import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import AddOrganization from "./AddOrganization";

const ModalOrganization = ({
  isOpen,
  onClose,
  organizationData,
  addNewOrganization,
  refreshOrganizations,
}) => {
  const [isAddressOpen, setIsAddressOpen] = useState(false);

  const [formData, setFormData] = useState({
    organizationName: "",
    leadGroupId: "",
    owner: "",
    addressDetails: {
      country: "",
      area: "",
      city: "",
      state: "",
      zipCode: "",
    },
    customFields: {
      loan: "",
      AAs: "",
      Sites: "",
      testing: "",
      kiona: "",
    },
  });




  const [leadGroups, setLeadGroups] = useState([]);
  const [errors, setErrors] = useState({});

  const fetchLeadGroups = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/leadGroup");
      setLeadGroups(response.data);
    } catch (error) {
      console.error("Error fetching lead groups:", error);
    }
  };

  useEffect(() => {
    fetchLeadGroups();
  }, []);

  useEffect(() => {
    if (organizationData) {
      setFormData(organizationData);
      setIsAddressOpen(true);
    }
  }, [organizationData]);

  useEffect(() => {
    if (organizationData) {
      setFormData({
        organizationName: organizationData.organizationName || "",
        leadGroupId: organizationData.leadGroupId || "",
        owner: organizationData.owner || "",
        addressDetails: {
          country: organizationData.addressDetails?.country || "",
          area: organizationData.addressDetails?.area || "",
          city: organizationData.addressDetails?.city || "",
          state: organizationData.addressDetails?.state || "",
          zipCode: organizationData.addressDetails?.zipCode || "",
        },
        customFields: {
          loan: organizationData.customFields?.loan || "",
          AAs: organizationData.customFields?.AAs || "",
          Sites: organizationData.customFields?.Sites || "",
          testing: organizationData.customFields?.testing || "",
          kiona: organizationData.customFields?.kiona || "",
        },
      });
      setIsAddressOpen(true);
    }
  }, [organizationData]);


  
  

  const API_URL = "http://localhost:5000/api/organization";

  const validateForm = () => {
    const newErrors = {};
    if (!formData.organizationName) newErrors.organizationName = "Organization name is required.";
    if (!formData.leadGroupId) newErrors.leadGroupId = "Lead group is required.";
    if (!formData.owner) newErrors.owner = "Owner is required.";
    if (isAddressOpen) {
      Object.keys(formData.addressDetails).forEach((field) => {
        if (!formData.addressDetails[field]) newErrors[`addressDetails.${field}`] = `${field} is required.`;
      });

      Object.keys(formData.customFields).forEach((field) => {
        if (!formData.customFields[field]) newErrors[`customFields.${field}`] = `${field} is required.`;
      });
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

 


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
  
    try {
      let response;
  
      if (organizationData) {
        // Update mode
        response = await axios.put(`${API_URL}/${organizationData._id}`, formData);
        toast.success("Organization updated successfully!");
      } else {
        // Add mode
        response = await axios.post(`${API_URL}/add`, formData);
        toast.success("Organization added successfully!");
      }
  
      if (!response.data || !response.data._id) {
        console.error("API response is missing _id:", response.data);
        toast.error("Error: API response does not contain _id.");
        return;
      }
  
      // Update frontend immediately with the new organization
      if (response.data) {
        addNewOrganization(response.data); // Add the newly created organization to the state
      }
  
      if (refreshOrganizations) {
        await refreshOrganizations(); // Refreshes the table if needed
      }
  
      onClose(); // Close the modal
    } catch (error) {
      console.error("Error saving organization:", error);
      toast.error("Error saving organization");
    }
  };
  
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0  bg-opacity-50 backdrop-blur-sm z-50"
        onClick={onClose}
      ></div>

      <div className="fixed inset-0 flex justify-center items-center z-50">
        <div className="bg-white w-[700px] h-[600px] rounded-lg shadow-lg flex flex-col">
          <div className="flex justify-between items-center border-b p-4">
            <h2 className="text-lg font-semibold">
              {organizationData ? "Edit Organization" : "Add Organization"}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-black cursor-pointer"
            >
              ✖
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-8">
            <form onSubmit={handleSubmit}>
              {/* Organization Name */}
              <div className="flex items-center gap-4 mb-6">
                <label className="text-gray-600 w-42">Name</label>
                <input
                  type="text"
                  placeholder="Organization name"
                  name="organizationName"
                  value={formData.organizationName}
                  className="flex-1 p-2 border rounded-md"
                  onChange={handleChange}
                />
                {errors.organizationName && <span className="text-red-500 text-sm">{errors.organizationName}</span>}
              </div>

              {/* Lead group */}
              <div className="flex items-center gap-4 mb-6">
                <label className="text-gray-600 w-42">Lead group</label>
                <select
                  name="leadGroupId"
                  value={formData.leadGroupId}
                  className="flex-1 p-2 border rounded-md"
                  onChange={handleChange}
                >
                  <option value="">Choose a lead group</option>
                  {leadGroups.map((group) => (
                    <option key={group._id} value={group._id}>
                      {group.name}
                    </option>
                  ))}
                </select>
                {errors.leadGroupId && <span className="text-red-500 text-sm">{errors.leadGroupId}</span>}
              </div>

              {/* Owner */}
              <div className="flex items-center gap-4 mb-6">
                <label className="text-gray-600 w-42">Owner</label>
                <select
                  name="owner"
                  value={formData.owner}
                  className="flex-1 p-2 border rounded-md"
                  onChange={handleChange}
                >
                  <option value="">Choose an owner</option>
                  <option value="zebra forest">Zebra Forest</option>
                </select>
                {errors.owner && <span className="text-red-500 text-sm">{errors.owner}</span>}
              </div>

              <div className="pl-[180px] mb-2">
                <button
                  type="button"
                  className="text-blue-500"
                  onClick={() => setIsAddressOpen(!isAddressOpen)}
                >
                  + Add address
                </button>
              </div>

              {isAddressOpen && (
                <>
                  {["country", "area", "city", "state", "zipCode"].map((field) => (
                    <div key={field} className="flex items-center gap-4 mb-6">
                      <label className="text-gray-600 w-42">{field}</label>
                      <input
                        type="text"
                        name={`addressDetails.${field}`}
                        className="flex-1 p-2 border rounded-md"
                        value={formData.addressDetails[field]}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            addressDetails: {
                              ...prev.addressDetails,
                              [field]: e.target.value,
                            },
                          }))
                        }
                      />
                      {errors[`addressDetails.${field}`] && (
                        <span className="text-red-500 text-sm">{errors[`addressDetails.${field}`]}</span>
                      )}
                    </div>
                  ))}
                </>
              )}

              {/* Custom Fields */}
              <h3 className="text-md font-semibold mt-4">Custom fields</h3>
              {Object.keys(formData.customFields).map((field) => (
                <div key={field} className="flex items-center gap-4 mb-6">
                  <label className="text-gray-600 w-42">{field}</label>
                  <input
                    type="text"
                    name={`customFields.${field}`}
                    className="flex-1 p-2 border rounded-md"
                    value={formData.customFields[field]}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        customFields: {
                          ...prev.customFields,
                          [field]: e.target.value,
                        },
                      }))
                    }
                  />
                  {errors[`customFields.${field}`] && (
                    <span className="text-red-500 text-sm">{errors[`customFields.${field}`]}</span>
                  )}
                </div>
              ))}

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
                  {organizationData ? "Update" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
        {/* <AddOrganization leadGroups={leadGroups} /> */}
      </div>
    </>
  );
};

export default ModalOrganization;
