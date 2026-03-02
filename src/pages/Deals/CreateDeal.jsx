import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import { getNames } from "country-list";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  ArrowLeft,
  DollarSign,
  Briefcase,
  UserCheck,
  StickyNote,
  Phone,
  Mail,
  Building2,
  Globe,
  MapPin,
  FileText,
  BriefcaseBusiness,
  Calendar,
  Clock,
} from "lucide-react";
import "react-toastify/dist/ReactToastify.css";

// Import Lost Deal components
import useLostDealModal from "../LostDealModal/LossDeal";
import LostDealModal from "../LostDealModal/ModalLoss";

// Currency options with symbol and label
const currencyOptions = [
  { code: "USD", symbol: "$", label: "🇺🇸 USD" },
  { code: "EUR", symbol: "€", label: "🇪🇺 EUR" },
  { code: "INR", symbol: "₹", label: "🇮🇳 INR" },
  { code: "GBP", symbol: "£", label: "🇬🇧 GBP" },
  { code: "JPY", symbol: "¥", label: "🇯🇵 JPY" },
  { code: "AUD", symbol: "A$", label: "🇦🇺 AUD" },
  { code: "CAD", symbol: "C$", label: "🇨🇦 CAD" },
  { code: "CHF", symbol: "CHF", label: "🇨🇭 CHF" },
  { code: "MYR", symbol: "RM", label: "🇲🇾 MYR" },
  { code: "AED", symbol: "د.إ", label: "🇦🇪 AED" },
  { code: "SGD", symbol: "S$", label: "🇸🇬 SGD" },
  { code: "ZAR", symbol: "R", label: "🇿🇦 ZAR" },
  { code: "SAR", symbol: "﷼", label: "🇸🇦 SAR" },
];

