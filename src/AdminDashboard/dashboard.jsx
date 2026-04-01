import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  Card, CardContent, CardHeader, CardTitle,
} from "../components/ui/card";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend,
} from "recharts";
import { Skeleton } from "../components/ui/skeleton";
import { Badge } from "../components/ui/badge";
import {
  Users, Trophy, DollarSign, FileText, TrendingUp, Globe,
  Receipt, BarChart3, Target, ArrowUpRight, ArrowDownRight,
  CalendarDays, ChevronDown,
} from "lucide-react";
import axios from "axios";
import { cn } from "../lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

const API_URL = import.meta.env.VITE_API_URL;

const allowedCurrencies = [
  { code: "USD", symbol: "$",   name: "US Dollar" },
  { code: "EUR", symbol: "€",   name: "Euro" },
  { code: "INR", symbol: "₹",   name: "Indian Rupee" },
  { code: "GBP", symbol: "£",   name: "British Pound" },
  { code: "JPY", symbol: "¥",   name: "Japanese Yen" },
  { code: "AUD", symbol: "A$",  name: "Australian Dollar" },
  { code: "CAD", symbol: "C$",  name: "Canadian Dollar" },
  { code: "CHF", symbol: "CHF", name: "Swiss Franc" },
  { code: "MYR", symbol: "RM",  name: "Malaysian Ringgit" },
  { code: "AED", symbol: "د.إ", name: "UAE Dirham" },
  { code: "SGD", symbol: "S$",  name: "Singapore Dollar" },
  { code: "ZAR", symbol: "R",   name: "South African Rand" },
  { code: "SAR", symbol: "﷼",   name: "Saudi Riyal" },
];

