import React, { useMemo, useState, useEffect, useRef } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { useNavigate } from "react-router-dom";

// ----- Stages (match backend exactly) -----
const STAGES = [
  {
    id: "Qualification",
    title: "Qualification",
    color: "text-blue-600",
    bgColor: "bg-gray-100",
    borderColor: "border-gray-300"
  },
  {
    id: "Negotiation",
    title: "Negotiation",
    color: "text-amber-600",
    bgColor: "bg-gray-100",
    borderColor: "border-gray-300"
  },
  {
    id: "Proposal Sent",
    title: "Proposal Sent",
    color: "text-cyan-600",
    bgColor: "bg-gray-100",
    borderColor: "border-gray-300"
  },
  {
    id: "Closed Won",
    title: "Closed Won",
    color: "text-emerald-600",
    bgColor: "bg-gray-100",
    borderColor: "border-gray-300"
  },
  {
    id: "Closed Lost",
    title: "Closed Lost",
    color: "text-rose-600",
    bgColor: "bg-gray-100",
    borderColor: "border-gray-300"
  },
];

// ----- Drag types -----
const ItemTypes = {
  DEAL: "DEAL"
};

function formatNumber(n) {
  return new Intl.NumberFormat("en-IN").format(n);
}

function formatDate(dateString) {
  if (!dateString) return "—";
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(date);
}

