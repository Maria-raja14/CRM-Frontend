// import React, { useRef, useState, useEffect } from "react";
// import { Link, useLocation } from "react-router-dom";
// import { Editor } from "@tinymce/tinymce-react";
// import axios from "axios";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";


// const SendProposal = () => {
//   const editorRef = useRef(null);
//   const location = useLocation();

//   const proposalData = location.state?.proposal || null;

//   const [title, setTitle] = useState("");
//   const [dealTitle, setDealTitle] = useState("");
//   const [email, setEmail] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState("");

//   // Populate form when editing

//   useEffect(() => {
//     if (proposalData) {
//       setTitle(proposalData.title);
//       setDealTitle(proposalData.dealTitle);
//       setEmail(proposalData.email);
//       if (editorRef.current) {
//         editorRef.current.setContent(proposalData.content || "");
//       }
//     }
//   }, [proposalData]);
  

//   // useEffect(() => {
//   //   if (proposalData) {
//   //     setTitle(proposalData.title || "");
//   //     setDealTitle(proposalData.dealTitle || "");
//   //     setEmail(proposalData.email || "");
//   //     setTimeout(() => {
//   //       if (editorRef.current) {
//   //         editorRef.current.setContent(proposalData.content || "");
//   //       }
//   //     }, 500); // Ensure editor loads first
//   //   }
//   // }, [proposalData]);

//   // Function to insert text at cursor position
//   const insertText = (text) => {
//     if (editorRef.current) {
//       editorRef.current.execCommand("mceInsertContent", false, text);
//     }
//   };

//   // 📌 Handle Submit (Create or Update)
//   const handleSubmit = async () => {
//     setLoading(true);
  
//     const proposalPayload = {
//       title,
//       dealTitle,
//       email,
//       content: editorRef.current.getContent(),
//     };
  
//     try {
//       if (proposalData?._id) {
//         await axios.put(
//           `http://localhost:5000/api/auth/proposal/proposal/updatepro/${proposalData._id}`,
//           proposalPayload
//         );
//         toast.success(" Proposal updated successfully!");
//       } else {
//         await axios.post(
//           "http://localhost:5000/api/auth/proposal/mailsend",
//           proposalPayload
//         );
//         toast.success(" Proposal sent successfully!");
//       }
//     } catch (error) {
//       console.error("Error submitting proposal:", error);
//       toast.error("Failed to send or update proposal.");
//     } finally {
//       setLoading(false);
//     }
//   };
  
//   // const handleSubmit = async () => {
//   //   if (proposalData) {
//   //     await axios.put(
//   //       `http://localhost:5000/api/auth/proposal/proposal/updatepro/${proposalData._id}`,
//   //       {
//   //         title,
//   //         dealTitle,
//   //         email,
//   //         content: editorRef.current.getContent(),
//   //       }
//   //     );
//   //     setMessage("✅ Proposal updated successfully!");
//   //   } else {
//   //     await axios.post("http://localhost:5000/api/auth/proposal/mailsend", {
//   //       title,
//   //       dealTitle,
//   //       email,
//   //       content: editorRef.current.getContent(),
//   //     });
//   //     setMessage("✅ Proposal sent successfully!");
//   //   }
    

//   //   setLoading(true);
//   //   setMessage("");

//   //   const proposalPayload = {
//   //     title,
//   //     dealTitle,
//   //     email,
//   //     content: editorRef.current.getContent(),
//   //   };

//   //   try {
//   //     if (proposalData?._id) {
//   //       // ✏️ Update existing proposal
//   //       await axios.put(
//   //         `http://localhost:5000/api/auth/proposal/proposal/updatepro/${proposalData._id}`,
//   //         proposalPayload
//   //       );
//   //       setMessage("✅ Proposal updated successfully!");
//   //     } else {
//   //       // 📩 Send new proposal
//   //       await axios.post(
//   //         "http://localhost:5000/api/auth/proposal/mailsend",
//   //         proposalPayload
//   //       );
//   //       setMessage("✅ Proposal sent successfully!");
//   //     }
//   //   } catch (error) {
//   //     console.error("Error submitting proposal:", error);
//   //     setMessage("❌ Failed to send or update proposal.");
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };

//   return (
//     <div className="p-6">
//       {/* Header Section */}
//       <div className="flex items-center gap-2">
//         <h1 className="text-2xl font-semibold">
//           {proposalData ? "Edit Proposal" : "Send Proposal"}
//         </h1>
//         <p className="text-xl">|</p>
//         <Link to="/proposal">
//           <p className="text-base text-blue-600 hover:underline">Back</p>
//         </Link>
//       </div>

//       {/* Form Section */}
//       <div className="bg-white p-8 mt-10 h-screen shadow-md rounded-lg">
//         {/* Proposal Title */}
//         <div className="flex flex-col sm:flex-row items-center justify-between mb-4">
//           <label htmlFor="proposal-title" className="font-medium">
//             Proposal Title
//           </label>
//           <input
//             id="proposal-title"
//             className="w-full max-w-[700px] p-2 border border-gray-300 rounded-md focus:outline-blue-500"
//             placeholder="Type your Proposal Title"
//             value={title}
//             onChange={(e) => setTitle(e.target.value)}
//           />
//           {/* <button className="bg-[#4466f2] text-white p-2 px-4 rounded-md hover:bg-blue-700">
//             Choose Template
//           </button> */}
//         </div>

//         {/* Deal Title */}
//         <div className="flex flex-col sm:flex-row items-center justify-between mb-4">
//           <label htmlFor="deal-title" className="font-medium">
//             Deal Title
//           </label>
//           <input
//             id="deal-title"
//             className="w-full max-w-[700px] p-2 border border-gray-300 rounded-md focus:outline-blue-500"
//             placeholder="Type your Deal Title"
//             value={dealTitle}
//             onChange={(e) => setDealTitle(e.target.value)}
//           />
//         </div>

//         {/* Email */}
//         <div className="flex flex-col sm:flex-row items-center justify-between mb-4">
//           <label htmlFor="email" className="font-medium">
//             Email
//           </label>
//           <input
//             id="email"
//             type="email"
//             className="w-full max-w-[700px] p-2 border border-gray-300 rounded-md focus:outline-blue-500"
//             placeholder="Enter recipient email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//           />
//         </div>

//         {/* Text Editor */}
//         <div className="mt-6">
//           <Editor
//             apiKey="a413g7ope5qfyodp0u0e5d042r8jwy9vf6b162kjnnmgj5us"
//             onInit={(evt, editor) => (editorRef.current = editor)}
//             initialValue=""
//             init={{
//               height: 500,
//               menubar: true,
//               plugins: "lists link image code media table",
//               toolbar:
//                 "undo redo | formatselect | bold italic | alignleft aligncenter alignright | bullist numlist outdent indent | image media table code",
//             }}
//           />
//         </div>

//         {/* Buttons to Insert Text */}
//         <div className="flex gap-2 justify-center items-center mt-10">
//           <button
//             onClick={() => insertText("{{App_Name}}")}
//             className="bg-[#4466f2] text-white p-1 rounded-sm px-3"
//           >
//             App_Name
//           </button>
//           <button
//             onClick={() => insertText("{{App_Logo}}")}
//             className="bg-[#4466f2] text-white p-1 rounded-sm px-3"
//           >
//             App_Logo
//           </button>
//         </div>

//         {/* Submit Button */}
//         <div className="mt-10 flex gap-3 items-center">
//           <button
//             className="bg-[#4466f2] text-white p-2 rounded-sm px-3"
//             onClick={handleSubmit}
//             disabled={loading}
//           >
//             {loading
//               ? proposalData
//                 ? "Updating..."
//                 : "Sending..."
//               : proposalData
//               ? "Update Proposal"
//               : "Send Proposal"}
//           </button>
//         </div>

//         {/* Message */}
//         {message && <p className="mt-4 text-center text-red-500">{message}</p>}
//       </div>
//     </div>
//   );
// };

// export default SendProposal;//original





