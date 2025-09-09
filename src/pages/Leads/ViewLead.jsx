import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import {
  ArrowLeft,
  ChevronRight,
  User,
  Mail,
  Phone,
  Building,
  FileText,
  Calendar,
  Clock,
  Paperclip,
  Download,
} from "lucide-react";
import { toast } from "react-toastify";

const ViewLead = () => {
  const API_URL = import.meta.env.VITE_API_URL;

  const { id } = useParams();
  const [lead, setLead] = useState(null);
  const [activeTab, setActiveTab] = useState("details");

  // Fetch lead details
  useEffect(() => {
    const fetchLead = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_URL}/leads/getLead/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log(res);
        
        setLead(res.data);
      } catch (err) {
        console.error("Error fetching lead:", err);
        toast.error("Failed to fetch lead details");
      }
    };
    fetchLead();
  }, [id, API_URL]);



// Download file handler
const downloadFile = async (filePath, fileName) => {
  if (!filePath) return toast.error("File path missing");
  
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(
      `${API_URL}/files/download?filePath=${encodeURIComponent(filePath)}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob'
      }
    );

    // Create blob link to download
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName || 'file');
    document.body.appendChild(link);
    link.click();
    link.remove();
    
    // Clean up
    window.URL.revokeObjectURL(url);
    toast.success("File downloaded successfully");
  } catch (error) {
    console.error("Download error:", error);
    toast.error("Failed to download file");
  }
};


  if (!lead) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-600">
        Loading lead details...
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
          <div>
            <div className="flex items-center text-slate-600 mb-3">
              <Link
                to="/leads"
                className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
              >
                <ArrowLeft size={16} className="mr-1" />
                All Leads
              </Link>
              <ChevronRight size={16} className="mx-2" />
              <span className="text-slate-500">View Lead</span>
            </div>
            <div className="flex items-center gap-4">
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
                {lead.leadName}
              </h1>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 mb-6">
          {["details", "attachments", "activity"].map((tab) => (
            <button
              key={tab}
              className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
                activeTab === tab
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-slate-600 hover:text-slate-900"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
              {tab === "attachments" &&
                lead.attachments &&
                lead.attachments.length > 0
                ? ` (${lead.attachments.length})`
                : ""}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Details Tab */}
            {activeTab === "details" && (
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-100">
                  <h2 className="text-lg font-semibold text-slate-900">
                    Lead Details
                  </h2>
                  <p className="text-sm text-slate-600 mt-1">
                    Comprehensive information about this lead
                  </p>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Client Info */}
                  <div className="space-y-5">
                    <h3 className="text-sm font-medium text-slate-700 mb-3 uppercase tracking-wide">
                      Client Information
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center text-slate-700">
                        <User size={18} className="mr-3 text-slate-500" />
                        <div>
                          <p className="text-sm font-medium">Lead Name</p>
                          <p className="text-slate-900">{lead.leadName}</p>
                        </div>
                      </div>
                      <div className="flex items-center text-slate-700">
                        <Building size={18} className="mr-3 text-slate-500" />
                        <div>
                          <p className="text-sm font-medium">Company</p>
                          <p className="text-slate-900">
                            {lead.companyName || "Not specified"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center text-slate-700">
                        <Mail size={18} className="mr-3 text-slate-500" />
                        <div>
                          <p className="text-sm font-medium">Email</p>
                          <a
                            href={`mailto:${lead.email}`}
                            className="text-blue-600 hover:underline"
                          >
                            {lead.email || "N/A"}
                          </a>
                        </div>
                      </div>
                      <div className="flex items-center text-slate-700">
                        <Phone size={18} className="mr-3 text-slate-500" />
                        <div>
                          <p className="text-sm font-medium">Phone</p>
                          <p className="text-slate-900">{lead.phoneNumber}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Lead Info */}
                  <div className="space-y-5">
                    <h3 className="text-sm font-medium text-slate-700 mb-3 uppercase tracking-wide">
                      Lead Information
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center text-slate-700">
                        <FileText size={18} className="mr-3 text-slate-500" />
                        <div>
                          <p className="text-sm font-medium">Requirement</p>
                          <p className="text-slate-900">
                            {lead.requirement || "Not specified"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center text-slate-700">
                        <Calendar size={18} className="mr-3 text-slate-500" />
                        <div>
                          <p className="text-sm font-medium">Created</p>
                          <p className="text-slate-900">
                            {new Date(lead.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      {lead.assignTo && (
                        <div className="flex items-center text-slate-700">
                          <User size={18} className="mr-3 text-slate-500" />
                          <div>
                            <p className="text-sm font-medium">Assigned To</p>
                            <p className="text-slate-900">
                              {lead.assignTo.firstName} {lead.assignTo.lastName} (
                              {lead.assignTo.email})
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {lead.notes && (
                  <div className="mt-8 pt-6 border-t border-slate-200 p-6">
                    <h3 className="text-sm font-medium text-slate-700 mb-3 uppercase tracking-wide">
                      Additional Notes
                    </h3>
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                      <p className="text-slate-700">{lead.notes}</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Attachments Tab */}
            {activeTab === "attachments" && (
              <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-200">
                <div className="p-6 border-b border-slate-100">
                  <h2 className="text-lg font-semibold text-slate-900">
                    Attachments
                  </h2>
                  <p className="text-sm text-slate-600 mt-1">
                    Files and documents related to this lead
                  </p>
                </div>
                <div className="p-6">
                  {lead.attachments && lead.attachments.length > 0 ? (
                    <ul className="space-y-3">
                      {lead.attachments.map((file, idx) => (
                        <li
                          key={idx}
                          className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors group"
                        >
                          <div className="flex items-center">
                            <div className="p-3 bg-blue-100 rounded-lg mr-4">
                              <FileText size={20} className="text-blue-600" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-slate-900">
                                {file.name}
                              </p>
                              <p className="text-xs text-slate-500 mt-1 capitalize">
                                {file.type}
                                {file.uploadedAt && (
                                  <span>
                                    {" "}
                                    • Uploaded{" "}
                                    {new Date(file.uploadedAt).toLocaleDateString()}
                                  </span>
                                )}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => downloadFile(file.path, file.name)}
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
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Paperclip size={24} className="text-slate-400" />
                      </div>
                      <p className="text-slate-500">No attachments found</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Activity Tab */}
            {activeTab === "activity" && (
              <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-200">
                <div className="p-6 border-b border-slate-100">
                  <h2 className="text-lg font-semibold text-slate-900">
                    Activity Timeline
                  </h2>
                  <p className="text-sm text-slate-600 mt-1">
                    Recent activities and updates for this lead
                  </p>
                </div>
                <div className="p-6 space-y-6">
                  <div className="flex items-start">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <FileText size={16} className="text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-sm font-medium text-slate-900">
                        Lead created
                      </h3>
                      <p className="text-sm text-slate-500 mt-1">
                        {new Date(lead.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  {lead.updatedAt && (
                    <div className="flex items-start">
                      <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                        <Clock size={16} className="text-emerald-600" />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-sm font-medium text-slate-900">
                          Lead updated
                        </h3>
                        <p className="text-sm text-slate-500 mt-1">
                          {new Date(lead.updatedAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-200 p-5">
              <h3 className="text-sm font-medium text-slate-700 mb-4 uppercase tracking-wide">
                Client
              </h3>
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center mr-3">
                  <User size={20} className="text-slate-600" />
                </div>
                <div>
                  <h4 className="font-medium text-slate-900">{lead.leadName}</h4>
                  {lead.companyName && (
                    <p className="text-sm text-slate-600">{lead.companyName}</p>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                {lead.email && (
                  <a
                    href={`mailto:${lead.email}`}
                    className="flex items-center text-sm text-slate-600 hover:text-blue-600 transition-colors"
                  >
                    <Mail size={14} className="mr-2" />
                    {lead.email}
                  </a>
                )}
                {lead.phoneNumber && (
                  <div className="flex items-center text-sm text-slate-600">
                    <Phone size={14} className="mr-2" />
                    {lead.phoneNumber}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewLead;