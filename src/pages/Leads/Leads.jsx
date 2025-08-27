// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import axios from "axios";
// import { MoreVertical, Trash2, Edit } from "lucide-react";
// import { initSocket } from "../../utils/socket";

// export default function LeadTable() {
//   const navigate = useNavigate();
//   const [leads, setLeads] = useState([]);
//   const [selectedLeads, setSelectedLeads] = useState([]);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [leadToDelete, setLeadToDelete] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [totalLeads, setTotalLeads] = useState(0);
//   const [menuOpen, setMenuOpen] = useState(null);
//   const itemsPerPage = 10;

//   // Convert Deal Modal state
//   const [convertModalOpen, setConvertModalOpen] = useState(false);
//   const [selectedLead, setSelectedLead] = useState(null);
//   const [dealData, setDealData] = useState({ value: 0, notes: "", followUpDate: "" });

//   useEffect(() => { initSocket(); }, []);

//   // Fetch leads
//   useEffect(() => {
//     const fetchLeads = async () => {
//       try {
//         setLoading(true);
//         const response = await axios.get(
//           `http://localhost:5000/api/leads/getAllLead?page=${currentPage}&limit=${itemsPerPage}`
//         );
//         if (response.data) {
//           setLeads(response.data.leads || response.data);
//           setTotalPages(response.data.totalPages || 1);
//           setTotalLeads(response.data.totalLeads || response.data.length || 0);
//         }
//         setLoading(false);
//       } catch (error) {
//         console.error("Error fetching leads:", error);
//         setLoading(false);
//         toast.error("Failed to fetch leads");
//       }
//     };
//     fetchLeads();
//   }, [currentPage]);

//   // Menu toggle
//   const handleMenuToggle = (leadId, e) => {
//     e.stopPropagation();
//     setMenuOpen(menuOpen === leadId ? null : leadId);
//   };

//   const handleEdit = (leadId) => {
//     navigate(`/createleads?id=${leadId}`);
//     setMenuOpen(null);
//   };

//   const handleDeleteClick = (leadId) => {
//     setLeadToDelete(leadId);
//     setShowDeleteModal(true);
//     setMenuOpen(null);
//   };

//   const handleDeleteLead = async (id) => {
//     try {
//       const response = await axios.delete(`http://localhost:5000/api/leads/deleteLead/${id}`);
//       if (response.status === 200) {
//         setLeads(leads.filter((lead) => lead._id !== id));
//         toast.success("Lead deleted successfully");
//         if (leads.length === 1 && currentPage > 1) setCurrentPage(currentPage - 1);
//       } else toast.error("Failed to delete lead");
//     } catch (error) {
//       toast.error("Error deleting lead");
//     } finally {
//       setShowDeleteModal(false);
//       setLeadToDelete(null);
//     }
//   };

//   const handleBulkDelete = async () => {
//     try {
//       const responses = await Promise.all(
//         selectedLeads.map((id) =>
//           axios.delete(`http://localhost:5000/api/leads/deleteLead/${id}`)
//         )
//       );
//       const allSuccess = responses.every((res) => res.status === 200);
//       if (allSuccess) {
//         setLeads(leads.filter((lead) => !selectedLeads.includes(lead._id)));
//         setSelectedLeads([]);
//         toast.success(`${selectedLeads.length} leads deleted successfully`);
//         if (leads.length === selectedLeads.length && currentPage > 1) setCurrentPage(currentPage - 1);
//       } else toast.error("Failed to delete some leads");
//     } catch (error) {
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
//     if (e.target.checked) setSelectedLeads(leads.map((lead) => lead._id));
//     else setSelectedLeads([]);
//   };

//   // Convert Deal Modal handlers
//   const openConvertModal = (lead) => {
//     setSelectedLead(lead);
//     setDealData({
//       value: lead.value || 0,
//       notes: lead.notes || "",
//       followUpDate: lead.followUpDate ? new Date(lead.followUpDate).toISOString().slice(0, 16) : "",
//     });
//     setConvertModalOpen(true);
//     setMenuOpen(null);
//   };

//   const handleDealChange = (e) => {
//     const { name, value } = e.target;
//     setDealData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleConvertDeal = async () => {
//     if (!selectedLead) return;

