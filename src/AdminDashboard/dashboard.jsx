import React, { useEffect, useState, useCallback } from "react";
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
  Globe,
  Receipt,
  BarChart3,
  Target,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import axios from "axios";
import { cn } from "../lib/utils";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";

const API_URL = import.meta.env.VITE_API_URL;

// Supported currencies
const allowedCurrencies = [
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "INR", symbol: "₹", name: "Indian Rupee" },
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "JPY", symbol: "¥", name: "Japanese Yen" },
  { code: "AUD", symbol: "A$", name: "Australian Dollar" },
  { code: "CAD", symbol: "C$", name: "Canadian Dollar" },
  { code: "CHF", symbol: "CHF", name: "Swiss Franc" },
  { code: "MYR", symbol: "RM", name: "Malaysian Ringgit" },
  { code: "AED", symbol: "د.إ", name: "UAE Dirham" },
  { code: "SGD", symbol: "S$", name: "Singapore Dollar" },
  { code: "ZAR", symbol: "R", name: "South African Rand" },
  { code: "SAR", symbol: "﷼", name: "Saudi Riyal" },
];

/* ---------- Date Helpers ---------- */
const formatDate = (d) => {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

const getMonthRange = (month, year) => ({
  start: formatDate(new Date(year, month, 1)),
  end: formatDate(new Date(year, month + 1, 0)),
});

const getYearRange = (year) => ({
  start: formatDate(new Date(year, 0, 1)),
  end: formatDate(new Date(year, 11, 31)),
});

const getTodayRange = () => {
  const today = new Date();
  return { start: formatDate(today), end: formatDate(today) };
};

const getLast7DaysRange = () => {
  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - 6);
  return { start: formatDate(start), end: formatDate(end) };
};

const months = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const BASE_COLORS = [
  "#8B5CF6", "#3B82F6", "#10B981", "#F59E0B",
  "#EF4444", "#6366F1", "#EC4899", "#06B6D4",
];

// ─── Deal Stage Helpers ───────────────────────────────────────────────────────
// These cover all common stage name variations your backend might use.
const isOpenDeal = (stage = "") => {
  const s = stage.toLowerCase();
  return (
    s.includes("open") ||
    s.includes("qualification") ||
    s.includes("proposal") ||
    s.includes("negotiation") ||
    s.includes("prospect") ||
    s.includes("new") ||
    s.includes("in progress")
  );
};

const isWonDeal = (stage = "") => {
  const s = stage.toLowerCase();
  return s.includes("won") || s.includes("closed won") || s.includes("win");
};

const isLostDeal = (stage = "") => {
  const s = stage.toLowerCase();
  return s.includes("lost") || s.includes("closed lost") || s.includes("lose");
};

/* ---------- Currency Display ---------- */
const CurrencyDisplay = ({ value, currency = "USD", className }) => {
  const currencyInfo =
    allowedCurrencies.find((c) => c.code === currency) || allowedCurrencies[0];
  return (
    <div className={cn("flex items-baseline gap-1", className)}>
      <span className="text-lg font-semibold text-gray-600">
        {currencyInfo.symbol}
      </span>
      <span className="text-2xl font-bold text-gray-900">
        {Number(value).toLocaleString()}
      </span>
      <span className="text-sm font-medium text-gray-500 ml-1">
        {currencyInfo.code}
      </span>
    </div>
  );
};

