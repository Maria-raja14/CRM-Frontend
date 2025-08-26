// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { MoreVertical, Edit, Trash2, X } from "lucide-react";


// export const AllDeals = () => {
//   const [deals, setDeals] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [openDropdownId, setOpenDropdownId] = useState(null);

//   // 🔹 Modal states
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//   const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
//   const [editDeal, setEditDeal] = useState(null);
//   const [deleteDeal, setDeleteDeal] = useState(null);
//   const [users, setUsers] = useState([]);

//   const itemsPerPage = 10;

//   const fetchDeals = async () => {
//     try {
//       setLoading(true);
//       const response = await axios.get(`http://localhost:5000/api/deals/getAll`);
//       if (response.data) {
//         setDeals(response.data);
//         setTotalPages(Math.ceil(response.data.length / itemsPerPage));
//       }
//       setLoading(false);
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to fetch deals");
//       setLoading(false);
//     }
//   };

//   const fetchUsers = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const res = await axios.get("http://localhost:5000/api/users", {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       const filteredSales = (res.data.users || []).filter(
//         (user) =>
//           user.role &&
//           user.role.name &&
//           user.role.name.toLowerCase() === "sales"
//       );

//       setUsers(filteredSales);
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to fetch users");
//     }
//   };

//   useEffect(() => {
//     fetchDeals();
//     fetchUsers();
//   }, []);

//   const formatDate = (dateString) => {
//     if (!dateString) return "-";
//     const date = new Date(dateString);
//     return date.toLocaleDateString("en-US", {
//       month: "short",
//       day: "numeric",
//       year: "numeric",
//     });
//   };

//   const formatFollowUpDate = (dateString) => {
//     if (!dateString) return "-";
//     const date = new Date(dateString);
//     return date.toLocaleString("en-US", {
//       month: "short",
//       day: "numeric",
//       year: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//     });
//   };

//   const handlePageChange = (newPage) => {
//     if (newPage > 0 && newPage <= totalPages) setCurrentPage(newPage);
//   };

//   const paginatedDeals = deals.slice(
//     (currentPage - 1) * itemsPerPage,
//     currentPage * itemsPerPage
//   );

//   // Actions
//   const handleEdit = (deal) => {
//     setEditDeal({
//       ...deal,
//       assignedTo: deal.assignedTo?._id || "",
//     });
//     setIsEditModalOpen(true);
//     setOpenDropdownId(null);
//   };

//   const handleDeleteClick = (deal) => {
//     setDeleteDeal(deal);
//     setIsDeleteModalOpen(true);
//     setOpenDropdownId(null);
//   };

//   const handleDeleteConfirm = async () => {
//     try {
//       await axios.delete(
//         `http://localhost:5000/api/deals/delete-deal/${deleteDeal._id}`
//       );
//       toast.success("Deal deleted successfully");
//       fetchDeals();
//       setIsDeleteModalOpen(false);
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to delete deal");
//     }
//   };

//   const handleSave = async () => {
//     try {
//       await axios.patch(
//         `http://localhost:5000/api/deals/update-deal/${editDeal._id}`,
//         {
//           assignedTo: editDeal.assignedTo,
//           stage: editDeal.stage,
//           value: editDeal.value,
//           notes: editDeal.notes,
//           followUpDate: editDeal.followUpDate,
//         }
//       );
//       toast.success("Deal updated successfully");
//       setIsEditModalOpen(false);
//       fetchDeals();
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to update deal");
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="p-4">
//       <h2 className="text-xl font-semibold text-gray-800 mb-4">All Deals</h2>

