// import React, { useState } from "react";

// const WhatsAppPage = () => {
//   const [connected, setConnected] = useState(false);

//   const openWhatsApp = () => {
//     window.open("https://web.whatsapp.com", "_blank", "noopener,noreferrer");
//     setConnected(true);
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">

//       <style>{`
//         @keyframes float {
//           0%, 100% { transform: translateY(0px); }
//           50% { transform: translateY(-10px); }
//         }
//         @keyframes pulse-ring {
//           0% { transform: scale(0.95); opacity: 0.7; }
//           70% { transform: scale(1.15); opacity: 0; }
//           100% { transform: scale(0.95); opacity: 0; }
//         }
//         @keyframes message-in {
//           0% { opacity: 0; transform: translateX(-12px); }
//           100% { opacity: 1; transform: translateX(0); }
//         }
//         @keyframes message-in-right {
//           0% { opacity: 0; transform: translateX(12px); }
//           100% { opacity: 1; transform: translateX(0); }
//         }
//         @keyframes tick-appear {
//           0% { opacity: 0; transform: scale(0.5); }
//           100% { opacity: 1; transform: scale(1); }
//         }
//         .float-anim { animation: float 3.5s ease-in-out infinite; }
//         .pulse-ring  { animation: pulse-ring 2s ease-out infinite; }
//         .msg-left    { animation: message-in 0.5s ease forwards; }
//         .msg-right   { animation: message-in-right 0.5s ease 0.3s forwards; opacity: 0; }
//         .msg-left2   { animation: message-in 0.5s ease 0.6s forwards; opacity: 0; }
//         .tick        { animation: tick-appear 0.4s ease 1.2s forwards; opacity: 0; }
//       `}</style>

//       <div className="max-w-6xl w-full grid md:grid-cols-2 gap-6 md:gap-10 items-center">

//         {/* ── LEFT PANEL — Phone Mockup Illustration ── */}
//         <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-green-100 dark:border-gray-700 hover:shadow-2xl transition-all duration-300">
//           <div className="p-8 flex flex-col items-center text-center">

//             {/* WhatsApp logo */}
//             <div className="flex justify-center mb-5">
//               <div className="relative">
//                 <div className="absolute inset-0 rounded-full bg-green-400 pulse-ring" />
//                 <div className="relative w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg shadow-green-200 dark:shadow-green-900/40">
//                   <svg className="w-11 h-11 text-white" viewBox="0 0 24 24" fill="currentColor">
//                     <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.48 2 2 6.48 2 12c0 2.17.67 4.17 1.82 5.84L2 22l4.16-1.82C7.83 21.33 9.83 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm0 18c-1.75 0-3.37-.52-4.75-1.4l-.34-.2-2.48 1.09.99-2.42-.18-.36A7.96 7.96 0 014 12c0-4.41 3.59-8 8-8s8 3.59 8 8-3.59 8-8 8zm3.76-5.76c-.2-.1-1.2-.59-1.39-.66-.19-.07-.33-.1-.47.1-.14.2-.54.66-.66.8-.12.14-.24.16-.44.05-.2-.1-.85-.31-1.62-.99-.6-.54-1-1.2-1.12-1.4-.12-.2-.01-.31.09-.41.09-.09.2-.24.3-.36.1-.12.14-.2.2-.34.07-.14.03-.26-.02-.36-.05-.1-.47-1.13-.64-1.55-.17-.41-.35-.35-.47-.36-.12 0-.26 0-.4 0-.14 0-.36.05-.55.26-.19.21-.73.71-.73 1.74 0 1.03.75 2.02.86 2.16.11.14 1.48 2.26 3.58 3.17.5.22.89.35 1.2.44.5.16.96.14 1.32.08.4-.06 1.2-.49 1.37-.96.17-.47.17-.87.12-.96-.05-.09-.19-.14-.39-.24z" />
//                   </svg>
//                 </div>
//               </div>
//             </div>

//             <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-1">WhatsApp Web</h2>
//             <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">
//               Connect your phone to chat from your computer.
//             </p>

//             {/* Phone Mockup with chat bubbles */}
//             <div className="float-anim">
//               <div
//                 style={{
//                   width: 200,
//                   background: "linear-gradient(160deg, #1a1a2e 0%, #16213e 100%)",
//                   borderRadius: 28,
//                   padding: "10px 8px",
//                   boxShadow: "0 24px 60px rgba(0,0,0,0.3), inset 0 0 0 1.5px rgba(255,255,255,0.08)",
//                   position: "relative",
//                 }}
//               >
//                 {/* Notch */}
//                 <div style={{ display: "flex", justifyContent: "center", marginBottom: 8 }}>
//                   <div style={{ width: 60, height: 6, background: "#0f0f1a", borderRadius: 10 }} />
//                 </div>

