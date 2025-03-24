
import { BrowserRouter, Route, Routes } from "react-router-dom";
import React, { useState, useEffect } from "react";
import "./App.css";
import Login from "./pages/auth/login";
import Dashboard from "./pages/dashboard";
import Layout from "./navbar/Layout";
import LeadsGroup from "./pages/LeadGroup/LeadGroup";
import AddLeadGroup from "./pages/LeadGroup/AddLeadGroup";
import AddPerson from "./pages/person/AddPerson";
import { ToastContainer } from "react-toastify"; // Import ToastContainer
import "react-toastify/dist/ReactToastify.css"; // Import styles
import PersonTable from "./pages/person/PersonTable";
import OrganizationPage from "./pages/organization/OrganizationPage";
import DragDropUpload from "./pages/organization/DragAndDrop";
import AddOrganization from "./pages/organization/addOrganization";
import UserTop from "./pages/useroles/UserTop";
import ProfileCard from "./navbar/Myprofile_Topcenter";
import addDeals from "./pages/allDeals/addDeals";
import AddDeals from "./pages/allDeals/addDeals";
import CardDeals from "./pages/allDeals/CardDeals";

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
 

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route element={<Layout isModalOpen={isModalOpen} />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/leadGroup" element={<LeadsGroup />} />
          <Route path="/AddleadGroup" element={<AddLeadGroup />} />
          <Route path="/organization" element={<OrganizationPage />} />
          <Route path="/import-persons" element={<DragDropUpload />} />
          <Route path="/person" element={<AddPerson />} />
          <Route path="/user/roles" element={<UserTop />} />
          <Route path="/dashboard/profile" element={<ProfileCard />} />
          <Route path="/deals" element={<AddDeals />} />
          <Route path="/cardDeal" element={<CardDeals />} />

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
    </BrowserRouter>
  );
}

export default App;
