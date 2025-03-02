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
    <div className="min-h-screen flex flex-col items-center text-white px-4 py-6">
      <h1 className="text-3xl font-bold mb-6">📩 Messages</h1>

      <form onSubmit={handleSearch} className="w-full max-w-md flex space-x-2">
        <input
          type="text"
          className="w-full p-3 rounded bg-gray-800 border border-gray-600 text-white focus:ring focus:ring-indigo-500"
          placeholder="Search for users..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button
          type="submit"
          className="px-6 py-3 bg-indigo-500 hover:bg-indigo-600 rounded text-white font-semibold transition"
        >
          Search
        </button>
      </form>

      {loading && <p className="mt-4 text-gray-400">Searching...</p>}
      {error && <p className="mt-4 text-red-500">{error}</p>}

      <div className="mt-6 w-full max-w-md">
        {searchResults.length > 0 && (
          <div className="grid grid-cols-1 gap-4">
            {searchResults.map((user) => (
              <div
                key={user.id}
                className="flex items-center p-4 bg-gray-900 rounded-lg shadow-md border border-gray-700 cursor-pointer hover:bg-gray-800 transition"
                onClick={() => navigate(`/messages/${user.id}`)}
              >
                <div className="w-12 h-12 rounded-full overflow-hidden border border-gray-500">
                  {user.profilePicture ? (
                    <img
                      src={`http://localhost:5000${user.profilePicture}`}
                      alt="User Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-500 flex items-center justify-center text-xl font-bold">
                      {user.username[0]}
                    </div>
                  )}
                </div>
                <div className="ml-4">
                  <h2 className="text-lg font-bold text-indigo-400">
                    @{user.username}
                  </h2>
                  <p className="text-gray-300">{user.firstName}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        <h3 className="text-xl font-bold mt-6">💬 Your Conversations</h3>
        {conversations.length === 0 ? (
          <p className="text-gray-400">No conversations yet.</p>
        ) : (
          conversations.map((conv) => (
            <div
              key={conv.id}
              className="flex items-center p-4 bg-gray-900 rounded-lg shadow-md border border-gray-700 cursor-pointer hover:bg-gray-800 transition"
              onClick={() => navigate(`/messages/${conv.id}`)}
            >
              <div className="w-12 h-12 rounded-full overflow-hidden border border-gray-500">
                {conv.profilePicture ? (
                  <img
                    src={conv.profilePicture}
                    alt="User Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-500 flex items-center justify-center text-xl font-bold">
                    {conv.username[0]}
                  </div>
                )}
              </div>
              <div className="ml-4 flex-1">
                <h2 className="text-lg font-bold text-indigo-400">
                  @{conv.username}
                </h2>
                <p className="text-gray-300">{conv.firstName}</p>
              </div>
              <button
                onClick={() => handleDeleteConversation(conv.id)}
                className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-700 transition"
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MessagesListPage;