//     try {
//       const payload = {
//         ...dealData,
//         followUpDate: dealData.followUpDate ? new Date(dealData.followUpDate) : null,
//       };

//       await axios.patch(
//         `http://localhost:5000/api/leads/${selectedLead._id}/convert`,
//         payload
//       );

//       toast.success("Lead converted to deal");
//       setLeads(leads.filter(l => l._id !== selectedLead._id));
//       setConvertModalOpen(false);
//       setSelectedLead(null);
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Conversion failed");
//     }
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return "-";
//     const date = new Date(dateString);
//     return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
//   };

//   const formatDateTime = (dateString) => {
//     if (!dateString) return "No follow-up";
//     const date = new Date(dateString);
//     return date.toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
//   };

//   const getStatusBadge = (status) => {
//     const classes = {
//       Hot: "bg-red-100 text-red-800",
//       Warm: "bg-yellow-100 text-yellow-800",
//       Cold: "bg-blue-100 text-blue-800",
//       Junk: "bg-gray-100 text-gray-800",
//       Converted: "bg-green-100 text-green-800",
//     };
//     return (
//       <span className={`px-2 py-1 rounded-full text-xs font-medium ${classes[status] || "bg-gray-100 text-gray-800"}`}>
//         {status}
//       </span>
//     );
//   };

//   const handlePageChange = (newPage) => {
//     if (newPage > 0 && newPage <= totalPages) setCurrentPage(newPage);
//   };

//   // Close menu on outside click
//   useEffect(() => {
//     const handleClickOutside = () => setMenuOpen(null);
//     document.addEventListener("click", handleClickOutside);
//     return () => document.removeEventListener("click", handleClickOutside);
//   }, []);

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="p-2">
//       {/* Header */}
//       <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
//         <h2 className="text-xl font-semibold text-gray-800">Leads</h2>
//         <div className="flex gap-3">
//           {selectedLeads.length > 0 && (
//             <button
//               onClick={() => { setLeadToDelete(null); setShowDeleteModal(true); }}
//               className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow"
//             >
//               Delete Selected ({selectedLeads.length})
//             </button>
//           )}
//           <button
//             className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow"
//             onClick={() => navigate("/createleads")}
//           >
//             + Create Lead
//           </button>
//         </div>
//       </div>

//       {/* Table */}
//       <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
//         <table className="min-w-full text-sm text-gray-700">
//           <thead className="bg-gray-100">
//             <tr>
//               <th className="px-6 py-3">
//                 <input
//                   type="checkbox"
//                   className="h-4 w-4 text-blue-600 border-gray-300 rounded"
//                   checked={selectedLeads.length === leads.length && leads.length > 0}
//                   onChange={handleSelectAll}
//                 />
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Lead</th>
//               <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Contact</th>
//               <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Company</th>
//               <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Source</th>
//               <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
//               <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Created</th>
//               <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Follow Up</th>
//               <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Actions</th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-gray-200">
//             {leads.length > 0 ? (
//               leads.map((lead, idx) => (
//                 <tr key={lead._id} className={`${idx % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
//                   <td className="px-6 py-4">
//                     <input
//                       type="checkbox"
//                       className="h-4 w-4 text-blue-600 border-gray-300 rounded"
//                       checked={selectedLeads.includes(lead._id)}
//                       onChange={() => handleSelectLead(lead._id)}
//                     />
//                   </td>
//                   <td className="px-6 py-4 flex items-center gap-3">
//                     <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
//                       <span className="text-blue-600 font-semibold">
//                         {lead.leadName?.charAt(0).toUpperCase() || "L"}
//                       </span>
//                     </div>
//                     <div>
//                       <div className="font-medium text-gray-900">{lead.leadName || "Unnamed Lead"}</div>
//                       <div className="text-xs text-gray-500">{lead.email || "No email"}</div>
//                     </div>
//                   </td>
//                   <td className="px-6 py-4 text-gray-800">{lead.phoneNumber || "-"}</td>
//                   <td className="px-6 py-4 text-gray-600">{lead.companyName || "-"}</td>
//                   <td className="px-6 py-4 text-gray-600">{lead.source || "-"}</td>
//                   <td className="px-6 py-4">{getStatusBadge(lead.status)}</td>
//                   <td className="px-6 py-4 text-gray-600">{formatDate(lead.createdAt)}</td>
//                   <td className="px-6 py-4 text-gray-700">{formatDateTime(lead.followUpDate)}</td>
//                   <td className="px-6 py-4 text-right relative">
//                     <div className="relative inline-block text-left">
//                       <button
//                         className="p-2 rounded-lg hover:bg-gray-200"
//                         onClick={(e) => handleMenuToggle(lead._id, e)}
//                       >
//                         <MoreVertical className="w-5 h-5 text-gray-600" />
//                       </button>

