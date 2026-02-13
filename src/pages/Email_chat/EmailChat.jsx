// import React, {
//   useEffect,
//   useState,
//   useRef,
//   useCallback,
//   useMemo,
// } from "react";
// import axios from "axios";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "../../components/ui/dialog";
// import { useSearchParams, useNavigate } from "react-router-dom";

// const EmailChat = () => {
//   const [searchParams] = useSearchParams();
//   const navigate = useNavigate();

//   // ============= CACHING LAYER =============
//   const [threadsCache, setThreadsCache] = useState(() => {
//     try {
//       const saved = sessionStorage.getItem("gmail_threads_cache");
//       return saved
//         ? JSON.parse(saved)
//         : {
//             INBOX: [],
//             UNREAD: [],
//             STARRED: [],
//             IMPORTANT: [],
//             SENT: [],
//             SPAM: [],
//             TRASH: [],
//             DRAFTS: [],
//           };
//     } catch {
//       return {
//         INBOX: [],
//         UNREAD: [],
//         STARRED: [],
//         IMPORTANT: [],
//         SENT: [],
//         SPAM: [],
//         TRASH: [],
//         DRAFTS: [],
//       };
//     }
//   });


// const [nextPageTokenCache, setNextPageTokenCache] = useState(() => {
//     try {
//       const saved = sessionStorage.getItem("gmail_page_tokens");
//       return saved ? JSON.parse(saved) : {};
//     } catch {
//       return {};
//     }
//   });

//   const [totalEmailsCache, setTotalEmailsCache] = useState(() => {
//     try {
//       const saved = sessionStorage.getItem("gmail_total_counts");
//       return saved ? JSON.parse(saved) : {};
//     } catch {
//       return {};
//     }
//   });

//   // ============= UI STATE =============
//   const [messages, setMessages] = useState([]);
//   const [selectedThread, setSelectedThread] = useState(null);
//   const [authStatus, setAuthStatus] = useState({
//     authenticated: false,
//     message: "",
//   });
//   const [loading, setLoading] = useState(false);
//   const [loadingLabel, setLoadingLabel] = useState(null);
//   const [error, setError] = useState("");
//   const [authUrl, setAuthUrl] = useState("");
//   const [userEmail, setUserEmail] = useState("");
//   const [showCompose, setShowCompose] = useState(false);
//   const [composeData, setComposeData] = useState({
//     to: "",
//     cc: "",
//     bcc: "",
//     subject: "",
//     message: "",
//     attachments: [],
//   });
//   const [sending, setSending] = useState(false);
//   const [savingDraft, setSavingDraft] = useState(false);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [threadToDelete, setThreadToDelete] = useState(null);
//   const [selectedFiles, setSelectedFiles] = useState([]);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [filterUnread, setFilterUnread] = useState(false);
//   const [activeLabel, setActiveLabel] = useState("INBOX");
//   const [labels, setLabels] = useState([]);
//   const [composeMode, setComposeMode] = useState("new");
//   const [emailSuggestions, setEmailSuggestions] = useState([]);
//   const [sendingProgress, setSendingProgress] = useState(0);
//   const [selectedThreads, setSelectedThreads] = useState(new Set());
//   const [showBulkActions, setShowBulkActions] = useState(false);
//   const [isSelectAll, setIsSelectAll] = useState(false);
//   const [lastFetchTime, setLastFetchTime] = useState({});
//   const [forceUpdate, setForceUpdate] = useState(0); // For forcing re-render

//   // ============= ACTUAL GMAIL COUNTS - REAL DATA =============
//   const [actualCounts, setActualCounts] = useState({
//     INBOX: 0,
//     UNREAD: 0,
//     STARRED: 0,
//     IMPORTANT: 0,
//     SENT: 0,
//     SPAM: 0,
//     TRASH: 0,
//     DRAFTS: 0,
//   });

//   const fileInputRef = useRef(null);
//   const initialLoadDone = useRef(false);
//   const abortControllerRef = useRef(null);

//   // API Base URL
//   const API_BASE_URL =
//     import.meta.env.VITE_API_URL || "http://localhost:5000/api";
//   const SI_URI = import.meta.env.VITE_SI_URI || "http://localhost:5000";

//   // ============= SAVE TO CACHE =============
//   useEffect(() => {
//     try {
//       sessionStorage.setItem(
//         "gmail_threads_cache",
//         JSON.stringify(threadsCache),
//       );
//       sessionStorage.setItem(
//         "gmail_page_tokens",
//         JSON.stringify(nextPageTokenCache),
//       );
//       sessionStorage.setItem(
//         "gmail_total_counts",
//         JSON.stringify(totalEmailsCache),
//       );
//     } catch (e) {
//       console.error("Failed to save to sessionStorage:", e);
//     }
//   }, [threadsCache, nextPageTokenCache, totalEmailsCache]);

//   // ============= OAUTH HANDLER =============
//   useEffect(() => {
//     const gmailConnected = searchParams.get("gmail_connected");
//     const gmailError = searchParams.get("gmail_error");
//     const errorMsg = searchParams.get("error");

//     if (gmailConnected) {
//       toast.success("✅ Gmail connected successfully!");
//       navigate("/emailchat", { replace: true });
//       // Refresh counts after connection
//       fetchAllCountsFast();
//     }

//     if (gmailError) {
//       toast.error(`❌ ${errorMsg || "Error connecting Gmail."}`);
//       navigate("/emailchat", { replace: true });
//     }
//   }, [searchParams, navigate]);

//   // ============= INITIAL LOAD =============
//   useEffect(() => {
//     if (!initialLoadDone.current) {
//       initialLoadDone.current = true;
//       checkAuthStatus();
//     }
//   }, []);

//   // ============= FETCH LABELS AND COUNTS =============
//   useEffect(() => {
//     if (authStatus.authenticated) {
//       fetchLabels();
//       fetchAllCountsFast();
//     }
//   }, [authStatus.authenticated]);

