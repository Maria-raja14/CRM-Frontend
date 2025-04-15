import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [isError, setIsError] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {

            const response = await axios.post("http://localhost:5000/api/auth/users/login", {  // ⬅️ Change to POST

                email,
                password,
            });
    
            console.log("Login Response:", response.data); 
    
            if (response.data.token) {
                localStorage.setItem("token", response.data.token); // ✅ Store token
                setMessage(response.data.message);
                setIsError(false);
                setTimeout(() => {
                    navigate("/layout");
                }, 1500);
            } else {
                setMessage("Token missing in response");
                setIsError(true);
            }
        } catch (error) {
            console.error("Login Error:", error.response?.data);
            setMessage(error.response?.data?.message || "Login failed");
            setIsError(true);
        }
    };
    

    return (
        <div className="flex flex-col justify-center items-center min-h-screen bg-gray-200 px-4 sm:px-6">
            {/* Logo */}
            <div className="mb-6">
                <img
                    src="https://tzi.zaarapp.com//storage/uploads/logo/logo-dark.png?1741399520"
                    alt="TZI Logo"
                    className="w-32 sm:w-45 h-auto mx-auto"
                />
            </div>
              

            {/* Login Card */}
            <div className="bg-white p-6 sm:p-6 rounded-2xl  shadow-2xl  w-full sm:w-[450px]">
                  {/* Message Display */}
                  {message && (
                    <p className={`text-center text-md ${isError ? "text-red-500" : "text-green-500"}`}>
                        {message}
                    </p>
                )}
                <h2 className="text-2xl font-semibold text-gray-800  mb-6">Login</h2>

                {/* Login Form */}
                <form className="space-y-2" onSubmit={handleLogin}>
                    <div className="mb-4">
                        <label className="text-gray-700 font-medium">Email</label>
                        <input
                            type="email"
                            className="w-full border border-gray-300 text-gray-900 rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:text-gray-500 focus:bg-blue-100"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="text-gray-700 font-medium">Password</label>
                        <input
                            type="password"
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-blue-100"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {/* Forgot Password */}
                    <div className="mb-8">
                    <p className="text-left ">
                        <Link to="/forgot-password" className="text-blue-600 hover:underline text-md mb-2">
                            Forgot your password?
                        </Link>
                    </p>
                    </div>
                    {/* Login Button */}
                    <button
                        type="submit"
                        className="w-full  text-white py-2 rounded-lg hover:bg-blue-700 transition " style={{backgroundColor:"#008ECC"}}
                    >
                        Login
                    </button>
                </form>
            </div>

            {/* Footer */}
            <p className="mt-6 text-gray-600 text-sm">© 2025 TZI</p>
        </div>
    );
};

export default Login;
