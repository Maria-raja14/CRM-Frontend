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

// const yearRange = () => {
//   const now = new Date();
//   const start = new Date(now.getFullYear(), 0, 1);
//   const end = new Date(now.getFullYear(), 11, 31);
//   return { start: formatDate(start), end: formatDate(end) };
// };

// /* debounce helper */
// const useDebouncedCallback = (fn, delay = 400) => {
//   const timer = useRef(null);
//   const call = useCallback(
//     (...args) => {
//       if (timer.current) clearTimeout(timer.current);
//       timer.current = setTimeout(() => {
//         fn(...args);
//       }, delay);
//     },
//     [fn, delay]
//   );
//   useEffect(() => {
//     return () => {
//       if (timer.current) clearTimeout(timer.current);
//     };
//   }, []);
//   return call;
// };

// const COLORS = ["#3B82F6", "#10B981", "#EF4444", "#8B5CF6"]; // Blue, Green, Red, Purple

// /* ---------- Component ---------- */
// const AdminDashboard = () => {
//   const [summary, setSummary] = useState([]);
//   const [pipeline, setPipeline] = useState([]);
//   const [recentInvoices, setRecentInvoices] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const [startDate, setStartDate] = useState(() => {
//     const range = yearRange(); // default full year
//     return range.start;
//   });
//   const [endDate, setEndDate] = useState(() => {
//     const range = yearRange(); // default full year
//     return range.end;
//   });

//   const [activePreset, setActivePreset] = useState("custom");
//   const [error, setError] = useState(null);
//   const [dealsData, setDealsData] = useState([]);
//   const [totalDeals, setTotalDeals] = useState(0);
//   const [statusCounts, setStatusCounts] = useState({
//     open: 0,
//     won: 0,
//     lost: 0,
//   });

//   /* ---------- Fetch Deals ---------- */
//   const fetchDeals = async (params) => {
//     try {
//       const res = await axios.get("http://localhost:5000/api/deals/getAll", {
//         params,
//       });

//       const deals = res.data || [];
//       const counts = { open: 0, won: 0, lost: 0 };

//       deals.forEach((deal) => {
//         if (deal.stage === "Qualification" || deal.stage === "Open") {
//           counts.open += 1;
//         } else if (deal.stage === "Closed Won") {
//           counts.won += 1;
//         } else if (deal.stage === "Closed Lost") {
//           counts.lost += 1;
//         }
//       });

//       setTotalDeals(deals.length);
//       setStatusCounts(counts);

//       // group by month
//       const monthlyData = {};
//       deals.forEach((deal) => {
//         const month = new Date(deal.createdAt).toLocaleString("default", {
//           month: "short",
//         });
//         if (!monthlyData[month]) {
//           monthlyData[month] = { month, open: 0, won: 0, lost: 0, total: 0 };
//         }
//         if (deal.stage === "Qualification" || deal.stage === "Open") {
//           monthlyData[month].open += 1;
//         } else if (deal.stage === "Closed Won") {
//           monthlyData[month].won += 1;
//         } else if (deal.stage === "Closed Lost") {
//           monthlyData[month].lost += 1;
//         }
//         monthlyData[month].total += 1;
//       });

//       setDealsData(Object.values(monthlyData));
//     } catch (err) {
//       console.error("Error fetching deals:", err);
//     }
//   };

//   /* ---------- Fetch Dashboard Data ---------- */
//   const buildParams = (s, e) => {
//     const p = {};
//     if (s) p.start = s;
//     if (e) p.end = e;
//     return p;
//   };

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
//           color: "bg-blue-500",
//         },
//         {
//           title: "Deals Won",
//           value: resSummary.data.totalDealsWon,
//           color: "bg-green-500",
//         },
//         {
//           title: "Revenue",
//           value: `₹${resSummary.data.totalRevenue}`,
//           color: "bg-purple-500",
//         },
//         {
//           title: "Pending Invoices",
//           value: resSummary.data.pendingInvoices,
//           color: "bg-orange-500",
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

