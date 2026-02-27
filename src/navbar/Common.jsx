// import React from 'react';//it is original come all..
// import { Routes, Route, Outlet } from 'react-router-dom';
// import Sidebar from './Myprofile_Sidebar';
// import PersonalInfoForm from './Myprofile_Manicontent';
// import PasswordChange from './Password_change';
// // import TopCenter from './Myprofile_Topcenter'


// const MyProfile = () => {
//   return (
//     <div className="flex gap-x-5 mt-6">
//       {/* Sidebar Section with Fixed Width */}
//       {/* <div>
//         <TopCenter />
//       </div>  */}
//       <div className="w-1/4 p-4 bg-white rounded-lg shadow-md">
//         <Sidebar />
//       </div>

//       {/* Profile Info and Form */}
//       <div className="flex-1 bg-white rounded-lg shadow-md p-6">
//         <Routes>
       
//           <Route path="/" element={<PersonalInfoForm />} />
//           <Route path="/passwordchange" element={<PasswordChange />} />
//         </Routes>
//       </div>
//     </div>
//   );
// };

// export default MyProfile;

// import React from 'react'; //It is original
// import { Routes, Route, Outlet } from 'react-router-dom';
// import Sidebar from './Myprofile_Sidebar';
// import PersonalInfoForm from './Myprofile_Manicontent';
// import PasswordChange from './Password_change';
// import ProfileCard from './Myprofile_Topcenter';

// const MyProfile = () => {
//   return (
//     <div className="min-h-screen  flex flex-col">
//       {/* Topcenter (Static) */}
//       <div className="  rounded-lg mb-6">
//         <ProfileCard />
//       </div>

//       {/* Main Layout with Sidebar and Dynamic Content */}
//       <div className="flex gap-x-5">
//         {/* Sidebar (Static) */}
//         <div className="w-1/4 p-4 bg-white rounded-lg shadow-md">
//           <Sidebar />
//         </div>

//         {/* Dynamic Content (Changes Based on Route) */}
//         <div className="flex-1 bg-white rounded-lg shadow-md p-6">
//           <Routes>
//             <Route path="/" element={<PersonalInfoForm />} />
//             <Route path="/passwordchange" element={<PasswordChange />} />
//           </Routes>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MyProfile;



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
