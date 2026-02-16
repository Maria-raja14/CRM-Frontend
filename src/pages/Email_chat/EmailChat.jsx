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

// ============= ONLY NECESSARY ICONS =============
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
  FaCheckCircle,
  FaChevronLeft,
  FaUser,
  FaSignOutAlt,
  FaClock,
  FaPaperPlane as FaPaperPlaneIcon,
  FaSpinner,
  FaEnvelopeOpen,
  FaEnvelope,
  FaCog,
  FaFilter,
  FaCheckSquare,
  FaAt,
  FaSave,
  FaInfoCircle,
  FaComments,
  FaImage,
  FaFilePdf,
  FaFileAudio,
  FaFileVideo,
  FaFileArchive,
  FaFile,
  FaFileExcel,
  FaFileCode,
  FaUsers,
} from "react-icons/fa";

// Only keep the icons you actually use
import {
  MdClose,
  MdArrowBack,
} from "react-icons/md";

// ============= PERSISTENT STORAGE KEYS =============
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
};

// ============= HELPER FUNCTIONS FOR PERSISTENT STORAGE =============
const saveToStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error(`Failed to save ${key} to localStorage:`, e);
  }
};

const loadFromStorage = (key, defaultValue) => {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : defaultValue;
  } catch (e) {
    console.error(`Failed to load ${key} from localStorage:`, e);
    return defaultValue;
  }
};

