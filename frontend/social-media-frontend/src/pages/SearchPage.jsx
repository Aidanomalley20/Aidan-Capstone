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
    <div className="min-h-screen flex flex-col items-center text-white px-4 py-6">
      <h1 className="text-3xl font-bold mb-6"> Search Users</h1>

      <form onSubmit={handleSearch} className="w-full max-w-md flex space-x-2">
        <input
          type="text"
          className="w-full p-3 rounded bg-gray-800 border border-gray-600 text-white focus:ring focus:ring-indigo-500"
          placeholder="Search for users..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
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
        {results.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {results.map((user) => (
              <div
                key={user.id}
                className="flex items-center p-4 bg-gray-900 rounded-lg shadow-md border border-gray-700 cursor-pointer hover:bg-gray-800 transition"
                onClick={() => navigate(`/profile/${user.id}`)}
              >
                <div className="w-16 h-16 rounded-full overflow-hidden border border-gray-500">
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
                  <p className="text-gray-300">
                    {user.firstName} {user.lastName}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-6 text-gray-400">
            {query && !loading ? "No users found." : ""}
          </p>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
