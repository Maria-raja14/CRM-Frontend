

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
  const [deals, setDeals] = useState([]);
  const [selectedDealId, setSelectedDealId] = useState("");
  const [isDealDropdownOpen, setIsDealDropdownOpen] = useState(false);
  const [isEmailDropdownOpen, setIsEmailDropdownOpen] = useState(false);
  const [filteredDeals, setFilteredDeals] = useState([]);
  const [filteredEmails, setFilteredEmails] = useState([]);
  const [editorContent, setEditorContent] = useState("");

  // Fetch all deals
  useEffect(() => {
    const fetchDeals = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/deals/getAll");
        if (response.data) {
          setDeals(response.data.deals || response.data);
        }
      } catch (error) {
        console.error("Error fetching deals:", error);
        toast.error("Failed to fetch deals");
      }
    };

    fetchDeals();
  }, []);

  // Populate form when editing
  useEffect(() => {
    if (proposalData && isEditing) {
      setTitle(proposalData.title || "");
      setDealTitle(proposalData.dealTitle || "");
      setEmail(proposalData.email || "");
      setEditorContent(proposalData.content || "");

      if (proposalData.dealTitle && deals.length > 0) {
        const matchingDeal = deals.find(
          (d) =>
            d.dealName === proposalData.dealTitle || d.email === proposalData.email
        );
        if (matchingDeal) {
          setSelectedDealId(matchingDeal._id);
        }
      }
    }
  }, [proposalData, deals, isEditing]);

  // Filter deals
  useEffect(() => {
    if (dealTitle) {
      const filtered = deals.filter(
        (d) =>
          d.dealName &&
          d.dealName.toLowerCase().includes(dealTitle.toLowerCase())
      );
      setFilteredDeals(filtered);
    } else {
      setFilteredDeals(deals);
    }
  }, [dealTitle, deals]);

  // Filter emails
  useEffect(() => {
    if (email) {
      const emailFiltered = deals.filter(
        (d) => d.email && d.email.toLowerCase().includes(email.toLowerCase())
      );
      setFilteredEmails(emailFiltered);
    } else {
      setFilteredEmails(deals);
    }
  }, [email, deals]);

  // Handle deal selection
  const handleDealSelect = (dealId) => {
    setSelectedDealId(dealId);
    const selectedDeal = deals.find((d) => d._id === dealId);
    if (selectedDeal) {
      setDealTitle(selectedDeal.dealName || "");
      setEmail(selectedDeal.leadId?.email || selectedDeal.email || "");
    }
  };

  const handleDealSelectFromDropdown = (deal) => {
    setDealTitle(deal.dealName || "");
    setEmail(deal.leadId?.email || deal.email || "");
    setSelectedDealId(deal._id);
    setIsDealDropdownOpen(false);
  };

  const handleEmailSelectFromDropdown = (deal) => {
    setEmail(deal.leadId?.email || deal.email || "");
    setDealTitle(deal.dealName || "");
    setSelectedDealId(deal._id);
    setIsEmailDropdownOpen(false);
  };

  const insertText = (text) => {
    if (editorRef.current) {
      editorRef.current.execCommand("mceInsertContent", false, text);
    }
  };

  const handleEditorChange = (content) => {
    setEditorContent(content);
  };

  // Save Draft
  const handleSaveDraft = async () => {
    setLoading(true);

    const proposalPayload = {
      title,
      dealTitle,
      email,
      content: editorRef.current
        ? editorRef.current.getContent()
        : editorContent,
      status: "draft",
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

  // Send Proposal
  const handleSubmit = async () => {
    setLoading(true);

    const proposalPayload = {
      title,
      dealTitle,
      email,
      content: editorRef.current
        ? editorRef.current.getContent()
        : editorContent,
    };

    try {
      if (isEditing && proposalData?._id) {
        // Update proposal first
        await axios.put(
          `http://localhost:5000/api/proposal/update/${proposalData._id}`,
          { ...proposalPayload, status: "sent" }
        );

        // Then send email
        await axios.post(
          "http://localhost:5000/api/proposal/mailsend",
          { ...proposalPayload, id: proposalData._id }
        );

        toast.success("Proposal updated and sent successfully!");
      } else {
        // Create new proposal and send email
        await axios.post(
          "http://localhost:5000/api/proposal/mailsend",
          proposalPayload
        );
        toast.success("Proposal sent successfully!");
      }

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
      {/* Header */}
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-semibold">
          {isEditing ? "Edit Proposal" : "Send Proposal"}
        </h1>
        <p className="text-xl">|</p>
        <Link to="/proposal">
          <p className="text-base text-blue-600 hover:underline">Back</p>
        </Link>
      </div>

      {/* Form */}
      <div className="bg-white p-8 mt-10 shadow-md rounded-lg">
        {/* Proposal Title */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-4">
          <label className="font-medium">Proposal Title</label>
          <input
            className="w-full max-w-[700px] p-2 border border-gray-300 rounded-md focus:outline-blue-500"
            placeholder="Type your Proposal Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {/* Deal Selection */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-4">
          <label className="font-medium">Select Deal</label>
          <select
            className="w-full max-w-[700px] p-2 border border-gray-300 rounded-md focus:outline-blue-500"
            value={selectedDealId}
            onChange={(e) => handleDealSelect(e.target.value)}
          >
            <option value="">-- Select a Deal --</option>
            {deals.map((deal) => (
              <option key={deal._id} value={deal._id}>
                {deal.dealName || `Deal #${deal._id.substring(0, 8)}`} 
              </option>
            ))}
          </select>
        </div>

        {/* Deal Name with dropdown */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-4 relative">
          <label className="font-medium">Deal Name</label>
          <div className="w-full max-w-[700px] relative">
            <input
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-blue-500"
              placeholder="Type or select a Deal Name"
              value={dealTitle}
              onChange={(e) => setDealTitle(e.target.value)}
              onFocus={() => setIsDealDropdownOpen(true)}
              onBlur={() => setTimeout(() => setIsDealDropdownOpen(false), 200)}
            />
            {isDealDropdownOpen && filteredDeals.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto">
                {filteredDeals.map((deal) => (
                  <div
                    key={deal._id}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleDealSelectFromDropdown(deal)}
                  >
                    {deal.dealName || "Untitled Deal"} 
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Email with dropdown */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-4 relative">
          <label className="font-medium">Email</label>
          <div className="w-full max-w-[700px] relative">
            <input
              type="email"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-blue-500"
              placeholder="Enter or select recipient email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setIsEmailDropdownOpen(true)}
              onBlur={() => setTimeout(() => setIsEmailDropdownOpen(false), 200)}
            />
            {isEmailDropdownOpen && filteredEmails.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto">
                {filteredEmails.map((deal) => (
                  <div
                    key={deal._id}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleEmailSelectFromDropdown(deal)}
                  >
                   {deal.leadId?.email || deal.email || "No Email"}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Editor */}
        <div className="mt-6">
          <Editor
            apiKey="a413g7ope5qfyodp0u0e5d042r8jwy9vf6b162kjnnmgj5us"
            onInit={(evt, editor) => {
              editorRef.current = editor;
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
            }}
          />
        </div>

        {/* Insert Vars */}
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

        {message && <p className="mt-4 text-center text-red-500">{message}</p>}
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default SendProposal;
