import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { FaRegCommentDots } from "react-icons/fa";

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const response = await api.get("/posts", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setPosts(response.data || []);
      } catch (error) {
        console.error("Failed to fetch posts:", error);
        setPosts([]);
      }
    };

    fetchPosts();
  }, [navigate]);

  const handleLike = async (postId, liked) => {
    try {
      const token = localStorage.getItem("token");

      await api.post(
        `/posts/${postId}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? {
                ...post,
                likedByUser: !liked,
                likes: liked ? post.likes - 1 : post.likes + 1,
              }
            : post
        )
      );
    } catch (error) {
      console.error("Failed to like post:", error);
    }
  };

  if (!posts.length)
    return (
      <div className="text-center text-gray-500 italic mt-10">
        No posts available.
      </div>
    );

  return (
    <div className="min-h-screen flex flex-col items-center text-white">
      <div className="w-full max-w-2xl space-y-6 mt-6">
        {posts.map((post) => (
          <div
            key={post.id}
            className="bg-gray-800 p-6 rounded-lg shadow-lg w-full"
          >
            <div className="flex items-center space-x-3 mb-4">
              <div
                className="w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center text-lg font-bold cursor-pointer"
                onClick={() => navigate(`/profile/${post.user.id}`)}
              >
                {post.user.username ? post.user.username[0] : "U"}
              </div>
              <p
                className="text-lg font-semibold cursor-pointer hover:underline"
                onClick={() => navigate(`/profile/${post.user.id}`)}
              >
                @{post.user.username}
              </p>
            </div>

            {post.image && (
              <div className="w-full h-96 rounded-lg overflow-hidden flex items-center justify-center">
                <img
                  src={`http://localhost:5000${post.image}`}
                  alt="Post"
                  className="w-full h-full object-contain"
                />
              </div>
            )}

            <div className="flex justify-between items-center mt-3 text-gray-400 text-sm">
              <p>
                {post.likes || 0} {post.likes === 1 ? "Like" : "Likes"}
              </p>
              <p>
                {post.comments?.length || 0}{" "}
                {post.comments?.length === 1 ? "Comment" : "Comments"}
              </p>
            </div>

            <div className="flex space-x-6 mt-4">
              <button
                onClick={() => handleLike(post.id, post.likedByUser)}
                className={`flex items-center space-x-2 text-lg ${
                  post.likedByUser ? "text-red-500" : "text-gray-400"
                }`}
              >
                {post.likedByUser ? (
                  <AiFillHeart size={24} />
                ) : (
                  <AiOutlineHeart size={24} />
                )}
                <span>Like</span>
              </button>

              <button
                onClick={() => navigate(`/post/${post.id}`)}
                className="flex items-center space-x-2 text-lg text-gray-400"
              >
                <FaRegCommentDots size={22} />
                <span>Comment</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
