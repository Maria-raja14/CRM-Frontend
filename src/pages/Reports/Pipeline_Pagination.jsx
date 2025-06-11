// import React from "react";

// const data = [
//   {
//     name: "Admin 1",
//     stages: ["5(63%)", "2(40%)", "2(100%)", "0(0%)", "0(0%)"]
//   },
//   {
//     name: "General Manager",
//     stages: ["7(100%)", "4(57%)", "1(25%)", "1(100%)", "0(0%)"]
//   },
//   {
//     name: "Rosey Martin",
//     stages: ["2(67%)", "1(50%)", "1(100%)", "1(100%)", "1(100%)"]
//   }
// ];

// const columns = [
//   "Owner Name",
//   "Negotiation > Proposal",
//   "Proposal > Qualified",
//   "Qualified > Prospects",
//   "Prospects > Won",
//   "Won > Lost"
// ];

// const OwnerTable = () => {
//   return (
//     <div className="p-10">
//       <div className="overflow-x-auto bg-white rounded-xl shadow-lg">
//         <table className="w-full table-auto border-collapse">
//           <thead>
//             <tr className="text-left text-gray-700 font-semibold border-b border-gray-300">
//               {columns.map((col, idx) => (
//                 <th
//                   key={idx}
//                   className="px-6 py-5 text-base tracking-wide whitespace-nowrap"
//                 >
//                   {col}
//                 </th>
//               ))}
//             </tr>
//           </thead>
//           <tbody>
//             {data.map((row, i) => (
//               <tr
//                 key={i}
//                 className="border-b border-gray-200 hover:bg-gray-50 transition duration-200"
//               >
//                 <td className="text-blue-600 font-semibold px-6 py-5 text-base tracking-wide whitespace-nowrap">
//                   {row.name}
//                 </td>
//                 {row.stages.map((stage, j) => (
//                   <td
//                     key={j}
//                     className="text-gray-800 px-6 py-5 text-base tracking-wide whitespace-nowrap"
//                   >
//                     {stage}
//                   </td>
//                 ))}
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default OwnerTable;


import React, { useState } from "react";
import DealNegotiationModal from "./DataView_page";

const data = [
  {
    name: "Admin 1",
    stages: ["5(63%)", "2(40%)", "2(100%)", "0(0%)", "0(0%)"]
  },
  {
    name: "General Manager",
    stages: ["7(100%)", "4(57%)", "1(25%)", "1(100%)", "0(0%)"]
  },
  {
    name: "Rosey Martin",
    stages: ["2(67%)", "1(50%)", "1(100%)", "1(100%)", "1(100%)"]
  }
];

const columns = [
  "Owner Name",
  "Negotiation > Proposal",
  "Proposal > Qualified",
  "Qualified > Prospects",
  "Prospects > Won",
  "Won > Lost"
];

const OwnerTable = () => {
  const [selectedOwner, setSelectedOwner] = useState(null);

  return (
    <div className="p-10">
      <div className="overflow-x-auto bg-white rounded-xl shadow-lg">
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="text-left text-gray-700 font-semibold border-b border-gray-300">
              {columns.map((col, idx) => (
                <th key={idx} className="px-6 py-5 text-base tracking-wide whitespace-nowrap">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr key={i} className="border-b border-gray-200 hover:bg-gray-50 transition duration-200">
                <td
                  className="text-blue-600 font-semibold px-6 py-5 text-base tracking-wide whitespace-nowrap cursor-pointer"
                  onClick={() => setSelectedOwner(row.name)}
                >
                  {row.name}
                </td>
                {row.stages.map((stage, j) => (
                  <td key={j} className="text-gray-800 px-6 py-5 text-base tracking-wide whitespace-nowrap">
                    {stage}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {selectedOwner && (
        <DealNegotiationModal
          title={`Details view of deals owned by ${selectedOwner}`}
          onClose={() => setSelectedOwner(null)}
        />
      )}
    </div>
  );
};

export default OwnerTable;
