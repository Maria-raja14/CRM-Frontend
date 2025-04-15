  
//Card Deals
  import React, { useState } from "react";
  import { MoreVertical, Gift, Calendar, Edit, Trash2 } from "lucide-react";
  import DealModal from "./DealModal"; 

  const CardDeals = ({ deal, onEdit, onDelete }) => {
    //console.log("CardDeals",deal)
    const [menuOpen, setMenuOpen] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedDeal, setSelectedDeal] = useState(null); 
    

    return (
      <div className="bg-white rounded shadow-2xl p-4 w-full sm:w-58 h-[300px] border border-gray-50 relative">
        {/* Three-dot menu */}
        <div className="absolute top-2 right-3 cursor-pointer">
          <MoreVertical size={18} className="text-gray-500" onClick={() => setMenuOpen(!menuOpen)} />
          
          {/* Dropdown Menu */}
          {menuOpen && (
            <div className="absolute right-0 mt-1 w-24 bg-white shadow-md rounded border">
              <button onClick={() => { onEdit(deal); setMenuOpen(false); }} className="flex items-center gap-2 w-full px-3 py-2 hover:bg-gray-100 text-gray-700">
                <Edit size={16} /> Edit
              </button>
              <button onClick={() => onDelete(deal._id)} className="flex items-center gap-2 w-full px-3 py-2 hover:bg-red-100 text-red-600">
                <Trash2 size={16} /> Delete
              </button>
            </div>
          )}
        </div>

        {/* Title - Click to Open Modal */}
        <div className="flex items-center gap-2 mb-3">
          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-600 text-white font-bold text-lg">
            {deal.title ? deal.title.charAt(0).toUpperCase() : "?"}
          </div>
          <h3 className="text-lg font-semibold text-gray-800 cursor-pointer" onClick={() => setModalOpen(true)}>
            {deal.title || "No Title"}
          </h3>
        </div>

        {/* Status Button */}
        <button className="bg-blue-600 text-white text-sm px-4 py-1 rounded-md font-medium">
          {deal.stage || "No Status"}
        </button>

        {/* Owner & Deal Value */}
        <div className="flex items-center mt-4 text-gray-600 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-300 text-xs font-semibold">
              {deal.owner ? deal.owner.charAt(0).toUpperCase() : "?"}
            </div>
            <span className="text-gray-700 font-medium">{deal.owner || "Unknown"}</span>
          </div>
          <span className="ml-auto text-blue-600 font-semibold">
            Rs. {deal.dealsValue ?? 0}
          </span>
        </div>

        {/* Icons & Closing Date */}
        <div className="text-gray-500 text-sm mt-3 space-y-2">
          <div className="flex items-center gap-2">
            <Gift size={16} className="text-gray-600" />
            <span>Not added yet</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-gray-600" />
            <span>{deal.expectingClosingDate || "No Date"}</span>
          </div>
        </div>

        {/* Comment & Proposal Count */}
        <div className="border-t pt-3 mt-3 text-gray-700 text-sm">
          <div className="flex justify-center gap-2">
            <span>Comment</span>
            <span className="bg-gray-200 px-2 py-0.5 rounded-md text-xs">
              {deal.commentCount ?? 0}
            </span>
          </div>
          <div className="mt-3 gap-2 flex justify-center">
            <span>Proposal</span>
            <span className="bg-gray-200 px-2 py-0.5 rounded-md text-xs gap-2">
              {deal.proposalCount ?? 0}
            </span>
          </div>
        </div>

        {/* Render Modal if Open */}
        {modalOpen && <DealModal deal={deal} onClose={() => setModalOpen(false)} />}
      </div>
    );
  };

  export default CardDeals;



  
  
  
