// import React, { useState } from 'react';//it is original
// import { MapPin, Phone, Calendar, Gift } from 'lucide-react';
// import MyProfile from './Common';

// function App() {
//   const [profileImage, setProfileImage] = useState(null);
//   const [formData,setformData] = useState();
//   const handleImageUpload = (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setProfileImage(reader.result);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const res= axios.get("http://localhost:5000/api/profiles", formData);
//             setformData(res.data);

//   return (
//     <div className="min-h-screen  flex">
//       {/* Sidebar (Fixed on the left) */}
      

//       {/* Main Content (Profile Info + PersonalInfoForm side by side) */}
//       <div className="flex-1 p-4 md:p-8">
//         <h1 className="text-3xl font-semibold text-gray-800 mb-6">My Profile</h1>

//         <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 h-[230px] flex items-center justify-center">
//           <div className="flex flex-col md:flex-row gap-8 items-center w-full">
//             {/* Profile Image Section */}
//             <div className="w-24 h-24 bg-gray-500 rounded-full flex items-center justify-center shadow-xl relative ml-4">
//               {profileImage ? (
//                 <img
//                   src={profileImage}
//                   alt="Profile"
//                   className="w-full h-full rounded-full object-cover"
//                 />
//               ) : (
//                 <span className="text-white text-xl font-semibold">LOGO</span>
//               )}
//               <input
//                 type="file"
//                 accept="image/*"
//                 onChange={handleImageUpload}
//                 className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
//               />
//             </div>

//             {/* Profile Info Section */}
//             <div className="flex-1">
//               <div className="flex flex-col md:flex-row gap-8 items-center">
//                 {/* Left Side: Zebra forest and email */}
//                 <div className="flex flex-col border-r border-gray-200 pr-8 ml-6 mb-6">
//                   <h2 className="text-2xl text-gray-800 mb-1 text-center md:text-left">Zebra Forest</h2>
//                   <p className="text-gray-500 text-center md:text-left">admin@demo.com</p>
//                   <span className="inline-block px-4 py-1 bg-emerald-500 text-white rounded-full text-sm mt-2 w-20 text-center">
//                     Active
//                   </span>
//                 </div>

//                 {/* Right Side: Info Grid with Icons */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
//                   <div className="flex items-center gap-3">
//                     <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
//                       <MapPin className="w-5 h-5 text-blue-500" />
//                     </div>
//                     <div>
//                       <p className="text-gray-500 text-sm">Address:</p>
//                       <p className="text-gray-700">Noida</p>
//                     </div>
//                   </div>

//                   <div className="flex items-center gap-3 mt-2">
//                     <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
//                       <Calendar className="w-5 h-5 text-blue-500" />
//                     </div>
//                     <div>
//                       <p className="text-gray-500 text-sm mt-2">Created:</p>
//                       <p className="text-gray-700">11-04-2024</p>
//                     </div>
//                   </div>

//                   <div className="flex items-center gap-3 mt-2">
//                     <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
//                       <Phone className="w-5 h-5 text-blue-500" />
//                     </div>
//                     <div>
//                       <p className="text-gray-500 text-sm mt-2">Contact:</p>
//                       <p className="text-gray-700">+91 82751 37815</p>
//                     </div>
//                   </div>

//                   <div className="flex items-center gap-3 mt-2">
//                     <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
//                       <Gift className="w-5 h-5 text-blue-500" />
//                     </div>
//                     <div>
//                       <p className="text-gray-500 text-sm mt-2">Date of Birth:</p>
//                       <p className="text-gray-700">1970-01-01</p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//         <div>
//         <MyProfile/>
//       </div>
//       </div>
//     </div>
//   );
// }

// export default App;





import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MapPin, Phone, Calendar, Gift } from 'lucide-react';
import MyProfile from './Common';

function App() {
  const [profileImage, setProfileImage] = useState(null);
  const [formData, setFormData] = useState({});


  

  useEffect(() => {
    console.log("dfsfsf");
    axios.get("http://localhost:5000/api/profiles")
      .then((res) => {
        setFormData(res.data);
        console.log("Profileee",res.data)
      })
      .catch((err) => {
        console.error("Error fetching profile data:", err);
      });
  }, []);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="flex-1 p-4 md:p-8">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6">My Profile</h1>

        <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 h-[230px] flex items-center justify-center">
          <div className="flex flex-col md:flex-row gap-8 items-center w-full">
            <div className="w-24 h-24 bg-gray-500 rounded-full flex items-center justify-center shadow-xl relative ml-4">
              {profileImage ? (
                <img
                  src={profileImage}
                  alt="Profile"
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <span className="text-white text-xl font-semibold">LOGO</span>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>

            <div className="flex-1">
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="flex flex-col border-r border-gray-200 pr-8 ml-6 mb-6">
                  <h2 className="text-2xl text-gray-800 mb-1 text-center md:text-left">
                    {formData.name || 'Zebra Forest'}
                  </h2>
                  <p className="text-gray-500 text-center md:text-left">{formData.email || 'admin@demo.com'}</p>
                  <span className="inline-block px-4 py-1 bg-emerald-500 text-white rounded-full text-sm mt-2 w-20 text-center">
                    Active
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">Address:</p>
                      <p className="text-gray-700">{formData.address || 'Noida'}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mt-2">
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm mt-2">Created:</p>
                      <p className="text-gray-700">{formData.created || '11-04-2024'}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mt-2">
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                      <Phone className="w-5 h-5 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm mt-2">Contact:</p>
                      <p className="text-gray-700">{formData.contact || '+91 82751 37815'}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mt-2">
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                      <Gift className="w-5 h-5 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm mt-2">Date of Birth:</p>
                      <p className="text-gray-700">{formData.dob || '1970-01-01'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <MyProfile />
        </div>
      </div>
    </div>
  );
}

export default App;


