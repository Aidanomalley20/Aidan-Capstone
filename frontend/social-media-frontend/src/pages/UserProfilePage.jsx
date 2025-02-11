import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

const UserProfilePage = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found. Redirecting to login.");
          navigate("/login");
          return;
        }

        const response = await api.get(`/auth/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(response.data);
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
        if (error.response?.status === 401) {
          navigate("/login");
        }
      }
    };

    fetchUser();
  }, [userId, navigate]);

  if (!user)
    return <div className="text-center text-white">Loading profile...</div>;

  return (
    <div className="min-h-screen flex flex-col items-center text-white">
      <div className="max-w-2xl bg-gray-800 p-6 rounded-lg shadow-lg w-full">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-20 h-20 bg-gray-400 rounded-full flex items-center justify-center text-2xl font-bold">
            {user.username[0]}
          </div>
          <p className="text-2xl font-semibold">@{user.username}</p>
        </div>
        <p className="text-gray-300">Bio: {user.bio || "No bio available."}</p>
      </div>
    </div>
  );
};

export default UserProfilePage;
