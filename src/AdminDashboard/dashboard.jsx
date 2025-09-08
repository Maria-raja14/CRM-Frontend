// import React, { useEffect, useState, useCallback, useRef } from "react";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
// } from "../components/ui/card";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
//   PieChart,
//   Pie,
//   Cell,
//   Legend,
//   LineChart,
//   Line,
// } from "recharts";
// import axios from "axios";

// /* ---------- Helpers ---------- */
// const formatDate = (d) => {
//   const yyyy = d.getFullYear();
//   const mm = String(d.getMonth() + 1).padStart(2, "0");
//   const dd = String(d.getDate()).padStart(2, "0");
//   return `${yyyy}-${mm}-${dd}`;
// };

// const todayRange = () => {
//   const now = new Date();
//   return { start: formatDate(now), end: formatDate(now) };
// };

// const lastNDaysRange = (n) => {
//   const end = new Date();
//   const start = new Date();
//   start.setDate(end.getDate() - (n - 1));
//   return { start: formatDate(start), end: formatDate(end) };
// };

// const months = [
//   { label: "January", value: 0 },
//   { label: "February", value: 1 },
//   { label: "March", value: 2 },
//   { label: "April", value: 3 },
//   { label: "May", value: 4 },
//   { label: "June", value: 5 },
//   { label: "July", value: 6 },
//   { label: "August", value: 7 },
//   { label: "September", value: 8 },
//   { label: "October", value: 9 },
//   { label: "November", value: 10 },
//   { label: "December", value: 11 },
// ];

// /* Debounce helper */
// const useDebouncedCallback = (fn, delay = 400) => {
//   const timer = useRef(null);
//   const call = useCallback(
//     (...args) => {
//       if (timer.current) clearTimeout(timer.current);
//       timer.current = setTimeout(() => fn(...args), delay);
//     },
//     [fn, delay]
//   );
//   useEffect(() => () => timer.current && clearTimeout(timer.current), []);
//   return call;
// };

// const COLORS = ["#3B82F6", "#10B981", "#EF4444", "#8B5CF6"];

// /* ---------- Component ---------- */
// const AdminDashboard = () => {
//   const [summary, setSummary] = useState([]);
//   const [pipeline, setPipeline] = useState([]);
//   const [recentInvoices, setRecentInvoices] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const [dealsData, setDealsData] = useState([]);
//   const [totalDeals, setTotalDeals] = useState(0);
//   const [statusCounts, setStatusCounts] = useState({
//     open: 0,
//     won: 0,
//     lost: 0,
//   });

//   const [activePreset, setActivePreset] = useState("today");
//   const [showMonthDropdown, setShowMonthDropdown] = useState(false);
//   const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());

//   /* ---------- Month Range ---------- */
//   const getMonthRange = (monthIndex) => {
//     const now = new Date();
//     const start = new Date(now.getFullYear(), monthIndex, 1);
//     const end = new Date(now.getFullYear(), monthIndex + 1, 0);
//     return { start: formatDate(start), end: formatDate(end) };
//   };

//   const applyMonthFilter = (monthIndex) => {
//     setSelectedMonth(monthIndex);
//     const range = getMonthRange(monthIndex);
//     debouncedFetch(range);
//   };

//   /* ---------- Fetch Deals ---------- */
//   const fetchDeals = async (params) => {
//     try {
//       const token = localStorage.getItem("token"); // get saved token
//       const res = await axios.get("http://localhost:5000/api/deals/getAll", {
//         params,
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       const deals = res.data || [];
//       const counts = { open: 0, won: 0, lost: 0 };

//       deals.forEach((deal) => {
//         if (deal.stage === "Qualification" || deal.stage === "Open")
//           counts.open += 1;
//         else if (deal.stage === "Closed Won") counts.won += 1;
//         else if (deal.stage === "Closed Lost") counts.lost += 1;
//       });

//       setTotalDeals(deals.length);
//       setStatusCounts(counts);

//       const monthlyData = {};
//       deals.forEach((deal) => {
//         const month = new Date(deal.createdAt).toLocaleString("default", {
//           month: "short",
//         });
//         if (!monthlyData[month])
//           monthlyData[month] = { month, open: 0, won: 0, lost: 0, total: 0 };
//         if (deal.stage === "Qualification" || deal.stage === "Open")
//           monthlyData[month].open += 1;
//         else if (deal.stage === "Closed Won") monthlyData[month].won += 1;
//         else if (deal.stage === "Closed Lost") monthlyData[month].lost += 1;
//         monthlyData[month].total += 1;
//       });

//       setDealsData(Object.values(monthlyData));
//     } catch (err) {
//       console.error("Error fetching deals:", err);
//     }
//   };

//   /* ---------- Fetch Dashboard Data ---------- */
//   const buildParams = (range) => ({ start: range.start, end: range.end });

//   const fetchAll = async (params) => {
//     setLoading(true);
//     setError(null);
//     try {
//       const [resSummary, resPipeline, resInvoices] = await Promise.all([
//         axios.get("http://localhost:5000/api/dashboard/summary", { params }),
//         axios.get("http://localhost:5000/api/dashboard/pipeline", { params }),
//         axios.get("http://localhost:5000/api/invoice/recent", { params }),
//       ]);

//       setSummary([
//         {
//           title: "Total Leads",
//           value: resSummary.data.totalLeads,
//           color: "bg-blue-100",
//           textColor: "text-blue-800",
//           icon: (
//             <svg
//               className="w-6 h-6"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//               xmlns="http://www.w3.org/2000/svg"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
//               />
//             </svg>
//           ),
//         },
//         {
//           title: "Deals Won",
//           value: resSummary.data.totalDealsWon,
//           color: "bg-green-100",
//           textColor: "text-green-800",
//           icon: (
//             <svg
//               className="w-6 h-6"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//               xmlns="http://www.w3.org/2000/svg"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
//               />
//             </svg>
//           ),
//         },
//         {
//           title: "Revenue",
//           value: `₹${resSummary.data.totalRevenue}`,
//           color: "bg-purple-100",
//           textColor: "text-purple-800",
//           icon: (
//             <svg
//               className="w-6 h-6"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//               xmlns="http://www.w3.org/2000/svg"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
//               />
//             </svg>
//           ),
//         },
//         {
//           title: "Pending Invoices",
//           value: resSummary.data.pendingInvoices,
//           color: "bg-amber-100",
//           textColor: "text-amber-800",
//           icon: (
//             <svg
//               className="w-6 h-6"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//               xmlns="http://www.w3.org/2000/svg"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
//               />
//             </svg>
//           ),
//         },
//       ]);

//       setPipeline(resPipeline.data || []);
//       setRecentInvoices(resInvoices.data || []);
//     } catch (err) {
//       console.error("Dashboard fetch error:", err);
//       setError("Failed to load dashboard data.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const debouncedFetch = useDebouncedCallback((range) => {
//     fetchAll(buildParams(range));
//     fetchDeals(buildParams(range));
//   }, 300);

//   /* ---------- Filter Presets ---------- */
//   const applyPreset = (preset) => {
//     setActivePreset(preset);
//     setShowMonthDropdown(preset === "month");
//     let range;
//     if (preset === "today") range = todayRange();
//     else if (preset === "7days") range = lastNDaysRange(7);
//     else if (preset === "month") range = getMonthRange(selectedMonth);
//     else range = todayRange();

//     debouncedFetch(range);
//   };

//   /* ---------- Initial Fetch ---------- */
//   useEffect(() => {
//     applyPreset(activePreset);
//   }, []); // eslint-disable-line react-hooks/exhaustive-deps

//   /* ---------- Invoice Chart Data ---------- */
//   const groupedInvoices = recentInvoices.reduce((acc, inv) => {
//     const status = inv.status?.toLowerCase() || "unknown";
//     acc[status] = (acc[status] || 0) + (inv.total || 0);
//     return acc;
//   }, {});

//   const invoiceChartData = Object.entries(groupedInvoices).map(
//     ([status, total]) => ({ status, total })
//   );

//   const pieData = [
//     { name: `Open ${statusCounts.open}`, value: statusCounts.open },
//     { name: `Won ${statusCounts.won}`, value: statusCounts.won },
//     { name: `Lost ${statusCounts.lost}`, value: statusCounts.lost },
//   ];

//   const mergedDealsData = [
//     "Jan",
//     "Feb",
//     "Mar",
//     "Apr",
//     "May",
//     "Jun",
//     "Jul",
//     "Aug",
//     "Sep",
//     "Oct",
//     "Nov",
//     "Dec",
//   ].map((m) => {
//     const found = dealsData.find((d) => d.month === m);
//     return {
//       month: m,
//       open: found ? found.open : 0,
//       won: found ? found.won : 0,
//       lost: found ? found.lost : 0,
//       total: found ? found.total : 0,
//     };
//   });

//   if (loading)
//     return (
//       <div className="p-6 text-center text-gray-600">Loading Dashboard...</div>
//     );

//   return (
//     <div className="p-6 space-y-6 min-h-screen bg-gray-50">
//       {/* Filter Buttons */}
//       <div className="flex items-center justify-end gap-2 flex-wrap">
//         {["today", "7days", "month"].map((preset) => (
//           <div key={preset} className="relative">
//             <button
//               onClick={() => applyPreset(preset)}
//               className={`px-3 py-1 rounded-md text-sm font-medium ${
//                 activePreset === preset
//                   ? "bg-indigo-600 text-white"
//                   : "bg-white border"
//               }`}
//             >
//               {preset === "today"
//                 ? "Today"
//                 : preset === "7days"
//                 ? "Last 7 Days"
//                 : "Month"}
//             </button>

//             {/* Month Dropdown */}
//             {preset === "month" &&
//               activePreset === "month" &&
//               showMonthDropdown && (
//                 <div className="absolute mt-1 w-40 bg-white border rounded shadow z-10">
//                   {months.map((m) => (
//                     <div
//                       key={m.value}
//                       onClick={() => {
//                         applyMonthFilter(m.value);
//                         setShowMonthDropdown(false);
//                       }}
//                       className={`px-3 py-1 cursor-pointer hover:bg-indigo-100 ${
//                         selectedMonth === m.value
//                           ? "bg-indigo-200 font-semibold"
//                           : ""
//                       }`}
//                     >
//                       {m.label}
//                     </div>
//                   ))}
//                 </div>
//               )}
//           </div>
//         ))}
//       </div>

//       {error && <div className="text-red-600 text-sm">{error}</div>}

//       {/* ---- Summary Cards ---- */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//         {summary.map((card, idx) => (
//           <div
//             key={idx}
//             className={`relative overflow-hidden rounded-2xl p-6 shadow-md transition-all duration-300 hover:shadow-lg ${card.color}`}
//           >
//             <div className="flex justify-between items-start">
//               <div>
//                 <p className={`text-sm font-medium ${card.textColor} mb-2`}>
//                   {card.title}
//                 </p>
//                 <p className={`text-3xl font-bold ${card.textColor}`}>
//                   {card.value}
//                 </p>
//               </div>
//               <div
//                 className={`p-2 rounded-full ${card.textColor} bg-opacity-20`}
//               >
//                 {card.icon}
//               </div>
//             </div>
//             <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent to-transparent via-current opacity-20"></div>
//           </div>
//         ))}
//       </div>

//       {/* Pipeline + Recent Invoices */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         <div className="relative overflow-hidden rounded-2xl shadow-md bg-white p-6">
//           <CardHeader>
//             <CardTitle className="text-gray-800 text-lg font-semibold">
//               Pipeline Board
//             </CardTitle>
//           </CardHeader>
//           <CardContent className="h-72">
//             {pipeline.length > 0 ? (
//               <ResponsiveContainer width="100%" height="100%">
//                 <BarChart
//                   data={pipeline}
//                   margin={{ top: 20, right: 20, left: 0, bottom: 20 }}
//                 >
//                   <XAxis
//                     dataKey="stage"
//                     stroke="#6B7280"
//                     tick={{ fontSize: 12, fill: "#374151" }}
//                   />
//                   <YAxis
//                     allowDecimals={false}
//                     stroke="#6B7280"
//                     tick={{ fontSize: 12, fill: "#374151" }}
//                   />
//                   <Tooltip
//                     cursor={{ fill: "rgba(243,244,246,0.5)" }}
//                     contentStyle={{
//                       backgroundColor: "white",
//                       borderRadius: "12px",
//                       border: "1px solid #e5e7eb",
//                       boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
//                     }}
//                     formatter={(value) => [`${value} Deals`, "Deals"]}
//                   />
//                   <Bar
//                     dataKey="leads"
//                     fill="#3B82F6"
//                     barSize={40}
//                     radius={[8, 8, 0, 0]}
//                   />
//                 </BarChart>
//               </ResponsiveContainer>
//             ) : (
//               <p className="text-gray-500 text-center">No pipeline data</p>
//             )}
//           </CardContent>
//         </div>

//         <div className="relative overflow-hidden rounded-2xl shadow-md bg-white p-6">
//           <CardHeader>
//             <CardTitle className="text-gray-800 text-lg font-semibold">
//               Recent Invoices
//             </CardTitle>
//           </CardHeader>
//           <CardContent className="h-72">
//             {invoiceChartData.length > 0 ? (
//               <ResponsiveContainer width="100%" height="100%">
//                 <BarChart
//                   data={invoiceChartData}
//                   margin={{ top: 20, right: 20, left: 0, bottom: 20 }}
//                 >
//                   <XAxis
//                     dataKey="status"
//                     stroke="#6B7280"
//                     tick={{ fontSize: 12, fill: "#374151" }}
//                   />
//                   <YAxis
//                     allowDecimals={false}
//                     stroke="#6B7280"
//                     tick={{ fontSize: 12, fill: "#374151" }}
//                   />
//                   <Tooltip
//                     formatter={(value, name) => [
//                       `₹${value.toLocaleString()}`,
//                       name,
//                     ]}
//                     cursor={{ fill: "rgba(243,244,246,0.5)" }}
//                     contentStyle={{
//                       backgroundColor: "white",
//                       borderRadius: "12px",
//                       border: "1px solid #e5e7eb",
//                       boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
//                     }}
//                   />
//                   <Bar dataKey="total" barSize={40} radius={[8, 8, 0, 0]}>
//                     {invoiceChartData.map((entry, index) => {
//                       const colors = {
//                         paid: "#34D399",
//                         unpaid: "#3B82F6",
//                         Pending: "#FBBF24",
//                         Overdue: "#EF4444",
//                       };
//                       return (
//                         <Cell
//                           key={index}
//                           fill={colors[entry.status] || "#6366F1"}
//                         />
//                       );
//                     })}
//                   </Bar>
//                 </BarChart>
//               </ResponsiveContainer>
//             ) : (
//               <p className="text-gray-500 text-center">No invoice data</p>
//             )}
//           </CardContent>
//         </div>
//       </div>

//       {/* Deals Overview + Pie */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         <div className="relative overflow-hidden rounded-2xl shadow-md bg-white p-6">
//           <CardHeader className="flex justify-between items-center">
//             <CardTitle className="text-gray-800 text-lg font-semibold">
//               Deals Overview
//             </CardTitle>
//           </CardHeader>
//           <CardContent className="h-80">
//             <ResponsiveContainer width="100%" height="100%">
//               <LineChart
//                 data={mergedDealsData}
//                 margin={{ top: 20, right: 20, left: 0, bottom: 20 }}
//               >
//                 <XAxis dataKey="month" stroke="#6B7280" />
//                 <YAxis allowDecimals={false} stroke="#6B7280" />
//                 <Tooltip
//                   contentStyle={{
//                     backgroundColor: "white",
//                     borderRadius: "12px",
//                     border: "1px solid #e5e7eb",
//                   }}
//                 />
//                 <Line
//                   type="monotone"
//                   dataKey="open"
//                   stroke="#3B82F6"
//                   strokeWidth={2}
//                   dot
//                   name="Open"
//                 />
//                 <Line
//                   type="monotone"
//                   dataKey="won"
//                   stroke="#10B981"
//                   strokeWidth={2}
//                   dot
//                   name="Won"
//                 />
//                 <Line
//                   type="monotone"
//                   dataKey="lost"
//                   stroke="#EF4444"
//                   strokeWidth={2}
//                   dot
//                   name="Lost"
//                 />
//                 <Line
//                   type="monotone"
//                   dataKey="total"
//                   stroke="#8B5CF6"
//                   strokeWidth={2}
//                   dot
//                   name="Total"
//                 />
//               </LineChart>
//             </ResponsiveContainer>
//           </CardContent>
//         </div>

//         <div className="relative overflow-hidden rounded-2xl shadow-md bg-white p-6 flex flex-col items-center">
//           <CardHeader>
//             <CardTitle className="text-gray-800 text-lg font-semibold">
//               Total Deals
//             </CardTitle>
//           </CardHeader>
//           <div className="h-72 w-full flex justify-center items-center">
//             <ResponsiveContainer>
//               <PieChart>
//                 <Pie
//                   data={pieData}
//                   dataKey="value"
//                   cx="50%"
//                   cy="50%"
//                   innerRadius={60}
//                   outerRadius={100}
//                   paddingAngle={5}
//                 >
//                   {pieData.map((entry, index) => (
//                     <Cell key={index} fill={COLORS[index]} />
//                   ))}
//                 </Pie>
//                 <Legend />
//               </PieChart>
//             </ResponsiveContainer>
//           </div>
//           <div className="absolute top-10 right-10 bg-indigo-50 text-indigo-600 font-bold rounded-full px-4 py-2">
//             {totalDeals}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;//original


// import React, { useEffect, useState, useCallback, useRef } from "react";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
//   CardDescription,
// } from "../components/ui/card";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
//   PieChart,
//   Pie,
//   Cell,
//   Legend,
//   LineChart,
//   Line,
//   Area,
//   AreaChart,
// } from "recharts";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "../components/ui/select";
// import { Button } from "../components/ui/button";
// import { Skeleton } from "../components/ui/skeleton";
// import { Badge } from "../components/ui/badge";
// import {
//   Users,
//   Trophy,
//   DollarSign,
//   FileText,
//   TrendingUp,
//   Calendar,
//   ChevronDown,
// } from "lucide-react";
// import axios from "axios";
// import { cn } from "../lib/utils";

// /* ---------- Helpers ---------- */
// const formatDate = (d) => {
//   const yyyy = d.getFullYear();
//   const mm = String(d.getMonth() + 1).padStart(2, "0");
//   const dd = String(d.getDate()).padStart(2, "0");
//   return `${yyyy}-${mm}-${dd}`;
// };

// const todayRange = () => {
//   const now = new Date();
//   return { start: formatDate(now), end: formatDate(now) };
// };

// const lastNDaysRange = (n) => {
//   const end = new Date();
//   const start = new Date();
//   start.setDate(end.getDate() - (n - 1));
//   return { start: formatDate(start), end: formatDate(end) };
// };

// const months = [
//   { label: "January", value: 0 },
//   { label: "February", value: 1 },
//   { label: "March", value: 2 },
//   { label: "April", value: 3 },
//   { label: "May", value: 4 },
//   { label: "June", value: 5 },
//   { label: "July", value: 6 },
//   { label: "August", value: 7 },
//   { label: "September", value: 8 },
//   { label: "October", value: 9 },
//   { label: "November", value: 10 },
//   { label: "December", value: 11 },
// ];

// /* Debounce helper */
// const useDebouncedCallback = (fn, delay = 400) => {
//   const timer = useRef(null);
//   const call = useCallback(
//     (...args) => {
//       if (timer.current) clearTimeout(timer.current);
//       timer.current = setTimeout(() => fn(...args), delay);
//     },
//     [fn, delay]
//   );
//   useEffect(() => () => timer.current && clearTimeout(timer.current), []);
//   return call;
// };

// const COLORS = ["#8B5CF6", "#10B981", "#EF4444", "#3B82F6", "#F59E0B"];
// const STATUS_COLORS = {
//   paid: "#10B981",
//   unpaid: "#3B82F6",
//   pending: "#F59E0B",
//   overdue: "#EF4444",
// };

// /* ---------- Component ---------- */
// const AdminDashboard = () => {
//   const [summary, setSummary] = useState([]);
//   const [pipeline, setPipeline] = useState([]);
//   const [recentInvoices, setRecentInvoices] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const [dealsData, setDealsData] = useState([]);
//   const [totalDeals, setTotalDeals] = useState(0);
//   const [statusCounts, setStatusCounts] = useState({
//     open: 0,
//     won: 0,
//     lost: 0,
//   });

//   const [activePreset, setActivePreset] = useState("today");
//   const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());

//   /* ---------- Month Range ---------- */
//   const getMonthRange = (monthIndex) => {
//     const now = new Date();
//     const start = new Date(now.getFullYear(), monthIndex, 1);
//     const end = new Date(now.getFullYear(), monthIndex + 1, 0);
//     return { start: formatDate(start), end: formatDate(end) };
//   };

//   const applyMonthFilter = (monthIndex) => {
//     setSelectedMonth(monthIndex);
//     const range = getMonthRange(monthIndex);
//     debouncedFetch(range);
//   };

//   /* ---------- Fetch Deals ---------- */
//   const fetchDeals = async (params) => {
//     try {
//       const token = localStorage.getItem("token");
//       const res = await axios.get("http://localhost:5000/api/deals/getAll", {
//         params,
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       const deals = res.data || [];
//       const counts = { open: 0, won: 0, lost: 0 };

//       deals.forEach((deal) => {
//         if (deal.stage === "Qualification" || deal.stage === "Open")
//           counts.open += 1;
//         else if (deal.stage === "Closed Won") counts.won += 1;
//         else if (deal.stage === "Closed Lost") counts.lost += 1;
//       });

//       setTotalDeals(deals.length);
//       setStatusCounts(counts);

//       const monthlyData = {};
//       deals.forEach((deal) => {
//         const month = new Date(deal.createdAt).toLocaleString("default", {
//           month: "short",
//         });
//         if (!monthlyData[month])
//           monthlyData[month] = { month, open: 0, won: 0, lost: 0, total: 0 };
//         if (deal.stage === "Qualification" || deal.stage === "Open")
//           monthlyData[month].open += 1;
//         else if (deal.stage === "Closed Won") monthlyData[month].won += 1;
//         else if (deal.stage === "Closed Lost") monthlyData[month].lost += 1;
//         monthlyData[month].total += 1;
//       });

//       setDealsData(Object.values(monthlyData));
//     } catch (err) {
//       console.error("Error fetching deals:", err);
//     }
//   };

//   /* ---------- Fetch Dashboard Data ---------- */
//   const buildParams = (range) => ({ start: range.start, end: range.end });

//   const fetchAll = async (params) => {
//     setLoading(true);
//     setError(null);
//     try {
//       const [resSummary, resPipeline, resInvoices] = await Promise.all([
//         axios.get("http://localhost:5000/api/dashboard/summary", { params }),
//         axios.get("http://localhost:5000/api/dashboard/pipeline", { params }),
//         axios.get("http://localhost:5000/api/invoice/recent", { params }),
//       ]);

//       setSummary([
//         {
//           title: "Total Leads",
//           value: resSummary.data.totalLeads,
//           color: "blue",
//           icon: <Users className="h-5 w-5" />,
//         },
//         {
//           title: "Deals Won",
//           value: resSummary.data.totalDealsWon,
//           color: "green",
//           icon: <Trophy className="h-5 w-5" />,
//         },
//         {
//           title: "Revenue",
//           value: `₹${resSummary.data.totalRevenue.toLocaleString()}`,
//           color: "purple",
//           icon: <DollarSign className="h-5 w-5" />,
//         },
//         {
//           title: "Pending Invoices",
//           value: resSummary.data.pendingInvoices,
//           color: "amber",
//           icon: <FileText className="h-5 w-5" />,
//         },
//       ]);

//       setPipeline(resPipeline.data || []);
//       setRecentInvoices(resInvoices.data || []);
//     } catch (err) {
//       console.error("Dashboard fetch error:", err);
//       setError("Failed to load dashboard data.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const debouncedFetch = useDebouncedCallback((range) => {
//     fetchAll(buildParams(range));
//     fetchDeals(buildParams(range));
//   }, 300);

//   /* ---------- Filter Presets ---------- */
//   const applyPreset = (preset) => {
//     setActivePreset(preset);
//     let range;
//     if (preset === "today") range = todayRange();
//     else if (preset === "7days") range = lastNDaysRange(7);
//     else if (preset === "month") range = getMonthRange(selectedMonth);
//     else range = todayRange();

//     debouncedFetch(range);
//   };

//   /* ---------- Initial Fetch ---------- */
//   useEffect(() => {
//     applyPreset(activePreset);
//   }, []); // eslint-disable-line react-hooks/exhaustive-deps

//   /* ---------- Invoice Chart Data ---------- */
//   const groupedInvoices = recentInvoices.reduce((acc, inv) => {
//     const status = inv.status?.toLowerCase() || "unknown";
//     acc[status] = (acc[status] || 0) + (inv.total || 0);
//     return acc;
//   }, {});

//   const invoiceChartData = Object.entries(groupedInvoices).map(
//     ([status, total]) => ({ status, total })
//   );

//   const pieData = [
//     { name: "Open", value: statusCounts.open, color: COLORS[0] },
//     { name: "Won", value: statusCounts.won, color: COLORS[1] },
//     { name: "Lost", value: statusCounts.lost, color: COLORS[2] },
//   ];

//   const mergedDealsData = [
//     "Jan",
//     "Feb",
//     "Mar",
//     "Apr",
//     "May",
//     "Jun",
//     "Jul",
//     "Aug",
//     "Sep",
//     "Oct",
//     "Nov",
//     "Dec",
//   ].map((m) => {
//     const found = dealsData.find((d) => d.month === m);
//     return {
//       month: m,
//       open: found ? found.open : 0,
//       won: found ? found.won : 0,
//       lost: found ? found.lost : 0,
//       total: found ? found.total : 0,
//     };
//   });

//   // Pipeline stages with progress indicators
//   const pipelineStages = [
//     { name: "Prospect", color: "bg-blue-500" },
//     { name: "Qualification", color: "bg-purple-500" },
//     { name: "Proposal", color: "bg-amber-500" },
//     { name: "Negotiation", color: "bg-indigo-500" },
//     { name: "Closed Won", color: "bg-green-500" },
//   ];

//   return (
//     <div className="p-6 space-y-6 min-h-screen bg-gray-50">
//       {/* Header with Filters */}
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//         <div>
//           <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
//           <p className="text-gray-500">Welcome to your admin dashboard</p>
//         </div>
        
//         <div className="flex items-center gap-2">
//           <Select
//             value={activePreset}
//             onValueChange={(value) => applyPreset(value)}
//           >
//             <SelectTrigger className="w-[180px]">
//               <SelectValue placeholder="Select period" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="today">Today</SelectItem>
//               <SelectItem value="7days">Last 7 Days</SelectItem>
//               <SelectItem value="month">This Month</SelectItem>
//             </SelectContent>
//           </Select>
          
//           {activePreset === "month" && (
//             <Select
//               value={String(selectedMonth)}
//               onValueChange={(value) => applyMonthFilter(Number(value))}
//             >
//               <SelectTrigger className="w-[140px]">
//                 <SelectValue placeholder="Select month" />
//               </SelectTrigger>
//               <SelectContent>
//                 {months.map((month) => (
//                   <SelectItem key={month.value} value={String(month.value)}>
//                     {month.label}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           )}
//         </div>
//       </div>

//       {error && (
//         <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
//           {error}
//         </div>
//       )}

//       {/* Summary Cards */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//         {loading
//           ? Array.from({ length: 4 }).map((_, i) => (
//               <Card key={i} className="overflow-hidden">
//                 <CardContent className="p-6">
//                   <Skeleton className="h-7 w-24 mb-2" />
//                   <Skeleton className="h-10 w-16" />
//                 </CardContent>
//               </Card>
//             ))
//           : summary.map((card, idx) => (
//               <Card
//                 key={idx}
//                 className={cn(
//                   "overflow-hidden border-0 shadow-lg transition-all duration-300 hover:shadow-xl",
//                   {
//                     "bg-blue-50": card.color === "blue",
//                     "bg-green-50": card.color === "green",
//                     "bg-purple-50": card.color === "purple",
//                     "bg-amber-50": card.color === "amber",
//                   }
//                 )}
//               >
//                 <CardContent className="p-6">
//                   <div className="flex justify-between items-start">
//                     <div>
//                       <p className="text-sm font-medium text-gray-600 mb-2">
//                         {card.title}
//                       </p>
//                       <p className="text-3xl font-bold text-gray-900">
//                         {card.value}
//                       </p>
//                     </div>
//                     <div
//                       className={cn("p-3 rounded-full", {
//                         "bg-blue-100 text-blue-600": card.color === "blue",
//                         "bg-green-100 text-green-600": card.color === "green",
//                         "bg-purple-100 text-purple-600": card.color === "purple",
//                         "bg-amber-100 text-amber-600": card.color === "amber",
//                       })}
//                     >
//                       {card.icon}
//                     </div>
//                   </div>
//                   <div className="mt-4 flex items-center">
//                     <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
//                     <span className="text-sm text-green-500 font-medium">
//                       +4.5%
//                     </span>
//                     <span className="text-sm text-gray-500 ml-2">
//                       from last period
//                     </span>
//                   </div>
//                 </CardContent>
//               </Card>
//             ))}
//       </div>