//   /* ---------- Debounced Fetch (summary + deals) ---------- */
//   const debouncedFetch = useDebouncedCallback((params) => {
//     fetchAll(params);
//     fetchDeals(params);
//   }, 300);

//   /* ---------- Filters ---------- */
//   const applyPreset = (preset) => {
//     setActivePreset(preset);
//     let range;
//     if (preset === "today") range = todayRange();
//     else if (preset === "7days") range = lastNDaysRange(7);
//     else return;

//     setStartDate(range.start);
//     setEndDate(range.end);
//     const params = buildParams(range.start, range.end);
//     debouncedFetch(params);
//   };

//   const applyCustomRange = () => {
//     if (!startDate || !endDate) {
//       setError("Start and End date are required.");
//       return;
//     }
//     if (new Date(startDate) > new Date(endDate)) {
//       setError("Start date cannot be after End date.");
//       return;
//     }
//     setError(null);
//     setActivePreset("custom");
//     const params = buildParams(startDate, endDate);
//     debouncedFetch(params);
//   };

//   const clearFilters = () => {
//     const range = yearRange(); // full year
//     setStartDate(range.start);
//     setEndDate(range.end);
//     setActivePreset("custom");
//     const params = buildParams(range.start, range.end);
//     debouncedFetch(params);
//   };

//   /* ---------- Initial Fetch ---------- */
//   useEffect(() => {
//     const range = { start: startDate, end: endDate };
//     const params = buildParams(range.start, range.end);
//     fetchAll(params);
//     fetchDeals(params);
//   }, []); // eslint-disable-line react-hooks/exhaustive-deps

//   /* ---------- Invoice Chart Data ---------- */
//   const groupedInvoices = recentInvoices.reduce((acc, inv) => {
//     acc[inv.status] = (acc[inv.status] || 0) + (inv.total || 0);
//     return acc;
//   }, {});
//   const invoiceChartData = Object.entries(groupedInvoices).map(
//     ([status, total]) => ({
//       status,
//       total,
//     })
//   );

//   const pieData = [
//     { name: `Open ${statusCounts.open}`, value: statusCounts.open },
//     { name: `Won ${statusCounts.won}`, value: statusCounts.won },
//     { name: `Lost ${statusCounts.lost}`, value: statusCounts.lost },
//   ];
//   const months = [
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
//   ];

//   // Merge dealsData with full months
//   const mergedDealsData = months.map((m) => {
//     const found = dealsData.find((d) => d.month === m);
//     return {
//       month: m,
//       open: found ? found.open : 0,
//       won: found ? found.won : 0,
//       lost: found ? found.lost : 0,
//       total: found ? found.total : 0,
//     };
//   });

//   if (loading) {
//     return (
//       <div className="p-6 text-center text-gray-600">Loading Dashboard...</div>
//     );
//   }

//   return (
//     <div className="p-6 space-y-6  min-h-screen">
//       {/* Filter Controls */}
//       <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//         <div className="flex items-center gap-2 flex-wrap">
//           {["today", "7days"].map((preset) => (
//             <button
//               key={preset}
//               onClick={() => applyPreset(preset)}
//               className={`px-3 py-1 rounded-md text-sm font-medium ${
//                 activePreset === preset
//                   ? "bg-indigo-600 text-white"
//                   : "bg-white border"
//               }`}
//             >
//               {preset === "today" ? "Today" : "7 Days"}
//             </button>
//           ))}
//         </div>

//         <div className="flex items-center gap-3">
//           <label className="text-sm text-gray-600">From</label>
//           <input
//             type="date"
//             value={startDate}
//             onChange={(e) => setStartDate(e.target.value)}
//             className="px-3 py-1 border rounded-md bg-white"
//           />
//           <label className="text-sm text-gray-600">To</label>
//           <input
//             type="date"
//             value={endDate}
//             onChange={(e) => setEndDate(e.target.value)}
//             className="px-3 py-1 border rounded-md bg-white"
//           />