//   // ============= DEBOUNCED SUGGESTIONS =============
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       if (composeData.to.length > 2) {
//         fetchEmailSuggestions(composeData.to);
//       } else {
//         setEmailSuggestions([]);
//       }
//     }, 500);
//     return () => clearTimeout(timer);
//   }, [composeData.to]);

//   // ============= OPTIMIZED COUNT FETCH - SINGLE CALL =============
//   const fetchAllCountsFast = async () => {
//     try {
//       const res = await axios.get(`${API_BASE_URL}/gmail/all-counts`, {
//         timeout: 10000,
//       });

//       if (res.data.success) {
//         console.log("📊 REAL Gmail counts received:", res.data.counts);
//         setActualCounts(res.data.counts);

//         // Update cache
//         setTotalEmailsCache((prev) => ({
//           ...prev,
//           ...res.data.counts,
//         }));
//       }
//     } catch (err) {
//       console.error("Error fetching counts:", err);
//       // Don't set fallback - keep existing counts
//     }
//   };//old one



//   // ============= AUTH CHECK =============
//   const checkAuthStatus = async () => {
//     try {
//       setLoading(true);
//       const res = await axios.get(`${API_BASE_URL}/gmail/auth-status`);
//       setAuthStatus(res.data);

//       if (res.data.authenticated) {
//         setUserEmail(res.data.email || "");
//         // Load cached threads from sessionStorage
//         const cachedThreads = sessionStorage.getItem("gmail_threads_cache");
//         if (cachedThreads) {
//           setThreadsCache(JSON.parse(cachedThreads));
//         }
//       } else {
//         await fetchAuthUrl();
//       }
//     } catch (err) {
//       console.error("Error checking auth status:", err);
//       setAuthStatus({
//         authenticated: false,
//         message: "Error checking authentication status",
//       });
//       await fetchAuthUrl();
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchAuthUrl = async () => {
//     try {
//       const res = await axios.get(`${API_BASE_URL}/gmail/auth-url`);
//       if (res.data.success) {
//         setAuthUrl(res.data.url);
//       } else {
//         setError(res.data.error || "Failed to get authentication URL");
//       }
//     } catch (err) {
//       console.error("Error fetching auth URL:", err);
//       setError(
//         `Failed to connect to server. Make sure the backend is running on ${SI_URI}.`,
//       );
//     }
//   };

//   // ============= OPTIMIZED THREAD FETCHING =============
//   const fetchThreads = async (
//     label = activeLabel,
//     loadMore = false,
//     forceRefresh = false,
//   ) => {
//     if (abortControllerRef.current) {
//       abortControllerRef.current.abort();
//     }
//     abortControllerRef.current = new AbortController();

//     setLoading(true);
//     setLoadingLabel(label);
//     setError("");

//     try {
//       // Check cache first (unless forced refresh)
//       if (!forceRefresh && !loadMore) {
//         const cachedThreads = threadsCache[label];
//         const cacheAge = lastFetchTime[label]
//           ? Date.now() - lastFetchTime[label]
//           : Infinity;

//         if (cachedThreads && cachedThreads.length > 0 && cacheAge < 30000) {
//           // 30 seconds
//           console.log(
//             `✅ Using cached threads for ${label} (${cachedThreads.length} threads)`,
//           );
//           setLoading(false);
//           setLoadingLabel(null);
//           return;
//         }
//       }

//       const params = {
//         maxResults: 20,
//         label: label,
//       };

//       const pageToken = nextPageTokenCache[label];
//       if (loadMore && pageToken) {
//         params.pageToken = pageToken;
//       }

//       const res = await axios.get(`${API_BASE_URL}/gmail/threads`, {
//         params,
//         signal: abortControllerRef.current.signal,
//       });

//       if (res.data.success) {
//         let newThreads = res.data.data || [];

//         // Sort by latest first
//         newThreads.sort((a, b) => {
//           const dateA = a.timestamp || new Date(a.date).getTime() || 0;
//           const dateB = b.timestamp || new Date(b.date).getTime() || 0;
//           return dateB - dateA;
//         });

//         // Update cache
//         setThreadsCache((prev) => {
//           const updated = {
//             ...prev,
//             [label]: loadMore
//               ? [...(prev[label] || []), ...newThreads]
//               : newThreads,
//           };
//           return updated;
//         });

//         setNextPageTokenCache((prev) => ({
//           ...prev,
//           [label]: res.data.nextPageToken,
//         }));

//         if (res.data.totalEstimate) {
//           setTotalEmailsCache((prev) => ({
//             ...prev,
//             [label]: res.data.totalEstimate,
//           }));

//           // Update actual counts
//           setActualCounts((prev) => ({
//             ...prev,
//             [label]: res.data.totalEstimate,
//           }));
//         }

//         setLastFetchTime((prev) => ({
//           ...prev,
//           [label]: Date.now(),
//         }));

//         setSelectedThreads(new Set());
//         setShowBulkActions(false);
//         setIsSelectAll(false);

//         // Force re-render
//         setForceUpdate((prev) => prev + 1);
//       } else {
//         setError(res.data.error || "Failed to fetch emails");
//       }
//     } catch (err) {
//       if (err.name !== "AbortError" && err.code !== "ERR_CANCELED") {
//         console.error("Error fetching threads:", err);
//         setError(err.response?.data?.error || "Failed to fetch emails");
//       }
//     } finally {
//       setLoading(false);
//       setLoadingLabel(null);
//     }
//   };

//   const fetchLabels = async () => {
//     try {
//       const res = await axios.get(`${API_BASE_URL}/gmail/labels`);
//       if (res.data.success) {
//         setLabels(res.data.data);
//       }
//     } catch (err) {
//       console.error("Error fetching labels:", err);
//     }
//   };

//   const fetchDrafts = async () => {
//     try {
//       const res = await axios.get(`${API_BASE_URL}/gmail/drafts`, {
//         params: { maxResults: 20 },
//       });
//       if (res.data.success) {
//         setThreadsCache((prev) => ({
//           ...prev,
//           DRAFTS: res.data.data || [],
//         }));

//         setActualCounts((prev) => ({
//           ...prev,
//           DRAFTS: res.data.totalCount || res.data.data?.length || 0,
//         }));
//       }
//     } catch (err) {
//       console.error("Error fetching drafts:", err);
//       toast.error("Failed to fetch drafts");
//     }
//   };

//   const fetchEmailSuggestions = async (query) => {
//     try {
//       const res = await axios.get(
//         `${API_BASE_URL}/gmail/suggestions?query=${encodeURIComponent(query)}`,
//       );
//       if (res.data.success) {
//         setEmailSuggestions(res.data.data || []);
//       }
//     } catch (err) {
//       console.error("Error fetching suggestions:", err);
//       setEmailSuggestions([]);
//     }
//   };

//   // ============= LOAD THREAD =============
//   const loadThread = async (threadId) => {
//     setLoading(true);
//     setError("");
//     try {
//       const res = await axios.get(`${API_BASE_URL}/gmail/thread/${threadId}`);
//       if (res.data.success) {
//         setMessages(res.data.data.messages || []);
//         setSelectedThread(threadId);

//         // Update unread status in cache
//         setThreadsCache((prev) => {
//           const updatedThreads = (prev[activeLabel] || []).map((thread) =>
//             thread.id === threadId ? { ...thread, unread: false } : thread,
//           );

//           return {
//             ...prev,
//             [activeLabel]: updatedThreads,
//           };
//         });

//         // Update unread count IMMEDIATELY
//         if (activeLabel === "INBOX") {
//           setActualCounts((prev) => ({
//             ...prev,
//             UNREAD: Math.max(0, prev.UNREAD - 1),
//           }));
//         }
//       } else {
//         setError(res.data.error || "Failed to fetch thread");
//       }
//     } catch (err) {
//       console.error("Error fetching thread:", err);
//       setError(err.response?.data?.error || "Failed to fetch thread");
//     } finally {
//       setLoading(false);
//     }
//   };//old one



//   const connectGmail = () => {
//     if (authUrl) {
//       window.open(authUrl, "_self");
//     }
//   };

//   const disconnectGmail = async () => {
//     try {
//       await axios.delete(`${API_BASE_URL}/gmail/disconnect`);

//       setAuthStatus({ authenticated: false, message: "Gmail disconnected" });
//       setThreadsCache({
//         INBOX: [],
//         UNREAD: [],
//         STARRED: [],
//         IMPORTANT: [],
//         SENT: [],
//         SPAM: [],
//         TRASH: [],
//         DRAFTS: [],
//       });
//       setNextPageTokenCache({});
//       setTotalEmailsCache({});
//       setMessages([]);
//       setSelectedThread(null);
//       setUserEmail("");
//       setActualCounts({
//         INBOX: 0,
//         UNREAD: 0,
//         STARRED: 0,
//         IMPORTANT: 0,
//         SENT: 0,
//         SPAM: 0,
//         TRASH: 0,
//         DRAFTS: 0,
//       });

//       sessionStorage.removeItem("gmail_threads_cache");
//       sessionStorage.removeItem("gmail_page_tokens");
//       sessionStorage.removeItem("gmail_total_counts");

//       await fetchAuthUrl();
//       toast.success("Gmail disconnected successfully");
//     } catch (err) {
//       console.error("Error disconnecting Gmail:", err);
//       toast.error("Error disconnecting Gmail");
//     }
//   };

//   // ============= FILE HANDLING =============
//   const handleFileSelect = (e) => {
//     const files = Array.from(e.target.files);
//     const validFiles = files.filter((file) => {
//       if (file.size > 30 * 1024 * 1024) {
//         toast.error(`File ${file.name} exceeds 30MB limit`);
//         return false;
//       }
//       return true;
//     });

//     if (validFiles.length === 0) return;
//     setSelectedFiles((prev) => [...prev, ...validFiles]);
//   };

//   const removeFile = (index) => {
//     setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
//   };

//   const triggerFileInput = () => {
//     fileInputRef.current?.click();
//   };

//   const getFileIcon = (file) => {
//     if (file.type) {
//       if (file.type.startsWith("image/")) return "🖼️";
//       if (file.type.includes("pdf")) return "📄";
//       if (file.type.includes("audio")) return "🎵";
//       if (file.type.includes("video")) return "🎬";
//       if (file.type.includes("zip") || file.type.includes("rar")) return "📦";
//       if (file.type.includes("word") || file.type.includes("document"))
//         return "📝";
//       if (file.type.includes("excel") || file.type.includes("spreadsheet"))
//         return "📊";
//       if (file.type.includes("powerpoint")) return "📊";
//     }

//     const fileName = file.name || file.filename || "";
//     const extension = fileName.split(".").pop().toLowerCase();

//     const iconMap = {
//       jpg: "🖼️",
//       jpeg: "🖼️",
//       png: "🖼️",
//       gif: "🖼️",
//       pdf: "📄",
//       mp3: "🎵",
//       wav: "🎵",
//       mp4: "🎬",
//       avi: "🎬",
//       zip: "📦",
//       rar: "📦",
//       doc: "📝",
//       docx: "📝",
//       xls: "📊",
//       xlsx: "📊",
//       csv: "📊",
//       ppt: "📊",
//       pptx: "📊",
//       txt: "📄",
//       rtf: "📄",
//     };

//     return iconMap[extension] || "📎";
//   };

//   const formatFileSize = (bytes) => {
//     if (bytes === 0) return "0 Bytes";
//     const k = 1024;
//     const sizes = ["Bytes", "KB", "MB", "GB"];
//     const i = Math.floor(Math.log(bytes) / Math.log(k));
//     return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
//   };

//   // ============= SEND EMAIL =============
//   // const sendEmail = async () => {
//   //   if (!composeData.to.trim()) {
//   //     toast.error("Please enter recipient email address");
//   //     return;
//   //   }

//   //   setSending(true);
//   //   setSendingProgress(0);
//   //   setError("");

//   //   try {
//   //     const formData = new FormData();
//   //     formData.append("to", composeData.to);
//   //     formData.append("cc", composeData.cc || "");
//   //     formData.append("bcc", composeData.bcc || "");
//   //     formData.append("subject", composeData.subject || "(No Subject)");
//   //     formData.append("message", composeData.message || "");

//   //     selectedFiles.forEach((file) => {
//   //       formData.append("attachments", file);
//   //     });

//   //     const res = await axios.post(`${API_BASE_URL}/gmail/send`, formData, {
//   //       headers: { "Content-Type": "multipart/form-data" },
//   //       onUploadProgress: (progressEvent) => {
//   //         if (progressEvent.total) {
//   //           const percentCompleted = Math.round(
//   //             (progressEvent.loaded * 100) / progressEvent.total,
//   //           );
//   //           setSendingProgress(percentCompleted);
//   //         }
//   //       },
//   //       timeout: 300000,
//   //     });

//   //     setSendingProgress(100);

//   //     if (res.data.success) {
//   //       toast.success(`📧 Email sent successfully!`);
//   //       setComposeData({
//   //         to: "",
//   //         cc: "",
//   //         bcc: "",
//   //         subject: "",
//   //         message: "",
//   //         attachments: [],
//   //       });
//   //       setSelectedFiles([]);
//   //       setShowCompose(false);

//   //       // Update SENT count IMMEDIATELY
//   //       setActualCounts((prev) => ({
//   //         ...prev,
//   //         SENT: prev.SENT + 1,
//   //       }));

//   //       setTimeout(() => setSendingProgress(0), 1000);
//   //     } else {
//   //       throw new Error(res.data.error || "Failed to send email");
//   //     }
//   //   } catch (err) {
//   //     console.error("❌ Error sending email:", err);
//   //     const errorMsg =
//   //       err.response?.data?.error || err.message || "Failed to send email";
//   //     toast.error(`Failed to send email: ${errorMsg}`);
//   //     setSendingProgress(0);
//   //   } finally {
//   //     setSending(false);
//   //   }
//   // };//old one..


//   // ============= FIXED SEND EMAIL WITH IMMEDIATE REFRESH =============
// const sendEmail = async () => {
//   if (!composeData.to.trim()) {
//     toast.error("Please enter recipient email address");
//     return;
//   }

//   setSending(true);
//   setSendingProgress(0);
//   setError("");

//   try {
//     console.log("📧 Preparing to send email...");
    
//     const formData = new FormData();
//     formData.append("to", composeData.to.trim());
//     formData.append("cc", composeData.cc?.trim() || "");
//     formData.append("bcc", composeData.bcc?.trim() || "");
//     formData.append("subject", composeData.subject?.trim() || "(No Subject)");
//     formData.append("message", composeData.message?.trim() || "");

//     // Append files with correct field name 'attachments'
//     if (selectedFiles && selectedFiles.length > 0) {
//       selectedFiles.forEach((file) => {
//         formData.append("attachments", file);
//       });
//       console.log(`📎 Attached ${selectedFiles.length} files`);
//     }

//     const res = await axios.post(`${API_BASE_URL}/gmail/send`, formData, {
//       headers: { "Content-Type": "multipart/form-data" },
//       onUploadProgress: (progressEvent) => {
//         if (progressEvent.total) {
//           const percentCompleted = Math.round(
//             (progressEvent.loaded * 100) / progressEvent.total
//           );
//           setSendingProgress(percentCompleted);
//         }
//       },
//       timeout: 300000,
//     });

//     setSendingProgress(100);

//     if (res.data.success) {
//       toast.success(`📧 Email sent successfully!`);
      
//       // Clear compose form
//       setComposeData({
//         to: "", cc: "", bcc: "", subject: "", message: "", attachments: [],
//       });
//       setSelectedFiles([]);
//       setShowCompose(false);

//       // ==== IMMEDIATE COUNT UPDATE ====
//       setActualCounts(prev => ({
//         ...prev,
//         SENT: (prev.SENT || 0) + 1
//       }));

//       // ==== IMMEDIATE THREAD REFRESH ====
//       // If we're in SENT folder, refresh it immediately
//       if (activeLabel === "SENT") {
//         fetchThreads("SENT", false, true);
//       }
      
//       // If we're in INBOX folder, refresh counts but not threads (to avoid UI flash)
//       if (activeLabel === "INBOX") {
//         fetchAllCountsFast();
//       }

//       setTimeout(() => setSendingProgress(0), 1000);
//     } else {
//       throw new Error(res.data.error || "Failed to send email");
//     }
//   } catch (err) {
//     console.error("❌ Error sending email:", err);
//     const errorMsg = err.response?.data?.error || err.message || "Failed to send email";
//     toast.error(`Failed to send email: ${errorMsg}`);
//     setSendingProgress(0);
//   } finally {
//     setSending(false);
//   }
//   };
  

//   //new one
// // ============= ADD THIS FUNCTION TO REFRESH AFTER SEND =============
// const refreshAfterSend = async () => {
//   // Refresh INBOX count
//   try {
//     const res = await axios.get(`${API_BASE_URL}/gmail/threads`, {
//       params: { maxResults: 1, label: "INBOX", countOnly: true }
//     });
//     if (res.data.totalEstimate) {
//       setActualCounts(prev => ({
//         ...prev,
//         INBOX: res.data.totalEstimate,
//         SENT: prev.SENT + 1
//       }));
//     }
//   } catch (err) {
//     console.error("Error refreshing counts:", err);
//   }
  
//   // Refresh current view if it's INBOX or SENT
//   if (activeLabel === "INBOX" || activeLabel === "SENT") {
//     setTimeout(() => {
//       fetchThreads(activeLabel, false, true);
//     }, 500);
//   }
// };

//   //new one..

//   const saveAsDraft = async () => {
//     if (!composeData.to.trim()) {
//       toast.error("Please enter recipient email address");
//       return;
//     }

//     setSavingDraft(true);
//     try {
//       const formData = new FormData();
//       formData.append("to", composeData.to);
//       formData.append("cc", composeData.cc || "");
//       formData.append("bcc", composeData.bcc || "");
//       formData.append("subject", composeData.subject || "(No Subject)");
//       formData.append("message", composeData.message || "");

//       selectedFiles.forEach((file) => {
//         formData.append("attachments", file);
//       });

//       const res = await axios.post(`${API_BASE_URL}/gmail/draft`, formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       if (res.data.success) {
//         toast.success("📝 Draft saved successfully!");
//         setComposeData({
//           to: "",
//           cc: "",
//           bcc: "",
//           subject: "",
//           message: "",
//           attachments: [],
//         });
//         setSelectedFiles([]);
//         setShowCompose(false);

//         setActualCounts((prev) => ({
//           ...prev,
//           DRAFTS: prev.DRAFTS + 1,
//         }));
//       } else {
//         throw new Error(res.data.error || "Failed to save draft");
//       }
//     } catch (err) {
//       console.error("❌ Error saving draft:", err);
//       const errorMsg =
//         err.response?.data?.error || err.message || "Failed to save draft";
//       toast.error(`Failed to save draft: ${errorMsg}`);
//     } finally {
//       setSavingDraft(false);
//     }
//   };

//   // ============= THREAD ACTIONS - FIXED FOR IMMEDIATE UI UPDATE =============
//   const markThreadAs = async (threadId, action, value = true) => {
//     try {
//       let endpoint = "";
//       let body = {};

//       switch (action) {
//         case "read":
//           endpoint = `thread/${threadId}/read`;
//           body = { read: value };
//           break;
//         case "star":
//           endpoint = `thread/${threadId}/star`;
//           body = { star: value };
//           break;
//         case "spam":
//           endpoint = `thread/${threadId}/spam`;
//           body = { spam: value };
//           break;
//         case "important":
//           endpoint = `thread/${threadId}/important`;
//           body = { important: value };
//           break;
//         case "trash":
//           endpoint = `thread/${threadId}/trash`;
//           break;
//       }

//       // ============ IMMEDIATE UI UPDATE ============
//       // Update threads cache immediately for instant feedback
//       setThreadsCache((prev) => {
//         const updatedThreads = (prev[activeLabel] || []).map((thread) => {
//           if (thread.id === threadId) {
//             const updated = { ...thread };
//             switch (action) {
//               case "read":
//                 updated.unread = !value;
//                 break;
//               case "star":
//                 updated.starred = value;
//                 break;
//               case "spam":
//                 updated.spam = value;
//                 break;
//               case "important":
//                 updated.important = value;
//                 break;
//               case "trash":
//                 updated.trash = true;
//                 break;
//             }
//             return updated;
//           }
//           return thread;
//         });

//         return {
//           ...prev,
//           [activeLabel]: updatedThreads,
//         };
//       });

//       // Update counts IMMEDIATELY
//       if (action === "star") {
//         setActualCounts((prev) => ({
//           ...prev,
//           STARRED: value ? prev.STARRED + 1 : Math.max(0, prev.STARRED - 1),
//         }));
//       }

//       if (action === "important") {
//         setActualCounts((prev) => ({
//           ...prev,
//           IMPORTANT: value
//             ? prev.IMPORTANT + 1
//             : Math.max(0, prev.IMPORTANT - 1),
//         }));
//       }

//       // Force re-render immediately
//       setForceUpdate((prev) => prev + 1);

//       // ============ API CALL ============
//       const res = await axios.post(`${API_BASE_URL}/gmail/${endpoint}`, body);

//       if (res.data.success) {
//         toast.success(res.data.message);

//         // Handle moving to STARRED folder if we're starring from INBOX
//         if (action === "star" && value === true && activeLabel === "INBOX") {
//           // We need to add this thread to STARRED cache if not already there
//           setThreadsCache((prev) => {
//             const starredThreads = prev.STARRED || [];
//             const threadToAdd = prev[activeLabel]?.find(
//               (t) => t.id === threadId,
//             );

//             if (threadToAdd && !starredThreads.some((t) => t.id === threadId)) {
//               return {
//                 ...prev,
//                 STARRED: [{ ...threadToAdd, starred: true }, ...starredThreads],
//               };
//             }
//             return prev;
//           });
//         }

//         // Remove from current view if it no longer matches the label
//         if (
//           (action === "star" && activeLabel === "STARRED" && !value) ||
//           (action === "important" && activeLabel === "IMPORTANT" && !value) ||
//           (action === "spam" && activeLabel === "SPAM" && !value) ||
//           (action === "trash" && activeLabel === "TRASH")
//         ) {
//           setThreadsCache((prev) => ({
//             ...prev,
//             [activeLabel]: (prev[activeLabel] || []).filter(
//               (t) => t.id !== threadId,
//             ),
//           }));

//           if (selectedThread === threadId) {
//             setSelectedThread(null);
//             setMessages([]);
//           }
//         }
//       }
//     } catch (err) {
//       console.error(`Error ${action} thread:`, err);
//       toast.error(`Failed to ${action} thread`);

//       // Revert on error
//       if (action === "star") {
//         setActualCounts((prev) => ({
//           ...prev,
//           STARRED: !value ? prev.STARRED + 1 : Math.max(0, prev.STARRED - 1),
//         }));
//       }

//       if (action === "important") {
//         setActualCounts((prev) => ({
//           ...prev,
//           IMPORTANT: !value
//             ? prev.IMPORTANT + 1
//             : Math.max(0, prev.IMPORTANT - 1),
//         }));
//       }

//       // Revert thread state
//       setThreadsCache((prev) => {
//         const revertedThreads = (prev[activeLabel] || []).map((thread) => {
//           if (thread.id === threadId) {
//             const reverted = { ...thread };
//             switch (action) {
//               case "star":
//                 reverted.starred = !value;
//                 break;
//               case "important":
//                 reverted.important = !value;
//                 break;
//             }
//             return reverted;
//           }
//           return thread;
//         });

//         return {
//           ...prev,
//           [activeLabel]: revertedThreads,
//         };
//       });

//       setForceUpdate((prev) => prev + 1);
//     }
//   };//old one



//   // ============= BULK ACTIONS =============
//   const handleBulkAction = async (action, value = true) => {
//     if (selectedThreads.size === 0) {
//       toast.error("No emails selected");
//       return;
//     }

//     const threadIds = Array.from(selectedThreads);

//     try {
//       // Immediate UI update
//       if (action === "star") {
//         setThreadsCache((prev) => ({
//           ...prev,
//           [activeLabel]: (prev[activeLabel] || []).map((thread) => {
//             if (selectedThreads.has(thread.id)) {
//               return { ...thread, starred: value };
//             }
//             return thread;
//           }),
//         }));

//         setActualCounts((prev) => ({
//           ...prev,
//           STARRED: value
//             ? prev.STARRED + threadIds.length
//             : Math.max(0, prev.STARRED - threadIds.length),
//         }));
//       }

//       if (action === "read") {
//         setThreadsCache((prev) => ({
//           ...prev,
//           [activeLabel]: (prev[activeLabel] || []).map((thread) => {
//             if (selectedThreads.has(thread.id)) {
//               return { ...thread, unread: !value };
//             }
//             return thread;
//           }),
//         }));

//         setActualCounts((prev) => ({
//           ...prev,
//           UNREAD: value
//             ? Math.max(0, prev.UNREAD - threadIds.length)
//             : prev.UNREAD + threadIds.length,
//         }));
//       }

//       if (action === "trash") {
//         setThreadsCache((prev) => ({
//           ...prev,
//           [activeLabel]: (prev[activeLabel] || []).filter(
//             (thread) => !selectedThreads.has(thread.id),
//           ),
//         }));

//         setActualCounts((prev) => ({
//           ...prev,
//           TRASH: prev.TRASH + threadIds.length,
//         }));
//       }

//       setForceUpdate((prev) => prev + 1);

//       // API calls
//       switch (action) {
//         case "star":
//           await axios.post(`${API_BASE_URL}/gmail/bulk-star`, {
//             threadIds,
//             star: value,
//           });
//           toast.success(
//             `⭐ ${value ? "Starred" : "Unstarred"} ${threadIds.length} emails`,
//           );
//           break;

//         case "delete":
//           const deleteRes = await axios.post(
//             `${API_BASE_URL}/gmail/bulk-delete`,
//             { threadIds, permanent: activeLabel === "TRASH" },
//           );
//           toast.success(`🗑️ ${deleteRes.data.message}`);
//           break;

//         case "read":
//           await Promise.all(
//             threadIds.map((threadId) =>
//               axios.post(`${API_BASE_URL}/gmail/thread/${threadId}/read`, {
//                 read: value,
//               }),
//             ),
//           );
//           toast.success(
//             `Marked ${threadIds.length} emails as ${value ? "read" : "unread"}`,
//           );
//           break;

//         case "trash":
//           await Promise.all(
//             threadIds.map((threadId) =>
//               axios.post(`${API_BASE_URL}/gmail/thread/${threadId}/trash`),
//             ),
//           );
//           toast.success(`Moved ${threadIds.length} emails to trash`);
//           break;
//       }

//       setSelectedThreads(new Set());
//       setShowBulkActions(false);
//       setIsSelectAll(false);
//     } catch (err) {
//       console.error(`Error in bulk ${action}:`, err);
//       toast.error(`Failed to ${action} emails`);

//       // Refresh counts on error
//       fetchAllCountsFast();
//     }
//   };

//   const toggleThreadSelection = (threadId) => {
//     const currentThreads = threadsCache[activeLabel] || [];
//     const newSelected = new Set(selectedThreads);

//     if (newSelected.has(threadId)) {
//       newSelected.delete(threadId);
//     } else {
//       newSelected.add(threadId);
//     }

//     setSelectedThreads(newSelected);
//     setShowBulkActions(newSelected.size > 0);
//     setIsSelectAll(newSelected.size === currentThreads.length);
//   };

//   const selectAllThreads = () => {
//     const currentThreads = threadsCache[activeLabel] || [];

//     if (selectedThreads.size === currentThreads.length) {
//       setSelectedThreads(new Set());
//       setShowBulkActions(false);
//       setIsSelectAll(false);
//     } else {
//       setSelectedThreads(new Set(currentThreads.map((t) => t.id)));
//       setShowBulkActions(true);
//       setIsSelectAll(true);
//     }
//   };

//   const deleteThread = async (threadId, permanent = false) => {
//     try {
//       if (permanent) {
//         await axios.delete(`${API_BASE_URL}/gmail/thread/${threadId}`);
//       } else {
//         await axios.post(`${API_BASE_URL}/gmail/thread/${threadId}/trash`);
//       }

//       toast.success(
//         permanent
//           ? "🗑️ Thread permanently deleted"
//           : "🗑️ Thread moved to trash",
//       );

//       // Immediate UI update
//       setThreadsCache((prev) => ({
//         ...prev,
//         [activeLabel]: (prev[activeLabel] || []).filter(
//           (thread) => thread.id !== threadId,
//         ),
//       }));

//       if (activeLabel === "TRASH" && permanent) {
//         setActualCounts((prev) => ({
//           ...prev,
//           TRASH: Math.max(0, prev.TRASH - 1),
//         }));
//       } else if (activeLabel === "INBOX" && !permanent) {
//         setActualCounts((prev) => ({
//           ...prev,
//           TRASH: prev.TRASH + 1,
//         }));
//       }

//       if (selectedThread === threadId) {
//         setMessages([]);
//         setSelectedThread(null);
//       }

//       setForceUpdate((prev) => prev + 1);
//     } catch (err) {
//       console.error("Error deleting thread:", err);
//       toast.error(err.response?.data?.error || "Failed to delete thread");
//     } finally {
//       setShowDeleteModal(false);
//       setThreadToDelete(null);
//     }
//   };//old one


// // ============= FIXED: Delete Thread - WITH COUNT SYNC =============

  



//   const confirmDeleteThread = (threadId, permanent = false) => {
//     setThreadToDelete({ id: threadId, permanent });
//     setShowDeleteModal(true);
//   };

//   // ============= UTILITY FUNCTIONS =============
//   const formatDateTime = (dateString) => {
//     if (!dateString) return "";
//     try {
//       const date = new Date(dateString);
//       const now = new Date();
//       const diffMs = now - date;
//       const diffMins = Math.floor(diffMs / 60000);
//       const diffHours = Math.floor(diffMs / 3600000);
//       const diffDays = Math.floor(diffMs / 86400000);

//       const timeStr = date.toLocaleTimeString("en-US", {
//         hour: "2-digit",
//         minute: "2-digit",
//         hour12: true,
//       });

//       if (diffMins < 1) return `Just now (${timeStr})`;
//       if (diffMins < 60) return `${diffMins}m ago (${timeStr})`;
//       if (diffHours < 24) return `${diffHours}h ago (${timeStr})`;
//       if (diffDays < 7)
//         return `${diffDays}d ago (${date.toLocaleDateString("en-US", { month: "short", day: "numeric" })} at ${timeStr})`;

//       return date.toLocaleDateString("en-US", {
//         month: "short",
//         day: "numeric",
//         year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
//         hour: "2-digit",
//         minute: "2-digit",
//         hour12: true,
//       });
//     } catch {
//       return dateString;
//     }
//   };

//   const extractNameFromEmail = (emailString) => {
//     if (!emailString) return "Unknown";
//     const match = emailString.match(/(.*?)</);
//     return match ? match[1].trim() : emailString;
//   };

//   const extractEmailAddress = (emailString) => {
//     if (!emailString) return "";
//     const match = emailString.match(/<([^>]+)>/);
//     return match ? match[1] : emailString;
//   };

//   const downloadAttachment = async (messageId, attachment) => {
//     try {
//       const res = await axios.get(
//         `${API_BASE_URL}/gmail/attachment/${messageId}/${attachment.id}`,
//         { responseType: "blob" },
//       );

//       const url = window.URL.createObjectURL(new Blob([res.data]));
//       const link = document.createElement("a");
//       link.href = url;
//       link.setAttribute("download", attachment.filename);
//       document.body.appendChild(link);
//       link.click();
//       link.remove();
//       window.URL.revokeObjectURL(url);
//       toast.success(`📥 Downloaded ${attachment.filename}`);
//     } catch (err) {
//       console.error("Error downloading attachment:", err);
//       toast.error("Failed to download attachment");
//     }
//   };

//   const openComposeForReply = (msg, type = "reply") => {
//     let to = "";
//     let subject = "";
//     let message = "";

//     switch (type) {
//       case "reply":
//         to = extractEmailAddress(msg.from);
//         subject = msg.subject.startsWith("Re:")
//           ? msg.subject
//           : `Re: ${msg.subject}`;
//         message = `\n\nOn ${formatDateTime(msg.date)}, ${extractNameFromEmail(msg.from)} wrote:\n> ${msg.body?.substring(0, 200)}...`;
//         break;
//       case "replyAll":
//         const allRecipients = [
//           extractEmailAddress(msg.from),
//           ...(msg.to
//             ? msg.to
//                 .split(",")
//                 .map((e) => extractEmailAddress(e.trim()))
//                 .filter((e) => e)
//             : []),
//           ...(msg.cc
//             ? msg.cc
//                 .split(",")
//                 .map((e) => extractEmailAddress(e.trim()))
//                 .filter((e) => e)
//             : []),
//         ].filter((v, i, a) => a.indexOf(v) === i && v !== userEmail);
//         to = allRecipients.join(", ");
//         subject = msg.subject.startsWith("Re:")
//           ? msg.subject
//           : `Re: ${msg.subject}`;
//         message = `\n\nOn ${formatDateTime(msg.date)}, ${extractNameFromEmail(msg.from)} wrote:\n> ${msg.body?.substring(0, 200)}...`;
//         break;
//       case "forward":
//         to = "";
//         subject = msg.subject.startsWith("Fwd:")
//           ? msg.subject
//           : `Fwd: ${msg.subject}`;
//         message = `\n\n---------- Forwarded message ----------\nFrom: ${msg.from}\nDate: ${msg.date}\nSubject: ${msg.subject}\nTo: ${msg.to}\n\n${msg.body}`;
//         break;
//     }

//     setComposeData({
//       to,
//       cc: "",
//       bcc: "",
//       subject,
//       message,
//       attachments: [],
//     });
//     setComposeMode(type);
//     setShowCompose(true);
//   };

//   const clearCompose = () => {
//     setComposeData({
//       to: "",
//       cc: "",
//       bcc: "",
//       subject: "",
//       message: "",
//       attachments: [],
//     });
//     setSelectedFiles([]);
//     setComposeMode("new");
//     setEmailSuggestions([]);
//   };

//   const handleBackToList = () => {
//     setSelectedThread(null);
//     setMessages([]);
//   };

//   // ============= LABEL CLICK HANDLER =============
//   const handleLabelClick = async (label) => {
//     if (abortControllerRef.current) {
//       abortControllerRef.current.abort();
//     }

//     setActiveLabel(label.id);
//     setSelectedThread(null);
//     setMessages([]);
//     setSearchQuery("");
//     setFilterUnread(false);
//     setSelectedThreads(new Set());
//     setShowBulkActions(false);
//     setIsSelectAll(false);

//     if (label.id === "DRAFTS") {
//       await fetchDrafts();
//     } else {
//       const cachedThreads = threadsCache[label.id];

//       if (!cachedThreads || cachedThreads.length === 0) {
//         await fetchThreads(label.id, false, false);
//       } else {
//         console.log(
//           `📨 Using cached threads for ${label.id} (${cachedThreads.length})`,
//         );
//         setForceUpdate((prev) => prev + 1);

//         const cacheAge = lastFetchTime[label.id]
//           ? Date.now() - lastFetchTime[label.id]
//           : Infinity;
//         if (cacheAge > 30000) {
//           setTimeout(() => {
//             fetchThreads(label.id, false, true);
//           }, 100);
//         }
//       }
//     }
//   };

//   // ============= DERIVED STATE =============
//   const currentThreads = threadsCache[activeLabel] || [];

//   const filteredThreads = currentThreads.filter((thread) => {
//     const matchesSearch =
//       searchQuery === "" ||
//       thread.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       thread.from?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       thread.snippet?.toLowerCase().includes(searchQuery.toLowerCase());

//     const matchesUnread = !filterUnread || thread.unread;

//     return matchesSearch && matchesUnread;
//   });

//   // ============= LABEL OPTIONS WITH REAL COUNTS =============
//   const labelOptions = [
//     { id: "INBOX", name: "Inbox", icon: "📥", count: actualCounts.INBOX },
//     { id: "UNREAD", name: "Unread", icon: "📨", count: actualCounts.UNREAD },
//     { id: "STARRED", name: "Starred", icon: "⭐", count: actualCounts.STARRED },
//     {
//       id: "IMPORTANT",
//       name: "Important",
//       icon: "❗",
//       count: actualCounts.IMPORTANT,
//     },
//     { id: "DRAFTS", name: "Drafts", icon: "📝", count: actualCounts.DRAFTS },
//     { id: "SENT", name: "Sent", icon: "📤", count: actualCounts.SENT },
//     { id: "SPAM", name: "Spam", icon: "🚫", count: actualCounts.SPAM },
//     { id: "TRASH", name: "Trash", icon: "🗑️", count: actualCounts.TRASH },
//   ];

//   const renderLabelIcon = (thread) => {
//     if (thread.starred) return "⭐";
//     if (thread.important) return "❗";
//     if (thread.spam) return "🚫";
//     if (thread.trash) return "🗑️";
//     if (thread.drafts) return "📝";
//     if (thread.unread) return "📨";
//     return "📧";
//   };

//   // ============= LOADING STATE =============
//   if (loading && !authStatus.authenticated && !error) {
//     return (
//       <div className="p-8 max-w-md mx-auto mt-20 bg-white rounded-xl border border-gray-200 shadow-lg">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-6"></div>
//           <h3 className="text-xl font-semibold text-gray-800 mb-2">
//             Connecting to Gmail
//           </h3>
//           <p className="text-gray-600 mb-4">
//             Checking authentication status...
//           </p>
//         </div>
//       </div>
//     );
//   }

//   // ============= NOT AUTHENTICATED =============
//   if (!authStatus.authenticated) {
//     return (
//       <div className="p-8 max-w-md mx-auto mt-20 bg-white rounded-xl border border-gray-200 shadow-lg">
//         <div className="text-center mb-8">
//           <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
//             <svg
//               className="w-10 h-10 text-blue-600"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
//               />
//             </svg>
//           </div>
//           <h2 className="text-2xl font-bold text-gray-800 mb-3">
//             Connect Your Gmail
//           </h2>
//           <p className="text-gray-600 mb-6">
//             Connect your Gmail account to manage emails directly
//           </p>
//         </div>

//         {error && (
//           <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
//             <p>{error}</p>
//           </div>
//         )}

//         {authStatus.message && !error && (
//           <div className="mb-6 p-4 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg text-sm">
//             <p>{authStatus.message}</p>
//           </div>
//         )}

//         {authUrl ? (
//           <div className="space-y-4">
//             <button
//               onClick={connectGmail}
//               className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-4 px-6 rounded-xl border border-blue-700 transition duration-200 flex items-center justify-center gap-3 text-base shadow-lg"
//             >
//               <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
//                 <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-5.318V11.73L12 16.64l-5.045-4.91v9.273H1.636A1.636 1.636 0 010 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z" />
//               </svg>
//               Connect Gmail Account
//             </button>
//             <div className="text-center text-gray-500 text-sm">
//               <p>You'll be redirected to Google to authorize access</p>
//             </div>
//           </div>
//         ) : (
//           <div className="space-y-4">
//             <button
//               onClick={fetchAuthUrl}
//               disabled={loading}
//               className="w-full bg-gray-700 hover:bg-gray-800 text-white font-semibold py-4 px-6 rounded-xl border border-gray-800 transition duration-200 disabled:opacity-50 text-base shadow-md"
//             >
//               {loading ? (
//                 <div className="flex items-center justify-center gap-3">
//                   <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
//                   <span>Connecting...</span>
//                 </div>
//               ) : (
//                 "Get Connection Link"
//               )}
//             </button>
//             <button
//               onClick={checkAuthStatus}
//               className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-6 rounded-lg border border-gray-300 transition duration-200 text-sm"
//             >
//               ↻ Check Status Again
//             </button>
//           </div>
//         )}
//       </div>
//     );
//   }

//   // ============= MAIN UI - AUTHENTICATED =============
//   return (
//     <div className="p-6 bg-gray-50 min-h-screen">
//       <ToastContainer position="top-right" autoClose={3000} />

//       {/* Compose Email Dialog */}
//       <Dialog open={showCompose} onOpenChange={setShowCompose}>
//         <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-lg shadow-xl">
//           <DialogHeader className="border-b border-gray-200 pb-4">
//             <DialogTitle className="flex items-center gap-2 text-gray-800 text-xl font-semibold">
//               {composeMode === "reply"
//                 ? "↩️ Reply"
//                 : composeMode === "forward"
//                   ? "↪️ Forward"
//                   : "✉️ Compose Email"}
//             </DialogTitle>
//           </DialogHeader>

//           <div className="space-y-4 mt-4">
//             {emailSuggestions.length > 0 && (
//               <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
//                 <p className="text-sm font-medium text-blue-800 mb-2">
//                   Email Suggestions:
//                 </p>
//                 <div className="space-y-1">
//                   {emailSuggestions.map((suggestion, index) => (
//                     <button
//                       key={index}
//                       onClick={() => {
//                         setComposeData((prev) => ({ ...prev, to: suggestion }));
//                         setEmailSuggestions([]);
//                       }}
//                       className="w-full text-left p-2 hover:bg-blue-100 rounded text-sm text-blue-700 flex items-center gap-2"
//                     >
//                       <svg
//                         className="w-4 h-4"
//                         fill="none"
//                         stroke="currentColor"
//                         viewBox="0 0 24 24"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth={2}
//                           d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
//                         />
//                       </svg>
//                       {suggestion}
//                     </button>
//                   ))}
//                 </div>
//               </div>
//             )}

//             <div className="grid grid-cols-1 gap-4">
//               <div className="flex items-center border-b border-gray-200 pb-2">
//                 <label className="w-16 text-sm font-medium text-gray-700">
//                   To*
//                 </label>
//                 <input
//                   type="email"
//                   value={composeData.to}
//                   onChange={(e) =>
//                     setComposeData((prev) => ({ ...prev, to: e.target.value }))
//                   }
//                   className="flex-1 p-2 border-none focus:ring-0 focus:outline-none text-gray-800 placeholder-gray-400"
//                   placeholder="Enter recipient email addresses (comma separated)"
//                   multiple
//                 />
//               </div>

//               <div className="flex items-center border-b border-gray-200 pb-2">
//                 <label className="w-16 text-sm font-medium text-gray-700">
//                   Cc
//                 </label>
//                 <input
//                   type="email"
//                   value={composeData.cc}
//                   onChange={(e) =>
//                     setComposeData((prev) => ({ ...prev, cc: e.target.value }))
//                   }
//                   className="flex-1 p-2 border-none focus:ring-0 focus:outline-none text-gray-800 placeholder-gray-400"
//                   placeholder="Cc email addresses (optional)"
//                   multiple
//                 />
//               </div>

//               <div className="flex items-center border-b border-gray-200 pb-2">
//                 <label className="w-16 text-sm font-medium text-gray-700">
//                   Bcc
//                 </label>
//                 <input
//                   type="email"
//                   value={composeData.bcc}
//                   onChange={(e) =>
//                     setComposeData((prev) => ({ ...prev, bcc: e.target.value }))
//                   }
//                   className="flex-1 p-2 border-none focus:ring-0 focus:outline-none text-gray-800 placeholder-gray-400"
//                   placeholder="Bcc email addresses (optional)"
//                   multiple
//                 />
//               </div>

//               <div className="flex items-center border-b border-gray-200 pb-2">
//                 <label className="w-16 text-sm font-medium text-gray-700">
//                   Subject
//                 </label>
//                 <input
//                   type="text"
//                   value={composeData.subject}
//                   onChange={(e) =>
//                     setComposeData((prev) => ({
//                       ...prev,
//                       subject: e.target.value,
//                     }))
//                   }
//                   className="flex-1 p-2 border-none focus:ring-0 focus:outline-none text-gray-800 placeholder-gray-400"
//                   placeholder="Email subject (optional)"
//                 />
//               </div>
//             </div>

//             {/* File Attachments */}
//             <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
//               <div className="flex items-center justify-between mb-3">
//                 <div>
//                   <label className="text-sm font-medium text-gray-700">
//                     Attachments
//                   </label>
//                   <p className="text-xs text-gray-500 mt-1">
//                     Max 30MB per file • Supports images, PDFs, audio, video,
//                     documents
//                   </p>
//                 </div>
//                 <button
//                   onClick={triggerFileInput}
//                   className="text-sm bg-gray-600 text-white px-3 py-2 rounded-lg hover:bg-gray-700 transition duration-200 flex items-center gap-2 text-xs"
//                 >
//                   <svg
//                     className="w-4 h-4"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M12 6v6m0 0v6m0-6h6m-6 0H6"
//                     />
//                   </svg>
//                   Add Files
//                 </button>
//                 <input
//                   ref={fileInputRef}
//                   type="file"
//                   multiple
//                   onChange={handleFileSelect}
//                   className="hidden"
//                   accept="*/*"
//                 />
//               </div>

//               {selectedFiles.length > 0 && (
//                 <div className="space-y-2">
//                   {selectedFiles.map((file, index) => (
//                     <div
//                       key={index}
//                       className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 shadow-sm"
//                     >
//                       <div className="flex items-center gap-3 flex-1">
//                         <span className="text-lg">{getFileIcon(file)}</span>
//                         <div className="flex-1 min-w-0">
//                           <p className="text-sm font-medium text-gray-700 truncate">
//                             {file.name}
//                           </p>
//                           <p className="text-xs text-gray-500">
//                             {formatFileSize(file.size)}
//                           </p>
//                         </div>
//                       </div>
//                       <button
//                         onClick={() => removeFile(index)}
//                         className="ml-2 text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition duration-200"
//                       >
//                         <svg
//                           className="w-4 h-4"
//                           fill="none"
//                           stroke="currentColor"
//                           viewBox="0 0 24 24"
//                         >
//                           <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             strokeWidth={2}
//                             d="M6 18L18 6M6 6l12 12"
//                           />
//                         </svg>
//                       </button>
//                     </div>
//                   ))}
//                 </div>
//               )}

//               {selectedFiles.length === 0 && (
//                 <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
//                   <svg
//                     className="w-12 h-12 text-gray-400 mx-auto mb-3"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
//                     />
//                   </svg>
//                   <p className="text-sm text-gray-600">
//                     Drag and drop files here or click "Add Files"
//                   </p>
//                   <p className="text-xs text-gray-500 mt-1">
//                     Maximum file size: 30MB each
//                   </p>
//                 </div>
//               )}
//             </div>

//             <div className="border border-gray-300 rounded-lg overflow-hidden shadow-sm">
//               <textarea
//                 value={composeData.message}
//                 onChange={(e) =>
//                   setComposeData((prev) => ({
//                     ...prev,
//                     message: e.target.value,
//                   }))
//                 }
//                 rows="12"
//                 className="w-full p-4 border-none focus:ring-0 focus:outline-none resize-none text-gray-800 font-sans placeholder-gray-400"
//                 placeholder="Write your message here... (Optional)"
//               />
//             </div>
//           </div>

//           {sending && sendingProgress > 0 && (
//             <div className="mt-4">
//               <div className="flex justify-between text-sm text-gray-600 mb-1">
//                 <span>Sending email...</span>
//                 <span>{sendingProgress}%</span>
//               </div>
//               <div className="w-full bg-gray-200 rounded-full h-2">
//                 <div
//                   className="bg-green-600 h-2 rounded-full transition-all duration-300"
//                   style={{ width: `${sendingProgress}%` }}
//                 ></div>
//               </div>
//             </div>
//           )}

//           <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
//             <div className="flex gap-2">
//               <button
//                 onClick={clearCompose}
//                 className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2 transition duration-200 text-sm"
//               >
//                 <svg
//                   className="w-4 h-4"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
//                   />
//                 </svg>
//                 Clear
//               </button>
//               <button
//                 onClick={saveAsDraft}
//                 disabled={savingDraft || !composeData.to.trim()}
//                 className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-300 disabled:opacity-50 flex items-center gap-2 transition duration-200 text-sm"
//               >
//                 {savingDraft ? (
//                   <>
//                     <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-gray-700"></div>
//                     Saving...
//                   </>
//                 ) : (
//                   <>
//                     <svg
//                       className="w-4 h-4"
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={2}
//                         d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
//                       />
//                     </svg>
//                     Save Draft
//                   </>
//                 )}
//               </button>
//             </div>

//             <div className="flex gap-3">
//               <button
//                 onClick={() => setShowCompose(false)}
//                 className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition duration-200 text-sm"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={sendEmail}
//                 disabled={sending || !composeData.to.trim()}
//                 className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg border border-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition duration-200 text-sm shadow-sm"
//               >
//                 {sending ? (
//                   <>
//                     <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
//                     Sending...
//                   </>
//                 ) : (
//                   <>
//                     <svg
//                       className="w-4 h-4"
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={2}
//                         d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
//                       />
//                     </svg>
//                     Send Now
//                   </>
//                 )}
//               </button>
//             </div>
//           </div>
//         </DialogContent>
//       </Dialog>

//       {/* Delete Confirmation Dialog */}
//       <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
//         <DialogContent className="bg-white rounded-lg shadow-xl max-w-md">
//           <DialogHeader>
//             <DialogTitle className="flex items-center gap-2 text-gray-800 text-lg font-semibold">
//               {threadToDelete?.permanent ? (
//                 <>
//                   <svg
//                     className="w-5 h-5 text-red-600"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
//                     />
//                   </svg>
//                   Permanently Delete
//                 </>
//               ) : (
//                 <>
//                   <svg
//                     className="w-5 h-5 text-orange-600"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
//                     />
//                   </svg>
//                   Move to Trash
//                 </>
//               )}
//             </DialogTitle>
//           </DialogHeader>
//           <p className="mb-6 text-gray-700">
//             {threadToDelete?.permanent
//               ? "Are you sure you want to permanently delete this thread? This action cannot be undone and the emails will be lost forever."
//               : "Move this thread to trash? You can restore it later from the trash folder."}
//           </p>
//           <div className="flex justify-end gap-3">
//             <button
//               onClick={() => {
//                 setShowDeleteModal(false);
//                 setThreadToDelete(null);
//               }}
//               className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 text-gray-700 transition duration-200 text-sm"
//             >
//               Cancel
//             </button>
//             <button
//               onClick={() =>
//                 deleteThread(threadToDelete.id, threadToDelete.permanent)
//               }
//               className={`px-4 py-2 rounded-lg text-white flex items-center gap-2 transition duration-200 text-sm ${
//                 threadToDelete?.permanent
//                   ? "bg-red-600 hover:bg-red-700 border border-red-700"
//                   : "bg-orange-500 hover:bg-orange-600 border border-orange-600"
//               }`}
//             >
//               <svg
//                 className="w-4 h-4"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
//                 />
//               </svg>
//               {threadToDelete?.permanent
//                 ? "Delete Permanently"
//                 : "Move to Trash"}
//             </button>
//           </div>
//         </DialogContent>
//       </Dialog>

//       {/* Main Content */}
//       <div className="grid gap-6 grid-cols-1 lg:grid-cols-4">
//         {/* Sidebar */}
//         <div className="lg:col-span-1 space-y-4">
//           {/* Compose Button */}
//           <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
//             <button
//               onClick={() => {
//                 setComposeMode("new");
//                 setShowCompose(true);
//               }}
//               className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium py-3 px-4 rounded-lg shadow transition duration-200 flex items-center justify-center gap-2"
//             >
//               <svg
//                 className="w-5 h-5"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
//                 />
//               </svg>
//               Compose
//             </button>
//           </div>

//           {/* Labels/Navigation - WITH REAL COUNTS */}
//           <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
//             <h3 className="text-sm font-semibold text-gray-700 mb-3">MAIL</h3>
//             <div className="space-y-1">
//               {labelOptions.map((label) => (
//                 <button
//                   key={label.id}
//                   onClick={() => handleLabelClick(label)}
//                   className={`w-full flex items-center justify-between p-3 rounded-lg transition duration-200 text-sm ${
//                     activeLabel === label.id
//                       ? "bg-blue-50 text-blue-600 border border-blue-200"
//                       : "text-gray-600 hover:bg-gray-50"
//                   }`}
//                 >
//                   <div className="flex items-center gap-2">
//                     <span className="text-base">{label.icon}</span>
//                     <span>{label.name}</span>
//                   </div>
//                   {label.count > 0 && (
//                     <span
//                       className={`px-2 py-1 rounded-full text-xs font-bold ${
//                         activeLabel === label.id
//                           ? "bg-blue-100 text-blue-600"
//                           : "bg-gray-100 text-gray-600"
//                       }`}
//                     >
//                       {label.count.toLocaleString()}
//                     </span>
//                   )}
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* User Info */}
//           <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
//             <div className="flex items-center gap-3">
//               <div className="w-10 h-10 bg-gradient-to-br from-gray-600 to-gray-800 rounded-full flex items-center justify-center text-white font-semibold text-sm">
//                 {userEmail?.charAt(0).toUpperCase()}
//               </div>
//               <div className="flex-1 min-w-0">
//                 <p className="text-sm font-medium text-gray-800 truncate">
//                   {userEmail}
//                 </p>
//                 <p className="text-xs text-gray-500 truncate">
//                   {totalEmailsCache[activeLabel]?.toLocaleString() || 0} emails
//                 </p>
//               </div>
//             </div>
//             <button
//               onClick={disconnectGmail}
//               className="w-full mt-3 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition duration-200 flex items-center justify-center gap-2"
//             >
//               <svg
//                 className="w-4 h-4"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
//                 />
//               </svg>
//               Disconnect Gmail
//             </button>
//           </div>
//         </div>

//         {/* Main Content Area */}
//         <div className="lg:col-span-3">
//           {/* Header */}
//           <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6 shadow-sm">
//             <div className="flex justify-between items-center mb-4">
//               <div className="flex items-center gap-4">
//                 {selectedThread && (
//                   <button
//                     onClick={handleBackToList}
//                     className="bg-gray-100 hover:bg-gray-200 text-gray-700 p-2 rounded-lg border border-gray-300 transition duration-200 flex items-center gap-2"
//                   >
//                     <svg
//                       className="w-4 h-4"
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={2}
//                         d="M10 19l-7-7m0 0l7-7m-7 7h18"
//                       />
//                     </svg>
//                     Back
//                   </button>
//                 )}
//                 <div>
//                   <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
//                     {selectedThread
//                       ? "📧 Email"
//                       : activeLabel === "INBOX"
//                         ? "📥 Inbox"
//                         : activeLabel === "UNREAD"
//                           ? "📨 Unread"
//                           : activeLabel === "STARRED"
//                             ? "⭐ Starred"
//                             : activeLabel === "IMPORTANT"
//                               ? "❗ Important"
//                               : activeLabel === "DRAFTS"
//                                 ? "📝 Drafts"
//                                 : activeLabel === "SENT"
//                                   ? "📤 Sent"
//                                   : activeLabel === "SPAM"
//                                     ? "🚫 Spam"
//                                     : activeLabel === "TRASH"
//                                       ? "🗑️ Trash"
//                                       : "📧 Gmail"}
//                   </h2>
//                   {userEmail && (
//                     <p className="text-sm text-gray-600 mt-1 flex items-center gap-2">
//                       <span className="w-2 h-2 bg-green-500 rounded-full"></span>
//                       Connected as: {userEmail}
//                       {actualCounts.UNREAD > 0 &&
//                         !selectedThread &&
//                         activeLabel === "INBOX" && (
//                           <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
//                             {actualCounts.UNREAD} unread
//                           </span>
//                         )}
//                     </p>
//                   )}
//                 </div>
//               </div>

//               <div className="flex items-center gap-2">
//                 <button
//                   onClick={() => setShowCompose(true)}
//                   className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg border border-blue-600 transition duration-200 flex items-center gap-2 text-sm shadow-sm"
//                 >
//                   <svg
//                     className="w-4 h-4"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
//                     />
//                   </svg>
//                   Compose
//                 </button>

//                 <button
//                   onClick={() => fetchThreads(activeLabel, false, true)}
//                   disabled={loading && loadingLabel === activeLabel}
//                   className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg border border-gray-700 transition duration-200 disabled:opacity-50 flex items-center gap-2 text-sm"
//                 >
//                   <svg
//                     className="w-4 h-4"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
//                     />
//                   </svg>
//                   {loading && loadingLabel === activeLabel
//                     ? "Refreshing..."
//                     : "Refresh"}
//                 </button>
//               </div>
//             </div>

//             {/* Bulk Actions Bar */}
//             {showBulkActions && !selectedThread && (
//               <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between">
//                 <div className="flex items-center gap-3">
//                   <span className="text-sm font-medium text-blue-800">
//                     {selectedThreads.size} selected
//                   </span>
//                   <div className="flex gap-2">
//                     <button
//                       onClick={() => handleBulkAction("read", true)}
//                       className="text-xs bg-white text-blue-600 px-3 py-1 rounded border border-blue-300 hover:bg-blue-50 flex items-center gap-1"
//                     >
//                       <svg
//                         className="w-3 h-3"
//                         fill="none"
//                         stroke="currentColor"
//                         viewBox="0 0 24 24"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth={2}
//                           d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
//                         />
//                       </svg>
//                       Mark as Read
//                     </button>
//                     <button
//                       onClick={() => handleBulkAction("star", true)}
//                       className="text-xs bg-white text-yellow-600 px-3 py-1 rounded border border-yellow-300 hover:bg-yellow-50 flex items-center gap-1"
//                     >
//                       <svg
//                         className="w-3 h-3"
//                         fill="none"
//                         stroke="currentColor"
//                         viewBox="0 0 24 24"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth={2}
//                           d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
//                         />
//                       </svg>
//                       Star
//                     </button>
//                     <button
//                       onClick={() => handleBulkAction("trash")}
//                       className="text-xs bg-white text-orange-600 px-3 py-1 rounded border border-orange-300 hover:bg-orange-50 flex items-center gap-1"
//                     >
//                       <svg
//                         className="w-3 h-3"
//                         fill="none"
//                         stroke="currentColor"
//                         viewBox="0 0 24 24"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth={2}
//                           d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
//                         />
//                       </svg>
//                       Move to Trash
//                     </button>
//                     {activeLabel === "TRASH" && (
//                       <button
//                         onClick={() => handleBulkAction("delete")}
//                         className="text-xs bg-white text-red-600 px-3 py-1 rounded border border-red-300 hover:bg-red-50 flex items-center gap-1"
//                       >
//                         <svg
//                           className="w-3 h-3"
//                           fill="none"
//                           stroke="currentColor"
//                           viewBox="0 0 24 24"
//                         >
//                           <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             strokeWidth={2}
//                             d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
//                           />
//                         </svg>
//                         Delete
//                       </button>
//                     )}
//                   </div>
//                 </div>
//                 <button
//                   onClick={() => {
//                     setSelectedThreads(new Set());
//                     setShowBulkActions(false);
//                     setIsSelectAll(false);
//                   }}
//                   className="text-xs text-gray-500 hover:text-gray-700"
//                 >
//                   Clear selection
//                 </button>
//               </div>
//             )}

//             {/* Search and Filter Bar */}
//             {!selectedThread && (
//               <div className="flex gap-4 mt-4">
//                 <div className="flex-1">
//                   <div className="relative">
//                     <input
//                       type="text"
//                       value={searchQuery}
//                       onChange={(e) => setSearchQuery(e.target.value)}
//                       placeholder={`Search emails in ${activeLabel.toLowerCase()}...`}
//                       className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 shadow-sm"
//                     />
//                     <svg
//                       className="w-5 h-5 text-gray-400 absolute left-3 top-3"
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={2}
//                         d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
//                       />
//                     </svg>
//                   </div>
//                 </div>
//                 {activeLabel === "INBOX" && (
//                   <button
//                     onClick={() => setFilterUnread(!filterUnread)}
//                     className={`px-4 py-3 rounded-lg border transition duration-200 flex items-center gap-2 text-sm ${
//                       filterUnread
//                         ? "bg-gray-800 text-white border-gray-900"
//                         : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
//                     }`}
//                   >
//                     <svg
//                       className="w-4 h-4"
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={2}
//                         d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
//                       />
//                     </svg>
//                     Unread Only
//                   </button>
//                 )}
//               </div>
//             )}
//           </div>

//           {error && (
//             <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">
//               {error}
//             </div>
//           )}

//           {/* Email List OR Email Detail */}
//           {!selectedThread ? (
//             /* Email List View */
//             <div className="bg-white p-6 rounded-lg border border-gray-200 min-h-[60vh] overflow-y-auto shadow-sm">
//               <div className="flex justify-between items-center mb-6">
//                 <div className="flex items-center gap-4">
//                   <div className="flex items-center">
//                     {filteredThreads.length > 0 && (
//                       <input
//                         type="checkbox"
//                         checked={isSelectAll}
//                         onChange={selectAllThreads}
//                         className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mr-3"
//                       />
//                     )}
//                     <h3 className="text-xl font-semibold text-gray-800">
//                       {activeLabel === "INBOX"
//                         ? "Inbox"
//                         : activeLabel === "UNREAD"
//                           ? "Unread"
//                           : activeLabel === "STARRED"
//                             ? "Starred"
//                             : activeLabel === "IMPORTANT"
//                               ? "Important"
//                               : activeLabel === "DRAFTS"
//                                 ? "Drafts"
//                                 : activeLabel === "SENT"
//                                   ? "Sent"
//                                   : activeLabel === "SPAM"
//                                     ? "Spam"
//                                     : activeLabel === "TRASH"
//                                       ? "Trash"
//                                       : "Emails"}
//                       <span className="ml-2 text-sm font-normal text-gray-500">
//                         ({filteredThreads.length} of{" "}
//                         {totalEmailsCache[activeLabel] || 0})
//                       </span>
//                     </h3>
//                   </div>
//                 </div>
//                 {nextPageTokenCache[activeLabel] &&
//                   filteredThreads.length > 0 && (
//                     <button
//                       onClick={() => fetchThreads(activeLabel, true)}
//                       disabled={loading && loadingLabel === activeLabel}
//                       className="text-sm bg-blue-600 text-white px-4 py-2 rounded-lg border border-blue-700 hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2 transition duration-200 shadow-sm"
//                     >
//                       {loading && loadingLabel === activeLabel ? (
//                         <>
//                           <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
//                           Loading...
//                         </>
//                       ) : (
//                         <>
//                           <svg
//                             className="w-4 h-4"
//                             fill="none"
//                             stroke="currentColor"
//                             viewBox="0 0 24 24"
//                           >
//                             <path
//                               strokeLinecap="round"
//                               strokeLinejoin="round"
//                               strokeWidth={2}
//                               d="M12 6v6m0 0v6m0-6h6m-6 0H6"
//                             />
//                           </svg>
//                           Load More
//                         </>
//                       )}
//                     </button>
//                   )}
//               </div>

//               {loading &&
//               loadingLabel === activeLabel &&
//               currentThreads.length === 0 ? (
//                 <div className="text-center text-gray-500 py-12">
//                   <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
//                   <p className="text-lg">Loading your emails...</p>
//                 </div>
//               ) : filteredThreads.length === 0 ? (
//                 <div className="text-center text-gray-500 py-12">
//                   <svg
//                     className="w-16 h-16 mx-auto text-gray-300 mb-4"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
//                     />
//                   </svg>
//                   <h3 className="text-xl font-semibold text-gray-700 mb-2">
//                     {searchQuery || filterUnread
//                       ? "No emails match your search"
//                       : "No emails found"}
//                   </h3>
//                   <p className="text-gray-500 max-w-md mx-auto">
//                     {searchQuery || filterUnread
//                       ? "Try adjusting your search terms or filters"
//                       : activeLabel === "INBOX"
//                         ? "Your inbox is empty. Send or receive some emails!"
//                         : `No emails in ${activeLabel.toLowerCase()} folder`}
//                   </p>
//                 </div>
//               ) : (
//                 <div className="space-y-3">
//                   {filteredThreads.map((thread) => (
//                     <div
//                       key={thread.id}
//                       className={`p-6 rounded-xl cursor-pointer transition-all duration-200 border-2 ${
//                         selectedThread === thread.id
//                           ? "bg-blue-50 border-blue-300 shadow-md"
//                           : "bg-white hover:bg-gray-50 border-gray-200 hover:border-gray-300 shadow-sm hover:shadow"
//                       } ${thread.unread && activeLabel === "INBOX" ? "border-l-4 border-l-blue-500" : ""}`}
//                       onClick={() => loadThread(thread.id)}
//                     >
//                       <div className="flex justify-between items-start">
//                         <div className="flex-1 min-w-0">
//                           <div className="flex items-start gap-3 mb-3">
//                             <div
//                               className="flex items-center mt-1"
//                               onClick={(e) => e.stopPropagation()}
//                             >
//                               <input
//                                 type="checkbox"
//                                 checked={selectedThreads.has(thread.id)}
//                                 onChange={() =>
//                                   toggleThreadSelection(thread.id)
//                                 }
//                                 className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
//                                 onClick={(e) => e.stopPropagation()}
//                               />
//                             </div>
//                             <div className="flex-1 min-w-0">
//                               <div className="flex items-center gap-3 mb-2">
//                                 <span className="text-xl">
//                                   {renderLabelIcon(thread)}
//                                 </span>
//                                 {thread.unread && activeLabel === "INBOX" && (
//                                   <span className="w-3 h-3 bg-blue-500 rounded-full flex-shrink-0"></span>
//                                 )}
//                                 <h4 className="font-bold text-gray-900 text-lg truncate">
//                                   {thread.subject || "No Subject"}
//                                 </h4>
//                               </div>
//                               <div className="flex items-center gap-4 mb-3">
//                                 <p className="text-sm text-gray-700 font-medium">
//                                   <span className="text-gray-500">From:</span>{" "}
//                                   {extractNameFromEmail(thread.from)}
//                                 </p>
//                                 <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full font-medium">
//                                   {thread.messagesCount}{" "}
//                                   {thread.messagesCount === 1
//                                     ? "message"
//                                     : "messages"}
//                                 </span>
//                               </div>
//                               <p className="text-gray-600 mb-4 line-clamp-2">
//                                 {thread.snippet || "No preview available"}
//                               </p>
//                               <div className="flex justify-between items-center">
//                                 <span className="text-sm text-gray-500 font-medium">
//                                   {formatDateTime(thread.date)}
//                                 </span>
//                                 <div className="flex items-center gap-3">
//                                   <button
//                                     onClick={(e) => {
//                                       e.stopPropagation();
//                                       markThreadAs(
//                                         thread.id,
//                                         "star",
//                                         !thread.starred,
//                                       );
//                                     }}
//                                     className={`p-2 rounded-full transition duration-200 ${
//                                       thread.starred
//                                         ? "text-yellow-500 hover:text-yellow-600 bg-yellow-50"
//                                         : "text-gray-400 hover:text-yellow-500 hover:bg-gray-100"
//                                     }`}
//                                     title={thread.starred ? "Unstar" : "Star"}
//                                   >
//                                     <svg
//                                       className="w-5 h-5"
//                                       fill="none"
//                                       stroke="currentColor"
//                                       viewBox="0 0 24 24"
//                                     >
//                                       <path
//                                         strokeLinecap="round"
//                                         strokeLinejoin="round"
//                                         strokeWidth={2}
//                                         d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
//                                       />
//                                     </svg>
//                                   </button>
//                                   <button
//                                     onClick={(e) => {
//                                       e.stopPropagation();
//                                       confirmDeleteThread(
//                                         thread.id,
//                                         activeLabel === "TRASH",
//                                       );
//                                     }}
//                                     className="text-red-400 hover:text-red-600 transition duration-200 p-2 rounded-full hover:bg-red-50"
//                                     title={
//                                       activeLabel === "TRASH"
//                                         ? "Delete permanently"
//                                         : "Move to trash"
//                                     }
//                                   >
//                                     <svg
//                                       className="w-5 h-5"
//                                       fill="none"
//                                       stroke="currentColor"
//                                       viewBox="0 0 24 24"
//                                     >
//                                       <path
//                                         strokeLinecap="round"
//                                         strokeLinejoin="round"
//                                         strokeWidth={2}
//                                         d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
//                                       />
//                                     </svg>
//                                   </button>
//                                 </div>
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}

