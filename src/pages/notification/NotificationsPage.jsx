// import React, { useState, useEffect } from "react";
// import { useNotifications } from "../../context/NotificationContext";
// import { formatDistanceToNow, differenceInHours } from "date-fns";
// import { Bell, Trash2, Clock, CheckCircle, ArrowLeft } from "lucide-react";
// import { useLocation, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { toast } from "react-toastify";
// import { buildProfileImageUrl } from "../useroles/UserManagement";

// const DEFAULT_AVATAR =
//   "https://static.vecteezy.com/system/resources/previews/020/429/953/non_2x/admin-icon-vector.jpg";

// const NotificationsPage = () => {
//   const { notifications, setNotifications } = useNotifications();
//   const [deletingId,   setDeletingId]   = useState(null);
//   const [selectedIds,  setSelectedIds]  = useState([]);
//   const location  = useLocation();
//   const navigate  = useNavigate();
//   const initialFilter = location.state?.filter || "all";
//   const [filter, setFilter] = useState(initialFilter);

//   const API_URL = import.meta.env.VITE_API_URL;
//   const API_SI  = import.meta.env.VITE_SI_URI;

//   useEffect(() => {
//     if (!location.state?.filter) setFilter("all");
//   }, [location.state]);

//   // ── Filter & sort ────────────────────────────────────────────────────
//   let filtered = notifications.filter((n) => {
//     if (filter === "all")      return true;
//     if (filter === "followup") return n.type === "followup";
//     if (filter === "activity") return n.type === "activity" || n.type === "admin";
//     if (filter === "unread")   return !n.read;
//     if (filter === "read")     return n.read;
//     return true;
//   });
//   filtered = filtered.sort((a, b) =>
//     a.read === b.read ? 0 : a.read ? 1 : -1
//   );

//   const unreadCount = notifications.filter((n) => !n.read).length;

//   // ── Bulk selection ───────────────────────────────────────────────────
//   const handleSelectAll = () => {
//     if (selectedIds.length === filtered.length) setSelectedIds([]);
//     else setSelectedIds(filtered.map((n) => n._id));
//   };

//   const handleSelect = (id) => {
//     setSelectedIds((prev) =>
//       prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
//     );
//   };

//   // ── Bulk delete ──────────────────────────────────────────────────────
//   const handleBulkDelete = async () => {
//     if (selectedIds.length === 0) return;
//     setDeletingId("bulk");
//     try {
//       const token = localStorage.getItem("token");

