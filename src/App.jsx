// import { BrowserRouter, Route, Routes } from "react-router-dom";
// import React, { useEffect, useState } from "react";
// import "./App.css";
// import Login from "./pages/auth/login";
// import Layout from "./navbar/Layout";
// import InvoiceHead from "./pages/invoice/InvoiceHead";
// import CalendarView from "./pages/activities/CalendarView";
// import Activity from "./pages/activityList/Activity";
// import ProposalHead from "./pages/proposal/ProposalHead";
// import SendProposal from "./pages/proposal/SendProposal";
// import ProposalBoard from "./stage/ProposalBoard";
// import CreateLeads from "./pages/Leads/CreateLeads";
// import Leads from "./pages/Leads/Leads";
// import DraftsPage from "./pages/proposal/DraftsPage";
// import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import UserManagement from "./pages/useroles/UserManagement";
// import { AllDeals } from "./pages/Deals/allDeals";
// import Pipeline_view from "./pages/Pipeline_View/Pipelien_view";
// import Pipeline_modal_view from "./pages/Pipeline_View/Pipeline_modal_view";
// import AdminDashboard from "./AdminDashboard/dashboard";
// import CreateDeal from "./pages/Deals/CreateDeal";
// import { NotificationProvider } from "./context/NotificationContext";
// import NotificationsPage from "./pages/notification/NotificationsPage";
// import ViewProposal from "./pages/proposal/ViewProposal";
// import { SocketProvider } from "./context/SocketContext";
// import ViewLead from "./pages/Leads/ViewLead";
// import InvoiceView from "./pages/invoice/InvoiceView";

// import ResetPassword from "./pages/password/ResetPassword";
// import PrivateRoute from "./pages/auth/PrivateRoute";
// import ReportsPage from "./pages/reports/ReportsPage";


// import EmailChat from "./pages/Email_chat/EmailChat";
// import PrivacyPolicy from "./pages/legal/PrivacyPolicy";
// import Terms from "./pages/legal/Terms";