//       <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
//         <table className="min-w-full text-sm text-gray-700">
//           <thead className="bg-gray-100">
//             <tr>
//               <th className="px-6 py-3 text-left">Deal Name</th>
//               <th className="px-6 py-3 text-left">Assigned To</th>
//               <th className="px-6 py-3 text-left">Stage</th>
//               <th className="px-6 py-3 text-left">Value</th>
//               <th className="px-6 py-3 text-left">Created At</th>
//               <th className="px-6 py-3 text-left">Follow-Up Date</th>
//               <th className="px-6 py-3 text-left">Actions</th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-gray-200">
//             {paginatedDeals.length > 0 ? (
//               paginatedDeals.map((deal, idx) => (
//                 <tr
//                   key={deal._id}
//                   className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
//                 >
//                   <td className="px-6 py-4 font-medium">
//                     {deal.dealName || "-"}
//                   </td>
//                   <td className="px-6 py-4">
//                     {deal.assignedTo
//                       ? `${deal.assignedTo.firstName} ${deal.assignedTo.lastName}`
//                       : "-"}
//                   </td>
//                   <td className="px-6 py-4">{deal.stage || "-"}</td>
//                   <td className="px-6 py-4">{deal.value || "-"}</td>
//                   <td className="px-6 py-4">{formatDate(deal.createdAt)}</td>
//                   <td className="px-6 py-4">
//                     {formatFollowUpDate(deal.followUpDate)}
//                   </td>
//                   <td className="px-6 py-4 relative">
//                     <button
//                       onClick={() =>
//                         setOpenDropdownId(
//                           openDropdownId === deal._id ? null : deal._id
//                         )
//                       }
//                       className="p-2 rounded hover:bg-gray-200"
//                     >
//                       <MoreVertical size={18} />
//                     </button>

//                     {openDropdownId === deal._id && (
//                       <div className="absolute right-0 mt-2 w-32 bg-white border rounded shadow-md z-10">
//                         <button
//                           onClick={() => handleEdit(deal)}
//                           className="flex items-center px-3 py-2 hover:bg-gray-100 w-full text-left"
//                         >
//                           <Edit size={16} className="mr-2" /> Edit
//                         </button>
//                         <button
//                           onClick={() => handleDeleteClick(deal)}
//                           className="flex items-center px-3 py-2 hover:bg-gray-100 w-full text-left text-red-600"
//                         >
//                           <Trash2 size={16} className="mr-2" /> Delete
//                         </button>
//                       </div>
//                     )}
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
//                   No deals found
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* Pagination */}
//       {totalPages > 1 && (
//         <div className="flex justify-between items-center mt-4">
//           <button
//             onClick={() => handlePageChange(currentPage - 1)}
//             disabled={currentPage === 1}
//             className="px-3 py-1 rounded border bg-white hover:bg-gray-100 disabled:opacity-50"
//           >
//             Previous
//           </button>
//           <span>
//             Page {currentPage} of {totalPages}
//           </span>
//           <button
//             onClick={() => handlePageChange(currentPage + 1)}
//             disabled={currentPage === totalPages}
//             className="px-3 py-1 rounded border bg-white hover:bg-gray-100 disabled:opacity-50"
//           >
//             Next
//           </button>
//         </div>
//       )}

//       {/* Edit Modal */}
//       {isEditModalOpen && editDeal && (
//         <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg p-6 w-96 shadow-lg relative">
//             <button
//               onClick={() => setIsEditModalOpen(false)}
//               className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
//             >
//               <X size={20} />
//             </button>
//             <h3 className="text-lg font-semibold mb-4">Edit Deal</h3>

//             <div className="space-y-3">
//               <select
//                 value={editDeal.assignedTo}
//                 onChange={(e) =>
//                   setEditDeal({ ...editDeal, assignedTo: e.target.value })
//                 }
//                 className="mt-1 w-full border rounded p-2"
//               >
//                 <option value="">-- Select Salesman --</option>
//                 {users.map((u) => (
//                   <option key={u._id} value={u._id}>
//                     {u.firstName} {u.lastName}
//                   </option>
//                 ))}
//               </select>

