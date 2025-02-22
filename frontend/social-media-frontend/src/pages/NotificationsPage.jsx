import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchNotifications,
  markNotificationRead,
} from "../redux/slices/notificationsSlice";
import { Link } from "react-router-dom";
import { AiOutlineHeart, AiOutlineUserAdd } from "react-icons/ai";

const NotificationsPage = () => {
  const dispatch = useDispatch();
  const { notifications, loading } = useSelector(
    (state) => state.notifications
  );

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  const notificationsArray = Array.isArray(notifications) ? notifications : [];

  const handleMarkRead = (id) => {
    dispatch(markNotificationRead(id));
  };

  return (
    <div className="min-h-screen p-4 bg-gray-100">
      <h2 className="text-2xl font-bold mb-4">Notifications</h2>
      <div className="bg-white p-4 rounded-lg shadow-md">
        {loading ? (
          <p>Loading notifications...</p>
        ) : notificationsArray.length === 0 ? (
          <p>No notifications.</p>
        ) : (
          notificationsArray.map((notification) => (
            <div
              key={notification.id}
              className={`flex items-center p-4 mb-2 rounded-lg shadow-sm ${
                notification.read ? "bg-gray-200" : "bg-white"
              }`}
            >
              {notification.type === "like" ? (
                <AiOutlineHeart className="text-red-500 text-2xl mr-2" />
              ) : (
                <AiOutlineUserAdd className="text-blue-500 text-2xl mr-2" />
              )}
              <div>
                <p className="text-md">
                  {notification.type === "like"
                    ? `User ${notification.senderId} liked your post`
                    : `User ${notification.senderId} followed you`}
                </p>
                {notification.postId && (
                  <Link
                    to={`/post/${notification.postId}`}
                    className="text-blue-500 underline"
                  >
                    View Post
                  </Link>
                )}
                <span className="text-xs text-gray-600 block">
                  {new Date(notification.createdAt).toLocaleString()}
                </span>
              </div>
              {!notification.read && (
                <button
                  onClick={() => handleMarkRead(notification.id)}
                  className="ml-auto bg-blue-500 text-white px-3 py-1 rounded-lg"
                >
                  Mark as Read
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