//       // ✅ FIX: Use correct route  DELETE /api/notifications/bulk
//       await axios.delete(`${API_URL}/notifications/bulk`, {
//         data:    { ids: selectedIds },
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       setNotifications((prev) =>
//         prev.filter((n) => !selectedIds.includes(n._id))
//       );
//       setSelectedIds([]);
//       toast.success(`Deleted ${selectedIds.length} notification(s)`);
//     } catch (err) {
//       console.error("Bulk delete error:", err?.response?.data || err.message);
//       toast.error("Failed to delete some notifications");
//     } finally {
//       setDeletingId(null);
//     }
//   };

//   // ── Single delete ────────────────────────────────────────────────────
//   const handleDelete = async (id) => {
//     setDeletingId(id);
//     try {
//       const token = localStorage.getItem("token");

//       // ✅ FIX: Use correct route  DELETE /api/notifications/:id
//       await axios.delete(`${API_URL}/notifications/${id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       setNotifications((prev) => prev.filter((n) => n._id !== id));
//       setSelectedIds((prev) => prev.filter((i) => i !== id));
//       toast.success("Notification deleted");
//     } catch (err) {
//       console.error("Delete error:", err?.response?.data || err.message);
//       toast.error("Failed to delete notification");
//     } finally {
//       setTimeout(() => setDeletingId(null), 300);
//     }
//   };

//   // ── Mark as read ─────────────────────────────────────────────────────
//   const markAsRead = async (id) => {
//     try {
//       const token = localStorage.getItem("token");

//       // ✅ FIX: Use correct route  PATCH /api/notifications/read/:id
//       await axios.patch(
//         `${API_URL}/notifications/read/${id}`,
//         { read: true },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       setNotifications((prev) =>
//         prev.map((n) => (n._id === id ? { ...n, read: true } : n))
//       );
//       toast.success("Marked as read");
//     } catch (err) {
//       console.error("Mark read error:", err?.response?.data || err.message);
//       toast.error("Failed to mark as read");
//     }
//   };

//   return (
//     <div className="w-full mx-auto p-4 md:p-6">
//       {/* Back button */}
//       <button
//         onClick={() => navigate(-1)}
//         className="flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white mb-4 transition-colors"
//       >
//         <ArrowLeft size={20} className="mr-2" />
//         Back
//       </button>

//       {/* Header */}
//       <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
//         <div className="flex items-center space-x-3">
//           <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
//             <Bell className="h-7 w-7 text-white" />
//           </div>
//           <div>
//             <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100">
//               Notifications
//             </h1>
//             <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
//               Stay updated with your alerts
//             </p>
//           </div>
//         </div>

//         {notifications.length > 0 && (
//           <div className="flex items-center space-x-3 mt-4 md:mt-0">
//             <div className="text-sm text-gray-500 dark:text-gray-400">
//               <span className="font-semibold text-blue-600 dark:text-blue-400">
//                 {unreadCount}
//               </span>{" "}
//               unread
//             </div>

//             <div className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-800 rounded-xl p-1 shadow-inner">
//               {["all", "unread", "read"].map((t) => (
//                 <button
//                   key={t}
//                   onClick={() => setFilter(t)}
//                   className={`px-4 py-2 text-sm rounded-lg transition-all duration-200 ${
//                     filter === t
//                       ? t === "unread"
//                         ? "bg-blue-100 dark:bg-blue-900/40 shadow-sm font-medium text-blue-700 dark:text-blue-300"
//                         : t === "read"
//                         ? "bg-green-100 dark:bg-green-900/40 shadow-sm font-medium text-green-700 dark:text-green-300"
//                         : "bg-white dark:bg-gray-700 shadow-sm font-medium text-gray-800 dark:text-gray-200"
//                       : "text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"
//                   }`}
//                 >
//                   {t.charAt(0).toUpperCase() + t.slice(1)}
//                 </button>
//               ))}
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Type tabs + Select All */}
//       <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
//         <div className="flex gap-2">
//           {[
//             { key: "all",      label: "All" },
//             { key: "followup", label: "Lead follow-ups" },
//             { key: "activity", label: "Activity follow-ups" },
//           ].map(({ key, label }) => (
//             <button
//               key={key}
//               onClick={() => setFilter(key)}
//               className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
//                 filter === key
//                   ? "bg-blue-500 text-white"
//                   : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300"
//               }`}
//             >
//               {label}
//             </button>
//           ))}
//         </div>

//         {filtered.length > 0 && (
//           <label className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
//             <input
//               type="checkbox"
//               className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
//               checked={selectedIds.length === filtered.length && filtered.length > 0}
//               onChange={handleSelectAll}
//             />
//             <span>Select all</span>
//           </label>
//         )}
//       </div>

//       {/* Bulk action bar */}
//       {selectedIds.length > 0 && (
//         <div className="sticky top-0 z-10 mb-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg p-3 flex items-center justify-between">
//           <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
//             {selectedIds.length} selected
//           </span>
//           <button
//             onClick={handleBulkDelete}
//             disabled={deletingId === "bulk"}
//             className="flex items-center px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm rounded-lg transition-colors disabled:opacity-50"
//           >
//             {deletingId === "bulk" ? (
//               <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
//             ) : (
//               <Trash2 size={16} className="mr-2" />
//             )}
//             Delete selected
//           </button>
//         </div>
//       )}

//       {/* Notification cards */}
//       <div className="space-y-4">
//         {filtered.length > 0 ? (
//           filtered.map((n) => {
//             const createdAt = new Date(n.createdAt);
//             const expiresAt = new Date(createdAt.getTime() + 24 * 60 * 60 * 1000);
//             const hoursLeft = differenceInHours(expiresAt, new Date());
//             const isExpired = hoursLeft <= 0;

//             const avatarSrc = n.profileImage
//               ? buildProfileImageUrl(n.profileImage, API_SI)
//               : DEFAULT_AVATAR;