const EmailChat = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // ============= PERSISTENT STATE - LOADED FROM LOCALSTORAGE =============
  const [threadsCache, setThreadsCache] = useState(() =>
    loadFromStorage(STORAGE_KEYS.THREADS_CACHE, {
      INBOX: [],
      UNREAD: [],
      STARRED: [],
      IMPORTANT: [],
      SENT: [],
      SPAM: [],
      TRASH: [],
      DRAFTS: [],
    })
  );

  const [nextPageTokenCache, setNextPageTokenCache] = useState(() =>
    loadFromStorage(STORAGE_KEYS.PAGE_TOKENS, {})
  );

  const [totalEmailsCache, setTotalEmailsCache] = useState(() =>
    loadFromStorage(STORAGE_KEYS.TOTAL_COUNTS, {})
  );

  const [actualCounts, setActualCounts] = useState(() =>
    loadFromStorage(STORAGE_KEYS.ACTUAL_COUNTS, {
      INBOX: 0,
      UNREAD: 0,
      STARRED: 0,
      IMPORTANT: 0,
      SENT: 0,
      SPAM: 0,
      TRASH: 0,
      DRAFTS: 0,
    })
  );

  const [activeLabel, setActiveLabel] = useState(() =>
    loadFromStorage(STORAGE_KEYS.ACTIVE_LABEL, "INBOX")
  );

  const [lastFetchTime, setLastFetchTime] = useState(() =>
    loadFromStorage(STORAGE_KEYS.LAST_FETCH_TIME, {})
  );

  const [authStatus, setAuthStatus] = useState(() =>
    loadFromStorage(STORAGE_KEYS.AUTH_STATUS, {
      authenticated: false,
      message: "",
    })
  );

  const [userEmail, setUserEmail] = useState(() =>
    loadFromStorage(STORAGE_KEYS.USER_EMAIL, "")
  );

  const [selectedThread, setSelectedThread] = useState(() =>
    loadFromStorage(STORAGE_KEYS.SELECTED_THREAD, null)
  );

  const [messages, setMessages] = useState(() =>
    loadFromStorage(STORAGE_KEYS.MESSAGES, [])
  );

  // ============= UI STATE (NOT PERSISTED) =============
  const [loading, setLoading] = useState(false);
  const [loadingLabel, setLoadingLabel] = useState(null);
  const [error, setError] = useState("");
  const [authUrl, setAuthUrl] = useState("");
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
  const [labels, setLabels] = useState([]);
  const [composeMode, setComposeMode] = useState("new");
  const [emailSuggestions, setEmailSuggestions] = useState([]);
  const [sendingProgress, setSendingProgress] = useState(0);
  const [selectedThreads, setSelectedThreads] = useState(new Set());
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [isSelectAll, setIsSelectAll] = useState(false);
  const [forceUpdate, setForceUpdate] = useState(0);
  const [isRefreshingCounts, setIsRefreshingCounts] = useState(false);

  const fileInputRef = useRef(null);
  const initialLoadDone = useRef(false);
  const abortControllerRef = useRef(null);
  const refreshIntervalRef = useRef(null);

  // API Base URL
  const API_BASE_URL =
    import.meta.env.VITE_API_URL || "http://localhost:5000/api";
  const SI_URI = import.meta.env.VITE_SI_URI || "http://localhost:5000";

  // ============= PERSIST STATE TO LOCALSTORAGE =============
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.THREADS_CACHE, threadsCache);
  }, [threadsCache]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.PAGE_TOKENS, nextPageTokenCache);
  }, [nextPageTokenCache]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.TOTAL_COUNTS, totalEmailsCache);
  }, [totalEmailsCache]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.ACTUAL_COUNTS, actualCounts);
  }, [actualCounts]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.ACTIVE_LABEL, activeLabel);
  }, [activeLabel]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.LAST_FETCH_TIME, lastFetchTime);
  }, [lastFetchTime]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.AUTH_STATUS, authStatus);
  }, [authStatus]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.USER_EMAIL, userEmail);
  }, [userEmail]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.SELECTED_THREAD, selectedThread);
  }, [selectedThread]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.MESSAGES, messages);
  }, [messages]);

  // ============= AUTO REFRESH COUNTS EVERY 30 SECONDS =============
  useEffect(() => {
    if (authStatus.authenticated) {
      // Only fetch counts if we don't have recent data (within last 5 seconds)
      const lastCountFetch = lastFetchTime.counts || 0;
      if (Date.now() - lastCountFetch > 5000) {
        fetchAllCountsFast();
      }

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

  // ============= INITIAL LOAD - ONLY CHECK AUTH IF NEEDED =============
  useEffect(() => {
    if (!initialLoadDone.current) {
      initialLoadDone.current = true;
      
      // Only check auth status if we don't have cached auth or it's expired
      const cachedAuth = loadFromStorage(STORAGE_KEYS.AUTH_STATUS, { authenticated: false });
      
      if (!cachedAuth.authenticated || !authStatus.authenticated) {
        checkAuthStatus();
      } else {
        console.log("✅ Using cached authentication status");
        // Still fetch counts in background to ensure fresh data
        fetchAllCountsFast();
      }
    }
  }, []);

  // ============= FETCH LABELS AND COUNTS =============
  useEffect(() => {
    if (authStatus.authenticated && labels.length === 0) {
      fetchLabels();
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
        
        // Update last fetch time for counts
        setLastFetchTime((prev) => ({
          ...prev,
          counts: Date.now(),
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

  // ============= OPTIMIZED THREAD FETCHING WITH SMART CACHING =============
  const fetchThreads = async (
    label = activeLabel,
    loadMore = false,
    forceRefresh = false,
  ) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    // Check cache first - don't show loading if we have cached data
    const cachedThreads = threadsCache[label];
    const cacheAge = lastFetchTime[label]
      ? Date.now() - lastFetchTime[label]
      : Infinity;

    // Use cached data if it's fresh (less than 2 minutes old) and not forcing refresh
    if (!forceRefresh && !loadMore && cachedThreads && cachedThreads.length > 0 && cacheAge < 120000) {
      console.log(
        `✅ Using cached threads for ${label} (${cachedThreads.length} threads, ${Math.round(cacheAge / 1000)}s old)`,
      );
      setForceUpdate((prev) => prev + 1);
      return;
    }

    setLoading(true);
    setLoadingLabel(label);
    setError("");

    try {
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
        
        setLastFetchTime((prev) => ({
          ...prev,
          DRAFTS: Date.now(),
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

      // Clear all localStorage
      Object.values(STORAGE_KEYS).forEach((key) => {
        localStorage.removeItem(key);
      });

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

  // ✅ COMPREHENSIVE FILE ICON HANDLER
  const getFileIcon = (file) => {
    if (file.type) {
      if (file.type.startsWith("image/"))
        return <FaImage className="w-5 h-5 text-blue-500" />;
      if (file.type.includes("pdf"))
        return <FaFilePdf className="w-5 h-5 text-red-500" />;
      if (file.type.includes("audio"))
        return <FaFileAudio className="w-5 h-5 text-purple-500" />;
      if (file.type.includes("video"))
        return <FaFileVideo className="w-5 h-5 text-pink-500" />;
      if (
        file.type.includes("zip") ||
        file.type.includes("rar") ||
        file.type.includes("tar")
      )
        return <FaFileArchive className="w-5 h-5 text-yellow-600" />;
      if (file.type.includes("word") || file.type.includes("document"))
        return <FaFileAlt className="w-5 h-5 text-blue-700" />;
      if (file.type.includes("excel") || file.type.includes("spreadsheet"))
        return <FaFileExcel className="w-5 h-5 text-green-600" />;
      if (file.type.includes("text"))
        return <FaFileAlt className="w-5 h-5 text-gray-600" />;
    }

    const fileName = file.name || file.filename || "";
    const extension = fileName.split(".").pop().toLowerCase();

    const imageExtensions = [
      "jpg",
      "jpeg",
      "png",
      "gif",
      "svg",
      "webp",
      "bmp",
      "ico",
    ];
    if (imageExtensions.includes(extension)) {
      return <FaImage className="w-5 h-5 text-blue-500" />;
    }

    const pdfExtensions = ["pdf"];
    if (pdfExtensions.includes(extension)) {
      return <FaFilePdf className="w-5 h-5 text-red-500" />;
    }

    const audioExtensions = ["mp3", "wav", "ogg", "flac", "aac", "m4a"];
    if (audioExtensions.includes(extension)) {
      return <FaFileAudio className="w-5 h-5 text-purple-500" />;
    }

    const videoExtensions = ["mp4", "avi", "mov", "wmv", "flv", "mkv", "webm"];
    if (videoExtensions.includes(extension)) {
      return <FaFileVideo className="w-5 h-5 text-pink-500" />;
    }

    const archiveExtensions = ["zip", "rar", "7z", "tar", "gz", "bz2"];
    if (archiveExtensions.includes(extension)) {
      return <FaFileArchive className="w-5 h-5 text-yellow-600" />;
    }

    const docExtensions = ["doc", "docx", "txt", "rtf", "md", "odt"];
    if (docExtensions.includes(extension)) {
      return <FaFileAlt className="w-5 h-5 text-blue-700" />;
    }

    const spreadsheetExtensions = ["xls", "xlsx", "csv", "ods"];
    if (spreadsheetExtensions.includes(extension)) {
      return <FaFileExcel className="w-5 h-5 text-green-600" />;
    }

    const presentationExtensions = ["ppt", "pptx", "odp"];
    if (presentationExtensions.includes(extension)) {
      return <FaFileExcel className="w-5 h-5 text-orange-600" />;
    }

    const codeExtensions = [
      "js",
      "jsx",
      "ts",
      "tsx",
      "html",
      "css",
      "py",
      "java",
      "cpp",
      "c",
      "rb",
      "php",
      "go",
      "rs",
      "json",
      "xml",
    ];
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
      const errorMsg =
        err.response?.data?.error || err.message || "Failed to send email";
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
          UNREAD: value ? Math.max(0, prev.UNREAD - 1) : prev.UNREAD + 1,
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
              (t) => t.id === threadId
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
              (t) => t.id !== threadId
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
            (thread) => !selectedThreads.has(thread.id)
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
            `⭐ ${value ? "Starred" : "Unstarred"} ${threadIds.length} emails`
          );
          break;

        case "delete":
          const deleteRes = await axios.post(
            `${API_BASE_URL}/gmail/bulk-delete`,
            { threadIds, permanent: activeLabel === "TRASH" }
          );
          toast.success(`🗑️ ${deleteRes.data.message}`);
          break;

        case "read":
          await Promise.all(
            threadIds.map((threadId) =>
              axios.post(`${API_BASE_URL}/gmail/thread/${threadId}/read`, {
                read: value,
              })
            )
          );
          toast.success(
            `Marked ${threadIds.length} emails as ${value ? "read" : "unread"}`
          );
          break;

        case "trash":
          await Promise.all(
            threadIds.map((threadId) =>
              axios.post(`${API_BASE_URL}/gmail/thread/${threadId}/trash`)
            )
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
          : "🗑️ Thread moved to trash"
      );

      setThreadsCache((prev) => ({
        ...prev,
        [activeLabel]: (prev[activeLabel] || []).filter(
          (thread) => thread.id !== threadId
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
        return `${diffDays}d ago (${date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        })} at ${timeStr})`;

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
        { responseType: "blob" }
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

  // ============= LABEL CLICK HANDLER WITH SMART CACHING =============
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
      // Check if we have recent cached drafts
      const cachedDrafts = threadsCache.DRAFTS || [];
      const cacheAge = lastFetchTime.DRAFTS
        ? Date.now() - lastFetchTime.DRAFTS
        : Infinity;

      if (cachedDrafts.length > 0 && cacheAge < 120000) {
        console.log(
          `✅ Using cached drafts (${cachedDrafts.length} drafts, ${Math.round(cacheAge / 1000)}s old)`
        );
        setForceUpdate((prev) => prev + 1);
      } else {
        await fetchDrafts();
      }
    } else {
      const cachedThreads = threadsCache[label.id];
      const cacheAge = lastFetchTime[label.id]
        ? Date.now() - lastFetchTime[label.id]
        : Infinity;

      if (cachedThreads && cachedThreads.length > 0 && cacheAge < 120000) {
        console.log(
          `✅ Using cached threads for ${label.id} (${cachedThreads.length} threads, ${Math.round(cacheAge / 1000)}s old)`
        );
        setForceUpdate((prev) => prev + 1);

        // Silently fetch fresh data in background if cache is older than 30 seconds
        if (cacheAge > 30000) {
          setTimeout(() => {
            fetchThreads(label.id, false, true);
          }, 100);
        }
      } else {
        await fetchThreads(label.id, false, false);
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
    {
      id: "INBOX",
      name: "Inbox",
      icon: <FaInbox className="w-5 h-5" />,
      count: actualCounts.INBOX,
    },
    {
      id: "UNREAD",
      name: "Unread",
      icon: <FaEnvelope className="w-5 h-5" />,
      count: actualCounts.UNREAD,
    },
    {
      id: "STARRED",
      name: "Starred",
      icon: <FaStar className="w-5 h-5" />,
      count: actualCounts.STARRED,
    },
    {
      id: "IMPORTANT",
      name: "Important",
      icon: <FaExclamationCircle className="w-5 h-5" />,
      count: actualCounts.IMPORTANT,
    },
    {
      id: "DRAFTS",
      name: "Drafts",
      icon: <FaFileAlt className="w-5 h-5" />,
      count: actualCounts.DRAFTS,
    },
    {
      id: "SENT",
      name: "Sent",
      icon: <FaPaperPlane className="w-5 h-5" />,
      count: actualCounts.SENT,
    },
    {
      id: "SPAM",
      name: "Spam",
      icon: <FaExclamationTriangle className="w-5 h-5" />,
      count: actualCounts.SPAM,
    },
    {
      id: "TRASH",
      name: "Trash",
      icon: <FaTrash className="w-5 h-5" />,
      count: actualCounts.TRASH,
    },
  ];

  const renderLabelIcon = (thread) => {
    if (thread.starred) return <FaStar className="w-5 h-5 text-yellow-500" />;
    if (thread.important)
      return <FaExclamationCircle className="w-5 h-5 text-red-500" />;
    if (thread.spam)
      return <FaExclamationTriangle className="w-5 h-5 text-orange-500" />;
    if (thread.trash) return <FaTrash className="w-5 h-5 text-gray-500" />;
    if (thread.drafts) return <FaFileAlt className="w-5 h-5 text-gray-500" />;
    if (thread.unread) return <FaEnvelope className="w-5 h-5 text-blue-500" />;
    return <FaEnvelopeOpen className="w-5 h-5 text-gray-500" />;
  };

  // ============= LOADING STATE - ONLY SHOW IF NO CACHED DATA =============
  if (loading && !authStatus.authenticated && !error && currentThreads.length === 0) {
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
              You are about to disconnect your Gmail account. This will remove
              all cached emails and you'll need to reconnect to access your
              emails again.
            </p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-yellow-800 flex items-start gap-2">
                <FaInfoCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>
                  Your emails are stored in Google servers and won't be
                  deleted. You can reconnect at any time to access them again.
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
                    setComposeData((prev) => ({
                      ...prev,
                      bcc: e.target.value,
                    }))
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
                        <span className="text-gray-600">
                          {getFileIcon(file)}
                        </span>
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
              <div
                className={`w-16 h-16 ${threadToDelete?.permanent ? "bg-red-100" : "bg-orange-100"} rounded-full flex items-center justify-center`}
              >
                {threadToDelete?.permanent ? (
                  <FaExclamationTriangle className="w-8 h-8 text-red-600" />
                ) : (
                  <FaTrash className="w-8 h-8 text-orange-600" />
                )}
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
              {threadToDelete?.permanent
                ? "Delete Permanently?"
                : "Move to Trash?"}
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
                        {activeLabel === "INBOX" && (
                          <FaInbox className="w-6 h-6" />
                        )}
                        {activeLabel === "UNREAD" && (
                          <FaEnvelope className="w-6 h-6" />
                        )}
                        {activeLabel === "STARRED" && (
                          <FaStar className="w-6 h-6" />
                        )}
                        {activeLabel === "IMPORTANT" && (
                          <FaExclamationCircle className="w-6 h-6" />
                        )}
                        {activeLabel === "DRAFTS" && (
                          <FaFileAlt className="w-6 h-6" />
                        )}
                        {activeLabel === "SENT" && (
                          <FaPaperPlane className="w-6 h-6" />
                        )}
                        {activeLabel === "SPAM" && (
                          <FaExclamationTriangle className="w-6 h-6" />
                        )}
                        {activeLabel === "TRASH" && (
                          <FaTrash className="w-6 h-6" />
                        )}
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
                      {activeLabel === "INBOX" && (
                        <FaInbox className="w-5 h-5" />
                      )}
                      {activeLabel === "UNREAD" && (
                        <FaEnvelope className="w-5 h-5" />
                      )}
                      {activeLabel === "STARRED" && (
                        <FaStar className="w-5 h-5" />
                      )}
                      {activeLabel === "IMPORTANT" && (
                        <FaExclamationCircle className="w-5 h-5" />
                      )}
                      {activeLabel === "DRAFTS" && (
                        <FaFileAlt className="w-5 h-5" />
                      )}
                      {activeLabel === "SENT" && (
                        <FaPaperPlane className="w-5 h-5" />
                      )}
                      {activeLabel === "SPAM" && (
                        <FaExclamationTriangle className="w-5 h-5" />
                      )}
                      {activeLabel === "TRASH" && (
                        <FaTrash className="w-5 h-5" />
                      )}
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
                                        !thread.starred
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
                                        activeLabel === "TRASH"
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
            /* Email Detail View - KEEPING THE REST OF YOUR EXISTING CODE */
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
                              activeLabel === "TRASH"
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
                                    !msg.starred
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
                                    !msg.important
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
                            onClick={() =>
                              openComposeForReply(msg, "replyAll")
                            }
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

export default EmailChat;//all work correctly