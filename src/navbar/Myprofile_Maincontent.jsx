import { useState } from "react";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

export default function PersonalInfoForm() {
    const [dob, setDob] = useState("1970-01-01");
    const [phone, setPhone] = useState("+91 9876543210");

    return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="w-full max-w-3xl rounded-lg mr-8 mt-[-120px]">
                <h2 className="text-xl text-start font-semibold  mr-8 pt-8 mt-5">Personal Info</h2>
                <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700" />

                <form className="space-y-4 mt-12">
                    <div className="grid grid-cols-3 gap-4 items-center mt-4">
                        <label className="text-gray-700">First Name</label>
                        <input
                            type="text"
                            className="col-span-2 mt-4 border border-[#f0f2f5] rounded-md px-3 py-2 w-full focus:border-blue-500 outline-none"
                            value=""
                            placeholder="Enter First Name"
                        />
                    </div>

                    <div className="grid grid-cols-3 gap-4 items-center mt-4">
                        <label className="text-gray-700">Last Name</label>
                        <input
                            type="text"
                            className="col-span-2 border border-[#f0f2f5] mt-4 rounded-md px-3 py-2 w-full focus:border-blue-500 outline-none"
                            value=""
                            placeholder="Enter Last Name"
                        />
                    </div>

                    <div className="grid grid-cols-3 gap-4 items-center mt-4">
                        <label className="text-gray-700">Enter Email</label>
                        <input
                            type="email"
                            className="col-span-2 border border-[#f0f2f5] mt-4 rounded-md px-3 py-2 w-full bg-gray-100 focus:border-blue-500 outline-none"
                            value=""
                            placeholder="Enter Email Address"
                        />
                    </div>

                    <div className="grid grid-cols-3 gap-4 items-center mt-4">
                        <label className="text-gray-700">Gender</label>
                        <div className="col-span-2 flex items-center space-x-6">
                            <label className="flex items-center space-x-2 mt-4">
                                <input type="radio" name="gender" className="accent-blue-500" defaultChecked />
                                <span>Male</span>
                            </label>
                            <label className="flex items-center space-x-2 mt-4">
                                <input type="radio" name="gender" className="accent-blue-500" />
                                <span>Female</span>
                            </label>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 items-center mt-4">
                        <label className="text-gray-700">Contact Number</label>
                        <div className="col-span-2 border border-[#f0f2f5] rounded-md focus-within:border-blue-500">
                            <PhoneInput
                                international
                                defaultCountry="IN"
                                value={phone}
                                onChange={setPhone}
                                className="w-full px-3 py-1 outline-none"
                                inputComponent={(props) => (
                                    <input
                                        {...props}
                                        className="w-full border-none outline-none px-3 py-1"
                                        placeholder="Enter Contact Number"
                                    />
                                )}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 items-center mt-4">
                        <label className="text-gray-700 mt-4">Address</label>
                        <input
                            type="text"
                            className="col-span-2 border border-[#f0f2f5] mt-4 rounded-md px-3 py-2 w-full focus:border-blue-500 outline-none"
                            value=""
                            placeholder="Enter Address"
                        />
                    </div>

                    <div className="grid grid-cols-3 gap-4 items-center mt-4">
                        <label className="text-gray-700 mt-4">DOB</label>
                        <input
                            type="date"
                            className="col-span-2 border border-[#f0f2f5] mt-4 rounded-md px-3 py-2 w-full focus:border-blue-500 outline-none"
                            value={dob}
                            onChange={(e) => setDob(e.target.value)}
                            placeholder="Select Date of Birth"
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
