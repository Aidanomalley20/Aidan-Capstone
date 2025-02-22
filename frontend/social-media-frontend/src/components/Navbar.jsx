import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  AiOutlineHome,
  AiOutlineSearch,
  AiOutlineMessage,
  AiOutlineBell,
  AiOutlineUser,
} from "react-icons/ai";
import { fetchNotifications } from "../redux/slices/notificationsSlice";
import { fetchConversations } from "../redux/slices/messagesSlice";

const Navbar = () => {
  const dispatch = useDispatch();
  const { notifications } = useSelector((state) => state.notifications);
  const { conversations } = useSelector((state) => state.messages);
  const { token } = useSelector((state) => state.auth);

  const [unreadMessages, setUnreadMessages] = useState(0);
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  useEffect(() => {
    if (token) {
      dispatch(fetchNotifications());
      dispatch(fetchConversations());
    }
  }, [dispatch, token]);

  useEffect(() => {
    if (Array.isArray(notifications)) {
      const unread = notifications.filter(
        (notification) => !notification.read
      ).length;
      setUnreadNotifications(unread);
    } else {
      setUnreadNotifications(0);
    }
  }, [notifications]);

  useEffect(() => {
    if (Array.isArray(conversations)) {
      setUnreadMessages(conversations.length);
    } else {
      setUnreadMessages(0);
    }
  }, [conversations]);

  return (
    <>
      <nav className="bg-white shadow-md fixed top-0 w-full z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-indigo-600">
            <NavLink to="/">SocialApp</NavLink>
          </h1>

          <div className="flex space-x-8 text-gray-600 text-3xl">
            <NavLink to="/" className="relative group hover:text-indigo-600">
              <AiOutlineHome />
            </NavLink>

            <NavLink
              to="/search"
              className="relative group hover:text-indigo-600"
            >
              <AiOutlineSearch />
            </NavLink>

            <NavLink
              to="/messages"
              className="relative group hover:text-indigo-600"
            >
              <AiOutlineMessage />
              {unreadMessages > 0 && (
                <span className="absolute -top-1 -right-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  {unreadMessages}
                </span>
              )}
            </NavLink>

            <NavLink
              to="/notifications"
              className="relative group hover:text-indigo-600"
            >
              <AiOutlineBell />
              {unreadNotifications > 0 && (
                <span className="absolute -top-1 -right-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  {unreadNotifications}
                </span>
              )}
            </NavLink>

            <NavLink
              to="/profile"
              className="relative group hover:text-indigo-600"
            >
              <AiOutlineUser />
            </NavLink>
          </div>
        </div>
      </nav>

      <div className="mt-20"></div>
    </>
  );
};

export default Navbar;
