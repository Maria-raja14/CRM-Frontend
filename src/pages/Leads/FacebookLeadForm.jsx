// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { toast, ToastContainer } from 'react-toastify';
// import axios from 'axios';
// import { getNames } from 'country-list';
// import {
//   User, Phone, Mail, MapPin, FileText, Globe, Building2,
//   Briefcase, Calendar, StickyNote, ArrowLeft, Users,
// } from 'lucide-react';
// import 'react-toastify/dist/ReactToastify.css';
// import PhoneInput from 'react-phone-input-2';
// import 'react-phone-input-2/lib/style.css';

// export default function FacebookLeadForm() {
//   const API_URL = import.meta.env.VITE_API_URL;
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     leadName:       '',
//     phoneNumber:    '',
//     email:          '',
//     destination:    '',
//     duration:       '',
//     requirement:    '',
//     address:        '',
//     country:        '',
//     notes:          '',
//     noOfTravellers: '',
//     travelDate:     '',
//   });

//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [fieldErrors, setFieldErrors] = useState({});
//   const [countries] = useState(getNames());
//   const [phoneCountryData, setPhoneCountryData] = useState({
//     countryCode: 'in',
//     dialCode:    '91',
//     name:        'India',
//   });

//   // Optional: email validation (not required)
//   const validateEmailDomain = (email) => {
//     if (!email) return true;
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     return emailRegex.test(email);
//   };

//   // Optional: phone validation (not required)
//   const validatePhoneNumber = (fullNumber, countryData) => {
//     if (!fullNumber) return { valid: true, message: '' };
//     const digitsOnly = String(fullNumber).replace(/\D/g, '');
//     const dialCode = String(countryData?.dialCode || '').replace(/\D/g, '');
//     let nationalNumber = digitsOnly;
//     if (dialCode && digitsOnly.startsWith(dialCode)) {
//       nationalNumber = digitsOnly.slice(dialCode.length);
//     }
//     const nationalDigits = nationalNumber.replace(/^0+/, '') || nationalNumber;
//     if (countryData?.countryCode === 'in') {
//       if (nationalDigits.length !== 10) {
//         return { valid: false, message: 'Indian phone number must be exactly 10 digits' };
//       }
//       if (!/^[6-9]/.test(nationalDigits)) {
//         return { valid: false, message: 'Indian phone number must start with 6, 7, 8, or 9' };
//       }
//     } else {
//       if (nationalDigits.length < 4) {
//         return { valid: false, message: `Phone number too short for ${countryData?.name || 'this country'} (min 4 digits)` };
//       }
//       if (nationalDigits.length > 15) {
//         return { valid: false, message: 'Phone number too long (max 15 digits)' };
//       }
//     }
//     return { valid: true, message: '' };
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//     if (fieldErrors[name]) setFieldErrors((prev) => ({ ...prev, [name]: '' }));
//   };

//   const handlePhoneChange = (phone, countryData) => {
//     setFormData((prev) => ({ ...prev, phoneNumber: phone }));
//     setPhoneCountryData(countryData);
//     if (fieldErrors.phoneNumber) setFieldErrors((prev) => ({ ...prev, phoneNumber: '' }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setFieldErrors({});

//     // Optional validations (email, phone) – warnings only
//     if (formData.email && !validateEmailDomain(formData.email)) {
//       setFieldErrors((prev) => ({ ...prev, email: 'Please enter a valid email address' }));
//     }
//     const { valid, message } = validatePhoneNumber(formData.phoneNumber, phoneCountryData);
//     if (!valid) {
//       setFieldErrors((prev) => ({ ...prev, phoneNumber: message }));
//     }

//     setIsSubmitting(true);

//     try {
//       // Using the correct API endpoint: /api/facebook-form/create
//       const payload = { ...formData, source: 'Facebook' };
//       const response = await axios.post(`${API_URL}/facebook-form/create`, payload);

//       console.log('Response:', response.data);
//       toast.success('Facebook lead saved successfully');
//       setTimeout(() => navigate('/leads'), 1200);
//     } catch (error) {
//       console.error('Error submitting Facebook lead:', error);
//       console.error('Error response:', error.response?.data);
//       const errorMsg = error.response?.data?.message || 'Failed to save lead';
//       toast.error(errorMsg);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleBackClick = () => navigate(-1);

//   const fieldGroups = [
//     {
//       title: 'Basic Information',
//       color: 'text-blue-600',
//       fields: [
//         { name: 'leadName',    label: 'Lead Name',    icon: <User      size={16} /> },
//         { name: 'destination', label: 'Destination',  icon: <Building2 size={16} /> },
//         { name: 'phoneNumber', label: 'Phone Number', icon: <Phone     size={16} /> },
//         { name: 'email',       label: 'Email',        icon: <Mail      size={16} /> },
//         { name: 'address',     label: 'Address',      icon: <MapPin    size={16} /> },
//         { name: 'country',     label: 'Country',      icon: <Globe     size={16} />, type: 'select', options: countries },
//       ],
//     },
//     {
//       title: 'Business Details',
//       color: 'text-green-600',
//       fields: [
//         { name: 'duration',    label: 'Duration',    icon: <Briefcase size={16} />, placeholder: 'e.g., 3 months, 1 year' },
//         { name: 'requirement', label: 'Requirement', icon: <FileText  size={16} /> },
//         { name: 'noOfTravellers', label: 'No. of Travellers', icon: <Users size={16} />, type: 'number', placeholder: 'e.g., 2' },
//         { name: 'travelDate',     label: 'Travel Date',       icon: <Calendar size={16} />, type: 'date' },
//       ],
//     },
//     {
//       title: 'Additional Information',
//       color: 'text-purple-600',
//       fields: [
//         { name: 'notes', label: 'Notes', icon: <StickyNote size={16} />, type: 'textarea' },
//       ],
//     },
//   ];

//   return (
//     <>
//       <div className="min-h-screen flex items-start justify-center py-10 px-4">
//         <div className="w-full max-w-6xl bg-white rounded-2xl shadow-xl border border-gray-100">
//           {/* Header */}
//           <div className="flex flex-col md:flex-row items-start md:items-center justify-between px-6 py-5 border-b rounded-t-2xl">
//             <div className="flex items-center gap-3">
//               <button
//                 onClick={handleBackClick}
//                 className="p-2 rounded-lg bg-white text-gray-600 hover:bg-gray-100 hover:text-gray-800 transition"
//               >
//                 <ArrowLeft size={20} />
//               </button>
//               <h1 className="text-2xl font-bold text-gray-800">Facebook Lead Form</h1>
//             </div>
//           </div>

//           <form onSubmit={handleSubmit} className="p-8 space-y-10">
//             {fieldGroups.map((group) => (
//               <div key={group.title} className="space-y-6 p-6 border border-gray-200 rounded-xl shadow-sm">
//                 <h2 className={`text-lg font-semibold border-b pb-2 ${group.color}`}>{group.title}</h2>
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                   {group.fields.map((field) => (
//                     <div key={field.name} className={field.type === 'textarea' ? 'md:col-span-3' : ''}>
//                       <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
//                         {field.icon} {field.label}
//                       </label>

//                       {field.name === 'phoneNumber' ? (
//                         <div>
//                           <div className="border rounded-lg border-gray-300">
//                             <PhoneInput
//                               country="in"
//                               value={formData.phoneNumber}
//                               onChange={handlePhoneChange}
//                               enableSearch
//                               countryCodeEditable={false}
//                               specialLabel=""
//                               inputStyle={{ width: '100%', height: '42px', fontSize: '14px', paddingLeft: '55px', borderRadius: '0.5rem', boxSizing: 'border-box', border: 'none' }}
//                               buttonStyle={{ borderRadius: '0.5rem 0 0 0.5rem', height: '42px', background: 'white', border: 'none', borderRight: '1px solid #e5e7eb' }}
//                               containerStyle={{ width: '100%' }}
//                               dropdownStyle={{ borderRadius: '0.5rem' }}
//                             />
//                           </div>
//                           {fieldErrors.phoneNumber && <p className="text-sm text-red-500 mt-1">{fieldErrors.phoneNumber}</p>}
//                         </div>
//                       ) : field.type === 'select' ? (
//                         <select
//                           name={field.name}
//                           value={formData[field.name] || ''}
//                           onChange={handleChange}
//                           className="w-full border rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 outline-none transition h-11 border-gray-300"
//                         >
//                           <option value="">Select {field.label}</option>
//                           {field.options.map((opt) => (
//                             <option key={opt} value={opt}>{opt}</option>
//                           ))}
//                         </select>
//                       ) : field.type === 'textarea' ? (
//                         <textarea
//                           name={field.name}
//                           rows={6}
//                           value={formData[field.name] || ''}
//                           onChange={handleChange}
//                           placeholder={`Enter ${field.label}...`}
//                           className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white shadow-sm text-sm text-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 placeholder-gray-400 transition resize-y min-h-[120px]"
//                         />
//                       ) : (
//                         <input
//                           type={field.type || 'text'}
//                           name={field.name}
//                           value={formData[field.name] || ''}
//                           onChange={handleChange}
//                           placeholder={field.placeholder || `Enter ${field.label}`}
//                           min={field.type === 'number' ? '1' : undefined}
//                           className="w-full border rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 outline-none transition h-11 border-gray-300"
//                         />
//                       )}
//                       {fieldErrors[field.name] && <p className="text-sm text-red-500 mt-1">{fieldErrors[field.name]}</p>}
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             ))}

//             <div className="flex justify-end gap-4 pt-6 border-t">
//               <button
//                 type="button"
//                 onClick={handleBackClick}
//                 className="px-6 py-2 rounded-lg border bg-white hover:bg-gray-100 text-gray-700 transition"
//               >
//                 Cancel
//               </button>
//               <button
//                 type="submit"
//                 disabled={isSubmitting}
//                 className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 {isSubmitting ? 'Saving...' : 'Save Lead'}
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>

//       <ToastContainer position="top-right" autoClose={3000} theme="light" />
//     </>
//   );
// }// all work correctly


// pages/Leads/FacebookLeadForm.jsx

// import React, { useState } from 'react';
// import toast, { Toaster } from 'react-hot-toast';
// import axios from 'axios';
// import { getNames } from 'country-list';
// import PhoneInput from 'react-phone-input-2';
// import 'react-phone-input-2/lib/style.css';

// import { FiUser, FiMail, FiPhone, FiMapPin, FiGlobe, FiCalendar, FiFileText, FiUsers, FiClock, FiSend } from 'react-icons/fi';
// import { MdOutlineTravelExplore } from 'react-icons/md';
// import { BsShieldCheck } from 'react-icons/bs';
// import { RiMapPin2Line } from 'react-icons/ri';
// import { TbNotes } from 'react-icons/tb';