//               <div>
//                 <label className="block text-sm font-medium">Stage</label>
//                 <select
//                   value={editDeal.stage}
//                   onChange={(e) =>
//                     setEditDeal({ ...editDeal, stage: e.target.value })
//                   }
//                   className="mt-1 w-full border rounded p-2"
//                 >
//                   <option>Qualification</option>
//                   <option>Negotiation</option>
//                   <option>Proposal Sent</option>
//                   <option>Closed Won</option>
//                   <option>Closed Lost</option>
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium">Value</label>
//                 <input
//                   type="number"
//                   value={editDeal.value}
//                   onChange={(e) =>
//                     setEditDeal({ ...editDeal, value: e.target.value })
//                   }
//                   className="mt-1 w-full border rounded p-2"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium">Notes</label>
//                 <textarea
//                   value={editDeal.notes}
//                   onChange={(e) =>
//                     setEditDeal({ ...editDeal, notes: e.target.value })
//                   }
//                   className="mt-1 w-full border rounded p-2"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium">
//                   Follow-Up Date
//                 </label>
//                 <input
//                   type="datetime-local"
//                   value={
//                     editDeal.followUpDate
//                       ? new Date(editDeal.followUpDate)
//                           .toISOString()
//                           .slice(0, 16)
//                       : ""
//                   }
//                   onChange={(e) =>
//                     setEditDeal({ ...editDeal, followUpDate: e.target.value })
//                   }
//                   className="mt-1 w-full border rounded p-2"
//                 />
//               </div>
//             </div>

//             <div className="mt-4 flex justify-end space-x-2">
//               <button
//                 onClick={() => setIsEditModalOpen(false)}
//                 className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleSave}
//                 className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
//               >
//                 Save
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Delete Confirmation Modal */}
//       {isDeleteModalOpen && deleteDeal && (
//         <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg p-6 w-80 shadow-lg">
//             <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
//             <p>Are you sure you want to delete this deal?</p>
//             <div className="mt-4 flex justify-end space-x-2">
//               <button
//                 onClick={() => setIsDeleteModalOpen(false)}
//                 className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleDeleteConfirm}
//                 className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
//               >
//                 Delete
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };//original





