// import React from "react";

// function PrivacyPolicy() {
//   return (
//     <div style={{ padding: "40px", maxWidth: "900px", margin: "auto" }}>
//       <h1>Privacy Policy</h1>

//       <p>Welcome to UEnjoyTours CRM.</p>

//       <p>
//         We respect your privacy and are committed to protecting your personal
//         information.
//       </p>

//       <h3>Information We Collect</h3>
//       <p>
//         Our application may collect basic user information such as name, email
//         address and phone number when users interact with the CRM system.
//       </p>

//       <h3>How We Use Information</h3>
//       <p>
//         The collected information is used only for managing customer leads,
//         sending notifications, and improving our CRM services.
//       </p>

//       <h3>Third Party Services</h3>
//       <p>
//         Our application may integrate with services such as Google authentication
//         and WhatsApp messaging to improve communication features.
//       </p>

//       <h3>Data Security</h3>
//       <p>
//         We implement security measures to protect user data and prevent
//         unauthorized access.
//       </p>

//       <h3>Contact</h3>
//       <p>If you have questions contact: support@uenjoytours.cloud</p>
//     </div>
//   );
// }

// export default PrivacyPolicy;



import React, { useEffect } from "react";
import {
  MdSecurity,
  MdOutlinePrivacyTip,
  MdOutlineDataUsage,
  MdOutlineIntegrationInstructions,
  MdOutlineLock,
  MdOutlineMarkEmailRead,
  MdClose,
  MdVerifiedUser,
  MdShield,
} from "react-icons/md";
import { FiExternalLink } from "react-icons/fi";

const sections = [
  {
    icon: <MdOutlinePrivacyTip size={20} />,
    title: "Information We Collect",
    content:
      "Our application may collect basic user information such as name, email address, and phone number when users interact with the CRM system. This data is collected solely to support CRM operations and is never shared without consent.",
  },
  {
    icon: <MdOutlineDataUsage size={20} />,
    title: "How We Use Information",
    content:
      "Collected information is used only for managing customer leads, sending notifications, and improving our CRM services. We do not sell, trade, or rent your personal data to third parties.",
  },
  {
    icon: <MdOutlineIntegrationInstructions size={20} />,
    title: "Third-Party Services",
    content:
      "Our application may integrate with services such as Google Authentication and WhatsApp Messaging to improve communication features. These integrations comply with their respective privacy standards.",
  },
  {
    icon: <MdOutlineLock size={20} />,
    title: "Data Security",
    content:
      "We implement industry-standard security measures including encrypted data transmission (HTTPS/TLS), hashed credential storage, and role-based access control to protect user data and prevent unauthorized access.",
  },
  {
    icon: <MdSecurity size={20} />,
    title: "Your Rights",
    content:
      "You have the right to access, correct, or delete your personal data at any time. You may also request a copy of all data we hold about you by contacting our support team directly.",
  },
  {
    icon: <MdOutlineMarkEmailRead size={20} />,
    title: "Contact Us",
    content: (
      <>
        If you have questions or concerns regarding this policy, please contact
        us at{" "}
        <a
          href="mailto: uenjoytours@gmail.com"
          className="text-blue-600 hover:underline font-medium"
        >
          {/* support@uenjoytours.cloud */}
          uenjoytours@gmail.com
        </a>
        . We aim to respond within 48 business hours.
      </>
    ),
  },
];

function PrivacyPolicyModal({ onClose }) {
  // Prevent background scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(15, 23, 42, 0.65)", backdropFilter: "blur(6px)" }}
      onClick={onClose}
      aria-modal="true"
      role="dialog"
      aria-labelledby="privacy-policy-title"
    >
      {/* Modal Panel */}
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full overflow-hidden flex flex-col"
        style={{ maxWidth: "720px", maxHeight: "90vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Header ── */}
        <div
          className="flex items-center justify-between px-7 py-5 border-b border-gray-100"
          style={{
            background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 60%, #1d4ed8 100%)",
          }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white">
              <MdShield size={22} />
            </div>
            <div>
              <h2
                id="privacy-policy-title"
                className="text-white font-bold text-lg leading-tight"
                style={{ fontFamily: "'Georgia', serif", letterSpacing: "0.01em" }}
              >
                Privacy Policy
              </h2>
              <p className="text-blue-200 text-xs mt-0.5">UEnjoyTours CRM · Last updated March 2025</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close privacy policy"
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <MdClose size={20} />
          </button>
        </div>

        {/* ── Scrollable Body ── */}
        <div className="overflow-y-auto flex-1 px-7 py-6" style={{ scrollbarWidth: "thin" }}>
          {/* Intro */}
          <div className="flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6">
            <MdVerifiedUser size={22} className="text-blue-600 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-blue-800 leading-relaxed">
              Welcome to <strong>UEnjoyTours CRM</strong>. We respect your privacy and are
              committed to protecting your personal information. This policy explains how we
              collect, use, and safeguard your data.
            </p>
          </div>

          {/* Sections */}
          <div className="space-y-4">
            {sections.map((section, idx) => (
              <div
                key={idx}
                className="flex gap-4 p-4 rounded-xl border border-gray-100 hover:border-blue-100 hover:bg-blue-50/40 transition-colors"
              >
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ background: "#eff6ff", color: "#1d4ed8" }}
                >
                  {section.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 text-sm mb-1">{section.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{section.content}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Security badge row */}
          <div className="mt-6 flex flex-wrap gap-2">
            {["SSL Encrypted", "GDPR Aware", "No Data Selling", "Role-Based Access"].map((badge) => (
              <span
                key={badge}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border"
                style={{ background: "#f0fdf4", color: "#166534", borderColor: "#bbf7d0" }}
              >
                <MdOutlineLock size={12} />
                {badge}
              </span>
            ))}
          </div>
        </div>

        {/* ── Footer ── */}
        <div className="px-7 py-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between gap-3 flex-wrap">
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} UEnjoyTours. All rights reserved.
          </p>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg text-sm font-semibold text-white transition-colors"
            style={{ background: "#1d4ed8" }}
            onMouseEnter={(e) => (e.target.style.background = "#1e40af")}
            onMouseLeave={(e) => (e.target.style.background = "#1d4ed8")}
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
}

export default PrivacyPolicyModal;