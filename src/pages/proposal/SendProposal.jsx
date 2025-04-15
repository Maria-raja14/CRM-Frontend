import React, { useRef, useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Editor } from "@tinymce/tinymce-react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const SendProposal = () => {
  const editorRef = useRef(null);
  const location = useLocation();

  const proposalData = location.state?.proposal || null;

  const [title, setTitle] = useState("");
  const [dealTitle, setDealTitle] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Populate form when editing

  useEffect(() => {
    if (proposalData) {
      setTitle(proposalData.title);
      setDealTitle(proposalData.dealTitle);
      setEmail(proposalData.email);
      if (editorRef.current) {
        editorRef.current.setContent(proposalData.content || "");
      }
    }
  }, [proposalData]);
  

  // useEffect(() => {
  //   if (proposalData) {
  //     setTitle(proposalData.title || "");
  //     setDealTitle(proposalData.dealTitle || "");
  //     setEmail(proposalData.email || "");
  //     setTimeout(() => {
  //       if (editorRef.current) {
  //         editorRef.current.setContent(proposalData.content || "");
  //       }
  //     }, 500); // Ensure editor loads first
  //   }
  // }, [proposalData]);

  // Function to insert text at cursor position
  const insertText = (text) => {
    if (editorRef.current) {
      editorRef.current.execCommand("mceInsertContent", false, text);
    }
  };

  // 📌 Handle Submit (Create or Update)
  const handleSubmit = async () => {
    setLoading(true);
  
    const proposalPayload = {
      title,
      dealTitle,
      email,
      content: editorRef.current.getContent(),
    };
  
    try {
      if (proposalData?._id) {
        await axios.put(
          `http://localhost:5000/api/auth/proposal/proposal/updatepro/${proposalData._id}`,
          proposalPayload
        );
        toast.success(" Proposal updated successfully!");
      } else {
        await axios.post(
          "http://localhost:5000/api/auth/proposal/mailsend",
          proposalPayload
        );
        toast.success(" Proposal sent successfully!");
      }
    } catch (error) {
      console.error("Error submitting proposal:", error);
      toast.error("Failed to send or update proposal.");
    } finally {
      setLoading(false);
    }
  };
  
  // const handleSubmit = async () => {
  //   if (proposalData) {
  //     await axios.put(
  //       `http://localhost:5000/api/auth/proposal/proposal/updatepro/${proposalData._id}`,
  //       {
  //         title,
  //         dealTitle,
  //         email,
  //         content: editorRef.current.getContent(),
  //       }
  //     );
  //     setMessage("✅ Proposal updated successfully!");
  //   } else {
  //     await axios.post("http://localhost:5000/api/auth/proposal/mailsend", {
  //       title,
  //       dealTitle,
  //       email,
  //       content: editorRef.current.getContent(),
  //     });
  //     setMessage("✅ Proposal sent successfully!");
  //   }
    

  //   setLoading(true);
  //   setMessage("");

  //   const proposalPayload = {
  //     title,
  //     dealTitle,
  //     email,
  //     content: editorRef.current.getContent(),
  //   };

  //   try {
  //     if (proposalData?._id) {
  //       // ✏️ Update existing proposal
  //       await axios.put(
  //         `http://localhost:5000/api/auth/proposal/proposal/updatepro/${proposalData._id}`,
  //         proposalPayload
  //       );
  //       setMessage("✅ Proposal updated successfully!");
  //     } else {
  //       // 📩 Send new proposal
  //       await axios.post(
  //         "http://localhost:5000/api/auth/proposal/mailsend",
  //         proposalPayload
  //       );
  //       setMessage("✅ Proposal sent successfully!");
  //     }
  //   } catch (error) {
  //     console.error("Error submitting proposal:", error);
  //     setMessage("❌ Failed to send or update proposal.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return (
    <div className="p-6">
      {/* Header Section */}
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-semibold">
          {proposalData ? "Edit Proposal" : "Send Proposal"}
        </h1>
        <p className="text-xl">|</p>
        <Link to="/proposal">
          <p className="text-base text-blue-600 hover:underline">Back</p>
        </Link>
      </div>

      {/* Form Section */}
      <div className="bg-white p-8 mt-10 h-screen shadow-md rounded-lg">
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
          {/* <button className="bg-[#4466f2] text-white p-2 px-4 rounded-md hover:bg-blue-700">
            Choose Template
          </button> */}
        </div>

        {/* Deal Title */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-4">
          <label htmlFor="deal-title" className="font-medium">
            Deal Title
          </label>
          <input
            id="deal-title"
            className="w-full max-w-[700px] p-2 border border-gray-300 rounded-md focus:outline-blue-500"
            placeholder="Type your Deal Title"
            value={dealTitle}
            onChange={(e) => setDealTitle(e.target.value)}
          />
        </div>

        {/* Email */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-4">
          <label htmlFor="email" className="font-medium">
            Email
          </label>
          <input
            id="email"
            type="email"
            className="w-full max-w-[700px] p-2 border border-gray-300 rounded-md focus:outline-blue-500"
            placeholder="Enter recipient email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Text Editor */}
        <div className="mt-6">
          <Editor
            apiKey="a413g7ope5qfyodp0u0e5d042r8jwy9vf6b162kjnnmgj5us"
            onInit={(evt, editor) => (editorRef.current = editor)}
            initialValue=""
            init={{
              height: 500,
              menubar: true,
              plugins: "lists link image code media table",
              toolbar:
                "undo redo | formatselect | bold italic | alignleft aligncenter alignright | bullist numlist outdent indent | image media table code",
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

        {/* Submit Button */}
        <div className="mt-10 flex gap-3 items-center">
          <button
            className="bg-[#4466f2] text-white p-2 rounded-sm px-3"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading
              ? proposalData
                ? "Updating..."
                : "Sending..."
              : proposalData
              ? "Update Proposal"
              : "Send Proposal"}
          </button>
        </div>

        {/* Message */}
        {message && <p className="mt-4 text-center text-red-500">{message}</p>}
      </div>
    </div>
  );
};

export default SendProposal;
