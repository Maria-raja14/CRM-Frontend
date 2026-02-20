// import React, { useEffect, useState, useRef } from "react";
// import axios from "axios";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../components/ui/dialog";
// import { useSearchParams, useNavigate } from "react-router-dom";
// import {
//   FaInbox, FaStar, FaExclamationCircle, FaFileAlt, FaPaperPlane,
//   FaExclamationTriangle, FaTrash, FaEdit, FaPlus, FaSync, FaSearch,
//   FaPaperclip, FaTimes, FaDownload, FaReply, FaReplyAll, FaForward,
//   FaChevronLeft, FaSignOutAlt, FaSpinner, FaEnvelope, FaCheckSquare,
//   FaAt, FaSave, FaInfoCircle, FaImage, FaFilePdf, FaFileAudio, FaFileVideo,
//   FaFileArchive, FaFile, FaFileExcel, FaFileCode, FaUsers, FaBars, FaArrowLeft,
//   FaShieldAlt, FaSortAmountDown, FaInbox as FaMailInbox, FaBolt, FaLock, FaCheck,
//   FaGooglePlusG,
// } from "react-icons/fa";
// import { MdInbox, MdAttachFile, MdFlashOn, MdLock } from "react-icons/md";

// // ============= STORAGE KEYS =============
// const STORAGE_KEYS = {
//   THREADS_CACHE: "gmail_threads_cache_v2",
//   PAGE_TOKENS: "gmail_page_tokens_v2",
//   TOTAL_COUNTS: "gmail_total_counts_v2",
//   ACTUAL_COUNTS: "gmail_actual_counts_v2",
//   ACTIVE_LABEL: "gmail_active_label_v2",
//   LAST_FETCH_TIME: "gmail_last_fetch_time_v2",
//   AUTH_STATUS: "gmail_auth_status_v2",
//   USER_EMAIL: "gmail_user_email_v2",
//   SELECTED_THREAD: "gmail_selected_thread_v2",
//   MESSAGES: "gmail_messages_v2",
//   SIDEBAR_COLLAPSED: "gmail_sidebar_collapsed_v2",
//   DELETED_THREADS: "gmail_deleted_threads_v2",
//   TRASH_MOVED_THREADS: "gmail_trash_moved_v2",
// };

// const saveToStorage = (key, data) => {
//   try { localStorage.setItem(key, JSON.stringify(data)); } catch (e) {}
// };
// const loadFromStorage = (key, def) => {
//   try { const s = localStorage.getItem(key); return s ? JSON.parse(s) : def; } catch (e) { return def; }
// };
// const loadSet = (key) => {
//   try { const s = localStorage.getItem(key); if (s) { const p = JSON.parse(s); if (Array.isArray(p)) return new Set(p); } } catch (e) {}
//   return new Set();
// };

// // ============= CONNECT SCREEN =============
// const GmailConnectScreen = ({ authUrl, authStatus, error, loading, isConnecting, onConnect, onFetchAuthUrl, onCheckStatus }) => {
//   const features = [
//     { icon: <MdInbox size={28} color="#f4b400" />, title: "Smart Inbox", desc: "Auto-organized mail" },
//     { icon: <MdFlashOn size={28} color="#f4b400" />, title: "Instant Sync", desc: "Real-time updates" },
//     { icon: <MdAttachFile size={28} color="#c0c0c0" />, title: "Attachments", desc: "Full file support" },
//     { icon: <MdLock size={28} color="#f4b400" />, title: "Secure OAuth", desc: "Google-protected" },
//   ];

//   return (
//     <div className="min-h-screen w-full flex" style={{ fontFamily: "Roboto, Arial, sans-serif" }}>
//       <div className="hidden lg:flex lg:w-1/2 xl:w-3/5 flex-col relative overflow-hidden"
//         style={{ background: "linear-gradient(145deg,#1a73e8 0%,#0d47a1 55%,#082966 100%)" }}>
//         <div className="absolute inset-0 pointer-events-none overflow-hidden">
//           <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full" style={{ background: "rgba(255,255,255,0.06)" }} />
//           <div className="absolute top-1/2 -right-20 w-72 h-72 rounded-full" style={{ background: "rgba(255,255,255,0.05)" }} />
//           <div className="absolute -bottom-16 left-1/3 w-56 h-56 rounded-full" style={{ background: "rgba(255,255,255,0.07)" }} />
//         </div>
//         <div className="relative z-10 flex flex-col h-full p-12 lg:p-16">
//           <div className="mb-auto flex items-center gap-3">
//             <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: "rgba(255,255,255,0.18)" }}>
//               <FaEnvelope size={22} color="white" />
//             </div>
//             <div>
//               <span className="text-white text-2xl font-medium tracking-wide">Gmail</span>
//               <p className="text-blue-200 text-xs">by Google</p>
//             </div>
//           </div>
//           <div className="flex-1 flex flex-col justify-center py-10">
//             <h1 className="text-white text-5xl xl:text-6xl font-light leading-tight mb-5">
//               Your inbox,<br /><span className="font-semibold">always in reach.</span>
//             </h1>
//             <p className="text-blue-100 text-xl leading-relaxed mb-12 max-w-lg">
//               Connect your Gmail to send, receive, and manage all your emails — all in one beautifully organized place.
//             </p>
//             <div className="grid grid-cols-2 gap-4">
//               {features.map((f, i) => (
//                 <div key={i} className="flex items-start gap-3 p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.10)" }}>
//                   <div className="flex-shrink-0 mt-0.5">{f.icon}</div>
//                   <div>
//                     <p className="text-white font-semibold text-sm">{f.title}</p>
//                     <p className="text-blue-200 text-xs mt-0.5">{f.desc}</p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//           <p className="text-blue-300 text-xs">© 2024 Google LLC · All rights reserved</p>
//         </div>
//       </div>

//       <div className="w-full lg:w-1/2 xl:w-2/5 flex items-center justify-center bg-white p-8 md:p-12 lg:p-16">
//         <div className="w-full max-w-sm">
//           <div className="lg:hidden flex items-center gap-2 mb-10">
//             <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "#1a73e8" }}>
//               <FaEnvelope size={16} color="white" />
//             </div>
//             <span className="text-gray-800 text-xl font-medium">Gmail</span>
//           </div>

//           <h2 className="text-3xl font-normal text-gray-800 mb-1">Sign in</h2>
//           <p className="text-gray-500 mb-7">to continue to Gmail</p>

//           {error && (
//             <div className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2.5">
//               <FaExclamationCircle className="text-red-500 mt-0.5 flex-shrink-0" size={16} />
//               <p className="text-red-700 text-sm">{error}</p>
//             </div>
//           )}
//           {authStatus.message && !error && (
//             <div className="mb-5 p-3.5 bg-blue-50 border border-blue-100 rounded-xl flex items-start gap-2.5">
//               <FaInfoCircle className="text-blue-500 mt-0.5 flex-shrink-0" size={16} />
//               <p className="text-blue-700 text-sm">{authStatus.message}</p>
//             </div>
//           )}

//           <p className="text-gray-500 text-sm mb-6 leading-relaxed">
//             Connect your Google account to access your Gmail inbox securely.
//           </p>

//           {authUrl ? (
//             <div className="space-y-3">
//               <button onClick={onConnect} disabled={isConnecting}
//                 className="w-full flex items-center justify-center gap-3 py-3 px-5 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 shadow-sm hover:shadow transition-all duration-200 disabled:opacity-60"
//                 style={{ color: "#3c4043", fontSize: "15px", fontWeight: 500 }}>
//                 {isConnecting ? (
//                   <><FaSpinner className="animate-spin" size={18} style={{ color: "#1a73e8" }} /><span>Connecting...</span></>
//                 ) : (
//                   <>
//                     <svg viewBox="0 0 24 24" width="20" height="20" className="flex-shrink-0">
//                       <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
//                       <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
//                       <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
//                       <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
//                     </svg>
//                     <span>Continue with Google</span>
//                   </>
//                 )}
//               </button>
//               <div className="flex items-center gap-3"><div className="flex-1 h-px bg-gray-200" /><span className="text-gray-400 text-xs">or</span><div className="flex-1 h-px bg-gray-200" /></div>
//               <button onClick={onConnect} disabled={isConnecting}
//                 className="w-full py-3 px-5 rounded-xl text-white font-medium text-sm transition-all duration-200 hover:opacity-90 hover:shadow-lg disabled:opacity-60"
//                 style={{ background: "linear-gradient(135deg,#1a73e8,#1557b0)" }}>
//                 {isConnecting
//                   ? <span className="flex items-center justify-center gap-2"><FaSpinner className="animate-spin" size={14} />Connecting...</span>
//                   : "Connect Gmail Account"}
//               </button>
//             </div>
//           ) : (
//             <div className="space-y-3">
//               <button onClick={onFetchAuthUrl} disabled={loading}
//                 className="w-full py-3 px-5 rounded-xl text-white font-medium text-sm disabled:opacity-60 hover:opacity-90 transition"
//                 style={{ background: "linear-gradient(135deg,#1a73e8,#1557b0)" }}>
//                 {loading ? <span className="flex items-center justify-center gap-2"><FaSpinner className="animate-spin" size={14} />Loading...</span> : "Get Connection Link"}
//               </button>
//               <button onClick={onCheckStatus}
//                 className="w-full py-2.5 px-5 rounded-xl border border-gray-300 text-gray-600 text-sm hover:bg-gray-50 transition flex items-center justify-center gap-2">
//                 <FaSync size={13} />Check Status
//               </button>
//             </div>
//           )}

//           <div className="mt-7 p-4 rounded-xl border border-gray-100 bg-gray-50 flex items-start gap-3">
//             <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
//               <FaShieldAlt size={14} color="#16a34a" />
//             </div>
//             <div>
//               <p className="text-gray-700 text-sm font-medium mb-0.5">Secure & Private</p>
//               <p className="text-gray-400 text-xs leading-relaxed">We use Google's official OAuth 2.0. Your password is never shared.</p>
//             </div>
//           </div>

//           <div className="mt-6 flex items-center justify-center gap-4">
//             {["Privacy Policy", "Terms", "Help"].map((l, i, a) => (
//               <React.Fragment key={l}>
//                 <a href="#" className="text-xs text-gray-400 hover:text-gray-600">{l}</a>
//                 {i < a.length - 1 && <span className="text-gray-200 text-xs">·</span>}
//               </React.Fragment>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// // ============= MAIN EMAIL CHAT COMPONENT =============
// const EmailChat = () => {
//   const [searchParams] = useSearchParams();
//   const navigate = useNavigate();

//   const [threadsCache, setThreadsCache] = useState(() =>
//     loadFromStorage(STORAGE_KEYS.THREADS_CACHE, { INBOX:[], UNREAD:[], STARRED:[], IMPORTANT:[], SENT:[], SPAM:[], TRASH:[], DRAFTS:[] }));
//   const [nextPageTokenCache, setNextPageTokenCache] = useState(() => loadFromStorage(STORAGE_KEYS.PAGE_TOKENS, {}));
//   const [totalEmailsCache, setTotalEmailsCache] = useState(() => loadFromStorage(STORAGE_KEYS.TOTAL_COUNTS, {}));
//   const [actualCounts, setActualCounts] = useState(() =>
//     loadFromStorage(STORAGE_KEYS.ACTUAL_COUNTS, { INBOX:0, UNREAD:0, STARRED:0, IMPORTANT:0, SENT:0, SPAM:0, TRASH:0, DRAFTS:0 }));
//   const [activeLabel, setActiveLabel] = useState(() => loadFromStorage(STORAGE_KEYS.ACTIVE_LABEL, "INBOX"));
//   const [lastFetchTime, setLastFetchTime] = useState(() => loadFromStorage(STORAGE_KEYS.LAST_FETCH_TIME, {}));
//   const [authStatus, setAuthStatus] = useState(() => loadFromStorage(STORAGE_KEYS.AUTH_STATUS, { authenticated: false, message: "" }));
//   const [userEmail, setUserEmail] = useState(() => loadFromStorage(STORAGE_KEYS.USER_EMAIL, ""));
//   const [selectedThread, setSelectedThread] = useState(() => loadFromStorage(STORAGE_KEYS.SELECTED_THREAD, null));
//   const [messages, setMessages] = useState(() => loadFromStorage(STORAGE_KEYS.MESSAGES, []));
//   const [sidebarCollapsed, setSidebarCollapsed] = useState(() => loadFromStorage(STORAGE_KEYS.SIDEBAR_COLLAPSED, false));
//   const [permanentlyDeletedThreads, setPermanentlyDeletedThreads] = useState(() => loadSet(STORAGE_KEYS.DELETED_THREADS));
//   const [trashMovedThreads, setTrashMovedThreads] = useState(() => loadSet(STORAGE_KEYS.TRASH_MOVED_THREADS));

//   // readThreads is SESSION-ONLY — not loaded from localStorage on login.
//   const [readThreads, setReadThreads] = useState(new Set());

//   const permanentlyDeletedThreadsRef = useRef(new Set());
//   const trashMovedThreadsRef = useRef(new Set());
//   const readThreadsRef = useRef(new Set());

//   const [loading, setLoading] = useState(false);
//   const [loadingLabel, setLoadingLabel] = useState(null);
//   const [initialLoadDone, setInitialLoadDone] = useState(false);
//   const [error, setError] = useState("");
//   const [authUrl, setAuthUrl] = useState("");
//   const [showCompose, setShowCompose] = useState(false);
//   const [composeData, setComposeData] = useState({ to:"", cc:"", bcc:"", subject:"", message:"", attachments:[] });
//   const [sending, setSending] = useState(false);
//   const [savingDraft, setSavingDraft] = useState(false);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [showDisconnectModal, setShowDisconnectModal] = useState(false);
//   const [threadToDelete, setThreadToDelete] = useState(null);
//   const [selectedFiles, setSelectedFiles] = useState([]);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [filterUnread, setFilterUnread] = useState(false);
//   const [labels, setLabels] = useState([]);
//   const [composeMode, setComposeMode] = useState("new");
//   const [emailSuggestions, setEmailSuggestions] = useState([]);
//   const [sendingProgress, setSendingProgress] = useState(0);
//   const [selectedThreads, setSelectedThreads] = useState(new Set());
//   const [showBulkActions, setShowBulkActions] = useState(false);
//   const [isSelectAll, setIsSelectAll] = useState(false);
//   const [forceUpdate, setForceUpdate] = useState(0);
//   const [isRefreshingCounts, setIsRefreshingCounts] = useState(false);
//   const [showMobileSidebar, setShowMobileSidebar] = useState(false);
//   const [isConnecting, setIsConnecting] = useState(false);

//   const fileInputRef = useRef(null);
//   const initialLoadDoneRef = useRef(false);
//   const abortControllerRef = useRef(null);
//   const refreshIntervalRef = useRef(null);

//   const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
//   const SI_URI = import.meta.env.VITE_SI_URI || "http://localhost:5000";

//   // ── PERSIST ──
//   useEffect(() => {
//     permanentlyDeletedThreadsRef.current = permanentlyDeletedThreads;
//     try { localStorage.setItem(STORAGE_KEYS.DELETED_THREADS, JSON.stringify(Array.from(permanentlyDeletedThreads))); } catch(e) {}
//   }, [permanentlyDeletedThreads]);

//   useEffect(() => {
//     trashMovedThreadsRef.current = trashMovedThreads;
//     try { localStorage.setItem(STORAGE_KEYS.TRASH_MOVED_THREADS, JSON.stringify(Array.from(trashMovedThreads))); } catch(e) {}
//   }, [trashMovedThreads]);

//   useEffect(() => { readThreadsRef.current = readThreads; }, [readThreads]);

//   useEffect(() => { saveToStorage(STORAGE_KEYS.THREADS_CACHE, threadsCache); }, [threadsCache]);
//   useEffect(() => { saveToStorage(STORAGE_KEYS.PAGE_TOKENS, nextPageTokenCache); }, [nextPageTokenCache]);
//   useEffect(() => { saveToStorage(STORAGE_KEYS.TOTAL_COUNTS, totalEmailsCache); }, [totalEmailsCache]);
//   useEffect(() => { saveToStorage(STORAGE_KEYS.ACTUAL_COUNTS, actualCounts); }, [actualCounts]);
//   useEffect(() => { saveToStorage(STORAGE_KEYS.ACTIVE_LABEL, activeLabel); }, [activeLabel]);
//   useEffect(() => { saveToStorage(STORAGE_KEYS.LAST_FETCH_TIME, lastFetchTime); }, [lastFetchTime]);
//   useEffect(() => { saveToStorage(STORAGE_KEYS.AUTH_STATUS, authStatus); }, [authStatus]);
//   useEffect(() => { saveToStorage(STORAGE_KEYS.USER_EMAIL, userEmail); }, [userEmail]);
//   useEffect(() => { saveToStorage(STORAGE_KEYS.SELECTED_THREAD, selectedThread); }, [selectedThread]);
//   useEffect(() => { saveToStorage(STORAGE_KEYS.MESSAGES, messages); }, [messages]);
//   useEffect(() => { saveToStorage(STORAGE_KEYS.SIDEBAR_COLLAPSED, sidebarCollapsed); }, [sidebarCollapsed]);

//   useEffect(() => {
//     if (authStatus.authenticated) {
//       if (Date.now() - (lastFetchTime.counts || 0) > 5000) fetchAllCountsFast();
//       refreshIntervalRef.current = setInterval(fetchAllCountsFast, 30000);
//     }
//     return () => { if (refreshIntervalRef.current) clearInterval(refreshIntervalRef.current); };
//   }, [authStatus.authenticated]);

//   useEffect(() => {
//     const connected = searchParams.get("gmail_connected");
//     const gmailError = searchParams.get("gmail_error");
//     if (connected === "true") {
//       toast.success("✅ Gmail connected successfully!");
//       navigate("/emailchat", { replace: true });
//       setTimeout(() => { fetchAllCountsFast(); setActiveLabel("INBOX"); fetchThreads("INBOX", false, true); }, 500);
//     }
//     if (gmailError) {
//       toast.error(`❌ ${searchParams.get("error") || "Error connecting Gmail."}`);
//       navigate("/emailchat", { replace: true });
//       setIsConnecting(false);
//     }
//   }, [searchParams, navigate]);

//   useEffect(() => {
//     if (!initialLoadDoneRef.current) {
//       initialLoadDoneRef.current = true;
//       const cachedAuth = loadFromStorage(STORAGE_KEYS.AUTH_STATUS, { authenticated: false });
//       if (!cachedAuth.authenticated || !authStatus.authenticated) {
//         checkAuthStatus();
//       } else {
//         setAuthStatus(cachedAuth);
//         setUserEmail(loadFromStorage(STORAGE_KEYS.USER_EMAIL, ""));
//         setThreadsCache(prev => {
//           const u = { ...prev };
//           Object.keys(u).forEach(label => {
//             u[label] = u[label]
//               .filter(t => !permanentlyDeletedThreadsRef.current.has(t.id))
//               .filter(t => label === "TRASH" ? true : !trashMovedThreadsRef.current.has(t.id));
//           });
//           return u;
//         });
//         setTimeout(() => { fetchAllCountsFast(); fetchThreads("INBOX", false, true); }, 100);
//       }
//     }
//   }, []);

//   useEffect(() => { if (authStatus.authenticated && labels.length === 0) fetchLabels(); }, [authStatus.authenticated]);

//   useEffect(() => {
//     const t = setTimeout(() => {
//       if (composeData.to.length > 2) fetchEmailSuggestions(composeData.to); else setEmailSuggestions([]);
//     }, 500);
//     return () => clearTimeout(t);
//   }, [composeData.to]);

//   // ── API ──
//   const fetchAllCountsFast = async () => {
//     if (isRefreshingCounts) return;
//     setIsRefreshingCounts(true);
//     try {
//       const res = await axios.get(`${API_BASE_URL}/gmail/all-counts`, { timeout: 10000 });
//       if (res.data.success) {
//         setActualCounts(res.data.counts);
//         setTotalEmailsCache(prev => ({ ...prev, ...res.data.counts }));
//         setLastFetchTime(prev => ({ ...prev, counts: Date.now() }));
//       }
//     } catch(e) {} finally { setIsRefreshingCounts(false); }
//   };

