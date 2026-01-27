// import React, { useMemo, useState, useEffect, useRef } from "react";
// import { DndProvider, useDrag, useDrop } from "react-dnd";
// import { HTML5Backend } from "react-dnd-html5-backend";
// import axios from "axios";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { useNavigate } from "react-router-dom";
// import { 
//   Thermometer, 
//   Activity, 
//   Clock, 
//   MessageSquare, 
//   TrendingUp,
//   AlertCircle,
//   CheckCircle,
//   XCircle,
//   Zap,
//   Calendar,
//   User,
//   DollarSign,
//   Building,
//   Filter,
//   RefreshCw,
//   BarChart3,
//   TrendingDown,
//   AlertTriangle,
//   Target,
//   Eye,
//   EyeOff,
//   ChevronDown,
//   SortAsc,
//   SortDesc,
//   Flag,
//   Sparkles
// } from "lucide-react";

// // ----- Stages (match backend exactly) -----
// const STAGES = [
//   {
//     id: "Qualification",
//     title: "Qualification",
//     color: "text-blue-600",
//     bgColor: "bg-blue-50",
//     borderColor: "border-blue-200",
//     icon: Flag
//   },
//   {
//     id: "Negotiation",
//     title: "Negotiation",
//     color: "text-amber-600",
//     bgColor: "bg-amber-50",
//     borderColor: "border-amber-200",
//     icon: Activity
//   },
//   {
//     id: "Proposal Sent",
//     title: "Proposal Sent",
//     color: "text-purple-600",
//     bgColor: "bg-purple-50",
//     borderColor: "border-purple-200",
//     icon: Target
//   },
//   {
//     id: "Closed Won",
//     title: "Closed Won",
//     color: "text-emerald-600",
//     bgColor: "bg-emerald-50",
//     borderColor: "border-emerald-200",
//     icon: CheckCircle
//   },
//   {
//     id: "Closed Lost",
//     title: "Closed Lost",
//     color: "text-rose-600",
//     bgColor: "bg-rose-50",
//     borderColor: "border-rose-200",
//     icon: XCircle
//   },
// ];

// // ----- Drag types -----
// const ItemTypes = {
//   DEAL: "DEAL",
// };

// // ----- Enterprise Health Score Categories -----
// const HEALTH_CATEGORIES = {
//   HOT: {
//     range: [70, 100],
//     label: "Hot",
//     color: "text-emerald-700",
//     bgColor: "bg-emerald-50",
//     borderColor: "border-emerald-200",
//     progressColor: "bg-emerald-500",
//     icon: Zap,
//     description: "High conversion probability – push for closure",
//     action: "Prioritize for immediate follow-up",
//     urgency: "high"
//   },
//   WARM: {
//     range: [40, 69],
//     label: "Warm",
//     color: "text-amber-600",
//     bgColor: "bg-amber-50",
//     borderColor: "border-amber-200",
//     progressColor: "bg-amber-500",
//     icon: Thermometer,
//     description: "Needs nurturing and follow-ups",
//     action: "Schedule follow-up this week",
//     urgency: "medium"
//   },
//   COLD: {
//     range: [0, 39],
//     label: "Cold",
//     color: "text-rose-700",
//     bgColor: "bg-rose-50",
//     borderColor: "border-rose-200",
//     progressColor: "bg-rose-500",
//     icon: AlertCircle,
//     description: "High leakage risk – revive or archive",
//     action: "Revive or consider archiving",
//     urgency: "critical"
//   }
// };

// // ----- Calculate Health Score (Business Logic Layer) -----
// const calculateHealthScore = (deal) => {
//   let score = 50; // Base score
  
//   // 1. Follow-up recency (+20 points) - Sales Behavior Signal
//   if (deal.followUpDate) {
//     const followUpDate = new Date(deal.followUpDate);
//     const today = new Date();
//     const daysSinceFollowUp = Math.floor((today - followUpDate) / (1000 * 60 * 60 * 24));
    
//     if (daysSinceFollowUp <= 1) score += 20;
//     else if (daysSinceFollowUp <= 3) score += 15;
//     else if (daysSinceFollowUp <= 7) score += 10;
//     else if (daysSinceFollowUp <= 14) score += 5;
//     // >14 days = no points (negative momentum)
//   }
  
//   // 2. Client engagement (replies) (+20 points) - Client Engagement Signal
//   if (deal.emailReplies) {
//     const recentReplies = deal.emailReplies.filter(reply => {
//       const replyDate = new Date(reply.date);
//       const today = new Date();
//       const daysSinceReply = Math.floor((today - replyDate) / (1000 * 60 * 60 * 24));
//       return daysSinceReply <= 7;
//     });
    
//     if (recentReplies.length >= 3) score += 20;
//     else if (recentReplies.length === 2) score += 15;
//     else if (recentReplies.length === 1) score += 10;
//   }
  
//   // 3. Activity Gap (-30 points) - Momentum Decay Signal
//   if (deal.lastActivityDate) {
//     const lastActivity = new Date(deal.lastActivityDate);
//     const today = new Date();
//     const daysSinceActivity = Math.floor((today - lastActivity) / (1000 * 60 * 60 * 24));
    
//     if (daysSinceActivity > 30) score -= 30;
//     else if (daysSinceActivity > 21) score -= 20;
//     else if (daysSinceActivity > 14) score -= 10;
//     else if (daysSinceActivity > 7) score -= 5;
//   }
  
//   // 4. Deal value multiplier (+10 for high-value deals)
//   if (deal.value) {
//     const valueMatch = deal.value.match(/^([\d,]+)\s*([A-Za-z]+)$/);
//     if (valueMatch) {
//       const numericValue = parseInt(valueMatch[1].replace(/,/g, ''), 10);
//       if (numericValue > 1000000) score += 10;
//       else if (numericValue > 500000) score += 5;
//     }
//   }
  
