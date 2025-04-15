// import React from "react";

// const DealStageTable = () => {
//   const tableData = [
//     { stage: "Negotiation", started: 3, total: 5103, avg: "1.701", age: "21 days 14 hours 29 minutes" },
//     { stage: "Prospects", started: 3, total: 100000, avg: "33.333", age: "37 days 21 hours 21 minutes" },
//     { stage: "Lost", started: 1, total: 1000, avg: "1.000", age: "6 days 17 hours 3 minutes" },
//     { stage: "Proposal", started: 1, total: 0, avg: "0", age: "21 days 13 hours 29 minutes" },
//     { stage: "Qualified", started: 5, total: 4853725, avg: "970.745", age: "47 days 13 hours 33 minutes" },
//     { stage: "Won", started: 2, total: 4858500, avg: "2.429.250", age: "49 days 21 hours 24 minutes" },
//   ];

//   return (
//     <div className="p-6 ">
//       <table className="w-full table-auto text-left">
//         <thead>
//           <tr className="border-b">
//             <th className="pb-3 text-gray-600 font-semibold">Stage name</th>
//             <th className="pb-3 text-gray-600 font-semibold">Deal started</th>
//             <th className="pb-3 text-gray-600 font-semibold">Total deal value</th>
//             <th className="pb-3 text-gray-600 font-semibold">Avg deal value</th>
//             <th className="pb-3 text-gray-600 font-semibold">Avg. age of deal(days)</th>
//           </tr>
//         </thead>
//         <tbody>
//           {tableData.map((item, index) => (
//             <tr key={index} className="border-b last:border-none">
//               <td className="py-4 text-indigo-600 font-medium cursor-pointer hover:underline">{item.stage}</td>
//               <td className="py-4">{item.started}</td>
//               <td className="py-4">{item.total.toLocaleString()}</td>
//               <td className="py-4">{item.avg}</td>
//               <td className="py-4">{item.age}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default DealStageTable;



// import React from "react";

// const DealStageTable = () => {
//   const tableData = [
//     { stage: "Negotiation", started: 3, total: 5103, avg: "1.701", age: "21 days 14 hours 29 minutes" },
//     { stage: "Prospects", started: 3, total: 100000, avg: "33.333", age: "37 days 21 hours 21 minutes" },
//     { stage: "Lost", started: 1, total: 1000, avg: "1.000", age: "6 days 17 hours 3 minutes" },
//     { stage: "Proposal", started: 1, total: 0, avg: "0", age: "21 days 13 hours 29 minutes" },
//     { stage: "Qualified", started: 5, total: 4853725, avg: "970.745", age: "47 days 13 hours 33 minutes" },
//     { stage: "Won", started: 2, total: 4858500, avg: "2.429.250", age: "49 days 21 hours 24 minutes" },
//   ];

//   return (
//     <div className="w-full px-2 mx-4">
//       <div className="overflow-x-auto">
//         <table className="min-w-full table-auto text-left ">
//           <thead className="">
//             <tr className="">
//               <th className="py-3 px-4 text-gray-700 font-semibold">Stage name</th>
//               <th className="py-3 px-4 text-gray-700 font-semibold">Deal started</th>
//               <th className="py-3 px-4 text-gray-700 font-semibold">Total deal value</th>
//               <th className="py-3 px-4 text-gray-700 font-semibold">Avg deal value</th>
//               <th className="py-3 px-4 text-gray-700 font-semibold">Avg. age of deal (days)</th>
//             </tr>
//           </thead>
//           <tbody>
//             {tableData.map((item, index) => (
//               <tr key={index} className="border-b border-gray-200 last:border-none hover:bg-gray-50 transition">
//                 <td className="py-4 px-4 text-indigo-600 font-medium cursor-pointer ">{item.stage}</td>
//                 <td className="py-4 px-4">{item.started}</td>
//                 <td className="py-4 px-4">{item.total.toLocaleString()}</td>
//                 <td className="py-4 px-4">{item.avg}</td>
//                 <td className="py-4 px-4">{item.age}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default DealStageTable;



// import React from "react";