//             return (
//               <div
//                 key={n._id}
//                 className={`relative group p-5 rounded-2xl transition-all duration-300 border ${
//                   n.read
//                     ? "bg-white dark:bg-gray-800/70 border-gray-200 dark:border-gray-700/50 shadow-sm"
//                     : "bg-gradient-to-r from-blue-50/80 to-indigo-50/80 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800/30 shadow-md"
//                 }`}
//               >
//                 <div className="flex items-start">
//                   {/* Checkbox */}
//                   <div className="flex-shrink-0 mr-3 mt-1">
//                     <input
//                       type="checkbox"
//                       className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
//                       checked={selectedIds.includes(n._id)}
//                       onChange={() => handleSelect(n._id)}
//                     />
//                   </div>

//                   {/* Avatar */}
//                   <div className="flex-shrink-0 relative mr-4">
//                     <img
//                       src={avatarSrc}
//                       alt="User"
//                       className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm bg-gray-100"
//                       onError={(e) => {
//                         e.target.onerror = null;
//                         e.target.src = DEFAULT_AVATAR;
//                       }}
//                     />
//                     {!n.read && (
//                       <div className="absolute -top-1 -right-1">
//                         <div className="bg-blue-500 rounded-full w-5 h-5 flex items-center justify-center shadow-md">
//                           <div className="bg-blue-500 rounded-full w-2 h-2 animate-ping absolute" />
//                           <div className="w-1.5 h-1.5 bg-white rounded-full" />
//                         </div>
//                       </div>
//                     )}
//                   </div>

//                   {/* Content */}
//                   <div className="flex-1 min-w-0">
//                     <div className="flex items-start justify-between">
//                       <div className="flex-1">
//                         <p
//                           className={`text-base font-semibold ${
//                             n.read
//                               ? "text-gray-700 dark:text-gray-200"
//                               : "text-gray-900 dark:text-gray-100"
//                           }`}
//                         >
//                           {n.title || "Notification"}
//                         </p>
//                         <p className="text-gray-600 dark:text-gray-300 text-sm mt-2 leading-relaxed">
//                           {n.text}
//                         </p>
//                       </div>

//                       {/* Delete button */}
//                       <button
//                         onClick={() => handleDelete(n._id)}
//                         disabled={deletingId === n._id}
//                         className="ml-4 flex items-center justify-center p-2 text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-500 rounded-xl transition-all duration-200 transform hover:scale-110"
//                       >
//                         {deletingId === n._id ? (
//                           <div className="w-5 h-5 border-2 border-t-transparent border-blue-500 rounded-full animate-spin" />
//                         ) : (
//                           <Trash2 size={18} />
//                         )}
//                       </button>
//                     </div>

//                     {/* Footer */}
//                     <div className="flex flex-wrap items-center gap-4 mt-4 pt-3 border-t border-gray-100 dark:border-gray-700/50">
//                       <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
//                         <Clock size={14} className="mr-1.5" />
//                         {n.createdAt
//                           ? formatDistanceToNow(createdAt, { addSuffix: true })
//                           : "Just now"}
//                       </div>

//                       {!n.read && (
//                         <button
//                           onClick={() => markAsRead(n._id)}
//                           className="flex items-center text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors"
//                         >
//                           <CheckCircle size={14} className="mr-1.5" />
//                           Mark as read
//                         </button>
//                       )}

//                       <div
//                         className={`flex items-center text-xs font-medium ${
//                           isExpired ? "text-red-500" : "text-amber-500"
//                         }`}
//                       >
//                         <Clock size={14} className="mr-1.5" />
//                         {isExpired
//                           ? "Expired"
//                           : `Expires in ${hoursLeft} hour${hoursLeft !== 1 ? "s" : ""}`}
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             );
//           })
//         ) : (
//           <div className="text-center py-16">
//             <div className="mx-auto w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-full flex items-center justify-center mb-4">
//               <Bell size={30} className="text-gray-400 dark:text-gray-300" />
//             </div>
//             <p className="text-gray-500 dark:text-gray-400 font-medium">
//               No notifications
//             </p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default NotificationsPage;//all finally working correct code..


// pages/NotificationsPage.jsx
import React, { useState, useEffect } from "react";
import { useNotifications } from "../../context/NotificationContext";
import { formatDistanceToNow } from "date-fns";
import { Bell, Trash2, Clock, CheckCircle, ArrowLeft } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { buildProfileImageUrl } from "../useroles/UserManagement";