//               {/* Load More Button */}
//               {nextPageTokenCache[activeLabel] &&
//                 filteredThreads.length > 0 && (
//                   <div className="mt-8 text-center">
//                     <button
//                       onClick={() => fetchThreads(activeLabel, true)}
//                       disabled={loading && loadingLabel === activeLabel}
//                       className="inline-flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg border border-blue-700 hover:border-blue-800 transition duration-200 shadow-md hover:shadow-lg"
//                     >
//                       {loading && loadingLabel === activeLabel ? (
//                         <>
//                           <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
//                           Loading more emails...
//                         </>
//                       ) : (
//                         <>
//                           <svg
//                             className="w-5 h-5"
//                             fill="none"
//                             stroke="currentColor"
//                             viewBox="0 0 24 24"
//                           >
//                             <path
//                               strokeLinecap="round"
//                               strokeLinejoin="round"
//                               strokeWidth={2}
//                               d="M12 6v6m0 0v6m0-6h6m-6 0H6"
//                             />
//                           </svg>
//                           Load More Emails
//                         </>
//                       )}
//                     </button>
//                   </div>
//                 )}
//             </div>
//           ) : (
//             /* Email Detail View */
//             <div className="bg-white rounded-xl border border-gray-200 shadow-sm min-h-[60vh] overflow-y-auto">
//               {messages.length === 0 ? (
//                 <div className="text-center text-gray-500 py-12">
//                   <svg
//                     className="w-16 h-16 mx-auto text-gray-300 mb-4"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
//                     />
//                   </svg>
//                   <h3 className="text-xl font-semibold text-gray-700 mb-2">
//                     No messages
//                   </h3>
//                   <p className="text-gray-500">This thread has no messages</p>
//                 </div>
//               ) : (
//                 <>
//                   <div className="sticky top-0 bg-white border-b border-gray-200 p-6 z-10 shadow-sm">
//                     <div className="flex justify-between items-center">
//                       <div>
//                         <h3 className="text-2xl font-bold text-gray-900 mb-1">
//                           {messages[0]?.subject || "Conversation"}
//                         </h3>
//                         <p className="text-sm text-gray-600">
//                           {messages.length} message
//                           {messages.length !== 1 ? "s" : ""} in conversation
//                         </p>
//                       </div>
//                       <div className="flex gap-2">
//                         <button
//                           onClick={() =>
//                             openComposeForReply(messages[0], "reply")
//                           }
//                           className="text-sm bg-blue-600 text-white px-4 py-2.5 rounded-lg border border-blue-700 hover:bg-blue-700 flex items-center gap-2 transition duration-200 shadow-sm"
//                         >
//                           <svg
//                             className="w-4 h-4"
//                             fill="none"
//                             stroke="currentColor"
//                             viewBox="0 0 24 24"
//                           >
//                             <path
//                               strokeLinecap="round"
//                               strokeLinejoin="round"
//                               strokeWidth={2}
//                               d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
//                             />
//                           </svg>
//                           Reply
//                         </button>
//                         <button
//                           onClick={() =>
//                             openComposeForReply(messages[0], "forward")
//                           }
//                           className="text-sm bg-gray-200 text-gray-700 px-4 py-2.5 rounded-lg border border-gray-300 hover:bg-gray-300 flex items-center gap-2 transition duration-200"
//                         >
//                           <svg
//                             className="w-4 h-4"
//                             fill="none"
//                             stroke="currentColor"
//                             viewBox="0 0 24 24"
//                           >
//                             <path
//                               strokeLinecap="round"
//                               strokeLinejoin="round"
//                               strokeWidth={2}
//                               d="M14 5l7 7m0 0l-7 7m7-7H3"
//                             />
//                           </svg>
//                           Forward
//                         </button>
//                         <button
//                           onClick={() =>
//                             confirmDeleteThread(
//                               selectedThread,
//                               activeLabel === "TRASH",
//                             )
//                           }
//                           className="text-sm bg-red-600 text-white px-4 py-2.5 rounded-lg border border-red-700 hover:bg-red-700 flex items-center gap-2 transition duration-200"
//                           title={
//                             activeLabel === "TRASH"
//                               ? "Delete permanently"
//                               : "Move to trash"
//                           }
//                         >
//                           <svg
//                             className="w-4 h-4"
//                             fill="none"
//                             stroke="currentColor"
//                             viewBox="0 0 24 24"
//                           >
//                             <path
//                               strokeLinecap="round"
//                               strokeLinejoin="round"
//                               strokeWidth={2}
//                               d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
//                             />
//                           </svg>
//                         </button>
//                       </div>
//                     </div>
//                   </div>

