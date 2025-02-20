import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toggleLike, deletePost } from "../redux/slices/postSlice";
import api from "../services/api";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { FaRegCommentDots } from "react-icons/fa";
import { BsThreeDotsVertical } from "react-icons/bs";
import { MdExpandMore, MdExpandLess } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

const PostCard = ({ post }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [liked, setLiked] = useState(post.likedByUser);
  const [likeCount, setLikeCount] = useState(post.likes);
  const [showMenu, setShowMenu] = useState(false);
  const [comments, setComments] = useState(post.comments || []);
  const [commentText, setCommentText] = useState("");
  const [showComments, setShowComments] = useState(false);

  const storedUser = JSON.parse(localStorage.getItem("user"));
  const isOwner = storedUser?.id === post.user.id;

  const updatedPost =
    useSelector((state) => state.posts.items.find((p) => p.id === post.id)) ||
    post;

  console.log("🔄 PostCard Updated State:", updatedPost);

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount(liked ? likeCount - 1 : likeCount + 1);
    dispatch(toggleLike(post.id));
    console.log("❤️ Like Button Clicked for Post:", post.id);
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      dispatch(deletePost(post.id));
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      const token = localStorage.getItem("token");
      const response = await api.post(
        `/posts/${post.id}/comments`,
        { text: commentText },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setComments([...comments, response.data]);
      setCommentText("");
    } catch (error) {
      console.error("Failed to post comment:", error);
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-3">
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

        {isOwner && (
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

      {post.image && (
        <div
          className="w-full h-96 rounded-lg overflow-hidden flex items-center justify-center cursor-pointer"
          onClick={() => navigate(`/post/${post.id}`)}
        >
          <img
            src={`http://localhost:5000${post.image}`}
            alt="Post"
            className="w-full h-full object-contain"
          />
        </div>
      )}

      {post.content && (
        <p className="mt-4 text-gray-300 text-lg break-words">{post.content}</p>
      )}

      <div className="flex justify-between items-center mt-3 text-gray-400 text-sm">
        <p>
          {likeCount} {likeCount === 1 ? "Like" : "Likes"}
        </p>
        <p>
          {comments.length} {comments.length === 1 ? "Comment" : "Comments"}
        </p>
      </div>

      <div className="flex space-x-6 mt-4">
        <button
          onClick={handleLike}
          className={`flex items-center space-x-2 text-lg ${
            updatedPost.likedByUser ? "text-red-500" : "text-gray-400"
          }`}
        >
          {updatedPost.likedByUser ? (
            <AiFillHeart size={24} />
          ) : (
            <AiOutlineHeart size={24} />
          )}
          <span>Like</span>
        </button>

        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center space-x-2 text-lg text-gray-400"
        >
          <FaRegCommentDots size={22} />
          <span>Comments</span>
          {showComments ? (
            <MdExpandLess size={22} />
          ) : (
            <MdExpandMore size={22} />
          )}
        </button>
      </div>

      {showComments && (
        <div className="mt-4">
          <div className="max-h-40 overflow-y-auto bg-gray-700 p-3 rounded">
            {comments.length > 0 ? (
              comments.map((c, index) => (
                <div key={index} className="p-2 border-b border-gray-600">
                  <p className="font-semibold text-white">
                    @{c.user?.username || "Unknown User"}:
                  </p>
                  <p className="text-gray-300">{c.text}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-400 italic">No comments yet.</p>
            )}
          </div>

          <form onSubmit={handleCommentSubmit} className="mt-3">
            <input
              type="text"
              placeholder="Write a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="w-full p-2 text-white bg-gray-900 rounded"
            />
            <button
              type="submit"
              className="mt-2 bg-indigo-500 px-4 py-2 rounded text-white w-full"
            >
              Comment
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

PostCard.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.number.isRequired,
    user: PropTypes.shape({
      id: PropTypes.number.isRequired,
      username: PropTypes.string.isRequired,
    }).isRequired,
    content: PropTypes.string,
    image: PropTypes.string,
    likes: PropTypes.number.isRequired,
    likedByUser: PropTypes.bool,
    comments: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        text: PropTypes.string.isRequired,
        user: PropTypes.shape({
          id: PropTypes.number.isRequired,
          username: PropTypes.string.isRequired,
        }).isRequired,
      })
    ),
  }).isRequired,
};

export default PostCard;
