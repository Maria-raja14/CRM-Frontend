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
import { initSocket /*    */ } from "./utils/socket";
import { AllDeals } from "./pages/Deals/allDeals";
import Pipeline_view from "./pages/Pipeline_View/Pipelien_view";
import Pipeline_modal_view from "./pages/Pipeline_View/Pipeline_modal_view";
import AdminDashboard from "./AdminDashboard/dashboard";
import CreateDeal from "./pages/Deals/CreateDeal";
import { NotificationProvider } from "./context/NotificationContext";
import NotificationsPage from "./pages/notification/NotificationsPage";
import ViewProposal from "./pages/proposal/ViewProposal";
// // Tour Components
import { TourProvider } from "./component/Tour/TourContext";
import Tour from "./component/Tour/Tour";

import { SocketProvider } from "./context/SocketContext";
import ViewLead from "./pages/Leads/ViewLead";


function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?._id) {
      initSocket(user._id); // 🔥 start socket right after login
    }
  }, []);

  return (
    <SocketProvider>
     <TourProvider>
    <NotificationProvider>
      <BrowserRouter>
          <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white transition-all">
              <Tour />
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/layout" element={<Layout />} />
            <Route element={<Layout isModalOpen={isModalOpen} />}>
              <Route path="/adminDashboard" element={<AdminDashboard />} />
              <Route path="/user/roles" element={<UserManagement />} />
              <Route path="/invoice" element={<InvoiceHead />} />
              <Route path="/proposal" element={<ProposalHead />} />
              <Route path="/proposal/sendproposal" element={<SendProposal />} />
              <Route path="/stage" element={<ProposalBoard />} />
              <Route path="/calendar" element={<CalendarView />} />
              <Route path="/list" element={<Activity />} />
              <Route path="/leads" element={<Leads />} />
              <Route path="/createleads" element={<CreateLeads />} />
              <Route path="/deals" element={<AllDeals />} />
              <Route path="/createDeal" element={<CreateDeal />} />
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
          
            </Route>
          </Routes>
          <ToastContainer position="top-right" autoClose={3000} />
        </div>
      </BrowserRouter>
      </NotificationProvider>
      </TourProvider>
      </SocketProvider>
  );
}

export default App;