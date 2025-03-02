import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../redux/slices/authSlice";

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(loginUser(formData));

    if (result.meta.requestStatus === "fulfilled" && result.payload) {
      localStorage.setItem("token", result.payload.token || "");

      if (result.payload.user) {
        localStorage.setItem("user", JSON.stringify(result.payload.user));
      } else {
        console.error("No user data returned from API.");
      }

      navigate("/");
    } else {
      const errorMessage =
        result.payload?.error || "Login failed. Please check your credentials.";
      setMessage(errorMessage);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1
        className="text-8xl font-light bg-gradient-to-r from-gray-300 via-gray-400 to-gray-500 bg-clip-text text-transparent tracking-wide mb-8"
        style={{ fontFamily: "'Poppins', sans-serif" }}
      >
        Flow
      </h1>
      <div className="backdrop-blur-2xl bg-black/20 border border-gray-400/70 p-8 rounded-xl shadow-xl w-full max-w-md">
        <h1 className="text-3xl font-extrabold text-center text-white mb-8">
          Login
        </h1>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleInputChange}
            className="block w-full p-4 mb-6 bg-transparent border border-gray-300 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            autoComplete="current-password"
            value={formData.password}
            onChange={handleInputChange}
            className="block w-full p-4 mb-6 bg-transparent border border-gray-300 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            required
          />
          <button
            type="submit"
            className="w-full py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-500 transition"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {message && <p className="text-center mt-4 text-red-400">{message}</p>}
        {error && (
          <p className="text-center mt-4 text-red-400">
            {typeof error === "string"
              ? error
              : error?.message || "Login failed. Please try again."}
          </p>
        )}

        <div className="mt-8">
          <button
            onClick={() => navigate("/register")}
            className="w-full py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-500 transition"
          >
            Don’t have an account? Register
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
