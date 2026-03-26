// import React from "react";

// function Terms() {
//   return (
//     <div style={{ padding: "40px", maxWidth: "900px", margin: "auto" }}>
//       <h1>Terms and Conditions</h1>

//       <p>Welcome to UEnjoyTours CRM.</p>

//       <p>
//         By using this application you agree to the following terms and
//         conditions.
//       </p>

//       <h3>Usage</h3>
//       <p>
//         The system is designed for managing leads, deals, proposals and customer
//         communications.
//       </p>

//       <h3>User Responsibility</h3>
//       <p>
//         Users must not misuse the platform for illegal or harmful activities.
//       </p>

//       <h3>Service Changes</h3>
//       <p>
//         We may update or modify the service at any time to improve functionality.
//       </p>

//       <h3>Acceptance</h3>
//       <p>
//         Continued use of the application indicates acceptance of these terms.
//       </p>

//       <p>For questions contact: support@uenjoytours.cloud</p>
//     </div>
//   );
// }

// export default Terms;


import React, { useEffect } from "react";
import {
  MdClose,
  MdOutlineGavel,
  MdOutlineManageAccounts,
  MdOutlineUpdate,
  MdOutlineThumbUp,
  MdOutlineWarningAmber,
  MdOutlineMarkEmailRead,
  MdGavel,
} from "react-icons/md";

const sections = [
  {
    icon: <MdOutlineGavel size={20} />,
    title: "Usage",
    content:
      "The system is designed for managing leads, deals, proposals, and customer communications within the UEnjoyTours CRM platform. Unauthorized use or access is strictly prohibited.",
  },
  {
    icon: <MdOutlineManageAccounts size={20} />,
    title: "User Responsibility",
    content:
      "Users must not misuse the platform for illegal, harmful, or unauthorized activities. Any misuse may result in immediate account termination and legal action where applicable.",
  },
  {
    icon: <MdOutlineWarningAmber size={20} />,
    title: "Intellectual Property",
    content:
      "All content, features, and functionality within UEnjoyTours CRM, including its design and codebase, are the exclusive property of UEnjoyTours and are protected by applicable laws.",
  },
  {
    icon: <MdOutlineUpdate size={20} />,
    title: "Service Changes",
    content:
      "We may update or modify the service at any time to improve functionality, security, or compliance. Users will be notified of significant changes where applicable.",
  },
  {
    icon: <MdOutlineThumbUp size={20} />,
    title: "Acceptance",
    content:
      "Continued use of the application after any updates to these terms indicates your acceptance of the revised conditions. Please review this page periodically.",
  },
  {
    icon: <MdOutlineMarkEmailRead size={20} />,
    title: "Contact",
    content: (
      <>
        For questions regarding these terms, contact us at{" "}
        <a
          href="mailto:support@uenjoytours.cloud"
          className="text-blue-600 hover:underline font-medium"
        >
          support@uenjoytours.cloud
        </a>
        .
      </>
    ),
  },
];

function TermsModal({ onClose }) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

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
      aria-labelledby="terms-title"
    >
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
              <MdGavel size={22} />
            </div>
            <div>
              <h2
                id="terms-title"
                className="text-white font-bold text-lg leading-tight"
                style={{ fontFamily: "'Georgia', serif", letterSpacing: "0.01em" }}
              >
                Terms & Conditions
              </h2>
              <p className="text-blue-200 text-xs mt-0.5">UEnjoyTours CRM · Effective March 2025</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close terms"
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <MdClose size={20} />
          </button>
        </div>

        {/* ── Scrollable Body ── */}
        <div className="overflow-y-auto flex-1 px-7 py-6" style={{ scrollbarWidth: "thin" }}>
          {/* Intro */}
          <div className="flex items-start gap-3 bg-amber-50 border border-amber-100 rounded-xl p-4 mb-6">
            <MdOutlineGavel size={22} className="text-amber-600 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-amber-800 leading-relaxed">
              Welcome to <strong>UEnjoyTours CRM</strong>. By using this application you agree to
              the following terms and conditions. Please read them carefully before proceeding.
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
            I Agree
          </button>
        </div>
      </div>
    </div>
  );
}

export default TermsModal;