//   // 5. Stage bonus (pipeline position adjustment)
//   if (deal.stage === "Closed Won") score = 100;
//   else if (deal.stage === "Closed Lost") score = 0;
//   else if (deal.stage === "Proposal Sent") score += 10;
//   else if (deal.stage === "Negotiation") score += 5;
  
//   // Ensure score stays within 0-100 bounds
//   return Math.min(100, Math.max(0, Math.round(score)));
// };

// // ----- Get Health Category with Insights -----
// const getHealthCategory = (score) => {
//   if (score >= HEALTH_CATEGORIES.HOT.range[0]) return HEALTH_CATEGORIES.HOT;
//   if (score >= HEALTH_CATEGORIES.WARM.range[0]) return HEALTH_CATEGORIES.WARM;
//   return HEALTH_CATEGORIES.COLD;
// };

// // ----- Calculate Deal Momentum Insights -----
// const calculateMomentumInsights = (deal) => {
//   const insights = {
//     activityGap: null,
//     replyEngagement: null,
//     followUpAge: null,
//     warnings: []
//   };
  
//   if (deal.lastActivityDate) {
//     const lastActivity = new Date(deal.lastActivityDate);
//     const today = new Date();
//     const daysSinceActivity = Math.floor((today - lastActivity) / (1000 * 60 * 60 * 24));
//     insights.activityGap = daysSinceActivity;
    
//     if (daysSinceActivity > 14) {
//       insights.warnings.push(`No activity for ${daysSinceActivity} days`);
//     }
//   }
  
//   if (deal.emailReplies) {
//     const recentReplies = deal.emailReplies.filter(reply => {
//       const replyDate = new Date(reply.date);
//       const today = new Date();
//       const daysSinceReply = Math.floor((today - replyDate) / (1000 * 60 * 60 * 24));
//       return daysSinceReply <= 7;
//     });
//     insights.replyEngagement = recentReplies.length;
    
//     if (recentReplies.length === 0 && deal.stage !== "Qualification") {
//       insights.warnings.push("No recent client engagement");
//     }
//   }
  
//   if (deal.followUpDate) {
//     const followUpDate = new Date(deal.followUpDate);
//     const today = new Date();
//     const daysSinceFollowUp = Math.floor((today - followUpDate) / (1000 * 60 * 60 * 24));
//     insights.followUpAge = daysSinceFollowUp;
    
//     if (daysSinceFollowUp > 7) {
//       insights.warnings.push(`Follow-up overdue by ${daysSinceFollowUp - 7} days`);
//     }
//   }
  
//   return insights;
// };

// const formatCurrencyValue = (val) => {
//   if (!val) return "-";
//   const match = val.match(/^([\d,]+)\s*([A-Z]+)$/i);
//   if (!match) return val;
//   const number = match[1].replace(/,/g, "");
//   const currency = match[2].toUpperCase();
//   const formattedNumber = Number(number).toLocaleString("en-IN");
//   return `${formattedNumber} ${currency}`;
// };

// function formatDate(dateString) {
//   if (!dateString) return "—";
//   const date = new Date(dateString);
//   return new Intl.DateTimeFormat("en-IN", {
//     day: "2-digit",
//     month: "short",
//     year: "numeric",
//   }).format(date);
// }

// // ----- Delete Confirmation Modal -----
// const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, dealName, healthScore }) => {
//   if (!isOpen) return null;

//   const healthCategory = getHealthCategory(healthScore);
//   const HealthIcon = healthCategory.icon;

//   return (
//     <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full border border-gray-200">
//         <div className="flex items-start mb-4">
//           <div className={`p-2 rounded-lg ${healthCategory.bgColor} mr-3`}>
//             <HealthIcon size={20} className={healthCategory.color} />
//           </div>
//           <div>
//             <h3 className="text-lg font-semibold text-gray-900">Confirm Deal Removal</h3>
//             <p className="text-sm text-gray-600 mt-1">
//               Health Score: <span className={`font-bold ${healthCategory.color}`}>{healthScore}/100</span>
//             </p>
//           </div>
//         </div>
        
//         <div className="py-4">
//           <p className="text-gray-700">
//             Remove <span className="font-semibold text-gray-900">"{dealName}"</span> from pipeline?
//           </p>
//           <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
//             <div className="flex items-center text-sm">
//               <AlertTriangle size={14} className="text-amber-500 mr-2" />
//               <span className="text-gray-600">
//                 {healthScore >= 70 ? "This is a high-probability deal" : 
//                  healthScore >= 40 ? "This deal needs attention" : 
//                  "This deal is at high risk"}
//               </span>
//             </div>
//           </div>
//         </div>
        
//         <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
//           <button
//             className="px-4 py-2.5 text-gray-700 hover:text-gray-900 font-medium rounded-lg hover:bg-gray-100 transition-colors"
//             onClick={onClose}
//           >
//             Keep Deal
//           </button>
//           <button
//             className="px-4 py-2.5 bg-gradient-to-r from-rose-600 to-rose-700 text-white font-medium rounded-lg hover:from-rose-700 hover:to-rose-800 transition-all shadow-sm"
//             onClick={onConfirm}
//           >
//             Remove Deal
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// // ----- Main Pipeline Board -----
// function SalesPipelineBoardPure() {
//   const API_URL = import.meta.env.VITE_API_URL;

//   const [columns, setColumns] = useState({});
//   const [query, setQuery] = useState("");
//   const [isLoading, setIsLoading] = useState(true);
//   const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
//   const [dealToDelete, setDealToDelete] = useState(null);
//   const [users, setUsers] = useState([]);
//   const [userRole, setUserRole] = useState("");
//   const [userId, setUserId] = useState("");
//   const [healthFilter, setHealthFilter] = useState("all");
//   const [sortByHealth, setSortByHealth] = useState("desc");
//   const [showHealthIntelligence, setShowHealthIntelligence] = useState(true);
//   const [pipelineInsights, setPipelineInsights] = useState({
//     totalDeals: 0,
//     totalValue: 0,
//     hotDeals: 0,
//     warmDeals: 0,
//     coldDeals: 0,
//     avgHealthScore: 0,
//     leakageRiskValue: 0,
//     atRiskDeals: 0
//   });