//           <button
//             onClick={applyCustomRange}
//             className="px-3 py-1 rounded-md bg-indigo-600 text-white text-sm font-medium"
//           >
//             Apply
//           </button>
//           <button
//             onClick={clearFilters}
//             className="px-3 py-1 rounded-md bg-white border text-sm"
//           >
//             Clear
//           </button>
//         </div>
//       </div>

//       {error && <div className="text-red-600 text-sm">{error}</div>}

//       {/* ---- Summary Cards ---- */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//         {summary.map((card, idx) => (
//           <div
//             key={idx}
//             className={`relative overflow-hidden rounded-2xl p-6 shadow-xl transform transition duration-500 hover:scale-105 ${card.color} text-white`}
//           >
//             <div className="absolute -top-10 -right-10 w-32 h-32 bg-white opacity-20 rounded-full"></div>
//             <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white opacity-20 rounded-full"></div>

//             <CardHeader className="relative z-10">
//               <CardTitle className="text-lg font-semibold tracking-wide">
//                 {card.title}
//               </CardTitle>
//             </CardHeader>
//             <CardContent className="relative z-10 mt-4">
//               <p className="text-4xl font-extrabold">{card.value}</p>
//             </CardContent>
//           </div>
//         ))}
//       </div>

//       {/* ---- Pipeline + Recent Invoices ---- */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         <div className="relative overflow-hidden rounded-2xl shadow-xl bg-white p-6">
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
//                   <defs>
//                     <linearGradient
//                       id="pipelineGradient"
//                       x1="0"
//                       y1="0"
//                       x2="0"
//                       y2="1"
//                     >
//                       <stop offset="0%" stopColor="#6366F1" stopOpacity={0.9} />
//                       <stop
//                         offset="100%"
//                         stopColor="#3B82F6"
//                         stopOpacity={0.9}
//                       />
//                     </linearGradient>
//                   </defs>
//                   <Bar
//                     dataKey="leads" // adjust if backend sends "deals"
//                     fill="url(#pipelineGradient)"
//                     barSize={40}
//                     radius={[8, 8, 0, 0]}
//                     label={{
//                       position: "top",
//                       fill: "#374151",
//                       fontSize: 12,
//                       fontWeight: 600,
//                       formatter: (val) => `${val} Deals`,
//                     }}
//                   />
//                 </BarChart>
//               </ResponsiveContainer>
//             ) : (
//               <p className="text-gray-500 text-center">No pipeline data</p>
//             )}
//           </CardContent>
//         </div>

//         <div className="relative overflow-hidden rounded-2xl shadow-xl bg-white p-6">
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
//                           key={`cell-${index}`}
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

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {/* Deals Overview */}
//         <div className="relative overflow-hidden rounded-2xl shadow-xl bg-white p-6">
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

//         {/* Total Deals */}
//         <div className="relative overflow-hidden rounded-2xl shadow-xl bg-white p-6 flex flex-col items-center">
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
//                     <Cell key={`cell-${index}`} fill={COLORS[index]} />
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

// export default AdminDashboard;
import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
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
  Legend,
  LineChart,
  Line,
} from "recharts";
import axios from "axios";

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