import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { MoreVertical, Edit, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import "react-toastify/dist/ReactToastify.css";

export const AllDeals = () => {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [openDropdownId, setOpenDropdownId] = useState(null);

  // Bulk selection state
  const [selectedDeals, setSelectedDeals] = useState([]);

  // Modal states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editDeal, setEditDeal] = useState(null);
  const [deleteDeal, setDeleteDeal] = useState(null);
  const [users, setUsers] = useState([]);

  const itemsPerPage = 10;

  // Fetch deals from API
  const fetchDeals = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/api/deals/getAll`);
      if (response.data) {
        setDeals(response.data);
        setTotalPages(Math.ceil(response.data.length / itemsPerPage));
      }
    } catch (err) {
      toast.error("Failed to fetch deals");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch sales users for dropdown in edit modal
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const filteredSales = (res.data.users || []).filter(
        (user) =>
          user.role &&
          user.role.name &&
          user.role.name.toLowerCase() === "sales"
      );
      setUsers(filteredSales);
    } catch (err) {
      toast.error("Failed to fetch users");
      console.error(err);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchDeals();
    fetchUsers();
  }, []);

  // Formatters for dates
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatFollowUpDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Pagination controls
  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) setCurrentPage(newPage);
  };

  // Paginate deals list
  const paginatedDeals = deals.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle toggle dropdown for actions menu
  const toggleDropdown = (id) => {
    setOpenDropdownId(openDropdownId === id ? null : id);
  };

  // Handle edit action: open modal and set editDeal
  const handleEdit = (deal) => {
    setEditDeal({
      ...deal,
      assignedTo: deal.assignedTo?._id || "",
    });
    setIsEditModalOpen(true);
    setOpenDropdownId(null);
  };

  // Handle delete click: open confirmation modal
  const handleDeleteClick = (deal) => {
    setDeleteDeal(deal);
    setIsDeleteModalOpen(true);
    setOpenDropdownId(null);
  };

  // Delete single deal
  const handleDeleteConfirm = async () => {
    toast.success("Deal deleted successfully");
    setIsDeleteModalOpen(false);
    try {
      await axios.delete(
        `http://localhost:5000/api/deals/delete-deal/${deleteDeal._id}`
      );
      fetchDeals();
      // Clear selection if deleted item was selected
      setSelectedDeals((prev) =>
        prev.filter((id) => id !== deleteDeal._id)
      );
    } catch (err) {
      toast.error("Failed to delete deal");
      console.error(err);
    }
  };

  // Save edited deal
  const handleSave = async () => {
    toast.success("Deal updated successfully");
    setIsEditModalOpen(false);
    try {
      await axios.patch(
        `http://localhost:5000/api/deals/update-deal/${editDeal._id}`,
        {
          assignedTo: editDeal.assignedTo,
          stage: editDeal.stage,
          value: editDeal.value,
          notes: editDeal.notes,
          followUpDate: editDeal.followUpDate,
        }
      );
      fetchDeals();
    } catch (err) {
      toast.error("Failed to update deal");
      console.error(err);
    }
  };

  // Handle checkbox change for bulk selection
  const handleCheckboxChange = (dealId) => {
    setSelectedDeals((prevSelected) => {
      if (prevSelected.includes(dealId)) {
        return prevSelected.filter((id) => id !== dealId);
      } else {
        return [...prevSelected, dealId];
      }
    });
  };

  // Handle master checkbox to select/deselect all on current page
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const idsOnPage = paginatedDeals.map((d) => d._id);
      setSelectedDeals((prev) => {
        // Merge previous with new ids without duplicates
        return Array.from(new Set([...prev, ...idsOnPage]));
      });
    } else {
      const idsOnPage = paginatedDeals.map((d) => d._id);
      setSelectedDeals((prev) => prev.filter((id) => !idsOnPage.includes(id)));
    }
  };

  // Bulk delete selected deals
  const handleBulkDelete = async () => {
    if (selectedDeals.length === 0) {
      toast.info("Please select deals to delete");
      return;
    }
    if (!window.confirm(`Are you sure you want to delete ${selectedDeals.length} deals?`)) {
      return;
    }
    toast.success(`${selectedDeals.length} deals deleted successfully`);
    try {
      await Promise.all(
        selectedDeals.map((id) =>
          axios.delete(`http://localhost:5000/api/deals/delete-deal/${id}`)
        )
      );
      fetchDeals();
      setSelectedDeals([]);
    } catch (err) {
      toast.error("Failed to delete selected deals");
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">All Deals</h2>

      {selectedDeals.length > 0 && (
        <div className="mb-2 flex items-center space-x-2">
          <button
            onClick={handleBulkDelete}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Delete Selected ({selectedDeals.length})
          </button>
        </div>
      )}

      <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
        <table className="min-w-full text-sm text-gray-700">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left">
                <input
                  type="checkbox"
                  onChange={handleSelectAll}
                  checked={
                    paginatedDeals.length > 0 &&
                    paginatedDeals.every((d) => selectedDeals.includes(d._id))
                  }
                  aria-label="Select all deals on page"
                />
              </th>
              <th className="px-6 py-3 text-left">Deal Name</th>
              <th className="px-6 py-3 text-left">Assigned To</th>
              <th className="px-6 py-3 text-left">Stage</th>
              <th className="px-6 py-3 text-left">Value</th>
              <th className="px-6 py-3 text-left">Created At</th>
              <th className="px-6 py-3 text-left">Follow-Up Date</th>
              <th className="px-6 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {paginatedDeals.length > 0 ? (
              paginatedDeals.map((deal, idx) => (
                <tr
                  key={deal._id}
                  className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      onChange={() => handleCheckboxChange(deal._id)}
                      checked={selectedDeals.includes(deal._id)}
                      aria-label={`Select deal ${deal.dealName}`}
                    />
                  </td>
                  <td className="px-6 py-4 font-medium">{deal.dealName || "-"}</td>
                  <td className="px-6 py-4">
                    {deal.assignedTo
                      ? `${deal.assignedTo.firstName} ${deal.assignedTo.lastName}`
                      : "-"}
                  </td>
                  <td className="px-6 py-4">{deal.stage || "-"}</td>
                  <td className="px-6 py-4">{deal.value || "-"}</td>
                  <td className="px-6 py-4">{formatDate(deal.createdAt)}</td>
                  <td className="px-6 py-4">{formatFollowUpDate(deal.followUpDate)}</td>
                  <td className="px-6 py-4 relative">
                    <button
                      onClick={() => toggleDropdown(deal._id)}
                      className="p-2 rounded hover:bg-gray-200"
                      aria-label={`Actions for deal ${deal.dealName}`}
                    >
                      <MoreVertical size={18} />
                    </button>
                    {openDropdownId === deal._id && (
                      <div className="absolute right-0 mt-2 w-32 bg-white border rounded shadow-md z-10">
                        <button
                          onClick={() => handleEdit(deal)}
                          className="flex items-center px-3 py-2 hover:bg-gray-100 w-full text-left"
                        >
                          <Edit size={16} className="mr-2" /> Edit
                        </button>
                        <button
                          onClick={() => handleDeleteClick(deal)}
                          className="flex items-center px-3 py-2 hover:bg-gray-100 w-full text-left text-red-600"
                        >
                          <Trash2 size={16} className="mr-2" /> Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="px-6 py-8 text-center text-gray-500">
                  No deals found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded border bg-white hover:bg-gray-100 disabled:opacity-50"
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded border bg-white hover:bg-gray-100 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-md p-6">
          <DialogHeader>
            <DialogTitle>Edit Deal</DialogTitle>
          </DialogHeader>

          {editDeal && (
            <div className="space-y-4">
              <select
                value={editDeal.assignedTo}
                onChange={(e) =>
                  setEditDeal({ ...editDeal, assignedTo: e.target.value })
                }
                className="w-full border rounded p-2"
              >
                <option value="">-- Select Salesman --</option>
                {users.map((u) => (
                  <option key={u._id} value={u._id}>
                    {u.firstName} {u.lastName}
                  </option>
                ))}
              </select>

              <div>
                <label className="block text-sm font-medium mb-1">Stage</label>
                <select
                  value={editDeal.stage || ""}
                  onChange={(e) =>
                    setEditDeal({ ...editDeal, stage: e.target.value })
                  }
                  className="w-full border rounded p-2"
                >
                  <option value="">-- Select Stage --</option>
                  <option>Qualification</option>
                  <option>Negotiation</option>
                  <option>Proposal Sent</option>
                  <option>Closed Won</option>
                  <option>Closed Lost</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Value</label>
                <input
                  type="number"
                  value={editDeal.value || ""}
                  onChange={(e) =>
                    setEditDeal({ ...editDeal, value: e.target.value })
                  }
                  className="w-full border rounded p-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Notes</label>
                <textarea
                  value={editDeal.notes || ""}
                  onChange={(e) =>
                    setEditDeal({ ...editDeal, notes: e.target.value })
                  }
                  className="w-full border rounded p-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Follow-Up Date</label>
                <input
                  type="datetime-local"
                  value={
                    editDeal.followUpDate
                      ? new Date(editDeal.followUpDate).toISOString().slice(0, 16)
                      : ""
                  }
                  onChange={(e) =>
                    setEditDeal({ ...editDeal, followUpDate: e.target.value })
                  }
                  className="w-full border rounded p-2"
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                  type="button"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                  type="button"
                >
                  Save
                </button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="max-w-sm p-6">
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
          </DialogHeader>
          <p>
            Are you sure you want to delete the deal{" "}
            <strong>{deleteDeal?.dealName}</strong>?
          </p>
          <div className="mt-6 flex justify-end space-x-3">
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
              type="button"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteConfirm}
              className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
              type="button"
            >
              Delete
            </button>
          </div>
        </DialogContent>
      </Dialog>
       <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
    </div>
  );
};