//                 {/* Screen */}
//                 <div style={{ background: "#ECE5DD", borderRadius: 18, overflow: "hidden" }}>

//                   {/* WhatsApp header bar */}
//                   <div style={{
//                     background: "#075E54",
//                     padding: "10px 12px",
//                     display: "flex",
//                     alignItems: "center",
//                     gap: 8,
//                   }}>
//                     <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#25D366", display: "flex", alignItems: "center", justifyContent: "center" }}>
//                       <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
//                         <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
//                       </svg>
//                     </div>
//                     <div>
//                       <div style={{ color: "white", fontSize: 11, fontWeight: 600, lineHeight: 1.2 }}>Business Chat</div>
//                       <div style={{ color: "#b2dfdb", fontSize: 9 }}>online</div>
//                     </div>
//                   </div>

//                   {/* Chat area */}
//                   <div style={{ padding: "10px 8px", minHeight: 160, display: "flex", flexDirection: "column", gap: 8 }}>

//                     {/* Received message */}
//                     <div className="msg-left" style={{ display: "flex", justifyContent: "flex-start" }}>
//                       <div style={{
//                         background: "white",
//                         borderRadius: "12px 12px 12px 2px",
//                         padding: "6px 10px",
//                         maxWidth: "75%",
//                         boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
//                       }}>
//                         <div style={{ fontSize: 10, color: "#303030", lineHeight: 1.4 }}>Hey! 👋 Just connected</div>
//                         <div style={{ fontSize: 8, color: "#8696a0", textAlign: "right", marginTop: 2 }}>9:41</div>
//                       </div>
//                     </div>

//                     {/* Sent message */}
//                     <div className="msg-right" style={{ display: "flex", justifyContent: "flex-end" }}>
//                       <div style={{
//                         background: "#DCF8C6",
//                         borderRadius: "12px 12px 2px 12px",
//                         padding: "6px 10px",
//                         maxWidth: "75%",
//                         boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
//                       }}>
//                         <div style={{ fontSize: 10, color: "#303030", lineHeight: 1.4 }}>Hi there! 😊</div>
//                         <div style={{ fontSize: 8, color: "#8696a0", textAlign: "right", marginTop: 2, display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 2 }}>
//                           9:42
//                           <svg className="tick" width="14" height="10" viewBox="0 0 16 11" fill="none">
//                             <path d="M1 5.5L5 9.5L15 1.5" stroke="#53bdeb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//                             <path d="M5 9.5L15 1.5" stroke="#53bdeb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//                           </svg>
//                         </div>
//                       </div>
//                     </div>

//                     {/* Another received */}
//                     <div className="msg-left2" style={{ display: "flex", justifyContent: "flex-start" }}>
//                       <div style={{
//                         background: "white",
//                         borderRadius: "12px 12px 12px 2px",
//                         padding: "6px 10px",
//                         maxWidth: "80%",
//                         boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
//                       }}>
//                         <div style={{ fontSize: 10, color: "#303030", lineHeight: 1.4 }}>WhatsApp Web works great! 🚀</div>
//                         <div style={{ fontSize: 8, color: "#8696a0", textAlign: "right", marginTop: 2 }}>9:43</div>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Message input bar */}
//                   <div style={{
//                     background: "#f0f2f5",
//                     padding: "6px 8px",
//                     display: "flex",
//                     alignItems: "center",
//                     gap: 6,
//                   }}>
//                     <div style={{ flex: 1, background: "white", borderRadius: 20, padding: "5px 10px", fontSize: 9, color: "#aaa" }}>
//                       Type a message
//                     </div>
//                     <div style={{ width: 26, height: 26, borderRadius: "50%", background: "#25D366", display: "flex", alignItems: "center", justifyContent: "center" }}>
//                       <svg width="13" height="13" viewBox="0 0 24 24" fill="white">
//                         <path d="M2 21l21-9L2 3v7l15 2-15 2v7z"/>
//                       </svg>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Home bar */}
//                 <div style={{ display: "flex", justifyContent: "center", marginTop: 8 }}>
//                   <div style={{ width: 50, height: 4, background: "rgba(255,255,255,0.2)", borderRadius: 10 }} />
//                 </div>
//               </div>
//             </div>

//             {/* Status badges */}
//             <div className="flex items-center gap-3 mt-6">
//               <span className="flex items-center gap-1.5 text-xs text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-3 py-1.5 rounded-full font-medium border border-green-200 dark:border-green-800">
//                 <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
//                 End-to-end encrypted
//               </span>
//               <span className="flex items-center gap-1.5 text-xs text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-3 py-1.5 rounded-full font-medium border border-blue-200 dark:border-blue-800">
//                 <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
//                 </svg>
//                 Secure
//               </span>
//             </div>
//           </div>
//         </div>

