// import React, { useState, useEffect } from "react";
// import DatePicker from "react-datepicker";
// import { FaCalendarAlt } from "react-icons/fa";
// import { Link, useNavigate, useLocation } from "react-router-dom";
// import axios from "axios";
// import { BsThreeDotsVertical } from "react-icons/bs";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import "react-datepicker/dist/react-datepicker.css";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "../../components/ui/dialog";

// // Helper for status styling
// const STATUS_STYLES = {
//   draft: "bg-orange-50 text-orange-700 border-orange-200",
//   sent: "bg-blue-50 text-blue-700 border-blue-200",
//   "no reply": "bg-gray-50 text-gray-500 border-gray-200",
//   rejection: "bg-red-50 text-red-600 border-red-200",
//   success: "bg-green-50 text-green-700 border-green-200",
// };

// const PAGE_SIZE = 5; // Number of proposals per page

// const ProposalHead = () => {
//   const [proposals, setProposals] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [openActionId, setOpenActionId] = useState(null);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filterEmail, setFilterEmail] = useState("");
//   const [filterStatus, setFilterStatus] = useState("");
//   const [filterCreatedDate, setFilterCreatedDate] = useState(null);
//   const [filterTitle, setFilterTitle] = useState("");
//   const [filterDealTitle, setFilterDealTitle] = useState("");
//   const [isUpdating, setIsUpdating] = useState({});
//   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
//   const [proposalToDelete, setProposalToDelete] = useState(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [draftCount, setDraftCount] = useState(0);

//   const navigate = useNavigate();
//   const location = useLocation();

//   useEffect(() => {
//     const fetchProposals = async () => {
//       setLoading(true);
//       try {
//         const response = await axios.get(
//           "http://localhost:5000/api/proposal/getall"
//         );
//         setProposals(response.data);

//         // Count draft proposals
//         const draftProposals = response.data.filter(p => p.status === "draft");
//         setDraftCount(draftProposals.length);

//         setError("");
//       } catch {
//         setError("Failed to load proposals.");
//         toast.error("Failed to load proposals.");
//       }
//       setLoading(false);
//     };
//     fetchProposals();
//   }, []);

//   // Status change with feedback and toast on top-right
//   const handleStatusChange = async (id, newStatus) => {
//     setIsUpdating((prev) => ({ ...prev, [id]: true }));
//     try {
//       await axios.put(`http://localhost:5000/api/proposal/updatestatus/${id}`, {
//         status: newStatus,
//       });

//       setProposals((prev) => {
//         const updated = prev.map((p) => (p._id === id ? { ...p, status: newStatus } : p));

//         // Update draft count
//         const draftProposals = updated.filter(p => p.status === "draft");
//         setDraftCount(draftProposals.length);

//         return updated;
//       });

//       // Place toast notification at top-right for specified statuses
//       toast.success(`Status updated to ${newStatus}`, {
//         position: "top-right",
//       });
//     } catch {
//       toast.error("Failed to update status.");
//     }
//     setIsUpdating((prev) => ({ ...prev, [id]: false }));
//   };

//   // Delete proposal with feedback
//   const handleDelete = async () => {
//     if (!proposalToDelete) return;

//     try {
//       await axios.delete(
//         `http://localhost:5000/api/proposal/delete/${proposalToDelete}`
//       );
//       setProposals((prev) => {
//         const updated = prev.filter((p) => p._id !== proposalToDelete);

//         // Update draft count
//         const draftProposals = updated.filter(p => p.status === "draft");
//         setDraftCount(draftProposals.length);

//         return updated;
//       });
//       toast.success("Proposal deleted successfully.");
//     } catch {
//       toast.error("Failed to delete proposal.");
//     }
//     setDeleteDialogOpen(false);
//     setProposalToDelete(null);
//   };

//   // Open delete confirmation dialog
//   const openDeleteDialog = (id) => {
//     setProposalToDelete(id);
//     setDeleteDialogOpen(true);
//     setOpenActionId(null);
//   };

//   // Go to edit proposal
//   const handleEdit = (proposalId) => {
//     const selectedProposal = proposals.find((p) => p._id === proposalId);
//     navigate("/proposal/sendproposal", {
//       state: { proposal: selectedProposal, isEditing: true },
//     });
//   };