//       {/* Sales Pipeline + Revenue */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {/* Sales Pipeline */}
//         <Card className="shadow-lg border-0 overflow-hidden">
//           <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
//             <div className="flex justify-between items-center">
//               <CardTitle className="text-xl text-gray-800">
//                 Sales Pipeline
//               </CardTitle>
//               <Badge variant="outline" className="bg-white">
//                 {pipeline.reduce((acc, stage) => acc + stage.leads, 0)} Deals
//               </Badge>
//             </div>
//             <CardDescription>
//               Overview of deals in each stage
//             </CardDescription>
//           </CardHeader>
//           <CardContent className="pt-6">
//             {loading ? (
//               <div className="space-y-4">
//                 {Array.from({ length: 5 }).map((_, i) => (
//                   <div key={i} className="space-y-2">
//                     <Skeleton className="h-4 w-32" />
//                     <Skeleton className="h-6 w-full" />
//                   </div>
//                 ))}
//               </div>
//             ) : pipeline.length > 0 ? (
//               <div className="space-y-6">
//                 {pipeline.map((stage, index) => {
//                   const totalLeads = pipeline.reduce(
//                     (acc, curr) => acc + curr.leads,
//                     0
//                   );
//                   const percentage =
//                     totalLeads > 0
//                       ? Math.round((stage.leads / totalLeads) * 100)
//                       : 0;
//                   const pipelineStage = pipelineStages[index] || {
//                     name: stage.stage,
//                     color: "bg-gray-500",
//                   };

//                   return (
//                     <div key={stage.stage} className="space-y-2">
//                       <div className="flex justify-between items-center">
//                         <span className="text-sm font-medium text-gray-700">
//                           {stage.stage}
//                         </span>
//                         <span className="text-sm text-gray-500">
//                           {stage.leads} ({percentage}%)
//                         </span>
//                       </div>
//                       <div className="w-full bg-gray-200 rounded-full h-2.5">
//                         <div
//                           className={cn(
//                             "h-2.5 rounded-full transition-all duration-700",
//                             pipelineStage.color
//                           )}
//                           style={{ width: `${percentage}%` }}
//                         ></div>
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             ) : (
//               <p className="text-gray-500 text-center py-8">
//                 No pipeline data available
//               </p>
//             )}
//           </CardContent>
//         </Card>

//         {/* Revenue Overview */}
//         <Card className="shadow-lg border-0 overflow-hidden">
//           <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
//             <CardTitle className="text-xl text-gray-800">
//               Revenue Overview
//             </CardTitle>
//             <CardDescription>Income by invoice status</CardDescription>
//           </CardHeader>
//           <CardContent className="pt-6">
//             {loading ? (
//               <Skeleton className="h-64 w-full" />
//             ) : invoiceChartData.length > 0 ? (
//               <div className="h-64">
//                 <ResponsiveContainer width="100%" height="100%">
//                   <AreaChart
//                     data={invoiceChartData}
//                     margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
//                   >
//                     <defs>
//                       <linearGradient
//                         id="colorTotal"
//                         x1="0"
//                         y1="0"
//                         x2="0"
//                         y2="1"
//                       >
//                         <stop
//                           offset="5%"
//                           stopColor="#8884d8"
//                           stopOpacity={0.8}
//                         />
//                         <stop
//                           offset="95%"
//                           stopColor="#8884d8"
//                           stopOpacity={0}
//                         />
//                       </linearGradient>
//                     </defs>
//                     <XAxis dataKey="status" />
//                     <YAxis />
//                     <Tooltip
//                       formatter={(value) => [`₹${value.toLocaleString()}`, "Revenue"]}
//                       contentStyle={{
//                         backgroundColor: "white",
//                         borderRadius: "8px",
//                         boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
//                       }}
//                     />
//                     <Area
//                       type="monotone"
//                       dataKey="total"
//                       stroke="#8884d8"
//                       fillOpacity={1}
//                       fill="url(#colorTotal)"
//                     />
//                   </AreaChart>
//                 </ResponsiveContainer>
//                 <div className="flex flex-wrap gap-2 mt-4 justify-center">
//                   {invoiceChartData.map((entry, index) => (
//                     <Badge
//                       key={index}
//                       variant="outline"
//                       className="flex items-center gap-1"
//                     >
//                       <div
//                         className="w-2 h-2 rounded-full"
//                         style={{
//                           backgroundColor:
//                             STATUS_COLORS[entry.status] || "#6366F1",
//                         }}
//                       ></div>
//                       {entry.status.charAt(0).toUpperCase() +
//                         entry.status.slice(1)}
//                       : ₹{entry.total.toLocaleString()}
//                     </Badge>
//                   ))}
//                 </div>
//               </div>
//             ) : (
//               <p className="text-gray-500 text-center py-8">
//                 No revenue data available
//               </p>
//             )}
//           </CardContent>
//         </Card>
//       </div>

//       {/* Deals Overview + Performance */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {/* Deals Performance */}
//         <Card className="shadow-lg border-0 overflow-hidden">
//           <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
//             <CardTitle className="text-xl text-gray-800">
//               Deals Performance
//             </CardTitle>
//             <CardDescription>Monthly deal progression</CardDescription>
//           </CardHeader>
//           <CardContent className="pt-6">
//             {loading ? (
//               <Skeleton className="h-64 w-full" />
//             ) : mergedDealsData.length > 0 ? (
//               <div className="h-64">
//                 <ResponsiveContainer width="100%" height="100%">
//                   <LineChart
//                     data={mergedDealsData}
//                     margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
//                   >
//                     <XAxis dataKey="month" />
//                     <YAxis />
//                     <Tooltip
//                       contentStyle={{
//                         backgroundColor: "white",
//                         borderRadius: "8px",
//                         boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
//                       }}
//                     />
//                     <Line
//                       type="monotone"
//                       dataKey="open"
//                       stroke="#3B82F6"
//                       strokeWidth={2}
//                       activeDot={{ r: 8 }}
//                     />
//                     <Line
//                       type="monotone"
//                       dataKey="won"
//                       stroke="#10B981"
//                       strokeWidth={2}
//                     />
//                     <Line
//                       type="monotone"
//                       dataKey="lost"
//                       stroke="#EF4444"
//                       strokeWidth={2}
//                     />
//                   </LineChart>
//                 </ResponsiveContainer>
//               </div>
//             ) : (
//               <p className="text-gray-500 text-center py-8">
//                 No deals data available
//               </p>
//             )}
//           </CardContent>
//         </Card>

//         {/* Deal Distribution */}
//         <Card className="shadow-lg border-0 overflow-hidden">
//           <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50">
//             <div className="flex justify-between items-center">
//               <CardTitle className="text-xl text-gray-800">
//                 Deal Distribution
//               </CardTitle>
//               <Badge variant="outline" className="bg-white">
//                 {totalDeals} Total
//               </Badge>
//             </div>
//             <CardDescription>Status breakdown of all deals</CardDescription>
//           </CardHeader>
//           <CardContent className="pt-6">
//             {loading ? (
//               <Skeleton className="h-64 w-full rounded-full" />
//             ) : pieData.filter(item => item.value > 0).length > 0 ? (
//               <div className="h-64">
//                 <ResponsiveContainer width="100%" height="100%">
//                   <PieChart>
//                     <Pie
//                       data={pieData.filter(item => item.value > 0)}
//                       cx="50%"
//                       cy="50%"
//                       outerRadius={80}
//                       fill="#8884d8"
//                       dataKey="value"
//                       label={({ name, percent }) =>
//                         `${name}: ${(percent * 100).toFixed(0)}%`
//                       }
//                     >
//                       {pieData.map((entry, index) => (
//                         <Cell key={`cell-${index}`} fill={entry.color} />
//                       ))}
//                     </Pie>
//                     <Tooltip
//                       formatter={(value) => [`${value} deals`, "Count"]}
//                       contentStyle={{
//                         backgroundColor: "white",
//                         borderRadius: "8px",
//                         boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
//                       }}
//                     />
//                   </PieChart>
//                 </ResponsiveContainer>
//               </div>
//             ) : (
//               <p className="text-gray-500 text-center py-8">
//                 No deal distribution data available
//               </p>
//             )}
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;


// import React, { useEffect, useState, useCallback, useRef } from "react";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
//   CardDescription,
// } from "../components/ui/card";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
//   PieChart,
//   Pie,
//   Cell,
//   Legend,
//   LineChart,
//   Line,
//   Area,
//   AreaChart,
// } from "recharts";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "../components/ui/select";
// import { Button } from "../components/ui/button";
// import { Skeleton } from "../components/ui/skeleton";
// import { Badge } from "../components/ui/badge";
// import {
//   Users,
//   Trophy,
//   DollarSign,
//   FileText,
//   TrendingUp,
//   Calendar,
//   ChevronDown,
//   Sparkles,
//   Zap,
//   Target,
//   BarChart3,
// } from "lucide-react";
// import axios from "axios";
// import { cn } from "../lib/utils";
// import { motion, AnimatePresence } from "framer-motion";
// import CountUp from "react-countup";
// import confetti from "canvas-confetti";

// /* ---------- Helpers ---------- */
// const formatDate = (d) => {
//   const yyyy = d.getFullYear();
//   const mm = String(d.getMonth() + 1).padStart(2, "0");
//   const dd = String(d.getDate()).padStart(2, "0");
//   return `${yyyy}-${mm}-${dd}`;
// };

// const todayRange = () => {
//   const now = new Date();
//   return { start: formatDate(now), end: formatDate(now) };
// };

// const lastNDaysRange = (n) => {
//   const end = new Date();
//   const start = new Date();
//   start.setDate(end.getDate() - (n - 1));
//   return { start: formatDate(start), end: formatDate(end) };
// };

// const months = [
//   { label: "January", value: 0 },
//   { label: "February", value: 1 },
//   { label: "March", value: 2 },
//   { label: "April", value: 3 },
//   { label: "May", value: 4 },
//   { label: "June", value: 5 },
//   { label: "July", value: 6 },
//   { label: "August", value: 7 },
//   { label: "September", value: 8 },
//   { label: "October", value: 9 },
//   { label: "November", value: 10 },
//   { label: "December", value: 11 },
// ];

// /* Debounce helper */
// const useDebouncedCallback = (fn, delay = 400) => {
//   const timer = useRef(null);
//   const call = useCallback(
//     (...args) => {
//       if (timer.current) clearTimeout(timer.current);
//       timer.current = setTimeout(() => fn(...args), delay);
//     },
//     [fn, delay]
//   );
//   useEffect(() => () => timer.current && clearTimeout(timer.current), []);
//   return call;
// };

// const COLORS = ["#8B5CF6", "#10B981", "#EF4444", "#3B82F6", "#F59E0B"];
// const STATUS_COLORS = {
//   paid: "#10B981",
//   unpaid: "#3B82F6",
//   pending: "#F59E0B",
//   overdue: "#EF4444",
// };

// // Floating bubbles component
// const FloatingBubbles = () => {
//   return (
//     <div className="absolute inset-0 overflow-hidden pointer-events-none">
//       {Array.from({ length: 15 }).map((_, i) => (
//         <motion.div
//           key={i}
//           className="absolute rounded-full opacity-10"
//           style={{
//             width: Math.random() * 100 + 20,
//             height: Math.random() * 100 + 20,
//             background: `linear-gradient(45deg, ${
//               COLORS[Math.floor(Math.random() * COLORS.length)]
//             }, ${COLORS[Math.floor(Math.random() * COLORS.length)]})`,
//             top: `${Math.random() * 100}%`,
//             left: `${Math.random() * 100}%`,
//           }}
//           animate={{
//             y: [0, -30, 0],
//             x: [0, Math.random() * 20 - 10, 0],
//             scale: [1, 1.1, 1],
//           }}
//           transition={{
//             duration: Math.random() * 10 + 10,
//             repeat: Infinity,
//             ease: "easeInOut",
//           }}
//         />
//       ))}
//     </div>
//   );
// };

// // Animated number component
// const AnimatedNumber = ({ value, prefix = "", suffix = "", decimals = 0 }) => {
//   return (
//     <CountUp
//       end={value}
//       duration={1.5}
//       decimals={decimals}
//       prefix={prefix}
//       suffix={suffix}
//       separator=","
//       className="text-3xl font-bold text-gray-900"
//     />
//   );
// };

// /* ---------- Component ---------- */
// const AdminDashboard = () => {
//   const [summary, setSummary] = useState([]);
//   const [pipeline, setPipeline] = useState([]);
//   const [recentInvoices, setRecentInvoices] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const [dealsData, setDealsData] = useState([]);
//   const [totalDeals, setTotalDeals] = useState(0);
//   const [statusCounts, setStatusCounts] = useState({
//     open: 0,
//     won: 0,
//     lost: 0,
//   });

//   const [activePreset, setActivePreset] = useState("today");
//   const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
//   const [realTimeData, setRealTimeData] = useState(false);

//   /* ---------- Month Range ---------- */
//   const getMonthRange = (monthIndex) => {
//     const now = new Date();
//     const start = new Date(now.getFullYear(), monthIndex, 1);
//     const end = new Date(now.getFullYear(), monthIndex + 1, 0);
//     return { start: formatDate(start), end: formatDate(end) };
//   };

//   const applyMonthFilter = (monthIndex) => {
//     setSelectedMonth(monthIndex);
//     const range = getMonthRange(monthIndex);
//     debouncedFetch(range);
//   };

//   /* ---------- Fetch Deals ---------- */
//   const fetchDeals = async (params) => {
//     try {
//       const token = localStorage.getItem("token");
//       const res = await axios.get("http://localhost:5000/api/deals/getAll", {
//         params,
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       const deals = res.data || [];
//       const counts = { open: 0, won: 0, lost: 0 };

//       deals.forEach((deal) => {
//         if (deal.stage === "Qualification" || deal.stage === "Open")
//           counts.open += 1;
//         else if (deal.stage === "Closed Won") counts.won += 1;
//         else if (deal.stage === "Closed Lost") counts.lost += 1;
//       });

//       setTotalDeals(deals.length);
//       setStatusCounts(counts);

//       const monthlyData = {};
//       deals.forEach((deal) => {
//         const month = new Date(deal.createdAt).toLocaleString("default", {
//           month: "short",
//         });
//         if (!monthlyData[month])
//           monthlyData[month] = { month, open: 0, won: 0, lost: 0, total: 0 };
//         if (deal.stage === "Qualification" || deal.stage === "Open")
//           monthlyData[month].open += 1;
//         else if (deal.stage === "Closed Won") monthlyData[month].won += 1;
//         else if (deal.stage === "Closed Lost") monthlyData[month].lost += 1;
//         monthlyData[month].total += 1;
//       });

//       setDealsData(Object.values(monthlyData));
//     } catch (err) {
//       console.error("Error fetching deals:", err);
//     }
//   };

//   /* ---------- Fetch Dashboard Data ---------- */
//   const buildParams = (range) => ({ start: range.start, end: range.end });

//   const fetchAll = async (params) => {
//     setLoading(true);
//     setError(null);
//     try {
//       const [resSummary, resPipeline, resInvoices] = await Promise.all([
//         axios.get("http://localhost:5000/api/dashboard/summary", { params }),
//         axios.get("http://localhost:5000/api/dashboard/pipeline", { params }),
//         axios.get("http://localhost:5000/api/invoice/recent", { params }),
//       ]);

//       setSummary([
//         {
//           title: "Total Leads",
//           value: resSummary.data.totalLeads,
//           color: "blue",
//           icon: <Users className="h-5 w-5" />,
//         },
//         {
//           title: "Deals Won",
//           value: resSummary.data.totalDealsWon,
//           color: "green",
//           icon: <Trophy className="h-5 w-5" />,
//         },
//         {
//           title: "Revenue",
//           value: resSummary.data.totalRevenue,
//           color: "purple",
//           icon: <DollarSign className="h-5 w-5" />,
//         },
//         {
//           title: "Pending Invoices",
//           value: resSummary.data.pendingInvoices,
//           color: "amber",
//           icon: <FileText className="h-5 w-5" />,
//         },
//       ]);

//       setPipeline(resPipeline.data || []);
//       setRecentInvoices(resInvoices.data || []);
      
//       // Trigger confetti if there's a significant achievement
//       if (resSummary.data.totalDealsWon > 5) {
//         confetti({
//           particleCount: 100,
//           spread: 70,
//           origin: { y: 0.6 }
//         });
//       }
//     } catch (err) {
//       console.error("Dashboard fetch error:", err);
//       setError("Failed to load dashboard data.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const debouncedFetch = useDebouncedCallback((range) => {
//     fetchAll(buildParams(range));
//     fetchDeals(buildParams(range));
//   }, 300);

//   /* ---------- Filter Presets ---------- */
//   const applyPreset = (preset) => {
//     setActivePreset(preset);
//     let range;
//     if (preset === "today") range = todayRange();
//     else if (preset === "7days") range = lastNDaysRange(7);
//     else if (preset === "month") range = getMonthRange(selectedMonth);
//     else range = todayRange();

//     debouncedFetch(range);
//   };

//   /* ---------- Real-time Updates ---------- */
//   useEffect(() => {
//     let interval;
//     if (realTimeData) {
//       interval = setInterval(() => {
//         const range = activePreset === "month"
//           ? getMonthRange(selectedMonth)
//           : activePreset === "7days"
//           ? lastNDaysRange(7)
//           : todayRange();
        
//         fetchAll(buildParams(range));
//         fetchDeals(buildParams(range));
//       }, 10000); // Update every 10 seconds
//     }
    
//     return () => clearInterval(interval);
//   }, [realTimeData, activePreset, selectedMonth]);

//   /* ---------- Initial Fetch ---------- */
//   useEffect(() => {
//     applyPreset(activePreset);
//   }, []); // eslint-disable-line react-hooks/exhaustive-deps

//   /* ---------- Invoice Chart Data ---------- */
//   const groupedInvoices = recentInvoices.reduce((acc, inv) => {
//     const status = inv.status?.toLowerCase() || "unknown";
//     acc[status] = (acc[status] || 0) + (inv.total || 0);
//     return acc;
//   }, {});

//   const invoiceChartData = Object.entries(groupedInvoices).map(
//     ([status, total]) => ({ status, total })
//   );

//   const pieData = [
//     { name: "Open", value: statusCounts.open, color: COLORS[0] },
//     { name: "Won", value: statusCounts.won, color: COLORS[1] },
//     { name: "Lost", value: statusCounts.lost, color: COLORS[2] },
//   ];

//   const mergedDealsData = [
//     "Jan",
//     "Feb",
//     "Mar",
//     "Apr",
//     "May",
//     "Jun",
//     "Jul",
//     "Aug",
//     "Sep",
//     "Oct",
//     "Nov",
//     "Dec",
//   ].map((m) => {
//     const found = dealsData.find((d) => d.month === m);
//     return {
//       month: m,
//       open: found ? found.open : 0,
//       won: found ? found.won : 0,
//       lost: found ? found.lost : 0,
//       total: found ? found.total : 0,
//     };
//   });

//   // Pipeline stages with progress indicators
//   const pipelineStages = [
//     { name: "Prospect", color: "bg-blue-500" },
//     { name: "Qualification", color: "bg-purple-500" },
//     { name: "Proposal", color: "bg-amber-500" },
//     { name: "Negotiation", color: "bg-indigo-500" },
//     { name: "Closed Won", color: "bg-green-500" },
//   ];

//   // Calculate conversion rate
//   const conversionRate = summary[1] && summary[0]
//     ? ((summary[1].value / summary[0].value) * 100).toFixed(1)
//     : 0;

//   return (
//     <div className="p-6 space-y-6 min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 relative overflow-hidden">
//       <FloatingBubbles />
      
//       {/* Header with Filters */}
//       <motion.div
//         initial={{ opacity: 0, y: -20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//         className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative z-10"
//       >
//         <div>
//           <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
//             <Zap className="h-8 w-8 text-purple-600" />
//             Dashboard
//             {realTimeData && (
//               <motion.div
//                 animate={{ scale: [1, 1.2, 1] }}
//                 transition={{ duration: 1.5, repeat: Infinity }}
//               >
//                 <Sparkles className="h-5 w-5 text-amber-500" />
//               </motion.div>
//             )}
//           </h1>
//           <p className="text-gray-500">Welcome to your admin dashboard</p>
//         </div>
        
//         <div className="flex items-center gap-2">
//           <Button
//             variant={realTimeData ? "default" : "outline"}
//             size="sm"
//             onClick={() => setRealTimeData(!realTimeData)}
//             className="flex items-center gap-1"
//           >
//             <Target className="h-4 w-4" />
//             {realTimeData ? "Live" : "Enable Live"}
//           </Button>
          
//           <Select
//             value={activePreset}
//             onValueChange={(value) => applyPreset(value)}
//           >
//             <SelectTrigger className="w-[180px]">
//               <SelectValue placeholder="Select period" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="today">Today</SelectItem>
//               <SelectItem value="7days">Last 7 Days</SelectItem>
//               <SelectItem value="month">This Month</SelectItem>
//             </SelectContent>
//           </Select>
          
//           {activePreset === "month" && (
//             <Select
//               value={String(selectedMonth)}
//               onValueChange={(value) => applyMonthFilter(Number(value))}
//             >
//               <SelectTrigger className="w-[140px]">
//                 <SelectValue placeholder="Select month" />
//               </SelectTrigger>
//               <SelectContent>
//                 {months.map((month) => (
//                   <SelectItem key={month.value} value={String(month.value)}>
//                     {month.label}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           )}
//         </div>
//       </motion.div>

//       {error && (
//         <motion.div
//           initial={{ opacity: 0, scale: 0.9 }}
//           animate={{ opacity: 1, scale: 1 }}
//           className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md relative z-10"
//         >
//           {error}
//         </motion.div>
//       )}

//       {/* Summary Cards */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
//         {loading
//           ? Array.from({ length: 4 }).map((_, i) => (
//               <Card key={i} className="overflow-hidden">
//                 <CardContent className="p-6">
//                   <Skeleton className="h-7 w-24 mb-2" />
//                   <Skeleton className="h-10 w-16" />
//                 </CardContent>
//               </Card>
//             ))
//           : summary.map((card, idx) => (
//               <motion.div
//                 key={idx}
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.5, delay: idx * 0.1 }}
//               >
//                 <Card
//                   className={cn(
//                     "overflow-hidden border-0 shadow-lg transition-all duration-300 hover:shadow-xl relative",
//                     {
//                       "bg-blue-50": card.color === "blue",
//                       "bg-green-50": card.color === "green",
//                       "bg-purple-50": card.color === "purple",
//                       "bg-amber-50": card.color === "amber",
//                     }
//                   )}
//                 >
//                   <CardContent className="p-6">
//                     <div className="flex justify-between items-start">
//                       <div>
//                         <p className="text-sm font-medium text-gray-600 mb-2">
//                           {card.title}
//                         </p>
//                         {card.title === "Revenue" ? (
//                           <AnimatedNumber
//                             value={card.value}
//                             prefix="₹"
//                             decimals={0}
//                           />
//                         ) : (
//                           <AnimatedNumber value={card.value} />
//                         )}
//                       </div>
//                       <motion.div
//                         whileHover={{ scale: 1.1, rotate: 5 }}
//                         className={cn("p-3 rounded-full", {
//                           "bg-blue-100 text-blue-600": card.color === "blue",
//                           "bg-green-100 text-green-600": card.color === "green",
//                           "bg-purple-100 text-purple-600": card.color === "purple",
//                           "bg-amber-100 text-amber-600": card.color === "amber",
//                         })}
//                       >
//                         {card.icon}
//                       </motion.div>
//                     </div>
//                     <div className="mt-4 flex items-center">
//                       <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
//                       <span className="text-sm text-green-500 font-medium">
//                         +4.5%
//                       </span>
//                       <span className="text-sm text-gray-500 ml-2">
//                         from last period
//                       </span>
//                     </div>
//                   </CardContent>
//                 </Card>
//               </motion.div>
//             ))}
//       </div>

//       {/* Conversion Rate & Performance Metrics */}
//       <motion.div
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ delay: 0.4 }}
//         className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10"
//       >
//         <Card className="bg-gradient-to-r from-cyan-50 to-blue-50 border-0 shadow-lg">
//           <CardContent className="p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
//                 <p className="text-2xl font-bold text-gray-900">
//                   {conversionRate}%
//                 </p>
//               </div>
//               <div className="bg-blue-100 p-3 rounded-full text-blue-600">
//                 <BarChart3 className="h-6 w-6" />
//               </div>
//             </div>
//             <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
//               <div
//                 className="bg-blue-600 h-2 rounded-full transition-all duration-1000 ease-out"
//                 style={{ width: `${conversionRate}%` }}
//               ></div>
//             </div>
//           </CardContent>
//         </Card>
        
//         <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-0 shadow-lg">
//           <CardContent className="p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-600">Avg. Deal Size</p>
//                 <p className="text-2xl font-bold text-gray-900">
//                   ₹{summary[2] ? Math.round(summary[2].value / (summary[1]?.value || 1)).toLocaleString() : 0}
//                 </p>
//               </div>
//               <div className="bg-green-100 p-3 rounded-full text-green-600">
//                 <DollarSign className="h-6 w-6" />
//               </div>
//             </div>
//             <div className="flex items-center mt-4">
//               <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
//               <span className="text-sm text-green-500 font-medium">+12.3%</span>
//             </div>
//           </CardContent>
//         </Card>
        
//         <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-0 shadow-lg">
//           <CardContent className="p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-600">Sales Velocity</p>
//                 <p className="text-2xl font-bold text-gray-900">24 days</p>
//               </div>
//               <div className="bg-purple-100 p-3 rounded-full text-purple-600">
//                 <TrendingUp className="h-6 w-6" />
//               </div>
//             </div>
//             <div className="flex items-center mt-4">
//               <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
//               <span className="text-sm text-green-500 font-medium">-5.2 days</span>
//             </div>
//           </CardContent>
//         </Card>
//       </motion.div>

//       {/* Sales Pipeline + Revenue */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative z-10">
//         {/* Sales Pipeline */}
//         <motion.div
//           initial={{ opacity: 0, x: -20 }}
//           animate={{ opacity: 1, x: 0 }}
//           transition={{ duration: 0.5, delay: 0.2 }}
//         >
//           <Card className="shadow-lg border-0 overflow-hidden">
//             <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
//               <div className="flex justify-between items-center">
//                 <CardTitle className="text-xl text-gray-800">
//                   Sales Pipeline
//                 </CardTitle>
//                 <Badge variant="outline" className="bg-white">
//                   {pipeline.reduce((acc, stage) => acc + stage.leads, 0)} Deals
//                 </Badge>
//               </div>
//               <CardDescription>
//                 Overview of deals in each stage
//               </CardDescription>
//             </CardHeader>
//             <CardContent className="pt-6">
//               {loading ? (
//                 <div className="space-y-4">
//                   {Array.from({ length: 5 }).map((_, i) => (
//                     <div key={i} className="space-y-2">
//                       <Skeleton className="h-4 w-32" />
//                       <Skeleton className="h-6 w-full" />
//                     </div>
//                   ))}
//                 </div>
//               ) : pipeline.length > 0 ? (
//                 <div className="space-y-6">
//                   {pipeline.map((stage, index) => {
//                     const totalLeads = pipeline.reduce(
//                       (acc, curr) => acc + curr.leads,
//                       0
//                     );
//                     const percentage =
//                       totalLeads > 0
//                         ? Math.round((stage.leads / totalLeads) * 100)
//                         : 0;
//                     const pipelineStage = pipelineStages[index] || {
//                       name: stage.stage,
//                       color: "bg-gray-500",
//                     };

//                     return (
//                       <div key={stage.stage} className="space-y-2">
//                         <div className="flex justify-between items-center">
//                           <span className="text-sm font-medium text-gray-700">
//                             {stage.stage}
//                           </span>
//                           <span className="text-sm text-gray-500">
//                             {stage.leads} ({percentage}%)
//                           </span>
//                         </div>
//                         <div className="w-full bg-gray-200 rounded-full h-2.5">
//                           <motion.div
//                             initial={{ width: 0 }}
//                             animate={{ width: `${percentage}%` }}
//                             transition={{ duration: 1, delay: index * 0.1 }}
//                             className={cn(
//                               "h-2.5 rounded-full",
//                               pipelineStage.color
//                             )}
//                           ></motion.div>
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </div>
//               ) : (
//                 <p className="text-gray-500 text-center py-8">
//                   No pipeline data available
//                 </p>
//               )}
//             </CardContent>
//           </Card>
//         </motion.div>

//         {/* Revenue Overview */}
//         <motion.div
//           initial={{ opacity: 0, x: 20 }}
//           animate={{ opacity: 1, x: 0 }}
//           transition={{ duration: 0.5, delay: 0.3 }}
//         >
//           <Card className="shadow-lg border-0 overflow-hidden">
//             <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
//               <CardTitle className="text-xl text-gray-800">
//                 Revenue Overview
//               </CardTitle>
//               <CardDescription>Income by invoice status</CardDescription>
//             </CardHeader>
//             <CardContent className="pt-6">
//               {loading ? (
//                 <Skeleton className="h-64 w-full" />
//               ) : invoiceChartData.length > 0 ? (
//                 <div className="h-64">
//                   <ResponsiveContainer width="100%" height="100%">
//                     <AreaChart
//                       data={invoiceChartData}
//                       margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
//                     >
//                       <defs>
//                         <linearGradient
//                           id="colorTotal"
//                           x1="0"
//                           y1="0"
//                           x2="0"
//                           y2="1"
//                         >
//                           <stop
//                             offset="5%"
//                             stopColor="#8884d8"
//                             stopOpacity={0.8}
//                           />
//                           <stop
//                             offset="95%"
//                             stopColor="#8884d8"
//                             stopOpacity={0}
//                           />
//                         </linearGradient>
//                       </defs>
//                       <XAxis dataKey="status" />
//                       <YAxis />
//                       <Tooltip
//                         formatter={(value) => [`₹${value.toLocaleString()}`, "Revenue"]}
//                         contentStyle={{
//                           backgroundColor: "white",
//                           borderRadius: "8px",
//                           boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
//                         }}
//                       />
//                       <Area
//                         type="monotone"
//                         dataKey="total"
//                         stroke="#8884d8"
//                         fillOpacity={1}
//                         fill="url(#colorTotal)"
//                       />
//                     </AreaChart>
//                   </ResponsiveContainer>
//                   <div className="flex flex-wrap gap-2 mt-4 justify-center">
//                     {invoiceChartData.map((entry, index) => (
//                       <motion.div
//                         key={index}
//                         whileHover={{ scale: 1.05 }}
//                       >
//                         <Badge
//                           variant="outline"
//                           className="flex items-center gap-1 cursor-pointer"
//                         >
//                           <div
//                             className="w-2 h-2 rounded-full"
//                             style={{
//                               backgroundColor:
//                                 STATUS_COLORS[entry.status] || "#6366F1",
//                             }}
//                           ></div>
//                           {entry.status.charAt(0).toUpperCase() +
//                             entry.status.slice(1)}
//                           : ₹{entry.total.toLocaleString()}
//                         </Badge>
//                       </motion.div>
//                     ))}
//                   </div>
//                 </div>
//               ) : (
//                 <p className="text-gray-500 text-center py-8">
//                   No revenue data available
//                 </p>
//               )}
//             </CardContent>
//           </Card>
//         </motion.div>
//       </div>

