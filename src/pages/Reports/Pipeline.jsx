// import React from "react";
// import OwnerTable from "./Pipeline_Pagination"
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
//   CartesianGrid,
//   Cell,
// } from "recharts";

// const data = [
//   { name: "Admin 1", value: 9 },
//   { name: "General Manager", value: 8 },
//   { name: "Average", value: 6.5, isAverage: true },
//   { name: "Rosey Martin", value: 4 },
// ];

// export default function DealChart() {
//   return (
//     <div className="p-4 bg-white rounded-2xl shadow">
//       {/* Top Filter Row */}
//       <div className="flex flex-wrap items-center gap-2 mb-4">
//         <button className="px-4 py-2 bg-gray-100 rounded text-sm">Pipeline</button>
//         <button className="px-4 py-2 bg-gray-100 rounded text-sm">How many new deals were started?</button>
//         <button className="px-4 py-2 bg-gray-100 rounded text-sm">Created date</button>
//       </div>

//       {/* Tabs */}
//       <div className="flex border-b text-sm font-medium mb-4">
//         <button className="px-4 py-2 text-blue-600 border-b-2 border-blue-600">By owner</button>
//         <button className="px-4 py-2 text-gray-500 hover:text-black">By stage</button>
//       </div>

//       {/* Sort By */}
//       <div className="flex justify-end items-center mb-4">
//         <span className="mr-2 text-sm text-gray-700">Order report by:</span>
//         <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm mr-2">Count</button>
//         <button className="px-3 py-1 border border-gray-300 text-sm rounded text-gray-700">Value</button>
//       </div>

//       {/* Chart */}
//       <div className="h-[480px] w-full">
//         <ResponsiveContainer width="100%" height="100%">
//           <BarChart
//             data={data}
//             layout="vertical"
//             margin={{ top: 20, right: 30, left: 40, bottom: 5 }}
//             barCategoryGap={5}
//           >
//             <CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" />
//             <XAxis
//               type="number"
//               domain={[1, 10]}
//               tickCount={10}
//               tickFormatter={(tick) => tick}
//               tick={{ fontSize: 12, fill: "#6b7280" }}
//               axisLine={false}
//               tickLine={false}
//             />
//             <YAxis
//               type="category"
//               dataKey="name"
//               tick={{ fill: "#6b7280", fontSize: 14 }}
//               axisLine={false}
//               tickLine={false}
//             />
//             <Tooltip />
//             <Bar
//               dataKey="value"
//             //   radius={[0, 6, 6, 0]}
//               barSize={26} // Increased width
//               label={{ position: "right", fill: "#4B5563", fontSize: 12 }}
//             >
//               {data.map((entry, index) => (
//                 <Cell
//                   key={`cell-${index}`}
//                   fill={entry.isAverage ? "#46cc97" : "#2e69ff"} // green or blue
//                 />
//               ))}
//             </Bar>
//           </BarChart>
//         </ResponsiveContainer>
//       </div>
//       <div className="mt-20">
//       <OwnerTable/>
//       </div>
//     </div>
//   );
// }




// import React from "react";
// import OwnerTable from "./Pipeline_Pagination";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
//   CartesianGrid,
//   Cell,
// } from "recharts";

// const data = [
//   { name: "Admin 1", value: 9 },
//   { name: "General Manager", value: 8 },
//   { name: "Average", value: 6.5, isAverage: true },
//   { name: "Rosey Martin", value: 4 },
// ];

// export default function DealChart() {
//   return (
//     <div className="p-4 bg-white rounded-2xl shadow">
//       {/* Top Filter Row */}
//       <div className="flex flex-wrap items-center gap-2 mb-4">
//         <button className="px-4 py-2 bg-gray-100 rounded text-sm">Pipeline</button>
//         <button className="px-4 py-2 bg-gray-100 rounded text-sm">How many new deals were started?</button>
//         <button className="px-4 py-2 bg-gray-100 rounded text-sm">Created date</button>
//       </div>

//       {/* Tabs */}
//       <div className="flex border-b text-sm font-medium mb-4">
//         <button className="px-4 py-2 text-blue-600 border-b-2 border-blue-600">By owner</button>
//         <button className="px-4 py-2 text-gray-500 hover:text-black">By stage</button>
//       </div>

//       {/* Sort By */}
//       <div className="flex justify-end items-center mb-4">
//         <span className="mr-2 text-sm text-gray-700">Order report by:</span>
//         <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm mr-2">Count</button>
//         <button className="px-3 py-1 border border-gray-300 text-sm rounded text-gray-700">Value</button>
//       </div>