//                   <div className="p-8 space-y-8">
//                     {messages.map((msg, i) => (
//                       <div
//                         key={msg.id}
//                         className="p-8 border-2 border-gray-200 rounded-xl hover:bg-gray-50 transition duration-200 shadow-sm"
//                       >
//                         <div className="flex justify-between items-start mb-6">
//                           <div className="flex-1">
//                             <div className="flex items-center gap-4 mb-4">
//                               <div className="w-12 h-12 bg-gradient-to-br from-gray-600 to-gray-800 rounded-full flex items-center justify-center text-white font-semibold text-lg">
//                                 {extractNameFromEmail(msg.from)
//                                   .charAt(0)
//                                   .toUpperCase()}
//                               </div>
//                               <div>
//                                 <h4 className="font-bold text-gray-900 text-xl flex items-center gap-3">
//                                   {extractNameFromEmail(msg.from)}
//                                   <span className="text-sm bg-gray-100 text-gray-600 px-3 py-1.5 rounded-full">
//                                     {renderLabelIcon(msg)}
//                                   </span>
//                                 </h4>
//                                 <p className="text-gray-600">
//                                   {extractEmailAddress(msg.from)}
//                                 </p>
//                               </div>
//                             </div>
//                             <div className="flex flex-wrap gap-6 mt-4">
//                               {msg.to && (
//                                 <p className="text-gray-700">
//                                   <span className="font-medium text-gray-900">
//                                     To:
//                                   </span>{" "}
//                                   {extractNameFromEmail(msg.to)}
//                                 </p>
//                               )}
//                               {msg.cc && (
//                                 <p className="text-gray-700">
//                                   <span className="font-medium text-gray-900">
//                                     Cc:
//                                   </span>{" "}
//                                   {msg.cc}
//                                 </p>
//                               )}
//                             </div>
//                           </div>
//                           <div className="text-right">
//                             <div className="flex gap-3 mb-4 justify-end">
//                               <button
//                                 onClick={() =>
//                                   markThreadAs(
//                                     selectedThread,
//                                     "star",
//                                     !msg.starred,
//                                   )
//                                 }
//                                 className={`p-3 rounded-full ${msg.starred ? "text-yellow-500 bg-yellow-50" : "text-gray-400 hover:text-yellow-500 hover:bg-gray-100"}`}
//                                 title={msg.starred ? "Unstar" : "Star"}
//                               >
//                                 ⭐
//                               </button>
//                               <button
//                                 onClick={() =>
//                                   markThreadAs(
//                                     selectedThread,
//                                     "important",
//                                     !msg.important,
//                                   )
//                                 }
//                                 className={`p-3 rounded-full ${msg.important ? "text-red-500 bg-red-50" : "text-gray-400 hover:text-red-500 hover:bg-gray-100"}`}
//                                 title={
//                                   msg.important
//                                     ? "Mark as not important"
//                                     : "Mark as important"
//                                 }
//                               >
//                                 ❗
//                               </button>
//                             </div>
//                             <span className="text-sm text-gray-500 bg-gray-100 px-4 py-2 rounded-full font-medium">
//                               Message {i + 1} of {messages.length}
//                             </span>
//                             <p className="text-gray-400 mt-3 font-medium">
//                               {formatDateTime(msg.date)}
//                             </p>
//                           </div>
//                         </div>