//   const navigate = useNavigate();
//   const scrollRef = useRef(null);

//   // Get user info from localStorage
//   useEffect(() => {
//     const userData = JSON.parse(localStorage.getItem("user"));
//     if (userData) {
//       setUserRole(userData.role?.name || "");
//       setUserId(userData._id || "");
//     }
//   }, []);

//   // Fetch Deals on mount
//   useEffect(() => {
//     if (userRole) {
//       fetchData();
//       fetchUsers();
//     }
//   }, [userRole]);

//   // Fetch sales users
//   const fetchUsers = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const res = await axios.get(`${API_URL}/users`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const filteredSales = (res.data.users || []).filter(
//         (user) =>
//           user.role &&
//           user.role.name &&
//           user.role.name.toLowerCase() === "sales"
//       );
//       setUsers(filteredSales);
//     } catch (err) {
//       console.error("Failed to fetch users:", err);
//     }
//   };

//   const fetchData = async () => {
//     try {
//       setIsLoading(true);
//       const token = localStorage.getItem("token");

//       // Fetch deals
//       const dealsRes = await axios.get(`${API_URL}/deals/getAll`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       // Calculate health scores and insights for each deal
//       const dealsWithHealth = dealsRes.data.map(deal => {
//         const healthScore = calculateHealthScore(deal);
//         return {
//           ...deal,
//           healthScore,
//           healthCategory: getHealthCategory(healthScore),
//           momentumInsights: calculateMomentumInsights(deal)
//         };
//       });

//       // Group deals by stage
//       const grouped = {};
//       STAGES.forEach((s) => {
//         grouped[s.id] = [];
//       });

//       dealsWithHealth.forEach((deal) => {
//         if (!grouped[deal.stage]) grouped[deal.stage] = [];
//         grouped[deal.stage].push(deal);
//       });

//       setColumns(grouped);
//       calculatePipelineInsights(dealsWithHealth);
//     } catch (err) {
//       console.error(err);
//       const emptyColumns = {};
//       STAGES.forEach((s) => {
//         emptyColumns[s.id] = [];
//       });
//       setColumns(emptyColumns);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Calculate pipeline insights with business intelligence
//   const calculatePipelineInsights = (deals) => {
//     const insights = {
//       totalDeals: deals.length,
//       totalValue: 0,
//       hotDeals: 0,
//       warmDeals: 0,
//       coldDeals: 0,
//       atRiskDeals: 0,
//       totalHealthScore: 0,
//       leakageRiskValue: 0
//     };

//     deals.forEach(deal => {
//       // Calculate total value
//       if (deal.value) {
//         const match = deal.value.match(/^([\d,]+)\s*([A-Za-z]+)$/);
//         if (match) {
//           const value = parseInt(match[1].replace(/,/g, ''), 10);
//           insights.totalValue += value;
          
//           // Calculate leakage risk (Cold deals with high value)
//           if (deal.healthScore < 40 && value > 100000) {
//             insights.leakageRiskValue += value;
//             insights.atRiskDeals++;
//           }
//         }
//       }

//       // Count health categories
//       if (deal.healthScore >= 70) insights.hotDeals++;
//       else if (deal.healthScore >= 40) insights.warmDeals++;
//       else insights.coldDeals++;

//       insights.totalHealthScore += deal.healthScore;
//     });

//     insights.avgHealthScore = deals.length > 0 ? 
//       Math.round(insights.totalHealthScore / deals.length) : 0;

//     setPipelineInsights(insights);
//   };

//   // Check if user can edit/delete a deal
//   const canEditDeleteDeal = (deal) => {
//     if (userRole === "Admin") return true;
//     return deal.assignedTo && deal.assignedTo._id === userId;
//   };

//   // Move deal between stages
//   async function moveDeal(dealId, fromStage, toStage) {
//     if (fromStage === toStage) return;

//     setColumns((prev) => {
//       let deal;
//       const next = { ...prev };
//       next[fromStage] = prev[fromStage].filter((d) => {
//         if (d._id === dealId) {
//           deal = d;
//           return false;
//         }
//         return true;
//       });
//       if (deal) {
//         next[toStage] = [...prev[toStage], { ...deal, stage: toStage }];
//       }
//       return next;
//     });

//     try {
//       const token = localStorage.getItem("token");
//       await axios.patch(
//         `${API_URL}/deals/update-deal/${dealId}`,
//         { stage: toStage },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//     } catch (err) {
//       console.error("Failed to update deal stage:", err);
//       toast.error("Failed to save stage change!");
//       fetchData();
//     }
//   }

//   // Handle delete confirmation
//   const handleDeleteClick = (deal) => {
//     if (!canEditDeleteDeal(deal)) {
//       toast.error("You don't have permission to delete this deal");
//       return;
//     }
//     setDealToDelete(deal);
//     setDeleteConfirmOpen(true);
//   };

//   // Handle actual deletion
//   const handleDeleteConfirm = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       setColumns((prev) => {
//         const next = { ...prev };
//         for (const stage in next) {
//           next[stage] = next[stage].filter((d) => d._id !== dealToDelete._id);
//         }
//         return next;
//       });

//       await axios.delete(`${API_URL}/deals/delete-deal/${dealToDelete._id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       toast.success("Deal removed from pipeline");
//     } catch (err) {
//       console.error("Failed to delete deal:", err);
//       toast.error("Failed to remove deal!");
//       fetchData();
//     } finally {
//       setDeleteConfirmOpen(false);
//       setDealToDelete(null);
//     }
//   };

