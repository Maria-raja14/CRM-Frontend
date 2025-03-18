import { useState } from "react";

export default function PasswordChangeForm() {
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="w-full max-w-3xl rounded-lg mr-8 mt-[-320px]">
                <h2 className="text-xl text-start font-semibold mr-8 pt-8 mt-5">Change Password</h2>
                <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700" />

                <form className="space-y-4 mt-12">
                    <div className="grid grid-cols-3 gap-4 items-center mt-4">
                        <label className="text-gray-700">Old Password</label>
                        <input
                            type="password"
                            placeholder="Enter old password"
                            className="col-span-2 border border-[#f0f2f5] rounded-md px-3 py-2 w-full focus:border-blue-500 outline-none"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                        />
                    </div>

                    <div className="grid grid-cols-3 gap-4 items-center mt-4">
                        <label className="text-gray-700">New Password</label>
                        <input
                            type="password"
                            placeholder="Enter new password"
                            className="col-span-2 border border-[#f0f2f5] rounded-md px-3 py-2 w-full focus:border-blue-500 outline-none"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                    </div>

                    <div className="grid grid-cols-3 gap-4 items-center mt-4">
                        <div></div>
                        <div className="col-span-2 bg-[#fff9eb] p-4 rounded-md border border-[#f0f2f5] w-full">
                            <p className="text-gray-600 text-sm">
                                The password should contain one uppercase, one lowercase, numbers, 
                                one special character ( +=≠#?!@$%^&*- ) It should be a minimum of 8 characters.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 items-center mt-4">
                        <label className="text-gray-700">Confirm Password</label>
                        <input
                            type="password"
                            placeholder="Confirm new password"
                            className="col-span-2 border border-[#f0f2f5] rounded-md px-3 py-2 w-full focus:border-blue-500 outline-none"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>

                    <div className="mt-4 flex space-x-4">
                        <button type="submit" className="px-8 py-1 bg-blue-500 text-white rounded-md shadow-md mt-4">Save</button>
                        <button type="button" className="px-6 py-1 border text-white bg-gray-500 border-[#f0f2f5] shadow-md rounded-md mt-4">Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