//                         {/* Attachments */}
//                         {msg.hasAttachments &&
//                           msg.attachments &&
//                           msg.attachments.length > 0 && (
//                             <div className="mb-6 p-6 bg-gray-50 rounded-xl border border-gray-200">
//                               <h5 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-3">
//                                 <svg
//                                   className="w-5 h-5"
//                                   fill="none"
//                                   stroke="currentColor"
//                                   viewBox="0 0 24 24"
//                                 >
//                                   <path
//                                     strokeLinecap="round"
//                                     strokeLinejoin="round"
//                                     strokeWidth={2}
//                                     d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
//                                   />
//                                 </svg>
//                                 Attachments ({msg.attachments.length})
//                               </h5>
//                               <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//                                 {msg.attachments.map((attachment, idx) => (
//                                   <div
//                                     key={idx}
//                                     className="flex items-center justify-between p-4 bg-white rounded-lg border hover:bg-gray-50 transition duration-200"
//                                   >
//                                     <div className="flex items-center gap-4 flex-1 min-w-0">
//                                       <span className="text-2xl">
//                                         {getFileIcon({
//                                           type: attachment.mimeType,
//                                           filename: attachment.filename,
//                                         })}
//                                       </span>
//                                       <div className="flex-1 min-w-0">
//                                         <p className="text-base font-medium text-gray-900 truncate">
//                                           {attachment.filename}
//                                         </p>
//                                         <p className="text-sm text-gray-500">
//                                           {formatFileSize(attachment.size)}
//                                         </p>
//                                       </div>
//                                     </div>
//                                     <button
//                                       onClick={() =>
//                                         downloadAttachment(msg.id, attachment)
//                                       }
//                                       className="ml-3 text-blue-600 hover:text-blue-800 text-sm bg-blue-50 px-4 py-2.5 rounded-lg flex items-center gap-2 transition duration-200 hover:bg-blue-100 font-medium"
//                                     >
//                                       <svg
//                                         className="w-4 h-4"
//                                         fill="none"
//                                         stroke="currentColor"
//                                         viewBox="0 0 24 24"
//                                       >
//                                         <path
//                                           strokeLinecap="round"
//                                           strokeLinejoin="round"
//                                           strokeWidth={2}
//                                           d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
//                                         />
//                                       </svg>
//                                       Download
//                                     </button>
//                                   </div>
//                                 ))}
//                               </div>
//                             </div>
//                           )}

//                         <div className="bg-gray-50 p-8 rounded-xl border border-gray-200">
//                           <div className="prose prose-lg max-w-none">
//                             {msg.htmlBody ? (
//                               <div
//                                 className="text-gray-900 leading-relaxed"
//                                 dangerouslySetInnerHTML={{
//                                   __html: msg.htmlBody,
//                                 }}
//                               />
//                             ) : (
//                               <pre className="text-gray-900 whitespace-pre-wrap leading-relaxed font-sans text-base">
//                                 {msg.body || "No content available"}
//                               </pre>
//                             )}
//                           </div>
//                         </div>

//                         <div className="flex justify-end mt-6 space-x-3">
//                           <button
//                             onClick={() => openComposeForReply(msg, "reply")}
//                             className="text-base bg-blue-600 text-white px-5 py-2.5 rounded-lg border border-blue-700 hover:bg-blue-700 flex items-center gap-2 transition duration-200 shadow-sm"
//                           >
//                             <svg
//                               className="w-5 h-5"
//                               fill="none"
//                               stroke="currentColor"
//                               viewBox="0 0 24 24"
//                             >
//                               <path
//                                 strokeLinecap="round"
//                                 strokeLinejoin="round"
//                                 strokeWidth={2}
//                                 d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
//                               />
//                             </svg>
//                             Reply
//                           </button>
//                           <button
//                             onClick={() => openComposeForReply(msg, "replyAll")}
//                             className="text-base bg-gray-200 text-gray-700 px-5 py-2.5 rounded-lg border border-gray-300 hover:bg-gray-300 flex items-center gap-2 transition duration-200"
//                           >
//                             <svg
//                               className="w-5 h-5"
//                               fill="none"
//                               stroke="currentColor"
//                               viewBox="0 0 24 24"
//                             >
//                               <path
//                                 strokeLinecap="round"
//                                 strokeLinejoin="round"
//                                 strokeWidth={2}
//                                 d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
//                               />
//                               <path
//                                 strokeLinecap="round"
//                                 strokeLinejoin="round"
//                                 strokeWidth={2}
//                                 d="M8 14h6"
//                               />
//                             </svg>
//                             Reply All
//                           </button>
//                           <button
//                             onClick={() => openComposeForReply(msg, "forward")}
//                             className="text-base bg-gray-200 text-gray-700 px-5 py-2.5 rounded-lg border border-gray-300 hover:bg-gray-300 flex items-center gap-2 transition duration-200"
//                           >
//                             <svg
//                               className="w-5 h-5"
//                               fill="none"
//                               stroke="currentColor"
//                               viewBox="0 0 24 24"
//                             >
//                               <path
//                                 strokeLinecap="round"
//                                 strokeLinejoin="round"
//                                 strokeWidth={2}
//                                 d="M14 5l7 7m0 0l-7 7m7-7H3"
//                               />
//                             </svg>
//                             Forward
//                           </button>
//                           <button
//                             onClick={() =>
//                               markThreadAs(selectedThread, "trash")
//                             }
//                             className="text-base bg-red-600 text-white px-5 py-2.5 rounded-lg border border-red-700 hover:bg-red-700 flex items-center gap-2 transition duration-200"
//                           >
//                             <svg
//                               className="w-5 h-5"
//                               fill="none"
//                               stroke="currentColor"
//                               viewBox="0 0 24 24"
//                             >
//                               <path
//                                 strokeLinecap="round"
//                                 strokeLinejoin="round"
//                                 strokeWidth={2}
//                                 d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
//                               />
//                             </svg>
//                             Trash
//                           </button>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </>
//               )}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EmailChat;//all emails , send  all come perfect





import React, {
  useEffect,
  useState,
  useRef,
} from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { useSearchParams, useNavigate } from "react-router-dom";

// ============= REACT ICONS - COMPREHENSIVE ICON SET =============
// Font Awesome Icons
import {
  FaInbox,
  FaStar,
  FaExclamationCircle,
  FaFileAlt,
  FaPaperPlane,
  FaExclamationTriangle,
  FaTrash,
  FaEdit,
  FaPlus,
  FaSync,
  FaSearch,
  FaPaperclip,
  FaTimes,
  FaDownload,
  FaReply,
  FaReplyAll,
  FaForward,
  FaArchive,
  FaFlag,
  FaEllipsisV,
  FaCheckCircle,
  FaCircle,
  FaChevronLeft,
  FaUser,
  FaSignOutAlt,
  FaClock,
  FaCalendarAlt,
  FaImage,
  FaFile,
  FaFilePdf,
  FaFileExcel,
  FaFileArchive,
  FaFileAudio,
  FaFileVideo,
  FaFileCode,
  FaSpinner,
  FaEnvelopeOpen,
  FaEnvelope,
  FaMagic,
  FaCog,
  FaBars,
  FaFilter,
  FaCheckDouble,
  FaExclamation,
  FaBookmark,
  FaFolder,
  FaTag,
  FaUsers,
  FaAt,
  FaLink,
  FaSmile,
  FaBold,
  FaItalic,
  FaList,
  FaAlignLeft,
  FaSave,
  FaTrashAlt,
  FaCopy,
  FaExternalLinkAlt,
  FaEllipsisH,
  FaChevronDown,
  FaChevronUp,
  FaChevronRight,
  FaHome,
  FaBell,
  FaQuestionCircle,
  FaShieldAlt,
  FaLock,
  FaUnlock,
  FaEye,
  FaEyeSlash,
  FaSun,
  FaMoon,
  FaGlobe,
  FaPhone,
  FaVideo,
  FaMicrophone,
  FaMapMarkerAlt,
  FaBriefcase,
  FaAward,
  FaHeart,
  FaThumbsUp,
  FaThumbsDown,
  FaComment,
  FaComments,
  FaShareAlt,
  FaPrint,
  FaCloud,
  FaDatabase,
  FaHdd,
  FaMicrochip,
  FaBolt,
  FaWifi,
  FaBatteryFull,
  FaVolumeUp,
  FaVolumeMute,
  FaPlay,
  FaPause,
  FaStepBackward,
  FaStepForward,
  FaRedoAlt,
  FaUndoAlt,
  FaSearchPlus,
  FaSearchMinus,
  FaExpand,
  FaCompress,
  FaSlidersH,
  FaLayerGroup,
  FaTh,
  FaListUl,
  FaCheckSquare,
  FaSquare,
  FaMinusCircle,
  FaPlusCircle,
  FaInfoCircle,
  FaTimesCircle,
  FaCheck,
  FaEnvelope as FaEnvelopeIcon,
  FaPaperPlane as FaPaperPlaneIcon,
} from "react-icons/fa";

// Material Design Icons
import {
  MdInbox,
  MdMail,
  MdStar,
  MdError,
  MdDescription,
  MdSend,
  MdWarning,
  MdDelete,
  MdEdit,
  MdAdd,
  MdRefresh,
  MdSearch,
  MdAttachFile,
  MdClose,
  MdFileDownload,
  MdReply,
  MdReplyAll,
  MdForward,
  MdArchive,
  MdFlag,
  MdMoreVert,
  MdCheckCircle,
  MdRadioButtonUnchecked,
  MdArrowBack,
  MdPerson,
  MdLogout,
  MdAccessTime,
  MdEvent,
  MdImage,
  MdInsertDriveFile,
  MdPictureAsPdf,
  MdTableChart,
  MdFolderZip,
  MdAudiotrack,
  MdVideocam,
  MdCode,
  MdAutorenew,
  MdDrafts,
  MdReport,
  MdLabel,
  MdPeople,
  MdAlternateEmail,
  MdLink,
  MdSentimentSatisfied,
  MdFormatBold,
  MdFormatItalic,
  MdFormatListBulleted,
  MdFormatAlignLeft,
  MdSave,
  MdDeleteOutline,
  MdContentCopy,
  MdOpenInNew,
  MdMoreHoriz,
  MdExpandMore,
  MdExpandLess,
  MdChevronRight,
  MdHome,
  MdNotifications,
  MdHelp,
  MdSecurity,
  MdLock,
  MdLockOpen,
  MdVisibility,
  MdVisibilityOff,
  MdWbSunny,
  MdNightlight,
  MdLanguage,
  MdCall,
  MdVideocam as MdVideocamIcon,
  MdMic,
  MdLocationOn,
  MdWork,
  MdEmojiEvents,
  MdFavorite,
  MdThumbUp,
  MdThumbDown,
  MdChatBubble,
  MdChat,
  MdShare,
  MdPrint,
  MdCloud,
  MdStorage,
  MdMemory,
  MdFlashOn,
  MdNetworkWifi,
  MdBatteryFull,
  MdVolumeUp,
  MdVolumeOff,
  MdPlayArrow,
  MdPause,
  MdSkipPrevious,
  MdSkipNext,
  MdLoop,
  MdZoomIn,
  MdZoomOut,
  MdFullscreen,
  MdFullscreenExit,
  MdTune,
  MdLayers,
  MdGridOn,
  MdViewList,
  MdCheckBox,
  MdCheckBoxOutlineBlank,
  MdIndeterminateCheckBox,
  MdAddCircle,
  MdInfo,
  MdCancel,
  MdCheck,
} from "react-icons/md";

// Choose which icon set you prefer - I'll use Font Awesome for this example
// You can mix and match based on your preference

