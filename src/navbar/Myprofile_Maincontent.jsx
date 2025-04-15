// import { useState } from "react";//ori
// import axios from "axios";
// import PhoneInput from "react-phone-number-input";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import "react-phone-number-input/style.css";

// export default function PersonalInfoForm() {
//     const [formData, setFormData] = useState({
//         firstName: "",
//         lastName: "",
//         email: "",
//         gender: "Male",
//         phone: "",
//         address: "",
//         dob: "",
//     });

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData({ ...formData, [name]: value });
//     };

//     const handlePhoneChange = (value) => {
//         setFormData({ ...formData, phone: value });
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         try {
//             await axios.post("http://localhost:5000/api/profile", formData);
//             toast.success("Profile saved successfully!", { position: "top-right", autoClose: 2000 });

//             // Clear form data
//             setFormData({
//                 firstName: "",
//                 lastName: "",
//                 email: "",
//                 gender: "Male",
//                 phone: "",
//                 address: "",
//                 dob: "",
//             });
//         } catch (error) {
//             console.error("Error saving profile:", error);
//             toast.error("Failed to save profile.", { position: "top-right", autoClose: 2000 });
//         }
//     };

//     return (
//         <div className="flex justify-center items-center min-h-screen">
//             <div className="w-full max-w-3xl rounded-lg mr-8 mt-[-160px]">
//                 <h2 className="text-xl text-start font-semibold mr-8 pt mt">Personal Info</h2>
//                 <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700" />

//                 <form className="space-y-4 mt-12" onSubmit={handleSubmit}>
//                     <div className="grid grid-cols-3 gap-4 items-center mt-4">
//                         <label className="text-gray-700">First Name</label>
//                         <input
//                             type="text"
//                             name="firstName"
//                             value={formData.firstName}
//                             onChange={handleChange}
//                             className="col-span-2 border border-[#f0f2f5] rounded-md px-3 py-2 w-full focus:border-blue-500 outline-none"
//                             placeholder="Enter First Name"
//                         />
//                     </div>

//                     <div className="grid grid-cols-3 gap-4 items-center mt-4">
//                         <label className="text-gray-700">Last Name</label>
//                         <input
//                             type="text"
//                             name="lastName"
//                             value={formData.lastName}
//                             onChange={handleChange}
//                             className="col-span-2 border border-[#f0f2f5] rounded-md px-3 py-2 w-full focus:border-blue-500 outline-none"
//                             placeholder="Enter Last Name"
//                         />
//                     </div>

//                     <div className="grid grid-cols-3 gap-4 items-center mt-4">
//                         <label className="text-gray-700">Enter Email</label>
//                         <input
//                             type="email"
//                             name="email"
//                             value={formData.email}
//                             onChange={handleChange}
//                             className="col-span-2 border border-[#f0f2f5] rounded-md px-3 py-2 w-full bg-gray-100 focus:border-blue-500 outline-none"
//                             placeholder="Enter Email Address"
//                         />
//                     </div>

//                     <div className="grid grid-cols-3 gap-4 items-center mt-4">
//                         <label className="text-gray-700">Gender</label>
//                         <div className="col-span-2 flex items-center space-x-6">
//                             <label className="flex items-center space-x-2">
//                                 <input
//                                     type="radio"
//                                     name="gender"
//                                     value="Male"
//                                     checked={formData.gender === "Male"}
//                                     onChange={handleChange}
//                                 />
//                                 <span>Male</span>
//                             </label>
//                             <label className="flex items-center space-x-2">
//                                 <input
//                                     type="radio"
//                                     name="gender"
//                                     value="Female"
//                                     checked={formData.gender === "Female"}
//                                     onChange={handleChange}
//                                 />
//                                 <span>Female</span>
//                             </label>
//                         </div>
//                     </div>

//                     <div className="grid grid-cols-3 gap-4 items-center mt-4">
//                         <label className="text-gray-700">Contact Number</label>
//                         <div className="col-span-2 border border-[#f0f2f5] rounded-md focus-within:border-blue-500">
//                             <PhoneInput
//                                 international
//                                 defaultCountry="IN"
//                                 value={formData.phone}
//                                 onChange={handlePhoneChange}
//                                 className="w-full px-3 py-1 outline-none"
//                             />
//                         </div>
//                     </div>

//                     <div className="grid grid-cols-3 gap-4 items-center mt-4">
//                         <label className="text-gray-700">Address</label>
//                         <input
//                             type="text"
//                             name="address"
//                             value={formData.address}
//                             onChange={handleChange}
//                             className="col-span-2 border border-[#f0f2f5] rounded-md px-3 py-2 w-full focus:border-blue-500 outline-none"
//                             placeholder="Enter Address"
//                         />
//                     </div>

//                     <div className="grid grid-cols-3 gap-4 items-center mt-4">
//                         <label className="text-gray-700">DOB</label>
//                         <input
//                             type="date"
//                             name="dob"
//                             value={formData.dob}
//                             onChange={handleChange}
//                             className="col-span-2 border border-[#f0f2f5] rounded-md px-3 py-2 w-full focus:border-blue-500 outline-none"
//                         />
//                     </div>

//                     <div className="mt-4 flex space-x-4">
//                         <button type="submit" className="px-8 py-1 bg-blue-500 text-white rounded-md shadow-md">
//                             Save
//                         </button>
//                         <button 
//                             type="button" 
//                             className="px-6 py-1 bg-gray-500 text-white rounded-md"
//                             onClick={() => setFormData({
//                                 firstName: "",
//                                 lastName: "",
//                                 email: "",
//                                 gender: "Male",
//                                 phone: "",
//                                 address: "",
//                                 dob: "",
//                             })}
//                         >
//                             Cancel
//                         </button>
//                     </div>
//                 </form>
//                 <ToastContainer />
//             </div>
//         </div>
//     );
// }

// import { useState } from "react";
// import axios from "axios";
// import PhoneInput from "react-phone-number-input";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import "react-phone-number-input/style.css";

// export default function PersonalInfoForm() {
//     const [formData, setFormData] = useState({
//         firstName: "",
//         lastName: "",
//         email: "",
//         gender: "Male",
//         phone: "",
//         address: "",
//         dob: "",
//     });

//     const [errors, setErrors] = useState({
//         firstName: "",
//         lastName: "",
//         email: "",
//         phone: "",
//         address: "",
//         dob: "",
//     });

//     const validate = (name, value) => {
//         let error = "";
//         if (name === "firstName" && !value) {
//             error = "First Name is required.";
//         } else if (name === "lastName" && !value) {
//             error = "Last Name is required.";
//         } else if (name === "email" && !value) {
//             error = "Email is required.";
//         } else if (name === "email" && !/\S+@\S+\.\S+/.test(value)) {
//             error = "Please enter a valid email.";
//         } else if (name === "phone" && !value) {
//             error = "Phone number is required.";
//         } else if (name === "phone" && value && value.length !== 10) {
//             error = "Phone number must be 10 digits.";
//         } else if (name === "address" && !value) {
//             error = "Address is required.";
//         } else if (name === "dob" && !value) {
//             error = "Date of Birth is required.";
//         }
//         return error;
//     };

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         const error = validate(name, value);

//         setFormData({ ...formData, [name]: value });
//         setErrors({ ...errors, [name]: error });
//     };

//     const handlePhoneChange = (value) => {
//         const error = validate("phone", value);

//         setFormData({ ...formData, phone: value });
//         setErrors({ ...errors, phone: error });
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         let formIsValid = true;
//         const newErrors = {};

//         // Validate all fields
//         Object.keys(formData).forEach((field) => {
//             const error = validate(field, formData[field]);
//             if (error) {
//                 formIsValid = false;
//             }
//             newErrors[field] = error;
//         });

//         setErrors(newErrors);

//         if (formIsValid) {
//             try {
//                 await axios.post("http://localhost:5000/api/profile", formData);
//                 toast.success("Profile saved successfully!", { position: "top-right", autoClose: 2000 });

//                 // Clear form data
//                 setFormData({
//                     firstName: "",
//                     lastName: "",
//                     email: "",
//                     gender: "Male",
//                     phone: "",
//                     address: "",
//                     dob: "",
//                 });
//             } catch (error) {
//                 console.error("Error saving profile:", error);
//                 toast.error("Failed to save profile.", { position: "top-right", autoClose: 2000 });
//             }
//         }
//     };

//     return (
//         <div className="flex justify-center items-center min-h-screen">
//             <div className="w-full max-w-3xl rounded-lg mr-8 mt-[-160px]">
//                 <h2 className="text-xl text-start font-semibold mr-8 pt mt">Personal Info</h2>
//                 <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700" />

//                 <form className="space-y-4 mt-12" onSubmit={handleSubmit}>
//                     <div className="grid grid-cols-3 gap-4 items-center mt-4">
//                         <label className="text-gray-700">First Name</label>
//                         <div className="col-span-2">
//                             <input
//                                 type="text"
//                                 name="firstName"
//                                 value={formData.firstName}
//                                 onChange={handleChange}
//                                 className="border border-[#f0f2f5] rounded-md px-3 py-2 w-full focus:border-blue-500 outline-none"
//                                 placeholder="Enter First Name"
//                             />
//                             {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName}</p>}
//                         </div>
//                     </div>

//                     <div className="grid grid-cols-3 gap-4 items-center mt-4">
//                         <label className="text-gray-700">Last Name</label>
//                         <div className="col-span-2">
//                             <input
//                                 type="text"
//                                 name="lastName"
//                                 value={formData.lastName}
//                                 onChange={handleChange}
//                                 className="border border-[#f0f2f5] rounded-md px-3 py-2 w-full focus:border-blue-500 outline-none"
//                                 placeholder="Enter Last Name"
//                             />
//                             {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName}</p>}
//                         </div>
//                     </div>

//                     <div className="grid grid-cols-3 gap-4 items-center mt-4">
//                         <label className="text-gray-700">Enter Email</label>
//                         <div className="col-span-2">
//                             <input
//                                 type="email"
//                                 name="email"
//                                 value={formData.email}
//                                 onChange={handleChange}
//                                 className="border border-[#f0f2f5] rounded-md px-3 py-2 w-full bg-gray-100 focus:border-blue-500 outline-none"
//                                 placeholder="Enter Email Address"
//                             />
//                             {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
//                         </div>
//                     </div>

//                     <div className="grid grid-cols-3 gap-4 items-center mt-4">
//                         <label className="text-gray-700">Gender</label>
//                         <div className="col-span-2 flex items-center space-x-6">
//                             <label className="flex items-center space-x-2">
//                                 <input
//                                     type="radio"
//                                     name="gender"
//                                     value="Male"
//                                     checked={formData.gender === "Male"}
//                                     onChange={handleChange}
//                                 />
//                                 <span>Male</span>
//                             </label>
//                             <label className="flex items-center space-x-2">
//                                 <input
//                                     type="radio"
//                                     name="gender"
//                                     value="Female"
//                                     checked={formData.gender === "Female"}
//                                     onChange={handleChange}
//                                 />
//                                 <span>Female</span>
//                             </label>
//                         </div>
//                     </div>

//                     <div className="grid grid-cols-3 gap-4 items-center mt-4">
//                         <label className="text-gray-700">Contact Number</label>
//                         <div className="col-span-2 border border-[#f0f2f5] rounded-md focus-within:border-blue-500">
//                             <PhoneInput
//                                 international
//                                 defaultCountry="IN"
//                                 value={formData.phone}
//                                 onChange={handlePhoneChange}
//                                 className="w-full px-3 py-1 outline-none"
//                             />
//                             {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
//                         </div>
//                     </div>

//                     <div className="grid grid-cols-3 gap-4 items-center mt-4">
//                         <label className="text-gray-700">Address</label>
//                         <div className="col-span-2">
//                             <input
//                                 type="text"
//                                 name="address"
//                                 value={formData.address}
//                                 onChange={handleChange}
//                                 className="border border-[#f0f2f5] rounded-md px-3 py-2 w-full focus:border-blue-500 outline-none"
//                                 placeholder="Enter Address"
//                             />
//                             {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}
//                         </div>
//                     </div>

//                     <div className="grid grid-cols-3 gap-4 items-center mt-4">
//                         <label className="text-gray-700">DOB</label>
//                         <div className="col-span-2">
//                             <input
//                                 type="date"
//                                 name="dob"
//                                 value={formData.dob}
//                                 onChange={handleChange}
//                                 className="border border-[#f0f2f5] rounded-md px-3 py-2 w-full focus:border-blue-500 outline-none"
//                             />
//                             {errors.dob && <p className="text-red-500 text-sm">{errors.dob}</p>}
//                         </div>
//                     </div>

//                     <div className="mt-4 flex space-x-4">
//                         <button type="submit" className="px-8 py-1 bg-blue-500 text-white rounded-md shadow-md">
//                             Save
//                         </button>
//                         <button 
//                             type="button" 
//                             className="px-6 py-1 bg-gray-500 text-white rounded-md"
//                             onClick={() => setFormData({
//                                 firstName: "",
//                                 lastName: "",
//                                 email: "",
//                                 gender: "Male",
//                                 phone: "",
//                                 address: "",
//                                 dob: "",
//                             })}
//                         >
//                             Cancel
//                         </button>
//                     </div>
//                 </form>
//                 <ToastContainer />
//             </div>
//         </div>
//     );
// }



// import { useState } from "react";
// import axios from "axios";
// import PhoneInput from "react-phone-number-input";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import "react-phone-number-input/style.css";

// export default function PersonalInfoForm() {
//     const [formData, setFormData] = useState({
//         firstName: "",
//         lastName: "",
//         email: "",
//         gender: "Male",
//         phone: "",
//         address: "",
//         dob: "",
//     });

//     const [errors, setErrors] = useState({
//         firstName: "",
//         lastName: "",
//         email: "",
//         phone: "",
//         address: "",
//         dob: "",
//     });

//     const validate = (name, value) => {
//         let error = "";
//         if (name === "firstName" && !value) {
//             error = "First Name is required.";
//         } else if (name === "lastName" && !value) {
//             error = "Last Name is required.";
//         } else if (name === "email" && !value) {
//             error = "Email is required.";
//         } else if (name === "email" && !/\S+@\S+\.\S+/.test(value)) {
//             error = "Please enter a valid email.";
//         } else if (name === "phone" && !value) {
//             error = "Phone number is required.";
//         } else if (name === "phone" && value && value.length == 10) {
//             error = "Phone number must be 10 digits.";
//         } else if (name === "address" && !value) {
//             error = "Address is required.";
//         } else if (name === "dob" && !value) {
//             error = "Date of Birth is required.";
//         }
//         return error;
//     };

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         const error = validate(name, value);

//         setFormData({ ...formData, [name]: value });
//         setErrors({ ...errors, [name]: error });
//     };

//     const handlePhoneChange = (value) => {
//         const error = validate("phone", value);

//         setFormData({ ...formData, phone: value });
//         setErrors({ ...errors, phone: error });
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         let formIsValid = true;
//         const newErrors = {};

//         // Validate all fields
//         Object.keys(formData).forEach((field) => {
//             const error = validate(field, formData[field]);
//             if (error) {
//                 formIsValid = false;
//             }
//             newErrors[field] = error;
//         });

//         setErrors(newErrors);

//         if (formIsValid) {
//             try {
//                 await axios.post("http://localhost:5000/api/profile", formData);
//                 toast.success("Profile saved successfully!", { position: "top-right", autoClose: 2000 });

//                 // Clear form data
//                 setFormData({
//                     firstName: "",
//                     lastName: "",
//                     email: "",
//                     gender: "Male",
//                     phone: "",
//                     address: "",
//                     dob: "",
//                 });
//             } catch (error) {
//                 console.error("Error saving profile:", error);
//                 toast.error("Failed to save profile.", { position: "top-right", autoClose: 2000 });
//             }
//         }
//     };

//     const handleCancel = () => {
//         setFormData({
//             firstName: "",
//             lastName: "",
//             email: "",
//             gender: "Male",
//             phone: "",
//             address: "",
//             dob: "",
//         });
//         setErrors({
//             firstName: "",
//             lastName: "",
//             email: "",
//             phone: "",
//             address: "",
//             dob: "",
//         });
//     };

//     return (
//         <div className="flex justify-center items-center min-h-screen">
//             <div className="w-full max-w-3xl rounded-lg mr-8 mt-[-160px]">
//                 <h2 className="text-xl text-start font-semibold mr-8 pt mt">Personal Info</h2>
//                 <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700" />

//                 <form className="space-y-4 mt-12" onSubmit={handleSubmit}>
//                     <div className="grid grid-cols-3 gap-4 items-center mt-4">
//                         <label className="text-gray-700">First Name</label>
//                         <div className="col-span-2">
//                             <input
//                                 type="text"
//                                 name="firstName"
//                                 value={formData.firstName}
//                                 onChange={handleChange}
//                                 className="border border-[#f0f2f5] rounded-md px-3 py-2 w-full focus:border-blue-500 outline-none"
//                                 placeholder="Enter First Name"
//                             />
//                             {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
//                         </div>
//                     </div>

//                     <div className="grid grid-cols-3 gap-4 items-center mt-4">
//                         <label className="text-gray-700">Last Name</label>
//                         <div className="col-span-2">
//                             <input
//                                 type="text"
//                                 name="lastName"
//                                 value={formData.lastName}
//                                 onChange={handleChange}
//                                 className="border border-[#f0f2f5] rounded-md px-3 py-2 w-full focus:border-blue-500 outline-none"
//                                 placeholder="Enter Last Name"
//                             />
//                             {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
//                         </div>
//                     </div>

//                     <div className="grid grid-cols-3 gap-4 items-center mt-4">
//                         <label className="text-gray-700">Enter Email</label>
//                         <div className="col-span-2">
//                             <input
//                                 type="email"
//                                 name="email"
//                                 value={formData.email}
//                                 onChange={handleChange}
//                                 className="border border-[#f0f2f5] rounded-md px-3 py-2 w-full bg-gray-100 focus:border-blue-500 outline-none"
//                                 placeholder="Enter Email Address"
//                             />
//                             {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
//                         </div>
//                     </div>

//                     <div className="grid grid-cols-3 gap-4 items-center mt-4">
//                         <label className="text-gray-700">Gender</label>
//                         <div className="col-span-2 flex items-center space-x-6">
//                             <label className="flex items-center space-x-2">
//                                 <input
//                                     type="radio"
//                                     name="gender"
//                                     value="Male"
//                                     checked={formData.gender === "Male"}
//                                     onChange={handleChange}
//                                 />
//                                 <span>Male</span>
//                             </label>
//                             <label className="flex items-center space-x-2">
//                                 <input
//                                     type="radio"
//                                     name="gender"
//                                     value="Female"
//                                     checked={formData.gender === "Female"}
//                                     onChange={handleChange}
//                                 />
//                                 <span>Female</span>
//                             </label>
//                         </div>
//                     </div>



//                     <div className="grid grid-cols-3 gap-4 items-center mt-4">
//                         <label className="text-gray-700">Contact Number</label>
//                         <div className="col-span-2 border border-[#f0f2f5] rounded-md focus-within:border-blue-500 relative">
//                             <PhoneInput
//                                 international
//                                 defaultCountry="IN"
//                                 value={formData.phone}
//                                 onChange={handlePhoneChange}
//                                 className="w-full px-3 py-1 outline-none"
//                             />
//                             {errors.phone && <p className="text-red-500 text-sm mb-2 absolute left-0">{errors.phone}</p>}
//                         </div>
//                     </div>


//                     <div className="grid grid-cols-3 gap-4 items-center mt-4">
//                         <label className="text-gray-700">Address</label>
//                         <div className="col-span-2">
//                             <input
//                                 type="text"
//                                 name="address"
//                                 value={formData.address}
//                                 onChange={handleChange}
//                                 className="border border-[#f0f2f5] rounded-md px-3 py-2 w-full focus:border-blue-500 outline-none"
//                                 placeholder="Enter Address"
//                             />
//                             {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
//                         </div>
//                     </div>

//                     <div className="grid grid-cols-3 gap-4 items-center mt-4">
//                         <label className="text-gray-700">DOB</label>
//                         <div className="col-span-2">
//                             <input
//                                 type="date"
//                                 name="dob"
//                                 value={formData.dob}
//                                 onChange={handleChange}
//                                 className="border border-[#f0f2f5] rounded-md px-3 py-2 w-full focus:border-blue-500 outline-none"
//                             />
//                             {errors.dob && <p className="text-red-500 text-sm mt-1">{errors.dob}</p>}
//                         </div>
//                     </div>

//                     <div className="mt-4 flex space-x-4">
//                         <button type="submit" className="px-8 py-1 bg-blue-500 text-white rounded-md shadow-md">
//                             Save
//                         </button>
//                         <button
//                             type="button"
//                             className="px-6 py-1 bg-gray-500 text-white rounded-md"
//                             onClick={handleCancel}
//                         >
//                             Cancel
//                         </button>
//                     </div>
//                 </form>
//                 <ToastContainer />
//             </div>
//         </div>
//     );
// }



import { useState } from "react";
import axios from "axios";
import PhoneInput from "react-phone-number-input";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-phone-number-input/style.css";

export default function PersonalInfoForm() {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        gender: "Male",
        phone: "",
        address: "",
        dob: "",
    });

    const [errors, setErrors] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        address: "",
        dob: "",
    });

    const validate = (name, value) => {
        let error = "";
        if (name === "firstName" && !value) {
            error = "First Name is required.";
        } else if (name === "lastName" && !value) {
            error = "Last Name is required.";
        } else if (name === "email" && !value) {
            error = "Email is required.";
        } else if (name === "email" && !/\S+@\S+\.\S+/.test(value)) {
            error = "Please enter a valid email.";
        } else if (name === "phone" && !value) {
            error = "Phone number is required.";
        } else if (name === "phone" && value && value.length < 10) {
            error = "Phone number must be at least 10 digits.";
        } else if (name === "address" && !value) {
            error = "Address is required.";
        } else if (name === "dob" && !value) {
            error = "Date of Birth is required.";
        }
        return error;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        const error = validate(name, value);

        setFormData({ ...formData, [name]: value });
        setErrors({ ...errors, [name]: error });
    };

    const handlePhoneChange = (value) => {
        const error = validate("phone", value);

        setFormData({ ...formData, phone: value });
        setErrors({ ...errors, phone: error });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        let formIsValid = true;
        const newErrors = {};

        // Validate all fields
        Object.keys(formData).forEach((field) => {
            const error = validate(field, formData[field]);
            if (error) {
                formIsValid = false;
            }
            newErrors[field] = error;
        });

        setErrors(newErrors);

        if (formIsValid) {
            try {
                await axios.post("http://localhost:5000/api/profile", formData);
                toast.success("Profile saved successfully!", { position: "top-right", autoClose: 2000 });

                // Clear form data
                setFormData({
                    firstName: "",
                    lastName: "",
                    email: "",
                    gender: "Male",
                    phone: "",
                    address: "",
                    dob: "",
                });
            } catch (error) {
                console.error("Error saving profile:", error);
                toast.error("Failed to save profile.", { position: "top-right", autoClose: 2000 });
            }
        }
    };

    const handleCancel = () => {
        setFormData({
            firstName: "",
            lastName: "",
            email: "",
            gender: "Male",
            phone: "",
            address: "",
            dob: "",
        });
        setErrors({
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            address: "",
            dob: "",
        });
    };

    return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="w-full max-w-3xl rounded-lg mr-8 mt-[-160px]">
                <h2 className="text-xl text-start font-semibold mr-8 pt mt">Personal Info</h2>
                <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700" />

                <form className="space-y-6 mt-12" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-3 gap-4 items-center mt-4">
                        <label className="text-gray-700">First Name</label>
                        <div className="col-span-2">
                            <input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                className="border border-[#f0f2f5] rounded-md px-3 py-2 w-full focus:border-blue-500 outline-none"
                                placeholder="Enter First Name"
                            />
                            {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 items-center mt-4">
                        <label className="text-gray-700">Last Name</label>
                        <div className="col-span-2">
                            <input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                className="border border-[#f0f2f5] rounded-md px-3 py-2 w-full focus:border-blue-500 outline-none"
                                placeholder="Enter Last Name"
                            />
                            {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 items-center mt-4">
                        <label className="text-gray-700">Enter Email</label>
                        <div className="col-span-2">
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="border border-[#f0f2f5] rounded-md px-3 py-2 w-full bg-gray-100 focus:border-blue-500 outline-none"
                                placeholder="Enter Email Address"
                            />
                            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 items-center mt-4">
                        <label className="text-gray-700">Gender</label>
                        <div className="col-span-2 flex items-center space-x-6">
                            <label className="flex items-center space-x-2">
                                <input
                                    type="radio"
                                    name="gender"
                                    value="Male"
                                    checked={formData.gender === "Male"}
                                    onChange={handleChange}
                                />
                                <span>Male</span>
                            </label>
                            <label className="flex items-center space-x-2">
                                <input
                                    type="radio"
                                    name="gender"
                                    value="Female"
                                    checked={formData.gender === "Female"}
                                    onChange={handleChange}
                                />
                                <span>Female</span>
                            </label>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 items-center mt-4">
                        <label className="text-gray-700">Contact Number</label>
                        <div className="col-span-2 border border-[#f0f2f5] rounded-md focus-within:border-blue-500 relative">
                            <PhoneInput
                                international
                                defaultCountry="IN"
                                value={formData.phone}
                                onChange={handlePhoneChange}
                                className="w-full px-3 py-1 outline-none"
                            />
                            {errors.phone && <p className="text-red-500 text-sm mb-2 absolute left-0">{errors.phone}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 items-center mt-4">
                        <label className="text-gray-700">Address</label>
                        <div className="col-span-2">
                            <input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                className="border border-[#f0f2f5] rounded-md px-3 py-2 w-full focus:border-blue-500 outline-none"
                                placeholder="Enter Address"
                            />
                            {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 items-center mt-4">
                        <label className="text-gray-700">DOB</label>
                        <div className="col-span-2">
                            <input
                                type="date"
                                name="dob"
                                value={formData.dob}
                                onChange={handleChange}
                                className="border border-[#f0f2f5] rounded-md px-3 py-2 w-full focus:border-blue-500 outline-none"
                            />
                            {errors.dob && <p className="text-red-500 text-sm mt-1">{errors.dob}</p>}
                        </div>
                    </div>

                    <div className="mt-4 flex space-x-4">
                        <button type="submit" className="px-8 py-1 bg-blue-500 text-white rounded-md shadow-md">
                            Save
                        </button>
                        <button
                            type="button"
                            className="px-6 py-1 bg-gray-500 text-white rounded-md"
                            onClick={handleCancel}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
                <ToastContainer />
            </div>
        </div>
    );
}
