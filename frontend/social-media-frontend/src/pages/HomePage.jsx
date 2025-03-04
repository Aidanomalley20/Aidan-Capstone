import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts } from "../redux/slices/postSlice";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items: posts = [], loading } = useSelector((state) => state.posts);

  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

  return (
    <div className="min-h-screen flex justify-center text-white p-4">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {loading ? (
          <p className="text-gray-500">Loading posts...</p>
        ) : posts.length === 0 ? (
          <p className="text-gray-500">No posts available.</p>
        ) : (
          posts.map((post) =>
            post.image ? (
              <div
                key={post.id}
                className="cursor-pointer relative overflow-hidden rounded-lg shadow-md"
                onClick={() => navigate(`/post/${post.id}`)}
              >
                <img
                  src={`https://aidan-capstone.onrender.com${post.image}`}
                  alt="Post"
                  className="w-full h-64 object-cover rounded-lg hover:opacity-80 transition duration-300"
                  onError={(e) => {
                    console.error("❌ Image failed to load:", e.target.src);
                    e.target.src = "/default-placeholder.png";
                  }}
                />
              </div>
            ) : null
          )
        )}
      </div>
    </div>
  );
};

export default HomePage;
