import React, { useEffect, useState } from "react";
import { ClerkProvider, SignedIn, SignedOut, SignIn, useAuth, useUser, SignOutButton } from "@clerk/clerk-react";
import axios from "axios";
import * as tus from "tus-js-client";
import "./index.css";
import ReactDOM from 'react-dom/client';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
if (!PUBLISHABLE_KEY) throw new Error("Missing Clerk Key");

/* ================= ADMIN PANEL ================= */

const roleStyles = {
  admin: "bg-red-100 text-red-700",
  educator: "bg-blue-100 text-blue-700",
  student: "bg-gray-100 text-gray-700",
};

const AdminPanel = () => {
  const { getToken } = useAuth();
  const { user } = useUser();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchEmail, setSearchEmail] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const fetchUsers = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get(
        "http://localhost:5000/api/v1/admin/users",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUsers(data.users || []);
    } catch {
      alert("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const promoteToEducator = async (userId) => {
    if (!confirm("Promote this user to Educator?")) return;

    try {
      const token = await getToken();
      await axios.post(
        "http://localhost:5000/api/v1/admin/promote",
        { userId, role: "educator" },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchUsers(); // refresh → button disappears
    } catch {
      alert("Promotion failed");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  /* 🚫 HARD ADMIN CHECK */
  if (user?.publicMetadata?.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600 font-semibold text-lg">
        🚫 Access Denied — Admins Only
      </div>
    );
  }

  const filteredUsers = users.filter((u) => {
    const emailMatch = u.email
      ?.toLowerCase()
      .includes(searchEmail.toLowerCase());
    const roleMatch = roleFilter === "all" || u.role === roleFilter;
    return emailMatch && roleMatch;
  });

  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [videoUrl, setVideoUrl] = useState(null);

  async function handleUpload(file) {
    setUploading(true);
    setProgress(0);

    const token = await getToken();

    // Get upload credentials from your API
    const response = await fetch("http://localhost:5000/api/v1/media/bunny/sign", {
      method: "POST",
      headers: { 
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ title: file.name }),
    });

    if (!response.ok) {
      setUploading(false);
      throw new Error("Failed to get upload credentials");
    }

    const credentials = (await response.json())

    console.log("Received credentials:", credentials);

    // Create TUS upload
    const upload = new tus.Upload(file, {
      endpoint: "https://video.bunnycdn.com/tusupload",
      retryDelays: [0, 3000, 5000, 10000, 20000, 60000],
      headers: {
        AuthorizationSignature: credentials.signature,
        AuthorizationExpire: credentials.expirationTime,
        VideoId: credentials.videoId,
        LibraryId: credentials.libraryId,
      },
      metadata: {
        filetype: file.type,
        title: file.name,
      },
      onError(error) {
        console.error("Upload error:", error);
        setUploading(false);
      },
      onProgress(bytesUploaded, bytesTotal) {
        setProgress(Math.round((bytesUploaded / bytesTotal) * 100));
      },
      onSuccess() {
        setVideoUrl(credentials.embedUrl);
        setUploading(false);
      },
    });

    // Resume previous upload if available
    const previousUploads = await upload.findPreviousUploads();
    if (previousUploads.length) {
      upload.resumeFromPreviousUpload(previousUploads[0]);
    }

    upload.start();
  }

  function handleFileChange(event) {
    const file = event.target.files?.[0];
    if (file) {
      handleUpload(file);
    }
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
            <p className="text-gray-400">Manage users and media</p>
          </div>
          <SignOutButton>
            <button className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-lg hover:from-red-600 hover:to-red-700 transition font-semibold shadow-lg cursor-pointer">
              Sign Out
            </button>
          </SignOutButton>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Users Section */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Filters */}
            <div className="p-6 border-b border-gray-200 bg-gray-50">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Users</h2>
              <div className="flex flex-col md:flex-row gap-4">
                <input
                  placeholder="Search by email..."
                  value={searchEmail}
                  onChange={(e) => setSearchEmail(e.target.value)}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                >
                  <option value="all">All Roles</option>
                  <option value="student">Student</option>
                  <option value="educator">Educator</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>

            {/* Table */}
            {loading ? (
              <div className="p-12 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <p className="text-gray-500 mt-2">Loading users...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-100 text-gray-700 uppercase text-xs font-semibold">
                    <tr>
                      <th className="px-6 py-4 text-left">User</th>
                      <th className="px-6 py-4">Role</th>
                      <th className="px-6 py-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((u) => (
                      <tr key={u._id} className="border-t border-gray-200 hover:bg-gray-50 transition">
                        <td className="px-6 py-4">
                          <div className="font-semibold text-gray-900">
                            {u.firstName} {u.lastName}
                          </div>
                          <div className="text-xs text-gray-500">
                            {u.email}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${roleStyles[u.role]}`}
                          >
                            {u.role.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          {u.role === "student" ? (
                            <button
                              onClick={() => promoteToEducator(u._id)}
                              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition shadow-md"
                            >
                              Promote
                            </button>
                          ) : (
                            <span className="text-xs text-gray-400">—</span>
                          )}
                        </td>
                      </tr>
                    ))}
                    {filteredUsers.length === 0 && (
                      <tr>
                        <td colSpan="3" className="py-8 text-center text-gray-400">
                          No matching users
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Media Upload Section */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Upload Video</h2>
            <label className="block">
              <input
                type="file"
                accept="video/*"
                onChange={handleFileChange}
                disabled={uploading}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 disabled:opacity-50"
              />
            </label>

            {uploading && (
              <div className="mt-4">
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-600">Uploading...</span>
                  <span className="text-sm font-semibold text-gray-800">{progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            )}

            {videoUrl && (
              <div className="mt-4">
                <p className="text-sm text-green-600 font-semibold mb-2">Upload Complete!</p>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-600 break-all">{videoUrl}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};



ReactDOM.createRoot(document.getElementById('root')).render(
  <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
    {/* 🔐 Not logged in → Login page */}
    <SignedOut>
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <SignIn />
      </div>
    </SignedOut>

    {/* ✅ Logged in */}
    <SignedIn>
      <AdminPanel />
    </SignedIn>
  </ClerkProvider>
);
