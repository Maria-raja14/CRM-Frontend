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
//   Legend,
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
//   Sparkles,
//   Activity,
//   Target,
// } from "lucide-react";
// import axios from "axios";
// import { cn } from "../lib/utils";
// import { motion } from "framer-motion";
// import CountUp from "react-countup";
// import confetti from "canvas-confetti";

// const API_URL = import.meta.env.VITE_API_URL;

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
//     const prevStart = new Date(
//       prevMonth.getFullYear(),
//       prevMonth.getMonth(),
//       1
//     );
//     const prevEnd = new Date(
//       prevMonth.getFullYear(),
//       prevMonth.getMonth() + 1,
//       0
//     );
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

// const BASE_COLORS = [
//   "#8B5CF6",
//   "#3B82F6",
//   "#60A5FA",
//   "#A78BFA",
//   "#7C3AED",
//   "#10B981",
//   "#F59E0B",
//   "#EF4444",
// ];
// const STATUS_COLORS = {
//   paid: "#8B5CF6",
//   unpaid: "#3B82F6",
//   pending: "#60A5FA",
//   overdue: "#A78BFA",
// };

// /* ---------- Enhanced Card Bubbles overlay ---------- */
// const CardBubbles = ({ seed = 0, count = 12, colorPalette = BASE_COLORS }) => {
//   const arr = Array.from({ length: count });
//   return (
//     <div className="absolute inset-0 pointer-events-none -z-0 overflow-hidden">
//       {arr.map((_, i) => {
//         const size = 6 + ((i + seed) % 8) * 8;
//         const top = `${(i * 19 + seed * 13) % 100}%`;
//         const left = `${(i * 23 + seed * 7) % 100}%`;
//         const delay = (i % 4) * 0.4;
//         const duration = 6 + (i % 5);
//         const opacity = 0.05 + (i % 3) * 0.08;
//         const color = colorPalette[(i + seed) % colorPalette.length] + "44";

//         return (
//           <motion.div
//             key={i}
//             initial={{ opacity: 0, scale: 0 }}
//             animate={{
//               y: [-10, 10, -10],
//               opacity: [0, opacity, 0],
//               x: [0, i % 2 === 0 ? 8 : -8, 0],
//               scale: [0.8, 1.2, 0.8],
//               rotate: [0, 180, 360],
//             }}
//             transition={{
//               repeat: Infinity,
//               duration: duration,
//               delay,
//               ease: "easeInOut",
//             }}
//             style={{
//               position: "absolute",
//               width: size,
//               height: size,
//               top,
//               left,
//               borderRadius: "50%",
//               background: `radial-gradient(circle, ${color}, transparent)`,
//               filter: "blur(3px)",
//             }}
//           />
//         );
//       })}
//     </div>
//   );
// };

// /* Animated number (CountUp wrapper) */
// const AnimatedNumber = ({
//   value,
//   prefix = "",
//   decimals = 0,
//   duration = 0.9,
//   className = "",
// }) => (
//   <CountUp
//     end={Number(value) || 0}
//     duration={duration}
//     decimals={decimals}
//     prefix={prefix}
//     separator=","
//     className={cn("text-3xl font-bold text-gray-900", className)}
//   />
// );

// /* Custom animated line for charts */
// const AnimatedLine = (props) => {
//   const { points, stroke, strokeWidth } = props;
//   const [length, setLength] = useState(0);
//   const ref = useRef(null);

//   useEffect(() => {
//     if (ref.current) {
//       setLength(ref.current.getTotalLength());
//     }
//   }, [points]);

//   return (
//     <motion.path
//       ref={ref}
//       d={points.reduce((acc, point, index) => {
//         if (index === 0) return `M ${point.x},${point.y}`;
//         return `${acc} L ${point.x},${point.y}`;
//       }, "")}
//       stroke={stroke}
//       strokeWidth={strokeWidth}
//       fill="none"
//       initial={{ pathLength: 0 }}
//       animate={{ pathLength: 1 }}
//       transition={{ duration: 1.5, ease: "easeOut" }}
//       strokeDasharray={length}
//       strokeDashoffset={length}
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
//   const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

//   const [displayedRevenue, setDisplayedRevenue] = useState(0);
//   const [pieColors, setPieColors] = useState(["#8B5CF6", "#3B82F6", "#60A5FA"]);
//   const [activeSlice, setActiveSlice] = useState(-1);
//   const [lineAnimationKey, setLineAnimationKey] = useState(0);

//   const pieColorIndex = useRef(0);
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
//       return previous === 0 && current === 0 ? 0 : 100;
//     }
//     const diff = current - previous;
//     return Number(((diff / Math.abs(previous)) * 100).toFixed(1));
//   };

//   /* ---------- Main Fetch ---------- */
//   const fetchAll = async (
//     params,
//     preset = "today",
//     selMonth = selectedMonth
//   ) => {
//     setLoading(true);
//     setError(null);
//     try {
//       const token = localStorage.getItem("token");

//       const [resSummary, resPipeline, resInvoices] = await Promise.all([
//         axios.get(`${API_URL}/dashboard/summary`, {
//           params,
//           headers: { Authorization: `Bearer ${token}` },
//         }),
//         axios.get(`${API_URL}/dashboard/pipeline`, {
//           params,
//           headers: { Authorization: `Bearer ${token}` },
//         }),
//         axios.get(`${API_URL}/invoice/recent`, {
//           params,
//           headers: { Authorization: `Bearer ${token}` },
//         }),
//       ]);

//       const prevRange = previousRangeFor(preset, selMonth);
//       const prevParams = buildParams(prevRange);

//       const resPrevSummary = await axios.get(`${API_URL}/dashboard/summary`, {
//         params: prevParams,
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       const curr = resSummary.data || {};
//       const prev = resPrevSummary.data || {};

//       // Calculate accurate percentages
//       const totalLeadsChange = computeChange(
//         curr.totalLeads || 0,
//         prev.totalLeads || 0
//       );
//       const totalDealsWonChange = computeChange(
//         curr.totalDealsWon || 0,
//         prev.totalDealsWon || 0
//       );
//       const totalRevenueChange = computeChange(
//         curr.totalRevenue || 0,
//         prev.totalRevenue || 0
//       );
//       const pendingInvoicesChange = computeChange(
//         curr.pendingInvoices || 0,
//         prev.pendingInvoices || 0
//       );

//       const summaryCards = [
//         {
//           title: "Total Leads",
//           value: curr.totalLeads || 0,
//           change: totalLeadsChange,
//           color: "blue",
//           icon: <Users className="h-5 w-5" />,
//           colorPalette: ["#3B82F6", "#60A5FA", "#93C5FD"],
//         },
//         {
//           title: "Deals Won",
//           value: curr.totalDealsWon || 0,
//           change: totalDealsWonChange,
//           color: "purple",
//           icon: <Trophy className="h-5 w-5" />,
//           colorPalette: ["#8B5CF6", "#A78BFA", "#C4B5FD"],
//         },
//         {
//           title: "Revenue",
//           value: curr.totalRevenue || 0,
//           change: totalRevenueChange,
//           color: "indigo",
//           icon: <DollarSign className="h-5 w-5" />,
//           colorPalette: ["#6366F1", "#818CF8", "#A5B4FC"],
//         },
//         {
//           title: "Pending Invoices",
//           value: curr.pendingInvoices || 0,
//           change: pendingInvoicesChange,
//           color: "violet",
//           icon: <FileText className="h-5 w-5" />,
//           colorPalette: ["#7C3AED", "#8B5CF6", "#A78BFA"],
//         },
//       ];

