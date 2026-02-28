
import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  ArrowLeft, Calendar, FileText, Mail, Paperclip, Tag, Clock,
  User, Building, DollarSign, CheckCircle, XCircle, AlertCircle,
  Download, Eye, ChevronRight, Phone, MapPin, Globe, Briefcase,
  BookOpen, X, FileImage, File as FileIcon,
} from "lucide-react";

// ─────────────────────────────────────────────
// File helper utilities
// ─────────────────────────────────────────────
const getFileExtension = (filename = "") =>
  filename.split(".").pop()?.toLowerCase() || "";

const getFileCategory = (name = "", mimeType = "") => {
  const ext  = getFileExtension(name);
  const mime = mimeType.toLowerCase();
  if (mime.startsWith("image/") || ["jpg","jpeg","png","gif","webp"].includes(ext)) return "image";
  if (mime === "application/pdf" || ext === "pdf")  return "pdf";
  if (mime === "text/plain" || mime === "text/csv" || ["txt","csv"].includes(ext)) return "text";
  return "other";
};

const canPreview = (name, mimeType) =>
  ["image","pdf","text"].includes(getFileCategory(name, mimeType));

const formatFileSize = (bytes) => {
  if (!bytes) return "";
  if (bytes < 1024)       return `${bytes} B`;
  if (bytes < 1024*1024)  return `${(bytes/1024).toFixed(1)} KB`;
  return `${(bytes/(1024*1024)).toFixed(1)} MB`;
};

const FILE_STYLES = {
  image: { bg: "bg-green-100",  icon: "text-green-600"  },
  pdf:   { bg: "bg-red-100",    icon: "text-red-600"    },
  text:  { bg: "bg-yellow-100", icon: "text-yellow-600" },
  other: { bg: "bg-blue-100",   icon: "text-blue-600"   },
};

// ─────────────────────────────────────────────
// TextPreview — loads and shows text file content
// ─────────────────────────────────────────────
const TextPreview = ({ url }) => {
  const [content, setContent] = useState("Loading…");
  useEffect(() => {
    fetch(url)
      .then((r) => r.text())
      .then(setContent)
      .catch(() => setContent("Could not load file contents."));
  }, [url]);
  return (
    <pre className="whitespace-pre-wrap text-sm text-slate-700 bg-white p-4 rounded-lg border border-slate-200 max-h-[60vh] overflow-auto font-mono leading-relaxed">
      {content}
    </pre>
  );
};

// ─────────────────────────────────────────────
// PreviewModal — shows image / PDF / text inline
// ─────────────────────────────────────────────
const PreviewModal = ({ file, onClose }) => {
  // Close on Escape key
  useEffect(() => {
    const handler = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl flex flex-col overflow-hidden"
        style={{ maxHeight: "92vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 flex-shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <FileText size={20} className="text-slate-500 flex-shrink-0" />
            <span className="font-medium text-slate-900 truncate text-sm">
              {file.name}
            </span>
            {file.size > 0 && (
              <span className="text-xs text-slate-400 flex-shrink-0">
                {formatFileSize(file.size)}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="ml-4 p-2 rounded-lg hover:bg-slate-100 transition-colors flex-shrink-0"
            title="Close (Esc)"
          >
            <X size={20} className="text-slate-600" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-auto bg-slate-50 p-3">
          {file.category === "image" && (
            <div className="flex items-center justify-center min-h-64 p-4">
              <img
                src={file.url}
                alt={file.name}
                className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-md"
              />
            </div>
          )}
          {file.category === "pdf" && (
            <iframe
              src={file.url}
              title={file.name}
              className="w-full rounded-lg border-0"
              style={{ height: "75vh" }}
            />
          )}
          {file.category === "text" && (
            <div className="p-2">
              <TextPreview url={file.url} />
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex justify-end px-5 py-3 border-t border-slate-100 flex-shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────
function Pipeline_modal_view() {
  const API_URL = import.meta.env.VITE_API_URL;
  const { dealId } = useParams();
  const navigate   = useNavigate();

  const [deal, setDeal]           = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("details");

  // Preview state
  const [previewFile, setPreviewFile]       = useState(null);
  const [previewLoading, setPreviewLoading] = useState(null); // index of loading file

  useEffect(() => {
    if (dealId) fetchDealDetails();
  }, [dealId]);

  const fetchDealDetails = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      const res   = await axios.get(`${API_URL}/deals/getAll/${dealId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDeal(res.data);
    } catch (err) {
      console.error("Failed to fetch deal details:", err);
      toast.error("Failed to load deal details");
    } finally {
      setIsLoading(false);
    }
  };

  // ── Download handler ────────────────────────────────────────
  // ✅ FIXED: uses URLSearchParams instead of encodeURIComponent
  const downloadFile = useCallback(async (filePath, fileName) => {
    if (!filePath) return toast.error("File path is missing");
    try {
      const token  = localStorage.getItem("token");
      const params = new URLSearchParams({ filePath }); // ✅ correct encoding
      const res    = await axios.get(`${API_URL}/files/download?${params}`, {
        headers:      { Authorization: `Bearer ${token}` },
        responseType: "blob",
      });

      const url  = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href  = url;
      link.setAttribute("download", fileName || filePath.split("/").pop() || "file");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success("File downloaded successfully");
    } catch (err) {
      console.error("Download failed:", err);
      toast.error(err.response?.data?.message || "Failed to download file");
    }
  }, [API_URL]);

  // ── Preview handler ─────────────────────────────────────────
  // ✅ NEW: fetches file as blob, opens PreviewModal
  const openPreview = useCallback(async (file, idx) => {
    if (!file.path) return toast.error("File path is missing");
    setPreviewLoading(idx);
    try {
      const token  = localStorage.getItem("token");
      const params = new URLSearchParams({ filePath: file.path });
      const res    = await axios.get(`${API_URL}/files/preview?${params}`, {
        headers:      { Authorization: `Bearer ${token}` },
        responseType: "blob",
      });

      const contentType = res.headers["content-type"] || "application/octet-stream";
      const blobUrl     = window.URL.createObjectURL(
        new Blob([res.data], { type: contentType })
      );

      setPreviewFile({
        url:      blobUrl,
        name:     file.name  || file.path?.split("/").pop() || "file",
        size:     file.size  || 0,
        category: getFileCategory(file.name, file.type),
      });
    } catch (err) {
      console.error("Preview failed:", err);
      toast.error(err.response?.data?.message || "Failed to load preview");
    } finally {
      setPreviewLoading(null);
    }
  }, [API_URL]);

  const closePreview = useCallback(() => {
    if (previewFile?.url) window.URL.revokeObjectURL(previewFile.url);
    setPreviewFile(null);
  }, [previewFile]);

  // ── Format helpers ──────────────────────────────────────────
  const formatCurrencyValue = (val) => {
    if (!val) return "-";
    const match = val.match(/^([\d,]+)\s*([A-Za-z]+)$/);
    if (!match) return val;
    const number   = match[1].replace(/,/g, "");
    const currency = match[2].toUpperCase();
    return `${Number(number).toLocaleString("en-IN")} ${currency}`;
  };

  const getStageBadgeClass = (stage) => {
    const map = {
      "Closed Won":   { icon: CheckCircle, color: "text-emerald-700", bgColor: "bg-emerald-50", borderColor: "border-emerald-200", label: "Closed Won" },
      "Closed Lost":  { icon: XCircle,     color: "text-rose-700",    bgColor: "bg-rose-50",    borderColor: "border-rose-200",    label: "Closed Lost" },
      "Qualification":{ icon: AlertCircle, color: "text-blue-700",    bgColor: "bg-blue-50",    borderColor: "border-blue-200",    label: "Qualification" },
      "Negotiation":  { icon: Clock,       color: "text-amber-700",   bgColor: "bg-amber-50",   borderColor: "border-amber-200",   label: "Negotiation" },
      "Proposal Sent":{ icon: Mail,        color: "text-purple-700",  bgColor: "bg-purple-50",  borderColor: "border-purple-200",  label: "Proposal Sent" },
    };
    return map[stage] || { icon: AlertCircle, color: "text-slate-700", bgColor: "bg-slate-100", borderColor: "border-slate-200", label: stage || "Unknown" };
  };

  // ── Loading state ───────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4" />
          <p className="text-slate-600">Loading deal details...</p>
        </div>
      </div>
    );
  }

  if (!deal) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center px-4">
        <div className="text-center p-8 bg-white rounded-2xl shadow-lg max-w-md w-full">
          <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle className="text-rose-600" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-3">Deal Not Found</h2>
          <p className="text-slate-600 mb-6">The deal you're looking for doesn't exist or may have been removed.</p>
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all shadow-md hover:shadow-lg"
          >
            <ArrowLeft size={18} className="mr-2" />
            Back to Pipeline
          </button>
        </div>
      </div>
    );
  }

  const stageConfig = getStageBadgeClass(deal.stage);
  const StageIcon   = stageConfig.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="max-w-6xl mx-auto">

        {/* ── Page Header ─────────────────────────────────────── */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
          <div>
            <div className="flex items-center text-slate-600 mb-3">
              <button
                onClick={() => navigate(-1)}
                className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
              >
                <ArrowLeft size={16} className="mr-1" />
                Back to Pipeline
              </button>
              <ChevronRight size={16} className="mx-2" />
              <span className="text-slate-500">View Deal</span>
            </div>
            <div className="flex items-center gap-4 flex-wrap">
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
                {deal.dealName}
              </h1>
              <div className={`inline-flex items-center px-4 py-2 rounded-full ${stageConfig.bgColor} ${stageConfig.color} border ${stageConfig.borderColor}`}>
                <StageIcon size={16} className="mr-2" />
                <span className="capitalize font-medium text-sm">{stageConfig.label}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Tab Navigation ──────────────────────────────────── */}
        <div className="flex border-b border-slate-200 mb-6">
          {[
            { key: "details",     label: "Details" },
            { key: "attachments", label: `Attachments${deal.attachments?.length > 0 ? ` (${deal.attachments.length})` : ""}` },
            { key: "activity",    label: "Activity" },
          ].map((tab) => (
            <button
              key={tab.key}
              className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
                activeTab === tab.key
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-slate-600 hover:text-slate-900"
              }`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── Main Content ──────────────────────────────────── */}
          <div className="lg:col-span-2">

            {/* Details Tab */}
            {activeTab === "details" && (
              <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-200">
                <div className="p-6 border-b border-slate-100">
                  <h2 className="text-lg font-semibold text-slate-900">Deal Details</h2>
                  <p className="text-sm text-slate-600 mt-1">Comprehensive information about this deal</p>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Deal Info */}
                    <div className="space-y-4">
                      <h3 className="text-sm font-medium text-slate-700 uppercase tracking-wide">Deal Information</h3>
                      <InfoRow icon={<Tag size={18} />}       label="Deal Name" value={deal.dealName} />
                      <InfoRow icon={<DollarSign size={18} />} label="Value"     value={formatCurrencyValue(deal.value)} />
                      {deal.notes && <InfoRow icon={<BookOpen size={18} />} label="Notes" value={deal.notes} />}
                      {deal.followUpDate && (
                        <InfoRow icon={<Clock size={18} />} label="Follow-up Date"
                          value={new Date(deal.followUpDate).toLocaleDateString("en-US", { weekday:"short", year:"numeric", month:"short", day:"numeric" })} />
                      )}
                      {deal.followUpStatus && (
                        <InfoRow icon={<AlertCircle size={18} />} label="Follow-up Status" value={deal.followUpStatus} />
                      )}
                    </div>
                    {/* Company Info */}
                    <div className="space-y-4">
                      <h3 className="text-sm font-medium text-slate-700 uppercase tracking-wide">Company Information</h3>
                      <InfoRow icon={<Building size={18} />}  label="Company"    value={deal.companyName || "Not specified"} />
                      {deal.industry    && <InfoRow icon={<Briefcase size={18} />} label="Industry"    value={deal.industry} />}
                      {deal.email       && <InfoRow icon={<Mail size={18} />}      label="Email"       value={<a href={`mailto:${deal.email}`} className="text-blue-600 hover:underline">{deal.email}</a>} />}
                      {deal.phoneNumber && <InfoRow icon={<Phone size={18} />}     label="Phone"       value={deal.phoneNumber} />}
                      {deal.source      && <InfoRow icon={<Globe size={18} />}     label="Source"      value={deal.source} />}
                      {deal.requirement && <InfoRow icon={<FileText size={18} />}  label="Requirement" value={deal.requirement} />}
                      {deal.address     && <InfoRow icon={<MapPin size={18} />}    label="Address"     value={<span className="whitespace-pre-wrap">{deal.address}</span>} />}
                      {deal.country     && <InfoRow icon={<Globe size={18} />}     label="Country"     value={deal.country} />}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── Attachments Tab ─────────────────────────────── */}
            {activeTab === "attachments" && (
              <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-200">
                <div className="p-6 border-b border-slate-100">
                  <h2 className="text-lg font-semibold text-slate-900">Attachments</h2>
                  <p className="text-sm text-slate-600 mt-1">Files and documents related to this deal</p>
                </div>
                <div className="p-6">
                  {deal.attachments && deal.attachments.length > 0 ? (
                    <ul className="space-y-3">
                      {deal.attachments.map((file, idx) => {
                        // ✅ FIXED: file is now a proper object {name, path, type, size}
                        const fileName  = file.name || file.path?.split("/").pop() || `File ${idx + 1}`;
                        const filePath  = file.path || "";
                        const mimeType  = file.type || "";
                        const cat       = getFileCategory(fileName, mimeType);
                        const style     = FILE_STYLES[cat];
                        const showPreviewBtn = canPreview(fileName, mimeType);
                        const isLoadingThis  = previewLoading === idx;

                        return (
                          <li
                            key={idx}
                            className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200 hover:bg-slate-100 transition-colors"
                          >
                            {/* File info */}
                            <div className="flex items-center min-w-0 flex-1">
                              <div className={`p-3 rounded-lg mr-4 flex-shrink-0 ${style.bg}`}>
                                <FileText size={20} className={style.icon} />
                              </div>
                              <div className="min-w-0">
                                <p className="text-sm font-medium text-slate-900 truncate">
                                  {fileName}
                                </p>
                                <p className="text-xs text-slate-500 mt-0.5">
                                  {cat.toUpperCase()}
                                  {file.size > 0 && <span> • {formatFileSize(file.size)}</span>}
                                  {file.source && (
                                    <span className={`ml-1 px-1.5 py-0.5 rounded text-xs font-medium ${
                                      file.source === "lead"
                                        ? "bg-purple-100 text-purple-700"
                                        : "bg-blue-100 text-blue-700"
                                    }`}>
                                      {file.source}
                                    </span>
                                  )}
                                  {file.uploadedAt && (
                                    <span> • {new Date(file.uploadedAt).toLocaleDateString()}</span>
                                  )}
                                </p>
                              </div>
                            </div>

                            {/* Action buttons */}
                            <div className="flex items-center gap-1 ml-3 flex-shrink-0">
                              {/* ✅ Preview button — only for image/pdf/text */}
                              {showPreviewBtn && (
                                <button
                                  onClick={() => openPreview(file, idx)}
                                  disabled={isLoadingThis}
                                  className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors disabled:opacity-60"
                                  title="Preview file"
                                >
                                  {isLoadingThis ? (
                                    <span className="inline-block w-4 h-4 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
                                  ) : (
                                    <Eye size={15} />
                                  )}
                                  <span className="hidden sm:inline">
                                    {isLoadingThis ? "Loading…" : "Preview"}
                                  </span>
                                </button>
                              )}

                              {/* ✅ Download button — always shown */}
                              <button
                                onClick={() => downloadFile(filePath, fileName)}
                                className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Download file"
                              >
                                <Download size={15} />
                                <span className="hidden sm:inline">Download</span>
                              </button>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Paperclip size={24} className="text-slate-400" />
                      </div>
                      <p className="text-slate-500 font-medium">No attachments found</p>
                      <p className="text-slate-400 text-sm mt-1">
                        Files uploaded with this deal will appear here
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Activity Tab */}
            {activeTab === "activity" && (
              <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-200">
                <div className="p-6 border-b border-slate-100">
                  <h2 className="text-lg font-semibold text-slate-900">Activity Timeline</h2>
                  <p className="text-sm text-slate-600 mt-1">Recent activities and updates for this deal</p>
                </div>
                <div className="p-6 space-y-6">
                  <ActivityItem
                    color="bg-blue-100"
                    icon={<FileText size={16} className="text-blue-600" />}
                    title="Deal created"
                    date={deal.createdAt}
                  />
                  {deal.stageHistory?.map((history, index) => {
                    const cfg  = getStageBadgeClass(history.stage);
                    const Icon = cfg.icon;
                    return (
                      <ActivityItem
                        key={index}
                        color={cfg.bgColor}
                        icon={<Icon size={16} className={cfg.color} />}
                        title={`Stage changed to ${cfg.label}`}
                        subtitle={history.changedBy ? `By: ${history.changedBy.firstName} ${history.changedBy.lastName}` : null}
                        date={history.date}
                      />
                    );
                  })}
                  <ActivityItem
                    color="bg-slate-100"
                    icon={<Clock size={16} className="text-slate-600" />}
                    title="Deal updated"
                    date={deal.updatedAt}
                  />
                </div>
              </div>
            )}
          </div>

          {/* ── Sidebar ───────────────────────────────────────── */}
          <div className="space-y-6">
            {/* Status */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
              <h3 className="text-sm font-medium text-slate-700 mb-3 uppercase tracking-wide">Deal Status</h3>
              <div className={`inline-flex items-center px-4 py-2 rounded-full ${stageConfig.bgColor} ${stageConfig.color} border ${stageConfig.borderColor} mb-3`}>
                <StageIcon size={16} className="mr-2" />
                <span className="capitalize font-medium text-sm">{stageConfig.label}</span>
              </div>
              <p className="text-sm text-slate-600">
                Last updated {new Date(deal.updatedAt).toLocaleDateString()}
              </p>
            </div>

            {/* Company */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
              <h3 className="text-sm font-medium text-slate-700 mb-4 uppercase tracking-wide">Company</h3>
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center mr-3">
                  <Building size={20} className="text-slate-600" />
                </div>
                <div>
                  <h4 className="font-medium text-slate-900">{deal.companyName || "Unknown Company"}</h4>
                  {deal.industry && <p className="text-sm text-slate-600">{deal.industry}</p>}
                </div>
              </div>
              <div className="space-y-2">
                {deal.email && (
                  <a href={`mailto:${deal.email}`} className="flex items-center text-sm text-slate-600 hover:text-blue-600 transition-colors">
                    <Mail size={14} className="mr-2" />
                    {deal.email}
                  </a>
                )}
                {deal.phoneNumber && (
                  <div className="flex items-center text-sm text-slate-600">
                    <Phone size={14} className="mr-2" />
                    {deal.phoneNumber}
                  </div>
                )}
              </div>
            </div>

            {/* Assigned To */}
            {deal.assignedTo && (
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
                <h3 className="text-sm font-medium text-slate-700 mb-4 uppercase tracking-wide">Assigned To</h3>
                <div className="flex items-start text-slate-700 mb-4">
                  <User size={18} className="mr-3 text-slate-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-slate-900">
                      {deal.assignedTo.firstName} {deal.assignedTo.lastName}
                    </p>
                    <p className="text-sm text-slate-500">{deal.assignedTo.email}</p>
                  </div>
                </div>
                <div className="flex items-start text-slate-700">
                  <Calendar size={18} className="mr-3 text-slate-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-slate-500">Created</p>
                    <p className="text-slate-900">
                      {new Date(deal.createdAt).toLocaleDateString("en-US", {
                        weekday: "short", year: "numeric", month: "short", day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Preview Modal ─────────────────────────────────────── */}
      {previewFile && <PreviewModal file={previewFile} onClose={closePreview} />}
    </div>
  );
}

// ─────────────────────────────────────────────
// Small reusable sub-components
// ─────────────────────────────────────────────
const InfoRow = ({ icon, label, value }) => (
  <div className="flex items-start text-slate-700">
    <span className="mr-3 text-slate-400 mt-0.5 flex-shrink-0">{icon}</span>
    <div>
      <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{label}</p>
      <div className="text-slate-900 mt-0.5">{value}</div>
    </div>
  </div>
);

const ActivityItem = ({ color, icon, title, subtitle, date }) => (
  <div className="flex items-start">
    <div className={`w-10 h-10 ${color} rounded-full flex items-center justify-center flex-shrink-0`}>
      {icon}
    </div>
    <div className="ml-4">
      <h3 className="text-sm font-medium text-slate-900">{title}</h3>
      {subtitle && <p className="text-xs text-slate-600 mt-0.5">{subtitle}</p>}
      <p className="text-sm text-slate-500 mt-0.5">
        {new Date(date).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })}
      </p>
    </div>
  </div>
);

export default Pipeline_modal_view;//download working correctly..