// ----- Main Pipeline Board -----
function SalesPipelineBoardPure() {
  const [columns, setColumns] = useState({});
  const [leads, setLeads] = useState([]);
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [dealToDelete, setDealToDelete] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [dealToEdit, setDealToEdit] = useState(null);
  const [users, setUsers] = useState([]);
  const [userRole, setUserRole] = useState("");
  const [userId, setUserId] = useState("");
  const [editFormData, setEditFormData] = useState({
    dealName: "",
    value: 0,
    assignedTo: "",
    companyName: "",
    notes: "",
    followUpDate: ""
  });
  const [isUpdating, setIsUpdating] = useState(false);
  
  const navigate = useNavigate();

  const scrollRef = useRef(null);

  // Get user info from localStorage
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData) {
      setUserRole(userData.role?.name || "");
      setUserId(userData._id || "");
    }
  }, []);

  // 🔹 Fetch Deals and Leads on mount
  useEffect(() => {
    if (userRole) {
      fetchData();
      fetchUsers();
    }
  }, [userRole]);

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

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      
      // Fetch deals
      const dealsRes = await axios.get("http://localhost:5000/api/deals/getAll", {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Fetch leads
      const leadsRes = await axios.get("http://localhost:5000/api/leads/getAllLead", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLeads(leadsRes.data);
      
      // Group deals by stage
      const grouped = {};
      STAGES.forEach((s) => (grouped[s.id] = []));
      
      dealsRes.data.forEach((deal) => {
        if (!grouped[deal.stage]) grouped[deal.stage] = [];
        
        // Find associated lead data
        const associatedLead = leadsRes.data.find(lead =>
          lead._id === deal.leadId || lead.companyName === deal.companyName
        );
        
        // Enhance deal with lead information
        const enhancedDeal = {
          ...deal,
          companyName: deal.companyName || (associatedLead ? associatedLead.companyName : "")
        };
        
        grouped[deal.stage].push(enhancedDeal);
      });
      
      setColumns(grouped);
    } catch (err) {
      console.error(err);
      // Fallback to empty columns if API fails
      const emptyColumns = {};
      STAGES.forEach((s) => (emptyColumns[s.id] = []));
      setColumns(emptyColumns);
    } finally {
      setIsLoading(false);
    }
  };

  const allItems = useMemo(() => Object.values(columns).flat(), [columns]);

  async function addDeal(stageId) {
    const title = prompt("Deal title");
    if (!title) return;
    const valueStr = prompt("Value (₹)");
    const value = Number(valueStr || 0) || 0;
    const assignedTo = prompt("Assigned User ID"); // must be userId from DB

    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:5000/api/deals/createManual", {
        dealName: title,
        value,
        assignedTo,
        stage: stageId,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
      toast.success("Deal created successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to create deal. Please try again.");
    }
  }

  // Check if user can edit/delete a deal
  const canEditDeleteDeal = (deal) => {
    if (userRole === "Admin") return true;
    return deal.assignedTo && deal.assignedTo._id === userId;
  };

  // Simplified moveDeal - local update + API call
  async function moveDeal(dealId, fromStage, toStage) {
    if (fromStage === toStage) return;

    // 🔹 Local state update for instant UI
    setColumns(prev => {
      let deal;
      const next = { ...prev };
      next[fromStage] = prev[fromStage].filter(d => {
        if (d._id === dealId) {
          deal = d;
          return false;
        }
        return true;
      });
      if (deal) {
        next[toStage] = [...prev[toStage], { ...deal, stage: toStage }];
      }
      return next;
    });

    // 🔹 API call to persist change
    try {
      const token = localStorage.getItem("token");
      await axios.patch(`http://localhost:5000/api/deals/update-deal/${dealId}`, {
        stage: toStage,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Removed the toast.success message for stage updates
    } catch (err) {
      console.error("Failed to update deal stage:", err);
      toast.error("Failed to save stage change! Please refresh.");
      // optional: rollback by re-fetching deals
      fetchData();
    }
  }

  // Handle delete confirmation
  const handleDeleteClick = (deal) => {
    if (!canEditDeleteDeal(deal)) {
      toast.error("You don't have permission to delete this deal");
      return;
    }
    setDealToDelete(deal);
    setDeleteConfirmOpen(true);
  };

  // Handle actual deletion
  const handleDeleteConfirm = async () => {
    try {
      const token = localStorage.getItem("token");
      // Update UI immediately
      setColumns(prev => {
        const next = { ...prev };
        for (const stage in next) {
          next[stage] = next[stage].filter(d => d._id !== dealToDelete._id);
        }
        return next;
      });
      
      await axios.delete(`http://localhost:5000/api/deals/delete-deal/${dealToDelete._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Deal deleted successfully!");
    } catch (err) {
      console.error("Failed to delete deal:", err);
      toast.error("Failed to delete deal! Please try again.");
      // Revert UI changes if API call fails
      fetchData();
    } finally {
      setDeleteConfirmOpen(false);
      setDealToDelete(null);
    }
  };

  // Handle edit click
  const handleEditClick = (deal) => {
    if (!canEditDeleteDeal(deal)) {
      toast.error("You don't have permission to edit this deal");
      return;
    }
    setDealToEdit(deal);
    setEditFormData({
      dealName: deal.dealName,
      value: deal.value,
      assignedTo: deal.assignedTo?._id || "",
      companyName: deal.companyName || "",
      notes: deal.notes || "",
      followUpDate: deal.followUpDate ? new Date(deal.followUpDate).toISOString().split('T')[0] : ""
    });
    setEditDialogOpen(true);
  };

  // Handle view click - navigate to pipeline view page with dealId parameter
  const handleViewClick = (deal) => {
    navigate(`/Pipelineview/${deal._id}`);
  };

  // Handle form input changes
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: name === "value" ? Number(value) : value
    }));
  };

  // Handle form submission
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    
    try {
      const token = localStorage.getItem("token");
      // Update UI immediately
      setColumns(prev => {
        const next = { ...prev };
        for (const stage in next) {
          next[stage] = next[stage].map(d => {
            if (d._id === dealToEdit._id) {
              return {
                ...d,
                dealName: editFormData.dealName,
                value: editFormData.value,
                assignedTo: users.find(u => u._id === editFormData.assignedTo) || d.assignedTo,
                companyName: editFormData.companyName,
                notes: editFormData.notes,
                followUpDate: editFormData.followUpDate
              };
            }
            return d;
          });
        }
        return next;
      });
      
      await axios.patch(`http://localhost:5000/api/deals/update-deal/${dealToEdit._id}`, editFormData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEditDialogOpen(false);
      toast.success("Deal updated successfully!");
    } catch (err) {
      console.error("Failed to update deal:", err);
      toast.error("Failed to update deal! Please try again.");
      // Revert UI changes if API call fails
      fetchData();
    } finally {
      setIsUpdating(false);
    }
  };

  // Filter deals for search query
  const filtered = useMemo(() => {
    if (!query.trim()) return columns;
    const q = query.toLowerCase();
    const obj = {};
    for (const key of Object.keys(columns)) {
      obj[key] = columns[key].filter(
        (d) =>
          d.dealName.toLowerCase().includes(q) ||
          (d.companyName || "").toLowerCase().includes(q) ||
          (d.assignedTo?.firstName || "").toLowerCase().includes(q) ||
          (d.assignedTo?.lastName || "").toLowerCase().includes(q)
      );
    }
    return obj;
  }, [columns, query]);

  // Calculate total values per column
  const totals = useMemo(() => {
    const t = {};
    for (const key of Object.keys(columns)) {
      t[key] = columns[key].reduce((sum, d) => sum + (d.value || 0), 0);
    }
    return t;
  }, [columns]);

  // Auto horizontal scroll while dragging (optional)
  useEffect(() => {
    function handleDrag(e) {
      const container = scrollRef.current;
      if (!container) return;

      const { clientX } = e;
      const { left, right } = container.getBoundingClientRect();
      const scrollAmount = 40; // speed

      if (clientX - left < 80) {
        container.scrollLeft -= scrollAmount;
      } else if (right - clientX < 80) {
        container.scrollLeft += scrollAmount;
      }
    }

    window.addEventListener("dragover", handleDrag);
    return () => window.removeEventListener("dragover", handleDrag);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen w-full bg-gray-50 p-4 md:p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading deals...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gray-50 p-4 md:p-6 ">
      <ToastContainer position="top-right" autoClose={3000} />
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Are you sure you want to delete the deal "{dealToDelete?.dealName}"?</p>
            <p className="text-sm text-gray-500 mt-2">This action cannot be undone.</p>
          </div>
          <div className="flex justify-end gap-3">
            <button
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
              onClick={() => setDeleteConfirmOpen(false)}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              onClick={handleDeleteConfirm}
            >
              Delete
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Deal Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Deal</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4 py-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Deal Name</label>
              <input
                type="text"
                name="dealName"
                value={editFormData.dealName}
                onChange={handleEditChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Value (₹)</label>
              <input
                type="number"
                name="value"
                value={editFormData.value}
                onChange={handleEditChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Assigned To</label>
              <select
                name="assignedTo"
                value={editFormData.assignedTo}
                onChange={handleEditChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                required
                disabled={userRole !== "Admin"} // Only admin can reassign deals
              >
                <option value="">-- Select Salesperson --</option>
                {users.map((u) => (
                  <option key={u._id} value={u._id}>
                    {u.firstName} {u.lastName}
                  </option>
                ))}
              </select>
              {userRole !== "Admin" && (
                <p className="text-xs text-gray-500 mt-1">Only admins can reassign deals</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
              <input
                type="text"
                name="companyName"
                value={editFormData.companyName}
                onChange={handleEditChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <textarea
                name="notes"
                value={editFormData.notes}
                onChange={handleEditChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                rows="3"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Follow-up Date</label>
              <input
                type="date"
                name="followUpDate"
                value={editFormData.followUpDate}
                onChange={handleEditChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
                onClick={() => setEditDialogOpen(false)}
                disabled={isUpdating}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center justify-center min-w-[80px]"
                disabled={isUpdating}
              >
                {isUpdating ? (
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  "Update"
                )}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Toolbar */}
      <div className="mx-auto mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between max-w-[1600px]">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Sales Pipeline</h1>
          <p className="text-sm text-gray-500 mt-1">
            {userRole === "Admin"
              ? "Viewing all deals"
              : "Viewing deals assigned to you"}
          </p>
        </div>
        <div className="flex gap-2 items-center">
          <input
            className="w-72 border border-gray-200 bg-white px-4 py-2 rounded-lg shadow-sm outline-none focus:ring-2 focus:ring-indigo-200"
            placeholder="Search deals…"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          {userRole === "Admin" && (
            <button
              className=" bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm"
              onClick={() =>navigate("/createDeal")}
            >
              + Add Deal
            </button>
          )}
        </div>
      </div>

      {/* Board */}
      <div ref={scrollRef} className="mx-auto flex gap-4 overflow-x-auto pb-4 max-w-[1600px]">
        {STAGES.map(stage => (
          <Column
            key={stage.id}
            id={stage.id}
            title={stage.title}
            titleColor={stage.color}
            bgColor={stage.bgColor}
            borderColor={stage.borderColor}
            deals={filtered[stage.id] || []}
            moveDeal={moveDeal}
            onEdit={handleEditClick}
            onDelete={handleDeleteClick}
            onView={handleViewClick}
            userRole={userRole}
            userId={userId}
          />
        ))}
      </div>
    </div>
  );
}

// ----- Column component -----
function Column({ id, title, titleColor, bgColor, borderColor, deals, moveDeal, onEdit, onDelete, onView, userRole, userId }) {
  const [, dropRef] = useDrop({
    accept: ItemTypes.DEAL,
    drop: (item) => {
      if (item.from !== id) {
        moveDeal(item.id, item.from, id);
      }
    }
  });

  return (
    <div
      ref={dropRef}
      className={`min-w-[340px] w-[360px] flex flex-col border-2 border-gray-200 rounded-xl bg-white p-3 shadow-sm`}
    >
      <div className="mb-3">
        <h2 className={`text-base font-bold flex items-center gap-2 ${titleColor} ${bgColor} p-3 rounded-lg`}>
          {title}
          <span className="inline-flex items-center justify-center border px-2 py-0.5 text-xs text-gray-600 bg-white rounded-full min-w-[24px]">
            {deals.length}
          </span>
        </h2>
      </div>
      <div className="flex-1 overflow-y-auto max-h-[calc(100vh-220px)] pr-2">
        <div className="flex flex-col gap-3 pb-2">
          {deals.map((deal) => (
            <DealCard
              key={deal._id}
              deal={deal}
              stageId={id}
              moveDeal={moveDeal}
              onEdit={onEdit}
              onDelete={onDelete}
              onView={onView}
              userRole={userRole}
              userId={userId}
            />
          ))}
          {deals.length === 0 && (
            <div className="mt-6 border-2 border-dashed border-gray-200 p-6 text-center text-sm text-gray-500 rounded-xl">
              Drop deals here
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ----- Deal Card -----
function DealCard({ deal, stageId, moveDeal, onEdit, onDelete, onView, userRole, userId }) {
  const [{ isDragging }, dragRef] = useDrag({
    type: ItemTypes.DEAL,
    item: { id: deal._id, from: stageId },
    collect: monitor => ({ isDragging: monitor.isDragging() })
  });

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Check if user can edit/delete this deal
  const canEditDelete = userRole === "Admin" || (deal.assignedTo && deal.assignedTo._id === userId);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  function getStageColor() {
    return "bg-gray-50 border-gray-200";
  }

  const assignedToName = deal.assignedTo
    ? `${deal.assignedTo.firstName || ''} ${deal.assignedTo.lastName || ''}`.trim()
    : "—";

  return (
    <div
      ref={dragRef}
      className={`border ${getStageColor()} p-4 rounded-xl shadow-sm hover:shadow-md transition-all cursor-move flex flex-col gap-3 relative`}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      {/* Three-dot menu - only show if user has permission */}
      {canEditDelete && (
        <div className="absolute top-3 right-3" ref={menuRef}>
          <button
            className="p-1 rounded hover:bg-gray-100"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 16 16">
              <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
            </svg>
          </button>
          
          {menuOpen && (
            <div className="absolute right-0 mt-1 w-32 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200">
              <button
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => {
                  onEdit(deal);
                  setMenuOpen(false);
                }}
              >
                Edit
              </button>
              <button
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => {
                  onView(deal);
                  setMenuOpen(false);
                }}
              >
                View
              </button>
              <button
                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                onClick={() => {
                  onDelete(deal);
                  setMenuOpen(false);
                }}
              >
                Delete
              </button>
            </div>
          )}
        </div>
      )}

      {/* Deal Name - Centered and emphasized */}
      <div className={`text-center ${canEditDelete ? 'pr-6' : ''}`}>
        <h3
          className="text-md font-bold text-gray-800 mb-1 cursor-pointer hover:text-indigo-600 transition-colors"
          onClick={() => onView(deal)}
        >
          {deal.dealName}
        </h3>
        <div className="text-xs font-medium text-gray-500 bg-white py-1 px-2 rounded-full inline-block">
          {deal.companyName || "No company"}
        </div>
      </div>

      {/* Deal Details */}
      <div className="bg-white p-3 rounded-lg border border-gray-100">
        <div className="grid grid-cols-2 gap-3">
          {/* Value */}
          <div className="flex items-center">
            <div className="bg-indigo-100 p-1.5 rounded-md mr-2">
              <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <div className="text-xs text-gray-500">Value</div>
              <div className="text-sm font-semibold text-gray-800">₹{formatNumber(deal.value || 0)}</div>
            </div>
          </div>

          {/* Assigned To */}
          <div className="flex items-center">
            <div className="bg-purple-100 p-1.5 rounded-md mr-2">
              <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <div className="text-xs text-gray-500">Assigned To</div>
              <div className="text-sm font-medium text-gray-800 truncate max-w-[120px]" title={assignedToName}>
                {assignedToName}
              </div>
            </div>
          </div>

          {/* Created Date */}
          <div className="flex items-center col-span-2">
            <div className="bg-amber-100 p-1.5 rounded-md mr-2">
              <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <div className="text-xs text-gray-500">Created</div>
              <div className="text-sm font-medium text-gray-800">{formatDate(deal.createdAt)}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Notes preview */}
      {/* {deal.notes && (
        <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded-md">
          <div className="font-medium mb-1">Notes:</div>
          <div className="truncate">{deal.notes}</div>
        </div>
      )} */}

      {/* Follow-up date */}
      {deal.followUpDate && (
        <div className="flex items-center text-xs text-amber-600 bg-amber-50 p-2 rounded-md">
          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Follow-up: {formatDate(deal.followUpDate)}
        </div>
      )}

      {/* Tags */}
      {deal.tags?.length ? (
        <div className="flex flex-wrap gap-1">
          {deal.tags.map((t, i) => (
            <span key={i} className="bg-indigo-100 px-2 py-1 text-xs font-medium text-indigo-700 rounded-full">{t}</span>
          ))}
        </div>
      ) : null}

      {/* Stage Indicator */}
      <div className="flex justify-between items-center text-xs mt-1">
        <span className="text-gray-500">Stage:</span>
        <span className="font-bold text-gray-700">{stageId}</span>
      </div>
    </div>
  );
}

// ----- DndProvider wrapper -----
export default function SalesPipelineBoard() {
  return (
    <DndProvider backend={HTML5Backend}>
      <SalesPipelineBoardPure />
    </DndProvider>
  );
}