//       {/* Deals Overview + Performance */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative z-10">
//         {/* Deals Performance */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5, delay: 0.4 }}
//         >
//           <Card className="shadow-lg border-0 overflow-hidden">
//             <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
//               <CardTitle className="text-xl text-gray-800">
//                 Deals Performance
//               </CardTitle>
//               <CardDescription>Monthly deal progression</CardDescription>
//             </CardHeader>
//             <CardContent className="pt-6">
//               {loading ? (
//                 <Skeleton className="h-64 w-full" />
//               ) : mergedDealsData.length > 0 ? (
//                 <div className="h-64">
//                   <ResponsiveContainer width="100%" height="100%">
//                     <LineChart
//                       data={mergedDealsData}
//                       margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
//                     >
//                       <XAxis dataKey="month" />
//                       <YAxis />
//                       <Tooltip
//                         contentStyle={{
//                           backgroundColor: "white",
//                           borderRadius: "8px",
//                           boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
//                         }}
//                       />
//                       <Line
//                         type="monotone"
//                         dataKey="open"
//                         stroke="#3B82F6"
//                         strokeWidth={2}
//                         activeDot={{ r: 8 }}
//                       />
//                       <Line
//                         type="monotone"
//                         dataKey="won"
//                         stroke="#10B981"
//                         strokeWidth={2}
//                       />
//                       <Line
//                         type="monotone"
//                         dataKey="lost"
//                         stroke="#EF4444"
//                         strokeWidth={2}
//                       />
//                     </LineChart>
//                   </ResponsiveContainer>
//                 </div>
//               ) : (
//                 <p className="text-gray-500 text-center py-8">
//                   No deals data available
//                 </p>
//               )}
//             </CardContent>
//           </Card>
//         </motion.div>

//         {/* Deal Distribution */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5, delay: 0.5 }}
//         >
//           <Card className="shadow-lg border-0 overflow-hidden">
//             <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50">
//               <div className="flex justify-between items-center">
//                 <CardTitle className="text-xl text-gray-800">
//                   Deal Distribution
//                 </CardTitle>
//                 <Badge variant="outline" className="bg-white">
//                   {totalDeals} Total
//                 </Badge>
//               </div>
//               <CardDescription>Status breakdown of all deals</CardDescription>
//             </CardHeader>
//             <CardContent className="pt-6">
//               {loading ? (
//                 <Skeleton className="h-64 w-full rounded-full" />
//               ) : pieData.filter(item => item.value > 0).length > 0 ? (
//                 <div className="h-64">
//                   <ResponsiveContainer width="100%" height="100%">
//                     <PieChart>
//                       <Pie
//                         data={pieData.filter(item => item.value > 0)}
//                         cx="50%"
//                         cy="50%"
//                         outerRadius={80}
//                         fill="#8884d8"
//                         dataKey="value"
//                         label={({ name, percent }) =>
//                           `${name}: ${(percent * 100).toFixed(0)}%`
//                         }
//                       >
//                         {pieData.map((entry, index) => (
//                           <Cell key={`cell-${index}`} fill={entry.color} />
//                         ))}
//                       </Pie>
//                       <Tooltip
//                         formatter={(value) => [`${value} deals`, "Count"]}
//                         contentStyle={{
//                           backgroundColor: "white",
//                           borderRadius: "8px",
//                           boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
//                         }}
//                       />
//                     </PieChart>
//                   </ResponsiveContainer>
//                 </div>
//               ) : (
//                 <p className="text-gray-500 text-center py-8">
//                   No deal distribution data available
//                 </p>
//               )}
//             </CardContent>
//           </Card>
//         </motion.div>
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;//bubbles design


// import React, { useEffect, useState, useCallback, useRef } from "react";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
//   CardDescription,
// } from "../components/ui/card";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
//   PieChart,
//   Pie,
//   Cell,
//   AreaChart,
//   Area,
//   LineChart,
//   Line,
// } from "recharts";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "../components/ui/select";
// import { Button } from "../components/ui/button";
// import { Skeleton } from "../components/ui/skeleton";
// import { Badge } from "../components/ui/badge";
// import {
//   Users,
//   Trophy,
//   DollarSign,
//   FileText,
//   TrendingUp,
//   Zap,
//   BarChart3,
// } from "lucide-react";
// import axios from "axios";
// import { cn } from "../lib/utils";
// import { motion } from "framer-motion";
// import CountUp from "react-countup";
// import confetti from "canvas-confetti";

// /* ---------- Helpers ---------- */
// const formatDate = (d) => {
//   const yyyy = d.getFullYear();
//   const mm = String(d.getMonth() + 1).padStart(2, "0");
//   const dd = String(d.getDate()).padStart(2, "0");
//   return `${yyyy}-${mm}-${dd}`;
// };

// const todayRange = () => {
//   const now = new Date();
//   return { start: formatDate(now), end: formatDate(now) };
// };

// const lastNDaysRange = (n) => {
//   const end = new Date();
//   const start = new Date();
//   start.setDate(end.getDate() - (n - 1));
//   return { start: formatDate(start), end: formatDate(end) };
// };

// const months = [
//   { label: "January", value: 0 },
//   { label: "February", value: 1 },
//   { label: "March", value: 2 },
//   { label: "April", value: 3 },
//   { label: "May", value: 4 },
//   { label: "June", value: 5 },
//   { label: "July", value: 6 },
//   { label: "August", value: 7 },
//   { label: "September", value: 8 },
//   { label: "October", value: 9 },
//   { label: "November", value: 10 },
//   { label: "December", value: 11 },
// ];

// /* Debounce helper */
// const useDebouncedCallback = (fn, delay = 400) => {
//   const timer = useRef(null);
//   const call = useCallback(
//     (...args) => {
//       if (timer.current) clearTimeout(timer.current);
//       timer.current = setTimeout(() => fn(...args), delay);
//     },
//     [fn, delay]
//   );
//   useEffect(() => () => timer.current && clearTimeout(timer.current), []);
//   return call;
// };

// const COLORS = ["#8B5CF6", "#10B981", "#EF4444", "#3B82F6", "#F59E0B"];
// const STATUS_COLORS = {
//   paid: "#10B981",
//   unpaid: "#3B82F6",
//   pending: "#F59E0B",
//   overdue: "#EF4444",
// };

// // Floating bubbles component
// const FloatingBubbles = () => {
//   return (
//     <div className="absolute inset-0 overflow-hidden pointer-events-none">
//       {Array.from({ length: 15 }).map((_, i) => (
//         <motion.div
//           key={i}
//           className="absolute rounded-full opacity-10"
//           style={{
//             width: Math.random() * 100 + 20,
//             height: Math.random() * 100 + 20,
//             background: `linear-gradient(45deg, ${
//               COLORS[Math.floor(Math.random() * COLORS.length)]
//             }, ${COLORS[Math.floor(Math.random() * COLORS.length)]})`,
//             top: `${Math.random() * 100}%`,
//             left: `${Math.random() * 100}%`,
//           }}
//           animate={{
//             y: [0, -30, 0],
//             x: [0, Math.random() * 20 - 10, 0],
//             scale: [1, 1.1, 1],
//           }}
//           transition={{
//             duration: Math.random() * 10 + 10,
//             repeat: Infinity,
//             ease: "easeInOut",
//           }}
//         />
//       ))}
//     </div>
//   );
// };

// // Animated number component
// const AnimatedNumber = ({ value, prefix = "", suffix = "", decimals = 0 }) => {
//   return (
//     <CountUp
//       end={Number(value) || 0}
//       duration={1.2}
//       decimals={decimals}
//       prefix={prefix}
//       suffix={suffix}
//       separator=","
//       className="text-3xl font-bold text-gray-900"
//     />
//   );
// };

// /* ---------- Component ---------- */
// const AdminDashboard = () => {
//   const [summary, setSummary] = useState([]);
//   const [pipeline, setPipeline] = useState([]);
//   const [recentInvoices, setRecentInvoices] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const [dealsData, setDealsData] = useState([]);
//   const [totalDeals, setTotalDeals] = useState(0);
//   const [statusCounts, setStatusCounts] = useState({
//     open: 0,
//     won: 0,
//     lost: 0,
//   });

//   const [activePreset, setActivePreset] = useState("today");
//   const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());

//   // Real-time by default (no button shown)
//   const realTimeData = true;

//   /* ---------- Month Range ---------- */
//   const getMonthRange = (monthIndex) => {
//     const now = new Date();
//     const start = new Date(now.getFullYear(), monthIndex, 1);
//     const end = new Date(now.getFullYear(), monthIndex + 1, 0);
//     return { start: formatDate(start), end: formatDate(end) };
//   };

//   const applyMonthFilter = (monthIndex) => {
//     setSelectedMonth(monthIndex);
//     const range = getMonthRange(monthIndex);
//     debouncedFetch(range);
//   };

//   /* ---------- Fetch Deals ---------- */
//   const fetchDeals = async (params) => {
//     try {
//       const token = localStorage.getItem("token");
//       const res = await axios.get("http://localhost:5000/api/deals/getAll", {
//         params,
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       const deals = res.data || [];
//       const counts = { open: 0, won: 0, lost: 0 };

//       deals.forEach((deal) => {
//         if (deal.stage === "Qualification" || deal.stage === "Open")
//           counts.open += 1;
//         else if (deal.stage === "Closed Won") counts.won += 1;
//         else if (deal.stage === "Closed Lost") counts.lost += 1;
//       });

//       setTotalDeals(deals.length);
//       setStatusCounts(counts);

//       // Build monthly series for pipeline bar chart / deals performance
//       const monthlyData = {};
//       deals.forEach((deal) => {
//         const date = new Date(deal.createdAt);
//         const month = date.toLocaleString("default", { month: "short" });
//         if (!monthlyData[month])
//           monthlyData[month] = { month, open: 0, won: 0, lost: 0, total: 0 };
//         if (deal.stage === "Qualification" || deal.stage === "Open")
//           monthlyData[month].open += 1;
//         else if (deal.stage === "Closed Won") monthlyData[month].won += 1;
//         else if (deal.stage === "Closed Lost") monthlyData[month].lost += 1;
//         monthlyData[month].total += 1;
//       });

//       setDealsData(
//         [
//           "Jan",
//           "Feb",
//           "Mar",
//           "Apr",
//           "May",
//           "Jun",
//           "Jul",
//           "Aug",
//           "Sep",
//           "Oct",
//           "Nov",
//           "Dec",
//         ].map((m) => {
//           const found = monthlyData[m];
//           return {
//             month: m,
//             open: found ? found.open : 0,
//             won: found ? found.won : 0,
//             lost: found ? found.lost : 0,
//             total: found ? found.total : 0,
//           };
//         })
//       );
//     } catch (err) {
//       console.error("Error fetching deals:", err);
//     }
//   };

//   /* ---------- Fetch Dashboard Data ---------- */
//   const buildParams = (range) => ({ start: range.start, end: range.end });

//   const fetchAll = async (params) => {
//     setLoading(true);
//     setError(null);
//     try {
//       const [resSummary, resPipeline, resInvoices] = await Promise.all([
//         axios.get("http://localhost:5000/api/dashboard/summary", { params }),
//         axios.get("http://localhost:5000/api/dashboard/pipeline", { params }),
//         axios.get("http://localhost:5000/api/invoice/recent", { params }),
//       ]);

//       setSummary([
//         {
//           title: "Total Leads",
//           value: resSummary.data.totalLeads,
//           color: "blue",
//           icon: <Users className="h-5 w-5" />,
//         },
//         {
//           title: "Deals Won",
//           value: resSummary.data.totalDealsWon,
//           color: "green",
//           icon: <Trophy className="h-5 w-5" />,
//         },
//         {
//           title: "Revenue",
//           value: resSummary.data.totalRevenue,
//           color: "purple",
//           icon: <DollarSign className="h-5 w-5" />,
//         },
//         {
//           title: "Pending Invoices",
//           value: resSummary.data.pendingInvoices,
//           color: "amber",
//           icon: <FileText className="h-5 w-5" />,
//         },
//       ]);

//       setPipeline(resPipeline.data || []);
//       setRecentInvoices(resInvoices.data || []);

//       // confetti for milestone
//       if (resSummary.data.totalDealsWon > 5) {
//         confetti({
//           particleCount: 100,
//           spread: 70,
//           origin: { y: 0.6 },
//         });
//       }
//     } catch (err) {
//       console.error("Dashboard fetch error:", err);
//       setError("Failed to load dashboard data.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const debouncedFetch = useDebouncedCallback((range) => {
//     fetchAll(buildParams(range));
//     fetchDeals(buildParams(range));
//   }, 300);

//   /* ---------- Filter Presets ---------- */
//   const applyPreset = (preset) => {
//     setActivePreset(preset);
//     let range;
//     if (preset === "today") range = todayRange();
//     else if (preset === "7days") range = lastNDaysRange(7);
//     else if (preset === "month") range = getMonthRange(selectedMonth);
//     else range = todayRange();

//     debouncedFetch(range);
//   };

//   /* ---------- Real-time Updates (enabled by default) ---------- */
//   useEffect(() => {
//     let interval;
//     if (realTimeData) {
//       interval = setInterval(() => {
//         const range =
//           activePreset === "month"
//             ? getMonthRange(selectedMonth)
//             : activePreset === "7days"
//             ? lastNDaysRange(7)
//             : todayRange();

//         fetchAll(buildParams(range));
//         fetchDeals(buildParams(range));
//       }, 10000); // update every 10s
//     }

//     return () => clearInterval(interval);
//   }, [activePreset, selectedMonth]); // realTimeData is always true

//   /* ---------- Initial Fetch ---------- */
//   useEffect(() => {
//     applyPreset(activePreset);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []); // one-time on mount

//   /* ---------- Invoice Chart (realtime trend) ---------- */
//   // Build revenue trend by month (for the current year) or by status depending on preset
//   const buildRevenueTrend = (invoices, preset) => {
//     if (!invoices || invoices.length === 0) return [];

//     if (preset === "month" || preset === "7days" || preset === "today") {
//       // group by status totals (keeps previous behaviour but ensures realtime)
//       const grouped = invoices.reduce((acc, inv) => {
//         const status = (inv.status || "unknown").toLowerCase();
//         acc[status] = (acc[status] || 0) + (inv.total || 0);
//         return acc;
//       }, {});
//       return Object.entries(grouped).map(([status, total]) => ({
//         status,
//         total,
//       }));
//     }

//     // default: group by month of createdAt for year view
//     const byMonth = {};
//     invoices.forEach((inv) => {
//       const date = new Date(inv.createdAt);
//       const label = date.toLocaleString("default", { month: "short" });
//       byMonth[label] = (byMonth[label] || 0) + (inv.total || 0);
//     });

//     return [
//       "Jan",
//       "Feb",
//       "Mar",
//       "Apr",
//       "May",
//       "Jun",
//       "Jul",
//       "Aug",
//       "Sep",
//       "Oct",
//       "Nov",
//       "Dec",
//     ].map((m) => ({ month: m, total: byMonth[m] || 0 }));
//   };

//   const invoiceChartData = buildRevenueTrend(recentInvoices, activePreset);

//   /* ---------- Pie data for deals */
//   const pieData = [
//     { name: "Open", value: statusCounts.open, color: COLORS[0] },
//     { name: "Won", value: statusCounts.won, color: COLORS[1] },
//     { name: "Lost", value: statusCounts.lost, color: COLORS[2] },
//   ];

//   /* ---------- Deals bar chart data (open vs won) using dealsData ---------- */
//   // Only show months that have some data for cleaner view; but keep full 12 months to maintain consistent x-axis
//   const pipelineBarData = dealsData.map((d) => ({
//     month: d.month,
//     Open: d.open,
//     Won: d.won,
//   }));

//   // Pipeline total leads computed from pipeline array
//   const totalPipelineLeads = pipeline.reduce((acc, s) => acc + (s.leads || 0), 0);

//   return (
//     <div className="p-6 space-y-6 min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 relative overflow-hidden">
//       <FloatingBubbles />

//       {/* Header with Filters */}
//       <motion.div
//         initial={{ opacity: 0, y: -20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//         className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative z-10"
//       >
//         <div>
//           <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
//             <Zap className="h-8 w-8 text-purple-600" />
//             Dashboard
//           </h1>
//           <p className="text-gray-500">Welcome to your admin dashboard</p>
//         </div>

//         <div className="flex items-center gap-2">
//           <Select
//             value={activePreset}
//             onValueChange={(value) => applyPreset(value)}
//           >
//             <SelectTrigger className="w-[180px]">
//               <SelectValue placeholder="Select period" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="today">Today</SelectItem>
//               <SelectItem value="7days">Last 7 Days</SelectItem>
//               <SelectItem value="month">This Month</SelectItem>
//             </SelectContent>
//           </Select>

//           {activePreset === "month" && (
//             <Select
//               value={String(selectedMonth)}
//               onValueChange={(value) => applyMonthFilter(Number(value))}
//             >
//               <SelectTrigger className="w-[140px]">
//                 <SelectValue placeholder="Select month" />
//               </SelectTrigger>
//               <SelectContent>
//                 {months.map((month) => (
//                   <SelectItem key={month.value} value={String(month.value)}>
//                     {month.label}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           )}
//         </div>
//       </motion.div>

//       {error && (
//         <motion.div
//           initial={{ opacity: 0, scale: 0.9 }}
//           animate={{ opacity: 1, scale: 1 }}
//           className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md relative z-10"
//         >
//           {error}
//         </motion.div>
//       )}

//       {/* Summary Cards */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
//         {loading
//           ? Array.from({ length: 4 }).map((_, i) => (
//               <Card key={i} className="overflow-hidden">
//                 <CardContent className="p-6">
//                   <Skeleton className="h-7 w-24 mb-2" />
//                   <Skeleton className="h-10 w-16" />
//                 </CardContent>
//               </Card>
//             ))
//           : summary.map((card, idx) => (
//               <motion.div
//                 key={idx}
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.5, delay: idx * 0.08 }}
//               >
//                 <Card
//                   className={cn(
//                     "overflow-hidden border-0 shadow-lg transition-all duration-300 hover:shadow-xl relative",
//                     {
//                       "bg-blue-50": card.color === "blue",
//                       "bg-green-50": card.color === "green",
//                       "bg-purple-50": card.color === "purple",
//                       "bg-amber-50": card.color === "amber",
//                     }
//                   )}
//                 >
//                   <CardContent className="p-6">
//                     <div className="flex justify-between items-start">
//                       <div>
//                         <p className="text-sm font-medium text-gray-600 mb-2">
//                           {card.title}
//                         </p>
//                         {card.title === "Revenue" ? (
//                           <AnimatedNumber
//                             value={card.value}
//                             prefix="₹"
//                             decimals={0}
//                           />
//                         ) : (
//                           <AnimatedNumber value={card.value} />
//                         )}
//                       </div>
//                       <motion.div
//                         whileHover={{ scale: 1.05 }}
//                         className={cn("p-3 rounded-full", {
//                           "bg-blue-100 text-blue-600": card.color === "blue",
//                           "bg-green-100 text-green-600": card.color === "green",
//                           "bg-purple-100 text-purple-600":
//                             card.color === "purple",
//                           "bg-amber-100 text-amber-600": card.color === "amber",
//                         })}
//                       >
//                         {card.icon}
//                       </motion.div>
//                     </div>
//                     <div className="mt-4 flex items-center">
//                       <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
//                       <span className="text-sm text-green-500 font-medium">
//                         +4.5%
//                       </span>
//                       <span className="text-sm text-gray-500 ml-2">
//                         from last period
//                       </span>
//                     </div>
//                   </CardContent>
//                 </Card>
//               </motion.div>
//             ))}
//       </div>

//       {/* Sales Pipeline (Bar chart) + Revenue Overview (realtime) */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative z-10">
//         {/* Sales Pipeline as multiple bar chart (Open vs Won) */}
//         <motion.div
//           initial={{ opacity: 0, x: -20 }}
//           animate={{ opacity: 1, x: 0 }}
//           transition={{ duration: 0.5, delay: 0.2 }}
//         >
//           <Card className="shadow-lg border-0 overflow-hidden">
//             <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
//               <div className="flex justify-between items-center">
//                 <CardTitle className="text-xl text-gray-800">
//                   Sales Pipeline (Open vs Won)
//                 </CardTitle>
//                 <Badge variant="outline" className="bg-white">
//                   {totalPipelineLeads} Deals
//                 </Badge>
//               </div>
//               <CardDescription>Monthly breakdown (realtime)</CardDescription>
//             </CardHeader>
//             <CardContent className="pt-6">
//               {loading ? (
//                 <div className="h-64">
//                   <Skeleton className="h-64 w-full" />
//                 </div>
//               ) : (
//                 <div className="h-64">
//                   <ResponsiveContainer width="100%" height="100%">
//                     <BarChart data={pipelineBarData} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
//                       <XAxis dataKey="month" tickLine={false} axisLine={false} />
//                       <YAxis />
//                       <Tooltip
//                         contentStyle={{
//                           backgroundColor: "white",
//                           borderRadius: "8px",
//                           boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
//                         }}
//                       />
//                       <Bar
//                         dataKey="Open"
//                         name="Open"
//                         fill="#3B82F6"
//                         radius={[6, 6, 0, 0]}
//                         isAnimationActive={true}
//                       />
//                       <Bar
//                         dataKey="Won"
//                         name="Won"
//                         fill="#10B981"
//                         radius={[6, 6, 0, 0]}
//                         isAnimationActive={true}
//                       />
//                     </BarChart>
//                   </ResponsiveContainer>
//                   <div className="flex gap-3 mt-4 justify-center">
//                     <Badge variant="outline" className="flex items-center gap-2">
//                       <span className="w-2 h-2 rounded-full bg-[#3B82F6]" />
//                       Open
//                     </Badge>
//                     <Badge variant="outline" className="flex items-center gap-2">
//                       <span className="w-2 h-2 rounded-full bg-[#10B981]" />
//                       Won
//                     </Badge>
//                   </div>
//                 </div>
//               )}
//             </CardContent>
//           </Card>
//         </motion.div>

