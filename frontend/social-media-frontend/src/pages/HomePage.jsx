import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts } from "../redux/slices/postSlice";
import PostCard from "../components/PostCard";

const HomePage = () => {
  const dispatch = useDispatch();
  const { items: posts = [], loading } = useSelector((state) => state.posts);

  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

  return (
    <div className="min-h-screen flex flex-col items-center text-white">
      <div className="w-full max-w-2xl space-y-6 mt-6">
        {loading ? (
          <p className="text-gray-500">Loading posts...</p>
        ) : posts.length === 0 ? (
          <p className="text-gray-500">No posts available.</p>
        ) : (
          posts.map((post) => <PostCard key={post.id} post={post} />)
        )}
      </div>
    </div>
  );
};

export default HomePage;