//       {/* Chart */}
//       <div className="h-[480px] w-full">
//         <ResponsiveContainer width="100%" height="100%">
//           <BarChart
//             data={data}
//             layout="vertical"
//             margin={{ top: 20, right: 30, left: 40, bottom: 5 }}
//             barCategoryGap={5}
//           >
//             <CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" />
//             <XAxis
//               type="number"
//               domain={[1, 10]}
//               tickCount={10}
//               tickFormatter={(tick) => tick}
//               tick={{ fontSize: 12, fill: "#6b7280" }}
//               axisLine={false}
//               tickLine={false}
//             />
//             <YAxis
//               type="category"
//               dataKey="name"
//               tick={{ fill: "#6b7280", fontSize: 14 }}
//               axisLine={false}
//               tickLine={false}
//             />
//             <Tooltip />
//             <Bar
//               dataKey="value"
//               barSize={26}
//               label={{ position: "right", fill: "#4B5563", fontSize: 12 }}
//             >
//               {data.map((entry, index) => (
//                 <Cell
//                   key={`cell-${index}`}
//                   fill={entry.isAverage ? "#46cc97" : "#2e69ff"} // green or blue
//                 />
//               ))}
//             </Bar>
//           </BarChart>
//         </ResponsiveContainer>
//       </div>

//       {/* Horizontal Line */}
//       <hr className="my-8 border-t border-gray-300" />

//       {/* Table Section */}
//       <div>
//         <OwnerTable />
//       </div>
//     </div>
//   );
// }


// import React, { useState } from "react";
// import OwnerTable from "./Pipeline_Pagination";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
//   CartesianGrid,
//   Cell,
// } from "recharts";
// import { ChevronDown } from "lucide-react";

// const data = [
//   { name: "Admin 1", value: 9 },
//   { name: "General Manager", value: 8 },
//   { name: "Average", value: 6.5, isAverage: true },
//   { name: "Rosey Martin", value: 4 },
// ];

// export default function DealChart() {
//   const [dropdownOpen, setDropdownOpen] = useState(false);

//   const toggleDropdown = () => {
//     setDropdownOpen(!dropdownOpen);
//   };

//   return (
//     <div className="p-4 bg-white rounded-2xl shadow">
//       {/* Top Filter Row */}
//       <div className="flex flex-wrap items-center gap-2 mb-4 relative">
//         <button className="px-4 py-2 bg-gray-100 rounded text-sm">Pipeline</button>

//         {/* Dropdown Button */}
//         <div className="relative">
//           <button
//             onClick={toggleDropdown}
//             className="px-4 py-2 bg-gray-100 rounded text-sm flex items-center gap-1"
//           >
//             How many new deals were started?
//             <ChevronDown className="w-4 h-4" />
//           </button>

//           {/* Dropdown Content */}
//           {dropdownOpen && (
//             <div className="absolute z-10 mt-2 bg-white border rounded shadow-lg w-72">
//               <button className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm">
//                 How many deals are processing?
//               </button>
//               <button className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm">
//                 How was the journey of closed deals?
//               </button>
//             </div>
//           )}
//         </div>

//         <button className="px-4 py-2 bg-gray-100 rounded text-sm">Created date</button>
//       </div>

//       {/* Tabs */}
//       <div className="flex border-b text-sm font-medium mb-4">
//         <button className="px-4 py-2 text-blue-600 border-b-2 border-blue-600">By owner</button>
//         <button className="px-4 py-2 text-gray-500 hover:text-black">By stage</button>
//       </div>

//       {/* Sort By */}
//       <div className="flex justify-end items-center mb-4">
//         <span className="mr-2 text-sm text-gray-700">Order report by:</span>
//         <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm mr-2">Count</button>
//         <button className="px-3 py-1 border border-gray-300 text-sm rounded text-gray-700">Value</button>
//       </div>

