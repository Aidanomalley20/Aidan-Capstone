import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import ProfilePage from "../pages/ProfilePage";
import RegisterPage from "../pages/RegisterPage";
import SettingsPage from "../pages/SettingsPage";
import CreatePost from "../pages/CreatePost";
import PostDetailPage from "../pages/PostDetailPage";
import UserProfilePage from "../pages/UserProfilePage";

const AppRoutes = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <Routes>
      {!user ? (
        <>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </>
      ) : (
        <>
          <Route path="/" element={<HomePage />} />
          <Route path="/profile" element={<ProfilePage />} />{" "}
          <Route path="/profile/:userId" element={<UserProfilePage />} />{" "}
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/post/:postId" element={<PostDetailPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />{" "}
        </>
      )}
    </Routes>
  );
};

export default AppRoutes;