//   const checkAuthStatus = async () => {
//     try {
//       setLoading(true);
//       const res = await axios.get(`${API_BASE_URL}/gmail/auth-status`);
//       setAuthStatus(res.data);
//       if (res.data.authenticated) {
//         setUserEmail(res.data.email || "");
//         setTimeout(() => { fetchAllCountsFast(); fetchThreads("INBOX", false, true); }, 100);
//       } else { await fetchAuthUrl(); }
//     } catch(e) {
//       setAuthStatus({ authenticated: false, message: "Error checking authentication status" });
//       await fetchAuthUrl();
//     } finally { setLoading(false); }
//   };

//   const fetchAuthUrl = async () => {
//     try {
//       const res = await axios.get(`${API_BASE_URL}/gmail/auth-url`);
//       if (res.data.success) setAuthUrl(res.data.url);
//       else setError(res.data.error || "Failed to get authentication URL");
//     } catch(e) { setError(`Failed to connect to server. Make sure the backend is running on ${SI_URI}.`); }
//   };

//   const fetchThreads = async (label = activeLabel, loadMore = false, forceRefresh = false) => {
//     if (abortControllerRef.current) abortControllerRef.current.abort();
//     abortControllerRef.current = new AbortController();
//     const deleted = permanentlyDeletedThreadsRef.current;
//     const moved = trashMovedThreadsRef.current;
//     const cached = threadsCache[label];
//     const cacheAge = lastFetchTime[label] ? Date.now() - lastFetchTime[label] : Infinity;
//     if (label === "UNREAD" && !forceRefresh && !loadMore) forceRefresh = true;

//     if (!forceRefresh && !loadMore && cached && cached.length > 0 && cacheAge < 120000) {
//       const currentReadSet = readThreadsRef.current;
//       const updated = cached
//         .filter(t => !deleted.has(t.id))
//         .filter(t => label === "TRASH" ? true : !moved.has(t.id))
//         .map(t => ({
//           ...t,
//           unread: currentReadSet.has(t.id) ? false : t.unread
//         }));
//       setThreadsCache(prev => ({ ...prev, [label]: updated }));
//       setInitialLoadDone(true);
//       setForceUpdate(p => p + 1);
//       return;
//     }

//     setLoading(true); setLoadingLabel(label); setError("");
//     try {
//       const params = { maxResults: 20, label };
//       if (loadMore && nextPageTokenCache[label]) params.pageToken = nextPageTokenCache[label];
//       const res = await axios.get(`${API_BASE_URL}/gmail/threads`, { params, signal: abortControllerRef.current.signal });
//       if (res.data.success) {
//         const currentReadSet = readThreadsRef.current;
//         let threads = (res.data.data || [])
//           .sort((a, b) => (b.timestamp || new Date(b.date).getTime() || 0) - (a.timestamp || new Date(a.date).getTime() || 0))
//           .filter(t => !deleted.has(t.id))
//           .filter(t => label !== "TRASH" ? !moved.has(t.id) : true)
//           .map(t => ({
//             ...t,
//             unread: currentReadSet.has(t.id) ? false : t.unread
//           }));

//         setThreadsCache(prev => ({
//           ...prev,
//           [label]: loadMore
//             ? [...(prev[label]||[])
//                 .filter(t => !deleted.has(t.id))
//                 .filter(t => label === "TRASH" ? true : !moved.has(t.id))
//                 .map(t => ({ ...t, unread: currentReadSet.has(t.id) ? false : t.unread })),
//               ...threads]
//             : threads,
//         }));
//         setNextPageTokenCache(prev => ({ ...prev, [label]: res.data.nextPageToken }));
//         if (label === "TRASH" && res.data.totalEstimate !== undefined)
//           setActualCounts(prev => ({ ...prev, TRASH: res.data.totalEstimate }));
//         if (res.data.totalEstimate) setTotalEmailsCache(prev => ({ ...prev, [label]: res.data.totalEstimate }));
//         setLastFetchTime(prev => ({ ...prev, [label]: Date.now() }));
//         setSelectedThreads(new Set()); setShowBulkActions(false); setIsSelectAll(false);
//         setInitialLoadDone(true); setForceUpdate(p => p + 1);
//       } else { setError(res.data.error || "Failed to fetch emails"); }
//     } catch(err) {
//       if (err.name !== "AbortError" && err.code !== "ERR_CANCELED")
//         setError(err.response?.data?.error || "Failed to fetch emails");
//     } finally { setLoading(false); setLoadingLabel(null); }
//   };

//   const fetchLabels = async () => {
//     try { const res = await axios.get(`${API_BASE_URL}/gmail/labels`); if (res.data.success) setLabels(res.data.data); } catch(e) {}
//   };

//   const fetchDrafts = async () => {
//     try {
//       const res = await axios.get(`${API_BASE_URL}/gmail/drafts`, { params: { maxResults: 20 } });
//       if (res.data.success) {
//         const drafts = (res.data.data || [])
//           .filter(d => !permanentlyDeletedThreadsRef.current.has(d.id))
//           .map(d => ({ ...d, isDraft: true }));
//         setThreadsCache(prev => ({ ...prev, DRAFTS: drafts }));
//         setActualCounts(prev => ({ ...prev, DRAFTS: res.data.totalCount || drafts.length || 0 }));
//         setLastFetchTime(prev => ({ ...prev, DRAFTS: Date.now() }));
//       }
//     } catch(e) { toast.error("Failed to fetch drafts"); }
//   };

//   const fetchEmailSuggestions = async (query) => {
//     try {
//       const res = await axios.get(`${API_BASE_URL}/gmail/suggestions?query=${encodeURIComponent(query)}`);
//       if (res.data.success) setEmailSuggestions(res.data.data || []);
//     } catch(e) { setEmailSuggestions([]); }
//   };

//   const loadThread = async (threadId) => {
//     setLoading(true); setError("");
//     try {
//       let res;
//       if (activeLabel === "DRAFTS") {
//         res = await axios.get(`${API_BASE_URL}/gmail/draft/${threadId}`);
//       } else {
//         res = await axios.get(`${API_BASE_URL}/gmail/thread/${threadId}`);
//       }
//       if (res.data.success) {
//         const msgs = Array.isArray(res.data.data) ? res.data.data : (res.data.data.messages || []);
//         setMessages(msgs);
//         setSelectedThread(threadId);

//         // Mark thread as read on server
//         if (activeLabel !== "DRAFTS") {
//           await markThreadAs(threadId, "read", true);
//         }

//         fetchAllCountsFast();
//       } else { setError(res.data.error || "Failed to fetch thread/draft"); }
//     } catch(err) {
//       setError(err.response?.data?.error || "Failed to fetch thread/draft");
//     } finally { setLoading(false); }
//   };

//   const connectGmail = () => {
//     if (authUrl) { setIsConnecting(true); window.location.href = authUrl; }
//   };

//   const disconnectGmail = async () => {
//     setShowDisconnectModal(false);
//     try {
//       await axios.delete(`${API_BASE_URL}/gmail/disconnect`);
//       setReadThreads(new Set());
//       readThreadsRef.current = new Set();
//       setAuthStatus({ authenticated: false, message: "Gmail disconnected" });
//       setThreadsCache({ INBOX:[], UNREAD:[], STARRED:[], IMPORTANT:[], SENT:[], SPAM:[], TRASH:[], DRAFTS:[] });
//       setNextPageTokenCache({}); setTotalEmailsCache({}); setMessages([]); setSelectedThread(null); setUserEmail("");
//       setActualCounts({ INBOX:0, UNREAD:0, STARRED:0, IMPORTANT:0, SENT:0, SPAM:0, TRASH:0, DRAFTS:0 });
//       setPermanentlyDeletedThreads(new Set()); permanentlyDeletedThreadsRef.current = new Set();
//       setTrashMovedThreads(new Set()); trashMovedThreadsRef.current = new Set();
//       setInitialLoadDone(false);
//       Object.values(STORAGE_KEYS).forEach(k => localStorage.removeItem(k));
//       await fetchAuthUrl();
//       toast.success("Gmail disconnected successfully");
//     } catch(e) { toast.error("Error disconnecting Gmail"); }
//   };

//   // ── FILES ──
//   const handleFileSelect = (e) => {
//     const files = Array.from(e.target.files).filter(f => {
//       if (f.size > 30 * 1024 * 1024) { toast.error(`File ${f.name} exceeds 30MB`); return false; }
//       return true;
//     });
//     if (files.length) setSelectedFiles(prev => [...prev, ...files]);
//   };
//   const removeFile = idx => setSelectedFiles(prev => prev.filter((_, i) => i !== idx));
//   const triggerFileInput = () => fileInputRef.current?.click();

//   const getFileIcon = file => {
//     const t = file.type || "", ext = (file.name || file.filename || "").split(".").pop().toLowerCase();
//     if (t.startsWith("image/") || ["jpg","jpeg","png","gif","svg","webp"].includes(ext)) return <FaImage className="w-5 h-5 text-blue-500" />;
//     if (t.includes("pdf") || ext === "pdf") return <FaFilePdf className="w-5 h-5 text-red-500" />;
//     if (t.includes("audio") || ["mp3","wav","ogg","flac"].includes(ext)) return <FaFileAudio className="w-5 h-5 text-purple-500" />;
//     if (t.includes("video") || ["mp4","avi","mov","mkv"].includes(ext)) return <FaFileVideo className="w-5 h-5 text-pink-500" />;
//     if (["zip","rar","7z","tar","gz"].includes(ext)) return <FaFileArchive className="w-5 h-5 text-yellow-600" />;
//     if (["doc","docx","txt","rtf"].includes(ext)) return <FaFileAlt className="w-5 h-5 text-blue-700" />;
//     if (["xls","xlsx","csv"].includes(ext)) return <FaFileExcel className="w-5 h-5 text-green-600" />;
//     if (["js","jsx","ts","tsx","py","java","cpp","html","css"].includes(ext)) return <FaFileCode className="w-5 h-5 text-green-700" />;
//     return <FaFile className="w-5 h-5 text-gray-500" />;
//   };

//   const formatFileSize = bytes => {
//     if (!bytes) return "0 Bytes";
//     const k = 1024, s = ["Bytes","KB","MB","GB"], i = Math.floor(Math.log(bytes) / Math.log(k));
//     return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${s[i]}`;
//   };

//   const formatDateTime = ds => {
//     if (!ds) return "";
//     try {
//       const d = new Date(ds), now = new Date(), ms = now - d;
//       const mins = Math.floor(ms / 60000), hrs = Math.floor(ms / 3600000), days = Math.floor(ms / 86400000);
//       if (mins < 1) return "Just now"; if (mins < 60) return `${mins}m ago`;
//       if (hrs < 24) return `${hrs}h ago`; if (days < 7) return `${days}d ago`;
//       return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: d.getFullYear() !== now.getFullYear() ? "numeric" : undefined });
//     } catch { return ds; }
//   };

//   const extractName = s => { if (!s) return "Unknown"; const m = s.match(/(.*?)</); return m ? m[1].trim() : s; };
//   const extractEmail = s => { if (!s) return ""; const m = s.match(/<([^>]+)>/); return m ? m[1] : s; };

//   const sendEmail = async () => {
//     if (!composeData.to.trim()) { toast.error("Please enter recipient email address"); return; }
//     setSending(true); setSendingProgress(0); setError("");
//     try {
//       const fd = new FormData();
//       fd.append("to", composeData.to.trim()); fd.append("cc", composeData.cc?.trim() || "");
//       fd.append("bcc", composeData.bcc?.trim() || ""); fd.append("subject", composeData.subject?.trim() || "(No Subject)");
//       fd.append("message", composeData.message?.trim() || "");
//       selectedFiles.forEach(f => fd.append("attachments", f));
//       const res = await axios.post(`${API_BASE_URL}/gmail/send`, fd, {
//         headers: { "Content-Type": "multipart/form-data" },
//         onUploadProgress: e => { if (e.total) setSendingProgress(Math.round((e.loaded * 100) / e.total)); },
//         timeout: 300000,
//       });
//       setSendingProgress(100);
//       if (res.data.success) {
//         toast.success("📧 Email sent successfully!");
//         setComposeData({ to:"", cc:"", bcc:"", subject:"", message:"", attachments:[] });
//         setSelectedFiles([]); setShowCompose(false); fetchAllCountsFast();
//         if (["INBOX","SENT"].includes(activeLabel)) setTimeout(() => fetchThreads(activeLabel, false, true), 500);
//         else setTimeout(() => fetchThreads("INBOX", false, true), 1000);
//         setTimeout(() => setSendingProgress(0), 1000);
//       } else { throw new Error(res.data.error || "Failed to send email"); }
//     } catch(err) { toast.error(`Failed to send: ${err.response?.data?.error || err.message}`); setSendingProgress(0); }
//     finally { setSending(false); }
//   };

//   const saveAsDraft = async () => {
//     if (!composeData.to.trim()) { toast.error("Please enter recipient email address"); return; }
//     setSavingDraft(true);
//     try {
//       const fd = new FormData();
//       fd.append("to", composeData.to); fd.append("cc", composeData.cc || ""); fd.append("bcc", composeData.bcc || "");
//       fd.append("subject", composeData.subject || "(No Subject)"); fd.append("message", composeData.message || "");
//       selectedFiles.forEach(f => fd.append("attachments", f));
//       const res = await axios.post(`${API_BASE_URL}/gmail/draft`, fd, { headers: { "Content-Type": "multipart/form-data" } });
//       if (res.data.success) {
//         toast.success("📝 Draft saved!");
//         setComposeData({ to:"", cc:"", bcc:"", subject:"", message:"", attachments:[] });
//         setSelectedFiles([]); setShowCompose(false); fetchAllCountsFast();
//         if (activeLabel === "DRAFTS") setTimeout(fetchDrafts, 500);
//       } else { throw new Error(res.data.error || "Failed to save draft"); }
//     } catch(err) { toast.error(`Failed to save draft: ${err.response?.data?.error || err.message}`); }
//     finally { setSavingDraft(false); }
//   };

//   const markThreadAs = async (threadId, action, value = true) => {
//     const prevReadThreads = new Set(readThreads);
//     const prevThreadsCache = JSON.parse(JSON.stringify(threadsCache));
//     const prevActualCounts = { ...actualCounts };

//     try {
//       let endpoint = "", body = {};
//       switch(action) {
//         case "read": endpoint = `thread/${threadId}/read`; body = { read: value }; break;
//         case "star": endpoint = `thread/${threadId}/star`; body = { star: value }; break;
//         case "spam": endpoint = `thread/${threadId}/spam`; body = { spam: value }; break;
//         case "important": endpoint = `thread/${threadId}/important`; body = { important: value }; break;
//         case "trash": endpoint = `thread/${threadId}/trash`; break;
//       }
//       if (action === "read") {
//         setReadThreads(prev => { const s = new Set(prev); value ? s.add(threadId) : s.delete(threadId); return s; });
//       }
//       setThreadsCache(prev => {
//         const u = { ...prev };
//         Object.keys(u).forEach(l => {
//           u[l] = u[l].map(t => {
//             if (t.id !== threadId) return t;
//             const upd = { ...t };
//             switch(action) {
//               case "read": upd.unread = !value; break;
//               case "star": upd.starred = value; break;
//               case "spam": upd.spam = value; break;
//               case "important": upd.important = value; break;
//               case "trash": upd.trash = true; break;
//             }
//             return upd;
//           });
//         });
//         return u;
//       });
//       if (action === "star") setActualCounts(prev => ({ ...prev, STARRED: value ? prev.STARRED + 1 : Math.max(0, prev.STARRED - 1) }));
//       if (action === "important") setActualCounts(prev => ({ ...prev, IMPORTANT: value ? prev.IMPORTANT + 1 : Math.max(0, prev.IMPORTANT - 1) }));
//       if (action === "read" && activeLabel === "INBOX") setActualCounts(prev => ({ ...prev, UNREAD: value ? Math.max(0, prev.UNREAD - 1) : prev.UNREAD + 1 }));
//       setForceUpdate(p => p + 1);

//       const res = await axios.post(`${API_BASE_URL}/gmail/${endpoint}`, body);
//       if (res.data.success) {
//         toast.success(res.data.message);
//         if (action === "star" && value && activeLabel === "INBOX") {
//           setThreadsCache(prev => {
//             const starred = prev.STARRED || [], toAdd = prev[activeLabel]?.find(t => t.id === threadId);
//             if (toAdd && !starred.some(t => t.id === threadId)) return { ...prev, STARRED: [{ ...toAdd, starred: true }, ...starred] };
//             return prev;
//           });
//         }
//         if ((action === "star" && activeLabel === "STARRED" && !value) ||
//             (action === "important" && activeLabel === "IMPORTANT" && !value) ||
//             (action === "spam" && activeLabel === "SPAM" && !value) ||
//             (action === "trash" && activeLabel === "TRASH")) {
//           setThreadsCache(prev => ({ ...prev, [activeLabel]: (prev[activeLabel] || []).filter(t => t.id !== threadId) }));
//           if (selectedThread === threadId) { setSelectedThread(null); setMessages([]); }
//         }
//         fetchAllCountsFast();
//       } else {
//         throw new Error(res.data.error || "API error");
//       }
//     } catch(err) {
//       setReadThreads(prevReadThreads);
//       setThreadsCache(prevThreadsCache);
//       setActualCounts(prevActualCounts);
//       setForceUpdate(p => p + 1);
//       toast.error(`Failed to ${action} thread`);
//       fetchAllCountsFast();
//     }
//   };

//   const handleBulkAction = async (action, value = true) => {
//     if (selectedThreads.size === 0) { toast.error("No emails selected"); return; }
//     const ids = Array.from(selectedThreads);
//     try {
//       if (action === "read") {
//         setReadThreads(prev => { const s = new Set(prev); ids.forEach(id => value ? s.add(id) : s.delete(id)); return s; });
//         setThreadsCache(prev => ({ ...prev, [activeLabel]: (prev[activeLabel] || []).map(t => selectedThreads.has(t.id) ? { ...t, unread: !value } : t) }));
//         setActualCounts(prev => ({ ...prev, UNREAD: value ? Math.max(0, prev.UNREAD - ids.length) : prev.UNREAD + ids.length }));
//       }
//       if (action === "star") {
//         setThreadsCache(prev => ({ ...prev, [activeLabel]: (prev[activeLabel] || []).map(t => selectedThreads.has(t.id) ? { ...t, starred: value } : t) }));
//         setActualCounts(prev => ({ ...prev, STARRED: value ? prev.STARRED + ids.length : Math.max(0, prev.STARRED - ids.length) }));
//       }
//       if (action === "trash") {
//         setThreadsCache(prev => ({ ...prev, [activeLabel]: (prev[activeLabel] || []).filter(t => !selectedThreads.has(t.id)) }));
//         setActualCounts(prev => ({ ...prev, TRASH: prev.TRASH + ids.length }));
//       }
//       setForceUpdate(p => p + 1);
//       switch(action) {
//         case "star": await axios.post(`${API_BASE_URL}/gmail/bulk-star`, { threadIds: ids, star: value }); toast.success(`⭐ ${value ? "Starred" : "Unstarred"} ${ids.length} emails`); break;
//         case "delete": const dr = await axios.post(`${API_BASE_URL}/gmail/bulk-delete`, { threadIds: ids, permanent: activeLabel === "TRASH" }); toast.success(`🗑️ ${dr.data.message}`); break;
//         case "read": await Promise.all(ids.map(id => axios.post(`${API_BASE_URL}/gmail/thread/${id}/read`, { read: value }))); toast.success(`Marked ${ids.length} emails as ${value ? "read" : "unread"}`); break;
//         case "trash": await Promise.all(ids.map(id => axios.post(`${API_BASE_URL}/gmail/thread/${id}/trash`))); toast.success(`Moved ${ids.length} emails to trash`); break;
//       }
//       setSelectedThreads(new Set()); setShowBulkActions(false); setIsSelectAll(false); fetchAllCountsFast();
//     } catch(err) { toast.error(`Failed to ${action} emails`); fetchAllCountsFast(); }
//   };

