import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

export const fetchPosts = createAsyncThunk("posts/fetchPosts", async () => {
  const response = await api.get("/posts");
  return response.data || [];
});

export const toggleLike = createAsyncThunk(
  "posts/toggleLike",
  async (postId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return rejectWithValue("No token found, please log in.");
      }

      const response = await api.post(
        `/posts/${postId}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      return response.data;
    } catch (error) {
      console.error(
        "Failed to like post:",
        error.response?.data || error.message
      );
      return rejectWithValue(error.response?.data || "Failed to like post");
    }
  }
);

const postSlice = createSlice({
  name: "posts",
  initialState: { items: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchPosts.rejected, (state) => {
        state.loading = false;
        state.items = [];
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.items = state.items.filter((post) => post.id !== action.payload);
      })
      .addCase(toggleLike.fulfilled, (state, action) => {
        console.log("✅ Like API Response:", action.payload);

        state.items = state.items.map((post) =>
          post.id === action.payload.id
            ? {
                ...post,
                likedByUser: action.payload.likedByUser,
                likes: action.payload.likes,
              }
            : post
        );

        console.log("🔥 Updated Redux State:", state.items);
      });
  },
});
export const deletePost = createAsyncThunk(
  "posts/deletePost",
  async (postId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return rejectWithValue("No token found, please log in.");

      await api.delete(`/posts/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return postId;
    } catch (error) {
      console.error("Failed to delete post:", error);
      return rejectWithValue("Failed to delete post");
    }
  }
);
export default postSlice.reducer;
