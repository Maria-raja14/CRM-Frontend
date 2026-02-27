import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UploadCloud, Save } from "react-feather";

export default function Settings() {
  const API_URL = import.meta.env.VITE_API_URL;

  const [logo, setLogo] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [favicon, setFavicon] = useState(null);
  const [selectedFavicon, setSelectedFavicon] = useState(null);

  // Fetch current settings
  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/settings`);
      console.log("Settings response:", data);

      if (data?.companyName) {
        setCompanyName(data.companyName);
      }

      if (data?.logo) {
        const baseUrl = API_URL.replace("/api", "");
        const imageUrl = `${baseUrl}/${data.logo.replace(/\\/g, "/")}`;

        console.log("Final Logo URL:", imageUrl); // debug

        setLogo(imageUrl);
      } else {
        setLogo(null);
      }
      if (data?.favicon) {
        const baseUrl = API_URL.replace("/api", "");
        const faviconUrl = `${baseUrl}/${data.favicon.replace(/\\/g, "/")}`;
        setFavicon(faviconUrl);
      } else {
        setFavicon(null);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load settings");
    }
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select a logo image");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const formData = new FormData();
      formData.append("logo", selectedFile);

      await axios.post(`${API_URL}/settings/logo`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Logo updated successfully!");
      setSelectedFile(null);
      fetchSettings(); // reload logo
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const handleCompanyNameUpdate = async () => {
    if (!companyName.trim()) {
      toast.error("Company name cannot be empty");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `${API_URL}/settings/company-name`,
        { companyName },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Company name updated successfully!");

      // 🔥 Update browser title instantly
      document.title = companyName;

    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Update failed");
    }
  };

  const handleFaviconChange = (e) => {
    setSelectedFavicon(e.target.files[0]);
  };

  const handleFaviconUpload = async () => {
    if (!selectedFavicon) {
      toast.error("Please select a favicon image");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const formData = new FormData();
      formData.append("favicon", selectedFavicon);

      await axios.post(`${API_URL}/settings/favicon`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Favicon updated successfully!");
      setSelectedFavicon(null);
      fetchSettings();

      // 🔥 Update favicon instantly without refresh
      const faviconElement = document.getElementById("dynamic-favicon");
      if (faviconElement && favicon) {
        faviconElement.href = favicon;
      }

    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 lg:p-6 space-y-8">

      {/* PAGE HEADER */}
      <div className="pl-1">
        <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">
          Company Settings
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Customize your branding and browser display configuration.
        </p>
      </div>

      {/* THREE COLUMN GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {/* ================= LOGO ================= */}
        <div className="group bg-white rounded-2xl border border-gray-200 p-6 flex flex-col justify-between h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1">

          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">
                Company Logo
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                Used across dashboards and reports.
              </p>
            </div>

            {logo ? (
              <img
                src={logo}
                alt="Company Logo"
                className="h-24 object-contain border rounded-xl p-3 bg-gray-50"
              />
            ) : (
              <div className="h-24 flex items-center justify-center border rounded-xl bg-gray-50 text-gray-400 text-sm">
                No logo uploaded
              </div>
            )}

            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="border border-gray-300 p-2 rounded-lg text-sm"
            />
          </div>

          <button
            onClick={handleUpload}
            disabled={loading}
            className="mt-6 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition disabled:opacity-60"
          >
            <UploadCloud size={16} />
            {loading ? "Uploading..." : "Update Logo"}
          </button>
        </div>


        {/* ================= FAVICON ================= */}
        <div className="group bg-white rounded-2xl border border-gray-200 p-6 flex flex-col justify-between h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1">

          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">
                Browser Favicon
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                Displayed in browser tabs and bookmarks.
              </p>
            </div>

            {favicon ? (
              <img
                src={favicon}
                alt="Favicon"
                className="h-14 w-14 object-contain border rounded-xl p-2 bg-gray-50"
              />
            ) : (
              <div className="h-14 w-14 flex items-center justify-center border rounded-xl bg-gray-50 text-gray-400 text-xs">
                None
              </div>
            )}

            <input
              type="file"
              accept="image/*"
              onChange={handleFaviconChange}
              className="border border-gray-300 p-2 rounded-lg text-sm"
            />
          </div>

          <button
            onClick={handleFaviconUpload}
            disabled={loading}
            className="mt-6 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition disabled:opacity-60"
          >
            <UploadCloud size={16} />
            {loading ? "Uploading..." : "Update Favicon"}
          </button>
        </div>


        {/* ================= COMPANY NAME ================= */}
        <div className="group bg-white rounded-2xl border border-gray-200 p-6 flex flex-col justify-between h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1">

          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">
                Company Name
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                Appears in browser tab title.
              </p>
            </div>

            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
              placeholder="Enter company name"
            />
          </div>

          <button
            onClick={handleCompanyNameUpdate}
            className="mt-6 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition"
          >
            <Save size={16} />
            Update Name
          </button>
        </div>

      </div>
    </div>
  );
}