//   // Filtering logic
//   const filteredProposals = proposals.filter((proposal) => {
//     const search = searchTerm.toLowerCase();
//     const matchesSearch =
//       proposal.title?.toLowerCase().includes(search) ||
//       proposal.email?.toLowerCase().includes(search) ||
//       proposal.dealTitle?.toLowerCase().includes(search);

//     const matchesFilters =
//       (filterEmail === "" ||
//         proposal.email?.toLowerCase().includes(filterEmail.toLowerCase())) &&
//       (filterStatus === "" || proposal.status === filterStatus) &&
//       (filterCreatedDate === null ||
//         (proposal.createdAt &&
//           new Date(proposal.createdAt).toLocaleDateString() ===
//             new Date(filterCreatedDate).toLocaleDateString())) &&
//       (filterTitle === "" ||
//         proposal.title?.toLowerCase().includes(filterTitle.toLowerCase())) &&
//       (filterDealTitle === "" ||
//         proposal.dealTitle
//           ?.toLowerCase()
//           .includes(filterDealTitle.toLowerCase()));

//     return matchesSearch && matchesFilters;
//   });

//   // Pagination logic
//   const totalProposals = filteredProposals.length;
//   const totalPages = Math.ceil(totalProposals / PAGE_SIZE);

//   const currentPageProposals = filteredProposals.slice(
//     (currentPage - 1) * PAGE_SIZE,
//     currentPage * PAGE_SIZE
//   );

//   const goToPreviousPage = () => {
//     setCurrentPage((page) => Math.max(1, page - 1));
//   };

//   const goToNextPage = () => {
//     setCurrentPage((page) => Math.min(totalPages, page + 1));
//   };

//   useEffect(() => {
//     // Reset to first page when filters/search change
//     setCurrentPage(1);
//   }, [
//     searchTerm,
//     filterEmail,
//     filterStatus,
//     filterCreatedDate,
//     filterTitle,
//     filterDealTitle,
//   ]);

//   return (
//     <div className="min-h-screen bg-gray-50 py-8 px-2 md:px-10">
//       {/* Header */}
//       <div className="flex flex-col lg:flex-row items-center justify-between mb-8 gap-2">
//         <h1 className="text-3xl font-extrabold tracking-tight text-black">
//           Proposal List
//         </h1>
//         <div className="flex gap-3 items-center">
//           <Link to="/proposal/drafts" title="View Draft Proposals">
//             <button className="bg-white hover:bg-indigo-50 border border-indigo-100 shadow-sm p-2 rounded-full relative">
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 height="20"
//                 viewBox="0 -960 960 960"
//                 width="20"
//                 fill="#6068ec"
//               >
//                 <path d="M219-144q-29 0-52-23t-23-52v-525q0-29.7 21.5-50.85Q187-816 216-816h528q29.7 0 50.85 21.15Q816-773.7 816-744v528q0 29-21.15 50.5T744-144H219Zm-3-72h228v-528H216v528Zm300 0h228v-264H516v264Zm0-336h228v-192H516v192Z" />
//               </svg>
//               {draftCount > 0 && (
//                 <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
//                   {draftCount}
//                 </span>
//               )}
//             </button>
//           </Link>
//           <Link to="/stage" title="Go to Stage">
//             {/* <button className="bg-white hover:bg-gray-100 border border-gray-200 p-2 rounded-full">
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 height="20"
//                 viewBox="0 -960 960 960"
//                 width="20"
//                 fill="#888"
//               >
//                 <path d="M600-144q-29.7 0-50.85-21.15Q528-186.3 528-216v-528q0-29 21.15-50.5T600-816h144q29 0 50.5 21.5T816-744v528q0 29.7-21.5 50.85Q773-144 744-144H600Zm-384 0q-29.7 0-50.85-21.15Q144-186.3 144-216v-528q0-29 21.15-50.5T216-816h144q29 0 50.5 21.5T432-744v528q0 29.7-21.5 50.85Q389-144 360-144H216Zm0-600v528h144v-528H216Z" />
//               </svg>
//             </button> */}
//           </Link>
//           <Link to="/proposal/sendproposal">
//             <button className="bg-blue-600 hover:bg-blue-700 transition px-4 py-2 text-white font-semibold rounded-lg shadow-lg">
//               + New Proposal
//             </button>
//           </Link>
//         </div>
//       </div>

