import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";

const MessagesListPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const reduxToken = useSelector((state) => state.auth?.user?.token);
  const token = reduxToken || sessionStorage.getItem("token");

  useEffect(() => {
    const fetchConversations = async () => {
      if (!token) {
        console.error("🚨 No token available for fetching conversations.");
        return;
      }

      try {
        console.log("🔍 Fetching conversations...");
        const response = await axios.get("/api/messages", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setConversations(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("❌ Error fetching conversations:", error);
        setConversations([]);
      }
    };

    fetchConversations();
  }, [token]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setLoading(true);
    setError(null);
    console.log("Searching for:", searchQuery);

    try {
      const token = sessionStorage.getItem("token");
      if (!token) {
        setError("You need to be logged in to search.");
        setLoading(false);
        return;
      }

      const response = await axios.get(
        `/api/users/search?query=${searchQuery}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setSearchResults(response.data);
    } catch (err) {
      console.error("Search error:", err);
      setError("Failed to fetch search results.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-4 bg-gray-100">
      <h2 className="text-2xl font-bold mb-4">Messages</h2>

      <form onSubmit={handleSearch} className="mb-4">
        <input
          type="text"
          placeholder="Search for users..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border p-2 rounded-lg w-full"
        />
        <button
          type="submit"
          className="mt-2 bg-blue-500 text-white p-2 rounded-lg w-full"
        >
          Search
        </button>
      </form>

      {loading && <p>Searching...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {searchResults.length > 0 && (
        <div className="bg-white p-4 rounded-lg shadow-md mb-4">
          <h3 className="text-lg font-semibold mb-2">Search Results</h3>
          {searchResults.map((user) => (
            <Link
              key={user.id}
              to={`/messages/${user.id}`}
              className="flex items-center p-3 border-b hover:bg-gray-200"
            >
              <img
                src={
                  user.profilePicture
                    ? `http://localhost:5000${user.profilePicture}`
                    : "/default-avatar.png"
                }
                onError={(e) => (e.target.src = "/default-avatar.png")}
                alt={user.username}
                className="w-10 h-10 rounded-full object-cover mr-3"
              />

              <p className="text-lg">@{user.username}</p>
            </Link>
          ))}
        </div>
      )}

      <div className="bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-2">Your Conversations</h3>
        {conversations.length === 0 ? (
          <p>No conversations yet.</p>
        ) : (
          conversations.map((conv) => (
            <Link
              key={conv.id}
              to={`/messages/${conv.id}`}
              className="flex items-center p-3 border-b hover:bg-gray-200"
            >
              {conv.profilePicture ? (
                <img
                  src={conv.profilePicture}
                  onError={(e) => {
                    console.error("❌ Image failed to load:", e.target.src);
                    e.target.src = "/default-avatar.png";
                  }}
                  alt={conv.username}
                  className="w-10 h-10 rounded-full object-cover mr-3"
                />
              ) : (
                <div className="w-10 h-10 flex items-center justify-center bg-gray-300 text-gray-700 font-bold rounded-full">
                  {conv.firstName ? conv.firstName[0].toUpperCase() : "?"}
                </div>
              )}

              <p className="text-lg">@{conv.username}</p>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default MessagesListPage;