// const TRAVEL_QUOTES = [
//   "The world is a book, and those who do not travel read only one page.",
//   "Travel far enough, you meet yourself.",
//   "Not all those who wander are lost.",
//   "To travel is to live — so let's start your story.",
//   "Adventure awaits — and you've just taken the first step.",
// ];

// export default function FacebookLeadForm() {
//   const API_URL = import.meta.env.VITE_API_URL;
//   const countries = getNames();

//   const [formData, setFormData] = useState({
//     leadName: '', phoneNumber: '', email: '', destination: '',
//     duration: '', requirement: '', address: '', country: '',
//     notes: '', noOfTravellers: '', travelDate: '',
//   });

//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [fieldErrors, setFieldErrors]   = useState({});
//   const [submitted,   setSubmitted]     = useState(false);
//   const [quote] = useState(TRAVEL_QUOTES[Math.floor(Math.random() * TRAVEL_QUOTES.length)]);

//   const [phoneCountryData, setPhoneCountryData] = useState({
//     countryCode: 'in', dialCode: '91', name: 'India',
//   });

//   const validateEmail = (email) => {
//     if (!email) return true;
//     return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
//   };

//   const validatePhone = (fullNumber, countryData) => {
//     if (!fullNumber) return { valid: true, message: '' };
//     const digits  = String(fullNumber).replace(/\D/g, '');
//     const dial    = String(countryData?.dialCode || '').replace(/\D/g, '');
//     let national  = digits.startsWith(dial) ? digits.slice(dial.length) : digits;
//     national      = national.replace(/^0+/, '') || national;
//     if (countryData?.countryCode === 'in') {
//       if (national.length !== 10) return { valid: false, message: 'Indian number must be exactly 10 digits' };
//       if (!/^[6-9]/.test(national)) return { valid: false, message: 'Must start with 6, 7, 8, or 9' };
//     } else {
//       if (national.length < 4)  return { valid: false, message: 'Phone number too short' };
//       if (national.length > 15) return { valid: false, message: 'Phone number too long' };
//     }
//     return { valid: true, message: '' };
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(p => ({ ...p, [name]: value }));
//     if (fieldErrors[name]) setFieldErrors(p => ({ ...p, [name]: '' }));
//   };

//   const handlePhoneChange = (phone, countryData) => {
//     setFormData(p => ({ ...p, phoneNumber: phone }));
//     setPhoneCountryData(countryData);
//     if (fieldErrors.phoneNumber) setFieldErrors(p => ({ ...p, phoneNumber: '' }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setFieldErrors({});
//     const errs = {};
//     if (formData.email && !validateEmail(formData.email)) errs.email = 'Enter a valid email address';
//     const { valid, message } = validatePhone(formData.phoneNumber, phoneCountryData);
//     if (!valid) errs.phoneNumber = message;
//     if (Object.keys(errs).length) {
//       setFieldErrors(errs);
//       toast.error('Please fix the errors before submitting.');
//       return;
//     }

//     setIsSubmitting(true);
//     const loadingToast = toast.loading('Sending your enquiry...');
//     try {
//       await axios.post(`${API_URL}/facebook-form/create`, { ...formData, source: 'Facebook' });
//       toast.dismiss(loadingToast);
//       toast.success('You have successfully submitted your enquiry! 🎉', {
//         duration: 3500,
//         icon: '✈️',
//         style: {
//           background: '#0d1b2a',
//           color: '#fff',
//           fontFamily: 'DM Sans, sans-serif',
//           fontSize: '0.92rem',
//           border: '1px solid rgba(246,211,101,0.3)',
//         },
//       });
//       setTimeout(() => setSubmitted(true), 800);
//     } catch (error) {
//       toast.dismiss(loadingToast);
//       const msg = error.response?.data?.message || 'Failed to save. Please try again.';
//       toast.error(msg);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // ─────────────────────────────────────────────────────────────────────────────
//   // THANK YOU SCREEN
//   // ─────────────────────────────────────────────────────────────────────────────
//   if (submitted) {
//     return (
//       <>
//         <style>{`
//           @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400;1,600&family=DM+Sans:wght@300;400;500;600&display=swap');
//           *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
//           .ty-root {
//             min-height: 100vh;
//             background: linear-gradient(160deg, #0d1b2a 0%, #1b3a4b 50%, #0d2137 100%);
//             display: flex; align-items: center; justify-content: center;
//             padding: 2rem; font-family: 'DM Sans', sans-serif;
//             position: relative; overflow: hidden;
//           }
//           .ty-root::before {
//             content: ''; position: absolute; inset: 0;
//             background-image:
//               radial-gradient(circle at 20% 30%, rgba(246,211,101,0.09) 0%, transparent 50%),
//               radial-gradient(circle at 80% 70%, rgba(253,160,133,0.09) 0%, transparent 50%);
//             pointer-events: none;
//           }
//           .ty-stars { position: absolute; inset: 0; overflow: hidden; pointer-events: none; }
//           .ty-star {
//             position: absolute; width: 2px; height: 2px;
//             background: #fff; border-radius: 50%;
//             animation: twinkle 3s infinite alternate;
//           }
//           @keyframes twinkle { from{opacity:0.1} to{opacity:0.75} }
//           .ty-card {
//             position: relative;
//             background: rgba(255,255,255,0.07);
//             backdrop-filter: blur(24px);
//             border: 1px solid rgba(255,255,255,0.13);
//             border-radius: 2rem; padding: 3.5rem 2.5rem;
//             max-width: 560px; width: 100%; text-align: center;
//             animation: popIn 0.8s cubic-bezier(0.175,0.885,0.32,1.275) forwards;
//           }
//           @keyframes popIn {
//             from { opacity:0; transform:scale(0.88) translateY(20px); }
//             to   { opacity:1; transform:scale(1) translateY(0); }
//           }
//           .ty-logo-wrap {
//             width: 100%; margin: 0 auto 2rem;
//             display: flex; align-items: center; justify-content: center;
//           }
//           .ty-logo {
//             width: 100%; max-width: 320px;
//             object-fit: contain;
//             filter: brightness(0) invert(1); opacity: 0.93;
//           }
//           .ty-plane-wrap {
//             width: 88px; height: 88px;
//             background: linear-gradient(135deg, #f6d365 0%, #fda085 100%);
//             border-radius: 50%;
//             display: flex; align-items: center; justify-content: center;
//             margin: 0 auto 1.75rem; font-size: 2.4rem;
//             box-shadow: 0 0 0 12px rgba(246,211,101,0.12), 0 8px 32px rgba(253,160,133,0.35);
//             animation: float 4s ease-in-out infinite;
//           }
//           @keyframes float {
//             0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)}
//           }
//           .ty-heading {
//             font-family: 'Cormorant Garamond', serif;
//             font-size: 2.6rem; font-weight: 600;
//             color: #fff; line-height: 1.15; margin-bottom: 0.6rem;
//           }
//           .ty-subheading {
//             font-size: 0.92rem; color: rgba(255,255,255,0.6);
//             font-weight: 300; line-height: 1.6; margin-bottom: 2rem;
//           }
//           .ty-divider {
//             display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1.75rem;
//           }
//           .ty-divider::before,.ty-divider::after {
//             content:''; flex:1; height:1px; background:rgba(255,255,255,0.15);
//           }
//           .ty-divider span { font-size:0.7rem; color:#fda085; letter-spacing:0.1em; text-transform:uppercase; }
//           .ty-quote-box {
//             background: rgba(255,255,255,0.05);
//             border: 1px solid rgba(255,255,255,0.1);
//             border-left: 3px solid #fda085;
//             border-radius: 0 1rem 1rem 0;
//             padding: 1.1rem 1.3rem; margin-bottom: 2rem; text-align: left;
//           }
//           .ty-quote-box p {
//             font-family: 'Cormorant Garamond', serif;
//             font-style: italic; font-size: 1.05rem;
//             color: rgba(255,255,255,0.82); line-height: 1.65;
//           }
//           .ty-pill {
//             display: inline-flex; align-items: center; gap: 0.5rem;
//             background: linear-gradient(135deg, #f6d365, #fda085);
//             color: #1a1a1a; font-weight: 600; font-size: 0.88rem;
//             padding: 0.7rem 1.75rem; border-radius: 3rem;
//             box-shadow: 0 4px 20px rgba(253,160,133,0.35);
//           }
//         `}</style>
//         <Toaster position="top-right" />
//         <div className="ty-root">
//           <div className="ty-stars">
//             {Array.from({ length: 30 }).map((_, i) => (
//               <div key={i} className="ty-star" style={{
//                 left: `${Math.random() * 100}%`,
//                 top: `${Math.random() * 100}%`,
//                 animationDelay: `${Math.random() * 3}s`,
//                 animationDuration: `${2 + Math.random() * 3}s`,
//               }} />
//             ))}
//           </div>
//           <div className="ty-card">
//             <div className="ty-logo-wrap">
//               <img src="/images/uenjoytours_logo (1).png" alt="UEnjoy Tours" className="ty-logo" />
//             </div>
//             <div className="ty-plane-wrap">✈️</div>
//             <h1 className="ty-heading">Thank You!</h1>
//             <p className="ty-subheading">
//               Your travel enquiry has been received. Our experts are excited to craft your perfect journey and will be in touch with you very soon.
//             </p>
//             <div className="ty-divider"><span>a thought for the road</span></div>
//             <div className="ty-quote-box"><p>"{quote}"</p></div>
//             <div className="ty-pill">🌍 &nbsp;Our team will contact you soon</div>
//           </div>
//         </div>
//       </>
//     );
//   }

//   // ─────────────────────────────────────────────────────────────────────────────
//   // MAIN FORM
//   // ─────────────────────────────────────────────────────────────────────────────
//   return (
//     <>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
//         *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

//         .fb-root {
//           min-height: 100vh;
//           background: #f5f1eb;
//           font-family: 'DM Sans', sans-serif;
//           display: flex; flex-direction: column;
//         }

//         /* ── Hero ── */
//         .fb-hero {
//           background: linear-gradient(160deg, #0d1b2a 0%, #1b3a4b 60%, #0d2137 100%);
//           padding: 3rem 2rem 5rem;
//           text-align: center;
//           position: relative; overflow: hidden;
//         }
//         .fb-hero::after {
//           content: '';
//           position: absolute; bottom: -1px; left: 0; right: 0;
//           background: #f5f1eb;
//           clip-path: ellipse(55% 100% at 50% 100%);
//           height: 56px;
//         }
//         .fb-hero-bg {
//           position: absolute; inset: 0; pointer-events: none;
//           background-image:
//             radial-gradient(circle at 10% 60%, rgba(246,211,101,0.07) 0%, transparent 45%),
//             radial-gradient(circle at 90% 20%, rgba(253,160,133,0.07) 0%, transparent 45%);
//         }