//       setSummary(summaryCards);
//       setPipeline(resPipeline.data || []);
//       setRecentInvoices(resInvoices.data || []);

//       const incomingRevenue = curr.totalRevenue || 0;
//       animateDisplayedRevenue(incomingRevenue);

//       if ((curr.totalDealsWon || 0) > 5 && totalDealsWonChange > 0) {
//         confetti({ particleCount: 140, spread: 90, origin: { y: 0.6 } });
//       }

//       // Trigger line animation refresh
//       setLineAnimationKey((prev) => prev + 1);
//     } catch (err) {
//       console.error("Dashboard fetch error:", err);
//       setError("Failed to load dashboard data.");
//     } finally {
//       setTimeout(() => setLoading(false), 200);
//     }
//   };

//   /* ---------- Fetch Deals ---------- */
//   const fetchDeals = async (params) => {
//     try {
//       const token = localStorage.getItem("token");
//       const res = await axios.get(`${API_URL}/deals/getAll`, {
//         params,
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       const deals = res.data || [];
//       const counts = { open: 0, won: 0, lost: 0 };

//       const monthlyData = {};

//       deals.forEach((deal) => {
//         if (deal.stage === "Qualification" || deal.stage === "Open")
//           counts.open += 1;
//         else if (deal.stage === "Closed Won") counts.won += 1;
//         else if (deal.stage === "Closed Lost") counts.lost += 1;

//         const d = new Date(deal.createdAt);
//         const month = d.toLocaleString("default", { month: "short" });
//         if (!monthlyData[month])
//           monthlyData[month] = { month, open: 0, won: 0, lost: 0, total: 0 };
//         if (deal.stage === "Qualification" || deal.stage === "Open")
//           monthlyData[month].open += 1;
//         else if (deal.stage === "Closed Won") monthlyData[month].won += 1;
//         else if (deal.stage === "Closed Lost") monthlyData[month].lost += 1;
//         monthlyData[month].total += 1;
//       });

//       setTotalDeals(deals.length);
//       setStatusCounts(counts);

//       const full = [
//         "Jan",
//         "Feb",
//         "Mar",
//         "Apr",
//         "May",
//         "Jun",
//         "Jul",
//         "Aug",
//         "Sep",
//         "Oct",
//         "Nov",
//         "Dec",
//       ].map((m) => {
//         const found = monthlyData[m];
//         return {
//           month: m,
//           open: found ? found.open : 0,
//           won: found ? found.won : 0,
//           lost: found ? found.lost : 0,
//           total: found ? found.total : 0,
//         };
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

//   /* ---------- Apply preset ---------- */
//   const applyPreset = (preset) => {
//     setActivePreset(preset);
//     let range;
//     if (preset === "today") range = todayRange();
//     else if (preset === "7days") range = lastNDaysRange(7);
//     else if (preset === "month")
//       range = getMonthRange(selectedMonth, selectedYear);
//     else if (preset === "year") range = getYearRange(selectedYear);
//     else range = todayRange();
//     debouncedFetch(range);
//   };

//   /* ---------- Real-time interval ---------- */
//   useEffect(() => {
//     applyPreset(activePreset);

//     const interval = setInterval(() => {
//       let range;
//       if (activePreset === "month")
//         range = getMonthRange(selectedMonth, selectedYear);
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
//     ].map((m) => ({
//       month: m,
//       total: byMonth[m] || 0,
//     }));
//   };

//   const invoiceChartData = buildRevenueTrend(recentInvoices, activePreset);

//   /* ---------- Derived chart datasets ---------- */
//   const pipelineBarData = dealsData.map((d) => ({
//     month: d.month,
//     Open: d.open,
//     Won: d.won,
//   }));

//   // Calculate percentages for pie chart
//   const calculatePercentages = () => {
//     const total = statusCounts.open + statusCounts.won + statusCounts.lost;
//     if (total === 0) return { open: 0, won: 0, lost: 0 };

//     return {
//       open: Math.round((statusCounts.open / total) * 100),
//       won: Math.round((statusCounts.won / total) * 100),
//       lost: Math.round((statusCounts.lost / total) * 100),
//     };
//   };

//   const percentages = calculatePercentages();

//   const pieData = [
//     { name: "Open", value: statusCounts.open, percentage: percentages.open },
//     { name: "Won", value: statusCounts.won, percentage: percentages.won },
//     { name: "Lost", value: statusCounts.lost, percentage: percentages.lost },
//   ];

//   const totalPipelineLeads = pipeline.reduce(
//     (acc, s) => acc + (s.leads || 0),
//     0
//   );

//   /* ---------- Custom tooltip ---------- */
//   const CustomTooltip = ({ active, payload, label }) => {
//     if (!active || !payload || payload.length === 0) return null;
//     return (
//       <motion.div
//         initial={{ opacity: 0, y: 10 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="bg-white p-3 rounded-md shadow-lg border border-gray-200"
//         style={{ minWidth: 140 }}
//       >
//         <div className="text-sm font-medium text-gray-700 mb-1">{label}</div>
//         {payload.map((p, i) => (
//           <div key={i} className="text-sm text-gray-600 mt-1 flex items-center">
//             <span
//               style={{
//                 display: "inline-block",
//                 width: 10,
//                 height: 10,
//                 background: p.color,
//                 marginRight: 8,
//                 borderRadius: "50%",
//               }}
//             />
//             {p.name}:{" "}
//             <strong className="ml-1">₹{p.value.toLocaleString()}</strong>
//           </div>
//         ))}
//       </motion.div>
//     );
//   };

//   /* ---------- Animated Pie: rotate colors ---------- */
//   useEffect(() => {
//     const rotate = () => {
//       pieColorIndex.current = (pieColorIndex.current + 1) % BASE_COLORS.length;
//       const rotated = BASE_COLORS.slice(pieColorIndex.current).concat(
//         BASE_COLORS.slice(0, pieColorIndex.current)
//       );
//       setPieColors([rotated[0], rotated[1], rotated[2]]);
//     };
//     const t = setInterval(rotate, 1600);
//     return () => clearInterval(t);
//   }, []);

//   /* ---------- Revenue realtime smoother animation ---------- */
//   const animateDisplayedRevenue = (target) => {
//     const start = displayedRevenue;
//     const diff = target - start;
//     const duration = Math.min(1200, Math.max(600, Math.abs(diff) * 0.5));
//     const startTime = performance.now();
//     const step = (now) => {
//       const elapsed = now - startTime;
//       const t = Math.min(1, elapsed / duration);
//       const eased = 1 - Math.pow(1 - t, 3);
//       const current = Math.round(start + diff * eased);
//       setDisplayedRevenue(current);
//       if (t < 1) requestAnimationFrame(step);
//     };
//     requestAnimationFrame(step);
//   };

//   useEffect(() => {
//     const total = (recentInvoices || []).reduce(
//       (acc, inv) => acc + (inv.total || 0),
//       0
//     );
//     animateDisplayedRevenue(total);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [recentInvoices]);

