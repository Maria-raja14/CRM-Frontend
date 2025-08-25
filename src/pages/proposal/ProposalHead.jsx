// import React, { useState, useEffect } from "react";
// import DatePicker from "react-datepicker";
// import { FaCalendarAlt } from "react-icons/fa";
// import { Link } from "react-router-dom";
// import axios from "axios"; // ✅ Import Axios
// import { BsThreeDotsVertical } from "react-icons/bs";
// import { useNavigate } from "react-router-dom";
// import { useLocation } from "react-router-dom";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const ProposalHead = () => {
//   const [startDate, setStartDate] = useState(null);
//   const [proposals, setProposals] = useState([]); // ✅ State for proposals
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [openActionId, setOpenActionId] = useState(null); // For action dropdown

    
//   const [searchTerm, setSearchTerm] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const proposalsPerPage = 10; // You can change this
//   const [filterEmail, setFilterEmail] = useState("");
// const [filterStatus, setFilterStatus] = useState("");
// const [filterCreatedDate, setFilterCreatedDate] = useState("");
// const [filterTitle, setFilterTitle] = useState("");
// const [filterDealTitle, setFilterDealTitle] = useState("");


// const filteredProposals = proposals.filter((proposal) => {
//   const search = searchTerm.toLowerCase();

//   const matchesSearch =
//     proposal.title?.toLowerCase().includes(search) ||
//     proposal.email?.toLowerCase().includes(search) ||
//     proposal.dealTitle?.toLowerCase().includes(search);

//   const matchesFilters =
//     (filterEmail === "" || proposal.email?.includes(filterEmail)) &&
//     (filterStatus === "" || proposal.status === filterStatus) &&
//     (filterCreatedDate === "" ||
//       new Date(proposal.createdAt).toLocaleDateString() ===
//         new Date(filterCreatedDate).toLocaleDateString()) &&
//     (filterTitle === "" || proposal.title?.includes(filterTitle)) &&
//     (filterDealTitle === "" || proposal.dealTitle?.includes(filterDealTitle));

//   return matchesSearch && matchesFilters;
// });
  


//   // ✅ Fetch Proposals from API
//   const navigate = useNavigate();

//   const handleEdit = (proposalId) => {
//     const selectedProposal = proposals.find((p) => p._id === proposalId);
//     navigate("/proposal/sendproposal", {
//       state: { proposal: selectedProposal },
//     });
//   };
//   const location = useLocation(); // You forgot this line
//   const proposalData = location.state?.proposal || null;

//   useEffect(() => {
//     const fetchProposals = async () => {
//       setLoading(true);
//       try {
//         const response = await axios.get(
//           "http://localhost:5000/api/proposal/getall"
//         ); // 🔥 Replace with your API
//         setProposals(response.data);
//       } catch (err) {
//         setError("Failed to load proposals.");
//       }
//       setLoading(false);
//     };
//     fetchProposals();
//   }, []);
//   const handleStatusChange = async (id, newStatus) => {
//     try {
//       const response = await axios.put(
//         `http://localhost:5000/api/proposal/proposal/updatestatus/${id}`,
//         { status: newStatus }
//       );

//       // ✅ Update local state after successful DB update
//       setProposals((prevProposals) =>
//         prevProposals.map((proposal) =>
//           proposal._id === id ? { ...proposal, status: newStatus } : proposal
//         )
//       );
//     } catch (err) {
//       console.error("Error updating status:", err);
//       toast.error("Failed to update status.");
//     }
//   };

//   useEffect(() => {
//     const fetchProposals = async () => {
//       const res = await axios.get(
//         "http://localhost:5000/api/proposal/getall"
//       );
//       setProposals(res.data);
//     };
//     fetchProposals();
//   }, []);

//   // ❌ Delete Proposal
//   const handleDelete = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this proposal?"))
//       return;
//     try {
//       await axios.delete(
//         `http://localhost:5000/api/proposal/proposal/delete/${id}`
//       );
//       setProposals((prev) => prev.filter((p) => p._id !== id));
//       // alert("✅ Proposal deleted.");
//       toast.success(" Proposal deleted.");
//     } catch (error) {
//       console.error("Delete error:", error);