//   // Filter and sort deals
//   const processedColumns = useMemo(() => {
//     let filtered = { ...columns };
    
//     // Apply health filter
//     if (healthFilter !== "all") {
//       Object.keys(filtered).forEach(stage => {
//         filtered[stage] = filtered[stage].filter(deal => {
//           if (healthFilter === "hot") return deal.healthScore >= 70;
//           if (healthFilter === "warm") return deal.healthScore >= 40 && deal.healthScore < 70;
//           if (healthFilter === "cold") return deal.healthScore < 40;
//           return true;
//         });
//       });
//     }
    
//     // Apply sorting by health score
//     Object.keys(filtered).forEach(stage => {
//       filtered[stage] = [...filtered[stage]].sort((a, b) => {
//         if (sortByHealth === "asc") return a.healthScore - b.healthScore;
//         return b.healthScore - a.healthScore;
//       });
//     });
    
//     // Apply search query
//     if (query.trim()) {
//       const q = query.toLowerCase();
//       const searchFiltered = {};
//       Object.keys(filtered).forEach(stage => {
//         searchFiltered[stage] = filtered[stage].filter(
//           (d) =>
//             d.dealName.toLowerCase().includes(q) ||
//             (d.companyName || "").toLowerCase().includes(q) ||
//             (d.assignedTo?.firstName || "").toLowerCase().includes(q) ||
//             (d.assignedTo?.lastName || "").toLowerCase().includes(q)
//         );
//       });
//       return searchFiltered;
//     }
    
//     return filtered;
//   }, [columns, healthFilter, sortByHealth, query]);

//   // Calculate column insights for visualization
//   const columnInsights = useMemo(() => {
//     const insights = {};
//     Object.keys(processedColumns).forEach(stage => {
//       const deals = processedColumns[stage];
//       const hotCount = deals.filter(d => d.healthScore >= 70).length;
//       const warmCount = deals.filter(d => d.healthScore >= 40 && d.healthScore < 70).length;
//       const coldCount = deals.filter(d => d.healthScore < 40).length;
      
//       const avgScore = deals.length > 0 
//         ? Math.round(deals.reduce((sum, d) => sum + d.healthScore, 0) / deals.length)
//         : 0;
      
//       insights[stage] = {
//         total: deals.length,
//         hotCount,
//         warmCount,
//         coldCount,
//         avgScore,
//         healthDistribution: [
//           { category: "hot", count: hotCount, color: "bg-emerald-500" },
//           { category: "warm", count: warmCount, color: "bg-amber-500" },
//           { category: "cold", count: coldCount, color: "bg-rose-500" }
//         ].filter(item => item.count > 0)
//       };
//     });
//     return insights;
//   }, [processedColumns]);

//   if (isLoading) {
//     return (
//       <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6 flex items-center justify-center">
//         <div className="text-center">
//           <div className="relative">
//             <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-600 mx-auto"></div>
//             <div className="absolute inset-0 flex items-center justify-center">
//               <BarChart3 className="text-indigo-600 animate-pulse" size={24} />
//             </div>
//           </div>
//           <p className="mt-4 text-gray-600 font-medium">Loading deal intelligence...</p>
//           <p className="text-sm text-gray-500 mt-1">Analyzing health scores and momentum</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
//       <ToastContainer position="top-right" autoClose={3000} />

//       {/* Delete Confirmation Modal */}
//       <DeleteConfirmationModal
//         isOpen={deleteConfirmOpen}
//         onClose={() => setDeleteConfirmOpen(false)}
//         onConfirm={handleDeleteConfirm}
//         dealName={dealToDelete?.dealName}
//         healthScore={dealToDelete?.healthScore}
//       />

//       {/* Header Section */}
//       <div className="mx-auto mb-8 max-w-[1800px]">
//         <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
//           <div className="flex-1">
//             <div className="flex items-center gap-3 mb-2">
//               <div className="p-2.5 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-sm">
//                 <BarChart3 size={24} className="text-white" />
//               </div>
//               <div>
//                 <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
//                   Deal Intelligence Pipeline
//                 </h1>
//                 <p className="text-sm text-gray-600 mt-1">
//                   Behavior-driven health scoring to reduce revenue leakage
//                 </p>
//               </div>
//             </div>
            
//             {/* Quick Stats Bar */}
//             <div className="flex flex-wrap gap-4 mt-4">
//               <div className="flex items-center gap-2">
//                 <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
//                 <span className="text-sm font-medium text-gray-700">
//                   {pipelineInsights.hotDeals} Hot deals
//                 </span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <div className="w-2 h-2 rounded-full bg-amber-500"></div>
//                 <span className="text-sm font-medium text-gray-700">
//                   {pipelineInsights.warmDeals} Warm deals
//                 </span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <div className="w-2 h-2 rounded-full bg-rose-500"></div>
//                 <span className="text-sm font-medium text-gray-700">
//                   {pipelineInsights.coldDeals} Cold deals
//                 </span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
//                 <span className="text-sm font-medium text-gray-700">
//                   Avg: {pipelineInsights.avgHealthScore}/100
//                 </span>
//               </div>
//             </div>
//           </div>
          
//           <div className="flex flex-wrap gap-3">
//             <div className="flex items-center gap-2 bg-white rounded-xl border border-gray-200 px-3 py-2">
//               <button
//                 onClick={() => setShowHealthIntelligence(!showHealthIntelligence)}
//                 className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
//                   showHealthIntelligence 
//                     ? "bg-emerald-50 text-emerald-700 border border-emerald-200" 
//                     : "bg-gray-100 text-gray-700 hover:bg-gray-200"
//                 }`}
//               >
//                 {showHealthIntelligence ? (
//                   <>
//                     <Eye size={14} />
//                     Hide Intelligence
//                   </>
//                 ) : (
//                   <>
//                     <EyeOff size={14} />
//                     Show Intelligence
//                   </>
//                 )}
//               </button>
              
