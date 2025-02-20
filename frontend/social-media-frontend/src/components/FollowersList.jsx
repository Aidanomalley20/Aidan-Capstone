import { useEffect, useState } from "react";
import api from "../services/api";

const FollowersList = ({ userId, onClose }) => {
  const [followers, setFollowers] = useState([]);

  useEffect(() => {
    const fetchFollowers = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await api.get(`/users/${userId}/followers`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFollowers(response.data);
      } catch (error) {
        console.error("Failed to fetch followers:", error);
      }
    };

    fetchFollowers();
  }, [userId]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-gray-800 p-6 rounded-lg w-96 text-white">
        <h2 className="text-xl font-bold mb-4">Followers</h2>
        <ul>
          {followers.map((follower) => (
            <li key={follower.id} className="border-b border-gray-600 py-2">
              @{follower.username}
            </li>
          ))}
        </ul>
        <button onClick={onClose} className="mt-4 bg-red-500 px-4 py-2 rounded">
          Close
        </button>
      </div>
    </div>
  );
};

export default FollowersList;
