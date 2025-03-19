
import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const ModalOrganization = ({ isOpen, onClose,organizationData,addNewOrganization,refreshOrganizations   }) => {
  
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

  const API_URL = "http://localhost:5000/api/organization";
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let response;
      
      if (organizationData) {
        response = await axios.put(`${API_URL}/${organizationData._id}`, formData);
        toast.success("Organization updated successfully!");
      } else {
        response = await axios.post(`${API_URL}/add`, formData);
        toast.success("Organization added successfully!");
      }
  
     
      setLeadGroups((prev) => [...prev, response.data]); 
  
      
      if (fetchLeadGroups) {
        await fetchLeadGroups(); // Fetch the latest data
        console.log("Lead Groups refreshed successfully!");
      } else {
        console.warn("fetchLeadGroups is not defined!");
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
            {organizationData ? "Edit Organization" : "Add Organization"}
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
                  placeholder="Organization name"
                  name="organizationName"
                  value={formData.organizationName}
                  className="flex-1 p-2 border rounded-md"
                  onChange={handleChange}
                />
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
              </div>

              {/* Add Address */}
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
                  {["country", "area", "city", "state", "zipCode"].map(
                    (field) => (
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
                      </div>
                    )
                  )}
                </>
              )}

              {/* Custom Fields */}
              <h3 className="text-md font-semibold mt-4">Custom fields</h3>

              {["loan", "AAs", "Sites", "testing", "kiona"].map((field) => (
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
                </div>
              ))}

              {/* Modal Actions */}
              <div className="border-t p-4 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-400 text-white rounded-md"
                >
                  Cancel
                </button>
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md">
              {organizationData ? "Update" : "Save"}
            </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ModalOrganization;









