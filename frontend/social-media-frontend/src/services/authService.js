import api from "./api";

export const registerUser = async (userData) => {
  try {
    const response = await api.post("/auth/register", userData);

    return response.data;
  } catch (error) {
    console.error(
      "Registration API Error:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const loginUser = async (credentials) => {
  const response = await api.post("/auth/login", credentials);
  return response.data;
};

export const logoutUser = async () => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      console.warn("No token found, logout request skipped.");
      return;
    }

    const response = await api.post(
      "/auth/logout",
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    sessionStorage.setItem("token", response.data.token);
    sessionStorage.setItem("user", JSON.stringify(response.data.user));

    return response.data;
  } catch (error) {
    console.error("Logout error:", error.response?.data || "Unknown error");
    throw error;
  }
};
export const updateProfile = async (userData) => {
  try {
    const token = localStorage.getItem("token");

    const response = await api.put("/auth/update", userData, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data;
  } catch (error) {
    console.error(
      "Profile update failed:",
      error.response?.data || error.message
    );
    throw error;
  }
};