//               <button
//                 onClick={() => setSortByHealth(sortByHealth === "desc" ? "asc" : "desc")}
//                 className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200"
//               >
//                 {sortByHealth === "desc" ? <SortDesc size={14} /> : <SortAsc size={14} />}
//                 {sortByHealth === "desc" ? "High to Low" : "Low to High"}
//               </button>
//             </div>
            
//             {userRole === "Admin" && (
//               <button
//                 className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-sm"
//                 onClick={() => navigate("/createDeal")}
//               >
//                 <Sparkles size={16} />
//                 New Deal
//               </button>
//             )}
//           </div>
//         </div>

//         {/* Pipeline Intelligence Dashboard */}
//         {showHealthIntelligence && (
//           <div className="mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//             {/* Hot Deals Card */}
//             <div className="bg-gradient-to-br from-emerald-50 to-white rounded-2xl border border-emerald-100 p-5 shadow-sm">
//               <div className="flex items-center justify-between mb-3">
//                 <div className="flex items-center gap-2">
//                   <div className="p-2 bg-emerald-100 rounded-lg">
//                     <Zap size={18} className="text-emerald-600" />
//                   </div>
//                   <h3 className="font-semibold text-gray-900">Hot Deals</h3>
//                 </div>
//                 <span className="text-2xl font-bold text-emerald-700">
//                   {pipelineInsights.hotDeals}
//                 </span>
//               </div>
//               <p className="text-sm text-gray-600 mb-3">
//                 High conversion probability
//               </p>
//               <div className="w-full bg-emerald-100 rounded-full h-1.5">
//                 <div 
//                   className="bg-emerald-500 h-1.5 rounded-full" 
//                   style={{ width: `${(pipelineInsights.hotDeals / pipelineInsights.totalDeals) * 100 || 0}%` }}
//                 />
//               </div>
//             </div>

//             {/* Warm Deals Card */}
//             <div className="bg-gradient-to-br from-amber-50 to-white rounded-2xl border border-amber-100 p-5 shadow-sm">
//               <div className="flex items-center justify-between mb-3">
//                 <div className="flex items-center gap-2">
//                   <div className="p-2 bg-amber-100 rounded-lg">
//                     <Thermometer size={18} className="text-amber-600" />
//                   </div>
//                   <h3 className="font-semibold text-gray-900">Warm Deals</h3>
//                 </div>
//                 <span className="text-2xl font-bold text-amber-700">
//                   {pipelineInsights.warmDeals}
//                 </span>
//               </div>
//               <p className="text-sm text-gray-600 mb-3">
//                 Need nurturing & follow-ups
//               </p>
//               <div className="w-full bg-amber-100 rounded-full h-1.5">
//                 <div 
//                   className="bg-amber-500 h-1.5 rounded-full" 
//                   style={{ width: `${(pipelineInsights.warmDeals / pipelineInsights.totalDeals) * 100 || 0}%` }}
//                 />
//               </div>
//             </div>

//             {/* Cold Deals Card */}
//             <div className="bg-gradient-to-br from-rose-50 to-white rounded-2xl border border-rose-100 p-5 shadow-sm">
//               <div className="flex items-center justify-between mb-3">
//                 <div className="flex items-center gap-2">
//                   <div className="p-2 bg-rose-100 rounded-lg">
//                     <AlertCircle size={18} className="text-rose-600" />
//                   </div>
//                   <h3 className="font-semibold text-gray-900">Cold Deals</h3>
//                 </div>
//                 <span className="text-2xl font-bold text-rose-700">
//                   {pipelineInsights.coldDeals}
//                 </span>
//               </div>
//               <p className="text-sm text-gray-600 mb-3">
//                 High leakage risk – needs revival
//               </p>
//               <div className="w-full bg-rose-100 rounded-full h-1.5">
//                 <div 
//                   className="bg-rose-500 h-1.5 rounded-full" 
//                   style={{ width: `${(pipelineInsights.coldDeals / pipelineInsights.totalDeals) * 100 || 0}%` }}
//                 />
//               </div>
//             </div>

//             {/* Leakage Risk Card */}
//             <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-200 p-5 shadow-sm">
//               <div className="flex items-center justify-between mb-3">
//                 <div className="flex items-center gap-2">
//                   <div className="p-2 bg-indigo-100 rounded-lg">
//                     <TrendingDown size={18} className="text-indigo-600" />
//                   </div>
//                   <h3 className="font-semibold text-gray-900">Leakage Risk</h3>
//                 </div>
//                 <span className="text-2xl font-bold text-gray-900">
//                   {pipelineInsights.atRiskDeals}
//                 </span>
//               </div>
//               <p className="text-sm text-gray-600 mb-3">
//                 High-value cold deals at risk
//               </p>
//               <div className="text-sm font-medium text-rose-600">
//                 ₹{pipelineInsights.leakageRiskValue.toLocaleString('en-IN')} at risk
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Filters and Controls */}
//         <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8 p-5 bg-white rounded-2xl shadow-sm border border-gray-200">
//           <div className="flex-1">
//             <div className="flex flex-wrap items-center gap-4">
//               <div className="flex items-center gap-2">
//                 <Filter size={16} className="text-gray-500" />
//                 <span className="text-sm font-medium text-gray-700">Filter by Health:</span>
//               </div>
              
