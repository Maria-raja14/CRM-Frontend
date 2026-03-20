



import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SuperEditor from "./SuperEditor";

const SendProposal = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const location = useLocation();
  const navigate = useNavigate();

  const proposalData = location.state?.proposal || null;
  const isEditing    = location.state?.isEditing  || false;

  /* ── Form fields ── */
  const [title,          setTitle]          = useState("");
  const [dealTitle,      setDealTitle]      = useState("");
  const [emails,         setEmails]         = useState("");
  const [ccEmail,        setCcEmail]        = useState("");
  const [editorContent,  setEditorContent]  = useState("");
  const [deals,          setDeals]          = useState([]);
  const [selectedDealId, setSelectedDealId] = useState("");

  /* ── Attachments ── */
  // Existing server attachments shown in the Attachments section (edit mode)
  // Shape: [{ filename: string, url: string|null }]
  const [existingAttachments, setExistingAttachments] = useState([]);
  // Filenames the user removed — sent to backend so it can delete them
  const [removedAttachments,  setRemovedAttachments]  = useState([]);
  // New File[] from SuperEditor "Attach" button (non-images; images go inline)
  const [editorFiles,         setEditorFiles]         = useState([]);
  // New File[] from the external drop-zone below
  const [externalFiles,       setExternalFiles]       = useState([]);

  /* ── Loading ── */
  const [loading,     setLoading]     = useState(false);
  const [savingDraft, setSavingDraft] = useState(false);

  const editorPrefilled = useRef(false);

  /* ── Remove an existing (server-saved) attachment ── */
  const removeExistingAttachment = (filename) => {
    setExistingAttachments(prev => prev.filter(a => a.filename !== filename));
    setRemovedAttachments(prev => [...prev, filename]);
  };

  /* ── Remove an external drop-zone file ── */
  const removeExternalFile = (index) =>
    setExternalFiles(prev => prev.filter((_, i) => i !== index));

  /* ── Fetch deals ── */
  useEffect(() => {
    const fetchDeals = async () => {
      try {
        const token = localStorage.getItem("token");
        const res   = await axios.get(`${API_URL}/deals/getAll`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const arr = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data.deals)
          ? res.data.deals
          : [];
        setDeals(arr.map(d => ({ ...d, email: d.email || (d.leadId?.email ?? "") })));
      } catch (err) {
        console.error("Error fetching deals:", err);
        toast.error("Failed to fetch deals");
      }
    };
    fetchDeals();
  }, []);

  /* ── Pre-fill when editing ── */
  useEffect(() => {
    if (!proposalData || !isEditing || editorPrefilled.current) return;

    setTitle(proposalData.title  || "");
    setCcEmail(proposalData.cc   || "");
    setEmails(proposalData.email || "");
    setEditorContent(proposalData.content || "");

    // Build existing attachment list for the Attachments section below
    const existing = (proposalData.attachments || []).map(att => ({
      filename: att.filename || att.originalname || "attachment",
      url: att.path
        ? `${API_URL.replace("/api", "")}/${att.path.replace(/\\/g, "/")}`
        : null,
    }));
    setExistingAttachments(existing);

    // Deal selection
    const dealId =
      typeof proposalData.deal === "object" && proposalData.deal !== null
        ? proposalData.deal._id
        : proposalData.deal || "";

    if (dealId) {
      setSelectedDealId(dealId);
      if (deals.length > 0) {
        const matched = deals.find(d => d._id === dealId);
        setDealTitle(matched ? matched.dealName || "" : proposalData.dealTitle || "");
        editorPrefilled.current = true;
      }
    } else {
      setDealTitle(proposalData.dealTitle || "");
      editorPrefilled.current = true;
    }
  }, [proposalData, isEditing, deals]);

  /* ── Sync deal title / email when deal is selected ── */
  useEffect(() => {
    if (!selectedDealId || deals.length === 0) return;
    const sel = deals.find(d => d._id === selectedDealId);
    if (sel) {
      setDealTitle(sel.dealName || "");
      if (!isEditing || !editorPrefilled.current) setEmails(sel.email || "");
    }
  }, [selectedDealId, deals]);

  /* ── External file input ── */
  const handleExternalFileChange = (e) => {
    const picked = Array.from(e.target.files || []);
    setExternalFiles(prev => {
      const names = new Set(prev.map(f => f.name));
      return [...prev, ...picked.filter(f => !names.has(f.name))];
    });
    e.target.value = "";
  };

  /* ── Submit ── */
  const handleSubmit = async (status = "sent") => {
    if (!title.trim())
      { toast.error("Please enter a proposal title."); return; }
    if (!editorContent || editorContent === "<p></p>")
      { toast.error("Please add content to the proposal."); return; }
    if (status === "sent" && !emails.trim())
      { toast.error("Please enter at least one recipient email."); return; }

    status === "sent" ? setLoading(true) : setSavingDraft(true);

    const emailArray = emails.split(",").map(e => e.trim()).filter(Boolean);

    const formData = new FormData();
    formData.append("title",          title);
    formData.append("dealTitle",      dealTitle);
    formData.append("selectedDealId", selectedDealId);
    formData.append("cc",             ccEmail);
    formData.append("content",        editorContent);
    formData.append("emails",         emailArray.join(","));
    formData.append("status",         status);
    if (isEditing && proposalData?._id) formData.append("id", proposalData._id);

    // Tell backend which existing attachments were removed
    if (removedAttachments.length > 0) {
      formData.append("removedAttachments", JSON.stringify(removedAttachments));
    }

    // New files: from editor Attach button + external drop-zone
    [...editorFiles, ...externalFiles].forEach(file => formData.append("attachments", file));

    try {
      await axios.post(`${API_URL}/proposal/mailsend`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success(
        status === "sent"
          ? isEditing ? "Proposal updated and sent!" : "Proposal sent successfully!"
          : isEditing ? "Draft updated!"              : "Draft saved!"
      );
      setTimeout(() => navigate(status === "sent" ? "/proposal" : "/proposal/drafts"), 2000);
    } catch (err) {
      console.error(err);
      toast.error(status === "sent" ? "Failed to send proposal." : "Failed to save draft.");
    } finally {
      status === "sent" ? setLoading(false) : setSavingDraft(false);
    }
  };

  /* ── File icon helper ── */
  const fileIcon = (filename = "") => {
    const ext = filename.split(".").pop().toLowerCase();
    if (["jpg","jpeg","png","gif","webp","svg"].includes(ext)) return "🖼️";
    if (ext === "pdf") return "📄";
    if (["doc","docx"].includes(ext)) return "📝";
    if (["xls","xlsx","csv"].includes(ext)) return "📊";
    if (["ppt","pptx"].includes(ext)) return "📽️";
    if (["zip","rar","7z"].includes(ext)) return "🗜️";
    return "📎";
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

      <div className="bg-white p-8 mt-10 shadow-md rounded-lg">

        {/* Proposal Title */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-4">
          <label className="font-medium w-36 flex-shrink-0">Proposal Title</label>
          <input
            className="w-full max-w-[700px] p-2 border border-gray-300 rounded-md focus:outline-blue-500"
            placeholder="Type your Proposal Title"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
        </div>

        {/* Deal Selection */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-4">
          <label className="font-medium w-36 flex-shrink-0">Select Deal</label>
          <select
            className="w-full max-w-[700px] p-2 border border-gray-300 rounded-md focus:outline-blue-500"
            value={selectedDealId}
            onChange={e => setSelectedDealId(e.target.value)}
          >
            <option value="">-- Select a Deal --</option>
            {deals.map(deal => (
              <option key={deal._id} value={deal._id}>
                {deal.dealName || `Deal #${deal._id.substring(0, 8)}`}
              </option>
            ))}
          </select>
        </div>

        {/* Customer Emails */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-4">
          <label className="font-medium w-36 flex-shrink-0">Customer Emails</label>
          <input
            type="text"
            className="w-full max-w-[700px] p-2 border border-gray-300 rounded-md focus:outline-blue-500"
            placeholder="Enter multiple emails separated by commas"
            value={emails}
            onChange={e => setEmails(e.target.value)}
          />
        </div>

        {/* CC Email */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-4">
          <label className="font-medium w-36 flex-shrink-0">CC Email</label>
          <input
            type="email"
            className="w-full max-w-[700px] p-2 border border-gray-300 rounded-md focus:outline-blue-500"
            placeholder="Enter CC email (optional)"
            value={ccEmail}
            onChange={e => setCcEmail(e.target.value)}
          />
        </div>

        {/* Proposal Content — SuperEditor (no existingFiles prop) */}
        <div className="mt-6">
          <label className="block text-gray-700 font-medium mb-2">Proposal Content</label>
          <div className="border border-gray-300 rounded-lg shadow-sm bg-white w-full">
            <SuperEditor
              style={{ height: "500px", width: "100%" }}
              value={editorContent}
              setValue={setEditorContent}
              onFilesChange={setEditorFiles}
            />
          </div>
        </div>

        {/* ══════════════════════════════════════════════════
            ATTACHMENTS SECTION
            Shows: 1) existing saved files (edit mode)
                   2) drop-zone for new files
            ══════════════════════════════════════════════════ */}
        <div className="mt-6">
          <label className="block text-gray-700 font-medium mb-3">
            Attachments
            <span className="text-gray-400 font-normal text-sm ml-1">(optional)</span>
          </label>

          {/* ── Existing saved attachments (edit mode only) ── */}
          {existingAttachments.length > 0 && (
            <div className="mb-4">
              <p className="text-xs text-gray-500 font-medium mb-2 flex items-center gap-1">
                <span>📁</span> Previously saved attachments
              </p>
              <ul className="space-y-2">
                {existingAttachments.map((att) => (
                  <li
                    key={att.filename}
                    className="flex items-center justify-between bg-orange-50 border border-orange-200 p-2.5 rounded-lg"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-base flex-shrink-0">{fileIcon(att.filename)}</span>
                      {att.url ? (
                        <a
                          href={att.url}
                          target="_blank"
                          rel="noreferrer"
                          className="truncate text-sm text-orange-700 font-medium hover:underline"
                          title={att.filename}
                        >
                          {att.filename}
                        </a>
                      ) : (
                        <span className="truncate text-sm text-orange-700 font-medium">{att.filename}</span>
                      )}
                      {/* "saved" badge */}
                      <span className="flex-shrink-0 text-xs bg-orange-100 text-orange-600 border border-orange-300 rounded px-1.5 py-0.5 font-semibold">
                        saved
                      </span>
                    </div>
                    {/* Remove button */}
                    <button
                      type="button"
                      onClick={() => removeExistingAttachment(att.filename)}
                      className="flex-shrink-0 ml-3 w-7 h-7 rounded-full bg-red-100 hover:bg-red-500 text-red-500 hover:text-white flex items-center justify-center font-bold text-sm transition-colors"
                      title={`Remove ${att.filename}`}
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* ── Drop-zone for new files ── */}
          <div
            className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:border-blue-500 transition-colors bg-gray-50"
            onClick={() => document.getElementById("extFileInput").click()}
          >
            <svg className="w-12 h-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16v4h10v-4m-5-5v9m-5-5l5-5 5 5" />
            </svg>
            <p className="text-gray-500">
              <span className="text-blue-500 font-medium">Browse</span> or drag files here
            </p>
            <p className="text-xs text-gray-400 mt-1">Images, PDF, Word, Excel and more. Max 20 MB per file.</p>
            <input
              id="extFileInput" type="file" multiple className="hidden"
              accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,.zip"
              onChange={handleExternalFileChange}
            />
          </div>

          {/* ── New files from drop-zone ── */}
          {externalFiles.length > 0 && (
            <ul className="mt-3 space-y-2">
              {externalFiles.map((file, idx) => (
                <li key={idx}
                  className="flex items-center justify-between bg-white border border-gray-200 p-2.5 rounded-lg shadow-sm">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-base flex-shrink-0">{fileIcon(file.name)}</span>
                    <span className="truncate text-sm text-gray-700 font-medium">{file.name}</span>
                    <span className="text-xs text-gray-400 flex-shrink-0">
                      {file.size < 1048576
                        ? `${(file.size / 1024).toFixed(1)} KB`
                        : `${(file.size / 1048576).toFixed(1)} MB`}
                    </span>
                    {/* "new" badge */}
                    <span className="flex-shrink-0 text-xs bg-blue-50 text-blue-600 border border-blue-200 rounded px-1.5 py-0.5 font-semibold">
                      new
                    </span>
                  </div>
                  <button
                    type="button"
                    className="flex-shrink-0 ml-3 w-7 h-7 rounded-full bg-red-100 hover:bg-red-500 text-red-500 hover:text-white flex items-center justify-center font-bold text-sm transition-colors"
                    onClick={() => removeExternalFile(idx)}
                    title={`Remove ${file.name}`}
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-10 flex gap-3 items-center">
          <button
            className="bg-[#4466f2] text-white py-2 px-5 rounded-md hover:bg-blue-700 transition disabled:opacity-60"
            onClick={() => handleSubmit("sent")}
            disabled={loading || savingDraft}
          >
            {loading ? "Sending..." : isEditing ? "Update and Send" : "Send Proposal"}
          </button>
          <button
            className="bg-gray-500 text-white py-2 px-5 rounded-md hover:bg-gray-600 transition disabled:opacity-60"
            onClick={() => handleSubmit("draft")}
            disabled={loading || savingDraft}
          >
            {savingDraft ? "Saving..." : "Save as Draft"}
          </button>
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default SendProposal;