//         {/* ── RIGHT PANEL — Connect Card ── */}
//         <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-green-100 dark:border-gray-700 hover:shadow-2xl transition-all duration-300">
//           <div className="p-6 md:p-8">

//             {/* Header */}
//             <div className="flex items-center gap-3 mb-2">
//               <div className="w-10 h-10 bg-green-500/10 rounded-full flex items-center justify-center">
//                 <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
//                 </svg>
//               </div>
//               <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Connect WhatsApp</h1>
//             </div>

//             <p className="text-gray-500 dark:text-gray-400 mb-6 border-l-4 border-green-500 pl-3 text-sm leading-relaxed">
//               Click the button below to open WhatsApp Web and link your account by scanning the QR code shown on screen.
//             </p>

//             {/* Steps */}
//             <div className="space-y-3 mb-7">
//               {[
//                 {
//                   icon: (
//                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9" />
//                     </svg>
//                   ),
//                   text: "Open WhatsApp Web using the button below",
//                 },
//                 {
//                   icon: (
//                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
//                     </svg>
//                   ),
//                   text: "On your phone, open WhatsApp → Settings → Linked Devices",
//                 },
//                 {
//                   icon: (
//                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
//                     </svg>
//                   ),
//                   text: 'Tap "Link a device" and scan the QR code shown on screen',
//                 },
//               ].map((step, idx) => (
//                 <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-700/40 border border-gray-100 dark:border-gray-600/40">
//                   <div className="w-7 h-7 rounded-full bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400 flex items-center justify-center flex-shrink-0 mt-0.5">
//                     {step.icon}
//                   </div>
//                   <div>
//                     <span className="text-xs font-bold text-green-600 dark:text-green-400 uppercase tracking-wide">Step {idx + 1}</span>
//                     <p className="text-sm text-gray-700 dark:text-gray-300 mt-0.5">{step.text}</p>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {/* CTA Button */}
//             <button
//               onClick={openWhatsApp}
//               className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3.5 rounded-xl transition-all duration-300 flex items-center justify-center gap-2.5 shadow-md shadow-green-200 dark:shadow-green-900/40 hover:shadow-lg transform hover:scale-[1.01] active:scale-[0.99]"
//             >
//               <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
//                 <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.48 2 2 6.48 2 12c0 2.17.67 4.17 1.82 5.84L2 22l4.16-1.82C7.83 21.33 9.83 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm0 18c-1.75 0-3.37-.52-4.75-1.4l-.34-.2-2.48 1.09.99-2.42-.18-.36A7.96 7.96 0 014 12c0-4.41 3.59-8 8-8s8 3.59 8 8-3.59 8-8 8z" />
//               </svg>
//               Open WhatsApp Web
//             </button>

//             {/* Connection status */}
//             {connected && (
//               <div className="mt-4 flex items-center gap-2 p-3 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
//                 <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
//                 </svg>
//                 <p className="text-sm font-medium text-green-700 dark:text-green-400">WhatsApp Web opened! Scan the QR code on screen.</p>
//               </div>
//             )}

//             <div className="mt-5 pt-4 border-t border-gray-100 dark:border-gray-700 text-center">
//               <p className="text-xs text-gray-400 dark:text-gray-500">
//                 After opening, scan the QR code from your mobile WhatsApp to start chatting
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Decorative element */}
//       <div className="fixed bottom-4 right-4 opacity-10 pointer-events-none">
//         <svg width="80" height="80" viewBox="0 0 24 24" fill="#25D366">
//           <path d="M12 2C6.48 2 2 6.48 2 12c0 2.17.67 4.17 1.82 5.84L2 22l4.16-1.82C7.83 21.33 9.83 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2z" />
//         </svg>
//       </div>
//     </div>
//   );
// };

// export default WhatsAppPage;//original



// import React, { useState } from "react";

// const WhatsAppPage = () => {
//   const [connected, setConnected] = useState(false);

//   const openWhatsApp = () => {
//     window.open("https://web.whatsapp.com", "_blank", "noopener,noreferrer");
//     setConnected(true);
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">