//         {/* Revenue Overview with Year/Month selector - realtime calculation */}
//         <motion.div
//           initial={{ opacity: 0, x: 20 }}
//           animate={{ opacity: 1, x: 0 }}
//           transition={{ duration: 0.5, delay: 0.3 }}
//         >
//           <Card className="shadow-lg border-0 overflow-hidden">
//             <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
//               <div className="flex justify-between items-center">
//                 <CardTitle className="text-xl text-gray-800">Revenue Overview</CardTitle>
//                 <div className="flex items-center gap-2">
//                   {/* Toggle between 'year' and 'month' for revenue aggregation */}
//                   <Select
//                     value={activePreset === "month" ? "month" : activePreset === "7days" ? "7days" : "year"}
//                     onValueChange={(value) => {
//                       if (value === "month") applyPreset("month");
//                       else if (value === "7days") applyPreset("7days");
//                       else applyPreset("today"); // treat as year-like (today used as default)
//                     }}
//                   >
//                     <SelectTrigger className="w-[120px]">
//                       <SelectValue placeholder="Range" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="today">Today</SelectItem>
//                       <SelectItem value="7days">Last 7 Days</SelectItem>
//                       <SelectItem value="month">This Month</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>
//               </div>
//               <CardDescription>Realtime income by status / time</CardDescription>
//             </CardHeader>
//             <CardContent className="pt-6">
//               {loading ? (
//                 <Skeleton className="h-64 w-full" />
//               ) : invoiceChartData.length > 0 ? (
//                 <div className="h-64">
//                   {/* If invoiceChartData has month key, render AreaChart trend; else render small badges */}
//                   {invoiceChartData[0] && invoiceChartData[0].month ? (
//                     <ResponsiveContainer width="100%" height="100%">
//                       <AreaChart data={invoiceChartData} margin={{ top: 5, right: 30, left: 0, bottom: 0 }}>
//                         <defs>
//                           <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
//                             <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
//                             <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
//                           </linearGradient>
//                         </defs>
//                         <XAxis dataKey="month" />
//                         <YAxis />
//                         <Tooltip
//                           formatter={(value) => [`₹${value.toLocaleString()}`, "Revenue"]}
//                           contentStyle={{
//                             backgroundColor: "white",
//                             borderRadius: "8px",
//                             boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
//                           }}
//                         />
//                         <Area type="monotone" dataKey="total" stroke="#8884d8" fillOpacity={1} fill="url(#colorTotal)" isAnimationActive={true} />
//                       </AreaChart>
//                     </ResponsiveContainer>
//                   ) : (
//                     // grouped by status -> show badges with totals
//                     <div>
//                       <ResponsiveContainer width="100%" height={260}>
//                         <PieChart>
//                           <Pie data={invoiceChartData} dataKey="total" nameKey="status" cx="50%" cy="50%" outerRadius={80} label>
//                             {invoiceChartData.map((entry, index) => (
//                               <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.status] || COLORS[index % COLORS.length]} />
//                             ))}
//                           </Pie>
//                           <Tooltip
//                             formatter={(value) => [`₹${value.toLocaleString()}`, "Revenue"]}
//                             contentStyle={{
//                               backgroundColor: "white",
//                               borderRadius: "8px",
//                               boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
//                             }}
//                           />
//                         </PieChart>
//                       </ResponsiveContainer>
//                       <div className="flex flex-wrap gap-2 mt-4 justify-center">
//                         {invoiceChartData.map((entry, index) => (
//                           <motion.div key={index} whileHover={{ scale: 1.03 }}>
//                             <Badge variant="outline" className="flex items-center gap-1 cursor-pointer">
//                               <div className="w-2 h-2 rounded-full" style={{ backgroundColor: STATUS_COLORS[entry.status] || COLORS[index % COLORS.length] }} />
//                               {entry.status.charAt(0).toUpperCase() + entry.status.slice(1)}: ₹{entry.total.toLocaleString()}
//                             </Badge>
//                           </motion.div>
//                         ))}
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               ) : (
//                 <p className="text-gray-500 text-center py-8">No revenue data available</p>
//               )}
//             </CardContent>
//           </Card>
//         </motion.div>
//       </div>

//       {/* Deals Performance + Deal Distribution */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative z-10">
//         {/* Deals Performance (line) */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5, delay: 0.4 }}
//         >
//           <Card className="shadow-lg border-0 overflow-hidden">
//             <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
//               <CardTitle className="text-xl text-gray-800">Deals Performance</CardTitle>
//               <CardDescription>Monthly deal progression (realtime)</CardDescription>
//             </CardHeader>
//             <CardContent className="pt-6">
//               {loading ? (
//                 <Skeleton className="h-64 w-full" />
//               ) : (
//                 <div className="h-64">
//                   <ResponsiveContainer width="100%" height="100%">
//                     <LineChart data={pipelineBarData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
//                       <XAxis dataKey="month" />
//                       <YAxis />
//                       <Tooltip
//                         contentStyle={{
//                           backgroundColor: "white",
//                           borderRadius: "8px",
//                           boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
//                         }}
//                       />
//                       <Line type="monotone" dataKey="Open" stroke="#3B82F6" strokeWidth={2} dot={{ r: 4 }} isAnimationActive />
//                       <Line type="monotone" dataKey="Won" stroke="#10B981" strokeWidth={2} dot={{ r: 4 }} isAnimationActive />
//                     </LineChart>
//                   </ResponsiveContainer>
//                 </div>
//               )}
//             </CardContent>
//           </Card>
//         </motion.div>

//         {/* Deal Distribution (pie) */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5, delay: 0.5 }}
//         >
//           <Card className="shadow-lg border-0 overflow-hidden">
//             <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50">
//               <div className="flex justify-between items-center">
//                 <CardTitle className="text-xl text-gray-800">Deal Distribution</CardTitle>
//                 <Badge variant="outline" className="bg-white">{totalDeals} Total</Badge>
//               </div>
//               <CardDescription>Status breakdown of all deals</CardDescription>
//             </CardHeader>
//             <CardContent className="pt-6">
//               {loading ? (
//                 <Skeleton className="h-64 w-full rounded-full" />
//               ) : pieData.filter((item) => item.value > 0).length > 0 ? (
//                 <div className="h-64">
//                   <ResponsiveContainer width="100%" height="100%">
//                     <PieChart>
//                       <Pie
//                         data={pieData.filter((item) => item.value > 0)}
//                         cx="50%"
//                         cy="50%"
//                         outerRadius={80}
//                         fill="#8884d8"
//                         dataKey="value"
//                         label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
//                       >
//                         {pieData.map((entry, index) => (
//                           <Cell key={`cell-${index}`} fill={entry.color} />
//                         ))}
//                       </Pie>
//                       <Tooltip
//                         formatter={(value) => [`${value} deals`, "Count"]}
//                         contentStyle={{
//                           backgroundColor: "white",
//                           borderRadius: "8px",
//                           boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
//                         }}
//                       />
//                     </PieChart>
//                   </ResponsiveContainer>
//                 </div>
//               ) : (
//                 <p className="text-gray-500 text-center py-8">No deal distribution data available</p>
//               )}
//             </CardContent>
//           </Card>
//         </motion.div>
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;


// import React, { useEffect, useState, useCallback, useRef } from "react";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
//   CardDescription,
// } from "../components/ui/card";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
//   PieChart,
//   Pie,
//   Cell,
//   AreaChart,
//   Area,
//   LineChart,
//   Line,
//   CartesianGrid,
// } from "recharts";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "../components/ui/select";
// import { Skeleton } from "../components/ui/skeleton";
// import { Badge } from "../components/ui/badge";
// import {
//   Users,
//   Trophy,
//   DollarSign,
//   FileText,
//   TrendingUp,
//   Zap,
// } from "lucide-react";
// import axios from "axios";
// import { cn } from "../lib/utils";
// import { motion } from "framer-motion";
// import CountUp from "react-countup";
// import confetti from "canvas-confetti";

// /* ---------- Helpers ---------- */
// const formatDate = (d) => {
//   const yyyy = d.getFullYear();
//   const mm = String(d.getMonth() + 1).padStart(2, "0");
//   const dd = String(d.getDate()).padStart(2, "0");
//   return `${yyyy}-${mm}-${dd}`;
// };

// const todayRange = () => {
//   const now = new Date();
//   return { start: formatDate(now), end: formatDate(now) };
// };

// const lastNDaysRange = (n, refDate = new Date()) => {
//   const end = new Date(refDate);
//   const start = new Date(refDate);
//   start.setDate(end.getDate() - (n - 1));
//   return { start: formatDate(start), end: formatDate(end) };
// };

// const months = [
//   { label: "January", value: 0 },
//   { label: "February", value: 1 },
//   { label: "March", value: 2 },
//   { label: "April", value: 3 },
//   { label: "May", value: 4 },
//   { label: "June", value: 5 },
//   { label: "July", value: 6 },
//   { label: "August", value: 7 },
//   { label: "September", value: 8 },
//   { label: "October", value: 9 },
//   { label: "November", value: 10 },
//   { label: "December", value: 11 },
// ];

// const previousRangeFor = (preset, selectedMonth = new Date().getMonth()) => {
//   // returns {start, end} for previous period for comparison
//   const now = new Date();
//   if (preset === "today") {
//     const prev = new Date(now);
//     prev.setDate(now.getDate() - 1);
//     return { start: formatDate(prev), end: formatDate(prev) };
//   } else if (preset === "7days") {
//     const end = new Date();
//     end.setDate(end.getDate() - 7);
//     const start = new Date();
//     start.setDate(start.getDate() - 13); // previous 7-day block
//     return { start: formatDate(start), end: formatDate(end) };
//   } else if (preset === "month") {
//     const year = now.getFullYear();
//     const thisMonth = new Date(year, selectedMonth, 1);
//     const prevMonth = new Date(thisMonth);
//     prevMonth.setMonth(thisMonth.getMonth() - 1);
//     const prevStart = new Date(prevMonth.getFullYear(), prevMonth.getMonth(), 1);
//     const prevEnd = new Date(prevMonth.getFullYear(), prevMonth.getMonth() + 1, 0);
//     return { start: formatDate(prevStart), end: formatDate(prevEnd) };
//   }
//   return todayRange();
// };

// /* Debounce helper */
// const useDebouncedCallback = (fn, delay = 400) => {
//   const timer = useRef(null);
//   const call = useCallback(
//     (...args) => {
//       if (timer.current) clearTimeout(timer.current);
//       timer.current = setTimeout(() => fn(...args), delay);
//     },
//     [fn, delay]
//   );
//   useEffect(() => () => timer.current && clearTimeout(timer.current), []);
//   return call;
// };

// const COLORS = ["#8B5CF6", "#10B981", "#EF4444", "#3B82F6", "#F59E0B"];
// const STATUS_COLORS = {
//   paid: "#10B981",
//   unpaid: "#3B82F6",
//   pending: "#F59E0B",
//   overdue: "#EF4444",
// };

// /* ---------- Simple sea wave SVG background (subtle) ---------- */
// const SeaWaveBackground = () => (
//   <div
//     aria-hidden
//     className="absolute inset-0 pointer-events-none -z-10"
//     style={{ opacity: 0.18 }}
//   >
//     <svg viewBox="0 0 1440 320" preserveAspectRatio="none" className="w-full h-full">
//       <defs>
//         <linearGradient id="waveGrad" x1="0" x2="1">
//           <stop offset="0%" stopColor="#e6f7ff" />
//           <stop offset="100%" stopColor="#f0fbff" />
//         </linearGradient>
//       </defs>

//       <path
//         d="M0,96L48,122.7C96,149,192,203,288,208C384,213,480,171,576,165.3C672,160,768,192,864,197.3C960,203,1056,181,1152,154.7C1248,128,1344,96,1392,80L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
//         fill="url(#waveGrad)"
//       >
//         <animate
//           attributeName="d"
//           dur="12s"
//           repeatCount="indefinite"
//           values="
//             M0,96L48,122.7C96,149,192,203,288,208C384,213,480,171,576,165.3C672,160,768,192,864,197.3C960,203,1056,181,1152,154.7C1248,128,1344,96,1392,80L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z;

//             M0,160L48,170.7C96,181,192,203,288,213.3C384,224,480,224,576,213.3C672,203,768,181,864,170.7C960,160,1056,160,1152,170.7C1248,181,1344,203,1392,213.3L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z;

//             M0,96L48,122.7C96,149,192,203,288,208C384,213,480,171,576,165.3C672,160,768,192,864,197.3C960,203,1056,181,1152,154.7C1248,128,1344,96,1392,80L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z
//           "
//         />
//       </path>
//     </svg>
//   </div>
// );

// /* Animated number */
// const AnimatedNumber = ({ value, prefix = "", decimals = 0 }) => (
//   <CountUp
//     end={Number(value) || 0}
//     duration={0.9}
//     decimals={decimals}
//     prefix={prefix}
//     separator=","
//     className="text-3xl font-bold text-gray-900"
//   />
// );

// /* ---------- Component ---------- */
// const AdminDashboard = () => {
//   const [summary, setSummary] = useState([]); // each item: {title, value, color, icon, change}
//   const [pipeline, setPipeline] = useState([]);
//   const [recentInvoices, setRecentInvoices] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const [dealsData, setDealsData] = useState([]);
//   const [totalDeals, setTotalDeals] = useState(0);
//   const [statusCounts, setStatusCounts] = useState({ open: 0, won: 0, lost: 0 });

//   const [activePreset, setActivePreset] = useState("today"); // today, 7days, month
//   const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());

//   // refresh interval ms (60 seconds)
//   const REFRESH_MS = 60_000;

//   /* ---------- Ranges ---------- */
//   const getMonthRange = (monthIndex) => {
//     const now = new Date();
//     const start = new Date(now.getFullYear(), monthIndex, 1);
//     const end = new Date(now.getFullYear(), monthIndex + 1, 0);
//     return { start: formatDate(start), end: formatDate(end) };
//   };

//   const applyMonthFilter = (monthIndex) => {
//     setSelectedMonth(monthIndex);
//     const range = getMonthRange(monthIndex);
//     debouncedFetch(range);
//   };

//   /* ---------- Fetch helpers ---------- */
//   const buildParams = (range) => ({ start: range.start, end: range.end });

//   const computeChange = (current = 0, previous = 0) => {
//     if (!previous || previous === 0) {
//       return previous === 0 && current === 0 ? 0 : 100; // if prev 0 && current >0 show 100% uptick
//     }
//     const diff = current - previous;
//     return Number(((diff / Math.abs(previous)) * 100).toFixed(1));
//   };

//   /* ---------- Main Fetch (current + previous for change) ---------- */
//   const fetchAll = async (params, preset = "today", selMonth = selectedMonth) => {
//     setLoading(true);
//     setError(null);
//     try {
//       const token = localStorage.getItem("token");

//       // fetch current data
//       const [resSummary, resPipeline, resInvoices] = await Promise.all([
//         axios.get("http://localhost:5000/api/dashboard/summary", {
//           params,
//           headers: { Authorization: `Bearer ${token}` },
//         }),
//         axios.get("http://localhost:5000/api/dashboard/pipeline", {
//           params,
//           headers: { Authorization: `Bearer ${token}` },
//         }),
//         axios.get("http://localhost:5000/api/invoice/recent", {
//           params,
//           headers: { Authorization: `Bearer ${token}` },
//         }),
//       ]);

//       // fetch previous period summary to compute change
//       const prevRange = previousRangeFor(preset, selMonth);
//       const prevParams = buildParams(prevRange);

//       const resPrevSummary = await axios.get("http://localhost:5000/api/dashboard/summary", {
//         params: prevParams,
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       const curr = resSummary.data || {};
//       const prev = resPrevSummary.data || {};

//       const summaryCards = [
//         {
//           title: "Total Leads",
//           value: curr.totalLeads || 0,
//           change: computeChange(curr.totalLeads || 0, prev.totalLeads || 0),
//           color: "blue",
//           icon: <Users className="h-5 w-5" />,
//         },
//         {
//           title: "Deals Won",
//           value: curr.totalDealsWon || 0,
//           change: computeChange(curr.totalDealsWon || 0, prev.totalDealsWon || 0),
//           color: "green",
//           icon: <Trophy className="h-5 w-5" />,
//         },
//         {
//           title: "Revenue",
//           value: curr.totalRevenue || 0,
//           change: computeChange(curr.totalRevenue || 0, prev.totalRevenue || 0),
//           color: "purple",
//           icon: <DollarSign className="h-5 w-5" />,
//         },
//         {
//           title: "Pending Invoices",
//           value: curr.pendingInvoices || 0,
//           change: computeChange(curr.pendingInvoices || 0, prev.pendingInvoices || 0),
//           color: "amber",
//           icon: <FileText className="h-5 w-5" />,
//         },
//       ];

//       setSummary(summaryCards);
//       setPipeline(resPipeline.data || []);
//       setRecentInvoices(resInvoices.data || []);

//       // confetti for milestone
//       if ((curr.totalDealsWon || 0) > 5 && computeChange(curr.totalDealsWon || 0, prev.totalDealsWon || 0) > 0) {
//         confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
//       }
//     } catch (err) {
//       console.error("Dashboard fetch error:", err);
//       setError("Failed to load dashboard data.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ---------- Fetch Deals (for pipeline / charts) ---------- */
//   const fetchDeals = async (params) => {
//     try {
//       const token = localStorage.getItem("token");
//       const res = await axios.get("http://localhost:5000/api/deals/getAll", {
//         params,
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       const deals = res.data || [];
//       const counts = { open: 0, won: 0, lost: 0 };

//       const monthlyData = {};

//       deals.forEach((deal) => {
//         if (deal.stage === "Qualification" || deal.stage === "Open") counts.open += 1;
//         else if (deal.stage === "Closed Won") counts.won += 1;
//         else if (deal.stage === "Closed Lost") counts.lost += 1;

//         const d = new Date(deal.createdAt);
//         const month = d.toLocaleString("default", { month: "short" });
//         if (!monthlyData[month]) monthlyData[month] = { month, open: 0, won: 0, lost: 0, total: 0 };
//         if (deal.stage === "Qualification" || deal.stage === "Open") monthlyData[month].open += 1;
//         else if (deal.stage === "Closed Won") monthlyData[month].won += 1;
//         else if (deal.stage === "Closed Lost") monthlyData[month].lost += 1;
//         monthlyData[month].total += 1;
//       });

//       setTotalDeals(deals.length);
//       setStatusCounts(counts);

//       const full = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"].map((m) => {
//         const found = monthlyData[m];
//         return { month: m, open: found ? found.open : 0, won: found ? found.won : 0, lost: found ? found.lost : 0, total: found ? found.total : 0 };
//       });

//       setDealsData(full);
//     } catch (err) {
//       console.error("Error fetching deals:", err);
//     }
//   };

//   /* ---------- Debounced combined fetch ---------- */
//   const debouncedFetch = useDebouncedCallback((range) => {
//     const params = buildParams(range);
//     fetchAll(params, activePreset, selectedMonth);
//     fetchDeals(params);
//   }, 250);

//   /* ---------- Apply preset (today / 7days / month) ---------- */
//   const applyPreset = (preset) => {
//     setActivePreset(preset);
//     let range;
//     if (preset === "today") range = todayRange();
//     else if (preset === "7days") range = lastNDaysRange(7);
//     else if (preset === "month") range = getMonthRange(selectedMonth);
//     else range = todayRange();
//     debouncedFetch(range);
//   };

//   /* ---------- Real-time interval (60s) ---------- */
//   useEffect(() => {
//     // initial fetch
//     applyPreset(activePreset);

//     const interval = setInterval(() => {
//       const range = activePreset === "month" ? getMonthRange(selectedMonth) : activePreset === "7days" ? lastNDaysRange(7) : todayRange();
//       fetchAll(buildParams(range), activePreset, selectedMonth);
//       fetchDeals(buildParams(range));
//     }, REFRESH_MS);

//     return () => clearInterval(interval);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [activePreset, selectedMonth]);

//   /* ---------- Invoice chart building ---------- */
//   const buildRevenueTrend = (invoices, preset) => {
//     if (!invoices || invoices.length === 0) return [];

//     if (preset === "today" || preset === "7days" || preset === "month") {
//       // group by status totals for short-range preset
//       const grouped = invoices.reduce((acc, inv) => {
//         const status = (inv.status || "unknown").toLowerCase();
//         acc[status] = (acc[status] || 0) + (inv.total || 0);
//         return acc;
//       }, {});
//       return Object.entries(grouped).map(([status, total]) => ({ status, total }));
//     }

//     // else group monthly totals (year view)
//     const byMonth = {};
//     invoices.forEach((inv) => {
//       const d = new Date(inv.createdAt);
//       const m = d.toLocaleString("default", { month: "short" });
//       byMonth[m] = (byMonth[m] || 0) + (inv.total || 0);
//     });
//     return ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"].map((m) => ({ month: m, total: byMonth[m] || 0 }));
//   };

//   const invoiceChartData = buildRevenueTrend(recentInvoices, activePreset);

//   /* ---------- Derived chart datasets ---------- */
//   const pipelineBarData = dealsData.map((d) => ({ month: d.month, Open: d.open, Won: d.won }));

//   const pieData = [
//     { name: "Open", value: statusCounts.open, color: COLORS[0] },
//     { name: "Won", value: statusCounts.won, color: COLORS[1] },
//     { name: "Lost", value: statusCounts.lost, color: COLORS[2] },
//   ];

//   const totalPipelineLeads = pipeline.reduce((acc, s) => acc + (s.leads || 0), 0);

//   /* ---------- small Chart tooltip customizer ---------- */
//   const CustomTooltip = ({ active, payload, label }) => {
//     if (!active || !payload || payload.length === 0) return null;
//     return (
//       <div className="bg-white p-2 rounded-md shadow" style={{ minWidth: 140 }}>
//         <div className="text-sm font-medium text-gray-700">{label}</div>
//         {payload.map((p, i) => (
//           <div key={i} className="text-sm text-gray-600 mt-1">
//             <span style={{ display: "inline-block", width: 8, height: 8, background: p.color, marginRight: 8 }} />
//             {p.name}: <strong>{p.value}</strong>
//           </div>
//         ))}
//       </div>
//     );
//   };

//   /* ---------- UI ---------- */
//   return (
//     <div className="p-6 space-y-6 min-h-screen relative overflow-hidden bg-gradient-to-br from-gray-50 to-blue-50">
//       <SeaWaveBackground />

//       {/* Header */}
//       <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative z-10">
//         <div>
//           <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
//             <Zap className="h-8 w-8 text-purple-600" />
//             Dashboard
//           </h1>
//           <p className="text-gray-500">Realtime insights — auto-refresh every 60s</p>
//         </div>

//         <div className="flex items-center gap-2">
//           <Select value={activePreset} onValueChange={(v) => applyPreset(v)}>
//             <SelectTrigger className="w-[180px]">
//               <SelectValue placeholder="Select period" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="today">Today</SelectItem>
//               <SelectItem value="7days">Last 7 Days</SelectItem>
//               <SelectItem value="month">This Month</SelectItem>
//             </SelectContent>
//           </Select>

//           {activePreset === "month" && (
//             <Select value={String(selectedMonth)} onValueChange={(value) => applyMonthFilter(Number(value))}>
//               <SelectTrigger className="w-[140px]">
//                 <SelectValue placeholder="Select month" />
//               </SelectTrigger>
//               <SelectContent>
//                 {months.map((m) => (
//                   <SelectItem key={m.value} value={String(m.value)}>
//                     {m.label}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           )}
//         </div>
//       </motion.div>

//       {error && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md relative z-10">{error}</motion.div>}

//       {/* Summary */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
//         {loading ? (
//           Array.from({ length: 4 }).map((_, i) => (
//             <Card key={i}><CardContent className="p-6"><Skeleton className="h-7 w-24 mb-2" /><Skeleton className="h-10 w-16" /></CardContent></Card>
//           ))
//         ) : (
//           summary.map((card, idx) => (
//             <motion.div key={card.title} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.06 }}>
//               <Card className={cn("overflow-hidden border-0 shadow-lg transition-all duration-300 hover:shadow-xl relative", {
//                 "bg-blue-50": card.color === "blue",
//                 "bg-green-50": card.color === "green",
//                 "bg-purple-50": card.color === "purple",
//                 "bg-amber-50": card.color === "amber",
//               })}>
//                 <CardContent className="p-6">
//                   <div className="flex justify-between items-start">
//                     <div>
//                       <p className="text-sm font-medium text-gray-600 mb-2">{card.title}</p>
//                       {card.title === "Revenue" ? <AnimatedNumber value={card.value} prefix="₹" /> : <AnimatedNumber value={card.value} />}
//                     </div>
//                     <div className={cn("p-3 rounded-full", {
//                       "bg-blue-100 text-blue-600": card.color === "blue",
//                       "bg-green-100 text-green-600": card.color === "green",
//                       "bg-purple-100 text-purple-600": card.color === "purple",
//                       "bg-amber-100 text-amber-600": card.color === "amber",
//                     })}>
//                       {card.icon}
//                     </div>
//                   </div>

//                   {/* realtime percent change */}
//                   <div className="mt-4 flex items-center">
//                     <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
//                     <span className={`text-sm font-medium ${card.change >= 0 ? "text-green-500" : "text-red-500"}`}>
//                       {card.change >= 0 ? `+${card.change}%` : `${card.change}%`}
//                     </span>
//                     <span className="text-sm text-gray-500 ml-2">vs previous period</span>
//                   </div>
//                 </CardContent>
//               </Card>
//             </motion.div>
//           ))
//         )}
//       </div>

//       {/* Pipeline + Revenue */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative z-10">
//         {/* Pipeline: improved bar + styling */}
//         <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.45 }}>
//           <Card className="shadow-lg border-0 overflow-hidden">
//             <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
//               <div className="flex justify-between items-center">
//                 <CardTitle className="text-xl text-gray-800">Sales Pipeline</CardTitle>
//                 <Badge variant="outline" className="bg-white">{totalPipelineLeads} Deals</Badge>
//               </div>
//               <CardDescription>Open vs Won — monthly (realtime)</CardDescription>
//             </CardHeader>

//             <CardContent className="pt-6">
//               {loading ? (
//                 <div className="h-64"><Skeleton className="h-64 w-full" /></div>
//               ) : (
//                 <motion.div layout key={activePreset} initial={{ opacity: 0.6 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
//                   <div className="h-72">
//                     <ResponsiveContainer width="100%" height="100%">
//                       <BarChart data={pipelineBarData} margin={{ top: 6, right: 12, left: 0, bottom: 6 }}>
//                         <defs>
//                           <linearGradient id="gOpen" x1="0" x2="0" y1="0" y2="1">
//                             <stop offset="0%" stopColor="#60A5FA" stopOpacity={0.95} />
//                             <stop offset="100%" stopColor="#60A5FA" stopOpacity={0.2} />
//                           </linearGradient>
//                           <linearGradient id="gWon" x1="0" x2="0" y1="0" y2="1">
//                             <stop offset="0%" stopColor="#34D399" stopOpacity={0.95} />
//                             <stop offset="100%" stopColor="#34D399" stopOpacity={0.2} />
//                           </linearGradient>
//                         </defs>
//                         <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.06} />
//                         <XAxis dataKey="month" tickLine={false} axisLine={false} />
//                         <YAxis />
//                         <Tooltip content={<CustomTooltip />} />
//                         <Bar dataKey="Open" name="Open" fill="url(#gOpen)" barSize={18} radius={[6,6,0,0]} isAnimationActive />
//                         <Bar dataKey="Won" name="Won" fill="url(#gWon)" barSize={18} radius={[6,6,0,0]} isAnimationActive />
//                       </BarChart>
//                     </ResponsiveContainer>
//                   </div>

//                   <div className="flex gap-3 mt-4 justify-center">
//                     <Badge variant="outline" className="flex items-center gap-2">
//                       <span className="w-2 h-2 rounded-full bg-[#60A5FA]" />
//                       Open
//                     </Badge>
//                     <Badge variant="outline" className="flex items-center gap-2">
//                       <span className="w-2 h-2 rounded-full bg-[#34D399]" />
//                       Won
//                     </Badge>
//                   </div>
//                 </motion.div>
//               )}
//             </CardContent>
//           </Card>
//         </motion.div>

//         {/* Revenue Overview */}
//         <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.45 }}>
//           <Card className="shadow-lg border-0 overflow-hidden">
//             <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
//               <div className="flex justify-between items-center">
//                 <CardTitle className="text-xl text-gray-800">Revenue Overview</CardTitle>
//                 <div className="flex items-center gap-2">
//                   <Select value={activePreset} onValueChange={(v) => applyPreset(v)}>
//                     <SelectTrigger className="w-[140px]">
//                       <SelectValue placeholder="Range" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="today">Today</SelectItem>
//                       <SelectItem value="7days">Last 7 Days</SelectItem>
//                       <SelectItem value="month">This Month</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>
//               </div>
//               <CardDescription>Realtime revenue (auto-updates)</CardDescription>
//             </CardHeader>

//             <CardContent className="pt-6">
//               {loading ? (
//                 <Skeleton className="h-64 w-full" />
//               ) : invoiceChartData.length > 0 ? (
//                 <div className="h-64">
//                   {invoiceChartData[0] && invoiceChartData[0].month ? (
//                     <ResponsiveContainer width="100%" height="100%">
//                       <AreaChart data={invoiceChartData} margin={{ top: 6, right: 20, left: 0, bottom: 6 }}>
//                         <defs>
//                           <linearGradient id="revGrad" x1="0" x2="0" y1="0" y2="1">
//                             <stop offset="0%" stopColor="#A78BFA" stopOpacity={0.9} />
//                             <stop offset="100%" stopColor="#A78BFA" stopOpacity={0.05} />
//                           </linearGradient>
//                         </defs>
//                         <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.06} />
//                         <XAxis dataKey="month" />
//                         <YAxis />
//                         <Tooltip formatter={(v) => [`₹${v.toLocaleString()}`, "Revenue"]} />
//                         <Area type="monotone" dataKey="total" stroke="#8B5CF6" fill="url(#revGrad)" isAnimationActive />
//                       </AreaChart>
//                     </ResponsiveContainer>
//                   ) : (
//                     <div>
//                       <ResponsiveContainer width="100%" height={260}>
//                         <PieChart>
//                           <Pie data={invoiceChartData} dataKey="total" nameKey="status" cx="50%" cy="50%" outerRadius={80} label>
//                             {invoiceChartData.map((entry, idx) => (
//                               <Cell key={idx} fill={STATUS_COLORS[entry.status] || COLORS[idx % COLORS.length]} />
//                             ))}
//                           </Pie>
//                         </PieChart>
//                       </ResponsiveContainer>

//                       <div className="flex flex-wrap gap-2 mt-4 justify-center">
//                         {invoiceChartData.map((entry, index) => (
//                           <motion.div key={index} whileHover={{ scale: 1.03 }}>
//                             <Badge variant="outline" className="flex items-center gap-1 cursor-pointer">
//                               <div className="w-2 h-2 rounded-full" style={{ backgroundColor: STATUS_COLORS[entry.status] || COLORS[index % COLORS.length] }} />
//                               {entry.status.charAt(0).toUpperCase() + entry.status.slice(1)}: ₹{entry.total.toLocaleString()}
//                             </Badge>
//                           </motion.div>
//                         ))}
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               ) : (
//                 <p className="text-gray-500 text-center py-8">No revenue data available</p>
//               )}
//             </CardContent>
//           </Card>
//         </motion.div>
//       </div>

//       {/* Deals Performance + Deal Distribution */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative z-10">
//         {/* Deals Performance: lines + area + smooth animation */}
//         <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
//           <Card className="shadow-lg border-0 overflow-hidden">
//             <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
//               <CardTitle className="text-xl text-gray-800">Deals Performance</CardTitle>
//               <CardDescription>Open vs Won — animated trend</CardDescription>
//             </CardHeader>

//             <CardContent className="pt-6">
//               {loading ? (
//                 <Skeleton className="h-64 w-full" />
//               ) : (
//                 <div className="h-64">
//                   <ResponsiveContainer width="100%" height="100%">
//                     <LineChart data={pipelineBarData} margin={{ top: 6, right: 20, left: 0, bottom: 6 }}>
//                       <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.06} />
//                       <XAxis dataKey="month" />
//                       <YAxis />
//                       <Tooltip formatter={(v) => [v, "Deals"]} />
//                       <Area type="monotone" dataKey="Open" stroke="#60A5FA" fillOpacity={0.12} fill="#60A5FA" isAnimationActive />
//                       <Line type="monotone" dataKey="Open" stroke="#3B82F6" strokeWidth={2} dot={{ r: 3 }} isAnimationActive />
//                       <Area type="monotone" dataKey="Won" stroke="#34D399" fillOpacity={0.12} fill="#34D399" isAnimationActive />
//                       <Line type="monotone" dataKey="Won" stroke="#10B981" strokeWidth={2} dot={{ r: 3 }} isAnimationActive />
//                     </LineChart>
//                   </ResponsiveContainer>
//                 </div>
//               )}
//             </CardContent>
//           </Card>
//         </motion.div>

//         {/* Deal Distribution: animated pie with hover */}
//         <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
//           <Card className="shadow-lg border-0 overflow-hidden">
//             <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50">
//               <div className="flex justify-between items-center">
//                 <CardTitle className="text-xl text-gray-800">Deal Distribution</CardTitle>
//                 <Badge variant="outline" className="bg-white">{totalDeals} Total</Badge>
//               </div>
//               <CardDescription>Percentage split — animated</CardDescription>
//             </CardHeader>

//             <CardContent className="pt-6">
//               {loading ? (
//                 <Skeleton className="h-64 w-full rounded-full" />
//               ) : pieData.filter((p) => p.value > 0).length > 0 ? (
//                 <motion.div initial={{ scale: 0.98, opacity: 0.9 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.45 }}>
//                   <div className="h-64">
//                     <ResponsiveContainer width="100%" height="100%">
//                       <PieChart>
//                         <Pie
//                           data={pieData.filter((p) => p.value > 0)}
//                           cx="50%"
//                           cy="50%"
//                           outerRadius={80}
//                           dataKey="value"
//                           nameKey="name"
//                           label={(entry) => `${entry.name}: ${entry.value}`}
//                         >
//                           {pieData.filter((p) => p.value > 0).map((entry, idx) => (
//                             <Cell key={idx} fill={entry.color} />
//                           ))}
//                         </Pie>
//                         <Tooltip formatter={(value) => [`${value} deals`, "Count"]} />
//                       </PieChart>
//                     </ResponsiveContainer>
//                   </div>

//                   <div className="flex gap-3 mt-4 justify-center">
//                     {pieData.filter((p) => p.value > 0).map((p, i) => (
//                       <motion.div key={p.name} whileHover={{ scale: 1.04 }}>
//                         <Badge variant="outline" className="flex items-center gap-2">
//                           <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
//                           {p.name} ({p.value})
//                         </Badge>
//                       </motion.div>
//                     ))}
//                   </div>
//                 </motion.div>
//               ) : (
//                 <p className="text-gray-500 text-center py-8">No deal distribution data available</p>
//               )}
//             </CardContent>
//           </Card>
//         </motion.div>
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;


// AdminDashboard.updated.jsx
// import React, { useEffect, useState, useCallback, useRef } from "react";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
//   CardDescription,
// } from "../components/ui/card";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
//   PieChart,
//   Pie,
//   Cell,
//   AreaChart,
//   Area,
//   LineChart,
//   Line,
//   CartesianGrid,
// } from "recharts";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "../components/ui/select";
// import { Skeleton } from "../components/ui/skeleton";
// import { Badge } from "../components/ui/badge";
// import {
//   Users,
//   Trophy,
//   DollarSign,
//   FileText,
//   TrendingUp,
//   Zap,
// } from "lucide-react";
// import axios from "axios";
// import { cn } from "../lib/utils";
// import { motion } from "framer-motion";
// import CountUp from "react-countup";
// import confetti from "canvas-confetti";

// /* ---------- Helpers (unchanged + extended) ---------- */
// const formatDate = (d) => {
//   const yyyy = d.getFullYear();
//   const mm = String(d.getMonth() + 1).padStart(2, "0");
//   const dd = String(d.getDate()).padStart(2, "0");
//   return `${yyyy}-${mm}-${dd}`;
// };

// const todayRange = () => {
//   const now = new Date();
//   return { start: formatDate(now), end: formatDate(now) };
// };

// const lastNDaysRange = (n, refDate = new Date()) => {
//   const end = new Date(refDate);
//   const start = new Date(refDate);
//   start.setDate(end.getDate() - (n - 1));
//   return { start: formatDate(start), end: formatDate(end) };
// };

// const months = [
//   { label: "January", value: 0 },
//   { label: "February", value: 1 },
//   { label: "March", value: 2 },
//   { label: "April", value: 3 },
//   { label: "May", value: 4 },
//   { label: "June", value: 5 },
//   { label: "July", value: 6 },
//   { label: "August", value: 7 },
//   { label: "September", value: 8 },
//   { label: "October", value: 9 },
//   { label: "November", value: 10 },
//   { label: "December", value: 11 },
// ];

// const previousRangeFor = (preset, selectedMonth = new Date().getMonth(), selectedYear = new Date().getFullYear()) => {
//   const now = new Date();
//   if (preset === "today") {
//     const prev = new Date(now);
//     prev.setDate(now.getDate() - 1);
//     return { start: formatDate(prev), end: formatDate(prev) };
//   } else if (preset === "7days") {
//     const end = new Date();
//     end.setDate(end.getDate() - 7);
//     const start = new Date();
//     start.setDate(start.getDate() - 13); // previous 7-day block
//     return { start: formatDate(start), end: formatDate(end) };
//   } else if (preset === "month") {
//     const thisMonth = new Date(selectedYear, selectedMonth, 1);
//     const prevMonth = new Date(thisMonth);
//     prevMonth.setMonth(thisMonth.getMonth() - 1);
//     const prevStart = new Date(prevMonth.getFullYear(), prevMonth.getMonth(), 1);
//     const prevEnd = new Date(prevMonth.getFullYear(), prevMonth.getMonth() + 1, 0);
//     return { start: formatDate(prevStart), end: formatDate(prevEnd) };
//   } else if (preset === "year") {
//     // previous year
//     const prevYear = selectedYear - 1;
//     const prevStart = new Date(prevYear, 0, 1);
//     const prevEnd = new Date(prevYear, 11, 31);
//     return { start: formatDate(prevStart), end: formatDate(prevEnd) };
//   }
//   return todayRange();
// };

// /* Debounce helper */
// const useDebouncedCallback = (fn, delay = 400) => {
//   const timer = useRef(null);
//   const call = useCallback(
//     (...args) => {
//       if (timer.current) clearTimeout(timer.current);
//       timer.current = setTimeout(() => fn(...args), delay);
//     },
//     [fn, delay]
//   );
//   useEffect(() => () => timer.current && clearTimeout(timer.current), []);
//   return call;
// };

// const COLORS = ["#8B5CF6", "#10B981", "#EF4444", "#3B82F6", "#F59E0B"];
// const STATUS_COLORS = {
//   paid: "#10B981",
//   unpaid: "#3B82F6",
//   pending: "#F59E0B",
//   overdue: "#EF4444",
// };

// /* ---------- Decorative Bubbles component (reused inside cards) ---------- */
// const CardBubbles = ({ variant = "light" }) => {
//   // small decorative circles placed absolutely inside the card
//   return (
//     <svg className="pointer-events-none absolute inset-0 -z-0" preserveAspectRatio="none">
//       <g opacity="0.12">
//         <circle cx="18" cy="22" r="12" fill="#8B5CF6" />
//         <circle cx="280" cy="18" r="6" fill="#F59E0B" />
//         <circle cx="60" cy="110" r="8" fill="#34D399" />
//         <circle cx="200" cy="88" r="10" fill="#60A5FA" />
//       </g>
//     </svg>
//   );
// };

// /* Animated number */
// const AnimatedNumber = ({ value, prefix = "", decimals = 0 }) => (
//   <CountUp
//     end={Number(value) || 0}
//     duration={0.9}
//     decimals={decimals}
//     prefix={prefix}
//     separator=","
//     className="text-3xl font-bold text-gray-900"
//   />
// );

// /* ---------- Component ---------- */
// const AdminDashboard = () => {
//   const [summary, setSummary] = useState([]);
//   const [pipeline, setPipeline] = useState([]);
//   const [recentInvoices, setRecentInvoices] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const [dealsData, setDealsData] = useState([]);
//   const [totalDeals, setTotalDeals] = useState(0);
//   const [statusCounts, setStatusCounts] = useState({ open: 0, won: 0, lost: 0 });

//   const [activePreset, setActivePreset] = useState("today"); // today, 7days, month, year
//   const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
//   const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

//   // refresh interval ms (60 seconds)
//   const REFRESH_MS = 60_000;

//   /* ---------- Ranges ---------- */
//   const getMonthRange = (monthIndex, year = new Date().getFullYear()) => {
//     const start = new Date(year, monthIndex, 1);
//     const end = new Date(year, monthIndex + 1, 0);
//     return { start: formatDate(start), end: formatDate(end) };
//   };

//   const getYearRange = (year) => {
//     const start = new Date(year, 0, 1);
//     const end = new Date(year, 11, 31);
//     return { start: formatDate(start), end: formatDate(end) };
//   };

//   const applyMonthFilter = (monthIndex) => {
//     setSelectedMonth(monthIndex);
//     const range = getMonthRange(monthIndex, selectedYear);
//     debouncedFetch(range);
//   };

//   const applyYearFilter = (year) => {
//     setSelectedYear(year);
//     const range = getYearRange(year);
//     debouncedFetch(range);
//   };

//   /* ---------- Fetch helpers ---------- */
//   const buildParams = (range) => ({ start: range.start, end: range.end });

//   const computeChange = (current = 0, previous = 0) => {
//     if (!previous || previous === 0) {
//       return previous === 0 && current === 0 ? 0 : 100;
//     }
//     const diff = current - previous;
//     return Number(((diff / Math.abs(previous)) * 100).toFixed(1));
//   };

//   /* ---------- Main Fetch (current + previous for change) ---------- */
//   const fetchAll = async (params, preset = "today", selMonth = selectedMonth, selYear = selectedYear) => {
//     setLoading(true);
//     setError(null);
//     try {
//       const token = localStorage.getItem("token");

//       const [resSummary, resPipeline, resInvoices] = await Promise.all([
//         axios.get("http://localhost:5000/api/dashboard/summary", {
//           params,
//           headers: { Authorization: `Bearer ${token}` },
//         }),
//         axios.get("http://localhost:5000/api/dashboard/pipeline", {
//           params,
//           headers: { Authorization: `Bearer ${token}` },
//         }),
//         axios.get("http://localhost:5000/api/invoice/recent", {
//           params,
//           headers: { Authorization: `Bearer ${token}` },
//         }),
//       ]);

//       const prevRange = previousRangeFor(preset, selMonth, selYear);
//       const prevParams = buildParams(prevRange);

//       const resPrevSummary = await axios.get("http://localhost:5000/api/dashboard/summary", {
//         params: prevParams,
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       const curr = resSummary.data || {};
//       const prev = resPrevSummary.data || {};

//       const summaryCards = [
//         {
//           title: "Total Leads",
//           value: curr.totalLeads || 0,
//           change: computeChange(curr.totalLeads || 0, prev.totalLeads || 0),
//           color: "blue",
//           icon: <Users className="h-5 w-5" />,
//         },
//         {
//           title: "Deals Won",
//           value: curr.totalDealsWon || 0,
//           change: computeChange(curr.totalDealsWon || 0, prev.totalDealsWon || 0),
//           color: "green",
//           icon: <Trophy className="h-5 w-5" />,
//         },
//         {
//           title: "Revenue",
//           value: curr.totalRevenue || 0,
//           change: computeChange(curr.totalRevenue || 0, prev.totalRevenue || 0),
//           color: "purple",
//           icon: <DollarSign className="h-5 w-5" />,
//         },
//         {
//           title: "Pending Invoices",
//           value: curr.pendingInvoices || 0,
//           change: computeChange(curr.pendingInvoices || 0, prev.pendingInvoices || 0),
//           color: "amber",
//           icon: <FileText className="h-5 w-5" />,
//         },
//       ];

//       setSummary(summaryCards);
//       setPipeline(resPipeline.data || []);
//       setRecentInvoices(resInvoices.data || []);

//       if ((curr.totalDealsWon || 0) > 5 && computeChange(curr.totalDealsWon || 0, prev.totalDealsWon || 0) > 0) {
//         confetti({ particleCount: 120, spread: 90, origin: { y: 0.6 } });
//       }
//     } catch (err) {
//       console.error("Dashboard fetch error:", err);
//       setError("Failed to load dashboard data.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ---------- Fetch Deals (for pipeline / charts) ---------- */
//   const fetchDeals = async (params) => {
//     try {
//       const token = localStorage.getItem("token");
//       const res = await axios.get("http://localhost:5000/api/deals/getAll", {
//         params,
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       const deals = res.data || [];
//       const counts = { open: 0, won: 0, lost: 0 };

//       const monthlyData = {};

//       deals.forEach((deal) => {
//         if (deal.stage === "Qualification" || deal.stage === "Open") counts.open += 1;
//         else if (deal.stage === "Closed Won") counts.won += 1;
//         else if (deal.stage === "Closed Lost") counts.lost += 1;

//         const d = new Date(deal.createdAt);
//         const month = d.toLocaleString("default", { month: "short" });
//         if (!monthlyData[month]) monthlyData[month] = { month, open: 0, won: 0, lost: 0, total: 0 };
//         if (deal.stage === "Qualification" || deal.stage === "Open") monthlyData[month].open += 1;
//         else if (deal.stage === "Closed Won") monthlyData[month].won += 1;
//         else if (deal.stage === "Closed Lost") monthlyData[month].lost += 1;
//         monthlyData[month].total += 1;
//       });

//       setTotalDeals(deals.length);
//       setStatusCounts(counts);

//       const full = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"].map((m) => {
//         const found = monthlyData[m];
//         return { month: m, open: found ? found.open : 0, won: found ? found.won : 0, lost: found ? found.lost : 0, total: found ? found.total : 0 };
//       });

//       setDealsData(full);
//     } catch (err) {
//       console.error("Error fetching deals:", err);
//     }
//   };

//   /* ---------- Debounced combined fetch ---------- */
//   const debouncedFetch = useDebouncedCallback((range) => {
//     const params = buildParams(range);
//     fetchAll(params, activePreset, selectedMonth, selectedYear);
//     fetchDeals(params);
//   }, 250);

//   /* ---------- Apply preset (today / 7days / month / year) ---------- */
//   const applyPreset = (preset) => {
//     setActivePreset(preset);
//     let range;
//     if (preset === "today") range = todayRange();
//     else if (preset === "7days") range = lastNDaysRange(7);
//     else if (preset === "month") range = getMonthRange(selectedMonth, selectedYear);
//     else if (preset === "year") range = getYearRange(selectedYear);
//     else range = todayRange();
//     debouncedFetch(range);
//   };

//   /* ---------- Real-time interval (60s) ---------- */
//   useEffect(() => {
//     applyPreset(activePreset);

//     const interval = setInterval(() => {
//       const range = activePreset === "month" ? getMonthRange(selectedMonth, selectedYear) :
//                     activePreset === "7days" ? lastNDaysRange(7) :
//                     activePreset === "year" ? getYearRange(selectedYear) : todayRange();
//       fetchAll(buildParams(range), activePreset, selectedMonth, selectedYear);
//       fetchDeals(buildParams(range));
//     }, REFRESH_MS);

//     return () => clearInterval(interval);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [activePreset, selectedMonth, selectedYear]);

//   /* ---------- Invoice chart building (improved) ---------- */
//   const buildRevenueTrend = (invoices, preset) => {
//     if (!invoices || invoices.length === 0) return [];

//     if (preset === "today" || preset === "7days" || preset === "month") {
//       // group by status totals for short-range preset
//       const grouped = invoices.reduce((acc, inv) => {
//         const status = (inv.status || "unknown").toLowerCase();
//         acc[status] = (acc[status] || 0) + (inv.total || 0);
//         return acc;
//       }, {});
//       return Object.entries(grouped).map(([status, total]) => ({ status, total }));
//     }

//     // else group monthly totals (year view)
//     const byMonth = {};
//     invoices.forEach((inv) => {
//       const d = new Date(inv.createdAt);
//       const m = d.toLocaleString("default", { month: "short" });
//       byMonth[m] = (byMonth[m] || 0) + (inv.total || 0);
//     });
//     return ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"].map((m) => ({ month: m, total: byMonth[m] || 0 }));
//   };

//   const invoiceChartData = buildRevenueTrend(recentInvoices, activePreset);

//   /* ---------- Derived chart datasets ---------- */
//   const pipelineBarData = dealsData.map((d) => ({ month: d.month, Open: d.open, Won: d.won }));

//   const pieData = [
//     { name: "Open", value: statusCounts.open, color: "#60A5FA" },
//     { name: "Won", value: statusCounts.won, color: "#34D399" },
//     { name: "Lost", value: statusCounts.lost, color: "#F97316" },
//   ];

//   const totalPipelineLeads = pipeline.reduce((acc, s) => acc + (s.leads || 0), 0);

//   /* ---------- small Chart tooltip customizer ---------- */
//   const CustomTooltip = ({ active, payload, label }) => {
//     if (!active || !payload || payload.length === 0) return null;
//     return (
//       <div className="bg-white p-2 rounded-md shadow" style={{ minWidth: 140 }}>
//         <div className="text-sm font-medium text-gray-700">{label}</div>
//         {payload.map((p, i) => (
//           <div key={i} className="text-sm text-gray-600 mt-1">
//             <span style={{ display: "inline-block", width: 8, height: 8, background: p.color, marginRight: 8 }} />
//             {p.name}: <strong>{p.value}</strong>
//           </div>
//         ))}
//       </div>
//     );
//   };

//   /* ---------- UI ---------- */
//   // years for filter
//   const currentYear = new Date().getFullYear();
//   const years = Array.from({ length: 6 }).map((_, i) => currentYear - i);

//   return (
//     <div className="p-6 space-y-6 min-h-screen relative overflow-hidden bg-gradient-to-br from-gray-50 to-blue-50">
//       {/* subtle background wave (kept inside) */}
//       <div aria-hidden className="absolute inset-0 -z-10" style={{ opacity: 0.12 }}>
//         {/* tiny decorative gradient */}
//         <svg viewBox="0 0 1440 320" preserveAspectRatio="none" className="w-full h-full">
//           <defs>
//             <linearGradient id="bgTiny" x1="0" x2="1">
//               <stop offset="0%" stopColor="#f8fafc" />
//               <stop offset="100%" stopColor="#fff" />
//             </linearGradient>
//           </defs>
//           <rect width="1440" height="320" fill="url(#bgTiny)" />
//         </svg>
//       </div>

//       {/* Header */}
//       <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative z-10">
//         <div>
//           <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
//             <Zap className="h-8 w-8 text-purple-600" />
//             Dashboard
//           </h1>
//           <p className="text-gray-500">Realtime insights — auto-refresh every 60s</p>
//         </div>

//         <div className="flex items-center gap-2">
//           <Select value={activePreset} onValueChange={(v) => applyPreset(v)}>
//             <SelectTrigger className="w-[180px]">
//               <SelectValue placeholder="Select period" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="today">Today</SelectItem>
//               <SelectItem value="7days">Last 7 Days</SelectItem>
//               <SelectItem value="month">This Month</SelectItem>
//               <SelectItem value="year">This Year</SelectItem>
//             </SelectContent>
//           </Select>

//           {/* Year selector (visible for month or year presets) */}
//           {(activePreset === "month" || activePreset === "year") && (
//             <Select value={String(selectedYear)} onValueChange={(value) => applyYearFilter(Number(value))}>
//               <SelectTrigger className="w-[120px]">
//                 <SelectValue placeholder="Year" />
//               </SelectTrigger>
//               <SelectContent>
//                 {years.map((y) => (
//                   <SelectItem key={y} value={String(y)}>{y}</SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           )}

//           {/* Month selector (visible for activePreset === month OR when user picks 'year' but wants month drilldown) */}
//           {(activePreset === "month" || activePreset === "year") && (
//             <Select value={String(selectedMonth)} onValueChange={(value) => applyMonthFilter(Number(value))}>
//               <SelectTrigger className="w-[140px]">
//                 <SelectValue placeholder="Select month" />
//               </SelectTrigger>
//               <SelectContent>
//                 {months.map((m) => (
//                   <SelectItem key={m.value} value={String(m.value)}>{m.label}</SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           )}
//         </div>
//       </motion.div>

//       {error && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md relative z-10">{error}</motion.div>}

//       {/* Summary */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
//         {loading ? (
//           Array.from({ length: 4 }).map((_, i) => (
//             <Card key={i} className="relative overflow-hidden border-0 shadow-lg">
//               <CardContent className="p-6 relative">
//                 <CardBubbles />
//                 <Skeleton className="h-7 w-24 mb-2" />
//                 <Skeleton className="h-10 w-16" />
//               </CardContent>
//             </Card>
//           ))
//         ) : (
//           summary.map((card, idx) => (
//             <motion.div key={card.title} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.06 }}>
//               <Card className={cn("relative overflow-hidden border-0 shadow-lg", {
//                 "bg-white": true,
//               })}>
//                 <CardContent className="p-6 relative">
//                   <CardBubbles />
//                   <div className="flex justify-between items-start">
//                     <div>
//                       <p className="text-sm font-medium text-gray-600 mb-2">{card.title}</p>
//                       {card.title === "Revenue" ? <AnimatedNumber value={card.value} prefix="₹" /> : <AnimatedNumber value={card.value} />}
//                     </div>
//                     <div className={cn("p-3 rounded-full", {
//                       "bg-blue-100 text-blue-600": card.color === "blue",
//                       "bg-green-100 text-green-600": card.color === "green",
//                       "bg-purple-100 text-purple-600": card.color === "purple",
//                       "bg-amber-100 text-amber-600": card.color === "amber",
//                     })}>
//                       {card.icon}
//                     </div>
//                   </div>

//                   {/* realtime percent change */}
//                   <div className="mt-4 flex items-center">
//                     <TrendingUp className={`h-4 w-4 ${card.change >= 0 ? "text-green-500" : "text-red-500"} mr-1`} />
//                     <span className={`text-sm font-medium ${card.change >= 0 ? "text-green-500" : "text-red-500"}`}>
//                       {card.change >= 0 ? `+${card.change}%` : `${card.change}%`}
//                     </span>
//                     <span className="text-sm text-gray-500 ml-2">vs previous period</span>
//                   </div>
//                 </CardContent>
//               </Card>
//             </motion.div>
//           ))
//         )}
//       </div>

//       {/* Pipeline + Revenue */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative z-10">
//         {/* Pipeline (left) */}
//         <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.45 }}>
//           <Card className="shadow-lg border-0 overflow-hidden relative">
//             <CardHeader className="bg-transparent">
//               <div className="flex justify-between items-center">
//                 <CardTitle className="text-xl text-gray-800">Sales Pipeline</CardTitle>
//                 <Badge variant="outline" className="bg-white">{totalPipelineLeads} Deals</Badge>
//               </div>
//               <CardDescription>Open vs Won — monthly (realtime)</CardDescription>
//             </CardHeader>

//             <CardContent className="pt-6 relative">
//               <CardBubbles />
//               {loading ? (
//                 <div className="h-64"><Skeleton className="h-64 w-full" /></div>
//               ) : (
//                 <motion.div layout key={activePreset} initial={{ opacity: 0.6 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
//                   <div className="h-72">
//                     <ResponsiveContainer width="100%" height="100%">
//                       <BarChart data={pipelineBarData} margin={{ top: 6, right: 12, left: 0, bottom: 6 }}>
//                         <defs>
//                           <linearGradient id="gOpen2" x1="0" x2="0" y1="0" y2="1">
//                             <stop offset="0%" stopColor="#60A5FA" stopOpacity={0.95} />
//                             <stop offset="100%" stopColor="#60A5FA" stopOpacity={0.06} />
//                           </linearGradient>
//                           <linearGradient id="gWon2" x1="0" x2="0" y1="0" y2="1">
//                             <stop offset="0%" stopColor="#34D399" stopOpacity={0.95} />
//                             <stop offset="100%" stopColor="#34D399" stopOpacity={0.06} />
//                           </linearGradient>
//                         </defs>
//                         <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.06} />
//                         <XAxis dataKey="month" tickLine={false} axisLine={false} />
//                         <YAxis />
//                         <Tooltip content={<CustomTooltip />} />
//                         <Bar dataKey="Open" name="Open" fill="url(#gOpen2)" barSize={18} radius={[10,10,4,4]} isAnimationActive animationDuration={900}/>
//                         <Bar dataKey="Won" name="Won" fill="url(#gWon2)" barSize={18} radius={[10,10,4,4]} isAnimationActive animationDuration={1000}/>
//                       </BarChart>
//                     </ResponsiveContainer>
//                   </div>

//                   <div className="flex gap-3 mt-4 justify-center">
//                     <Badge variant="outline" className="flex items-center gap-2">
//                       <span className="w-2 h-2 rounded-full bg-[#60A5FA]" />
//                       Open
//                     </Badge>
//                     <Badge variant="outline" className="flex items-center gap-2">
//                       <span className="w-2 h-2 rounded-full bg-[#34D399]" />
//                       Won
//                     </Badge>
//                   </div>
//                 </motion.div>
//               )}
//             </CardContent>
//           </Card>
//         </motion.div>

//         {/* Revenue Overview (right) - changed to attractive line chart with dots + gradients */}
//         <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.45 }}>
//           <Card className="shadow-lg border-0 overflow-hidden relative">
//             <CardHeader className="bg-transparent">
//               <div className="flex justify-between items-center">
//                 <CardTitle className="text-xl text-gray-800">Revenue Overview</CardTitle>
//                 <div className="flex items-center gap-2">
//                   <Select value={activePreset} onValueChange={(v) => applyPreset(v)}>
//                     <SelectTrigger className="w-[140px]">
//                       <SelectValue placeholder="Range" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="today">Today</SelectItem>
//                       <SelectItem value="7days">Last 7 Days</SelectItem>
//                       <SelectItem value="month">This Month</SelectItem>
//                       <SelectItem value="year">This Year</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>
//               </div>
//               <CardDescription>Realtime revenue (auto-updates)</CardDescription>
//             </CardHeader>

//             <CardContent className="pt-6 relative">
//               <CardBubbles />
//               {loading ? (
//                 <Skeleton className="h-64 w-full" />
//               ) : invoiceChartData.length > 0 ? (
//                 <div className="h-64">
//                   {/* if month/year aggregated (month keys present), show smooth line chart */}
//                   {invoiceChartData[0] && invoiceChartData[0].month ? (
//                     <ResponsiveContainer width="100%" height="100%">
//                       <LineChart data={invoiceChartData} margin={{ top: 6, right: 20, left: 0, bottom: 6 }}>
//                         <defs>
//                           <linearGradient id="revLineGrad" x1="0" x2="0" y1="0" y2="1">
//                             <stop offset="0%" stopColor="#A78BFA" stopOpacity={0.95} />
//                             <stop offset="100%" stopColor="#A78BFA" stopOpacity={0.06} />
//                           </linearGradient>
//                         </defs>
//                         <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.06} />
//                         <XAxis dataKey="month" tickFormatter={(v) => v.slice(0, 3)} />
//                         <YAxis />
//                         <Tooltip formatter={(v) => [`₹${v.toLocaleString()}`, "Revenue"]} />
//                         <Line
//                           dataKey="total"
//                           type="monotone"
//                           stroke="#8B5CF6"
//                           strokeWidth={2.5}
//                           dot={{ r: 4, strokeWidth: 2, fill: "#fff" }}
//                           activeDot={{ r: 7 }}
//                           isAnimationActive
//                           animationDuration={1100}
//                         />
//                         <Area type="monotone" dataKey="total" stroke="none" fill="url(#revLineGrad)" fillOpacity={0.16} isAnimationActive />
//                       </LineChart>
//                     </ResponsiveContainer>
//                   ) : (
//                     /* for short-range (status-split) use a pie w/ attractive colors + animated badges */
//                     <div>
//                       <ResponsiveContainer width="100%" height={260}>
//                         <PieChart>
//                           <Pie data={invoiceChartData} dataKey="total" nameKey="status" cx="50%" cy="50%" outerRadius={80} label>
//                             {invoiceChartData.map((entry, idx) => (
//                               <Cell key={idx} fill={STATUS_COLORS[entry.status] || COLORS[idx % COLORS.length]} />
//                             ))}
//                           </Pie>
//                           <Tooltip formatter={(v) => [`₹${v.toLocaleString()}`, "Total"]} />
//                         </PieChart>
//                       </ResponsiveContainer>

//                       <div className="flex flex-wrap gap-2 mt-4 justify-center">
//                         {invoiceChartData.map((entry, index) => (
//                           <motion.div key={index} whileHover={{ scale: 1.04 }} className="flex">
//                             <Badge variant="outline" className="flex items-center gap-1 cursor-pointer">
//                               <div className="w-2 h-2 rounded-full" style={{ backgroundColor: STATUS_COLORS[entry.status] || COLORS[index % COLORS.length] }} />
//                               {entry.status.charAt(0).toUpperCase() + entry.status.slice(1)}: ₹{entry.total.toLocaleString()}
//                             </Badge>
//                           </motion.div>
//                         ))}
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               ) : (
//                 <p className="text-gray-500 text-center py-8">No revenue data available</p>
//               )}
//             </CardContent>
//           </Card>
//         </motion.div>
//       </div>

//       {/* Deals Performance + Deal Distribution */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative z-10">
//         {/* Deals Performance */}
//         <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
//           <Card className="shadow-lg border-0 overflow-hidden relative">
//             <CardHeader className="bg-transparent">
//               <CardTitle className="text-xl text-gray-800">Deals Performance</CardTitle>
//               <CardDescription>Open vs Won — animated trend</CardDescription>
//             </CardHeader>

//             <CardContent className="pt-6 relative">
//               <CardBubbles />
//               {loading ? (
//                 <Skeleton className="h-64 w-full" />
//               ) : (
//                 <div className="h-64">
//                   <ResponsiveContainer width="100%" height="100%">
//                     <LineChart data={pipelineBarData} margin={{ top: 6, right: 20, left: 0, bottom: 6 }}>
//                       <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.06} />
//                       <XAxis dataKey="month" />
//                       <YAxis />
//                       <Tooltip formatter={(v) => [v, "Deals"]} />
//                       {/* open */}
//                       <Area type="monotone" dataKey="Open" stroke="#60A5FA" fillOpacity={0.12} fill="#60A5FA" isAnimationActive />
//                       <Line type="monotone" dataKey="Open" stroke="#3B82F6" strokeWidth={2.4} dot={{ r: 3 }} isAnimationActive />
//                       {/* won */}
//                       <Area type="monotone" dataKey="Won" stroke="#34D399" fillOpacity={0.12} fill="#34D399" isAnimationActive />
//                       <Line type="monotone" dataKey="Won" stroke="#10B981" strokeWidth={2.4} dot={{ r: 3 }} isAnimationActive />
//                     </LineChart>
//                   </ResponsiveContainer>
//                 </div>
//               )}
//             </CardContent>
//           </Card>
//         </motion.div>

//         {/* Deal Distribution */}
//         <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
//           <Card className="shadow-lg border-0 overflow-hidden relative">
//             <CardHeader className="bg-transparent">
//               <div className="flex justify-between items-center">
//                 <CardTitle className="text-xl text-gray-800">Deal Distribution</CardTitle>
//                 <Badge variant="outline" className="bg-white">{totalDeals} Total</Badge>
//               </div>
//               <CardDescription>Percentage split — animated</CardDescription>
//             </CardHeader>

//             <CardContent className="pt-6 relative">
//               <CardBubbles />
//               {loading ? (
//                 <Skeleton className="h-64 w-full rounded-full" />
//               ) : pieData.filter((p) => p.value > 0).length > 0 ? (
//                 <motion.div initial={{ scale: 0.98, opacity: 0.9 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.45 }}>
//                   <div className="h-64">
//                     <ResponsiveContainer width="100%" height="100%">
//                       <PieChart>
//                         <Pie
//                           data={pieData.filter((p) => p.value > 0)}
//                           cx="50%"
//                           cy="50%"
//                           outerRadius={80}
//                           dataKey="value"
//                           nameKey="name"
//                           label={(entry) => `${entry.name}: ${entry.value}`}
//                           isAnimationActive
//                         >
//                           {pieData.filter((p) => p.value > 0).map((entry, idx) => (
//                             <Cell key={idx} fill={entry.color} />
//                           ))}
//                         </Pie>
//                         <Tooltip formatter={(value) => [`${value} deals`, "Count"]} />
//                       </PieChart>
//                     </ResponsiveContainer>
//                   </div>

//                   <div className="flex gap-3 mt-4 justify-center">
//                     {pieData.filter((p) => p.value > 0).map((p, i) => (
//                       <motion.div key={p.name} whileHover={{ scale: 1.04 }}>
//                         <Badge variant="outline" className="flex items-center gap-2">
//                           <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
//                           {p.name} ({p.value})
//                         </Badge>
//                       </motion.div>
//                     ))}
//                   </div>
//                 </motion.div>
//               ) : (
//                 <p className="text-gray-500 text-center py-8">No deal distribution data available</p>
//               )}
//             </CardContent>
//           </Card>
//         </motion.div>
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;




// import React, { useEffect, useState, useCallback, useRef } from "react";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
//   CardDescription,
// } from "../components/ui/card";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
//   PieChart,
//   Pie,
//   Cell,
//   AreaChart,
//   Area,
//   LineChart,
//   Line,
//   CartesianGrid,
// } from "recharts";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "../components/ui/select";
// import { Skeleton } from "../components/ui/skeleton";
// import { Badge } from "../components/ui/badge";
// import {
//   Users,
//   Trophy,
//   DollarSign,
//   FileText,
//   TrendingUp,
//   Zap,
//   Calendar,
// } from "lucide-react";
// import axios from "axios";
// import { cn } from "../lib/utils";
// import { motion } from "framer-motion";
// import CountUp from "react-countup";
// import confetti from "canvas-confetti";

// /* ---------- Helpers ---------- */
// const formatDate = (d) => {
//   const yyyy = d.getFullYear();
//   const mm = String(d.getMonth() + 1).padStart(2, "0");
//   const dd = String(d.getDate()).padStart(2, "0");
//   return `${yyyy}-${mm}-${dd}`;
// };

// const todayRange = () => {
//   const now = new Date();
//   return { start: formatDate(now), end: formatDate(now) };
// };

// const lastNDaysRange = (n, refDate = new Date()) => {
//   const end = new Date(refDate);
//   const start = new Date(refDate);
//   start.setDate(end.getDate() - (n - 1));
//   return { start: formatDate(start), end: formatDate(end) };
// };

// const months = [
//   { label: "January", value: 0 },
//   { label: "February", value: 1 },
//   { label: "March", value: 2 },
//   { label: "April", value: 3 },
//   { label: "May", value: 4 },
//   { label: "June", value: 5 },
//   { label: "July", value: 6 },
//   { label: "August", value: 7 },
//   { label: "September", value: 8 },
//   { label: "October", value: 9 },
//   { label: "November", value: 10 },
//   { label: "December", value: 11 },
// ];

// const years = [
//   { label: "2023", value: 2023 },
//   { label: "2024", value: 2024 },
//   { label: "2025", value: 2025 },
// ];

// const previousRangeFor = (preset, selectedMonth = new Date().getMonth()) => {
//   // returns {start, end} for previous period for comparison
//   const now = new Date();
//   if (preset === "today") {
//     const prev = new Date(now);
//     prev.setDate(now.getDate() - 1);
//     return { start: formatDate(prev), end: formatDate(prev) };
//   } else if (preset === "7days") {
//     const end = new Date();
//     end.setDate(end.getDate() - 7);
//     const start = new Date();
//     start.setDate(start.getDate() - 13); // previous 7-day block
//     return { start: formatDate(start), end: formatDate(end) };
//   } else if (preset === "month") {
//     const year = now.getFullYear();
//     const thisMonth = new Date(year, selectedMonth, 1);
//     const prevMonth = new Date(thisMonth);
//     prevMonth.setMonth(thisMonth.getMonth() - 1);
//     const prevStart = new Date(prevMonth.getFullYear(), prevMonth.getMonth(), 1);
//     const prevEnd = new Date(prevMonth.getFullYear(), prevMonth.getMonth() + 1, 0);
//     return { start: formatDate(prevStart), end: formatDate(prevEnd) };
//   }
//   return todayRange();
// };

// /* Debounce helper */
// const useDebouncedCallback = (fn, delay = 400) => {
//   const timer = useRef(null);
//   const call = useCallback(
//     (...args) => {
//       if (timer.current) clearTimeout(timer.current);
//       timer.current = setTimeout(() => fn(...args), delay);
//     },
//     [fn, delay]
//   );
//   useEffect(() => () => timer.current && clearTimeout(timer.current), []);
//   return call;
// };

// const COLORS = ["#8B5CF6", "#3B82F6", "#60A5FA", "#A78BFA", "#7C3AED"];
// const STATUS_COLORS = {
//   paid: "#8B5CF6",
//   unpaid: "#3B82F6",
//   pending: "#60A5FA",
//   overdue: "#A78BFA",
// };

// /* ---------- Bubbles Background Component ---------- */
// const BubblesBackground = () => (
//   <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
//     {[...Array(15)].map((_, i) => (
//       <motion.div
//         key={i}
//         className="absolute rounded-full opacity-20"
//         style={{
//           width: Math.random() * 100 + 50,
//           height: Math.random() * 100 + 50,
//           top: `${Math.random() * 100}%`,
//           left: `${Math.random() * 100}%`,
//           background: `radial-gradient(circle, ${COLORS[i % COLORS.length]}33, transparent)`,
//         }}
//         animate={{
//           y: [0, -20, 0],
//           x: [0, Math.random() * 20 - 10, 0],
//           scale: [1, 1.05, 1],
//         }}
//         transition={{
//           duration: 5 + Math.random() * 5,
//           repeat: Infinity,
//           ease: "easeInOut",
//         }}
//       />
//     ))}
//   </div>
// );

// /* Animated number */
// const AnimatedNumber = ({ value, prefix = "", decimals = 0 }) => (
//   <CountUp
//     end={Number(value) || 0}
//     duration={0.9}
//     decimals={decimals}
//     prefix={prefix}
//     separator=","
//     className="text-3xl font-bold text-gray-900"
//   />
// );

// /* ---------- Component ---------- */
// const AdminDashboard = () => {
//   const [summary, setSummary] = useState([]); // each item: {title, value, color, icon, change}
//   const [pipeline, setPipeline] = useState([]);
//   const [recentInvoices, setRecentInvoices] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const [dealsData, setDealsData] = useState([]);
//   const [totalDeals, setTotalDeals] = useState(0);
//   const [statusCounts, setStatusCounts] = useState({ open: 0, won: 0, lost: 0 });

//   const [activePreset, setActivePreset] = useState("today"); // today, 7days, month
//   const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
//   const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

//   // refresh interval ms (60 seconds)
//   const REFRESH_MS = 60_000;

//   /* ---------- Ranges ---------- */
//   const getMonthRange = (monthIndex, year) => {
//     const start = new Date(year, monthIndex, 1);
//     const end = new Date(year, monthIndex + 1, 0);
//     return { start: formatDate(start), end: formatDate(end) };
//   };

//   const getYearRange = (year) => {
//     const start = new Date(year, 0, 1);
//     const end = new Date(year, 11, 31);
//     return { start: formatDate(start), end: formatDate(end) };
//   };

//   const applyMonthFilter = (monthIndex) => {
//     setSelectedMonth(monthIndex);
//     const range = getMonthRange(monthIndex, selectedYear);
//     debouncedFetch(range);
//   };

//   const applyYearFilter = (year) => {
//     setSelectedYear(year);
//     if (activePreset === "year") {
//       const range = getYearRange(year);
//       debouncedFetch(range);
//     }
//   };

//   /* ---------- Fetch helpers ---------- */
//   const buildParams = (range) => ({ start: range.start, end: range.end });

//   const computeChange = (current = 0, previous = 0) => {
//     if (!previous || previous === 0) {
//       return previous === 0 && current === 0 ? 0 : 100; // if prev 0 && current >0 show 100% uptick
//     }
//     const diff = current - previous;
//     return Number(((diff / Math.abs(previous)) * 100).toFixed(1));
//   };

//   /* ---------- Main Fetch (current + previous for change) ---------- */
//   const fetchAll = async (params, preset = "today", selMonth = selectedMonth) => {
//     setLoading(true);
//     setError(null);
//     try {
//       const token = localStorage.getItem("token");

//       // fetch current data
//       const [resSummary, resPipeline, resInvoices] = await Promise.all([
//         axios.get("http://localhost:5000/api/dashboard/summary", {
//           params,
//           headers: { Authorization: `Bearer ${token}` },
//         }),
//         axios.get("http://localhost:5000/api/dashboard/pipeline", {
//           params,
//           headers: { Authorization: `Bearer ${token}` },
//         }),
//         axios.get("http://localhost:5000/api/invoice/recent", {
//           params,
//           headers: { Authorization: `Bearer ${token}` },
//         }),
//       ]);

//       // fetch previous period summary to compute change
//       const prevRange = previousRangeFor(preset, selMonth);
//       const prevParams = buildParams(prevRange);

//       const resPrevSummary = await axios.get("http://localhost:5000/api/dashboard/summary", {
//         params: prevParams,
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       const curr = resSummary.data || {};
//       const prev = resPrevSummary.data || {};

//       const summaryCards = [
//         {
//           title: "Total Leads",
//           value: curr.totalLeads || 0,
//           change: computeChange(curr.totalLeads || 0, prev.totalLeads || 0),
//           color: "blue",
//           icon: <Users className="h-5 w-5" />,
//         },
//         {
//           title: "Deals Won",
//           value: curr.totalDealsWon || 0,
//           change: computeChange(curr.totalDealsWon || 0, prev.totalDealsWon || 0),
//           color: "purple",
//           icon: <Trophy className="h-5 w-5" />,
//         },
//         {
//           title: "Revenue",
//           value: curr.totalRevenue || 0,
//           change: computeChange(curr.totalRevenue || 0, prev.totalRevenue || 0),
//           color: "indigo",
//           icon: <DollarSign className="h-5 w-5" />,
//         },
//         {
//           title: "Pending Invoices",
//           value: curr.pendingInvoices || 0,
//           change: computeChange(curr.pendingInvoices || 0, prev.pendingInvoices || 0),
//           color: "violet",
//           icon: <FileText className="h-5 w-5" />,
//         },
//       ];

//       setSummary(summaryCards);
//       setPipeline(resPipeline.data || []);
//       setRecentInvoices(resInvoices.data || []);

//       // confetti for milestone
//       if ((curr.totalDealsWon || 0) > 5 && computeChange(curr.totalDealsWon || 0, prev.totalDealsWon || 0) > 0) {
//         confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
//       }
//     } catch (err) {
//       console.error("Dashboard fetch error:", err);
//       setError("Failed to load dashboard data.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ---------- Fetch Deals (for pipeline / charts) ---------- */
//   const fetchDeals = async (params) => {
//     try {
//       const token = localStorage.getItem("token");
//       const res = await axios.get("http://localhost:5000/api/deals/getAll", {
//         params,
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       const deals = res.data || [];
//       const counts = { open: 0, won: 0, lost: 0 };

//       const monthlyData = {};

//       deals.forEach((deal) => {
//         if (deal.stage === "Qualification" || deal.stage === "Open") counts.open += 1;
//         else if (deal.stage === "Closed Won") counts.won += 1;
//         else if (deal.stage === "Closed Lost") counts.lost += 1;

//         const d = new Date(deal.createdAt);
//         const month = d.toLocaleString("default", { month: "short" });
//         if (!monthlyData[month]) monthlyData[month] = { month, open: 0, won: 0, lost: 0, total: 0 };
//         if (deal.stage === "Qualification" || deal.stage === "Open") monthlyData[month].open += 1;
//         else if (deal.stage === "Closed Won") monthlyData[month].won += 1;
//         else if (deal.stage === "Closed Lost") monthlyData[month].lost += 1;
//         monthlyData[month].total += 1;
//       });

//       setTotalDeals(deals.length);
//       setStatusCounts(counts);

//       const full = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"].map((m) => {
//         const found = monthlyData[m];
//         return { month: m, open: found ? found.open : 0, won: found ? found.won : 0, lost: found ? found.lost : 0, total: found ? found.total : 0 };
//       });

//       setDealsData(full);
//     } catch (err) {
//       console.error("Error fetching deals:", err);
//     }
//   };

//   /* ---------- Debounced combined fetch ---------- */
//   const debouncedFetch = useDebouncedCallback((range) => {
//     const params = buildParams(range);
//     fetchAll(params, activePreset, selectedMonth);
//     fetchDeals(params);
//   }, 250);

//   /* ---------- Apply preset (today / 7days / month / year) ---------- */
//   const applyPreset = (preset) => {
//     setActivePreset(preset);
//     let range;
//     if (preset === "today") range = todayRange();
//     else if (preset === "7days") range = lastNDaysRange(7);
//     else if (preset === "month") range = getMonthRange(selectedMonth, selectedYear);
//     else if (preset === "year") range = getYearRange(selectedYear);
//     else range = todayRange();
//     debouncedFetch(range);
//   };

//   /* ---------- Real-time interval (60s) ---------- */
//   useEffect(() => {
//     // initial fetch
//     applyPreset(activePreset);

//     const interval = setInterval(() => {
//       let range;
//       if (activePreset === "month") range = getMonthRange(selectedMonth, selectedYear);
//       else if (activePreset === "7days") range = lastNDaysRange(7);
//       else if (activePreset === "year") range = getYearRange(selectedYear);
//       else range = todayRange();
      
//       fetchAll(buildParams(range), activePreset, selectedMonth);
//       fetchDeals(buildParams(range));
//     }, REFRESH_MS);

//     return () => clearInterval(interval);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [activePreset, selectedMonth, selectedYear]);

//   /* ---------- Invoice chart building ---------- */
//   const buildRevenueTrend = (invoices, preset) => {
//     if (!invoices || invoices.length === 0) return [];

//     // Group by month for all presets
//     const byMonth = {};
//     invoices.forEach((inv) => {
//       const d = new Date(inv.createdAt);
//       const m = d.toLocaleString("default", { month: "short" });
//       byMonth[m] = (byMonth[m] || 0) + (inv.total || 0);
//     });
    
//     return ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"].map((m) => ({
//       month: m,
//       total: byMonth[m] || 0
//     }));
//   };

//   const invoiceChartData = buildRevenueTrend(recentInvoices, activePreset);

//   /* ---------- Derived chart datasets ---------- */
//   const pipelineBarData = dealsData.map((d) => ({ month: d.month, Open: d.open, Won: d.won }));

//   const pieData = [
//     { name: "Open", value: statusCounts.open, color: "#8B5CF6" },
//     { name: "Won", value: statusCounts.won, color: "#3B82F6" },
//     { name: "Lost", value: statusCounts.lost, color: "#60A5FA" },
//   ];

//   const totalPipelineLeads = pipeline.reduce((acc, s) => acc + (s.leads || 0), 0);

//   /* ---------- small Chart tooltip customizer ---------- */
//   const CustomTooltip = ({ active, payload, label }) => {
//     if (!active || !payload || payload.length === 0) return null;
//     return (
//       <div className="bg-white p-2 rounded-md shadow" style={{ minWidth: 140 }}>
//         <div className="text-sm font-medium text-gray-700">{label}</div>
//         {payload.map((p, i) => (
//           <div key={i} className="text-sm text-gray-600 mt-1">
//             <span style={{ display: "inline-block", width: 8, height: 8, background: p.color, marginRight: 8 }} />
//             {p.name}: <strong>{p.value}</strong>
//           </div>
//         ))}
//       </div>
//     );
//   };

//   /* ---------- UI ---------- */
//   return (
//     <div className="p-6 space-y-6 min-h-screen relative overflow-hidden bg-gradient-to-br from-gray-50 to-blue-50">
//       <BubblesBackground />

//       {/* Header */}
//       <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative z-10">
//         <div>
//           <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
//             <Zap className="h-8 w-8 text-purple-600" />
//             Dashboard
//           </h1>
//           <p className="text-gray-500">Realtime insights — auto-refresh every 60s</p>
//         </div>

//         <div className="flex items-center gap-2 flex-wrap">
//           <Select value={activePreset} onValueChange={(v) => applyPreset(v)}>
//             <SelectTrigger className="w-[180px]">
//               <SelectValue placeholder="Select period" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="today">Today</SelectItem>
//               <SelectItem value="7days">Last 7 Days</SelectItem>
//               <SelectItem value="month">This Month</SelectItem>
//               <SelectItem value="year">This Year</SelectItem>
//             </SelectContent>
//           </Select>

//           {(activePreset === "month" || activePreset === "year") && (
//             <Select value={String(selectedMonth)} onValueChange={(value) => applyMonthFilter(Number(value))}>
//               <SelectTrigger className="w-[140px]">
//                 <SelectValue placeholder="Select month" />
//               </SelectTrigger>
//               <SelectContent>
//                 {months.map((m) => (
//                   <SelectItem key={m.value} value={String(m.value)}>
//                     {m.label}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           )}

//           {(activePreset === "year") && (
//             <Select value={String(selectedYear)} onValueChange={(value) => applyYearFilter(Number(value))}>
//               <SelectTrigger className="w-[120px]">
//                 <SelectValue placeholder="Select year" />
//               </SelectTrigger>
//               <SelectContent>
//                 {years.map((y) => (
//                   <SelectItem key={y.value} value={String(y.value)}>
//                     {y.label}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           )}
//         </div>
//       </motion.div>

//       {error && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md relative z-10">{error}</motion.div>}

//       {/* Summary */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
//         {loading ? (
//           Array.from({ length: 4 }).map((_, i) => (
//             <Card key={i}><CardContent className="p-6"><Skeleton className="h-7 w-24 mb-2" /><Skeleton className="h-10 w-16" /></CardContent></Card>
//           ))
//         ) : (
//           summary.map((card, idx) => (
//             <motion.div key={card.title} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.06 }}>
//               <Card className={cn("overflow-hidden border-0 shadow-lg transition-all duration-300 hover:shadow-xl relative", {
//                 "bg-blue-50": card.color === "blue",
//                 "bg-purple-50": card.color === "purple",
//                 "bg-indigo-50": card.color === "indigo",
//                 "bg-violet-50": card.color === "violet",
//               })}>
//                 <CardContent className="p-6">
//                   <div className="flex justify-between items-start">
//                     <div>
//                       <p className="text-sm font-medium text-gray-600 mb-2">{card.title}</p>
//                       {card.title === "Revenue" ? <AnimatedNumber value={card.value} prefix="₹" /> : <AnimatedNumber value={card.value} />}
//                     </div>
//                     <div className={cn("p-3 rounded-full", {
//                       "bg-blue-100 text-blue-600": card.color === "blue",
//                       "bg-purple-100 text-purple-600": card.color === "purple",
//                       "bg-indigo-100 text-indigo-600": card.color === "indigo",
//                       "bg-violet-100 text-violet-600": card.color === "violet",
//                     })}>
//                       {card.icon}
//                     </div>
//                   </div>

//                   {/* realtime percent change */}
//                   <div className="mt-4 flex items-center">
//                     <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
//                     <span className={`text-sm font-medium ${card.change >= 0 ? "text-green-500" : "text-red-500"}`}>
//                       {card.change >= 0 ? `+${card.change}%` : `${card.change}%`}
//                     </span>
//                     <span className="text-sm text-gray-500 ml-2">vs previous period</span>
//                   </div>
//                 </CardContent>
//               </Card>
//             </motion.div>
//           ))
//         )}
//       </div>

//       {/* Pipeline + Revenue */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative z-10">
//         {/* Pipeline: improved bar + styling */}
//         <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.45 }}>
//           <Card className="shadow-lg border-0 overflow-hidden">
//             <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
//               <div className="flex justify-between items-center">
//                 <CardTitle className="text-xl text-gray-800">Sales Pipeline</CardTitle>
//                 <Badge variant="outline" className="bg-white">{totalPipelineLeads} Deals</Badge>
//               </div>
//               <CardDescription>Open vs Won — monthly (realtime)</CardDescription>
//             </CardHeader>

//             <CardContent className="pt-6">
//               {loading ? (
//                 <div className="h-64"><Skeleton className="h-64 w-full" /></div>
//               ) : (
//                 <motion.div layout key={activePreset} initial={{ opacity: 0.6 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
//                   <div className="h-72">
//                     <ResponsiveContainer width="100%" height="100%">
//                       <BarChart data={pipelineBarData} margin={{ top: 6, right: 12, left: 0, bottom: 6 }}>
//                         <defs>
//                           <linearGradient id="gOpen" x1="0" x2="0" y1="0" y2="1">
//                             <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.95} />
//                             <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0.2} />
//                           </linearGradient>
//                           <linearGradient id="gWon" x1="0" x2="0" y1="0" y2="1">
//                             <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.95} />
//                             <stop offset="100%" stopColor="#3B82F6" stopOpacity={0.2} />
//                           </linearGradient>
//                         </defs>
//                         <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.06} />
//                         <XAxis dataKey="month" tickLine={false} axisLine={false} />
//                         <YAxis />
//                         <Tooltip content={<CustomTooltip />} />
//                         <Bar dataKey="Open" name="Open" fill="url(#gOpen)" barSize={18} radius={[6,6,0,0]} isAnimationActive />
//                         <Bar dataKey="Won" name="Won" fill="url(#gWon)" barSize={18} radius={[6,6,0,0]} isAnimationActive />
//                       </BarChart>
//                     </ResponsiveContainer>
//                   </div>

//                   <div className="flex gap-3 mt-4 justify-center">
//                     <Badge variant="outline" className="flex items-center gap-2">
//                       <span className="w-2 h-2 rounded-full bg-[#8B5CF6]" />
//                       Open
//                     </Badge>
//                     <Badge variant="outline" className="flex items-center gap-2">
//                       <span className="w-2 h-2 rounded-full bg-[#3B82F6]" />
//                       Won
//                     </Badge>
//                   </div>
//                 </motion.div>
//               )}
//             </CardContent>
//           </Card>
//         </motion.div>

//         {/* Revenue Overview */}
//         <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.45 }}>
//           <Card className="shadow-lg border-0 overflow-hidden">
//             <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
//               <div className="flex justify-between items-center">
//                 <CardTitle className="text-xl text-gray-800">Revenue Overview</CardTitle>
//                 <div className="flex items-center gap-2">
//                   <Select value={activePreset} onValueChange={(v) => applyPreset(v)}>
//                     <SelectTrigger className="w-[140px]">
//                       <SelectValue placeholder="Range" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="today">Today</SelectItem>
//                       <SelectItem value="7days">Last 7 Days</SelectItem>
//                       <SelectItem value="month">This Month</SelectItem>
//                       <SelectItem value="year">This Year</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>
//               </div>
//               <CardDescription>Realtime revenue (auto-updates)</CardDescription>
//             </CardHeader>

//             <CardContent className="pt-6">
//               {loading ? (
//                 <Skeleton className="h-64 w-full" />
//               ) : invoiceChartData.length > 0 ? (
//                 <div className="h-64">
//                   <ResponsiveContainer width="100%" height="100%">
//                     <AreaChart data={invoiceChartData} margin={{ top: 6, right: 20, left: 0, bottom: 6 }}>
//                       <defs>
//                         <linearGradient id="revGrad" x1="0" x2="0" y1="0" y2="1">
//                           <stop offset="0%" stopColor="#A78BFA" stopOpacity={0.9} />
//                           <stop offset="100%" stopColor="#A78BFA" stopOpacity={0.05} />
//                         </linearGradient>
//                       </defs>
//                       <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.06} />
//                       <XAxis dataKey="month" />
//                       <YAxis />
//                       <Tooltip formatter={(v) => [`₹${v.toLocaleString()}`, "Revenue"]} />
//                       <Area
//                         type="monotone"
//                         dataKey="total"
//                         stroke="#8B5CF6"
//                         fill="url(#revGrad)"
//                         isAnimationActive
//                         activeDot={{ r: 6, fill: "#8B5CF6" }}
//                       />
//                     </AreaChart>
//                   </ResponsiveContainer>
//                 </div>
//               ) : (
//                 <p className="text-gray-500 text-center py-8">No revenue data available</p>
//               )}
//             </CardContent>
//           </Card>
//         </motion.div>
//       </div>

//       {/* Deals Performance + Deal Distribution */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative z-10">
//         {/* Deals Performance: lines + area + smooth animation */}
//         <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
//           <Card className="shadow-lg border-0 overflow-hidden">
//             <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50">
//               <CardTitle className="text-xl text-gray-800">Deals Performance</CardTitle>
//               <CardDescription>Open vs Won — animated trend</CardDescription>
//             </CardHeader>

//             <CardContent className="pt-6">
//               {loading ? (
//                 <Skeleton className="h-64 w-full" />
//               ) : (
//                 <div className="h-64">
//                   <ResponsiveContainer width="100%" height="100%">
//                     <LineChart data={pipelineBarData} margin={{ top: 6, right: 20, left: 0, bottom: 6 }}>
//                       <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.06} />
//                       <XAxis dataKey="month" />
//                       <YAxis />
//                       <Tooltip formatter={(v) => [v, "Deals"]} />
//                       <Area type="monotone" dataKey="Open" stroke="#8B5CF6" fillOpacity={0.12} fill="#8B5CF6" isAnimationActive />
//                       <Line type="monotone" dataKey="Open" stroke="#8B5CF6" strokeWidth={2} dot={{ r: 3, fill: "#8B5CF6" }} isAnimationActive />
//                       <Area type="monotone" dataKey="Won" stroke="#3B82F6" fillOpacity={0.12} fill="#3B82F6" isAnimationActive />
//                       <Line type="monotone" dataKey="Won" stroke="#3B82F6" strokeWidth={2} dot={{ r: 3, fill: "#3B82F6" }} isAnimationActive />
//                     </LineChart>
//                   </ResponsiveContainer>
//                 </div>
//               )}
//             </CardContent>
//           </Card>
//         </motion.div>

//         {/* Deal Distribution: animated pie with hover */}
//         <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
//           <Card className="shadow-lg border-0 overflow-hidden">
//             <CardHeader className="bg-gradient-to-r from-violet-50 to-purple-50">
//               <div className="flex justify-between items-center">
//                 <CardTitle className="text-xl text-gray-800">Deal Distribution</CardTitle>
//                 <Badge variant="outline" className="bg-white">{totalDeals} Total</Badge>
//               </div>
//               <CardDescription>Percentage split — animated</CardDescription>
//             </CardHeader>

//             <CardContent className="pt-6">
//               {loading ? (
//                 <Skeleton className="h-64 w-full rounded-full" />
//               ) : pieData.filter((p) => p.value > 0).length > 0 ? (
//                 <motion.div initial={{ scale: 0.98, opacity: 0.9 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.45 }}>
//                   <div className="h-64">
//                     <ResponsiveContainer width="100%" height="100%">
//                       <PieChart>
//                         <Pie
//                           data={pieData.filter((p) => p.value > 0)}
//                           cx="50%"
//                           cy="50%"
//                           outerRadius={80}
//                           dataKey="value"
//                           nameKey="name"
//                           label={(entry) => `${entry.name}: ${entry.value}`}
//                         >
//                           {pieData.filter((p) => p.value > 0).map((entry, idx) => (
//                             <Cell
//                               key={idx}
//                               fill={entry.color}
//                               stroke="#fff"
//                               strokeWidth={2}
//                             />
//                           ))}
//                         </Pie>
//                         <Tooltip formatter={(value) => [`${value} deals`, "Count"]} />
//                       </PieChart>
//                     </ResponsiveContainer>
//                   </div>

//                   <div className="flex gap-3 mt-4 justify-center">
//                     {pieData.filter((p) => p.value > 0).map((p, i) => (
//                       <motion.div key={p.name} whileHover={{ scale: 1.04 }}>
//                         <Badge variant="outline" className="flex items-center gap-2">
//                           <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
//                           {p.name} ({p.value})
//                         </Badge>
//                       </motion.div>
//                     ))}
//                   </div>
//                 </motion.div>
//               ) : (
//                 <p className="text-gray-500 text-center py-8">No deal distribution data available</p>
//               )}
//             </CardContent>
//           </Card>
//         </motion.div>
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;




// import React, { useEffect, useState, useCallback, useRef } from "react";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
//   CardDescription,
// } from "../components/ui/card";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
//   PieChart,
//   Pie,
//   Cell,
//   AreaChart,
//   Area,
//   LineChart,
//   Line,
//   CartesianGrid,
// } from "recharts";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "../components/ui/select";
// import { Skeleton } from "../components/ui/skeleton";
// import { Badge } from "../components/ui/badge";
// import {
//   Users,
//   Trophy,
//   DollarSign,
//   FileText,
//   TrendingUp,
//   Zap,
//   Calendar,
// } from "lucide-react";
// import axios from "axios";
// import { cn } from "../lib/utils";
// import { motion } from "framer-motion";
// import CountUp from "react-countup";
// import confetti from "canvas-confetti";

// /* ---------- Helpers ---------- */
// const formatDate = (d) => {
//   const yyyy = d.getFullYear();
//   const mm = String(d.getMonth() + 1).padStart(2, "0");
//   const dd = String(d.getDate()).padStart(2, "0");
//   return `${yyyy}-${mm}-${dd}`;
// };

// const todayRange = () => {
//   const now = new Date();
//   return { start: formatDate(now), end: formatDate(now) };
// };

// const lastNDaysRange = (n, refDate = new Date()) => {
//   const end = new Date(refDate);
//   const start = new Date(refDate);
//   start.setDate(end.getDate() - (n - 1));
//   return { start: formatDate(start), end: formatDate(end) };
// };

// const months = [
//   { label: "January", value: 0 },
//   { label: "February", value: 1 },
//   { label: "March", value: 2 },
//   { label: "April", value: 3 },
//   { label: "May", value: 4 },
//   { label: "June", value: 5 },
//   { label: "July", value: 6 },
//   { label: "August", value: 7 },
//   { label: "September", value: 8 },
//   { label: "October", value: 9 },
//   { label: "November", value: 10 },
//   { label: "December", value: 11 },
// ];

// const years = [
//   { label: "2023", value: 2023 },
//   { label: "2024", value: 2024 },
//   { label: "2025", value: 2025 },
// ];

// const previousRangeFor = (preset, selectedMonth = new Date().getMonth()) => {
//   const now = new Date();
//   if (preset === "today") {
//     const prev = new Date(now);
//     prev.setDate(now.getDate() - 1);
//     return { start: formatDate(prev), end: formatDate(prev) };
//   } else if (preset === "7days") {
//     const end = new Date();
//     end.setDate(end.getDate() - 7);
//     const start = new Date();
//     start.setDate(start.getDate() - 13); // previous 7-day block
//     return { start: formatDate(start), end: formatDate(end) };
//   } else if (preset === "month") {
//     const year = now.getFullYear();
//     const thisMonth = new Date(year, selectedMonth, 1);
//     const prevMonth = new Date(thisMonth);
//     prevMonth.setMonth(thisMonth.getMonth() - 1);
//     const prevStart = new Date(prevMonth.getFullYear(), prevMonth.getMonth(), 1);
//     const prevEnd = new Date(prevMonth.getFullYear(), prevMonth.getMonth() + 1, 0);
//     return { start: formatDate(prevStart), end: formatDate(prevEnd) };
//   }
//   return todayRange();
// };

// /* Debounce helper */
// const useDebouncedCallback = (fn, delay = 400) => {
//   const timer = useRef(null);
//   const call = useCallback(
//     (...args) => {
//       if (timer.current) clearTimeout(timer.current);
//       timer.current = setTimeout(() => fn(...args), delay);
//     },
//     [fn, delay]
//   );
//   useEffect(() => () => timer.current && clearTimeout(timer.current), []);
//   return call;
// };

// const BASE_COLORS = ["#8B5CF6", "#3B82F6", "#60A5FA", "#A78BFA", "#7C3AED"];
// const STATUS_COLORS = {
//   paid: "#8B5CF6",
//   unpaid: "#3B82F6",
//   pending: "#60A5FA",
//   overdue: "#A78BFA",
// };

// /* ---------- Card Bubbles overlay (per-card animated micro-bubbles) ---------- */
// const CardBubbles = ({ seed = 0, count = 6 }) => {
//   // micro animated bubbles inside each card to create "live-floating" feel
//   const arr = Array.from({ length: count });
//   return (
//     <div className="absolute inset-0 pointer-events-none -z-0">
//       {arr.map((_, i) => {
//         const size = 8 + ((i + seed) % 5) * 6;
//         const top = `${(i * 17 + (seed * 11)) % 100}%`;
//         const left = `${(i * 31 + (seed * 7)) % 100}%`;
//         const delay = (i % 3) * 0.3;
//         const color = BASE_COLORS[(i + seed) % BASE_COLORS.length] + "33";
//         return (
//           <motion.div
//             key={i}
//             initial={{ opacity: 0 }}
//             animate={{ y: [-6, 6, -6], opacity: [0.06, 0.18, 0.06], x: [0, (i % 2 === 0 ? 6 : -6), 0], scale: [0.95, 1.05, 0.95] }}
//             transition={{ repeat: Infinity, duration: 4 + (i % 4), delay }}
//             style={{
//               position: "absolute",
//               width: size,
//               height: size,
//               top,
//               left,
//               borderRadius: "9999px",
//               background: `radial-gradient(circle, ${color}, transparent)`,
//               filter: "blur(2px)",
//             }}
//           />
//         );
//       })}
//     </div>
//   );
// };

// /* Animated number (CountUp wrapper) */
// const AnimatedNumber = ({ value, prefix = "", decimals = 0, duration = 0.9 }) => (
//   <CountUp
//     end={Number(value) || 0}
//     duration={duration}
//     decimals={decimals}
//     prefix={prefix}
//     separator=","
//     className="text-3xl font-bold text-gray-900"
//   />
// );

// /* ---------- Component ---------- */
// const AdminDashboard = () => {
//   const [summary, setSummary] = useState([]); // each item: {title, value, color, icon, change}
//   const [pipeline, setPipeline] = useState([]);
//   const [recentInvoices, setRecentInvoices] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const [dealsData, setDealsData] = useState([]);
//   const [totalDeals, setTotalDeals] = useState(0);
//   const [statusCounts, setStatusCounts] = useState({ open: 0, won: 0, lost: 0 });

//   const [activePreset, setActivePreset] = useState("today"); // today, 7days, month, year
//   const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
//   const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

//   // realtime displayed revenue (animated toward actual)
//   const [displayedRevenue, setDisplayedRevenue] = useState(0);

//   // pie animation: rotating colors for more lively effect
//   const [pieColors, setPieColors] = useState(["#8B5CF6", "#3B82F6", "#60A5FA"]);
//   const pieColorIndex = useRef(0);

//   // active slice on hover (grows slightly)
//   const [activeSlice, setActiveSlice] = useState(-1);

//   // refresh interval ms (60 seconds)
//   const REFRESH_MS = 60_000;

//   /* ---------- Ranges ---------- */
//   const getMonthRange = (monthIndex, year) => {
//     const start = new Date(year, monthIndex, 1);
//     const end = new Date(year, monthIndex + 1, 0);
//     return { start: formatDate(start), end: formatDate(end) };
//   };

//   const getYearRange = (year) => {
//     const start = new Date(year, 0, 1);
//     const end = new Date(year, 11, 31);
//     return { start: formatDate(start), end: formatDate(end) };
//   };

//   const applyMonthFilter = (monthIndex) => {
//     setSelectedMonth(monthIndex);
//     const range = getMonthRange(monthIndex, selectedYear);
//     debouncedFetch(range);
//   };

//   const applyYearFilter = (year) => {
//     setSelectedYear(year);
//     if (activePreset === "year") {
//       const range = getYearRange(year);
//       debouncedFetch(range);
//     }
//   };

//   /* ---------- Fetch helpers ---------- */
//   const buildParams = (range) => ({ start: range.start, end: range.end });

//   const computeChange = (current = 0, previous = 0) => {
//     if (!previous || previous === 0) {
//       return previous === 0 && current === 0 ? 0 : 100; // if prev 0 && current >0 show 100% uptick
//     }
//     const diff = current - previous;
//     return Number(((diff / Math.abs(previous)) * 100).toFixed(1));
//   };

//   /* ---------- Main Fetch (current + previous for change) ---------- */
//   const fetchAll = async (params, preset = "today", selMonth = selectedMonth) => {
//     setLoading(true);
//     setError(null);
//     try {
//       const token = localStorage.getItem("token");

//       // current data
//       const [resSummary, resPipeline, resInvoices] = await Promise.all([
//         axios.get("http://localhost:5000/api/dashboard/summary", {
//           params,
//           headers: { Authorization: `Bearer ${token}` },
//         }),
//         axios.get("http://localhost:5000/api/dashboard/pipeline", {
//           params,
//           headers: { Authorization: `Bearer ${token}` },
//         }),
//         axios.get("http://localhost:5000/api/invoice/recent", {
//           params,
//           headers: { Authorization: `Bearer ${token}` },
//         }),
//       ]);

//       const prevRange = previousRangeFor(preset, selMonth);
//       const prevParams = buildParams(prevRange);

//       const resPrevSummary = await axios.get("http://localhost:5000/api/dashboard/summary", {
//         params: prevParams,
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       const curr = resSummary.data || {};
//       const prev = resPrevSummary.data || {};

//       const summaryCards = [
//         {
//           title: "Total Leads",
//           value: curr.totalLeads || 0,
//           change: computeChange(curr.totalLeads || 0, prev.totalLeads || 0),
//           color: "blue",
//           icon: <Users className="h-5 w-5" />,
//         },
//         {
//           title: "Deals Won",
//           value: curr.totalDealsWon || 0,
//           change: computeChange(curr.totalDealsWon || 0, prev.totalDealsWon || 0),
//           color: "purple",
//           icon: <Trophy className="h-5 w-5" />,
//         },
//         {
//           title: "Revenue",
//           value: curr.totalRevenue || 0,
//           change: computeChange(curr.totalRevenue || 0, prev.totalRevenue || 0),
//           color: "indigo",
//           icon: <DollarSign className="h-5 w-5" />,
//         },
//         {
//           title: "Pending Invoices",
//           value: curr.pendingInvoices || 0,
//           change: computeChange(curr.pendingInvoices || 0, prev.pendingInvoices || 0),
//           color: "violet",
//           icon: <FileText className="h-5 w-5" />,
//         },
//       ];

//       setSummary(summaryCards);
//       setPipeline(resPipeline.data || []);
//       setRecentInvoices(resInvoices.data || []);

//       // set target for animated revenue
//       const incomingRevenue = curr.totalRevenue || 0;
//       // animate displayed revenue slowly towards incomingRevenue
//       animateDisplayedRevenue(incomingRevenue);

//       // confetti for milestone (subtle)
//       if ((curr.totalDealsWon || 0) > 5 && computeChange(curr.totalDealsWon || 0, prev.totalDealsWon || 0) > 0) {
//         confetti({ particleCount: 140, spread: 90, origin: { y: 0.6 } });
//       }
//     } catch (err) {
//       console.error("Dashboard fetch error:", err);
//       setError("Failed to load dashboard data.");
//     } finally {
//       // small delay so UX feels smooth
//       setTimeout(() => setLoading(false), 200);
//     }
//   };

//   /* ---------- Fetch Deals (for pipeline / charts) ---------- */
//   const fetchDeals = async (params) => {
//     try {
//       const token = localStorage.getItem("token");
//       const res = await axios.get("http://localhost:5000/api/deals/getAll", {
//         params,
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       const deals = res.data || [];
//       const counts = { open: 0, won: 0, lost: 0 };

//       const monthlyData = {};

//       deals.forEach((deal) => {
//         if (deal.stage === "Qualification" || deal.stage === "Open") counts.open += 1;
//         else if (deal.stage === "Closed Won") counts.won += 1;
//         else if (deal.stage === "Closed Lost") counts.lost += 1;

//         const d = new Date(deal.createdAt);
//         const month = d.toLocaleString("default", { month: "short" });
//         if (!monthlyData[month]) monthlyData[month] = { month, open: 0, won: 0, lost: 0, total: 0 };
//         if (deal.stage === "Qualification" || deal.stage === "Open") monthlyData[month].open += 1;
//         else if (deal.stage === "Closed Won") monthlyData[month].won += 1;
//         else if (deal.stage === "Closed Lost") monthlyData[month].lost += 1;
//         monthlyData[month].total += 1;
//       });

//       setTotalDeals(deals.length);
//       setStatusCounts(counts);

//       const full = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"].map((m) => {
//         const found = monthlyData[m];
//         return { month: m, open: found ? found.open : 0, won: found ? found.won : 0, lost: found ? found.lost : 0, total: found ? found.total : 0 };
//       });

//       setDealsData(full);
//     } catch (err) {
//       console.error("Error fetching deals:", err);
//     }
//   };

//   /* ---------- Debounced combined fetch ---------- */
//   const debouncedFetch = useDebouncedCallback((range) => {
//     const params = buildParams(range);
//     fetchAll(params, activePreset, selectedMonth);
//     fetchDeals(params);
//   }, 250);

//   /* ---------- Apply preset (today / 7days / month / year) ---------- */
//   const applyPreset = (preset) => {
//     setActivePreset(preset);
//     let range;
//     if (preset === "today") range = todayRange();
//     else if (preset === "7days") range = lastNDaysRange(7);
//     else if (preset === "month") range = getMonthRange(selectedMonth, selectedYear);
//     else if (preset === "year") range = getYearRange(selectedYear);
//     else range = todayRange();
//     debouncedFetch(range);
//   };

//   /* ---------- Real-time interval (60s) ---------- */
//   useEffect(() => {
//     // initial fetch
//     applyPreset(activePreset);

//     const interval = setInterval(() => {
//       let range;
//       if (activePreset === "month") range = getMonthRange(selectedMonth, selectedYear);
//       else if (activePreset === "7days") range = lastNDaysRange(7);
//       else if (activePreset === "year") range = getYearRange(selectedYear);
//       else range = todayRange();

//       fetchAll(buildParams(range), activePreset, selectedMonth);
//       fetchDeals(buildParams(range));
//     }, REFRESH_MS);

//     return () => clearInterval(interval);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [activePreset, selectedMonth, selectedYear]);

//   /* ---------- Invoice chart building ---------- */
//   const buildRevenueTrend = (invoices, preset) => {
//     if (!invoices || invoices.length === 0) return [];

//     const byMonth = {};
//     invoices.forEach((inv) => {
//       const d = new Date(inv.createdAt);
//       const m = d.toLocaleString("default", { month: "short" });
//       byMonth[m] = (byMonth[m] || 0) + (inv.total || 0);
//     });
    
//     return ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"].map((m) => ({
//       month: m,
//       total: byMonth[m] || 0
//     }));
//   };

//   const invoiceChartData = buildRevenueTrend(recentInvoices, activePreset);

//   /* ---------- Derived chart datasets ---------- */
//   const pipelineBarData = dealsData.map((d) => ({ month: d.month, Open: d.open, Won: d.won }));

//   const pieData = [
//     { name: "Open", value: statusCounts.open },
//     { name: "Won", value: statusCounts.won },
//     { name: "Lost", value: statusCounts.lost },
//   ];

//   const totalPipelineLeads = pipeline.reduce((acc, s) => acc + (s.leads || 0), 0);

//   /* ---------- small Chart tooltip customizer ---------- */
//   const CustomTooltip = ({ active, payload, label }) => {
//     if (!active || !payload || payload.length === 0) return null;
//     return (
//       <div className="bg-white p-2 rounded-md shadow" style={{ minWidth: 140 }}>
//         <div className="text-sm font-medium text-gray-700">{label}</div>
//         {payload.map((p, i) => (
//           <div key={i} className="text-sm text-gray-600 mt-1">
//             <span style={{ display: "inline-block", width: 8, height: 8, background: p.color, marginRight: 8 }} />
//             {p.name}: <strong>{p.value}</strong>
//           </div>
//         ))}
//       </div>
//     );
//   };

//   /* ---------- Animated Pie: rotate colors to create lively transitions ---------- */
//   useEffect(() => {
//     const rotate = () => {
//       pieColorIndex.current = (pieColorIndex.current + 1) % BASE_COLORS.length;
//       const rotated = BASE_COLORS.slice(pieColorIndex.current).concat(BASE_COLORS.slice(0, pieColorIndex.current));
//       setPieColors([rotated[0], rotated[1], rotated[2]]);
//     };
//     const t = setInterval(rotate, 1600); // gentle rotation
//     return () => clearInterval(t);
//   }, []);

//   /* ---------- Revenue realtime smoother animation ---------- */
//   const animateDisplayedRevenue = (target) => {
//     // smoothly animate displayedRevenue towards target value
//     const start = displayedRevenue;
//     const diff = target - start;
//     const duration = Math.min(1200, Math.max(600, Math.abs(diff) * 0.5)); // ms, scale with diff
//     const startTime = performance.now();
//     const step = (now) => {
//       const elapsed = now - startTime;
//       const t = Math.min(1, elapsed / duration);
//       // easeOutCubic
//       const eased = 1 - Math.pow(1 - t, 3);
//       const current = Math.round(start + diff * eased);
//       setDisplayedRevenue(current);
//       if (t < 1) requestAnimationFrame(step);
//     };
//     requestAnimationFrame(step);
//   };

//   useEffect(() => {
//     // whenever recentInvoices change, recalc target revenue and nudge animation
//     const total = (recentInvoices || []).reduce((acc, inv) => acc + (inv.total || 0), 0);
//     // if your backend also sends totalRevenue in summary, fetchAll already animates to that target.
//     animateDisplayedRevenue(total);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [recentInvoices]);

//   /* ---------- UI ---------- */
//   return (
//     <div className="p-6 space-y-6 min-h-screen relative overflow-hidden bg-gradient-to-br from-gray-50 to-blue-50">
//       {/* page-wide subtle bubbles */}
//       <div className="absolute inset-0 -z-20 pointer-events-none">
//         {/* a few large background bubbles (keeps original vibe) */}
//         {[...Array(8)].map((_, i) => (
//           <motion.div
//             key={i}
//             className="absolute rounded-full opacity-10"
//             initial={{ scale: 0.95 }}
//             animate={{ y: [0, (i % 2 === 0 ? -18 : 18), 0], x: [0, (i % 3 === 0 ? 20 : -12), 0] }}
//             transition={{ duration: 8 + (i % 4), repeat: Infinity, ease: "easeInOut", delay: i * 0.3 }}
//             style={{
//               width: 120 + (i * 18),
//               height: 120 + (i * 18),
//               top: `${(i * 13) % 100}%`,
//               left: `${(i * 27) % 100}%`,
//               background: `radial-gradient(circle, ${BASE_COLORS[i % BASE_COLORS.length]}22, transparent)`,
//             }}
//           />
//         ))}
//       </div>

//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative z-10">
//         <div>
//           <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
//             <Zap className="h-8 w-8 text-purple-600" />
//             Dashboard
//           </h1>
//           <p className="text-gray-500">Realtime insights — auto-refresh every 60s</p>
//         </div>

//         <div className="flex items-center gap-2 flex-wrap">
//           <Select value={activePreset} onValueChange={(v) => applyPreset(v)}>
//             <SelectTrigger className="w-[180px]">
//               <SelectValue placeholder="Select period" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="today">Today</SelectItem>
//               <SelectItem value="7days">Last 7 Days</SelectItem>
//               <SelectItem value="month">This Month</SelectItem>
//               <SelectItem value="year">This Year</SelectItem>
//             </SelectContent>
//           </Select>

//           {(activePreset === "month" || activePreset === "year") && (
//             <Select value={String(selectedMonth)} onValueChange={(value) => applyMonthFilter(Number(value))}>
//               <SelectTrigger className="w-[140px]">
//                 <SelectValue placeholder="Select month" />
//               </SelectTrigger>
//               <SelectContent>
//                 {months.map((m) => (
//                   <SelectItem key={m.value} value={String(m.value)}>
//                     {m.label}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           )}

//           {(activePreset === "year") && (
//             <Select value={String(selectedYear)} onValueChange={(value) => applyYearFilter(Number(value))}>
//               <SelectTrigger className="w-[120px]">
//                 <SelectValue placeholder="Select year" />
//               </SelectTrigger>
//               <SelectContent>
//                 {years.map((y) => (
//                   <SelectItem key={y.value} value={String(y.value)}>
//                     {y.label}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           )}
//         </div>
//       </div>

//       {error && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md relative z-10">{error}</motion.div>}

//       {/* Summary cards */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
//         {loading ? (
//           Array.from({ length: 4 }).map((_, i) => (
//             <Card key={i}><CardContent className="p-6"><Skeleton className="h-7 w-24 mb-2" /><Skeleton className="h-10 w-16" /></CardContent></Card>
//           ))
//         ) : (
//           summary.map((card, idx) => (
//             <motion.div
//               key={card.title}
//               initial={{ opacity: 0, y: 12, scale: 0.98 }}
//               animate={{ opacity: 1, y: 0, scale: 1 }}
//               transition={{ delay: idx * 0.05, type: "spring", stiffness: 100, damping: 12 }}
//               whileHover={{ y: -6, boxShadow: "0 15px 40px rgba(2,6,23,0.08)", scale: 1.01 }}
//             >
//               <Card className={cn("overflow-hidden border-0 shadow-lg transition-all duration-300 relative", {
//                 "bg-blue-50": card.color === "blue",
//                 "bg-purple-50": card.color === "purple",
//                 "bg-indigo-50": card.color === "indigo",
//                 "bg-violet-50": card.color === "violet",
//               })}>
//                 {/* card micro-bubbles */}
//                 <CardBubbles seed={idx + 3} count={6} />

//                 <CardContent className="p-6 relative">
//                   <div className="flex justify-between items-start">
//                     <div>
//                       <p className="text-sm font-medium text-gray-600 mb-2">{card.title}</p>
//                       {card.title === "Revenue" ? (
//                         <div className="flex items-baseline gap-2">
//                           <span className="text-sm text-gray-500">₹</span>
//                           <AnimatedNumber value={displayedRevenue || card.value} prefix="" duration={0.9} />
//                         </div>
//                       ) : (
//                         <AnimatedNumber value={card.value} />
//                       )}
//                     </div>
//                     <motion.div
//                       className={cn("p-3 rounded-full", {
//                         "bg-blue-100 text-blue-600": card.color === "blue",
//                         "bg-purple-100 text-purple-600": card.color === "purple",
//                         "bg-indigo-100 text-indigo-600": card.color === "indigo",
//                         "bg-violet-100 text-violet-600": card.color === "violet",
//                       })}
//                       whileHover={{ scale: 1.06 }}
//                     >
//                       {card.icon}
//                     </motion.div>
//                   </div>

//                   {/* realtime percent change */}
//                   <div className="mt-4 flex items-center">
//                     <TrendingUp className={`h-4 w-4 ${card.change >= 0 ? "text-green-500" : "text-red-500"} mr-1`} />
//                     <span className={`text-sm font-medium ${card.change >= 0 ? "text-green-500" : "text-red-500"}`}>
//                       {card.change >= 0 ? `+${card.change}%` : `${card.change}%`}
//                     </span>
//                     <span className="text-sm text-gray-500 ml-2">vs previous period</span>
//                   </div>
//                 </CardContent>
//               </Card>
//             </motion.div>
//           ))
//         )}
//       </div>

//       {/* Pipeline + Revenue */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative z-10">
//         {/* Pipeline */}
//         <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.45 }}>
//           <Card className="shadow-lg border-0 overflow-hidden relative">
//             <CardBubbles seed={11} count={7} />
//             <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
//               <div className="flex justify-between items-center">
//                 <CardTitle className="text-xl text-gray-800">Sales Pipeline</CardTitle>
//                 <Badge variant="outline" className="bg-white animate-pulse">{totalPipelineLeads} Deals</Badge>
//               </div>
//               <CardDescription>Open vs Won — monthly (realtime)</CardDescription>
//             </CardHeader>

//             <CardContent className="pt-6 relative">
//               {loading ? (
//                 <div className="h-64"><Skeleton className="h-64 w-full" /></div>
//               ) : (
//                 <motion.div layout key={activePreset} initial={{ opacity: 0.6 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
//                   <div className="h-72">
//                     <ResponsiveContainer width="100%" height="100%">
//                       <BarChart data={pipelineBarData} margin={{ top: 6, right: 12, left: 0, bottom: 6 }}>
//                         <defs>
//                           <linearGradient id="gOpen" x1="0" x2="0" y1="0" y2="1">
//                             <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.95} />
//                             <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0.18} />
//                           </linearGradient>
//                           <linearGradient id="gWon" x1="0" x2="0" y1="0" y2="1">
//                             <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.95} />
//                             <stop offset="100%" stopColor="#3B82F6" stopOpacity={0.18} />
//                           </linearGradient>
//                         </defs>
//                         <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.06} />
//                         <XAxis dataKey="month" tickLine={false} axisLine={false} />
//                         <YAxis />
//                         <Tooltip content={<CustomTooltip />} />
//                         <Bar dataKey="Open" name="Open" fill="url(#gOpen)" barSize={18} radius={[6,6,0,0]} isAnimationActive />
//                         <Bar dataKey="Won" name="Won" fill="url(#gWon)" barSize={18} radius={[6,6,0,0]} isAnimationActive />
//                       </BarChart>
//                     </ResponsiveContainer>
//                   </div>

//                   <div className="flex gap-3 mt-4 justify-center">
//                     <Badge variant="outline" className="flex items-center gap-2">
//                       <span className="w-2 h-2 rounded-full bg-[#8B5CF6]" />
//                       Open
//                     </Badge>
//                     <Badge variant="outline" className="flex items-center gap-2">
//                       <span className="w-2 h-2 rounded-full bg-[#3B82F6]" />
//                       Won
//                     </Badge>
//                   </div>
//                 </motion.div>
//               )}
//             </CardContent>
//           </Card>
//         </motion.div>

//         {/* Revenue Overview */}
//         <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.45 }}>
//           <Card className="shadow-lg border-0 overflow-hidden relative">
//             <CardBubbles seed={21} count={8} />
//             <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
//               <div className="flex justify-between items-center">
//                 <CardTitle className="text-xl text-gray-800">Revenue Overview</CardTitle>
//                 <div className="flex items-center gap-2">
//                   <Select value={activePreset} onValueChange={(v) => applyPreset(v)}>
//                     <SelectTrigger className="w-[140px]">
//                       <SelectValue placeholder="Range" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="today">Today</SelectItem>
//                       <SelectItem value="7days">Last 7 Days</SelectItem>
//                       <SelectItem value="month">This Month</SelectItem>
//                       <SelectItem value="year">This Year</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>
//               </div>
//               <CardDescription>Realtime revenue (auto-updates)</CardDescription>
//             </CardHeader>

//             <CardContent className="pt-6">
//               {/* Top preface: live calculated revenue and subtle animation */}
//               <div className="flex items-center justify-between mb-4">
//                 <div>
//                   <p className="text-sm text-gray-500">Live Revenue (calculated from recent invoices)</p>
//                   <div className="text-2xl font-semibold flex items-baseline gap-2">
//                     <span className="text-sm text-gray-500">₹</span>
//                     <AnimatedNumber value={displayedRevenue} duration={0.9} />
//                     <motion.span className="ml-3 text-sm text-green-600" initial={{ opacity: 0 }} animate={{ opacity: displayedRevenue > 0 ? 1 : 0 }} transition={{ duration: 0.6 }}>
//                       realtime
//                     </motion.span>
//                   </div>
//                 </div>

//                 <motion.div whileHover={{ rotate: 8 }} className="text-sm text-gray-600 flex items-center gap-2">
//                   <Calendar className="h-5 w-5" />
//                   <span>{activePreset === "today" ? "Today" : activePreset === "7days" ? "Last 7 Days" : activePreset === "month" ? months[selectedMonth].label : `Year ${selectedYear}`}</span>
//                 </motion.div>
//               </div>

//               {loading ? (
//                 <Skeleton className="h-64 w-full" />
//               ) : invoiceChartData.length > 0 ? (
//                 <div className="h-64">
//                   <ResponsiveContainer width="100%" height="100%">
//                     <AreaChart data={invoiceChartData} margin={{ top: 6, right: 20, left: 0, bottom: 6 }}>
//                       <defs>
//                         <linearGradient id="revGrad" x1="0" x2="0" y1="0" y2="1">
//                           <stop offset="0%" stopColor="#A78BFA" stopOpacity={0.95} />
//                           <stop offset="100%" stopColor="#A78BFA" stopOpacity={0.06} />
//                         </linearGradient>
//                       </defs>
//                       <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.06} />
//                       <XAxis dataKey="month" />
//                       <YAxis />
//                       <Tooltip formatter={(v) => [`₹${v.toLocaleString()}`, "Revenue"]} />
//                       <Area
//                         type="monotone"
//                         dataKey="total"
//                         stroke="#8B5CF6"
//                         fill="url(#revGrad)"
//                         isAnimationActive
//                         activeDot={{ r: 6, fill: "#8B5CF6" }}
//                       />
//                     </AreaChart>
//                   </ResponsiveContainer>
//                 </div>
//               ) : (
//                 <p className="text-gray-500 text-center py-8">No revenue data available</p>
//               )}
//             </CardContent>
//           </Card>
//         </motion.div>
//       </div>

//       {/* Deals Performance + Distribution */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative z-10">
//         {/* Deals Performance */}
//         <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
//           <Card className="shadow-lg border-0 overflow-hidden relative">
//             <CardBubbles seed={31} count={6} />
//             <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50">
//               <CardTitle className="text-xl text-gray-800">Deals Performance</CardTitle>
//               <CardDescription>Open vs Won — animated trend</CardDescription>
//             </CardHeader>

//             <CardContent className="pt-6">
//               {loading ? (
//                 <Skeleton className="h-64 w-full" />
//               ) : (
//                 <div className="h-64">
//                   <ResponsiveContainer width="100%" height="100%">
//                     <LineChart data={pipelineBarData} margin={{ top: 6, right: 20, left: 0, bottom: 6 }}>
//                       <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.06} />
//                       <XAxis dataKey="month" />
//                       <YAxis />
//                       <Tooltip formatter={(v) => [v, "Deals"]} />
//                       <Area type="monotone" dataKey="Open" stroke="#8B5CF6" fillOpacity={0.12} fill="#8B5CF6" isAnimationActive />
//                       <Line type="monotone" dataKey="Open" stroke="#8B5CF6" strokeWidth={2} dot={{ r: 3, fill: "#8B5CF6" }} isAnimationActive />
//                       <Area type="monotone" dataKey="Won" stroke="#3B82F6" fillOpacity={0.12} fill="#3B82F6" isAnimationActive />
//                       <Line type="monotone" dataKey="Won" stroke="#3B82F6" strokeWidth={2} dot={{ r: 3, fill: "#3B82F6" }} isAnimationActive />
//                     </LineChart>
//                   </ResponsiveContainer>
//                 </div>
//               )}
//             </CardContent>
//           </Card>
//         </motion.div>

//         {/* Deal Distribution (animated pie) */}
//         <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
//           <Card className="shadow-lg border-0 overflow-hidden relative">
//             <CardBubbles seed={41} count={7} />
//             <CardHeader className="bg-gradient-to-r from-violet-50 to-purple-50">
//               <div className="flex justify-between items-center">
//                 <CardTitle className="text-xl text-gray-800">Deal Distribution</CardTitle>
//                 <Badge variant="outline" className="bg-white">{totalDeals} Total</Badge>
//               </div>
//               <CardDescription>Percentage split — animated</CardDescription>
//             </CardHeader>

//             <CardContent className="pt-6">
//               {loading ? (
//                 <Skeleton className="h-64 w-full rounded-full" />
//               ) : pieData.filter((p) => p.value > 0).length > 0 ? (
//                 <motion.div initial={{ scale: 0.98, opacity: 0.9 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.45 }}>
//                   <div className="h-64">
//                     <ResponsiveContainer width="100%" height="100%">
//                       <PieChart>
//                         <Pie
//                           data={pieData.filter((p) => p.value > 0)}
//                           cx="50%"
//                           cy="50%"
//                           outerRadius={activeSlice >= 0 ? 92 : 80}
//                           innerRadius={36}
//                           dataKey="value"
//                           nameKey="name"
//                           onMouseEnter={(_, index) => setActiveSlice(index)}
//                           onMouseLeave={() => setActiveSlice(-1)}
//                           isAnimationActive
//                           paddingAngle={6}
//                         >
//                           {pieData.filter((p) => p.value > 0).map((entry, idx) => {
//                             const dynamicColor = pieColors[idx % pieColors.length];
//                             const isActive = idx === activeSlice;
//                             return (
//                               <Cell
//                                 key={idx}
//                                 fill={dynamicColor}
//                                 stroke="#fff"
//                                 strokeWidth={2}
//                                 style={{
//                                   transition: "transform 300ms ease, filter 300ms ease",
//                                   transform: isActive ? "scale(1.04)" : "scale(1)",
//                                   filter: isActive ? "drop-shadow(0 6px 18px rgba(99,102,241,0.18))" : "none",
//                                 }}
//                               />
//                             );
//                           })}
//                         </Pie>
//                         <Tooltip formatter={(value) => [`${value} deals`, "Count"]} />
//                       </PieChart>
//                     </ResponsiveContainer>
//                   </div>

//                   <div className="flex gap-3 mt-4 justify-center">
//                     {pieData.filter((p) => p.value > 0).map((p, i) => (
//                       <motion.div key={p.name} whileHover={{ scale: 1.04 }} className="flex items-center gap-2">
//                         <Badge variant="outline" className="flex items-center gap-2">
//                           <span className="w-2 h-2 rounded-full" style={{ background: pieColors[i % pieColors.length] }} />
//                           {p.name} ({p.value})
//                         </Badge>
//                       </motion.div>
//                     ))}
//                   </div>
//                 </motion.div>
//               ) : (
//                 <p className="text-gray-500 text-center py-8">No deal distribution data available</p>
//               )}
//             </CardContent>
//           </Card>
//         </motion.div>
//       </div>

//       {/* closing wow line */}
//       <div className="text-center text-gray-700 mt-4 relative z-10">
//         <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} className="text-sm italic">
//           {/* If a client sees this design — it's a guaranteed "wow" moment. The lively micro-bubbles, subtle motion, realtime revenue pulse and animated charts combine to create an experience that feels modern, premium and impossible to ignore. */}
//         </motion.p>
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;//come perfect...



import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  LineChart,
  Line,
  CartesianGrid,
  Legend,
} from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Skeleton } from "../components/ui/skeleton";
import { Badge } from "../components/ui/badge";
import {
  Users,
  Trophy,
  DollarSign,
  FileText,
  TrendingUp,
  Zap,
  Calendar,
  Sparkles,
  Activity,
  Target,
} from "lucide-react";
import axios from "axios";
import { cn } from "../lib/utils";
import { motion } from "framer-motion";
import CountUp from "react-countup";
import confetti from "canvas-confetti";