//         /* ── BIG wide logo ── */
//         .fb-logo-wrap {
//           width: 100%;
//           max-width: 50px;
//           margin: 0 auto 2rem;
//           position: relative;
//         }
//         .fb-logo-wrap img {
//            width: 100%;
//           object-fit: contain;
//           filter: brightness(0) invert(1);
//           opacity: 0.95;
//           display: block;
//         }

//         .fb-hero-tag {
//           display: inline-flex; align-items: center; gap: 0.4rem;
//           background: rgba(246,211,101,0.12);
//           border: 1px solid rgba(246,211,101,0.25);
//           color: #f6d365;
//           font-size: 0.72rem; font-weight: 600;
//           letter-spacing: 0.14em; text-transform: uppercase;
//           padding: 0.35rem 1rem; border-radius: 3rem;
//           margin-bottom: 1.1rem; position: relative;
//         }
//         .fb-hero h1 {
//           font-family: 'Cormorant Garamond', serif;
//           font-size: clamp(2.1rem, 5vw, 3.4rem);
//           font-weight: 600; color: #fff;
//           line-height: 1.15; margin-bottom: 0.65rem;
//           position: relative;
//         }
//         .fb-hero h1 em { font-style: italic; color: #f6d365; }
//         .fb-hero-sub {
//           color: rgba(255,255,255,0.55);
//           font-size: 0.92rem; font-weight: 300;
//           position: relative;
//         }

//         /* ── Body ── */
//         .fb-body {
//           max-width: 820px; width: 100%;
//           margin: 0 auto;
//           padding: 2.25rem 1.25rem 4rem;
//           flex: 1;
//         }

//         /* ── Card ── */
//         .fb-card {
//           background: #fff;
//           border-radius: 1.25rem;
//           padding: 1.85rem;
//           margin-bottom: 1.25rem;
//           box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 4px 22px rgba(0,0,0,0.07);
//           border: 1px solid rgba(0,0,0,0.05);
//           opacity: 0;
//           animation: fadeUp 0.55s ease forwards;
//         }
//         @keyframes fadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
//         .fb-card:nth-child(1){ animation-delay:0.05s }
//         .fb-card:nth-child(2){ animation-delay:0.15s }
//         .fb-card:nth-child(3){ animation-delay:0.25s }

//         .fb-card-head {
//           display: flex; align-items: center; gap: 0.7rem;
//           padding-bottom: 1rem; margin-bottom: 1.35rem;
//           border-bottom: 1px solid #f0ebe0;
//         }
//         .fb-card-head-icon {
//           width: 38px; height: 38px; border-radius: 10px;
//           display: flex; align-items: center; justify-content: center;
//           font-size: 1.15rem; flex-shrink: 0;
//         }
//         .fb-card-head h2 {
//           font-family: 'Cormorant Garamond', serif;
//           font-size: 1.18rem; font-weight: 600; color: #1a1a2e;
//         }
//         .fb-card-head h2 span {
//           font-size: 0.76rem; color: #bbb; margin-left: 0.3rem; font-weight: 300;
//           font-family: 'DM Sans', sans-serif;
//         }

//         /* ── Grid ── */
//         .fb-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.1rem; }
//         @media(max-width:580px){ .fb-grid { grid-template-columns: 1fr; } }
//         .fb-full { grid-column: 1 / -1; }

//         /* ── Field ── */
//         .fb-f label {
//           display: flex; align-items: center; gap: 0.35rem;
//           font-size: 0.71rem; font-weight: 600;
//           letter-spacing: 0.08em; text-transform: uppercase;
//           color: #888; margin-bottom: 0.42rem;
//         }
//         .fb-f label svg { color: #1b3a4b; opacity: 0.7; flex-shrink: 0; }

//         .fb-f input,
//         .fb-f select,
//         .fb-f textarea {
//           width: 100%;
//           border: 1.5px solid #e6e0d4;
//           border-radius: 0.6rem;
//           padding: 0.7rem 0.9rem;
//           font-size: 0.88rem;
//           font-family: 'DM Sans', sans-serif;
//           color: #1a1a2e; background: #fdfaf6;
//           outline: none;
//           transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
//           appearance: none;
//         }
//         .fb-f input:focus, .fb-f select:focus, .fb-f textarea:focus {
//           border-color: #1b3a4b;
//           box-shadow: 0 0 0 3px rgba(27,58,75,0.1);
//           background: #fff;
//         }
//         .fb-f input.err, .fb-f select.err { border-color: #d94f4f; background: #fff8f8; }
//         .fb-f .fb-err { font-size: 0.72rem; color: #d94f4f; margin-top: 0.3rem; }
//         .fb-f textarea { resize: vertical; min-height: 96px; }
//         .fb-f select {
//           background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23999' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
//           background-repeat: no-repeat; background-position: right 0.75rem center; padding-right: 2.25rem;
//         }

//         /* phone override */
//         .fb-phone .react-tel-input .form-control {
//           width: 100% !important;
//           font-size: 0.88rem !important; font-family: 'DM Sans', sans-serif !important;
//           border: 1.5px solid #e6e0d4 !important; border-radius: 0.6rem !important;
//           background: #fdfaf6 !important; color: #1a1a2e !important;
//           padding-left: 52px !important; height: 42px !important;
//         }
//         .fb-phone .react-tel-input .form-control:focus {
//           border-color: #1b3a4b !important;
//           box-shadow: 0 0 0 3px rgba(27,58,75,0.1) !important; background: #fff !important;
//         }
//         .fb-phone .react-tel-input .flag-dropdown {
//           border: 1.5px solid #e6e0d4 !important; border-right: none !important;
//           border-radius: 0.6rem 0 0 0.6rem !important; background: #f5f0e8 !important;
//         }

//         /* ── Submit ── */
//         .fb-actions {
//           display: flex; flex-direction: column; align-items: center; gap: 0.7rem;
//           margin-top: 0.5rem;
//         }
//         .fb-btn {
//           background: linear-gradient(135deg, #1b3a4b 0%, #2c5364 100%);
//           color: #fff; font-family: 'DM Sans', sans-serif;
//           font-size: 0.96rem; font-weight: 600; letter-spacing: 0.03em;
//           padding: 0.92rem 3.5rem; border: none; border-radius: 3rem;
//           cursor: pointer;
//           transition: transform 0.2s, box-shadow 0.2s, opacity 0.2s;
//           box-shadow: 0 6px 24px rgba(27,58,75,0.35);
//           display: inline-flex; align-items: center; gap: 0.55rem;
//         }
//         .fb-btn:hover:not(:disabled) {
//           transform: translateY(-2px); box-shadow: 0 10px 32px rgba(27,58,75,0.45);
//         }
//         .fb-btn:disabled { opacity: 0.6; cursor: not-allowed; }
//         .fb-btn-note {
//           display: flex; align-items: center; gap: 0.35rem;
//           font-size: 0.74rem; color: #aaa;
//         }

//         /* ── Footer ── */
//         .fb-footer {
//           text-align: center; padding: 1.25rem 1rem;
//           font-size: 0.74rem; color: #bbb;
//           border-top: 1px solid #e8e3da;
//         }
//       `}</style>

//       <Toaster
//         position="top-right"
//         toastOptions={{
//           style: { fontFamily: 'DM Sans, sans-serif', fontSize: '0.88rem' },
//           success: { iconTheme: { primary: '#1b3a4b', secondary: '#f6d365' } },
//         }}
//       />

//       <div className="fb-root">

//         {/* ── Hero ── */}
//         <div className="fb-hero">
//           <div className="fb-hero-bg" />

//           {/* BIG wide logo */}
//           <div className="fb-logo-wrap">
//             <img src="/images/uenjoytours_logo (1).png" alt="UEnjoy Tours" />
//           </div>

//           <div className="fb-hero-tag">
//             <MdOutlineTravelExplore size={13} /> Travel Enquiry
//           </div>
//           <h1>Your <em>Dream Trip</em><br />Starts Here</h1>
//           <p className="fb-hero-sub">Fill in your details and we'll take care of everything.</p>
//         </div>

//         {/* ── Form body ── */}
//         <div className="fb-body">
//           <form onSubmit={handleSubmit}>

//             {/* Card 1 — Your Details */}
//             <div className="fb-card">
//               <div className="fb-card-head">
//                 <div className="fb-card-head-icon" style={{ background: '#e8f4f8' }}>
//                   <FiUser size={18} color="#1b3a4b" />
//                 </div>
//                 <h2>Your Details <span>— who are you?</span></h2>
//               </div>
//               <div className="fb-grid">

//                 <div className="fb-f">
//                   <label><FiUser size={11} />Full Name</label>
//                   <input type="text" name="leadName" value={formData.leadName}
//                     onChange={handleChange} placeholder="e.g. Ravi Kumar"
//                     className={fieldErrors.leadName ? 'err' : ''} />
//                   {fieldErrors.leadName && <p className="fb-err">{fieldErrors.leadName}</p>}
//                 </div>

//                 <div className="fb-f">
//                   <label><FiMail size={11} />Email Address</label>
//                   <input type="email" name="email" value={formData.email}
//                     onChange={handleChange} placeholder="you@example.com"
//                     className={fieldErrors.email ? 'err' : ''} />
//                   {fieldErrors.email && <p className="fb-err">{fieldErrors.email}</p>}
//                 </div>

//                 <div className="fb-f">
//                   <label><FiPhone size={11} />Phone Number</label>
//                   <div className="fb-phone">
//                     <PhoneInput country="in" value={formData.phoneNumber}
//                       onChange={handlePhoneChange} enableSearch
//                       countryCodeEditable={false} specialLabel="" />
//                   </div>
//                   {fieldErrors.phoneNumber && <p className="fb-err">{fieldErrors.phoneNumber}</p>}
//                 </div>

//                 <div className="fb-f">
//                   <label><FiMapPin size={11} />City / Address</label>
//                   <input type="text" name="address" value={formData.address}
//                     onChange={handleChange} placeholder="Your city or area" />
//                 </div>

//                 <div className="fb-f fb-full">
//                   <label><FiGlobe size={11} />Country</label>
//                   <select name="country" value={formData.country} onChange={handleChange}>
//                     <option value="">Select your country</option>
//                     {countries.map(c => <option key={c} value={c}>{c}</option>)}
//                   </select>
//                 </div>

//               </div>
//             </div>

//             {/* Card 2 — Trip Details */}
//             <div className="fb-card">
//               <div className="fb-card-head">
//                 <div className="fb-card-head-icon" style={{ background: '#fef3e8' }}>
//                   <RiMapPin2Line size={18} color="#c97a2a" />
//                 </div>
//                 <h2>Trip Details <span>— where to?</span></h2>
//               </div>
//               <div className="fb-grid">

//                 <div className="fb-f">
//                   <label><MdOutlineTravelExplore size={11} />Destination</label>
//                   <input type="text" name="destination" value={formData.destination}
//                     onChange={handleChange} placeholder="e.g. Maldives, Europe, Bali" />
//                 </div>