/* ---------- Summary Card ---------- */
const SummaryCard = ({ title, value, change, color, icon, loading }) => {
  if (loading) {
    return (
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardContent className="p-5">
          <Skeleton className="h-5 w-20 mb-3" />
          <Skeleton className="h-8 w-16 mb-2" />
          <Skeleton className="h-4 w-24" />
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 100 }}
    >
      <Card
        className={cn(
          "border-0 shadow-lg bg-white/80 backdrop-blur-sm overflow-hidden relative",
          { "bg-blue-50/50": color === "blue" },
          { "bg-green-50/50": color === "green" },
          { "bg-purple-50/50": color === "purple" },
          { "bg-orange-50/50": color === "orange" }
        )}
      >
        <CardContent className="p-5">
          <div className="flex justify-between items-start mb-3">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-2">{title}</p>
              <div className="text-2xl font-bold text-gray-900">
                {value?.toLocaleString() ?? 0}
              </div>
            </div>
            <div
              className={cn("p-2 rounded-xl", {
                "bg-blue-100 text-blue-600": color === "blue",
                "bg-green-100 text-green-600": color === "green",
                "bg-purple-100 text-purple-600": color === "purple",
                "bg-orange-100 text-orange-600": color === "orange",
              })}
            >
              {icon}
            </div>
          </div>
          <div className="flex items-center">
            {change >= 0 ? (
              <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
            ) : (
              <ArrowDownRight className="h-4 w-4 text-red-500 mr-1" />
            )}
            <span
              className={cn(
                "text-sm font-medium",
                change >= 0 ? "text-green-500" : "text-red-500"
              )}
            >
              {change >= 0 ? `+${change}%` : `${change}%`}
            </span>
            <span className="text-xs text-gray-500 ml-2">vs previous</span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

/* ---------- Currency Breakdown Card ---------- */
const CurrencyBreakdownCard = ({ revenueData, loading }) => {
  if (loading) return <Skeleton className="h-64 w-full rounded-lg" />;

  const currencies = Object.entries(revenueData)
    .filter(([, data]) => data.amount > 0)
    .map(([currency, data]) => ({
      currency,
      amount: Number(data.amount),
      count: data.count,
    }))
    .sort((a, b) => b.amount - a.amount);

  const totalRevenue = currencies.reduce((sum, curr) => sum + curr.amount, 0);

  return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Globe className="h-5 w-5 text-purple-600" />
            Revenue by Currency
          </CardTitle>
          <Badge variant="secondary">{currencies.length} Currencies</Badge>
        </div>
        <div className="mt-4 p-4 bg-white/60 rounded-lg border">
          <div className="text-sm font-medium text-gray-600 mb-1">
            Total Revenue
          </div>
          <div className="text-2xl font-bold text-gray-900">
            ${totalRevenue.toLocaleString()}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {currencies.length > 0 ? (
          currencies.map(({ currency, amount, count }, index) => {
            const info = allowedCurrencies.find((c) => c.code === currency);
            return (
              <div
                key={currency}
                className="flex items-center justify-between p-3 bg-white/60 rounded-lg border"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{
                      backgroundColor: BASE_COLORS[index % BASE_COLORS.length],
                    }}
                  />
                  <div>
                    <div className="font-semibold text-gray-800 text-sm">
                      {info?.name ?? currency}
                    </div>
                    <div className="text-xs text-gray-500">{info?.code ?? currency}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-gray-900 text-sm">
                    {info?.symbol ?? ""}{amount.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-500">{count} invoices</div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-6 text-gray-500">
            No revenue data for this period
          </div>
        )}
      </CardContent>
    </Card>
  );
};

/* ---------- Pending Invoices Card ---------- */
const PendingInvoicesCard = ({ invoices, loading }) => {
  if (loading) return <Skeleton className="h-64 w-full rounded-lg" />;

  const pending = (invoices ?? []).filter(
    (inv) =>
      inv.status === "pending" ||
      inv.status === "unpaid" ||
      inv.status === "Pending" ||
      inv.status === "Unpaid"
  );

  const byCurrency = {};
  pending.forEach((inv) => {
    const curr = inv.currency || "USD";
    const amt = Number(inv.total ?? inv.amount ?? inv.grandTotal ?? 0);
    if (amt > 0) {
      byCurrency[curr] = byCurrency[curr] || { amount: 0, count: 0 };
      byCurrency[curr].amount += amt;
      byCurrency[curr].count += 1;
    }
  });

  const currencies = Object.entries(byCurrency)
    .filter(([, data]) => data.amount > 0)
    .map(([currency, data]) => ({
      currency,
      amount: data.amount,
      count: data.count,
    }))
    .sort((a, b) => b.amount - a.amount);

  const totalPending = currencies.reduce((sum, curr) => sum + curr.amount, 0);

  return (
    <Card className="shadow-lg border-0 bg-blue-50/50 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Receipt className="h-5 w-5 text-blue-600" />
            Pending Invoices
          </CardTitle>
          <Badge variant="secondary">{pending.length} Invoices</Badge>
        </div>
        <div className="mt-4 p-4 bg-white/50 rounded-lg border border-blue-200">
          <div className="text-sm font-medium text-gray-600 mb-1">
            Total Pending
          </div>
          <div className="text-2xl font-bold text-gray-900">
            ${totalPending.toLocaleString()}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {currencies.length > 0 ? (
          currencies.map(({ currency, amount, count }, index) => {
            const info = allowedCurrencies.find((c) => c.code === currency);
            return (
              <div
                key={currency}
                className="flex items-center justify-between p-3 bg-white/50 rounded-lg border border-blue-200"
              >
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-400" />
                  <div>
                    <div className="font-semibold text-gray-800 text-sm">
                      {info?.name ?? currency}
                    </div>
                    <div className="text-xs text-gray-500">
                      {info?.code ?? currency}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-gray-900 text-sm">
                    {info?.symbol ?? ""}{amount.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-500">{count} pending</div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-6 text-gray-500">
            No pending invoices
          </div>
        )}
      </CardContent>
    </Card>
  );
};

/* ---------- Revenue Trend Chart ---------- */
const RevenueTrendChart = ({ revenueData, loading, invoices }) => {
  const [selectedCurrency, setSelectedCurrency] = useState("ALL");

  // Build per-month data from invoices
  const chartData = months.map((month) => {
    const entry = { month };
    allowedCurrencies.forEach((c) => (entry[c.code] = 0));
    entry.total = 0;
    return entry;
  });

  (invoices ?? []).forEach((inv) => {
    const date = new Date(inv.createdAt ?? inv.date ?? inv.invoiceDate);
    if (isNaN(date)) return;
    const monthEntry = chartData[date.getMonth()];
    const amount = Number(inv.total ?? inv.amount ?? inv.grandTotal ?? 0);
    const currency = inv.currency || "USD";
    if (monthEntry) {
      monthEntry[currency] = (monthEntry[currency] || 0) + amount;
      monthEntry.total += amount;
    }
  });

  // Only show currencies that have data
  const activeCurrencies = allowedCurrencies.filter((c) =>
    chartData.some((d) => d[c.code] > 0)
  );

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload || payload.length === 0) return null;
    return (
      <div className="bg-white p-4 rounded-lg shadow-xl border text-sm">
        <p className="font-semibold mb-2">{label}</p>
        {payload
          .filter((p) => p.value > 0)
          .map((p, i) => (
            <div key={i} className="flex justify-between gap-4">
              <span className="flex items-center gap-1">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ background: p.color }}
                />
                {p.dataKey}
              </span>
              <strong>${p.value?.toLocaleString()}</strong>
            </div>
          ))}
      </div>
    );
  };

  const totalAll = Object.values(revenueData).reduce(
    (s, d) => s + (Number(d.amount) || 0),
    0
  );

  return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm h-full">
      <CardHeader className="pb-4 border-b">
        <div className="flex justify-between items-center flex-wrap gap-2">
          <CardTitle className="text-xl flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-purple-600" />
            Revenue Trend
          </CardTitle>
          <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Currency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Currencies</SelectItem>
              {allowedCurrencies.map((c) => (
                <SelectItem key={c.code} value={c.code}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="mt-2">
          {selectedCurrency === "ALL" ? (
            <p className="text-2xl font-semibold">
              ${totalAll.toLocaleString()}
            </p>
          ) : (
            <CurrencyDisplay
              value={revenueData[selectedCurrency]?.amount || 0}
              currency={selectedCurrency}
            />
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        {loading ? (
          <Skeleton className="h-64 w-full" />
        ) : (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#E5E7EB"
                />
                <XAxis
                  dataKey="month"
                  tick={{ fill: "#6B7280", fontSize: 12 }}
                />
                <YAxis
                  tick={{ fill: "#6B7280", fontSize: 12 }}
                  tickFormatter={(v) => `$${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`}
                />
                <Tooltip content={<CustomTooltip />} />
                {selectedCurrency === "ALL" ? (
                  activeCurrencies.length > 0 ? (
                    activeCurrencies.map((c, idx) => (
                      <Line
                        key={c.code}
                        type="monotone"
                        dataKey={c.code}
                        stroke={BASE_COLORS[idx % BASE_COLORS.length]}
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 4 }}
                      />
                    ))
                  ) : (
                    // Fallback: show total line
                    <Line
                      type="monotone"
                      dataKey="total"
                      stroke="#8B5CF6"
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 4 }}
                    />
                  )
                ) : (
                  <Line
                    type="monotone"
                    dataKey={selectedCurrency}
                    stroke="#8B5CF6"
                    strokeWidth={3}
                    dot={{ r: 4, fill: "#8B5CF6" }}
                    activeDot={{ r: 6 }}
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

/* ---------- Sales Pipeline Chart ---------- */
const SalesPipelineChart = ({ data, loading, totalLeads }) => {
  if (loading) return <Skeleton className="h-80 w-full rounded-lg" />;

  const totalOpen = data.reduce((s, d) => s + d.Open, 0);
  const totalWon = data.reduce((s, d) => s + d.Won, 0);

  return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader className="pb-4 border-b">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-600" />
            Sales Pipeline
          </CardTitle>
          <Badge variant="secondary">{totalLeads} Leads</Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#E5E7EB"
              />
              <XAxis dataKey="month" tick={{ fill: "#6B7280", fontSize: 12 }} />
              <YAxis
                tick={{ fill: "#6B7280", fontSize: 12 }}
                allowDecimals={false}
              />
              <Tooltip
                formatter={(value, name) => [value, name]}
                contentStyle={{
                  borderRadius: "8px",
                  border: "1px solid #e5e7eb",
                }}
              />
              <Legend />
              <Bar
                dataKey="Open"
                fill="#3B82F6"
                barSize={20}
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="Won"
                fill="#10B981"
                barSize={20}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-center gap-6 mt-2 text-sm">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-blue-500 inline-block" />
            Open: <strong>{totalOpen}</strong>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-green-500 inline-block" />
            Won: <strong>{totalWon}</strong>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

/* ---------- Deal Distribution Pie Chart ---------- */
const DealDistributionChart = ({ data, loading, totalDeals }) => {
  if (loading) return <Skeleton className="h-80 w-full rounded-lg" />;

  const pieData = [
    { name: "Open", value: data.open, color: "#3B82F6" },
    { name: "Won", value: data.won, color: "#10B981" },
    { name: "Lost", value: data.lost, color: "#F59E0B" },
  ].filter((d) => d.value > 0);

  return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader className="pb-4 border-b">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl flex items-center gap-2">
            <Target className="h-5 w-5 text-blue-600" />
            Deal Distribution
          </CardTitle>
          <Badge variant="secondary">{totalDeals} Total</Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        {totalDeals === 0 ? (
          <div className="h-56 flex flex-col items-center justify-center text-gray-400">
            <Target className="h-12 w-12 mb-2 opacity-30" />
            <p>No deals for this period</p>
          </div>
        ) : (
          <>
            <div className="h-56 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                    labelLine={false}
                  >
                    {pieData.map((entry, idx) => (
                      <Cell
                        key={idx}
                        fill={entry.color}
                        stroke="#fff"
                        strokeWidth={2}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name) => [value, name]}
                    contentStyle={{
                      borderRadius: "8px",
                      border: "1px solid #e5e7eb",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center">
                  <div className="text-2xl font-bold">{totalDeals}</div>
                  <div className="text-xs text-gray-500">Total</div>
                </div>
              </div>
            </div>
            <div className="flex justify-center gap-4 mt-2 text-sm flex-wrap">
              {pieData.map((d) => (
                <div key={d.name} className="flex items-center gap-1.5">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ background: d.color }}
                  />
                  {d.name}: <strong>{d.value}</strong>
                </div>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

/* ═══════════════════════════════════════════════════════════
   Main Dashboard
═══════════════════════════════════════════════════════════ */
const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activePreset, setActivePreset] = useState("today");
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Raw data
  const [leads, setLeads] = useState([]);
  const [deals, setDeals] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [revenueByCurrency, setRevenueByCurrency] = useState({});

  // Derived
  const [summaryCards, setSummaryCards] = useState([]);
  const [pipelineLeads, setPipelineLeads] = useState(0);
  const [pipelineBarData, setPipelineBarData] = useState([]);
  const [dealCounts, setDealCounts] = useState({ open: 0, won: 0, lost: 0 });

  /* ---- Date Range Helpers ---- */
  const getDateRange = useCallback(
    (preset = activePreset, month = selectedMonth, year = selectedYear) => {
      if (preset === "today") return getTodayRange();
      if (preset === "7days") return getLast7DaysRange();
      if (preset === "month") return getMonthRange(month, year);
      if (preset === "year") return getYearRange(year);
      return getTodayRange();
    },
    [activePreset, selectedMonth, selectedYear]
  );

  const getPreviousRange = useCallback(() => {
    if (activePreset === "today") {
      const d = new Date();
      d.setDate(d.getDate() - 1);
      return { start: formatDate(d), end: formatDate(d) };
    }
    if (activePreset === "7days") {
      const end = new Date();
      end.setDate(end.getDate() - 7);
      const start = new Date();
      start.setDate(start.getDate() - 13);
      return { start: formatDate(start), end: formatDate(end) };
    }
    if (activePreset === "month") {
      const d = new Date(selectedYear, selectedMonth, 1);
      d.setMonth(d.getMonth() - 1);
      return getMonthRange(d.getMonth(), d.getFullYear());
    }
    if (activePreset === "year") return getYearRange(selectedYear - 1);
    return getTodayRange();
  }, [activePreset, selectedMonth, selectedYear]);

  /* ---- Fetch ---- */
  const fetchAll = useCallback(async (range) => {
    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };
    const params = { start: range.start, end: range.end };

    // NOTE: We fetch ALL data without date params so we always get full year
    // for the trend chart, but filter summary cards by the chosen range.
    // Adjust this based on whether your backend supports date filtering.
    const [leadsRes, dealsRes, invoicesRes] = await Promise.all([
      axios.get(`${API_URL}/leads/getAllLead`, { params, headers }),
      axios.get(`${API_URL}/deals/getAll`, { params, headers }),
      axios.get(`${API_URL}/invoice/getInvoice`, { params, headers }),
    ]);

    // Normalise array responses
    const normalise = (res) => {
      const d = res.data;
      if (Array.isArray(d)) return d;
      if (d && Array.isArray(d.data)) return d.data;
      if (d && Array.isArray(d.leads)) return d.leads;
      if (d && Array.isArray(d.deals)) return d.deals;
      if (d && Array.isArray(d.invoices)) return d.invoices;
      return [];
    };

    return {
      leads: normalise(leadsRes),
      deals: normalise(dealsRes),
      invoices: normalise(invoicesRes),
    };
  }, []);

  const computeChange = (current, previous) => {
    if (previous === 0) return current === 0 ? 0 : 100;
    return Number(
      (((current - previous) / Math.abs(previous)) * 100).toFixed(1)
    );
  };

  /* ---- Main fetch + derive ---- */
  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const currentRange = getDateRange();
      const [current, previous] = await Promise.all([
        fetchAll(currentRange),
        fetchAll(getPreviousRange()),
      ]);

      // ── Store raw data for charts ──
      setLeads(current.leads);
      setDeals(current.deals);
      setInvoices(current.invoices);

      // ── Revenue by currency (from invoices) ──
      // Falls back to checking multiple amount field names
      const revenue = {};
      current.invoices.forEach((inv) => {
        const curr = inv.currency || "USD";
        const amt = Number(
          inv.total ?? inv.amount ?? inv.grandTotal ?? inv.totalAmount ?? 0
        );
        if (amt > 0) {
          revenue[curr] = revenue[curr] || { amount: 0, count: 0 };
          revenue[curr].amount += amt;
          revenue[curr].count += 1;
        }
      });
      setRevenueByCurrency(revenue);

      // ── Summary card values ──
      const totalLeads = current.leads.length;
      const dealsWon = current.deals.filter((d) => isWonDeal(d.stage)).length;
      const totalRevenue = Object.values(revenue).reduce(
        (s, d) => s + d.amount,
        0
      );
      const pendingCount = current.invoices.filter(
        (inv) =>
          inv.status?.toLowerCase() === "pending" ||
          inv.status?.toLowerCase() === "unpaid"
      ).length;

      // Previous revenue
      const prevRevenue = {};
      previous.invoices.forEach((inv) => {
        const curr = inv.currency || "USD";
        const amt = Number(
          inv.total ?? inv.amount ?? inv.grandTotal ?? inv.totalAmount ?? 0
        );
        if (amt > 0) {
          prevRevenue[curr] = prevRevenue[curr] || { amount: 0 };
          prevRevenue[curr].amount += amt;
        }
      });
      const prevTotalRevenue = Object.values(prevRevenue).reduce(
        (s, d) => s + d.amount,
        0
      );

      setSummaryCards([
        {
          title: "Total Leads",
          value: totalLeads,
          change: computeChange(totalLeads, previous.leads.length),
          color: "blue",
          icon: <Users className="h-5 w-5" />,
        },
        {
          title: "Deals Won",
          value: dealsWon,
          change: computeChange(
            dealsWon,
            previous.deals.filter((d) => isWonDeal(d.stage)).length
          ),
          color: "green",
          icon: <Trophy className="h-5 w-5" />,
        },
        {
          title: "Total Revenue",
          value: totalRevenue,
          change: computeChange(totalRevenue, prevTotalRevenue),
          color: "purple",
          icon: <DollarSign className="h-5 w-5" />,
        },
        {
          title: "Pending Invoices",
          value: pendingCount,
          change: computeChange(
            pendingCount,
            previous.invoices.filter(
              (inv) =>
                inv.status?.toLowerCase() === "pending" ||
                inv.status?.toLowerCase() === "unpaid"
            ).length
          ),
          color: "orange",
          icon: <FileText className="h-5 w-5" />,
        },
      ]);

      // ── Pipeline leads count ──
      setPipelineLeads(totalLeads);

      // ── Pipeline bar chart: Open / Won per month ──
      // We always build all 12 months so the chart always has shape.
      // But only the months that have data will have bars.
      const barData = months.map((month, mIdx) => {
        const monthDeals = current.deals.filter((d) => {
          const date = new Date(d.createdAt ?? d.date ?? d.updatedAt);
          return !isNaN(date) && date.getMonth() === mIdx;
        });
        return {
          month,
          Open: monthDeals.filter((d) => isOpenDeal(d.stage)).length,
          Won: monthDeals.filter((d) => isWonDeal(d.stage)).length,
        };
      });
      setPipelineBarData(barData);

      // ── Deal distribution ──
      const openCount = current.deals.filter((d) => isOpenDeal(d.stage)).length;
      const wonCount = dealsWon;
      const lostCount = current.deals.filter((d) => isLostDeal(d.stage)).length;
      setDealCounts({ open: openCount, won: wonCount, lost: lostCount });

      // Confetti 🎉
      if (
        dealsWon > 5 &&
        dealsWon > previous.deals.filter((d) => isWonDeal(d.stage)).length
      ) {
        confetti({ particleCount: 140, spread: 90, origin: { y: 0.6 } });
      }
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      setError(
        "Failed to load dashboard data. Check your network connection."
      );
    } finally {
      setLoading(false);
    }
  }, [getDateRange, getPreviousRange, fetchAll]);

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 60_000);
    return () => clearInterval(interval);
  }, [fetchDashboardData]);

  /* ─────────────────────────────────────── RENDER ─────────────────────────── */
  return (
    <div className="p-6 space-y-6 min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <BarChart3 className="h-8 w-8 text-purple-600" />
            Business Dashboard
          </h1>
          <p className="text-gray-600 mt-1">
            Real-time insights and performance metrics
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Period selector */}
          <Select value={activePreset} onValueChange={setActivePreset}>
            <SelectTrigger className="w-[160px] bg-white border">
              <SelectValue placeholder="Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="7days">Last 7 Days</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>

          {/* Month selector (month / year presets) */}
          {(activePreset === "month" || activePreset === "year") && (
            <Select
              value={String(selectedMonth)}
              onValueChange={(v) => setSelectedMonth(Number(v))}
            >
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Month" />
              </SelectTrigger>
              <SelectContent>
                {months.map((m, idx) => (
                  <SelectItem key={idx} value={String(idx)}>
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {/* Year selector */}
          {activePreset === "year" && (
            <Select
              value={String(selectedYear)}
              onValueChange={(v) => setSelectedYear(Number(v))}
            >
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                {[2023, 2024, 2025, 2026].map((y) => (
                  <SelectItem key={y} value={String(y)}>
                    {y}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
          <span>⚠️</span> {error}
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {loading
          ? Array(4)
              .fill(0)
              .map((_, i) => <SummaryCard key={i} loading />)
          : summaryCards.map((card) => (
              <SummaryCard key={card.title} {...card} loading={false} />
            ))}
      </div>

      {/* Currency Breakdown + Revenue Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-1 space-y-5">
          <CurrencyBreakdownCard
            revenueData={revenueByCurrency}
            loading={loading}
          />
          <PendingInvoicesCard invoices={invoices} loading={loading} />
        </div>
        <div className="lg:col-span-2">
          <RevenueTrendChart
            revenueData={revenueByCurrency}
            loading={loading}
            invoices={invoices}
          />
        </div>
      </div>

      {/* Sales Pipeline + Deal Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <SalesPipelineChart
          data={pipelineBarData}
          loading={loading}
          totalLeads={pipelineLeads}
        />
        <DealDistributionChart
          data={dealCounts}
          loading={loading}
          totalDeals={deals.length}
        />
      </div>
    </div>
  );
};

export default AdminDashboard;