//   const toggleThreadSelection = threadId => {
//     const curr = threadsCache[activeLabel] || [], newSel = new Set(selectedThreads);
//     newSel.has(threadId) ? newSel.delete(threadId) : newSel.add(threadId);
//     setSelectedThreads(newSel); setShowBulkActions(newSel.size > 0); setIsSelectAll(newSel.size === curr.length);
//   };

//   const deleteThread = async (threadId, permanent = false) => {
//     try {
//       if (activeLabel === "DRAFTS") {
//         await axios.delete(`${API_BASE_URL}/gmail/draft/${threadId}`);
//         toast.success("📝 Draft permanently deleted");
//         setThreadsCache(prev => {
//           const u = { ...prev };
//           u.DRAFTS = (u.DRAFTS || []).filter(t => t.id !== threadId);
//           return u;
//         });
//         setActualCounts(prev => ({ ...prev, DRAFTS: Math.max(0, prev.DRAFTS - 1) }));
//         if (selectedThread === threadId) {
//           setMessages([]);
//           setSelectedThread(null);
//         }
//         return;
//       }

//       if (permanent) {
//         permanentlyDeletedThreadsRef.current = new Set([...permanentlyDeletedThreadsRef.current, threadId]);
//         setPermanentlyDeletedThreads(prev => { const s = new Set(prev); s.add(threadId); return s; });
//         await axios.delete(`${API_BASE_URL}/gmail/thread/${threadId}`);
//         toast.success("🗑️ Thread permanently deleted");
//         trashMovedThreadsRef.current.delete(threadId);
//         setTrashMovedThreads(prev => { const s = new Set(prev); s.delete(threadId); return s; });
//       } else {
//         trashMovedThreadsRef.current = new Set([...trashMovedThreadsRef.current, threadId]);
//         setTrashMovedThreads(prev => { const s = new Set(prev); s.add(threadId); return s; });
//         await axios.post(`${API_BASE_URL}/gmail/thread/${threadId}/trash`);
//         toast.success("🗑️ Thread moved to trash");
//         setLastFetchTime(prev => ({ ...prev, TRASH: 0 }));
//       }
//       setThreadsCache(prev => { const u = { ...prev }; Object.keys(u).forEach(l => { u[l] = u[l].filter(t => t.id !== threadId); }); return u; });
//       if (selectedThread === threadId) { setMessages([]); setSelectedThread(null); }
//       setForceUpdate(p => p + 1); fetchAllCountsFast(); setLastFetchTime({});
//     } catch(err) {
//       if (activeLabel !== "DRAFTS") {
//         if (permanent) {
//           permanentlyDeletedThreadsRef.current = new Set(Array.from(permanentlyDeletedThreadsRef.current).filter(id => id !== threadId));
//           setPermanentlyDeletedThreads(prev => { const s = new Set(prev); s.delete(threadId); return s; });
//         } else {
//           trashMovedThreadsRef.current = new Set(Array.from(trashMovedThreadsRef.current).filter(id => id !== threadId));
//           setTrashMovedThreads(prev => { const s = new Set(prev); s.delete(threadId); return s; });
//         }
//       }
//       toast.error(err.response?.data?.error || "Failed to delete");
//     } finally { setShowDeleteModal(false); setThreadToDelete(null); }
//   };

//   const confirmDeleteThread = (threadId, permanent = false) => { setThreadToDelete({ id: threadId, permanent }); setShowDeleteModal(true); };

//   const downloadAttachment = async (messageId, attachment) => {
//     try {
//       const res = await axios.get(`${API_BASE_URL}/gmail/attachment/${messageId}/${attachment.id}`, { responseType: "blob" });
//       const url = window.URL.createObjectURL(new Blob([res.data])), link = document.createElement("a");
//       link.href = url; link.setAttribute("download", attachment.filename);
//       document.body.appendChild(link); link.click(); link.remove(); window.URL.revokeObjectURL(url);
//       toast.success(`📥 Downloaded ${attachment.filename}`);
//     } catch(e) { toast.error("Failed to download attachment"); }
//   };

//   const openComposeForReply = (msg, type = "reply") => {
//     let to = "", subject = "", message = "";
//     switch(type) {
//       case "reply":
//         to = extractEmail(msg.from);
//         subject = msg.subject.startsWith("Re:") ? msg.subject : `Re: ${msg.subject}`;
//         message = `\n\nOn ${formatDateTime(msg.date)}, ${extractName(msg.from)} wrote:\n> ${msg.body?.substring(0, 200)}...`;
//         break;
//       case "replyAll":
//         const all = [extractEmail(msg.from),
//           ...(msg.to ? msg.to.split(",").map(e => extractEmail(e.trim())).filter(Boolean) : []),
//           ...(msg.cc ? msg.cc.split(",").map(e => extractEmail(e.trim())).filter(Boolean) : [])
//         ].filter((v, i, a) => a.indexOf(v) === i && v !== userEmail);
//         to = all.join(", ");
//         subject = msg.subject.startsWith("Re:") ? msg.subject : `Re: ${msg.subject}`;
//         message = `\n\nOn ${formatDateTime(msg.date)}, ${extractName(msg.from)} wrote:\n> ${msg.body?.substring(0, 200)}...`;
//         break;
//       case "forward":
//         to = ""; subject = msg.subject.startsWith("Fwd:") ? msg.subject : `Fwd: ${msg.subject}`;
//         message = `\n\n---------- Forwarded message ----------\nFrom: ${msg.from}\nDate: ${msg.date}\nSubject: ${msg.subject}\nTo: ${msg.to}\n\n${msg.body}`;
//         break;
//     }
//     setComposeData({ to, cc:"", bcc:"", subject, message, attachments:[] });
//     setComposeMode(type); setShowCompose(true);
//   };

//   const clearCompose = () => { setComposeData({ to:"", cc:"", bcc:"", subject:"", message:"", attachments:[] }); setSelectedFiles([]); setComposeMode("new"); setEmailSuggestions([]); };
//   const handleBackToList = () => { setSelectedThread(null); setMessages([]); };
//   const handleShowUnreadClick = () => handleLabelClick({ id: "UNREAD" });

//   const handleLabelClick = async label => {
//     if (abortControllerRef.current) abortControllerRef.current.abort();
//     setActiveLabel(label.id); setSelectedThread(null); setMessages([]);
//     setSearchQuery(""); setFilterUnread(false);
//     setSelectedThreads(new Set()); setShowBulkActions(false); setIsSelectAll(false);
//     if (label.id === "TRASH") {
//       setTrashMovedThreads(new Set()); trashMovedThreadsRef.current = new Set();
//       localStorage.removeItem(STORAGE_KEYS.TRASH_MOVED_THREADS);
//     }
//     if (label.id === "DRAFTS") {
//       const c = threadsCache.DRAFTS || [], age = lastFetchTime.DRAFTS ? Date.now() - lastFetchTime.DRAFTS : Infinity;
//       if (c.length > 0 && age < 120000) setForceUpdate(p => p + 1); else await fetchDrafts();
//     } else {
//       const c = threadsCache[label.id], age = lastFetchTime[label.id] ? Date.now() - lastFetchTime[label.id] : Infinity;
//       if (c && c.length > 0 && age < 120000 && label.id !== "UNREAD") {
//         const currentReadSet = readThreadsRef.current;
//         const updated = c
//           .filter(t => !permanentlyDeletedThreadsRef.current.has(t.id))
//           .filter(t => label.id === "TRASH" ? true : !trashMovedThreadsRef.current.has(t.id))
//           .map(t => ({ ...t, unread: currentReadSet.has(t.id) ? false : t.unread }));
//         setThreadsCache(prev => ({ ...prev, [label.id]: updated }));
//         setForceUpdate(p => p + 1);
//         if (age > 30000) setTimeout(() => fetchThreads(label.id, false, true), 100);
//       } else { await fetchThreads(label.id, false, false); }
//     }
//   };

//   const getSidebarCount = labelId => {
//     if (labelId === "TRASH") {
//       const tr = (threadsCache["TRASH"] || []).filter(t => !permanentlyDeletedThreadsRef.current.has(t.id));
//       if (lastFetchTime["TRASH"] && lastFetchTime["TRASH"] > 0) return tr.length > 0 ? actualCounts.TRASH : tr.length;
//       return actualCounts.TRASH;
//     }
//     return actualCounts[labelId] || 0;
//   };

//   const currentThreads = (threadsCache[activeLabel] || []).filter(t => {
//     try {
//       return !permanentlyDeletedThreadsRef.current.has(t.id) &&
//         (activeLabel === "TRASH" ? true : !trashMovedThreadsRef.current.has(t.id));
//     } catch(e) { return true; }
//   });

//   // 🔧 FIX: For UNREAD label, only show threads that are truly unread
//   const filteredThreads = currentThreads.filter(t => {
//     const ms = searchQuery === "" || t.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       t.from?.toLowerCase().includes(searchQuery.toLowerCase()) || t.snippet?.toLowerCase().includes(searchQuery.toLowerCase());
//     // If we are in UNREAD label, hide read threads
//     if (activeLabel === "UNREAD" && !t.unread) return false;
//     return ms && (!filterUnread || t.unread);
//   });

//   const labelOptions = [
//     { id:"INBOX", name:"Inbox", icon:<FaInbox size={15}/>, count:actualCounts.INBOX },
//     { id:"UNREAD", name:"Unread", icon:<FaEnvelope size={15}/>, count:actualCounts.UNREAD },
//     { id:"STARRED", name:"Starred", icon:<FaStar size={15}/>, count:actualCounts.STARRED },
//     { id:"IMPORTANT", name:"Important", icon:<FaExclamationCircle size={15}/>, count:actualCounts.IMPORTANT },
//     { id:"DRAFTS", name:"Drafts", icon:<FaFileAlt size={15}/>, count:actualCounts.DRAFTS },
//     { id:"SENT", name:"Sent", icon:<FaPaperPlane size={15}/>, count:actualCounts.SENT },
//     { id:"SPAM", name:"Spam", icon:<FaExclamationTriangle size={15}/>, count:actualCounts.SPAM },
//     { id:"TRASH", name:"Trash", icon:<FaTrash size={15}/>, count:getSidebarCount("TRASH") },
//   ];

//   // ── LOADING ──
//   if (loading && !authStatus.authenticated && !error && currentThreads.length === 0) {
//     return (
//       <div className="min-h-screen w-full flex items-center justify-center bg-white">
//         <div className="text-center">
//           <div className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center" style={{ background: "linear-gradient(135deg,#1a73e8,#0d47a1)" }}>
//             <FaSpinner className="animate-spin text-white" size={28} />
//           </div>
//           <h3 className="text-lg font-medium text-gray-800 mb-1">Connecting to Gmail</h3>
//           <p className="text-gray-400 text-sm">Checking authentication status...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!authStatus.authenticated) {
//     return (
//       <>
//         <ToastContainer position="top-right" autoClose={3000} />
//         <GmailConnectScreen
//           authUrl={authUrl} authStatus={authStatus} error={error}
//           loading={loading} isConnecting={isConnecting}
//           onConnect={connectGmail} onFetchAuthUrl={fetchAuthUrl} onCheckStatus={checkAuthStatus}
//         />
//       </>
//     );
//   }

//   // ── MAIN APP ──
//   return (
//     <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">
//       <ToastContainer position="top-right" autoClose={3000} />

//       {/* DISCONNECT MODAL */}
//       <Dialog open={showDisconnectModal} onOpenChange={setShowDisconnectModal}>
//         <DialogContent className="bg-white rounded-2xl shadow-xl max-w-md">
//           <DialogHeader>
//             <DialogTitle className="flex items-center gap-2 text-gray-800 text-lg font-semibold">
//               <FaSignOutAlt size={18} color="#dc2626" /> Disconnect Gmail
//             </DialogTitle>
//           </DialogHeader>
//           <div className="p-6">
//             <div className="flex items-center justify-center mb-4">
//               <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
//                 <FaExclamationTriangle size={30} color="#dc2626" />
//               </div>
//             </div>
//             <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">Are you sure?</h3>
//             <p className="text-gray-500 text-center text-sm mb-5">You'll need to reconnect to access your emails again.</p>
//             <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
//               <p className="text-sm text-yellow-800 flex items-start gap-2">
//                 <FaInfoCircle size={15} className="flex-shrink-0 mt-0.5" />
//                 <span>Your emails are stored on Google's servers and won't be deleted.</span>
//               </p>
//             </div>
//             <div className="flex items-center justify-center gap-3">
//               <button onClick={() => setShowDisconnectModal(false)}
//                 className="px-5 py-2.5 rounded-xl border border-gray-300 hover:bg-gray-50 text-gray-600 text-sm font-medium">
//                 Cancel
//               </button>
//               <button onClick={disconnectGmail}
//                 className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white flex items-center gap-2 text-sm font-medium">
//                 <FaSignOutAlt size={13} /> Disconnect
//               </button>
//             </div>
//           </div>
//         </DialogContent>
//       </Dialog>

//       {/* COMPOSE MODAL */}
//       <Dialog open={showCompose} onOpenChange={setShowCompose}>
//         <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-xl">
//           <DialogHeader className="border-b border-gray-100 pb-4">
//             <DialogTitle className="flex items-center gap-2 text-gray-800 text-lg font-semibold">
//               {composeMode === "reply" ? <FaReply size={15} /> : composeMode === "forward" ? <FaForward size={15} /> : <FaEdit size={15} />}
//               {composeMode === "reply" ? "Reply" : composeMode === "forward" ? "Forward" : "New Message"}
//             </DialogTitle>
//           </DialogHeader>
//           <div className="space-y-3 mt-4">
//             {emailSuggestions.length > 0 && (
//               <div className="bg-blue-50 border border-blue-100 rounded-xl p-3">
//                 <p className="text-sm font-medium text-blue-800 mb-2 flex items-center gap-2"><FaUsers size={14} />Suggestions:</p>
//                 <div className="space-y-1">
//                   {emailSuggestions.map((s, i) => (
//                     <button key={i} onClick={() => { setComposeData(p => ({ ...p, to: s })); setEmailSuggestions([]); }}
//                       className="w-full text-left p-2 hover:bg-blue-100 rounded-lg text-sm text-blue-700 flex items-center gap-2">
//                       <FaAt size={11} />{s}
//                     </button>
//                   ))}
//                 </div>
//               </div>
//             )}
//             {[["To*","to","email","Recipient email (comma separated)"],["Cc","cc","email","Cc (optional)"],["Bcc","bcc","email","Bcc (optional)"],["Subject","subject","text","Subject (optional)"]].map(([lbl, field, type, ph]) => (
//               <div key={field} className="flex items-center border-b border-gray-100 pb-2">
//                 <label className="w-16 text-sm font-medium text-gray-500">{lbl}</label>
//                 <input type={type} value={composeData[field]} onChange={e => setComposeData(p => ({ ...p, [field]: e.target.value }))}
//                   className="flex-1 p-2 border-none focus:ring-0 focus:outline-none text-gray-800 text-sm placeholder-gray-400" placeholder={ph} />
//               </div>
//             ))}
//             <div className="border border-gray-200 rounded-xl p-4 bg-gray-50">
//               <div className="flex items-center justify-between mb-3">
//                 <label className="text-sm font-medium text-gray-600 flex items-center gap-2">
//                   <FaPaperclip size={13} />Attachments <span className="text-gray-400 font-normal text-xs">(max 30MB)</span>
//                 </label>
//                 <button onClick={triggerFileInput}
//                   className="text-xs text-white px-3 py-1.5 rounded-lg flex items-center gap-1.5" style={{ background: "#1a73e8" }}>
//                   <FaPlus size={10} />Add
//                 </button>
//                 <input ref={fileInputRef} type="file" multiple onChange={handleFileSelect} className="hidden" accept="*/*" />
//               </div>
//               {selectedFiles.length > 0 ? (
//                 <div className="space-y-2">
//                   {selectedFiles.map((f, i) => (
//                     <div key={i} className="flex items-center justify-between p-2.5 bg-white rounded-lg border border-gray-100">
//                       <div className="flex items-center gap-2 flex-1 min-w-0">
//                         <span>{getFileIcon(f)}</span>
//                         <div className="min-w-0">
//                           <p className="text-xs font-medium text-gray-700 truncate">{f.name}</p>
//                           <p className="text-xs text-gray-400">{formatFileSize(f.size)}</p>
//                         </div>
//                       </div>
//                       <button onClick={() => removeFile(i)} className="ml-2 text-red-400 hover:text-red-600 p-1">
//                         <FaTimes size={12} />
//                       </button>
//                     </div>
//                   ))}
//                 </div>
//               ) : (
//                 <div className="text-center py-6 border-2 border-dashed border-gray-200 rounded-xl">
//                   <FaPaperclip size={28} className="text-gray-300 mx-auto mb-2" />
//                   <p className="text-xs text-gray-400">Drop files here or click Add</p>
//                 </div>
//               )}
//             </div>
//             <textarea value={composeData.message} onChange={e => setComposeData(p => ({ ...p, message: e.target.value }))}
//               rows="10" className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:outline-none resize-none text-sm text-gray-800 placeholder-gray-400"
//               placeholder="Write your message..." />
//           </div>
//           {sending && sendingProgress > 0 && (
//             <div className="mt-4">
//               <div className="flex justify-between text-xs text-gray-500 mb-1"><span>Sending...</span><span>{sendingProgress}%</span></div>
//               <div className="w-full bg-gray-100 rounded-full h-1.5">
//                 <div className="h-1.5 rounded-full transition-all duration-300" style={{ width: `${sendingProgress}%`, background: "#1a73e8" }} />
//               </div>
//             </div>
//           )}
//           <div className="flex justify-between items-center mt-5 pt-4 border-t border-gray-100">
//             <div className="flex gap-2">
//               <button onClick={clearCompose} className="px-3 py-2 text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-1.5 text-xs">
//                 <FaTrash size={12} />Clear
//               </button>
//               <button onClick={saveAsDraft} disabled={savingDraft || !composeData.to.trim()}
//                 className="px-3 py-2 bg-gray-100 text-gray-600 rounded-lg border border-gray-200 hover:bg-gray-200 disabled:opacity-50 flex items-center gap-1.5 text-xs">
//                 {savingDraft ? <><FaSpinner className="animate-spin" size={11} />Saving...</> : <><FaSave size={12} />Draft</>}
//               </button>
//             </div>
//             <div className="flex gap-2">
//               <button onClick={() => setShowCompose(false)} className="px-4 py-2 text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50 text-sm">Cancel</button>
//               <button onClick={sendEmail} disabled={sending || !composeData.to.trim()}
//                 className="px-4 py-2 text-white rounded-lg disabled:opacity-50 flex items-center gap-1.5 text-sm"
//                 style={{ background: sending ? "#ccc" : "linear-gradient(135deg,#1a73e8,#1557b0)" }}>
//                 {sending ? <><FaSpinner className="animate-spin" size={13} />Sending...</> : <><FaPaperPlane size={13} />Send</>}
//               </button>
//             </div>
//           </div>
//         </DialogContent>
//       </Dialog>