// //import WhatsAppChat from './pages/WhatsApp/WhatsAppChat';
// // import WhatsAppPage from "./pages/WhatsApp/Whatsapppage";
// import WhatsAppPage from "./pages/WhatsApp/WhatsApp_Page";
// function App() {
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   return (
//     <SocketProvider>
//       {/* <TourProvider> */}
//       <NotificationProvider>
//         <BrowserRouter>
//           <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white transition-all">
//             {/* <Tour /> */}

//             <Routes>
//               <Route path="/" element={<Login />} />

//                 <Route path="/privacy-policy" element={<PrivacyPolicy />} />
//                  <Route path="/terms" element={<Terms />} />
              
//                 <Route
//                   path="/reset-password/:token"
//                   element={<ResetPassword />}
//               />
//               <Route element={<PrivateRoute />}>
//                 <Route path="/layout" element={<Layout />} />
//                 <Route element={<Layout isModalOpen={isModalOpen} />}>
//                   <Route path="/adminDashboard" element={<AdminDashboard />} />
//                   <Route path="/user/roles" element={<UserManagement />} />
//                   <Route path="/invoice" element={<InvoiceHead />} />
//                   <Route path="/proposal" element={<ProposalHead />} />
//                   <Route
//                     path="/proposal/sendproposal"
//                     element={<SendProposal />}
//                   />
//                   <Route path="/stage" element={<ProposalBoard />} />
//                   <Route path="/calendar" element={<CalendarView />} />
//                   <Route path="/list" element={<Activity />} />
//                   <Route path="/leads" element={<Leads />} />
//                   <Route path="/createleads" element={<CreateLeads />} />
//                   <Route path="/deals" element={<AllDeals />} />
//                   <Route path="/createDeal" element={<CreateDeal />} />
//                   <Route path="/createDeal/:id" element={<CreateDeal />} />
//                   <Route path="/Pipelineview" element={<Pipeline_view />} />
//                   <Route
//                     path="/Pipelineview/:dealId?"
//                     element={<Pipeline_modal_view />}
//                   />
//                   <Route path="/proposal/drafts" element={<DraftsPage />} />
//                   <Route
//                     path="/dashboard/notifications"
//                     element={<NotificationsPage />}
//                   />
//                   <Route path="/proposal/view/:id" element={<ViewProposal />} />
//                   <Route path="/leads/view/:id" element={<ViewLead />} />
//                   <Route path="/invoice/:id" element={<InvoiceView />} />
//                   <Route path="reports" element={<ReportsPage />} />
//                   <Route path="/emailchat" element={<EmailChat />} />
//                   {/* <Route path="/whatsapp" element={<WhatsAppChat />} /> */}
//                   <Route path="/whatsapp" element={<WhatsAppPage />} />
//                 </Route>
//               </Route>
//             </Routes>
//             <ToastContainer position="top-right" autoClose={3000} />
//           </div>
//         </BrowserRouter>
//       </NotificationProvider>
//       {/* </TourProvider> */}
//     </SocketProvider>
//   );
// }

// export default App;//original




import { BrowserRouter, Route, Routes } from "react-router-dom";
import React, { useEffect, useState } from "react";
import "./App.css";
import Login from "./pages/auth/login";
import Layout from "./navbar/Layout";
import InvoiceHead from "./pages/invoice/InvoiceHead";
import CalendarView from "./pages/activities/CalendarView";
import Activity from "./pages/activityList/Activity";
import ProposalHead from "./pages/proposal/ProposalHead";
import SendProposal from "./pages/proposal/SendProposal";
import ProposalBoard from "./stage/ProposalBoard";
import CreateLeads from "./pages/Leads/CreateLeads";
import Leads from "./pages/Leads/Leads";
import DraftsPage from "./pages/proposal/DraftsPage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UserManagement from "./pages/useroles/UserManagement";
import { AllDeals } from "./pages/Deals/allDeals";
import Pipeline_view from "./pages/Pipeline_View/Pipelien_view";
import Pipeline_modal_view from "./pages/Pipeline_View/Pipeline_modal_view";
import AdminDashboard from "./AdminDashboard/dashboard";
import CreateDeal from "./pages/Deals/CreateDeal";
import { NotificationProvider } from "./context/NotificationContext";
import NotificationsPage from "./pages/notification/NotificationsPage";
import ViewProposal from "./pages/proposal/ViewProposal";
import { SocketProvider } from "./context/SocketContext";
import ViewLead from "./pages/Leads/ViewLead";
import InvoiceView from "./pages/invoice/InvoiceView";
import ResetPassword from "./pages/password/ResetPassword";
import PrivateRoute from "./pages/auth/PrivateRoute";
import ReportsPage from "./pages/reports/ReportsPage";
import EmailChat from "./pages/Email_chat/EmailChat";
import WhatsAppPage from "./pages/WhatsApp/WhatsApp_Page";

// ✅ Renamed files to av./pages/legal/LegalTermsBLOCKED_BY_CLIENT
// Old: PrivacyPolicy.jsx → New: LegalPrivacy.jsx
// Old: Terms.jsx         → New: LegalTerms.jsx
import LegalPrivacy from "./pages/legal/LegalPrivacy";
import LegalTerms from "./pages/legal/LegalTerms";

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ✅ Modal state for Privacy Policy and Terms
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  // ✅ Global event listeners so any component can trigger modals
  //    Usage from anywhere: window.dispatchEvent(new Event("open-privacy"))
  //                         window.dispatchEvent(new Event("open-terms"))
  useEffect(() => {
    const openPrivacy = () => setShowPrivacy(true);
    const openTerms   = () => setShowTerms(true);

    window.addEventListener("open-privacy", openPrivacy);
    window.addEventListener("open-terms",   openTerms);

    return () => {
      window.removeEventListener("open-privacy", openPrivacy);
      window.removeEventListener("open-terms",   openTerms);
    };
  }, []);

  return (
    <SocketProvider>
      <NotificationProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white transition-all">

            <Routes>
              <Route path="/" element={<Login />} />

              {/* ✅ REMOVED: /privacy-policy and /terms as page routes */}
              {/* They now open as modals anywhere in the app */}

                {/* ✅ ADD THESE BACK */}
  <Route path="/privacy-policy" element={<LegalPrivacy />} />
  <Route path="/terms-and-conditions" element={<LegalTerms />} />
              <Route
                path="/reset-password/:token"
                element={<ResetPassword />}
              />
              <Route element={<PrivateRoute />}>
                <Route path="/layout" element={<Layout />} />
                <Route element={<Layout isModalOpen={isModalOpen} />}>
                  <Route path="/adminDashboard" element={<AdminDashboard />} />
                  <Route path="/user/roles" element={<UserManagement />} />
                  <Route path="/invoice" element={<InvoiceHead />} />
                  <Route path="/proposal" element={<ProposalHead />} />
                  <Route
                    path="/proposal/sendproposal"
                    element={<SendProposal />}
                  />
                  <Route path="/stage" element={<ProposalBoard />} />
                  <Route path="/calendar" element={<CalendarView />} />
                  <Route path="/list" element={<Activity />} />
                  <Route path="/leads" element={<Leads />} />
                  <Route path="/createleads" element={<CreateLeads />} />
                  <Route path="/deals" element={<AllDeals />} />
                  <Route path="/createDeal" element={<CreateDeal />} />
                  <Route path="/createDeal/:id" element={<CreateDeal />} />
                  <Route path="/Pipelineview" element={<Pipeline_view />} />
                  <Route
                    path="/Pipelineview/:dealId?"
                    element={<Pipeline_modal_view />}
                  />
                  <Route path="/proposal/drafts" element={<DraftsPage />} />
                  <Route
                    path="/dashboard/notifications"
                    element={<NotificationsPage />}
                  />
                  <Route path="/proposal/view/:id" element={<ViewProposal />} />
                  <Route path="/leads/view/:id" element={<ViewLead />} />
                  <Route path="/invoice/:id" element={<InvoiceView />} />
                  <Route path="reports" element={<ReportsPage />} />
                  <Route path="/emailchat" element={<EmailChat />} />
                  <Route path="/whatsapp" element={<WhatsAppPage />} />
                </Route>
              </Route>
            </Routes>

            {/* ✅ Global modal overlays — rendered above all routes */}
            {/* ✅ Global modals — rendered above all routes, no routing needed */}
            {showPrivacy && (
              <LegalPrivacy onClose={() => setShowPrivacy(false)} />
            )}
            {showTerms && (
              <LegalTerms onClose={() => setShowTerms(false)} />
            )}

            <ToastContainer position="top-right" autoClose={3000} />
          </div>
        </BrowserRouter>
      </NotificationProvider>
    </SocketProvider>
  );
}

export default App;
