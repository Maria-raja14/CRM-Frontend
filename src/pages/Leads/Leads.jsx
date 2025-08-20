// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import axios from "axios";
// import { Pencil, MoreVertical, Trash2 } from "lucide-react";
// import { initSocket } from "../../utils/socket";

// export default function LeadTable() {
//   const navigate = useNavigate();
//   const [leads, setLeads] = useState([]);
//   const [selectedLeads, setSelectedLeads] = useState([]);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [leadToDelete, setLeadToDelete] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // Follow-up state
//   const [currentLeadId, setCurrentLeadId] = useState(null);
//   const [nextFollowUp, setNextFollowUp] = useState("");
//   const [showFollowUpModal, setShowFollowUpModal] = useState(false);


//     useEffect(() => {
//     // ✅ Initialize socket
//     initSocket();
//   }, []);
//   // Fetch leads from API
//   useEffect(() => {
//     const fetchLeads = async () => {
//       try {
//         const response = await fetch(
//           "http://localhost:5000/api/leads/getAllLead"
//         );
//         const data = await response.json();
//         setLeads(data);
//         setLoading(false);
//       } catch (error) {
//         setLoading(false);
//       }
//     };
//     fetchLeads();
//   }, []);

//   const saveFollowUp = async () => {
//     if (!nextFollowUp || !currentLeadId) return;
//     try {
//       const token = localStorage.getItem("token");
//       await axios.patch(
//         `http://localhost:5000/api/leads/${currentLeadId}/followup`,
//         { followUpDate: nextFollowUp },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       toast.success("Next follow-up updated");

//       setLeads((prev) =>
//         prev.map((lead) =>
//           lead._id === currentLeadId
//             ? { ...lead, followUpDate: nextFollowUp }
//             : lead
//         )
//       );
//       setCurrentLeadId(null);
//       setNextFollowUp("");
//     } catch (err) {
//       toast.error("Failed to update follow-up");
//     }
//   };

//   const handleDeleteLead = async (id) => {
//     try {
//       const response = await fetch(
//         `http://localhost:5000/api/leads/deleteLead/${id}`,
//         { method: "DELETE" }
//       );
//       if (response.ok) {
//         setLeads(leads.filter((lead) => lead._id !== id));
//         toast.success("Lead deleted successfully");
//       } else {
//         toast.error("Failed to delete lead");
//       }
//     } catch {
//       toast.error("Error deleting lead");
//     } finally {
//       setShowDeleteModal(false);
//     }
//   };

//   const handleBulkDelete = async () => {
//     try {
//       const responses = await Promise.all(
//         selectedLeads.map((id) =>
//           fetch(`http://localhost:5000/api/leads/deleteLead/${id}`, {
//             method: "DELETE",
//           })
//         )
//       );
//       const allSuccess = responses.every((res) => res.ok);
//       if (allSuccess) {
//         setLeads(leads.filter((lead) => !selectedLeads.includes(lead._id)));
//         setSelectedLeads([]);
//         toast.success(`${selectedLeads.length} leads deleted successfully`);
//       } else {
//         toast.error("Failed to delete some leads");
//       }
//     } catch {
//       toast.error("Error deleting leads");
//     } finally {
//       setShowDeleteModal(false);
//     }
//   };

//   const handleSelectLead = (id) => {
//     setSelectedLeads((prev) =>
//       prev.includes(id) ? prev.filter((leadId) => leadId !== id) : [...prev, id]
//     );
//   };

//   const handleSelectAll = (e) => {
//     if (e.target.checked) {
//       setSelectedLeads(leads.map((lead) => lead._id));
//     } else {
//       setSelectedLeads([]);
//     }
//   };

//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     return date.toLocaleDateString("en-US", {
//       month: "short",
//       day: "numeric",
//       year: "numeric",
//     });
//   };

//   const formatDateTime = (dateString) => {
//     const date = new Date(dateString);
//     return date.toLocaleString("en-US", {
//       month: "short",
//       day: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//     });
//   };