//       {/* DELETE MODAL */}
//       <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
//         <DialogContent className="bg-white rounded-2xl shadow-xl max-w-md">
//           <DialogHeader>
//             <DialogTitle className="flex items-center gap-2 text-gray-800 text-lg font-semibold">
//               <FaTrash size={16} color={threadToDelete?.permanent ? "#dc2626" : "#f97316"} />
//               {threadToDelete?.permanent ? "Permanently Delete" : "Move to Trash"}
//             </DialogTitle>
//           </DialogHeader>
//           <div className="p-6">
//             <div className="flex items-center justify-center mb-4">
//               <div className={`w-16 h-16 ${threadToDelete?.permanent ? "bg-red-100" : "bg-orange-100"} rounded-full flex items-center justify-center`}>
//                 {threadToDelete?.permanent
//                   ? <FaExclamationTriangle size={30} color="#dc2626" />
//                   : <FaTrash size={28} color="#f97316" />}
//               </div>
//             </div>
//             <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
//               {threadToDelete?.permanent ? "Delete permanently?" : "Move to trash?"}
//             </h3>
//             <p className="text-gray-500 text-sm text-center mb-6">
//               {threadToDelete?.permanent ? "This cannot be undone." : "You can restore it from trash later."}
//             </p>
//             <div className="flex items-center justify-center gap-3">
//               <button onClick={() => { setShowDeleteModal(false); setThreadToDelete(null); }}
//                 className="px-5 py-2.5 rounded-xl border border-gray-300 hover:bg-gray-50 text-gray-600 text-sm font-medium">
//                 Cancel
//               </button>
//               <button onClick={() => deleteThread(threadToDelete.id, threadToDelete.permanent)}
//                 className={`px-5 py-2.5 rounded-xl text-white flex items-center gap-2 text-sm font-medium ${threadToDelete?.permanent ? "bg-red-600 hover:bg-red-700" : "bg-orange-500 hover:bg-orange-600"}`}>
//                 <FaTrash size={13} />
//                 {threadToDelete?.permanent ? "Delete" : "Move to Trash"}
//               </button>
//             </div>
//           </div>
//         </DialogContent>
//       </Dialog>

//       {/* LAYOUT */}
//       <div className="flex h-full overflow-hidden">
//         {/* Mobile toggle */}
//         <button onClick={() => setShowMobileSidebar(!showMobileSidebar)}
//           className="lg:hidden fixed top-4 left-4 z-50 bg-white p-2.5 rounded-xl shadow-lg border border-gray-200">
//           <FaBars size={16} color="#5f6368" />
//         </button>

//         {/* SIDEBAR */}
//         <div className={`${sidebarCollapsed ? "w-16" : "w-60"} bg-white flex flex-col transition-all duration-300 ease-in-out ${showMobileSidebar ? "fixed inset-y-0 left-0 z-40 shadow-xl" : "hidden lg:flex"}`}
//           style={{ borderRight: "1px solid #e8eaed" }}>

//           <div className="px-3 py-4 flex items-center justify-between" style={{ borderBottom: "1px solid #e8eaed" }}>
//             <div className={`flex items-center ${sidebarCollapsed ? "justify-center w-full" : "gap-2.5"}`}>
//               <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium flex-shrink-0"
//                 style={{ background: "linear-gradient(135deg,#1a73e8,#0d47a1)" }}>
//                 {userEmail?.charAt(0).toUpperCase()}
//               </div>
//               {!sidebarCollapsed && (
//                 <div className="min-w-0">
//                   <p className="text-xs font-medium text-gray-800 truncate">{userEmail}</p>
//                   <p className="text-xs" style={{ color: "#5f6368" }}>{actualCounts.UNREAD} unread</p>
//                 </div>
//               )}
//             </div>
//             <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)} className="hidden lg:block p-1 hover:bg-gray-100 rounded-lg">
//               <FaChevronLeft size={11} className={`text-gray-400 transform transition-transform ${sidebarCollapsed ? "rotate-180" : ""}`} />
//             </button>
//           </div>

//           <div className="p-3" style={{ borderBottom: "1px solid #f1f3f4" }}>
//             <button onClick={() => { setComposeMode("new"); setShowCompose(true); }}
//               className={`w-full text-sm font-medium py-2.5 rounded-2xl flex items-center justify-center gap-2 transition hover:shadow-md ${sidebarCollapsed ? "px-2" : "px-4"}`}
//               style={{ background: "#c2e7ff", color: "#001d35" }}>
//               <FaEdit size={14} className="flex-shrink-0" />
//               {!sidebarCollapsed && <span>Compose</span>}
//             </button>
//           </div>

//           <div className="flex-1 overflow-y-auto py-2">
//             <div className="flex flex-col gap-0.5 px-1">
//               {labelOptions.map(label => (
//                 <button key={label.id}
//                   onClick={() => { handleLabelClick(label); setShowMobileSidebar(false); }}
//                   className={`w-full flex items-center ${sidebarCollapsed ? "justify-center px-2" : "justify-between px-3"} py-2 transition-all duration-100 text-sm`}
//                   style={{
//                     borderRadius: "0 100px 100px 0",
//                     background: activeLabel === label.id ? "#d3e3fd" : "transparent",
//                     color: activeLabel === label.id ? "#1a73e8" : "#444746",
//                     fontWeight: activeLabel === label.id ? 600 : 400,
//                     marginRight: "8px",
//                   }}
//                   onMouseEnter={e => { if (activeLabel !== label.id) e.currentTarget.style.background = "#f1f3f4"; }}
//                   onMouseLeave={e => { e.currentTarget.style.background = activeLabel === label.id ? "#d3e3fd" : "transparent"; }}
//                   title={sidebarCollapsed ? label.name : ""}
//                 >
//                   <div className={`flex items-center ${sidebarCollapsed ? "" : "gap-3"}`}>
//                     <span style={{ color: activeLabel === label.id ? "#1a73e8" : "#444746" }}>{label.icon}</span>
//                     {!sidebarCollapsed && <span>{label.name}</span>}
//                   </div>
//                   {!sidebarCollapsed && label.count > 0 && (
//                     <span className="text-xs font-semibold" style={{ color: activeLabel === label.id ? "#1a73e8" : "#444746" }}>
//                       {label.count > 999 ? `${Math.floor(label.count / 1000)}k` : label.count}
//                     </span>
//                   )}
//                 </button>
//               ))}
//             </div>
//           </div>

//           <div className="p-3" style={{ borderTop: "1px solid #e8eaed" }}>
//             <button onClick={() => setShowDisconnectModal(true)}
//               className={`w-full text-xs text-red-500 hover:bg-red-50 px-3 py-2 rounded-xl transition flex items-center ${sidebarCollapsed ? "justify-center" : "gap-2"}`}>
//               <FaSignOutAlt size={13} />
//               {!sidebarCollapsed && <span>Disconnect</span>}
//             </button>
//           </div>
//         </div>

//         {/* MAIN CONTENT */}
//         <div className="flex-1 flex flex-col overflow-hidden" style={{ background: "#f6f8fc" }}>
//           <div className="bg-white px-5 py-3 flex-shrink-0" style={{ borderBottom: "1px solid #e8eaed" }}>
//             <div className="flex items-center justify-between">
//               <div className="flex items-center gap-3">
//                 {selectedThread && (
//                   <button onClick={handleBackToList} className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition">
//                     <FaArrowLeft size={15} />
//                   </button>
//                 )}
            


// <h1 className="text-base font-medium flex items-center gap-2" style={{ color: "#202124" }}>
//   {selectedThread ? (
//     <span className="truncate max-w-md">{messages[0]?.subject || "Email"}</span>
//   ) : (
//     <>
//       <span style={{ color: "#5f6368" }}>{labelOptions.find(l => l.id === activeLabel)?.icon}</span>
//       <span>{labelOptions.find(l => l.id === activeLabel)?.name}</span>
//       {/* 🔧 FIX: Show total count from actualCounts, not filteredThreads.length */}
//       <span className="text-sm font-normal ml-1" style={{ color: "#5f6368" }}>
//         ({actualCounts[activeLabel] || 0})
//       </span>
//     </>
//   )}
// </h1>

//               </div>
//               <div className="flex items-center gap-1">
//                 <button onClick={() => fetchThreads(activeLabel, false, true)} disabled={loading && loadingLabel === activeLabel}
//                   className="p-2 rounded-full hover:bg-gray-100 transition" style={{ color: "#5f6368" }}>
//                   {loading && loadingLabel === activeLabel ? <FaSpinner className="animate-spin" size={15} /> : <FaSync size={15} />}
//                 </button>
//               </div>
//             </div>

//             {showBulkActions && !selectedThread && (
//               <div className="mt-3 px-3 py-2 rounded-xl flex items-center gap-3 flex-wrap" style={{ background: "#e8f0fe" }}>
//                 <span className="text-xs font-medium flex items-center gap-1" style={{ color: "#1a73e8" }}>
//                   <FaCheckSquare size={13} />{selectedThreads.size} selected
//                 </span>
//                 {[["read",true,"Mark Read"],["star",true,"⭐ Star"],["trash",null,"🗑 Trash"]].map(([a, v, l]) => (
//                   <button key={a} onClick={() => handleBulkAction(a, v)}
//                     className="text-xs bg-white px-3 py-1 rounded-full border transition"
//                     style={{ color: "#1a73e8", borderColor: "#c5d6f5" }}>{l}</button>
//                 ))}
//                 <button onClick={() => { setSelectedThreads(new Set()); setShowBulkActions(false); setIsSelectAll(false); }}
//                   className="ml-auto text-xs" style={{ color: "#5f6368" }}>Clear</button>
//               </div>
//             )}

//             {!selectedThread && (
//               <div className="mt-3 flex gap-2">
//                 <div className="flex-1 relative">
//                   <FaSearch size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "#5f6368" }} />
//                   <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
//                     placeholder={`Search in ${activeLabel.toLowerCase()}...`}
//                     className="w-full pl-9 pr-4 py-2 rounded-2xl text-sm border-0 outline-none"
//                     style={{ background: "#eaf1fb", color: "#202124" }} />
//                 </div>
//                 {activeLabel === "INBOX" && (
//                   <button onClick={handleShowUnreadClick}
//                     className="px-3.5 py-2 rounded-2xl text-sm flex items-center gap-2 transition"
//                     style={{ background: "#fff", border: "1px solid #e8eaed", color: "#5f6368" }}>
//                     <FaEnvelope size={13} />
//                     <span className="hidden sm:inline">Unread</span>
//                     {actualCounts.UNREAD > 0 && (
//                       <span className="text-white text-xs rounded-full px-1.5 py-0.5 font-semibold" style={{ background: "#1a73e8" }}>
//                         {actualCounts.UNREAD}
//                       </span>
//                     )}
//                   </button>
//                 )}
//               </div>
//             )}
//           </div>

//           {error && (
//             <div className="mx-4 mt-3 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center gap-2 text-sm">
//               <FaExclamationCircle size={15} />{error}
//             </div>
//           )}

//           <div className="flex-1 overflow-y-auto p-4">
//             {!selectedThread ? (
//               <div>
//                 {loading && loadingLabel === activeLabel && currentThreads.length === 0 && !initialLoadDone ? (
//                   <div className="flex items-center justify-center h-64">
//                     <FaSpinner className="animate-spin" size={28} style={{ color: "#1a73e8" }} />
//                   </div>
//                 ) : filteredThreads.length === 0 ? (
//                   <div className="flex items-center justify-center h-64">
//                     <div className="text-center">
//                       <div className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ background: "#f1f3f4" }}>
//                         <FaEnvelope size={34} style={{ color: "#dadce0" }} />
//                       </div>
//                       <h3 className="text-base font-medium mb-1" style={{ color: "#5f6368" }}>No emails found</h3>
//                       <p className="text-sm" style={{ color: "#80868b" }}>
//                         {searchQuery ? "Try adjusting your search" : activeLabel === "INBOX" ? "Your inbox is empty" : activeLabel === "UNREAD" ? "You're all caught up! 🎉" : `No emails in ${activeLabel.toLowerCase()}`}
//                       </p>
//                     </div>
//                   </div>
//                 ) : (
//                   <div className="rounded-2xl overflow-hidden bg-white" style={{ border: "1px solid #e8eaed" }}>
//                     {filteredThreads.map(thread => (
//                       <div key={thread.id}
//                         className={`group flex items-center px-4 py-2.5 cursor-pointer transition-all duration-100 border-b last:border-0`}
//                         style={{
//                           borderColor: "#f1f3f4",
//                           background: selectedThread === thread.id ? "#e8f0fe" : thread.unread ? "#fafafa" : "white",
//                           fontWeight: thread.unread ? 500 : 400,
//                         }}
//                         onMouseEnter={e => { if (selectedThread !== thread.id) e.currentTarget.style.background = "#f6f8fc"; }}
//                         onMouseLeave={e => { e.currentTarget.style.background = selectedThread === thread.id ? "#e8f0fe" : thread.unread ? "#fafafa" : "white"; }}
//                       >
//                         <input type="checkbox" checked={selectedThreads.has(thread.id)}
//                           onChange={() => toggleThreadSelection(thread.id)} onClick={e => e.stopPropagation()}
//                           className="h-4 w-4 rounded border-gray-300 mr-3 flex-shrink-0" style={{ accentColor: "#1a73e8" }} />
//                         <button onClick={e => { e.stopPropagation(); markThreadAs(thread.id, "star", !thread.starred); }}
//                           className={`mr-3 flex-shrink-0 transition ${thread.starred ? "" : "opacity-0 group-hover:opacity-100"}`}
//                           style={{ color: thread.starred ? "#f4b400" : "#dadce0" }}>
//                           <FaStar size={15} />
//                         </button>
//                         <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0 mr-3"
//                           style={{ background: `hsl(${(thread.from?.charCodeAt(0) || 65) * 17 % 360},50%,45%)` }}>
//                           {extractName(thread.from).charAt(0).toUpperCase()}
//                         </div>
//                         <div className="flex-1 min-w-0 cursor-pointer" onClick={() => loadThread(thread.id)}>
//                           <div className="flex items-center gap-2">
//                             <span className="text-sm truncate w-40 flex-shrink-0"
//                               style={{ color: thread.unread ? "#202124" : "#5f6368", fontWeight: thread.unread ? 600 : 400 }}>
//                               {extractName(thread.from)}
//                             </span>
//                             <span className="text-sm truncate" style={{ color: thread.unread ? "#202124" : "#5f6368" }}>
//                               {thread.subject || "(No Subject)"}
//                               <span className="font-normal ml-1.5" style={{ color: "#80868b" }}>{thread.snippet}</span>
//                             </span>
//                           </div>
//                         </div>
//                         <div className="flex items-center gap-3 ml-3 flex-shrink-0">
//                           {thread.unread && <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: "#1a73e8" }} />}
//                           <span className="text-xs whitespace-nowrap" style={{ color: "#5f6368" }}>{formatDateTime(thread.date)}</span>
//                           <button onClick={e => { e.stopPropagation(); confirmDeleteThread(thread.id, activeLabel === "TRASH"); }}
//                             className="opacity-0 group-hover:opacity-100 transition p-1 rounded-full hover:bg-gray-100" style={{ color: "#5f6368" }}>
//                             <FaTrash size={13} />
//                           </button>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//                 {nextPageTokenCache[activeLabel] && filteredThreads.length > 0 && (
//                   <div className="mt-3 text-center">
//                     <button onClick={() => fetchThreads(activeLabel, true)} disabled={loading && loadingLabel === activeLabel}
//                       className="text-sm px-5 py-2 rounded-full border transition"
//                       style={{ borderColor: "#dadce0", color: "#1a73e8", background: "white" }}>
//                       {loading && loadingLabel === activeLabel
//                         ? <><FaSpinner className="animate-spin inline mr-2" size={13} />Loading...</>
//                         : <><FaPlus className="inline mr-2" size={13} />Load More</>}
//                     </button>
//                   </div>
//                 )}
//               </div>
//             ) : (
//               <div className="bg-white rounded-2xl overflow-hidden" style={{ border: "1px solid #e8eaed" }}>
//                 {messages.length === 0 ? (
//                   <div className="text-center py-12">
//                     <FaEnvelope size={46} className="mx-auto mb-3" style={{ color: "#dadce0" }} />
//                     <p className="text-sm" style={{ color: "#5f6368" }}>No messages</p>
//                   </div>
//                 ) : (
//                   <div>
//                     {messages.map(msg => (
//                       <div key={msg.id} className="p-6" style={{ borderBottom: "1px solid #f1f3f4" }}>
//                         <div className="flex items-start justify-between mb-4">
//                           <div className="flex items-center gap-3">
//                             <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold"
//                               style={{ background: `hsl(${(msg.from?.charCodeAt(0) || 65) * 17 % 360},50%,45%)` }}>
//                               {extractName(msg.from).charAt(0).toUpperCase()}
//                             </div>
//                             <div>
//                               <h4 className="font-medium text-sm" style={{ color: "#202124" }}>{extractName(msg.from)}</h4>
//                               <p className="text-xs" style={{ color: "#5f6368" }}>{extractEmail(msg.from)}</p>
//                             </div>
//                           </div>
//                           <div className="flex items-center gap-2">
//                             <span className="text-xs" style={{ color: "#5f6368" }}>{new Date(msg.date).toLocaleString()}</span>
//                             <button onClick={() => markThreadAs(selectedThread, "star", !msg.starred)}
//                               className="p-1.5 rounded-full hover:bg-gray-100" style={{ color: msg.starred ? "#f4b400" : "#dadce0" }}>
//                               <FaStar size={15} />
//                             </button>
//                             <button onClick={() => markThreadAs(selectedThread, "important", !msg.important)}
//                               className="p-1.5 rounded-full hover:bg-gray-100" style={{ color: msg.important ? "#f29900" : "#dadce0" }}>
//                               <FaExclamationCircle size={15} />
//                             </button>
//                           </div>
//                         </div>
//                         {(msg.to || msg.cc) && (
//                           <div className="mb-4 text-xs" style={{ color: "#5f6368" }}>
//                             {msg.to && <p><span className="font-medium">To:</span> {msg.to}</p>}
//                             {msg.cc && <p><span className="font-medium">Cc:</span> {msg.cc}</p>}
//                           </div>
//                         )}
//                         {msg.hasAttachments && msg.attachments?.length > 0 && (
//                           <div className="mb-4 p-3 rounded-xl" style={{ background: "#f6f8fc" }}>
//                             <h5 className="text-xs font-medium mb-2 flex items-center gap-1.5" style={{ color: "#444746" }}>
//                               <FaPaperclip size={11} />Attachments ({msg.attachments.length})
//                             </h5>
//                             <div className="space-y-1.5">
//                               {msg.attachments.map((att, idx) => (
//                                 <div key={idx} className="flex items-center justify-between p-2 bg-white rounded-lg" style={{ border: "1px solid #e8eaed" }}>
//                                   <div className="flex items-center gap-2">
//                                     <span>{getFileIcon({ type: att.mimeType, filename: att.filename })}</span>
//                                     <div>
//                                       <p className="text-xs font-medium" style={{ color: "#202124" }}>{att.filename}</p>
//                                       <p className="text-xs" style={{ color: "#5f6368" }}>{formatFileSize(att.size)}</p>
//                                     </div>
//                                   </div>
//                                   <button onClick={() => downloadAttachment(msg.id, att)}
//                                     className="text-xs px-2.5 py-1 rounded-full flex items-center gap-1"
//                                     style={{ color: "#1a73e8", background: "#e8f0fe" }}>
//                                     <FaDownload size={11} />Download
//                                   </button>
//                                 </div>
//                               ))}
//                             </div>
//                           </div>
//                         )}
//                         <div className="prose max-w-none">
//                           {msg.htmlBody ? (
//                             <div className="text-sm leading-relaxed" style={{ color: "#202124" }} dangerouslySetInnerHTML={{ __html: msg.htmlBody }} />
//                           ) : (
//                             <pre className="text-sm whitespace-pre-wrap font-sans" style={{ color: "#202124" }}>{msg.body || "No content"}</pre>
//                           )}
//                         </div>
//                         <div className="mt-5 flex items-center gap-2 pt-4" style={{ borderTop: "1px solid #f1f3f4" }}>
//                           <button onClick={() => openComposeForReply(msg, "reply")}
//                             className="text-sm px-4 py-1.5 rounded-full flex items-center gap-1.5 hover:opacity-90 transition"
//                             style={{ background: "#c2e7ff", color: "#001d35" }}>
//                             <FaReply size={13} />Reply
//                           </button>
//                           <button onClick={() => openComposeForReply(msg, "replyAll")}
//                             className="text-sm px-4 py-1.5 rounded-full border flex items-center gap-1.5 hover:bg-gray-50 transition"
//                             style={{ border: "1px solid #dadce0", color: "#444746" }}>
//                             <FaReplyAll size={13} />Reply All
//                           </button>
//                           <button onClick={() => openComposeForReply(msg, "forward")}
//                             className="text-sm px-4 py-1.5 rounded-full border flex items-center gap-1.5 hover:bg-gray-50 transition"
//                             style={{ border: "1px solid #dadce0", color: "#444746" }}>
//                             <FaForward size={13} />Forward
//                           </button>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {showMobileSidebar && (
//         <div className="fixed inset-0 bg-black bg-opacity-40 z-30 lg:hidden" onClick={() => setShowMobileSidebar(false)} />
//       )}
//     </div>
//   );
// };