//               <div className="flex flex-wrap gap-2">
//                 <button
//                   onClick={() => setHealthFilter("all")}
//                   className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
//                     healthFilter === "all" 
//                       ? "bg-indigo-600 text-white shadow-sm" 
//                       : "bg-gray-100 text-gray-700 hover:bg-gray-200"
//                   }`}
//                 >
//                   All Deals ({pipelineInsights.totalDeals})
//                 </button>
//                 <button
//                   onClick={() => setHealthFilter("hot")}
//                   className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
//                     healthFilter === "hot" 
//                       ? "bg-emerald-600 text-white shadow-sm" 
//                       : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
//                   }`}
//                 >
//                   🔥 Hot ({pipelineInsights.hotDeals})
//                 </button>
//                 <button
//                   onClick={() => setHealthFilter("warm")}
//                   className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
//                     healthFilter === "warm" 
//                       ? "bg-amber-600 text-white shadow-sm" 
//                       : "bg-amber-50 text-amber-700 hover:bg-amber-100"
//                   }`}
//                 >
//                   🌡️ Warm ({pipelineInsights.warmDeals})
//                 </button>
//                 <button
//                   onClick={() => setHealthFilter("cold")}
//                   className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
//                     healthFilter === "cold" 
//                       ? "bg-rose-600 text-white shadow-sm" 
//                       : "bg-rose-50 text-rose-700 hover:bg-rose-100"
//                   }`}
//                 >
//                   ⚠️ Cold ({pipelineInsights.coldDeals})
//                 </button>
//               </div>
//             </div>
//           </div>

//           <div className="flex items-center gap-3">
//             <div className="relative flex-1 lg:flex-none">
//               <input
//                 className="w-full lg:w-80 border border-gray-300 bg-white pl-10 pr-4 py-2.5 rounded-xl outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all"
//                 placeholder="Search deals by name, company, or assignee…"
//                 value={query}
//                 onChange={(e) => setQuery(e.target.value)}
//               />
//               <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
//                 <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//                 </svg>
//               </div>
//             </div>
//             <button
//               onClick={fetchData}
//               className="p-2.5 rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
//               title="Refresh intelligence"
//             >
//               <RefreshCw size={18} />
//             </button>
//           </div>
//         </div>

//         {/* Health Intelligence Legend */}
//         {showHealthIntelligence && (
//           <div className="mb-8 p-5 bg-white rounded-2xl shadow-sm border border-gray-200">
//             <div className="flex items-center justify-between mb-4">
//               <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider flex items-center gap-2">
//                 <Thermometer size={16} />
//                 Deal Health Intelligence Guide
//               </h3>
//               <div className="flex items-center gap-2 text-sm text-gray-500">
//                 <div className="flex items-center gap-1">
//                   <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
//                   <span>Hot (70-100)</span>
//                 </div>
//                 <div className="flex items-center gap-1">
//                   <div className="w-2 h-2 rounded-full bg-amber-500"></div>
//                   <span>Warm (40-69)</span>
//                 </div>
//                 <div className="flex items-center gap-1">
//                   <div className="w-2 h-2 rounded-full bg-rose-500"></div>
//                   <span>Cold (0-39)</span>
//                 </div>
//               </div>
//             </div>
            
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//               {Object.values(HEALTH_CATEGORIES).map((category) => {
//                 const Icon = category.icon;
//                 return (
//                   <div key={category.label} className={`p-4 rounded-xl border ${category.borderColor} ${category.bgColor}`}>
//                     <div className="flex items-start gap-3 mb-2">
//                       <div className={`p-2 rounded-lg ${category.bgColor.replace('bg-', 'bg-').replace('50', '100')}`}>
//                         <Icon size={18} className={category.color} />
//                       </div>
//                       <div className="flex-1">
//                         <div className="flex items-center justify-between">
//                           <span className={`font-semibold ${category.color}`}>{category.label}</span>
//                           <span className="text-sm font-medium text-gray-600">
//                             {category.range[0]}-{category.range[1]} points
//                           </span>
//                         </div>
//                         <p className="text-sm text-gray-600 mt-1">{category.description}</p>
//                         <div className="mt-2 p-2 bg-white/50 rounded-lg border border-white/30">
//                           <p className="text-xs font-medium text-gray-700">Action Required:</p>
//                           <p className="text-xs text-gray-600">{category.action}</p>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Pipeline Board */}
//       <div ref={scrollRef} className="mx-auto flex gap-6 overflow-x-auto pb-6 max-w-[1800px]">
//         {STAGES.map((stage) => (
//           <Column
//             key={stage.id}
//             id={stage.id}
//             title={stage.title}
//             stageData={stage}
//             deals={processedColumns[stage.id] || []}
//             insights={columnInsights[stage.id]}
//             moveDeal={moveDeal}
//             onEdit={(deal) => navigate("/createDeal", { state: { deal } })}
//             onDelete={handleDeleteClick}
//             onView={(deal) => navigate(`/Pipelineview/${deal._id}`)}
//             userRole={userRole}
//             userId={userId}
//             showHealthIntelligence={showHealthIntelligence}
//           />
//         ))}
//       </div>
//     </div>
//   );
// }

// // ----- Enterprise Column Component -----
// function Column({
//   id,
//   title,
//   stageData,
//   deals,
//   insights,
//   moveDeal,
//   onEdit,
//   onDelete,
//   onView,
//   userRole,
//   userId,
//   showHealthIntelligence
// }) {
//   const [, dropRef] = useDrop({
//     accept: ItemTypes.DEAL,
//     drop: (item) => {
//       if (item.from !== id) {
//         moveDeal(item.id, item.from, id);
//       }
//     },
//   });

//   const StageIcon = stageData.icon;

//   return (
//     <div
//       ref={dropRef}
//       className={`min-w-[380px] w-[400px] flex flex-col border-2 ${stageData.borderColor} rounded-2xl bg-white shadow-sm`}
//     >
//       {/* Column Header with Intelligence */}
//       <div className={`${stageData.bgColor} p-4 rounded-t-2xl border-b ${stageData.borderColor}`}>
//         <div className="flex items-center justify-between mb-2">
//           <div className="flex items-center gap-2">
//             <div className={`p-2 rounded-lg ${stageData.bgColor.replace('50', '100')}`}>
//               <StageIcon size={18} className={stageData.color} />
//             </div>
//             <h2 className={`text-base font-bold ${stageData.color}`}>
//               {title}
//             </h2>
//           </div>
//           <span className="inline-flex items-center justify-center px-3 py-1 text-sm font-semibold text-white bg-gray-800 rounded-full min-w-[36px]">
//             {deals.length}
//           </span>
//         </div>
        