//       <style>{`
//         @keyframes float {
//           0%, 100% { transform: translateY(0px); }
//           50% { transform: translateY(-10px); }
//         }
//         @keyframes pulse-ring {
//           0% { transform: scale(0.95); opacity: 0.7; }
//           70% { transform: scale(1.15); opacity: 0; }
//           100% { transform: scale(0.95); opacity: 0; }
//         }
//         @keyframes message-in {
//           0% { opacity: 0; transform: translateX(-12px); }
//           100% { opacity: 1; transform: translateX(0); }
//         }
//         @keyframes message-in-right {
//           0% { opacity: 0; transform: translateX(12px); }
//           100% { opacity: 1; transform: translateX(0); }
//         }
//         @keyframes tick-appear {
//           0% { opacity: 0; transform: scale(0.5); }
//           100% { opacity: 1; transform: scale(1); }
//         }
//         .float-anim  { animation: float 3.5s ease-in-out infinite; }
//         .pulse-ring  { animation: pulse-ring 2s ease-out infinite; }
//         .msg-left    { animation: message-in 0.5s ease forwards; }
//         .msg-right   { animation: message-in-right 0.5s ease 0.3s forwards; opacity: 0; }
//         .msg-left2   { animation: message-in 0.5s ease 0.6s forwards; opacity: 0; }
//         .tick        { animation: tick-appear 0.4s ease 1.2s forwards; opacity: 0; }
//       `}</style>

//       {/* ── Single merged card ── */}
//       <div
//         className="w-full bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-green-100 dark:border-gray-700 overflow-hidden"
//         style={{ maxWidth: 900 }}
//       >
//         <div className="grid md:grid-cols-2">

//           {/* ── LEFT PANEL ── */}
//           <div className="flex flex-col items-center text-center p-8 bg-gradient-to-b from-green-50/60 to-white dark:from-gray-700/40 dark:to-gray-800 border-b md:border-b-0 md:border-r border-green-100 dark:border-gray-700">

//             {/* WhatsApp logo */}
//             <div className="flex justify-center mb-5">
//               <div className="relative">
//                 <div className="absolute inset-0 rounded-full bg-green-400 pulse-ring" />
//                 <div className="relative w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg shadow-green-200 dark:shadow-green-900/40">
//                   <svg className="w-11 h-11 text-white" viewBox="0 0 24 24" fill="currentColor">
//                     <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.48 2 2 6.48 2 12c0 2.17.67 4.17 1.82 5.84L2 22l4.16-1.82C7.83 21.33 9.83 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm0 18c-1.75 0-3.37-.52-4.75-1.4l-.34-.2-2.48 1.09.99-2.42-.18-.36A7.96 7.96 0 014 12c0-4.41 3.59-8 8-8s8 3.59 8 8-3.59 8-8 8zm3.76-5.76c-.2-.1-1.2-.59-1.39-.66-.19-.07-.33-.1-.47.1-.14.2-.54.66-.66.8-.12.14-.24.16-.44.05-.2-.1-.85-.31-1.62-.99-.6-.54-1-1.2-1.12-1.4-.12-.2-.01-.31.09-.41.09-.09.2-.24.3-.36.1-.12.14-.2.2-.34.07-.14.03-.26-.02-.36-.05-.1-.47-1.13-.64-1.55-.17-.41-.35-.35-.47-.36-.12 0-.26 0-.4 0-.14 0-.36.05-.55.26-.19.21-.73.71-.73 1.74 0 1.03.75 2.02.86 2.16.11.14 1.48 2.26 3.58 3.17.5.22.89.35 1.2.44.5.16.96.14 1.32.08.4-.06 1.2-.49 1.37-.96.17-.47.17-.87.12-.96-.05-.09-.19-.14-.39-.24z" />
//                   </svg>
//                 </div>
//               </div>
//             </div>

//             <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-1">WhatsApp Web</h2>
//             <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">
//               Connect your phone to chat from your computer.
//             </p>

//             {/* Phone mockup */}
//             <div className="float-anim">
//               <div style={{
//                 width: 200,
//                 background: "linear-gradient(160deg, #1a1a2e 0%, #16213e 100%)",
//                 borderRadius: 28,
//                 padding: "10px 8px",
//                 boxShadow: "0 24px 60px rgba(0,0,0,0.3), inset 0 0 0 1.5px rgba(255,255,255,0.08)",
//               }}>
//                 {/* Notch */}
//                 <div style={{ display: "flex", justifyContent: "center", marginBottom: 8 }}>
//                   <div style={{ width: 60, height: 6, background: "#0f0f1a", borderRadius: 10 }} />
//                 </div>

//                 {/* Screen */}
//                 <div style={{ background: "#ECE5DD", borderRadius: 18, overflow: "hidden" }}>

//                   {/* WhatsApp header */}
//                   <div style={{ background: "#075E54", padding: "10px 12px", display: "flex", alignItems: "center", gap: 8 }}>
//                     <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#25D366", display: "flex", alignItems: "center", justifyContent: "center" }}>
//                       <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
//                         <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
//                       </svg>
//                     </div>
//                     <div>
//                       <div style={{ color: "white", fontSize: 11, fontWeight: 600, lineHeight: 1.2 }}>Business Chat</div>
//                       <div style={{ color: "#b2dfdb", fontSize: 9 }}>online</div>
//                     </div>
//                   </div>

