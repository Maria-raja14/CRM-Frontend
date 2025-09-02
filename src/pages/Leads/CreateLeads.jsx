// import React, { useState, useEffect } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import { toast } from "react-toastify";
// import axios from "axios";
// import { getNames } from "country-list";
// import {
//   User,
//   Phone,
//   Mail,
//   MapPin,
//   FileText,
//   Globe,
//   Building2,
//   Briefcase,
//   UserCheck,
//   Calendar,
//   StickyNote,
//   ArrowLeft,
// } from "lucide-react";
// import "react-toastify/dist/ReactToastify.css";
// import PhoneInput from "react-phone-input-2";
// import "react-phone-input-2/lib/style.css";

// export default function CreateLeads() {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const queryParams = new URLSearchParams(location.search);
//   const leadId = queryParams.get("id");

//   const [formData, setFormData] = useState({
//     leadName: "",
//     phoneNumber: "",
//     email: "",
//     source: "",
//     companyName: "",
//     industry: "",
//     requirement: "",
//     status: "Warm",
//     assignTo: "",
//     address: "",
//     country: "",
//     followUpDate: "",
//     notes: "",
//     attachments: [],
//   });

//   const [errors, setErrors] = useState({});
//   const [salesUsers, setSalesUsers] = useState([]);
//   const [countries] = useState(getNames());

//   // Fetch lead if editing
//   useEffect(() => {
//     if (leadId) {
//       const fetchLead = async () => {
//         try {
//           const response = await axios.get(
//             `http://localhost:5000/api/leads/getLead/${leadId}`
//           );
//           const leadData = response.data;
//           if (leadData.followUpDate) {
//             leadData.followUpDate = new Date(leadData.followUpDate)
//               .toISOString()
//               .split("T")[0];
//           }
//           setFormData({ ...leadData, attachments: [] });
//         } catch {
//           toast.error("Failed to fetch lead data");
//         }
//       };
//       fetchLead();
//     }
//   }, [leadId]);

//   // Fetch sales users
//   useEffect(() => {
//     const fetchSalesUsers = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const response = await axios.get("http://localhost:5000/api/users", {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         const filteredSales = (response.data.users || []).filter(
//           (user) => user.role?.name?.trim().toLowerCase() === "sales"
//         );
//         setSalesUsers(filteredSales);
//       } catch {
//         toast.error("Failed to fetch sales users");
//       }
//     };
//     fetchSalesUsers();
//   }, []);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//     if (value.trim() !== "") setErrors({ ...errors, [name]: false });
//   };

//   const handleFileChange = (e) => {
//     setFormData({ ...formData, attachments: Array.from(e.target.files) });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const newErrors = {
//       leadName: formData.leadName.trim() === "",
//       companyName: formData.companyName.trim() === "",
//       phoneNumber: formData.phoneNumber.trim() === "",
//     };
//     setErrors(newErrors);

//     if (!newErrors.leadName && !newErrors.companyName && !newErrors.phoneNumber) {
//       try {
//         const dataToSend = new FormData();
//         for (let key in formData) {
//           if (key === "attachments") {
//             formData.attachments.forEach((file) =>
//               dataToSend.append("attachments", file)
//             );
//           } else {
//             dataToSend.append(key, formData[key]);
//           }
//         }

//         if (leadId) {
//           await axios.put(
//             `http://localhost:5000/api/leads/updateLead/${leadId}`,
//             dataToSend,
//             { headers: { "Content-Type": "multipart/form-data" } }
//           );
//           toast.success("✅ Lead updated successfully");
//         } else {
//           await axios.post(
//             "http://localhost:5000/api/leads/create",
//             dataToSend,
//             { headers: { "Content-Type": "multipart/form-data" } }
//           );
//           toast.success("🎉 Lead created successfully");
//         }
//         setTimeout(() => navigate("/leads"), 1500);
//       } catch (err) {
//         toast.error(leadId ? "Failed to update lead" : "Failed to create lead");
//       }
//     }
//   };