// const DealStageTable = () => {
//   const tableData = [
//     { stage: "Negotiation", started: 3, total: 5103, avg: "1.701", age: "21 days 14 hours 29 minutes" },
//     { stage: "Prospects", started: 3, total: 100000, avg: "33.333", age: "37 days 21 hours 21 minutes" },
//     { stage: "Lost", started: 1, total: 1000, avg: "1.000", age: "6 days 17 hours 3 minutes" },
//     { stage: "Proposal", started: 1, total: 0, avg: "0", age: "21 days 13 hours 29 minutes" },
//     { stage: "Qualified", started: 5, total: 4853725, avg: "970.745", age: "47 days 13 hours 33 minutes" },
//     { stage: "Won", started: 2, total: 4858500, avg: "2.429.250", age: "49 days 21 hours 24 minutes" },
//   ];

//   return (
//     <div className="w-full px-2 mx-4">
//       <div className="overflow-x-auto">
//         <table className="min-w-full table-auto text-left">
//           <thead>
//             <tr className="border-b border-gray-300">
//               <th className="py-3 px-4 text-gray-700 font-semibold">Stage name</th>
//               <th className="py-3 px-4 text-gray-700 font-semibold">Deal started</th>
//               <th className="py-3 px-4 text-gray-700 font-semibold">Total deal value</th>
//               <th className="py-3 px-4 text-gray-700 font-semibold">Avg deal value</th>
//               <th className="py-3 px-4 text-gray-700 font-semibold">Avg. age of deal (days)</th>
//             </tr>
//           </thead>
//           <tbody>
//             {tableData.map((item, index) => (
//               <tr
//                 key={index}
//                 className="border-b border-gray-200 last:border-none hover:bg-gray-50 transition"
//               >
//                 <td className="py-4 px-4 text-indigo-600 font-medium cursor-pointer">{item.stage}</td>
//                 <td className="py-4 px-4">{item.started}</td>
//                 <td className="py-4 px-4">{item.total.toLocaleString()}</td>
//                 <td className="py-4 px-4">{item.avg}</td>
//                 <td className="py-4 px-4">{item.age}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default DealStageTable;//ori


import React, { useState } from "react";
import DealNegotiationModal from "./DataView_page";

const DealStageTable = () => {
  const [selectedStage, setSelectedStage] = useState(null);

  const tableData = [
    { stage: "Negotiation", started: 3, total: 5103, avg: "1.701", age: "21 days 14 hours 29 minutes" },
    { stage: "Prospects", started: 3, total: 100000, avg: "33.333", age: "37 days 21 hours 21 minutes" },
    { stage: "Lost", started: 1, total: 1000, avg: "1.000", age: "6 days 17 hours 3 minutes" },
    { stage: "Proposal", started: 1, total: 0, avg: "0", age: "21 days 13 hours 29 minutes" },
    { stage: "Qualified", started: 5, total: 4853725, avg: "970.745", age: "47 days 13 hours 33 minutes" },
    { stage: "Won", started: 2, total: 4858500, avg: "2.429.250", age: "49 days 21 hours 24 minutes" },
  ];

  return (
    <div className="w-full px-2 mx-4">
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto text-left">
          <thead>
            <tr className="border-b border-gray-300">
              <th className="py-3 px-4 text-gray-700 font-semibold">Stage name</th>
              <th className="py-3 px-4 text-gray-700 font-semibold">Deal started</th>
              <th className="py-3 px-4 text-gray-700 font-semibold">Total deal value</th>
              <th className="py-3 px-4 text-gray-700 font-semibold">Avg deal value</th>
              <th className="py-3 px-4 text-gray-700 font-semibold">Avg. age of deal (days)</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((item, index) => (
              <tr
                key={index}
                className="border-b border-gray-200 last:border-none hover:bg-gray-50 transition"
              >
                <td
                  className="py-4 px-4 text-indigo-600 font-medium cursor-pointer"
                  onClick={() => setSelectedStage(item.stage)}
                >
                  {item.stage}
                </td>
                <td className="py-4 px-4">{item.started}</td>
                <td className="py-4 px-4">{item.total.toLocaleString()}</td>
                <td className="py-4 px-4">{item.avg}</td>
                <td className="py-4 px-4">{item.age}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {selectedStage && (
        <DealNegotiationModal
          title={`Details view of deals processing by ${selectedStage} stage`}
          onClose={() => setSelectedStage(null)}
        />
      )}
    </div>
  );
};

export default DealStageTable;