//                 <div className="fb-f">
//                   <label><FiClock size={11} />Duration</label>
//                   <input type="text" name="duration" value={formData.duration}
//                     onChange={handleChange} placeholder="e.g. 7 nights, 2 weeks" />
//                 </div>

//                 <div className="fb-f">
//                   <label><FiUsers size={11} />No. of Travellers</label>
//                   <input type="number" name="noOfTravellers" value={formData.noOfTravellers}
//                     onChange={handleChange} placeholder="e.g. 2" min="1" />
//                 </div>

//                 <div className="fb-f">
//                   <label><FiCalendar size={11} />Travel Date</label>
//                   <input type="date" name="travelDate" value={formData.travelDate}
//                     onChange={handleChange} />
//                 </div>

//                 <div className="fb-f fb-full">
//                   <label><FiFileText size={11} />Special Requirements</label>
//                   <input type="text" name="requirement" value={formData.requirement}
//                     onChange={handleChange}
//                     placeholder="e.g. Honeymoon package, Adventure trip, Family tour, Budget preference" />
//                 </div>

//               </div>
//             </div>

//             {/* Card 3 — Notes */}
//             <div className="fb-card">
//               <div className="fb-card-head">
//                 <div className="fb-card-head-icon" style={{ background: '#f0eefa' }}>
//                   <TbNotes size={18} color="#7c3aed" />
//                 </div>
//                 <h2>Anything Else? <span>— optional</span></h2>
//               </div>
//               <div className="fb-f">
//                 <label><TbNotes size={11} />Additional Notes</label>
//                 <textarea name="notes" value={formData.notes} onChange={handleChange}
//                   placeholder="Tell us about your dream trip — preferred hotels, activities, budget range, or any special moments you'd like us to create..."
//                   rows={4} />
//               </div>
//             </div>

//             {/* Submit */}
//             <div className="fb-actions">
//               <button type="submit" className="fb-btn" disabled={isSubmitting}>
//                 {isSubmitting
//                   ? <><FiSend size={15} /> Sending...</>
//                   : <><FiSend size={15} /> Send My Enquiry</>
//                 }
//               </button>
//               <p className="fb-btn-note">
//                 <BsShieldCheck size={13} color="#1b3a4b" />
//                 Your information is private and will never be shared.
//               </p>
//             </div>

//           </form>
//         </div>

//         <div className="fb-footer">
//           © {new Date().getFullYear()} UEnjoy Tours — Crafting Journeys, Creating Memories
//         </div>
//       </div>
//     </>
//   );
// }





// import React, { useState } from 'react';
// import toast, { Toaster } from 'react-hot-toast';
// import axios from 'axios';
// import { getNames } from 'country-list';
// import PhoneInput from 'react-phone-input-2';
// import 'react-phone-input-2/lib/style.css';

// import { FiUser, FiMail, FiPhone, FiMapPin, FiGlobe, FiCalendar, FiFileText, FiUsers, FiClock, FiSend } from 'react-icons/fi';
// import { MdOutlineTravelExplore } from 'react-icons/md';
// import { BsShieldCheck } from 'react-icons/bs';
// import { RiMapPin2Line } from 'react-icons/ri';
// import { TbNotes } from 'react-icons/tb';

// const TRAVEL_QUOTES = [
//   "The world is a book, and those who do not travel read only one page.",
//   "Travel far enough, you meet yourself.",
//   "Not all those who wander are lost.",
//   "To travel is to live — so let's start your story.",
//   "Adventure awaits — and you've just taken the first step.",
// ];

// export default function FacebookLeadForm() {
//   const API_URL = import.meta.env.VITE_API_URL;
//   const countries = getNames();

//   const [formData, setFormData] = useState({
//     leadName: '', phoneNumber: '', email: '', destination: '',
//     duration: '', requirement: '', address: '', country: '',
//     notes: '', noOfTravellers: '', travelDate: '',
//   });

//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [fieldErrors, setFieldErrors]   = useState({});
//   const [submitted,   setSubmitted]     = useState(false);
//   const [quote] = useState(TRAVEL_QUOTES[Math.floor(Math.random() * TRAVEL_QUOTES.length)]);

//   const [phoneCountryData, setPhoneCountryData] = useState({
//     countryCode: 'in', dialCode: '91', name: 'India',
//   });

//   const validateEmail = (email) => {
//     if (!email) return true;
//     return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
//   };

//   const validatePhone = (fullNumber, countryData) => {
//     if (!fullNumber) return { valid: true, message: '' };
//     const digits  = String(fullNumber).replace(/\D/g, '');
//     const dial    = String(countryData?.dialCode || '').replace(/\D/g, '');
//     let national  = digits.startsWith(dial) ? digits.slice(dial.length) : digits;
//     national      = national.replace(/^0+/, '') || national;
//     if (countryData?.countryCode === 'in') {
//       if (national.length !== 10) return { valid: false, message: 'Indian number must be exactly 10 digits' };
//       if (!/^[6-9]/.test(national)) return { valid: false, message: 'Must start with 6, 7, 8, or 9' };
//     } else {
//       if (national.length < 4)  return { valid: false, message: 'Phone number too short' };
//       if (national.length > 15) return { valid: false, message: 'Phone number too long' };
//     }
//     return { valid: true, message: '' };
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(p => ({ ...p, [name]: value }));
//     if (fieldErrors[name]) setFieldErrors(p => ({ ...p, [name]: '' }));
//   };

//   const handlePhoneChange = (phone, countryData) => {
//     setFormData(p => ({ ...p, phoneNumber: phone }));
//     setPhoneCountryData(countryData);
//     if (fieldErrors.phoneNumber) setFieldErrors(p => ({ ...p, phoneNumber: '' }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setFieldErrors({});
//     const errs = {};
//     if (formData.email && !validateEmail(formData.email)) errs.email = 'Enter a valid email address';
//     const { valid, message } = validatePhone(formData.phoneNumber, phoneCountryData);
//     if (!valid) errs.phoneNumber = message;
//     if (Object.keys(errs).length) {
//       setFieldErrors(errs);
//       toast.error('Please fix the errors before submitting.');
//       return;
//     }

//     setIsSubmitting(true);
//     const loadingToast = toast.loading('Sending your enquiry...');
//     try {
//       await axios.post(`${API_URL}/facebook-form/create`, { ...formData, source: 'Facebook' });
//       toast.dismiss(loadingToast);
//       toast.success('You have successfully submitted your enquiry! 🎉', {
//         duration: 3500,
//         icon: '✈️',
//         style: {
//           background: '#0d1b2a',
//           color: '#fff',
//           fontFamily: 'DM Sans, sans-serif',
//           fontSize: '0.92rem',
//           border: '1px solid rgba(246,211,101,0.3)',
//         },
//       });
//       setTimeout(() => setSubmitted(true), 800);
//     } catch (error) {
//       toast.dismiss(loadingToast);
//       const msg = error.response?.data?.message || 'Failed to save. Please try again.';
//       toast.error(msg);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // ─────────────────────────────────────────────────────────────────────────────
//   // THANK YOU SCREEN
//   // ─────────────────────────────────────────────────────────────────────────────
//   if (submitted) {
//     return (
//       <>
//         <style>{`
//           @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400;1,600&family=DM+Sans:wght@300;400;500;600&display=swap');
//           *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
//           .ty-root {
//             min-height: 100vh;
//             background: linear-gradient(160deg, #0d1b2a 0%, #1b3a4b 50%, #0d2137 100%);
//             display: flex; align-items: center; justify-content: center;
//             padding: 2rem; font-family: 'DM Sans', sans-serif;
//             position: relative; overflow: hidden;
//           }
//           .ty-root::before {
//             content: ''; position: absolute; inset: 0;
//             background-image:
//               radial-gradient(circle at 20% 30%, rgba(246,211,101,0.09) 0%, transparent 50%),
//               radial-gradient(circle at 80% 70%, rgba(253,160,133,0.09) 0%, transparent 50%);
//             pointer-events: none;
//           }
//           .ty-stars { position: absolute; inset: 0; overflow: hidden; pointer-events: none; }
//           .ty-star {
//             position: absolute; width: 2px; height: 2px;
//             background: #fff; border-radius: 50%;
//             animation: twinkle 3s infinite alternate;
//           }
//           @keyframes twinkle { from{opacity:0.1} to{opacity:0.75} }
//           .ty-card {
//             position: relative;
//             background: rgba(255,255,255,0.07);
//             backdrop-filter: blur(24px);
//             border: 1px solid rgba(255,255,255,0.13);
//             border-radius: 2rem; padding: 3.5rem 2.5rem;
//             max-width: 560px; width: 100%; text-align: center;
//             animation: popIn 0.8s cubic-bezier(0.175,0.885,0.32,1.275) forwards;
//           }
//           @keyframes popIn {
//             from { opacity:0; transform:scale(0.88) translateY(20px); }
//             to   { opacity:1; transform:scale(1) translateY(0); }
//           }
//           .ty-logo-wrap {
//             width: 100%; margin: 0 auto 2rem;
//             display: flex; align-items: center; justify-content: center;
//           }
//           .ty-logo {
//             width: 100%; max-width: 240px;
//             object-fit: contain;
//           }
//           .ty-plane-wrap {
//             width: 88px; height: 88px;
//             background: linear-gradient(135deg, #f6d365 0%, #fda085 100%);
//             border-radius: 50%;
//             display: flex; align-items: center; justify-content: center;
//             margin: 0 auto 1.75rem; font-size: 2.4rem;
//             box-shadow: 0 0 0 12px rgba(246,211,101,0.12), 0 8px 32px rgba(253,160,133,0.35);
//             animation: float 4s ease-in-out infinite;
//           }
//           @keyframes float {
//             0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)}
//           }
//           .ty-heading {
//             font-family: 'Cormorant Garamond', serif;
//             font-size: 2.6rem; font-weight: 600;
//             color: #fff; line-height: 1.15; margin-bottom: 0.6rem;
//           }
//           .ty-subheading {
//             font-size: 0.92rem; color: rgba(255,255,255,0.6);
//             font-weight: 300; line-height: 1.6; margin-bottom: 2rem;
//           }
//           .ty-divider {
//             display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1.75rem;
//           }
//           .ty-divider::before,.ty-divider::after {
//             content:''; flex:1; height:1px; background:rgba(255,255,255,0.15);
//           }
//           .ty-divider span { font-size:0.7rem; color:#fda085; letter-spacing:0.1em; text-transform:uppercase; }
//           .ty-quote-box {
//             background: rgba(255,255,255,0.05);
//             border: 1px solid rgba(255,255,255,0.1);
//             border-left: 3px solid #fda085;
//             border-radius: 0 1rem 1rem 0;
//             padding: 1.1rem 1.3rem; margin-bottom: 2rem; text-align: left;
//           }
//           .ty-quote-box p {
//             font-family: 'Cormorant Garamond', serif;
//             font-style: italic; font-size: 1.05rem;
//             color: rgba(255,255,255,0.82); line-height: 1.65;
//           }
//           .ty-pill {
//             display: inline-flex; align-items: center; gap: 0.5rem;
//             background: linear-gradient(135deg, #f6d365, #fda085);
//             color: #1a1a1a; font-weight: 600; font-size: 0.88rem;
//             padding: 0.7rem 1.75rem; border-radius: 3rem;
//             box-shadow: 0 4px 20px rgba(253,160,133,0.35);
//           }
//         `}</style>
//         <Toaster position="top-right" />
//         <div className="ty-root">
//           <div className="ty-stars">
//             {Array.from({ length: 30 }).map((_, i) => (
//               <div key={i} className="ty-star" style={{
//                 left: `${Math.random() * 100}%`,
//                 top: `${Math.random() * 100}%`,
//                 animationDelay: `${Math.random() * 3}s`,
//                 animationDuration: `${2 + Math.random() * 3}s`,
//               }} />
//             ))}
//           </div>
//           <div className="ty-card">
//             <div className="ty-logo-wrap">
//               <img src="/images/uenjoytours_logo (1).png" alt="UEnjoy Tours" className="ty-logo" />
//             </div>
//             <div className="ty-plane-wrap">✈️</div>
//             <h1 className="ty-heading">Thank You!</h1>
//             <p className="ty-subheading">
//               Your travel enquiry has been received. Our experts are excited to craft your perfect journey and will be in touch with you very soon.
//             </p>
//             <div className="ty-divider"><span>a thought for the road</span></div>
//             <div className="ty-quote-box"><p>"{quote}"</p></div>
//             <div className="ty-pill">🌍 &nbsp;Our team will contact you soon</div>
//           </div>
//         </div>
//       </>
//     );
//   }