import React, { useRef, useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Editor } from "@tinymce/tinymce-react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SendProposal = () => {
  const editorRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  
  const proposalData = location.state?.proposal || null;
  const isEditing = location.state?.isEditing || false;

  const [title, setTitle] = useState("");
  const [dealTitle, setDealTitle] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [leads, setLeads] = useState([]);
  const [selectedLeadId, setSelectedLeadId] = useState("");
  const [isDealDropdownOpen, setIsDealDropdownOpen] = useState(false);
  const [isEmailDropdownOpen, setIsEmailDropdownOpen] = useState(false);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [filteredEmails, setFilteredEmails] = useState([]);
  const [editorContent, setEditorContent] = useState("");

  // Fetch all leads
  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/leads/getAllLead");
        if (response.data) {
          setLeads(response.data.leads || response.data);
        }
      } catch (error) {
        console.error("Error fetching leads:", error);
        toast.error("Failed to fetch leads");
      }
    };

    fetchLeads();
  }, []);

  // Populate form when editing
  useEffect(() => {
    if (proposalData && isEditing) {
      setTitle(proposalData.title || "");
      setDealTitle(proposalData.dealTitle || "");
      setEmail(proposalData.email || "");
      setEditorContent(proposalData.content || "");
      
      // Find the corresponding lead ID
      if (proposalData.dealTitle && leads.length > 0) {
        const matchingLead = leads.find(lead => 
          lead.leadName === proposalData.dealTitle || lead.email === proposalData.email
        );
        if (matchingLead) {
          setSelectedLeadId(matchingLead._id);
        }
      }
    }
  }, [proposalData, leads, isEditing]);

  // Filter leads based on input
  useEffect(() => {
    if (dealTitle) {
      const filtered = leads.filter(lead => 
        lead.leadName && lead.leadName.toLowerCase().includes(dealTitle.toLowerCase())
      );
      setFilteredLeads(filtered);
    } else {
      setFilteredLeads(leads);
    }
  }, [dealTitle, leads]);

  // Filter emails based on input
  useEffect(() => {
    if (email) {
      const emailFiltered = leads.filter(lead => 
        lead.email && lead.email.toLowerCase().includes(email.toLowerCase())
      );
      setFilteredEmails(emailFiltered);
    } else {
      setFilteredEmails(leads);
    }
  }, [email, leads]);

  // Handle lead selection from dropdown
  const handleLeadSelect = (leadId) => {
    setSelectedLeadId(leadId);
    const selectedLead = leads.find(lead => lead._id === leadId);
    if (selectedLead) {
      setDealTitle(selectedLead.leadName || "");
      setEmail(selectedLead.email || "");
    }
  };

  // Handle lead selection from input dropdown
  const handleLeadSelectFromDropdown = (lead) => {
    setDealTitle(lead.leadName || "");
    setEmail(lead.email || "");
    setSelectedLeadId(lead._id);
    setIsDealDropdownOpen(false);
  };

  // Handle email selection from dropdown
  const handleEmailSelectFromDropdown = (lead) => {
    setEmail(lead.email || "");
    setDealTitle(lead.leadName || "");
    setSelectedLeadId(lead._id);
    setIsEmailDropdownOpen(false);
  };

  // Function to insert text at cursor position
  const insertText = (text) => {
    if (editorRef.current) {
      editorRef.current.execCommand("mceInsertContent", false, text);
    }
  };

  // Handle editor content change
  const handleEditorChange = (content) => {
    setEditorContent(content);
  };

  // Handle Save as Draft
  const handleSaveDraft = async () => {
    setLoading(true);
  
    const proposalPayload = {
      title,
      dealTitle,
      email,
      content: editorRef.current ? editorRef.current.getContent() : editorContent,
      status: "draft"
    };
  
    try {
      if (isEditing && proposalData?._id) {
        await axios.put(
          `http://localhost:5000/api/proposal/update/${proposalData._id}`,
          proposalPayload
        );
        toast.success("Draft updated successfully!");
      } else {
        await axios.post(
          "http://localhost:5000/api/proposal/create",
          proposalPayload
        );
        toast.success("Draft saved successfully!");
      }
      
      // Wait for toast to show before navigating
      setTimeout(() => {
        navigate("/proposal");
      }, 2000);
    } catch (error) {
      console.error("Error saving draft:", error);
      toast.error("Failed to save draft.");
    } finally {
      setLoading(false);
    }
  };

  // Handle Submit (Send Email)
  const handleSubmit = async () => {
    setLoading(true);
  
    const proposalPayload = {
      title,
      dealTitle,
      email,
      content: editorRef.current ? editorRef.current.getContent() : editorContent,
    };
  
    try {
      if (isEditing && proposalData?._id) {
        // Update and send existing proposal
        await axios.put(
          `http://localhost:5000/api/proposal/update/${proposalData._id}`,
          {...proposalPayload, status: "sent"}
        );
        
        // Send email
        await axios.post(
          "http://localhost:5000/api/proposal/mailsend",
          {...proposalPayload, id: proposalData._id}
        );
        
        toast.success("Proposal updated and sent successfully!");
      } else {
        // Create and send new proposal
        const response = await axios.post(
          "http://localhost:5000/api/proposal/mailsend",
          proposalPayload
        );
        toast.success("Proposal sent successfully!");
      }
      
      // Wait for toast to show before navigating
      setTimeout(() => {
        navigate("/proposal");
      }, 2000);
    } catch (error) {
      console.error("Error submitting proposal:", error);
      toast.error("Failed to send proposal.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      {/* Header Section */}
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-semibold">
          {isEditing ? "Edit Proposal" : "Send Proposal"}
        </h1>
        <p className="text-xl">|</p>
        <Link to="/proposal">
          <p className="text-base text-blue-600 hover:underline">Back</p>
        </Link>
      </div>

      {/* Form Section */}
      <div className="bg-white p-8 mt-10 shadow-md rounded-lg">
        {/* Proposal Title */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-4">
          <label htmlFor="proposal-title" className="font-medium">
            Proposal Title
          </label>
          <input
            id="proposal-title"
            className="w-full max-w-[700px] p-2 border border-gray-300 rounded-md focus:outline-blue-500"
            placeholder="Type your Proposal Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {/* Lead Selection */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-4">
          <label htmlFor="lead-select" className="font-medium">
            Select Lead
          </label>
          <select
            id="lead-select"
            className="w-full max-w-[700px] p-2 border border-gray-300 rounded-md focus:outline-blue-500"
            value={selectedLeadId}
            onChange={(e) => handleLeadSelect(e.target.value)}
          >
            <option value="">-- Select a Lead --</option>
            {leads.map((lead) => (
              <option key={lead._id} value={lead._id}>
                {lead.leadName || `Lead #${lead._id.substring(0, 8)}`}
              </option>
            ))}
          </select>
        </div>

        {/* Deal Title with Dropdown */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-4 relative">
          <label htmlFor="deal-title" className="font-medium">
            Lead Name
          </label>
          <div className="w-full max-w-[700px] relative">
            <input
              id="deal-title"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-blue-500"
              placeholder="Type or select a Lead Name"
              value={dealTitle}
              onChange={(e) => setDealTitle(e.target.value)}
              onFocus={() => setIsDealDropdownOpen(true)}
              onBlur={() => setTimeout(() => setIsDealDropdownOpen(false), 200)}
            />
            {isDealDropdownOpen && filteredLeads.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                {filteredLeads.map((lead) => (
                  <div
                    key={lead._id}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleLeadSelectFromDropdown(lead)}
                  >
                    {lead.leadName || "Untitled Lead"}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Email with Dropdown */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-4 relative">
          <label htmlFor="email" className="font-medium">
            Email
          </label>
          <div className="w-full max-w-[700px] relative">
            <input
              id="email"
              type="email"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-blue-500"
              placeholder="Enter or select recipient email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setIsEmailDropdownOpen(true)}
              onBlur={() => setTimeout(() => setIsEmailDropdownOpen(false), 200)}
            />
            {isEmailDropdownOpen && filteredEmails.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                {filteredEmails.map((lead) => (
                  <div
                    key={lead._id}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleEmailSelectFromDropdown(lead)}
                  >
                    {lead.email || "No email"}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Text Editor */}
        <div className="mt-6">
          <Editor
            apiKey="a413g7ope5qfyodp0u0e5d042r8jwy9vf6b162kjnnmgj5us"
            onInit={(evt, editor) => {
              editorRef.current = editor;
              // Set initial content when editing
              if (proposalData?.content) {
                editor.setContent(proposalData.content);
              }
            }}
            initialValue={editorContent}
            onEditorChange={handleEditorChange}
            init={{
              height: 500,
              menubar: true,
              plugins: "lists link image code media table",
              toolbar:
                "undo redo | formatselect | bold italic | alignleft aligncenter alignright | bullist numlist outdent indent | image media table code",
              images_upload_handler: function (blobInfo, success, failure) {
                const formData = new FormData();
                formData.append("image", blobInfo.blob(), blobInfo.filename());
                
                axios.post("http://localhost:5000/api/proposal/upload-image", formData, {
                  headers: {
                    "Content-Type": "multipart/form-data",
                  },
                })
                .then(response => {
                  success(response.data.imageUrl);
                })
                .catch(error => {
                  failure("Image upload failed");
                  console.error("Image upload error:", error);
                });
              },
            }}
          />
        </div>

        {/* Buttons to Insert Text */}
        <div className="flex gap-2 justify-center items-center mt-10">
          <button
            onClick={() => insertText("{{App_Name}}")}
            className="bg-[#4466f2] text-white p-1 rounded-sm px-3"
          >
            App_Name
          </button>
          <button
            onClick={() => insertText("{{App_Logo}}")}
            className="bg-[#4466f2] text-white p-1 rounded-sm px-3"
          >
            App_Logo
          </button>
        </div>

        {/* Action Buttons */}
        <div className="mt-10 flex gap-3 items-center">
          <button
            className="bg-gray-500 text-white p-2 rounded-sm px-3"
            onClick={handleSaveDraft}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save as Draft"}
          </button>
          <button
            className="bg-[#4466f2] text-white p-2 rounded-sm px-3"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading
              ? "Sending..."
              : isEditing
              ? "Update and Send"
              : "Send Proposal"}
          </button>
        </div>

        {/* Message */}
        {message && <p className="mt-4 text-center text-red-500">{message}</p>}
      </div>
      
      {/* Toast Container should be placed at the root level outside of any conditional rendering */}
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false} // This prevents toasts from closing when the window loses focus
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default SendProposal;