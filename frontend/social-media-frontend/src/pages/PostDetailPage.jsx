import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts } from "../redux/slices/postSlice";
import PostCard from "../components/PostCard";
import api from "../services/api";

const PostDetailPage = () => {
  const { postId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items: posts } = useSelector((state) => state.posts);
  const post = posts.find((p) => p.id === Number(postId));

  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);

  useEffect(() => {
    if (!post) {
      dispatch(fetchPosts());
    } else {
      setComments(post.comments || []);
    }
  }, [post, dispatch]);

  console.log("📝 PostDetailPage Post (Updated):", post);

  if (!post) return <div>Loading...</div>;

  return (
    <div className="min-h-screen flex flex-col items-center text-white">
      <div className="max-w-2xl bg-gray-800 p-6 rounded-lg shadow-lg w-full">
        <PostCard post={post} />

        <div className="mt-6">
          <h3 className="text-xl font-bold mb-2">Comments</h3>
          {comments.length > 0 ? (
            comments.map((c, index) => (
              <div
                key={index}
                className="bg-gray-800 p-3 rounded mt-2 text-gray-300"
              >
                <p className="font-semibold text-white">
                  @{c.user?.username || "Unknown User"}
                </p>
                <p>{c.text}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500 italic">No comments yet</p>
          )}

          <form
            onSubmit={async (e) => {
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
            }}
            className="mt-4"
          >
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