/* ---------- Helpers ---------- */
const formatDate = (d) => {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

const todayRange = () => {
  const now = new Date();
  return { start: formatDate(now), end: formatDate(now) };
};

const lastNDaysRange = (n, refDate = new Date()) => {
  const end = new Date(refDate);
  const start = new Date(refDate);
  start.setDate(end.getDate() - (n - 1));
  return { start: formatDate(start), end: formatDate(end) };
};

const months = [
  { label: "January", value: 0 },
  { label: "February", value: 1 },
  { label: "March", value: 2 },
  { label: "April", value: 3 },
  { label: "May", value: 4 },
  { label: "June", value: 5 },
  { label: "July", value: 6 },
  { label: "August", value: 7 },
  { label: "September", value: 8 },
  { label: "October", value: 9 },
  { label: "November", value: 10 },
  { label: "December", value: 11 },
];

const years = [
  { label: "2023", value: 2023 },
  { label: "2024", value: 2024 },
  { label: "2025", value: 2025 },
];

const previousRangeFor = (preset, selectedMonth = new Date().getMonth()) => {
  const now = new Date();
  if (preset === "today") {
    const prev = new Date(now);
    prev.setDate(now.getDate() - 1);
    return { start: formatDate(prev), end: formatDate(prev) };
  } else if (preset === "7days") {
    const end = new Date();
    end.setDate(end.getDate() - 7);
    const start = new Date();
    start.setDate(start.getDate() - 13); // previous 7-day block
    return { start: formatDate(start), end: formatDate(end) };
  } else if (preset === "month") {
    const year = now.getFullYear();
    const thisMonth = new Date(year, selectedMonth, 1);
    const prevMonth = new Date(thisMonth);
    prevMonth.setMonth(thisMonth.getMonth() - 1);
    const prevStart = new Date(prevMonth.getFullYear(), prevMonth.getMonth(), 1);
    const prevEnd = new Date(prevMonth.getFullYear(), prevMonth.getMonth() + 1, 0);
    return { start: formatDate(prevStart), end: formatDate(prevEnd) };
  }
  return todayRange();
};

/* Debounce helper */
const useDebouncedCallback = (fn, delay = 400) => {
  const timer = useRef(null);
  const call = useCallback(
    (...args) => {
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => fn(...args), delay);
    },
    [fn, delay]
  );
  useEffect(() => () => timer.current && clearTimeout(timer.current), []);
  return call;
};