//                       {menuOpen === lead._id && (
//                         <div className="absolute right-0 mt-1 w-36 bg-white rounded-md shadow-lg border border-gray-200 z-20">
//                           <button
//                             onClick={(e) => { e.stopPropagation(); handleEdit(lead._id); }}
//                             className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
//                           >
//                             <Edit className="w-4 h-4 mr-2" /> Edit
//                           </button>
//                           {lead.status !== "Converted" && (
//                             <button
//                               onClick={(e) => { e.stopPropagation(); openConvertModal(lead); }}
//                               className="flex items-center w-full px-3 py-2 text-sm text-green-600 hover:bg-gray-100"
//                             >
//                               <span className="w-4 h-4 mr-2"></span> Convert Deal
//                             </button>
//                           )}
//                           <button
//                             onClick={(e) => { e.stopPropagation(); handleDeleteClick(lead._id); }}
//                             className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-gray-100"
//                           >
//                             <Trash2 className="w-4 h-4 mr-2" /> Delete
//                           </button>
//                         </div>
//                       )}
//                     </div>
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="9" className="px-6 py-8 text-center text-gray-500 text-sm">
//                   No leads found. Create your first lead!
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* Pagination */}
//       {totalPages > 1 && (
//         <div className="flex items-center justify-between mt-6 px-4 py-3 bg-white border-t border-gray-200">
//           <div>
//             <p className="text-sm text-gray-700">
//               Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
//               {Math.min(currentPage * itemsPerPage, totalLeads)} of {totalLeads} results
//             </p>
//           </div>
//           <div className="flex gap-2">
//             <button
//               onClick={() => handlePageChange(currentPage - 1)}
//               disabled={currentPage === 1}
//               className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50"
//             >
//               Previous
//             </button>
//             <button
//               onClick={() => handlePageChange(currentPage + 1)}
//               disabled={currentPage === totalPages}
//               className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50"
//             >
//               Next
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Delete Modal */}
//       {showDeleteModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white p-6 rounded shadow-lg w-80">
//             <h2 className="text-lg font-semibold mb-4">Confirm Delete</h2>
//             <p className="mb-6">
//               Are you sure you want to delete {leadToDelete ? "this lead" : selectedLeads.length + " leads"}?
//             </p>
//             <div className="flex justify-end gap-3">
//               <button
//                 onClick={() => { setShowDeleteModal(false); setLeadToDelete(null); }}
//                 className="px-4 py-2 rounded border hover:bg-gray-100"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={() => leadToDelete ? handleDeleteLead(leadToDelete) : handleBulkDelete()}
//                 className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
//               >
//                 Delete
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Convert Deal Modal */}
//       {convertModalOpen && selectedLead && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white p-6 rounded shadow-lg w-96">
//             <h2 className="text-lg font-semibold mb-4">Convert Lead to Deal</h2>
//             <p className="mb-4">Lead: <strong>{selectedLead.leadName}</strong></p>

//             <div className="mb-4">
//               <label className="block text-sm font-medium text-gray-700 mb-1">Deal Value</label>
//               <input
//                 type="number"
//                 name="value"
//                 value={dealData.value}
//                 onChange={handleDealChange}
//                 className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//             </div>

//             <div className="mb-4">
//               <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
//               <textarea
//                 name="notes"
//                 value={dealData.notes}
//                 onChange={handleDealChange}
//                 className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 rows={4}
//               />
//             </div>

//             <div className="mb-4">
//               <label className="block text-sm font-medium text-gray-700 mb-1">Follow-Up Date</label>
//               <input
//                 type="datetime-local"
//                 name="followUpDate"
//                 value={dealData.followUpDate}
//                 onChange={handleDealChange}
//                 className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//             </div>

