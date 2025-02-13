import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { toggleLike } from "../redux/slices/postSlice";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { FaRegCommentDots } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const PostCard = ({ post }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [liked, setLiked] = useState(post.likedByUser);
  const [likeCount, setLikeCount] = useState(post.likes);

  useEffect(() => {
    setLiked(post.likedByUser);
    setLikeCount(post.likes);
  }, [post]);

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount(liked ? likeCount - 1 : likeCount + 1);
    dispatch(toggleLike(post.id));
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full">
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

      <div className="flex justify-between items-center mt-3 text-gray-400 text-sm">
        <p>
          {likeCount} {likeCount === 1 ? "Like" : "Likes"}
        </p>
        <p>
          {post.comments?.length || 0}{" "}
          {post.comments?.length === 1 ? "Comment" : "Comments"}
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

        <button
          onClick={() => navigate(`/post/${post.id}`)}
          className="flex items-center space-x-2 text-lg text-gray-400"
        >
          <FaRegCommentDots size={22} />
          <span>Comment</span>
        </button>
      </div>
    </div>
  );
};

export default PostCard;