//                   {/* Chat bubbles */}
//                   <div style={{ padding: "10px 8px", minHeight: 160, display: "flex", flexDirection: "column", gap: 8 }}>
//                     <div className="msg-left" style={{ display: "flex", justifyContent: "flex-start" }}>
//                       <div style={{ background: "white", borderRadius: "12px 12px 12px 2px", padding: "6px 10px", maxWidth: "75%", boxShadow: "0 1px 2px rgba(0,0,0,0.1)" }}>
//                         <div style={{ fontSize: 10, color: "#303030", lineHeight: 1.4 }}>Hey! 👋 Just connected</div>
//                         <div style={{ fontSize: 8, color: "#8696a0", textAlign: "right", marginTop: 2 }}>9:41</div>
//                       </div>
//                     </div>

//                     <div className="msg-right" style={{ display: "flex", justifyContent: "flex-end" }}>
//                       <div style={{ background: "#DCF8C6", borderRadius: "12px 12px 2px 12px", padding: "6px 10px", maxWidth: "75%", boxShadow: "0 1px 2px rgba(0,0,0,0.1)" }}>
//                         <div style={{ fontSize: 10, color: "#303030", lineHeight: 1.4 }}>Hi there! 😊</div>
//                         <div style={{ fontSize: 8, color: "#8696a0", textAlign: "right", marginTop: 2, display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 2 }}>
//                           9:42
//                           <svg className="tick" width="14" height="10" viewBox="0 0 16 11" fill="none">
//                             <path d="M1 5.5L5 9.5L15 1.5" stroke="#53bdeb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//                             <path d="M5 9.5L15 1.5" stroke="#53bdeb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//                           </svg>
//                         </div>
//                       </div>
//                     </div>

//                     <div className="msg-left2" style={{ display: "flex", justifyContent: "flex-start" }}>
//                       <div style={{ background: "white", borderRadius: "12px 12px 12px 2px", padding: "6px 10px", maxWidth: "80%", boxShadow: "0 1px 2px rgba(0,0,0,0.1)" }}>
//                         <div style={{ fontSize: 10, color: "#303030", lineHeight: 1.4 }}>WhatsApp Web works great! 🚀</div>
//                         <div style={{ fontSize: 8, color: "#8696a0", textAlign: "right", marginTop: 2 }}>9:43</div>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Input bar */}
//                   <div style={{ background: "#f0f2f5", padding: "6px 8px", display: "flex", alignItems: "center", gap: 6 }}>
//                     <div style={{ flex: 1, background: "white", borderRadius: 20, padding: "5px 10px", fontSize: 9, color: "#aaa" }}>Type a message</div>
//                     <div style={{ width: 26, height: 26, borderRadius: "50%", background: "#25D366", display: "flex", alignItems: "center", justifyContent: "center" }}>
//                       <svg width="13" height="13" viewBox="0 0 24 24" fill="white">
//                         <path d="M2 21l21-9L2 3v7l15 2-15 2v7z"/>
//                       </svg>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Home bar */}
//                 <div style={{ display: "flex", justifyContent: "center", marginTop: 8 }}>
//                   <div style={{ width: 50, height: 4, background: "rgba(255,255,255,0.2)", borderRadius: 10 }} />
//                 </div>
//               </div>
//             </div>

//             {/* Status badges */}
//             <div className="flex items-center gap-3 mt-6 flex-wrap justify-center">
//               <span className="flex items-center gap-1.5 text-xs text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-3 py-1.5 rounded-full font-medium border border-green-200 dark:border-green-800">
//                 <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
//                 End-to-end encrypted
//               </span>
//               <span className="flex items-center gap-1.5 text-xs text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-3 py-1.5 rounded-full font-medium border border-blue-200 dark:border-blue-800">
//                 <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
//                 </svg>
//                 Secure
//               </span>
//             </div>
//           </div>

//           {/* ── RIGHT PANEL ── */}
//           <div className="flex flex-col justify-center p-8">

//             {/* Header */}
//             <div className="flex items-center gap-3 mb-2">
//               <div className="w-10 h-10 bg-green-500/10 rounded-full flex items-center justify-center flex-shrink-0">
//                 <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
//                 </svg>
//               </div>
//               <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Connect WhatsApp</h1>
//             </div>

//             <p className="text-gray-500 dark:text-gray-400 mb-6 border-l-4 border-green-500 pl-3 text-sm leading-relaxed">
//               Click the button below to open WhatsApp Web and link your account by scanning the QR code shown on screen.
//             </p>