// export default EmailChat;//all work perfectly now good..





import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../components/ui/dialog";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  FaInbox, FaStar, FaExclamationCircle, FaFileAlt, FaPaperPlane,
  FaExclamationTriangle, FaTrash, FaEdit, FaPlus, FaSync, FaSearch,
  FaPaperclip, FaTimes, FaDownload, FaReply, FaReplyAll, FaForward,
  FaChevronLeft, FaSignOutAlt, FaSpinner, FaEnvelope, FaCheckSquare,
  FaAt, FaSave, FaInfoCircle, FaImage, FaFilePdf, FaFileAudio, FaFileVideo,
  FaFileArchive, FaFile, FaFileExcel, FaFileCode, FaUsers, FaBars, FaArrowLeft,
  FaShieldAlt, FaSortAmountDown, FaInbox as FaMailInbox, FaBolt, FaLock, FaCheck,
  FaGooglePlusG,
} from "react-icons/fa";
import { MdInbox, MdAttachFile, MdFlashOn, MdLock } from "react-icons/md";

// ============= STORAGE KEYS =============
const STORAGE_KEYS = {
  THREADS_CACHE: "gmail_threads_cache_v2",
  PAGE_TOKENS: "gmail_page_tokens_v2",
  TOTAL_COUNTS: "gmail_total_counts_v2",
  ACTUAL_COUNTS: "gmail_actual_counts_v2",
  ACTIVE_LABEL: "gmail_active_label_v2",
  LAST_FETCH_TIME: "gmail_last_fetch_time_v2",
  AUTH_STATUS: "gmail_auth_status_v2",
  USER_EMAIL: "gmail_user_email_v2",
  SELECTED_THREAD: "gmail_selected_thread_v2",
  MESSAGES: "gmail_messages_v2",
  SIDEBAR_COLLAPSED: "gmail_sidebar_collapsed_v2",
  DELETED_THREADS: "gmail_deleted_threads_v2",
  TRASH_MOVED_THREADS: "gmail_trash_moved_v2",
};

const saveToStorage = (key, data) => {
  try { localStorage.setItem(key, JSON.stringify(data)); } catch (e) {}
};
const loadFromStorage = (key, def) => {
  try { const s = localStorage.getItem(key); return s ? JSON.parse(s) : def; } catch (e) { return def; }
};
const loadSet = (key) => {
  try { const s = localStorage.getItem(key); if (s) { const p = JSON.parse(s); if (Array.isArray(p)) return new Set(p); } } catch (e) {}
  return new Set();
};