export default function CreateDeal() {
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const location = useLocation();
  const isEditMode = location.state?.deal;
  const existingDeal = location.state?.deal || null;

  // Use Lost Deal Modal hook
  const {
    modalOpen: lostModalOpen,
    lossReason,
    lossNotes,
    validationError,
    LOSS_REASONS,
    setLossReason,
    setLossNotes,
    openModal: openLostDealModal,
    closeModal: closeLostDealModal,
    validateForm,
    resetModal,
    setIsLoading: setModalLoading,
    isLoading: isModalLoading,
  } = useLostDealModal();

  const [formData, setFormData] = useState({
    dealName: "",
    dealValue: "",
    currency: "INR",
    stage: "Qualification",
    assignTo: "",
    notes: "",
    phoneNumber: "",
    email: "",
    source: "",
    companyName: "",
    industry: "",
    requirement: "",
    address: "",
    country: "",
    attachments: [],
    lossReason: "",
    lossNotes: "",
    // NEW: Follow-up fields
    followUpDate: null,
    followUpComment: ""
  });

  const [errors, setErrors] = useState({});
  const [salesUsers, setSalesUsers] = useState([]);
  const [existingAttachments, setExistingAttachments] = useState([]);
  const [userRole, setUserRole] = useState("");
  const [userId, setUserId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [countries] = useState(getNames());
  const [pendingStageChange, setPendingStageChange] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData);
      setUserRole(user.role?.name || "");
      setUserId(user._id || "");
    }
  }, []);

  useEffect(() => {
    if (isEditMode && existingDeal) {
      let dealValue = "";
      let currency = "INR";
      if (existingDeal.value) {
        const valueParts = existingDeal.value.split(" ");
        if (valueParts.length >= 2) {
          dealValue = valueParts[0].replace(/,/g, "");
          currency = valueParts[1];
        } else {
          dealValue = existingDeal.value.replace(/,/g, "");
        }
      }
      
      // Parse follow-up date if exists
      let parsedFollowUpDate = null;
      if (existingDeal.followUpDate) {
        parsedFollowUpDate = new Date(existingDeal.followUpDate);
      }
      
      setFormData({
        dealName: existingDeal.dealName || "",
        dealValue: dealValue,
        currency: currency,
        stage: existingDeal.stage || "Qualification",
        assignTo: existingDeal.assignedTo?._id || "",
        notes: existingDeal.notes || "",
        phoneNumber: existingDeal.phoneNumber || "",
        email: existingDeal.email || "",
        source: existingDeal.source || "",
        companyName: existingDeal.companyName || "",
        industry: existingDeal.industry || "",
        requirement: existingDeal.requirement || "",
        address: existingDeal.address || "",
        country: existingDeal.country || "",
        attachments: [],
        lossReason: existingDeal.lossReason || "",
        lossNotes: existingDeal.lossNotes || "",
        // NEW: Follow-up fields
        followUpDate: parsedFollowUpDate,
        followUpComment: existingDeal.followUpComment || "",
      });

      if (existingDeal.attachments && existingDeal.attachments.length > 0) {
        setExistingAttachments(existingDeal.attachments);
      }
    }
  }, [isEditMode, existingDeal]);

  useEffect(() => {
    const fetchSalesUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${API_URL}/users/sales`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSalesUsers(response.data.users || []);
      } catch {
        // toast.error("Failed to fetch sales users");
      }
    };
    fetchSalesUsers();
  }, [API_URL]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    
    // Update form data
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error for this field
    if (value.trim() !== "") {
      setErrors((prev) => ({ ...prev, [name]: false }));
    }

    // Email validation on change
    if (name === "email" && value.trim() !== "") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        setEmailError("Please enter a valid email address");
      } else {
        setEmailError("");
      }
    }
  }, []);

  const handlePhoneChange = (value, country) => {
    if (!value) {
      setFormData((prev) => ({ ...prev, phoneNumber: "" }));
      return;
    }

    // remove country code digits length
    const nationalNumber = value.slice(country.dialCode.length);

    // 👉 allow only 10 digits for India
    if (country.countryCode === "in" && nationalNumber.length > 10) {
      return;
    }

    setFormData((prev) => ({
      ...prev,
      phoneNumber: "+" + value,
    }));
  };

  // const handlePhoneChange = useCallback((value, country) => {
  //   // Validate phone number length (excluding country code)
  //   const phoneWithoutCountryCode = value.replace(`+${country.dialCode}`, '');

  //   if (phoneWithoutCountryCode.length > 10) {
  //     setPhoneError("Phone number should not exceed 10 digits");
  //   } else if (!/^\d+$/.test(phoneWithoutCountryCode)) {
  //     setPhoneError("Only numbers are allowed");
  //   } else {
  //     setPhoneError("");
  //   }

  //   setFormData((prev) => ({ ...prev, phoneNumber: value }));
  //   if (value.trim() !== "") {
  //     setErrors((prev) => ({ ...prev, phoneNumber: false }));
  //   }
  // }, []);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const scrollToElement = (elementRef) => {
    if (elementRef.current) {
      elementRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      // Focus on the input field
      setTimeout(() => {
        const input =
          elementRef.current.querySelector("input") ||
          elementRef.current.querySelector("textarea") ||
          elementRef.current.querySelector("select");
        if (input) {
          input.focus();
        }
      }, 300);
    }
  };

  const handleFileChange = useCallback((e) => {
    const files = Array.from(e.target.files);
    const oversizedFiles = files.filter((file) => file.size > 5 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      toast.error("This files exceed the 5MB size limit");
      e.target.value = null;
      setFormData((prev) => ({
        ...prev,
        attachments: [
          ...prev.attachments,
          ...files.filter((file) => file.size <= 5 * 1024 * 1024),
        ],
      }));
      return;
    }
    setFormData((prev) => ({
      ...prev,
      attachments: [...prev.attachments, ...files],
    }));
  }, []);

  const handleRemoveFile = useCallback((idx, type = "new") => {
    if (type === "new") {
      setFormData((prev) => ({
        ...prev,
        attachments: prev.attachments.filter((_, i) => i !== idx),
      }));
    } else {
      setExistingAttachments((prev) => prev.filter((_, i) => i !== idx));
    }
  }, []);

  const handleFileDownload = async (filePath) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${API_URL}/files/download?filePath=${encodeURIComponent(filePath)}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: "blob",
        },
      );
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filePath.split("/").pop() || "download";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Failed to download file");
    }
  };

  // Extract submission logic to separate function
  const submitDealData = async (formDataToSubmit, isFromModal = false) => {
    setIsSubmitting(true);

    // Validate required fields
    const newErrors = {
      dealName: formData.dealName.trim() === "",
      dealValue: formData.dealValue.trim() === "",
      phoneNumber: formData.phoneNumber.trim() === "",
      email: formData.email.trim() === "",
      companyName: formData.companyName.trim() === "",
    };

    setErrors(newErrors);

    // Validate phone number if provided
    if (formData.phoneNumber.trim() !== "") {
      // Extract just the phone number without country code
      const phoneWithoutCountryCode = formData.phoneNumber.replace(/\D/g, "");
      // Remove country code (assume first 1-3 digits are country code)
      const localNumber = phoneWithoutCountryCode.substring(
        phoneWithoutCountryCode.length - 10,
      );

      if (localNumber.length > 10) {
        setPhoneError("Phone number should not exceed 10 digits");
        setIsSubmitting(false);
        return;
      }
      if (localNumber.length < 10) {
        setPhoneError("Phone number should be at least 10 digits");
        setIsSubmitting(false);
        return;
      }
    }

    // Validate email if provided
    if (formData.email.trim() !== "" && !validateEmail(formData.email)) {
      setEmailError("Please enter a valid email address");
      setIsSubmitting(false);
      return;
    }

    // Check if any required fields are empty and scroll to first error
    const errorFields = Object.entries(newErrors).filter(
      ([_, hasError]) => hasError,
    );

    if (errorFields.length > 0) {
      const [firstErrorField] = errorFields;

      // Scroll to the first error field
      switch (firstErrorField[0]) {
        case "dealName":
          scrollToElement(dealNameRef);
          break;
        case "dealValue":
          scrollToElement(dealValueRef);
          break;
        case "phoneNumber":
          scrollToElement(phoneNumberRef);
          break;
        case "email":
          scrollToElement(emailRef);
          break;
        case "companyName":
          scrollToElement(companyNameRef);
          break;
        default:
          window.scrollTo({ top: 0, behavior: "smooth" });
      }

      toast.error("Please fill in all required fields");
      setIsSubmitting(false);
      return;
    }
    
    try {
      const token = localStorage.getItem("token");
      const data = new FormData();
      
      // Append all form fields including loss data and follow-up data
      Object.keys(formDataToSubmit).forEach((key) => {
        if (key !== "attachments" && formDataToSubmit[key] !== undefined) {
          // Handle Date objects for follow-up
          if (key === "followUpDate" && formDataToSubmit[key] instanceof Date) {
            data.append(key, formDataToSubmit[key].toISOString());
          } else {
            data.append(key, formDataToSubmit[key]);
          }
        }
      });

      // For new deals created by sales users, auto-assign to themselves
      if (!isEditMode && userRole === "Sales" && !formDataToSubmit.assignTo) {
        data.set("assignTo", userId);
      }

      // Append new files
      formDataToSubmit.attachments.forEach((file) => {
        data.append("attachments", file);
      });

      // Append existing attachments as JSON string
      data.append("existingAttachments", JSON.stringify(existingAttachments));
      
      console.log("🔄 Submitting deal data:", {
        stage: formDataToSubmit.stage,
        lossReason: formDataToSubmit.lossReason,
        lossNotes: formDataToSubmit.lossNotes,
        followUpDate: formDataToSubmit.followUpDate,
        followUpComment: formDataToSubmit.followUpComment
      });
      
      let response;
      if (isEditMode && existingDeal) {
        // First update the deal
        response = await axios.patch(
          `${API_URL}/deals/update-deal/${existingDeal._id}`,
          data,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          },
        );
        
        console.log("✅ Deal update response:", response.data);
        
        // If this is a Closed Lost deal with loss reason, save to lost deals endpoint
        if (formDataToSubmit.stage === "Closed Lost" && formDataToSubmit.lossReason) {
          try {
            console.log("🔄 Saving lost deal reason for deal:", existingDeal._id);
            
            // IMPORTANT: Check if deal update already saved lossReason/lossNotes
            const updatedDeal = response.data.deal;
            if (updatedDeal && updatedDeal.lossReason) {
              console.log("✅ Loss reason already saved in deal update:", updatedDeal.lossReason);
            }
            
            // Also save to lost deals endpoint for analytics
            const lostDealResponse = await axios.post(
              `${API_URL}/deals/lost-reason`,
              {
                dealId: existingDeal._id,
                reason: formDataToSubmit.lossReason,
                notes: formDataToSubmit.lossNotes || "",
              },
              {
                headers: { 
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}` 
                },
              }
            );
            console.log("✅ Lost deal reason saved to analytics:", lostDealResponse.data);
          } catch (lostError) {
            console.error("❌ Failed to save lost deal reason:", lostError);
            // Don't show error to user - main deal update succeeded
          }
        }
        
        toast.success("Deal updated successfully");
      } else {
        // For new deals
        response = await axios.post(`${API_URL}/deals/createManual`, data, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });
        
        console.log("✅ New deal created:", response.data);
        
        // If this is a Closed Lost deal with loss reason, save to lost deals endpoint
        if (formDataToSubmit.stage === "Closed Lost" && formDataToSubmit.lossReason) {
          const newDealId = response.data.deal?._id;
          if (newDealId) {
            try {
              console.log("🔄 Saving lost deal reason for new deal:", newDealId);
              
              // Also save to lost deals endpoint for analytics
              await axios.post(
                `${API_URL}/deals/lost-reason`,
                {
                  dealId: newDealId,
                  reason: formDataToSubmit.lossReason,
                  notes: formDataToSubmit.lossNotes || "",
                },
                {
                  headers: { 
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}` 
                  },
                }
              );
              console.log("✅ Lost deal reason saved for new deal");
            } catch (lostError) {
              console.error("❌ Failed to save lost deal reason:", lostError);
              // Don't show error to user - main deal creation succeeded
            }
          }
        }
        
        toast.success("Deal created successfully");
      }
      
      setTimeout(() => navigate("/deals"), 2000);
    } catch (err) {
      console.error("❌ Deal operation error:", err);
      console.error("Error details:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      });
      
      if (err.response?.data?.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error(
          isEditMode ? "Failed to update deal" : "Failed to create deal",
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle modal confirmation
  const handleModalConfirm = async () => {
    // Validate modal form using hook's validateForm
    if (!validateForm()) {
      return;
    }

    setModalLoading(true);
    
    try {
      // Prepare updated form data with loss information
      const updatedFormData = {
        ...formData,
        stage: "Closed Lost", // Always set to Closed Lost when modal confirms
        lossReason: lossReason,
        lossNotes: lossNotes,
      };
      
      // Update form data state
      setFormData(updatedFormData);
      
      // Submit the data
      await submitDealData(updatedFormData);
      
      // Close modal
      closeLostDealModal();
      resetModal();
    } catch (error) {
      console.error("Error submitting deal with loss info:", error);
      toast.error("Failed to save deal");
    } finally {
      setModalLoading(false);
    }
  };

  // Handle stage change to trigger modal
  const handleStageChange = (e) => {
    const newStage = e.target.value;
    
    // If changing to Closed Lost and no loss reason exists
    if (newStage === "Closed Lost" && !formData.lossReason) {
      // Store the pending stage change
      setPendingStageChange(newStage);
      
      // Open modal with current deal data
      const dealData = {
        _id: existingDeal?._id || (isEditMode ? "new-deal" : null),
        dealName: formData.dealName || "Unnamed Deal",
      };
      
      openLostDealModal(dealData);
      
      // Don't update form yet - wait for modal confirmation
      return;
    }
    
    // For other stages or if loss reason exists, update normally
    handleChange(e);
  };

  // Main form submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if trying to submit as Closed Lost without loss reason
    if (formData.stage === "Closed Lost" && !formData.lossReason) {
      // Open modal
      const dealData = {
        _id: existingDeal?._id || (isEditMode ? "new-deal" : null),
        dealName: formData.dealName || "Unnamed Deal",
      };
      
      openLostDealModal(dealData);
      return;
    }
    
    // Regular submission for other stages
    await submitDealData(formData);
  };

  const handleBackClick = () => navigate(-1);

  // Check if assign to field should be shown
  const showAssignToField =
    userRole === "Admin" || (isEditMode && userRole === "Sales");

  // --- FIELD METADATA ---
  const formFields = [
    {
      name: "stage",
      label: "Stage",
      icon: <Briefcase size={16} />,
      type: "select",
      options: [
        "Qualification",
        "Proposal Sent-Negotiation",
        "Invoices Sent",
        "Closed Won",
        "Closed Lost",
      ],
    },
    {
      name: "companyName",
      label: "Company Name",
      icon: <Building2 size={16} />,
    },
    {
      name: "industry",
      label: "Industry",
      icon: <BriefcaseBusiness size={16} />,
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
      name: "country",
      label: "Country",
      icon: <Globe size={16} />,
      type: "select",
      options: countries,
    },
  ];

  return (
    <div className="min-h-screen flex items-start justify-center py-10 px-4">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      
      {/* Lost Deal Modal */}
      {lostModalOpen && (
        <LostDealModal
          isOpen={lostModalOpen}
          onClose={closeLostDealModal}
          lossReason={lossReason}
          lossNotes={lossNotes}
          validationError={validationError}
          LOSS_REASONS={LOSS_REASONS}
          onReasonChange={setLossReason}
          onNotesChange={setLossNotes}
          onConfirm={handleModalConfirm}  // Pass our custom handler
          title={isEditMode ? "Update Loss Reason" : "Add Loss Reason"}
          confirmText={isEditMode ? "Update Deal" : "Create Deal"}
          dealName={formData.dealName}
          isLoading={isModalLoading}
        />
      )}
      
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
              {isEditMode ? "Edit Deal" : "Create New Deal"}
            </h1>
          </div>
        </div>
        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-10">
          {/* Deal Info */}
          <div className="space-y-6 p-6 border border-gray-200 rounded-xl shadow-sm">
            <h2 className="text-lg font-semibold border-b pb-2 text-blue-600">
              Deal Information
            </h2>
            
            {/* Display Loss Information if deal is Closed Lost and has loss data */}
            {formData.stage === "Closed Lost" && formData.lossReason && (
              <div className="md:col-span-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                <h3 className="text-sm font-semibold text-red-700 mb-1">Loss Information</h3>
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Reason:</span> {formData.lossReason}
                </p>
                {formData.lossNotes && (
                  <p className="text-sm text-gray-700 mt-1">
                    <span className="font-medium">Notes:</span> {formData.lossNotes}
                  </p>
                )}
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Deal Name */}
              <div ref={dealNameRef}>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <FileText size={16} /> Deal Name{" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="dealName"
                  value={formData.dealName}
                  onChange={handleChange}
                  placeholder="Enter Deal Name"
                  className="w-full border rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-400 outline-none transition h-11"
                />
                {errors.dealName && (
                  <p className="text-red-500 text-sm mt-1">
                    Deal Name is required
                  </p>
                )}
              </div>
              {/* Deal Value & Currency Dropdown -- INTEGRATED DESIGN */}
              <div ref={dealValueRef}>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <DollarSign size={16} /> Deal Value{" "}
                  <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  {/* Currency Dropdown */}
                  <select
                    value={formData.currency}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        currency: e.target.value,
                      }))
                    }
                    className="w-28 border rounded-lg px-2 text-sm h-11 focus:ring-2 focus:ring-green-500 focus:outline-none"
                  >
                    {currencyOptions.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.symbol} {c.code}
                      </option>
                    ))}
                  </select>
                  {/* Number Input */}
                  <input
                    type="text"
                    name="dealValue"
                    value={formData.dealValue}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === "" || /^[0-9\b]+$/.test(val)) {
                        setFormData((prev) => ({
                          ...prev,
                          dealValue: val,
                        }));
                        if (val.trim() !== "") {
                          setErrors((prev) => ({ ...prev, dealValue: false }));
                        }
                      }
                    }}
                    placeholder="Enter deal value"
                    className="flex-1 border rounded-lg px-3 py-2 text-sm h-11 focus:ring-2 focus:ring-green-500 focus:outline-none"
                  />
                </div>
                {errors.dealValue && (
                  <p className="text-red-500 text-sm mt-1">
                    Deal Value is required
                  </p>
                )}
              </div>
              {/* Phone Number with Country Code */}
              <div ref={phoneNumberRef}>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Phone size={16} /> Phone Number{" "}
                  <span className="text-red-500">*</span>
                </label>
                <div className="border rounded-lg">
                  <PhoneInput
                    country="in"
                    value={formData.phoneNumber?.replace("+", "")}
                    onChange={handlePhoneChange}
                    enableSearch
                    disableSearchIcon
                    inputStyle={{
                      width: "100%",
                      height: "44px",
                      border: "none",
                      fontSize: "14px",
                    }}
                    buttonStyle={{
                      border: "none",
                      borderRight: "1px solid #d1d5db",
                    }}
                    containerStyle={{ width: "100%" }}
                    inputProps={{
                      name: "phoneNumber",
                      required: true,
                    }}
                  />
                </div>

                {phoneError && (
                  <p className="text-red-500 text-sm mt-1">{phoneError}</p>
                )}
                {errors.phoneNumber && !phoneError && (
                  <p className="text-red-500 text-sm mt-1">
                    Phone Number is required
                  </p>
                )}
              </div>
              {/* Email Field */}
              <div ref={emailRef}>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Mail size={16} /> Email{" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter email address"
                  className="w-full border rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-400 outline-none transition h-11"
                />
                {emailError && (
                  <p className="text-red-500 text-sm mt-1">{emailError}</p>
                )}
                {errors.email && !emailError && (
                  <p className="text-red-500 text-sm mt-1">Email is required</p>
                )}
              </div>
              {/* Other fields */}
              {formFields.map((field) => (
                <div
                  key={field.name}
                  ref={field.name === "companyName" ? companyNameRef : null}
                >
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    {field.icon} {field.label}{" "}
                    {field.name === "companyName" && (
                      <span className="text-red-500">*</span>
                    )}
                  </label>
                  {field.type === "select" ? (
                    <select
                      name={field.name}
                      value={formData[field.name] || ""}
                      onChange={field.name === "stage" ? handleStageChange : handleChange}
                      className="w-full border rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-400 outline-none transition h-11"
                    >
                      <option value="">Select {field.label}</option>
                      {field.options.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={field.type || "text"}
                      name={field.name}
                      value={formData[field.name] || ""}
                      onChange={handleChange}
                      placeholder={`Enter ${field.label}`}
                      className="w-full border rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-400 outline-none transition h-11"
                    />
                  )}
                  {errors[field.name] && (
                    <p className="text-red-500 text-sm mt-1">
                      {field.label} is required
                    </p>
                  )}
                </div>
              ))}
              {/* Address Field - Full Width */}
              <div className="md:col-span-3">
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <MapPin size={16} /> Address
                </label>
                <textarea
                  name="address"
                  rows={3}
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter full address..."
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white shadow-sm text-sm text-gray-700 placeholder-gray-400 transition resize-none"
                />
              </div>
            </div>
          </div>

          {/* NEW: Follow-up Section */}
          <div className="p-6 border border-gray-200 rounded-xl shadow-sm">
            <h2 className="text-lg font-semibold border-b pb-2 text-purple-600 flex items-center gap-2">
              <Clock size={18} /> Follow-up
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              {/* Follow-up Date with Time */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Calendar size={16} /> Follow-up Date & Time
                </label>
                <div className="relative">
                  <DatePicker
                    selected={formData.followUpDate}
                    onChange={(date) => {
                      setFormData(prev => ({ ...prev, followUpDate: date }));
                    }}
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={15}
                    timeCaption="Time"
                    dateFormat="MMMM d, yyyy h:mm aa"
                    placeholderText="Select date and time"
                    className="w-full border rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-purple-500 focus:border-purple-400 outline-none transition h-11 pl-10"
                    minDate={new Date()}
                    isClearable
                    calendarClassName="font-sans"
                  />
                  <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Optional: Set a reminder for follow-up
                </p>
              </div>
              
              {/* Follow-up Comment */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <StickyNote size={16} /> Follow-up Comment
                </label>
                <textarea
                  name="followUpComment"
                  rows={3}
                  value={formData.followUpComment}
                  onChange={handleChange}
                  placeholder="Enter follow-up notes..."
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white shadow-sm text-sm text-gray-700 placeholder-gray-400 transition resize-none"
                />
              </div>
            </div>
          </div>

          {/* Management & Notes */}
          {showAssignToField && (
            <div className="p-6 border border-gray-200 rounded-xl shadow-sm">
              <h2 className="text-lg font-semibold border-b pb-2 text-yellow-600">
                Management
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <UserCheck size={16} /> Assign To
                  </label>
                  <select
                    name="assignTo"
                    value={formData.assignTo}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-400 outline-none transition h-11"
                  >
                    <option value="">Select User</option>
                    {salesUsers.map((u) => (
                      <option key={u._id} value={u._id}>
                        {u.firstName} {u.lastName}
                      </option>
                    ))}
                  </select>
                  {userRole === "Sales" && isEditMode && (
                    <p className="text-xs text-gray-500 mt-1">
                      You can reassign this deal to another sales user
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {/* Notes Section */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <StickyNote size={16} /> Notes
            </label>
            <textarea
              name="notes"
              rows={4}
              value={formData.notes}
              onChange={handleChange}
              placeholder="Enter Notes..."
              className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white shadow-sm text-sm text-gray-700 placeholder-gray-400 transition resize-none"
            />
          </div>
          {/* Attachments Section - New Design */}
          <div className="p-6 border rounded-xl shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">
              Attachments
            </h2>

            {/* Existing Attachments */}
            {existingAttachments.length > 0 && (
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-700 mb-4">
                  Existing Files
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {existingAttachments.map((file, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-blue-100 rounded-md">
                          <svg
                            className="w-4 h-4 text-blue-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                        </div>
                        <div className="min-w-0">
                          <button
                            type="button"
                            onClick={() => handleFileDownload(file)}
                            className="text-sm font-medium text-gray-700 hover:text-blue-600 truncate block text-left w-full"
                          >
                            {file.split("/").pop()}
                          </button>
                          <p className="text-xs text-gray-500">Existing file</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveFile(idx, "existing")}
                        className="text-red-600 hover:text-red-800 p-1"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* New Attachments */}
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-700 mb-4">
                Upload New Files
              </h3>

              {/* Uploaded Files Preview */}
              {formData.attachments.length > 0 && (
                <div className="mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {formData.attachments.map((file, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-blue-100 rounded-md">
                            <span className="text-xs font-semibold text-blue-600">
                              {file.name.split(".").pop().toUpperCase()}
                            </span>
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-gray-700 truncate">
                              {file.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {(file.size / 1024).toFixed(1)} KB
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveFile(idx, "new")}
                          className="text-red-600 hover:text-red-800 p-1"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Upload Area */}
              <label
                htmlFor="attachments"
                className="flex flex-col items-center justify-center w-full min-h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition p-8"
              >
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center bg-blue-100 rounded-full">
                    <svg
                      className="w-6 h-6 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                  </div>
                  <p className="text-sm font-medium text-gray-700 mb-1">
                    Drop files here or click to upload
                  </p>
                  <p className="text-xs text-gray-500">
                    Maximum file size: 20MB{" "}
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    Supports: PDF, DOC, DOCX, XLS, XLSX, JPG, PNG, GIF
                  </p>
                </div>
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

          {/* Buttons */}
          <div className="flex justify-end gap-4 pt-6 border-t">
            <button
              type="button"
              onClick={handleBackClick}
              className="px-6 py-2 rounded-lg border bg-white hover:bg-gray-100 text-gray-700 transition"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow-md transition disabled:bg-blue-400 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? isEditMode
                  ? "Updating..."
                  : "Creating..."
                : isEditMode
                  ? "Update Deal"
                  : "Save Deal"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