//   /* ---------- UI ---------- */
//   return (
//     <div className="p-6 space-y-6 min-h-screen relative overflow-hidden bg-gradient-to-br from-gray-50 to-indigo-50/30">
//       {/* page-wide subtle bubbles */}
//       <div className="absolute inset-0 -z-20 pointer-events-none">
//         {[...Array(12)].map((_, i) => (
//           <motion.div
//             key={i}
//             className="absolute rounded-full opacity-10"
//             initial={{ scale: 0.95 }}
//             animate={{
//               y: [0, i % 2 === 0 ? -20 : 20, 0],
//               x: [0, i % 3 === 0 ? 25 : -15, 0],
//               rotate: [0, 180, 360],
//             }}
//             transition={{
//               duration: 12 + (i % 6),
//               repeat: Infinity,
//               ease: "easeInOut",
//               delay: i * 0.5,
//             }}
//             style={{
//               width: 120 + i * 18,
//               height: 120 + i * 18,
//               top: `${(i * 13) % 100}%`,
//               left: `${(i * 27) % 100}%`,
//               background: `radial-gradient(circle, ${
//                 BASE_COLORS[i % BASE_COLORS.length]
//               }22, transparent)`,
//             }}
//           />
//         ))}
//       </div>

//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative z-10">
//         <div>
//           <motion.h1
//             initial={{ opacity: 0, y: -10 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="text-3xl font-bold text-gray-900 flex items-center gap-3"
//           >
//             <motion.div
//               animate={{ rotate: [0, 15, 0] }}
//               transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
//             >
//               <Zap className="h-8 w-8 text-purple-600" />
//             </motion.div>
//             Dashboard
//           </motion.h1>
//           {/* <p className="text-gray-500 mt-1">
//             Real-time insights — auto-refresh every 60s
//           </p> */}
//         </div>

//         <div className="flex items-center gap-2 flex-wrap">
//           <Select value={activePreset} onValueChange={(v) => applyPreset(v)}>
//             <SelectTrigger className="w-[180px] bg-white/80 backdrop-blur-sm border-gray-200">
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
//             <Select
//               value={String(selectedMonth)}
//               onValueChange={(value) => applyMonthFilter(Number(value))}
//             >
//               <SelectTrigger className="w-[140px] bg-white/80 backdrop-blur-sm border-gray-200">
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

//           {activePreset === "year" && (
//             <Select
//               value={String(selectedYear)}
//               onValueChange={(value) => applyYearFilter(Number(value))}
//             >
//               <SelectTrigger className="w-[120px] bg-white/80 backdrop-blur-sm border-gray-200">
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

//       {error && (
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md relative z-10"
//         >
//           {error}
//         </motion.div>
//       )}

//       {/* Summary cards */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
//         {loading
//           ? Array.from({ length: 4 }).map((_, i) => (
//               <Card key={i} className="overflow-hidden border-0 shadow-lg">
//                 <CardContent className="p-6">
//                   <Skeleton className="h-7 w-24 mb-2" />
//                   <Skeleton className="h-10 w-16" />
//                 </CardContent>
//               </Card>
//             ))
//           : summary.map((card, idx) => (
//               <motion.div
//                 key={card.title}
//                 initial={{ opacity: 0, y: 12, scale: 0.98 }}
//                 animate={{ opacity: 1, y: 0, scale: 1 }}
//                 transition={{
//                   delay: idx * 0.05,
//                   type: "spring",
//                   stiffness: 100,
//                   damping: 12,
//                 }}
//                 whileHover={{
//                   y: -6,
//                   boxShadow: "0 15px 40px rgba(2,6,23,0.08)",
//                   scale: 1.01,
//                 }}
//               >
//                 <Card
//                   className={cn(
//                     "overflow-hidden border-0 shadow-lg transition-all duration-300 relative",
//                     {
//                       "bg-blue-50": card.color === "blue",
//                       "bg-purple-50": card.color === "purple",
//                       "bg-indigo-50": card.color === "indigo",
//                       "bg-violet-50": card.color === "violet",
//                     }
//                   )}
//                 >
//                   {/* Enhanced card micro-bubbles with color palette */}
//                   <CardBubbles
//                     seed={idx + 3}
//                     count={8}
//                     colorPalette={card.colorPalette || BASE_COLORS}
//                   />

//                   <CardContent className="p-6 relative">
//                     <div className="flex justify-between items-start">
//                       <div>
//                         <p className="text-sm font-medium text-gray-600 mb-2">
//                           {card.title}
//                         </p>
//                         {card.title === "Revenue" ? (
//                           <div className="flex items-baseline gap-2">
//                             <span className="text-sm text-gray-500">₹</span>
//                             <AnimatedNumber
//                               value={displayedRevenue || card.value}
//                               prefix=""
//                               duration={0.9}
//                             />
//                           </div>
//                         ) : (
//                           <AnimatedNumber value={card.value} />
//                         )}
//                       </div>
//                       <motion.div
//                         className={cn("p-3 rounded-full", {
//                           "bg-blue-100 text-blue-600": card.color === "blue",
//                           "bg-purple-100 text-purple-600":
//                             card.color === "purple",
//                           "bg-indigo-100 text-indigo-600":
//                             card.color === "indigo",
//                           "bg-violet-100 text-violet-600":
//                             card.color === "violet",
//                         })}
//                         whileHover={{ scale: 1.06, rotate: 5 }}
//                         whileTap={{ scale: 0.95 }}
//                       >
//                         {card.icon}
//                       </motion.div>
//                     </div>

//                     <div className="mt-4 flex items-center">
//                       <TrendingUp
//                         className={`h-4 w-4 ${
//                           card.change >= 0 ? "text-green-500" : "text-red-500"
//                         } mr-1`}
//                       />
//                       <span
//                         className={`text-sm font-medium ${
//                           card.change >= 0 ? "text-green-500" : "text-red-500"
//                         }`}
//                       >
//                         {card.change >= 0
//                           ? `+${card.change}%`
//                           : `${card.change}%`}
//                       </span>
//                       <span className="text-sm text-gray-500 ml-2">
//                         vs previous period
//                       </span>
//                     </div>
//                   </CardContent>
//                 </Card>
//               </motion.div>
//             ))}
//       </div>

//       {/* Pipeline + Revenue */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative z-10">
//         {/* Pipeline */}
//         <motion.div
//           initial={{ opacity: 0, x: -16 }}
//           animate={{ opacity: 1, x: 0 }}
//           transition={{ duration: 0.45 }}
//           whileHover={{ y: -4 }}
//         >
//           <Card className="shadow-lg border-0 overflow-hidden relative bg-white/80 backdrop-blur-sm">
//             <CardBubbles
//               seed={11}
//               count={10}
//               colorPalette={["#3B82F6", "#60A5FA", "#93C5FD"]}
//             />
//             <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
//               <div className="flex justify-between items-center">
//                 <CardTitle className="text-xl text-gray-800">
//                   Sales Pipeline
//                 </CardTitle>
//                 <Badge
//                   variant="outline"
//                   className="bg-white/80 backdrop-blur-sm animate-pulse"
//                 >
//                   {totalPipelineLeads} Deals
//                 </Badge>
//               </div>
//               <CardDescription>
//                 Open vs Won — monthly (realtime)
//               </CardDescription>
//             </CardHeader>

