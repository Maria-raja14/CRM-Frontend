import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { getNames } from "country-list";
import {
  User,
  Phone,
  Mail,
  MapPin,
  FileText,
  Globe,
  Building2,
  Briefcase,
  UserCheck,
  Calendar,
  StickyNote,
  ArrowLeft,
} from "lucide-react";
import "react-toastify/dist/ReactToastify.css";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

export default function CreateLeads() {
const API_URL = import.meta.env.VITE_API_URL;


  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const leadId = queryParams.get("id");

  const [userRole, setUserRole] = useState("");

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
    country: "",
    followUpDate: "",
    notes: "",
    attachments: [], // files to upload
  });

  const [errors, setErrors] = useState({});
  const [salesUsers, setSalesUsers] = useState([]);
  const [countries] = useState(getNames());
  const [existingAttachments, setExistingAttachments] = useState([]);

  // ✅ Load user role
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData);
      setUserRole(user.role?.name || "");
    }
  }, []);

  // ✅ Fetch lead if editing
  useEffect(() => {
    if (leadId) {
      const fetchLead = async () => {
        try {
          const token = localStorage.getItem("token");
          const response = await axios.get(
            `${API_URL}/leads/getLead/${leadId}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          const leadData = response.data;
          setExistingAttachments(leadData.attachments || []);
          setFormData({
            leadName: leadData.leadName || "",
            companyName: leadData.companyName || "",
            phoneNumber: leadData.phoneNumber || "",
            email: leadData.email || "",
            source: leadData.source || "",
            industry: leadData.industry || "",
            requirement: leadData.requirement || "",
            status: leadData.status || "Warm",
            assignTo: leadData.assignTo?._id || "", // ✅ only store _id
            address: leadData.address || "",
            country: leadData.country || "",
            followUpDate: leadData.followUpDate
              ? new Date(leadData.followUpDate).toISOString().split("T")[0]
              : "",
            notes: leadData.notes || "",
            attachments: [], // ✅ reset uploads (can later extend to show existing files)
          });
        } catch {
          toast.error("Failed to fetch lead data");
        }
      };
      fetchLead();
    }
  }, [leadId]);

  // ✅ Fetch sales users (only for admin)
  useEffect(() => {
    const fetchSalesUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const userData = localStorage.getItem("user");
        const user = userData ? JSON.parse(userData) : null;

        if (user && user.role?.name === "Admin") {
          const response = await axios.get(`${API_URL}/users`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          const filteredSales = (response.data.users || []).filter(
            (user) => user.role?.name?.trim().toLowerCase() === "sales"
          );

          setSalesUsers(filteredSales);
        }
      } catch {
        toast.error("Failed to fetch sales users");
      }
    };
    fetchSalesUsers();
  }, []);

  // ✅ Handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (value.trim() !== "") setErrors({ ...errors, [name]: false });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, attachments: Array.from(e.target.files) });
  };

  const handleRemoveFile = (idx, type = "new") => {
    if (type === "new") {
      setFormData((prev) => ({
        ...prev,
        attachments: prev.attachments.filter((_, i) => i !== idx),
      }));
    } else {
      setExistingAttachments((prev) => prev.filter((_, i) => i !== idx));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {
      leadName: formData.leadName.trim() === "",
      companyName: formData.companyName.trim() === "",
      phoneNumber: formData.phoneNumber.trim() === "",
    };
    setErrors(newErrors);

    if (
      !newErrors.leadName &&
      !newErrors.companyName &&
      !newErrors.phoneNumber
    ) {
      try {
        const token = localStorage.getItem("token");
        const dataToSend = new FormData();

        for (let key in formData) {
          if (key === "attachments") {
            formData.attachments.forEach((file) =>
              dataToSend.append("attachments", file)
            );
          } else {
            dataToSend.append(key, formData[key]);
          }
        }

        // send existing files also
        dataToSend.append(
          "existingAttachments",
          JSON.stringify(existingAttachments)
        );

        const config = {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        };

        if (leadId) {
          await axios.put(
            `${API_URL}/leads/updateLead/${leadId}`,
            dataToSend,
            config
          );
          toast.success("✅ Lead updated successfully");
        } else {
          await axios.post(
            `${API_URL}/leads/create`,
            dataToSend,
            config
          );
          toast.success("🎉 Lead created successfully");
        }

        // wait a bit so toast shows before redirect
        setTimeout(() => navigate("/leads"), 2000);
      } catch (err) {
        console.error(err);
        toast.error(
          err.response?.data?.message ||
            (leadId ? "❌ Failed to update lead" : "❌ Failed to create lead")
        );
      }
    }
  };

  const handleBackClick = () => navigate(-1);

  // ✅ Field Groups
  const fieldGroups = [
    {
      title: "Basic Information",
      color: "text-blue-600",
      fields: [
        { name: "leadName", label: "Lead Name", icon: <User size={16} /> },
        {
          name: "companyName",
          label: "Company Name",
          icon: <Building2 size={16} />,
        },
        {
          name: "phoneNumber",
          label: "Phone Number",
          icon: <Phone size={16} />,
        },
        { name: "email", label: "Email", icon: <Mail size={16} /> },
        { name: "address", label: "Address", icon: <MapPin size={16} /> },
        {
          name: "country",
          label: "Country",
          icon: <Globe size={16} />,
          type: "select",
          options: countries,
        },
      ],
    },
    {
      title: "Business Details",
      color: "text-green-600",
      fields: [
        {
          name: "industry",
          label: "Industry",
          icon: <Briefcase size={16} />,
          type: "select",
          options: [
            "IT",
            "Finance",
            "Healthcare",
            "Education",
            "Manufacturing",
            "Retail",
            "Other",
          ],
        },
        {
          name: "source",
          label: "Source",
          icon: <Globe size={16} />,
          type: "select",
          options: [
            "Website",
            "Referral",
            "Social Media",
            "Email",
            "Phone",
            "Other",
          ],
        },
        {
          name: "requirement",
          label: "Requirement",
          icon: <FileText size={16} />,
        },
      ],
    },
    {
      title: "Lead Management",
      color: "text-yellow-600",
      fields: [
        {
          name: "status",
          label: "Status",
          icon: <UserCheck size={16} />,
          type: "select",
          options: ["Hot", "Warm", "Cold", "Junk"],
        },
        ...(userRole === "Admin"
          ? [
              {
                name: "assignTo",
                label: "Assign To",
                icon: <User size={16} />,
                type: "select",
                options: salesUsers.map((u) => ({
                  label: `${u.firstName} ${u.lastName}`,
                  value: u._id,
                })),
              },
            ]
          : []),
        {
          name: "followUpDate",
          label: "Follow-up Date",
          icon: <Calendar size={16} />,
          type: "date",
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
    <>
      <div className="min-h-screen flex items-start justify-center  py-10 px-4">
        <div className="w-full max-w-6xl bg-white rounded-2xl shadow-xl border border-gray-100">
          {/* ---- Header ---- */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between px-6 py-5 border-b rounded-t-2xl">
            <div className="flex items-center gap-3">
              {/* Back Button - Only Icon */}
              <button
                onClick={handleBackClick}
                className="p-2 rounded-lg bg-white text-gray-600 hover:bg-gray-100 hover:text-gray-800 transition"
              >
                <ArrowLeft size={20} />
              </button>

              {/* Title */}
              <h1 className="text-2xl font-bold text-gray-800">
                {leadId ? "Edit Lead" : "Create New Lead"}
              </h1>
            </div>
          </div>

          {/* ---- Form ---- */}
          <form onSubmit={handleSubmit} className="p-8 space-y-10">
            {fieldGroups.map((group) => (
              <div
                key={group.title}
                className="space-y-6 p-6  border border-gray-200 rounded-xl shadow-sm"
              >
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
                      {/* Label */}
                      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                        {field.icon} {field.label}
                        {(field.name === "leadName" ||
                          field.name === "companyName" ||
                          field.name === "phoneNumber") && (
                          <span className="text-red-500">*</span>
                        )}
                      </label>

                      {/* Phone Input */}
                      {field.name === "phoneNumber" ? (
                        <div className="relative w-full">
                          <PhoneInput
                            country={"in"}
                            value={formData.phoneNumber}
                            onChange={(phone) =>
                              setFormData({ ...formData, phoneNumber: phone })
                            }
                            specialLabel=""
                            inputStyle={{
                              width: "100%",
                              height: "42px",
                              fontSize: "14px",
                              paddingLeft: "55px",
                              borderRadius: "0.5rem",
                              border: "1px solid #d1d5db",
                              boxSizing: "border-box",
                            }}
                            buttonStyle={{
                              border: "1px solid #d1d5db",
                              borderRadius: "0.5rem 0 0 0.5rem",
                              height: "42px",
                              background: "white",
                            }}
                            containerStyle={{ width: "100%" }}
                            dropdownStyle={{ borderRadius: "0.5rem" }}
                          />
                        </div>
                      ) : field.type === "select" ? (
                        <select
                          name={field.name}
                          value={formData[field.name] || ""}
                          onChange={handleChange}
                          className="w-full border rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 outline-none transition h-11"
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
                        <div className="relative w-full">
                          <span className="absolute left-3 top-3 text-gray-400 pointer-events-none">
                            <FileText size={18} />
                          </span>
                          <textarea
                            name={field.name}
                            rows={5}
                            value={formData[field.name] || ""}
                            onChange={handleChange}
                            placeholder={`Enter ${field.label}...`}
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 bg-white shadow-sm text-sm text-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 placeholder-gray-400 transition resize-none"
                          />
                          <p className="text-xs text-gray-400 mt-1">
                            Max 500 characters
                          </p>
                        </div>
                      ) : (
                        <input
                          type={field.type || "text"}
                          name={field.name}
                          value={formData[field.name] || ""}
                          onChange={handleChange}
                          placeholder={`Enter ${field.label}`}
                          className="w-full border rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 outline-none transition h-11"
                          required={
                            field.name === "leadName" ||
                            field.name === "companyName" ||
                            field.name === "phoneNumber"
                          }
                        />
                      )}

                      {/* Error */}
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

            {/* ---- Attachments Section ---- */}
            <div className="p-6 border rounded-xl bg-gray-50 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">
                Attachments
              </h2>

              {/* Existing Files */}
              {existingAttachments.length > 0 && (
                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                  {existingAttachments.map((file, idx) => (
                    <div
                      key={idx}
                      className="flex flex-col items-center justify-center w-full bg-white border rounded-xl shadow-sm p-3"
                    >
                      <a
                        href={`http://localhost:5000/${file}`} // 🔑 adjust if backend gives full URL
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-indigo-600 hover:underline truncate w-full text-center"
                      >
                        {file.split("/").pop()}
                      </a>
                      <button
                        type="button"
                        onClick={() => handleRemoveFile(idx, "existing")}
                        className="text-[12px] text-red-600 hover:underline mt-1"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Upload New Files */}
              <div className="mt-4">
                <label
                  htmlFor="attachments"
                  className="flex flex-col items-center justify-center w-full min-h-32 border-2 border-dashed border-indigo-300 rounded-xl cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 transition p-6"
                >
                  {formData.attachments.length === 0 ? (
                    <>
                      <svg
                        className="w-8 h-8 text-gray-400 mb-2"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M7 16V8m0 0l-4 4m4-4l4 4M17 8v8m0 0l4-4m-4 4l-4-4"
                        />
                      </svg>
                      <span className="text-sm text-gray-600">
                        Click or drag new files here
                      </span>
                    </>
                  ) : (
                    <div className="w-full flex flex-wrap gap-4">
                      {formData.attachments.map((file, idx) => (
                        <div
                          key={idx}
                          className="flex flex-col items-center justify-center w-28 h-28 bg-white border rounded-xl shadow-sm"
                        >
                          <div className="w-12 h-12 flex items-center justify-center bg-indigo-100 rounded-md mb-1">
                            <span className="text-xs font-semibold text-indigo-600">
                              {file.name.split(".").pop().toUpperCase()}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500">
                            {(file.size / 1024).toFixed(1)} KB
                          </p>
                          <p className="text-[10px] text-gray-700 truncate w-full text-center">
                            {file.name}
                          </p>
                          <button
                            type="button"
                            onClick={() => handleRemoveFile(idx, "new")}
                            className="text-[12px] text-red-600 hover:underline mt-1"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <input
                    id="attachments"
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* ---- Buttons ---- */}
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
                className="px-6 py-2 rounded-lg bg-blue-600  text-white shadow-md transition"
              >
                {leadId ? "Update Lead" : "Save Lead"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
} //sales and admin deatils come correctly..
