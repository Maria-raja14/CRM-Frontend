import { BrowserRouter, Route, Routes } from "react-router-dom";
import React, { useEffect, useState } from "react";
import "./App.css";
import Login from "./pages/auth/login";
import Layout from "./navbar/Layout";
import LeadsGroup from "./pages/LeadGroup/LeadGroup";
import AddLeadGroup from "./pages/LeadGroup/AddLeadGroup";
import AddPerson from "./pages/person/AddPerson";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PersonTable from "./pages/person/PersonTable";
import { ModalProvider } from "./context/ModalContext";
import InvoiceHead from "./pages/invoice/InvoiceHead";
import OrganizationPage from "./pages/organization/OrganizationPage";
import DragDropUpload from "./pages/organization/DragAndDrop";
import AddOrganization from "./pages/organization/addOrganization";
import UserTop from "./pages/useroles/UserTop";
import ProfileCard from "./navbar/Myprofile_Topcenter";
import Lastreasons from "./pages/lostReasons/Lastreasons";
import AddDeals from "./pages/allDeals/addDeals";
import CardDeals from "./pages/allDeals/CardDeals";
import ProposalHead from "./pages/proposal/ProposalHead";
import TemplateHead from "./pages/proposal/TemplateHead";
import AddTemplate from "./pages/proposal/AddTemplate";
import SendProposal from "./pages/proposal/SendProposal";
import ProposalBoard from "./stage/ProposalBoard";
import Proposal from "./pages/reports/Proposal";
import proposalGraf from "./pages/reports/Proposalgraf";
import Proposalgraf from "./pages/reports/Proposalgraf";

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDark, setIsDark] = useState(
    localStorage.getItem("theme") === "dark"
  );

  // Apply dark mode class on initial load
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white transition-all">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/layout" element={<Layout />} />
          <Route element={<Layout isModalOpen={isModalOpen} />}>
            <Route path="/leadGroup" element={<LeadsGroup />} />
            <Route path="/AddleadGroup" element={<AddLeadGroup />} />
            <Route path="/organization" element={<OrganizationPage />} />
            <Route path="/import-persons" element={<DragDropUpload />} />
            <Route path="/person" element={<AddPerson />} />
            <Route path="/user/roles" element={<UserTop />} />
            <Route path="/invoice" element={<InvoiceHead />} />
            <Route path="/dashboard/profile" element={<ProfileCard />} />
            <Route path="/LostReasons" element={<Lastreasons />} />
            <Route path="/deals" element={<AddDeals />} />
            <Route path="/cardDeal" element={<CardDeals />} />
            <Route path="/proposal" element={<ProposalHead />} />
            <Route path="/template" element={<TemplateHead />} />
            <Route path="/template/addtemp" element={<AddTemplate />} />
            <Route path="/proposal/sendproposal" element={<SendProposal />} />
            <Route path="/stage" element={<ProposalBoard />} />
            <Route path="/report/proposal" element={<Proposal />} />
            <Route path="/report/proposalgraf" element={<Proposalgraf />} />

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
      </div>
    </BrowserRouter>
  );
}

export default App;

// import { BrowserRouter, Route, Routes } from "react-router-dom";
// import React, { useState, useEffect } from "react";
// import "./App.css";
// import Login from "./pages/auth/login";
// // import Dashboard from"./pages/dashboard";
// import Layout from "./navbar/Layout";
// import LeadsGroup from "./pages/LeadGroup/LeadGroup";
// import AddLeadGroup from "./pages/LeadGroup/AddLeadGroup";
// import AddPerson from "./pages/person/AddPerson";
// import { ToastContainer } from "react-toastify"; // Import ToastContainer
// import "react-toastify/dist/ReactToastify.css"; // Import styles
// import PersonTable from "./pages/person/PersonTable";
// import { ModalProvider } from "./context/ModalContext";
// import InvoiceHead from "./pages/invoice/InvoiceHead";

// import OrganizationPage from "./pages/organization/OrganizationPage";
// import DragDropUpload from "./pages/organization/DragAndDrop";
// import AddOrganization from "./pages/organization/addOrganization";
// import UserTop from "./pages/useroles/UserTop";
// import ProfileCard from "./navbar/Myprofile_Topcenter";
// import Lastreasons from "./pages/lostReasons/Lastreasons";
// // import MyProfile from "./pages/MyProfile/MyProfile";
// import addDeals from "./pages/allDeals/addDeals";
// import AddDeals from "./pages/allDeals/addDeals";
// import CardDeals from "./pages/allDeals/CardDeals";
// import ProposalHead from "./pages/proposal/ProposalHead";
// import TemplateHead from "./pages/proposal/TemplateHead";
// import AddTemplate from "./pages/proposal/AddTemplate";
// import SendProposal from "./pages/proposal/SendProposal";
// import ProposalBoard from "./stage/ProposalBoard";

// function App() {
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   return (

//     <BrowserRouter>
//       <div className="min-h-screen bg-white dark:bg-black text-black transition-all">

//       <Routes>
//         <Route path="/" element={<Login />} />
//         <Route path="/layout" element={<Layout/>}/>
//         <Route  element={<Layout isModalOpen={isModalOpen} />}>
//            {/* <Route path="/dashboard" element={<Dashboard />} />  */}
//           <Route path="/leadGroup" element={<LeadsGroup />} />
//           <Route path="/AddleadGroup" element={<AddLeadGroup />} />
//           <Route path="/organization" element={<OrganizationPage />} />
//           <Route path="/import-persons" element={<DragDropUpload />} />
//           <Route path="/person" element={<AddPerson />} />
//           <Route path="/user/roles" element={<UserTop />} />
//           <Route path="/invoice" element={<InvoiceHead/>}/>
//           <Route path="/dashboard/profile" element={<ProfileCard />} />
//           <Route path="/LostReasons" element={<Lastreasons/>}/>
//           <Route path="/deals" element={<AddDeals />} />
//           <Route path="/cardDeal" element={<CardDeals />} />
//           <Route path="/proposal" element={<ProposalHead/>}/>
//           <Route path="/template" element={<TemplateHead/>}/>
//           <Route path="/template/addtemp" element={<AddTemplate/>}/>
//           <Route path="/proposal/sendproposal" element={<SendProposal/>}/>
//           <Route path="/stage" element={<ProposalBoard/>}/>

//           <Route
//             path="/myprofile/*"
//             element={
//               <div className="flex flex-col w-full">
//                 <ProfileCard />

//               </div>
//             }
//           />

//         </Route>

//       </Routes>
//       </div>
//       <ToastContainer position="top-right" autoClose={3000} />
//     </BrowserRouter>
//   );
// }

// export default App;
