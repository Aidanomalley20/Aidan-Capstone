import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logoutUser } from "../redux/slices/authSlice";

import api from "../services/api";

const SettingsPage = () => {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    bio: "",
    profilePic: null,
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const response = await api.get("/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(response.data);
        setFormData({
          username: response.data.username || "",
          email: response.data.email || "",
          bio: response.data.bio || "",
          profilePic: response.data.profilePic || null,
          password: "",
        });
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        localStorage.removeItem("token");
        navigate("/login");
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, profilePic: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Not authenticated");
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("username", formData.username);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("bio", formData.bio);

    if (formData.profilePic) {
      formDataToSend.append("profilePicture", formData.profilePic);
    }

    if (formData.password && formData.password.trim() !== "") {
      formDataToSend.append("password", formData.password);
    }

    try {
      const response = await fetch("http://localhost:5000/api/auth/update", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`, // DO NOT set Content-Type for FormData
        },
        body: formDataToSend,
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Profile updated:", data);
        setMessage("Profile updated successfully!");
        setUser(data.updatedUser); // Update local user state
      } else {
        console.error("Update failed:", data);
        setMessage("Failed to update profile.");
      }
    } catch (error) {
      console.error("❌ Failed to update profile:", error);
      setMessage("Failed to update profile.");
    }
  };

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleDeleteAccount = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await api.delete("/auth/delete", {
        headers: { Authorization: `Bearer ${token}` },
      });

      dispatch(logoutUser());
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/register");
    } catch (error) {
      console.error("Account deletion failed:", error);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-black">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen  text-black px-8 py-6">
      <h1 className="text-5xl font-extrabold mb-8 text-indigo-600">
        ⚙️ Settings
      </h1>

      <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-300">
        <h2 className="text-2xl font-extrabold mb-4 text-black">
          👤 Personal Info
        </h2>
        <p className="text-lg">
          <strong className="text-indigo-500">Username:</strong> {user.username}
        </p>
        <p className="text-lg">
          <strong className="text-indigo-500">Email:</strong> {user.email}
        </p>
        <p className="text-lg">
          <strong className="text-indigo-500">Full Name:</strong>{" "}
          {user.firstName} {user.lastName}
        </p>
        <p className="text-lg">
          <strong className="text-indigo-500">Phone:</strong>{" "}
          {user.phone || "Not Provided"}
        </p>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-300 mt-6">
        <h2 className="text-2xl font-extrabold mb-4 text-black">
          Update Profile
        </h2>
        <form onSubmit={handleSubmit}>
          <label className="block text-gray-800 font-bold">Username:</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            className="w-full p-3 mb-3 border border-gray-400 rounded-lg focus:ring focus:ring-indigo-300"
          />

          <label className="block text-gray-800 font-bold">Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full p-3 mb-3 border border-gray-400 rounded-lg focus:ring focus:ring-indigo-300"
          />

          <label className="block text-gray-800 font-bold">
            New Password (optional):
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            className="w-full p-3 mb-3 border border-gray-400 rounded-lg focus:ring focus:ring-indigo-300"
          />

          <label className="block text-gray-800 font-bold">Bio:</label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleInputChange}
            className="w-full p-3 mb-3 border border-gray-400 rounded-lg focus:ring focus:ring-indigo-300"
          ></textarea>

          <label className="block text-gray-800 font-bold">
            Profile Picture:
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full p-3 mb-3 border border-gray-400 rounded-lg bg-gray-200 text-black"
          />

          <button
            type="submit"
            className="w-40 px-4 py-3 bg-indigo-500 text-white font-bold rounded-lg hover:bg-indigo-600 transition shadow-md"
          >
            Save Changes
          </button>
        </form>
        {message && (
          <p className="text-center mt-4 text-green-500 font-semibold">
            {message}
          </p>
        )}
      </div>

      <div className="mt-8 flex flex-col space-y-3">
        <button
          onClick={handleLogout}
          className="w-40 px-4 py-3 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600 transition shadow-md"
        >
          Logout
        </button>

        <button
          onClick={handleDeleteAccount}
          className="w-40 px-4 py-3 bg-gray-700 text-white font-bold rounded-lg hover:bg-red-700 transition shadow-md"
        >
          Delete Account
        </button>
      </div>
    </div>
  );
};

export default SettingsPage;