const EmailChat = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // ============= CACHING LAYER =============
  const [threadsCache, setThreadsCache] = useState(() => {
    try {
      const saved = sessionStorage.getItem("gmail_threads_cache");
      return saved
        ? JSON.parse(saved)
        : {
            INBOX: [],
            UNREAD: [],
            STARRED: [],
            IMPORTANT: [],
            SENT: [],
            SPAM: [],
            TRASH: [],
            DRAFTS: [],
          };
    } catch {
      return {
        INBOX: [],
        UNREAD: [],
        STARRED: [],
        IMPORTANT: [],
        SENT: [],
        SPAM: [],
        TRASH: [],
        DRAFTS: [],
      };
    }
  });

  const [nextPageTokenCache, setNextPageTokenCache] = useState(() => {
    try {
      const saved = sessionStorage.getItem("gmail_page_tokens");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [totalEmailsCache, setTotalEmailsCache] = useState(() => {
    try {
      const saved = sessionStorage.getItem("gmail_total_counts");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // ============= UI STATE =============
  const [messages, setMessages] = useState([]);
  const [selectedThread, setSelectedThread] = useState(null);
  const [authStatus, setAuthStatus] = useState({
    authenticated: false,
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [loadingLabel, setLoadingLabel] = useState(null);
  const [error, setError] = useState("");
  const [authUrl, setAuthUrl] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [showCompose, setShowCompose] = useState(false);
  const [composeData, setComposeData] = useState({
    to: "",
    cc: "",
    bcc: "",
    subject: "",
    message: "",
    attachments: [],
  });
  const [sending, setSending] = useState(false);
  const [savingDraft, setSavingDraft] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDisconnectModal, setShowDisconnectModal] = useState(false);
  const [threadToDelete, setThreadToDelete] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterUnread, setFilterUnread] = useState(false);
  const [activeLabel, setActiveLabel] = useState("INBOX");
  const [labels, setLabels] = useState([]);
  const [composeMode, setComposeMode] = useState("new");
  const [emailSuggestions, setEmailSuggestions] = useState([]);
  const [sendingProgress, setSendingProgress] = useState(0);
  const [selectedThreads, setSelectedThreads] = useState(new Set());
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [isSelectAll, setIsSelectAll] = useState(false);
  const [lastFetchTime, setLastFetchTime] = useState({});
  const [forceUpdate, setForceUpdate] = useState(0);
  const [isRefreshingCounts, setIsRefreshingCounts] = useState(false);

  // ============= ACTUAL GMAIL COUNTS - REAL DATA =============
  const [actualCounts, setActualCounts] = useState({
    INBOX: 0,
    UNREAD: 0,
    STARRED: 0,
    IMPORTANT: 0,
    SENT: 0,
    SPAM: 0,
    TRASH: 0,
    DRAFTS: 0,
  });

  const fileInputRef = useRef(null);
  const initialLoadDone = useRef(false);
  const abortControllerRef = useRef(null);
  const refreshIntervalRef = useRef(null);

  // API Base URL
  const API_BASE_URL =
    import.meta.env.VITE_API_URL || "http://localhost:5000/api";
  const SI_URI = import.meta.env.VITE_SI_URI || "http://localhost:5000";

  // ============= SAVE TO CACHE =============
  useEffect(() => {
    try {
      sessionStorage.setItem(
        "gmail_threads_cache",
        JSON.stringify(threadsCache),
      );
      sessionStorage.setItem(
        "gmail_page_tokens",
        JSON.stringify(nextPageTokenCache),
      );
      sessionStorage.setItem(
        "gmail_total_counts",
        JSON.stringify(totalEmailsCache),
      );
    } catch (e) {
      console.error("Failed to save to sessionStorage:", e);
    }
  }, [threadsCache, nextPageTokenCache, totalEmailsCache]);

  // ============= AUTO REFRESH COUNTS EVERY 30 SECONDS =============
  useEffect(() => {
    if (authStatus.authenticated) {
      fetchAllCountsFast();
      
      refreshIntervalRef.current = setInterval(() => {
        fetchAllCountsFast();
      }, 30000);
    }
    
    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
    };
  }, [authStatus.authenticated]);

  // ============= OAUTH HANDLER =============
  useEffect(() => {
    const gmailConnected = searchParams.get("gmail_connected");
    const gmailError = searchParams.get("gmail_error");
    const errorMsg = searchParams.get("error");

    if (gmailConnected) {
      toast.success("✅ Gmail connected successfully!");
      navigate("/emailchat", { replace: true });
      fetchAllCountsFast();
    }

    if (gmailError) {
      toast.error(`❌ ${errorMsg || "Error connecting Gmail."}`);
      navigate("/emailchat", { replace: true });
    }
  }, [searchParams, navigate]);

  // ============= INITIAL LOAD =============
  useEffect(() => {
    if (!initialLoadDone.current) {
      initialLoadDone.current = true;
      checkAuthStatus();
    }
  }, []);

  // ============= FETCH LABELS AND COUNTS =============
  useEffect(() => {
    if (authStatus.authenticated) {
      fetchLabels();
      fetchAllCountsFast();
    }
  }, [authStatus.authenticated]);

  // ============= DEBOUNCED SUGGESTIONS =============
  useEffect(() => {
    const timer = setTimeout(() => {
      if (composeData.to.length > 2) {
        fetchEmailSuggestions(composeData.to);
      } else {
        setEmailSuggestions([]);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [composeData.to]);

  // ============= OPTIMIZED COUNT FETCH - SINGLE CALL =============
  const fetchAllCountsFast = async () => {
    if (isRefreshingCounts) return;
    
    setIsRefreshingCounts(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/gmail/all-counts`, {
        timeout: 10000,
      });

      if (res.data.success) {
        console.log("📊 REAL Gmail counts received:", res.data.counts);
        setActualCounts(res.data.counts);
        setTotalEmailsCache((prev) => ({
          ...prev,
          ...res.data.counts,
        }));
      }
    } catch (err) {
      console.error("Error fetching counts:", err);
    } finally {
      setIsRefreshingCounts(false);
    }
  };

  // ============= AUTH CHECK =============
  const checkAuthStatus = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/gmail/auth-status`);
      setAuthStatus(res.data);

      if (res.data.authenticated) {
        setUserEmail(res.data.email || "");
        const cachedThreads = sessionStorage.getItem("gmail_threads_cache");
        if (cachedThreads) {
          setThreadsCache(JSON.parse(cachedThreads));
        }
      } else {
        await fetchAuthUrl();
      }
    } catch (err) {
      console.error("Error checking auth status:", err);
      setAuthStatus({
        authenticated: false,
        message: "Error checking authentication status",
      });
      await fetchAuthUrl();
    } finally {
      setLoading(false);
    }
  };

  const fetchAuthUrl = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/gmail/auth-url`);
      if (res.data.success) {
        setAuthUrl(res.data.url);
      } else {
        setError(res.data.error || "Failed to get authentication URL");
      }
    } catch (err) {
      console.error("Error fetching auth URL:", err);
      setError(
        `Failed to connect to server. Make sure the backend is running on ${SI_URI}.`,
      );
    }
  };

  // ============= OPTIMIZED THREAD FETCHING =============
  const fetchThreads = async (
    label = activeLabel,
    loadMore = false,
    forceRefresh = false,
  ) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    setLoading(true);
    setLoadingLabel(label);
    setError("");

    try {
      if (!forceRefresh && !loadMore) {
        const cachedThreads = threadsCache[label];
        const cacheAge = lastFetchTime[label]
          ? Date.now() - lastFetchTime[label]
          : Infinity;

        if (cachedThreads && cachedThreads.length > 0 && cacheAge < 30000) {
          console.log(
            `✅ Using cached threads for ${label} (${cachedThreads.length} threads)`,
          );
          setLoading(false);
          setLoadingLabel(null);
          return;
        }
      }

      const params = {
        maxResults: 20,
        label: label,
      };

      const pageToken = nextPageTokenCache[label];
      if (loadMore && pageToken) {
        params.pageToken = pageToken;
      }

      const res = await axios.get(`${API_BASE_URL}/gmail/threads`, {
        params,
        signal: abortControllerRef.current.signal,
      });

      if (res.data.success) {
        let newThreads = res.data.data || [];

        newThreads.sort((a, b) => {
          const dateA = a.timestamp || new Date(a.date).getTime() || 0;
          const dateB = b.timestamp || new Date(b.date).getTime() || 0;
          return dateB - dateA;
        });

        setThreadsCache((prev) => ({
          ...prev,
          [label]: loadMore
            ? [...(prev[label] || []), ...newThreads]
            : newThreads,
        }));

        setNextPageTokenCache((prev) => ({
          ...prev,
          [label]: res.data.nextPageToken,
        }));

        if (res.data.totalEstimate) {
          setTotalEmailsCache((prev) => ({
            ...prev,
            [label]: res.data.totalEstimate,
          }));

          setActualCounts((prev) => ({
            ...prev,
            [label]: res.data.totalEstimate,
          }));
        }

        setLastFetchTime((prev) => ({
          ...prev,
          [label]: Date.now(),
        }));

        setSelectedThreads(new Set());
        setShowBulkActions(false);
        setIsSelectAll(false);
        setForceUpdate((prev) => prev + 1);
      } else {
        setError(res.data.error || "Failed to fetch emails");
      }
    } catch (err) {
      if (err.name !== "AbortError" && err.code !== "ERR_CANCELED") {
        console.error("Error fetching threads:", err);
        setError(err.response?.data?.error || "Failed to fetch emails");
      }
    } finally {
      setLoading(false);
      setLoadingLabel(null);
    }
  };

  const fetchLabels = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/gmail/labels`);
      if (res.data.success) {
        setLabels(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching labels:", err);
    }
  };

  const fetchDrafts = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/gmail/drafts`, {
        params: { maxResults: 20 },
      });
      if (res.data.success) {
        setThreadsCache((prev) => ({
          ...prev,
          DRAFTS: res.data.data || [],
        }));

        setActualCounts((prev) => ({
          ...prev,
          DRAFTS: res.data.totalCount || res.data.data?.length || 0,
        }));
      }
    } catch (err) {
      console.error("Error fetching drafts:", err);
      toast.error("Failed to fetch drafts");
    }
  };

  const fetchEmailSuggestions = async (query) => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}/gmail/suggestions?query=${encodeURIComponent(query)}`,
      );
      if (res.data.success) {
        setEmailSuggestions(res.data.data || []);
      }
    } catch (err) {
      console.error("Error fetching suggestions:", err);
      setEmailSuggestions([]);
    }
  };

  // ============= LOAD THREAD =============
  const loadThread = async (threadId) => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(`${API_BASE_URL}/gmail/thread/${threadId}`);
      if (res.data.success) {
        setMessages(res.data.data.messages || []);
        setSelectedThread(threadId);

        setThreadsCache((prev) => {
          const updatedThreads = (prev[activeLabel] || []).map((thread) =>
            thread.id === threadId ? { ...thread, unread: false } : thread,
          );
          return {
            ...prev,
            [activeLabel]: updatedThreads,
          };
        });

        if (activeLabel === "INBOX") {
          setActualCounts((prev) => ({
            ...prev,
            UNREAD: Math.max(0, prev.UNREAD - 1),
          }));
        }
        
        fetchAllCountsFast();
      } else {
        setError(res.data.error || "Failed to fetch thread");
      }
    } catch (err) {
      console.error("Error fetching thread:", err);
      setError(err.response?.data?.error || "Failed to fetch thread");
    } finally {
      setLoading(false);
    }
  };

  const connectGmail = () => {
    if (authUrl) {
      window.open(authUrl, "_self");
    }
  };

  const disconnectGmail = async () => {
    setShowDisconnectModal(false);
    
    try {
      await axios.delete(`${API_BASE_URL}/gmail/disconnect`);

      setAuthStatus({ authenticated: false, message: "Gmail disconnected" });
      setThreadsCache({
        INBOX: [],
        UNREAD: [],
        STARRED: [],
        IMPORTANT: [],
        SENT: [],
        SPAM: [],
        TRASH: [],
        DRAFTS: [],
      });
      setNextPageTokenCache({});
      setTotalEmailsCache({});
      setMessages([]);
      setSelectedThread(null);
      setUserEmail("");
      setActualCounts({
        INBOX: 0,
        UNREAD: 0,
        STARRED: 0,
        IMPORTANT: 0,
        SENT: 0,
        SPAM: 0,
        TRASH: 0,
        DRAFTS: 0,
      });

      sessionStorage.removeItem("gmail_threads_cache");
      sessionStorage.removeItem("gmail_page_tokens");
      sessionStorage.removeItem("gmail_total_counts");

      await fetchAuthUrl();
      toast.success("Gmail disconnected successfully");
    } catch (err) {
      console.error("Error disconnecting Gmail:", err);
      toast.error("Error disconnecting Gmail");
    }
  };

  const confirmDisconnect = () => {
    setShowDisconnectModal(true);
  };

  // ============= FILE HANDLING =============
  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter((file) => {
      if (file.size > 30 * 1024 * 1024) {
        toast.error(`File ${file.name} exceeds 30MB limit`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;
    setSelectedFiles((prev) => [...prev, ...validFiles]);
  };

  const removeFile = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // ✅ COMPREHENSIVE FILE ICON HANDLER WITH REACT ICONS
  const getFileIcon = (file) => {
    if (file.type) {
      if (file.type.startsWith("image/")) return <FaImage className="w-5 h-5 text-blue-500" />;
      if (file.type.includes("pdf")) return <FaFilePdf className="w-5 h-5 text-red-500" />;
      if (file.type.includes("audio")) return <FaFileAudio className="w-5 h-5 text-purple-500" />;
      if (file.type.includes("video")) return <FaFileVideo className="w-5 h-5 text-pink-500" />;
      if (file.type.includes("zip") || file.type.includes("rar") || file.type.includes("tar")) 
        return <FaFileArchive className="w-5 h-5 text-yellow-600" />;
      if (file.type.includes("word") || file.type.includes("document")) 
        return <FaFileAlt className="w-5 h-5 text-blue-700" />;
      if (file.type.includes("excel") || file.type.includes("spreadsheet")) 
        return <FaFileExcel className="w-5 h-5 text-green-600" />;
      if (file.type.includes("powerpoint")) 
        return <FaFileExcel className="w-5 h-5 text-orange-600" />;
      if (file.type.includes("text")) 
        return <FaFileAlt className="w-5 h-5 text-gray-600" />;
    }

    const fileName = file.name || file.filename || "";
    const extension = fileName.split(".").pop().toLowerCase();

    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp', 'bmp', 'ico'];
    if (imageExtensions.includes(extension)) {
      return <FaImage className="w-5 h-5 text-blue-500" />;
    }

    const pdfExtensions = ['pdf'];
    if (pdfExtensions.includes(extension)) {
      return <FaFilePdf className="w-5 h-5 text-red-500" />;
    }

    const audioExtensions = ['mp3', 'wav', 'ogg', 'flac', 'aac', 'm4a'];
    if (audioExtensions.includes(extension)) {
      return <FaFileAudio className="w-5 h-5 text-purple-500" />;
    }

    const videoExtensions = ['mp4', 'avi', 'mov', 'wmv', 'flv', 'mkv', 'webm'];
    if (videoExtensions.includes(extension)) {
      return <FaFileVideo className="w-5 h-5 text-pink-500" />;
    }

    const archiveExtensions = ['zip', 'rar', '7z', 'tar', 'gz', 'bz2'];
    if (archiveExtensions.includes(extension)) {
      return <FaFileArchive className="w-5 h-5 text-yellow-600" />;
    }

    const docExtensions = ['doc', 'docx', 'txt', 'rtf', 'md', 'odt'];
    if (docExtensions.includes(extension)) {
      return <FaFileAlt className="w-5 h-5 text-blue-700" />;
    }

    const spreadsheetExtensions = ['xls', 'xlsx', 'csv', 'ods'];
    if (spreadsheetExtensions.includes(extension)) {
      return <FaFileExcel className="w-5 h-5 text-green-600" />;
    }

    const presentationExtensions = ['ppt', 'pptx', 'odp'];
    if (presentationExtensions.includes(extension)) {
      return <FaFileExcel className="w-5 h-5 text-orange-600" />;
    }

    const codeExtensions = ['js', 'jsx', 'ts', 'tsx', 'html', 'css', 'py', 'java', 'cpp', 'c', 'rb', 'php', 'go', 'rs', 'json', 'xml'];
    if (codeExtensions.includes(extension)) {
      return <FaFileCode className="w-5 h-5 text-green-700" />;
    }

    return <FaFile className="w-5 h-5 text-gray-500" />;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // ============= SEND EMAIL =============
  const sendEmail = async () => {
    if (!composeData.to.trim()) {
      toast.error("Please enter recipient email address");
      return;
    }

    setSending(true);
    setSendingProgress(0);
    setError("");

    try {
      console.log("📧 Preparing to send email...");
      
      const formData = new FormData();
      formData.append("to", composeData.to.trim());
      formData.append("cc", composeData.cc?.trim() || "");
      formData.append("bcc", composeData.bcc?.trim() || "");
      formData.append("subject", composeData.subject?.trim() || "(No Subject)");
      formData.append("message", composeData.message?.trim() || "");

      if (selectedFiles && selectedFiles.length > 0) {
        selectedFiles.forEach((file) => {
          formData.append("attachments", file);
        });
        console.log(`📎 Attached ${selectedFiles.length} files`);
      }

      const res = await axios.post(`${API_BASE_URL}/gmail/send`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setSendingProgress(percentCompleted);
          }
        },
        timeout: 300000,
      });

      setSendingProgress(100);

      if (res.data.success) {
        toast.success(`📧 Email sent successfully!`);
        
        setComposeData({
          to: "", cc: "", bcc: "", subject: "", message: "", attachments: [],
        });
        setSelectedFiles([]);
        setShowCompose(false);

        fetchAllCountsFast();
        
        if (activeLabel === "SENT") {
          setTimeout(() => {
            fetchThreads("SENT", false, true);
          }, 500);
        }

        setTimeout(() => setSendingProgress(0), 1000);
      } else {
        throw new Error(res.data.error || "Failed to send email");
      }
    } catch (err) {
      console.error("❌ Error sending email:", err);
      const errorMsg = err.response?.data?.error || err.message || "Failed to send email";
      toast.error(`Failed to send email: ${errorMsg}`);
      setSendingProgress(0);
    } finally {
      setSending(false);
    }
  };

  const saveAsDraft = async () => {
    if (!composeData.to.trim()) {
      toast.error("Please enter recipient email address");
      return;
    }

    setSavingDraft(true);
    try {
      const formData = new FormData();
      formData.append("to", composeData.to);
      formData.append("cc", composeData.cc || "");
      formData.append("bcc", composeData.bcc || "");
      formData.append("subject", composeData.subject || "(No Subject)");
      formData.append("message", composeData.message || "");

      selectedFiles.forEach((file) => {
        formData.append("attachments", file);
      });

      const res = await axios.post(`${API_BASE_URL}/gmail/draft`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        toast.success("📝 Draft saved successfully!");
        setComposeData({
          to: "",
          cc: "",
          bcc: "",
          subject: "",
          message: "",
          attachments: [],
        });
        setSelectedFiles([]);
        setShowCompose(false);

        fetchAllCountsFast();
        
        if (activeLabel === "DRAFTS") {
          setTimeout(() => {
            fetchDrafts();
          }, 500);
        }
      } else {
        throw new Error(res.data.error || "Failed to save draft");
      }
    } catch (err) {
      console.error("❌ Error saving draft:", err);
      const errorMsg =
        err.response?.data?.error || err.message || "Failed to save draft";
      toast.error(`Failed to save draft: ${errorMsg}`);
    } finally {
      setSavingDraft(false);
    }
  };

  // ============= THREAD ACTIONS =============
  const markThreadAs = async (threadId, action, value = true) => {
    try {
      let endpoint = "";
      let body = {};

      switch (action) {
        case "read":
          endpoint = `thread/${threadId}/read`;
          body = { read: value };
          break;
        case "star":
          endpoint = `thread/${threadId}/star`;
          body = { star: value };
          break;
        case "spam":
          endpoint = `thread/${threadId}/spam`;
          body = { spam: value };
          break;
        case "important":
          endpoint = `thread/${threadId}/important`;
          body = { important: value };
          break;
        case "trash":
          endpoint = `thread/${threadId}/trash`;
          break;
      }

      setThreadsCache((prev) => {
        const updatedThreads = (prev[activeLabel] || []).map((thread) => {
          if (thread.id === threadId) {
            const updated = { ...thread };
            switch (action) {
              case "read":
                updated.unread = !value;
                break;
              case "star":
                updated.starred = value;
                break;
              case "spam":
                updated.spam = value;
                break;
              case "important":
                updated.important = value;
                break;
              case "trash":
                updated.trash = true;
                break;
            }
            return updated;
          }
          return thread;
        });

        return {
          ...prev,
          [activeLabel]: updatedThreads,
        };
      });

      if (action === "star") {
        setActualCounts((prev) => ({
          ...prev,
          STARRED: value ? prev.STARRED + 1 : Math.max(0, prev.STARRED - 1),
        }));
      }

      if (action === "important") {
        setActualCounts((prev) => ({
          ...prev,
          IMPORTANT: value
            ? prev.IMPORTANT + 1
            : Math.max(0, prev.IMPORTANT - 1),
        }));
      }

      if (action === "read" && activeLabel === "INBOX") {
        setActualCounts((prev) => ({
          ...prev,
          UNREAD: value
            ? Math.max(0, prev.UNREAD - 1)
            : prev.UNREAD + 1,
        }));
      }

      setForceUpdate((prev) => prev + 1);

      const res = await axios.post(`${API_BASE_URL}/gmail/${endpoint}`, body);

      if (res.data.success) {
        toast.success(res.data.message);

        if (action === "star" && value === true && activeLabel === "INBOX") {
          setThreadsCache((prev) => {
            const starredThreads = prev.STARRED || [];
            const threadToAdd = prev[activeLabel]?.find(
              (t) => t.id === threadId,
            );

            if (threadToAdd && !starredThreads.some((t) => t.id === threadId)) {
              return {
                ...prev,
                STARRED: [{ ...threadToAdd, starred: true }, ...starredThreads],
              };
            }
            return prev;
          });
        }

        if (
          (action === "star" && activeLabel === "STARRED" && !value) ||
          (action === "important" && activeLabel === "IMPORTANT" && !value) ||
          (action === "spam" && activeLabel === "SPAM" && !value) ||
          (action === "trash" && activeLabel === "TRASH")
        ) {
          setThreadsCache((prev) => ({
            ...prev,
            [activeLabel]: (prev[activeLabel] || []).filter(
              (t) => t.id !== threadId,
            ),
          }));

          if (selectedThread === threadId) {
            setSelectedThread(null);
            setMessages([]);
          }
        }
        
        fetchAllCountsFast();
      }
    } catch (err) {
      console.error(`Error ${action} thread:`, err);
      toast.error(`Failed to ${action} thread`);
      fetchAllCountsFast();
    }
  };

  // ============= BULK ACTIONS =============
  const handleBulkAction = async (action, value = true) => {
    if (selectedThreads.size === 0) {
      toast.error("No emails selected");
      return;
    }

    const threadIds = Array.from(selectedThreads);

    try {
      if (action === "star") {
        setThreadsCache((prev) => ({
          ...prev,
          [activeLabel]: (prev[activeLabel] || []).map((thread) => {
            if (selectedThreads.has(thread.id)) {
              return { ...thread, starred: value };
            }
            return thread;
          }),
        }));

        setActualCounts((prev) => ({
          ...prev,
          STARRED: value
            ? prev.STARRED + threadIds.length
            : Math.max(0, prev.STARRED - threadIds.length),
        }));
      }

      if (action === "read") {
        setThreadsCache((prev) => ({
          ...prev,
          [activeLabel]: (prev[activeLabel] || []).map((thread) => {
            if (selectedThreads.has(thread.id)) {
              return { ...thread, unread: !value };
            }
            return thread;
          }),
        }));

        setActualCounts((prev) => ({
          ...prev,
          UNREAD: value
            ? Math.max(0, prev.UNREAD - threadIds.length)
            : prev.UNREAD + threadIds.length,
        }));
      }

      if (action === "trash") {
        setThreadsCache((prev) => ({
          ...prev,
          [activeLabel]: (prev[activeLabel] || []).filter(
            (thread) => !selectedThreads.has(thread.id),
          ),
        }));

        setActualCounts((prev) => ({
          ...prev,
          TRASH: prev.TRASH + threadIds.length,
        }));
      }

      setForceUpdate((prev) => prev + 1);

      switch (action) {
        case "star":
          await axios.post(`${API_BASE_URL}/gmail/bulk-star`, {
            threadIds,
            star: value,
          });
          toast.success(
            `⭐ ${value ? "Starred" : "Unstarred"} ${threadIds.length} emails`,
          );
          break;

        case "delete":
          const deleteRes = await axios.post(
            `${API_BASE_URL}/gmail/bulk-delete`,
            { threadIds, permanent: activeLabel === "TRASH" },
          );
          toast.success(`🗑️ ${deleteRes.data.message}`);
          break;

        case "read":
          await Promise.all(
            threadIds.map((threadId) =>
              axios.post(`${API_BASE_URL}/gmail/thread/${threadId}/read`, {
                read: value,
              }),
            ),
          );
          toast.success(
            `Marked ${threadIds.length} emails as ${value ? "read" : "unread"}`,
          );
          break;

        case "trash":
          await Promise.all(
            threadIds.map((threadId) =>
              axios.post(`${API_BASE_URL}/gmail/thread/${threadId}/trash`),
            ),
          );
          toast.success(`Moved ${threadIds.length} emails to trash`);
          break;
      }

      setSelectedThreads(new Set());
      setShowBulkActions(false);
      setIsSelectAll(false);
      
      fetchAllCountsFast();
    } catch (err) {
      console.error(`Error in bulk ${action}:`, err);
      toast.error(`Failed to ${action} emails`);
      fetchAllCountsFast();
    }
  };

  const toggleThreadSelection = (threadId) => {
    const currentThreads = threadsCache[activeLabel] || [];
    const newSelected = new Set(selectedThreads);

    if (newSelected.has(threadId)) {
      newSelected.delete(threadId);
    } else {
      newSelected.add(threadId);
    }

    setSelectedThreads(newSelected);
    setShowBulkActions(newSelected.size > 0);
    setIsSelectAll(newSelected.size === currentThreads.length);
  };

  const selectAllThreads = () => {
    const currentThreads = threadsCache[activeLabel] || [];

    if (selectedThreads.size === currentThreads.length) {
      setSelectedThreads(new Set());
      setShowBulkActions(false);
      setIsSelectAll(false);
    } else {
      setSelectedThreads(new Set(currentThreads.map((t) => t.id)));
      setShowBulkActions(true);
      setIsSelectAll(true);
    }
  };

  const deleteThread = async (threadId, permanent = false) => {
    try {
      if (permanent) {
        await axios.delete(`${API_BASE_URL}/gmail/thread/${threadId}`);
      } else {
        await axios.post(`${API_BASE_URL}/gmail/thread/${threadId}/trash`);
      }

      toast.success(
        permanent
          ? "🗑️ Thread permanently deleted"
          : "🗑️ Thread moved to trash",
      );

      setThreadsCache((prev) => ({
        ...prev,
        [activeLabel]: (prev[activeLabel] || []).filter(
          (thread) => thread.id !== threadId,
        ),
      }));

      fetchAllCountsFast();

      if (selectedThread === threadId) {
        setMessages([]);
        setSelectedThread(null);
      }

      setForceUpdate((prev) => prev + 1);
    } catch (err) {
      console.error("Error deleting thread:", err);
      toast.error(err.response?.data?.error || "Failed to delete thread");
    } finally {
      setShowDeleteModal(false);
      setThreadToDelete(null);
    }
  };

  const confirmDeleteThread = (threadId, permanent = false) => {
    setThreadToDelete({ id: threadId, permanent });
    setShowDeleteModal(true);
  };

  // ============= UTILITY FUNCTIONS =============
  const formatDateTime = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now - date;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      const timeStr = date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });

      if (diffMins < 1) return `Just now (${timeStr})`;
      if (diffMins < 60) return `${diffMins}m ago (${timeStr})`;
      if (diffHours < 24) return `${diffHours}h ago (${timeStr})`;
      if (diffDays < 7)
        return `${diffDays}d ago (${date.toLocaleDateString("en-US", { month: "short", day: "numeric" })} at ${timeStr})`;

      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    } catch {
      return dateString;
    }
  };

  const extractNameFromEmail = (emailString) => {
    if (!emailString) return "Unknown";
    const match = emailString.match(/(.*?)</);
    return match ? match[1].trim() : emailString;
  };

  const extractEmailAddress = (emailString) => {
    if (!emailString) return "";
    const match = emailString.match(/<([^>]+)>/);
    return match ? match[1] : emailString;
  };

  const downloadAttachment = async (messageId, attachment) => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}/gmail/attachment/${messageId}/${attachment.id}`,
        { responseType: "blob" },
      );

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", attachment.filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success(`📥 Downloaded ${attachment.filename}`);
    } catch (err) {
      console.error("Error downloading attachment:", err);
      toast.error("Failed to download attachment");
    }
  };

  const openComposeForReply = (msg, type = "reply") => {
    let to = "";
    let subject = "";
    let message = "";

    switch (type) {
      case "reply":
        to = extractEmailAddress(msg.from);
        subject = msg.subject.startsWith("Re:")
          ? msg.subject
          : `Re: ${msg.subject}`;
        message = `\n\nOn ${formatDateTime(msg.date)}, ${extractNameFromEmail(msg.from)} wrote:\n> ${msg.body?.substring(0, 200)}...`;
        break;
      case "replyAll":
        const allRecipients = [
          extractEmailAddress(msg.from),
          ...(msg.to
            ? msg.to
                .split(",")
                .map((e) => extractEmailAddress(e.trim()))
                .filter((e) => e)
            : []),
          ...(msg.cc
            ? msg.cc
                .split(",")
                .map((e) => extractEmailAddress(e.trim()))
                .filter((e) => e)
            : []),
        ].filter((v, i, a) => a.indexOf(v) === i && v !== userEmail);
        to = allRecipients.join(", ");
        subject = msg.subject.startsWith("Re:")
          ? msg.subject
          : `Re: ${msg.subject}`;
        message = `\n\nOn ${formatDateTime(msg.date)}, ${extractNameFromEmail(msg.from)} wrote:\n> ${msg.body?.substring(0, 200)}...`;
        break;
      case "forward":
        to = "";
        subject = msg.subject.startsWith("Fwd:")
          ? msg.subject
          : `Fwd: ${msg.subject}`;
        message = `\n\n---------- Forwarded message ----------\nFrom: ${msg.from}\nDate: ${msg.date}\nSubject: ${msg.subject}\nTo: ${msg.to}\n\n${msg.body}`;
        break;
    }

    setComposeData({
      to,
      cc: "",
      bcc: "",
      subject,
      message,
      attachments: [],
    });
    setComposeMode(type);
    setShowCompose(true);
  };

  const clearCompose = () => {
    setComposeData({
      to: "",
      cc: "",
      bcc: "",
      subject: "",
      message: "",
      attachments: [],
    });
    setSelectedFiles([]);
    setComposeMode("new");
    setEmailSuggestions([]);
  };

  const handleBackToList = () => {
    setSelectedThread(null);
    setMessages([]);
  };

  // ============= LABEL CLICK HANDLER =============
  const handleLabelClick = async (label) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    setActiveLabel(label.id);
    setSelectedThread(null);
    setMessages([]);
    setSearchQuery("");
    setFilterUnread(false);
    setSelectedThreads(new Set());
    setShowBulkActions(false);
    setIsSelectAll(false);

    if (label.id === "DRAFTS") {
      await fetchDrafts();
    } else {
      const cachedThreads = threadsCache[label.id];

      if (!cachedThreads || cachedThreads.length === 0) {
        await fetchThreads(label.id, false, false);
      } else {
        console.log(
          `📨 Using cached threads for ${label.id} (${cachedThreads.length})`,
        );
        setForceUpdate((prev) => prev + 1);

        const cacheAge = lastFetchTime[label.id]
          ? Date.now() - lastFetchTime[label.id]
          : Infinity;
        if (cacheAge > 30000) {
          setTimeout(() => {
            fetchThreads(label.id, false, true);
          }, 100);
        }
      }
    }
  };

  // ============= DERIVED STATE =============
  const currentThreads = threadsCache[activeLabel] || [];

  const filteredThreads = currentThreads.filter((thread) => {
    const matchesSearch =
      searchQuery === "" ||
      thread.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      thread.from?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      thread.snippet?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesUnread = !filterUnread || thread.unread;

    return matchesSearch && matchesUnread;
  });

  // ============= LABEL OPTIONS WITH REAL COUNTS =============
  const labelOptions = [
    { id: "INBOX", name: "Inbox", icon: <FaInbox className="w-5 h-5" />, count: actualCounts.INBOX },
    { id: "UNREAD", name: "Unread", icon: <FaEnvelope className="w-5 h-5" />, count: actualCounts.UNREAD },
    { id: "STARRED", name: "Starred", icon: <FaStar className="w-5 h-5" />, count: actualCounts.STARRED },
    {
      id: "IMPORTANT",
      name: "Important",
      icon: <FaExclamationCircle className="w-5 h-5" />,
      count: actualCounts.IMPORTANT,
    },
    { id: "DRAFTS", name: "Drafts", icon: <FaFileAlt className="w-5 h-5" />, count: actualCounts.DRAFTS },
    { id: "SENT", name: "Sent", icon: <FaPaperPlane className="w-5 h-5" />, count: actualCounts.SENT },
    { id: "SPAM", name: "Spam", icon: <FaExclamationTriangle className="w-5 h-5" />, count: actualCounts.SPAM },
    { id: "TRASH", name: "Trash", icon: <FaTrash className="w-5 h-5" />, count: actualCounts.TRASH },
  ];

  const renderLabelIcon = (thread) => {
    if (thread.starred) return <FaStar className="w-5 h-5 text-yellow-500" />;
    if (thread.important) return <FaExclamationCircle className="w-5 h-5 text-red-500" />;
    if (thread.spam) return <FaExclamationTriangle className="w-5 h-5 text-orange-500" />;
    if (thread.trash) return <FaTrash className="w-5 h-5 text-gray-500" />;
    if (thread.drafts) return <FaFileAlt className="w-5 h-5 text-gray-500" />;
    if (thread.unread) return <FaEnvelope className="w-5 h-5 text-blue-500" />;
    return <FaEnvelopeOpen className="w-5 h-5 text-gray-500" />;
  };

  // ============= LOADING STATE =============
  if (loading && !authStatus.authenticated && !error) {
    return (
      <div className="p-8 max-w-md mx-auto mt-20 bg-white rounded-xl border border-gray-200 shadow-lg">
        <div className="text-center">
          <FaSpinner className="h-16 w-16 animate-spin text-blue-600 mx-auto mb-6" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Connecting to Gmail
          </h3>
          <p className="text-gray-600 mb-4">
            Checking authentication status...
          </p>
        </div>
      </div>
    );
  }

  // ============= NOT AUTHENTICATED =============
  if (!authStatus.authenticated) {
    return (
      <div className="p-8 max-w-md mx-auto mt-20 bg-white rounded-xl border border-gray-200 shadow-lg">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
            <FaEnvelope className="w-10 h-10 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            Connect Your Gmail
          </h2>
          <p className="text-gray-600 mb-6">
            Connect your Gmail account to manage emails directly
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
            <p>{error}</p>
          </div>
        )}

        {authStatus.message && !error && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg text-sm">
            <p>{authStatus.message}</p>
          </div>
        )}

        {authUrl ? (
          <div className="space-y-4">
            <button
              onClick={connectGmail}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-4 px-6 rounded-xl border border-blue-700 transition duration-200 flex items-center justify-center gap-3 text-base shadow-lg"
            >
              <FaEnvelope className="w-6 h-6" />
              Connect Gmail Account
            </button>
            <div className="text-center text-gray-500 text-sm">
              <p>You'll be redirected to Google to authorize access</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <button
              onClick={fetchAuthUrl}
              disabled={loading}
              className="w-full bg-gray-700 hover:bg-gray-800 text-white font-semibold py-4 px-6 rounded-xl border border-gray-800 transition duration-200 disabled:opacity-50 text-base shadow-md"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-3">
                  <FaSpinner className="h-5 w-5 animate-spin" />
                  <span>Connecting...</span>
                </div>
              ) : (
                "Get Connection Link"
              )}
            </button>
            <button
              onClick={checkAuthStatus}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-6 rounded-lg border border-gray-300 transition duration-200 text-sm"
            >
              <FaSync className="w-4 h-4 inline mr-2" />
              Check Status Again
            </button>
          </div>
        )}
      </div>
    );
  }

  // ============= MAIN UI - AUTHENTICATED =============
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Disconnect Confirmation Dialog */}
      <Dialog open={showDisconnectModal} onOpenChange={setShowDisconnectModal}>
        <DialogContent className="bg-white rounded-lg shadow-xl max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-gray-800 text-lg font-semibold">
              <FaSignOutAlt className="w-5 h-5 text-red-600" />
              Disconnect Gmail
            </DialogTitle>
          </DialogHeader>
          <div className="p-6">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <FaExclamationTriangle className="w-8 h-8 text-red-600" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
              Are you sure?
            </h3>
            <p className="text-gray-600 text-center mb-6">
              You are about to disconnect your Gmail account. 
              This will remove all cached emails and you'll need to reconnect to access your emails again.
            </p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-yellow-800 flex items-start gap-2">
                <FaInfoCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>
                  Your emails are stored in Google servers and won't be deleted. 
                  You can reconnect at any time to access them again.
                </span>
              </p>
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDisconnectModal(false)}
                className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 text-gray-700 transition duration-200 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={disconnectGmail}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white flex items-center gap-2 transition duration-200 text-sm"
              >
                <FaSignOutAlt className="w-4 h-4" />
                Disconnect
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Compose Email Dialog */}
      <Dialog open={showCompose} onOpenChange={setShowCompose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-lg shadow-xl">
          <DialogHeader className="border-b border-gray-200 pb-4">
            <DialogTitle className="flex items-center gap-2 text-gray-800 text-xl font-semibold">
              {composeMode === "reply" ? (
                <FaReply className="w-5 h-5" />
              ) : composeMode === "forward" ? (
                <FaForward className="w-5 h-5" />
              ) : (
                <FaEdit className="w-5 h-5" />
              )}
              {composeMode === "reply"
                ? "Reply"
                : composeMode === "forward"
                  ? "Forward"
                  : "Compose Email"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            {emailSuggestions.length > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm font-medium text-blue-800 mb-2 flex items-center gap-2">
                  <FaUsers className="w-4 h-4" />
                  Email Suggestions:
                </p>
                <div className="space-y-1">
                  {emailSuggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setComposeData((prev) => ({ ...prev, to: suggestion }));
                        setEmailSuggestions([]);
                      }}
                      className="w-full text-left p-2 hover:bg-blue-100 rounded text-sm text-blue-700 flex items-center gap-2"
                    >
                      <FaAt className="w-4 h-4" />
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-center border-b border-gray-200 pb-2">
                <label className="w-16 text-sm font-medium text-gray-700 flex items-center gap-1">
                  <FaAt className="w-4 h-4" />
                  To*
                </label>
                <input
                  type="email"
                  value={composeData.to}
                  onChange={(e) =>
                    setComposeData((prev) => ({ ...prev, to: e.target.value }))
                  }
                  className="flex-1 p-2 border-none focus:ring-0 focus:outline-none text-gray-800 placeholder-gray-400"
                  placeholder="Enter recipient email addresses (comma separated)"
                  multiple
                />
              </div>

              <div className="flex items-center border-b border-gray-200 pb-2">
                <label className="w-16 text-sm font-medium text-gray-700 flex items-center gap-1">
                  <FaUsers className="w-4 h-4" />
                  Cc
                </label>
                <input
                  type="email"
                  value={composeData.cc}
                  onChange={(e) =>
                    setComposeData((prev) => ({ ...prev, cc: e.target.value }))
                  }
                  className="flex-1 p-2 border-none focus:ring-0 focus:outline-none text-gray-800 placeholder-gray-400"
                  placeholder="Cc email addresses (optional)"
                  multiple
                />
              </div>

              <div className="flex items-center border-b border-gray-200 pb-2">
                <label className="w-16 text-sm font-medium text-gray-700 flex items-center gap-1">
                  <FaUsers className="w-4 h-4" />
                  Bcc
                </label>
                <input
                  type="email"
                  value={composeData.bcc}
                  onChange={(e) =>
                    setComposeData((prev) => ({ ...prev, bcc: e.target.value }))
                  }
                  className="flex-1 p-2 border-none focus:ring-0 focus:outline-none text-gray-800 placeholder-gray-400"
                  placeholder="Bcc email addresses (optional)"
                  multiple
                />
              </div>

              <div className="flex items-center border-b border-gray-200 pb-2">
                <label className="w-16 text-sm font-medium text-gray-700 flex items-center gap-1">
                  <FaFileAlt className="w-4 h-4" />
                  Subject
                </label>
                <input
                  type="text"
                  value={composeData.subject}
                  onChange={(e) =>
                    setComposeData((prev) => ({
                      ...prev,
                      subject: e.target.value,
                    }))
                  }
                  className="flex-1 p-2 border-none focus:ring-0 focus:outline-none text-gray-800 placeholder-gray-400"
                  placeholder="Email subject (optional)"
                />
              </div>
            </div>

            {/* File Attachments */}
            <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <FaPaperclip className="w-4 h-4" />
                    Attachments
                  </label>
                  <p className="text-xs text-gray-500 mt-1">
                    Max 30MB per file • Supports images, PDFs, audio, video,
                    documents
                  </p>
                </div>
                <button
                  onClick={triggerFileInput}
                  className="text-sm bg-gray-600 text-white px-3 py-2 rounded-lg hover:bg-gray-700 transition duration-200 flex items-center gap-2 text-xs"
                >
                  <FaPlus className="w-4 h-4" />
                  Add Files
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                  accept="*/*"
                />
              </div>

              {selectedFiles.length > 0 && (
                <div className="space-y-2">
                  {selectedFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 shadow-sm"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <span className="text-gray-600">{getFileIcon(file)}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-700 truncate">
                            {file.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatFileSize(file.size)}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFile(index)}
                        className="ml-2 text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition duration-200"
                      >
                        <FaTimes className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {selectedFiles.length === 0 && (
                <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                  <FaPaperclip className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-sm text-gray-600">
                    Drag and drop files here or click "Add Files"
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Maximum file size: 30MB each
                  </p>
                </div>
              )}
            </div>

            <div className="border border-gray-300 rounded-lg overflow-hidden shadow-sm">
              <textarea
                value={composeData.message}
                onChange={(e) =>
                  setComposeData((prev) => ({
                    ...prev,
                    message: e.target.value,
                  }))
                }
                rows="12"
                className="w-full p-4 border-none focus:ring-0 focus:outline-none resize-none text-gray-800 font-sans placeholder-gray-400"
                placeholder="Write your message here... (Optional)"
              />
            </div>
          </div>

          {sending && sendingProgress > 0 && (
            <div className="mt-4">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Sending email...</span>
                <span>{sendingProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${sendingProgress}%` }}
                ></div>
              </div>
            </div>
          )}

          <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
            <div className="flex gap-2">
              <button
                onClick={clearCompose}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2 transition duration-200 text-sm"
              >
                <FaTrash className="w-4 h-4" />
                Clear
              </button>
              <button
                onClick={saveAsDraft}
                disabled={savingDraft || !composeData.to.trim()}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-300 disabled:opacity-50 flex items-center gap-2 transition duration-200 text-sm"
              >
                {savingDraft ? (
                  <>
                    <FaSpinner className="h-3 w-3 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <FaSave className="w-4 h-4" />
                    Save Draft
                  </>
                )}
              </button>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowCompose(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition duration-200 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={sendEmail}
                disabled={sending || !composeData.to.trim()}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg border border-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition duration-200 text-sm shadow-sm"
              >
                {sending ? (
                  <>
                    <FaSpinner className="h-3 w-3 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <FaPaperPlane className="w-4 h-4" />
                    Send Now
                  </>
                )}
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent className="bg-white rounded-lg shadow-xl max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-gray-800 text-lg font-semibold">
              {threadToDelete?.permanent ? (
                <>
                  <FaTrash className="w-5 h-5 text-red-600" />
                  Permanently Delete
                </>
              ) : (
                <>
                  <FaTrash className="w-5 h-5 text-orange-600" />
                  Move to Trash
                </>
              )}
            </DialogTitle>
          </DialogHeader>
          <div className="p-6">
            <div className="flex items-center justify-center mb-4">
              <div className={`w-16 h-16 ${threadToDelete?.permanent ? 'bg-red-100' : 'bg-orange-100'} rounded-full flex items-center justify-center`}>
                {threadToDelete?.permanent ? (
                  <FaExclamationTriangle className="w-8 h-8 text-red-600" />
                ) : (
                  <FaTrash className="w-8 h-8 text-orange-600" />
                )}
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
              {threadToDelete?.permanent ? 'Delete Permanently?' : 'Move to Trash?'}
            </h3>
            <p className="text-gray-600 text-center mb-6">
              {threadToDelete?.permanent
                ? "This action cannot be undone. The email will be permanently deleted from your account."
                : "The email will be moved to trash. You can restore it later from the trash folder."}
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setThreadToDelete(null);
                }}
                className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 text-gray-700 transition duration-200 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={() =>
                  deleteThread(threadToDelete.id, threadToDelete.permanent)
                }
                className={`px-4 py-2 rounded-lg text-white flex items-center gap-2 transition duration-200 text-sm ${
                  threadToDelete?.permanent
                    ? "bg-red-600 hover:bg-red-700 border border-red-700"
                    : "bg-orange-500 hover:bg-orange-600 border border-orange-600"
                }`}
              >
                <FaTrash className="w-4 h-4" />
                {threadToDelete?.permanent
                  ? "Delete Permanently"
                  : "Move to Trash"}
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Main Content */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-4">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          {/* Compose Button */}
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <button
              onClick={() => {
                setComposeMode("new");
                setShowCompose(true);
              }}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium py-3 px-4 rounded-lg shadow transition duration-200 flex items-center justify-center gap-2"
            >
              <FaEdit className="w-5 h-5" />
              Compose
            </button>
          </div>

          {/* Labels/Navigation - WITH REAL COUNTS */}
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <FaInbox className="w-4 h-4" />
              MAIL
              {isRefreshingCounts && (
                <FaSpinner className="w-4 h-4 animate-spin text-blue-500 ml-auto" />
              )}
            </h3>
            <div className="space-y-1">
              {labelOptions.map((label) => (
                <button
                  key={label.id}
                  onClick={() => handleLabelClick(label)}
                  className={`w-full flex items-center justify-between p-3 rounded-lg transition duration-200 text-sm ${
                    activeLabel === label.id
                      ? "bg-blue-50 text-blue-600 border border-blue-200"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">{label.icon}</span>
                    <span>{label.name}</span>
                  </div>
                  {label.count > 0 && (
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-bold ${
                        activeLabel === label.id
                          ? "bg-blue-100 text-blue-600"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {label.count.toLocaleString()}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* User Info */}
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-gray-600 to-gray-800 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                {userEmail?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate flex items-center gap-1">
                  <FaUser className="w-4 h-4" />
                  {userEmail}
                </p>
                <p className="text-xs text-gray-500 truncate flex items-center gap-1">
                  <FaEnvelope className="w-3 h-3" />
                  {totalEmailsCache[activeLabel]?.toLocaleString() || 0} emails
                </p>
              </div>
            </div>
            <button
              onClick={confirmDisconnect}
              className="w-full mt-3 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition duration-200 flex items-center justify-center gap-2"
            >
              <FaSignOutAlt className="w-4 h-4" />
              Disconnect Gmail
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-3">
          {/* Header */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-4">
                {selectedThread && (
                  <button
                    onClick={handleBackToList}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 p-2 rounded-lg border border-gray-300 transition duration-200 flex items-center gap-2"
                  >
                    <FaChevronLeft className="w-4 h-4" />
                    Back
                  </button>
                )}
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    {selectedThread ? (
                      <>
                        <FaEnvelope className="w-6 h-6" />
                        Email
                      </>
                    ) : (
                      <>
                        {activeLabel === "INBOX" && <FaInbox className="w-6 h-6" />}
                        {activeLabel === "UNREAD" && <FaEnvelope className="w-6 h-6" />}
                        {activeLabel === "STARRED" && <FaStar className="w-6 h-6" />}
                        {activeLabel === "IMPORTANT" && <FaExclamationCircle className="w-6 h-6" />}
                        {activeLabel === "DRAFTS" && <FaFileAlt className="w-6 h-6" />}
                        {activeLabel === "SENT" && <FaPaperPlane className="w-6 h-6" />}
                        {activeLabel === "SPAM" && <FaExclamationTriangle className="w-6 h-6" />}
                        {activeLabel === "TRASH" && <FaTrash className="w-6 h-6" />}
                        {activeLabel}
                      </>
                    )}
                  </h2>
                  {userEmail && (
                    <p className="text-sm text-gray-600 mt-1 flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      Connected as: {userEmail}
                      {actualCounts.UNREAD > 0 &&
                        !selectedThread &&
                        activeLabel === "INBOX" && (
                          <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                            <FaEnvelope className="w-3 h-3" />
                            {actualCounts.UNREAD} unread
                          </span>
                        )}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowCompose(true)}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg border border-blue-600 transition duration-200 flex items-center gap-2 text-sm shadow-sm"
                >
                  <FaEdit className="w-4 h-4" />
                  Compose
                </button>

                <button
                  onClick={() => fetchThreads(activeLabel, false, true)}
                  disabled={loading && loadingLabel === activeLabel}
                  className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg border border-gray-700 transition duration-200 disabled:opacity-50 flex items-center gap-2 text-sm"
                >
                  {loading && loadingLabel === activeLabel ? (
                    <>
                      <FaSpinner className="w-4 h-4 animate-spin" />
                      Refreshing...
                    </>
                  ) : (
                    <>
                      <FaSync className="w-4 h-4" />
                      Refresh
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Bulk Actions Bar */}
            {showBulkActions && !selectedThread && (
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-blue-800 flex items-center gap-1">
                    <FaCheckSquare className="w-4 h-4" />
                    {selectedThreads.size} selected
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleBulkAction("read", true)}
                      className="text-xs bg-white text-blue-600 px-3 py-1 rounded border border-blue-300 hover:bg-blue-50 flex items-center gap-1"
                    >
                      <FaCheckCircle className="w-3 h-3" />
                      Mark as Read
                    </button>
                    <button
                      onClick={() => handleBulkAction("star", true)}
                      className="text-xs bg-white text-yellow-600 px-3 py-1 rounded border border-yellow-300 hover:bg-yellow-50 flex items-center gap-1"
                    >
                      <FaStar className="w-3 h-3" />
                      Star
                    </button>
                    <button
                      onClick={() => handleBulkAction("trash")}
                      className="text-xs bg-white text-orange-600 px-3 py-1 rounded border border-orange-300 hover:bg-orange-50 flex items-center gap-1"
                    >
                      <FaTrash className="w-3 h-3" />
                      Move to Trash
                    </button>
                    {activeLabel === "TRASH" && (
                      <button
                        onClick={() => handleBulkAction("delete")}
                        className="text-xs bg-white text-red-600 px-3 py-1 rounded border border-red-300 hover:bg-red-50 flex items-center gap-1"
                      >
                        <FaTrash className="w-3 h-3" />
                        Delete
                      </button>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => {
                    setSelectedThreads(new Set());
                    setShowBulkActions(false);
                    setIsSelectAll(false);
                  }}
                  className="text-xs text-gray-500 hover:text-gray-700"
                >
                  Clear selection
                </button>
              </div>
            )}

            {/* Search and Filter Bar */}
            {!selectedThread && (
              <div className="flex gap-4 mt-4">
                <div className="flex-1">
                  <div className="relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={`Search emails in ${activeLabel.toLowerCase()}...`}
                      className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 shadow-sm"
                    />
                    <FaSearch className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
                  </div>
                </div>
                {activeLabel === "INBOX" && (
                  <button
                    onClick={() => setFilterUnread(!filterUnread)}
                    className={`px-4 py-3 rounded-lg border transition duration-200 flex items-center gap-2 text-sm ${
                      filterUnread
                        ? "bg-gray-800 text-white border-gray-900"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <FaFilter className="w-4 h-4" />
                    Unread Only
                  </button>
                )}
              </div>
            )}
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md flex items-center gap-2">
              <FaExclamationCircle className="w-5 h-5" />
              {error}
            </div>
          )}

          {/* Email List OR Email Detail */}
          {!selectedThread ? (
            /* Email List View */
            <div className="bg-white p-6 rounded-lg border border-gray-200 min-h-[60vh] overflow-y-auto shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-4">
                  <div className="flex items-center">
                    {filteredThreads.length > 0 && (
                      <input
                        type="checkbox"
                        checked={isSelectAll}
                        onChange={selectAllThreads}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mr-3"
                      />
                    )}
                    <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                      {activeLabel === "INBOX" && <FaInbox className="w-5 h-5" />}
                      {activeLabel === "UNREAD" && <FaEnvelope className="w-5 h-5" />}
                      {activeLabel === "STARRED" && <FaStar className="w-5 h-5" />}
                      {activeLabel === "IMPORTANT" && <FaExclamationCircle className="w-5 h-5" />}
                      {activeLabel === "DRAFTS" && <FaFileAlt className="w-5 h-5" />}
                      {activeLabel === "SENT" && <FaPaperPlane className="w-5 h-5" />}
                      {activeLabel === "SPAM" && <FaExclamationTriangle className="w-5 h-5" />}
                      {activeLabel === "TRASH" && <FaTrash className="w-5 h-5" />}
                      {activeLabel}
                      <span className="ml-2 text-sm font-normal text-gray-500">
                        ({filteredThreads.length} of{" "}
                        {totalEmailsCache[activeLabel] || 0})
                      </span>
                    </h3>
                  </div>
                </div>
                {nextPageTokenCache[activeLabel] &&
                  filteredThreads.length > 0 && (
                    <button
                      onClick={() => fetchThreads(activeLabel, true)}
                      disabled={loading && loadingLabel === activeLabel}
                      className="text-sm bg-blue-600 text-white px-4 py-2 rounded-lg border border-blue-700 hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2 transition duration-200 shadow-sm"
                    >
                      {loading && loadingLabel === activeLabel ? (
                        <>
                          <FaSpinner className="w-4 h-4 animate-spin" />
                          Loading...
                        </>
                      ) : (
                        <>
                          <FaPlus className="w-4 h-4" />
                          Load More
                        </>
                      )}
                    </button>
                  )}
              </div>

              {loading &&
              loadingLabel === activeLabel &&
              currentThreads.length === 0 ? (
                <div className="text-center text-gray-500 py-12">
                  <FaSpinner className="h-12 w-12 animate-spin text-blue-500 mx-auto mb-4" />
                  <p className="text-lg">Loading your emails...</p>
                </div>
              ) : filteredThreads.length === 0 ? (
                <div className="text-center text-gray-500 py-12">
                  <FaEnvelope className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    {searchQuery || filterUnread
                      ? "No emails match your search"
                      : "No emails found"}
                  </h3>
                  <p className="text-gray-500 max-w-md mx-auto">
                    {searchQuery || filterUnread
                      ? "Try adjusting your search terms or filters"
                      : activeLabel === "INBOX"
                        ? "Your inbox is empty. Send or receive some emails!"
                        : `No emails in ${activeLabel.toLowerCase()} folder`}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredThreads.map((thread) => (
                    <div
                      key={thread.id}
                      className={`p-6 rounded-xl cursor-pointer transition-all duration-200 border-2 ${
                        selectedThread === thread.id
                          ? "bg-blue-50 border-blue-300 shadow-md"
                          : "bg-white hover:bg-gray-50 border-gray-200 hover:border-gray-300 shadow-sm hover:shadow"
                      } ${thread.unread && activeLabel === "INBOX" ? "border-l-4 border-l-blue-500" : ""}`}
                      onClick={() => loadThread(thread.id)}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start gap-3 mb-3">
                            <div
                              className="flex items-center mt-1"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <input
                                type="checkbox"
                                checked={selectedThreads.has(thread.id)}
                                onChange={() =>
                                  toggleThreadSelection(thread.id)
                                }
                                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                onClick={(e) => e.stopPropagation()}
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-3 mb-2">
                                <span className="text-gray-600">
                                  {renderLabelIcon(thread)}
                                </span>
                                {thread.unread && activeLabel === "INBOX" && (
                                  <span className="w-3 h-3 bg-blue-500 rounded-full flex-shrink-0"></span>
                                )}
                                <h4 className="font-bold text-gray-900 text-lg truncate">
                                  {thread.subject || "No Subject"}
                                </h4>
                              </div>
                              <div className="flex items-center gap-4 mb-3">
                                <p className="text-sm text-gray-700 font-medium flex items-center gap-1">
                                  <FaUser className="w-4 h-4 text-gray-500" />
                                  <span className="text-gray-500">From:</span>{" "}
                                  {extractNameFromEmail(thread.from)}
                                </p>
                                <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full font-medium flex items-center gap-1">
                                  <FaComments className="w-3 h-3" />
                                  {thread.messagesCount}{" "}
                                  {thread.messagesCount === 1
                                    ? "message"
                                    : "messages"}
                                </span>
                              </div>
                              <p className="text-gray-600 mb-4 line-clamp-2">
                                {thread.snippet || "No preview available"}
                              </p>
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-500 font-medium flex items-center gap-1">
                                  <FaClock className="w-4 h-4" />
                                  {formatDateTime(thread.date)}
                                </span>
                                <div className="flex items-center gap-3">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      markThreadAs(
                                        thread.id,
                                        "star",
                                        !thread.starred,
                                      );
                                    }}
                                    className={`p-2 rounded-full transition duration-200 ${
                                      thread.starred
                                        ? "text-yellow-500 hover:text-yellow-600 bg-yellow-50"
                                        : "text-gray-400 hover:text-yellow-500 hover:bg-gray-100"
                                    }`}
                                    title={thread.starred ? "Unstar" : "Star"}
                                  >
                                    <FaStar className="w-5 h-5" />
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      confirmDeleteThread(
                                        thread.id,
                                        activeLabel === "TRASH",
                                      );
                                    }}
                                    className="text-red-400 hover:text-red-600 transition duration-200 p-2 rounded-full hover:bg-red-50"
                                    title={
                                      activeLabel === "TRASH"
                                        ? "Delete permanently"
                                        : "Move to trash"
                                    }
                                  >
                                    <FaTrash className="w-5 h-5" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Load More Button */}
              {nextPageTokenCache[activeLabel] &&
                filteredThreads.length > 0 && (
                  <div className="mt-8 text-center">
                    <button
                      onClick={() => fetchThreads(activeLabel, true)}
                      disabled={loading && loadingLabel === activeLabel}
                      className="inline-flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg border border-blue-700 hover:border-blue-800 transition duration-200 shadow-md hover:shadow-lg"
                    >
                      {loading && loadingLabel === activeLabel ? (
                        <>
                          <FaSpinner className="w-5 h-5 animate-spin" />
                          Loading more emails...
                        </>
                      ) : (
                        <>
                          <FaPlus className="w-5 h-5" />
                          Load More Emails
                        </>
                      )}
                    </button>
                  </div>
                )}
            </div>
          ) : (
            /* Email Detail View */
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm min-h-[60vh] overflow-y-auto">
              {messages.length === 0 ? (
                <div className="text-center text-gray-500 py-12">
                  <FaEnvelope className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    No messages
                  </h3>
                  <p className="text-gray-500">This thread has no messages</p>
                </div>
              ) : (
                <>
                  <div className="sticky top-0 bg-white border-b border-gray-200 p-6 z-10 shadow-sm">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-1">
                          {messages[0]?.subject || "Conversation"}
                        </h3>
                        <p className="text-sm text-gray-600 flex items-center gap-1">
                          <FaComments className="w-4 h-4" />
                          {messages.length} message
                          {messages.length !== 1 ? "s" : ""} in conversation
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            openComposeForReply(messages[0], "reply")
                          }
                          className="text-sm bg-blue-600 text-white px-4 py-2.5 rounded-lg border border-blue-700 hover:bg-blue-700 flex items-center gap-2 transition duration-200 shadow-sm"
                        >
                          <FaReply className="w-4 h-4" />
                          Reply
                        </button>
                        <button
                          onClick={() =>
                            openComposeForReply(messages[0], "forward")
                          }
                          className="text-sm bg-gray-200 text-gray-700 px-4 py-2.5 rounded-lg border border-gray-300 hover:bg-gray-300 flex items-center gap-2 transition duration-200"
                        >
                          <FaForward className="w-4 h-4" />
                          Forward
                        </button>
                        <button
                          onClick={() =>
                            confirmDeleteThread(
                              selectedThread,
                              activeLabel === "TRASH",
                            )
                          }
                          className="text-sm bg-red-600 text-white px-4 py-2.5 rounded-lg border border-red-700 hover:bg-red-700 flex items-center gap-2 transition duration-200"
                          title={
                            activeLabel === "TRASH"
                              ? "Delete permanently"
                              : "Move to trash"
                          }
                        >
                          <FaTrash className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="p-8 space-y-8">
                    {messages.map((msg, i) => (
                      <div
                        key={msg.id}
                        className="p-8 border-2 border-gray-200 rounded-xl hover:bg-gray-50 transition duration-200 shadow-sm"
                      >
                        <div className="flex justify-between items-start mb-6">
                          <div className="flex-1">
                            <div className="flex items-center gap-4 mb-4">
                              <div className="w-12 h-12 bg-gradient-to-br from-gray-600 to-gray-800 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                                {extractNameFromEmail(msg.from)
                                  .charAt(0)
                                  .toUpperCase()}
                              </div>
                              <div>
                                <h4 className="font-bold text-gray-900 text-xl flex items-center gap-3">
                                  {extractNameFromEmail(msg.from)}
                                  <span className="text-sm bg-gray-100 text-gray-600 px-3 py-1.5 rounded-full flex items-center gap-1">
                                    {renderLabelIcon(msg)}
                                  </span>
                                </h4>
                                <p className="text-gray-600 flex items-center gap-1">
                                  <FaAt className="w-4 h-4" />
                                  {extractEmailAddress(msg.from)}
                                </p>
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-6 mt-4">
                              {msg.to && (
                                <p className="text-gray-700 flex items-center gap-1">
                                  <FaUser className="w-4 h-4" />
                                  <span className="font-medium text-gray-900">
                                    To:
                                  </span>{" "}
                                  {extractNameFromEmail(msg.to)}
                                </p>
                              )}
                              {msg.cc && (
                                <p className="text-gray-700 flex items-center gap-1">
                                  <FaUsers className="w-4 h-4" />
                                  <span className="font-medium text-gray-900">
                                    Cc:
                                  </span>{" "}
                                  {msg.cc}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex gap-3 mb-4 justify-end">
                              <button
                                onClick={() =>
                                  markThreadAs(
                                    selectedThread,
                                    "star",
                                    !msg.starred,
                                  )
                                }
                                className={`p-3 rounded-full ${
                                  msg.starred 
                                    ? "text-yellow-500 bg-yellow-50" 
                                    : "text-gray-400 hover:text-yellow-500 hover:bg-gray-100"
                                }`}
                                title={msg.starred ? "Unstar" : "Star"}
                              >
                                <FaStar className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() =>
                                  markThreadAs(
                                    selectedThread,
                                    "important",
                                    !msg.important,
                                  )
                                }
                                className={`p-3 rounded-full ${
                                  msg.important 
                                    ? "text-red-500 bg-red-50" 
                                    : "text-gray-400 hover:text-red-500 hover:bg-gray-100"
                                }`}
                                title={
                                  msg.important
                                    ? "Mark as not important"
                                    : "Mark as important"
                                }
                              >
                                <FaExclamationCircle className="w-5 h-5" />
                              </button>
                            </div>
                            <span className="text-sm text-gray-500 bg-gray-100 px-4 py-2 rounded-full font-medium flex items-center gap-1">
                              <FaComments className="w-4 h-4" />
                              Message {i + 1} of {messages.length}
                            </span>
                            <p className="text-gray-400 mt-3 font-medium flex items-center gap-1">
                              <FaClock className="w-4 h-4" />
                              {formatDateTime(msg.date)}
                            </p>
                          </div>
                        </div>

                        {/* Attachments */}
                        {msg.hasAttachments &&
                          msg.attachments &&
                          msg.attachments.length > 0 && (
                            <div className="mb-6 p-6 bg-gray-50 rounded-xl border border-gray-200">
                              <h5 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-3">
                                <FaPaperclip className="w-5 h-5" />
                                Attachments ({msg.attachments.length})
                              </h5>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {msg.attachments.map((attachment, idx) => (
                                  <div
                                    key={idx}
                                    className="flex items-center justify-between p-4 bg-white rounded-lg border hover:bg-gray-50 transition duration-200"
                                  >
                                    <div className="flex items-center gap-4 flex-1 min-w-0">
                                      <span className="text-gray-600">
                                        {getFileIcon({
                                          type: attachment.mimeType,
                                          filename: attachment.filename,
                                        })}
                                      </span>
                                      <div className="flex-1 min-w-0">
                                        <p className="text-base font-medium text-gray-900 truncate">
                                          {attachment.filename}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                          {formatFileSize(attachment.size)}
                                        </p>
                                      </div>
                                    </div>
                                    <button
                                      onClick={() =>
                                        downloadAttachment(msg.id, attachment)
                                      }
                                      className="ml-3 text-blue-600 hover:text-blue-800 text-sm bg-blue-50 px-4 py-2.5 rounded-lg flex items-center gap-2 transition duration-200 hover:bg-blue-100 font-medium"
                                    >
                                      <FaDownload className="w-4 h-4" />
                                      Download
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                        <div className="bg-gray-50 p-8 rounded-xl border border-gray-200">
                          <div className="prose prose-lg max-w-none">
                            {msg.htmlBody ? (
                              <div
                                className="text-gray-900 leading-relaxed"
                                dangerouslySetInnerHTML={{
                                  __html: msg.htmlBody,
                                }}
                              />
                            ) : (
                              <pre className="text-gray-900 whitespace-pre-wrap leading-relaxed font-sans text-base">
                                {msg.body || "No content available"}
                              </pre>
                            )}
                          </div>
                        </div>

                        <div className="flex justify-end mt-6 space-x-3">
                          <button
                            onClick={() => openComposeForReply(msg, "reply")}
                            className="text-base bg-blue-600 text-white px-5 py-2.5 rounded-lg border border-blue-700 hover:bg-blue-700 flex items-center gap-2 transition duration-200 shadow-sm"
                          >
                            <FaReply className="w-5 h-5" />
                            Reply
                          </button>
                          <button
                            onClick={() => openComposeForReply(msg, "replyAll")}
                            className="text-base bg-gray-200 text-gray-700 px-5 py-2.5 rounded-lg border border-gray-300 hover:bg-gray-300 flex items-center gap-2 transition duration-200"
                          >
                            <FaReplyAll className="w-5 h-5" />
                            Reply All
                          </button>
                          <button
                            onClick={() => openComposeForReply(msg, "forward")}
                            className="text-base bg-gray-200 text-gray-700 px-5 py-2.5 rounded-lg border border-gray-300 hover:bg-gray-300 flex items-center gap-2 transition duration-200"
                          >
                            <FaForward className="w-5 h-5" />
                            Forward
                          </button>
                          <button
                            onClick={() =>
                              markThreadAs(selectedThread, "trash")
                            }
                            className="text-base bg-red-600 text-white px-5 py-2.5 rounded-lg border border-red-700 hover:bg-red-700 flex items-center gap-2 transition duration-200"
                          >
                            <FaTrash className="w-5 h-5" />
                            Trash
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmailChat;