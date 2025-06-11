import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./pages/auth/login";
import Dashboard from "./pages/dashboard";
import Layout from "./navbar/Layout";
import LeadsGroup from "./pages/LeadGroup/LeadGroup"
import AddLeadGroup from "./pages/LeadGroup/AddLeadGroup";
import AddOrganization from "./pages/organization/addOrganization";
import UserTop from "./pages/useroles/UserTop";
import Pipeline from "./pages/pipeline/pipeline";
import Drag from "./pages/pipeline/components/Darg";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login Route (Separate Page Without Sidebar/Header) */}
        <Route path="/" element={<Login />} />

        {/* Dashboard and Other Pages Inside Layout */}
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/leadGroup" element={<LeadsGroup/>} />
          <Route path="/AddleadGroup" element={<AddLeadGroup />} />
          <Route path="/organization" element={<AddOrganization />} />
          <Route path="/user/roles" element={<UserTop />} />
          <Route path="/pipeline" element={<Pipeline />} />
          <Route path="/Drag" element={<Drag />} />


        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
