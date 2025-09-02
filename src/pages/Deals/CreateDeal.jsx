import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import {
  ArrowLeft,
  User,
  DollarSign,
  Briefcase,
  UserCheck,
  StickyNote,
} from "lucide-react";
import "react-toastify/dist/ReactToastify.css";

export default function CreateDeal() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    leadId: "",
    dealValue: "",
    stage: "Qualification",
    assignTo: "",
    notes: "",
  });

  const [errors, setErrors] = useState({});
  const [leads, setLeads] = useState([]);
  const [salesUsers, setSalesUsers] = useState([]);

  // Fetch Leads
  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/leads/getAllLead"
        );
        setLeads(response.data || []);
      } catch {
        toast.error("Failed to fetch leads");
      }
    };
    fetchLeads();
  }, []);

  // Fetch Sales Users
  useEffect(() => {
    const fetchSalesUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/api/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const filteredSales = (response.data.users || []).filter(
          (user) =>
            user.role &&
            user.role.name &&
            user.role.name.trim().toLowerCase() === "sales"
        );
        setSalesUsers(filteredSales);
      } catch {
        toast.error("Failed to fetch sales users");
      }
    };
    fetchSalesUsers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (value.trim() !== "") setErrors({ ...errors, [name]: false });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {
      leadId: formData.leadId.trim() === "",
      dealValue: formData.dealValue.trim() === "",
    };
    setErrors(newErrors);

    if (!newErrors.leadId && !newErrors.dealValue) {
      try {
        const payload = {
          leadId: formData.leadId,
          value: formData.dealValue,
          stage: formData.stage,
          assignedTo: formData.assignTo,
          notes: formData.notes,
        };

        await axios.post("http://localhost:5000/api/deals/createManual", payload, {
          headers: { "Content-Type": "application/json" },
        });

        toast.success("🎉 Deal created successfully");
        navigate("/deals");
      } catch {
        toast.error("Failed to create deal");
      }
    }
  };

  const handleBackClick = () => navigate(-1);

  const fieldGroups = [
    {
      title: "Deal Information",
      color: "text-blue-600",
      fields: [
        {
          name: "leadId",
          label: "Select Lead",
          icon: <User size={16} />,
          type: "select",
          options: leads.map((lead) => ({
            label: `${lead.leadName} - ${lead.companyName}`,
            value: lead._id,
          })),
        },
        {
          name: "dealValue",
          label: "Deal Value",
          icon: <DollarSign size={16} />,
          type: "number",
        },
        {
          name: "stage",
          label: "Stage",
          icon: <Briefcase size={16} />,
          type: "select",
          options: [
            "Qualification",
            "Proposal",
            "Negotiation",
            "Closed Won",
            "Closed Lost",
          ],
        },
      ],
    },
    {
      title: "Management",
      color: "text-green-600",
      fields: [
        {
          name: "assignTo",
          label: "Assign To",
          icon: <UserCheck size={16} />,
          type: "select",
          options: salesUsers.map((u) => ({
            label: `${u.firstName} ${u.lastName}`,
            value: u._id,
          })),
        },
      ],
    },
    {
      title: "Additional Information",
      color: "text-purple-600",
      fields: [
        {
          name: "notes",
          label: "Notes",
          icon: <StickyNote size={16} />,
          type: "textarea",
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen flex items-start justify-center py-10">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-lg border border-gray-200">
        {/* Header */}
           <div className="flex items-center gap-3 px-6 py-5 border-b rounded-t-2xl">
      {/* Back Button */}
      <button
        onClick={handleBackClick}
        className="p-2 rounded-lg hover:bg-gray-100 transition"
      >
        <ArrowLeft size={20} className="text-gray-700" />
      </button>

      {/* Title */}
      <h1 className="text-2xl font-bold text-gray-800">Create New Deal</h1>
    </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-10">
          {fieldGroups.map((group) => (
            <div key={group.title} className="space-y-6 p-6 border rounded-xl">
              <h2
                className={`text-lg font-semibold border-b pb-2 ${group.color}`}
              >
                {group.title}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {group.fields.map((field) => (
                  <div
                    key={field.name}
                    className={`${
                      field.type === "textarea" ? "md:col-span-3" : ""
                    }`}
                  >
                    <label className="block text-sm font-medium text-gray-600 mb-2 flex items-center gap-2">
                      {field.icon} {field.label}
                      {(field.name === "leadId" ||
                        field.name === "dealValue") && (
                        <span className="text-red-500">*</span>
                      )}
                    </label>

                    {field.type === "select" ? (
                      <select
                        name={field.name}
                        value={formData[field.name]}
                        onChange={handleChange}
                        className="w-full border rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-400 outline-none transition h-10"
                      >
                        <option value="">Select {field.label}</option>
                        {field.options.map((opt) =>
                          typeof opt === "string" ? (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ) : (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          )
                        )}
                      </select>
                    ) : field.type === "textarea" ? (
                      <textarea
                        name={field.name}
                        rows={5}
                        value={formData[field.name]}
                        onChange={handleChange}
                        placeholder={`Enter ${field.label}...`}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white shadow-sm text-sm text-gray-700 placeholder-gray-400 transition resize-none"
                      />
                    ) : (
                      <input
                        type={field.type || "text"}
                        name={field.name}
                        value={formData[field.name]}
                        onChange={handleChange}
                        placeholder={`Enter ${field.label}`}
                        className="w-full border rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-400 outline-none transition h-10"
                        required={
                          field.name === "leadId" || field.name === "dealValue"
                        }
                      />
                    )}

                    {errors[field.name] && (
                      <p className="text-sm text-red-500 mt-1">
                        {field.label} is required
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Buttons */}
          <div className="flex justify-end gap-4 pt-6 border-t">
            <button
              type="button"
              onClick={handleBackClick}
              className="px-6 py-2 rounded-lg border bg-white hover:bg-gray-100 text-gray-700 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow-md transition"
            >
              Save Deal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