const BASE_COLORS = ["#8B5CF6", "#3B82F6", "#60A5FA", "#A78BFA", "#7C3AED", "#10B981", "#F59E0B", "#EF4444"];
const STATUS_COLORS = {
  paid: "#8B5CF6",
  unpaid: "#3B82F6",
  pending: "#60A5FA",
  overdue: "#A78BFA",
};

/* ---------- Enhanced Card Bubbles overlay ---------- */
const CardBubbles = ({ seed = 0, count = 12, colorPalette = BASE_COLORS }) => {
  const arr = Array.from({ length: count });
  return (
    <div className="absolute inset-0 pointer-events-none -z-0 overflow-hidden">
      {arr.map((_, i) => {
        const size = 6 + ((i + seed) % 8) * 8;
        const top = `${(i * 19 + (seed * 13)) % 100}%`;
        const left = `${(i * 23 + (seed * 7)) % 100}%`;
        const delay = (i % 4) * 0.4;
        const duration = 6 + (i % 5);
        const opacity = 0.05 + ((i % 3) * 0.08);
        const color = colorPalette[(i + seed) % colorPalette.length] + "44";
        
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              y: [-10, 10, -10],
              opacity: [0, opacity, 0],
              x: [0, (i % 2 === 0 ? 8 : -8), 0],
              scale: [0.8, 1.2, 0.8],
              rotate: [0, 180, 360]
            }}
            transition={{
              repeat: Infinity,
              duration: duration,
              delay,
              ease: "easeInOut"
            }}
            style={{
              position: "absolute",
              width: size,
              height: size,
              top,
              left,
              borderRadius: "50%",
              background: `radial-gradient(circle, ${color}, transparent)`,
              filter: "blur(3px)",
            }}
          />
        );
      })}
    </div>
  );
};