//             <CardContent className="pt-6 relative">
//               {loading ? (
//                 <div className="h-64">
//                   <Skeleton className="h-64 w-full" />
//                 </div>
//               ) : (
//                 <motion.div
//                   layout
//                   key={activePreset}
//                   initial={{ opacity: 0.6 }}
//                   animate={{ opacity: 1 }}
//                   transition={{ duration: 0.6 }}
//                 >
//                   <div className="h-72">
//                     <ResponsiveContainer width="100%" height="100%">
//                       <BarChart
//                         data={pipelineBarData}
//                         margin={{ top: 6, right: 12, left: 0, bottom: 6 }}
//                       >
//                         <defs>
//                           <linearGradient
//                             id="gOpen"
//                             x1="0"
//                             x2="0"
//                             y1="0"
//                             y2="1"
//                           >
//                             <stop
//                               offset="0%"
//                               stopColor="#8B5CF6"
//                               stopOpacity={0.95}
//                             />
//                             <stop
//                               offset="100%"
//                               stopColor="#8B5CF6"
//                               stopOpacity={0.18}
//                             />
//                           </linearGradient>
//                           <linearGradient id="gWon" x1="0" x2="0" y1="0" y2="1">
//                             <stop
//                               offset="0%"
//                               stopColor="#3B82F6"
//                               stopOpacity={0.95}
//                             />
//                             <stop
//                               offset="100%"
//                               stopColor="#3B82F6"
//                               stopOpacity={0.18}
//                             />
//                           </linearGradient>
//                         </defs>
//                         <CartesianGrid
//                           strokeDasharray="3 3"
//                           vertical={false}
//                           opacity={0.06}
//                         />
//                         <XAxis
//                           dataKey="month"
//                           tickLine={false}
//                           axisLine={false}
//                         />
//                         <YAxis />
//                         <Tooltip content={<CustomTooltip />} />
//                         <Bar
//                           dataKey="Open"
//                           name="Open"
//                           fill="url(#gOpen)"
//                           barSize={18}
//                           radius={[6, 6, 0, 0]}
//                           isAnimationActive
//                         />
//                         <Bar
//                           dataKey="Won"
//                           name="Won"
//                           fill="url(#gWon)"
//                           barSize={18}
//                           radius={[6, 6, 0, 0]}
//                           isAnimationActive
//                         />
//                       </BarChart>
//                     </ResponsiveContainer>
//                   </div>

//                   <div className="flex gap-3 mt-4 justify-center">
//                     <Badge
//                       variant="outline"
//                       className="flex items-center gap-2 bg-white/80 backdrop-blur-sm"
//                     >
//                       <span className="w-2 h-2 rounded-full bg-[#8B5CF6]" />
//                       Open
//                     </Badge>
//                     <Badge
//                       variant="outline"
//                       className="flex items-center gap-2 bg-white/80 backdrop-blur-sm"
//                     >
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
//         <motion.div
//           initial={{ opacity: 0, x: 16 }}
//           animate={{ opacity: 1, x: 0 }}
//           transition={{ duration: 0.45 }}
//           whileHover={{ y: -4 }}
//         >
//           <Card className="shadow-lg border-0 overflow-hidden relative bg-white/80 backdrop-blur-sm">
//             <CardBubbles
//               seed={21}
//               count={9}
//               colorPalette={["#8B5CF6", "#A78BFA", "#C4B5FD"]}
//             />
//             <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b border-purple-100">
//               <div className="flex justify-between items-center">
//                 <CardTitle className="text-xl text-gray-800">
//                   Revenue Overview
//                 </CardTitle>
//                 <div className="flex items-center gap-2">
//                   {/* Date selector removed for cleaner UI */}
//                 </div>
//               </div>
//               <CardDescription>Realtime revenue (auto-updates)</CardDescription>
//             </CardHeader>

//             <CardContent className="pt-6">
//               <div className="flex items-center justify-between mb-4">
//                 <div>
//                   <p className="text-sm text-gray-500">
//                     Live Revenue (calculated from recent invoices)
//                   </p>
//                   <div className="text-2xl font-semibold flex items-baseline gap-2">
//                     <span className="text-sm text-gray-500">₹</span>
//                     <AnimatedNumber value={displayedRevenue} duration={0.9} />
//                     <motion.span
//                       className="ml-3 text-sm text-green-600"
//                       initial={{ opacity: 0 }}
//                       animate={{ opacity: displayedRevenue > 0 ? 1 : 0 }}
//                       transition={{ duration: 0.6 }}
//                     >
//                       realtime
//                     </motion.span>
//                   </div>
//                 </div>
//               </div>

//               {loading ? (
//                 <Skeleton className="h-64 w-full" />
//               ) : invoiceChartData.length > 0 ? (
//                 <div className="h-64">
//                   <ResponsiveContainer width="100%" height="100%">
//                     <AreaChart
//                       data={invoiceChartData}
//                       margin={{ top: 6, right: 20, left: 0, bottom: 6 }}
//                     >
//                       <defs>
//                         <linearGradient
//                           id="revGrad"
//                           x1="0"
//                           x2="0"
//                           y1="0"
//                           y2="1"
//                         >
//                           <stop
//                             offset="0%"
//                             stopColor="#A78BFA"
//                             stopOpacity={0.95}
//                           />
//                           <stop
//                             offset="100%"
//                             stopColor="#A78BFA"
//                             stopOpacity={0.06}
//                           />
//                         </linearGradient>
//                       </defs>
//                       <CartesianGrid
//                         strokeDasharray="3 3"
//                         vertical={false}
//                         opacity={0.06}
//                       />
//                       <XAxis dataKey="month" />
//                       <YAxis />
//                       <Tooltip
//                         formatter={(v) => [`₹${v.toLocaleString()}`, "Revenue"]}
//                       />
//                       <Area
//                         type="monotone"
//                         dataKey="total"
//                         stroke="#8B5CF6"
//                         fill="url(#revGrad)"
//                         isAnimationActive
//                         activeDot={{
//                           r: 6,
//                           fill: "#8B5CF6",
//                           stroke: "#fff",
//                           strokeWidth: 2,
//                         }}
//                       />
//                     </AreaChart>
//                   </ResponsiveContainer>
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

//       {/* Deals Performance + Distribution */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative z-10">
//         {/* Deals Performance - Enhanced Line Chart */}
//         <motion.div
//           initial={{ opacity: 0, y: 12 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.45 }}
//           whileHover={{ y: -4 }}
//         >
//           <Card className="shadow-lg border-0 overflow-hidden relative bg-white/80 backdrop-blur-sm">
//             <CardBubbles
//               seed={31}
//               count={8}
//               colorPalette={["#3B82F6", "#60A5FA", "#93C5FD"]}
//             />
//             <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50 border-b border-indigo-100">
//               <CardTitle className="text-xl text-gray-800">
//                 Deals Performance
//               </CardTitle>
//               <CardDescription>Open vs Won — animated trend</CardDescription>
//             </CardHeader>

//             <CardContent className="pt-6">
//               {loading ? (
//                 <Skeleton className="h-64 w-full" />
//               ) : (
//                 <div className="h-64">
//                   <ResponsiveContainer width="100%" height="100%">
//                     <LineChart
//                       key={lineAnimationKey}
//                       data={pipelineBarData}
//                       margin={{ top: 6, right: 20, left: 0, bottom: 6 }}
//                     >
//                       <CartesianGrid
//                         strokeDasharray="3 3"
//                         vertical={false}
//                         opacity={0.06}
//                       />
//                       <XAxis dataKey="month" />
//                       <YAxis />
//                       <Tooltip formatter={(v) => [v, "Deals"]} />
//                       <Legend />
//                       <Line
//                         type="monotone"
//                         dataKey="Open"
//                         stroke="#8B5CF6"
//                         strokeWidth={3}
//                         dot={{
//                           r: 4,
//                           fill: "#8B5CF6",
//                           strokeWidth: 2,
//                           stroke: "#fff",
//                         }}
//                         activeDot={{
//                           r: 6,
//                           fill: "#8B5CF6",
//                           stroke: "#fff",
//                           strokeWidth: 2,
//                         }}
//                         isAnimationActive={true}
//                         animationDuration={1500}
//                         animationEasing="ease-out"
//                       />
//                       <Line
//                         type="monotone"
//                         dataKey="Won"
//                         stroke="#3B82F6"
//                         strokeWidth={3}
//                         strokeDasharray="4 4"
//                         dot={{
//                           r: 4,
//                           fill: "#3B82F6",
//                           strokeWidth: 2,
//                           stroke: "#fff",
//                         }}
//                         activeDot={{
//                           r: 6,
//                           fill: "#3B82F6",
//                           stroke: "#fff",
//                           strokeWidth: 2,
//                         }}
//                         isAnimationActive={true}
//                         animationDuration={1500}
//                         animationEasing="ease-out"
//                       />
//                     </LineChart>
//                   </ResponsiveContainer>
//                 </div>
//               )}
//             </CardContent>
//           </Card>
//         </motion.div>

//         {/* Deal Distribution (animated pie) */}
//         <motion.div
//           initial={{ opacity: 0, y: 12 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.45 }}
//           whileHover={{ y: -4 }}
//         >
//           <Card className="shadow-lg border-0 overflow-hidden relative bg-white/80 backdrop-blur-sm">
//             <CardBubbles
//               seed={41}
//               count={10}
//               colorPalette={["#8B5CF6", "#A78BFA", "#C4B5FD"]}
//             />
//             <CardHeader className="bg-gradient-to-r from-violet-50 to-purple-50 border-b border-violet-100">
//               <div className="flex justify-between items-center">
//                 <CardTitle className="text-xl text-gray-800">
//                   Deal Distribution
//                 </CardTitle>
//                 <Badge
//                   variant="outline"
//                   className="bg-white/80 backdrop-blur-sm"
//                 >
//                   {totalDeals} Total
//                 </Badge>
//               </div>
//               <CardDescription>Percentage split — animated</CardDescription>
//             </CardHeader>

//             <CardContent className="pt-6">
//               {loading ? (
//                 <Skeleton className="h-64 w-full rounded-full" />
//               ) : pieData.filter((p) => p.value > 0).length > 0 ? (
//                 <motion.div
//                   initial={{ scale: 0.98, opacity: 0.9 }}
//                   animate={{ scale: 1, opacity: 1 }}
//                   transition={{ duration: 0.45 }}
//                 >
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
//                           animationDuration={800}
//                           paddingAngle={6}
//                         >
//                           {pieData
//                             .filter((p) => p.value > 0)
//                             .map((entry, idx) => {
//                               const dynamicColor =
//                                 pieColors[idx % pieColors.length];
//                               const isActive = idx === activeSlice;
//                               return (
//                                 <Cell
//                                   key={idx}
//                                   fill={dynamicColor}
//                                   stroke="#fff"
//                                   strokeWidth={2}
//                                   style={{
//                                     transition:
//                                       "transform 300ms ease, filter 300ms ease",
//                                     transform: isActive
//                                       ? "scale(1.04)"
//                                       : "scale(1)",
//                                     filter: isActive
//                                       ? "drop-shadow(0 6px 18px rgba(99,102,241,0.18))"
//                                       : "none",
//                                   }}
//                                 />
//                               );
//                             })}
//                         </Pie>
//                         <Tooltip
//                           formatter={(value, name, props) => {
//                             const percentage = props.payload.percentage;
//                             return [`${value} deals (${percentage}%)`, name];
//                           }}
//                         />
//                       </PieChart>
//                     </ResponsiveContainer>
//                   </div>

//                   <div className="flex gap-3 mt-4 justify-center flex-wrap">
//                     {pieData
//                       .filter((p) => p.value > 0)
//                       .map((p, i) => (
//                         <motion.div
//                           key={p.name}
//                           whileHover={{ scale: 1.04 }}
//                           className="flex items-center gap-2 mb-2"
//                         >
//                           <Badge
//                             variant="outline"
//                             className="flex items-center gap-2 bg-white/80 backdrop-blur-sm"
//                           >
//                             <span
//                               className="w-2 h-2 rounded-full"
//                               style={{
//                                 background: pieColors[i % pieColors.length],
//                               }}
//                             />
//                             {p.name} ({p.value} - {p.percentage}%)
//                           </Badge>
//                         </motion.div>
//                       ))}
//                   </div>
//                 </motion.div>
//               ) : (
//                 <p className="text-gray-500 text-center py-8">
//                   No deal distribution data available
//                 </p>
//               )}
//             </CardContent>
//           </Card>
//         </motion.div>
//       </div>

//       {/* closing wow line */}
//       <div className="text-center text-gray-700 mt-4 relative z-10">
//         <motion.p
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ duration: 0.8 }}
//           className="text-sm italic flex items-center justify-center gap-2"
//         >
//           {/* <Sparkles className="h-4 w-4 text-purple-500" />
//           Real-time analytics with beautiful animations
//           <Sparkles className="h-4 w-4 text-purple-500" /> */}
//         </motion.p>
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard; //original



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

const API_URL = import.meta.env.VITE_API_URL;

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
    const prevStart = new Date(
      prevMonth.getFullYear(),
      prevMonth.getMonth(),
      1
    );
    const prevEnd = new Date(
      prevMonth.getFullYear(),
      prevMonth.getMonth() + 1,
      0
    );
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

