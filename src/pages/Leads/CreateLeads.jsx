import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
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
  Upload,
  X,
} from "lucide-react";
import "react-toastify/dist/ReactToastify.css";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

export default function CreateLeads() {
  const API_URL = import.meta.env.VITE_API_URL;

  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const leadId = queryParams.get("id"); // edit mode if exists

  const [userRole, setUserRole] = useState("");
  const [userId, setUserId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({}); // For specific error messages

  const [formData, setFormData] = useState({
    leadName: "",
    phoneNumber: "",
    email: "",
    source: "",
    companyName: "",
    industry: "",
    requirement: "",
    status: "Cold",
    assignTo: "",
    address: "",
    country: "",
    followUpDate: "",
    notes: "",
    attachments: [],
  });

  const [errors, setErrors] = useState({});
  const [salesUsers, setSalesUsers] = useState([]);
  const [countries] = useState(getNames());
  const [existingAttachments, setExistingAttachments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [phoneCountryCode, setPhoneCountryCode] = useState("in");

  // ✅ Load user role and ID
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData);
      setUserRole(user.role?.name || "");
      setUserId(user._id || "");
    }
  }, []);

  // ✅ Fetch lead if editing
  useEffect(() => {
    if (leadId) {
      const fetchLead = async () => {
        try {
          setIsLoading(true);
          const token = localStorage.getItem("token");
          const response = await axios.get(
            `${API_URL}/leads/getLead/${leadId}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            },
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
            status: leadData.status || "Cold",
            assignTo: leadData.assignTo?._id || "",
            address: leadData.address || "",
            country: leadData.country || "",
            followUpDate: leadData.followUpDate
              ? new Date(leadData.followUpDate).toISOString().split("T")[0]
              : "",
            notes: leadData.notes || "",
            attachments: [],
          });
        } catch (error) {
          console.error("Error fetching lead:", error);
          toast.error("Failed to fetch lead data");
        } finally {
          setIsLoading(false);
        }
      };
      fetchLead();
    }
  }, [leadId, API_URL]);

  // ✅ Fetch sales users ONLY for Admin (edit mode needs assignTo dropdown)
  useEffect(() => {
    const fetchSalesUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const userData = localStorage.getItem("user");
        const user = userData ? JSON.parse(userData) : null;

        if (user && user.role?.name === "Admin") {
          const response = await axios.get(`${API_URL}/users/sales`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          const salesData =
            response.data.salesUsers || response.data.users || response.data;
          setSalesUsers(Array.isArray(salesData) ? salesData : []);
        }
      } catch (error) {
        console.error("Error fetching sales users:", error);
      }
    };

    if (leadId) fetchSalesUsers(); // only edit needs it
  }, [API_URL, leadId]);

  const getSalesUsersOptions = () => {
    return salesUsers.map((u) => ({
      label: `${u.firstName} ${u.lastName}`,
      value: u._id,
    }));
  };

  // ✅ Validate email domain
  const validateEmailDomain = (email) => {
    if (!email) return false;

    // Basic email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return false;

    // Check if domain has valid structure
    const domain = email.split("@")[1];
    if (!domain) return false;

    // Domain should have at least one dot and valid characters
    const domainRegex =
      /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?\.[a-zA-Z]{2,}$/;
    return domainRegex.test(domain);
  };

  // ✅ Validate phone number for specific country
  const validatePhoneNumber = (phone) => {
    if (!phone) return false;

    const digits = String(phone).replace(/\D/g, "");

    // Accept all valid Indian formats
    if (digits.length === 10 && /^[6-9]\d{9}$/.test(digits)) return true; // 9876543210
    if (digits.length === 11 && digits.startsWith("0")) return true; // 09876543210
    if (digits.length === 12 && digits.startsWith("91")) return true; // 919876543210

    return false;
  };

  // ✅ Get phone number length requirement message
  const getPhoneNumberLengthMessage = (countryCode) => {
    const lengths = {
      in: "10 digits (starting with 6-9)",
      us: "10 digits",
      gb: "10 digits",
      ca: "10 digits",
      au: "9 digits",
      de: "11 digits",
      fr: "9 digits",
      jp: "9-10 digits",
      cn: "10-11 digits",
      br: "11 digits",
      ru: "10-11 digits",
    };

    return lengths[countryCode] || "8-15 digits";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));

    // Clear errors when user starts typing
    if (errors[name]) {
      setErrors((p) => ({ ...p, [name]: false }));
    }
    if (fieldErrors[name]) {
      setFieldErrors((p) => ({ ...p, [name]: "" }));
    }
  };

  const handlePhoneChange = (phone, countryData) => {
    setFormData((p) => ({ ...p, phoneNumber: phone }));
    setPhoneCountryCode(countryData.countryCode);

    if (errors.phoneNumber) {
      setErrors((p) => ({ ...p, phoneNumber: false }));
    }
    if (fieldErrors.phoneNumber) {
      setFieldErrors((p) => ({ ...p, phoneNumber: "" }));
    }
  };

  // Drag and drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    processFiles(files);
  };

  const processFiles = (files) => {
    // Check total files count
    const totalFiles =
      formData.attachments.length + files.length + existingAttachments.length;
    if (totalFiles > 5) {
      toast.error("Maximum 5 attachments allowed");
      return;
    }

    // Check file sizes
    const oversizedFiles = files.filter((file) => file.size > 20 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      toast.error("Some files exceed the 20MB size limit");
      return;
    }

    setFormData((p) => ({ ...p, attachments: [...p.attachments, ...files] }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    processFiles(files);
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

  const validateForm = () => {
    const newErrors = {};
    const newFieldErrors = {};

    // Required fields
    if (!formData.leadName.trim()) {
      newErrors.leadName = true;
      newFieldErrors.leadName = "Lead name is required";
    }

    if (!formData.companyName.trim()) {
      newErrors.companyName = true;
      newFieldErrors.companyName = "Company name is required";
    }

    if (!formData.phoneNumber) {
      newErrors.phoneNumber = true;
      newFieldErrors.phoneNumber = "Phone number is required";
    } else if (!validatePhoneNumber(formData.phoneNumber, phoneCountryCode)) {
      newErrors.phoneNumber = true;
      newFieldErrors.phoneNumber = `Please enter a valid ${formData.country ? formData.country : "phone"} number (${getPhoneNumberLengthMessage(phoneCountryCode)})`;
    }

    if (!formData.email.trim()) {
      newErrors.email = true;
      newFieldErrors.email = "Email is required";
    } else if (!validateEmailDomain(formData.email)) {
      newErrors.email = true;
      newFieldErrors.email =
        "Please enter a valid email address with a proper domain (e.g., name@company.com)";
    }

    setErrors(newErrors);
    setFieldErrors(newFieldErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear previous API errors
    setFieldErrors({});

    // Validate form
    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      const dataToSend = new FormData();

      for (let key in formData) {
        // ✅ CREATE MODE: do not send Lead Management fields (backend auto sets)
        if (
          !leadId &&
          (key === "status" || key === "assignTo" || key === "followUpDate")
        ) {
          continue;
        }

        if (key === "attachments") {
          formData.attachments.forEach((file) =>
            dataToSend.append("attachments", file),
          );
        } else {
          dataToSend.append(key, formData[key]);
        }
      }

      dataToSend.append(
        "existingAttachments",
        JSON.stringify(existingAttachments),
      );

      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
        onUploadProgress: (progressEvent) => {
          // Optional: Show upload progress
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total,
          );
          console.log(`Upload progress: ${progress}%`);
        },
      };

      if (leadId) {
        await axios.put(
          `${API_URL}/leads/updateLead/${leadId}`,
          dataToSend,
          config,
        );
        toast.success("Lead updated successfully");
      } else {
        await axios.post(`${API_URL}/leads/create`, dataToSend, config);
        toast.success("Lead created successfully");
      }

      setTimeout(() => navigate("/leads"), 1200);
    } catch (err) {
      console.error("Error submitting form:", err);

      // Handle specific error messages from backend
      if (err.response?.data?.message) {
        const errorMsg = err.response.data.message.toLowerCase();

        // Handle duplicate entries
        if (errorMsg.includes("email") && errorMsg.includes("already")) {
          setFieldErrors({
            email: "This email is already associated with another lead",
          });
          setErrors({ email: true });
          toast.error("Email already exists");
        } else if (errorMsg.includes("phone") && errorMsg.includes("already")) {
          setFieldErrors({
            phoneNumber:
              "This phone number is already associated with another lead",
          });
          setErrors({ phoneNumber: true });
          toast.error("Phone number already exists");
        } else if (errorMsg.includes("name") && errorMsg.includes("already")) {
          setFieldErrors({ leadName: "This lead name already exists" });
          setErrors({ leadName: true });
          toast.error("Lead name already exists");
        } else if (
          (errorMsg.includes("file") && errorMsg.includes("large")) ||
          errorMsg.includes("size")
        ) {
          toast.error("File size exceeds the 20MB limit");
        } else if (err.response.data.errors) {
          // Handle validation errors from backend
          const backendErrors = err.response.data.errors;
          const newFieldErrors = {};
          Object.keys(backendErrors).forEach((key) => {
            newFieldErrors[key] =
              backendErrors[key].message || backendErrors[key];
            setErrors((prev) => ({ ...prev, [key]: true }));
          });
          setFieldErrors(newFieldErrors);
          toast.error("Please check the form for errors");
        } else {
          toast.error(
            err.response.data.message ||
              (leadId ? "Failed to update lead" : "Failed to create lead"),
          );
        }
      } else if (err.message?.includes("Network Error")) {
        toast.error("Network error. Please check your connection.");
      } else {
        toast.error("An unexpected error occurred");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackClick = () => navigate(-1);

  // ✅ Show Lead Management ONLY on edit mode
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

    ...(leadId
      ? [
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
              {
                name: "assignTo",
                label: "Assign To",
                icon: <User size={16} />,
                type: "select",
                options: getSalesUsersOptions(),
              },
              {
                name: "followUpDate",
                label: "Follow-up Date",
                icon: <Calendar size={16} />,
                type: "date",
              },
            ],
          },
        ]
      : []),

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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen flex items-start justify-center py-10 px-4">
        <div className="w-full max-w-6xl bg-white rounded-2xl shadow-xl border border-gray-100">
          {/* Header */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between px-6 py-5 border-b rounded-t-2xl">
            <div className="flex items-center gap-3">
              <button
                onClick={handleBackClick}
                className="p-2 rounded-lg bg-white text-gray-600 hover:bg-gray-100 hover:text-gray-800 transition"
              >
                <ArrowLeft size={20} />
              </button>
              <h1 className="text-2xl font-bold text-gray-800">
                {leadId ? "Edit Lead" : "Create New Lead"}
              </h1>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8 space-y-10">
            {fieldGroups.map((group) => (
              <div
                key={group.title}
                className="space-y-6 p-6 border border-gray-200 rounded-xl shadow-sm"
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
                      className={`${field.type === "textarea" ? "md:col-span-3" : ""}`}
                    >
                      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                        {field.icon} {field.label}
                        {(field.name === "leadName" ||
                          field.name === "companyName" ||
                          field.name === "phoneNumber" ||
                          field.name === "email") && (
                          <span className="text-red-500">*</span>
                        )}
                      </label>

                      {field.name === "phoneNumber" ? (
                        <div>
                          <div
                            className={`border rounded-lg ${
                              errors.phoneNumber
                                ? "border-red-500"
                                : "border-gray-300"
                            }`}
                          >
                            <PhoneInput
                              country={"in"}
                              value={formData.phoneNumber}
                              onChange={handlePhoneChange}
                              specialLabel=""
                              inputStyle={{
                                width: "100%",
                                height: "42px",
                                fontSize: "14px",
                                paddingLeft: "55px",
                                borderRadius: "0.5rem",
                                boxSizing: "border-box",
                                border: "none",
                              }}
                              buttonStyle={{
                                borderRadius: "0.5rem 0 0 0.5rem",
                                height: "42px",
                                background: "white",
                                border: "none",
                                borderRight: "1px solid #e5e7eb",
                              }}
                              containerStyle={{ width: "100%" }}
                              dropdownStyle={{ borderRadius: "0.5rem" }}
                            />
                          </div>
                          {fieldErrors.phoneNumber && (
                            <p className="text-sm text-red-500 mt-1">
                              {fieldErrors.phoneNumber}
                            </p>
                          )}
                          {formData.country &&
                            formData.phoneNumber &&
                            !fieldErrors.phoneNumber && (
                              <p className="text-xs text-gray-500 mt-1">
                                Expected:{" "}
                                {getPhoneNumberLengthMessage(phoneCountryCode)}
                              </p>
                            )}
                        </div>
                      ) : field.type === "select" ? (
                        <div>
                          <select
                            name={field.name}
                            value={formData[field.name] || ""}
                            onChange={handleChange}
                            className={`w-full border rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 outline-none transition h-11 ${
                              errors[field.name]
                                ? "border-red-500"
                                : "border-gray-300"
                            }`}
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
                              ),
                            )}
                          </select>
                          {fieldErrors[field.name] && (
                            <p className="text-sm text-red-500 mt-1">
                              {fieldErrors[field.name]}
                            </p>
                          )}
                        </div>
                      ) : field.type === "textarea" ? (
                        <div>
                          <textarea
                            name={field.name}
                            rows={5}
                            value={formData[field.name] || ""}
                            onChange={handleChange}
                            placeholder={`Enter ${field.label}...`}
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white shadow-sm text-sm text-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 placeholder-gray-400 transition resize-none"
                            maxLength={500}
                          />
                          {fieldErrors[field.name] && (
                            <p className="text-sm text-red-500 mt-1">
                              {fieldErrors[field.name]}
                            </p>
                          )}
                        </div>
                      ) : (
                        <div>
                          <input
                            type={field.type || "text"}
                            name={field.name}
                            value={formData[field.name] || ""}
                            onChange={handleChange}
                            placeholder={`Enter ${field.label}`}
                            className={`w-full border rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 outline-none transition h-11 ${
                              errors[field.name]
                                ? "border-red-500"
                                : "border-gray-300"
                            }`}
                          />
                          {fieldErrors[field.name] && (
                            <p className="text-sm text-red-500 mt-1">
                              {fieldErrors[field.name]}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Attachments Section with Header */}
            <div className="space-y-6 p-6 border border-gray-200 rounded-xl shadow-sm">
              <h2 className="text-lg font-semibold border-b pb-2 text-indigo-600 flex items-center gap-2">
                <Upload size={20} /> Attachments
              </h2>

              <div className="space-y-4">
                <div
                  className={`flex flex-col items-center justify-center w-full min-h-32 border-2 border-dashed rounded-xl cursor-pointer transition p-6 ${
                    isDragging
                      ? "border-indigo-500 bg-indigo-50"
                      : "border-indigo-300 hover:border-indigo-500 hover:bg-indigo-50"
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => document.getElementById("attachments").click()}
                >
                  <div className="w-full flex flex-wrap gap-4">
                    {existingAttachments.map((file, idx) => (
                      <div
                        key={`existing-${idx}`}
                        className="flex flex-col items-center justify-center w-28 h-28 bg-white border rounded-xl shadow-sm p-2 relative group"
                      >
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveFile(idx, "existing");
                          }}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X size={12} />
                        </button>
                        <div className="w-12 h-12 flex items-center justify-center bg-indigo-100 rounded-md mb-1">
                          <span className="text-xs font-semibold text-indigo-600">
                            {file.name.split(".").pop().toUpperCase()}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 truncate w-full text-center">
                          {file.name}
                        </p>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveFile(idx, "existing");
                          }}
                          className="text-[12px] text-red-600 hover:underline mt-1"
                        >
                          Remove
                        </button>
                      </div>
                    ))}

                    {formData.attachments.map((file, idx) => (
                      <div
                        key={`new-${idx}`}
                        className="flex flex-col items-center justify-center w-28 h-28 bg-white border rounded-xl shadow-sm p-2 relative group"
                      >
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveFile(idx, "new");
                          }}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X size={12} />
                        </button>
                        <div className="w-12 h-12 flex items-center justify-center bg-indigo-100 rounded-md mb-1">
                          <span className="text-xs font-semibold text-indigo-600">
                            {file.name.split(".").pop().toUpperCase()}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                        <p className="text-[10px] text-gray-700 truncate w-full text-center">
                          {file.name}
                        </p>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveFile(idx, "new");
                          }}
                          className="text-[12px] text-red-600 hover:underline mt-1"
                        >
                          Remove
                        </button>
                      </div>
                    ))}

                    {existingAttachments.length === 0 &&
                      formData.attachments.length === 0 && (
                        <div className="flex flex-col items-center justify-center text-center">
                          <Upload size={48} className="text-indigo-300 mb-2" />
                          <p className="text-sm text-gray-600">
                            Drag & drop files here or click to browse
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Max 5 files, 20MB Limit
                          </p>
                        </div>
                      )}
                  </div>

                  <input
                    id="attachments"
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                    disabled={
                      formData.attachments.length +
                        existingAttachments.length >=
                      5
                    }
                  />
                </div>

                <div className="text-sm text-gray-600 flex flex-wrap gap-4 items-center">
                  <div>
                    <span
                      className={`font-medium ${
                        formData.attachments.length +
                          existingAttachments.length >=
                        5
                          ? "text-red-500"
                          : "text-gray-600"
                      }`}
                    >
                      Files:{" "}
                      {formData.attachments.length + existingAttachments.length}
                      /5
                    </span>
                  </div>
                  <div>
                    <span className="font-medium">Max size:</span> 20MB
                  </div>
                  <div>
                    <span className="font-medium">Supported types:</span> All
                    file types
                  </div>
                </div>
              </div>
            </div>

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
                disabled={isSubmitting}
                className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting
                  ? "Processing..."
                  : leadId
                    ? "Update Lead"
                    : "Save Lead"}
              </button>
            </div>
          </form>
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={3000} theme="light" />
    </>
  );
}