//   const getStatusBadge = (status) => {
//     const classes = {
//       Hot: "bg-red-100 text-red-800",
//       Warm: "bg-yellow-100 text-yellow-800",
//       Cold: "bg-blue-100 text-blue-800",
//     };
//     return (
//       <span
//         className={`px-2 py-1 rounded-full text-xs font-medium ${
//           classes[status] || "bg-gray-100 text-gray-800"
//         }`}
//       >
//         {status}
//       </span>
//     );
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//       </div>
//     );
//   }

//   return (
//    <div className="p-2 ">
//   {/* Header */}
//   <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
//     <h2 className="text-xl font-semibold text-gray-800">Leads</h2>
//     <div className="flex gap-3">
//       {selectedLeads.length > 0 && (
//         <button
//           onClick={() => {
//             setLeadToDelete(null);
//             setShowDeleteModal(true);
//           }}
//           className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow transition"
//         >
//           Delete Selected ({selectedLeads.length})
//         </button>
//       )}
//       <button
//         className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow transition"
//         onClick={() => navigate("/createleads")}
//       >
//         + Create Lead
//       </button>
//     </div>
//   </div>

//   {/* Table */}
//   <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
//     <table className="min-w-full text-sm text-gray-700">
//       <thead className="bg-gray-100 sticky top-0 shadow-sm">
//         <tr>
//           <th className="px-6 py-3 text-left">
//             <input
//               type="checkbox"
//               className="h-4 w-4 text-blue-600 border-gray-300 rounded"
//               checked={selectedLeads.length === leads.length && leads.length > 0}
//               onChange={handleSelectAll}
//             />
//           </th>
//           <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//             Lead
//           </th>
//           <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//             Contact
//           </th>
//           <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//             Company
//           </th>
//           <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//             Source
//           </th>
//           <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//             Status
//           </th>
//           <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//             Created
//           </th>
//           <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//             Follow Up
//           </th>
//           <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
//             Actions
//           </th>
//         </tr>
//       </thead>

//       <tbody className="divide-y divide-gray-200">
//         {leads.length > 0 ? (
//           leads.map((lead, idx) => (
//             <tr
//               key={lead._id}
//               className={`transition hover:bg-blue-50 ${
//                 idx % 2 === 0 ? "bg-white" : "bg-gray-50"
//               }`}
//             >
//               {/* Checkbox */}
//               <td className="px-6 py-4">
//                 <input
//                   type="checkbox"
//                   className="h-4 w-4 text-blue-600 border-gray-300 rounded"
//                   checked={selectedLeads.includes(lead._id)}
//                   onChange={() => handleSelectLead(lead._id)}
//                 />
//               </td>

//               {/* Lead Name */}
//               <td className="px-6 py-4 flex items-center gap-3">
//                 <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center shadow-sm">
//                   <span className="text-blue-600 font-semibold">
//                     {lead.leadName.charAt(0).toUpperCase()}
//                   </span>
//                 </div>
//                 <div>
//                   <div className="font-medium text-gray-900">
//                     {lead.leadName}
//                   </div>
//                   <div className="text-xs text-gray-500">
//                     {lead.email}
//                   </div>
//                 </div>
//               </td>

//               {/* Contact */}
//               <td className="px-6 py-4">
//                 <div className="text-gray-800">{lead.phoneNumber}</div>
//               </td>

//               {/* Company */}
//               <td className="px-6 py-4 text-gray-600">
//                 {lead.companyName || "-"}
//               </td>

//               {/* Source */}
//               <td className="px-6 py-4 text-gray-600">{lead.source || "-"}</td>

//               {/* Status */}
//               <td className="px-6 py-4">{getStatusBadge(lead.status)}</td>

//               {/* Created Date */}
//               <td className="px-6 py-4 text-gray-600">
//                 {lead.createdAt ? formatDate(lead.createdAt) : "-"}
//               </td>

