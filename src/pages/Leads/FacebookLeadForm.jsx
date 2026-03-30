import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';
import { getNames } from 'country-list';
import {
  User, Phone, Mail, MapPin, FileText, Globe, Building2,
  Briefcase, Calendar, StickyNote, ArrowLeft, Users,
} from 'lucide-react';
import 'react-toastify/dist/ReactToastify.css';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

export default function FacebookLeadForm() {
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    leadName:       '',
    phoneNumber:    '',
    email:          '',
    destination:    '',
    duration:       '',
    requirement:    '',
    address:        '',
    country:        '',
    notes:          '',
    noOfTravellers: '',
    travelDate:     '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [countries] = useState(getNames());
  const [phoneCountryData, setPhoneCountryData] = useState({
    countryCode: 'in',
    dialCode:    '91',
    name:        'India',
  });

  // Optional: email validation (not required)
  const validateEmailDomain = (email) => {
    if (!email) return true;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Optional: phone validation (not required)
  const validatePhoneNumber = (fullNumber, countryData) => {
    if (!fullNumber) return { valid: true, message: '' };
    const digitsOnly = String(fullNumber).replace(/\D/g, '');
    const dialCode = String(countryData?.dialCode || '').replace(/\D/g, '');
    let nationalNumber = digitsOnly;
    if (dialCode && digitsOnly.startsWith(dialCode)) {
      nationalNumber = digitsOnly.slice(dialCode.length);
    }
    const nationalDigits = nationalNumber.replace(/^0+/, '') || nationalNumber;
    if (countryData?.countryCode === 'in') {
      if (nationalDigits.length !== 10) {
        return { valid: false, message: 'Indian phone number must be exactly 10 digits' };
      }
      if (!/^[6-9]/.test(nationalDigits)) {
        return { valid: false, message: 'Indian phone number must start with 6, 7, 8, or 9' };
      }
    } else {
      if (nationalDigits.length < 4) {
        return { valid: false, message: `Phone number too short for ${countryData?.name || 'this country'} (min 4 digits)` };
      }
      if (nationalDigits.length > 15) {
        return { valid: false, message: 'Phone number too long (max 15 digits)' };
      }
    }
    return { valid: true, message: '' };
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) setFieldErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handlePhoneChange = (phone, countryData) => {
    setFormData((prev) => ({ ...prev, phoneNumber: phone }));
    setPhoneCountryData(countryData);
    if (fieldErrors.phoneNumber) setFieldErrors((prev) => ({ ...prev, phoneNumber: '' }));
  };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setFieldErrors({});

//     // Optional validation – show warnings but do not block submission
//     if (formData.email && !validateEmailDomain(formData.email)) {
//       setFieldErrors((prev) => ({ ...prev, email: 'Please enter a valid email address' }));
//     }
//     const { valid, message } = validatePhoneNumber(formData.phoneNumber, phoneCountryData);
//     if (!valid) {
//       setFieldErrors((prev) => ({ ...prev, phoneNumber: message }));
//     }

//     setIsSubmitting(true);

//     try {
//       const token = localStorage.getItem('token');
//       // Source is fixed to "Facebook"
//       const payload = { ...formData, source: 'Facebook' };
//       const response = await axios.post(`${API_URL}/facebook-form/create`, payload, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       toast.success('Facebook lead saved successfully');
//       setTimeout(() => navigate('/leads'), 1200);
//     } catch (error) {
//       console.error('Error submitting Facebook lead:', error);
//       const errorMsg = error.response?.data?.message || 'Failed to save lead';
//       toast.error(errorMsg);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

const handleSubmit = async (e) => {
  e.preventDefault();
  setFieldErrors({});

  // Optional validations (email, phone) – keep as before
  if (formData.email && !validateEmailDomain(formData.email)) {
    setFieldErrors((prev) => ({ ...prev, email: 'Please enter a valid email address' }));
  }
  const { valid, message } = validatePhoneNumber(formData.phoneNumber, phoneCountryData);
  if (!valid) {
    setFieldErrors((prev) => ({ ...prev, phoneNumber: message }));
  }

  setIsSubmitting(true);

  try {
    // No token needed – route is public
    const payload = { ...formData, source: 'Facebook' };
    const response = await axios.post(`${API_URL}/facebook-form/create`, payload);

    toast.success('Facebook lead saved successfully');
    setTimeout(() => navigate('/leads'), 1200);
  } catch (error) {
    console.error('Error submitting Facebook lead:', error);
    const errorMsg = error.response?.data?.message || 'Failed to save lead';
    toast.error(errorMsg);
  } finally {
    setIsSubmitting(false);
  }
};

  const handleBackClick = () => navigate(-1);

  const fieldGroups = [
    {
      title: 'Basic Information',
      color: 'text-blue-600',
      fields: [
        { name: 'leadName',    label: 'Lead Name',    icon: <User      size={16} /> },
        { name: 'destination', label: 'Destination',  icon: <Building2 size={16} /> },
        { name: 'phoneNumber', label: 'Phone Number', icon: <Phone     size={16} /> },
        { name: 'email',       label: 'Email',        icon: <Mail      size={16} /> },
        { name: 'address',     label: 'Address',      icon: <MapPin    size={16} /> },
        { name: 'country',     label: 'Country',      icon: <Globe     size={16} />, type: 'select', options: countries },
      ],
    },
    {
      title: 'Business Details',
      color: 'text-green-600',
      fields: [
        { name: 'duration',    label: 'Duration',    icon: <Briefcase size={16} />, placeholder: 'e.g., 3 months, 1 year' },
        { name: 'requirement', label: 'Requirement', icon: <FileText  size={16} /> },
        { name: 'noOfTravellers', label: 'No. of Travellers', icon: <Users size={16} />, type: 'number', placeholder: 'e.g., 2' },
        { name: 'travelDate',     label: 'Travel Date',       icon: <Calendar size={16} />, type: 'date' },
      ],
    },
    {
      title: 'Additional Information',
      color: 'text-purple-600',
      fields: [
        { name: 'notes', label: 'Notes', icon: <StickyNote size={16} />, type: 'textarea' },
      ],
    },
  ];

  return (
    <>
      <div className="min-h-screen flex items-start justify-center py-10 px-4">
        <div className="w-full max-w-6xl bg-white rounded-2xl shadow-xl border border-gray-100">
          {/* Header */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between px-6 py-5 border-b rounded-t-2xl">
            <div className="flex items-center gap-3">
              <button
                onClick={handleBackClick}
                className="p-2 rounded-lg bg-white text-gray-600 hover:bg-gray-100 hover:text-gray-800 transition"
              >
                <ArrowLeft size={20} />
              </button>
              <h1 className="text-2xl font-bold text-gray-800">Facebook Lead Form</h1>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-10">
            {fieldGroups.map((group) => (
              <div key={group.title} className="space-y-6 p-6 border border-gray-200 rounded-xl shadow-sm">
                <h2 className={`text-lg font-semibold border-b pb-2 ${group.color}`}>{group.title}</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {group.fields.map((field) => (
                    <div key={field.name} className={field.type === 'textarea' ? 'md:col-span-3' : ''}>
                      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                        {field.icon} {field.label}
                      </label>

                      {field.name === 'phoneNumber' ? (
                        <div>
                          <div className="border rounded-lg border-gray-300">
                            <PhoneInput
                              country="in"
                              value={formData.phoneNumber}
                              onChange={handlePhoneChange}
                              enableSearch
                              countryCodeEditable={false}
                              specialLabel=""
                              inputStyle={{ width: '100%', height: '42px', fontSize: '14px', paddingLeft: '55px', borderRadius: '0.5rem', boxSizing: 'border-box', border: 'none' }}
                              buttonStyle={{ borderRadius: '0.5rem 0 0 0.5rem', height: '42px', background: 'white', border: 'none', borderRight: '1px solid #e5e7eb' }}
                              containerStyle={{ width: '100%' }}
                              dropdownStyle={{ borderRadius: '0.5rem' }}
                            />
                          </div>
                          {fieldErrors.phoneNumber && <p className="text-sm text-red-500 mt-1">{fieldErrors.phoneNumber}</p>}
                        </div>
                      ) : field.type === 'select' ? (
                        <select
                          name={field.name}
                          value={formData[field.name] || ''}
                          onChange={handleChange}
                          className="w-full border rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 outline-none transition h-11 border-gray-300"
                        >
                          <option value="">Select {field.label}</option>
                          {field.options.map((opt) => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      ) : field.type === 'textarea' ? (
                        <textarea
                          name={field.name}
                          rows={6}
                          value={formData[field.name] || ''}
                          onChange={handleChange}
                          placeholder={`Enter ${field.label}...`}
                          className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white shadow-sm text-sm text-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 placeholder-gray-400 transition resize-y min-h-[120px]"
                        />
                      ) : (
                        <input
                          type={field.type || 'text'}
                          name={field.name}
                          value={formData[field.name] || ''}
                          onChange={handleChange}
                          placeholder={field.placeholder || `Enter ${field.label}`}
                          min={field.type === 'number' ? '1' : undefined}
                          className="w-full border rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 outline-none transition h-11 border-gray-300"
                        />
                      )}
                      {fieldErrors[field.name] && <p className="text-sm text-red-500 mt-1">{fieldErrors[field.name]}</p>}
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <div className="flex justify-end gap-4 pt-6 border-t">
              <button
                type="button"
                onClick={handleBackClick}
                className="px-6 py-2 rounded-lg border bg-white hover:bg-gray-100 text-gray-700 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Saving...' : 'Save Lead'}
              </button>
            </div>
          </form>
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={3000} theme="light" />
    </>
  );
}