//       {/* Chart */}
//       <div className="h-[480px] w-full">
//         <ResponsiveContainer width="100%" height="100%">
//           <BarChart
//             data={data}
//             layout="vertical"
//             margin={{ top: 20, right: 30, left: 40, bottom: 5 }}
//             barCategoryGap={5}
//           >
//             <CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" />
//             <XAxis
//               type="number"
//               domain={[1, 10]}
//               tickCount={10}
//               tickFormatter={(tick) => tick}
//               tick={{ fontSize: 12, fill: "#6b7280" }}
//               axisLine={false}
//               tickLine={false}
//             />
//             <YAxis
//               type="category"
//               dataKey="name"
//               tick={{ fill: "#6b7280", fontSize: 14 }}
//               axisLine={false}
//               tickLine={false}
//             />
//             <Tooltip />
//             <Bar
//               dataKey="value"
//               barSize={26}
//               label={{ position: "right", fill: "#4B5563", fontSize: 12 }}
//             >
//               {data.map((entry, index) => (
//                 <Cell
//                   key={`cell-${index}`}
//                   fill={entry.isAverage ? "#46cc97" : "#2e69ff"}
//                 />
//               ))}
//             </Bar>
//           </BarChart>
//         </ResponsiveContainer>
//       </div>

//       {/* Horizontal Line */}
//       <hr className="my-8 border-t border-gray-300" />

//       {/* Table Section */}
//       <div>
//         <OwnerTable />
//       </div>
//     </div>
//   );
// }//last original..




import React, { useState } from "react";
import OwnerTable from "./Pipeline_Pagination";
import ByStageCharts from "./ByStage_Charts";
import ByStagePagination from "./ByStage_Pagination";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from "recharts";
import { ChevronDown } from "lucide-react";

const data = [
  { name: "Admin 1", value: 9 },
  { name: "General Manager", value: 8 },
  { name: "Average", value: 6.5, isAverage: true },
  { name: "Rosey Martin", value: 4 },
];

export default function DealChart() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("owner"); // owner or stage

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  return (
    <div className="p-4 bg-white rounded-2xl shadow">
      {/* Top Filter Row */}
      <div className="flex flex-wrap items-center gap-2 mb-4 relative">
        <button className="px-4 py-2 bg-gray-100 rounded text-sm">Pipeline</button>

        {/* Dropdown Button */}
        <div className="relative">
          <button
            onClick={toggleDropdown}
            className="px-4 py-2 bg-gray-100 rounded text-sm flex items-center gap-1"
          >
            How many new deals were started?
            <ChevronDown className="w-4 h-4" />
          </button>

          {dropdownOpen && (
            <div className="absolute z-10 mt-2 bg-white border rounded shadow-lg w-72">
              <button className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm">
                How many deals are processing?
              </button>
              <button className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm">
                How was the journey of closed deals?
              </button>
            </div>
          )}
        </div>

        <button className="px-4 py-2 bg-gray-100 rounded text-sm">Created date</button>
      </div>

      {/* Tabs */}
      <div className="flex border-b text-sm font-medium mb-4">
        <button
          className={`px-4 py-2 ${
            activeTab === "owner"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-black"
          }`}
          onClick={() => setActiveTab("owner")}
        >
          By owner
        </button>
        <button
          className={`px-4 py-2 ${
            activeTab === "stage"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-black"
          }`}
          onClick={() => setActiveTab("stage")}
        >
          By stage
        </button>
      </div>

      {/* Sort By (Only for 'By owner') */}
      {activeTab === "owner" && (
        <div className="flex justify-end items-center mb-4">
          <span className="mr-2 text-sm text-gray-700">Order report by:</span>
          <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm mr-2">Count</button>
          <button className="px-3 py-1 border border-gray-300 text-sm rounded text-gray-700">Value</button>
        </div>
      )}

      {/* Main Content */}
      {activeTab === "owner" ? (
        <>
          {/* Chart */}
          <div className="h-[480px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                layout="vertical"
                margin={{ top: 20, right: 30, left: 40, bottom: 5 }}
                barCategoryGap={5}
              >
                <CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" />
                <XAxis
                  type="number"
                  domain={[1, 10]}
                  tickCount={10}
                  tick={{ fontSize: 12, fill: "#6b7280" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={{ fill: "#6b7280", fontSize: 14 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip />
                <Bar
                  dataKey="value"
                  barSize={26}
                  label={{ position: "right", fill: "#4B5563", fontSize: 12 }}
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.isAverage ? "#46cc97" : "#2e69ff"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Divider & Table */}
          <hr className="my-8 border-t border-gray-300" />
          <OwnerTable />
        </>
      ) : (
        <>
          {/* Show "ByStage" view */}
          <ByStageCharts />
          <div className="mt-6">
            <ByStagePagination />
          </div>
        </>
      )}
    </div>
  );
}
