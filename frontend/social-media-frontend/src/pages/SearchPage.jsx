import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const SearchPage = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("You need to be logged in to search.");
        setLoading(false);
        return;
      }

      const response = await api.get(`/users/search?query=${query}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setResults(response.data);
    } catch (err) {
      console.error("Search error:", err);
      setError(err.response?.data?.error || "Failed to fetch search results.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-white px-6 py-10">
      <h1 className="text-5xl font-semibold mb-10">Search Users</h1>

      {results.length > 0 && (
        <div className="w-full max-w-2xl flex flex-col items-center mb-6">
          {results.map((user) => (
            <div
              key={user.id}
              className="bg-gray-800 p-6 rounded-xl shadow-lg flex flex-col items-center text-center w-full max-w-sm cursor-pointer hover:bg-gray-700 transition"
              onClick={() => navigate(`/profile/${user.id}`)}
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

      <form
        onSubmit={handleSearch}
        className="w-full max-w-2xl bg-gray-800 p-4 rounded-lg flex items-center border border-gray-600"
      >
        <input
          type="text"
          className="flex-1 p-4 text-lg rounded-lg bg-transparent border-none text-white placeholder-gray-400 focus:outline-none"
          placeholder="Search for users..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          type="submit"
          className="px-6 py-4 bg-indigo-500 hover:bg-indigo-600 rounded-lg text-white font-bold text-xl transition"
        >
          Search
        </button>
      </form>

      {loading && <p className="mt-6 text-gray-400 text-lg">Searching...</p>}
      {error && <p className="mt-6 text-red-500 text-lg">{error}</p>}
    </div>
  );
};

export default SearchPage;