//               {/* Follow-up */}
//               <td className="px-6 py-4">
//                 <div className="flex items-center gap-2">
//                   <span className="text-gray-700">
//                     {lead.followUpDate
//                       ? formatDateTime(lead.followUpDate)
//                       : "No follow-up"}
//                   </span>
//                   <button
//                     onClick={() => {
//                       setCurrentLeadId(lead._id);
//                       setNextFollowUp(
//                         lead.followUpDate
//                           ? new Date(lead.followUpDate)
//                               .toISOString()
//                               .slice(0, 16)
//                           : ""
//                       );
//                       setShowFollowUpModal(true);
//                     }}
//                     className="text-blue-600 hover:text-blue-800"
//                   >
//                     <Pencil className="w-4 h-4" />
//                   </button>
//                 </div>
//               </td>

//               {/* Actions */}
//               <td className="px-6 py-4 text-right">
//                 <button className="p-2 rounded-lg hover:bg-gray-200 transition">
//                   <MoreVertical className="w-5 h-5 text-gray-600" />
//                 </button>
//               </td>
//             </tr>
//           ))
//         ) : (
//           <tr>
//             <td
//               colSpan="9"
//               className="px-6 py-8 text-center text-gray-500 text-sm"
//             >
//               No leads found. Create your first lead!
//             </td>
//           </tr>
//         )}
//       </tbody>
//     </table>
//   </div>
// </div>

//   );
// }//original



import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { MoreVertical, Trash2, Edit } from "lucide-react";
import { initSocket } from "../../utils/socket";