const BASE_COLORS = [
  "#8B5CF6",
  "#3B82F6",
  "#60A5FA",
  "#A78BFA",
  "#7C3AED",
  "#10B981",
  "#F59E0B",
  "#EF4444",
];
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
        const top = `${(i * 19 + seed * 13) % 100}%`;
        const left = `${(i * 23 + seed * 7) % 100}%`;
        const delay = (i % 4) * 0.4;
        const duration = 6 + (i % 5);
        const opacity = 0.05 + (i % 3) * 0.08;
        const color = colorPalette[(i + seed) % colorPalette.length] + "44";

        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              y: [-10, 10, -10],
              opacity: [0, opacity, 0],
              x: [0, i % 2 === 0 ? 8 : -8, 0],
              scale: [0.8, 1.2, 0.8],
              rotate: [0, 180, 360],
            }}
            transition={{
              repeat: Infinity,
              duration: duration,
              delay,
              ease: "easeInOut",
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
const AnimatedNumber = ({
  value,
  prefix = "",
  decimals = 0,
  duration = 0.9,
  className = "",
}) => (
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
  const [statusCounts, setStatusCounts] = useState({
    open: 0,
    won: 0,
    lost: 0,
  });

  const [activePreset, setActivePreset] = useState("today");
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const [displayedRevenue, setDisplayedRevenue] = useState(0);
  const [revenueBreakdown, setRevenueBreakdown] = useState({});
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

  /* ---------- Calculate total revenue from currency breakdown ---------- */
  const calculateTotalRevenue = (revenueByCurrency = {}) => {
    return Object.values(revenueByCurrency).reduce((total, amount) => total + amount, 0);
  };

  /* ---------- Format revenue breakdown for display ---------- */
  const formatRevenueBreakdown = (revenueByCurrency = {}) => {
    return Object.entries(revenueByCurrency)
      .filter(([_, amount]) => amount > 0)
      .map(([currency, amount]) => ({
        currency,
        amount,
        formatted: `${currency} ${amount.toLocaleString()}`
      }));
  };

  /* ---------- Main Fetch ---------- */
  const fetchAll = async (
    params,
    preset = "today",
    selMonth = selectedMonth
  ) => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");

      const [resSummary, resPipeline, resInvoices] = await Promise.all([
        axios.get(`${API_URL}/dashboard/summary`, {
          params,
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${API_URL}/dashboard/pipeline`, {
          params,
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${API_URL}/invoice/recent`, {
          params,
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const prevRange = previousRangeFor(preset, selMonth);
      const prevParams = buildParams(prevRange);

      const resPrevSummary = await axios.get(`${API_URL}/dashboard/summary`, {
        params: prevParams,
        headers: { Authorization: `Bearer ${token}` },
      });

      const curr = resSummary.data || {};
      const prev = resPrevSummary.data || {};

      // Calculate total revenue from currency breakdown
      const currentTotalRevenue = calculateTotalRevenue(curr.revenueByCurrency);
      const previousTotalRevenue = calculateTotalRevenue(prev.revenueByCurrency);

      // Calculate accurate percentages
      const totalLeadsChange = computeChange(
        curr.totalLeads || 0,
        prev.totalLeads || 0
      );
      const totalDealsWonChange = computeChange(
        curr.totalDealsWon || 0,
        prev.totalDealsWon || 0
      );
      const totalRevenueChange = computeChange(
        currentTotalRevenue,
        previousTotalRevenue
      );
      const pendingInvoicesChange = computeChange(
        curr.pendingInvoices || 0,
        prev.pendingInvoices || 0
      );

      const summaryCards = [
        {
          title: "Total Leads",
          value: curr.totalLeads || 0,
          change: totalLeadsChange,
          color: "blue",
          icon: <Users className="h-5 w-5" />,
          colorPalette: ["#3B82F6", "#60A5FA", "#93C5FD"],
        },
        {
          title: "Deals Won",
          value: curr.totalDealsWon || 0,
          change: totalDealsWonChange,
          color: "purple",
          icon: <Trophy className="h-5 w-5" />,
          colorPalette: ["#8B5CF6", "#A78BFA", "#C4B5FD"],
        },
        {
          title: "Revenue",
          value: currentTotalRevenue,
          change: totalRevenueChange,
          color: "indigo",
          icon: <DollarSign className="h-5 w-5" />,
          colorPalette: ["#6366F1", "#818CF8", "#A5B4FC"],
        },
        {
          title: "Pending Invoices",
          value: curr.pendingInvoices || 0,
          change: pendingInvoicesChange,
          color: "violet",
          icon: <FileText className="h-5 w-5" />,
          colorPalette: ["#7C3AED", "#8B5CF6", "#A78BFA"],
        },
      ];

      setSummary(summaryCards);
      setPipeline(resPipeline.data || []);
      setRecentInvoices(resInvoices.data || []);
      setRevenueBreakdown(curr.revenueByCurrency || {});

      const incomingRevenue = currentTotalRevenue;
      animateDisplayedRevenue(incomingRevenue);

      if ((curr.totalDealsWon || 0) > 5 && totalDealsWonChange > 0) {
        confetti({ particleCount: 140, spread: 90, origin: { y: 0.6 } });
      }

      // Trigger line animation refresh
      setLineAnimationKey((prev) => prev + 1);
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
      const res = await axios.get(`${API_URL}/deals/getAll`, {
        params,
        headers: { Authorization: `Bearer ${token}` },
      });

      const deals = res.data || [];
      const counts = { open: 0, won: 0, lost: 0 };

      const monthlyData = {};

      deals.forEach((deal) => {
        if (deal.stage === "Qualification" || deal.stage === "Open")
          counts.open += 1;
        else if (deal.stage === "Closed Won") counts.won += 1;
        else if (deal.stage === "Closed Lost") counts.lost += 1;

        const d = new Date(deal.createdAt);
        const month = d.toLocaleString("default", { month: "short" });
        if (!monthlyData[month])
          monthlyData[month] = { month, open: 0, won: 0, lost: 0, total: 0 };
        if (deal.stage === "Qualification" || deal.stage === "Open")
          monthlyData[month].open += 1;
        else if (deal.stage === "Closed Won") monthlyData[month].won += 1;
        else if (deal.stage === "Closed Lost") monthlyData[month].lost += 1;
        monthlyData[month].total += 1;
      });

      setTotalDeals(deals.length);
      setStatusCounts(counts);

      const full = [
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
        const found = monthlyData[m];
        return {
          month: m,
          open: found ? found.open : 0,
          won: found ? found.won : 0,
          lost: found ? found.lost : 0,
          total: found ? found.total : 0,
        };
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
    else if (preset === "month")
      range = getMonthRange(selectedMonth, selectedYear);
    else if (preset === "year") range = getYearRange(selectedYear);
    else range = todayRange();
    debouncedFetch(range);
  };

  /* ---------- Real-time interval ---------- */
  useEffect(() => {
    applyPreset(activePreset);

    const interval = setInterval(() => {
      let range;
      if (activePreset === "month")
        range = getMonthRange(selectedMonth, selectedYear);
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

    return [
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
    ].map((m) => ({
      month: m,
      total: byMonth[m] || 0,
    }));
  };

  const invoiceChartData = buildRevenueTrend(recentInvoices, activePreset);

  /* ---------- Derived chart datasets ---------- */
  const pipelineBarData = dealsData.map((d) => ({
    month: d.month,
    Open: d.open,
    Won: d.won,
  }));

  // Calculate percentages for pie chart
  const calculatePercentages = () => {
    const total = statusCounts.open + statusCounts.won + statusCounts.lost;
    if (total === 0) return { open: 0, won: 0, lost: 0 };

    return {
      open: Math.round((statusCounts.open / total) * 100),
      won: Math.round((statusCounts.won / total) * 100),
      lost: Math.round((statusCounts.lost / total) * 100),
    };
  };

  const percentages = calculatePercentages();

  const pieData = [
    { name: "Open", value: statusCounts.open, percentage: percentages.open },
    { name: "Won", value: statusCounts.won, percentage: percentages.won },
    { name: "Lost", value: statusCounts.lost, percentage: percentages.lost },
  ];

  const totalPipelineLeads = pipeline.reduce(
    (acc, s) => acc + (s.leads || 0),
    0
  );

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
            <span
              style={{
                display: "inline-block",
                width: 10,
                height: 10,
                background: p.color,
                marginRight: 8,
                borderRadius: "50%",
              }}
            />
            {p.name}:{" "}
            <strong className="ml-1">₹{p.value.toLocaleString()}</strong>
          </div>
        ))}
      </motion.div>
    );
  };

  /* ---------- Animated Pie: rotate colors ---------- */
  useEffect(() => {
    const rotate = () => {
      pieColorIndex.current = (pieColorIndex.current + 1) % BASE_COLORS.length;
      const rotated = BASE_COLORS.slice(pieColorIndex.current).concat(
        BASE_COLORS.slice(0, pieColorIndex.current)
      );
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
    const total = (recentInvoices || []).reduce(
      (acc, inv) => acc + (inv.total || 0),
      0
    );
    animateDisplayedRevenue(total);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recentInvoices]);

  /* ---------- UI ---------- */
  return (
    <div className="p-6 space-y-6 min-h-screen relative overflow-hidden bg-gradient-to-br from-gray-50 to-indigo-50/30">
      {/* page-wide subtle bubbles */}
      <div className="absolute inset-0 -z-20 pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full opacity-10"
            initial={{ scale: 0.95 }}
            animate={{
              y: [0, i % 2 === 0 ? -20 : 20, 0],
              x: [0, i % 3 === 0 ? 25 : -15, 0],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 12 + (i % 6),
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5,
            }}
            style={{
              width: 120 + i * 18,
              height: 120 + i * 18,
              top: `${(i * 13) % 100}%`,
              left: `${(i * 27) % 100}%`,
              background: `radial-gradient(circle, ${
                BASE_COLORS[i % BASE_COLORS.length]
              }22, transparent)`,
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
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Select value={activePreset} onValueChange={(v) => applyPreset(v)}>
            <SelectTrigger className="w-[180px] bg-white/80 backdrop-blur-sm border-gray-200">
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
            <Select
              value={String(selectedMonth)}
              onValueChange={(value) => applyMonthFilter(Number(value))}
            >
              <SelectTrigger className="w-[140px] bg-white/80 backdrop-blur-sm border-gray-200">
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

          {activePreset === "year" && (
            <Select
              value={String(selectedYear)}
              onValueChange={(value) => applyYearFilter(Number(value))}
            >
              <SelectTrigger className="w-[120px] bg-white/80 backdrop-blur-sm border-gray-200">
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

      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md relative z-10"
        >
          {error}
        </motion.div>
      )}

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="overflow-hidden border-0 shadow-lg">
                <CardContent className="p-6">
                  <Skeleton className="h-7 w-24 mb-2" />
                  <Skeleton className="h-10 w-16" />
                </CardContent>
              </Card>
            ))
          : summary.map((card, idx) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 12, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  delay: idx * 0.05,
                  type: "spring",
                  stiffness: 100,
                  damping: 12,
                }}
                whileHover={{
                  y: -6,
                  boxShadow: "0 15px 40px rgba(2,6,23,0.08)",
                  scale: 1.01,
                }}
              >
                <Card
                  className={cn(
                    "overflow-hidden border-0 shadow-lg transition-all duration-300 relative",
                    {
                      "bg-blue-50": card.color === "blue",
                      "bg-purple-50": card.color === "purple",
                      "bg-indigo-50": card.color === "indigo",
                      "bg-violet-50": card.color === "violet",
                    }
                  )}
                >
                  {/* Enhanced card micro-bubbles with color palette */}
                  <CardBubbles
                    seed={idx + 3}
                    count={8}
                    colorPalette={card.colorPalette || BASE_COLORS}
                  />

                  <CardContent className="p-6 relative">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-2">
                          {card.title}
                        </p>
                        {card.title === "Revenue" ? (
                          <div className="flex items-baseline gap-2">
                            <span className="text-sm text-gray-500">₹</span>
                            <AnimatedNumber
                              value={displayedRevenue || card.value}
                              prefix=""
                              duration={0.9}
                            />
                          </div>
                        ) : (
                          <AnimatedNumber value={card.value} />
                        )}
                      </div>
                      <motion.div
                        className={cn("p-3 rounded-full", {
                          "bg-blue-100 text-blue-600": card.color === "blue",
                          "bg-purple-100 text-purple-600":
                            card.color === "purple",
                          "bg-indigo-100 text-indigo-600":
                            card.color === "indigo",
                          "bg-violet-100 text-violet-600":
                            card.color === "violet",
                        })}
                        whileHover={{ scale: 1.06, rotate: 5 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {card.icon}
                      </motion.div>
                    </div>

                    {/* Revenue breakdown tooltip */}
                    {card.title === "Revenue" && Object.keys(revenueBreakdown).length > 0 && (
                      <div className="mt-2">
                        <div className="text-xs text-gray-500">
                          {formatRevenueBreakdown(revenueBreakdown).map((item, i) => (
                            <div key={i} className="truncate">
                              {item.formatted}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="mt-4 flex items-center">
                      <TrendingUp
                        className={`h-4 w-4 ${
                          card.change >= 0 ? "text-green-500" : "text-red-500"
                        } mr-1`}
                      />
                      <span
                        className={`text-sm font-medium ${
                          card.change >= 0 ? "text-green-500" : "text-red-500"
                        }`}
                      >
                        {card.change >= 0
                          ? `+${card.change}%`
                          : `${card.change}%`}
                      </span>
                      <span className="text-sm text-gray-500 ml-2">
                        vs previous period
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
      </div>

      {/* Pipeline + Revenue */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative z-10">
        {/* Pipeline */}
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45 }}
          whileHover={{ y: -4 }}
        >
          <Card className="shadow-lg border-0 overflow-hidden relative bg-white/80 backdrop-blur-sm">
            <CardBubbles
              seed={11}
              count={10}
              colorPalette={["#3B82F6", "#60A5FA", "#93C5FD"]}
            />
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl text-gray-800">
                  Sales Pipeline
                </CardTitle>
                <Badge
                  variant="outline"
                  className="bg-white/80 backdrop-blur-sm animate-pulse"
                >
                  {totalPipelineLeads} Deals
                </Badge>
              </div>
              <CardDescription>
                Open vs Won — monthly (realtime)
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-6 relative">
              {loading ? (
                <div className="h-64">
                  <Skeleton className="h-64 w-full" />
                </div>
              ) : (
                <motion.div
                  layout
                  key={activePreset}
                  initial={{ opacity: 0.6 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={pipelineBarData}
                        margin={{ top: 6, right: 12, left: 0, bottom: 6 }}
                      >
                        <defs>
                          <linearGradient
                            id="gOpen"
                            x1="0"
                            x2="0"
                            y1="0"
                            y2="1"
                          >
                            <stop
                              offset="0%"
                              stopColor="#8B5CF6"
                              stopOpacity={0.95}
                            />
                            <stop
                              offset="100%"
                              stopColor="#8B5CF6"
                              stopOpacity={0.18}
                            />
                          </linearGradient>
                          <linearGradient id="gWon" x1="0" x2="0" y1="0" y2="1">
                            <stop
                              offset="0%"
                              stopColor="#3B82F6"
                              stopOpacity={0.95}
                            />
                            <stop
                              offset="100%"
                              stopColor="#3B82F6"
                              stopOpacity={0.18}
                            />
                          </linearGradient>
                        </defs>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          vertical={false}
                          opacity={0.06}
                        />
                        <XAxis
                          dataKey="month"
                          tickLine={false}
                          axisLine={false}
                        />
                        <YAxis />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar
                          dataKey="Open"
                          name="Open"
                          fill="url(#gOpen)"
                          barSize={18}
                          radius={[6, 6, 0, 0]}
                          isAnimationActive
                        />
                        <Bar
                          dataKey="Won"
                          name="Won"
                          fill="url(#gWon)"
                          barSize={18}
                          radius={[6, 6, 0, 0]}
                          isAnimationActive
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="flex gap-3 mt-4 justify-center">
                    <Badge
                      variant="outline"
                      className="flex items-center gap-2 bg-white/80 backdrop-blur-sm"
                    >
                      <span className="w-2 h-2 rounded-full bg-[#8B5CF6]" />
                      Open
                    </Badge>
                    <Badge
                      variant="outline"
                      className="flex items-center gap-2 bg-white/80 backdrop-blur-sm"
                    >
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
        <motion.div
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45 }}
          whileHover={{ y: -4 }}
        >
          <Card className="shadow-lg border-0 overflow-hidden relative bg-white/80 backdrop-blur-sm">
            <CardBubbles
              seed={21}
              count={9}
              colorPalette={["#8B5CF6", "#A78BFA", "#C4B5FD"]}
            />
            <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b border-purple-100">
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl text-gray-800">
                  Revenue Overview
                </CardTitle>
                <div className="flex items-center gap-2">
                  {/* Currency breakdown badge */}
                  {Object.keys(revenueBreakdown).length > 0 && (
                    <Badge variant="outline" className="bg-white/80 backdrop-blur-sm">
                      {Object.keys(revenueBreakdown).length} currencies
                    </Badge>
                  )}
                </div>
              </div>
              <CardDescription>
                Realtime revenue (auto-updates) • Multi-currency support
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-500">
                    Live Revenue (calculated from won deals)
                  </p>
                  <div className="text-2xl font-semibold flex items-baseline gap-2">
                    <span className="text-sm text-gray-500">₹</span>
                    <AnimatedNumber value={displayedRevenue} duration={0.9} />
                    <motion.span
                      className="ml-3 text-sm text-green-600"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: displayedRevenue > 0 ? 1 : 0 }}
                      transition={{ duration: 0.6 }}
                    >
                      realtime
                    </motion.span>
                  </div>
                  
                  {/* Currency breakdown */}
                  {Object.keys(revenueBreakdown).length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {formatRevenueBreakdown(revenueBreakdown).map((item, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {item.formatted}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {loading ? (
                <Skeleton className="h-64 w-full" />
              ) : invoiceChartData.length > 0 ? (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={invoiceChartData}
                      margin={{ top: 6, right: 20, left: 0, bottom: 6 }}
                    >
                      <defs>
                        <linearGradient
                          id="revGrad"
                          x1="0"
                          x2="0"
                          y1="0"
                          y2="1"
                        >
                          <stop
                            offset="0%"
                            stopColor="#A78BFA"
                            stopOpacity={0.95}
                          />
                          <stop
                            offset="100%"
                            stopColor="#A78BFA"
                            stopOpacity={0.06}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        opacity={0.06}
                      />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip
                        formatter={(v) => [`₹${v.toLocaleString()}`, "Revenue"]}
                      />
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
                          strokeWidth: 2,
                        }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">
                  No revenue data available
                </p>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Deals Performance + Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative z-10">
        {/* Deals Performance - Enhanced Line Chart */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          whileHover={{ y: -4 }}
        >
          <Card className="shadow-lg border-0 overflow-hidden relative bg-white/80 backdrop-blur-sm">
            <CardBubbles
              seed={31}
              count={8}
              colorPalette={["#3B82F6", "#60A5FA", "#93C5FD"]}
            />
            <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50 border-b border-indigo-100">
              <CardTitle className="text-xl text-gray-800">
                Deals Performance
              </CardTitle>
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
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        opacity={0.06}
                      />
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
                          stroke: "#fff",
                        }}
                        activeDot={{
                          r: 6,
                          fill: "#8B5CF6",
                          stroke: "#fff",
                          strokeWidth: 2,
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
                          stroke: "#fff",
                        }}
                        activeDot={{
                          r: 6,
                          fill: "#3B82F6",
                          stroke: "#fff",
                          strokeWidth: 2,
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
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          whileHover={{ y: -4 }}
        >
          <Card className="shadow-lg border-0 overflow-hidden relative bg-white/80 backdrop-blur-sm">
            <CardBubbles
              seed={41}
              count={10}
              colorPalette={["#8B5CF6", "#A78BFA", "#C4B5FD"]}
            />
            <CardHeader className="bg-gradient-to-r from-violet-50 to-purple-50 border-b border-violet-100">
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl text-gray-800">
                  Deal Distribution
                </CardTitle>
                <Badge
                  variant="outline"
                  className="bg-white/80 backdrop-blur-sm"
                >
                  {totalDeals} Total
                </Badge>
              </div>
              <CardDescription>Percentage split — animated</CardDescription>
            </CardHeader>

            <CardContent className="pt-6">
              {loading ? (
                <Skeleton className="h-64 w-full rounded-full" />
              ) : pieData.filter((p) => p.value > 0).length > 0 ? (
                <motion.div
                  initial={{ scale: 0.98, opacity: 0.9 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.45 }}
                >
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
                          {pieData
                            .filter((p) => p.value > 0)
                            .map((entry, idx) => {
                              const dynamicColor =
                                pieColors[idx % pieColors.length];
                              const isActive = idx === activeSlice;
                              return (
                                <Cell
                                  key={idx}
                                  fill={dynamicColor}
                                  stroke="#fff"
                                  strokeWidth={2}
                                  style={{
                                    transition:
                                      "transform 300ms ease, filter 300ms ease",
                                    transform: isActive
                                      ? "scale(1.04)"
                                      : "scale(1)",
                                    filter: isActive
                                      ? "drop-shadow(0 6px 18px rgba(99,102,241,0.18))"
                                      : "none",
                                  }}
                                />
                              );
                            })}
                        </Pie>
                        <Tooltip
                          formatter={(value, name, props) => {
                            const percentage = props.payload.percentage;
                            return [`${value} deals (${percentage}%)`, name];
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="flex gap-3 mt-4 justify-center flex-wrap">
                    {pieData
                      .filter((p) => p.value > 0)
                      .map((p, i) => (
                        <motion.div
                          key={p.name}
                          whileHover={{ scale: 1.04 }}
                          className="flex items-center gap-2 mb-2"
                        >
                          <Badge
                            variant="outline"
                            className="flex items-center gap-2 bg-white/80 backdrop-blur-sm"
                          >
                            <span
                              className="w-2 h-2 rounded-full"
                              style={{
                                background: pieColors[i % pieColors.length],
                              }}
                            />
                            {p.name} ({p.value} - {p.percentage}%)
                          </Badge>
                        </motion.div>
                      ))}
                  </div>
                </motion.div>
              ) : (
                <p className="text-gray-500 text-center py-8">
                  No deal distribution data available
                </p>
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
          {/* <Sparkles className="h-4 w-4 text-purple-500" />
          Real-time analytics with beautiful animations
          <Sparkles className="h-4 w-4 text-purple-500" /> */}
        </motion.p>
      </div>
    </div>
  );
};

export default AdminDashboard;