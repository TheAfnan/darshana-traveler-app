import React, { useState, useEffect } from "react";
import type { UserProfile } from "../../types";
import { Edit2, Plus, Calendar, MapPin, Globe2, Heart, Plane, User, AtSign, AlertCircle, CheckCircle } from "lucide-react";
import { API_BASE_URL } from "../../config/api";

interface UserData {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  username: string;
  usernameChangeCount: number;
  role: string;
  profileImage: string | null;
  createdAt: string;
}

const MyProfile: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  const [editFormData, setEditFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    username: "",
  });

  useEffect(() => {
    fetchUserData();
    fetchProfile();
  }, []);

  // Fetch user data from localStorage or API
  const fetchUserData = async () => {
    try {
      // First check localStorage
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        setUserData(parsed);
        setEditFormData({
          fullName: parsed.fullName || "",
          email: parsed.email || "",
          phone: parsed.phone || "",
          username: parsed.username || "",
        });
      }

      // Then fetch fresh data from API
      const token = localStorage.getItem("authToken");
      if (token) {
        const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          setUserData(data.user);
          localStorage.setItem("user", JSON.stringify(data.user));
          setEditFormData({
            fullName: data.user.fullName || "",
            email: data.user.email || "",
            phone: data.user.phone || "",
            username: data.user.username || "",
          });
        }
      }
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    }
  };

  const fetchProfile = async () => {
    try {
      const response = await fetch("/api/profile", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      const data = await response.json();
      setProfile(data);
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`${API_BASE_URL}/api/auth/update-profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          fullName: editFormData.fullName,
          phone: editFormData.phone,
          username: editFormData.username,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setUserData(data.user);
        localStorage.setItem("user", JSON.stringify(data.user));
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
        setIsEditing(false);
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to update profile' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-xl text-gray-600">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const displayName = userData?.fullName || profile?.fullName || "User";
  const displayEmail = userData?.email || profile?.email || "";
  const displayPhone = userData?.phone || profile?.phone || "";
  const displayUsername = userData?.username || "";
  const usernameChangesLeft = 2 - (userData?.usernameChangeCount || 0);
  const memberSince = userData?.createdAt || profile?.createdAt;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      
      {/* 🔵 TOP BANNER */}
      <div className="relative h-44 w-full bg-gradient-to-r from-blue-600 to-blue-400">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 transform translate-y-1/2">
          <div className="w-28 h-28 rounded-full bg-white shadow-xl border-4 border-white overflow-hidden">
            {userData?.profileImage ? (
              <img src={userData.profileImage} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-blue-600 bg-blue-50">
                {displayName.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-20 max-w-6xl mx-auto px-4">
        {/* NAME + EDIT BUTTON */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{displayName}</h1>
            <p className="text-gray-500 flex items-center gap-1">
              <AtSign size={14} />
              {displayUsername || 'No username set'}
            </p>
            <p className="text-gray-600 text-sm mt-1">
              Member since {memberSince ? new Date(memberSince).getFullYear() : 'N/A'}
            </p>
          </div>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700"
          >
            <Edit2 size={16} />
            {isEditing ? "Cancel" : "Edit Profile"}
          </button>
        </div>

        {/* Success/Error Message */}
        {message && (
          <div className={`mt-4 p-4 rounded-xl flex items-center gap-3 ${
            message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}>
            {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
            {message.text}
          </div>
        )}

        {/* 🔵 PROFILE STATS */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="bg-white rounded-xl p-5 shadow-md flex items-center gap-4">
            <Plane className="text-blue-600" size={26} />
            <div>
              <p className="text-gray-500 text-sm">Upcoming Trips</p>
              <p className="text-xl font-bold">{profile?.upcomingTrips?.length || 0}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-md flex items-center gap-4">
            <Globe2 className="text-green-600" size={26} />
            <div>
              <p className="text-gray-500 text-sm">Past Trips</p>
              <p className="text-xl font-bold">{profile?.pastTrips?.length || 0}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-md flex items-center gap-4">
            <Heart className="text-red-600" size={26} />
            <div>
              <p className="text-gray-500 text-sm">Saved Places</p>
              <p className="text-xl font-bold">{profile?.savedDestinations?.length || 0}</p>
            </div>
          </div>
        </div>

        {/* 🔵 EDIT FORM */}
        {isEditing && (
          <form
            onSubmit={handleSaveProfile}
            className="bg-white shadow-md rounded-xl p-6 mt-6 space-y-4"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Edit Your Profile</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Full Name */}
              <div>
                <label className="text-gray-600 text-sm font-medium">Full Name</label>
                <input
                  type="text"
                  value={editFormData.fullName}
                  onChange={(e) => setEditFormData({ ...editFormData, fullName: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Email (Read Only) */}
              <div>
                <label className="text-gray-600 text-sm font-medium">Email (Cannot be changed)</label>
                <input
                  type="email"
                  value={displayEmail}
                  disabled
                  className="w-full px-4 py-2 border rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="text-gray-600 text-sm font-medium">Phone</label>
                <input
                  type="tel"
                  value={editFormData.phone}
                  onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Username */}
              <div>
                <label className="text-gray-600 text-sm font-medium flex items-center justify-between">
                  <span>Username</span>
                  <span className={`text-xs ${usernameChangesLeft > 0 ? 'text-blue-600' : 'text-red-500'}`}>
                    {usernameChangesLeft > 0 
                      ? `${usernameChangesLeft} changes left` 
                      : '⚠️ No changes left'}
                  </span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">@</span>
                  <input
                    type="text"
                    value={editFormData.username}
                    onChange={(e) => setEditFormData({ ...editFormData, username: e.target.value })}
                    disabled={usernameChangesLeft <= 0 && editFormData.username === userData?.username}
                    className={`w-full pl-8 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                      usernameChangesLeft <= 0 ? 'bg-gray-100' : ''
                    }`}
                    placeholder="your_username"
                  />
                </div>
                {usernameChangesLeft <= 0 && (
                  <p className="text-xs text-gray-500 mt-1">
                    You've reached the limit of 2 username changes.
                  </p>
                )}
              </div>
            </div>

            <button 
              type="submit"
              disabled={saving}
              className="w-full bg-green-600 text-white py-2.5 rounded-lg hover:bg-green-700 disabled:bg-gray-400 flex items-center justify-center gap-2"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </form>
        )}

        {/* Profile Info Card (when not editing) */}
        {!isEditing && userData && (
          <div className="bg-white rounded-xl shadow-md p-6 mt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <User size={20} className="text-blue-600" />
              Account Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-500 text-sm">Email</p>
                <p className="font-medium">{displayEmail}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Phone</p>
                <p className="font-medium">{displayPhone}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Username</p>
                <p className="font-medium">@{displayUsername || 'Not set'}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Role</p>
                <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                  userData.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                }`}>
                  {userData.role?.toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* 🔵 UPCOMING TRIPS */}
        <div className="mt-10">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Upcoming Trips</h2>
            <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700">
              <Plus size={16} /> New Trip
            </button>
          </div>

          {profile?.upcomingTrips?.length ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {profile.upcomingTrips.map((trip) => (
                <div key={trip.id} className="bg-white rounded-xl border shadow-md p-4 hover:shadow-lg transition">
                  <h3 className="font-bold text-lg">{trip.destination.name}</h3>
                  <p className="text-gray-600 mt-1 flex items-center gap-2">
                    <Calendar size={16} />
                    {new Date(trip.startDate).toLocaleDateString()} →{" "}
                    {new Date(trip.endDate).toLocaleDateString()}
                  </p>

                  <p className="mt-1 flex items-center gap-2 text-gray-600">
                    <MapPin size={16} /> {trip.destination.country}
                  </p>

                  <p className="mt-2 font-bold text-blue-600 text-lg">
                    ₹{trip.totalCost.toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-center py-10">No trips planned.</p>
          )}
        </div>

        {/* 🔵 PAST TRIPS */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-4">Past Trips</h2>

          {profile?.pastTrips?.length ? (
            <div className="space-y-4">
              {profile.pastTrips.map((trip) => (
                <div key={trip.id} className="bg-white rounded-xl border p-4 flex justify-between shadow-sm">
                  <div>
                    <h3 className="font-bold">{trip.destination.name}</h3>
                    <p className="text-sm text-gray-500">
                      {new Date(trip.startDate).toLocaleDateString()} –{" "}
                      {new Date(trip.endDate).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="font-bold text-gray-700">₹{trip.totalCost.toLocaleString()}</p>
                    <span className="px-2 py-1 text-xs bg-gray-200 rounded">Completed</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-center py-6">No past trips yet.</p>
          )}
        </div>

        {/* 🔵 SAVED DESTINATIONS */}
        <div className="mt-14">
          <h2 className="text-2xl font-bold mb-4">Saved Destinations</h2>

          {profile?.savedDestinations?.length ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {profile.savedDestinations.map((dest) => (
                <div key={dest.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:scale-[1.02] transition">
                  <img src={dest.image} alt="" className="h-40 w-full object-cover" />
                  <div className="p-4">
                    <h3 className="font-bold">{dest.name}</h3>
                    <p className="text-gray-600 text-sm">{dest.country}</p>
                    <p className="text-gray-500 text-xs mt-2 line-clamp-2">
                      {dest.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-center py-8">No saved destinations yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
