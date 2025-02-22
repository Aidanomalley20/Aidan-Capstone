import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchConversation, sendMessage } from "../redux/slices/messagesSlice";
import { useParams } from "react-router-dom";

const MessagesPage = () => {
  const { otherUserId } = useParams();
  const dispatch = useDispatch();
  const { conversation, loading, error } = useSelector(
    (state) => state.messages
  );
  const [messageContent, setMessageContent] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (otherUserId) {
      const numericOtherUserId = Number(otherUserId);
      if (!isNaN(numericOtherUserId)) {
        console.log(`🔍 Fetching chat with user: ${numericOtherUserId}`);
        dispatch(fetchConversation(numericOtherUserId));
      } else {
        console.error("❌ Invalid otherUserId:", otherUserId);
      }
    }
  }, [dispatch, otherUserId]);

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
    <div className="min-h-screen flex flex-col p-4 bg-gray-100">
      <h2 className="text-2xl font-bold mb-4">Chat</h2>

      {error && <p className="text-red-500">{error}</p>}

      <div className="flex-grow overflow-y-auto bg-white p-4 rounded-lg shadow-md">
        {loading ? (
          <p>Loading messages...</p>
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
                className={`p-2 max-w-xs rounded-lg shadow-md ${
                  msg.senderId === Number(otherUserId)
                    ? "bg-gray-300 text-black"
                    : "bg-blue-500 text-white"
                }`}
              >
                <p>{msg.content}</p>
                <span className="text-xs text-gray-600 block mt-1">
                  {new Date(msg.createdAt).toLocaleString()}
                </span>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">
            No messages yet. Start the conversation!
          </p>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex space-x-2 mt-4">
        <input
          type="text"
          value={messageContent}
          onChange={(e) => setMessageContent(e.target.value)}
          placeholder="Type your message..."
          className="border p-2 flex-grow rounded-lg"
        />
        <button
          onClick={handleSend}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default MessagesPage;