//       {/* Filter Bar */}
//       <div className=" p-6 mb-6 flex justify-between">
//         <select
//           value={filterStatus}
//           onChange={(e) => setFilterStatus(e.target.value)}
//           className="px-4 py-3 border border-gray-200 rounded-lg text-sm focus:ring-indigo-100 shadow-md"
//         >
//           <option value="">All Status</option>
//           <option value="draft">Draft</option>
//           <option value="sent">Sent</option>
//           <option value="no reply">No Reply</option>
//           <option value="rejection">Rejection</option>
//           <option value="success">Success</option>
//         </select>
//         <div className="relative flex items-center">
//           <DatePicker
//             selected={filterCreatedDate ? new Date(filterCreatedDate) : null}
//             onChange={(date) => setFilterCreatedDate(date)}
//             dateFormat="yyyy/MM/dd"
//             placeholderText="Created Date"
//             className="px-3 py-3 border border-gray-200 rounded-lg text-sm focus:ring-indigo-100 w-full shadow-md"
//           />
//           <FaCalendarAlt className="absolute right-3 text-gray-400" />
//         </div>

//         <div className="relative flex items-center">
//           <input
//             type="text"
//             placeholder="Search..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="px-3 py-3 border shadow-md border-gray-200 rounded-full text-sm focus:ring-indigo-100 w-full pl-10"
//           />
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             fill="none"
//             viewBox="0 0 24 24"
//             strokeWidth="1.5"
//             stroke="currentColor"
//             className="w-4 h-4 text-gray-400 absolute left-3"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z"
//             />
//           </svg>
//         </div>
//       </div>

//       <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm bg-white ">
//         <table className="min-w-full text-sm text-gray-700">
//           <thead className="bg-gray-100">
//             <tr>
//               <th className="px-6 py-3 text-left font-semibold text-black uppercase tracking-wide text-sm">
//                 Title
//               </th>
//               <th className="px-6 py-3 text-left font-semibold text-black  uppercase tracking-wide text-sm">
//                 Deal Title
//               </th>
//               <th className="px-6 py-3 text-left font-semibold text-black  uppercase tracking-wide text-sm">
//                 Email
//               </th>
//               <th className="px-6 py-3 text-left font-semibold text-black  uppercase tracking-wide text-sm">
//                 Status
//               </th>
//               <th className="px-6 py-3 text-left font-semibold text-black uppercase tracking-wide text-sm">
//                 Created At
//               </th>
//               <th className="px-6 py-3 text-left font-semibold text-black uppercase tracking-wide text-sm">
//                 Actions
//               </th>
//             </tr>
//           </thead>

//           <tbody className="divide-y divide-gray-200">
//             {loading ? (
//               <tr>
//                 <td
//                   colSpan="6"
//                   className="text-center py-6 text-black  animate-pulse"
//                 >
//                   Loading proposals...
//                 </td>
//               </tr>
//             ) : error ? (
//               <tr>
//                 <td colSpan="6" className="text-center py-6 text-red-500">
//                   {error}
//                 </td>
//               </tr>
//             ) : currentPageProposals.length === 0 ? (
//               <tr>
//                 <td colSpan="6" className="text-center py-6 text-gray-400">
//                   No proposals found
//                 </td>
//               </tr>
//             ) : (
//               currentPageProposals.map((proposal, idx) => (
//                 <tr
//                   key={proposal._id}
//                   className={`
//               ${idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
//               hover:bg-indigo-50 transition
//             `}
//                 >
//                   <td className="px-6 py-4 font-medium">{proposal.title}</td>
//                   <td className="px-6 py-4 text-gray-600">
//                     {proposal.dealTitle}
//                   </td>
//                   <td className="px-6 py-4 text-gray-600">{proposal.email}</td>

//                   {/* Status as styled dropdown */}
//                   <td className="px-6 py-4">
//                     <select
//                       value={proposal.status || "draft"}
//                       onChange={(e) =>
//                         handleStatusChange(proposal._id, e.target.value)
//                       }
//                       disabled={isUpdating[proposal._id]}
//                       className={`rounded-md px-2 py-1 text-sm border focus:outline-none transition
//                   ${STATUS_STYLES[proposal.status] || STATUS_STYLES.draft}
//                   ${
//                     isUpdating[proposal._id]
//                       ? "opacity-50 cursor-wait"
//                       : "cursor-pointer"
//                   }
//                 `}
//                     >
//                       {proposal.status !== "sent" && <option value="draft">Draft</option>}
//                       <option value="sent">Sent</option>
//                       <option value="no reply">No Reply</option>
//                       <option value="rejection">Rejection</option>
//                       <option value="success">Success</option>
//                     </select>
//                     {isUpdating[proposal._id] && (
//                       <span className="ml-2 text-xs text-gray-400">...</span>
//                     )}
//                   </td>

//                   <td className="px-6 py-4 text-gray-500">
//                     {proposal.createdAt
//                       ? new Date(proposal.createdAt).toLocaleDateString()
//                       : "--"}
//                   </td>

//                   {/* Actions dropdown */}
//                   <td className="px-6 py-4 relative">
//                     <button
//                       onClick={() =>
//                         setOpenActionId(
//                           openActionId === proposal._id ? null : proposal._id
//                         )
//                       }
//                       className="p-2 rounded hover:bg-gray-200"
//                     >
//                       <BsThreeDotsVertical />
//                     </button>

//                     {openActionId === proposal._id && (
//                       <div className="absolute right-0 mt-2 w-32 bg-white border rounded shadow-md z-10">
//                         <button
//                           onClick={() => handleEdit(proposal._id)}
//                           className="flex items-center px-3 py-2 hover:bg-gray-100 w-full text-left text-indigo-600"
//                         >
//                           Edit
//                         </button>
//                         <button
//                           onClick={() => openDeleteDialog(proposal._id)}
//                           className="flex items-center px-3 py-2 hover:bg-gray-100 w-full text-left text-red-600"
//                         >
//                           Delete
//                         </button>
//                       </div>
//                     )}
//                   </td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* Pagination Controls */}
//       {totalPages > 1 && (
//         <div className="flex justify-center items-center mt-6 gap-4">
//           <button
//             onClick={goToPreviousPage}
//             disabled={currentPage === 1}
//             className="px-4 py-2 bg-gray-200 rounded-md disabled:opacity-50"
//           >
//             Previous
//           </button>
//           <span className="text-sm">
//             Page {currentPage} of {totalPages}
//           </span>
//           <button
//             onClick={goToNextPage}
//             disabled={currentPage === totalPages}
//             className="px-4 py-2 bg-gray-200 rounded-md disabled:opacity-50"
//           >
//             Next
//           </button>
//         </div>
//       )}

//       {/* Delete Confirmation Dialog */}
//       <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Confirm Deletion</DialogTitle>
//           </DialogHeader>
//           <div className="py-4">
//             <p>
//               Are you sure you want to delete this proposal? This action cannot
//               be undone.
//             </p>
//           </div>
//           <div className="flex justify-end gap-3">
//             <button
//               onClick={() => setDeleteDialogOpen(false)}
//               className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
//             >
//               Cancel
//             </button>
//             <button
//               onClick={handleDelete}
//               className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg"
//             >
//               Delete
//             </button>
//           </div>
//         </DialogContent>
//       </Dialog>

//       {/* Toast Container with default position bottom-right for general toast */}
//       <ToastContainer position="top-right" autoClose={3000} />
//     </div>
//   );
// };

// export default ProposalHead;
import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import DatePicker from "react-datepicker";
import { FaCalendarAlt } from "react-icons/fa";
import { BsThreeDotsVertical } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-datepicker/dist/react-datepicker.css";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";

// Status styles
const STATUS_STYLES = {
  draft: "bg-orange-50 text-orange-700 border-orange-200",
  sent: "bg-blue-50 text-blue-700 border-blue-200",
  "no reply": "bg-gray-50 text-gray-500 border-gray-200",
  rejection: "bg-red-50 text-red-600 border-red-200",
  success: "bg-green-50 text-green-700 border-green-200",
};

const PAGE_SIZE = 5;

const ProposalHead = () => {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [openActionId, setOpenActionId] = useState(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterCreatedDate, setFilterCreatedDate] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [draftCount, setDraftCount] = useState(0);
  const [followUpDialogOpen, setFollowUpDialogOpen] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState(null);
  const [followUpDate, setFollowUpDate] = useState(null);
  const [followUpComment, setFollowUpComment] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // Fetch proposals
  useEffect(() => {
    const fetchProposals = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:5000/api/proposal/getall");
        setProposals(response.data);
        setDraftCount(response.data.filter((p) => p.status === "draft").length);
        setError("");
      } catch {
        setError("Failed to load proposals.");
        toast.error("Failed to load proposals.");
      }
      setLoading(false);
    };
    fetchProposals();
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenActionId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/proposal/updatestatus/${id}`, {
        status: newStatus,
      });
      setProposals((prev) =>
        prev.map((p) => (p._id === id ? { ...p, status: newStatus } : p))
      );
      toast.success(`Status updated to ${newStatus}`);
    } catch {
      toast.error("Failed to update status.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/proposal/delete/${id}`);
      setProposals((prev) => prev.filter((p) => p._id !== id));
      toast.success("Proposal deleted successfully.");
    } catch {
      toast.error("Failed to delete proposal.");
    }
  };

  const openFollowUpDialog = (proposal) => {
    setSelectedProposal(proposal);
    setFollowUpDate(proposal.followUpDate ? new Date(proposal.followUpDate) : null);
    setFollowUpComment(proposal.followUpComment || "");
    setIsEditing(false);
    setFollowUpDialogOpen(true);
  };

  const saveFollowUp = async () => {
    if (!selectedProposal) return;
    try {
      const res = await axios.put(
        `http://localhost:5000/api/proposal/followup/${selectedProposal._id}`,
        { followUpDate, followUpComment }
      );
      setProposals((prev) =>
        prev.map((p) => (p._id === selectedProposal._id ? res.data.proposal : p))
      );
      toast.success("Follow-up updated!");
      setFollowUpDialogOpen(false);
    } catch {
      toast.error("Failed to update follow-up.");
    }
  };

  // Filter proposals
  const filteredProposals = proposals.filter((proposal) => {
    const search = searchTerm.toLowerCase();
    const matchesSearch =
      proposal.title?.toLowerCase().includes(search) ||
      proposal.email?.toLowerCase().includes(search) ||
      proposal.dealTitle?.toLowerCase().includes(search);

    const matchesFilters =
      (filterStatus === "" || proposal.status === filterStatus) &&
      (filterCreatedDate === null ||
        (proposal.createdAt &&
          new Date(proposal.createdAt).toLocaleDateString() ===
            new Date(filterCreatedDate).toLocaleDateString()));

    return matchesSearch && matchesFilters;
  });

  const totalPages = Math.ceil(filteredProposals.length / PAGE_SIZE);
  const currentPageProposals = filteredProposals.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const openDropdown = (id, event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setDropdownPosition({ top: rect.bottom + window.scrollY, left: rect.left + window.scrollX });
    setOpenActionId(openActionId === id ? null : id);
  };

  return (
    <div className="min-h-screen py-8 px-4 md:px-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Proposal List</h1>
        <Link to="/proposal/sendproposal">
          <button className="bg-blue-600 text-white px-5 py-2 rounded-lg shadow hover:bg-blue-700 transition">
            + New Proposal
          </button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 items-center">
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border rounded px-4 py-2 shadow-sm focus:ring-2 focus:ring-blue-400"
        >
          <option value="">All Status</option>
          <option value="draft">Draft</option>
          <option value="sent">Sent</option>
          <option value="no reply">No Reply</option>
          <option value="rejection">Rejection</option>
          <option value="success">Success</option>
        </select>

        <div className="relative">
          <FaCalendarAlt className="absolute left-3 top-3 text-gray-400" />
          <DatePicker
            selected={filterCreatedDate}
            onChange={(date) => setFilterCreatedDate(date)}
            placeholderText="Created Date"
            className="border rounded-2xl px-10 py-2 shadow-sm focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by title, email, or deal"
          className="border rounded-full px-4 py-2 shadow-sm focus:ring-2 focus:ring-blue-400 w-full md:w-1/3"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="min-w-full border-collapse text-sm">
          <thead className="bg-gray-100 sticky top-0">
            <tr>
              <th className="px-4 py-2 text-left font-medium text-gray-700">Title</th>
              <th className="px-4 py-2 text-left font-medium text-gray-700">Deal Title</th>
              <th className="px-4 py-2 text-left font-medium text-gray-700">Email</th>
              <th className="px-4 py-2 text-left font-medium text-gray-700">Status</th>
              <th className="px-4 py-2 text-left font-medium text-gray-700">Follow-up Date</th>
              <th className="px-4 py-2 text-left font-medium text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentPageProposals.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-4 text-gray-400">
                  No proposals found
                </td>
              </tr>
            ) : (
              currentPageProposals.map((proposal) => (
                <tr key={proposal._id} className="border-b hover:bg-gray-50 transition relative">
                  <td className="px-4 py-3">{proposal.title}</td>
                  <td className="px-4 py-3">{proposal.dealTitle}</td>
                  <td className="px-4 py-3">{proposal.email}</td>
                  <td className="px-4 py-3">
                    <select
                      value={proposal.status}
                      onChange={(e) => handleStatusChange(proposal._id, e.target.value)}
                      className={`border px-2 py-1 rounded ${STATUS_STYLES[proposal.status]}`}
                    >
                      <option value="draft">Draft</option>
                      <option value="sent">Sent</option>
                      <option value="no reply">No Reply</option>
                      <option value="rejection">Rejection</option>
                      <option value="success">Success</option>
                    </select>
                  </td>
                  <td
                    className="px-4 py-3 cursor-pointer text-blue-600 hover:underline"
                    onClick={() => openFollowUpDialog(proposal)}
                  >
                    {proposal.followUpDate
                      ? new Date(proposal.followUpDate).toLocaleDateString()
                      : new Date(proposal.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 relative">
                    <button
                      onClick={(e) => openDropdown(proposal._id, e)}
                      className="p-1"
                    >
                      <BsThreeDotsVertical />
                    </button>

                    {openActionId === proposal._id &&
                      ReactDOM.createPortal(
                        <div
                          ref={dropdownRef}
                          className="absolute bg-white shadow-md rounded border z-50"
                          style={{ top: dropdownPosition.top, left: dropdownPosition.left }}
                        >
                          <button
                            onClick={() => navigate(`/proposal/view/${proposal._id}`)}
                            className="block px-4 py-2 w-full text-left hover:bg-gray-100"
                          >
                            View
                          </button>
                          <button
                            onClick={() => handleDelete(proposal._id)}
                            className="block px-4 py-2 w-full text-left text-red-600 hover:bg-gray-100"
                          >
                            Delete
                          </button>
                        </div>,
                        document.body
                      )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-6">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 transition"
          >
            Prev
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 transition"
          >
            Next
          </button>
        </div>
      )}

      {/* Follow-up Dialog */}
      <Dialog open={followUpDialogOpen} onOpenChange={setFollowUpDialogOpen}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">Follow-up Details</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            {!isEditing ? (
              <>
                <div>
                  <p className="text-sm text-gray-500">Follow-up Date</p>
                  <p className="font-medium">
                    {followUpDate ? new Date(followUpDate).toLocaleString() : "No date set"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Comment</p>
                  <p className="font-medium">{followUpComment || "No comment added"}</p>
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    Edit
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="relative">
                  <FaCalendarAlt className="absolute left-3 top-3 text-gray-400" />
                  <DatePicker
                    selected={followUpDate}
                    onChange={(date) => setFollowUpDate(date)}
                    showTimeSelect
                    dateFormat="Pp"
                    placeholderText="Select follow-up date"
                    className="w-full border px-10 py-2 rounded focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <textarea
                  value={followUpComment}
                  onChange={(e) => setFollowUpComment(e.target.value)}
                  className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-500"
                  rows="3"
                  placeholder="Add a follow-up comment"
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 border rounded-lg hover:bg-gray-100 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={saveFollowUp}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    Save
                  </button>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default ProposalHead;