//         {/* Column Intelligence Summary */}
//         {showHealthIntelligence && insights && (
//           <div className="mt-3">
//             <div className="flex items-center justify-between text-sm mb-2">
//               <span className="text-gray-600 font-medium">Health Distribution</span>
//               <span className="font-semibold text-gray-900">
//                 Avg: {insights.avgScore}/100
//               </span>
//             </div>
            
//             {/* Health Distribution Visualization */}
//             {insights.total > 0 ? (
//               <div className="space-y-2">
//                 <div className="flex h-2 bg-gray-200 rounded-full overflow-hidden">
//                   {insights.healthDistribution.map((item, idx) => (
//                     <div
//                       key={idx}
//                       className={`${item.color} transition-all duration-300`}
//                       style={{ width: `${(item.count / insights.total) * 100}%` }}
//                       title={`${item.category}: ${item.count} deals`}
//                     />
//                   ))}
//                 </div>
                
//                 <div className="flex justify-between text-xs text-gray-500">
//                   <span>{insights.hotCount} 🔥</span>
//                   <span>{insights.warmCount} 🌡️</span>
//                   <span>{insights.coldCount} ⚠️</span>
//                 </div>
//               </div>
//             ) : (
//               <div className="text-center py-3 text-sm text-gray-500">
//                 No deals in this stage
//               </div>
//             )}
//           </div>
//         )}
//       </div>
      
//       {/* Deal Cards Container */}
//       <div className="flex-1 overflow-y-auto max-h-[calc(100vh-400px)] p-4 space-y-4">
//         {deals.length > 0 ? (
//           deals.map((deal) => (
//             <EnterpriseDealCard
//               key={deal._id}
//               deal={deal}
//               stageId={id}
//               moveDeal={moveDeal}
//               onEdit={onEdit}
//               onDelete={onDelete}
//               onView={onView}
//               userRole={userRole}
//               userId={userId}
//               showHealthIntelligence={showHealthIntelligence}
//             />
//           ))
//         ) : (
//           <div className="mt-8 border-2 border-dashed border-gray-300 p-8 text-center rounded-xl">
//             <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
//               <StageIcon size={20} className="text-gray-400" />
//             </div>
//             <p className="text-gray-500 font-medium">No deals in this stage</p>
//             <p className="text-sm text-gray-400 mt-1">Drag deals here to move them</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// // ----- Enterprise Deal Card Component -----
// function EnterpriseDealCard({
//   deal,
//   stageId,
//   moveDeal,
//   onEdit,
//   onDelete,
//   onView,
//   userRole,
//   userId,
//   showHealthIntelligence
// }) {
//   const [{ isDragging }, dragRef] = useDrag({
//     type: ItemTypes.DEAL,
//     item: { id: deal._id, from: stageId },
//     collect: (monitor) => ({ isDragging: monitor.isDragging() }),
//   });

//   const [menuOpen, setMenuOpen] = useState(false);
//   const menuRef = useRef(null);

//   const canEditDelete = userRole === "Admin" || (deal.assignedTo && deal.assignedTo._id === userId);
//   const healthCategory = getHealthCategory(deal.healthScore);
//   const HealthIcon = healthCategory.icon;
//   const momentum = deal.momentumInsights;
  
//   const assignedToName = deal.assignedTo 
//     ? `${deal.assignedTo.firstName || ""} ${deal.assignedTo.lastName || ""}`.trim()
//     : "Unassigned";

//   useEffect(() => {
//     function handleClickOutside(event) {
//       if (menuRef.current && !menuRef.current.contains(event.target)) {
//         setMenuOpen(false);
//       }
//     }

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   return (
//     <div
//       ref={dragRef}
//       className="group border border-gray-300 bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-all cursor-move flex flex-col gap-3 relative"
//       style={{ 
//         opacity: isDragging ? 0.5 : 1,
//         borderLeft: `4px solid ${healthCategory.color.replace('text-', '#').replace('700', '500')}`
//       }}
//     >
//       {/* Health Intelligence Header */}
//       {showHealthIntelligence && (
//         <div className="flex items-center justify-between mb-1">
//           <div className="flex items-center gap-2">
//             <div className={`flex items-center gap-1 px-2 py-1 rounded-lg ${healthCategory.bgColor} border ${healthCategory.borderColor}`}>
//               <HealthIcon size={12} className={healthCategory.color} />
//               <span className={`text-xs font-bold ${healthCategory.color}`}>
//                 {deal.healthScore}/100
//               </span>
//             </div>
            
//             {/* Momentum Indicators */}
//             <div className="flex items-center gap-1.5">
//               {momentum.activityGap !== null && momentum.activityGap > 7 && (
//                 <div className="flex items-center gap-0.5" title={`${momentum.activityGap} days since last activity`}>
//                   <Clock size={10} className="text-gray-400" />
//                   <span className="text-xs text-gray-500">{momentum.activityGap}d</span>
//                 </div>
//               )}
              
//               {momentum.replyEngagement !== null && momentum.replyEngagement > 0 && (
//                 <div className="flex items-center gap-0.5" title={`${momentum.replyEngagement} recent replies`}>
//                   <MessageSquare size={10} className="text-gray-400" />
//                   <span className="text-xs text-gray-500">{momentum.replyEngagement}↩️</span>
//                 </div>
//               )}
              
//               {momentum.followUpAge !== null && momentum.followUpAge > 3 && (
//                 <div className="flex items-center gap-0.5" title={`Follow-up ${momentum.followUpAge} days ago`}>
//                   <Activity size={10} className="text-gray-400" />
//                   <span className="text-xs text-gray-500">{momentum.followUpAge}d</span>
//                 </div>
//               )}
//             </div>
//           </div>
          
//           {/* Health Progress Bar (Mini) */}
//           <div className="w-16">
//             <div className="text-xs text-gray-500 text-right mb-0.5">{deal.healthScore}%</div>
//             <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
//               <div
//                 className={`h-full ${healthCategory.progressColor} transition-all duration-500`}
//                 style={{ width: `${deal.healthScore}%` }}
//               />
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Action Menu */}
//       {canEditDelete && (
//         <div className="absolute top-3 right-3" ref={menuRef}>
//           <button
//             className="p-1.5 rounded-lg bg-white/80 backdrop-blur-sm border border-gray-300 hover:bg-gray-50 opacity-0 group-hover:opacity-100 transition-all"
//             onClick={() => setMenuOpen(!menuOpen)}
//           >
//             <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 16 16">
//               <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
//             </svg>
//           </button>