//   // ─────────────────────────────────────────────────────────────────────────────
//   // MAIN FORM
//   // ─────────────────────────────────────────────────────────────────────────────
//   return (
//     <>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
//         *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

//         .fb-root {
//           min-height: 20vh;
//           background: #f5f1eb;
//           font-family: 'DM Sans', sans-serif;
//           display: flex; flex-direction: column;
//         }

//         /* ── Hero — reduced height ── */
//         .fb-hero {
//           background: linear-gradient(160deg, #0d1b2a 0%, #1b3a4b 60%, #0d2137 100%);
//           padding: 1rem 1rem 1rem;
//           text-align: center;
//           position: relative; overflow: hidden;
//         }
//         .fb-hero::after {
//           content: '';
//           position: absolute; bottom: -1px; left: 0; right: 0;
//           background: #f5f1eb;
//           clip-path: ellipse(55% 100% at 50% 100%);
//           height: 48px;
//         }
//         .fb-hero-bg {
//           position: absolute; inset: 0; pointer-events: none;
//           background-image:
//             radial-gradient(circle at 10% 60%, rgba(246,211,101,0.07) 0%, transparent 45%),
//             radial-gradient(circle at 90% 20%, rgba(253,160,133,0.07) 0%, transparent 45%);
//         }

//         /* ── Logo — big, real, no opacity ── */
//         .fb-logo-wrap {
//           width: 100%;
//           max-width: 260px;
//           margin: 0 auto 1.1rem;
//           position: relative;
//         }
//         .fb-logo-wrap img {
//           width: 100%;
//           object-fit: contain;
//           display: block;
//         }

//         .fb-hero-tag {
//           display: inline-flex; align-items: center; gap: 0.4rem;
//           background: rgba(246,211,101,0.12);
//           border: 1px solid rgba(246,211,101,0.25);
//           color: #f6d365;
//           font-size: 0.72rem; font-weight: 600;
//           letter-spacing: 0.14em; text-transform: uppercase;
//           padding: 0.35rem 1rem; border-radius: 3rem;
//           margin-bottom: 0.75rem; position: relative;
//         }
//         .fb-hero h1 {
//           font-family: 'Cormorant Garamond', serif;
//           font-size: clamp(1.8rem, 5vw, 2.8rem);
//           font-weight: 600; color: #fff;
//           line-height: 1.15; margin-bottom: 3rem;
//           position: relative;
//         }
//         .fb-hero h1 em { font-style: italic; color: #f6d365; }
//         .fb-hero-sub {
//           color: rgba(255,255,255,0.55);
//           font-size: 0.88rem; font-weight: 300;
//           position: relative;
//         }

//         /* ── Body ── */
//         .fb-body {
//           max-width: 820px; width: 100%;
//           margin: 0 auto;
//           padding: 2.25rem 1.25rem 4rem;
//           flex: 1;
//         }

//         /* ── Card ── */
//         .fb-card {
//           background: #fff;
//           border-radius: 1.25rem;
//           padding: 1.85rem;
//           margin-bottom: 1.25rem;
//           box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 4px 22px rgba(0,0,0,0.07);
//           border: 1px solid rgba(0,0,0,0.05);
//           opacity: 0;
//           animation: fadeUp 0.55s ease forwards;
//         }
//         @keyframes fadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
//         .fb-card:nth-child(1){ animation-delay:0.05s }
//         .fb-card:nth-child(2){ animation-delay:0.15s }
//         .fb-card:nth-child(3){ animation-delay:0.25s }

//         .fb-card-head {
//           display: flex; align-items: center; gap: 0.7rem;
//           padding-bottom: 1rem; margin-bottom: 1.35rem;
//           border-bottom: 1px solid #f0ebe0;
//         }
//         .fb-card-head-icon {
//           width: 38px; height: 38px; border-radius: 10px;
//           display: flex; align-items: center; justify-content: center;
//           font-size: 1.15rem; flex-shrink: 0;
//         }
//         .fb-card-head h2 {
//           font-family: 'Cormorant Garamond', serif;
//           font-size: 1.18rem; font-weight: 600; color: #1a1a2e;
//         }
//         .fb-card-head h2 span {
//           font-size: 0.76rem; color: #bbb; margin-left: 0.3rem; font-weight: 300;
//           font-family: 'DM Sans', sans-serif;
//         }

//         /* ── Grid ── */
//         .fb-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.1rem; }
//         @media(max-width:580px){ .fb-grid { grid-template-columns: 1fr; } }
//         .fb-full { grid-column: 1 / -1; }

//         /* ── Field ── */
//         .fb-f label {
//           display: flex; align-items: center; gap: 0.35rem;
//           font-size: 0.71rem; font-weight: 600;
//           letter-spacing: 0.08em; text-transform: uppercase;
//           color: #888; margin-bottom: 0.42rem;
//         }
//         .fb-f label svg { color: #1b3a4b; opacity: 0.7; flex-shrink: 0; }

//         .fb-f input,
//         .fb-f select,
//         .fb-f textarea {
//           width: 100%;
//           border: 1.5px solid #e6e0d4;
//           border-radius: 0.6rem;
//           padding: 0.7rem 0.9rem;
//           font-size: 0.88rem;
//           font-family: 'DM Sans', sans-serif;
//           color: #1a1a2e; background: #fdfaf6;
//           outline: none;
//           transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
//           appearance: none;
//         }
//         .fb-f input:focus, .fb-f select:focus, .fb-f textarea:focus {
//           border-color: #1b3a4b;
//           box-shadow: 0 0 0 3px rgba(27,58,75,0.1);
//           background: #fff;
//         }
//         .fb-f input.err, .fb-f select.err { border-color: #d94f4f; background: #fff8f8; }
//         .fb-f .fb-err { font-size: 0.72rem; color: #d94f4f; margin-top: 0.3rem; }
//         .fb-f textarea { resize: vertical; min-height: 96px; }
//         .fb-f select {
//           background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23999' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
//           background-repeat: no-repeat; background-position: right 0.75rem center; padding-right: 2.25rem;
//         }

//         /* phone override */
//         .fb-phone .react-tel-input .form-control {
//           width: 100% !important;
//           font-size: 0.88rem !important; font-family: 'DM Sans', sans-serif !important;
//           border: 1.5px solid #e6e0d4 !important; border-radius: 0.6rem !important;
//           background: #fdfaf6 !important; color: #1a1a2e !important;
//           padding-left: 52px !important; height: 42px !important;
//         }
//         .fb-phone .react-tel-input .form-control:focus {
//           border-color: #1b3a4b !important;
//           box-shadow: 0 0 0 3px rgba(27,58,75,0.1) !important; background: #fff !important;
//         }
//         .fb-phone .react-tel-input .flag-dropdown {
//           border: 1.5px solid #e6e0d4 !important; border-right: none !important;
//           border-radius: 0.6rem 0 0 0.6rem !important; background: #f5f0e8 !important;
//         }

//         /* ── Submit ── */
//         .fb-actions {
//           display: flex; flex-direction: column; align-items: center; gap: 0.7rem;
//           margin-top: 0.5rem;
//         }
//         .fb-btn {
//           background: linear-gradient(135deg, #1b3a4b 0%, #2c5364 100%);
//           color: #fff; font-family: 'DM Sans', sans-serif;
//           font-size: 0.96rem; font-weight: 600; letter-spacing: 0.03em;
//           padding: 0.92rem 3.5rem; border: none; border-radius: 3rem;
//           cursor: pointer;
//           transition: transform 0.2s, box-shadow 0.2s, opacity 0.2s;
//           box-shadow: 0 6px 24px rgba(27,58,75,0.35);
//           display: inline-flex; align-items: center; gap: 0.55rem;
//         }
//         .fb-btn:hover:not(:disabled) {
//           transform: translateY(-2px); box-shadow: 0 10px 32px rgba(27,58,75,0.45);
//         }
//         .fb-btn:disabled { opacity: 0.6; cursor: not-allowed; }
//         .fb-btn-note {
//           display: flex; align-items: center; gap: 0.35rem;
//           font-size: 0.74rem; color: #aaa;
//         }

//         /* ── Footer ── */
//         .fb-footer {
//           text-align: center; padding: 1.25rem 1rem;
//           font-size: 0.74rem; color: #bbb;
//           border-top: 1px solid #e8e3da;
//         }
//       `}</style>

//       <Toaster
//         position="top-right"
//         toastOptions={{
//           style: { fontFamily: 'DM Sans, sans-serif', fontSize: '0.88rem' },
//           success: { iconTheme: { primary: '#1b3a4b', secondary: '#f6d365' } },
//         }}
//       />

//       <div className="fb-root">

//         {/* ── Hero ── */}
//         <div className="fb-hero">
//           <div className="fb-hero-bg" />

//           {/* Big real logo — no filter, no opacity */}
//           <div className="fb-logo-wrap">
//             <img src="/images/uenjoytours_logo (1).png" alt="UEnjoy Tours" />
//           </div>

//           <div className="fb-hero-tag">
//             <MdOutlineTravelExplore size={13} /> Travel Enquiry
//           </div>
//           <h1>Your <em>Dream Trip</em><br />Starts Here</h1>
//           <p className="fb-hero-sub">Fill in your details and we'll take care of everything.</p>
//         </div>

//         {/* ── Form body ── */}
//         <div className="fb-body">
//           <form onSubmit={handleSubmit}>

//             {/* Card 1 — Your Details */}
//             <div className="fb-card">
//               <div className="fb-card-head">
//                 <div className="fb-card-head-icon" style={{ background: '#e8f4f8' }}>
//                   <FiUser size={18} color="#1b3a4b" />
//                 </div>
//                 <h2>Your Details <span>— who are you?</span></h2>
//               </div>
//               <div className="fb-grid">

//                 <div className="fb-f">
//                   <label><FiUser size={11} />Full Name</label>
//                   <input type="text" name="leadName" value={formData.leadName}
//                     onChange={handleChange} placeholder="e.g. Ravi Kumar"
//                     className={fieldErrors.leadName ? 'err' : ''} />
//                   {fieldErrors.leadName && <p className="fb-err">{fieldErrors.leadName}</p>}
//                 </div>

//                 <div className="fb-f">
//                   <label><FiMail size={11} />Email Address</label>
//                   <input type="email" name="email" value={formData.email}
//                     onChange={handleChange} placeholder="you@example.com"
//                     className={fieldErrors.email ? 'err' : ''} />
//                   {fieldErrors.email && <p className="fb-err">{fieldErrors.email}</p>}
//                 </div>

//                 <div className="fb-f">
//                   <label><FiPhone size={11} />Phone Number</label>
//                   <div className="fb-phone">
//                     <PhoneInput country="in" value={formData.phoneNumber}
//                       onChange={handlePhoneChange} enableSearch
//                       countryCodeEditable={false} specialLabel="" />
//                   </div>
//                   {fieldErrors.phoneNumber && <p className="fb-err">{fieldErrors.phoneNumber}</p>}
//                 </div>

//                 <div className="fb-f">
//                   <label><FiMapPin size={11} />City / Address</label>
//                   <input type="text" name="address" value={formData.address}
//                     onChange={handleChange} placeholder="Your city or area" />
//                 </div>

//                 <div className="fb-f fb-full">
//                   <label><FiGlobe size={11} />Country</label>
//                   <select name="country" value={formData.country} onChange={handleChange}>
//                     <option value="">Select your country</option>
//                     {countries.map(c => <option key={c} value={c}>{c}</option>)}
//                   </select>
//                 </div>

//               </div>
//             </div>

//             {/* Card 2 — Trip Details */}
//             <div className="fb-card">
//               <div className="fb-card-head">
//                 <div className="fb-card-head-icon" style={{ background: '#fef3e8' }}>
//                   <RiMapPin2Line size={18} color="#c97a2a" />
//                 </div>
//                 <h2>Trip Details <span>— where to?</span></h2>
//               </div>
//               <div className="fb-grid">

//                 <div className="fb-f">
//                   <label><MdOutlineTravelExplore size={11} />Destination</label>
//                   <input type="text" name="destination" value={formData.destination}
//                     onChange={handleChange} placeholder="e.g. Maldives, Europe, Bali" />
//                 </div>

//                 <div className="fb-f">
//                   <label><FiClock size={11} />Duration</label>
//                   <input type="text" name="duration" value={formData.duration}
//                     onChange={handleChange} placeholder="e.g. 7 nights, 2 weeks" />
//                 </div>

//                 <div className="fb-f">
//                   <label><FiUsers size={11} />No. of Travellers</label>
//                   <input type="number" name="noOfTravellers" value={formData.noOfTravellers}
//                     onChange={handleChange} placeholder="e.g. 2" min="1" />
//                 </div>

//                 <div className="fb-f">
//                   <label><FiCalendar size={11} />Travel Date</label>
//                   <input type="date" name="travelDate" value={formData.travelDate}
//                     onChange={handleChange} />
//                 </div>

//                 <div className="fb-f fb-full">
//                   <label><FiFileText size={11} />Special Requirements</label>
//                   <input type="text" name="requirement" value={formData.requirement}
//                     onChange={handleChange}
//                     placeholder="e.g. Honeymoon package, Adventure trip, Family tour, Budget preference" />
//                 </div>

//               </div>
//             </div>

//             {/* Card 3 — Notes */}
//             <div className="fb-card">
//               <div className="fb-card-head">
//                 <div className="fb-card-head-icon" style={{ background: '#f0eefa' }}>
//                   <TbNotes size={18} color="#7c3aed" />
//                 </div>
//                 <h2>Anything Else? <span>— optional</span></h2>
//               </div>
//               <div className="fb-f">
//                 <label><TbNotes size={11} />Additional Notes</label>
//                 <textarea name="notes" value={formData.notes} onChange={handleChange}
//                   placeholder="Tell us about your dream trip — preferred hotels, activities, budget range, or any special moments you'd like us to create..."
//                   rows={4} />
//               </div>
//             </div>

//             {/* Submit */}
//             <div className="fb-actions">
//               <button type="submit" className="fb-btn" disabled={isSubmitting}>
//                 {isSubmitting
//                   ? <><FiSend size={15} /> Sending...</>
//                   : <><FiSend size={15} /> Send My Enquiry</>
//                 }
//               </button>
//               <p className="fb-btn-note">
//                 <BsShieldCheck size={13} color="#1b3a4b" />
//                 Your information is private and will never be shared.
//               </p>
//             </div>

//           </form>
//         </div>

//         <div className="fb-footer">
//           © {new Date().getFullYear()} UEnjoy Tours — Crafting Journeys, Creating Memories
//         </div>
//       </div>
//     </>
//   );
// }//all work correctly..



