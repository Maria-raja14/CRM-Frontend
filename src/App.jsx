import { BrowserRouter, Route, Routes } from "react-router-dom";
import React, { useEffect, useState } from "react";
import "./App.css";

// Page Imports
import Login from "./pages/auth/login";
import Layout from "./navbar/Layout";
import Dashboard from "./pages/dashboard";

import InvoiceHead from "./pages/invoice/InvoiceHead";

import UserTop from "./pages/useroles/UserTop";
import ProfileCard from "./navbar/Myprofile_Topcenter";

import CalendarView from "./pages/activities/CalendarView";
import Activity from "./pages/activityList/Activity";

import PaymentAdd from "./pages/Payment/PaymentAdd";
import Lastreasons from "./pages/lostReasons/Lastreasons";
import ProposalHead from "./pages/proposal/ProposalHead";
import TemplateHead from "./pages/proposal/TemplateHead";
import AddTemplate from "./pages/proposal/AddTemplate";
import SendProposal from "./pages/proposal/SendProposal";
import ProposalBoard from "./stage/ProposalBoard";

import CreateLeads from "./pages/Leads/CreateLeads";

import Leads from "./pages/Leads/Leads";

// Toast
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UserManagement from "./pages/useroles/UserManagement";
// import Notification from "./pages/notification/Notification";
import io from "socket.io-client";
import { initSocket /*    */ } from "./utils/socket";
import { AllDeals } from "./pages/Deals/allDeals";
import Pipeline_view from "./pages/Pipeline_View/Pipelien_view";
import AdminDashboard from "./AdminDashboard/dashboard";

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?._id) {
      initSocket(); // ✅ just call without param
    }
  }, []); // only once

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white transition-all">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/layout" element={<Layout />} />
          <Route element={<Layout isModalOpen={isModalOpen} />}>
         
            <Route path="/adminDashboard" element={<AdminDashboard />} />
            <Route path="/user/roles" element={<UserManagement />} />
            <Route path="/invoice" element={<InvoiceHead />} />
            <Route path="/dashboard/profile" element={<ProfileCard />} />
            <Route path="/LostReasons" element={<Lastreasons />} />

            <Route path="/proposal" element={<ProposalHead />} />
            <Route path="/template" element={<TemplateHead />} />
            <Route path="/template/addtemp" element={<AddTemplate />} />
            <Route path="/proposal/sendproposal" element={<SendProposal />} />
            <Route path="/stage" element={<ProposalBoard />} />

            <Route path="/calendar" element={<CalendarView />} />
            <Route path="/list" element={<Activity />} />

            <Route path="/payment" element={<PaymentAdd />} />

            <Route path="/leads" element={<Leads />} />
            <Route path="/createleads" element={<CreateLeads />} />
            <Route path="/deals" element={<AllDeals />} />

            <Route path="/Pipelineview" element={<Pipeline_view />} />

            <Route
              path="/myprofile/*"
              element={
                <div className="flex flex-col w-full">
                  <ProfileCard />
                </div>
              }
            />
          </Route>
        </Routes>
        <ToastContainer position="top-right" autoClose={3000} />
        {/* <Notification /> */}
      </div>
    </BrowserRouter>
  );
}

export default App;