//   const handleBackClick = () => navigate(-1);

//   const fieldGroups = [
//     {
//       title: "Basic Information",
//       color: "text-blue-600",
//       fields: [
//         { name: "leadName", label: "Lead Name", icon: <User size={16} /> },
//         { name: "companyName", label: "Company Name", icon: <Building2 size={16} /> },
//         { name: "phoneNumber", label: "Phone Number", icon: <Phone size={16} /> },
//         { name: "email", label: "Email", icon: <Mail size={16} /> },
//         { name: "address", label: "Address", icon: <MapPin size={16} /> },
//         { name: "country", label: "Country", icon: <Globe size={16} />, type: "select", options: countries },
//       ],
//     },
//     {
//       title: "Business Details",
//       color: "text-green-600",
//       fields: [
//         { name: "industry", label: "Industry", icon: <Briefcase size={16} />, type: "select", options: ["IT","Finance","Healthcare","Education","Manufacturing","Retail","Other"] },
//         { name: "source", label: "Source", icon: <Globe size={16} />, type: "select", options: ["Website","Referral","Social Media","Email","Phone","Other"] },
//         { name: "requirement", label: "Requirement", icon: <FileText size={16} /> },
//       ],
//     },
//     {
//       title: "Lead Management",
//       color: "text-yellow-600",
//       fields: [
//         { name: "status", label: "Status", icon: <UserCheck size={16} />, type: "select", options: ["Hot","Warm","Cold","Junk"] },
//         { name: "assignTo", label: "Assign To", icon: <User size={16} />, type: "select", options: salesUsers.map((u) => ({ label: `${u.firstName} ${u.lastName}`, value: u._id })) },
//         { name: "followUpDate", label: "Follow-up Date", icon: <Calendar size={16} />, type: "date" },
//       ],
//     },
//     {
//       title: "Additional Information",
//       color: "text-purple-600",
//       fields: [
//         { name: "notes", label: "Notes", icon: <StickyNote size={16} />, type: "textarea" },
//       ],
//     },
//   ];

//   return (
//     <div className="min-h-screen flex items-start justify-center py-10">
//       <div className="w-full max-w-6xl bg-white rounded-2xl shadow-lg border border-gray-200">
//         {/* Header */}
//         <div className="flex flex-col md:flex-row items-start md:items-center justify-between px-6 py-5 border-b rounded-t-2xl">
//           <h1 className="text-2xl font-bold text-gray-800">{leadId ? "Edit Lead" : "Create New Lead"}</h1>
//           <button onClick={handleBackClick} className="mt-3 md:mt-0 flex items-center gap-2 px-4 py-2 rounded-lg border text-gray-600 hover:bg-gray-100 transition">
//             <ArrowLeft size={16} /> Back
//           </button>
//         </div>