//       // alert("❌ Failed to delete.");
//       toast.error(" Failed to delete.");
//     }
//   };
//   // const filteredProposals = proposals.filter((proposal) => {
//   //   const search = searchTerm.toLowerCase();
//   //   return (
//   //     proposal.title?.toLowerCase().includes(search) ||
//   //     proposal.email?.toLowerCase().includes(search) ||
//   //     proposal.dealTitle?.toLowerCase().includes(search)
//   //   );
//   // });

//   return (
//     <div>
//       <div className="flex items-center justify-between">
//         <div className="flex justify-between items-center gap-3">
//           <h1 className="text-2xl">Proposal list</h1>
//         </div>
//         <div className="flex justify-between items-center gap-2">
//           <Link to="/proposal">
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               height="20px"
//               viewBox="0 -960 960 960"
//               width="20px"
//               fill="#1f1f1f"
//               className=" h-7 bg-white w-7 text-black"
//             >
//               <path d="M219-144q-29 0-52-23t-23-52v-525q0-29.7 21.5-50.85Q187-816 216-816h528q29.7 0 50.85 21.15Q816-773.7 816-744v528q0 29-21.15 50.5T744-144H219Zm-3-72h228v-528H216v528Zm300 0h228v-264H516v264Zm0-336h228v-192H516v192Z" />
//             </svg>
//           </Link>
//           <Link to="/stage">
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               height="20px"
//               viewBox="0 -960 960 960"
//               width="20px"
//               fill="#1f1f1f"
//               className=" h-7 bg-gray-300 w-7 text-black"
//             >
//               <path d="M600-144q-29.7 0-50.85-21.15Q528-186.3 528-216v-528q0-29 21.15-50.5T600-816h144q29 0 50.5 21.5T816-744v528q0 29.7-21.5 50.85Q773-144 744-144H600Zm-384 0q-29.7 0-50.85-21.15Q144-186.3 144-216v-528q0-29 21.15-50.5T216-816h144q29 0 50.5 21.5T432-744v528q0 29.7-21.5 50.85Q389-144 360-144H216Zm0-600v528h144v-528H216Z" />
//             </svg>
//           </Link>
//           <Link to="/proposal/sendproposal">
//             <button className="bg-[#4466f2] p-2 px-4 text-white rounded-sm">
//               New Proposal
//             </button>
//           </Link>
//         </div>
//       </div>

//       {/* Filters and Search */}
//       <div className="flex flex-col lg:flex-row justify-between items-center gap-4 mt-10">
//         <div className="flex items-center gap-2">
//           <div className="relative"></div>
//           {/* Email Filter */}
// <input
//   type="text"
//   placeholder="Filter by Email"
//   value={filterEmail}
//   onChange={(e) => setFilterEmail(e.target.value)}
//   className="px-2 py-2 shadow bg-white rounded-2xl text-sm text-gray-600"
// />

// {/* Status Filter */}
// <select
//   value={filterStatus}
//   onChange={(e) => setFilterStatus(e.target.value)}
//   className="px-2 py-2 shadow rounded-2xl bg-white text-sm text-gray-600"
// >
//   <option value="">All Status</option>
//   <option value="draft">Draft</option>
//   <option value="send">Sent</option>
//   <option value="no reply">No Reply</option>
//   <option value="rejection">Rejection</option>
//   <option value="success">Success</option>
// </select>

// {/* Created Date Filter */}
// <DatePicker
//   selected={filterCreatedDate ? new Date(filterCreatedDate) : null}
//   onChange={(date) => setFilterCreatedDate(date)}
//   dateFormat="yyyy/MM/dd"
//   placeholderText="Created Date"
//   className="px-2 py-2 shadow bg-white rounded-2xl text-sm text-gray-600"
// />

// {/* Title Filter */}
// <input
//   type="text"
//   placeholder="Filter by Title"
//   value={filterTitle}
//   onChange={(e) => setFilterTitle(e.target.value)}
//   className="px-2 py-2 shadow rounded-2xl bg-white text-sm text-gray-600"
// />

// {/* Deal Title Filter */}
// <input
//   type="text"
//   placeholder="Filter by Deal Title"
//   value={filterDealTitle}
//   onChange={(e) => setFilterDealTitle(e.target.value)}
//   className="px-2 py-2 shadow bg-white rounded-2xl text-sm text-gray-600"
// />

//         </div>

//         {/* Search Input */}
//         <div className="relative flex items-center">
//           <input
//             type="text"
//             placeholder="Search"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="p-1.5 pl-10 border rounded-3xl w-[150px] bg-white"
//           />
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             fill="none"
//             viewBox="0 0 24 24"
//             strokeWidth="1.5"
//             stroke="currentColor"
//             className="w-3 h-3 text-gray-400 absolute left-3"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z"
//             />
//           </svg>
//         </div>
//       </div>

//       {/* Proposals Table */}
//       <div className="bg-white p-5 w-full h-screen mt-10">
//         <div className="pt-5 px-5">
//           <table className="w-full">
//             <thead>
//               <tr>
//                 <th className="text-left pb-5 font-semibold text-gray-400">
//                   Title
//                 </th>
//                 <th className="text-left pb-5 font-semibold text-gray-400">
//                   Deal Title
//                 </th>
//                 <th className="text-left pb-5 font-semibold text-gray-400">
//                   Email
//                 </th>
//                 <th className="text-left pb-5 font-semibold text-gray-400">
//                   Status{" "}
//                 </th>
//                 <th className="text-left pb-5 font-semibold text-gray-400">
//                   Created At
//                 </th>
//                 <th className="text-left pb-5 font-semibold text-gray-400">
//                   Action
//                 </th>
//               </tr>
//             </thead>
//             <tbody>
//               {loading ? (
//                 <tr>
//                   <td colSpan="5" className="text-center">
//                     Loading...
//                   </td>
//                 </tr>
//               ) : error ? (
//                 <tr>
//                   <td colSpan="5" className="text-center text-red-500">
//                     {error}
//                   </td>
//                 </tr>
//               ) : proposals.length === 0 ? (
//                 <tr>
//                   <td colSpan="5" className="text-center">
//                     No proposals found
//                   </td>
//                 </tr>
//               ) : (
//                 filteredProposals.map((proposal) => (
//                   <tr key={proposal._id} className="border-b">
//                     <td className="py-2">{proposal.title}</td>
//                     <td className="py-2">{proposal.dealTitle}</td>
//                     <td className="py-2">{proposal.email}</td>

//                     {/* ✅ Added Status */}
//                     <td className="py-2">
//                       <select
//                         value={proposal.status}
//                         onChange={(e) =>
//                           handleStatusChange(proposal._id, e.target.value)
//                         }
//                         className={` rounded px-2 py-1
//       ${
//         proposal.status === "draft"
//           ? "bg-orange-100 text-orange-600 border-orange-400"
//           : proposal.status === "rejection"
//           ? "bg-red-100 text-red-600 border-red-400"
//           : proposal.status === "success"
//           ? "bg-green-100 text-green-600 border-green-400"
//           : proposal.status === "no reply"
//           ? "bg-gray-100 text-gray-600 border-gray-400"
//           : "bg-blue-100 text-blue-600 border-blue-400"
//       }`}
//                       >
//                         <option value="draft">Draft</option>
//                         <option value="send">Sent</option>
//                         <option value="no reply">No Reply</option>
//                         <option value="rejection">Rejection</option>
//                         <option value="success">Success</option>
//                       </select>
//                     </td>

//                     <td className="py-2">
//                       {new Date(proposal.createdAt).toLocaleDateString()}
//                     </td>
//                     <td className="py-2 relative">
//                       <button
//                         onClick={() =>
//                           setOpenActionId(
//                             openActionId === proposal._id ? null : proposal._id
//                           )
//                         }
//                         className="text-gray-500"
//                       >
//                         <BsThreeDotsVertical />
//                       </button>

//                       {openActionId === proposal._id && (
//                         <div className="absolute right-0 mt-2 bg-white border rounded shadow z-10 w-28 text-sm">
//                           <div
//                             onClick={() => handleEdit(proposal._id)}
//                             className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-blue-600"
//                           >
//                             Edit
//                           </div>
//                           <div
//                             onClick={() => handleDelete(proposal._id)}
//                             className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-red-600"
//                           >
//                             Delete
//                           </div>
//                         </div>
//                       )}
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProposalHead;//original