const DEFAULT_AVATAR =
  "https://static.vecteezy.com/system/resources/previews/020/429/953/non_2x/admin-icon-vector.jpg";

// ─── Helper: same guard used in the context ──────────────────────────────────
// Only show notifications created today and not yet expired.
const isValidNotification = (n) => {
  const now = new Date();

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const createdAt = n.createdAt ? new Date(n.createdAt) : null;
  if (!createdAt || createdAt < startOfToday) return false;

  if (n.expiresAt) {
    const expiresAt = new Date(n.expiresAt);
    if (expiresAt <= now) return false;
  }

  return true;
};

// ─── Component ────────────────────────────────────────────────────────────────
const NotificationsPage = () => {
  const { notifications, setNotifications } = useNotifications();
  const [deletingId,  setDeletingId]  = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const initialFilter = location.state?.filter || "all";
  const [filter, setFilter] = useState(initialFilter);

  const API_URL = import.meta.env.VITE_API_URL;
  const API_SI  = import.meta.env.VITE_SI_URI;

  useEffect(() => {
    if (!location.state?.filter) setFilter("all");
  }, [location.state]);

  // ── Filter & sort ────────────────────────────────────────────────────────
  // Always run isValidNotification first so expired/old items never render,
  // even if they somehow made it into context state.
  let filtered = notifications
    .filter(isValidNotification)   // ✅ hard gate — today + not expired
    .filter((n) => {
      if (filter === "all")      return true;
      if (filter === "followup") return n.type === "followup";
      if (filter === "activity") return n.type === "activity" || n.type === "admin";
      if (filter === "unread")   return !n.read;
      if (filter === "read")     return n.read;
      return true;
    })
    .sort((a, b) =>
      // Unread first, then by most recent
      a.read !== b.read
        ? a.read ? 1 : -1
        : new Date(b.createdAt) - new Date(a.createdAt)
    );

  const unreadCount = notifications.filter((n) => !n.read && isValidNotification(n)).length;

  // ── Bulk selection ───────────────────────────────────────────────────────
  const handleSelectAll = () => {
    if (selectedIds.length === filtered.length) setSelectedIds([]);
    else setSelectedIds(filtered.map((n) => n._id));
  };

  const handleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // ── Bulk delete ──────────────────────────────────────────────────────────
  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    setDeletingId("bulk");
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}/notifications/bulk`, {
        data:    { ids: selectedIds },
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications((prev) =>
        prev.filter((n) => !selectedIds.includes(n._id))
      );
      setSelectedIds([]);
      toast.success(`Deleted ${selectedIds.length} notification(s)`);
    } catch (err) {
      console.error("Bulk delete error:", err?.response?.data || err.message);
      toast.error("Failed to delete some notifications");
    } finally {
      setDeletingId(null);
    }
  };

  // ── Single delete ────────────────────────────────────────────────────────
  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}/notifications/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications((prev) => prev.filter((n) => n._id !== id));
      setSelectedIds((prev) => prev.filter((i) => i !== id));
      toast.success("Notification deleted");
    } catch (err) {
      console.error("Delete error:", err?.response?.data || err.message);
      toast.error("Failed to delete notification");
    } finally {
      setTimeout(() => setDeletingId(null), 300);
    }
  };

  // ── Mark as read ─────────────────────────────────────────────────────────
  const markAsRead = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `${API_URL}/notifications/read/${id}`,
        { read: true },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n))
      );
      toast.success("Marked as read");
    } catch (err) {
      console.error("Mark read error:", err?.response?.data || err.message);
      toast.error("Failed to mark as read");
    }
  };

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="w-full mx-auto p-4 md:p-6">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white mb-4 transition-colors"
      >
        <ArrowLeft size={20} className="mr-2" />
        Back
      </button>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
            <Bell className="h-7 w-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100">
              Notifications
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Today's alerts only
            </p>
          </div>
        </div>

        {notifications.filter(isValidNotification).length > 0 && (
          <div className="flex items-center space-x-3 mt-4 md:mt-0">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              <span className="font-semibold text-blue-600 dark:text-blue-400">
                {unreadCount}
              </span>{" "}
              unread
            </div>

            <div className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-800 rounded-xl p-1 shadow-inner">
              {["all", "unread", "read"].map((t) => (
                <button
                  key={t}
                  onClick={() => setFilter(t)}
                  className={`px-4 py-2 text-sm rounded-lg transition-all duration-200 ${
                    filter === t
                      ? t === "unread"
                        ? "bg-blue-100 dark:bg-blue-900/40 shadow-sm font-medium text-blue-700 dark:text-blue-300"
                        : t === "read"
                        ? "bg-green-100 dark:bg-green-900/40 shadow-sm font-medium text-green-700 dark:text-green-300"
                        : "bg-white dark:bg-gray-700 shadow-sm font-medium text-gray-800 dark:text-gray-200"
                      : "text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"
                  }`}
                >
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Type tabs + Select All */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <div className="flex gap-2">
          {[
            { key: "all",      label: "All" },
            { key: "followup", label: "Lead follow-ups" },
            { key: "activity", label: "Activity follow-ups" },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                filter === key
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {filtered.length > 0 && (
          <label className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
            <input
              type="checkbox"
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              checked={selectedIds.length === filtered.length && filtered.length > 0}
              onChange={handleSelectAll}
            />
            <span>Select all</span>
          </label>
        )}
      </div>

      {/* Bulk action bar */}
      {selectedIds.length > 0 && (
        <div className="sticky top-0 z-10 mb-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg p-3 flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
            {selectedIds.length} selected
          </span>
          <button
            onClick={handleBulkDelete}
            disabled={deletingId === "bulk"}
            className="flex items-center px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm rounded-lg transition-colors disabled:opacity-50"
          >
            {deletingId === "bulk" ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
            ) : (
              <Trash2 size={16} className="mr-2" />
            )}
            Delete selected
          </button>
        </div>
      )}

      {/* Notification cards */}
      <div className="space-y-4">
        {filtered.length > 0 ? (
          filtered.map((n) => {
            const createdAt = new Date(n.createdAt);
            const avatarSrc = n.profileImage
              ? buildProfileImageUrl(n.profileImage, API_SI)
              : DEFAULT_AVATAR;

            return (
              <div
                key={n._id}
                className={`relative group p-5 rounded-2xl transition-all duration-300 border ${
                  n.read
                    ? "bg-white dark:bg-gray-800/70 border-gray-200 dark:border-gray-700/50 shadow-sm"
                    : "bg-gradient-to-r from-blue-50/80 to-indigo-50/80 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800/30 shadow-md"
                }`}
              >
                <div className="flex items-start">
                  {/* Checkbox */}
                  <div className="flex-shrink-0 mr-3 mt-1">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      checked={selectedIds.includes(n._id)}
                      onChange={() => handleSelect(n._id)}
                    />
                  </div>

                  {/* Avatar */}
                  <div className="flex-shrink-0 relative mr-4">
                    <img
                      src={avatarSrc}
                      alt="User"
                      className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm bg-gray-100"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = DEFAULT_AVATAR;
                      }}
                    />
                    {!n.read && (
                      <div className="absolute -top-1 -right-1">
                        <div className="bg-blue-500 rounded-full w-5 h-5 flex items-center justify-center shadow-md">
                          <div className="bg-blue-500 rounded-full w-2 h-2 animate-ping absolute" />
                          <div className="w-1.5 h-1.5 bg-white rounded-full" />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p
                          className={`text-base font-semibold ${
                            n.read
                              ? "text-gray-700 dark:text-gray-200"
                              : "text-gray-900 dark:text-gray-100"
                          }`}
                        >
                          {n.title || "Notification"}
                        </p>
                        <p className="text-gray-600 dark:text-gray-300 text-sm mt-2 leading-relaxed">
                          {n.text}
                        </p>
                      </div>

                      {/* Delete button */}
                      <button
                        onClick={() => handleDelete(n._id)}
                        disabled={deletingId === n._id}
                        className="ml-4 flex items-center justify-center p-2 text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-500 rounded-xl transition-all duration-200 transform hover:scale-110"
                      >
                        {deletingId === n._id ? (
                          <div className="w-5 h-5 border-2 border-t-transparent border-blue-500 rounded-full animate-spin" />
                        ) : (
                          <Trash2 size={18} />
                        )}
                      </button>
                    </div>

                    {/* Footer */}
                    <div className="flex flex-wrap items-center gap-4 mt-4 pt-3 border-t border-gray-100 dark:border-gray-700/50">
                      {/* Time ago */}
                      <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                        <Clock size={14} className="mr-1.5" />
                        {n.createdAt
                          ? formatDistanceToNow(createdAt, { addSuffix: true })
                          : "Just now"}
                      </div>

                      {/* Mark as read */}
                      {!n.read && (
                        <button
                          onClick={() => markAsRead(n._id)}
                          className="flex items-center text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors"
                        >
                          <CheckCircle size={14} className="mr-1.5" />
                          Mark as read
                        </button>
                      )}

                      {/* ✅ Show expiry time only if expiresAt exists and is in the future */}
                      {n.expiresAt && new Date(n.expiresAt) > new Date() && (
                        <div className="flex items-center text-xs font-medium text-amber-500">
                          <Clock size={14} className="mr-1.5" />
                          {`Expires ${formatDistanceToNow(new Date(n.expiresAt), { addSuffix: true })}`}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-16">
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-full flex items-center justify-center mb-4">
              <Bell size={30} className="text-gray-400 dark:text-gray-300" />
            </div>
            <p className="text-gray-500 dark:text-gray-400 font-medium">
              No notifications for today
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;



// import React, { useState, useEffect } from "react";
// import { useNotifications } from "../../context/NotificationContext";
// import { formatDistanceToNow } from "date-fns";
// import { Bell, Trash2, Clock, CheckCircle, ArrowLeft } from "lucide-react";
// import { useLocation, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { toast } from "react-toastify";
// import { buildProfileImageUrl } from "../useroles/UserManagement";

// const DEFAULT_AVATAR =
//   "https://static.vecteezy.com/system/resources/previews/020/429/953/non_2x/admin-icon-vector.jpg";

// const NotificationsPage = () => {
//   const { notifications, setNotifications } = useNotifications();
//   const [deletingId,  setDeletingId]  = useState(null);
//   const [selectedIds, setSelectedIds] = useState([]);
//   const location = useLocation();
//   const navigate = useNavigate();
//   const initialFilter = location.state?.filter || "all";
//   const [filter, setFilter] = useState(initialFilter);

//   const API_URL = import.meta.env.VITE_API_URL;
//   const API_SI  = import.meta.env.VITE_SI_URI;

//   useEffect(() => {
//     if (!location.state?.filter) setFilter("all");
//   }, [location.state]);

//   // ── Filter & sort ──────────────────────────────────────────────────
//   let filtered = notifications.filter((n) => {
//     if (filter === "all")      return true;
//     if (filter === "followup") return n.type === "followup";
//     if (filter === "activity") return n.type === "activity" || n.type === "admin";
//     if (filter === "unread")   return !n.read;
//     if (filter === "read")     return n.read;
//     return true;
//   });
//   filtered = filtered.sort((a, b) =>
//     a.read === b.read ? 0 : a.read ? 1 : -1
//   );

//   const unreadCount = notifications.filter((n) => !n.read).length;

//   // ── Bulk selection ─────────────────────────────────────────────────
//   const handleSelectAll = () => {
//     if (selectedIds.length === filtered.length) setSelectedIds([]);
//     else setSelectedIds(filtered.map((n) => n._id));
//   };

//   const handleSelect = (id) => {
//     setSelectedIds((prev) =>
//       prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
//     );
//   };

//   // ── Bulk delete ────────────────────────────────────────────────────
//   const handleBulkDelete = async () => {
//     if (selectedIds.length === 0) return;
//     setDeletingId("bulk");
//     try {
//       const token = localStorage.getItem("token");
//       await axios.delete(`${API_URL}/notifications/bulk`, {
//         data:    { ids: selectedIds },
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setNotifications((prev) =>
//         prev.filter((n) => !selectedIds.includes(n._id))
//       );
//       setSelectedIds([]);
//       toast.success(`Deleted ${selectedIds.length} notification(s)`);
//     } catch (err) {
//       console.error("Bulk delete error:", err?.response?.data || err.message);
//       toast.error("Failed to delete some notifications");
//     } finally {
//       setDeletingId(null);
//     }
//   };

//   // ── Single delete ──────────────────────────────────────────────────
//   const handleDelete = async (id) => {
//     setDeletingId(id);
//     try {
//       const token = localStorage.getItem("token");
//       await axios.delete(`${API_URL}/notifications/${id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setNotifications((prev) => prev.filter((n) => n._id !== id));
//       setSelectedIds((prev) => prev.filter((i) => i !== id));
//       toast.success("Notification deleted");
//     } catch (err) {
//       console.error("Delete error:", err?.response?.data || err.message);
//       toast.error("Failed to delete notification");
//     } finally {
//       setTimeout(() => setDeletingId(null), 300);
//     }
//   };

//   // ── Mark as read ───────────────────────────────────────────────────
//   const markAsRead = async (id) => {
//     try {
//       const token = localStorage.getItem("token");
//       await axios.patch(
//         `${API_URL}/notifications/read/${id}`,
//         { read: true },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setNotifications((prev) =>
//         prev.map((n) => (n._id === id ? { ...n, read: true } : n))
//       );
//       toast.success("Marked as read");
//     } catch (err) {
//       console.error("Mark read error:", err?.response?.data || err.message);
//       toast.error("Failed to mark as read");
//     }
//   };

//   return (
//     <div className="w-full mx-auto p-4 md:p-6">
//       {/* Back button */}
//       <button
//         onClick={() => navigate(-1)}
//         className="flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white mb-4 transition-colors"
//       >
//         <ArrowLeft size={20} className="mr-2" />
//         Back
//       </button>

//       {/* Header */}
//       <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
//         <div className="flex items-center space-x-3">
//           <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
//             <Bell className="h-7 w-7 text-white" />
//           </div>
//           <div>
//             <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100">
//               Notifications
//             </h1>
//             <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
//               Stay updated with your alerts
//             </p>
//           </div>
//         </div>

//         {notifications.length > 0 && (
//           <div className="flex items-center space-x-3 mt-4 md:mt-0">
//             <div className="text-sm text-gray-500 dark:text-gray-400">
//               <span className="font-semibold text-blue-600 dark:text-blue-400">
//                 {unreadCount}
//               </span>{" "}
//               unread
//             </div>

//             <div className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-800 rounded-xl p-1 shadow-inner">
//               {["all", "unread", "read"].map((t) => (
//                 <button
//                   key={t}
//                   onClick={() => setFilter(t)}
//                   className={`px-4 py-2 text-sm rounded-lg transition-all duration-200 ${
//                     filter === t
//                       ? t === "unread"
//                         ? "bg-blue-100 dark:bg-blue-900/40 shadow-sm font-medium text-blue-700 dark:text-blue-300"
//                         : t === "read"
//                         ? "bg-green-100 dark:bg-green-900/40 shadow-sm font-medium text-green-700 dark:text-green-300"
//                         : "bg-white dark:bg-gray-700 shadow-sm font-medium text-gray-800 dark:text-gray-200"
//                       : "text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"
//                   }`}
//                 >
//                   {t.charAt(0).toUpperCase() + t.slice(1)}
//                 </button>
//               ))}
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Type tabs + Select All */}
//       <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
//         <div className="flex gap-2">
//           {[
//             { key: "all",      label: "All" },
//             { key: "followup", label: "Lead follow-ups" },
//             { key: "activity", label: "Activity follow-ups" },
//           ].map(({ key, label }) => (
//             <button
//               key={key}
//               onClick={() => setFilter(key)}
//               className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
//                 filter === key
//                   ? "bg-blue-500 text-white"
//                   : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300"
//               }`}
//             >
//               {label}
//             </button>
//           ))}
//         </div>

//         {filtered.length > 0 && (
//           <label className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
//             <input
//               type="checkbox"
//               className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
//               checked={
//                 selectedIds.length === filtered.length && filtered.length > 0
//               }
//               onChange={handleSelectAll}
//             />
//             <span>Select all</span>
//           </label>
//         )}
//       </div>

//       {/* Bulk action bar */}
//       {selectedIds.length > 0 && (
//         <div className="sticky top-0 z-10 mb-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg p-3 flex items-center justify-between">
//           <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
//             {selectedIds.length} selected
//           </span>
//           <button
//             onClick={handleBulkDelete}
//             disabled={deletingId === "bulk"}
//             className="flex items-center px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm rounded-lg transition-colors disabled:opacity-50"
//           >
//             {deletingId === "bulk" ? (
//               <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
//             ) : (
//               <Trash2 size={16} className="mr-2" />
//             )}
//             Delete selected
//           </button>
//         </div>
//       )}

//       {/* Notification cards */}
//       <div className="space-y-4">
//         {filtered.length > 0 ? (
//           filtered.map((n) => {
//             // ✅ REMOVED: expiresAt, hoursLeft, isExpired — no longer needed
//             const createdAt = new Date(n.createdAt);

//             const avatarSrc = n.profileImage
//               ? buildProfileImageUrl(n.profileImage, API_SI)
//               : DEFAULT_AVATAR;