export default function LeadTable() {
  const navigate = useNavigate();
  const [leads, setLeads] = useState([]);
  const [selectedLeads, setSelectedLeads] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [leadToDelete, setLeadToDelete] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalLeads, setTotalLeads] = useState(0);
  const [menuOpen, setMenuOpen] = useState(null);
  const itemsPerPage = 10;

  useEffect(() => {
    initSocket();
  }, []);

  // Fetch leads
  useEffect(() => {
    const fetchLeads = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:5000/api/leads/getAllLead?page=${currentPage}&limit=${itemsPerPage}`
        );
        if (response.data) {
          setLeads(response.data.leads || response.data);
          setTotalPages(response.data.totalPages || 1);
          setTotalLeads(response.data.totalLeads || response.data.length || 0);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching leads:", error);
        setLoading(false);
        toast.error("Failed to fetch leads");
      }
    };
    fetchLeads();
  }, [currentPage]);

  const handleMenuToggle = (leadId, e) => {
    e.stopPropagation();
    setMenuOpen(menuOpen === leadId ? null : leadId);
  };

  const handleEdit = (leadId) => {
    navigate(`/createleads?id=${leadId}`);
    setMenuOpen(null);
  };

  const handleDeleteClick = (leadId) => {
    setLeadToDelete(leadId);
    setShowDeleteModal(true);
    setMenuOpen(null);
  };

  const handleDeleteLead = async (id) => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/api/leads/deleteLead/${id}`
      );
      if (response.status === 200) {
        setLeads(leads.filter((lead) => lead._id !== id));
        toast.success("Lead deleted successfully");
        if (leads.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
      } else {
        toast.error("Failed to delete lead");
      }
    } catch (error) {
      toast.error("Error deleting lead");
    } finally {
      setShowDeleteModal(false);
      setLeadToDelete(null);
    }
  };

  const handleBulkDelete = async () => {
    try {
      const responses = await Promise.all(
        selectedLeads.map((id) =>
          axios.delete(`http://localhost:5000/api/leads/deleteLead/${id}`)
        )
      );
      const allSuccess = responses.every((res) => res.status === 200);
      if (allSuccess) {
        setLeads(leads.filter((lead) => !selectedLeads.includes(lead._id)));
        setSelectedLeads([]);
        toast.success(`${selectedLeads.length} leads deleted successfully`);
        if (leads.length === selectedLeads.length && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
      } else {
        toast.error("Failed to delete some leads");
      }
    } catch (error) {
      toast.error("Error deleting leads");
    } finally {
      setShowDeleteModal(false);
    }
  };

  const handleSelectLead = (id) => {
    setSelectedLeads((prev) =>
      prev.includes(id) ? prev.filter((leadId) => leadId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedLeads(leads.map((lead) => lead._id));
    } else {
      setSelectedLeads([]);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "No follow-up";
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status) => {
    const classes = {
      Hot: "bg-red-100 text-red-800",
      Warm: "bg-yellow-100 text-yellow-800",
      Cold: "bg-blue-100 text-blue-800",
      Junk: "bg-gray-100 text-gray-800",
    };
    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${
          classes[status] || "bg-gray-100 text-gray-800"
        }`}
      >
        {status}
      </span>
    );
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Close menu outside click
  useEffect(() => {
    const handleClickOutside = () => {
      setMenuOpen(null);
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-2">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <h2 className="text-xl font-semibold text-gray-800">Leads</h2>
        <div className="flex gap-3">
          {selectedLeads.length > 0 && (
            <button
              onClick={() => {
                setLeadToDelete(null);
                setShowDeleteModal(true);
              }}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow"
            >
              Delete Selected ({selectedLeads.length})
            </button>
          )}
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow"
            onClick={() => navigate("/createleads")}
          >
            + Create Lead
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
        <table className="min-w-full text-sm text-gray-700">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                  checked={selectedLeads.length === leads.length && leads.length > 0}
                  onChange={handleSelectAll}
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Lead</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Contact</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Company</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Source</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Created</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Follow Up</th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {leads.length > 0 ? (
              leads.map((lead, idx) => (
                <tr key={lead._id} className={`${idx % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                      checked={selectedLeads.includes(lead._id)}
                      onChange={() => handleSelectLead(lead._id)}
                    />
                  </td>

                  <td className="px-6 py-4 flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-blue-600 font-semibold">
                        {lead.leadName?.charAt(0).toUpperCase() || "L"}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{lead.leadName || "Unnamed Lead"}</div>
                      <div className="text-xs text-gray-500">{lead.email || "No email"}</div>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-gray-800">{lead.phoneNumber || "-"}</td>
                  <td className="px-6 py-4 text-gray-600">{lead.companyName || "-"}</td>
                  <td className="px-6 py-4 text-gray-600">{lead.source || "-"}</td>
                  <td className="px-6 py-4">{getStatusBadge(lead.status)}</td>
                  <td className="px-6 py-4 text-gray-600">{formatDate(lead.createdAt)}</td>
                  <td className="px-6 py-4 text-gray-700">{formatDateTime(lead.followUpDate)}</td>

                  <td className="px-6 py-4 text-right relative">
                    <div className="relative inline-block text-left">
                      <button
                        className="p-2 rounded-lg hover:bg-gray-200"
                        onClick={(e) => handleMenuToggle(lead._id, e)}
                      >
                        <MoreVertical className="w-5 h-5 text-gray-600" />
                      </button>

                      {menuOpen === lead._id && (
                        <div className="absolute right-0 mt-1 w-32 bg-white rounded-md shadow-lg border border-gray-200 z-20">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEdit(lead._id);
                            }}
                            className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <Edit className="w-4 h-4 mr-2" /> Edit
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteClick(lead._id);
                            }}
                            className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-gray-100"
                          >
                            <Trash2 className="w-4 h-4 mr-2" /> Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="px-6 py-8 text-center text-gray-500 text-sm">
                  No leads found. Create your first lead!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6 px-4 py-3 bg-white border-t border-gray-200 rounded-lg">
          <div className="text-sm text-gray-700">
            Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to {" "}
            <span className="font-medium">{Math.min(currentPage * itemsPerPage, totalLeads)}</span> of {" "}
            <span className="font-medium">{totalLeads}</span> results
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                currentPage === 1
                  ? "text-gray-400 bg-gray-100 cursor-not-allowed"
                  : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
              }`}
            >
              Previous
            </button>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                currentPage === totalPages
                  ? "text-gray-400 bg-gray-100 cursor-not-allowed"
                  : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {leadToDelete ? "Delete Lead" : "Delete Selected Leads"}
            </h3>
            <p className="text-gray-600 mb-6">
              {leadToDelete
                ? "Are you sure you want to delete this lead? This action cannot be undone."
                : `Are you sure you want to delete ${selectedLeads.length} leads? This action cannot be undone.`}
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setLeadToDelete(null);
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (leadToDelete) {
                    handleDeleteLead(leadToDelete);
                  } else {
                    handleBulkDelete();
                  }
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