//             {/* Steps */}
//             <div className="space-y-3 mb-7">
//               {[
//                 {
//                   icon: (
//                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9" />
//                     </svg>
//                   ),
//                   text: "Open WhatsApp Web using the button below",
//                 },
//                 {
//                   icon: (
//                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
//                     </svg>
//                   ),
//                   text: "On your phone, open WhatsApp → Settings → Linked Devices",
//                 },
//                 {
//                   icon: (
//                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
//                     </svg>
//                   ),
//                   text: 'Tap "Link a device" and scan the QR code shown on screen',
//                 },
//               ].map((step, idx) => (
//                 <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-700/40 border border-gray-100 dark:border-gray-600/40">
//                   <div className="w-7 h-7 rounded-full bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400 flex items-center justify-center flex-shrink-0 mt-0.5">
//                     {step.icon}
//                   </div>
//                   <div>
//                     <span className="text-xs font-bold text-green-600 dark:text-green-400 uppercase tracking-wide">Step {idx + 1}</span>
//                     <p className="text-sm text-gray-700 dark:text-gray-300 mt-0.5">{step.text}</p>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {/* CTA Button */}
//             <button
//               onClick={openWhatsApp}
//               className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3.5 rounded-xl transition-all duration-300 flex items-center justify-center gap-2.5 shadow-md shadow-green-200 dark:shadow-green-900/40 hover:shadow-lg transform hover:scale-[1.01] active:scale-[0.99]"
//             >
//               <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
//                 <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.48 2 2 6.48 2 12c0 2.17.67 4.17 1.82 5.84L2 22l4.16-1.82C7.83 21.33 9.83 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm0 18c-1.75 0-3.37-.52-4.75-1.4l-.34-.2-2.48 1.09.99-2.42-.18-.36A7.96 7.96 0 014 12c0-4.41 3.59-8 8-8s8 3.59 8 8-3.59 8-8 8z" />
//               </svg>
//               Open WhatsApp Web
//             </button>

//             {/* Success state */}
//             {connected && (
//               <div className="mt-4 flex items-center gap-2 p-3 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
//                 <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
//                 </svg>
//                 <p className="text-sm font-medium text-green-700 dark:text-green-400">WhatsApp Web opened! Scan the QR code on screen.</p>
//               </div>
//             )}

//             <div className="mt-5 pt-4 border-t border-gray-100 dark:border-gray-700 text-center">
//               <p className="text-xs text-gray-400 dark:text-gray-500">
//                 After opening, scan the QR code from your mobile WhatsApp to start chatting
//               </p>
//             </div>
//           </div>

//         </div>
//       </div>

//       {/* Decorative element */}
//       <div className="fixed bottom-4 right-4 opacity-10 pointer-events-none">
//         <svg width="80" height="80" viewBox="0 0 24 24" fill="#25D366">
//           <path d="M12 2C6.48 2 2 6.48 2 12c0 2.17.67 4.17 1.82 5.84L2 22l4.16-1.82C7.83 21.33 9.83 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2z" />
//         </svg>
//       </div>
//     </div>
//   );
// };

// export default WhatsAppPage;



import React, { useState } from "react";