/* ═══════════════════════════════════════════════════════════════
   DATE HELPERS
═══════════════════════════════════════════════════════════════ */
const formatDate = (d) => {
  const yyyy = d.getFullYear();
  const mm   = String(d.getMonth() + 1).padStart(2, "0");
  const dd   = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

const formatDisplay = (dateStr) => {
  if (!dateStr) return "";
  const [y, m, d] = dateStr.split("-");
  const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${d} ${monthNames[parseInt(m) - 1]} ${y}`;
};

const todayStr     = () => formatDate(new Date());
const yesterdayStr = () => { const d = new Date(); d.setDate(d.getDate() - 1); return formatDate(d); };
const daysAgoStr   = (n)  => { const d = new Date(); d.setDate(d.getDate() - n); return formatDate(d); };

const startOfMonthStr = (offsetMonths = 0) => {
  const d = new Date(); d.setMonth(d.getMonth() + offsetMonths, 1); return formatDate(d);
};
const endOfMonthStr = (offsetMonths = 0) => {
  const d = new Date(); d.setMonth(d.getMonth() + offsetMonths + 1, 0); return formatDate(d);
};
const startOfYearStr = (offsetYears = 0) => formatDate(new Date(new Date().getFullYear() + offsetYears, 0, 1));
const endOfYearStr   = (offsetYears = 0) => formatDate(new Date(new Date().getFullYear() + offsetYears, 11, 31));

const DATE_PRESETS = [
  { label: "Today",        key: "today",     getRange: () => ({ start: todayStr(),           end: todayStr() }) },
  { label: "Yesterday",    key: "yesterday", getRange: () => ({ start: yesterdayStr(),        end: yesterdayStr() }) },
  { label: "Last 7 Days",  key: "7days",     getRange: () => ({ start: daysAgoStr(6),         end: todayStr() }) },
  { label: "Last 30 Days", key: "30days",    getRange: () => ({ start: daysAgoStr(29),        end: todayStr() }) },
  { label: "This Month",   key: "thisMonth", getRange: () => ({ start: startOfMonthStr(0),    end: endOfMonthStr(0) }) },
  { label: "Last Month",   key: "lastMonth", getRange: () => ({ start: startOfMonthStr(-1),   end: endOfMonthStr(-1) }) },
  { label: "This Year",    key: "thisYear",  getRange: () => ({ start: startOfYearStr(0),     end: endOfYearStr(0) }) },
  { label: "Last Year",    key: "lastYear",  getRange: () => ({ start: startOfYearStr(-1),    end: endOfYearStr(-1) }) },
  { label: "All Time",     key: "allTime",   getRange: () => ({ start: "2020-01-01",           end: todayStr() }) },
  { label: "Custom Range", key: "custom",    getRange: null },
];

const buildPreviousRange = (preset, customStart, customEnd) => {
  switch (preset) {
    case "today":     return { start: yesterdayStr(), end: yesterdayStr() };
    case "yesterday": { const d = new Date(); d.setDate(d.getDate() - 2); const s = formatDate(d); return { start: s, end: s }; }
    case "7days":     return { start: daysAgoStr(13), end: daysAgoStr(7) };
    case "30days":    return { start: daysAgoStr(59), end: daysAgoStr(30) };
    case "thisMonth": return { start: startOfMonthStr(-1), end: endOfMonthStr(-1) };
    case "lastMonth": return { start: startOfMonthStr(-2), end: endOfMonthStr(-2) };
    case "thisYear":  return { start: startOfYearStr(-1),  end: endOfYearStr(-1) };
    case "lastYear":  return { start: startOfYearStr(-2),  end: endOfYearStr(-2) };
    case "allTime":   return { start: "2020-01-01", end: todayStr() };
    case "custom": {
      if (!customStart || !customEnd) return { start: yesterdayStr(), end: yesterdayStr() };
      const days     = Math.round((new Date(customEnd) - new Date(customStart)) / 86400000) + 1;
      const prevEnd  = new Date(customStart); prevEnd.setDate(prevEnd.getDate() - 1);
      const prevFrom = new Date(prevEnd);     prevFrom.setDate(prevFrom.getDate() - days + 1);
      return { start: formatDate(prevFrom), end: formatDate(prevEnd) };
    }
    default: return { start: yesterdayStr(), end: yesterdayStr() };
  }
};

const isInRange = (record, range) => {
  const raw = record.createdAt ?? record.date ?? record.invoiceDate ?? record.updatedAt;
  if (!raw) return false;
  const d = new Date(raw);
  if (isNaN(d)) return false;
  const recDate = formatDate(d);
  return recDate >= range.start && recDate <= range.end;
};

const months     = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const BASE_COLORS = ["#8B5CF6","#3B82F6","#10B981","#F59E0B","#EF4444","#6366F1","#EC4899","#06B6D4"];

const normStage  = (s = "") => s.trim().toLowerCase();
const isWonDeal  = (s = "") => { const n = normStage(s); return n === "won" || n === "closed won" || n === "win" || n.startsWith("won") || n.endsWith("won"); };
const isLostDeal = (s = "") => { const n = normStage(s); return n === "lost" || n === "closed lost" || n === "lose" || n.startsWith("lost") || n.endsWith("lost"); };
const isOpenDeal = (s = "") => !isWonDeal(s) && !isLostDeal(s);

/* ═══════════════════════════════════════════════════════════════
   DATE FILTER DROPDOWN
═══════════════════════════════════════════════════════════════ */
const DateFilterDropdown = ({ activePreset, customStart, customEnd, onPresetChange, onCustomChange }) => {
  const [open, setOpen] = useState(false);
  const [tab,  setTab]  = useState("presets");
  const [tempStart, setTempStart] = useState(customStart || "");
  const [tempEnd,   setTempEnd]   = useState(customEnd   || "");
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => { setTempStart(customStart || ""); }, [customStart]);
  useEffect(() => { setTempEnd(customEnd     || ""); }, [customEnd]);

  const activeLabel = activePreset === "custom"
    ? (customStart && customEnd ? `${formatDisplay(customStart)} – ${formatDisplay(customEnd)}` : "Custom Range")
    : DATE_PRESETS.find((p) => p.key === activePreset)?.label ?? "Select Period";

  const applyCustom = () => {
    if (!tempStart || !tempEnd) return;
    const s = tempStart <= tempEnd ? tempStart : tempEnd;
    const e = tempStart <= tempEnd ? tempEnd   : tempStart;
    onCustomChange(s, e);
    setOpen(false);
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl shadow-sm text-sm font-medium text-gray-700 hover:border-indigo-400 hover:shadow-md transition-all min-w-[210px] justify-between"
      >
        <span className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4 text-indigo-500 flex-shrink-0" />
          <span className="truncate max-w-[160px]">{activeLabel}</span>
        </span>
        <ChevronDown className={cn("h-4 w-4 text-gray-400 transition-transform flex-shrink-0", open && "rotate-180")} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0,  scale: 1 }}
            exit={{   opacity: 0, y: -8,  scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 z-50 bg-white border border-gray-100 rounded-2xl shadow-2xl overflow-hidden"
            style={{ minWidth: 260 }}
          >
            <div className="flex border-b border-gray-100">
              {["presets", "custom"].map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={cn(
                    "flex-1 py-2.5 text-xs font-semibold transition-colors capitalize",
                    tab === t
                      ? "text-indigo-600 border-b-2 border-indigo-500 bg-indigo-50/40"
                      : "text-gray-500 hover:text-gray-700"
                  )}
                >
                  {t === "presets" ? "Quick Select" : "Custom Range"}
                </button>
              ))}
            </div>

            {tab === "presets" && (
              <div className="py-1.5 max-h-72 overflow-y-auto">
                {DATE_PRESETS.filter((p) => p.key !== "custom").map((preset) => (
                  <button
                    key={preset.key}
                    onClick={() => { onPresetChange(preset.key); setOpen(false); }}
                    className={cn(
                      "w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center justify-between",
                      activePreset === preset.key
                        ? "bg-indigo-50 text-indigo-700 font-semibold"
                        : "text-gray-700 hover:bg-gray-50"
                    )}
                  >
                    <span>{preset.label}</span>
                    {activePreset === preset.key && <span className="w-2 h-2 rounded-full bg-indigo-500" />}
                  </button>
                ))}
              </div>
            )}

            {tab === "custom" && (
              <div className="p-4 space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5">Start Date</label>
                  <input
                    type="date"
                    value={tempStart}
                    max={tempEnd || todayStr()}
                    onChange={(e) => setTempStart(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5">End Date</label>
                  <input
                    type="date"
                    value={tempEnd}
                    min={tempStart}
                    max={todayStr()}
                    onChange={(e) => setTempEnd(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  />
                </div>
                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => setOpen(false)}
                    className="flex-1 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition"
                  >Cancel</button>
                  <button
                    disabled={!tempStart || !tempEnd}
                    onClick={applyCustom}
                    className="flex-1 py-2 rounded-lg bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition disabled:opacity-40 disabled:cursor-not-allowed"
                  >Apply</button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ActiveFilterBadge = ({ activePreset, customStart, customEnd, currentRange }) => {
  const label = activePreset === "custom"
    ? `${formatDisplay(customStart)} – ${formatDisplay(customEnd)}`
    : DATE_PRESETS.find((p) => p.key === activePreset)?.label ?? "";
  return (
    <div className="flex items-center gap-2 text-sm text-gray-600 bg-white/60 px-4 py-2 rounded-xl border border-gray-100 w-fit">
      <CalendarDays className="h-4 w-4 text-indigo-500 flex-shrink-0" />
      <span>Showing: <strong className="text-indigo-700">{label}</strong></span>
      {activePreset !== "allTime" && (
        <span className="text-xs text-gray-400 hidden sm:inline">
          ({formatDisplay(currentRange.start)} – {formatDisplay(currentRange.end)})
        </span>
      )}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   SHARED COMPONENTS
═══════════════════════════════════════════════════════════════ */
const CurrencyDisplay = ({ value, currency = "USD", className }) => {
  const info = allowedCurrencies.find((c) => c.code === currency) || allowedCurrencies[0];
  return (
    <div className={cn("flex items-baseline gap-1", className)}>
      <span className="text-lg font-semibold text-gray-600">{info.symbol}</span>
      <span className="text-2xl font-bold text-gray-900">{Number(value).toLocaleString()}</span>
      <span className="text-sm font-medium text-gray-500 ml-1">{info.code}</span>
    </div>
  );
};

const SummaryCard = ({ title, value, change, color, icon, loading }) => {
  if (loading) return (
    <Card className="border-0 shadow-lg bg-white/80">
      <CardContent className="p-5">
        <Skeleton className="h-5 w-20 mb-3" /><Skeleton className="h-8 w-16 mb-2" /><Skeleton className="h-4 w-24" />
      </CardContent>
    </Card>
  );
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} whileHover={{ y: -4 }} transition={{ type: "spring", stiffness: 100 }}>
      <Card className={cn(
        "border-0 shadow-lg backdrop-blur-sm overflow-hidden",
        color === "blue"   && "bg-blue-50/60",
        color === "green"  && "bg-green-50/60",
        color === "purple" && "bg-purple-50/60",
        color === "orange" && "bg-orange-50/60",
      )}>
        <CardContent className="p-5">
          <div className="flex justify-between items-start mb-3">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-2">{title}</p>
              <div className="text-2xl font-bold text-gray-900">{value?.toLocaleString() ?? 0}</div>
            </div>
            <div className={cn("p-2 rounded-xl",
              color === "blue"   && "bg-blue-100 text-blue-600",
              color === "green"  && "bg-green-100 text-green-600",
              color === "purple" && "bg-purple-100 text-purple-600",
              color === "orange" && "bg-orange-100 text-orange-600",
            )}>{icon}</div>
          </div>
          <div className="flex items-center">
            {change >= 0
              ? <ArrowUpRight   className="h-4 w-4 text-green-500 mr-1" />
              : <ArrowDownRight className="h-4 w-4 text-red-500 mr-1" />}
            <span className={cn("text-sm font-medium", change >= 0 ? "text-green-500" : "text-red-500")}>
              {change >= 0 ? `+${change}%` : `${change}%`}
            </span>
            <span className="text-xs text-gray-500 ml-2">vs previous period</span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const CurrencyBreakdownCard = ({ revenueData, loading }) => {
  if (loading) return <Skeleton className="h-64 w-full rounded-lg" />;
  const currencies = Object.entries(revenueData)
    .filter(([, d]) => d.amount > 0)
    .map(([currency, d]) => ({ currency, amount: Number(d.amount), count: d.count }))
    .sort((a, b) => b.amount - a.amount);
  const totalRevenue = currencies.reduce((s, c) => s + c.amount, 0);
  return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2"><Globe className="h-5 w-5 text-purple-600" />Invoice Revenue by Currency</CardTitle>
          <Badge variant="secondary">{currencies.length} Currencies</Badge>
        </div>
        <div className="mt-4 p-4 bg-white/60 rounded-lg border">
          <div className="text-sm font-medium text-gray-600 mb-1">Total Revenue</div>
          <div className="text-2xl font-bold text-gray-900">${totalRevenue.toLocaleString()}</div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {currencies.length > 0 ? currencies.map(({ currency, amount, count }, idx) => {
          const info = allowedCurrencies.find((c) => c.code === currency);
          return (
            <div key={currency} className="flex items-center justify-between p-3 bg-white/60 rounded-lg border">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: BASE_COLORS[idx % BASE_COLORS.length] }} />
                <div>
                  <div className="font-semibold text-gray-800 text-sm">{info?.name ?? currency}</div>
                  <div className="text-xs text-gray-500">{info?.code ?? currency}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-gray-900 text-sm">{info?.symbol ?? ""}{amount.toLocaleString()}</div>
                <div className="text-xs text-gray-500">{count} invoices</div>
              </div>
            </div>
          );
        }) : <div className="text-center py-6 text-gray-500">No revenue data for this period</div>}
      </CardContent>
    </Card>
  );
};

const PendingInvoicesCard = ({ invoices, loading }) => {
  if (loading) return <Skeleton className="h-64 w-full rounded-lg" />;
  const pending = (invoices ?? []).filter((inv) => ["pending","unpaid"].includes((inv.status ?? "").toLowerCase()));
  const byCurrency = {};
  pending.forEach((inv) => {
    const curr = inv.currency || "USD";
    const amt  = Number(inv.total ?? inv.amount ?? inv.grandTotal ?? 0);
    if (amt > 0) { byCurrency[curr] = byCurrency[curr] || { amount: 0, count: 0 }; byCurrency[curr].amount += amt; byCurrency[curr].count++; }
  });
  const currencies   = Object.entries(byCurrency).filter(([,d]) => d.amount > 0).map(([currency, d]) => ({ currency, ...d })).sort((a,b) => b.amount - a.amount);
  const totalPending = currencies.reduce((s, c) => s + c.amount, 0);
  return (
    <Card className="shadow-lg border-0 bg-blue-50/50 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2"><Receipt className="h-5 w-5 text-blue-600" />Pending Invoices</CardTitle>
          <Badge variant="secondary">{pending.length} Invoices</Badge>
        </div>
        <div className="mt-4 p-4 bg-white/50 rounded-lg border border-blue-200">
          <div className="text-sm font-medium text-gray-600 mb-1">Total Pending</div>
          <div className="text-2xl font-bold text-gray-900">${totalPending.toLocaleString()}</div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {currencies.length > 0 ? currencies.map(({ currency, amount, count }) => {
          const info = allowedCurrencies.find((c) => c.code === currency);
          return (
            <div key={currency} className="flex items-center justify-between p-3 bg-white/50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-400" />
                <div>
                  <div className="font-semibold text-gray-800 text-sm">{info?.name ?? currency}</div>
                  <div className="text-xs text-gray-500">{info?.code ?? currency}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-gray-900 text-sm">{info?.symbol ?? ""}{amount.toLocaleString()}</div>
                <div className="text-xs text-gray-500">{count} pending</div>
              </div>
            </div>
          );
        }) : <div className="text-center py-6 text-gray-500">No pending invoices</div>}
      </CardContent>
    </Card>
  );
};

const RevenueTrendChart = ({ revenueData, loading, invoices }) => {
  const [selectedCurrency, setSelectedCurrency] = useState("ALL");
  const chartData = months.map((month) => {
    const entry = { month };
    allowedCurrencies.forEach((c) => (entry[c.code] = 0));
    entry.total = 0;
    return entry;
  });
  (invoices ?? []).forEach((inv) => {
    const date   = new Date(inv.createdAt ?? inv.date ?? inv.invoiceDate);
    if (isNaN(date)) return;
    const m      = chartData[date.getMonth()];
    const amount = Number(inv.total ?? inv.amount ?? inv.grandTotal ?? 0);
    const curr   = inv.currency || "USD";
    if (m && amount > 0) { m[curr] = (m[curr] || 0) + amount; m.total += amount; }
  });
  const activeCurrencies = allowedCurrencies.filter((c) => chartData.some((d) => d[c.code] > 0));
  const totalAll = Object.values(revenueData).reduce((s, d) => s + (Number(d.amount) || 0), 0);
  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="bg-white p-4 rounded-lg shadow-xl border text-sm">
        <p className="font-semibold mb-2">{label}</p>
        {payload.filter((p) => p.value > 0).map((p, i) => (
          <div key={i} className="flex justify-between gap-4">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full" style={{ background: p.color }} />{p.dataKey}</span>
            <strong>${p.value?.toLocaleString()}</strong>
          </div>
        ))}
      </div>
    );
  };
  return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm h-full">
      <CardHeader className="pb-4 border-b">
        <div className="flex justify-between items-center flex-wrap gap-2">
          <CardTitle className="text-xl flex items-center gap-2"><TrendingUp className="h-5 w-5 text-purple-600" />Invoice Revenue Trend</CardTitle>
          <select
            value={selectedCurrency}
            onChange={(e) => setSelectedCurrency(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            <option value="ALL">All Currencies</option>
            {allowedCurrencies.map((c) => <option key={c.code} value={c.code}>{c.name}</option>)}
          </select>
        </div>
        <div className="mt-2">
          {selectedCurrency === "ALL"
            ? <p className="text-2xl font-semibold">${totalAll.toLocaleString()}</p>
            : <CurrencyDisplay value={revenueData[selectedCurrency]?.amount || 0} currency={selectedCurrency} />}
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        {loading ? <Skeleton className="h-64 w-full" /> : (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="month" tick={{ fill: "#6B7280", fontSize: 12 }} />
                <YAxis tick={{ fill: "#6B7280", fontSize: 12 }} tickFormatter={(v) => `$${v >= 1000 ? `${(v/1000).toFixed(0)}k` : v}`} />
                <Tooltip content={<CustomTooltip />} />
                {selectedCurrency === "ALL"
                  ? activeCurrencies.length > 0
                    ? activeCurrencies.map((c, idx) => <Line key={c.code} type="monotone" dataKey={c.code} stroke={BASE_COLORS[idx % BASE_COLORS.length]} strokeWidth={2} dot={false} activeDot={{ r: 4 }} />)
                    : <Line type="monotone" dataKey="total" stroke="#8B5CF6" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
                  : <Line type="monotone" dataKey={selectedCurrency} stroke="#8B5CF6" strokeWidth={3} dot={{ r: 4, fill: "#8B5CF6" }} activeDot={{ r: 6 }} />}
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const SalesPipelineChart = ({ data, loading, totalLeads }) => {
  if (loading) return <Skeleton className="h-80 w-full rounded-lg" />;
  const hasData   = data.some((d) => d.Open > 0 || d.Won > 0);
  const totalOpen = data.reduce((s, d) => s + d.Open, 0);
  const totalWon  = data.reduce((s, d) => s + d.Won,  0);
  return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader className="pb-4 border-b">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl flex items-center gap-2"><Users className="h-5 w-5 text-blue-600" />Sales Pipeline</CardTitle>
          <Badge variant="secondary">{totalLeads} Leads</Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        {!hasData ? (
          <div className="h-72 flex flex-col items-center justify-center text-gray-400">
            <Users className="h-12 w-12 mb-2 opacity-30" /><p>No pipeline data for this period</p>
          </div>
        ) : (
          <>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="month" tick={{ fill: "#6B7280", fontSize: 12 }} />
                  <YAxis tick={{ fill: "#6B7280", fontSize: 12 }} allowDecimals={false} />
                  <Tooltip formatter={(v, n) => [v, n]} contentStyle={{ borderRadius: "8px", border: "1px solid #e5e7eb" }} />
                  <Legend />
                  <Bar dataKey="Open" fill="#3B82F6" barSize={20} radius={[4,4,0,0]} />
                  <Bar dataKey="Won"  fill="#10B981" barSize={20} radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-6 mt-2 text-sm">
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-blue-500 inline-block" />Open: <strong>{totalOpen}</strong></div>
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-green-500 inline-block" />Won: <strong>{totalWon}</strong></div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

/* ═══════════════════════════════════════════════════════════════
   DEAL DISTRIBUTION — IMPROVED LABEL WITH BACKGROUND
═══════════════════════════════════════════════════════════════ */

/**
 * Custom label that draws a white rounded rectangle behind the text,
 * ensuring full readability even over dark arcs.
 * The label is placed outside the arc with extra offset.
 */
const LABEL_OFFSET = 28; // distance from arc edge to text anchor

const renderDealLabel = ({ cx, cy, midAngle, outerRadius, name, percent, value }) => {
  if (!percent || percent === 0) return null;

  const RADIAN = Math.PI / 180;
  const sin    = Math.sin(-midAngle * RADIAN);
  const cos    = Math.cos(-midAngle * RADIAN);

  // Position the label outside the arc
  const rawX = cx + (outerRadius + LABEL_OFFSET) * cos;
  const rawY = cy + (outerRadius + LABEL_OFFSET) * sin;

  // Clamp to prevent labels from leaving the SVG viewport
  const MIN_X = 15;
  const MAX_X = 385; // approximate right boundary (depends on container)
  const MIN_Y = 20;

  let x = rawX;
  let y = rawY;

  if (x < MIN_X) x = MIN_X;
  if (x > MAX_X) x = MAX_X;
  if (y < MIN_Y) y = MIN_Y;

  // Decide text alignment based on which side of the centre the label lies
  const textAnchor = x > cx ? "start" : "end";

  // Label text: name + percentage, but also show value if you wish
  const labelText = `${name} ${(percent * 100).toFixed(0)}%`;

  // We'll return a group containing a rounded rect and the text.
  // SVG doesn't support automatic background, so we measure approximate width.
  // Approximate width based on text length (each char ~7px)
  const textWidth = labelText.length * 7.5;
  const textHeight = 18;
  const paddingX = 8;
  const paddingY = 4;

  let rectX = x;
  if (textAnchor === "end") rectX = x - textWidth - paddingX * 1.5;
  else rectX = x - paddingX / 2;

  return (
    <g>
      <rect
        x={rectX}
        y={y - textHeight / 2 - paddingY / 2}
        width={textWidth + paddingX}
        height={textHeight + paddingY}
        fill="white"
        stroke="#E2E8F0"
        strokeWidth="1"
        rx="6"
        ry="6"
        style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.05))" }}
      />
      <text
        x={x}
        y={y}
        textAnchor={textAnchor}
        dominantBaseline="middle"
        fontSize={12}
        fontWeight={600}
        fill="#1F2937"
      >
        {labelText}
      </text>
    </g>
  );
};

const DealDistributionChart = ({ data, loading, totalDeals }) => {
  if (loading) return <Skeleton className="h-80 w-full rounded-lg" />;

  const pieData = [
    { name: "Open", value: data.open, color: "#3B82F6" },
    { name: "Won",  value: data.won,  color: "#10B981" },
    { name: "Lost", value: data.lost, color: "#F59E0B" },
  ].filter((d) => d.value > 0);

  // If no deals, show empty state
  if (totalDeals === 0 || pieData.length === 0) {
    return (
      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="pb-4 border-b">
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-600" />Deal Distribution
            </CardTitle>
            <Badge variant="secondary">{totalDeals} Total</Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="h-64 flex flex-col items-center justify-center text-gray-400">
            <Target className="h-12 w-12 mb-2 opacity-30" />
            <p>No deals for this period</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader className="pb-4 border-b">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl flex items-center gap-2">
            <Target className="h-5 w-5 text-blue-600" />Deal Distribution
          </CardTitle>
          <Badge variant="secondary">{totalDeals} Total</Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        {/* 
          Increased container height to 300px, and PieChart margin top to 70px 
          to provide ample space for the top label.
        */}
        <div className="relative" style={{ height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart margin={{ top: 70, right: 35, bottom: 10, left: 35 }}>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                dataKey="value"
                labelLine={false}
                label={renderDealLabel}
              >
                {pieData.map((entry, idx) => (
                  <Cell key={`cell-${idx}`} fill={entry.color} stroke="#fff" strokeWidth={2} />
                ))}
              </Pie>
              <Tooltip
                formatter={(v, n) => [v, n]}
                contentStyle={{ borderRadius: "8px", border: "1px solid #e5e7eb" }}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* Centre total label – adjusted to align with the donut centre */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{totalDeals}</div>
              <div className="text-xs text-gray-500">Total</div>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex justify-center gap-4 mt-2 text-sm flex-wrap">
          {pieData.map((d) => (
            <div key={d.name} className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: d.color }} />
              <span>{d.name}: <strong>{d.value}</strong></span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

/* ═══════════════════════════════════════════════════════════════
   MAIN DASHBOARD
═══════════════════════════════════════════════════════════════ */
const AdminDashboard = () => {
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState(null);

  const [activePreset, setActivePreset] = useState("today");
  const [customStart,  setCustomStart]  = useState("");
  const [customEnd,    setCustomEnd]    = useState("");

  const [leads,             setLeads]             = useState([]);
  const [deals,             setDeals]             = useState([]);
  const [invoices,          setInvoices]          = useState([]);
  const [revenueByCurrency, setRevenueByCurrency] = useState({});
  const [summaryCards,      setSummaryCards]      = useState([]);
  const [pipelineLeads,     setPipelineLeads]     = useState(0);
  const [pipelineBarData,   setPipelineBarData]   = useState([]);
  const [dealCounts,        setDealCounts]        = useState({ open: 0, won: 0, lost: 0 });

  const getCurrentRange = useCallback(() => {
    if (activePreset === "custom" && customStart && customEnd) return { start: customStart, end: customEnd };
    const preset = DATE_PRESETS.find((p) => p.key === activePreset);
    return preset?.getRange?.() ?? { start: todayStr(), end: todayStr() };
  }, [activePreset, customStart, customEnd]);

  const currentRange = getCurrentRange();

  const fetchAll = useCallback(async () => {
    const token   = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };
    const [leadsRes, dealsRes, invoicesRes] = await Promise.all([
      axios.get(`${API_URL}/leads/getAllLead`,   { params: { limit: 99999, page: 1 }, headers }),
      axios.get(`${API_URL}/deals/getAll`,       { headers }),
      axios.get(`${API_URL}/invoice/getInvoice`, { headers }),
    ]);
    const normaliseLeads = (res) => {
      const d = res.data;
      if (Array.isArray(d))            return d;
      if (d && Array.isArray(d.leads)) return d.leads;
      if (d && Array.isArray(d.data))  return d.data;
      return [];
    };
    const normalise = (res) => {
      const d = res.data;
      if (Array.isArray(d))               return d;
      if (d && Array.isArray(d.data))     return d.data;
      if (d && Array.isArray(d.deals))    return d.deals;
      if (d && Array.isArray(d.invoices)) return d.invoices;
      return [];
    };
    return { allLeads: normaliseLeads(leadsRes), allDeals: normalise(dealsRes), allInvoices: normalise(invoicesRes) };
  }, []);

  const computeChange = (cur, prev) => {
    if (prev === 0) return cur === 0 ? 0 : 100;
    return Number((((cur - prev) / Math.abs(prev)) * 100).toFixed(1));
  };

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { allLeads, allDeals, allInvoices } = await fetchAll();

      const currRange = getCurrentRange();
      const prevRange = buildPreviousRange(
        activePreset,
        activePreset === "custom" ? customStart : "",
        activePreset === "custom" ? customEnd   : "",
      );

      const currentLeads    = allLeads.filter((r)    => isInRange(r, currRange));
      const currentDeals    = allDeals.filter((r)    => isInRange(r, currRange));
      const currentInvoices = allInvoices.filter((r) => isInRange(r, currRange));
      const prevLeads       = allLeads.filter((r)    => isInRange(r, prevRange));
      const prevDeals       = allDeals.filter((r)    => isInRange(r, prevRange));
      const prevInvoices    = allInvoices.filter((r) => isInRange(r, prevRange));

      setLeads(currentLeads);
      setDeals(currentDeals);
      setInvoices(currentInvoices);

      const revenue = {};
      currentInvoices.forEach((inv) => {
        const curr = inv.currency || "USD";
        const amt  = Number(inv.total ?? inv.amount ?? inv.grandTotal ?? inv.totalAmount ?? 0);
        if (amt > 0) {
          revenue[curr] = revenue[curr] || { amount: 0, count: 0 };
          revenue[curr].amount += amt;
          revenue[curr].count  += 1;
        }
      });
      setRevenueByCurrency(revenue);

      const totalLeads   = currentLeads.length;
      const dealsWon     = currentDeals.filter((d) => isWonDeal(d.stage)).length;
      const totalRevenue = Object.values(revenue).reduce((s, d) => s + d.amount, 0);
      const pendingCount = currentInvoices.filter((inv) => ["pending","unpaid"].includes((inv.status ?? "").toLowerCase())).length;

      const prevRevenue = {};
      prevInvoices.forEach((inv) => {
        const curr = inv.currency || "USD";
        const amt  = Number(inv.total ?? inv.amount ?? inv.grandTotal ?? inv.totalAmount ?? 0);
        if (amt > 0) { prevRevenue[curr] = prevRevenue[curr] || { amount: 0 }; prevRevenue[curr].amount += amt; }
      });
      const prevTotalRevenue = Object.values(prevRevenue).reduce((s, d) => s + d.amount, 0);
      const prevPending      = prevInvoices.filter((inv) => ["pending","unpaid"].includes((inv.status ?? "").toLowerCase())).length;

      setSummaryCards([
        { title: "Total Leads",      value: totalLeads,   change: computeChange(totalLeads,   prevLeads.length), color: "blue",   icon: <Users      className="h-5 w-5" /> },
        { title: "Deals Won",        value: dealsWon,     change: computeChange(dealsWon,     prevDeals.filter((d) => isWonDeal(d.stage)).length), color: "green",  icon: <Trophy     className="h-5 w-5" /> },
        { title: "Total Revenue",    value: totalRevenue, change: computeChange(totalRevenue, prevTotalRevenue), color: "purple", icon: <DollarSign className="h-5 w-5" /> },
        { title: "Pending Invoices", value: pendingCount, change: computeChange(pendingCount, prevPending),      color: "orange", icon: <FileText   className="h-5 w-5" /> },
      ]);

      setPipelineLeads(totalLeads);

      const barData = months.map((month, mIdx) => {
        const monthDeals = currentDeals.filter((d) => {
          const date = new Date(d.createdAt ?? d.date ?? d.updatedAt);
          return !isNaN(date) && date.getMonth() === mIdx;
        });
        return {
          month,
          Open: monthDeals.filter((d) => isOpenDeal(d.stage)).length,
          Won:  monthDeals.filter((d) => isWonDeal(d.stage)).length,
        };
      });
      setPipelineBarData(barData);

      setDealCounts({
        open: currentDeals.filter((d) => isOpenDeal(d.stage)).length,
        won:  currentDeals.filter((d) => isWonDeal(d.stage)).length,
        lost: currentDeals.filter((d) => isLostDeal(d.stage)).length,
      });

      if (dealsWon > 5 && dealsWon > prevDeals.filter((d) => isWonDeal(d.stage)).length) {
        confetti({ particleCount: 140, spread: 90, origin: { y: 0.6 } });
      }
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      setError("Failed to load dashboard data. Check your network or refresh the page.");
    } finally {
      setLoading(false);
    }
  }, [fetchAll, getCurrentRange, activePreset, customStart, customEnd]);

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 60_000);
    return () => clearInterval(interval);
  }, [fetchDashboardData]);

  const handlePresetChange = (key) => {
    setActivePreset(key);
    if (key !== "custom") { setCustomStart(""); setCustomEnd(""); }
  };
  const handleCustomChange = (start, end) => {
    setCustomStart(start);
    setCustomEnd(end);
    setActivePreset("custom");
  };

  return (
    <div className="p-6 space-y-5 min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/20">

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <BarChart3 className="h-8 w-8 text-purple-600" />Business Dashboard
          </h1>
          <p className="text-gray-600 mt-1">Real-time insights and performance metrics</p>
        </div>
        <DateFilterDropdown
          activePreset={activePreset}
          customStart={customStart}
          customEnd={customEnd}
          onPresetChange={handlePresetChange}
          onCustomChange={handleCustomChange}
        />
      </div>

      <ActiveFilterBadge
        activePreset={activePreset}
        customStart={customStart}
        customEnd={customEnd}
        currentRange={currentRange}
      />

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
          ⚠️ {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {loading
          ? Array(4).fill(0).map((_, i) => <SummaryCard key={i} loading />)
          : summaryCards.map((card) => <SummaryCard key={card.title} {...card} loading={false} />)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-1 space-y-5">
          <CurrencyBreakdownCard revenueData={revenueByCurrency} loading={loading} />
          <PendingInvoicesCard   invoices={invoices}            loading={loading} />
        </div>
        <div className="lg:col-span-2">
          <RevenueTrendChart revenueData={revenueByCurrency} loading={loading} invoices={invoices} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <SalesPipelineChart    data={pipelineBarData} loading={loading} totalLeads={pipelineLeads} />
        <DealDistributionChart data={dealCounts}      loading={loading} totalDeals={deals.length}  />
      </div>
    </div>
  );
};

export default AdminDashboard;//all work correctly..



