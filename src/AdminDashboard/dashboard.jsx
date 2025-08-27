import React, { useEffect, useState } from "react";
import {
  Card, CardContent, CardHeader, CardTitle,
} from "../components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "../components/ui/table";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from "recharts";
import { User, Clock, ArrowRight } from "lucide-react"; // icons
import axios from "axios";

const AdminDashboard = () => {
  const [summary, setSummary] = useState([]);
  const [pipeline, setPipeline] = useState([]);
  const [recentLeads, setRecentLeads] = useState([]);
  const [pendingDeals, setPendingDeals] = useState([]);
  const [recentInvoices, setRecentInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch data from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Dashboard Summary
        const resSummary = await axios.get("http://localhost:5000/api/dashboard/summary");
        setSummary([
          { title: "Total Leads", value: resSummary.data.totalLeads, color: "bg-blue-500" },
          { title: "Deals Won", value: resSummary.data.totalDealsWon, color: "bg-green-500" },
          { title: "Revenue", value: `₹${resSummary.data.totalRevenue}`, color: "bg-purple-500" },
          { title: "Pending Invoices", value: resSummary.data.pendingInvoices, color: "bg-orange-500" },
        ]);

        // 2. Pipeline
        const resPipeline = await axios.get("http://localhost:5000/api/dashboard/pipeline");
        setPipeline(resPipeline.data);

        // 3. Recent Leads
        const resLeads = await axios.get("http://localhost:5000/api/leads/recent");
        setRecentLeads(resLeads.data);

        // 4. Pending Deals
        const resDeals = await axios.get("http://localhost:5000/api/deals/pending");
        setPendingDeals(resDeals.data);

        // 5. Recent Invoices
        const resInvoices = await axios.get("http://localhost:5000/api/invoice/recent");
        setRecentInvoices(resInvoices.data);

      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="p-6 text-center text-gray-600">Loading Dashboard...</div>;
  }

  // Group invoices by status for chart
  const groupedInvoices = recentInvoices.reduce((acc, inv) => {
    acc[inv.status] = (acc[inv.status] || 0) + inv.total;
    return acc;
  }, {});
  const invoiceChartData = Object.entries(groupedInvoices).map(([status, total]) => ({
    status,
    total,
  }));

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* ---- Summary Cards ---- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {summary.map((card, idx) => (
          <div
            key={idx}
            className={`relative overflow-hidden rounded-2xl p-6 shadow-xl transform transition duration-500 hover:scale-105 ${card.color} text-white`}
          >
            {/* Decorative Circles */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-white opacity-20 rounded-full"></div>
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white opacity-20 rounded-full"></div>

            <CardHeader className="relative z-10">
              <CardTitle className="text-lg font-semibold tracking-wide">
                {card.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="relative z-10 mt-4">
              <p className="text-4xl font-extrabold">{card.value}</p>
            </CardContent>
          </div>
        ))}
      </div>

      {/* ---- Pipeline + Recent Leads ---- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pipeline Chart */}
        <div className="relative overflow-hidden rounded-2xl shadow-xl bg-white p-6">
          <CardHeader>
            <CardTitle className="text-gray-800 text-lg font-semibold">
              Pipeline Board
            </CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            {pipeline.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={pipeline}>
                  <XAxis dataKey="stage" stroke="#4B5563" />
                  <YAxis allowDecimals={false} stroke="#4B5563" />
                  <Tooltip contentStyle={{ backgroundColor: "#f3f4f6", borderRadius: "8px" }} />
                  <Bar dataKey="leads" fill="#3B82F6" barSize={30} radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-500 text-center">No pipeline data</p>
            )}
          </CardContent>
        </div>

        {/* Recent Leads - Modern Card */}
        <div className="relative overflow-hidden rounded-2xl shadow-lg bg-gradient-to-br from-indigo-50 to-white">
          <div className="flex items-center justify-between px-6 py-4 border-b">
            <h2 className="text-xl font-bold text-gray-800">Recent Leads</h2>
            <span className="text-sm text-indigo-600 font-medium cursor-pointer hover:underline">
              View All
            </span>
          </div>
          <div className="divide-y">
            {recentLeads.length > 0 ? (
              recentLeads.map((lead, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between px-6 py-4 hover:bg-indigo-50 transition-all"
                >
                  {/* Left Side */}
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                      <User className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-gray-800 font-semibold">{lead.name}</p>
                      <p className="text-gray-500 text-sm flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {lead.assigned || "Unassigned"}
                      </p>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm ${
                      lead.status === "New"
                        ? "bg-green-100 text-green-700"
                        : lead.status === "Pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {lead.status}
                  </span>

                  {/* Arrow */}
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                </div>
              ))
            ) : (
              <p className="text-gray-500 px-6 py-6 text-center">No recent leads</p>
            )}
          </div>
        </div>
      </div>

      {/* ---- Pending Deals & Recent Invoices ---- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Deals */}
        <Card>
          <CardHeader>
            <CardTitle>Pending Deals</CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Deal</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Stage</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingDeals.length > 0 ? pendingDeals.map((deal, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{deal.deal}</TableCell>
                    <TableCell>{deal.value}</TableCell>
                    <TableCell>{deal.stage}</TableCell>
                  </TableRow>
                )) : (
                  <TableRow>
                    <TableCell colSpan="3" className="text-center text-gray-500">No pending deals</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Recent Invoices Chart */}
        <div className="relative overflow-hidden rounded-2xl shadow-xl bg-white p-6">
          <CardHeader>
            <CardTitle className="text-gray-800 text-lg font-semibold">
              Recent Invoices Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="h-64 flex items-center justify-center">
            {invoiceChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart layout="vertical" data={invoiceChartData}>
                  <XAxis type="number" stroke="#4B5563" />
                  <YAxis dataKey="status" type="category" stroke="#4B5563" />
                  <Tooltip contentStyle={{ backgroundColor: "#f3f4f6", borderRadius: "8px" }} />
                  <Bar dataKey="total" fill="#6366F1" barSize={30} radius={[0, 12, 12, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-500">No invoices</p>
            )}
          </CardContent>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;



// import React, { useEffect, useMemo, useState } from "react";
// import { motion } from "framer-motion";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
// } from "../components/ui/card";
// import { Button } from "../components/ui/button";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "../components/ui/select";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
// import { Input } from "../components/ui/input";
// import { Badge } from "../components/ui/badge";
// import { Separator } from "../components/ui/separator";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
//   LineChart,
//   Line,
//   PieChart,
//   Pie,
//   Cell,
//   Legend,
//   AreaChart,
//   Area,
// } from "recharts";
// import { CalendarClock, Filter, RefreshCw, TrendingUp, Users2, Target, CheckCircle, AlertCircle } from "lucide-react";

// // ------------------------------------------------------------
// // 🔧 Quick Hookup Guide
// // - Replace the fetchDashboard() function with real API calls to your backend.
// // - Ensure shadcn/ui is configured and TailwindCSS is enabled.
// // - Drop this component anywhere in your CRM routes (e.g., /dashboard)
// // ------------------------------------------------------------

// const SALESPEOPLE = [
//   { id: "all", name: "All Team" },
//   { id: "sara", name: "Sara" },
//   { id: "arun", name: "Arun" },
//   { id: "meera", name: "Meera" },
//   { id: "danish", name: "Danish" },
// ];

// const DATE_RANGES = [
//   { id: "7d", label: "Last 7 days" },
//   { id: "30d", label: "Last 30 days" },
//   { id: "qtd", label: "Quarter to date" },
//   { id: "ytd", label: "Year to date" },
// ];

// // Mock fetcher (replace with your real endpoints)
// async function fetchDashboard({ range, salesperson, search }) {
//   // Example: const res = await axios.get(`/api/dashboard/summary`, { params: { range, salesperson, q: search } })
//   // return res.data
//   await new Promise((r) => setTimeout(r, 400));

//   // Generate playful demo data that changes with filters
//   const seed = (range.length + salesperson.length + (search?.length || 0)) % 9;
//   const base = 100 + seed * 7;

//   const monthly = Array.from({ length: 12 }, (_, i) => ({
//     month: new Date(0, i).toLocaleString("en", { month: "short" }),
//     revenue: Math.round(base * (0.6 + Math.sin((i + seed) / 1.8) + Math.random() * 0.3) * 10),
//     deals: Math.round(10 + ((i + seed) % 6) + Math.random() * 8),
//   }));

//   const stages = [
//     { name: "Qualification", value: 24 + seed },
//     { name: "Proposal", value: 18 + (seed % 4) },
//     { name: "Negotiation", value: 12 + (seed % 6) },
//     { name: "Won", value: 9 + (seed % 5) },
//     { name: "Lost", value: 7 + (seed % 3) },
//   ];

//   const team = SALESPEOPLE.filter((s) => s.id !== "all").map((m, i) => ({
//     name: m.name,
//     won: 6 + ((i + seed) % 5),
//     revenue: Math.round(30000 + (i + seed) * 5000 + Math.random() * 20000),
//     conversion: Number((0.18 + ((i + seed) % 5) * 0.03).toFixed(2)),
//   }));

//   const activities = Array.from({ length: 8 }, (_, i) => ({
//     id: `${Date.now()}-${i}`,
//     title: ["Call", "Demo", "Email", "Meeting"][i % 4] + " with client",
//     owner: SALESPEOPLE[(i + 1) % SALESPEOPLE.length].name,
//     due: new Date(Date.now() + (i + 1) * 86400000).toLocaleDateString(),
//     status: ["Due", "Scheduled", "Overdue"][i % 3],
//   }));

//   const kpis = {
//     leads: 320 + seed * 3,
//     activeDeals: 87 + seed,
//     revenue: monthly.reduce((s, m) => s + m.revenue, 0),
//     pendingFollowups: activities.filter((a) => a.status !== "Scheduled").length,
//     conversionRate: Number((team.reduce((s, x) => s + x.conversion, 0) / team.length).toFixed(2)),
//     avgDealCycle: 21 - (seed % 7),
//   };

//   return { monthly, stages, team, activities, kpis };
// }

// const StatCard = ({ icon: Icon, label, value, help }) => (
//   <Card className="rounded-2xl shadow-sm">
//     <CardContent className="p-4">
//       <div className="flex items-start gap-3">
//         <div className="p-2 rounded-xl bg-muted">
//           <Icon className="h-5 w-5" />
//         </div>
//         <div className="flex-1">
//           <p className="text-sm text-muted-foreground">{label}</p>
//           <p className="text-2xl font-semibold leading-tight">{value}</p>
//           {help && <p className="text-xs text-muted-foreground mt-1">{help}</p>}
//         </div>
//       </div>
//     </CardContent>
//   </Card>
// );

// export default function BusinessInteractiveDashboard() {
//   const [range, setRange] = useState("30d");
//   const [salesperson, setSalesperson] = useState("all");
//   const [search, setSearch] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [data, setData] = useState({ monthly: [], stages: [], team: [], activities: [], kpis: {} });

//   const load = async () => {
//     setLoading(true);
//     const res = await fetchDashboard({ range, salesperson, search });
//     setData(res);
//     setLoading(false);
//   };

//   useEffect(() => {
//     load();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [range, salesperson]);

//   const COLORS = useMemo(() => [
//     "#6366F1", // indigo
//     "#22C55E", // green
//     "#F59E0B", // amber
//     "#EF4444", // red
//     "#0EA5E9", // sky
//   ], []);

//   const handleDrill = (payload) => {
//     // Example: open a modal or navigate to a filtered list page
//     // navigate(`/deals?stage=${payload?.activeLabel || payload?.name}`)
//     // For demo, just alert
//     if (payload?.activeLabel) alert(`Drill-down: ${payload.activeLabel}`);
//   };

//   return (
//     <div className="p-4 md:p-6 space-y-5">
//       {/* Header */}
//       <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
//         <div>
//           <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">CRM Business Dashboard</h1>
//           <p className="text-sm text-muted-foreground">Interactive insights for pipeline, revenue & team performance</p>
//         </div>
//         <div className="flex flex-col sm:flex-row gap-2">
//           <div className="flex items-center gap-2">
//             <Select value={range} onValueChange={setRange}>
//               <SelectTrigger className="w-[160px]">
//                 <SelectValue placeholder="Date Range" />
//               </SelectTrigger>
//               <SelectContent>
//                 {DATE_RANGES.map((r) => (
//                   <SelectItem key={r.id} value={r.id}>{r.label}</SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//             <Select value={salesperson} onValueChange={setSalesperson}>
//               <SelectTrigger className="w-[160px]">
//                 <SelectValue placeholder="Salesperson" />
//               </SelectTrigger>
//               <SelectContent>
//                 {SALESPEOPLE.map((p) => (
//                   <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           </div>
//           <div className="flex items-center gap-2">
//             <div className="relative">
//               <Input
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//                 placeholder="Search accounts / deals"
//                 className="pr-10"
//               />
//               <Filter className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
//             </div>
//             <Button variant="secondary" onClick={load} disabled={loading}>
//               <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} /> Refresh
//             </Button>
//           </div>
//         </div>
//       </div>

//       {/* KPI Cards */}
//       <motion.div
//         initial={{ opacity: 0, y: 10 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.25 }}
//         className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
//       >
//         <StatCard icon={Users2} label="Total Leads" value={data.kpis.leads || "-"} help="Captured in selected period" />
//         <StatCard icon={Target} label="Active Deals" value={data.kpis.activeDeals || "-"} help="Open opportunities" />
//         <StatCard icon={TrendingUp} label="Revenue" value={data.kpis.revenue ? `₹${(data.kpis.revenue/1000).toFixed(1)}k` : "-"} help="Sum of closed + forecast" />
//         <StatCard icon={CalendarClock} label="Pending Follow-ups" value={data.kpis.pendingFollowups || "-"} help="Due & overdue" />
//       </motion.div>

//       {/* Charts Row 1 */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
//         <Card className="rounded-2xl shadow-sm lg:col-span-2">
//           <CardHeader>
//             <div className="flex items-center justify-between">
//               <CardTitle>Monthly Revenue & Deals</CardTitle>
//               <Badge variant="secondary">Drill-down enabled</Badge>
//             </div>
//           </CardHeader>
//           <CardContent className="h-[320px]">
//             <ResponsiveContainer width="100%" height="100%">
//               <ComposedRevenueChart data={data.monthly} onDrill={handleDrill} />
//             </ResponsiveContainer>
//           </CardContent>
//         </Card>

//         <Card className="rounded-2xl shadow-sm">
//           <CardHeader>
//             <CardTitle>Leads by Stage</CardTitle>
//           </CardHeader>
//           <CardContent className="h-[320px]">
//             <ResponsiveContainer width="100%" height="100%">
//               <PieChart>
//                 <Tooltip />
//                 <Legend verticalAlign="bottom" height={24} />
//                 <Pie
//                   data={data.stages}
//                   dataKey="value"
//                   nameKey="name"
//                   outerRadius={95}
//                   onClick={(e) => handleDrill(e)}
//                 >
//                   {data.stages?.map((_, idx) => (
//                     <Cell key={`c-${idx}`} fill={COLORS[idx % COLORS.length]} />
//                   ))}
//                 </Pie>
//               </PieChart>
//             </ResponsiveContainer>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Tabs: Team & Activities */}
//       <Tabs defaultValue="team" className="w-full">
//         <TabsList className="grid w-full grid-cols-2 md:w-auto">
//           <TabsTrigger value="team">Team Performance</TabsTrigger>
//           <TabsTrigger value="activities">Upcoming Activities</TabsTrigger>
//         </TabsList>
//         <TabsContent value="team">
//           <Card className="rounded-2xl shadow-sm">
//             <CardHeader>
//               <CardTitle>Top Performing Employees</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
//                 <div className="h-[300px]">
//                   <ResponsiveContainer width="100%" height="100%">
//                     <BarChart data={data.team}>
//                       <CartesianGrid strokeDasharray="3 3" />
//                       <XAxis dataKey="name" />
//                       <YAxis />
//                       <Tooltip />
//                       <Legend />
//                       <Bar dataKey="won" name="Deals Won" fill="#22C55E" radius={[6,6,0,0]} />
//                       <Bar dataKey="revenue" name="Revenue" fill="#6366F1" radius={[6,6,0,0]} />
//                     </BarChart>
//                   </ResponsiveContainer>
//                 </div>
//                 <div className="h-[300px]">
//                   <ResponsiveContainer width="100%" height="100%">
//                     <LineChart data={data.team}>
//                       <CartesianGrid strokeDasharray="3 3" />
//                       <XAxis dataKey="name" />
//                       <YAxis domain={[0, 1]} tickFormatter={(v) => `${Math.round(v * 100)}%`} />
//                       <Tooltip formatter={(v) => `${Math.round(v * 100)}%`} />
//                       <Legend />
//                       <Line type="monotone" dataKey="conversion" name="Conversion Rate" stroke="#F59E0B" strokeWidth={2} dot={false} />
//                     </LineChart>
//                   </ResponsiveContainer>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </TabsContent>
//         <TabsContent value="activities">
//           <Card className="rounded-2xl shadow-sm">
//             <CardHeader className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
//               <CardTitle>Upcoming Follow-ups</CardTitle>
//               <div className="flex items-center gap-2 text-sm text-muted-foreground">
//                 <AlertCircle className="h-4 w-4" />
//                 Click a row to open the related lead/deal
//               </div>
//             </CardHeader>
//             <CardContent>
//               <div className="overflow-x-auto">
//                 <table className="w-full text-sm">
//                   <thead>
//                     <tr className="text-left text-muted-foreground">
//                       <th className="py-2 font-medium">Title</th>
//                       <th className="py-2 font-medium">Owner</th>
//                       <th className="py-2 font-medium">Due</th>
//                       <th className="py-2 font-medium">Status</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {data.activities.map((a) => (
//                       <tr
//                         key={a.id}
//                         className="border-t hover:bg-muted/40 cursor-pointer"
//                         onClick={() => alert(`Open activity ${a.id}`)}
//                       >
//                         <td className="py-2">{a.title}</td>
//                         <td className="py-2">{a.owner}</td>
//                         <td className="py-2">{a.due}</td>
//                         <td className="py-2">
//                           {a.status === "Due" && (
//                             <Badge variant="secondary" className="gap-1"><AlertCircle className="h-3 w-3"/> Due</Badge>
//                           )}
//                           {a.status === "Scheduled" && (
//                             <Badge className="gap-1" variant="outline"><CalendarClock className="h-3 w-3"/> Scheduled</Badge>
//                           )}
//                           {a.status === "Overdue" && (
//                             <Badge className="gap-1" variant="destructive"><AlertCircle className="h-3 w-3"/> Overdue</Badge>
//                           )}
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </CardContent>
//           </Card>
//         </TabsContent>
//       </Tabs>

//       {/* Secondary KPIs */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         <Card className="rounded-2xl shadow-sm">
//           <CardHeader>
//             <CardTitle>Funnel Health</CardTitle>
//           </CardHeader>
//           <CardContent className="h-[260px]">
//             <ResponsiveContainer width="100%" height="100%">
//               <AreaChart data={data.monthly}>
//                 <defs>
//                   <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
//                     <stop offset="5%" stopColor="#6366F1" stopOpacity={0.7}/>
//                     <stop offset="95%" stopColor="#6366F1" stopOpacity={0.05}/>
//                   </linearGradient>
//                 </defs>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="month" />
//                 <YAxis />
//                 <Tooltip />
//                 <Area type="monotone" dataKey="revenue" stroke="#6366F1" fillOpacity={1} fill="url(#g1)" />
//               </AreaChart>
//             </ResponsiveContainer>
//           </CardContent>
//         </Card>
//         <Card className="rounded-2xl shadow-sm">
//           <CardHeader>
//             <CardTitle>Quick Insights</CardTitle>
//           </CardHeader>
//           <CardContent className="grid grid-cols-2 gap-4">
//             <div>
//               <p className="text-sm text-muted-foreground">Avg Deal Cycle</p>
//               <p className="text-2xl font-semibold">{data.kpis.avgDealCycle || "-"} days</p>
//               <Separator className="my-3" />
//               <p className="text-sm text-muted-foreground">Conversion Rate</p>
//               <p className="text-2xl font-semibold">{data.kpis.conversionRate ? `${Math.round(data.kpis.conversionRate * 100)}%` : "-"}</p>
//             </div>
//             <div className="flex flex-col gap-3">
//               <Button className="justify-start" variant="secondary" onClick={() => alert("Export CSV triggered")}>Export CSV</Button>
//               <Button className="justify-start" variant="outline" onClick={() => alert("Export PDF triggered")}>Export PDF</Button>
//               <Button className="justify-start" onClick={() => alert("Create Report wizard")}>Create Report</Button>
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       <p className="text-center text-xs text-muted-foreground">Tip: Click chart items to drill into details (hook into your routes/modals).</p>
//     </div>
//   );
// }

// function ComposedRevenueChart({ data, onDrill }) {
//   return (
//     <BarChart data={data} onClick={(e) => onDrill?.(e)}>
//       <CartesianGrid strokeDasharray="3 3" />
//       <XAxis dataKey="month" />
//       <YAxis yAxisId="left" />
//       <YAxis yAxisId="right" orientation="right" />
//       <Tooltip />
//       <Legend />
//       <Bar yAxisId="left" dataKey="revenue" name="Revenue" fill="#0EA5E9" radius={[6,6,0,0]} />
//       <Line yAxisId="right" type="monotone" dataKey="deals" name="Deals" stroke="#22C55E" strokeWidth={2} dot={false} />
//     </BarChart>
//   );
// }


// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { motion } from "framer-motion";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
// } from "../components/ui/card";
// import { Input } from "../components/ui/input";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "../components/ui/select";
// import { Button } from "../components/ui/button";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "../components/ui/table";
// import {
//   BarChart,
//   Bar,
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
//   PieChart,
//   Pie,
//   Cell,
// } from "recharts";
// import {
//   Users2,
//   Target,
//   TrendingUp,
//   CalendarClock,
//   RefreshCw,
//   Filter,
// } from "lucide-react";
// import { toast } from "react-toastify";

// const DATE_RANGES = [
//   { id: "7d", label: "Last 7 Days" },
//   { id: "30d", label: "Last 30 Days" },
//   { id: "qtd", label: "Quarter To Date" },
//   { id: "ytd", label: "Year To Date" },
// ];

// const StatCard = ({ icon: Icon, label, value }) => (
//   <Card className="rounded-2xl shadow-sm">
//     <CardContent className="p-4">
//       <div className="flex items-center gap-3">
//         <div className="p-2 bg-muted rounded-xl">
//           <Icon className="w-5 h-5" />
//         </div>
//         <div>
//           <p className="text-sm text-muted-foreground">{label}</p>
//           <p className="text-2xl font-semibold">{value}</p>
//         </div>
//       </div>
//     </CardContent>
//   </Card>
// );

// export default function AdminDashboard() {
//   const [range, setRange] = useState("30d");
//   const [salesperson, setSalesperson] = useState("all");
//   const [search, setSearch] = useState("");
//   const [loading, setLoading] = useState(true);

//   const [summary, setSummary] = useState([]);
//   const [monthlyData, setMonthlyData] = useState([]);
//   const [pipeline, setPipeline] = useState([]);
//   const [recentLeads, setRecentLeads] = useState([]);
//   const [pendingDeals, setPendingDeals] = useState([]);
//   const [recentInvoices, setRecentInvoices] = useState([]);
//   const [salesUsers, setSalesUsers] = useState([]);

//   const COLORS = ["#6366F1", "#22C55E", "#F59E0B", "#EF4444", "#0EA5E9"];

//   // Fetch sales users dynamically
//   useEffect(() => {
//     const fetchSalesUsers = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const response = await axios.get("http://localhost:5000/api/users", {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         const filteredSales = (response.data.users || []).filter(
//           (user) =>
//             user.role &&
//             user.role.name &&
//             user.role.name.trim().toLowerCase() === "sales"
//         );

//         console.log("filter",filteredSales);
        

//         setSalesUsers(filteredSales);
//       } catch (error) {
//         console.error(error);
//         toast.error("Failed to fetch sales users");
//       }
//     };

//     fetchSalesUsers();
//   }, []);

//   const loadDashboard = async () => {
//     try {
//       setLoading(true);

//       // Summary
//       const resSummary = await axios.get(
//         "http://localhost:5000/api/dashboard/summary"
//       );
//       setSummary([
//         { label: "Total Leads", value: resSummary.data.totalLeads },
//         { label: "Deals Won", value: resSummary.data.totalDealsWon },
//         { label: "Revenue", value: `₹${resSummary.data.totalRevenue}` },
//         { label: "Pending Invoices", value: resSummary.data.pendingInvoices },
//       ]);

//       // Monthly revenue & deals
//       const resMonthly = await axios.get(
//         "http://localhost:5000/api/dashboard/monthly"
//       );
//       setMonthlyData(resMonthly.data);

//       // Pipeline
//       const resPipeline = await axios.get(
//         "http://localhost:5000/api/dashboard/pipeline"
//       );
//       setPipeline(resPipeline.data);

//       // Recent leads
//       const resLeads = await axios.get(
//         "http://localhost:5000/api/leads/recent"
//       );
//       setRecentLeads(resLeads.data);

//       // Pending deals
//       const resDeals = await axios.get(
//         "http://localhost:5000/api/deals/pending"
//       );
//       setPendingDeals(resDeals.data);

//       // Recent invoices
//       const resInvoices = await axios.get(
//         "http://localhost:5000/api/invoice/recent"
//       );
//       setRecentInvoices(resInvoices.data);
//     } catch (err) {
//       console.error("Dashboard fetch error:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadDashboard();
//   }, [range, salesperson]);

//   if (loading)
//     return (
//       <div className="p-6 text-center text-gray-600">Loading Dashboard...</div>
//     );

//   return (
//     <div className="p-4 md:p-6 space-y-5">
//       {/* Header */}
//       <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3">
//         <div>
//           <h1 className="text-2xl md:text-3xl font-semibold">CRM Dashboard</h1>
//           <p className="text-sm text-muted-foreground">
//             Overview of leads, deals & revenue
//           </p>
//         </div>
//         <div className="flex flex-col sm:flex-row gap-2">
//           <Select value={range} onValueChange={setRange}>
//             <SelectTrigger className="w-[160px]">
//               <SelectValue placeholder="Date Range" />
//             </SelectTrigger>
//             <SelectContent>
//               {DATE_RANGES.map((r) => (
//                 <SelectItem key={r.id} value={r.id}>
//                   {r.label}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>

//           <Select value={salesperson} onValueChange={setSalesperson}>
//             <SelectTrigger className="w-[160px]">
//               <SelectValue placeholder="Salesperson" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem key="all" value="all">
//                 All Team
//               </SelectItem>
//               {salesUsers.map((p) => (
//                 <SelectItem key={p._id} value={p._id}>
//                   {p.firstName}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>

//           <div className="relative">
//             <Input
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               placeholder="Search"
//               className="pr-10"
//             />
//             <Filter className="absolute top-2 right-3 w-4 h-4 text-muted-foreground" />
//           </div>

//           <Button variant="secondary" onClick={loadDashboard}>
//             <RefreshCw className="w-4 h-4 mr-2" /> Refresh
//           </Button>
//         </div>
//       </div>

//       {/* KPI Cards */}
//       <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//         {summary.map((s, i) => (
//           <StatCard
//             key={i}
//             icon={[Users2, Target, TrendingUp, CalendarClock][i]}
//             label={s.label}
//             value={s.value}
//           />
//         ))}
//       </motion.div>

//       {/* Charts */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
//         <Card className="p-4">
//           <CardHeader>
//             <CardTitle>Revenue & Deals</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <ResponsiveContainer width="100%" height={250}>
//               <LineChart data={monthlyData}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="month" />
//                 <YAxis />
//                 <Tooltip />
//                 <Legend />
//                 <Line type="monotone" dataKey="revenue" stroke="#0EA5E9" />
//                 <Line type="monotone" dataKey="deals" stroke="#22C55E" />
//               </LineChart>
//             </ResponsiveContainer>
//           </CardContent>
//         </Card>

//         <Card className="p-4">
//           <CardHeader>
//             <CardTitle>Invoice Status</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <ResponsiveContainer width="100%" height={250}>
//               <PieChart>
//                 <Pie
//                   data={recentInvoices}
//                   dataKey="total"
//                   nameKey="status"
//                   outerRadius={80}
//                 >
//                   {recentInvoices.map((entry, index) => (
//                     <Cell
//                       key={index}
//                       fill={COLORS[index % COLORS.length]}
//                     />
//                   ))}
//                 </Pie>
//                 <Tooltip />
//                 <Legend />
//               </PieChart>
//             </ResponsiveContainer>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Recent Leads Table */}
//       <Card>
//         <CardHeader>
//           <CardTitle>Recent Leads</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <Table>
//             <TableHeader>
//               <TableRow>
//                 <TableHead>Name</TableHead>
//                 <TableHead>Email</TableHead>
//                 <TableHead>Status</TableHead>
//                 <TableHead>Created At</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {recentLeads.map((lead) => (
//                 <TableRow key={lead._id}>
//                   <TableCell>{lead.name}</TableCell>
//                   <TableCell>{lead.email}</TableCell>
//                   <TableCell>{lead.status}</TableCell>
//                   <TableCell>
//                     {new Date(lead.createdAt).toLocaleDateString()}
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }
