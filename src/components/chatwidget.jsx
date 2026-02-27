import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import VoiceButton from './VoiceMicButton';
import {
  Phone,
  MessageCircle,
  PhoneCall,
  X,
  Send,
  Clock,
  CheckCircle,
  AlertCircle,
  Mic,
  User,
  Briefcase,
  Calendar
} from 'lucide-react';

import { toast } from 'react-hot-toast';

// Logo Component - Updated with Motion Robot
const AILogo = ({ size = "medium" }) => {
  const sizes = {
    micro: "w-3 h-3",
    xsmall: "w-4 h-4",
    small: "w-8 h-8",
    medium: "w-10 h-10",
    large: "w-12 h-12"
  };

  // Different robot dimensions for each size
  const robotDimensions = {
    micro: {
      headWidth: "w-4",
      headHeight: "h-3",
      bodyWidth: "w-4",
      bodyHeight: "h-2",
      eyeSize: "w-1 h-1",
      armWidth: "w-3",
      armheight: "h-2",
      buttonSize: "w-0.5 h-0.5",
      wheelWidth: "w-0.5",
      wheelHeight: "h-0.5",
      antennaTop: "-top-2",
      antennaSize: "w-0.5 h-1",
      antennaDotSize: "w-1 h-0.5",
      antennaDotTop: "-top-1.5",
      eyeSpace: "space-x-0.5",
      buttonSpace: "space-x-0.5",
      wheelSpace: "space-x-1"
    },
    xsmall: {
      headWidth: "w-4",
      headHeight: "h-3",
      bodyWidth: "w-4",
      bodyHeight: "h-3",
      eyeSize: "w-1 h-1",
      armWidth: "w-1.5",
      armHeight: "h-0.5",
      buttonSize: "w-0.5 h-0.5",
      wheelWidth: "w-1",
      wheelHeight: "h-0.5",
      antennaTop: "-top-1",
      antennaSize: "w-0.5 h-1",
      antennaDotSize: "w-0.5 h-0.5",
      antennaDotTop: "-top-2",
      eyeSpace: "space-x-1",
      buttonSpace: "space-x-0.5",
      wheelSpace: "space-x-2"
    },
    small: {
      headWidth: "w-5",
      headHeight: "h-3",
      bodyWidth: "w-5",
      bodyHeight: "h-3",
      eyeSize: "w-1 h-1",
      armWidth: "w-1.5",
      armHeight: "h-0.5",
      buttonSize: "w-0.5 h-0.5",
      wheelWidth: "w-1",
      wheelHeight: "h-0.5",
      antennaTop: "-top-1",
      antennaSize: "w-0.5 h-1",
      antennaDotSize: "w-0.5 h-0.5",
      antennaDotTop: "-top-2",
      eyeSpace: "space-x-1.5",
      buttonSpace: "space-x-1",
      wheelSpace: "space-x-2"
    },
    medium: {
      headWidth: "w-6",
      headHeight: "h-3",
      bodyWidth: "w-6",
      bodyHeight: "h-4",
      eyeSize: "w-1.5 h-1.5",
      armWidth: "w-2",
      armHeight: "h-0.5",
      buttonSize: "w-0.5 h-0.5",
      wheelWidth: "w-1",
      wheelHeight: "h-0.5",
      antennaTop: "-top-1.5",
      antennaSize: "w-0.5 h-1.5",
      antennaDotSize: "w-0.5 h-0.5",
      antennaDotTop: "-top-3",
      eyeSpace: "space-x-2",
      buttonSpace: "space-x-1",
      wheelSpace: "space-x-3"
    },
    large: {
      headWidth: "w-6",
      headHeight: "h-4",
      bodyWidth: "w-6",
      bodyHeight: "h-5",
      eyeSize: "w-2 h-2",
      armWidth: "w-3",
      armHeight: "h-0.5",
      buttonSize: "w-3 h-1",
      wheelWidth: "w-2",
      wheelHeight: "h-1",
      antennaTop: "-top-2",
      antennaSize: "w-0.5 h-1.5",
      antennaDotSize: "w-2 h-2",
      antennaDotTop: "-top-4",
      eyeSpace: "space-x-2.6",
      buttonSpace: "space-x-1",
      wheelSpace: "space-x-1"
    }
  };

  const dim = robotDimensions[size] || robotDimensions.medium;

  return (
    <div className={`${sizes[size]} relative`}>
      {/* Outer gradient ring with animation */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-full p-0.5 animate-spin-slow">
        <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
          {/* Robot body */}
          <div className="relative">
            {/* Robot head */}
            <div className={`${dim.headWidth} ${dim.headHeight} bg-gradient-to-r from-blue-600 to-purple-600 rounded-t-lg relative`}>
              {/* Robot antenna */}
              <div className={`absolute ${dim.antennaTop} left-1/2 transform -translate-x-1/2 ${dim.antennaSize} bg-purple-400`}></div>
              <div className={`absolute ${dim.antennaDotTop} left-1/2 transform -translate-x-1/2 ${dim.antennaDotSize} bg-purple-300 rounded-full animate-pulse`}></div>

              {/* Robot eyes with motion */}
              <div className={`flex justify-center ${dim.eyeSpace} pt-1`}>
                <div className={`${dim.eyeSize} bg-white rounded-full relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-blue-300 rounded-full animate-ping opacity-75"></div>
                </div>
                <div className={`${dim.eyeSize} bg-white rounded-full relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-blue-300 rounded-full animate-ping opacity-75`" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>

            {/* Robot body with moving arms */}
            <div className={`${dim.bodyWidth} ${dim.bodyHeight} bg-gradient-to-r from-purple-600 to-pink-600 rounded-b-lg relative`}>
              {/* Left arm - moving */}
              <div className={`absolute -left-2 top-1 ${dim.armWidth} ${dim.armHeight} bg-gradient-to-r from-blue-500 to-purple-500 rounded-l-full animate-arm-wave-left`}></div>
              {/* Right arm - moving */}
              <div className={`absolute -right-2 top-1 ${dim.armWidth} ${dim.armHeight} bg-gradient-to-l from-pink-500 to-purple-500 rounded-r-full animate-arm-wave-right`}></div>

              {/* Robot controls/buttons */}
              <div className={`flex justify-center ${dim.buttonSpace} pt-1`}>
                <div className={`${dim.buttonSize} bg-green-400 rounded-full animate-pulse`} style={{ animationDelay: '0s' }}></div>
                <div className={`${dim.buttonSize} bg-yellow-400 rounded-full animate-pulse`} style={{ animationDelay: '0.3s' }}></div>
                <div className={`${dim.buttonSize} bg-red-400 rounded-full animate-pulse`} style={{ animationDelay: '0.6s' }}></div>
              </div>
            </div>

            {/* Robot base/wheels */}
            <div className={`flex justify-center ${dim.wheelSpace} mt-0.5`}>
              <div className={`${dim.wheelWidth} ${dim.wheelHeight} bg-gray-400 rounded-full animate-spin-slow`}></div>
              <div className={`${dim.wheelWidth} ${dim.wheelHeight} bg-gray-400 rounded-full animate-spin-slow`} style={{ animationDirection: 'reverse' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Glow effect - only for medium and large sizes */}
      {(size === 'medium' || size === 'large') && (
        <div className="absolute -inset-2 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-full blur-md opacity-30 animate-pulse"></div>
      )}

      {/* Motion trail effect - only for medium and large sizes */}
      {(size === 'medium' || size === 'large') && (
        <div className="absolute -right-1 top-1/2 transform -translate-y-1/2">
          <div className="flex space-x-0.5">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="w-0.5 h-0.5 bg-blue-300 rounded-full animate-trail"
                style={{ animationDelay: `${i * 0.1}s` }}
              ></div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm Zia, your Sales AI Assistant 🤖. I can help you with deals, leads, users, and analytics. Try asking me anything about your CRM data!!",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [expandedMessageId, setExpandedMessageId] = useState(null);
  const [suggestions, setSuggestions] = useState([]);

  //CALL TRACKING STATES
  const [callInProgress, setCallInProgress] = useState(null);
  const [showCallOptions, setShowCallOptions] = useState(false);
  const [liveDuration, setLiveDuration] = useState(0);
  const [sessionId, setSessionId] = useState(null);
  const [callStartTime, setCallStartTime] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const timerRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus();
    }
  }, [isOpen, isMinimized]);

  // AUTO-TRACKING: Visibility change detection
  useEffect(() => {
    const handleVisibilityChange = async () => {
      if (!callInProgress || !sessionId) return;

      if (document.visibilityState === 'hidden') {
        // User left the tab - call started
        console.log('📞 Call started - user left tab');
        try {
          await fetch(`http://localhost:5000/api/calllogs/track/${sessionId}/start`);
          setCallStartTime(Date.now());

          // Start local timer
          timerRef.current = setInterval(() => {
            setLiveDuration(prev => prev + 1);
          }, 1000);

        } catch (error) {
          console.error('Failed to track call start:', error);
        }

      } else if (document.visibilityState === 'visible' && callStartTime) {
        // User returned to tab - call ended
        console.log('📞 Call ended - user returned to tab');
        try {
          const response = await fetch(`http://localhost:5000/api/calllogs/track/${sessionId}/end`);
          const data = await response.json();

          if (data.success) {
            // Stop timer
            if (timerRef.current) {
              clearInterval(timerRef.current);
            }

            // Add completion message
            const durationMsg = {
              id: Date.now(),
              text: `✅ Call completed automatically! Duration: ${formatDuration(data.duration)}`,
              sender: 'bot',
              timestamp: new Date(),
              autoTracked: true,
              duration: data.duration
            };
            setMessages(prev => [...prev, durationMsg]);

            toast.success(`Call completed - ${formatDuration(data.duration)}`);

            // Clear call state
            setCallInProgress(null);
            setShowCallOptions(false);
            setSessionId(null);
            setCallStartTime(null);
            setLiveDuration(0);
          }
        } catch (error) {
          console.error('Failed to track call end:', error);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [callInProgress, sessionId, callStartTime]);

  const toggleExpand = (messageId) => {
    setExpandedMessageId(expandedMessageId === messageId ? null : messageId);
  };

  // Format duration helper
  const formatDuration = (seconds) => {
    if (!seconds) return '0s';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  };

  // Handle call command
  const handleCallCommand = async (command) => {
    if (!command.toLowerCase().startsWith('call ')) return false;

    const searchTerm = command.substring(5).trim();
    if (!searchTerm) {
      toast.error('Please specify a lead or company name (e.g., "call John Doe")');
      return true;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user') || '{}');

      if (!token) {
        toast.error('Please login first');
        return true;
      }

      const response = await fetch('http://localhost:5000/api/bot/command', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ command })
      });

      const result = await response.json();

      if (result.success) {
        // Store session ID for tracking
        setSessionId(result.callLog?.sessionId);

        // Add bot message
        const botMsg = {
          id: Date.now(),
          text: result.message,
          sender: 'bot',
          timestamp: new Date(),
          callData: result
        };
        setMessages(prev => [...prev, botMsg]);

        // Show call options
        setCallInProgress(result);
        setShowCallOptions(true);

        // Auto-open WhatsApp after 1 second
        setTimeout(() => {
          window.open(result.whatsappUrl, '_blank');
          toast.success('Opening WhatsApp...');
        }, 1000);

      } else {
        // Handle different error scenarios
        let errorMessage = result.message;

        if (result.message.includes("No assigned lead")) {
          errorMessage = "⚠️ You can only call leads assigned to you. Try searching for your assigned leads.";
        } else if (result.message.includes("don't have permission")) {
          errorMessage = "⚠️ You don't have permission to call this lead. It may be assigned to another salesperson.";
        }

        toast.error(errorMessage);

        // Add error message to chat
        const errorMsg = {
          id: Date.now(),
          text: errorMessage,
          sender: 'bot',
          timestamp: new Date(),
          isError: true
        };
        setMessages(prev => [...prev, errorMsg]);
      }
    } catch (error) {
      console.error('Call command error:', error);
      toast.error('Failed to process call command');
    } finally {
      setLoading(false);
    }

    return true;
  };

  // Add function to fetch user's suggestions
  const fetchSuggestions = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/bot/suggestions', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (data.success) {
        setSuggestions(data.suggestions);
        // You can show a message about their role
        if (data.role !== 'Admin') {
          console.log('Showing only your assigned leads');
        }
      }
    } catch (error) {
      console.error('Failed to fetch suggestions:', error);
    }
  };

  // Call this when component mounts and after successful login
  useEffect(() => {
    if (localStorage.getItem('token')) {
      fetchSuggestions();
    }
  }, []);

  // ===== ADDED: Navigation function - ONLY triggers for explicit navigation commands =====
  const handleNavigation = (text) => {
    const lowerText = text.toLowerCase().trim();

    // Define navigation commands and their corresponding routes
    const navigationRoutes = {
      'dashboard': '/admindashboard',
      'admin dashboard': '/admindashboard',
      'home': '/admindashboard',
      // Users & Roles - ADD THESE
      'users and roles': '/users/roles',
      'user': '/users',
      'roles': '/roles',
      'role': '/roles',

      'leads': '/leads',
      'deals': '/deals',
      'invoices': '/invoices',
      'invoice': '/invoices',

      'proposals': '/proposals',
      'proposal': '/proposals',
      'streak': '/streak-leaderboard',
      'streak leaderboard': '/streak-leaderboard',
      'leaderboard': '/streak-leaderboard',
      'reports': '/reports',
      'analytics': '/reports'
    };

    // Navigation action words - only these trigger navigation
    const navigationActions = ['go to', 'take me to', 'open', 'navigate to', 'show me', 'goto'];

    // Check if this is a navigation command
    const isNavigationCommand = navigationActions.some(action =>
      lowerText.startsWith(action) || lowerText.includes(` ${action} `)
    );

    // If not a navigation command, exit
    if (!isNavigationCommand) {
      return false;
    }

    // Check which page they want to go to
    for (const [page, route] of Object.entries(navigationRoutes)) {
      if (lowerText.includes(page)) {
        // Add navigation message
        const navMessage = {
          id: Date.now(),
          text: `🔍 Opening ${page} page...`,
          sender: 'bot',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, navMessage]);

        // Navigate
        setTimeout(() => {
          navigate(route);
          toast.success(`Opened ${page} page`);
        }, 500);

        return true;
      }
    }

    return false;
  };


  const sendMessage = async (text, forceGet = false) => {
    if (!text.trim()) return;

    // Check for navigation commands first - only triggers for explicit navigation like "open deals"
    if (handleNavigation(text)) {
      setInputText('');
      return;
    }

    // Check for call command first
    if (text.toLowerCase().startsWith('call ')) {
      await handleCallCommand(text);
      setInputText('');
      return;
    }

    // 1️⃣ User message
    setMessages(prev => [
      ...prev,
      {
        id: Date.now(),
        text,
        sender: "user",
        timestamp: new Date(),
      },
    ]);

    setInputText("");
    setLoading(true);
    setIsTyping(true);

    try {
      const token = localStorage.getItem("token");

      // 🚨 AUTH GUARD
      if (!token) {
        setIsTyping(false);
        setLoading(false);
        setMessages(prev => [
          ...prev,
          {
            id: Date.now(),
            text: "⚠️ Please login to use the ZIA PULSE CRM.",
            sender: "bot",
            timestamp: new Date(),
          },
        ]);
        return;
      }

      // yyyINTELLIGENT QUERY DETECTION
      let enhancedMessage = text;
      const lowerText = text.toLowerCase().trim();
      const words = text.split(' ').filter(w => w.length > 0);
      const originalWords = text.split(' ');

      // DEALS BY SALESPERSON
      if (lowerText.includes('deals by') || lowerText.includes('handled by') || lowerText.includes('assigned to')) {
        enhancedMessage = text;
        console.log("👤 Deals by salesperson:", enhancedMessage);
      }
      // LEADS BY SALESPERSON
      else if (lowerText.includes('leads by') || lowerText.includes('leads of')) {
        enhancedMessage = text;
        console.log("👤 Leads by salesperson:", enhancedMessage);
      }
      // SPECIFIC DEAL SEARCH
      else if (lowerText.startsWith('deal ') && !lowerText.includes('deals ')) {
        enhancedMessage = text;
        console.log("🔍 Specific deal search:", enhancedMessage);
      }
      // SPECIFIC LEAD SEARCH
      else if (lowerText.startsWith('lead ') && !lowerText.includes('leads ')) {
        enhancedMessage = text;
        console.log("🔍 Specific lead search:", enhancedMessage);
      }
      else if (lowerText.includes('deals won') || lowerText === 'won deals' ||
        (lowerText.includes('won') && lowerText.includes('deal'))) {
        enhancedMessage = 'deals won';
        console.log("🏆 Deals won");
      }
      else if (lowerText.includes('deals lost') || lowerText === 'lost deals' ||
        (lowerText.includes('lost') && lowerText.includes('deal'))) {
        enhancedMessage = 'deals lost';
        console.log("❌ Deals lost");
      }
      else if (lowerText.includes('open deals') || lowerText === 'deals open' ||
        (lowerText.includes('open') && lowerText.includes('deal'))) {
        enhancedMessage = 'open deals';
        console.log("📈 Open deals");
      }
      else if (lowerText.includes('my deals') || lowerText === 'my deals') {
        enhancedMessage = 'my deals';
        console.log("👑 My deals");
      }
      else if (lowerText.includes('hot leads') || lowerText === 'leads hot' ||
        (lowerText.includes('hot') && lowerText.includes('lead'))) {
        enhancedMessage = 'hot leads';
        console.log("🔥 Hot leads");
      }
      else if (lowerText.includes('warm leads') || lowerText === 'leads warm' ||
        (lowerText.includes('warm') && lowerText.includes('lead'))) {
        enhancedMessage = 'warm leads';
        console.log("🌡️ Warm leads");
      }
      else if (lowerText.includes('cold leads') || lowerText === 'leads cold' ||
        (lowerText.includes('cold') && lowerText.includes('lead'))) {
        enhancedMessage = 'cold leads';
        console.log("❄️ Cold leads");
      }
      else if (lowerText.includes('my leads') || lowerText === 'my leads') {
        enhancedMessage = 'my leads';
        console.log("👑 My leads");
      }
      else {
        // Check if it looks like a PERSON NAME (for salesperson search)
        const looksLikePersonName = (
          words.length >= 1 && words.length <= 3 &&
          originalWords.every(word => word.length > 0 && word[0] === word[0].toUpperCase()) &&
          !lowerText.includes('inc') && !lowerText.includes('corp') &&
          !lowerText.includes('ltd') && !lowerText.includes('llc')
        );

        // Check if it's a SINGLE WORD (most likely a company/deal name)
        const isSingleWord = words.length === 1;

        // Check if it contains NUMBERS (likely a deal/lead reference)
        const containsNumbers = /\d/.test(text);

        if (looksLikePersonName) {
          enhancedMessage = `deals by ${text}`;
          console.log("👤 Detected as person name →", enhancedMessage);
        }
        else if (isSingleWord || containsNumbers) {
          enhancedMessage = text;
          console.log("🏢 Searching by company name:", enhancedMessage);
        }
        else {
          enhancedMessage = text;
          console.log("📝 Sending as typed:", enhancedMessage);
        }
      }

      console.log("🔍 FINAL QUERY:", {
        original: text,
        enhanced: enhancedMessage
      });

      const payload = {
        message: enhancedMessage,
        currentPage: location.pathname,
      };

      const useGet = forceGet || enhancedMessage.length < 40;

      const response = await fetch(
        useGet
          ? `http://localhost:5000/api/ai/chat?${new URLSearchParams(payload)}`
          : `http://localhost:5000/api/ai/chat`,
        {
          method: useGet ? "GET" : "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            ...(useGet ? {} : { "Content-Type": "application/json" }),
          },
          body: useGet ? undefined : JSON.stringify(payload),
        }
      );

      const data = await response.json();

      // ⏳ Small natural delay 
      await new Promise(r => setTimeout(r, 500));

      // 2️⃣ STOP TYPING
      setIsTyping(false);

      // 3️⃣ Bot reply
      setMessages(prev => [
        ...prev,
        {
          id: Date.now(),
          text: data.message || "No response",
          sender: "bot",
          timestamp: new Date(),
          data: data.data || [],
          intent: data.intent,
        },
      ]);
    } catch (err) {
      setIsTyping(false);
      setMessages(prev => [
        ...prev,
        {
          id: Date.now(),
          text: "⚠️ Unable to connect to server.",
          sender: "bot",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(inputText, false);
  };

  // 🔥 QUICK ACTIONS with CALL option
  const quickActions = [
    { label: "📞 CALL", query: "call " },
    { label: "🏆 Deals Won", query: "deals won" },
    { label: "❌ Deals Lost", query: "deals lost" },
    { label: "📈 Open Deals", query: "open deals" },
    { label: "📋 Hot Leads", query: "hot leads" },
    { label: "🌡️ Warm Leads", query: "warm leads" },
    { label: "❄️ Cold Leads", query: "cold leads" },
  ];

  // Floating Logo Button (Minimized State)
  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 group"
        aria-label="Open AI Assistant"
      >
        {/* Logo with pulse animation */}
        <div className="relative">
          <AILogo size="large" />

          {/* Notification badge */}
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">AI</span>
          </div>

          {/* Tooltip */}
          <div className="absolute right-14 bottom-1/2 translate-y-1/2 bg-gray-900 text-white text-sm px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
            Ask ZIA CRM Assistant
            <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 rotate-45 w-2 h-2 bg-gray-900"></div>
          </div>
        </div>
      </button>
    );
  }

  // Minimized Window with Logo
  if (isMinimized) {
    return (
      <div className="fixed bottom-6 right-6 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50 animate-slide-up">
        <div
          className="p-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white cursor-pointer hover:bg-gradient-to-r hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
          onClick={() => setIsMinimized(false)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <AILogo size="medium" />
              <div>
                <h3 className="font-semibold text-sm">ZIA PULSE CRM</h3>
                <p className="text-xs text-blue-100 opacity-90">
                  {callInProgress ? 'Call in progress...' : 'Click to expand • Ready to help'}
                </p>
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(false);
              }}
              className="p-1 hover:bg-white/20 rounded"
              aria-label="Close"
            >
              ✕
            </button>
          </div>
        </div>

        <div
          className="p-4 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
          onClick={() => setIsMinimized(false)}
        >
          <div className="flex items-start space-x-2">
            <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
              <span className="text-blue-600 text-xs">AI</span>
            </div>
            <p className="text-sm text-gray-600 truncate">
              {callInProgress
                ? `📞 Call in progress... ${formatDuration(liveDuration)}`
                : messages[messages.length - 1]?.text || "How can I help you today?"}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Expanded Window
  return (
    <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-xl shadow-2xl border border-gray-200 flex flex-col z-50 animate-slide-up">
      {/* Header with Logo */}
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-xl">
        <div className="flex items-center space-x-3">
          <AILogo size="medium" />
          <div>
            <h3 className="font-semibold">ZIA PULSE CRM</h3>
            <p className="text-xs text-blue-100 opacity-90">
              {callInProgress ? 'Call tracking active' : 'Connected to your CRM dashboard'}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {/* Live call timer */}
          {callInProgress && (
            <div className="bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full text-xs flex items-center gap-1 mr-2">
              <Clock className="w-3 h-3 animate-pulse" />
              <span className="font-mono">{formatDuration(liveDuration)}</span>
            </div>
          )}
          <button
            onClick={() => setIsMinimized(true)}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            aria-label="Minimize"
            title="Minimize"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" />
            </svg>
          </button>
          <button
            onClick={() => {
              setMessages([{
                id: 1,
                text: "Hello! I'm your ZIA CRM Assistant. How can I help you today?",
                sender: 'bot',
                timestamp: new Date()
              }]);
            }}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            aria-label="Clear chat"
            title="Clear chat"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            aria-label="Close"
            title="Close"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((message, index) => (
          <div
            key={`msg-${message.id}-${index}`}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl p-4 ${message.sender === 'user'
                ? 'bg-blue-600 text-white rounded-br-none shadow-md'
                : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none shadow-sm'
                }`}
            >
              <div className="flex items-center mb-2">
                {message.sender === "bot" && (
                  <div className="w-2 h-3 flex items-center justify-center mr-10">
                    <AILogo size="micro" />
                  </div>
                )}

                <span className="text-xs opacity-75 whitespace-nowrap">
                  {message.sender === "user" ? "You" : "CRM Assistant"}
                </span>

                <span className="text-xs opacity-50 ml-2">
                  {new Date(message.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>

              {/* Message text */}
              <p className="whitespace-pre-wrap mb-2">
                {message.text}
              </p>

              {/* 🔥 CONTEXT BADGES */}
              {message.intent === 'deals-by-salesperson' && (
                <div className="text-xs mb-2 p-1 rounded bg-purple-100 text-purple-800 inline-block">
                  👤 Deals by salesperson
                </div>
              )}
              {message.intent === 'leads-by-salesperson' && (
                <div className="text-xs mb-2 p-1 rounded bg-purple-100 text-purple-800 inline-block">
                  👤 Leads by salesperson
                </div>
              )}
              {message.intent === 'deal-search' && (
                <div className="text-xs mb-2 p-1 rounded bg-blue-100 text-blue-800 inline-block">
                  🔍 Specific deal search
                </div>
              )}
              {message.intent === 'lead-search' && (
                <div className="text-xs mb-2 p-1 rounded bg-blue-100 text-blue-800 inline-block">
                  🔍 Specific lead search
                </div>
              )}
              {message.intent === 'deals-by-company' && (
                <div className="text-xs mb-2 p-1 rounded bg-indigo-100 text-indigo-800 inline-block">
                  🏢 Deals by company
                </div>
              )}
              {message.intent === 'leads-by-company' && (
                <div className="text-xs mb-2 p-1 rounded bg-indigo-100 text-indigo-800 inline-block">
                  🏢 Leads by company
                </div>
              )}
              {message.intent === 'deals-won' && (
                <div className="text-xs mb-2 p-1 rounded bg-green-100 text-green-800 inline-block">
                  🏆 Won deals
                </div>
              )}
              {message.intent === 'deals-lost' && (
                <div className="text-xs mb-2 p-1 rounded bg-red-100 text-red-800 inline-block">
                  ❌ Lost deals
                </div>
              )}
              {message.intent === 'deals-open' && (
                <div className="text-xs mb-2 p-1 rounded bg-blue-100 text-blue-800 inline-block">
                  📈 Open deals
                </div>
              )}
              {message.intent === 'my-deals' && (
                <div className="text-xs mb-2 p-1 rounded bg-green-100 text-green-800 inline-block">
                  👑 My deals
                </div>
              )}
              {message.intent === 'leads-hot' && (
                <div className="text-xs mb-2 p-1 rounded bg-orange-100 text-orange-800 inline-block">
                  🔥 Hot leads
                </div>
              )}
              {message.intent === 'leads-warm' && (
                <div className="text-xs mb-2 p-1 rounded bg-yellow-100 text-yellow-800 inline-block">
                  🌡️ Warm leads
                </div>
              )}
              {message.intent === 'leads-cold' && (
                <div className="text-xs mb-2 p-1 rounded bg-blue-100 text-blue-800 inline-block">
                  ❄️ Cold leads
                </div>
              )}
              {message.intent === 'my-leads' && (
                <div className="text-xs mb-2 p-1 rounded bg-green-100 text-green-800 inline-block">
                  👑 My leads
                </div>
              )}

              {/* Call data display */}
              {message.callData && (
                <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-xs font-medium text-green-800 mb-2 flex items-center gap-1">
                    <PhoneCall className="w-3 h-3" />
                    📞 Call to {message.callData.lead?.name}
                  </p>

                  <div className="flex gap-2 mt-2">
                    <a
                      href={message.callData.whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-green-600 text-white text-xs rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <MessageCircle className="w-3 h-3" />
                      WHATSAPP
                    </a>
                    <a
                      href={message.callData.dialerUrl}
                      className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Phone className="w-3 h-3" />
                      PHONE
                    </a>
                  </div>
                </div>
              )}

              {/* Auto-tracked completion message */}
              {message.autoTracked && (
                <div className="mt-2 text-xs text-green-600 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  Auto-tracked • Duration: {formatDuration(message.duration)}
                </div>
              )}

              {message.data && Array.isArray(message.data) && message.data.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <div className="text-xs font-medium mb-2 text-gray-600">
                    📋 Found {message.data.length} {message.intent?.includes('lead') ? 'leads' : 'deals'}:
                  </div>

                  <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                    {(expandedMessageId === message.id ? message.data : message.data.slice(0, 5)).map((item, idx) => {
                      // Determine if it's a deal or lead
                      const isDeal = item.stage || item.value;
                      const isLead = item.status && !item.stage;

                      const statusText = isDeal ? item.stage : item.status;

                      const badgeColor = statusText?.toLowerCase().includes("won")
                        ? "bg-green-100 text-green-800"
                        : statusText?.toLowerCase().includes("lost") || statusText?.toLowerCase().includes("junk")
                          ? "bg-red-100 text-red-800"
                          : statusText?.toLowerCase().includes("hot")
                            ? "bg-red-100 text-red-800"
                            : statusText?.toLowerCase().includes("warm")
                              ? "bg-yellow-100 text-yellow-800"
                              : statusText?.toLowerCase().includes("cold")
                                ? "bg-blue-100 text-blue-800"
                                : "bg-gray-100 text-gray-800";

                      return (
                        <div
                          key={item._id || idx}
                          className="text-xs p-3 bg-gray-50 rounded border border-gray-200 hover:bg-gray-100 transition-colors"
                        >
                          {/* Title */}
                          <div className="font-semibold truncate mb-1 flex items-center justify-between">
                            <span>
                              {item.name || item.leadName || item.dealName || `Record ${idx + 1}`}
                            </span>
                            <span className={`px-2 py-0.5 rounded-full text-xs ${badgeColor}`}>
                              {statusText}
                            </span>
                          </div>

                          {/* Company/Details */}
                          {(item.company || item.companyName) && (
                            <div className="text-gray-600 mb-1 flex items-center gap-1">
                              🏢 {item.company || item.companyName}
                            </div>
                          )}

                          {/* Phone Number */}
                          {(item.phone || item.phoneNumber) && (
                            <div className="text-gray-600 mb-1 flex items-center gap-1">
                              📞 {item.phone || item.phoneNumber}
                            </div>
                          )}

                          {/* Deal Value (if applicable) */}
                          {item.value && (
                            <div className="text-green-600 font-medium mb-1 flex items-center gap-1">
                              💰 ${Number(item.value).toLocaleString()}
                            </div>
                          )}

                          {/* Handled By */}
                          <div className="text-gray-600 mt-2 pt-2 border-t border-gray-200">
                            <span className="font-medium">👤 Handled by: </span>
                            <span className="text-blue-600">
                              {item.handledBy || item.owner ||
                                (item.assignTo ? `${item.assignTo.firstName} ${item.assignTo.lastName}` : "Unassigned")}
                            </span>
                          </div>
                        </div>
                      );
                    })}

                    {message.data.length > 5 && (
                      <div className="text-center">
                        <button
                          onClick={() => toggleExpand(message.id)}
                          className="text-xs text-blue-600 hover:text-blue-800 font-medium py-2 px-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                        >
                          {expandedMessageId === message.id
                            ? `Show less`
                            : `View all ${message.data.length} ${message.intent?.includes('lead') ? 'leads' : 'deals'}`}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Loading indicator */}
        {loading && (
          <div className="flex justify-start">
            <div className="max-w-[85%] rounded-2xl p-4 w-50 bg-white border border-gray-200 rounded-bl-none shadow-sm">
              <div className="flex items-center space-x-2">
                <AILogo size="xsmall" />
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Call Options with auto-tracking info */}
      {showCallOptions && callInProgress && (
        <div className="px-4 py-3 border-t border-gray-200 bg-green-50">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-medium text-green-800 flex items-center gap-1">
              <PhoneCall className="w-3 h-3" />
              📞 Call to {callInProgress.lead?.name}
            </p>
            <div className="text-xs bg-white px-2 py-1 rounded-full shadow-sm flex items-center gap-1">
              <Clock className="w-3 h-3 animate-pulse" />
              <span className="font-mono">{formatDuration(liveDuration)}</span>
            </div>
          </div>
          <div className="flex gap-2">
            <a
              href={callInProgress.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700"
              onClick={() => setShowCallOptions(false)}
            >
              <MessageCircle className="w-4 h-4" />
              WHATSAPP
            </a>
            <a
              href={callInProgress.dialerUrl}
              className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
              onClick={() => setShowCallOptions(false)}
            >
              <Phone className="w-4 h-4" />
              PHONE
            </a>
          </div>
          <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Duration will be auto-tracked when you return
          </p>
        </div>
      )}

      {/* Quick Actions */}
      <div className="px-3 py-2 border-t border-gray-200 bg-white">
        <div className="text-xs text-gray-500 mb-2 font-medium">Quick actions:</div>
        <div className="flex flex-wrap gap-2">
          {quickActions.map((action, idx) => (
            <button
              key={idx}
              onClick={() => {
                if (action.query === "call ") {
                  setInputText("call ");
                  inputRef.current?.focus();
                } else {
                  sendMessage(action.query);
                }
              }}
              className="text-xs px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full hover:bg-blue-100 transition-colors border border-blue-100 flex items-center space-x-1"
            >
              <span>{action.label.split(' ')[0]}</span>
              <span className="hidden sm:inline">{action.label.split(' ').slice(1).join(' ')}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Input Area */}
      <form onSubmit={handleSubmit}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.stopPropagation(); 
          }
        }} className="p-4 border-t border-gray-200 bg-white">
        <div className="flex items-center space-x-2">
          <input
            ref={inputRef}
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ask about your CRM data or type 'call company'..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
            disabled={loading}
          />

          {/* Voice Button */}
          <VoiceButton
            onCommand={(text) => {
              sendMessage(text);
            }}
            onNavigationSuccess={(message) => {
              const botMessage = {
                id: Date.now(),
                text: message,
                sender: 'bot',
                timestamp: new Date()
              };
              setMessages(prev => [...prev, botMessage]);
            }}
            onTranscript={(text) => {
              setInputText(text);
              setTimeout(() => {
                inputRef.current?.focus();
                inputRef.current?.setSelectionRange(text.length, text.length);
              }, 100);
            }}
            navigate={navigate}
          />

          <button
            type="submit"
            onClick={(e) => {
              e.stopPropagation();
            }}
            disabled={loading || !inputText.trim()}
            className="px-3 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-md flex items-center justify-center"
            aria-label="Send message"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2.94 2.34L18 10 2.94 17.66 4.5 11l7.5-1-7.5-1-1.56-6.66z" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatWidget;