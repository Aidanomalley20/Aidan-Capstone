import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

const UserProfilePage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const loggedInUser = JSON.parse(localStorage.getItem("user")) || {};

  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({ followers: 0, following: 0, posts: 0 });
  const [posts, setPosts] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) return;

    if (Number(userId) === loggedInUser?.id) {
      navigate("/profile");
      return;
    }

    const fetchUserData = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const [userResponse, statsResponse, postsResponse] = await Promise.all([
          api.get(`/users/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          api.get(`/users/${userId}/stats`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          api.get(`/posts/user/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setUser(userResponse.data);
        setStats(statsResponse.data);
        setPosts(postsResponse.data.reverse());
        setIsFollowing(userResponse.data.isFollowing);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        setError("Failed to load profile. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId, navigate, loggedInUser?.id]);

  const handleFollowToggle = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await api.post(
        `/users/follow/${userId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setIsFollowing(response.data.isFollowing);
      setStats((prev) => ({
        ...prev,
        followers: response.data.isFollowing
          ? prev.followers + 1
          : prev.followers - 1,
      }));
    } catch (error) {
      console.error("Failed to follow/unfollow user:", error);
      setError("Unable to follow user at this time.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        {error}
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
                src={`http://localhost:5000${user.profilePicture}`}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-2xl font-bold text-gray-700">
                {user.username[0]}
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
          <div className="text-center">
            <h2 className="text-xl font-bold">{stats.followers}</h2>
            <p className="text-gray-300">Followers</p>
          </div>
          <div className="text-center">
            <h2 className="text-xl font-bold">{stats.following}</h2>
            <p className="text-gray-300">Following</p>
          </div>
        </div>

        <div className="mt-4">
          <button
            onClick={handleFollowToggle}
            className={`px-6 py-2 rounded-md ${
              isFollowing ? "bg-gray-600" : "bg-indigo-500"
            } text-white`}
          >
            {isFollowing ? "Unfollow" : "Follow"}
          </button>
        </div>
      </div>

      <div className="w-full max-w-4xl mt-6">
        <h2 className="text-2xl font-bold mb-4">{user.username}'s Posts</h2>
        <div className="grid grid-cols-3 gap-2 sm:gap-4">
          {posts.map((post) => (
            <div
              key={post.id}
              className="relative w-full h-56 sm:h-64 bg-gray-800 rounded-lg overflow-hidden cursor-pointer border border-gray-700 shadow-md hover:opacity-80 transition"
              onClick={() => navigate(`/post/${post.id}`)}
            >
              {post.image && (
                <img
                  src={`http://localhost:5000${post.image}`}
                  alt="Post"
                  className="w-full h-full object-cover"
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