const lastNDaysRange = (n) => {
  const end = new Date();
  const start = new Date();
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

const COLORS = ["#3B82F6", "#10B981", "#EF4444", "#8B5CF6"];

/* ---------- Component ---------- */
const AdminDashboard = () => {
  const [summary, setSummary] = useState([]);
  const [pipeline, setPipeline] = useState([]);
  const [recentInvoices, setRecentInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [dealsData, setDealsData] = useState([]);
  const [totalDeals, setTotalDeals] = useState(0);
  const [statusCounts, setStatusCounts] = useState({
    open: 0,
    won: 0,
    lost: 0,
  });

  const [activePreset, setActivePreset] = useState("today");
  const [showMonthDropdown, setShowMonthDropdown] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());

  /* ---------- Month Range ---------- */
  const getMonthRange = (monthIndex) => {
    const now = new Date();
    const start = new Date(now.getFullYear(), monthIndex, 1);
    const end = new Date(now.getFullYear(), monthIndex + 1, 0);
    return { start: formatDate(start), end: formatDate(end) };
  };

  const applyMonthFilter = (monthIndex) => {
    setSelectedMonth(monthIndex);
    const range = getMonthRange(monthIndex);
    debouncedFetch(range);
  };

  /* ---------- Fetch Deals ---------- */
  const fetchDeals = async (params) => {
    try {
      const res = await axios.get("http://localhost:5000/api/deals/getAll", {
        params,
      });
      const deals = res.data || [];
      const counts = { open: 0, won: 0, lost: 0 };

      deals.forEach((deal) => {
        if (deal.stage === "Qualification" || deal.stage === "Open")
          counts.open += 1;
        else if (deal.stage === "Closed Won") counts.won += 1;
        else if (deal.stage === "Closed Lost") counts.lost += 1;
      });

      setTotalDeals(deals.length);
      setStatusCounts(counts);

      const monthlyData = {};
      deals.forEach((deal) => {
        const month = new Date(deal.createdAt).toLocaleString("default", {
          month: "short",
        });
        if (!monthlyData[month])
          monthlyData[month] = { month, open: 0, won: 0, lost: 0, total: 0 };
        if (deal.stage === "Qualification" || deal.stage === "Open")
          monthlyData[month].open += 1;
        else if (deal.stage === "Closed Won") monthlyData[month].won += 1;
        else if (deal.stage === "Closed Lost") monthlyData[month].lost += 1;
        monthlyData[month].total += 1;
      });

      setDealsData(Object.values(monthlyData));
    } catch (err) {
      console.error("Error fetching deals:", err);
    }
  };

  /* ---------- Fetch Dashboard Data ---------- */
  const buildParams = (range) => ({ start: range.start, end: range.end });

  const fetchAll = async (params) => {
    setLoading(true);
    setError(null);
    try {
      const [resSummary, resPipeline, resInvoices] = await Promise.all([
        axios.get("http://localhost:5000/api/dashboard/summary", { params }),
        axios.get("http://localhost:5000/api/dashboard/pipeline", { params }),
        axios.get("http://localhost:5000/api/invoice/recent", { params }),
      ]);

      setSummary([
        {
          title: "Total Leads",
          value: resSummary.data.totalLeads,
          color: "bg-blue-100",
          textColor: "text-blue-800",
          icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          )
        },
        {
          title: "Deals Won",
          value: resSummary.data.totalDealsWon,
          color: "bg-green-100",
          textColor: "text-green-800",
          icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )
        },
        {
          title: "Revenue",
          value: `₹${resSummary.data.totalRevenue}`,
          color: "bg-purple-100",
          textColor: "text-purple-800",
          icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )
        },
        {
          title: "Pending Invoices",
          value: resSummary.data.pendingInvoices,
          color: "bg-amber-100",
          textColor: "text-amber-800",
          icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          )
        },
      ]);

      setPipeline(resPipeline.data || []);
      setRecentInvoices(resInvoices.data || []);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      setError("Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  const debouncedFetch = useDebouncedCallback((range) => {
    fetchAll(buildParams(range));
    fetchDeals(buildParams(range));
  }, 300);

  /* ---------- Filter Presets ---------- */
  const applyPreset = (preset) => {
    setActivePreset(preset);
    setShowMonthDropdown(preset === "month");
    let range;
    if (preset === "today") range = todayRange();
    else if (preset === "7days") range = lastNDaysRange(7);
    else if (preset === "month") range = getMonthRange(selectedMonth);
    else range = todayRange();

    debouncedFetch(range);
  };

  /* ---------- Initial Fetch ---------- */
  useEffect(() => {
    applyPreset(activePreset);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /* ---------- Invoice Chart Data ---------- */
  const groupedInvoices = recentInvoices.reduce((acc, inv) => {
    acc[inv.status] = (acc[inv.status] || 0) + (inv.total || 0);
    return acc;
  }, {});
  const invoiceChartData = Object.entries(groupedInvoices).map(
    ([status, total]) => ({ status, total })
  );

  const pieData = [
    { name: `Open ${statusCounts.open}`, value: statusCounts.open },
    { name: `Won ${statusCounts.won}`, value: statusCounts.won },
    { name: `Lost ${statusCounts.lost}`, value: statusCounts.lost },
  ];

  const mergedDealsData = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ].map((m) => {
    const found = dealsData.find((d) => d.month === m);
    return {
      month: m,
      open: found ? found.open : 0,
      won: found ? found.won : 0,
      lost: found ? found.lost : 0,
      total: found ? found.total : 0,
    };
  });

  if (loading)
    return (
      <div className="p-6 text-center text-gray-600">Loading Dashboard...</div>
    );

  return (
    <div className="p-6 space-y-6 min-h-screen bg-gray-50">
      {/* Filter Buttons */}
      <div className="flex items-center justify-end gap-2 flex-wrap">
        {["today", "7days", "month"].map((preset) => (
          <div key={preset} className="relative">
            <button
              onClick={() => applyPreset(preset)}
              className={`px-3 py-1 rounded-md text-sm font-medium ${
                activePreset === preset
                  ? "bg-indigo-600 text-white"
                  : "bg-white border"
              }`}
            >
              {preset === "today"
                ? "Today"
                : preset === "7days"
                ? "Last 7 Days"
                : "Month"}
            </button>

            {/* Month Dropdown */}
            {preset === "month" &&
              activePreset === "month" &&
              showMonthDropdown && (
                <div className="absolute mt-1 w-40 bg-white border rounded shadow z-10">
                  {months.map((m) => (
                    <div
                      key={m.value}
                      onClick={() => {
                        applyMonthFilter(m.value);
                        setShowMonthDropdown(false);
                      }}
                      className={`px-3 py-1 cursor-pointer hover:bg-indigo-100 ${
                        selectedMonth === m.value
                          ? "bg-indigo-200 font-semibold"
                          : ""
                      }`}
                    >
                      {m.label}
                    </div>
                  ))}
                </div>
              )}
          </div>
        ))}
      </div>

      {error && <div className="text-red-600 text-sm">{error}</div>}

      {/* ---- Summary Cards ---- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {summary.map((card, idx) => (
          <div
            key={idx}
            className={`relative overflow-hidden rounded-2xl p-6 shadow-md transition-all duration-300 hover:shadow-lg ${card.color}`}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className={`text-sm font-medium ${card.textColor} mb-2`}>
                  {card.title}
                </p>
                <p className={`text-3xl font-bold ${card.textColor}`}>
                  {card.value}
                </p>
              </div>
              <div className={`p-2 rounded-full ${card.textColor} bg-opacity-20`}>
                {card.icon}
              </div>
            </div>
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent to-transparent via-current opacity-20"></div>
          </div>
        ))}
      </div>

      {/* Pipeline + Recent Invoices */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="relative overflow-hidden rounded-2xl shadow-md bg-white p-6">
          <CardHeader>
            <CardTitle className="text-gray-800 text-lg font-semibold">
              Pipeline Board
            </CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            {pipeline.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={pipeline}
                  margin={{ top: 20, right: 20, left: 0, bottom: 20 }}
                >
                  <XAxis
                    dataKey="stage"
                    stroke="#6B7280"
                    tick={{ fontSize: 12, fill: "#374151" }}
                  />
                  <YAxis
                    allowDecimals={false}
                    stroke="#6B7280"
                    tick={{ fontSize: 12, fill: "#374151" }}
                  />
                  <Tooltip
                    cursor={{ fill: "rgba(243,244,246,0.5)" }}
                    contentStyle={{
                      backgroundColor: "white",
                      borderRadius: "12px",
                      border: "1px solid #e5e7eb",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    }}
                    formatter={(value) => [`${value} Deals`, "Deals"]}
                  />
                  <Bar
                    dataKey="leads"
                    fill="#3B82F6"
                    barSize={40}
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-500 text-center">No pipeline data</p>
            )}
          </CardContent>
        </div>

        <div className="relative overflow-hidden rounded-2xl shadow-md bg-white p-6">
          <CardHeader>
            <CardTitle className="text-gray-800 text-lg font-semibold">
              Recent Invoices
            </CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            {invoiceChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={invoiceChartData}
                  margin={{ top: 20, right: 20, left: 0, bottom: 20 }}
                >
                  <XAxis
                    dataKey="status"
                    stroke="#6B7280"
                    tick={{ fontSize: 12, fill: "#374151" }}
                  />
                  <YAxis
                    allowDecimals={false}
                    stroke="#6B7280"
                    tick={{ fontSize: 12, fill: "#374151" }}
                  />
                  <Tooltip
                    formatter={(value, name) => [
                      `₹${value.toLocaleString()}`,
                      name,
                    ]}
                    cursor={{ fill: "rgba(243,244,246,0.5)" }}
                    contentStyle={{
                      backgroundColor: "white",
                      borderRadius: "12px",
                      border: "1px solid #e5e7eb",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    }}
                  />
                  <Bar dataKey="total" barSize={40} radius={[8, 8, 0, 0]}>
                    {invoiceChartData.map((entry, index) => {
                      const colors = {
                        paid: "#34D399",
                        unpaid: "#3B82F6",
                        Pending: "#FBBF24",
                        Overdue: "#EF4444",
                      };
                      return (
                        <Cell
                          key={index}
                          fill={colors[entry.status] || "#6366F1"}
                        />
                      );
                    })}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-500 text-center">No invoice data</p>
            )}
          </CardContent>
        </div>
      </div>

      {/* Deals Overview + Pie */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="relative overflow-hidden rounded-2xl shadow-md bg-white p-6">
          <CardHeader className="flex justify-between items-center">
            <CardTitle className="text-gray-800 text-lg font-semibold">
              Deals Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={mergedDealsData}
                margin={{ top: 20, right: 20, left: 0, bottom: 20 }}
              >
                <XAxis dataKey="month" stroke="#6B7280" />
                <YAxis allowDecimals={false} stroke="#6B7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    borderRadius: "12px",
                    border: "1px solid #e5e7eb",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="open"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  dot
                  name="Open"
                />
                <Line
                  type="monotone"
                  dataKey="won"
                  stroke="#10B981"
                  strokeWidth={2}
                  dot
                  name="Won"
                />
                <Line
                  type="monotone"
                  dataKey="lost"
                  stroke="#EF4444"
                  strokeWidth={2}
                  dot
                  name="Lost"
                />
                <Line
                  type="monotone"
                  dataKey="total"
                  stroke="#8B5CF6"
                  strokeWidth={2}
                  dot
                  name="Total"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </div>

        <div className="relative overflow-hidden rounded-2xl shadow-md bg-white p-6 flex flex-col items-center">
          <CardHeader>
            <CardTitle className="text-gray-800 text-lg font-semibold">
              Total Deals
            </CardTitle>
          </CardHeader>
          <div className="h-72 w-full flex justify-center items-center">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="absolute top-10 right-10 bg-indigo-50 text-indigo-600 font-bold rounded-full px-4 py-2">
            {totalDeals}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;