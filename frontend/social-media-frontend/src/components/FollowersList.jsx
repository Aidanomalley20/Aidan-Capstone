import { useEffect, useState } from "react";
import api from "../services/api";

const FollowersList = ({ userId, onClose, isFollowing = false }) => {
  const [list, setList] = useState([]);
  const title = isFollowing ? "Following" : "Followers";

  useEffect(() => {
    const fetchList = async () => {
      try {
        const token = localStorage.getItem("token");
        const endpoint = isFollowing
          ? `/users/${userId}/following`
          : `/users/${userId}/followers`;
        const response = await api.get(endpoint, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setList(response.data);
      } catch (error) {
        console.error(`Failed to fetch ${title}:`, error);
      }
    };

    fetchList();
  }, [userId, isFollowing]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-gray-800 p-6 rounded-lg w-96 text-white">
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        <ul>
          {list.map((user) => (
            <li
              key={user.id}
              className="border-b border-gray-600 py-2 cursor-pointer hover:text-indigo-400"
              onClick={() => {
                onClose();
                window.location.href = `/profile/${user.id}`;
              }}
            >
              @{user.username}
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
