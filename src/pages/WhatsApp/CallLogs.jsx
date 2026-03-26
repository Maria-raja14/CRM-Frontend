// src/pages/CallLogs/CallLogs.jsx
import React, { useState, useEffect, useRef, useCallback } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Phone,
  PhoneIncoming,
  PhoneOutgoing,
  PhoneMissed,
  PhoneCall,
  Search,
  Trash2,
  Mic,
  Clock,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  X,
  FileText,
} from "lucide-react";
import { fetchCalls, fetchCallStats, makeCall, updateCall, deleteCall } from "../../services/call.service";

// ✅ Use the SAME socket import pattern as the rest of your app (e.g. LeadTable)
import { initSocket } from "../../utils/socket";

/* ─── Helpers ────────────────────────────────────────────────────────── */
const formatDuration = (seconds) => {
  if (!seconds || seconds === 0) return "0s";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
};

const formatDateTime = (d) => {
  if (!d) return "-";
  return new Date(d).toLocaleString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
};

const cleanNumber = (num = "") =>
  num.replace("whatsapp:", "").replace(/\s/g, "");

/* ─── Status badge ────────────────────────────────────────────────────── */
const STATUS_STYLES = {
  completed:     "bg-green-100 text-green-700 border-green-200",
  "in-progress": "bg-blue-100 text-blue-700 border-blue-200",
  ringing:       "bg-yellow-100 text-yellow-700 border-yellow-200",
  busy:          "bg-orange-100 text-orange-700 border-orange-200",
  "no-answer":   "bg-gray-100 text-gray-600 border-gray-200",
  failed:        "bg-red-100 text-red-700 border-red-200",
  canceled:      "bg-gray-100 text-gray-500 border-gray-200",
};

const StatusBadge = ({ status }) => (
  <span
    className={`px-2 py-0.5 rounded-full text-xs font-semibold border capitalize ${
      STATUS_STYLES[status] || "bg-gray-100 text-gray-600 border-gray-200"
    }`}
  >
    {status || "unknown"}
  </span>
);

/* ─── Direction icon ─────────────────────────────────────────────────── */
const DirectionIcon = ({ direction }) => {
  if (direction === "inbound")
    return <PhoneIncoming className="w-4 h-4 text-green-600" title="Inbound" />;
  if (direction?.startsWith("outbound"))
    return <PhoneOutgoing className="w-4 h-4 text-blue-600" title="Outbound" />;
  return <Phone className="w-4 h-4 text-gray-500" />;
};

/* ─── Stat Card ──────────────────────────────────────────────────────── */
const StatCard = ({ label, value, icon: Icon, color }) => (
  <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex items-center gap-4">
    <div className={`w-11 h-11 rounded-full flex items-center justify-center ${color}`}>
      <Icon className="w-5 h-5 text-white" />
    </div>
    <div>
      <p className="text-2xl font-bold text-gray-800">{value ?? "-"}</p>
      <p className="text-xs text-gray-500 mt-0.5">{label}</p>
    </div>
  </div>
);

/* ─── Incoming Call Toast ─────────────────────────────────────────────── */
const IncomingCallToast = ({ callData, onDismiss }) => (
  <div className="flex flex-col gap-2">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center animate-bounce flex-shrink-0">
        <PhoneIncoming className="w-5 h-5 text-white" />
      </div>
      <div>
        <p className="font-semibold text-gray-800 text-sm">📞 Incoming Call</p>
        <p className="text-gray-700 text-sm font-medium">
          {callData.callerName || cleanNumber(callData.from)}
        </p>
        <p className="text-gray-400 text-xs">{cleanNumber(callData.from)}</p>
      </div>
    </div>
    <button
      onClick={onDismiss}
      className="text-xs text-gray-400 hover:text-gray-600 underline self-end"
    >
      Dismiss
    </button>
  </div>
);

