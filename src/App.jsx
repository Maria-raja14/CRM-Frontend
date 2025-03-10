import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./pages/auth/login";
import Dashboard from "./pages/dashboard";
import Layout from "./navbar/Layout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login Route (Separate Page Without Sidebar/Header) */}
        <Route path="/" element={<Login />} />

        {/* Dashboard and Other Pages Inside Layout */}
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
