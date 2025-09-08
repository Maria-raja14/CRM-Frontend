// //components/Login.jsx
// import React, { useState } from "react";
// import axios from "axios";
// import { Link, useNavigate } from "react-router-dom";
// import { initSocket } from "../../utils/socket";

// const Login = () => {

//  const API_URL = import.meta.env.VITE_API_URL;


//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [message, setMessage] = useState("");
//   const [isError, setIsError] = useState(false);
//   const navigate = useNavigate();

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post(
//         `${API_URL}/users/login`,
//         {
//           email,
//           password,
//         }
//       );

//       if (response.data.token) {
//         // ✅ Save user & token with role permissions
//         const loggedInUser = {
//           _id: response.data._id,
//           name: response.data.name,
//           email: response.data.email,
//           role: response.data.role, // This should include permissions and name
//         };
//         localStorage.setItem("user", JSON.stringify(loggedInUser));
//         localStorage.setItem("token", response.data.token);

//         // 🔹 Connect socket immediately after login
//         initSocket(loggedInUser._id);

//         setMessage(response.data.message);
//         setIsError(false);

//         setTimeout(() => {
//           navigate("/adminDashboard"); // or "/dashboard"
//         }, 1500);
//       } else {
//         setMessage("Token missing in response");
//         setIsError(true);
//       }
//     } catch (error) {
//       console.error("Login Error:", error.response?.data);
//       setMessage(error.response?.data?.message || "Login failed");
//       setIsError(true);
//     }
//   };

//   return (
//     <div className="flex flex-col justify-center items-center min-h-screen bg-gray-200 px-4 sm:px-6">
//       {/* Logo */}
//       <div className="mb-6">
//         <img
//           src="https://tzi.zaarapp.com//storage/uploads/logo/logo-dark.png?1741399520"
//           alt="TZI Logo"
//           className="w-32 sm:w-45 h-auto mx-auto"
//         />
//       </div>

//       {/* Login Card */}
//       <div className="bg-white p-6 sm:p-6 rounded-2xl shadow-2xl w-full sm:w-[450px]">
//         {/* Message Display */}
//         {message && (
//           <p
//             className={`text-center text-md ${
//               isError ? "text-red-500" : "text-green-500"
//             }`}
//           >
//             {message}
//           </p>
//         )}
//         <h2 className="text-2xl font-semibold text-gray-800 mb-6">Login</h2>

//         {/* Login Form */}
//         <form className="space-y-2" onSubmit={handleLogin}>
//           <div className="mb-4">
//             <label className="text-gray-700 font-medium">Email</label>
//             <input
//               type="email"
//               className="w-full border border-gray-300 text-gray-900 rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:text-gray-500 focus:bg-blue-100"
//               placeholder="Enter your email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//             />
//           </div>

//           <div className="mb-4">
//             <label className="text-gray-700 font-medium">Password</label>
//             <input
//               type="password"
//               className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-blue-100"
//               placeholder="Enter your password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//             />
//           </div>

//           {/* Forgot Password */}
//           <div className="mb-8">
//             <p className="text-left">
//               <Link
//                 to="/forgot-password"
//                 className="text-blue-600 hover:underline text-md mb-2"
//               >
//                 Forgot your password?
//               </Link>
//             </p>
//           </div>

//           {/* Login Button */}
//           <button
//             type="submit"
//             className="w-full text-white py-2 rounded-lg hover:bg-blue-700 transition"
//             style={{ backgroundColor: "#008ECC" }}
//           >
//             Login
//           </button>
//         </form>
//       </div>

//       {/* Footer */}
//       <p className="mt-6 text-gray-600 text-sm">© 2025 TZI</p>
//     </div>
//   );
// };

// export default Login;//original


// // components/Login.jsx
// import React, { useState } from "react";
// import axios from "axios";
// import { Link, useNavigate } from "react-router-dom";
// import { initSocket } from "../../utils/socket";

// const Login = () => {
//   const API_URL = import.meta.env.VITE_API_URL;

//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [message, setMessage] = useState("");
//   const [isError, setIsError] = useState(false);
//   const navigate = useNavigate();

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post(
//         `${API_URL}/users/login`,
//         {
//           email,
//           password,
//         }
//       );

//       if (response.data.token) {
//         // ✅ Save user & token with role permissions
//         const loggedInUser = {
//           _id: response.data._id,
//           name: response.data.name,
//           email: response.data.email,
//           role: response.data.role,
//         };
//         localStorage.setItem("user", JSON.stringify(loggedInUser));
//         localStorage.setItem("token", response.data.token);

//         // 🔹 Connect socket immediately after login
//         initSocket(loggedInUser._id);

//         setMessage(response.data.message);
//         setIsError(false);

//         setTimeout(() => {
//           navigate("/adminDashboard");
//         }, 1500);
//       } else {
//         setMessage("Token missing in response");
//         setIsError(true);
//       }
//     } catch (error) {
//       console.error("Login Error:", error.response?.data);
//       setMessage(error.response?.data?.message || "Login failed");
//       setIsError(true);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 flex">
//       {/* Left Side - Image */}
//       <div className="hidden lg:flex lg:w-1/2 bg-blue-50 items-center justify-center p-12">
//         <div className="max-w-md">
//           <img
//             src="/images/TZI_Logo-04_-_Copy-removebg-preview.png"
//             alt="TZI Logo"
//             className="w-full h-auto max-w-sm mx-auto"
//           />
//         </div>
//       </div>

//       {/* Right Side - Login Form */}
//       <div className="flex flex-col justify-center items-center w-full lg:w-1/2 p-6 sm:p-12">
//         <div className="w-full max-w-md">
//           {/* Mobile Logo (only shown on small screens) */}
//           <div className="mb-8 lg:hidden flex justify-center">
//             <img
//               src="/images/TZI_Logo-04_-_Copy-removebg-preview.png"
//               alt="TZI Logo"
//               className="w-40 h-auto"
//             />
//           </div>

//           {/* Login Card */}
//           <div className="bg-white p-8 rounded-2xl shadow-lg">
//             <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Login</h2>
            
//             {/* Message Display */}
//             {message && (
//               <p
//                 className={`text-center text-md mb-4 ${
//                   isError ? "text-red-500" : "text-green-500"
//                 }`}
//               >
//                 {message}
//               </p>
//             )}

//             {/* Login Form */}
//             <form className="space-y-4" onSubmit={handleLogin}>
//               <div>
//                 <label className="block text-gray-700 font-medium mb-1">Email</label>
//                 <input
//                   type="email"
//                   className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   placeholder="Enter your email"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   required
//                 />
//               </div>

//               <div>
//                 <label className="block text-gray-700 font-medium mb-1">Password</label>
//                 <input
//                   type="password"
//                   className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   placeholder="Enter your password"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   required
//                 />
//               </div>

//               {/* Forgot Password */}
//               <div className="text-right">
//                 <Link
//                   to="/forgot-password"
//                   className="text-blue-600 hover:underline text-sm"
//                 >
//                   Forgot your password?
//                 </Link>
//               </div>

//               {/* Login Button */}
//               <button
//                 type="submit"
//                 className="w-full text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition"
//                 style={{ backgroundColor: "#008ECC" }}
//               >
//                 Login
//               </button>
//             </form>
//           </div>

//           {/* Footer */}
//           <p className="mt-6 text-gray-600 text-sm text-center">© 2025 TZI</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;


// components/Login.jsx
import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { initSocket } from "../../utils/socket";
import { Eye, EyeOff } from "lucide-react";

const Login = () => {
  const API_URL = import.meta.env.VITE_API_URL;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await axios.post(
        `${API_URL}/users/login`,
        {
          email,
          password,
        }
      );

      if (response.data.token) {
        // ✅ Save user & token with role permissions
        const loggedInUser = {
          _id: response.data._id,
          name: response.data.name,
          email: response.data.email,
          role: response.data.role,
        };
        localStorage.setItem("user", JSON.stringify(loggedInUser));
        localStorage.setItem("token", response.data.token);

        // 🔹 Connect socket immediately after login
        initSocket(loggedInUser._id);

        setMessage(response.data.message);
        setIsError(false);

        setTimeout(() => {
          navigate("/adminDashboard");
        }, 1500);
      } else {
        setMessage("Token missing in response");
        setIsError(true);
      }
    } catch (error) {
      console.error("Login Error:", error.response?.data);
      setMessage(error.response?.data?.message || "Login failed");
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="flex flex-col lg:flex-row w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Left Side - Image */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 items-center justify-center p-8">
          <div className="text-center">
            <img
              src="/images/TZI_Logo-04_-_Copy-removebg-preview.png"
              alt="TZI Logo"
              className="w-full max-w-xs mx-auto mb-6"
            />
            <h2 className="text-2xl font-bold text-black-100 mt-6">Welcome Back</h2>
            <p className="text-black-100 mt-2">Sign in to access your account</p>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="flex flex-col  justify-center w-full lg:w-1/2 p-8 lg:p-12">
          {/* Mobile Logo (only shown on small screens) */}
          <div className="mb-8 lg:hidden flex justify-center">
            <img
              src="/images/TZI_Logo-04_-_Copy-removebg-preview.png"
              alt="TZI Logo"
              className="w-32 h-auto"
            />
          </div>

          <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center lg:text-left">Sign In</h2>
          <p className="text-gray-600 mb-8 text-center lg:text-left">Enter your credentials to continue</p>
          
          {/* Message Display */}
          {message && (
            <div
              className={`rounded-lg p-3 mb-6 text-center ${
                isError ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
              }`}
            >
              {message}
            </div>
          )}

          {/* Login Form */}
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition pr-10"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            {/* Forgot Password */}
            <div className="text-right">
              <Link
                to="/forgot-password"
                className="text-blue-600 hover:text-blue-800 text-sm font-medium transition"
              >
                Forgot your password?
              </Link>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition flex items-center justify-center"
              style={{ backgroundColor: "#008ECC" }}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Footer */}
          <p className="mt-8 text-gray-500 text-sm text-center">© 2025 TZI. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;


