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
      .addCase(toggleLike.fulfilled, (state, action) => {
        const updatedPost = action.payload;
        state.items = state.items.map((post) =>
          post.id === updatedPost.postId
            ? {
                ...post,
                likedByUser: updatedPost.likedByUser,
                likes: updatedPost.likedByUser
                  ? post.likes + 1
                  : post.likes - 1,
              }
            : post
        );
      });
  },
});

export default postSlice.reducer;
