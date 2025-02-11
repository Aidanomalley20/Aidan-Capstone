import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { FaRegCommentDots } from "react-icons/fa";
import { BsThreeDotsVertical } from "react-icons/bs";

const PostDetailPage = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const response = await api.get(`/posts/${postId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setPost(response.data);
        setComments(response.data.comments || []);
        setLikes(response.data.likes || 0);
        setLiked(response.data.likedByUser || false);
      } catch (error) {
        console.error("Failed to load post:", error);
        if (error.response?.status === 401) {
          navigate("/login");
        } else if (error.response?.status === 404) {
          navigate("/profile");
        }
      }
    };

    fetchPost();
  }, [postId, navigate]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    try {
      const token = localStorage.getItem("token");

      const response = await api.post(
        `/posts/${postId}/comments`,
        { text: comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setComments([...comments, response.data]);
      setComment("");
    } catch (error) {
      console.error("Failed to post comment:", error);
    }
  };

  const handleLike = async () => {
    try {
      const token = localStorage.getItem("token");
      await api.post(
        `/posts/${postId}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setLiked(!liked);
      setLikes(liked ? likes - 1 : likes + 1);
    } catch (error) {
      console.error("Failed to like post:", error);
    }
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      await api.delete(`/posts/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      navigate("/profile");
    } catch (error) {
      console.error("Failed to delete post:", error);
    }
  };

  if (!post) return <div>Loading...</div>;

  let loggedInUser = null;
  try {
    const storedUser = localStorage.getItem("user");
    if (storedUser && storedUser !== "undefined") {
      loggedInUser = JSON.parse(storedUser);
    }
  } catch (error) {
    console.error("Error parsing user from localStorage:", error);
    localStorage.removeItem("user");
  }

  console.log("Logged in user:", loggedInUser);
  console.log("Post owner ID:", post?.user?.id);

  return (
    <div className="min-h-screen flex flex-col items-center text-white">
      <div className="max-w-2xl bg-gray-800 p-6 rounded-lg shadow-lg w-full">
        <div className="flex justify-between items-center mb-4 relative">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center text-lg font-bold">
              {post.user.username[0]}
            </div>
            <p className="text-lg font-semibold">@{post.user.username}</p>
          </div>

          {loggedInUser && post.user.id === loggedInUser.id && (
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="text-gray-400 hover:text-white"
              >
                <BsThreeDotsVertical size={22} />
              </button>

              {showMenu && (
                <div className="absolute top-10 right-0 bg-gray-900 border border-gray-700 shadow-lg rounded-md z-50">
                  <button
                    onClick={handleDelete}
                    className="block px-4 py-2 text-red-500 hover:bg-gray-700"
                  >
                    Delete Post
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="w-full h-96 rounded-lg overflow-hidden flex items-center justify-center">
          <img
            src={`http://localhost:5000${post.image}`}
            alt="Post"
            className="w-full h-full object-contain"
          />
        </div>

        <div className="flex justify-between items-center mt-3 text-gray-400 text-sm">
          <p>
            {likes} {likes === 1 ? "Like" : "Likes"}
          </p>
          <p>
            {comments.length} {comments.length === 1 ? "Comment" : "Comments"}
          </p>
        </div>

        <div className="flex space-x-6 mt-4">
          <button
            onClick={handleLike}
            className={`flex items-center space-x-2 text-lg ${
              liked ? "text-red-500" : "text-gray-400"
            }`}
          >
            {liked ? <AiFillHeart size={24} /> : <AiOutlineHeart size={24} />}
            <span>Like</span>
          </button>

          <button className="flex items-center space-x-2 text-lg text-gray-400">
            <FaRegCommentDots size={22} />
            <span>Comment</span>
          </button>
        </div>

        <div className="mt-6">
          <h3 className="text-xl font-bold mb-2">Comments</h3>
          {comments.length > 0 ? (
            comments.map((c, index) => (
              <div
                key={index}
                className="bg-gray-800 p-3 rounded mt-2 text-gray-300"
              >
                <p className="font-semibold text-white">
                  @{c.user?.username ? c.user.username : "Unknown User"}{" "}
                </p>
                <p>{c.text}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500 italic">No comments yet</p>
          )}

          <form onSubmit={handleCommentSubmit} className="mt-4">
            <input
              type="text"
              placeholder="Write a comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full p-2 text-white rounded"
            />
            <button
              type="submit"
              className="mt-2 bg-indigo-500 px-4 py-2 rounded text-white"
            >
              Comment
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PostDetailPage;