/* Animated number (CountUp wrapper) */
const AnimatedNumber = ({ value, prefix = "", decimals = 0, duration = 0.9, className = "" }) => (
  <CountUp
    end={Number(value) || 0}
    duration={duration}
    decimals={decimals}
    prefix={prefix}
    separator=","
    className={cn("text-3xl font-bold text-gray-900", className)}
  />
);

/* Custom animated line for charts */
const AnimatedLine = (props) => {
  const { points, stroke, strokeWidth } = props;
  const [length, setLength] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current) {
      setLength(ref.current.getTotalLength());
    }
  }, [points]);

  return (
    <motion.path
      ref={ref}
      d={points.reduce((acc, point, index) => {
        if (index === 0) return `M ${point.x},${point.y}`;
        return `${acc} L ${point.x},${point.y}`;
      }, "")}
      stroke={stroke}
      strokeWidth={strokeWidth}
      fill="none"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 1.5, ease: "easeOut" }}
      strokeDasharray={length}
      strokeDashoffset={length}
    />
  );
};

/* ---------- Component ---------- */
const AdminDashboard = () => {
  const [summary, setSummary] = useState([]);
  const [pipeline, setPipeline] = useState([]);
  const [recentInvoices, setRecentInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [dealsData, setDealsData] = useState([]);
  const [totalDeals, setTotalDeals] = useState(0);
  const [statusCounts, setStatusCounts] = useState({ open: 0, won: 0, lost: 0 });

  const [activePreset, setActivePreset] = useState("today");
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const [displayedRevenue, setDisplayedRevenue] = useState(0);
  const [pieColors, setPieColors] = useState(["#8B5CF6", "#3B82F6", "#60A5FA"]);
  const [activeSlice, setActiveSlice] = useState(-1);
  const [lineAnimationKey, setLineAnimationKey] = useState(0);

  const pieColorIndex = useRef(0);
  const REFRESH_MS = 60_000;

  /* ---------- Ranges ---------- */
  const getMonthRange = (monthIndex, year) => {
    const start = new Date(year, monthIndex, 1);
    const end = new Date(year, monthIndex + 1, 0);
    return { start: formatDate(start), end: formatDate(end) };
  };

  const getYearRange = (year) => {
    const start = new Date(year, 0, 1);
    const end = new Date(year, 11, 31);
    return { start: formatDate(start), end: formatDate(end) };
  };

  const applyMonthFilter = (monthIndex) => {
    setSelectedMonth(monthIndex);
    const range = getMonthRange(monthIndex, selectedYear);
    debouncedFetch(range);
  };

  const applyYearFilter = (year) => {
    setSelectedYear(year);
    if (activePreset === "year") {
      const range = getYearRange(year);
      debouncedFetch(range);
    }
  };

  /* ---------- Fetch helpers ---------- */
  const buildParams = (range) => ({ start: range.start, end: range.end });

  const computeChange = (current = 0, previous = 0) => {
    if (!previous || previous === 0) {
      return previous === 0 && current === 0 ? 0 : 100;
    }
    const diff = current - previous;
    return Number(((diff / Math.abs(previous)) * 100).toFixed(1));
  };

  /* ---------- Main Fetch ---------- */
  const fetchAll = async (params, preset = "today", selMonth = selectedMonth) => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");

      const [resSummary, resPipeline, resInvoices] = await Promise.all([
        axios.get("http://localhost:5000/api/dashboard/summary", {
          params,
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("http://localhost:5000/api/dashboard/pipeline", {
          params,
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("http://localhost:5000/api/invoice/recent", {
          params,
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const prevRange = previousRangeFor(preset, selMonth);
      const prevParams = buildParams(prevRange);

      const resPrevSummary = await axios.get("http://localhost:5000/api/dashboard/summary", {
        params: prevParams,
        headers: { Authorization: `Bearer ${token}` },
      });

      const curr = resSummary.data || {};
      const prev = resPrevSummary.data || {};

      const summaryCards = [
        {
          title: "Total Leads",
          value: curr.totalLeads || 0,
          change: computeChange(curr.totalLeads || 0, prev.totalLeads || 0),
          color: "blue",
          icon: <Users className="h-5 w-5" />,
          colorPalette: ["#3B82F6", "#60A5FA", "#93C5FD"]
        },
        {
          title: "Deals Won",
          value: curr.totalDealsWon || 0,
          change: computeChange(curr.totalDealsWon || 0, prev.totalDealsWon || 0),
          color: "purple",
          icon: <Trophy className="h-5 w-5" />,
          colorPalette: ["#8B5CF6", "#A78BFA", "#C4B5FD"]
        },
        {
          title: "Revenue",
          value: curr.totalRevenue || 0,
          change: computeChange(curr.totalRevenue || 0, prev.totalRevenue || 0),
          color: "indigo",
          icon: <DollarSign className="h-5 w-5" />,
          colorPalette: ["#6366F1", "#818CF8", "#A5B4FC"]
        },
        {
          title: "Pending Invoices",
          value: curr.pendingInvoices || 0,
          change: computeChange(curr.pendingInvoices || 0, prev.pendingInvoices || 0),
          color: "violet",
          icon: <FileText className="h-5 w-5" />,
          colorPalette: ["#7C3AED", "#8B5CF6", "#A78BFA"]
        },
      ];

      setSummary(summaryCards);
      setPipeline(resPipeline.data || []);
      setRecentInvoices(resInvoices.data || []);

      const incomingRevenue = curr.totalRevenue || 0;
      animateDisplayedRevenue(incomingRevenue);

      if ((curr.totalDealsWon || 0) > 5 && computeChange(curr.totalDealsWon || 0, prev.totalDealsWon || 0) > 0) {
        confetti({ particleCount: 140, spread: 90, origin: { y: 0.6 } });
      }
      
      // Trigger line animation refresh
      setLineAnimationKey(prev => prev + 1);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      setError("Failed to load dashboard data.");
    } finally {
      setTimeout(() => setLoading(false), 200);
    }
  };

  /* ---------- Fetch Deals ---------- */
  const fetchDeals = async (params) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/deals/getAll", {
        params,
        headers: { Authorization: `Bearer ${token}` },
      });

      const deals = res.data || [];
      const counts = { open: 0, won: 0, lost: 0 };

      const monthlyData = {};

      deals.forEach((deal) => {
        if (deal.stage === "Qualification" || deal.stage === "Open") counts.open += 1;
        else if (deal.stage === "Closed Won") counts.won += 1;
        else if (deal.stage === "Closed Lost") counts.lost += 1;

        const d = new Date(deal.createdAt);
        const month = d.toLocaleString("default", { month: "short" });
        if (!monthlyData[month]) monthlyData[month] = { month, open: 0, won: 0, lost: 0, total: 0 };
        if (deal.stage === "Qualification" || deal.stage === "Open") monthlyData[month].open += 1;
        else if (deal.stage === "Closed Won") monthlyData[month].won += 1;
        else if (deal.stage === "Closed Lost") monthlyData[month].lost += 1;
        monthlyData[month].total += 1;
      });

      setTotalDeals(deals.length);
      setStatusCounts(counts);

      const full = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"].map((m) => {
        const found = monthlyData[m];
        return { month: m, open: found ? found.open : 0, won: found ? found.won : 0, lost: found ? found.lost : 0, total: found ? found.total : 0 };
      });

      setDealsData(full);
    } catch (err) {
      console.error("Error fetching deals:", err);
    }
  };

  /* ---------- Debounced combined fetch ---------- */
  const debouncedFetch = useDebouncedCallback((range) => {
    const params = buildParams(range);
    fetchAll(params, activePreset, selectedMonth);
    fetchDeals(params);
  }, 250);

  /* ---------- Apply preset ---------- */
  const applyPreset = (preset) => {
    setActivePreset(preset);
    let range;
    if (preset === "today") range = todayRange();
    else if (preset === "7days") range = lastNDaysRange(7);
    else if (preset === "month") range = getMonthRange(selectedMonth, selectedYear);
    else if (preset === "year") range = getYearRange(selectedYear);
    else range = todayRange();
    debouncedFetch(range);
  };

  /* ---------- Real-time interval ---------- */
  useEffect(() => {
    applyPreset(activePreset);

    const interval = setInterval(() => {
      let range;
      if (activePreset === "month") range = getMonthRange(selectedMonth, selectedYear);
      else if (activePreset === "7days") range = lastNDaysRange(7);
      else if (activePreset === "year") range = getYearRange(selectedYear);
      else range = todayRange();

      fetchAll(buildParams(range), activePreset, selectedMonth);
      fetchDeals(buildParams(range));
    }, REFRESH_MS);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activePreset, selectedMonth, selectedYear]);

  /* ---------- Invoice chart building ---------- */
  const buildRevenueTrend = (invoices, preset) => {
    if (!invoices || invoices.length === 0) return [];

    const byMonth = {};
    invoices.forEach((inv) => {
      const d = new Date(inv.createdAt);
      const m = d.toLocaleString("default", { month: "short" });
      byMonth[m] = (byMonth[m] || 0) + (inv.total || 0);
    });
    
    return ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"].map((m) => ({
      month: m,
      total: byMonth[m] || 0
    }));
  };

  const invoiceChartData = buildRevenueTrend(recentInvoices, activePreset);

  /* ---------- Derived chart datasets ---------- */
  const pipelineBarData = dealsData.map((d) => ({ month: d.month, Open: d.open, Won: d.won }));

  const pieData = [
    { name: "Open", value: statusCounts.open },
    { name: "Won", value: statusCounts.won },
    { name: "Lost", value: statusCounts.lost },
  ];

  const totalPipelineLeads = pipeline.reduce((acc, s) => acc + (s.leads || 0), 0);

  /* ---------- Custom tooltip ---------- */
  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload || payload.length === 0) return null;
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-3 rounded-md shadow-lg border border-gray-200"
        style={{ minWidth: 140 }}
      >
        <div className="text-sm font-medium text-gray-700 mb-1">{label}</div>
        {payload.map((p, i) => (
          <div key={i} className="text-sm text-gray-600 mt-1 flex items-center">
            <span style={{ display: "inline-block", width: 10, height: 10, background: p.color, marginRight: 8, borderRadius: '50%' }} />
            {p.name}: <strong className="ml-1">₹{p.value.toLocaleString()}</strong>
          </div>
        ))}
      </motion.div>
    );
  };

  /* ---------- Animated Pie: rotate colors ---------- */
  useEffect(() => {
    const rotate = () => {
      pieColorIndex.current = (pieColorIndex.current + 1) % BASE_COLORS.length;
      const rotated = BASE_COLORS.slice(pieColorIndex.current).concat(BASE_COLORS.slice(0, pieColorIndex.current));
      setPieColors([rotated[0], rotated[1], rotated[2]]);
    };
    const t = setInterval(rotate, 1600);
    return () => clearInterval(t);
  }, []);

  /* ---------- Revenue realtime smoother animation ---------- */
  const animateDisplayedRevenue = (target) => {
    const start = displayedRevenue;
    const diff = target - start;
    const duration = Math.min(1200, Math.max(600, Math.abs(diff) * 0.5));
    const startTime = performance.now();
    const step = (now) => {
      const elapsed = now - startTime;
      const t = Math.min(1, elapsed / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const current = Math.round(start + diff * eased);
      setDisplayedRevenue(current);
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  useEffect(() => {
    const total = (recentInvoices || []).reduce((acc, inv) => acc + (inv.total || 0), 0);
    animateDisplayedRevenue(total);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recentInvoices]);

  /* ---------- UI ---------- */
  return (
    <div className="p-6 space-y-6 min-h-screen relative overflow-hidden ">
      {/* page-wide subtle bubbles */}
      <div className="absolute inset-0 -z-20 pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full opacity-10"
            initial={{ scale: 0.95 }}
            animate={{
              y: [0, (i % 2 === 0 ? -20 : 20), 0],
              x: [0, (i % 3 === 0 ? 25 : -15), 0],
              rotate: [0, 180, 360]
            }}
            transition={{
              duration: 12 + (i % 6),
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5
            }}
            style={{
              width: 120 + (i * 18),
              height: 120 + (i * 18),
              top: `${(i * 13) % 100}%`,
              left: `${(i * 27) % 100}%`,
              background: `radial-gradient(circle, ${BASE_COLORS[i % BASE_COLORS.length]}22, transparent)`,
            }}
          />
        ))}
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative z-10">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-gray-900 flex items-center gap-3"
          >
            <motion.div
              animate={{ rotate: [0, 15, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            >
              <Zap className="h-8 w-8 text-purple-600" />
            </motion.div>
            Dashboard
          </motion.h1>
          {/* <p className="text-gray-500">Realtime insights — auto-refresh every 60s</p> */}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Select value={activePreset} onValueChange={(v) => applyPreset(v)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="7days">Last 7 Days</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>

          {(activePreset === "month" || activePreset === "year") && (
            <Select value={String(selectedMonth)} onValueChange={(value) => applyMonthFilter(Number(value))}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Select month" />
              </SelectTrigger>
              <SelectContent>
                {months.map((m) => (
                  <SelectItem key={m.value} value={String(m.value)}>
                    {m.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {(activePreset === "year") && (
            <Select value={String(selectedYear)} onValueChange={(value) => applyYearFilter(Number(value))}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent>
                {years.map((y) => (
                  <SelectItem key={y.value} value={String(y.value)}>
                    {y.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </div>

      {error && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md relative z-10">{error}</motion.div>}

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}><CardContent className="p-6"><Skeleton className="h-7 w-24 mb-2" /><Skeleton className="h-10 w-16" /></CardContent></Card>
          ))
        ) : (
          summary.map((card, idx) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: idx * 0.05, type: "spring", stiffness: 100, damping: 12 }}
              whileHover={{ y: -6, boxShadow: "0 15px 40px rgba(2,6,23,0.08)", scale: 1.01 }}
            >
              <Card className={cn("overflow-hidden border-0 shadow-lg transition-all duration-300 relative", {
                "bg-blue-50": card.color === "blue",
                "bg-purple-50": card.color === "purple",
                "bg-indigo-50": card.color === "indigo",
                "bg-violet-50": card.color === "violet",
              })}>
                {/* Enhanced card micro-bubbles with color palette */}
                <CardBubbles seed={idx + 3} count={8} colorPalette={card.colorPalette || BASE_COLORS} />

                <CardContent className="p-6 relative">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-2">{card.title}</p>
                      {card.title === "Revenue" ? (
                        <div className="flex items-baseline gap-2">
                          <span className="text-sm text-gray-500">₹</span>
                          <AnimatedNumber value={displayedRevenue || card.value} prefix="" duration={0.9} />
                        </div>
                      ) : (
                        <AnimatedNumber value={card.value} />
                      )}
                    </div>
                    <motion.div
                      className={cn("p-3 rounded-full", {
                        "bg-blue-100 text-blue-600": card.color === "blue",
                        "bg-purple-100 text-purple-600": card.color === "purple",
                        "bg-indigo-100 text-indigo-600": card.color === "indigo",
                        "bg-violet-100 text-violet-600": card.color === "violet",
                      })}
                      whileHover={{ scale: 1.06, rotate: 5 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {card.icon}
                    </motion.div>
                  </div>

                  <div className="mt-4 flex items-center">
                    <TrendingUp className={`h-4 w-4 ${card.change >= 0 ? "text-green-500" : "text-red-500"} mr-1`} />
                    <span className={`text-sm font-medium ${card.change >= 0 ? "text-green-500" : "text-red-500"}`}>
                      {card.change >= 0 ? `+${card.change}%` : `${card.change}%`}
                    </span>
                    <span className="text-sm text-gray-500 ml-2">vs previous period</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </div>

      {/* Pipeline + Revenue */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative z-10">
        {/* Pipeline */}
        <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.45 }}>
          <Card className="shadow-lg border-0 overflow-hidden relative">
            <CardBubbles seed={11} count={10} colorPalette={["#3B82F6", "#60A5FA", "#93C5FD"]} />
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl text-gray-800">Sales Pipeline</CardTitle>
                <Badge variant="outline" className="bg-white animate-pulse">{totalPipelineLeads} Deals</Badge>
              </div>
              <CardDescription>Open vs Won — monthly (realtime)</CardDescription>
            </CardHeader>

            <CardContent className="pt-6 relative">
              {loading ? (
                <div className="h-64"><Skeleton className="h-64 w-full" /></div>
              ) : (
                <motion.div layout key={activePreset} initial={{ opacity: 0.6 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={pipelineBarData} margin={{ top: 6, right: 12, left: 0, bottom: 6 }}>
                        <defs>
                          <linearGradient id="gOpen" x1="0" x2="0" y1="0" y2="1">
                            <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.95} />
                            <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0.18} />
                          </linearGradient>
                          <linearGradient id="gWon" x1="0" x2="0" y1="0" y2="1">
                            <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.95} />
                            <stop offset="100%" stopColor="#3B82F6" stopOpacity={0.18} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.06} />
                        <XAxis dataKey="month" tickLine={false} axisLine={false} />
                        <YAxis />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar dataKey="Open" name="Open" fill="url(#gOpen)" barSize={18} radius={[6,6,0,0]} isAnimationActive />
                        <Bar dataKey="Won" name="Won" fill="url(#gWon)" barSize={18} radius={[6,6,0,0]} isAnimationActive />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="flex gap-3 mt-4 justify-center">
                    <Badge variant="outline" className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#8B5CF6]" />
                      Open
                    </Badge>
                    <Badge variant="outline" className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#3B82F6]" />
                      Won
                    </Badge>
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Revenue Overview */}
        <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.45 }}>
          <Card className="shadow-lg border-0 overflow-hidden relative">
            <CardBubbles seed={21} count={9} colorPalette={["#8B5CF6", "#A78BFA", "#C4B5FD"]} />
            <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl text-gray-800">Revenue Overview</CardTitle>
                <div className="flex items-center gap-2">
                  <Select value={activePreset} onValueChange={(v) => applyPreset(v)}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="7days">Last 7 Days</SelectItem>
                      <SelectItem value="month">This Month</SelectItem>
                      <SelectItem value="year">This Year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <CardDescription>Realtime revenue (auto-updates)</CardDescription>
            </CardHeader>

            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-500">Live Revenue (calculated from recent invoices)</p>
                  <div className="text-2xl font-semibold flex items-baseline gap-2">
                    <span className="text-sm text-gray-500">₹</span>
                    <AnimatedNumber value={displayedRevenue} duration={0.9} />
                    <motion.span className="ml-3 text-sm text-green-600" initial={{ opacity: 0 }} animate={{ opacity: displayedRevenue > 0 ? 1 : 0 }} transition={{ duration: 0.6 }}>
                      realtime
                    </motion.span>
                  </div>
                </div>

                <motion.div whileHover={{ rotate: 8 }} className="text-sm text-gray-600 flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  <span>{activePreset === "today" ? "Today" : activePreset === "7days" ? "Last 7 Days" : activePreset === "month" ? months[selectedMonth].label : `Year ${selectedYear}`}</span>
                </motion.div>
              </div>

              {loading ? (
                <Skeleton className="h-64 w-full" />
              ) : invoiceChartData.length > 0 ? (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={invoiceChartData} margin={{ top: 6, right: 20, left: 0, bottom: 6 }}>
                      <defs>
                        <linearGradient id="revGrad" x1="0" x2="0" y1="0" y2="1">
                          <stop offset="0%" stopColor="#A78BFA" stopOpacity={0.95} />
                          <stop offset="100%" stopColor="#A78BFA" stopOpacity={0.06} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.06} />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(v) => [`₹${v.toLocaleString()}`, "Revenue"]} />
                      <Area
                        type="monotone"
                        dataKey="total"
                        stroke="#8B5CF6"
                        fill="url(#revGrad)"
                        isAnimationActive
                        activeDot={{
                          r: 6,
                          fill: "#8B5CF6",
                          stroke: "#fff",
                          strokeWidth: 2
                        }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No revenue data available</p>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Deals Performance + Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative z-10">
        {/* Deals Performance - Enhanced Line Chart */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
          <Card className="shadow-lg border-0 overflow-hidden relative">
            <CardBubbles seed={31} count={8} colorPalette={["#3B82F6", "#60A5FA", "#93C5FD"]} />
            <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50">
              <CardTitle className="text-xl text-gray-800">Deals Performance</CardTitle>
              <CardDescription>Open vs Won — animated trend</CardDescription>
            </CardHeader>

            <CardContent className="pt-6">
              {loading ? (
                <Skeleton className="h-64 w-full" />
              ) : (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      key={lineAnimationKey}
                      data={pipelineBarData}
                      margin={{ top: 6, right: 20, left: 0, bottom: 6 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.06} />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(v) => [v, "Deals"]} />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="Open"
                        stroke="#8B5CF6"
                        strokeWidth={3}
                        dot={{
                          r: 4,
                          fill: "#8B5CF6",
                          strokeWidth: 2,
                          stroke: "#fff"
                        }}
                        activeDot={{
                          r: 6,
                          fill: "#8B5CF6",
                          stroke: "#fff",
                          strokeWidth: 2
                        }}
                        isAnimationActive={true}
                        animationDuration={1500}
                        animationEasing="ease-out"
                      />
                      <Line
                        type="monotone"
                        dataKey="Won"
                        stroke="#3B82F6"
                        strokeWidth={3}
                        strokeDasharray="4 4"
                        dot={{
                          r: 4,
                          fill: "#3B82F6",
                          strokeWidth: 2,
                          stroke: "#fff"
                        }}
                        activeDot={{
                          r: 6,
                          fill: "#3B82F6",
                          stroke: "#fff",
                          strokeWidth: 2
                        }}
                        isAnimationActive={true}
                        animationDuration={1500}
                        animationEasing="ease-out"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Deal Distribution (animated pie) */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
          <Card className="shadow-lg border-0 overflow-hidden relative">
            <CardBubbles seed={41} count={10} colorPalette={["#8B5CF6", "#A78BFA", "#C4B5FD"]} />
            <CardHeader className="bg-gradient-to-r from-violet-50 to-purple-50">
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl text-gray-800">Deal Distribution</CardTitle>
                <Badge variant="outline" className="bg-white">{totalDeals} Total</Badge>
              </div>
              <CardDescription>Percentage split — animated</CardDescription>
            </CardHeader>

            <CardContent className="pt-6">
              {loading ? (
                <Skeleton className="h-64 w-full rounded-full" />
              ) : pieData.filter((p) => p.value > 0).length > 0 ? (
                <motion.div initial={{ scale: 0.98, opacity: 0.9 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.45 }}>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData.filter((p) => p.value > 0)}
                          cx="50%"
                          cy="50%"
                          outerRadius={activeSlice >= 0 ? 92 : 80}
                          innerRadius={36}
                          dataKey="value"
                          nameKey="name"
                          onMouseEnter={(_, index) => setActiveSlice(index)}
                          onMouseLeave={() => setActiveSlice(-1)}
                          isAnimationActive
                          animationDuration={800}
                          paddingAngle={6}
                        >
                          {pieData.filter((p) => p.value > 0).map((entry, idx) => {
                            const dynamicColor = pieColors[idx % pieColors.length];
                            const isActive = idx === activeSlice;
                            return (
                              <Cell
                                key={idx}
                                fill={dynamicColor}
                                stroke="#fff"
                                strokeWidth={2}
                                style={{
                                  transition: "transform 300ms ease, filter 300ms ease",
                                  transform: isActive ? "scale(1.04)" : "scale(1)",
                                  filter: isActive ? "drop-shadow(0 6px 18px rgba(99,102,241,0.18))" : "none",
                                }}
                              />
                            );
                          })}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value} deals`, "Count"]} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="flex gap-3 mt-4 justify-center flex-wrap">
                    {pieData.filter((p) => p.value > 0).map((p, i) => (
                      <motion.div
                        key={p.name}
                        whileHover={{ scale: 1.04 }}
                        className="flex items-center gap-2 mb-2"
                      >
                        <Badge variant="outline" className="flex items-center gap-2 bg-white">
                          <span className="w-2 h-2 rounded-full" style={{ background: pieColors[i % pieColors.length] }} />
                          {p.name} ({p.value})
                        </Badge>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ) : (
                <p className="text-gray-500 text-center py-8">No deal distribution data available</p>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* closing wow line */}
      <div className="text-center text-gray-700 mt-4 relative z-10">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-sm italic flex items-center justify-center gap-2"
        >
          <Sparkles className="h-4 w-4 text-purple-500" />
          {/* Real-time analytics with beautiful animations */}
          <Sparkles className="h-4 w-4 text-purple-500" />
        </motion.p>
      </div>
    </div>
  );
};

export default AdminDashboard;//all perfect..



