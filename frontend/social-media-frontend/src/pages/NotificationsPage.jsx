import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchNotifications } from "../redux/slices/notificationsSlice";
import { Link } from "react-router-dom";
import {
  AiOutlineHeart,
  AiOutlineUserAdd,
  AiOutlineMessage,
  AiOutlineComment,
} from "react-icons/ai";

const NotificationsPage = () => {
  const dispatch = useDispatch();
  const { notifications, loading } = useSelector(
    (state) => state.notifications
  );

  useEffect(() => {
    dispatch(fetchNotifications()).then((res) => {
      console.log("📩 Notifications Received:", res.payload);
    });
  }, [dispatch]);

  const notificationsArray = Array.isArray(notifications) ? notifications : [];
  const getNotificationIcon = (type) => {
    switch (type) {
      case "like":
        return <AiOutlineHeart className="text-red-500 text-xl" />;
      case "follow":
        return <AiOutlineUserAdd className="text-blue-500 text-xl" />;
      case "comment":
        return <AiOutlineComment className="text-green-500 text-xl" />;
      case "message":
        return <AiOutlineMessage className="text-purple-500 text-xl" />;
      default:
        return null;
    }
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
              <div className="mr-3">
                {getNotificationIcon(notification.type)}
              </div>

              {notification.sender?.profilePicture ? (
                <img
                  src={`http://localhost:5000${notification.sender.profilePicture}`}
                  onError={(e) => {
                    console.error("❌ Image failed to load:", e.target.src);
                    e.target.src = "/default-avatar.png";
                  }}
                  alt={notification.sender?.username || "User"}
                  className="w-10 h-10 rounded-full object-cover mr-3"
                />
              ) : (
                <div className="w-10 h-10 flex items-center justify-center bg-gray-300 text-gray-700 font-bold rounded-full">
                  {notification.sender?.firstName
                    ? notification.sender.firstName[0].toUpperCase()
                    : notification.sender?.username
                    ? notification.sender.username[0].toUpperCase()
                    : "?"}
                </div>
              )}

              <div>
                <p className="text-md font-semibold">
                  {notification.sender?.username || "User"}
                </p>
                <p className="text-sm text-gray-700">
                  {notification.type === "like"
                    ? "liked your post"
                    : notification.type === "follow"
                    ? "started following you"
                    : notification.type === "comment"
                    ? "commented on your post"
                    : "sent you a message"}
                </p>
                {notification.postId && (
                  <Link
                    to={`/post/${notification.postId}`}
                    className="text-blue-500 underline"
                  >
                    View Post
                  </Link>
                )}
                {notification.messageId && (
                  <Link to={`/messages`} className="text-blue-500 underline">
                    View Message
                  </Link>
                )}
                <span className="text-xs text-gray-600 block">
                  {new Date(notification.createdAt).toLocaleString()}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
