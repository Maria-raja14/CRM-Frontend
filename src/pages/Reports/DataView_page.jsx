import React from "react";
import { ClipboardList } from "lucide-react";

// const DealNegotiationModal = () => {
//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
//       <div className="bg-white w-full max-w-7xl rounded-md shadow-lg">
//         {/* Header */}
//         <div className="flex justify-between items-center p-6 border-b">
//           <h2 className="text-2xl font-semibold text-gray-800">
//             Details view of deals processing by <span className="font-bold">Negotiation</span> stage
//           </h2>
//           <button className="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
//         </div>

//         {/* Table Header */}
//         <div className="grid grid-cols-6 gap-4 text-sm font-semibold text-gray-600 px-6 py-3 border-b">
//           <div>Deal name</div>
//           <div>Lead</div>
//           <div>Client</div>
//           <div>Owner</div>
//           <div>Deal value</div>
//           <div>Deal age(days)</div>
//         </div>

//         {/* Empty State */}
//         <div className="flex flex-col items-center justify-center text-center py-20 text-gray-600">
//           <ClipboardList className="w-16 h-16 text-blue-400 mb-4" />
//           <p className="font-medium text-lg">Nothing to show here</p>
//           <p className="text-sm mt-1">
//             Please add a new entity or manage the data table to see the content here
//           </p>
//           <p className="text-sm">Thank you</p>
//         </div>

//         {/* Footer */}
//         <div className="flex justify-end px-6 py-4 border-t">
//           <button className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 transition">
//             Close
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

const DealNegotiationModal = ({ title, onClose }) => {
    return (
      <div className="fixed inset-0  bg-opacity-30 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="bg-white w-full max-w-7xl rounded-md shadow-lg">
          <div className="flex justify-between items-center p-6 border-b">
            <h2 className="text-2xl font-semibold text-gray-800">{title}</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              &times;
            </button>
          </div>
  
          {/* Table header placeholder */}
          <div className="grid grid-cols-6 gap-4 text-sm font-semibold text-gray-600 px-6 py-3 border-b">
            <div>Deal name</div>
            <div>Lead</div>
            <div>Client</div>
            <div>Owner</div>
            <div>Deal value</div>
            <div>Deal age(days)</div>
          </div>
  
          {/* Empty State */}
          <div className="flex flex-col items-center justify-center text-center py-20 text-gray-600">
            <ClipboardList className="w-16 h-16 text-blue-400 mb-4" />
            <p className="font-medium text-lg">Nothing to show here</p>
            <p className="text-sm mt-1">Please add a new entity or manage the data table to see the content here</p>
            <p className="text-sm">Thank you</p>
          </div>
  
          <div className="flex justify-end px-6 py-4 border-t">
            <button
              onClick={onClose}
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };
  

export default DealNegotiationModal;