//             <div className="flex justify-end gap-3">
//               <button
//                 onClick={() => { setConvertModalOpen(false); setSelectedLead(null); }}
//                 className="px-4 py-2 rounded border hover:bg-gray-100"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleConvertDeal}
//                 className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
//               >
//                 Save & Convert
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }//original

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import {
  MoreVertical,
  Trash2,
  Edit,
  Handshake,
  Search,
  Filter,
  X,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { initSocket } from "../../utils/socket";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";

export default function LeadTable() {
  const navigate = useNavigate();

  const [leads, setLeads] = useState([]);
  const [allLeads, setAllLeads] = useState([]); // Store all leads for filtering
  const [selectedLeads, setSelectedLeads] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [leadToDelete, setLeadToDelete] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalLeads, setTotalLeads] = useState(0);
  const [menuOpen, setMenuOpen] = useState(null);

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [assigneeFilter, setAssigneeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sourceFilter, setSourceFilter] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [assignees, setAssignees] = useState([]);

  const itemsPerPage = 10;

  // Convert Deal Modal state
  const [convertModalOpen, setConvertModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [dealData, setDealData] = useState({
    value: 0,
    notes: "",
    followUpDate: "",
  });

  useEffect(() => {
    initSocket();
  }, []);

  // Fetch leads with pagination only
  useEffect(() => {
    const fetchLeads = async () => {
      try {
        setLoading(true);

        const params = new URLSearchParams();
        params.append("page", currentPage);
        params.append("limit", itemsPerPage);

        const response = await axios.get(
          `http://localhost:5000/api/leads/getAllLead?${params.toString()}`
        );
        if (response.data) {
          const leadsData = response.data.leads || response.data;
          setLeads(leadsData);
          setAllLeads(leadsData); // Store all leads for client-side filtering
          setTotalPages(response.data.totalPages || 1);
          setTotalLeads(response.data.totalLeads || response.data.length || 0);

          // Extract unique assignees
          const uniqueAssignees = [
            ...new Set(
              leadsData
                .filter((lead) => lead.assignTo)
                .map((lead) => {
                  if (
                    typeof lead.assignTo === "object" &&
                    lead.assignTo.firstName
                  ) {
                    return `${lead.assignTo.firstName} ${lead.assignTo.lastName}`;
                  }
                  return "Assigned User";
                })
            ),
          ];
          setAssignees(uniqueAssignees);
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

  // Apply filters whenever filter criteria change
  useEffect(() => {
    const filtered = allLeads.filter((lead) => {
      // Search filter
      const matchesSearch =
        !searchQuery ||
        lead.leadName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.phoneNumber?.includes(searchQuery) ||
        lead.companyName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.source?.toLowerCase().includes(searchQuery.toLowerCase());

      // Assignee filter
      const matchesAssignee =
        !assigneeFilter ||
        (lead.assignTo &&
          ((typeof lead.assignTo === "object" &&
            lead.assignTo.firstName &&
            `${lead.assignTo.firstName} ${lead.assignTo.lastName}` ===
              assigneeFilter) ||
            (typeof lead.assignTo === "string" &&
              assigneeFilter === "Assigned User")));

      // Status filter
      const matchesStatus = !statusFilter || lead.status === statusFilter;

      // Source filter
      const matchesSource = !sourceFilter || lead.source === sourceFilter;

      return matchesSearch && matchesAssignee && matchesStatus && matchesSource;
    });

    setLeads(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchQuery, assigneeFilter, statusFilter, sourceFilter, allLeads]);

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
        setAllLeads(allLeads.filter((lead) => lead._id !== id));
        toast.success("Lead deleted successfully");
        if (leads.length === 1 && currentPage > 1)
          setCurrentPage(currentPage - 1);
      } else toast.error("Failed to delete lead");
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
        setAllLeads(
          allLeads.filter((lead) => !selectedLeads.includes(lead._id))
        );
        setSelectedLeads([]);
        toast.success(`${selectedLeads.length} leads deleted successfully`);
        if (leads.length === selectedLeads.length && currentPage > 1)
          setCurrentPage(currentPage - 1);
      } else toast.error("Failed to delete some leads");
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
    if (e.target.checked) setSelectedLeads(leads.map((lead) => lead._id));
    else setSelectedLeads([]);
  };

  // Convert Deal Modal handlers
  const openConvertModal = (lead) => {
    setSelectedLead(lead);
    setDealData({
      value: lead.value || 0,
      notes: lead.notes || "",
      followUpDate: lead.followUpDate
        ? new Date(lead.followUpDate).toISOString().slice(0, 16)
        : "",
    });
    setConvertModalOpen(true);
    setMenuOpen(null);
  };

  const handleDealChange = (e) => {
    const { name, value } = e.target;
    setDealData((prev) => ({ ...prev, [name]: value }));
  };

  const handleConvertDeal = async () => {
    if (!selectedLead) return;
    try {
      const payload = {
        ...dealData,
        followUpDate: dealData.followUpDate
          ? new Date(dealData.followUpDate)
          : null,
      };
      await axios.patch(
        `http://localhost:5000/api/leads/${selectedLead._id}/convert`,
        payload
      );
      toast.success("Lead converted to deal ✅");
      setLeads(leads.filter((l) => l._id !== selectedLead._id));
      setAllLeads(allLeads.filter((l) => l._id !== selectedLead._id));
      setConvertModalOpen(false);
      setSelectedLead(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Conversion failed");
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
      Converted: "bg-green-100 text-green-800",
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
    if (newPage > 0 && newPage <= totalPages) setCurrentPage(newPage);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setAssigneeFilter("");
    setStatusFilter("");
    setSourceFilter("");
  };

  useEffect(() => {
    const handleClickOutside = () => setMenuOpen(null);
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
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Leads</h2>
        </div>

        <div className="flex flex-wrap gap-3 items-center">
          {selectedLeads.length > 0 && (
            <button
              onClick={() => {
                setLeadToDelete(null);
                setShowDeleteModal(true);
              }}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Delete Selected ({selectedLeads.length})
            </button>
          )}
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow flex items-center gap-2"
            onClick={() => navigate("/createleads")}
          >
            <span>+</span> Create Lead
          </button>
        </div>
      </div>

      {/* Search and Filters - Moved to top right */}
      <div className="mb-6 ">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Assignee */}
          <div>
            <select
              value={assigneeFilter}
              onChange={(e) => setAssigneeFilter(e.target.value)}
              className="w-full p-2 border shadow-lg  rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="">All Assignees</option>
              {assignees.map((assignee, index) => (
                <option key={index} value={assignee}>
                  {assignee}
                </option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full p-2 border shadow-2xl rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="">All Statuses</option>
              <option value="Hot">Hot</option>
              <option value="Warm">Warm</option>
              <option value="Cold">Cold</option>
              <option value="Junk">Junk</option>
              <option value="Converted">Converted</option>
            </select>
          </div>

          {/* Search */}
          <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg ml-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search leads..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-4 py-2 border rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm bg-white">
        <table className="min-w-full text-sm text-gray-700">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                  checked={
                    selectedLeads.length === leads.length && leads.length > 0
                  }
                  onChange={handleSelectAll}
                />
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Lead
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Contact
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Company
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Source
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Assign To
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Created
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Follow Up
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {leads.length > 0 ? (
              leads.map((lead, idx) => (
                <tr
                  key={lead._id}
                  className={`hover:bg-gray-50 ${
                    idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                  }`}
                >
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                      checked={selectedLeads.includes(lead._id)}
                      onChange={() => handleSelectLead(lead._id)}
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-blue-600 font-semibold">
                          {lead.leadName?.charAt(0).toUpperCase() || "L"}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {lead.leadName || "Unnamed Lead"}
                        </div>
                        <div className="text-xs text-gray-500">
                          {lead.email || "No email"}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-800">
                    {lead.phoneNumber || "-"}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {lead.companyName || "-"}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {lead.source || "-"}
                  </td>
                  <td className="px-6 py-4">{getStatusBadge(lead.status)}</td>
                  <td className="px-6 py-4 text-gray-700">
                    {lead.assignTo
                      ? typeof lead.assignTo === "object" &&
                        lead.assignTo.firstName
                        ? `${lead.assignTo.firstName} ${lead.assignTo.lastName}`
                        : typeof lead.assignTo === "string"
                        ? "Assigned User"
                        : "-"
                      : "-"}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {formatDate(lead.createdAt)}
                  </td>
                  <td className="px-6 py-4 text-gray-700">
                    {formatDateTime(lead.followUpDate)}
                  </td>
                  <td className="px-6 py-4 text-right relative">
                    <div className="relative inline-block text-left">
                      <button
                        className="p-2 rounded-lg hover:bg-gray-200 transition-colors"
                        onClick={(e) => handleMenuToggle(lead._id, e)}
                      >
                        <MoreVertical className="w-5 h-5 text-gray-600" />
                      </button>
                      {menuOpen === lead._id && (
                        <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-20 py-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEdit(lead._id);
                            }}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <Edit className="w-4 h-4 mr-2" /> Edit Lead
                          </button>
                          {lead.status !== "Converted" && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                openConvertModal(lead);
                              }}
                              className="flex items-center w-full px-4 py-2 text-sm text-green-600 hover:bg-gray-100"
                            >
                              <Handshake className="w-4 h-4 mr-2" /> Convert to
                              Deal
                            </button>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteClick(lead._id);
                            }}
                            className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
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
                <td
                  colSpan="10"
                  className="px-6 py-12 text-center text-gray-500 text-sm"
                >
                  {searchQuery || assigneeFilter || statusFilter || sourceFilter
                    ? "No leads match your filters. Try adjusting your search criteria."
                    : "No leads found. Create your first lead!"}
                  <div className="mt-4">
                    <button
                      className="text-blue-600 hover:text-blue-800 font-medium"
                      onClick={clearFilters}
                    >
                      Clear all filters
                    </button>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between mt-6 px-4 py-3 bg-white border-t border-gray-200 rounded-b-xl">
          <div className="mb-4 sm:mb-0">
            <p className="text-sm text-gray-700">
              Showing{" "}
              <span className="font-medium">
                {(currentPage - 1) * itemsPerPage + 1}
              </span>{" "}
              to{" "}
              <span className="font-medium">
                {Math.min(currentPage * itemsPerPage, totalLeads)}
              </span>{" "}
              of <span className="font-medium">{totalLeads}</span> results
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 border rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              Previous
            </button>
            <div className="flex items-center">
              <span className="px-2 py-2 text-gray-600">Page</span>
              <span className="px-2 py-1 border rounded bg-gray-50 font-medium">
                {currentPage}
              </span>
              <span className="px-2 py-2 text-gray-600">of {totalPages}</span>
            </div>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <Trash2 className="w-5 h-5" />
              Confirm Delete
            </DialogTitle>
          </DialogHeader>
          <p className="mb-6 text-gray-700">
            Are you sure you want to delete{" "}
            {leadToDelete
              ? "this lead"
              : `${selectedLeads.length} selected leads`}
            ? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => {
                setShowDeleteModal(false);
                setLeadToDelete(null);
              }}
              className="px-4 py-2 rounded-lg border hover:bg-gray-100 text-gray-700"
            >
              Cancel
            </button>
            <button
              onClick={() =>
                leadToDelete
                  ? handleDeleteLead(leadToDelete)
                  : handleBulkDelete()
              }
              className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Convert Deal Modal */}
      <Dialog open={convertModalOpen} onOpenChange={setConvertModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-green-600">
              <Handshake className="w-5 h-5" />
              Convert Lead to Deal
            </DialogTitle>
          </DialogHeader>
          {selectedLead && (
            <>
              <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  Converting: <strong>{selectedLead.leadName}</strong>
                  {selectedLead.companyName &&
                    ` from ${selectedLead.companyName}`}
                </p>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Deal Value
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-gray-500">
                    $
                  </span>
                  <input
                    type="number"
                    name="value"
                    value={dealData.value}
                    onChange={handleDealChange}
                    className="w-full pl-7 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  name="notes"
                  value={dealData.notes}
                  onChange={handleDealChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Add any additional details about this deal..."
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Follow-Up Date & Time
                </label>
                <input
                  type="datetime-local"
                  name="followUpDate"
                  value={dealData.followUpDate}
                  onChange={handleDealChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setConvertModalOpen(false);
                    setSelectedLead(null);
                  }}
                  className="px-4 py-2 rounded-lg border hover:bg-gray-100 text-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConvertDeal}
                  className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 flex items-center gap-2"
                >
                  <Handshake className="w-4 h-4" />
                  Convert to Deal
                </button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