//             return (
//               <div
//                 key={n._id}
//                 className={`relative group p-5 rounded-2xl transition-all duration-300 border ${
//                   n.read
//                     ? "bg-white dark:bg-gray-800/70 border-gray-200 dark:border-gray-700/50 shadow-sm"
//                     : "bg-gradient-to-r from-blue-50/80 to-indigo-50/80 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800/30 shadow-md"
//                 }`}
//               >
//                 <div className="flex items-start">
//                   {/* Checkbox */}
//                   <div className="flex-shrink-0 mr-3 mt-1">
//                     <input
//                       type="checkbox"
//                       className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
//                       checked={selectedIds.includes(n._id)}
//                       onChange={() => handleSelect(n._id)}
//                     />
//                   </div>

//                   {/* Avatar */}
//                   <div className="flex-shrink-0 relative mr-4">
//                     <img
//                       src={avatarSrc}
//                       alt="User"
//                       className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm bg-gray-100"
//                       onError={(e) => {
//                         e.target.onerror = null;
//                         e.target.src = DEFAULT_AVATAR;
//                       }}
//                     />
//                     {!n.read && (
//                       <div className="absolute -top-1 -right-1">
//                         <div className="bg-blue-500 rounded-full w-5 h-5 flex items-center justify-center shadow-md">
//                           <div className="bg-blue-500 rounded-full w-2 h-2 animate-ping absolute" />
//                           <div className="w-1.5 h-1.5 bg-white rounded-full" />
//                         </div>
//                       </div>
//                     )}
//                   </div>