import React, { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
import { getNames } from 'country-list';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

import { FiUser, FiMail, FiPhone, FiMapPin, FiGlobe, FiCalendar, FiFileText, FiUsers, FiClock, FiSend } from 'react-icons/fi';
import { MdOutlineTravelExplore } from 'react-icons/md';
import { BsShieldCheck } from 'react-icons/bs';
import { RiMapPin2Line } from 'react-icons/ri';
import { TbNotes } from 'react-icons/tb';

const TRAVEL_QUOTES = [
  "The world is a book, and those who do not travel read only one page.",
  "Travel far enough, you meet yourself.",
  "Not all those who wander are lost.",
  "To travel is to live — so let's start your story.",
  "Adventure awaits — and you've just taken the first step.",
];

export default function FacebookLeadForm() {
  const API_URL = import.meta.env.VITE_API_URL;
  const countries = getNames();

  const [formData, setFormData] = useState({
    leadName: '', phoneNumber: '', email: '', destination: '',
    duration: '', requirement: '', address: '', country: '',
    notes: '', noOfTravellers: '', travelDate: '',
  });

  const [isSubmitting, setIsSubmitting]   = useState(false);
  const [fieldErrors,  setFieldErrors]    = useState({});
  const [submitted,    setSubmitted]      = useState(false);
  const [submittedData, setSubmittedData] = useState(null); // ← stores what user filled
  const [quote] = useState(TRAVEL_QUOTES[Math.floor(Math.random() * TRAVEL_QUOTES.length)]);

  const [phoneCountryData, setPhoneCountryData] = useState({
    countryCode: 'in', dialCode: '91', name: 'India',
  });

  // Check if phone was actually filled (more than just dial code)
  const isPhoneProvided = (phone, countryData) => {
    if (!phone) return false;
    const digits  = String(phone).replace(/\D/g, '');
    const dial    = String(countryData?.dialCode || '').replace(/\D/g, '');
    const national = digits.startsWith(dial) ? digits.slice(dial.length) : digits;
    return national.replace(/^0+/, '').length > 0;
  };

  const validateEmail = (email) => {
    if (!email) return true;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePhone = (fullNumber, countryData) => {
    // Phone is optional — only validate if user actually typed something
    if (!isPhoneProvided(fullNumber, countryData)) return { valid: true, message: '' };

    const digits   = String(fullNumber).replace(/\D/g, '');
    const dial     = String(countryData?.dialCode || '').replace(/\D/g, '');
    let national   = digits.startsWith(dial) ? digits.slice(dial.length) : digits;
    national       = national.replace(/^0+/, '') || national;

    if (countryData?.countryCode === 'in') {
      if (national.length !== 10) return { valid: false, message: 'Indian number must be exactly 10 digits' };
      if (!/^[6-9]/.test(national)) return { valid: false, message: 'Must start with 6, 7, 8, or 9' };
    } else {
      if (national.length < 4)  return { valid: false, message: 'Phone number too short' };
      if (national.length > 15) return { valid: false, message: 'Phone number too long' };
    }
    return { valid: true, message: '' };
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(p => ({ ...p, [name]: value }));
    if (fieldErrors[name]) setFieldErrors(p => ({ ...p, [name]: '' }));
  };

  const handlePhoneChange = (phone, countryData) => {
    setFormData(p => ({ ...p, phoneNumber: phone }));
    setPhoneCountryData(countryData);
    if (fieldErrors.phoneNumber) setFieldErrors(p => ({ ...p, phoneNumber: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFieldErrors({});
    const errs = {};

    if (formData.email && !validateEmail(formData.email)) {
      errs.email = 'Enter a valid email address';
    }
    const { valid, message } = validatePhone(formData.phoneNumber, phoneCountryData);
    if (!valid) errs.phoneNumber = message;

    if (Object.keys(errs).length) {
      setFieldErrors(errs);
      toast.error('Please fix the errors before submitting.');
      return;
    }

    // Only send phone if user actually provided it
    const phoneToSend = isPhoneProvided(formData.phoneNumber, phoneCountryData)
      ? formData.phoneNumber
      : '';

    const payload = {
      ...formData,
      phoneNumber: phoneToSend,
      source: 'Facebook',
    };

    setIsSubmitting(true);
    const loadingToast = toast.loading('Sending your enquiry...');
    try {
      const response = await axios.post(`${API_URL}/facebook-form/create`, payload);

      toast.dismiss(loadingToast);
      toast.success('You have successfully submitted your enquiry! 🎉', {
        duration: 3500,
        icon: '✈️',
        style: {
          background: '#0d1b2a',
          color: '#fff',
          fontFamily: 'DM Sans, sans-serif',
          fontSize: '0.92rem',
          border: '1px solid rgba(246,211,101,0.3)',
        },
      });

      // ← Store submitted data so thank-you screen can show it immediately (no refresh)
      setSubmittedData({
        ...formData,
        phoneNumber: phoneToSend,
        savedLead: response.data?.facebookLead,
      });

      setTimeout(() => setSubmitted(true), 800);
    } catch (error) {
      toast.dismiss(loadingToast);
      const msg = error.response?.data?.message || 'Failed to save. Please try again.';
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // THANK YOU SCREEN — shows real submitted data instantly, no refresh needed
  // ─────────────────────────────────────────────────────────────────────────────
  if (submitted && submittedData) {
    const d = submittedData;
    const hasName        = d.leadName?.trim();
    const hasPhone       = d.phoneNumber?.trim();
    const hasEmail       = d.email?.trim();
    const hasDestination = d.destination?.trim();
    const hasTravelDate  = d.travelDate;
    const hasTravellers  = d.noOfTravellers;
    const hasDuration    = d.duration?.trim();

    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400;1,600&family=DM+Sans:wght@300;400;500;600&display=swap');
          *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
          .ty-root {
            min-height: 100vh;
            background: linear-gradient(160deg, #0d1b2a 0%, #1b3a4b 50%, #0d2137 100%);
            display: flex; align-items: center; justify-content: center;
            padding: 2rem; font-family: 'DM Sans', sans-serif;
            position: relative; overflow: hidden;
          }
          .ty-root::before {
            content: ''; position: absolute; inset: 0;
            background-image:
              radial-gradient(circle at 20% 30%, rgba(246,211,101,0.09) 0%, transparent 50%),
              radial-gradient(circle at 80% 70%, rgba(253,160,133,0.09) 0%, transparent 50%);
            pointer-events: none;
          }
          .ty-stars { position: absolute; inset: 0; overflow: hidden; pointer-events: none; }
          .ty-star {
            position: absolute; width: 2px; height: 2px;
            background: #fff; border-radius: 50%;
            animation: twinkle 3s infinite alternate;
          }
          @keyframes twinkle { from{opacity:0.1} to{opacity:0.75} }
          .ty-card {
            position: relative;
            background: rgba(255,255,255,0.07);
            backdrop-filter: blur(24px);
            border: 1px solid rgba(255,255,255,0.13);
            border-radius: 2rem; padding: 3rem 2.5rem;
            max-width: 580px; width: 100%; text-align: center;
            animation: popIn 0.8s cubic-bezier(0.175,0.885,0.32,1.275) forwards;
          }
          @keyframes popIn {
            from { opacity:0; transform:scale(0.88) translateY(20px); }
            to   { opacity:1; transform:scale(1) translateY(0); }
          }
          .ty-logo-wrap {
            width: 100%; margin: 0 auto 1.75rem;
            display: flex; align-items: center; justify-content: center;
          }
          .ty-logo { width: 100%; max-width: 200px; object-fit: contain; }
          .ty-plane-wrap {
            width: 80px; height: 80px;
            background: linear-gradient(135deg, #f6d365 0%, #fda085 100%);
            border-radius: 50%;
            display: flex; align-items: center; justify-content: center;
            margin: 0 auto 1.5rem; font-size: 2.2rem;
            box-shadow: 0 0 0 12px rgba(246,211,101,0.12), 0 8px 32px rgba(253,160,133,0.35);
            animation: float 4s ease-in-out infinite;
          }
          @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
          .ty-heading {
            font-family: 'Cormorant Garamond', serif;
            font-size: 2.4rem; font-weight: 600;
            color: #fff; line-height: 1.15; margin-bottom: 0.4rem;
          }
          .ty-subheading {
            font-size: 0.88rem; color: rgba(255,255,255,0.55);
            font-weight: 300; line-height: 1.6; margin-bottom: 1.5rem;
          }

          /* Summary box — shows real submitted data */
          .ty-summary {
            background: rgba(255,255,255,0.06);
            border: 1px solid rgba(255,255,255,0.12);
            border-radius: 1rem;
            padding: 1.2rem 1.4rem;
            margin-bottom: 1.5rem;
            text-align: left;
          }
          .ty-summary-title {
            font-size: 0.65rem; font-weight: 700;
            letter-spacing: 0.12em; text-transform: uppercase;
            color: #fda085; margin-bottom: 0.9rem;
          }
          .ty-summary-row {
            display: flex; align-items: flex-start; gap: 0.65rem;
            padding: 0.45rem 0;
            border-bottom: 1px solid rgba(255,255,255,0.07);
          }
          .ty-summary-row:last-child { border-bottom: none; }
          .ty-summary-label {
            font-size: 0.7rem; font-weight: 600;
            color: rgba(255,255,255,0.4);
            text-transform: uppercase; letter-spacing: 0.06em;
            min-width: 90px; padding-top: 0.05rem;
          }
          .ty-summary-val {
            font-size: 0.85rem; color: rgba(255,255,255,0.88);
            font-weight: 400; word-break: break-word;
          }

          .ty-divider {
            display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1.5rem;
          }
          .ty-divider::before,.ty-divider::after {
            content:''; flex:1; height:1px; background:rgba(255,255,255,0.15);
          }
          .ty-divider span { font-size:0.7rem; color:#fda085; letter-spacing:0.1em; text-transform:uppercase; }
          .ty-quote-box {
            background: rgba(255,255,255,0.05);
            border: 1px solid rgba(255,255,255,0.1);
            border-left: 3px solid #fda085;
            border-radius: 0 1rem 1rem 0;
            padding: 1rem 1.2rem; margin-bottom: 1.75rem; text-align: left;
          }
          .ty-quote-box p {
            font-family: 'Cormorant Garamond', serif;
            font-style: italic; font-size: 1rem;
            color: rgba(255,255,255,0.8); line-height: 1.65;
          }
          .ty-pill {
            display: inline-flex; align-items: center; gap: 0.5rem;
            background: linear-gradient(135deg, #f6d365, #fda085);
            color: #1a1a1a; font-weight: 600; font-size: 0.88rem;
            padding: 0.7rem 1.75rem; border-radius: 3rem;
            box-shadow: 0 4px 20px rgba(253,160,133,0.35);
          }
        `}</style>
        <Toaster position="top-right" />
        <div className="ty-root">
          <div className="ty-stars">
            {Array.from({ length: 30 }).map((_, i) => (
              <div key={i} className="ty-star" style={{
                left: `${Math.random() * 100}%`,
                top:  `${Math.random() * 100}%`,
                animationDelay:    `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`,
              }} />
            ))}
          </div>
          <div className="ty-card">
            <div className="ty-logo-wrap">
              <img src="/images/uenjoytours_logo (1).png" alt="UEnjoy Tours" className="ty-logo" />
            </div>
            <div className="ty-plane-wrap">✈️</div>
            <h1 className="ty-heading">Thank You!</h1>
            <p className="ty-subheading">
              Your enquiry has been received. We'll be in touch very soon.
            </p>

            {/* ── Real-time summary of what was submitted ── */}
            {(hasName || hasPhone || hasEmail || hasDestination || hasTravelDate || hasTravellers || hasDuration) && (
              <div className="ty-summary">
                <p className="ty-summary-title">📋 Your Enquiry Summary</p>
                {hasName && (
                  <div className="ty-summary-row">
                    <span className="ty-summary-label">Name</span>
                    <span className="ty-summary-val">{d.leadName}</span>
                  </div>
                )}
                {hasPhone && (
                  <div className="ty-summary-row">
                    <span className="ty-summary-label">Phone</span>
                    <span className="ty-summary-val">+{d.phoneNumber}</span>
                  </div>
                )}
                {hasEmail && (
                  <div className="ty-summary-row">
                    <span className="ty-summary-label">Email</span>
                    <span className="ty-summary-val">{d.email}</span>
                  </div>
                )}
                {hasDestination && (
                  <div className="ty-summary-row">
                    <span className="ty-summary-label">Destination</span>
                    <span className="ty-summary-val">{d.destination}</span>
                  </div>
                )}
                {hasDuration && (
                  <div className="ty-summary-row">
                    <span className="ty-summary-label">Duration</span>
                    <span className="ty-summary-val">{d.duration}</span>
                  </div>
                )}
                {hasTravellers && (
                  <div className="ty-summary-row">
                    <span className="ty-summary-label">Travellers</span>
                    <span className="ty-summary-val">{d.noOfTravellers} person{d.noOfTravellers > 1 ? 's' : ''}</span>
                  </div>
                )}
                {hasTravelDate && (
                  <div className="ty-summary-row">
                    <span className="ty-summary-label">Travel Date</span>
                    <span className="ty-summary-val">{new Date(d.travelDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  </div>
                )}
              </div>
            )}

            <div className="ty-divider"><span>a thought for the road</span></div>
            <div className="ty-quote-box"><p>"{quote}"</p></div>
            <div className="ty-pill">🌍 &nbsp;Our team will contact you soon</div>
          </div>
        </div>
      </>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // MAIN FORM
  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .fb-root {
          min-height: 100vh;
          background: #f5f1eb;
          font-family: 'DM Sans', sans-serif;
          display: flex; flex-direction: column;
        }

        /* ── Hero — compact height ── */
        .fb-hero {
          background: linear-gradient(160deg, #0d1b2a 0%, #1b3a4b 60%, #0d2137 100%);
          padding: 1.25rem 2rem 3.5rem;
          text-align: center;
          position: relative; overflow: hidden;
        }
        .fb-hero::after {
          content: '';
          position: absolute; bottom: -1px; left: 0; right: 0;
          background: #f5f1eb;
          clip-path: ellipse(55% 100% at 50% 100%);
          height: 48px;
        }
        .fb-hero-bg {
          position: absolute; inset: 0; pointer-events: none;
          background-image:
            radial-gradient(circle at 10% 60%, rgba(246,211,101,0.07) 0%, transparent 45%),
            radial-gradient(circle at 90% 20%, rgba(253,160,133,0.07) 0%, transparent 45%);
        }

        /* ── Logo — big, real image, no filter, no opacity ── */
        .fb-logo-wrap {
          width: 100%;
          max-width: 260px;
          margin: 0 auto 1.1rem;
          position: relative;
        }
        .fb-logo-wrap img {
          width: 100%;
          object-fit: contain;
          display: block;
        }

        .fb-hero-tag {
          display: inline-flex; align-items: center; gap: 0.4rem;
          background: rgba(246,211,101,0.12);
          border: 1px solid rgba(246,211,101,0.25);
          color: #f6d365;
          font-size: 0.72rem; font-weight: 600;
          letter-spacing: 0.14em; text-transform: uppercase;
          padding: 0.35rem 1rem; border-radius: 3rem;
          margin-bottom: 0.75rem; position: relative;
        }
        .fb-hero h1 {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(1.8rem, 5vw, 2.8rem);
          font-weight: 600; color: #fff;
          line-height: 1.15; margin-bottom: 0.5rem;
          position: relative;
        }
        .fb-hero h1 em { font-style: italic; color: #f6d365; }
        .fb-hero-sub {
          color: rgba(255,255,255,0.55);
          font-size: 0.88rem; font-weight: 300;
          position: relative;
        }

        /* ── Body ── */
        .fb-body {
          max-width: 820px; width: 100%;
          margin: 0 auto;
          padding: 2.25rem 1.25rem 4rem;
          flex: 1;
        }

        /* ── Card ── */
        .fb-card {
          background: #fff;
          border-radius: 1.25rem;
          padding: 1.85rem;
          margin-bottom: 1.25rem;
          box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 4px 22px rgba(0,0,0,0.07);
          border: 1px solid rgba(0,0,0,0.05);
          opacity: 0;
          animation: fadeUp 0.55s ease forwards;
        }
        @keyframes fadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        .fb-card:nth-child(1){ animation-delay:0.05s }
        .fb-card:nth-child(2){ animation-delay:0.15s }
        .fb-card:nth-child(3){ animation-delay:0.25s }

        .fb-card-head {
          display: flex; align-items: center; gap: 0.7rem;
          padding-bottom: 1rem; margin-bottom: 1.35rem;
          border-bottom: 1px solid #f0ebe0;
        }
        .fb-card-head-icon {
          width: 38px; height: 38px; border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          font-size: 1.15rem; flex-shrink: 0;
        }
        .fb-card-head h2 {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.18rem; font-weight: 600; color: #1a1a2e;
        }
        .fb-card-head h2 span {
          font-size: 0.76rem; color: #bbb; margin-left: 0.3rem; font-weight: 300;
          font-family: 'DM Sans', sans-serif;
        }

        /* ── Grid ── */
        .fb-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.1rem; }
        @media(max-width:580px){ .fb-grid { grid-template-columns: 1fr; } }
        .fb-full { grid-column: 1 / -1; }

        /* ── Field ── */
        .fb-f label {
          display: flex; align-items: center; gap: 0.35rem;
          font-size: 0.71rem; font-weight: 600;
          letter-spacing: 0.08em; text-transform: uppercase;
          color: #888; margin-bottom: 0.42rem;
        }
        .fb-f label svg { color: #1b3a4b; opacity: 0.7; flex-shrink: 0; }

        .fb-f input,
        .fb-f select,
        .fb-f textarea {
          width: 100%;
          border: 1.5px solid #e6e0d4;
          border-radius: 0.6rem;
          padding: 0.7rem 0.9rem;
          font-size: 0.88rem;
          font-family: 'DM Sans', sans-serif;
          color: #1a1a2e; background: #fdfaf6;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
          appearance: none;
        }
        .fb-f input:focus, .fb-f select:focus, .fb-f textarea:focus {
          border-color: #1b3a4b;
          box-shadow: 0 0 0 3px rgba(27,58,75,0.1);
          background: #fff;
        }
        .fb-f input.err, .fb-f select.err { border-color: #d94f4f; background: #fff8f8; }
        .fb-f .fb-err { font-size: 0.72rem; color: #d94f4f; margin-top: 0.3rem; }
        .fb-f textarea { resize: vertical; min-height: 96px; }
        .fb-f select {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23999' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
          background-repeat: no-repeat; background-position: right 0.75rem center; padding-right: 2.25rem;
        }

        /* phone override */
        .fb-phone .react-tel-input .form-control {
          width: 100% !important;
          font-size: 0.88rem !important; font-family: 'DM Sans', sans-serif !important;
          border: 1.5px solid #e6e0d4 !important; border-radius: 0.6rem !important;
          background: #fdfaf6 !important; color: #1a1a2e !important;
          padding-left: 52px !important; height: 42px !important;
        }
        .fb-phone .react-tel-input .form-control:focus {
          border-color: #1b3a4b !important;
          box-shadow: 0 0 0 3px rgba(27,58,75,0.1) !important; background: #fff !important;
        }
        .fb-phone .react-tel-input .flag-dropdown {
          border: 1.5px solid #e6e0d4 !important; border-right: none !important;
          border-radius: 0.6rem 0 0 0.6rem !important; background: #f5f0e8 !important;
        }

        /* ── Submit ── */
        .fb-actions {
          display: flex; flex-direction: column; align-items: center; gap: 0.7rem;
          margin-top: 0.5rem;
        }
        .fb-btn {
          background: linear-gradient(135deg, #1b3a4b 0%, #2c5364 100%);
          color: #fff; font-family: 'DM Sans', sans-serif;
          font-size: 0.96rem; font-weight: 600; letter-spacing: 0.03em;
          padding: 0.92rem 3.5rem; border: none; border-radius: 3rem;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s, opacity 0.2s;
          box-shadow: 0 6px 24px rgba(27,58,75,0.35);
          display: inline-flex; align-items: center; gap: 0.55rem;
        }
        .fb-btn:hover:not(:disabled) {
          transform: translateY(-2px); box-shadow: 0 10px 32px rgba(27,58,75,0.45);
        }
        .fb-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .fb-btn-note {
          display: flex; align-items: center; gap: 0.35rem;
          font-size: 0.74rem; color: #aaa;
        }

        /* ── Footer ── */
        .fb-footer {
          text-align: center; padding: 1.25rem 1rem;
          font-size: 0.74rem; color: #bbb;
          border-top: 1px solid #e8e3da;
        }
      `}</style>

      <Toaster
        position="top-right"
        toastOptions={{
          style: { fontFamily: 'DM Sans, sans-serif', fontSize: '0.88rem' },
          success: { iconTheme: { primary: '#1b3a4b', secondary: '#f6d365' } },
        }}
      />

      <div className="fb-root">

        {/* ── Hero ── */}
        <div className="fb-hero">
          <div className="fb-hero-bg" />

          {/* Big real logo — no filter, no opacity */}
          <div className="fb-logo-wrap">
            <img src="/images/uenjoytours_logo (1).png" alt="UEnjoy Tours" />
          </div>

          <div className="fb-hero-tag">
            <MdOutlineTravelExplore size={13} /> Travel Enquiry
          </div>
          <h1>Your <em>Dream Trip</em><br />Starts Here</h1>
          <p className="fb-hero-sub">Fill in your details and we'll take care of everything.</p>
        </div>

        {/* ── Form body ── */}
        <div className="fb-body">
          <form onSubmit={handleSubmit}>

            {/* Card 1 — Your Details */}
            <div className="fb-card">
              <div className="fb-card-head">
                <div className="fb-card-head-icon" style={{ background: '#e8f4f8' }}>
                  <FiUser size={18} color="#1b3a4b" />
                </div>
                <h2>Your Details <span>— who are you?</span></h2>
              </div>
              <div className="fb-grid">

                <div className="fb-f">
                  <label><FiUser size={11} />Full Name</label>
                  <input type="text" name="leadName" value={formData.leadName}
                    onChange={handleChange} placeholder="e.g. Ravi Kumar" />
                </div>

                <div className="fb-f">
                  <label><FiMail size={11} />Email Address</label>
                  <input type="email" name="email" value={formData.email}
                    onChange={handleChange} placeholder="you@example.com"
                    className={fieldErrors.email ? 'err' : ''} />
                  {fieldErrors.email && <p className="fb-err">{fieldErrors.email}</p>}
                </div>

                <div className="fb-f">
                  <label><FiPhone size={11} />Phone Number <span style={{fontSize:'0.65rem',color:'#bbb',textTransform:'none',letterSpacing:0,fontWeight:400}}>(optional)</span></label>
                  <div className="fb-phone">
                    <PhoneInput country="in" value={formData.phoneNumber}
                      onChange={handlePhoneChange} enableSearch
                      countryCodeEditable={false} specialLabel="" />
                  </div>
                  {fieldErrors.phoneNumber && <p className="fb-err">{fieldErrors.phoneNumber}</p>}
                </div>

                <div className="fb-f">
                  <label><FiMapPin size={11} />City / Address</label>
                  <input type="text" name="address" value={formData.address}
                    onChange={handleChange} placeholder="Your city or area" />
                </div>

                <div className="fb-f fb-full">
                  <label><FiGlobe size={11} />Country</label>
                  <select name="country" value={formData.country} onChange={handleChange}>
                    <option value="">Select your country</option>
                    {countries.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

              </div>
            </div>

            {/* Card 2 — Trip Details */}
            <div className="fb-card">
              <div className="fb-card-head">
                <div className="fb-card-head-icon" style={{ background: '#fef3e8' }}>
                  <RiMapPin2Line size={18} color="#c97a2a" />
                </div>
                <h2>Trip Details <span>— where to?</span></h2>
              </div>
              <div className="fb-grid">

                <div className="fb-f">
                  <label><MdOutlineTravelExplore size={11} />Destination</label>
                  <input type="text" name="destination" value={formData.destination}
                    onChange={handleChange} placeholder="e.g. Maldives, Europe, Bali" />
                </div>

                <div className="fb-f">
                  <label><FiClock size={11} />Duration</label>
                  <input type="text" name="duration" value={formData.duration}
                    onChange={handleChange} placeholder="e.g. 7 nights, 2 weeks" />
                </div>

                <div className="fb-f">
                  <label><FiUsers size={11} />No. of Travellers</label>
                  <input type="number" name="noOfTravellers" value={formData.noOfTravellers}
                    onChange={handleChange} placeholder="e.g. 2" min="1" />
                </div>

                <div className="fb-f">
                  <label><FiCalendar size={11} />Travel Date</label>
                  <input type="date" name="travelDate" value={formData.travelDate}
                    onChange={handleChange} />
                </div>

                <div className="fb-f fb-full">
                  <label><FiFileText size={11} />Special Requirements</label>
                  <input type="text" name="requirement" value={formData.requirement}
                    onChange={handleChange}
                    placeholder="e.g. Honeymoon package, Adventure trip, Family tour, Budget preference" />
                </div>

              </div>
            </div>

            {/* Card 3 — Notes */}
            <div className="fb-card">
              <div className="fb-card-head">
                <div className="fb-card-head-icon" style={{ background: '#f0eefa' }}>
                  <TbNotes size={18} color="#7c3aed" />
                </div>
                <h2>Anything Else? <span>— optional</span></h2>
              </div>
              <div className="fb-f">
                <label><TbNotes size={11} />Additional Notes</label>
                <textarea name="notes" value={formData.notes} onChange={handleChange}
                  placeholder="Tell us about your dream trip — preferred hotels, activities, budget range, or any special moments you'd like us to create..."
                  rows={4} />
              </div>
            </div>

            {/* Submit */}
            <div className="fb-actions">
              <button type="submit" className="fb-btn" disabled={isSubmitting}>
                {isSubmitting
                  ? <><FiSend size={15} /> Sending...</>
                  : <><FiSend size={15} /> Send My Enquiry</>
                }
              </button>
              <p className="fb-btn-note">
                <BsShieldCheck size={13} color="#1b3a4b" />
                Your information is private and will never be shared.
              </p>
            </div>

          </form>
        </div>

        <div className="fb-footer">
          © {new Date().getFullYear()} UEnjoy Tours — Crafting Journeys, Creating Memories
        </div>
      </div>
    </>
  );
}