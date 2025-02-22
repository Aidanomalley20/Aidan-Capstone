import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import postReducer from "./slices/postSlice";
import messagesReducer from "./slices/messagesSlice";
import notificationsReducer from "./slices/notificationsSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    posts: postReducer,
    messages: messagesReducer,
    notifications: notificationsReducer,
  },
});

export default store;