/* ═══════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════════════ */
export default function CallLogs() {
  const [calls,        setCalls]        = useState([]);
  const [stats,        setStats]        = useState(null);
  const [loading,      setLoading]      = useState(true);

  // Filters
  const [search,     setSearch]     = useState("");
  const [statusF,    setStatusF]    = useState("");
  const [directionF, setDirectionF] = useState("");

  // Pagination
  const [page,       setPage]       = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total,      setTotal]      = useState(0);

  // Make call modal
  const [dialOpen,   setDialOpen]   = useState(false);
  const [dialNumber, setDialNumber] = useState("");
  const [dialing,    setDialing]    = useState(false);

  // Notes modal
  const [notesModal,  setNotesModal]  = useState(null);
  const [notesText,   setNotesText]   = useState("");
  const [savingNotes, setSavingNotes] = useState(false);

  // Delete confirm
  const [deleteTarget, setDeleteTarget] = useState(null);

  const searchTimer = useRef(null);

  /* ── Load calls ─────────────────────────────────────────────────────── */
  const loadCalls = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchCalls({
        page, status: statusF, direction: directionF, search,
      });
      setCalls(data.calls || []);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 1);
    } catch {
      toast.error("Failed to load call logs");
    } finally {
      setLoading(false);
    }
  }, [page, statusF, directionF, search]);

  const loadStats = useCallback(async () => {
    try {
      const data = await fetchCallStats();
      setStats(data);
    } catch {
      // non-critical
    }
  }, []);

  useEffect(() => { loadCalls(); }, [loadCalls]);
  useEffect(() => { loadStats(); }, [loadStats]);

  // Debounce search
  useEffect(() => {
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      setPage(1);
    }, 500);
    return () => clearTimeout(searchTimer.current);
  }, [search]);

  // Reset page when filters change
  useEffect(() => { setPage(1); }, [statusF, directionF]);

  /* ── Socket: same pattern as LeadTable / WhatsApp pages ────────────────
     initSocket() returns the socket instance in your utils/socket.js.
     We listen to call_* events emitted by the backend broadcast().
  ─────────────────────────────────────────────────────────────────────── */
  useEffect(() => {
    // initSocket() returns the socket (or creates it if not yet connected)
    const socket = initSocket();
    if (!socket) return;

    // ── Incoming call ───────────────────────────────────────────────────
    const handleIncoming = (data) => {
      // Show a persistent toast with ring animation
      toast(
        ({ closeToast }) => (
          <IncomingCallToast callData={data} onDismiss={closeToast} />
        ),
        {
          position:     "top-right",
          autoClose:    false,   // stays until dismissed
          closeOnClick: false,
          icon:         false,
          style: {
            border: "2px solid #22c55e",
            borderRadius: "12px",
            padding: "12px",
          },
        }
      );

      // Prepend to table list
      setCalls((prev) => [
        {
          _id:       data.callSid,
          callSid:   data.callSid,
          from:      data.from       || "",
          to:        data.to         || "",
          callerName:data.callerName || "",
          direction: data.direction  || "inbound",
          status:    data.status     || "ringing",
          duration:  0,
          createdAt: data.startTime  || new Date(),
        },
        ...prev.slice(0, 19), // keep table max 20 items live
      ]);

      // Refresh stats badge
      loadStats();
    };

    // ── Status update ───────────────────────────────────────────────────
    const handleStatusUpdate = (data) => {
      setCalls((prev) =>
        prev.map((c) =>
          c.callSid === data.callSid
            ? {
                ...c,
                status:   data.status,
                duration: data.duration ?? c.duration,
              }
            : c
        )
      );

      // Show a small toast for notable status changes
      if (data.status === "completed") {
        toast.info(
          `📞 Call ended — ${cleanNumber(data.from)} (${formatDuration(data.duration)})`,
          { autoClose: 4000 }
        );
        loadStats();
      }
      if (data.status === "busy" || data.status === "no-answer") {
        toast.warning(
          `📵 Call ${data.status} — ${cleanNumber(data.from)}`,
          { autoClose: 4000 }
        );
      }
    };

    // ── Outbound initiated ──────────────────────────────────────────────
    const handleOutbound = (data) => {
      setCalls((prev) => [
        {
          _id:       data.callSid,
          callSid:   data.callSid,
          from:      data.from      || "",
          to:        data.to        || "",
          direction: "outbound-api",
          status:    data.status    || "queued",
          duration:  0,
          createdAt: data.startTime || new Date(),
        },
        ...prev.slice(0, 19),
      ]);
    };

    // ── Recording ready ─────────────────────────────────────────────────
    const handleRecording = (data) => {
      setCalls((prev) =>
        prev.map((c) =>
          c.callSid === data.callSid
            ? { ...c, recordingUrl: data.recordingUrl }
            : c
        )
      );
      toast.success("🎙️ Recording ready", { autoClose: 3000 });
    };

    socket.on("call_incoming",           handleIncoming);
    socket.on("call_status_update",      handleStatusUpdate);
    socket.on("call_outbound_initiated", handleOutbound);
    socket.on("call_recording_ready",    handleRecording);

    return () => {
      socket.off("call_incoming",           handleIncoming);
      socket.off("call_status_update",      handleStatusUpdate);
      socket.off("call_outbound_initiated", handleOutbound);
      socket.off("call_recording_ready",    handleRecording);
    };
  }, []); // run once — socket is a singleton

  /* ── Make outbound call ─────────────────────────────────────────────── */
  const handleMakeCall = async () => {
    if (!dialNumber.trim()) return;
    try {
      setDialing(true);
      await makeCall(dialNumber.trim());
      toast.success(`📤 Calling ${dialNumber}…`);
      setDialOpen(false);
      setDialNumber("");
      setTimeout(loadCalls, 2000); // refresh after 2s to show new record
    } catch (err) {
      toast.error(err.message || "Failed to make call");
    } finally {
      setDialing(false);
    }
  };

  /* ── Save notes ─────────────────────────────────────────────────────── */
  const handleSaveNotes = async () => {
    if (!notesModal) return;
    try {
      setSavingNotes(true);
      await updateCall(notesModal.call._id, { notes: notesText });
      setCalls((prev) =>
        prev.map((c) =>
          c._id === notesModal.call._id ? { ...c, notes: notesText } : c
        )
      );
      toast.success("Notes saved");
      setNotesModal(null);
    } catch {
      toast.error("Failed to save notes");
    } finally {
      setSavingNotes(false);
    }
  };

  /* ── Delete call ────────────────────────────────────────────────────── */
  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteCall(deleteTarget._id);
      setCalls((prev) => prev.filter((c) => c._id !== deleteTarget._id));
      setTotal((n) => n - 1);
      toast.success("Call log deleted");
    } catch {
      toast.error("Failed to delete");
    } finally {
      setDeleteTarget(null);
    }
  };

  /* ── Render ─────────────────────────────────────────────────────────── */
  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <ToastContainer position="top-right" autoClose={4000} newestOnTop />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
            <Phone className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Call Logs</h1>
            <p className="text-gray-400 text-sm">Real-time call tracking & history</p>
          </div>
        </div>
        <div className="flex gap-3 flex-wrap">
          <button
            onClick={loadCalls}
            className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg bg-white text-gray-600 hover:bg-gray-50 text-sm transition"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
          <button
            onClick={() => setDialOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition shadow"
          >
            <PhoneCall className="w-4 h-4" />
            Make a Call
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Calls" value={stats?.total}  icon={Phone}         color="bg-blue-500"   />
        <StatCard label="Today"       value={stats?.today}  icon={PhoneCall}     color="bg-green-500"  />
        <StatCard label="This Week"   value={stats?.week}   icon={PhoneIncoming} color="bg-purple-500" />
        <StatCard label="This Month"  value={stats?.month}  icon={PhoneOutgoing} color="bg-orange-500" />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4 items-center">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search number, name, SID…"
            className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 w-64"
          />
        </div>

        <select
          value={statusF}
          onChange={(e) => { setStatusF(e.target.value); setPage(1); }}
          className="px-3 py-2 border border-gray-200 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="">All Status</option>
          <option value="completed">Completed</option>
          <option value="in-progress">In Progress</option>
          <option value="ringing">Ringing</option>
          <option value="busy">Busy</option>
          <option value="no-answer">No Answer</option>
          <option value="failed">Failed</option>
          <option value="canceled">Canceled</option>
        </select>

        <select
          value={directionF}
          onChange={(e) => { setDirectionF(e.target.value); setPage(1); }}
          className="px-3 py-2 border border-gray-200 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="">All Directions</option>
          <option value="inbound">Inbound</option>
          <option value="outbound-api">Outbound</option>
        </select>

        {(search || statusF || directionF) && (
          <button
            onClick={() => { setSearch(""); setStatusF(""); setDirectionF(""); setPage(1); }}
            className="flex items-center gap-1 px-3 py-2 text-sm text-gray-500 hover:text-gray-700 border border-gray-200 rounded-lg bg-white transition"
          >
            <X className="w-3.5 h-3.5" /> Clear
          </button>
        )}

        <span className="ml-auto text-sm text-gray-400">{total} call(s)</span>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 w-8"></th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">From</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">To</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Duration</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Date & Time</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Recording</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Notes</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Delete</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={9} className="text-center py-16">
                  <div className="flex flex-col items-center gap-3 text-gray-400">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500" />
                    <p className="text-sm">Loading call logs…</p>
                  </div>
                </td>
              </tr>
            ) : calls.length === 0 ? (
              <tr>
                <td colSpan={9} className="text-center py-16">
                  <div className="flex flex-col items-center gap-3 text-gray-400">
                    <PhoneMissed className="w-12 h-12 opacity-30" />
                    <p className="text-sm font-medium">No call logs found</p>
                    <p className="text-xs">
                      Configure the Twilio webhook to start receiving calls.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              calls.map((call) => (
                <tr
                  key={call._id || call.callSid}
                  className={`hover:bg-gray-50 transition-colors ${
                    call.status === "ringing" || call.status === "in-progress"
                      ? "bg-green-50/50"
                      : ""
                  }`}
                >
                  {/* Direction */}
                  <td className="px-4 py-3">
                    <DirectionIcon direction={call.direction} />
                  </td>

                  {/* From */}
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-gray-800">
                        {cleanNumber(call.from)}
                      </p>
                      {call.callerName && (
                        <p className="text-xs text-gray-400">{call.callerName}</p>
                      )}
                    </div>
                  </td>

                  {/* To */}
                  <td className="px-4 py-3 text-gray-700">
                    {cleanNumber(call.to)}
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3">
                    <StatusBadge status={call.status} />
                  </td>

                  {/* Duration */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 text-gray-600">
                      <Clock className="w-3.5 h-3.5 text-gray-400" />
                      {formatDuration(call.duration)}
                    </div>
                  </td>

                  {/* Date */}
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                    {formatDateTime(call.createdAt)}
                  </td>

                  {/* Recording */}
                  <td className="px-4 py-3">
                    {call.recordingUrl ? (
                      <a
                        href={call.recordingUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-xs underline"
                      >
                        <Mic className="w-3.5 h-3.5" />
                        Play
                      </a>
                    ) : (
                      <span className="text-gray-300 text-xs">—</span>
                    )}
                  </td>

                  {/* Notes */}
                  <td className="px-4 py-3">
                    <button
                      onClick={() => {
                        setNotesModal({ call });
                        setNotesText(call.notes || "");
                      }}
                      className="flex items-center gap-1 text-xs text-gray-500 hover:text-blue-600 transition"
                      title={call.notes || "Add notes"}
                    >
                      <FileText className="w-3.5 h-3.5" />
                      {call.notes ? (
                        <span className="max-w-[80px] truncate">{call.notes}</span>
                      ) : (
                        <span className="text-gray-300">Add</span>
                      )}
                    </button>
                  </td>

                  {/* Delete */}
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => setDeleteTarget(call)}
                      className="p-1.5 rounded-md text-gray-400 hover:text-red-600 hover:bg-red-50 transition"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-gray-500">
            Page <span className="font-semibold">{page}</span> of{" "}
            <span className="font-semibold">{totalPages}</span> · {total} total
          </p>
          <div className="flex gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-2 rounded-lg border hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const p =
                totalPages <= 5          ? i + 1
                : page <= 3              ? i + 1
                : page >= totalPages - 2 ? totalPages - 4 + i
                :                         page - 2 + i;
              return (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-9 h-9 rounded-lg border text-sm font-medium transition ${
                    page === p
                      ? "bg-blue-600 text-white border-blue-600"
                      : "hover:bg-gray-100 text-gray-700"
                  }`}
                >
                  {p}
                </button>
              );
            })}

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-2 rounded-lg border hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ── Dial Modal ────────────────────────────────────────────────────── */}
      {dialOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          onClick={() => setDialOpen(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-blue-600 px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <PhoneCall className="text-white w-5 h-5" />
                <h3 className="text-white font-semibold">Make a Call</h3>
              </div>
              <button onClick={() => setDialOpen(false)} className="text-white/80 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={dialNumber}
                  onChange={(e) => setDialNumber(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleMakeCall()}
                  placeholder="+919876543210"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />
                <p className="text-xs text-gray-400 mt-1">
                  Include country code or enter 10-digit Indian number
                </p>
              </div>
            </div>
            <div className="px-5 pb-5 flex gap-3">
              <button
                onClick={() => setDialOpen(false)}
                className="flex-1 py-2.5 border rounded-lg text-gray-600 text-sm hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleMakeCall}
                disabled={dialing || !dialNumber.trim()}
                className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {dialing ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                ) : (
                  <>
                    <PhoneCall className="w-4 h-4" /> Call
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Notes Modal ───────────────────────────────────────────────────── */}
      {notesModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          onClick={() => setNotesModal(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-semibold text-gray-800">Call Notes</h3>
              <button
                onClick={() => setNotesModal(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5">
              <p className="text-xs text-gray-400 mb-3">
                {cleanNumber(notesModal.call.from)} →{" "}
                {cleanNumber(notesModal.call.to)} ·{" "}
                {formatDateTime(notesModal.call.createdAt)}
              </p>
              <textarea
                value={notesText}
                onChange={(e) => setNotesText(e.target.value)}
                rows={4}
                placeholder="Add notes about this call…"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>
            <div className="px-5 pb-5 flex gap-3">
              <button
                onClick={() => setNotesModal(null)}
                className="flex-1 py-2 border rounded-lg text-gray-600 text-sm hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveNotes}
                disabled={savingNotes}
                className="flex-1 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-60"
              >
                {savingNotes ? "Saving…" : "Save Notes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Confirm ────────────────────────────────────────────────── */}
      {deleteTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          onClick={() => setDeleteTarget(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-6 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-7 h-7 text-red-600" />
            </div>
            <h3 className="font-bold text-gray-800 text-lg mb-2">Delete Call Log?</h3>
            <p className="text-gray-500 text-sm mb-1">
              {cleanNumber(deleteTarget.from)} → {cleanNumber(deleteTarget.to)}
            </p>
            <p className="text-xs text-gray-400 mb-6">
              {formatDateTime(deleteTarget.createdAt)}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 py-2.5 border rounded-lg text-gray-600 text-sm hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-2.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}