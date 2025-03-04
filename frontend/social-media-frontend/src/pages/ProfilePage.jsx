import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import FollowersList from "../components/FollowersList";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({ followers: 0, following: 0, posts: 0 });
  const [posts, setPosts] = useState([]);
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const userResponse = await api.get("/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(userResponse.data);

        const statsResponse = await api.get("/auth/stats", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStats(statsResponse.data);

        const postsResponse = await api.get("/posts/my-posts", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setPosts(postsResponse.data.reverse());
      } catch (error) {
        console.error("Failed to fetch profile data:", error);
        localStorage.removeItem("token");
        navigate("/login");
      }
    };

    fetchProfileData();
  }, [navigate]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white px-8 py-6 flex flex-col items-center">
      <div className="w-full max-w-4xl flex flex-col items-center border-b border-gray-500 pb-6">
        <div className="flex items-center space-x-6">
          <div className="w-28 h-28 bg-gray-300 rounded-full overflow-hidden border-2 border-white shadow-md">
            {user.profilePicture ? (
              <img
                src={`https://aidan-capstone.onrender.com${user.profilePicture}`}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-2xl font-bold text-gray-700">
                {user.firstName[0]}
              </div>
            )}
          </div>

          <div>
            <h1 className="text-3xl font-bold">@{user.username}</h1>
            <p className="text-gray-300">
              {user.firstName} {user.lastName}
            </p>
            {user.bio && (
              <p className="text-gray-400 italic mt-2">{user.bio}</p>
            )}
          </div>
        </div>

        <div className="flex space-x-6 mt-4">
          <div className="text-center">
            <h2 className="text-xl font-bold">{stats.posts}</h2>
            <p className="text-gray-300">Posts</p>
          </div>
          <div
            className="text-center cursor-pointer"
            onClick={() => setShowFollowers(true)}
          >
            <h2 className="text-xl font-bold">{stats.followers}</h2>
            <p className="text-gray-300">Followers</p>
          </div>
          <div
            className="text-center cursor-pointer"
            onClick={() => setShowFollowing(true)}
          >
            <h2 className="text-xl font-bold">{stats.following}</h2>
            <p className="text-gray-300">Following</p>
          </div>
        </div>

        <div className="mt-4 flex space-x-4">
          <button
            onClick={() => navigate("/settings")}
            className="px-6 py-2 bg-gray-700 text-white font-semibold rounded-md hover:bg-gray-600 transition"
          >
            Edit Profile
          </button>
          <button
            onClick={() => navigate("/create-post")}
            className="px-6 py-2 bg-indigo-500 text-white font-semibold rounded-md hover:bg-indigo-600 transition"
          >
            Create Post
          </button>
        </div>
      </div>

      <div className="w-full max-w-4xl mt-6">
        <h2 className="text-2xl font-bold mb-4">Your Posts</h2>
        <div className="grid grid-cols-3 gap-2 sm:gap-4">
          {posts.map((post) => (
            <div
              key={post.id}
              className="relative w-full h-56 sm:h-64 bg-gray-800 rounded-lg overflow-hidden cursor-pointer border border-gray-700 shadow-md hover:opacity-80 transition"
              onClick={() => navigate(`/post/${post.id}`)}
            >
              {post.image && (
                <img
                  src={`https://aidan-capstone.onrender.com${post.image}`}
                  alt="Post"
                  className="w-full h-full object-cover"
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {showFollowers && (
        <FollowersList
          userId={user.id}
          onClose={() => setShowFollowers(false)}
        />
      )}

      {showFollowing && (
        <FollowersList
          userId={user.id}
          onClose={() => setShowFollowing(false)}
          isFollowing
        />
      )}
    </div>
  );
};

export default ProfilePage;
