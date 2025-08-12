


import React, { useState } from "react";

export default function CreateLeads() {
  const [formData, setFormData] = useState({
    leadName: "",
    phoneNumber: "",
    email: "",
    source: "",
    companyName: "",
    industry: "",
    requirement: "",
    status: "",
    assignTo: "",
    address: "",
    priorityLevel: "",
    followUpDate: "",
    leadStatus: "",
    notes: "",
  });

  const [errors, setErrors] = useState({
    leadName: false,
    companyName: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error when user starts typing in required fields
    if ((name === "leadName" || name === "companyName") && value.trim() !== "") {
      setErrors({ ...errors, [name]: false });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate required fields
    const newErrors = {
      leadName: formData.leadName.trim() === "",
      companyName: formData.companyName.trim() === "",
    };
    
    setErrors(newErrors);
    
    if (!newErrors.leadName && !newErrors.companyName) {
      console.log("Form submitted:", formData);
      // Here you would typically send the data to your API
    }
  };

  // Group fields by category for better organization
  const fieldGroups = [
    {
      title: "Basic Information",
      fields: ["leadName", "companyName", "phoneNumber", "email", "address"]
    },
    {
      title: "Business Details",
      fields: ["industry", "source", "requirement"]
    },
    {
      title: "Lead Management",
      fields: ["status", "assignTo", "priorityLevel", "followUpDate", "leadStatus"]
    },
    {
      title: "Additional Information",
      fields: ["notes"]
    }
  ];

  const getFieldType = (field) => {
    if (field.includes("Date")) return "datetime-local";
    if (field.includes("email")) return "email";
    if (field === "phoneNumber") return "tel";
    if (field === "notes") return "textarea";
    return "text";
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-semibold mb-6 text-gray-800">Create New Lead</h1>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        {fieldGroups.map((group) => (
          <div key={group.title} className="space-y-4">
            <h2 className="text-lg font-medium text-gray-700 border-b pb-2">{group.title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {group.fields.map((field) => (
                <div key={field} className="flex flex-col">
                  <label className="text-sm font-medium mb-1 text-gray-600 capitalize">
                    {field.replace(/([A-Z])/g, ' $1').trim()}
                    {(field === "leadName" || field === "companyName") && (
                      <span className="text-red-500 ml-1">*</span>
                    )}
                  </label>
                  
                  {getFieldType(field) === "textarea" ? (
                    <textarea
                      name={field}
                      value={formData[field]}
                      onChange={handleChange}
                      className={`border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors[field] ? "border-red-500" : "border-gray-300"
                      }`}
                      rows={3}
                    />
                  ) : (
                    <input
                      type={getFieldType(field)}
                      name={field}
                      value={formData[field]}
                      onChange={handleChange}
                      className={`border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors[field] ? "border-red-500" : "border-gray-300"
                      }`}
                      required={field === "leadName" || field === "companyName"}
                    />
                  )}
                  
                  {errors[field] && (
                    <p className="text-red-500 text-xs mt-1">
                      This field is required
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
        
        <div className="flex justify-end space-x-4 pt-4 border-t">
          <button
            type="button"
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Save Lead
          </button>
        </div>
      </form>
    </div>
  );
}