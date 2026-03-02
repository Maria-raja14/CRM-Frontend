



import React from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "./Myprofile_Sidebar";
//import PersonalInfoForm from "./Myprofile_Maincontent";
import PasswordChange from "./Password_change";
//import SocialLinks from "./MyProfile_socialLinks";

const MyProfile = () => {
  return (
    <div className="flex gap-x-5 mt-6">
      {/* Sidebar */}
      <div className="w-1/4 p-4 bg-white rounded-lg shadow-md">
        <Sidebar />
      </div>

      {/* Profile Content */}
      <div className="flex-1 bg-white rounded-lg shadow-md p-6">
        <Routes>
          {/* <Route path="/" element={<PersonalInfoForm />} /> */}
          <Route path="/passwordchange" element={<PasswordChange />} />
          {/* <Route path="/social-links" element={<SocialLinks />} /> */}
        </Routes>
      </div>
    </div>
  );
};

export default MyProfile;
