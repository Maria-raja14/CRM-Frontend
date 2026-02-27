import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from "react-toastify";
import {
  Eye,
  Download,
  X,
  ArrowLeft,
  Mail,
  Paperclip,
  Users,
  Calendar,
  User as UserIcon,
  FileText,
  Clock
} from 'lucide-react';

const EmailHistory = () => { 
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const [historyData, setHistoryData] = useState([]);
  const [historyPage, setHistoryPage] = useState(1);
  const [historyLimit, setHistoryLimit] = useState(15);
  const [historyTotalPages, setHistoryTotalPages] = useState(1);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  
  // Modal states
  const [selectedRecipients, setSelectedRecipients] = useState(null);
  const [showRecipientsModal, setShowRecipientsModal] = useState(false);
  const [selectedEmailContent, setSelectedEmailContent] = useState(null);
  const [showEmailViewModal, setShowEmailViewModal] = useState(false);
  const [selectedAttachments, setSelectedAttachments] = useState([]);
  const [showAttachmentsModal, setShowAttachmentsModal] = useState(false);
  const [allContacts, setAllContacts] = useState([]);

  // Get current user from localStorage
  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setCurrentUser(user);
      } catch (e) {
        console.error("Error parsing user:", e);
      }
    }
    fetchHistory(1);
    fetchAllContacts();
  }, []);

  // Fetch email history
  const fetchHistory = async (page = 1, limit = historyLimit) => {
    try {
      setLoadingHistory(true);
      const token = localStorage.getItem("token");

      const response = await axios.get(
        `${API_URL}/email/history?page=${page}&limit=${limit}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setHistoryData(response.data.data);
      setHistoryTotalPages(response.data.totalPages);
      setHistoryPage(page);

    } catch (error) {
      console.error("History fetch error:", error);
      toast.error("Failed to fetch email history");
    } finally {
      setLoadingHistory(false);
    }
  };

  // Fetch all contacts for recipient names
  const fetchAllContacts = async () => {
    try {
      const token = localStorage.getItem('token');
      
      let contactsData = [];
      
      // Fetch leads
      try {
        const leadsResponse = await axios.get(`${API_URL}/leads/getAllLead`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        let leadsData = [];
        if (leadsResponse.data?.leads) {
          leadsData = leadsResponse.data.leads;
        } else if (Array.isArray(leadsResponse.data)) {
          leadsData = leadsResponse.data;
        } else if (leadsResponse.data?.data) {
          leadsData = leadsResponse.data.data;
        }
        
        const formattedLeads = leadsData
          .filter(lead => lead.email)
          .map(lead => ({
            email: lead.email || '',
            name: lead.leadName || lead.name || '',
          }));
        
        contactsData = [...contactsData, ...formattedLeads];
      } catch (error) {
        console.error('Error fetching leads:', error);
      }
      
      // Fetch deals
      try {
        const dealsResponse = await axios.get(`${API_URL}/deals/getAll`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        let dealsData = [];
        if (Array.isArray(dealsResponse.data)) {
          dealsData = dealsResponse.data;
        } else if (dealsResponse.data?.deals) {
          dealsData = dealsResponse.data.deals;
        } else if (dealsResponse.data?.data) {
          dealsData = dealsResponse.data.data;
        }
        
        const formattedDeals = dealsData
          .filter(deal => deal.email || deal.leadEmail)
          .map(deal => {
            const email = deal.email || deal.leadEmail || '';
            const name = deal.dealName || deal.leadName || '';
            return { email, name };
          });
        
        contactsData = [...contactsData, ...formattedDeals];
      } catch (error) {
        console.error('Error fetching deals:', error);
      }
      
      // Remove duplicates by email
      const uniqueContacts = [];
      const emailSet = new Set();
      
      contactsData.forEach(contact => {
        if (contact.email && !emailSet.has(contact.email.toLowerCase())) {
          emailSet.add(contact.email.toLowerCase());
          uniqueContacts.push(contact);
        }
      });
      
      setAllContacts(uniqueContacts);
      
    } catch (error) {
      console.error('Error fetching contacts:', error);
    }
  };

  // Get contact name by email
  const getContactNameByEmail = (email) => {
    const contact = allContacts.find(c => c.email.toLowerCase() === email.toLowerCase());
    return contact ? contact.name : email;
  };

  // Handle page change
  const handlePageChange = (page) => {
    fetchHistory(page, historyLimit);
  };

  // Handle limit change
  const handleLimitChange = (e) => {
    const newLimit = Number(e.target.value);
    setHistoryLimit(newLimit);
    fetchHistory(1, newLimit);
  };

  // Download attachment
  const downloadAttachment = async (file) => {
    try {
      const token = localStorage.getItem("token");
      const downloadUrl = `${API_URL}/files/download?filePath=${file.path}`;

      const response = await fetch(downloadUrl, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.filename;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      toast.error("Failed to download file");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="p-6 flex items-center gap-4">
          <button
            onClick={() => navigate('/mass-email')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Go back"
          >
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Email History</h1>
            <p className="text-gray-600 text-sm mt-1">
              View all sent emails and their details
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {loadingHistory ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : historyData.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <Mail className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No sent emails found.</p>
            <button
              onClick={() => navigate('/mass-email')}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Create New Email
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            {/* Table View for larger screens */}
            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Template
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Subject
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Recipients
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Attachments
                    </th>
                    {currentUser?.role?.name === "Admin" && (
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Sent By
                      </th>
                    )}
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Sent Time
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {historyData.map((email) => (
                    <tr key={email._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <button
                          onClick={() => {
                            setSelectedEmailContent(email.content);
                            setShowEmailViewModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
                        >
                          <FileText className="w-4 h-4" />
                          {email.templateTitle || "Custom Email"}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {email.subject}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => {
                            setSelectedRecipients(email.recipients);
                            setShowRecipientsModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                        >
                          <Users className="w-4 h-4" />
                          {email.recipients.length} {email.recipients.length === 1 ? 'Recipient' : 'Recipients'}
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        {email.attachments && email.attachments.length > 0 ? (
                          <button
                            onClick={() => {
                              setSelectedAttachments(email.attachments);
                              setShowAttachmentsModal(true);
                            }}
                            className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                          >
                            <Paperclip className="w-4 h-4" />
                            {email.attachments.length} {email.attachments.length === 1 ? 'File' : 'Files'}
                          </button>
                        ) : (
                          <span className="text-gray-400 text-sm">No files</span>
                        )}
                      </td>
                      {currentUser?.role?.name === "Admin" && (
                        <td className="px-6 py-4">
                          {email.createdBy ? (
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-sm">
                                {email.createdBy.firstName?.charAt(0)}{email.createdBy.lastName?.charAt(0)}
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {email.createdBy.firstName} {email.createdBy.lastName}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {email.createdBy.email}
                                </div>
                              </div>
                            </div>
                          ) : (
                            <span className="text-gray-400">Unknown</span>
                          )}
                        </td>
                      )}
                      <td className="px-6 py-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          {new Date(email.createdAt).toLocaleString()}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Card View for mobile screens */}
            <div className="md:hidden space-y-4 p-4">
              {historyData.map((email) => (
                <div key={email._id} className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <button
                      onClick={() => {
                        setSelectedEmailContent(email.content);
                        setShowEmailViewModal(true);
                      }}
                      className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
                    >
                      <FileText className="w-4 h-4" />
                      {email.templateTitle || "Custom Email"}
                    </button>
                    <span className="text-xs text-gray-500">
                      <Clock className="w-3 h-3 inline mr-1" />
                      {new Date(email.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <p className="text-sm font-medium text-gray-900">{email.subject}</p>
                  
                  <div className="flex flex-wrap gap-3 text-sm">
                    <button
                      onClick={() => {
                        setSelectedRecipients(email.recipients);
                        setShowRecipientsModal(true);
                      }}
                      className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                    >
                      <Users className="w-4 h-4" />
                      {email.recipients.length} Recipients
                    </button>
                    
                    {email.attachments?.length > 0 && (
                      <button
                        onClick={() => {
                          setSelectedAttachments(email.attachments);
                          setShowAttachmentsModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                      >
                        <Paperclip className="w-4 h-4" />
                        {email.attachments.length} Files
                      </button>
                    )}
                  </div>

                  {currentUser?.role?.name === "Admin" && email.createdBy && (
                    <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                      <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-xs">
                        {email.createdBy.firstName?.charAt(0)}{email.createdBy.lastName?.charAt(0)}
                      </div>
                      <span className="text-sm text-gray-600">
                        {email.createdBy.firstName} {email.createdBy.lastName}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row justify-between items-center p-4 border-t bg-gray-50 gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Rows per page:</span>
                <select
                  value={historyLimit}
                  onChange={handleLimitChange}
                  className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                >
                  <option value={15}>15</option>
                  <option value={25}>25</option>
                  <option value={35}>35</option>
                  <option value={50}>50</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(historyPage - 1)}
                  disabled={historyPage === 1}
                  className={`px-3 py-1.5 rounded-md text-sm ${
                    historyPage === 1
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Previous
                </button>
                
                <div className="flex gap-1">
                  {Array.from({ length: historyTotalPages }, (_, i) => (
                    <button
                      key={i}
                      onClick={() => handlePageChange(i + 1)}
                      className={`w-8 h-8 flex items-center justify-center rounded-md text-sm ${
                        historyPage === i + 1
                          ? "bg-blue-600 text-white"
                          : "text-gray-700 hover:bg-gray-200 border border-gray-300"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => handlePageChange(historyPage + 1)}
                  disabled={historyPage === historyTotalPages}
                  className={`px-3 py-1.5 rounded-md text-sm ${
                    historyPage === historyTotalPages
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Recipients Modal */}
      {showRecipientsModal && selectedRecipients && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[80vh] overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-xl font-bold">Recipients</h3>
              <button
                onClick={() => {
                  setShowRecipientsModal(false);
                  setSelectedRecipients(null);
                }}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="space-y-3">
                {selectedRecipients.map((email, index) => {
                  const contact = allContacts.find(
                    (c) => c.email?.toLowerCase() === email.toLowerCase()
                  );
                  return (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium text-gray-900">
                          {contact?.name || "Unknown"}
                        </div>
                        <div className="text-sm text-gray-500">{email}</div>
                      </div>
                      <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">
                        Recipient
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Email Content Modal */}
      {showEmailViewModal && selectedEmailContent && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-xl font-bold">Email Preview</h3>
              <button
                onClick={() => {
                  setShowEmailViewModal(false);
                  setSelectedEmailContent(null);
                }}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[70vh]">
              <div
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: selectedEmailContent }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Attachments Modal */}
      {showAttachmentsModal && selectedAttachments.length > 0 && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
          <div className="bg-white rounded-lg w-full max-w-lg max-h-[80vh] overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-xl font-bold">Attachments</h3>
              <button
                onClick={() => {
                  setShowAttachmentsModal(false);
                  setSelectedAttachments([]);
                }}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto">
              <div className="space-y-3">
                {selectedAttachments.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Paperclip className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-900">{file.filename}</span>
                    </div>
                    <button
                      onClick={() => downloadAttachment(file)}
                      className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 flex items-center gap-1"
                    >
                      <Download className="w-3 h-3" />
                      Download
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default EmailHistory;