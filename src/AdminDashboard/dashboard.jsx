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
  Globe,
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
  Receipt,
  BarChart3,
} from "lucide-react";
import axios from "axios";
import { cn } from "../lib/utils";
import { motion } from "framer-motion";
import CountUp from "react-countup";
import confetti from "canvas-confetti";

const API_URL = import.meta.env.VITE_API_URL;

// Supported currencies with symbols and formatting
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
    start.setDate(start.getDate() - 13);
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

const BASE_COLORS = [
  "#8B5CF6", "#3B82F6", "#10B981", "#F59E0B",
  "#EF4444", "#6366F1", "#EC4899", "#06B6D4"
];

// Enhanced gradient color palette for Deal Performance with attractive colors
const GRADIENT_COLORS = [
  { from: "#3B82F6", to: "#60A5FA" }, // Blue gradient for Open
  { from: "#10B981", to: "#34D399" }, // Green gradient for Won
  { from: "#F59E0B", to: "#FBBF24" }, // Amber gradient for Lost
];

// Special attractive colors for Open and Won states
const ATTRACTIVE_COLORS = {
  open: [
    { from: "#6366F1", to: "#8B5CF6" }, // Vibrant purple to indigo
    { from: "#3B82F6", to: "#06B6D4" }, // Blue to cyan
  ],
  won: [
    { from: "#10B981", to: "#84CC16" }, // Emerald to lime
    { from: "#059669", to: "#65A30D" }, // Green to olive
  ],
  lost: [
    { from: "#EF4444", to: "#F97316" }, // Red to orange
  ]
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

/* Currency Display Component */
const CurrencyDisplay = ({ value, currency = "USD", className = "" }) => {
  const currencyInfo = allowedCurrencies.find(c => c.code === currency) || allowedCurrencies[0];
  const numericValue = Number(value) || 0;
 
  // Remove leading zeros and format properly
  const formattedValue = numericValue.toLocaleString();
 
  return (
    <div className={cn("flex items-baseline gap-1", className)}>
      <span className="text-lg font-semibold text-gray-600">{currencyInfo.symbol}</span>
      <span className="text-2xl font-bold text-gray-900">
        {formattedValue}
      </span>
      <span className="text-sm font-medium text-gray-500 ml-1">{currencyInfo.code}</span>
    </div>
  );
};

/* Enhanced Currency Breakdown Component with Total Revenue */
const CurrencyBreakdownCard = ({ revenueData, loading }) => {
  if (loading) {
    return (
      <Card className="shadow-lg border-0 overflow-hidden relative bg-gradient-to-br from-slate-50 to-gray-100/80 backdrop-blur-sm">
        <CardContent className="p-6">
          <Skeleton className="h-6 w-32 mb-4" />
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Filter out currencies with zero or negative amounts and remove leading zeros
  const currencies = Object.entries(revenueData)
    .filter(([_, data]) => data.amount > 0)
    .map(([currency, data]) => ({
      currency,
      amount: Number(data.amount),
      count: data.count
    }))
    .sort((a, b) => b.amount - a.amount);

  // Calculate total revenue
  const totalRevenue = currencies.reduce((sum, curr) => sum + curr.amount, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
    >
      <Card className="shadow-lg border-0 overflow-hidden relative bg-gradient-to-br from-slate-50 to-gray-100/80 backdrop-blur-sm">
        <CardBubbles seed={5} count={6} colorPalette={["#8B5CF6", "#A78BFA", "#C4B5FD"]} />
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg text-gray-800 flex items-center gap-2">
              <Globe className="h-5 w-5 text-purple-600" />
              Revenue by Currency
            </CardTitle>
            <Badge variant="secondary" className="bg-white/80 backdrop-blur-sm text-xs">
              {currencies.length} Currencies
            </Badge>
          </div>
         
          {/* Total Revenue Display */}
          <div className="mt-4 p-4 bg-white/60 rounded-lg border border-gray-200/50 backdrop-blur-sm">
            <div className="text-sm font-medium text-gray-600 mb-1">Total Revenue</div>
            <div className="text-2xl font-bold text-gray-900">
              ${totalRevenue.toLocaleString()}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Across all currencies
            </div>
          </div>
        </CardHeader>
       
        <CardContent className="space-y-3">
          {currencies.length > 0 ? (
            currencies.map(({ currency, amount, count }, index) => {
              const currencyInfo = allowedCurrencies.find(c => c.code === currency);
             
              return (
                <motion.div
                  key={currency}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 bg-white/60 rounded-lg border border-gray-200/50 backdrop-blur-sm hover:bg-white/80 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: BASE_COLORS[index % BASE_COLORS.length] }}
                    />
                    <div>
                      <div className="font-semibold text-gray-800 text-sm">{currencyInfo?.name}</div>
                      <div className="text-xs text-gray-500">{currencyInfo?.code}</div>
                    </div>
                  </div>
                 
                  <div className="text-right">
                    <div className="font-bold text-gray-900 text-sm">
                      {currencyInfo?.symbol}{amount.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500">{count || 0} invoices</div>
                  </div>
                </motion.div>
              );
            })
          ) : (
            <div className="text-center py-6 text-gray-500">
              <CreditCard className="h-8 w-8 mx-auto mb-2 opacity-40" />
              <p className="text-sm">No revenue data</p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

/* Enhanced Pending Invoices Card with Light Weight Colors */
const PendingInvoicesCard = ({ invoicesData, loading }) => {
  if (loading) {
    return (
      <Card className="shadow-lg border-0 overflow-hidden relative bg-gradient-to-br from-blue-50/60 to-indigo-50/50 backdrop-blur-sm">
        <CardContent className="p-6">
          <Skeleton className="h-6 w-32 mb-4" />
          <div className="space-y-3">
            {[1, 2].map(i => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const pendingInvoices = invoicesData?.filter(inv =>
    inv.status === 'pending' || inv.status === 'unpaid'
  ) || [];

  const pendingByCurrency = {};
  pendingInvoices.forEach(invoice => {
    const currency = invoice.currency || 'USD';
    const amount = Number(invoice.total) || 0;
    if (amount > 0) {
      if (!pendingByCurrency[currency]) {
        pendingByCurrency[currency] = { amount: 0, count: 0 };
      }
      pendingByCurrency[currency].amount += amount;
      pendingByCurrency[currency].count += 1;
    }
  });

  // Filter out zero amounts and remove leading zeros
  const currencies = Object.entries(pendingByCurrency)
    .filter(([_, data]) => data.amount > 0)
    .map(([currency, data]) => ({
      currency,
      amount: Number(data.amount),
      count: data.count
    }))
    .sort((a, b) => b.amount - a.amount);

  // Calculate total pending amount
  const totalPending = currencies.reduce((sum, curr) => sum + curr.amount, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
    >
      <Card className="shadow-lg border-0 overflow-hidden relative bg-gradient-to-br from-blue-50/60 to-indigo-50/50 backdrop-blur-sm">
        <CardBubbles seed={6} count={5} colorPalette={["#3B82F6", "#60A5FA", "#93C5FD"]} />
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg text-gray-800 flex items-center gap-2">
              <Receipt className="h-5 w-5 text-blue-600" />
              Pending Invoices
            </CardTitle>
            <Badge variant="secondary" className="bg-white/80 backdrop-blur-sm text-xs">
              {currencies.length} Currencies
            </Badge>
          </div>
         
          {/* Total Pending Display */}
          <div className="mt-4 p-4 bg-white/50 rounded-lg border border-blue-200/30 backdrop-blur-sm">
            <div className="text-sm font-medium text-gray-600 mb-1">Total Pending</div>
            <div className="text-2xl font-bold text-gray-900">
              ${totalPending.toLocaleString()}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Awaiting payment
            </div>
          </div>
        </CardHeader>
       
        <CardContent className="space-y-3">
          {currencies.length > 0 ? (
            currencies.map(({ currency, amount, count }, index) => {
              const currencyInfo = allowedCurrencies.find(c => c.code === currency);
             
              return (
                <motion.div
                  key={currency}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 bg-white/50 rounded-lg border border-blue-200/30 backdrop-blur-sm hover:bg-white/70 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-blue-400" />
                    <div>
                      <div className="font-semibold text-gray-800 text-sm">{currencyInfo?.name}</div>
                      <div className="text-xs text-gray-500">{currencyInfo?.code}</div>
                    </div>
                  </div>
                 
                  <div className="text-right">
                    <div className="font-bold text-gray-900 text-sm">
                      {currencyInfo?.symbol}{amount.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500">{count || 0} pending</div>
                  </div>
                </motion.div>
              );
            })
          ) : (
            <div className="text-center py-6 text-gray-500">
              <FileText className="h-8 w-8 mx-auto mb-2 opacity-40" />
              <p className="text-sm">No pending invoices</p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

/* Enhanced Revenue Trend Chart with Sharp Design */
const RevenueTrendChart = ({ revenueData, loading, activePreset, selectedMonth, selectedYear, recentInvoices }) => {
  const [selectedCurrency, setSelectedCurrency] = useState('ALL');

  // Show ALL allowed currencies in dropdown, not just those with data
  const currencyOptions = [
    { code: 'ALL', name: 'All Currencies' },
    ...allowedCurrencies.map(currency => ({
      code: currency.code,
      name: currency.name
    }))
  ];

  // Build chart data from actual invoices
  const buildChartData = () => {
    if (!recentInvoices || recentInvoices.length === 0) return [];

    const monthlyData = {};
   
    // Get currencies from revenueData that have actual amounts
    const currenciesWithData = Object.entries(revenueData)
      .filter(([_, data]) => data.amount > 0)
      .map(([currency]) => currency);
   
    recentInvoices.forEach(invoice => {
      const invoiceDate = new Date(invoice.createdAt || invoice.date || new Date());
      const monthKey = invoiceDate.toLocaleString('default', { month: 'short' });
      const amount = Number(invoice.total) || 0;
      const currency = invoice.currency || 'USD';
     
      if (amount > 0) {
        if (!monthlyData[monthKey]) {
          monthlyData[monthKey] = { month: monthKey };
          // Initialize all allowed currencies with 0
          allowedCurrencies.forEach(curr => {
            monthlyData[monthKey][curr.code] = 0;
          });
          monthlyData[monthKey].total = 0;
        }
       
        monthlyData[monthKey][currency] = (monthlyData[monthKey][currency] || 0) + amount;
        monthlyData[monthKey].total += amount;
      }
    });

    // Fill in missing months with zero values
    const allMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return allMonths.map(month => {
      const data = monthlyData[month] || { month, total: 0 };
      // Ensure all currencies are present
      allowedCurrencies.forEach(currency => {
        if (data[currency.code] === undefined) {
          data[currency.code] = 0;
        }
      });
      return data;
    });
  };

  const chartData = buildChartData();

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload || payload.length === 0) return null;
   
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-4 rounded-lg shadow-xl border border-gray-200/80 backdrop-blur-sm min-w-48"
      >
        <div className="text-sm font-semibold text-gray-800 mb-2">{label}</div>
        {selectedCurrency === 'ALL' ? (
          <>
            <div className="text-sm text-gray-600 mb-2">
              Total: <strong>${payload.reduce((sum, p) => sum + (p.value || 0), 0).toLocaleString()}</strong>
            </div>
            {payload
              .filter(p => p.value > 0)
              .map((p, i) => (
                <div key={i} className="text-sm text-gray-600 mt-1 flex items-center justify-between">
                  <div className="flex items-center">
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
                    {p.dataKey}
                  </div>
                  <strong className="ml-2">${p.value?.toLocaleString()}</strong>
                </div>
              ))}
          </>
        ) : (
          <div className="text-sm text-gray-600 flex items-center justify-between">
            <div className="flex items-center">
              <span
                style={{
                  display: "inline-block",
                  width: 10,
                  height: 10,
                  background: payload[0]?.color,
                  marginRight: 8,
                  borderRadius: "50%",
                }}
              />
              {selectedCurrency}
            </div>
            <strong className="ml-2">${payload[0]?.value?.toLocaleString()}</strong>
          </div>
        )}
      </motion.div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.45 }}
      whileHover={{ y: -2 }}
    >
      <Card className="shadow-lg border-0 overflow-hidden relative bg-white/80 backdrop-blur-sm h-full hover:shadow-xl transition-all duration-300">
        <CardBubbles
          seed={21}
          count={8}
          colorPalette={["#8B5CF6", "#A78BFA", "#C4B5FD"]}
        />
        <CardHeader className="pb-4 border-b border-gray-200/50">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex-1">
              <CardTitle className="text-xl text-gray-800 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-purple-600" />
                Revenue Trend
              </CardTitle>
              <CardDescription>
                {selectedCurrency === 'ALL' ? 'Monthly revenue across all currencies' : `Monthly revenue in ${selectedCurrency}`}
              </CardDescription>
            </div>
           
            <div className="flex items-center gap-3">
              <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
                <SelectTrigger className="w-[180px] bg-white/90 backdrop-blur-sm border-gray-200 shadow-sm">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  {currencyOptions.map(option => (
                    <SelectItem key={option.code} value={option.code}>
                      {option.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-sm text-gray-500">Current Period</p>
              <div className="text-2xl font-semibold text-gray-900">
                {selectedCurrency === 'ALL' ? (
                  `$${Object.values(revenueData).reduce((sum, curr) => sum + (Number(curr.amount) || 0), 0).toLocaleString()}`
                ) : (
                  <CurrencyDisplay
                    value={revenueData[selectedCurrency]?.amount || 0}
                    currency={selectedCurrency}
                    className="text-2xl"
                  />
                )}
              </div>
            </div>

            <Badge variant="secondary" className="bg-white/80 backdrop-blur-sm">
              {selectedCurrency === 'ALL' ? `${allowedCurrencies.length} Currencies` : selectedCurrency}
            </Badge>
          </div>

          {loading ? (
            <Skeleton className="h-64 w-full rounded-lg" />
          ) : chartData.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={chartData}
                  margin={{ top: 6, right: 20, left: 0, bottom: 6 }}
                >
                  <defs>
                    {selectedCurrency === 'ALL' ? (
                      allowedCurrencies.map((currency, index) => (
                        <linearGradient
                          key={currency.code}
                          id={`gradient-${currency.code}`}
                          x1="0" x2="0" y1="0" y2="1"
                        >
                          <stop offset="0%" stopColor={BASE_COLORS[index % BASE_COLORS.length]} stopOpacity={0.8} />
                          <stop offset="100%" stopColor={BASE_COLORS[index % BASE_COLORS.length]} stopOpacity={0.1} />
                        </linearGradient>
                      ))
                    ) : (
                      <linearGradient id="revGrad" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.8} />
                        <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0.1} />
                      </linearGradient>
                    )}
                  </defs>
                 
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#E5E7EB"
                    opacity={0.5}
                  />
                 
                  <XAxis
                    dataKey="month"
                    axisLine={{ stroke: '#E5E7EB', strokeWidth: 1 }}
                    tickLine={false}
                    tick={{ fill: '#6B7280', fontSize: 12, fontWeight: 500 }}
                  />
                 
                  <YAxis
                    axisLine={{ stroke: '#E5E7EB', strokeWidth: 1 }}
                    tickLine={false}
                    tick={{ fill: '#6B7280', fontSize: 12, fontWeight: 500 }}
                    tickFormatter={(value) => `$${value.toLocaleString()}`}
                  />
                 
                  <Tooltip content={<CustomTooltip />} />
                 
                  {selectedCurrency === 'ALL' ? (
                    allowedCurrencies.map((currency, index) => (
                      <Line
                        key={currency.code}
                        type="monotone"
                        dataKey={currency.code}
                        stroke={BASE_COLORS[index % BASE_COLORS.length]}
                        strokeWidth={3}
                        dot={{
                          stroke: BASE_COLORS[index % BASE_COLORS.length],
                          strokeWidth: 2,
                          r: 4,
                          fill: "#fff",
                        }}
                        activeDot={{
                          r: 6,
                          stroke: "#fff",
                          strokeWidth: 2,
                          fill: BASE_COLORS[index % BASE_COLORS.length],
                        }}
                        isAnimationActive={true}
                        animationBegin={index * 200}
                        animationDuration={2000}
                        animationEasing="ease-out"
                        connectNulls={false}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    ))
                  ) : (
                    <Line
                      type="monotone"
                      dataKey={selectedCurrency}
                      stroke="#8B5CF6"
                      strokeWidth={3}
                      dot={{
                        stroke: "#8B5CF6",
                        strokeWidth: 2,
                        r: 4,
                        fill: "#fff"
                      }}
                      activeDot={{
                        r: 8,
                        stroke: "#fff",
                        strokeWidth: 3,
                        fill: "#8B5CF6",
                      }}
                      isAnimationActive={true}
                      animationDuration={2000}
                      animationEasing="ease-out"
                      connectNulls={false}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  )}
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <BarChart3 className="h-12 w-12 mx-auto mb-2 opacity-40" />
                <p>No revenue data available</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};


/* Enhanced Sales Pipeline Component */
const SalesPipelineChart = ({ pipelineBarData, loading, totalPipelineLeads }) => {
  const [hoveredBar, setHoveredBar] = useState(null);

  const CustomPipelineTooltip = ({ active, payload, label }) => {
    if (!active || !payload || payload.length === 0) return null;
   
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-4 rounded-lg shadow-xl border border-gray-200/80 backdrop-blur-sm min-w-48"
      >
        <div className="text-sm font-semibold text-gray-800 mb-3">{label}</div>
        {payload.map((p, i) => (
          <div key={i} className="text-sm text-gray-600 mt-2 flex items-center justify-between">
            <div className="flex items-center">
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
              {p.name}
            </div>
            <strong className="ml-2">{p.value} deals</strong>
          </div>
        ))}
        <div className="mt-3 pt-2 border-t border-gray-200">
          <div className="text-sm font-medium text-gray-700">
            Total: {payload.reduce((sum, p) => sum + p.value, 0)} deals
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.45 }}
      whileHover={{ y: -2 }}
    >
      <Card className="shadow-lg border-0 overflow-hidden relative bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
        <CardBubbles
          seed={11}
          count={8}
          colorPalette={["#3B82F6", "#60A5FA", "#93C5FD"]}
        />
        <CardHeader className="pb-4 border-b border-gray-200/50">
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl text-gray-800 flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              Sales Pipeline Analytics
            </CardTitle>
            <Badge
              variant="secondary"
              className="bg-white/80 backdrop-blur-sm"
            >
              {totalPipelineLeads} Total Deals
            </Badge>
          </div>
          <CardDescription>
            Monthly breakdown of open opportunities vs won deals with performance metrics
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-6 relative">
          {loading ? (
            <div className="h-64">
              <Skeleton className="h-64 w-full rounded-lg" />
            </div>
          ) : (
            <motion.div
              layout
              initial={{ opacity: 0.6 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={pipelineBarData}
                    margin={{ top: 20, right: 12, left: 0, bottom: 20 }}
                    onMouseMove={(data) => {
                      if (data.activePayload) {
                        setHoveredBar(data.activeLabel);
                      }
                    }}
                    onMouseLeave={() => setHoveredBar(null)}
                  >
                    <defs>
                      <linearGradient id="gOpen" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.9} />
                        <stop offset="100%" stopColor="#3B82F6" stopOpacity={0.2} />
                      </linearGradient>
                      <linearGradient id="gWon" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="#10B981" stopOpacity={0.9} />
                        <stop offset="100%" stopColor="#10B981" stopOpacity={0.2} />
                      </linearGradient>
                    </defs>
                   
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="rgba(0,0,0,0.05)"
                    />
                   
                    <XAxis
                      dataKey="month"
                      tickLine={false}
                      axisLine={{ stroke: '#E5E7EB', strokeWidth: 1 }}
                      tick={{ fill: '#6B7280', fontSize: 12 }}
                      interval={0}
                    />
                   
                    <YAxis
                      tickLine={false}
                      axisLine={{ stroke: '#E5E7EB', strokeWidth: 1 }}
                      tick={{ fill: '#6B7280', fontSize: 12 }}
                    />
                   
                    <Tooltip content={<CustomPipelineTooltip />} />
                   
                    <Bar
                      dataKey="Open"
                      name="Open Opportunities"
                      fill="url(#gOpen)"
                      barSize={24}
                      radius={[4, 4, 0, 0]}
                      isAnimationActive={true}
                      animationBegin={400}
                      animationDuration={1500}
                      onMouseEnter={() => setHoveredBar('Open')}
                      onMouseLeave={() => setHoveredBar(null)}
                    />
                    <Bar
                      dataKey="Won"
                      name="Won Deals"
                      fill="url(#gWon)"
                      barSize={24}
                      radius={[4, 4, 0, 0]}
                      isAnimationActive={true}
                      animationBegin={800}
                      animationDuration={1500}
                      onMouseEnter={() => setHoveredBar('Won')}
                      onMouseLeave={() => setHoveredBar(null)}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-6 space-y-3">
                <div className="flex gap-4 justify-center">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-lg border border-blue-200"
                  >
                    <span className="w-3 h-3 rounded-full bg-[#3B82F6]" />
                    <span className="text-sm font-medium text-gray-700">Open Opportunities</span>
                    <Badge variant="secondary" className="bg-white">
                      {pipelineBarData.reduce((sum, d) => sum + d.Open, 0)}
                    </Badge>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center gap-2 px-3 py-2 bg-green-50 rounded-lg border border-green-200"
                  >
                    <span className="w-3 h-3 rounded-full bg-[#10B981]" />
                    <span className="text-sm font-medium text-gray-700">Won Deals</span>
                    <Badge variant="secondary" className="bg-white">
                      {pipelineBarData.reduce((sum, d) => sum + d.Won, 0)}
                    </Badge>
                  </motion.div>
                </div>
               
                <div className="flex justify-center gap-6 text-xs text-gray-500">
                  <div className="text-center">
                    <div className="font-semibold text-gray-700">
                      {((pipelineBarData.reduce((sum, d) => sum + d.Won, 0) /
                         pipelineBarData.reduce((sum, d) => sum + (d.Open + d.Won), 0)) * 100 || 0).toFixed(1)}%
                    </div>
                    <div>Win Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-gray-700">
                      {pipelineBarData.reduce((sum, d) => sum + d.Open, 0)}
                    </div>
                    <div>Active Pipeline</div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

/* Enhanced Deal Distribution Component with Attractive Animations */
const DealDistributionChart = ({ pieData, loading, totalDeals }) => {
  const [activeSlice, setActiveSlice] = useState(-1);
  const [animationKey, setAnimationKey] = useState(0);

  // Enhanced animated gradient component with attractive colors
  const AnimatedGradientCell = ({ index, isActive, entry }) => {
    const gradientId = `gradient-${index}`;
   
    // Use special attractive colors for Open and Won states
    let colorSet;
    if (entry.name === 'Open') {
      colorSet = ATTRACTIVE_COLORS.open[index % ATTRACTIVE_COLORS.open.length];
    } else if (entry.name === 'Won') {
      colorSet = ATTRACTIVE_COLORS.won[index % ATTRACTIVE_COLORS.won.length];
    } else {
      colorSet = ATTRACTIVE_COLORS.lost[index % ATTRACTIVE_COLORS.lost.length];
    }
   
    return (
      <>
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={colorSet.from} />
            <stop offset="100%" stopColor={colorSet.to} />
          </linearGradient>
        </defs>
        <Cell
          key={`cell-${index}`}
          fill={`url(#${gradientId})`}
          stroke="#fff"
          strokeWidth={isActive ? 4 : 2}
          style={{
            transition: "all 400ms ease",
            transform: isActive ? "scale(1.08)" : "scale(1)",
            filter: isActive
              ? `drop-shadow(0 12px 24px ${colorSet.from}60)`
              : "drop-shadow(0 4px 8px rgba(0,0,0,0.15))",
            opacity: isActive ? 1 : 0.95,
          }}
          onMouseEnter={() => setActiveSlice(index)}
          onMouseLeave={() => setActiveSlice(-1)}
        />
      </>
    );
  };

  const CustomPieTooltip = ({ active, payload }) => {
    if (!active || !payload || payload.length === 0) return null;
   
    const data = payload[0].payload;
    const entryIndex = pieData.findIndex(p => p.name === data.name);
   
    let colorSet;
    if (data.name === 'Open') {
      colorSet = ATTRACTIVE_COLORS.open[entryIndex % ATTRACTIVE_COLORS.open.length];
    } else if (data.name === 'Won') {
      colorSet = ATTRACTIVE_COLORS.won[entryIndex % ATTRACTIVE_COLORS.won.length];
    } else {
      colorSet = ATTRACTIVE_COLORS.lost[entryIndex % ATTRACTIVE_COLORS.lost.length];
    }
   
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white p-4 rounded-lg shadow-xl border border-gray-200/80 backdrop-blur-sm min-w-48"
      >
        <div className="text-sm font-semibold text-gray-800 mb-2 flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{
              background: `linear-gradient(135deg, ${colorSet.from}, ${colorSet.to})`
            }}
          />
          {data.name}
        </div>
        <div className="text-lg font-bold text-gray-900 mb-1">{data.value} deals</div>
        <div className="text-sm text-gray-600">{data.percentage}% of total</div>
        <div className="mt-2 text-xs text-gray-500">
          {data.name === 'Open' && 'Active opportunities in pipeline'}
          {data.name === 'Won' && 'Successfully closed deals'}
          {data.name === 'Lost' && 'Unsuccessful opportunities'}
        </div>
      </motion.div>
    );
  };

  // Trigger re-animation when data changes
  useEffect(() => {
    setAnimationKey(prev => prev + 1);
  }, [pieData]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      whileHover={{ y: -2 }}
    >
      <Card className="shadow-lg border-0 overflow-hidden relative bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
        <CardBubbles
          seed={41}
          count={8}
          colorPalette={[...ATTRACTIVE_COLORS.open.flatMap(c => [c.from, c.to]), ...ATTRACTIVE_COLORS.won.flatMap(c => [c.from, c.to])]}
        />
        <CardHeader className="pb-4 border-b border-gray-200/50">
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl text-gray-800 flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-600" />
              Deal Performance Analytics
            </CardTitle>
            <Badge variant="secondary" className="bg-white/80 backdrop-blur-sm">
              {totalDeals} Total Deals
            </Badge>
          </div>
          <CardDescription>
            Comprehensive breakdown of deal status with conversion insights
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-6">
          {loading ? (
            <Skeleton className="h-64 w-full rounded-lg" />
          ) : pieData.filter((p) => p.value > 0).length > 0 ? (
            <motion.div
              key={animationKey}
              initial={{ scale: 0.98, opacity: 0.9 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.45 }}
              className="space-y-6"
            >
              {/* Enhanced Animated Pie Chart with Attractive Colors */}
              <div className="h-56 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData.filter((p) => p.value > 0)}
                      cx="50%"
                      cy="50%"
                      outerRadius={activeSlice >= 0 ? 90 : 85}
                      innerRadius={50}
                      dataKey="value"
                      nameKey="name"
                      isAnimationActive={true}
                      animationBegin={500}
                      animationDuration={1800}
                      animationEasing="ease-out"
                      paddingAngle={2}
                    >
                      {pieData
                        .filter((p) => p.value > 0)
                        .map((entry, idx) => (
                          <AnimatedGradientCell
                            key={idx}
                            index={idx}
                            isActive={idx === activeSlice}
                            entry={entry}
                          />
                        ))}
                    </Pie>
                    <Tooltip content={<CustomPieTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
               
                {/* Enhanced Center Text with Pulsing Animation */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 1, type: "spring", stiffness: 200 }}
                    className="text-center"
                  >
                    <motion.div
                      animate={{
                        scale: [1, 1.08, 1],
                        rotate: [0, 2, -2, 0]
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className="text-2xl font-bold text-gray-900"
                    >
                      {totalDeals}
                    </motion.div>
                    <div className="text-xs text-gray-500 mt-1">Total Deals</div>
                  </motion.div>
                </div>
              </div>

              {/* Enhanced Detailed Breakdown with Attractive Animations */}
              <div className="space-y-3">
                {pieData
                  .filter((p) => p.value > 0)
                  .map((p, i) => {
                    let colorSet;
                    if (p.name === 'Open') {
                      colorSet = ATTRACTIVE_COLORS.open[i % ATTRACTIVE_COLORS.open.length];
                    } else if (p.name === 'Won') {
                      colorSet = ATTRACTIVE_COLORS.won[i % ATTRACTIVE_COLORS.won.length];
                    } else {
                      colorSet = ATTRACTIVE_COLORS.lost[i % ATTRACTIVE_COLORS.lost.length];
                    }
                   
                    return (
                      <motion.div
                        key={p.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8 + i * 0.1 }}
                        whileHover={{
                          scale: 1.03,
                          x: 6,
                        }}
                        className="flex items-center justify-between p-3 rounded-lg border backdrop-blur-sm cursor-pointer transition-all duration-300 group relative overflow-hidden"
                        style={{
                          background: `linear-gradient(135deg, ${colorSet.from}15, ${colorSet.to}10)`,
                          borderColor: `${colorSet.from}40`,
                        }}
                        onMouseEnter={() => setActiveSlice(i)}
                        onMouseLeave={() => setActiveSlice(-1)}
                      >
                        {/* Animated background effect */}
                        <motion.div
                          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          style={{
                            background: `linear-gradient(135deg, ${colorSet.from}12, ${colorSet.to}08)`,
                          }}
                        />
                       
                        <div className="flex items-center gap-3 relative z-10">
                          <motion.div
                            animate={{
                              scale: activeSlice === i ? 1.4 : 1,
                              rotate: activeSlice === i ? [0, 10, -10, 0] : 0,
                            }}
                            transition={{
                              type: "spring",
                              stiffness: 300,
                              rotate: { duration: 0.6 }
                            }}
                            className="w-3 h-3 rounded-full relative"
                            style={{
                              background: `linear-gradient(135deg, ${colorSet.from}, ${colorSet.to})`
                            }}
                          >
                            {activeSlice === i && (
                              <motion.div
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="absolute inset-0 rounded-full bg-current opacity-30"
                                style={{
                                  animation: "ping 2s infinite",
                                  transform: "scale(1.5)"
                                }}
                              />
                            )}
                          </motion.div>
                          <div>
                            <div className="font-semibold text-gray-800 text-sm group-hover:text-gray-900 transition-colors">
                              {p.name}
                            </div>
                            <div className="text-xs text-gray-500">
                              {p.name === 'Open' && 'Active in pipeline'}
                              {p.name === 'Won' && 'Successfully closed'}
                              {p.name === 'Lost' && 'Did not convert'}
                            </div>
                          </div>
                        </div>
                       
                        <div className="text-right relative z-10">
                          <div className="font-bold text-gray-900 text-sm group-hover:text-gray-950 transition-colors">
                            {p.value} <span className="text-gray-400">deals</span>
                          </div>
                          <div
                            className="text-xs font-medium group-hover:font-semibold transition-all"
                            style={{
                              background: `linear-gradient(135deg, ${colorSet.from}, ${colorSet.to})`,
                              WebkitBackgroundClip: 'text',
                              WebkitTextFillColor: 'transparent',
                              backgroundClip: 'text',
                            }}
                          >
                            {p.percentage}%
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
               
                {/* Enhanced Performance Summary with Gradient */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 }}
                  className="mt-4 p-4 rounded-lg border backdrop-blur-sm relative overflow-hidden"
                  style={{
                    background: `linear-gradient(135deg, #3B82F610, #60A5FA08)`,
                    borderColor: '#3B82F620',
                  }}
                >
                  <div className="text-xs text-gray-600 mb-2 font-medium relative z-10">Performance Summary</div>
                  <div className="flex justify-between text-sm relative z-10">
                    <div className="text-center flex-1">
                      <div className="font-bold text-gray-800 text-lg">
                        {((pieData.find(p => p.name === 'Won')?.value || 0) / totalDeals * 100).toFixed(1)}%
                      </div>
                      <div className="text-xs text-gray-600">Win Rate</div>
                    </div>
                    <div className="text-center flex-1 border-l border-blue-200">
                      <div className="font-bold text-gray-800 text-lg">
                        {((pieData.find(p => p.name === 'Won')?.value || 0) /
                          (pieData.find(p => p.name === 'Open')?.value || 1) * 100).toFixed(1)}%
                      </div>
                      <div className="text-xs text-gray-600">Conversion Rate</div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <Target className="h-12 w-12 mx-auto mb-2 opacity-40" />
                <p>No deal distribution data</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
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

  // Currency state
  const [revenueByCurrency, setRevenueByCurrency] = useState({});
  const [lineAnimationKey, setLineAnimationKey] = useState(0);

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

  /* ---------- Currency calculation helpers ---------- */
  const calculateRevenueByCurrency = (invoices) => {
    const revenue = {};
   
    invoices.forEach(invoice => {
      const currency = invoice.currency || 'USD';
      const amount = Number(invoice.total) || 0;
     
      // Only add if amount is positive
      if (amount > 0) {
        if (!revenue[currency]) {
          revenue[currency] = { amount: 0, count: 0 };
        }
        revenue[currency].amount += amount;
        revenue[currency].count += 1;
      }
    });

    return revenue;
  };

  const getTotalRevenue = (revenueData) => {
    return Object.values(revenueData).reduce((total, curr) => total + (Number(curr.amount) || 0), 0);
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

      // Calculate revenue by currency
      const currencyRevenue = calculateRevenueByCurrency(resInvoices.data || []);

      // Calculate changes
      const totalLeadsChange = computeChange(curr.totalLeads || 0, prev.totalLeads || 0);
      const totalDealsWonChange = computeChange(curr.totalDealsWon || 0, prev.totalDealsWon || 0);
     
      const currentTotalRevenue = getTotalRevenue(currencyRevenue);
      const previousTotalRevenue = getTotalRevenue(calculateRevenueByCurrency(prev.recentInvoices || []));
      const totalRevenueChange = computeChange(currentTotalRevenue, previousTotalRevenue);
     
      const pendingInvoicesChange = computeChange(curr.pendingInvoices || 0, prev.pendingInvoices || 0);

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
          color: "green",
          icon: <Trophy className="h-5 w-5" />,
          colorPalette: ["#10B981", "#34D399", "#6EE7B7"],
        },
        {
          title: "Total Revenue",
          value: currentTotalRevenue,
          change: totalRevenueChange,
          color: "purple",
          icon: <DollarSign className="h-5 w-5" />,
          colorPalette: ["#8B5CF6", "#A78BFA", "#C4B5FD"],
        },
        {
          title: "Pending Invoices",
          value: curr.pendingInvoices || 0,
          change: pendingInvoicesChange,
          color: "orange",
          icon: <FileText className="h-5 w-5" />,
          colorPalette: ["#F59E0B", "#FBBF24", "#FCD34D"],
        },
      ];

      setSummary(summaryCards);
      setPipeline(resPipeline.data || []);
      setRecentInvoices(resInvoices.data || []);
      setRevenueByCurrency(currencyRevenue);

      if ((curr.totalDealsWon || 0) > 5 && totalDealsWonChange > 0) {
        confetti({ particleCount: 140, spread: 90, origin: { y: 0.6 } });
      }

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
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
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

  /* ---------- Chart data builders ---------- */
  const buildRevenueTrend = (invoices, preset) => {
    if (!invoices || invoices.length === 0) return [];

    const byMonth = {};
    invoices.forEach((inv) => {
      const d = new Date(inv.createdAt);
      const m = d.toLocaleString("default", { month: "short" });
      const amount = Number(inv.total) || 0;
      if (amount > 0) {
        byMonth[m] = (byMonth[m] || 0) + amount;
      }
    });

    return [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ].map((m) => ({
      month: m,
      total: byMonth[m] || 0,
    }));
  };

  const invoiceChartData = buildRevenueTrend(recentInvoices, activePreset);
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

  const totalPipelineLeads = pipeline.reduce((acc, s) => acc + (s.leads || 0), 0);

  /* ---------- Enhanced Summary Card Component ---------- */
  const SummaryCard = ({ title, value, change, color, icon, colorPalette, loading }) => {
    if (loading) {
      return (
        <Card className="overflow-hidden border-0 shadow-lg bg-white/80 backdrop-blur-sm">
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
        initial={{ opacity: 0, y: 12, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{
          type: "spring",
          stiffness: 100,
          damping: 12,
        }}
        whileHover={{
          y: -4,
          scale: 1.02,
          transition: { duration: 0.2 }
        }}
      >
        <Card
          className={cn(
            "overflow-hidden border-0 shadow-lg transition-all duration-300 relative bg-white/80 backdrop-blur-sm hover:shadow-xl",
            {
              "bg-blue-50/50": color === "blue",
              "bg-green-50/50": color === "green",
              "bg-purple-50/50": color === "purple",
              "bg-orange-50/50": color === "orange",
            }
          )}
        >
          <CardBubbles
            seed={Math.random() * 10}
            count={6}
            colorPalette={colorPalette || BASE_COLORS}
          />

          <CardContent className="p-5 relative">
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-2">
                  {title}
                </p>
                <div className="text-2xl font-bold text-gray-900">
                  {(value || 0).toLocaleString()}
                </div>
              </div>
              <motion.div
                className={cn("p-2 rounded-xl", {
                  "bg-blue-100 text-blue-600": color === "blue",
                  "bg-green-100 text-green-600": color === "green",
                  "bg-purple-100 text-purple-600": color === "purple",
                  "bg-orange-100 text-orange-600": color === "orange",
                })}
                whileHover={{ scale: 1.08, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                {icon}
              </motion.div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {change >= 0 ? (
                  <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 text-red-500 mr-1" />
                )}
                <span
                  className={cn("text-sm font-medium", {
                    "text-green-500": change >= 0,
                    "text-red-500": change < 0,
                  })}
                >
                  {change >= 0 ? `+${change}%` : `${change}%`}
                </span>
              </div>
              <span className="text-xs text-gray-500">vs previous</span>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  /* ---------- UI ---------- */
  return (
    <div className="p-6 space-y-6 min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-indigo-50/20">
      {/* Background bubbles */}
      <div className="absolute inset-0 -z-20 pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full opacity-[0.03]"
            initial={{ scale: 0.95 }}
            animate={{
              y: [0, i % 2 === 0 ? -30 : 30, 0],
              x: [0, i % 3 === 0 ? 40 : -20, 0],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 15 + (i % 8),
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.7,
            }}
            style={{
              width: 160 + i * 25,
              height: 160 + i * 25,
              top: `${(i * 15) % 100}%`,
              left: `${(i * 20) % 100}%`,
              background: `radial-gradient(circle, ${BASE_COLORS[i % BASE_COLORS.length]}, transparent)`,
            }}
          />
        ))}
      </div>

      {/* Header */}
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
              <BarChart3 className="h-8 w-8 text-purple-600" />
            </motion.div>
            Business Dashboard
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-gray-600 mt-1"
          >
            Real-time insights and performance metrics
          </motion.p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Select value={activePreset} onValueChange={(v) => applyPreset(v)}>
            <SelectTrigger className="w-[160px] bg-white/90 backdrop-blur-sm border-gray-200 shadow-sm">
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
              <SelectTrigger className="w-[130px] bg-white/90 backdrop-blur-sm border-gray-200 shadow-sm">
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
              <SelectTrigger className="w-[100px] bg-white/90 backdrop-blur-sm border-gray-200 shadow-sm">
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
          className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg relative z-10"
        >
          {error}
        </motion.div>
      )}

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 relative z-10">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <SummaryCard key={i} loading={true} />
            ))
          : summary.map((card, idx) => (
              <SummaryCard
                key={card.title}
                title={card.title}
                value={card.value}
                change={card.change}
                color={card.color}
                icon={card.icon}
                colorPalette={card.colorPalette}
                loading={false}
              />
            ))}
      </div>

      {/* Currency Breakdown + Revenue Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 relative z-10">
        {/* Currency Breakdown */}
        <div className="lg:col-span-1 space-y-5">
          <CurrencyBreakdownCard
            revenueData={revenueByCurrency}
            loading={loading}
          />
          <PendingInvoicesCard
            invoicesData={recentInvoices}
            loading={loading}
          />
        </div>

        {/* Revenue Chart */}
        <div className="lg:col-span-2">
          <RevenueTrendChart
            revenueData={revenueByCurrency}
            loading={loading}
            activePreset={activePreset}
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
            recentInvoices={recentInvoices}
          />
        </div>
      </div>

      {/* Pipeline + Deals Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 relative z-10">
        {/* Enhanced Sales Pipeline */}
        <SalesPipelineChart
          pipelineBarData={pipelineBarData}
          loading={loading}
          totalPipelineLeads={totalPipelineLeads}
        />

        {/* Enhanced Deal Distribution */}
        <DealDistributionChart
          pieData={pieData}
          loading={loading}
          totalDeals={totalDeals}
        />
      </div>
    </div>
  );
};

export default AdminDashboard;//original code..
