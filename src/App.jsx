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
import AllStreakLeaderboard from "./pages/streak/AllStreakLeaderboard";import ChatWidget from "./components/chatwidget";

import DealIntelligenceDashboard from "./pages/Dealmetrics/pipeline";
import LostDealAnalytics from "../src/pages/LostDealModal/Lostdealreason";
import CLVDashboard from "./pages/Clv/CLVDashboard";
import ClientCLVDetails from "./pages/Clv/ClientCLVDetails";
import MassEmail from "./pages/email/MassEmail";
import WebsiteContactForm from "./pages/website/WebsiteContactForm";
import CreateEmail from "./pages/Email/CreateEmail";
import EmailHistory from "./pages/email/EmailHistory";
import ScheduledEmails from "./pages/email/ScheduledEmails";
import Settings from "./pages/settings/Settings";

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <SocketProvider userId={user?._id}>
      {/* <TourProvider> */}
      <NotificationProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white transition-all">
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/contact" element={<WebsiteContactForm />} />
              <Route element={<PrivateRoute />}>
                <Route
                  path="/reset-password/:token"
                  element={<ResetPassword />}
                />

                <Route path="/layout" element={<Layout />} />
                <Route element={<Layout isModalOpen={isModalOpen} />}>
                  <Route path="/adminDashboard" element={<AdminDashboard />} />
                  <Route path="/leaderboard" element={<AllStreakLeaderboard />} />
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
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/leads" element={<Leads />} />
                  <Route path="/createleads" element={<CreateLeads />} />
                  <Route path="/deals" element={<AllDeals />} />
                  <Route path="/createDeal" element={<CreateDeal />} />
                  <Route path="/createDeal/:id" element={<CreateDeal />} />
                  <Route path="/Pipelineview" element={<Pipeline_view />} />
                  <Route path="/test" element={<DealIntelligenceDashboard />} />
                  <Route path="/test1" element={<LostDealAnalytics />} />
                  
                  {/* FIXED: CLV Routes - Add these directly, not under /test paths */}
                  <Route path="/cltv/dashboard" element={<CLVDashboard />} />
                  <Route path="/cltv/client/:companyName" element={<ClientCLVDetails />} />
                  
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
                  <Route path="/streak-leaderboard" element={<AllStreakLeaderboard />} />

                  <Route path="reports" element={<ReportsPage />} />
                      <Route path="reports" element={<ReportsPage />} />
                      <Route path="/mass-email" element={<MassEmail />} />
                      <Route path="/create-email" element={<CreateEmail />} />
                      <Route path="/create-email/:id" element={<CreateEmail />} />
                      <Route path="/scheduled-emails" element={<ScheduledEmails />} />
                      <Route path="/email-history" element={<EmailHistory />} />
                </Route>
              </Route>
            </Routes>
            <ToastContainer position="top-right" autoClose={3000} />

          </div>
        </BrowserRouter>
      </NotificationProvider>
    </SocketProvider>
  );
}

export default App;
