import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify"; 

export default function PasswordChangeForm() {
    const [email, setEmail] = useState("");
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [isSuccess, setIsSuccess] = useState(false); // Track if the message is a success

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post("http://localhost:5000/api/change-password", {
                email,
                oldPassword,
                newPassword,
                confirmPassword,
            });

            setMessage(response.data.message);
            setIsSuccess(true); // Success, so set to true
            toast.success(response.data.message); // Show success toast
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Something went wrong.";
            setMessage(errorMessage);
            setIsSuccess(false); // Failure, so set to false
            toast.error(errorMessage); // Show error toast
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="w-full max-w-3xl rounded-lg mr-8 mt-[-320px]">
                <h2 className="text-xl text-start font-semibold mr-8 pt-16 mt-5">Change Password</h2>
                <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700" />

                {/* Show message with dynamic color */}
                {message && (
                    <p
                        className={`${
                            isSuccess ? "text-green-500" : "text-red-500"
                        } font-semibold mt-4`}
                    >
                        {message}
                    </p>
                )}

                <form className="space-y-4 mt-12" onSubmit={handleSubmit}>
                    {/* Email Input */}
                    <div className="grid grid-cols-3 gap-4 items-center mt-4">
                        <label className="text-gray-700">Email</label>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="col-span-2 border border-gray-300 rounded-md px-3 py-2 w-full focus:border-blue-500 outline-none"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

               

                    {/* New Password Input */}
                    <div className="grid grid-cols-3 gap-4 items-center mt-4">
                        <label className="text-gray-700">New Password</label>
                        <input
                            type="password"
                            placeholder="Enter new password"
                            className="col-span-2 border border-gray-300 rounded-md px-3 py-2 w-full focus:border-blue-500 outline-none"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                    </div>

                                        <div className="grid grid-cols-3 gap-4 items-center mt-4">
                         <div></div>
                         <div className="col-span-2 bg-[#fff9eb] p-4 rounded-md border border-gray-300 w-full">
                             <p className="text-gray-600 text-sm">
                                 The password should contain one uppercase, one lowercase, numbers,
                                 one special character ( +=≠#?!@$%^&*- ) It should be a minimum of 8 characters.
                             </p>
                         </div>
                     </div>

                    {/* Confirm Password Input */}
                    <div className="grid grid-cols-3 gap-4 items-center mt-4">
                        <label className="text-gray-700">Confirm Password</label>
                        <input
                            type="password"
                            placeholder="Confirm new password"
                            className="col-span-2 border border-gray-300 rounded-md px-3 py-2 w-full focus:border-blue-500 outline-none"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>

                    {/* Submit Button */}
                    <div className="mt-4 flex space-x-4">
                        <button type="submit" className="px-8 py-1 bg-blue-500 text-white rounded-md shadow-md mt-4">
                            Save
                        </button>
                        <button
                            type="button"
                            className="px-6 py-1 border text-white bg-gray-500 border-gray-300 shadow-md rounded-md mt-4"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}



