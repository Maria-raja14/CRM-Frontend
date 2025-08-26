import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";

export default function CreateLeads() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const leadId = queryParams.get("id");

  const [formData, setFormData] = useState({
    leadName: "",
    phoneNumber: "",
    email: "",
    source: "",
    companyName: "",
    industry: "",
    requirement: "",
    status: "Warm",
    assignTo: "",
    address: "",

    followUpDate: "",

    notes: "",
  });

  const [errors, setErrors] = useState({
    leadName: false,
    companyName: false,
  });

  const [salesUsers, setSalesUsers] = useState([]);

  // Fetch lead data if in edit mode
  useEffect(() => {
    if (leadId) {
      const fetchLead = async () => {
        try {
          const response = await axios.get(
            `http://localhost:5000/api/leads/getLead/${leadId}`
          );
          setFormData(response.data);
        } catch (error) {
          toast.error("Failed to fetch lead data");
        }
      };
      fetchLead();
    }
  }, [leadId]);

  // Fetch sales users for "Assign To" dropdown
  useEffect(() => {
    const fetchSalesUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/api/users", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Access the "users" array inside the object
        const filteredSales = (response.data.users || []).filter(
          (user) =>
            user.role &&
            user.role.name &&
            user.role.name.toLowerCase() === "sales"
        );

        setSalesUsers(filteredSales);
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch sales users");
      }
    };

    fetchSalesUsers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (
      (name === "leadName" || name === "companyName") &&
      value.trim() !== ""
    ) {
      setErrors({ ...errors, [name]: false });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    const newErrors = {
      leadName: formData.leadName.trim() === "",
      companyName: formData.companyName.trim() === "",
    };

    setErrors(newErrors);

    if (!newErrors.leadName && !newErrors.companyName) {
      try {
        if (leadId) {
          await axios.put(
            `http://localhost:5000/api/leads/updateLead/${leadId}`,
            formData,
            { headers: { "Content-Type": "application/json" } }
          );
          toast.success("Lead updated successfully");
        } else {
          await axios.post("http://localhost:5000/api/leads/create", formData, {
            headers: { "Content-Type": "application/json" },
          });
          toast.success("Lead created successfully");
        }
        navigate("/leads");
      } catch (error) {
        toast.error(leadId ? "Failed to update lead" : "Failed to create lead");
      }
    }
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  const fieldGroups = [
    {
      title: "Basic Information",
      fields: ["leadName", "companyName", "phoneNumber", "email", "address"],
    },
    {
      title: "Business Details",
      fields: ["industry", "source", "requirement"],
    },
    {
      title: "Lead Management",
      fields: ["status", "assignTo", "followUpDate"],
    },
    { title: "Additional Information", fields: ["notes"] },
  ];

  const getFieldType = (field) => {
    if (field.includes("Date")) return "datetime-local";
    if (field.includes("email")) return "email";
    if (field === "phoneNumber") return "tel";
    if (field === "notes") return "textarea";
    return "text";
  };

  const getFieldPlaceholder = (field) => {
    const placeholders = {
      leadName: "Enter lead name",
      companyName: "Enter company name",
      phoneNumber: "Enter phone number",
      email: "Enter email address",
      address: "Enter full address",
      requirement: "Enter requirements",
      assignTo: "Assign to team member",
      notes: "Enter additional notes",
    };
    return placeholders[field] || "";
  };

  const getFieldOptions = (field) => {
    const options = {
      status: ["Hot", "Warm", "Cold", "Junk"],
      source: [
        "Website",
        "Referral",
        "Social Media",
        "Email",
        "Phone",
        "Other",
      ],
      industry: [
        "IT",
        "Finance",
        "Healthcare",
        "Education",
        "Manufacturing",
        "Retail",
        "Other",
      ],
    };

    if (field === "assignTo") {
      return salesUsers.map((user) => ({
        label: `${user.firstName} ${user.lastName}`,
        value: user._id,
      }));
    }
    return options[field] || null;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-white px-6 py-4 border-b border-gray-200">
            <div className="flex items-center">
              <button
                onClick={handleBackClick}
                className="text-gray-600 hover:text-gray-900 transition-colors mr-4"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
              </button>
              <h1 className="text-2xl font-semibold text-gray-800">
                {leadId ? "Edit Lead" : "Create New Lead"}
              </h1>
            </div>
          </div>

          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-8">
              {fieldGroups.map((group) => (
                <div key={group.title} className="space-y-6">
                  <h2 className="text-lg font-medium text-gray-800 border-b pb-2">
                    {group.title}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {group.fields.map((field) => (
                      <div
                        key={field}
                        className={`space-y-2 ${
                          field === "notes" ? "md:col-span-2 lg:col-span-3" : ""
                        }`}
                      >
                        <label className="block text-sm font-medium text-gray-700 capitalize">
                          {field.replace(/([A-Z])/g, " $1").trim()}
                          {(field === "leadName" ||
                            field === "companyName") && (
                            <span className="text-red-500 ml-1">*</span>
                          )}
                        </label>
                        {getFieldOptions(field) ? (
                          <select
                            name={field}
                            value={formData[field]}
                            onChange={handleChange}
                            className={`block w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                              errors[field]
                                ? "border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500"
                                : "border-gray-300"
                            }`}
                          >
                            <option value="">
                              Select {field.replace(/([A-Z])/g, " $1").trim()}
                            </option>
                            {getFieldOptions(field).map((option) =>
                              typeof option === "string" ? (
                                <option key={option} value={option}>
                                  {option}
                                </option>
                              ) : (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              )
                            )}
                          </select>
                        ) : getFieldType(field) === "textarea" ? (
                          <textarea
                            name={field}
                            value={formData[field]}
                            onChange={handleChange}
                            rows={6}
                            placeholder={getFieldPlaceholder(field)}
                            className={`block w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                              errors[field]
                                ? "border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500"
                                : "border-gray-300"
                            }`}
                          />
                        ) : (
                          <div>
                            <input
                              type={getFieldType(field)}
                              name={field}
                              value={formData[field]}
                              onChange={handleChange}
                              placeholder={getFieldPlaceholder(field)}
                              className={`block w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                                errors[field]
                                  ? "border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500"
                                  : "border-gray-300"
                              }`}
                              required={
                                field === "leadName" || field === "companyName"
                              }
                            />
                            {errors[field] && (
                              <p className="mt-1 text-sm text-red-600">
                                {field === "leadName"
                                  ? "Lead name is required"
                                  : "Company name is required"}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleBackClick}
                  className="inline-flex items-center px-6 py-3 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {leadId ? "Update Lead" : "Save Lead"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}//original