// ============= CONNECT SCREEN =============
const GmailConnectScreen = ({ authUrl, authStatus, error, loading, isConnecting, onConnect, onFetchAuthUrl, onCheckStatus }) => {
  const features = [
    { icon: <MdInbox size={28} color="#f4b400" />, title: "Smart Inbox", desc: "Auto-organized mail" },
    { icon: <MdFlashOn size={28} color="#f4b400" />, title: "Instant Sync", desc: "Real-time updates" },
    { icon: <MdAttachFile size={28} color="#c0c0c0" />, title: "Attachments", desc: "Full file support" },
    { icon: <MdLock size={28} color="#f4b400" />, title: "Secure OAuth", desc: "Google-protected" },
  ];

  return (
    <div className="min-h-screen w-full flex" style={{ fontFamily: "Roboto, Arial, sans-serif" }}>
      <div className="hidden lg:flex lg:w-1/2 xl:w-3/5 flex-col relative overflow-hidden"
        style={{ background: "linear-gradient(145deg,#1a73e8 0%,#0d47a1 55%,#082966 100%)" }}>
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full" style={{ background: "rgba(255,255,255,0.06)" }} />
          <div className="absolute top-1/2 -right-20 w-72 h-72 rounded-full" style={{ background: "rgba(255,255,255,0.05)" }} />
          <div className="absolute -bottom-16 left-1/3 w-56 h-56 rounded-full" style={{ background: "rgba(255,255,255,0.07)" }} />
        </div>
        <div className="relative z-10 flex flex-col h-full p-12 lg:p-16">
          <div className="mb-auto flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: "rgba(255,255,255,0.18)" }}>
              <FaEnvelope size={22} color="white" />
            </div>
            <div>
              <span className="text-white text-2xl font-medium tracking-wide">Gmail</span>
              <p className="text-blue-200 text-xs">by Google</p>
            </div>
          </div>
          <div className="flex-1 flex flex-col justify-center py-10">
            <h1 className="text-white text-5xl xl:text-6xl font-light leading-tight mb-5">
              Your inbox,<br /><span className="font-semibold">always in reach.</span>
            </h1>
            <p className="text-blue-100 text-xl leading-relaxed mb-12 max-w-lg">
              Connect your Gmail to send, receive, and manage all your emails — all in one beautifully organized place.
            </p>
            <div className="grid grid-cols-2 gap-4">
              {features.map((f, i) => (
                <div key={i} className="flex items-start gap-3 p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.10)" }}>
                  <div className="flex-shrink-0 mt-0.5">{f.icon}</div>
                  <div>
                    <p className="text-white font-semibold text-sm">{f.title}</p>
                    <p className="text-blue-200 text-xs mt-0.5">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <p className="text-blue-300 text-xs">© 2024 Google LLC · All rights reserved</p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 xl:w-2/5 flex items-center justify-center bg-white p-8 md:p-12 lg:p-16">
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-2 mb-10">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "#1a73e8" }}>
              <FaEnvelope size={16} color="white" />
            </div>
            <span className="text-gray-800 text-xl font-medium">Gmail</span>
          </div>

          <h2 className="text-3xl font-normal text-gray-800 mb-1">Sign in</h2>
          <p className="text-gray-500 mb-7">to continue to Gmail</p>

          {error && (
            <div className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2.5">
              <FaExclamationCircle className="text-red-500 mt-0.5 flex-shrink-0" size={16} />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}
          {authStatus.message && !error && (
            <div className="mb-5 p-3.5 bg-blue-50 border border-blue-100 rounded-xl flex items-start gap-2.5">
              <FaInfoCircle className="text-blue-500 mt-0.5 flex-shrink-0" size={16} />
              <p className="text-blue-700 text-sm">{authStatus.message}</p>
            </div>
          )}

          <p className="text-gray-500 text-sm mb-6 leading-relaxed">
            Connect your Google account to access your Gmail inbox securely.
          </p>

          {authUrl ? (
            <div className="space-y-3">
              <button onClick={onConnect} disabled={isConnecting}
                className="w-full flex items-center justify-center gap-3 py-3 px-5 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 shadow-sm hover:shadow transition-all duration-200 disabled:opacity-60"
                style={{ color: "#3c4043", fontSize: "15px", fontWeight: 500 }}>
                {isConnecting ? (
                  <><FaSpinner className="animate-spin" size={18} style={{ color: "#1a73e8" }} /><span>Connecting...</span></>
                ) : (
                  <>
                    <svg viewBox="0 0 24 24" width="20" height="20" className="flex-shrink-0">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    <span>Continue with Google</span>
                  </>
                )}
              </button>
              <div className="flex items-center gap-3"><div className="flex-1 h-px bg-gray-200" /><span className="text-gray-400 text-xs">or</span><div className="flex-1 h-px bg-gray-200" /></div>
              <button onClick={onConnect} disabled={isConnecting}
                className="w-full py-3 px-5 rounded-xl text-white font-medium text-sm transition-all duration-200 hover:opacity-90 hover:shadow-lg disabled:opacity-60"
                style={{ background: "linear-gradient(135deg,#1a73e8,#1557b0)" }}>
                {isConnecting
                  ? <span className="flex items-center justify-center gap-2"><FaSpinner className="animate-spin" size={14} />Connecting...</span>
                  : "Connect Gmail Account"}
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <button onClick={onFetchAuthUrl} disabled={loading}
                className="w-full py-3 px-5 rounded-xl text-white font-medium text-sm disabled:opacity-60 hover:opacity-90 transition"
                style={{ background: "linear-gradient(135deg,#1a73e8,#1557b0)" }}>
                {loading ? <span className="flex items-center justify-center gap-2"><FaSpinner className="animate-spin" size={14} />Loading...</span> : "Get Connection Link"}
              </button>
              <button onClick={onCheckStatus}
                className="w-full py-2.5 px-5 rounded-xl border border-gray-300 text-gray-600 text-sm hover:bg-gray-50 transition flex items-center justify-center gap-2">
                <FaSync size={13} />Check Status
              </button>
            </div>
          )}

          <div className="mt-7 p-4 rounded-xl border border-gray-100 bg-gray-50 flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
              <FaShieldAlt size={14} color="#16a34a" />
            </div>
            <div>
              <p className="text-gray-700 text-sm font-medium mb-0.5">Secure & Private</p>
              <p className="text-gray-400 text-xs leading-relaxed">We use Google's official OAuth 2.0. Your password is never shared.</p>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-center gap-4">
            {["Privacy Policy", "Terms", "Help"].map((l, i, a) => (
              <React.Fragment key={l}>
                <a href="#" className="text-xs text-gray-400 hover:text-gray-600">{l}</a>
                {i < a.length - 1 && <span className="text-gray-200 text-xs">·</span>}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ============= MAIN EMAIL CHAT COMPONENT =============
const EmailChat = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [threadsCache, setThreadsCache] = useState(() =>
    loadFromStorage(STORAGE_KEYS.THREADS_CACHE, { INBOX:[], UNREAD:[], STARRED:[], IMPORTANT:[], SENT:[], SPAM:[], TRASH:[], DRAFTS:[] }));
  const [nextPageTokenCache, setNextPageTokenCache] = useState(() => loadFromStorage(STORAGE_KEYS.PAGE_TOKENS, {}));
  const [totalEmailsCache, setTotalEmailsCache] = useState(() => loadFromStorage(STORAGE_KEYS.TOTAL_COUNTS, {}));
  const [actualCounts, setActualCounts] = useState(() =>
    loadFromStorage(STORAGE_KEYS.ACTUAL_COUNTS, { INBOX:0, UNREAD:0, STARRED:0, IMPORTANT:0, SENT:0, SPAM:0, TRASH:0, DRAFTS:0 }));
  const [activeLabel, setActiveLabel] = useState(() => loadFromStorage(STORAGE_KEYS.ACTIVE_LABEL, "INBOX"));
  const [lastFetchTime, setLastFetchTime] = useState(() => loadFromStorage(STORAGE_KEYS.LAST_FETCH_TIME, {}));
  const [authStatus, setAuthStatus] = useState(() => loadFromStorage(STORAGE_KEYS.AUTH_STATUS, { authenticated: false, message: "" }));
  const [userEmail, setUserEmail] = useState(() => loadFromStorage(STORAGE_KEYS.USER_EMAIL, ""));
  const [selectedThread, setSelectedThread] = useState(() => loadFromStorage(STORAGE_KEYS.SELECTED_THREAD, null));
  const [messages, setMessages] = useState(() => loadFromStorage(STORAGE_KEYS.MESSAGES, []));
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => loadFromStorage(STORAGE_KEYS.SIDEBAR_COLLAPSED, false));
  const [permanentlyDeletedThreads, setPermanentlyDeletedThreads] = useState(() => loadSet(STORAGE_KEYS.DELETED_THREADS));
  const [trashMovedThreads, setTrashMovedThreads] = useState(() => loadSet(STORAGE_KEYS.TRASH_MOVED_THREADS));

  // readThreads is SESSION-ONLY — not loaded from localStorage on login.
  const [readThreads, setReadThreads] = useState(new Set());

  const permanentlyDeletedThreadsRef = useRef(new Set());
  const trashMovedThreadsRef = useRef(new Set());
  const readThreadsRef = useRef(new Set());

  const [loading, setLoading] = useState(false);
  const [loadingLabel, setLoadingLabel] = useState(null);
  const [initialLoadDone, setInitialLoadDone] = useState(false);
  const [error, setError] = useState("");
  const [authUrl, setAuthUrl] = useState("");
  const [showCompose, setShowCompose] = useState(false);
  const [composeData, setComposeData] = useState({ to:"", cc:"", bcc:"", subject:"", message:"", attachments:[] });
  const [sending, setSending] = useState(false);
  const [savingDraft, setSavingDraft] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDisconnectModal, setShowDisconnectModal] = useState(false);
  const [threadToDelete, setThreadToDelete] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterUnread, setFilterUnread] = useState(false);
  const [labels, setLabels] = useState([]);
  const [composeMode, setComposeMode] = useState("new");
  const [emailSuggestions, setEmailSuggestions] = useState([]);
  const [sendingProgress, setSendingProgress] = useState(0);
  const [selectedThreads, setSelectedThreads] = useState(new Set());
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [isSelectAll, setIsSelectAll] = useState(false);
  const [forceUpdate, setForceUpdate] = useState(0);
  const [isRefreshingCounts, setIsRefreshingCounts] = useState(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  const fileInputRef = useRef(null);
  const initialLoadDoneRef = useRef(false);
  const abortControllerRef = useRef(null);
  const refreshIntervalRef = useRef(null);

  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
  const SI_URI = import.meta.env.VITE_SI_URI || "http://localhost:5000";

  // ── PERSIST ──
  useEffect(() => {
    permanentlyDeletedThreadsRef.current = permanentlyDeletedThreads;
    try { localStorage.setItem(STORAGE_KEYS.DELETED_THREADS, JSON.stringify(Array.from(permanentlyDeletedThreads))); } catch(e) {}
  }, [permanentlyDeletedThreads]);

  useEffect(() => {
    trashMovedThreadsRef.current = trashMovedThreads;
    try { localStorage.setItem(STORAGE_KEYS.TRASH_MOVED_THREADS, JSON.stringify(Array.from(trashMovedThreads))); } catch(e) {}
  }, [trashMovedThreads]);

  useEffect(() => { readThreadsRef.current = readThreads; }, [readThreads]);

  useEffect(() => { saveToStorage(STORAGE_KEYS.THREADS_CACHE, threadsCache); }, [threadsCache]);
  useEffect(() => { saveToStorage(STORAGE_KEYS.PAGE_TOKENS, nextPageTokenCache); }, [nextPageTokenCache]);
  useEffect(() => { saveToStorage(STORAGE_KEYS.TOTAL_COUNTS, totalEmailsCache); }, [totalEmailsCache]);
  useEffect(() => { saveToStorage(STORAGE_KEYS.ACTUAL_COUNTS, actualCounts); }, [actualCounts]);
  useEffect(() => { saveToStorage(STORAGE_KEYS.ACTIVE_LABEL, activeLabel); }, [activeLabel]);
  useEffect(() => { saveToStorage(STORAGE_KEYS.LAST_FETCH_TIME, lastFetchTime); }, [lastFetchTime]);
  useEffect(() => { saveToStorage(STORAGE_KEYS.AUTH_STATUS, authStatus); }, [authStatus]);
  useEffect(() => { saveToStorage(STORAGE_KEYS.USER_EMAIL, userEmail); }, [userEmail]);
  useEffect(() => { saveToStorage(STORAGE_KEYS.SELECTED_THREAD, selectedThread); }, [selectedThread]);
  useEffect(() => { saveToStorage(STORAGE_KEYS.MESSAGES, messages); }, [messages]);
  useEffect(() => { saveToStorage(STORAGE_KEYS.SIDEBAR_COLLAPSED, sidebarCollapsed); }, [sidebarCollapsed]);

  useEffect(() => {
    if (authStatus.authenticated) {
      if (Date.now() - (lastFetchTime.counts || 0) > 5000) fetchAllCountsFast();
      refreshIntervalRef.current = setInterval(fetchAllCountsFast, 30000);
    }
    return () => { if (refreshIntervalRef.current) clearInterval(refreshIntervalRef.current); };
  }, [authStatus.authenticated]);

  useEffect(() => {
    const connected = searchParams.get("gmail_connected");
    const gmailError = searchParams.get("gmail_error");
    if (connected === "true") {
      toast.success("✅ Gmail connected successfully!");
      navigate("/emailchat", { replace: true });
      setTimeout(() => { fetchAllCountsFast(); setActiveLabel("INBOX"); fetchThreads("INBOX", false, true); }, 500);
    }
    if (gmailError) {
      toast.error(`❌ ${searchParams.get("error") || "Error connecting Gmail."}`);
      navigate("/emailchat", { replace: true });
      setIsConnecting(false);
    }
  }, [searchParams, navigate]);

  useEffect(() => {
    if (!initialLoadDoneRef.current) {
      initialLoadDoneRef.current = true;
      const cachedAuth = loadFromStorage(STORAGE_KEYS.AUTH_STATUS, { authenticated: false });
      if (!cachedAuth.authenticated || !authStatus.authenticated) {
        checkAuthStatus();
      } else {
        setAuthStatus(cachedAuth);
        setUserEmail(loadFromStorage(STORAGE_KEYS.USER_EMAIL, ""));
        setThreadsCache(prev => {
          const u = { ...prev };
          Object.keys(u).forEach(label => {
            u[label] = u[label]
              .filter(t => !permanentlyDeletedThreadsRef.current.has(t.id))
              .filter(t => label === "TRASH" ? true : !trashMovedThreadsRef.current.has(t.id));
          });
          return u;
        });
        setTimeout(() => { fetchAllCountsFast(); fetchThreads("INBOX", false, true); }, 100);
      }
    }
  }, []);

  useEffect(() => { if (authStatus.authenticated && labels.length === 0) fetchLabels(); }, [authStatus.authenticated]);

  useEffect(() => {
    const t = setTimeout(() => {
      if (composeData.to.length > 2) fetchEmailSuggestions(composeData.to); else setEmailSuggestions([]);
    }, 500);
    return () => clearTimeout(t);
  }, [composeData.to]);

  // ── API ── (ALL NOW INCLUDE userEmail)
  const fetchAllCountsFast = async () => {
    if (isRefreshingCounts) return;
    setIsRefreshingCounts(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/gmail/all-counts`, {
        params: { email: userEmail }, // 👈 added email
        timeout: 10000,
      });
      if (res.data.success) {
        setActualCounts(res.data.counts);
        setTotalEmailsCache(prev => ({ ...prev, ...res.data.counts }));
        setLastFetchTime(prev => ({ ...prev, counts: Date.now() }));
      }
    } catch(e) {} finally { setIsRefreshingCounts(false); }
  };

  const checkAuthStatus = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/gmail/auth-status`);
      setAuthStatus(res.data);
      if (res.data.authenticated) {
        setUserEmail(res.data.email || "");
        setTimeout(() => { fetchAllCountsFast(); fetchThreads("INBOX", false, true); }, 100);
      } else { await fetchAuthUrl(); }
    } catch(e) {
      setAuthStatus({ authenticated: false, message: "Error checking authentication status" });
      await fetchAuthUrl();
    } finally { setLoading(false); }
  };

  const fetchAuthUrl = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/gmail/auth-url`);
      if (res.data.success) setAuthUrl(res.data.url);
      else setError(res.data.error || "Failed to get authentication URL");
    } catch(e) { setError(`Failed to connect to server. Make sure the backend is running on ${SI_URI}.`); }
  };

  const fetchThreads = async (label = activeLabel, loadMore = false, forceRefresh = false) => {
    if (abortControllerRef.current) abortControllerRef.current.abort();
    abortControllerRef.current = new AbortController();
    const deleted = permanentlyDeletedThreadsRef.current;
    const moved = trashMovedThreadsRef.current;
    const cached = threadsCache[label];
    const cacheAge = lastFetchTime[label] ? Date.now() - lastFetchTime[label] : Infinity;
    if (label === "UNREAD" && !forceRefresh && !loadMore) forceRefresh = true;

    if (!forceRefresh && !loadMore && cached && cached.length > 0 && cacheAge < 120000) {
      const currentReadSet = readThreadsRef.current;
      const updated = cached
        .filter(t => !deleted.has(t.id))
        .filter(t => label === "TRASH" ? true : !moved.has(t.id))
        .map(t => ({
          ...t,
          unread: currentReadSet.has(t.id) ? false : t.unread
        }));
      setThreadsCache(prev => ({ ...prev, [label]: updated }));
      setInitialLoadDone(true);
      setForceUpdate(p => p + 1);
      return;
    }

    setLoading(true); setLoadingLabel(label); setError("");
    try {
      const params = {
        maxResults: 20,
        label,
        email: userEmail, // 👈 added email
      };
      if (loadMore && nextPageTokenCache[label]) params.pageToken = nextPageTokenCache[label];
      const res = await axios.get(`${API_BASE_URL}/gmail/threads`, { params, signal: abortControllerRef.current.signal });
      if (res.data.success) {
        const currentReadSet = readThreadsRef.current;
        let threads = (res.data.data || [])
          .sort((a, b) => (b.timestamp || new Date(b.date).getTime() || 0) - (a.timestamp || new Date(a.date).getTime() || 0))
          .filter(t => !deleted.has(t.id))
          .filter(t => label !== "TRASH" ? !moved.has(t.id) : true)
          .map(t => ({
            ...t,
            unread: currentReadSet.has(t.id) ? false : t.unread
          }));

        setThreadsCache(prev => ({
          ...prev,
          [label]: loadMore
            ? [...(prev[label]||[])
                .filter(t => !deleted.has(t.id))
                .filter(t => label === "TRASH" ? true : !moved.has(t.id))
                .map(t => ({ ...t, unread: currentReadSet.has(t.id) ? false : t.unread })),
              ...threads]
            : threads,
        }));
        setNextPageTokenCache(prev => ({ ...prev, [label]: res.data.nextPageToken }));
        if (label === "TRASH" && res.data.totalEstimate !== undefined)
          setActualCounts(prev => ({ ...prev, TRASH: res.data.totalEstimate }));
        if (res.data.totalEstimate) setTotalEmailsCache(prev => ({ ...prev, [label]: res.data.totalEstimate }));
        setLastFetchTime(prev => ({ ...prev, [label]: Date.now() }));
        setSelectedThreads(new Set()); setShowBulkActions(false); setIsSelectAll(false);
        setInitialLoadDone(true); setForceUpdate(p => p + 1);
      } else { setError(res.data.error || "Failed to fetch emails"); }
    } catch(err) {
      if (err.name !== "AbortError" && err.code !== "ERR_CANCELED")
        setError(err.response?.data?.error || "Failed to fetch emails");
    } finally { setLoading(false); setLoadingLabel(null); }
  };

  const fetchLabels = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/gmail/labels`, {
        params: { email: userEmail } // 👈 added email
      });
      if (res.data.success) setLabels(res.data.data);
    } catch(e) {}
  };

  const fetchDrafts = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/gmail/drafts`, {
        params: { maxResults: 20, email: userEmail } // 👈 added email
      });
      if (res.data.success) {
        const drafts = (res.data.data || [])
          .filter(d => !permanentlyDeletedThreadsRef.current.has(d.id))
          .map(d => ({ ...d, isDraft: true }));
        setThreadsCache(prev => ({ ...prev, DRAFTS: drafts }));
        setActualCounts(prev => ({ ...prev, DRAFTS: res.data.totalCount || drafts.length || 0 }));
        setLastFetchTime(prev => ({ ...prev, DRAFTS: Date.now() }));
      }
    } catch(e) { toast.error("Failed to fetch drafts"); }
  };

  const fetchEmailSuggestions = async (query) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/gmail/suggestions`, {
        params: { query, email: userEmail } // 👈 added email
      });
      if (res.data.success) setEmailSuggestions(res.data.data || []);
    } catch(e) { setEmailSuggestions([]); }
  };

  const loadThread = async (threadId) => {
    setLoading(true); setError("");
    try {
      let res;
      if (activeLabel === "DRAFTS") {
        res = await axios.get(`${API_BASE_URL}/gmail/draft/${threadId}`, {
          params: { email: userEmail } // 👈 added email
        });
      } else {
        res = await axios.get(`${API_BASE_URL}/gmail/thread/${threadId}`, {
          params: { email: userEmail } // 👈 added email
        });
      }
      if (res.data.success) {
        const msgs = Array.isArray(res.data.data) ? res.data.data : (res.data.data.messages || []);
        setMessages(msgs);
        setSelectedThread(threadId);

        // Mark thread as read on server
        if (activeLabel !== "DRAFTS") {
          await markThreadAs(threadId, "read", true);
        }

        fetchAllCountsFast();
      } else { setError(res.data.error || "Failed to fetch thread/draft"); }
    } catch(err) {
      setError(err.response?.data?.error || "Failed to fetch thread/draft");
    } finally { setLoading(false); }
  };

  const connectGmail = () => {
    if (authUrl) { setIsConnecting(true); window.location.href = authUrl; }
  };

  const disconnectGmail = async () => {
    setShowDisconnectModal(false);
    try {
      await axios.delete(`${API_BASE_URL}/gmail/disconnect`, {
        data: { email: userEmail } // 👈 added email
      });
      setReadThreads(new Set());
      readThreadsRef.current = new Set();
      setAuthStatus({ authenticated: false, message: "Gmail disconnected" });
      setThreadsCache({ INBOX:[], UNREAD:[], STARRED:[], IMPORTANT:[], SENT:[], SPAM:[], TRASH:[], DRAFTS:[] });
      setNextPageTokenCache({}); setTotalEmailsCache({}); setMessages([]); setSelectedThread(null); setUserEmail("");
      setActualCounts({ INBOX:0, UNREAD:0, STARRED:0, IMPORTANT:0, SENT:0, SPAM:0, TRASH:0, DRAFTS:0 });
      setPermanentlyDeletedThreads(new Set()); permanentlyDeletedThreadsRef.current = new Set();
      setTrashMovedThreads(new Set()); trashMovedThreadsRef.current = new Set();
      setInitialLoadDone(false);
      Object.values(STORAGE_KEYS).forEach(k => localStorage.removeItem(k));
      await fetchAuthUrl();
      toast.success("Gmail disconnected successfully");
    } catch(e) { toast.error("Error disconnecting Gmail"); }
  };

  // ── FILES ──
  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files).filter(f => {
      if (f.size > 30 * 1024 * 1024) { toast.error(`File ${f.name} exceeds 30MB`); return false; }
      return true;
    });
    if (files.length) setSelectedFiles(prev => [...prev, ...files]);
  };
  const removeFile = idx => setSelectedFiles(prev => prev.filter((_, i) => i !== idx));
  const triggerFileInput = () => fileInputRef.current?.click();

  const getFileIcon = file => {
    const t = file.type || "", ext = (file.name || file.filename || "").split(".").pop().toLowerCase();
    if (t.startsWith("image/") || ["jpg","jpeg","png","gif","svg","webp"].includes(ext)) return <FaImage className="w-5 h-5 text-blue-500" />;
    if (t.includes("pdf") || ext === "pdf") return <FaFilePdf className="w-5 h-5 text-red-500" />;
    if (t.includes("audio") || ["mp3","wav","ogg","flac"].includes(ext)) return <FaFileAudio className="w-5 h-5 text-purple-500" />;
    if (t.includes("video") || ["mp4","avi","mov","mkv"].includes(ext)) return <FaFileVideo className="w-5 h-5 text-pink-500" />;
    if (["zip","rar","7z","tar","gz"].includes(ext)) return <FaFileArchive className="w-5 h-5 text-yellow-600" />;
    if (["doc","docx","txt","rtf"].includes(ext)) return <FaFileAlt className="w-5 h-5 text-blue-700" />;
    if (["xls","xlsx","csv"].includes(ext)) return <FaFileExcel className="w-5 h-5 text-green-600" />;
    if (["js","jsx","ts","tsx","py","java","cpp","html","css"].includes(ext)) return <FaFileCode className="w-5 h-5 text-green-700" />;
    return <FaFile className="w-5 h-5 text-gray-500" />;
  };

  const formatFileSize = bytes => {
    if (!bytes) return "0 Bytes";
    const k = 1024, s = ["Bytes","KB","MB","GB"], i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${s[i]}`;
  };

  const formatDateTime = ds => {
    if (!ds) return "";
    try {
      const d = new Date(ds), now = new Date(), ms = now - d;
      const mins = Math.floor(ms / 60000), hrs = Math.floor(ms / 3600000), days = Math.floor(ms / 86400000);
      if (mins < 1) return "Just now"; if (mins < 60) return `${mins}m ago`;
      if (hrs < 24) return `${hrs}h ago`; if (days < 7) return `${days}d ago`;
      return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: d.getFullYear() !== now.getFullYear() ? "numeric" : undefined });
    } catch { return ds; }
  };

  const extractName = s => { if (!s) return "Unknown"; const m = s.match(/(.*?)</); return m ? m[1].trim() : s; };
  const extractEmail = s => { if (!s) return ""; const m = s.match(/<([^>]+)>/); return m ? m[1] : s; };

  const sendEmail = async () => {
    if (!composeData.to.trim()) { toast.error("Please enter recipient email address"); return; }
    setSending(true); setSendingProgress(0); setError("");
    try {
      const fd = new FormData();
      fd.append("to", composeData.to.trim());
      fd.append("cc", composeData.cc?.trim() || "");
      fd.append("bcc", composeData.bcc?.trim() || "");
      fd.append("subject", composeData.subject?.trim() || "(No Subject)");
      fd.append("message", composeData.message?.trim() || "");
      fd.append("email", userEmail); // 👈 added email
      selectedFiles.forEach(f => fd.append("attachments", f));
      const res = await axios.post(`${API_BASE_URL}/gmail/send`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: e => { if (e.total) setSendingProgress(Math.round((e.loaded * 100) / e.total)); },
        timeout: 300000,
      });
      setSendingProgress(100);
      if (res.data.success) {
        toast.success("📧 Email sent successfully!");
        setComposeData({ to:"", cc:"", bcc:"", subject:"", message:"", attachments:[] });
        setSelectedFiles([]); setShowCompose(false); fetchAllCountsFast();
        if (["INBOX","SENT"].includes(activeLabel)) setTimeout(() => fetchThreads(activeLabel, false, true), 500);
        else setTimeout(() => fetchThreads("INBOX", false, true), 1000);
        setTimeout(() => setSendingProgress(0), 1000);
      } else { throw new Error(res.data.error || "Failed to send email"); }
    } catch(err) { toast.error(`Failed to send: ${err.response?.data?.error || err.message}`); setSendingProgress(0); }
    finally { setSending(false); }
  };

  const saveAsDraft = async () => {
    if (!composeData.to.trim()) { toast.error("Please enter recipient email address"); return; }
    setSavingDraft(true);
    try {
      const fd = new FormData();
      fd.append("to", composeData.to);
      fd.append("cc", composeData.cc || "");
      fd.append("bcc", composeData.bcc || "");
      fd.append("subject", composeData.subject || "(No Subject)");
      fd.append("message", composeData.message || "");
      fd.append("email", userEmail); // 👈 added email
      selectedFiles.forEach(f => fd.append("attachments", f));
      const res = await axios.post(`${API_BASE_URL}/gmail/draft`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.data.success) {
        toast.success("📝 Draft saved!");
        setComposeData({ to:"", cc:"", bcc:"", subject:"", message:"", attachments:[] });
        setSelectedFiles([]); setShowCompose(false); fetchAllCountsFast();
        if (activeLabel === "DRAFTS") setTimeout(fetchDrafts, 500);
      } else { throw new Error(res.data.error || "Failed to save draft"); }
    } catch(err) { toast.error(`Failed to save draft: ${err.response?.data?.error || err.message}`); }
    finally { setSavingDraft(false); }
  };

  // const markThreadAs = async (threadId, action, value = true) => {
  //   const prevReadThreads = new Set(readThreads);
  //   const prevThreadsCache = JSON.parse(JSON.stringify(threadsCache));
  //   const prevActualCounts = { ...actualCounts };

  //   try {
  //     let endpoint = "", body = { email: userEmail }; // 👈 added email
  //     switch(action) {
  //       case "read": endpoint = `thread/${threadId}/read`; body.read = value; break;
  //       case "star": endpoint = `thread/${threadId}/star`; body.star = value; break;
  //       case "spam": endpoint = `thread/${threadId}/spam`; body.spam = value; break;
  //       case "important": endpoint = `thread/${threadId}/important`; body.important = value; break;
  //       case "trash": endpoint = `thread/${threadId}/trash`; break;
  //     }
  //     if (action === "read") {
  //       setReadThreads(prev => { const s = new Set(prev); value ? s.add(threadId) : s.delete(threadId); return s; });
  //     }
  //     setThreadsCache(prev => {
  //       const u = { ...prev };
  //       Object.keys(u).forEach(l => {
  //         u[l] = u[l].map(t => {
  //           if (t.id !== threadId) return t;
  //           const upd = { ...t };
  //           switch(action) {
  //             case "read": upd.unread = !value; break;
  //             case "star": upd.starred = value; break;
  //             case "spam": upd.spam = value; break;
  //             case "important": upd.important = value; break;
  //             case "trash": upd.trash = true; break;
  //           }
  //           return upd;
  //         });
  //       });
  //       return u;
  //     });
  //     if (action === "star") setActualCounts(prev => ({ ...prev, STARRED: value ? prev.STARRED + 1 : Math.max(0, prev.STARRED - 1) }));
  //     if (action === "important") setActualCounts(prev => ({ ...prev, IMPORTANT: value ? prev.IMPORTANT + 1 : Math.max(0, prev.IMPORTANT - 1) }));
  //     if (action === "read" && activeLabel === "INBOX") setActualCounts(prev => ({ ...prev, UNREAD: value ? Math.max(0, prev.UNREAD - 1) : prev.UNREAD + 1 }));
  //     setForceUpdate(p => p + 1);

  //     const res = await axios.post(`${API_BASE_URL}/gmail/${endpoint}`, body);
  //     if (res.data.success) {
  //       toast.success(res.data.message);
  //       if (action === "star" && value && activeLabel === "INBOX") {
  //         setThreadsCache(prev => {
  //           const starred = prev.STARRED || [], toAdd = prev[activeLabel]?.find(t => t.id === threadId);
  //           if (toAdd && !starred.some(t => t.id === threadId)) return { ...prev, STARRED: [{ ...toAdd, starred: true }, ...starred] };
  //           return prev;
  //         });
  //       }
  //       if ((action === "star" && activeLabel === "STARRED" && !value) ||
  //           (action === "important" && activeLabel === "IMPORTANT" && !value) ||
  //           (action === "spam" && activeLabel === "SPAM" && !value) ||
  //           (action === "trash" && activeLabel === "TRASH")) {
  //         setThreadsCache(prev => ({ ...prev, [activeLabel]: (prev[activeLabel] || []).filter(t => t.id !== threadId) }));
  //         if (selectedThread === threadId) { setSelectedThread(null); setMessages([]); }
  //       }
  //       fetchAllCountsFast();
  //     } else {
  //       throw new Error(res.data.error || "API error");
  //     }
  //   } catch(err) {
  //     setReadThreads(prevReadThreads);
  //     setThreadsCache(prevThreadsCache);
  //     setActualCounts(prevActualCounts);
  //     setForceUpdate(p => p + 1);
  //     toast.error(`Failed to ${action} thread`);
  //     fetchAllCountsFast();
  //   }
  // };//remove thread is read toast old one

const markThreadAs = async (threadId, action, value = true) => {
  const prevReadThreads = new Set(readThreads);
  const prevThreadsCache = JSON.parse(JSON.stringify(threadsCache));
  const prevActualCounts = { ...actualCounts };

  try {
    let endpoint = "", body = { email: userEmail };
    switch(action) {
      case "read": endpoint = `thread/${threadId}/read`; body.read = value; break;
      case "star": endpoint = `thread/${threadId}/star`; body.star = value; break;
      case "spam": endpoint = `thread/${threadId}/spam`; body.spam = value; break;
      case "important": endpoint = `thread/${threadId}/important`; body.important = value; break;
      case "trash": endpoint = `thread/${threadId}/trash`; break;
    }
    if (action === "read") {
      setReadThreads(prev => { const s = new Set(prev); value ? s.add(threadId) : s.delete(threadId); return s; });
    }
    setThreadsCache(prev => {
      const u = { ...prev };
      Object.keys(u).forEach(l => {
        u[l] = u[l].map(t => {
          if (t.id !== threadId) return t;
          const upd = { ...t };
          switch(action) {
            case "read": upd.unread = !value; break;
            case "star": upd.starred = value; break;
            case "spam": upd.spam = value; break;
            case "important": upd.important = value; break;
            case "trash": upd.trash = true; break;
          }
          return upd;
        });
      });
      return u;
    });
    if (action === "star") setActualCounts(prev => ({ ...prev, STARRED: value ? prev.STARRED + 1 : Math.max(0, prev.STARRED - 1) }));
    if (action === "important") setActualCounts(prev => ({ ...prev, IMPORTANT: value ? prev.IMPORTANT + 1 : Math.max(0, prev.IMPORTANT - 1) }));
    if (action === "read" && activeLabel === "INBOX") setActualCounts(prev => ({ ...prev, UNREAD: value ? Math.max(0, prev.UNREAD - 1) : prev.UNREAD + 1 }));
    setForceUpdate(p => p + 1);

    const res = await axios.post(`${API_BASE_URL}/gmail/${endpoint}`, body);
    if (res.data.success) {
      // ✅ Only show toast for actions other than 'read'
      if (action !== 'read') {
        toast.success(res.data.message);
      }
      if (action === "star" && value && activeLabel === "INBOX") {
        setThreadsCache(prev => {
          const starred = prev.STARRED || [], toAdd = prev[activeLabel]?.find(t => t.id === threadId);
          if (toAdd && !starred.some(t => t.id === threadId)) return { ...prev, STARRED: [{ ...toAdd, starred: true }, ...starred] };
          return prev;
        });
      }
      if ((action === "star" && activeLabel === "STARRED" && !value) ||
          (action === "important" && activeLabel === "IMPORTANT" && !value) ||
          (action === "spam" && activeLabel === "SPAM" && !value) ||
          (action === "trash" && activeLabel === "TRASH")) {
        setThreadsCache(prev => ({ ...prev, [activeLabel]: (prev[activeLabel] || []).filter(t => t.id !== threadId) }));
        if (selectedThread === threadId) { setSelectedThread(null); setMessages([]); }
      }
      fetchAllCountsFast();
    } else {
      throw new Error(res.data.error || "API error");
    }
  } catch(err) {
    setReadThreads(prevReadThreads);
    setThreadsCache(prevThreadsCache);
    setActualCounts(prevActualCounts);
    setForceUpdate(p => p + 1);
    toast.error(`Failed to ${action} thread`);
    fetchAllCountsFast();
  }
};



  // const handleBulkAction = async (action, value = true) => {
  //   if (selectedThreads.size === 0) { toast.error("No emails selected"); return; }
  //   const ids = Array.from(selectedThreads);
  //   try {
  //     if (action === "read") {
  //       setReadThreads(prev => { const s = new Set(prev); ids.forEach(id => value ? s.add(id) : s.delete(id)); return s; });
  //       setThreadsCache(prev => ({ ...prev, [activeLabel]: (prev[activeLabel] || []).map(t => selectedThreads.has(t.id) ? { ...t, unread: !value } : t) }));
  //       setActualCounts(prev => ({ ...prev, UNREAD: value ? Math.max(0, prev.UNREAD - ids.length) : prev.UNREAD + ids.length }));
  //     }
  //     if (action === "star") {
  //       setThreadsCache(prev => ({ ...prev, [activeLabel]: (prev[activeLabel] || []).map(t => selectedThreads.has(t.id) ? { ...t, starred: value } : t) }));
  //       setActualCounts(prev => ({ ...prev, STARRED: value ? prev.STARRED + ids.length : Math.max(0, prev.STARRED - ids.length) }));
  //     }
  //     if (action === "trash") {
  //       setThreadsCache(prev => ({ ...prev, [activeLabel]: (prev[activeLabel] || []).filter(t => !selectedThreads.has(t.id)) }));
  //       setActualCounts(prev => ({ ...prev, TRASH: prev.TRASH + ids.length }));
  //     }
  //     setForceUpdate(p => p + 1);
  //     const body = { threadIds: ids, email: userEmail }; // 👈 added email
  //     switch(action) {
  //       case "star": body.star = value; await axios.post(`${API_BASE_URL}/gmail/bulk-star`, body); toast.success(`⭐ ${value ? "Starred" : "Unstarred"} ${ids.length} emails`); break;
  //       case "delete": body.permanent = activeLabel === "TRASH"; const dr = await axios.post(`${API_BASE_URL}/gmail/bulk-delete`, body); toast.success(`🗑️ ${dr.data.message}`); break;
  //       case "read": await Promise.all(ids.map(id => axios.post(`${API_BASE_URL}/gmail/thread/${id}/read`, { read: value, email: userEmail }))); toast.success(`Marked ${ids.length} emails as ${value ? "read" : "unread"}`); break;
  //       case "trash": await axios.post(`${API_BASE_URL}/gmail/bulk-trash`, body); toast.success(`Moved ${ids.length} emails to trash`); break;
  //     }
  //     setSelectedThreads(new Set()); setShowBulkActions(false); setIsSelectAll(false); fetchAllCountsFast();
  //   } catch(err) { toast.error(`Failed to ${action} emails`); fetchAllCountsFast(); }
  // };//old one..

  const handleBulkAction = async (action, value = true) => {
  if (selectedThreads.size === 0) { toast.error("No emails selected"); return; }
  const ids = Array.from(selectedThreads);
  try {
    if (action === "read") {
      setReadThreads(prev => { const s = new Set(prev); ids.forEach(id => value ? s.add(id) : s.delete(id)); return s; });
      setThreadsCache(prev => ({ ...prev, [activeLabel]: (prev[activeLabel] || []).map(t => selectedThreads.has(t.id) ? { ...t, unread: !value } : t) }));
      setActualCounts(prev => ({ ...prev, UNREAD: value ? Math.max(0, prev.UNREAD - ids.length) : prev.UNREAD + ids.length }));
    }
    if (action === "star") {
      setThreadsCache(prev => ({ ...prev, [activeLabel]: (prev[activeLabel] || []).map(t => selectedThreads.has(t.id) ? { ...t, starred: value } : t) }));
      setActualCounts(prev => ({ ...prev, STARRED: value ? prev.STARRED + ids.length : Math.max(0, prev.STARRED - ids.length) }));
    }
    if (action === "trash") {
      setThreadsCache(prev => ({ ...prev, [activeLabel]: (prev[activeLabel] || []).filter(t => !selectedThreads.has(t.id)) }));
      setActualCounts(prev => ({ ...prev, TRASH: prev.TRASH + ids.length }));
    }
    setForceUpdate(p => p + 1);
    const body = { threadIds: ids, email: userEmail };
    switch(action) {
      case "star": body.star = value; await axios.post(`${API_BASE_URL}/gmail/bulk-star`, body); toast.success(`⭐ ${value ? "Starred" : "Unstarred"} ${ids.length} emails`); break;
      case "delete": body.permanent = activeLabel === "TRASH"; const dr = await axios.post(`${API_BASE_URL}/gmail/bulk-delete`, body); toast.success(`🗑️ ${dr.data.message}`); break;
      case "read":
        await Promise.all(ids.map(id => axios.post(`${API_BASE_URL}/gmail/thread/${id}/read`, { read: value, email: userEmail })));
        // ✅ Removed toast for bulk read
        break;
      case "trash": await axios.post(`${API_BASE_URL}/gmail/bulk-trash`, body); toast.success(`Moved ${ids.length} emails to trash`); break;
    }
    setSelectedThreads(new Set()); setShowBulkActions(false); setIsSelectAll(false); fetchAllCountsFast();
  } catch(err) { toast.error(`Failed to ${action} emails`); fetchAllCountsFast(); }
};

  const toggleThreadSelection = threadId => {
    const curr = threadsCache[activeLabel] || [], newSel = new Set(selectedThreads);
    newSel.has(threadId) ? newSel.delete(threadId) : newSel.add(threadId);
    setSelectedThreads(newSel); setShowBulkActions(newSel.size > 0); setIsSelectAll(newSel.size === curr.length);
  };

  const deleteThread = async (threadId, permanent = false) => {
    try {
      if (activeLabel === "DRAFTS") {
        await axios.delete(`${API_BASE_URL}/gmail/draft/${threadId}`, {
          data: { email: userEmail } // 👈 added email
        });
        toast.success("📝 Draft permanently deleted");
        setThreadsCache(prev => {
          const u = { ...prev };
          u.DRAFTS = (u.DRAFTS || []).filter(t => t.id !== threadId);
          return u;
        });
        setActualCounts(prev => ({ ...prev, DRAFTS: Math.max(0, prev.DRAFTS - 1) }));
        if (selectedThread === threadId) {
          setMessages([]);
          setSelectedThread(null);
        }
        return;
      }

      if (permanent) {
        permanentlyDeletedThreadsRef.current = new Set([...permanentlyDeletedThreadsRef.current, threadId]);
        setPermanentlyDeletedThreads(prev => { const s = new Set(prev); s.add(threadId); return s; });
        await axios.delete(`${API_BASE_URL}/gmail/thread/${threadId}`, {
          data: { email: userEmail } // 👈 added email
        });
        toast.success("🗑️ Thread permanently deleted");
        trashMovedThreadsRef.current.delete(threadId);
        setTrashMovedThreads(prev => { const s = new Set(prev); s.delete(threadId); return s; });
      } else {
        trashMovedThreadsRef.current = new Set([...trashMovedThreadsRef.current, threadId]);
        setTrashMovedThreads(prev => { const s = new Set(prev); s.add(threadId); return s; });
        await axios.post(`${API_BASE_URL}/gmail/thread/${threadId}/trash`, { email: userEmail }); // 👈 added email
        toast.success("🗑️ Thread moved to trash");
        setLastFetchTime(prev => ({ ...prev, TRASH: 0 }));
      }
      setThreadsCache(prev => { const u = { ...prev }; Object.keys(u).forEach(l => { u[l] = u[l].filter(t => t.id !== threadId); }); return u; });
      if (selectedThread === threadId) { setMessages([]); setSelectedThread(null); }
      setForceUpdate(p => p + 1); fetchAllCountsFast(); setLastFetchTime({});
    } catch(err) {
      if (activeLabel !== "DRAFTS") {
        if (permanent) {
          permanentlyDeletedThreadsRef.current = new Set(Array.from(permanentlyDeletedThreadsRef.current).filter(id => id !== threadId));
          setPermanentlyDeletedThreads(prev => { const s = new Set(prev); s.delete(threadId); return s; });
        } else {
          trashMovedThreadsRef.current = new Set(Array.from(trashMovedThreadsRef.current).filter(id => id !== threadId));
          setTrashMovedThreads(prev => { const s = new Set(prev); s.delete(threadId); return s; });
        }
      }
      toast.error(err.response?.data?.error || "Failed to delete");
    } finally { setShowDeleteModal(false); setThreadToDelete(null); }
  };

  const confirmDeleteThread = (threadId, permanent = false) => { setThreadToDelete({ id: threadId, permanent }); setShowDeleteModal(true); };

  const downloadAttachment = async (messageId, attachment) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/gmail/attachment/${messageId}/${attachment.id}`, {
        params: { email: userEmail }, // 👈 added email
        responseType: "blob"
      });
      const url = window.URL.createObjectURL(new Blob([res.data])), link = document.createElement("a");
      link.href = url; link.setAttribute("download", attachment.filename);
      document.body.appendChild(link); link.click(); link.remove(); window.URL.revokeObjectURL(url);
      toast.success(`📥 Downloaded ${attachment.filename}`);
    } catch(e) { toast.error("Failed to download attachment"); }
  };

  const openComposeForReply = (msg, type = "reply") => {
    let to = "", subject = "", message = "";
    switch(type) {
      case "reply":
        to = extractEmail(msg.from);
        subject = msg.subject.startsWith("Re:") ? msg.subject : `Re: ${msg.subject}`;
        message = `\n\nOn ${formatDateTime(msg.date)}, ${extractName(msg.from)} wrote:\n> ${msg.body?.substring(0, 200)}...`;
        break;
      case "replyAll":
        const all = [extractEmail(msg.from),
          ...(msg.to ? msg.to.split(",").map(e => extractEmail(e.trim())).filter(Boolean) : []),
          ...(msg.cc ? msg.cc.split(",").map(e => extractEmail(e.trim())).filter(Boolean) : [])
        ].filter((v, i, a) => a.indexOf(v) === i && v !== userEmail);
        to = all.join(", ");
        subject = msg.subject.startsWith("Re:") ? msg.subject : `Re: ${msg.subject}`;
        message = `\n\nOn ${formatDateTime(msg.date)}, ${extractName(msg.from)} wrote:\n> ${msg.body?.substring(0, 200)}...`;
        break;
      case "forward":
        to = ""; subject = msg.subject.startsWith("Fwd:") ? msg.subject : `Fwd: ${msg.subject}`;
        message = `\n\n---------- Forwarded message ----------\nFrom: ${msg.from}\nDate: ${msg.date}\nSubject: ${msg.subject}\nTo: ${msg.to}\n\n${msg.body}`;
        break;
    }
    setComposeData({ to, cc:"", bcc:"", subject, message, attachments:[] });
    setComposeMode(type); setShowCompose(true);
  };

  const clearCompose = () => { setComposeData({ to:"", cc:"", bcc:"", subject:"", message:"", attachments:[] }); setSelectedFiles([]); setComposeMode("new"); setEmailSuggestions([]); };
  const handleBackToList = () => { setSelectedThread(null); setMessages([]); };
  const handleShowUnreadClick = () => handleLabelClick({ id: "UNREAD" });

  const handleLabelClick = async label => {
    if (abortControllerRef.current) abortControllerRef.current.abort();
    setActiveLabel(label.id); setSelectedThread(null); setMessages([]);
    setSearchQuery(""); setFilterUnread(false);
    setSelectedThreads(new Set()); setShowBulkActions(false); setIsSelectAll(false);
    if (label.id === "TRASH") {
      setTrashMovedThreads(new Set()); trashMovedThreadsRef.current = new Set();
      localStorage.removeItem(STORAGE_KEYS.TRASH_MOVED_THREADS);
    }
    if (label.id === "DRAFTS") {
      const c = threadsCache.DRAFTS || [], age = lastFetchTime.DRAFTS ? Date.now() - lastFetchTime.DRAFTS : Infinity;
      if (c.length > 0 && age < 120000) setForceUpdate(p => p + 1); else await fetchDrafts();
    } else {
      const c = threadsCache[label.id], age = lastFetchTime[label.id] ? Date.now() - lastFetchTime[label.id] : Infinity;
      if (c && c.length > 0 && age < 120000 && label.id !== "UNREAD") {
        const currentReadSet = readThreadsRef.current;
        const updated = c
          .filter(t => !permanentlyDeletedThreadsRef.current.has(t.id))
          .filter(t => label.id === "TRASH" ? true : !trashMovedThreadsRef.current.has(t.id))
          .map(t => ({ ...t, unread: currentReadSet.has(t.id) ? false : t.unread }));
        setThreadsCache(prev => ({ ...prev, [label.id]: updated }));
        setForceUpdate(p => p + 1);
        if (age > 30000) setTimeout(() => fetchThreads(label.id, false, true), 100);
      } else { await fetchThreads(label.id, false, false); }
    }
  };

  const getSidebarCount = labelId => {
    if (labelId === "TRASH") {
      const tr = (threadsCache["TRASH"] || []).filter(t => !permanentlyDeletedThreadsRef.current.has(t.id));
      if (lastFetchTime["TRASH"] && lastFetchTime["TRASH"] > 0) return tr.length > 0 ? actualCounts.TRASH : tr.length;
      return actualCounts.TRASH;
    }
    return actualCounts[labelId] || 0;
  };

  const currentThreads = (threadsCache[activeLabel] || []).filter(t => {
    try {
      return !permanentlyDeletedThreadsRef.current.has(t.id) &&
        (activeLabel === "TRASH" ? true : !trashMovedThreadsRef.current.has(t.id));
    } catch(e) { return true; }
  });

  const filteredThreads = currentThreads.filter(t => {
    const ms = searchQuery === "" || t.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.from?.toLowerCase().includes(searchQuery.toLowerCase()) || t.snippet?.toLowerCase().includes(searchQuery.toLowerCase());
    if (activeLabel === "UNREAD" && !t.unread) return false;
    return ms && (!filterUnread || t.unread);
  });

  const labelOptions = [
    { id:"INBOX", name:"Inbox", icon:<FaInbox size={15}/>, count:actualCounts.INBOX },
    { id:"UNREAD", name:"Unread", icon:<FaEnvelope size={15}/>, count:actualCounts.UNREAD },
    { id:"STARRED", name:"Starred", icon:<FaStar size={15}/>, count:actualCounts.STARRED },
    { id:"IMPORTANT", name:"Important", icon:<FaExclamationCircle size={15}/>, count:actualCounts.IMPORTANT },
    { id:"DRAFTS", name:"Drafts", icon:<FaFileAlt size={15}/>, count:actualCounts.DRAFTS },
    { id:"SENT", name:"Sent", icon:<FaPaperPlane size={15}/>, count:actualCounts.SENT },
    { id:"SPAM", name:"Spam", icon:<FaExclamationTriangle size={15}/>, count:actualCounts.SPAM },
    { id:"TRASH", name:"Trash", icon:<FaTrash size={15}/>, count:getSidebarCount("TRASH") },
  ];

  // ── LOADING ──
  if (loading && !authStatus.authenticated && !error && currentThreads.length === 0) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center" style={{ background: "linear-gradient(135deg,#1a73e8,#0d47a1)" }}>
            <FaSpinner className="animate-spin text-white" size={28} />
          </div>
          <h3 className="text-lg font-medium text-gray-800 mb-1">Connecting to Gmail</h3>
          <p className="text-gray-400 text-sm">Checking authentication status...</p>
        </div>
      </div>
    );
  }

  if (!authStatus.authenticated) {
    return (
      <>
        <ToastContainer position="top-right" autoClose={3000} />
        <GmailConnectScreen
          authUrl={authUrl} authStatus={authStatus} error={error}
          loading={loading} isConnecting={isConnecting}
          onConnect={connectGmail} onFetchAuthUrl={fetchAuthUrl} onCheckStatus={checkAuthStatus}
        />
      </>
    );
  }

  // ── MAIN APP ──
  return (
    <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* DISCONNECT MODAL */}
      <Dialog open={showDisconnectModal} onOpenChange={setShowDisconnectModal}>
        <DialogContent className="bg-white rounded-2xl shadow-xl max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-gray-800 text-lg font-semibold">
              <FaSignOutAlt size={18} color="#dc2626" /> Disconnect Gmail
            </DialogTitle>
          </DialogHeader>
          <div className="p-6">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <FaExclamationTriangle size={30} color="#dc2626" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">Are you sure?</h3>
            <p className="text-gray-500 text-center text-sm mb-5">You'll need to reconnect to access your emails again.</p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
              <p className="text-sm text-yellow-800 flex items-start gap-2">
                <FaInfoCircle size={15} className="flex-shrink-0 mt-0.5" />
                <span>Your emails are stored on Google's servers and won't be deleted.</span>
              </p>
            </div>
            <div className="flex items-center justify-center gap-3">
              <button onClick={() => setShowDisconnectModal(false)}
                className="px-5 py-2.5 rounded-xl border border-gray-300 hover:bg-gray-50 text-gray-600 text-sm font-medium">
                Cancel
              </button>
              <button onClick={disconnectGmail}
                className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white flex items-center gap-2 text-sm font-medium">
                <FaSignOutAlt size={13} /> Disconnect
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* COMPOSE MODAL */}
      <Dialog open={showCompose} onOpenChange={setShowCompose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-xl">
          <DialogHeader className="border-b border-gray-100 pb-4">
            <DialogTitle className="flex items-center gap-2 text-gray-800 text-lg font-semibold">
              {composeMode === "reply" ? <FaReply size={15} /> : composeMode === "forward" ? <FaForward size={15} /> : <FaEdit size={15} />}
              {composeMode === "reply" ? "Reply" : composeMode === "forward" ? "Forward" : "New Message"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 mt-4">
            {emailSuggestions.length > 0 && (
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-3">
                <p className="text-sm font-medium text-blue-800 mb-2 flex items-center gap-2"><FaUsers size={14} />Suggestions:</p>
                <div className="space-y-1">
                  {emailSuggestions.map((s, i) => (
                    <button key={i} onClick={() => { setComposeData(p => ({ ...p, to: s })); setEmailSuggestions([]); }}
                      className="w-full text-left p-2 hover:bg-blue-100 rounded-lg text-sm text-blue-700 flex items-center gap-2">
                      <FaAt size={11} />{s}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {[["To*","to","email","Recipient email (comma separated)"],["Cc","cc","email","Cc (optional)"],["Bcc","bcc","email","Bcc (optional)"],["Subject","subject","text","Subject (optional)"]].map(([lbl, field, type, ph]) => (
              <div key={field} className="flex items-center border-b border-gray-100 pb-2">
                <label className="w-16 text-sm font-medium text-gray-500">{lbl}</label>
                <input type={type} value={composeData[field]} onChange={e => setComposeData(p => ({ ...p, [field]: e.target.value }))}
                  className="flex-1 p-2 border-none focus:ring-0 focus:outline-none text-gray-800 text-sm placeholder-gray-400" placeholder={ph} />
              </div>
            ))}
            <div className="border border-gray-200 rounded-xl p-4 bg-gray-50">
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-medium text-gray-600 flex items-center gap-2">
                  <FaPaperclip size={13} />Attachments <span className="text-gray-400 font-normal text-xs">(max 30MB)</span>
                </label>
                <button onClick={triggerFileInput}
                  className="text-xs text-white px-3 py-1.5 rounded-lg flex items-center gap-1.5" style={{ background: "#1a73e8" }}>
                  <FaPlus size={10} />Add
                </button>
                <input ref={fileInputRef} type="file" multiple onChange={handleFileSelect} className="hidden" accept="*/*" />
              </div>
              {selectedFiles.length > 0 ? (
                <div className="space-y-2">
                  {selectedFiles.map((f, i) => (
                    <div key={i} className="flex items-center justify-between p-2.5 bg-white rounded-lg border border-gray-100">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <span>{getFileIcon(f)}</span>
                        <div className="min-w-0">
                          <p className="text-xs font-medium text-gray-700 truncate">{f.name}</p>
                          <p className="text-xs text-gray-400">{formatFileSize(f.size)}</p>
                        </div>
                      </div>
                      <button onClick={() => removeFile(i)} className="ml-2 text-red-400 hover:text-red-600 p-1">
                        <FaTimes size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 border-2 border-dashed border-gray-200 rounded-xl">
                  <FaPaperclip size={28} className="text-gray-300 mx-auto mb-2" />
                  <p className="text-xs text-gray-400">Drop files here or click Add</p>
                </div>
              )}
            </div>
            <textarea value={composeData.message} onChange={e => setComposeData(p => ({ ...p, message: e.target.value }))}
              rows="10" className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:outline-none resize-none text-sm text-gray-800 placeholder-gray-400"
              placeholder="Write your message..." />
          </div>
          {sending && sendingProgress > 0 && (
            <div className="mt-4">
              <div className="flex justify-between text-xs text-gray-500 mb-1"><span>Sending...</span><span>{sendingProgress}%</span></div>
              <div className="w-full bg-gray-100 rounded-full h-1.5">
                <div className="h-1.5 rounded-full transition-all duration-300" style={{ width: `${sendingProgress}%`, background: "#1a73e8" }} />
              </div>
            </div>
          )}
          <div className="flex justify-between items-center mt-5 pt-4 border-t border-gray-100">
            <div className="flex gap-2">
              <button onClick={clearCompose} className="px-3 py-2 text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-1.5 text-xs">
                <FaTrash size={12} />Clear
              </button>
              <button onClick={saveAsDraft} disabled={savingDraft || !composeData.to.trim()}
                className="px-3 py-2 bg-gray-100 text-gray-600 rounded-lg border border-gray-200 hover:bg-gray-200 disabled:opacity-50 flex items-center gap-1.5 text-xs">
                {savingDraft ? <><FaSpinner className="animate-spin" size={11} />Saving...</> : <><FaSave size={12} />Draft</>}
              </button>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setShowCompose(false)} className="px-4 py-2 text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50 text-sm">Cancel</button>
              <button onClick={sendEmail} disabled={sending || !composeData.to.trim()}
                className="px-4 py-2 text-white rounded-lg disabled:opacity-50 flex items-center gap-1.5 text-sm"
                style={{ background: sending ? "#ccc" : "linear-gradient(135deg,#1a73e8,#1557b0)" }}>
                {sending ? <><FaSpinner className="animate-spin" size={13} />Sending...</> : <><FaPaperPlane size={13} />Send</>}
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* DELETE MODAL */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent className="bg-white rounded-2xl shadow-xl max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-gray-800 text-lg font-semibold">
              <FaTrash size={16} color={threadToDelete?.permanent ? "#dc2626" : "#f97316"} />
              {threadToDelete?.permanent ? "Permanently Delete" : "Move to Trash"}
            </DialogTitle>
          </DialogHeader>
          <div className="p-6">
            <div className="flex items-center justify-center mb-4">
              <div className={`w-16 h-16 ${threadToDelete?.permanent ? "bg-red-100" : "bg-orange-100"} rounded-full flex items-center justify-center`}>
                {threadToDelete?.permanent
                  ? <FaExclamationTriangle size={30} color="#dc2626" />
                  : <FaTrash size={28} color="#f97316" />}
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
              {threadToDelete?.permanent ? "Delete permanently?" : "Move to trash?"}
            </h3>
            <p className="text-gray-500 text-sm text-center mb-6">
              {threadToDelete?.permanent ? "This cannot be undone." : "You can restore it from trash later."}
            </p>
            <div className="flex items-center justify-center gap-3">
              <button onClick={() => { setShowDeleteModal(false); setThreadToDelete(null); }}
                className="px-5 py-2.5 rounded-xl border border-gray-300 hover:bg-gray-50 text-gray-600 text-sm font-medium">
                Cancel
              </button>
              <button onClick={() => deleteThread(threadToDelete.id, threadToDelete.permanent)}
                className={`px-5 py-2.5 rounded-xl text-white flex items-center gap-2 text-sm font-medium ${threadToDelete?.permanent ? "bg-red-600 hover:bg-red-700" : "bg-orange-500 hover:bg-orange-600"}`}>
                <FaTrash size={13} />
                {threadToDelete?.permanent ? "Delete" : "Move to Trash"}
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* LAYOUT */}
      <div className="flex h-full overflow-hidden">
        {/* Mobile toggle */}
        <button onClick={() => setShowMobileSidebar(!showMobileSidebar)}
          className="lg:hidden fixed top-4 left-4 z-50 bg-white p-2.5 rounded-xl shadow-lg border border-gray-200">
          <FaBars size={16} color="#5f6368" />
        </button>

        {/* SIDEBAR */}
        <div className={`${sidebarCollapsed ? "w-16" : "w-60"} bg-white flex flex-col transition-all duration-300 ease-in-out ${showMobileSidebar ? "fixed inset-y-0 left-0 z-40 shadow-xl" : "hidden lg:flex"}`}
          style={{ borderRight: "1px solid #e8eaed" }}>

          <div className="px-3 py-4 flex items-center justify-between" style={{ borderBottom: "1px solid #e8eaed" }}>
            <div className={`flex items-center ${sidebarCollapsed ? "justify-center w-full" : "gap-2.5"}`}>
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium flex-shrink-0"
                style={{ background: "linear-gradient(135deg,#1a73e8,#0d47a1)" }}>
                {userEmail?.charAt(0).toUpperCase()}
              </div>
              {!sidebarCollapsed && (
                <div className="min-w-0">
                  <p className="text-xs font-medium text-gray-800 truncate">{userEmail}</p>
                  <p className="text-xs" style={{ color: "#5f6368" }}>{actualCounts.UNREAD} unread</p>
                </div>
              )}
            </div>
            <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)} className="hidden lg:block p-1 hover:bg-gray-100 rounded-lg">
              <FaChevronLeft size={11} className={`text-gray-400 transform transition-transform ${sidebarCollapsed ? "rotate-180" : ""}`} />
            </button>
          </div>

          <div className="p-3" style={{ borderBottom: "1px solid #f1f3f4" }}>
            <button onClick={() => { setComposeMode("new"); setShowCompose(true); }}
              className={`w-full text-sm font-medium py-2.5 rounded-2xl flex items-center justify-center gap-2 transition hover:shadow-md ${sidebarCollapsed ? "px-2" : "px-4"}`}
              style={{ background: "#c2e7ff", color: "#001d35" }}>
              <FaEdit size={14} className="flex-shrink-0" />
              {!sidebarCollapsed && <span>Compose</span>}
            </button>
          </div>

          <div className="flex-1 overflow-y-auto py-2">
            <div className="flex flex-col gap-0.5 px-1">
              {labelOptions.map(label => (
                <button key={label.id}
                  onClick={() => { handleLabelClick(label); setShowMobileSidebar(false); }}
                  className={`w-full flex items-center ${sidebarCollapsed ? "justify-center px-2" : "justify-between px-3"} py-2 transition-all duration-100 text-sm`}
                  style={{
                    borderRadius: "0 100px 100px 0",
                    background: activeLabel === label.id ? "#d3e3fd" : "transparent",
                    color: activeLabel === label.id ? "#1a73e8" : "#444746",
                    fontWeight: activeLabel === label.id ? 600 : 400,
                    marginRight: "8px",
                  }}
                  onMouseEnter={e => { if (activeLabel !== label.id) e.currentTarget.style.background = "#f1f3f4"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = activeLabel === label.id ? "#d3e3fd" : "transparent"; }}
                  title={sidebarCollapsed ? label.name : ""}
                >
                  <div className={`flex items-center ${sidebarCollapsed ? "" : "gap-3"}`}>
                    <span style={{ color: activeLabel === label.id ? "#1a73e8" : "#444746" }}>{label.icon}</span>
                    {!sidebarCollapsed && <span>{label.name}</span>}
                  </div>
                  {!sidebarCollapsed && label.count > 0 && (
                    <span className="text-xs font-semibold" style={{ color: activeLabel === label.id ? "#1a73e8" : "#444746" }}>
                      {label.count > 999 ? `${Math.floor(label.count / 1000)}k` : label.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="p-3" style={{ borderTop: "1px solid #e8eaed" }}>
            <button onClick={() => setShowDisconnectModal(true)}
              className={`w-full text-xs text-red-500 hover:bg-red-50 px-3 py-2 rounded-xl transition flex items-center ${sidebarCollapsed ? "justify-center" : "gap-2"}`}>
              <FaSignOutAlt size={13} />
              {!sidebarCollapsed && <span>Disconnect</span>}
            </button>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="flex-1 flex flex-col overflow-hidden" style={{ background: "#f6f8fc" }}>
          <div className="bg-white px-5 py-3 flex-shrink-0" style={{ borderBottom: "1px solid #e8eaed" }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {selectedThread && (
                  <button onClick={handleBackToList} className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition">
                    <FaArrowLeft size={15} />
                  </button>
                )}
                <h1 className="text-base font-medium flex items-center gap-2" style={{ color: "#202124" }}>
                  {selectedThread ? (
                    <span className="truncate max-w-md">{messages[0]?.subject || "Email"}</span>
                  ) : (
                    <>
                      <span style={{ color: "#5f6368" }}>{labelOptions.find(l => l.id === activeLabel)?.icon}</span>
                      <span>{labelOptions.find(l => l.id === activeLabel)?.name}</span>
                      <span className="text-sm font-normal ml-1" style={{ color: "#5f6368" }}>
                        ({actualCounts[activeLabel] || 0})
                      </span>
                    </>
                  )}
                </h1>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => fetchThreads(activeLabel, false, true)} disabled={loading && loadingLabel === activeLabel}
                  className="p-2 rounded-full hover:bg-gray-100 transition" style={{ color: "#5f6368" }}>
                  {loading && loadingLabel === activeLabel ? <FaSpinner className="animate-spin" size={15} /> : <FaSync size={15} />}
                </button>
              </div>
            </div>

            {showBulkActions && !selectedThread && (
              <div className="mt-3 px-3 py-2 rounded-xl flex items-center gap-3 flex-wrap" style={{ background: "#e8f0fe" }}>
                <span className="text-xs font-medium flex items-center gap-1" style={{ color: "#1a73e8" }}>
                  <FaCheckSquare size={13} />{selectedThreads.size} selected
                </span>
                {[["read",true,"Mark Read"],["star",true,"⭐ Star"],["trash",null,"🗑 Trash"]].map(([a, v, l]) => (
                  <button key={a} onClick={() => handleBulkAction(a, v)}
                    className="text-xs bg-white px-3 py-1 rounded-full border transition"
                    style={{ color: "#1a73e8", borderColor: "#c5d6f5" }}>{l}</button>
                ))}
                <button onClick={() => { setSelectedThreads(new Set()); setShowBulkActions(false); setIsSelectAll(false); }}
                  className="ml-auto text-xs" style={{ color: "#5f6368" }}>Clear</button>
              </div>
            )}

            {!selectedThread && (
              <div className="mt-3 flex gap-2">
                <div className="flex-1 relative">
                  <FaSearch size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "#5f6368" }} />
                  <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                    placeholder={`Search in ${activeLabel.toLowerCase()}...`}
                    className="w-full pl-9 pr-4 py-2 rounded-2xl text-sm border-0 outline-none"
                    style={{ background: "#eaf1fb", color: "#202124" }} />
                </div>
                {activeLabel === "INBOX" && (
                  <button onClick={handleShowUnreadClick}
                    className="px-3.5 py-2 rounded-2xl text-sm flex items-center gap-2 transition"
                    style={{ background: "#fff", border: "1px solid #e8eaed", color: "#5f6368" }}>
                    <FaEnvelope size={13} />
                    <span className="hidden sm:inline">Unread</span>
                    {actualCounts.UNREAD > 0 && (
                      <span className="text-white text-xs rounded-full px-1.5 py-0.5 font-semibold" style={{ background: "#1a73e8" }}>
                        {actualCounts.UNREAD}
                      </span>
                    )}
                  </button>
                )}
              </div>
            )}
          </div>

          {error && (
            <div className="mx-4 mt-3 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center gap-2 text-sm">
              <FaExclamationCircle size={15} />{error}
            </div>
          )}

          <div className="flex-1 overflow-y-auto p-4">
            {!selectedThread ? (
              <div>
                {loading && loadingLabel === activeLabel && currentThreads.length === 0 && !initialLoadDone ? (
                  <div className="flex items-center justify-center h-64">
                    <FaSpinner className="animate-spin" size={28} style={{ color: "#1a73e8" }} />
                  </div>
                ) : filteredThreads.length === 0 ? (
                  <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                      <div className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ background: "#f1f3f4" }}>
                        <FaEnvelope size={34} style={{ color: "#dadce0" }} />
                      </div>
                      <h3 className="text-base font-medium mb-1" style={{ color: "#5f6368" }}>No emails found</h3>
                      <p className="text-sm" style={{ color: "#80868b" }}>
                        {searchQuery ? "Try adjusting your search" : activeLabel === "INBOX" ? "Your inbox is empty" : activeLabel === "UNREAD" ? "You're all caught up! 🎉" : `No emails in ${activeLabel.toLowerCase()}`}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-2xl overflow-hidden bg-white" style={{ border: "1px solid #e8eaed" }}>
                    {filteredThreads.map(thread => (
                      <div key={thread.id}
                        className={`group flex items-center px-4 py-2.5 cursor-pointer transition-all duration-100 border-b last:border-0`}
                        style={{
                          borderColor: "#f1f3f4",
                          background: selectedThread === thread.id ? "#e8f0fe" : thread.unread ? "#fafafa" : "white",
                          fontWeight: thread.unread ? 500 : 400,
                        }}
                        onMouseEnter={e => { if (selectedThread !== thread.id) e.currentTarget.style.background = "#f6f8fc"; }}
                        onMouseLeave={e => { e.currentTarget.style.background = selectedThread === thread.id ? "#e8f0fe" : thread.unread ? "#fafafa" : "white"; }}
                      >
                        <input type="checkbox" checked={selectedThreads.has(thread.id)}
                          onChange={() => toggleThreadSelection(thread.id)} onClick={e => e.stopPropagation()}
                          className="h-4 w-4 rounded border-gray-300 mr-3 flex-shrink-0" style={{ accentColor: "#1a73e8" }} />
                        <button onClick={e => { e.stopPropagation(); markThreadAs(thread.id, "star", !thread.starred); }}
                          className={`mr-3 flex-shrink-0 transition ${thread.starred ? "" : "opacity-0 group-hover:opacity-100"}`}
                          style={{ color: thread.starred ? "#f4b400" : "#dadce0" }}>
                          <FaStar size={15} />
                        </button>
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0 mr-3"
                          style={{ background: `hsl(${(thread.from?.charCodeAt(0) || 65) * 17 % 360},50%,45%)` }}>
                          {extractName(thread.from).charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0 cursor-pointer" onClick={() => loadThread(thread.id)}>
                          <div className="flex items-center gap-2">
                            <span className="text-sm truncate w-40 flex-shrink-0"
                              style={{ color: thread.unread ? "#202124" : "#5f6368", fontWeight: thread.unread ? 600 : 400 }}>
                              {extractName(thread.from)}
                            </span>
                            <span className="text-sm truncate" style={{ color: thread.unread ? "#202124" : "#5f6368" }}>
                              {thread.subject || "(No Subject)"}
                              <span className="font-normal ml-1.5" style={{ color: "#80868b" }}>{thread.snippet}</span>
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 ml-3 flex-shrink-0">
                          {thread.unread && <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: "#1a73e8" }} />}
                          <span className="text-xs whitespace-nowrap" style={{ color: "#5f6368" }}>{formatDateTime(thread.date)}</span>
                          <button onClick={e => { e.stopPropagation(); confirmDeleteThread(thread.id, activeLabel === "TRASH"); }}
                            className="opacity-0 group-hover:opacity-100 transition p-1 rounded-full hover:bg-gray-100" style={{ color: "#5f6368" }}>
                            <FaTrash size={13} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {nextPageTokenCache[activeLabel] && filteredThreads.length > 0 && (
                  <div className="mt-3 text-center">
                    <button onClick={() => fetchThreads(activeLabel, true)} disabled={loading && loadingLabel === activeLabel}
                      className="text-sm px-5 py-2 rounded-full border transition"
                      style={{ borderColor: "#dadce0", color: "#1a73e8", background: "white" }}>
                      {loading && loadingLabel === activeLabel
                        ? <><FaSpinner className="animate-spin inline mr-2" size={13} />Loading...</>
                        : <><FaPlus className="inline mr-2" size={13} />Load More</>}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-2xl overflow-hidden" style={{ border: "1px solid #e8eaed" }}>
                {messages.length === 0 ? (
                  <div className="text-center py-12">
                    <FaEnvelope size={46} className="mx-auto mb-3" style={{ color: "#dadce0" }} />
                    <p className="text-sm" style={{ color: "#5f6368" }}>No messages</p>
                  </div>
                ) : (
                  <div>
                    {messages.map(msg => (
                      <div key={msg.id} className="p-6" style={{ borderBottom: "1px solid #f1f3f4" }}>
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold"
                              style={{ background: `hsl(${(msg.from?.charCodeAt(0) || 65) * 17 % 360},50%,45%)` }}>
                              {extractName(msg.from).charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <h4 className="font-medium text-sm" style={{ color: "#202124" }}>{extractName(msg.from)}</h4>
                              <p className="text-xs" style={{ color: "#5f6368" }}>{extractEmail(msg.from)}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs" style={{ color: "#5f6368" }}>{new Date(msg.date).toLocaleString()}</span>
                            <button onClick={() => markThreadAs(selectedThread, "star", !msg.starred)}
                              className="p-1.5 rounded-full hover:bg-gray-100" style={{ color: msg.starred ? "#f4b400" : "#dadce0" }}>
                              <FaStar size={15} />
                            </button>
                            <button onClick={() => markThreadAs(selectedThread, "important", !msg.important)}
                              className="p-1.5 rounded-full hover:bg-gray-100" style={{ color: msg.important ? "#f29900" : "#dadce0" }}>
                              <FaExclamationCircle size={15} />
                            </button>
                          </div>
                        </div>
                        {(msg.to || msg.cc) && (
                          <div className="mb-4 text-xs" style={{ color: "#5f6368" }}>
                            {msg.to && <p><span className="font-medium">To:</span> {msg.to}</p>}
                            {msg.cc && <p><span className="font-medium">Cc:</span> {msg.cc}</p>}
                          </div>
                        )}
                        {msg.hasAttachments && msg.attachments?.length > 0 && (
                          <div className="mb-4 p-3 rounded-xl" style={{ background: "#f6f8fc" }}>
                            <h5 className="text-xs font-medium mb-2 flex items-center gap-1.5" style={{ color: "#444746" }}>
                              <FaPaperclip size={11} />Attachments ({msg.attachments.length})
                            </h5>
                            <div className="space-y-1.5">
                              {msg.attachments.map((att, idx) => (
                                <div key={idx} className="flex items-center justify-between p-2 bg-white rounded-lg" style={{ border: "1px solid #e8eaed" }}>
                                  <div className="flex items-center gap-2">
                                    <span>{getFileIcon({ type: att.mimeType, filename: att.filename })}</span>
                                    <div>
                                      <p className="text-xs font-medium" style={{ color: "#202124" }}>{att.filename}</p>
                                      <p className="text-xs" style={{ color: "#5f6368" }}>{formatFileSize(att.size)}</p>
                                    </div>
                                  </div>
                                  <button onClick={() => downloadAttachment(msg.id, att)}
                                    className="text-xs px-2.5 py-1 rounded-full flex items-center gap-1"
                                    style={{ color: "#1a73e8", background: "#e8f0fe" }}>
                                    <FaDownload size={11} />Download
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        <div className="prose max-w-none">
                          {msg.htmlBody ? (
                            <div className="text-sm leading-relaxed" style={{ color: "#202124" }} dangerouslySetInnerHTML={{ __html: msg.htmlBody }} />
                          ) : (
                            <pre className="text-sm whitespace-pre-wrap font-sans" style={{ color: "#202124" }}>{msg.body || "No content"}</pre>
                          )}
                        </div>
                        <div className="mt-5 flex items-center gap-2 pt-4" style={{ borderTop: "1px solid #f1f3f4" }}>
                          <button onClick={() => openComposeForReply(msg, "reply")}
                            className="text-sm px-4 py-1.5 rounded-full flex items-center gap-1.5 hover:opacity-90 transition"
                            style={{ background: "#c2e7ff", color: "#001d35" }}>
                            <FaReply size={13} />Reply
                          </button>
                          <button onClick={() => openComposeForReply(msg, "replyAll")}
                            className="text-sm px-4 py-1.5 rounded-full border flex items-center gap-1.5 hover:bg-gray-50 transition"
                            style={{ border: "1px solid #dadce0", color: "#444746" }}>
                            <FaReplyAll size={13} />Reply All
                          </button>
                          <button onClick={() => openComposeForReply(msg, "forward")}
                            className="text-sm px-4 py-1.5 rounded-full border flex items-center gap-1.5 hover:bg-gray-50 transition"
                            style={{ border: "1px solid #dadce0", color: "#444746" }}>
                            <FaForward size={13} />Forward
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {showMobileSidebar && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-30 lg:hidden" onClick={() => setShowMobileSidebar(false)} />
      )}
    </div>
  );
};

export default EmailChat;