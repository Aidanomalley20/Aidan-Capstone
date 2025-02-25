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

    try {
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

  const handleDeleteConversation = async (conversationId) => {
    if (!window.confirm("Are you sure you want to delete this conversation?")) {
      return;
    }

    try {
      await axios.delete(`/api/messages/${conversationId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setConversations((prevConversations) =>
        prevConversations.filter((conv) => conv.id !== conversationId)
      );
    } catch (error) {
      console.error("❌ Error deleting conversation:", error);
      alert("Failed to delete conversation.");
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-900 text-white flex flex-col items-center">
      <h1 className="text-5xl font-semibold mb-8">Messages</h1>

      <form
        onSubmit={handleSearch}
        className="w-full max-w-2xl bg-gray-800 p-4 rounded-lg flex items-center border border-gray-700 mb-8"
      >
        <input
          type="text"
          className="flex-1 p-4 text-lg rounded-lg bg-transparent border-none text-white placeholder-gray-400 focus:outline-none"
          placeholder="Search for users..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button
          type="submit"
          className="px-6 py-3 bg-indigo-500 hover:bg-indigo-600 rounded-lg text-white font-bold text-xl transition"
        >
          Search
        </button>
      </form>

      {loading && <p className="text-gray-400">Searching...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {searchResults.length > 0 && (
        <div className="w-full max-w-2xl flex flex-col items-center mb-8">
          {searchResults.map((user) => (
            <div
              key={user.id}
              className="bg-gray-800 p-6 rounded-xl shadow-lg flex flex-col items-center text-center w-full max-w-sm cursor-pointer hover:bg-gray-700 transition"
              onClick={() => navigate(`/messages/${user.id}`)}
            >
              {user.profilePicture ? (
                <img
                  src={`http://localhost:5000${user.profilePicture}`}
                  onError={(e) => {
                    console.error("❌ Image failed to load:", e.target.src);
                    e.target.src = "/default-avatar.png";
                  }}
                  alt={user.username}
                  className="w-20 h-20 rounded-full object-cover border-4 border-indigo-500"
                />
              ) : (
                <div className="w-20 h-20 flex items-center justify-center bg-gray-300 text-gray-700 font-bold rounded-full text-3xl">
                  {user.firstName ? user.firstName[0].toUpperCase() : "?"}
                </div>
              )}

              <p className="text-2xl font-bold mt-3">
                {user.firstName && user.lastName
                  ? `${user.firstName} ${user.lastName}`
                  : "No Name"}
              </p>
              <p className="text-lg text-gray-400">@{user.username}</p>
            </div>
          ))}
        </div>
      )}

      <div className="w-full max-w-2xl bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold mb-4">Your Conversations</h2>
        {conversations.length === 0 ? (
          <p className="text-gray-400">No conversations yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {conversations.map((conv) => (
              <div
                key={conv.id}
                className="bg-gray-700 p-6 rounded-lg shadow-md flex flex-col items-center text-center hover:bg-gray-600 transition"
                onClick={() => navigate(`/messages/${conv.id}`)}
              >
                {conv.profilePicture ? (
                  <img
                    src={`http://localhost:5000${conv.profilePicture}`}
                    onError={(e) => {
                      console.error("❌ Image failed to load:", e.target.src);
                      e.target.src = "/default-avatar.png";
                    }}
                    alt={conv.username}
                    className="w-20 h-20 rounded-full object-cover border-4 border-indigo-500"
                  />
                ) : (
                  <div className="w-20 h-20 flex items-center justify-center bg-gray-300 text-gray-700 font-bold rounded-full text-3xl">
                    {conv.firstName ? conv.firstName[0].toUpperCase() : "?"}
                  </div>
                )}

                <p className="text-2xl font-bold mt-3">
                  {conv.firstName && conv.lastName
                    ? `${conv.firstName} ${conv.lastName}`
                    : "No Name"}
                </p>
                <p className="text-lg text-gray-400">@{conv.username}</p>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteConversation(conv.id);
                  }}
                  className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                >
                  Delete Chat
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagesListPage;
