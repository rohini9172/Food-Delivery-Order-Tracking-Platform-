import { useEffect, useState } from "react";
import api from "../api/axios";

export default function CustomerProfilePage() {
  const [profile, setProfile] = useState({ name: "", email: "", phone: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Assuming backend has endpoint: GET /api/customers/me
    api.get("/api/customers/me")
      .then(res => {
        setProfile(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching profile:", err);
        setLoading(false);
      });
  }, []);

  const updateProfile = async () => {
    try {
      await api.put("/api/customers/me", profile);
      alert("Profile updated successfully!");
    } catch (err) {
      alert("Error updating profile: " + err.message);
    }
  };

  if (loading) return <p className="p-6">Loading profile...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">My Profile</h1>
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Name"
          value={profile.name}
          onChange={e => setProfile({ ...profile, name: e.target.value })}
          className="border p-2 w-full"
        />
        <input
          type="email"
          placeholder="Email"
          value={profile.email}
          onChange={e => setProfile({ ...profile, email: e.target.value })}
          className="border p-2 w-full"
        />
        <input
          type="text"
          placeholder="Phone"
          value={profile.phone}
          onChange={e => setProfile({ ...profile, phone: e.target.value })}
          className="border p-2 w-full"
        />
        <button
          onClick={updateProfile}
          className="bg-blue-500 text-white px-4 py-2"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}
