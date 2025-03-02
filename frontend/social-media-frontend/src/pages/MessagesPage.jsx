import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchConversation, sendMessage } from "../redux/slices/messagesSlice";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

const MessagesPage = () => {
  const { otherUserId } = useParams();
  const dispatch = useDispatch();
  const { conversation, loading, error } = useSelector(
    (state) => state.messages
  );
  const [messageContent, setMessageContent] = useState("");
  const [otherUser, setOtherUser] = useState(null);
  const messagesEndRef = useRef(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (otherUserId) {
      const numericOtherUserId = Number(otherUserId);
      if (!isNaN(numericOtherUserId)) {
        dispatch(fetchConversation(numericOtherUserId));
        fetchOtherUser(numericOtherUserId);
      } else {
        console.error("❌ Invalid otherUserId:", otherUserId);
      }
    }
  }, [dispatch, otherUserId]);

  const fetchOtherUser = async (userId) => {
    try {
      const response = await axios.get(`/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOtherUser(response.data);
    } catch (error) {
      console.error("❌ Error fetching user details:", error);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation]);

  const handleSend = () => {
    if (messageContent.trim() === "") return;
    dispatch(
      sendMessage({ receiverId: Number(otherUserId), content: messageContent })
    );
    setMessageContent("");
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-4">
      <div className="bg-white shadow-md rounded-lg p-4 w-full max-w-lg flex items-center justify-between mb-4">
        <Link to="/messages" className="text-blue-500 font-semibold">
          &larr; Back
        </Link>
        {otherUser ? (
          <div className="flex items-center">
            {otherUser.profilePicture ? (
              <img
                src={`http://localhost:5000${otherUser.profilePicture}`}
                onError={(e) => (e.target.src = "/default-avatar.png")}
                alt={otherUser.username}
                className="w-10 h-10 rounded-full object-cover mr-3"
              />
            ) : (
              <div className="w-10 h-10 flex items-center justify-center bg-gray-300 text-gray-700 font-bold rounded-full">
                {otherUser.firstName
                  ? otherUser.firstName[0].toUpperCase()
                  : "?"}
              </div>
            )}
            <p className="text-lg font-semibold">@{otherUser.username}</p>
          </div>
        ) : (
          <p className="text-lg font-semibold">Chat</p>
        )}
      </div>

      <div className="flex-grow overflow-y-auto bg-white p-4 w-full max-w-lg rounded-lg shadow-md h-96">
        {loading ? (
          <p className="text-center text-gray-500">Loading messages...</p>
        ) : conversation?.length > 0 ? (
          conversation.map((msg) => (
            <div
              key={msg.id}
              className={`flex mb-2 ${
                msg.senderId === Number(otherUserId)
                  ? "justify-start"
                  : "justify-end"
              }`}
            >
              <div
                className={`p-3 max-w-xs rounded-lg shadow-md ${
                  msg.senderId === Number(otherUserId)
                    ? "bg-gray-300 text-black"
                    : "bg-blue-500 text-white"
                }`}
              >
                <p>{msg.content}</p>
                <span className="text-xs text-gray-600 block mt-1">
                  {new Date(msg.createdAt).toLocaleTimeString()}
                </span>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center">
            No messages yet. Start the conversation!
          </p>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex items-center w-full max-w-lg mt-4 bg-white p-2 rounded-lg shadow-md">
        <input
          type="text"
          value={messageContent}
          onChange={(e) => setMessageContent(e.target.value)}
          placeholder="Type your message..."
          className="border p-2 flex-grow rounded-lg outline-none"
        />
        <button
          onClick={handleSend}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg ml-2"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default MessagesPage;