//                   {/* Content */}
//                   <div className="flex-1 min-w-0">
//                     <div className="flex items-start justify-between">
//                       <div className="flex-1">
//                         <p
//                           className={`text-base font-semibold ${
//                             n.read
//                               ? "text-gray-700 dark:text-gray-200"
//                               : "text-gray-900 dark:text-gray-100"
//                           }`}
//                         >
//                           {n.title || "Notification"}
//                         </p>
//                         <p className="text-gray-600 dark:text-gray-300 text-sm mt-2 leading-relaxed">
//                           {n.text}
//                         </p>
//                       </div>

//                       {/* Delete button */}
//                       <button
//                         onClick={() => handleDelete(n._id)}
//                         disabled={deletingId === n._id}
//                         className="ml-4 flex items-center justify-center p-2 text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-500 rounded-xl transition-all duration-200 transform hover:scale-110"
//                       >
//                         {deletingId === n._id ? (
//                           <div className="w-5 h-5 border-2 border-t-transparent border-blue-500 rounded-full animate-spin" />
//                         ) : (
//                           <Trash2 size={18} />
//                         )}
//                       </button>
//                     </div>

//                     {/* Footer — ✅ REMOVED expires block, kept time + mark as read */}
//                     <div className="flex flex-wrap items-center gap-4 mt-4 pt-3 border-t border-gray-100 dark:border-gray-700/50">
//                       <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
//                         <Clock size={14} className="mr-1.5" />
//                         {n.createdAt
//                           ? formatDistanceToNow(createdAt, { addSuffix: true })
//                           : "Just now"}
//                       </div>

//                       {!n.read && (
//                         <button
//                           onClick={() => markAsRead(n._id)}
//                           className="flex items-center text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors"
//                         >
//                           <CheckCircle size={14} className="mr-1.5" />
//                           Mark as read
//                         </button>
//                       )}
//                       {/* ✅ REMOVED: "Expires in X hours" / "Expired" block */}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             );
//           })
//         ) : (
//           <div className="text-center py-16">
//             <div className="mx-auto w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-full flex items-center justify-center mb-4">
//               <Bell size={30} className="text-gray-400 dark:text-gray-300" />
//             </div>
//             <p className="text-gray-500 dark:text-gray-400 font-medium">
//               No notifications
//             </p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default NotificationsPage;