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
      <h1 className="text-3xl font-bold mb-4">Search Users</h1>

      <form onSubmit={handleSearch} className="w-full max-w-md">
        <input
          type="text"
          className="w-full p-2 rounded bg-gray-800 border border-gray-600 text-white"
          placeholder="Search for users..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          type="submit"
          className="w-full mt-2 p-2 bg-indigo-500 hover:bg-indigo-600 rounded text-white"
        >
          Search
        </button>
      </form>

      {loading && <p className="mt-4 text-gray-400">Searching...</p>}
      {error && <p className="mt-4 text-red-500">{error}</p>}

      <ul className="mt-4 w-full max-w-md">
        {results.length > 0 ? (
          results.map((user) => (
            <li
              key={user.id}
              className="border-b border-gray-600 py-2 cursor-pointer hover:text-indigo-400"
              onClick={() => navigate(`/profile/${user.id}`)}
            >
              @{user.username} - {user.firstName} {user.lastName}
            </li>
          ))
        ) : (
          <p className="mt-4 text-gray-400">
            {query && !loading ? "No users found." : ""}
          </p>
        )}
      </ul>
    </div>
  );
};

export default SearchPage;