import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import { FaCalendarAlt } from "react-icons/fa";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { BsThreeDotsVertical } from "react-icons/bs";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-datepicker/dist/react-datepicker.css";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";

// Helper for status styling
const STATUS_STYLES = {
  draft: "bg-orange-50 text-orange-700 border-orange-200",
  sent: "bg-blue-50 text-blue-700 border-blue-200",
  "no reply": "bg-gray-50 text-gray-500 border-gray-200",
  rejection: "bg-red-50 text-red-600 border-red-200",
  success: "bg-green-50 text-green-700 border-green-200",
};

const PAGE_SIZE = 5; // Number of proposals per page

const ProposalHead = () => {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [openActionId, setOpenActionId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterEmail, setFilterEmail] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterCreatedDate, setFilterCreatedDate] = useState(null);
  const [filterTitle, setFilterTitle] = useState("");
  const [filterDealTitle, setFilterDealTitle] = useState("");
  const [isUpdating, setIsUpdating] = useState({});
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [proposalToDelete, setProposalToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchProposals = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          "http://localhost:5000/api/proposal/getall"
        );
        setProposals(response.data);
        setError("");
      } catch {
        setError("Failed to load proposals.");
        toast.error("Failed to load proposals.");
      }
      setLoading(false);
    };
    fetchProposals();
  }, []);

  // Status change with feedback and toast on top-right
  const handleStatusChange = async (id, newStatus) => {
    setIsUpdating((prev) => ({ ...prev, [id]: true }));
    try {
      await axios.put(
        `http://localhost:5000/api/proposal/updatestatus/${id}`,
        { status: newStatus }
      );
      setProposals((prev) =>
        prev.map((p) => (p._id === id ? { ...p, status: newStatus } : p))
      );

      // Place toast notification at top-right for specified statuses
      toast.success(`Status updated to ${newStatus}`, {
        position: "top-right",
      });
    } catch {
      toast.error("Failed to update status.");
    }
    setIsUpdating((prev) => ({ ...prev, [id]: false }));
  };

  // Delete proposal with feedback
  const handleDelete = async () => {
    if (!proposalToDelete) return;

    try {
      await axios.delete(
        `http://localhost:5000/api/proposal/delete/${proposalToDelete}`
      );
      setProposals((prev) =>
        prev.filter((p) => p._id !== proposalToDelete)
      );
      toast.success("Proposal deleted successfully.");
    } catch {
      toast.error("Failed to delete proposal.");
    }
    setDeleteDialogOpen(false);
    setProposalToDelete(null);
  };

  // Open delete confirmation dialog
  const openDeleteDialog = (id) => {
    setProposalToDelete(id);
    setDeleteDialogOpen(true);
    setOpenActionId(null);
  };

  // Go to edit proposal
  const handleEdit = (proposalId) => {
    const selectedProposal = proposals.find((p) => p._id === proposalId);
    navigate("/proposal/sendproposal", {
      state: { proposal: selectedProposal, isEditing: true },
    });
  };

  // Filtering logic
  const filteredProposals = proposals.filter((proposal) => {
    const search = searchTerm.toLowerCase();
    const matchesSearch =
      proposal.title?.toLowerCase().includes(search) ||
      proposal.email?.toLowerCase().includes(search) ||
      proposal.dealTitle?.toLowerCase().includes(search);

    const matchesFilters =
      (filterEmail === "" ||
        proposal.email?.toLowerCase().includes(filterEmail.toLowerCase())) &&
      (filterStatus === "" || proposal.status === filterStatus) &&
      (filterCreatedDate === null ||
        (proposal.createdAt &&
          new Date(proposal.createdAt).toLocaleDateString() ===
            new Date(filterCreatedDate).toLocaleDateString())) &&
      (filterTitle === "" ||
        proposal.title?.toLowerCase().includes(filterTitle.toLowerCase())) &&
      (filterDealTitle === "" ||
        proposal.dealTitle?.toLowerCase().includes(filterDealTitle.toLowerCase()));

    return matchesSearch && matchesFilters;
  });

  // Pagination logic
  const totalProposals = filteredProposals.length;
  const totalPages = Math.ceil(totalProposals / PAGE_SIZE);

  const currentPageProposals = filteredProposals.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const goToPreviousPage = () => {
    setCurrentPage((page) => Math.max(1, page - 1));
  };

  const goToNextPage = () => {
    setCurrentPage((page) => Math.min(totalPages, page + 1));
  };

  useEffect(() => {
    // Reset to first page when filters/search change
    setCurrentPage(1);
  }, [searchTerm, filterEmail, filterStatus, filterCreatedDate, filterTitle, filterDealTitle]);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-2 md:px-10">
      {/* Header */}
      <div className="flex flex-col lg:flex-row items-center justify-between mb-8 gap-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-black">
          Proposal List
        </h1>
        <div className="flex gap-3 items-center">
          <Link to="/proposal" title="Go to Proposal Home">
            <button className="bg-white hover:bg-indigo-50 border border-indigo-100 shadow-sm p-2 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="20"
                viewBox="0 -960 960 960"
                width="20"
                fill="#6068ec"
              >
                <path d="M219-144q-29 0-52-23t-23-52v-525q0-29.7 21.5-50.85Q187-816 216-816h528q29.7 0 50.85 21.15Q816-773.7 816-744v528q0 29-21.15 50.5T744-144H219Zm-3-72h228v-528H216v528Zm300 0h228v-264H516v264Zm0-336h228v-192H516v192Z" />
              </svg>
            </button>
          </Link>
          <Link to="/stage" title="Go to Stage">
            <button className="bg-white hover:bg-gray-100 border border-gray-200 p-2 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="20"
                viewBox="0 -960 960 960"
                width="20"
                fill="#888"
              >
                <path d="M600-144q-29.7 0-50.85-21.15Q528-186.3 528-216v-528q0-29 21.15-50.5T600-816h144q29 0 50.5 21.5T816-744v528q0 29.7-21.5 50.85Q773-144 744-144H600Zm-384 0q-29.7 0-50.85-21.15Q144-186.3 144-216v-528q0-29 21.15-50.5T216-816h144q29 0 50.5 21.5T432-744v528q0 29.7-21.5 50.85Q389-144 360-144H216Zm0-600v528h144v-528H216Z" />
              </svg>
            </button>
          </Link>
          <Link to="/proposal/sendproposal">
            <button className="bg-blue-600 hover:bg-blue-700 transition px-4 py-2 text-white font-semibold rounded-lg shadow-lg">
              + New Proposal
            </button>
          </Link>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-xl shadow p-6 mb-6 grid grid-cols-1 gap-3 md:grid-cols-3 lg:grid-cols-6">
        <input
          type="text"
          placeholder="Email"
          value={filterEmail}
          onChange={(e) => setFilterEmail(e.target.value)}
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-indigo-100"
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-indigo-100"
        >
          <option value="">All Status</option>
          <option value="draft">Draft</option>
          <option value="sent">Sent</option>
          <option value="no reply">No Reply</option>
          <option value="rejection">Rejection</option>
          <option value="success">Success</option>
        </select>
        <div className="relative flex items-center">
          <DatePicker
            selected={filterCreatedDate ? new Date(filterCreatedDate) : null}
            onChange={(date) => setFilterCreatedDate(date)}
            dateFormat="yyyy/MM/dd"
            placeholderText="Created Date"
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-indigo-100 w-full"
          />
          <FaCalendarAlt className="absolute right-3 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Title"
          value={filterTitle}
          onChange={(e) => setFilterTitle(e.target.value)}
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-indigo-100"
        />
        <input
          type="text"
          placeholder="Deal Title"
          value={filterDealTitle}
          onChange={(e) => setFilterDealTitle(e.target.value)}
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-indigo-100"
        />
        <div className="relative flex items-center">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-indigo-100 w-full pl-10"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-4 h-4 text-gray-400 absolute left-3"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z"
            />
          </svg>
        </div>
      </div>

      {/* Proposals Table Card */}
      <div className="bg-white rounded-xl shadow-lg p-5 w-full overflow-x-auto">
        {/* Total proposal count */}
        <div className="mb-2 text-sm text-gray-600">
          Total Proposals: {totalProposals}
        </div>

        <table className="min-w-full">
          <thead className="sticky top-0 z-10 bg-white">
            <tr>
              <th className="text-left pb-5 font-semibold text-indigo-400">Title</th>
              <th className="text-left pb-5 font-semibold text-indigo-400">Deal Title</th>
              <th className="text-left pb-5 font-semibold text-indigo-400">Email</th>
              <th className="text-left pb-5 font-semibold text-indigo-400">Status</th>
              <th className="text-left pb-5 font-semibold text-indigo-400">Created At</th>
              <th className="text-left pb-5 font-semibold text-indigo-400">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="text-center py-6 text-indigo-500 animate-pulse">
                  Loading proposals...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan="6" className="text-center text-red-500 py-6">
                  {error}
                </td>
              </tr>
            ) : currentPageProposals.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-6 text-gray-400">
                  No proposals found.
                </td>
              </tr>
            ) : (
              currentPageProposals.map((proposal) => (
                <tr
                  key={proposal._id}
                  className="border-b last:border-b-0 hover:bg-indigo-50 transition group"
                >
                  <td className="py-3 font-semibold">{proposal.title}</td>
                  <td className="py-3 text-gray-600">{proposal.dealTitle}</td>
                  <td className="py-3 text-gray-600">{proposal.email}</td>
                  {/* Status Dropdown */}
                  <td className="py-3">
                    <select
                      value={proposal.status || "draft"}
                      onChange={(e) =>
                        handleStatusChange(proposal._id, e.target.value)
                      }
                      disabled={isUpdating[proposal._id]}
                      className={`rounded px-2 py-1 border transition focus:outline-none ${
                        STATUS_STYLES[proposal.status] || STATUS_STYLES.draft
                      } ${
                        isUpdating[proposal._id]
                          ? "opacity-50 cursor-wait"
                          : "cursor-pointer"
                      }`}
                    >
                      <option value="draft">Draft</option>
                      <option value="sent">Sent</option>
                      <option value="no reply">No Reply</option>
                      <option value="rejection">Rejection</option>
                      <option value="success">Success</option>
                    </select>
                    {isUpdating[proposal._id] && (
                      <span className="ml-2 text-xs text-gray-400">Updating...</span>
                    )}
                  </td>
                  <td className="py-3 text-gray-500">
                    {proposal.createdAt
                      ? new Date(proposal.createdAt).toLocaleDateString()
                      : "--"}
                  </td>
                  <td className="py-3 relative">
                    <button
                      onClick={() =>
                        setOpenActionId(
                          openActionId === proposal._id ? null : proposal._id
                        )
                      }
                      className="text-black p-1 rounded hover:bg-gray-100 focus:outline-none"
                      aria-label="Open actions"
                      tabIndex={0}
                    >
                      <BsThreeDotsVertical />
                    </button>
                    {openActionId === proposal._id && (
                      <div className="absolute right-0 mt-2 bg-white border border-indigo-50 rounded-lg shadow-xl z-20 w-32 text-sm">
                        <button
                          onClick={() => {
                            handleEdit(proposal._id);
                            setOpenActionId(null);
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-indigo-100 text-indigo-700 focus:outline-none"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            openDeleteDialog(proposal._id);
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-red-100 text-red-600 focus:outline-none"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination Controls */}
        <div className="mt-4 flex justify-between items-center">
          <button
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-md ${
              currentPage === 1
                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                : "bg-indigo-600 text-white hover:bg-indigo-700"
            }`}
          >
            Previous
          </button>
          <div className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </div>
          <button
            onClick={goToNextPage}
            disabled={currentPage === totalPages || totalPages === 0}
            className={`px-4 py-2 rounded-md ${
              currentPage === totalPages || totalPages === 0
                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                : "bg-indigo-600 text-white hover:bg-indigo-700"
            }`}
          >
            Next
          </button>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Are you sure you want to delete this proposal? This action cannot be undone.</p>
          </div>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setDeleteDialogOpen(false)}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg"
            >
              Delete
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Toast Container with default position bottom-right for general toast */}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default ProposalHead;