//         {/* Form */}
//         <form onSubmit={handleSubmit} className="p-8 space-y-10">
//           {fieldGroups.map((group) => (
//             <div key={group.title} className="space-y-6 p-6 border rounded-xl">
//               <h2 className={`text-lg font-semibold border-b pb-2 ${group.color}`}>{group.title}</h2>
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                 {group.fields.map((field) => (
//                   <div key={field.name} className={`${field.type === "textarea" ? "md:col-span-3" : ""}`}>
//                     <label className="block text-sm font-medium text-gray-600 mb-2 flex items-center gap-2">
//                       {field.icon} {field.label}
//                       {(field.name === "leadName" || field.name === "companyName" || field.name === "phoneNumber") && (
//                         <span className="text-red-500">*</span>
//                       )}
//                     </label>

//                     {field.name === "phoneNumber" ? (
//                       <div className="relative w-full">
//                         <PhoneInput
//                           country={"in"}
//                           value={formData.phoneNumber}
//                           onChange={(phone) => setFormData({ ...formData, phoneNumber: phone })}
//                           specialLabel=""
//                           inputStyle={{ width: "100%", height: "40px", fontSize: "14px", paddingLeft: "55px", borderRadius: "0.5rem", border: "1px solid #d1d5db", boxSizing: "border-box" }}
//                           buttonStyle={{ border: "1px solid #d1d5db", borderRadius: "0.5rem 0 0 0.5rem", height: "40px", background: "white" }}
//                           containerStyle={{ width: "100%" }}
//                           dropdownStyle={{ borderRadius: "0.5rem" }}
//                         />
//                       </div>
//                     ) : field.type === "select" ? (
//                       <select name={field.name} value={formData[field.name]} onChange={handleChange} className="w-full border rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-400 outline-none transition h-10">
//                         <option value="">Select {field.label}</option>
//                         {field.options.map((opt) => typeof opt === "string" ? <option key={opt} value={opt}>{opt}</option> : <option key={opt.value} value={opt.value}>{opt.label}</option>)}
//                       </select>
//                     ) : field.type === "textarea" ? (
//                       <div className="relative w-full">
//                         <span className="absolute left-3 top-3 text-gray-400 pointer-events-none"><FileText size={18} /></span>
//                         <textarea
//                           name={field.name}
//                           rows={5}
//                           value={formData[field.name]}
//                           onChange={handleChange}
//                           placeholder={`Enter ${field.label}...`}
//                           className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 bg-white shadow-sm text-sm text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400 transition resize-none"
//                         />
//                         <p className="text-xs text-gray-400 mt-1">Max 500 characters</p>
//                       </div>
//                     ) : (
//                       <input
//                         type={field.type || "text"}
//                         name={field.name}
//                         value={formData[field.name]}
//                         onChange={handleChange}
//                         placeholder={`Enter ${field.label}`}
//                         className="w-full border rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-400 outline-none transition h-10"
//                         required={field.name === "leadName" || field.name === "companyName" || field.name === "phoneNumber"}
//                       />
//                     )}

//                     {errors[field.name] && <p className="text-sm text-red-500 mt-1">{field.label} is required</p>}
//                   </div>
//                 ))}
//               </div>
//             </div>
//           ))}

//           {/* Attachments Section (Independent) */}
//           <div className="p-6 border rounded-xl">
//             <h2 className="text-lg font-semibold border-b pb-2 text-gray-800">Attachments</h2>
//             <div className="mt-4">
//               <input
//                 type="file"
//                 multiple
//                 onChange={handleFileChange}
//                 className="w-full border rounded-lg px-3 py-2 text-sm bg-white"
//               />
//               {formData.attachments.length > 0 && (
//                 <ul className="mt-2 text-sm text-gray-700">
//                   {formData.attachments.map((file, idx) => (
//                     <li key={idx}>{file.name}</li>
//                   ))}
//                 </ul>
//               )}
//             </div>
//           </div>

//           {/* Buttons */}
//           <div className="flex justify-end gap-4 pt-6 border-t">
//             <button type="button" onClick={handleBackClick} className="px-6 py-2 rounded-lg border bg-white hover:bg-gray-100 text-gray-700 transition">Cancel</button>
//             <button type="submit" className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow-md transition">{leadId ? "Update Lead" : "Save Lead"}</button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }//original


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
    attachments: [],
  });

  const [errors, setErrors] = useState({});
  const [salesUsers, setSalesUsers] = useState([]);
  const [countries] = useState(getNames());

  // Get user role from localStorage
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData);
      setUserRole(user.role?.name || "");
    }
  }, []);

  // Fetch lead if editing
  useEffect(() => {
    if (leadId) {
      const fetchLead = async () => {
        try {
          const token = localStorage.getItem("token");
          const response = await axios.get(
            `http://localhost:5000/api/leads/getLead/${leadId}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          const leadData = response.data;
          if (leadData.followUpDate) {
            leadData.followUpDate = new Date(leadData.followUpDate)
              .toISOString()
              .split("T")[0];
          }
          setFormData({ ...leadData, attachments: [] });
        } catch {
          toast.error("Failed to fetch lead data");
        }
      };
      fetchLead();
    }
  }, [leadId]);

  // Fetch sales users (only for admin)
  useEffect(() => {
    const fetchSalesUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const userData = localStorage.getItem("user");
        const user = userData ? JSON.parse(userData) : null;
        
        // Only fetch sales users if user is admin
        if (user && user.role?.name === "Admin") {
          const response = await axios.get("http://localhost:5000/api/users", {
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (value.trim() !== "") setErrors({ ...errors, [name]: false });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, attachments: Array.from(e.target.files) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {
      leadName: formData.leadName.trim() === "",
      companyName: formData.companyName.trim() === "",
      phoneNumber: formData.phoneNumber.trim() === "",
    };
    setErrors(newErrors);

    if (!newErrors.leadName && !newErrors.companyName && !newErrors.phoneNumber) {
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

        const config = {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        };

        if (leadId) {
          await axios.put(
            `http://localhost:5000/api/leads/updateLead/${leadId}`,
            dataToSend,
            config
          );
          toast.success("Lead updated successfully");
        } else {
          await axios.post(
            "http://localhost:5000/api/leads/create",
            dataToSend,
            config
          );
          toast.success("🎉 Lead created successfully");
        }
        setTimeout(() => navigate("/leads"), 1500);
      } catch (err) {
        toast.error(leadId ? "Failed to update lead" : "Failed to create lead");
      }
    }
  };

  const handleBackClick = () => navigate(-1);

  const fieldGroups = [
    {
      title: "Basic Information",
      color: "text-blue-600",
      fields: [
        { name: "leadName", label: "Lead Name", icon: <User size={16} /> },
        { name: "companyName", label: "Company Name", icon: <Building2 size={16} /> },
        { name: "phoneNumber", label: "Phone Number", icon: <Phone size={16} /> },
        { name: "email", label: "Email", icon: <Mail size={16} /> },
        { name: "address", label: "Address", icon: <MapPin size={16} /> },
        { name: "country", label: "Country", icon: <Globe size={16} />, type: "select", options: countries },
      ],
    },
    {
      title: "Business Details",
      color: "text-green-600",
      fields: [
        { name: "industry", label: "Industry", icon: <Briefcase size={16} />, type: "select", options: ["IT","Finance","Healthcare","Education","Manufacturing","Retail","Other"] },
        { name: "source", label: "Source", icon: <Globe size={16} />, type: "select", options: ["Website","Referral","Social Media","Email","Phone","Other"] },
        { name: "requirement", label: "Requirement", icon: <FileText size={16} /> },
      ],
    },
    {
      title: "Lead Management",
      color: "text-yellow-600",
      fields: [
        { name: "status", label: "Status", icon: <UserCheck size={16} />, type: "select", options: ["Hot","Warm","Cold","Junk"] },
        // Only show assignTo field for admin users
        ...(userRole === "Admin" ? [
          { name: "assignTo", label: "Assign To", icon: <User size={16} />, type: "select", options: salesUsers.map((u) => ({ label: `${u.firstName} ${u.lastName}`, value: u._id })) }
        ] : []),
        { name: "followUpDate", label: "Follow-up Date", icon: <Calendar size={16} />, type: "date" },
      ],
    },
    {
      title: "Additional Information",
      color: "text-purple-600",
      fields: [
        { name: "notes", label: "Notes", icon: <StickyNote size={16} />, type: "textarea" },
      ],
    },
  ];

  return (
    <div className="min-h-screen flex items-start justify-center py-10">
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-lg border border-gray-200">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between px-6 py-5 border-b rounded-t-2xl">
          <h1 className="text-2xl font-bold text-gray-800">{leadId ? "Edit Lead" : "Create New Lead"}</h1>
          <button onClick={handleBackClick} className="mt-3 md:mt-0 flex items-center gap-2 px-4 py-2 rounded-lg border text-gray-600 hover:bg-gray-100 transition">
            <ArrowLeft size={16} /> Back
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-10">
          {fieldGroups.map((group) => (
            <div key={group.title} className="space-y-6 p-6 border rounded-xl">
              <h2 className={`text-lg font-semibold border-b pb-2 ${group.color}`}>{group.title}</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {group.fields.map((field) => (
                  <div key={field.name} className={`${field.type === "textarea" ? "md:col-span-3" : ""}`}>
                    <label className="block text-sm font-medium text-gray-600 mb-2 flex items-center gap-2">
                      {field.icon} {field.label}
                      {(field.name === "leadName" || field.name === "companyName" || field.name === "phoneNumber") && (
                        <span className="text-red-500">*</span>
                      )}
                    </label>

                    {field.name === "phoneNumber" ? (
                      <div className="relative w-full">
                        <PhoneInput
                          country={"in"}
                          value={formData.phoneNumber}
                          onChange={(phone) => setFormData({ ...formData, phoneNumber: phone })}
                          specialLabel=""
                          inputStyle={{ width: "100%", height: "40px", fontSize: "14px", paddingLeft: "55px", borderRadius: "0.5rem", border: "1px solid #d1d5db", boxSizing: "border-box" }}
                          buttonStyle={{ border: "1px solid #d1d5db", borderRadius: "0.5rem 0 0 0.5rem", height: "40px", background: "white" }}
                          containerStyle={{ width: "100%" }}
                          dropdownStyle={{ borderRadius: "0.5rem" }}
                        />
                      </div>
                    ) : field.type === "select" ? (
                      <select name={field.name} value={formData[field.name]} onChange={handleChange} className="w-full border rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-400 outline-none transition h-10">
                        <option value="">Select {field.label}</option>
                        {field.options.map((opt) => typeof opt === "string" ? <option key={opt} value={opt}>{opt}</option> : <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                      </select>
                    ) : field.type === "textarea" ? (
                      <div className="relative w-full">
                        <span className="absolute left-3 top-3 text-gray-400 pointer-events-none"><FileText size={18} /></span>
                        <textarea
                          name={field.name}
                          rows={5}
                          value={formData[field.name]}
                          onChange={handleChange}
                          placeholder={`Enter ${field.label}...`}
                          className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 bg-white shadow-sm text-sm text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400 transition resize-none"
                        />
                        <p className="text-xs text-gray-400 mt-1">Max 500 characters</p>
                      </div>
                    ) : (
                      <input
                        type={field.type || "text"}
                        name={field.name}
                        value={formData[field.name]}
                        onChange={handleChange}
                        placeholder={`Enter ${field.label}`}
                        className="w-full border rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-400 outline-none transition h-10"
                        required={field.name === "leadName" || field.name === "companyName" || field.name === "phoneNumber"}
                      />
                    )}

                    {errors[field.name] && <p className="text-sm text-red-500 mt-1">{field.label} is required</p>}
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Attachments Section (Independent) */}
          <div className="p-6 border rounded-xl">
            <h2 className="text-lg font-semibold border-b pb-2 text-gray-800">Attachments</h2>
            <div className="mt-4">
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                className="w-full border rounded-lg px-3 py-2 text-sm bg-white"
              />
              {formData.attachments.length > 0 && (
                <ul className="mt-2 text-sm text-gray-700">
                  {formData.attachments.map((file, idx) => (
                    <li key={idx}>{file.name}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4 pt-6 border-t">
            <button type="button" onClick={handleBackClick} className="px-6 py-2 rounded-lg border bg-white hover:bg-gray-100 text-gray-700 transition">Cancel</button>
            <button type="submit" className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow-md transition">{leadId ? "Update Lead" : "Save Lead"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}//sales and admin deatils come correctly..

