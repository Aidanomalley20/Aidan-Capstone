import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const getAuthToken = (getState) => {
  let token = getState().auth?.token || sessionStorage.getItem("token");
  if (!token) {
    console.error("🚨 No token found in Redux or sessionStorage!");
  }
  return token;
};

export const fetchConversations = createAsyncThunk(
  "messages/fetchConversations",
  async (_, { rejectWithValue, getState }) => {
    try {
      const token = getAuthToken(getState);
      if (!token) return rejectWithValue("No token available");

      console.log("🔍 Fetching conversations with token:", token);
      const response = await axios.get(`${API_URL}/messages`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return response.data;
    } catch (error) {
      console.error("❌ Error fetching conversations:", error);
      return rejectWithValue(
        error.response?.data || "Error fetching conversations"
      );
    }
  }
);

export const fetchConversation = createAsyncThunk(
  "messages/fetchConversation",
  async (otherUserId, { rejectWithValue, getState }) => {
    try {
      const token = getAuthToken(getState);
      if (!token) throw new Error("No token found");

      console.log(`🔍 Fetching conversation with user ${otherUserId}...`);
      const response = await axios.get(`${API_URL}/messages/${otherUserId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("✅ Conversation fetched successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error fetching conversation:", error);
      return rejectWithValue(
        error.response?.data || "Failed to fetch conversation"
      );
    }
  }
);

export const sendMessage = createAsyncThunk(
  "messages/sendMessage",
  async ({ receiverId, content }, { rejectWithValue, getState }) => {
    try {
      const token = getAuthToken(getState);
      if (!token) throw new Error("No token found");

      const response = await axios.post(
        `${API_URL}/messages`,
        { receiverId, content },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error sending message");
    }
  }
);

const messagesSlice = createSlice({
  name: "messages",
  initialState: {
    conversations: [],
    conversation: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchConversations.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchConversations.fulfilled, (state, action) => {
        state.loading = false;
        state.conversations = action.payload;
      })
      .addCase(fetchConversations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchConversation.fulfilled, (state, action) => {
        state.conversation = action.payload;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.conversation.push(action.payload);
      });
  },
});

export default messagesSlice.reducer;