const WhatsAppPage = () => {
  const [connected, setConnected] = useState(false);

  const openWhatsApp = () => {
    window.open("https://web.whatsapp.com", "_blank", "noopener,noreferrer");
    setConnected(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes pulse-ring {
          0% { transform: scale(0.95); opacity: 0.7; }
          70% { transform: scale(1.15); opacity: 0; }
          100% { transform: scale(0.95); opacity: 0; }
        }
        @keyframes message-in {
          0% { opacity: 0; transform: translateX(-12px); }
          100% { opacity: 1; transform: translateX(0); }
        }
        @keyframes message-in-right {
          0% { opacity: 0; transform: translateX(12px); }
          100% { opacity: 1; transform: translateX(0); }
        }
        @keyframes tick-appear {
          0% { opacity: 0; transform: scale(0.5); }
          100% { opacity: 1; transform: scale(1); }
        }
        .float-anim  { animation: float 3.5s ease-in-out infinite; }
        .pulse-ring  { animation: pulse-ring 2s ease-out infinite; }
        .msg-left    { animation: message-in 0.5s ease forwards; }
        .msg-right   { animation: message-in-right 0.5s ease 0.3s forwards; opacity: 0; }
        .msg-left2   { animation: message-in 0.5s ease 0.6s forwards; opacity: 0; }
        .tick        { animation: tick-appear 0.4s ease 1.2s forwards; opacity: 0; }
      `}</style>

      {/* ── Single merged card — width increased to 1200px, padding increased ── */}
      <div
        className="w-full bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-green-100 dark:border-gray-700 overflow-hidden"
        style={{ maxWidth: 1200 }}
      >
        <div className="grid md:grid-cols-2">

          {/* ── LEFT PANEL — more padding, phone mockup same size ── */}
          <div className="flex flex-col items-center text-center px-16 py-14 bg-gradient-to-b from-green-50/60 to-white dark:from-gray-700/40 dark:to-gray-800 border-b md:border-b-0 md:border-r border-green-100 dark:border-gray-700">

            {/* WhatsApp logo — SAME size */}
            <div className="flex justify-center mb-5">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-green-400 pulse-ring" />
                <div className="relative w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg shadow-green-200 dark:shadow-green-900/40">
                  <svg className="w-11 h-11 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.48 2 2 6.48 2 12c0 2.17.67 4.17 1.82 5.84L2 22l4.16-1.82C7.83 21.33 9.83 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm0 18c-1.75 0-3.37-.52-4.75-1.4l-.34-.2-2.48 1.09.99-2.42-.18-.36A7.96 7.96 0 014 12c0-4.41 3.59-8 8-8s8 3.59 8 8-3.59 8-8 8zm3.76-5.76c-.2-.1-1.2-.59-1.39-.66-.19-.07-.33-.1-.47.1-.14.2-.54.66-.66.8-.12.14-.24.16-.44.05-.2-.1-.85-.31-1.62-.99-.6-.54-1-1.2-1.12-1.4-.12-.2-.01-.31.09-.41.09-.09.2-.24.3-.36.1-.12.14-.2.2-.34.07-.14.03-.26-.02-.36-.05-.1-.47-1.13-.64-1.55-.17-.41-.35-.35-.47-.36-.12 0-.26 0-.4 0-.14 0-.36.05-.55.26-.19.21-.73.71-.73 1.74 0 1.03.75 2.02.86 2.16.11.14 1.48 2.26 3.58 3.17.5.22.89.35 1.2.44.5.16.96.14 1.32.08.4-.06 1.2-.49 1.37-.96.17-.47.17-.87.12-.96-.05-.09-.19-.14-.39-.24z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Title & subtitle — SAME size */}
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-1">WhatsApp Web</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">
              Connect your phone to chat from your computer.
            </p>

            {/* Phone mockup — SAME size */}
            <div className="float-anim">
              <div style={{
                width: 200,
                background: "linear-gradient(160deg, #1a1a2e 0%, #16213e 100%)",
                borderRadius: 28,
                padding: "10px 8px",
                boxShadow: "0 24px 60px rgba(0,0,0,0.3), inset 0 0 0 1.5px rgba(255,255,255,0.08)",
              }}>
                {/* Notch */}
                <div style={{ display: "flex", justifyContent: "center", marginBottom: 8 }}>
                  <div style={{ width: 60, height: 6, background: "#0f0f1a", borderRadius: 10 }} />
                </div>

                {/* Screen */}
                <div style={{ background: "#ECE5DD", borderRadius: 18, overflow: "hidden" }}>

                  {/* WhatsApp header */}
                  <div style={{ background: "#075E54", padding: "10px 12px", display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#25D366", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                        <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
                      </svg>
                    </div>
                    <div>
                      <div style={{ color: "white", fontSize: 11, fontWeight: 600, lineHeight: 1.2 }}>Business Chat</div>
                      <div style={{ color: "#b2dfdb", fontSize: 9 }}>online</div>
                    </div>
                  </div>

                  {/* Chat bubbles */}
                  <div style={{ padding: "10px 8px", minHeight: 160, display: "flex", flexDirection: "column", gap: 8 }}>
                    <div className="msg-left" style={{ display: "flex", justifyContent: "flex-start" }}>
                      <div style={{ background: "white", borderRadius: "12px 12px 12px 2px", padding: "6px 10px", maxWidth: "75%", boxShadow: "0 1px 2px rgba(0,0,0,0.1)" }}>
                        <div style={{ fontSize: 10, color: "#303030", lineHeight: 1.4 }}>Hey! 👋 Just connected</div>
                        <div style={{ fontSize: 8, color: "#8696a0", textAlign: "right", marginTop: 2 }}>9:41</div>
                      </div>
                    </div>

                    <div className="msg-right" style={{ display: "flex", justifyContent: "flex-end" }}>
                      <div style={{ background: "#DCF8C6", borderRadius: "12px 12px 2px 12px", padding: "6px 10px", maxWidth: "75%", boxShadow: "0 1px 2px rgba(0,0,0,0.1)" }}>
                        <div style={{ fontSize: 10, color: "#303030", lineHeight: 1.4 }}>Hi there! 😊</div>
                        <div style={{ fontSize: 8, color: "#8696a0", textAlign: "right", marginTop: 2, display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 2 }}>
                          9:42
                          <svg className="tick" width="14" height="10" viewBox="0 0 16 11" fill="none">
                            <path d="M1 5.5L5 9.5L15 1.5" stroke="#53bdeb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M5 9.5L15 1.5" stroke="#53bdeb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                      </div>
                    </div>

                    <div className="msg-left2" style={{ display: "flex", justifyContent: "flex-start" }}>
                      <div style={{ background: "white", borderRadius: "12px 12px 12px 2px", padding: "6px 10px", maxWidth: "80%", boxShadow: "0 1px 2px rgba(0,0,0,0.1)" }}>
                        <div style={{ fontSize: 10, color: "#303030", lineHeight: 1.4 }}>WhatsApp Web works great! 🚀</div>
                        <div style={{ fontSize: 8, color: "#8696a0", textAlign: "right", marginTop: 2 }}>9:43</div>
                      </div>
                    </div>
                  </div>

                  {/* Input bar */}
                  <div style={{ background: "#f0f2f5", padding: "6px 8px", display: "flex", alignItems: "center", gap: 6 }}>
                    <div style={{ flex: 1, background: "white", borderRadius: 20, padding: "5px 10px", fontSize: 9, color: "#aaa" }}>Type a message</div>
                    <div style={{ width: 26, height: 26, borderRadius: "50%", background: "#25D366", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="white">
                        <path d="M2 21l21-9L2 3v7l15 2-15 2v7z"/>
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Home bar */}
                <div style={{ display: "flex", justifyContent: "center", marginTop: 8 }}>
                  <div style={{ width: 50, height: 4, background: "rgba(255,255,255,0.2)", borderRadius: 10 }} />
                </div>
              </div>
            </div>

            {/* Status badges — SAME size */}
            <div className="flex items-center gap-3 mt-6 flex-wrap justify-center">
              <span className="flex items-center gap-1.5 text-xs text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-3 py-1.5 rounded-full font-medium border border-green-200 dark:border-green-800">
                <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
                End-to-end encrypted
              </span>
              <span className="flex items-center gap-1.5 text-xs text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-3 py-1.5 rounded-full font-medium border border-blue-200 dark:border-blue-800">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Secure
              </span>
            </div>
          </div>

          {/* ── RIGHT PANEL — more padding ── */}
          <div className="flex flex-col justify-center px-16 py-14">

            {/* Header — SAME size */}
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-green-500/10 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Connect WhatsApp</h1>
            </div>

            <p className="text-gray-500 dark:text-gray-400 mb-6 border-l-4 border-green-500 pl-3 text-sm leading-relaxed">
              Click the button below to open WhatsApp Web and link your account by scanning the QR code shown on screen.
            </p>

            {/* Steps — SAME size */}
            <div className="space-y-3 mb-7">
              {[
                {
                  icon: (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9" />
                    </svg>
                  ),
                  text: "Open WhatsApp Web using the button below",
                },
                {
                  icon: (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  ),
                  text: "On your phone, open WhatsApp → Settings → Linked Devices",
                },
                {
                  icon: (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                  ),
                  text: 'Tap "Link a device" and scan the QR code shown on screen',
                },
              ].map((step, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-700/40 border border-gray-100 dark:border-gray-600/40">
                  <div className="w-7 h-7 rounded-full bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                    {step.icon}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-green-600 dark:text-green-400 uppercase tracking-wide">Step {idx + 1}</span>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mt-0.5">{step.text}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Button — SAME size */}
            <button
              onClick={openWhatsApp}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3.5 rounded-xl transition-all duration-300 flex items-center justify-center gap-2.5 shadow-md shadow-green-200 dark:shadow-green-900/40 hover:shadow-lg transform hover:scale-[1.01] active:scale-[0.99]"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.48 2 2 6.48 2 12c0 2.17.67 4.17 1.82 5.84L2 22l4.16-1.82C7.83 21.33 9.83 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm0 18c-1.75 0-3.37-.52-4.75-1.4l-.34-.2-2.48 1.09.99-2.42-.18-.36A7.96 7.96 0 014 12c0-4.41 3.59-8 8-8s8 3.59 8 8-3.59 8-8 8z" />
              </svg>
              Open WhatsApp Web
            </button>

            {/* Success state */}
            {connected && (
              <div className="mt-4 flex items-center gap-2 p-3 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm font-medium text-green-700 dark:text-green-400">WhatsApp Web opened! Scan the QR code on screen.</p>
              </div>
            )}

            <div className="mt-5 pt-4 border-t border-gray-100 dark:border-gray-700 text-center">
              <p className="text-xs text-gray-400 dark:text-gray-500">
                After opening, scan the QR code from your mobile WhatsApp to start chatting
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* Decorative element */}
      <div className="fixed bottom-4 right-4 opacity-10 pointer-events-none">
        <svg width="80" height="80" viewBox="0 0 24 24" fill="#25D366">
          <path d="M12 2C6.48 2 2 6.48 2 12c0 2.17.67 4.17 1.82 5.84L2 22l4.16-1.82C7.83 21.33 9.83 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2z" />
        </svg>
      </div>
    </div>
  );
};

export default WhatsAppPage;