//           {menuOpen && (
//             <div className="absolute right-0 mt-1 w-40 bg-white rounded-xl shadow-lg py-1 z-10 border border-gray-300">
//               <button
//                 className="flex items-center w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
//                 onClick={() => { onEdit(deal); setMenuOpen(false); }}
//               >
//                 <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
//                 </svg>
//                 Edit Deal
//               </button>
//               <button
//                 className="flex items-center w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
//                 onClick={() => { onView(deal); setMenuOpen(false); }}
//               >
//                 <Eye size={14} className="mr-2" />
//                 View Details
//               </button>
//               <div className="border-t border-gray-200 my-1"></div>
//               <button
//                 className="flex items-center w-full text-left px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50"
//                 onClick={() => { onDelete(deal); setMenuOpen(false); }}
//               >
//                 <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
//                 </svg>
//                 Remove Deal
//               </button>
//             </div>
//           )}
//         </div>
//       )}

//       {/* Deal Header */}
//       <div className={`${canEditDelete ? "pr-12" : ""}`}>
//         <h3
//           className="text-md font-semibold text-gray-900 cursor-pointer hover:text-blue-600 transition-colors line-clamp-1"
//           onClick={() => onView(deal)}
//           title={deal.dealName}
//         >
//           {deal.dealName}
//         </h3>
//         <div className="flex items-center gap-2 mt-1">
//           <div className="text-xs font-medium text-gray-700 bg-gray-100 px-2 py-1 rounded-full">
//             {deal.companyName || "No company"}
//           </div>
//           {deal.value && (
//             <div className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-full">
//               {formatCurrencyValue(deal.value)}
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Deal Intelligence Body */}
//       <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
//         <div className="grid gap-3">
//           {/* Assigned To with Role Context */}
//           <div className="flex items-center">
//             <div className="bg-gradient-to-br from-blue-100 to-indigo-100 p-2 rounded-lg mr-3">
//               <User className="w-4 h-4 text-blue-600" />
//             </div>
//             <div>
//               <div className="text-xs text-gray-500 font-medium">Assigned To</div>
//               <div className="text-sm font-semibold text-gray-900">{assignedToName}</div>
//             </div>
//           </div>

//           {/* Created Date with Age Context */}
//           <div className="flex items-center justify-between">
//             <div className="flex items-center">
//               <div className="bg-gradient-to-br from-amber-100 to-orange-100 p-2 rounded-lg mr-3">
//                 <Calendar className="w-4 h-4 text-amber-600" />
//               </div>
//               <div>
//                 <div className="text-xs text-gray-500 font-medium">Created</div>
//                 <div className="text-sm font-medium text-gray-900">{formatDate(deal.createdAt)}</div>
//               </div>
//             </div>
//           </div>

//           {/* Warnings & Alerts */}
//           {showHealthIntelligence && momentum.warnings.length > 0 && (
//             <div className="mt-2 pt-2 border-t border-gray-300">
//               <div className="flex items-start gap-1.5">
//                 <AlertTriangle size={12} className="text-amber-500 mt-0.5" />
//                 <div>
//                   <div className="text-xs font-medium text-gray-700 mb-1">Attention Needed</div>
//                   <div className="space-y-1">
//                     {momentum.warnings.map((warning, idx) => (
//                       <div key={idx} className="text-xs text-gray-600 flex items-center gap-1">
//                         <div className="w-1 h-1 rounded-full bg-amber-500"></div>
//                         {warning}
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Stage & Health Footer */}
//       <div className="flex justify-between items-center text-xs pt-2 border-t border-gray-200">
//         <div className="flex items-center gap-1.5">
//           <span className="text-gray-500 font-medium">Stage:</span>
//           <span className={`font-semibold px-2.5 py-1 rounded-full ${
//             stageId === "Closed Won" ? "bg-emerald-100 text-emerald-800" :
//             stageId === "Closed Lost" ? "bg-rose-100 text-rose-800" :
//             stageId === "Qualification" ? "bg-blue-100 text-blue-800" :
//             stageId === "Negotiation" ? "bg-amber-100 text-amber-800" :
//             "bg-purple-100 text-purple-800"
//           }`}>
//             {stageId}
//           </span>
//         </div>
        
//         {showHealthIntelligence && deal.healthScore < 70 && (
//           <div className="flex items-center gap-1">
//             <span className="text-gray-500">Priority:</span>
//             <span className={`font-semibold ${
//               deal.healthScore >= 40 ? "text-amber-600" : "text-rose-600"
//             }`}>
//               {deal.healthScore >= 40 ? "Medium" : "High"}
//             </span>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// // ----- DndProvider Wrapper -----
// export default function SalesPipelineBoard() {
//   return (
//     <DndProvider backend={HTML5Backend}>
//       <SalesPipelineBoardPure />
//     </DndProvider>
//   );
// }