import React, { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import {
  ArrowLeft,
  Calendar,
  FileText,
  Mail,
  Clock,
  User,
  Building,
  DollarSign,
  CheckCircle,
  XCircle,
  AlertCircle,
  Download,
  Eye,
  ChevronRight,
  X,
  ZoomIn,
  ZoomOut,
  RotateCw,
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

// ─── Utility ─────────────────────────────────────────────────────────────────
const getToken = () => localStorage.getItem("token") || "";

const getPreviewUrl = (filePath) =>
  `${API_URL}/files/preview?filePath=${encodeURIComponent(filePath)}`;

const getDownloadUrl = (filePath) =>
  `${API_URL}/files/download?filePath=${encodeURIComponent(filePath)}`;

const getFileType = (filename = "") => {
  const ext = filename.split(".").pop().toLowerCase();
  if (["jpg", "jpeg", "png", "gif", "webp", "bmp", "svg", "avif"].includes(ext))
    return "image";
  if (ext === "pdf") return "pdf";
  return "other";
};

const triggerDownload = async (file) => {
  try {
    const token = getToken();
    const response = await fetch(getDownloadUrl(file.path), {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (!response.ok) throw new Error("Download failed");
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = file.filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  } catch (err) {
    console.error("Download error:", err);
    alert("Download failed. Please try again.");
  }
};

// ─── useBlobUrl hook — fetches a protected file and returns a blob URL ────────
const useBlobUrl = (filePath) => {
  const [blobUrl, setBlobUrl] = useState(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!filePath) return;
    let objectUrl = null;
    setLoading(true);
    setError(false);
    setBlobUrl(null);

    (async () => {
      try {
        const token = getToken();
        const resp = await fetch(getPreviewUrl(filePath), {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        const blob = await resp.blob();
        objectUrl = URL.createObjectURL(blob);
        setBlobUrl(objectUrl);
      } catch (e) {
        console.error("useBlobUrl error:", e);
        setError(true);
      } finally {
        setLoading(false);
      }
    })();

    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [filePath]);

  return { blobUrl, error, loading };
};

// ─── ImageViewer (proper component — hooks are safe here) ─────────────────────
const ImageViewer = ({ file, zoom, rotate }) => {
  const { blobUrl, error, loading } = useBlobUrl(file?.path);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center text-slate-400 gap-3">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500" />
        <p className="text-sm">Loading image…</p>
      </div>
    );
  }

  if (error || !blobUrl) {
    return (
      <div className="text-center text-slate-500 p-8">
        <FileText size={40} className="mx-auto mb-2 opacity-40" />
        <p className="text-sm mb-3">Unable to load image preview.</p>
        <button
          onClick={() => triggerDownload(file)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
        >
          <Download size={14} /> Download instead
        </button>
      </div>
    );
  }

  return (
    <div className="overflow-auto w-full h-full flex items-center justify-center">
      <img
        src={blobUrl}
        alt={file.filename}
        style={{
          transform: `scale(${zoom}) rotate(${rotate}deg)`,
          transition: "transform 0.2s ease",
          maxWidth: zoom > 1 ? "none" : "100%",
          maxHeight: zoom > 1 ? "none" : "100%",
          objectFit: "contain",
          borderRadius: 8,
          boxShadow: "0 4px 24px rgba(0,0,0,0.2)",
        }}
      />
    </div>
  );
};

// ─── PdfViewer (proper component) ─────────────────────────────────────────────
const PdfViewer = ({ file }) => {
  const { blobUrl, error, loading } = useBlobUrl(file?.path);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center text-slate-400 gap-3">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500" />
        <p className="text-sm">Loading PDF…</p>
      </div>
    );
  }

  if (error || !blobUrl) {
    return (
      <div className="text-center text-slate-500 p-8">
        <FileText size={40} className="mx-auto mb-2 opacity-40" />
        <p className="text-sm mb-3">Unable to load PDF preview.</p>
        <button
          onClick={() => triggerDownload(file)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
        >
          <Download size={14} /> Download instead
        </button>
      </div>
    );
  }

  return (
    <iframe
      src={blobUrl}
      title={file.filename}
      className="w-full rounded-lg border border-slate-200"
      style={{ height: "100%", minHeight: 500 }}
    />
  );
};

// ─── PreviewModal (proper top-level component) ────────────────────────────────
const PreviewModal = ({ file, onClose }) => {
  const [zoom, setZoom] = useState(1);
  const [rotate, setRotate] = useState(0);

  // Close on Escape key
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  if (!file) return null;

  const fileType = getFileType(file.filename);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: "rgba(0,0,0,0.80)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="relative bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden"
        style={{ width: "92vw", maxWidth: 980, height: "90vh" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200 bg-slate-50 flex-shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
              <FileText size={18} className="text-blue-600" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-900 truncate">
                {file.filename}
              </p>
              {file.size && (
                <p className="text-xs text-slate-500">
                  {(file.size / 1024).toFixed(1)} KB
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1.5 flex-shrink-0 ml-3">
            {fileType === "image" && (
              <>
                <button
                  onClick={() => setZoom((z) => Math.max(0.25, z - 0.25))}
                  className="p-2 rounded-lg text-slate-600 hover:bg-slate-200 transition-colors"
                  title="Zoom out"
                >
                  <ZoomOut size={16} />
                </button>
                <span className="text-xs text-slate-600 w-12 text-center font-medium select-none">
                  {Math.round(zoom * 100)}%
                </span>
                <button
                  onClick={() => setZoom((z) => Math.min(3, z + 0.25))}
                  className="p-2 rounded-lg text-slate-600 hover:bg-slate-200 transition-colors"
                  title="Zoom in"
                >
                  <ZoomIn size={16} />
                </button>
                <button
                  onClick={() => setRotate((r) => (r + 90) % 360)}
                  className="p-2 rounded-lg text-slate-600 hover:bg-slate-200 transition-colors"
                  title="Rotate"
                >
                  <RotateCw size={16} />
                </button>
                <div className="w-px h-5 bg-slate-300 mx-1" />
              </>
            )}
            <button
              onClick={() => triggerDownload(file)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-lg transition-colors"
            >
              <Download size={14} /> Download
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-500 hover:bg-slate-200 hover:text-slate-900 transition-colors ml-1"
              title="Close (Esc)"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-auto flex items-center justify-center bg-slate-100 p-4">
          {fileType === "image" && (
            <ImageViewer file={file} zoom={zoom} rotate={rotate} />
          )}
          {fileType === "pdf" && <PdfViewer file={file} />}
          {fileType === "other" && (
            <div className="text-center text-slate-500 p-8">
              <div className="w-20 h-20 bg-slate-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FileText size={36} className="text-slate-400" />
              </div>
              <p className="text-base font-medium text-slate-700 mb-1">
                No preview available
              </p>
              <p className="text-sm text-slate-500 mb-5">
                This file type cannot be previewed in the browser.
              </p>
              <button
                onClick={() => triggerDownload(file)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
              >
                <Download size={16} /> Download File
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Status config ────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  draft: {
    icon: FileText,
    color: "text-slate-700",
    bgColor: "bg-slate-100",
    borderColor: "border-slate-200",
    label: "Draft",
  },
  sent: {
    icon: Mail,
    color: "text-blue-700",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    label: "Sent",
  },
  "no reply": {
    icon: AlertCircle,
    color: "text-amber-700",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    label: "No Reply",
  },
  rejection: {
    icon: XCircle,
    color: "text-rose-700",
    bgColor: "bg-rose-50",
    borderColor: "border-rose-200",
    label: "Rejected",
  },
  success: {
    icon: CheckCircle,
    color: "text-emerald-700",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
    label: "Accepted",
  },
};

// ─── Main ViewProposal component ──────────────────────────────────────────────
const ViewProposal = () => {
  const { id } = useParams();
  const [proposal, setProposal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("details");
  const [previewFile, setPreviewFile] = useState(null); // null = modal closed

  useEffect(() => {
    const fetchProposal = async () => {
      try {
        const res = await axios.get(`${API_URL}/proposal/${id}`);
        setProposal(res.data);
      } catch (err) {
        console.error("Failed to fetch proposal:", err);
      }
      setLoading(false);
    };
    fetchProposal();
  }, [id]);

  const closePreview = useCallback(() => setPreviewFile(null), []);

  // ── Loading ──
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4" />
          <p className="text-slate-600">Loading proposal details...</p>
        </div>
      </div>
    );
  }

  // ── Not found ──
  if (!proposal) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center p-8 bg-white rounded-2xl shadow-lg max-w-md w-full">
          <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle className="text-rose-600" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-3">Proposal Not Found</h2>
          <p className="text-slate-600 mb-6">
            The proposal you're looking for doesn't exist or may have been removed.
          </p>
          <Link
            to="/proposal"
            className="inline-flex items-center px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
          >
            <ArrowLeft size={18} className="mr-2" />
            Back to Proposals
          </Link>
        </div>
      </div>
    );
  }

  const statusStyle = STATUS_CONFIG[proposal.status] || STATUS_CONFIG.draft;
  const StatusIcon = statusStyle.icon;

  return (
    <div className="min-h-screen py-8 px-4">

      {/* Preview Modal — rendered as a proper component, no hooks-in-callbacks */}
      {previewFile && (
        <PreviewModal file={previewFile} onClose={closePreview} />
      )}

      <div className="max-w-6xl mx-auto">

        {/* Page header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
          <div>
            <div className="flex items-center text-slate-600 mb-3">
              <Link
                to="/proposal"
                className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
              >
                <ArrowLeft size={16} className="mr-1" />
                All Proposals
              </Link>
              <ChevronRight size={16} className="mx-2" />
              <span className="text-slate-500">View Proposal</span>
            </div>
            <div className="flex items-center gap-4 flex-wrap">
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
                {proposal.title}
              </h1>
              <div
                className={`inline-flex items-center px-4 py-2 rounded-full ${statusStyle.bgColor} ${statusStyle.color} border ${statusStyle.borderColor}`}
              >
                <StatusIcon size={16} className="mr-2" />
                <span className="capitalize font-medium text-sm">{statusStyle.label}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 mb-6">
          {["details", "content", "attachments", "activity"].map((tab) => (
            <button
              key={tab}
              className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
                activeTab === tab
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-slate-600 hover:text-slate-900"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === "attachments" && proposal.attachments?.length > 0
                ? `Attachments (${proposal.attachments.length})`
                : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">

            {/* ── Content Tab ── */}
            {activeTab === "content" && (
              <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-200">
                <div className="p-6 border-b border-slate-100">
                  <h2 className="text-lg font-semibold text-slate-900">Proposal Content</h2>
                </div>
                <div className="p-6">
                  <div
                    className="prose max-w-none p-6 bg-slate-50 rounded-lg border border-slate-200"
                    dangerouslySetInnerHTML={{ __html: proposal.content }}
                  />
                </div>
              </div>
            )}

            {/* ── Attachments Tab ── */}
            {activeTab === "attachments" && (
              <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-200">
                <div className="p-6 border-b border-slate-100">
                  <h2 className="text-lg font-semibold text-slate-900">Attachments</h2>
                  <p className="text-sm text-slate-600 mt-1">
                    Files and documents related to this proposal
                  </p>
                </div>
                <div className="p-6">
                  {proposal.attachments && proposal.attachments.length > 0 ? (
                    <ul className="space-y-3">
                      {proposal.attachments.map((file, idx) => (
                        <li
                          key={idx}
                          className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors"
                        >
                          <div className="flex items-center min-w-0">
                            <div className="p-3 bg-blue-100 rounded-lg mr-4 flex-shrink-0">
                              <FileText size={20} className="text-blue-600" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-slate-900 truncate">
                                {file.filename}
                              </p>
                              <p className="text-xs text-slate-500 mt-1">
                                {file.size
                                  ? `${(file.size / 1024).toFixed(1)} KB`
                                  : "Size unknown"}{" "}
                                • Uploaded {new Date(proposal.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                            <button
                              onClick={() => setPreviewFile(file)}
                              className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Preview"
                            >
                              <Eye size={18} />
                            </button>
                            <button
                              onClick={() => triggerDownload(file)}
                              className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Download"
                            >
                              <Download size={18} />
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-center py-10 text-slate-400">
                      <FileText size={36} className="mx-auto mb-2 opacity-40" />
                      <p className="text-sm">No attachments found</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ── Details Tab ── */}
            {activeTab === "details" && (
              <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-200">
                <div className="p-6 border-b border-slate-100">
                  <h2 className="text-lg font-semibold text-slate-900">Proposal Details</h2>
                  <p className="text-sm text-slate-600 mt-1">
                    Comprehensive information about this proposal
                  </p>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-sm font-medium text-slate-700 mb-3 uppercase tracking-wide">
                        Client Information
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-center text-slate-700">
                          <User size={18} className="mr-3 text-slate-500 flex-shrink-0" />
                          <div>
                            <p className="text-sm font-medium">Client Name</p>
                            <p className="text-slate-900">{proposal.dealTitle || "Not specified"}</p>
                          </div>
                        </div>
                        <div className="flex items-center text-slate-700">
                          <Building size={18} className="mr-3 text-slate-500 flex-shrink-0" />
                          <div>
                            <p className="text-sm font-medium">Company</p>
                            <p className="text-slate-900">
                              {proposal.deal?.companyName || "Not specified"}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center text-slate-700">
                          <Mail size={18} className="mr-3 text-slate-500 flex-shrink-0" />
                          <div>
                            <p className="text-sm font-medium">Email Address</p>
                            <a
                              href={`mailto:${proposal.email}`}
                              className="text-blue-600 hover:underline"
                            >
                              {proposal.email}
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-slate-700 mb-3 uppercase tracking-wide">
                        Proposal Information
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-center text-slate-700">
                          <DollarSign size={18} className="mr-3 text-slate-500 flex-shrink-0" />
                          <div>
                            <p className="text-sm font-medium">Proposed Value</p>
                            <p className="text-slate-900">
                              {proposal.value
                                ? `$${proposal.value.toLocaleString()}`
                                : "Not specified"}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center text-slate-700">
                          <Calendar size={18} className="mr-3 text-slate-500 flex-shrink-0" />
                          <div>
                            <p className="text-sm font-medium">Created Date</p>
                            <p className="text-slate-900">
                              {new Date(proposal.createdAt).toLocaleDateString("en-US", {
                                weekday: "short",
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center text-slate-700">
                          <Clock size={18} className="mr-3 text-slate-500 flex-shrink-0" />
                          <div>
                            <p className="text-sm font-medium">Follow-up Date</p>
                            <p className="text-slate-900">
                              {proposal.followUpDate
                                ? new Date(proposal.followUpDate).toLocaleDateString("en-US", {
                                    weekday: "short",
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  })
                                : "Not scheduled"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {proposal.notes && (
                    <div className="mt-8 pt-6 border-t border-slate-200">
                      <h3 className="text-sm font-medium text-slate-700 mb-3 uppercase tracking-wide">
                        Additional Notes
                      </h3>
                      <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                        <p className="text-slate-700">{proposal.notes}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ── Activity Tab ── */}
            {activeTab === "activity" && (
              <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-200">
                <div className="p-6 border-b border-slate-100">
                  <h2 className="text-lg font-semibold text-slate-900">Activity Timeline</h2>
                  <p className="text-sm text-slate-600 mt-1">
                    Recent activities and updates for this proposal
                  </p>
                </div>
                <div className="p-6 space-y-8">
                  <div className="flex items-start">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <FileText size={16} className="text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-sm font-medium text-slate-900">Proposal created</h3>
                      <p className="text-sm text-slate-500 mt-1">
                        {new Date(proposal.createdAt).toLocaleString("en-US", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </p>
                    </div>
                  </div>

                  {proposal.followUpDate && (
                    <div className="flex items-start">
                      <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Clock size={16} className="text-amber-600" />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-sm font-medium text-slate-900">
                          Follow-up scheduled
                        </h3>
                        <p className="text-sm text-slate-500 mt-1">
                          {new Date(proposal.followUpDate).toLocaleString("en-US", {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-start">
                    <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <StatusIcon size={16} className="text-emerald-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-sm font-medium text-slate-900">
                        Status changed to {statusStyle.label}
                      </h3>
                      <p className="text-sm text-slate-500 mt-1">
                        {new Date(
                          proposal.updatedAt || proposal.createdAt
                        ).toLocaleString("en-US", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-200 p-5">
              <h3 className="text-sm font-medium text-slate-700 mb-3 uppercase tracking-wide">
                Proposal Status
              </h3>
              <div
                className={`inline-flex items-center px-4 py-2 rounded-full ${statusStyle.bgColor} ${statusStyle.color} border ${statusStyle.borderColor} mb-4`}
              >
                <StatusIcon size={16} className="mr-2" />
                <span className="capitalize font-medium text-sm">{statusStyle.label}</span>
              </div>
              <p className="text-sm text-slate-600 mt-2">
                Last updated{" "}
                {new Date(
                  proposal.updatedAt || proposal.createdAt
                ).toLocaleDateString()}
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-200 p-5">
              <h3 className="text-sm font-medium text-slate-700 mb-4 uppercase tracking-wide">
                Client
              </h3>
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center mr-3">
                  <User size={20} className="text-slate-600" />
                </div>
                <div>
                  <h4 className="font-medium text-slate-900">
                    {proposal.dealTitle || "Unknown Client"}
                  </h4>
                  <p className="text-sm text-slate-600">
                    {proposal.companyName || "No company"}
                  </p>
                </div>
              </div>
              <a
                href={`mailto:${proposal.email}`}
                className="flex items-center text-sm text-slate-600 hover:text-blue-600 transition-colors"
              >
                <Mail size={14} className="mr-2" />
                {proposal.email}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewProposal;//original


