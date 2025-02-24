const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.sendMessage = async (req, res) => {
  try {
    let { receiverId, content } = req.body;
    const senderId = req.user.id;

    if (!receiverId || !content) {
      return res
        .status(400)
        .json({ error: "Receiver and content are required." });
    }

    receiverId = Number(receiverId);
    if (receiverId === senderId) {
      return res
        .status(400)
        .json({ error: "You cannot send messages to yourself." });
    }

    const message = await prisma.message.create({
      data: { senderId, receiverId, content },
    });

    res.status(201).json(message);
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ error: "Failed to send message" });
  }
};

exports.getConversations = async (req, res) => {
  try {
    const userId = req.user.id;

    const messages = await prisma.message.findMany({
      where: {
        OR: [{ senderId: userId }, { receiverId: userId }],
      },
      orderBy: { createdAt: "desc" },
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            profilePicture: true,
            firstName: true,
          },
        },
        receiver: {
          select: {
            id: true,
            username: true,
            profilePicture: true,
            firstName: true,
          },
        },
      },
    });

    let conversationSet = new Set();
    let conversations = [];

    messages.forEach((msg) => {
      let otherUser = msg.senderId === userId ? msg.receiver : msg.sender;

      if (!conversationSet.has(otherUser.id)) {
        conversationSet.add(otherUser.id);
        conversations.push({
          id: otherUser.id,
          username: otherUser.username,
          profilePicture: otherUser.profilePicture
            ? `http://localhost:5000${otherUser.profilePicture}`
            : null,
          firstName: otherUser.firstName,
        });
      }
    });

    res.json(conversations);
  } catch (error) {
    console.error("Error fetching conversations:", error);
    res.status(500).json({ error: "Failed to fetch conversations" });
  }
};

exports.getConversation = async (req, res) => {
  try {
    const userId = req.user.id;
    let { otherUserId } = req.params;

    otherUserId = Number(otherUserId);
    if (isNaN(otherUserId)) {
      console.error("❌ Invalid otherUserId:", otherUserId);
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId, receiverId: otherUserId },
          { senderId: otherUserId, receiverId: userId },
        ],
      },
      orderBy: { createdAt: "asc" },
    });

    res.json(messages);
  } catch (error) {
    console.error("Error fetching conversation:", error);
    res.status(500).json({ error: "Failed to fetch conversation" });
  }
};

exports.searchUsers = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) return res.status(400).json({ error: "Query required" });

    const users = await prisma.user.findMany({
      where: {
        OR: [
          { username: { contains: query, mode: "insensitive" } },
          { email: { contains: query, mode: "insensitive" } },
        ],
      },
      select: {
        id: true,
        username: true,
        profilePicture: true,
        firstName: true,
      },
      take: 10,
    });

    res.json(users);
  } catch (error) {
    console.error("❌ Error searching users:", error);
    res.status(500).json({ error: "Failed to search users" });
  }
};

exports.deleteConversation = async (req, res) => {
  const { conversationId } = req.params;
  const userId = req.user.id;

  try {
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId, receiverId: Number(conversationId) },
          { senderId: Number(conversationId), receiverId: userId },
        ],
      },
    });

    if (messages.length === 0) {
      return res.status(404).json({ error: "Conversation not found." });
    }

    await prisma.message.deleteMany({
      where: {
        OR: [
          { senderId: userId, receiverId: Number(conversationId) },
          { senderId: Number(conversationId), receiverId: userId },
        ],
      },
    });

    res.json({ message: "Conversation deleted successfully." });
  } catch (error) {
    console.error("Error deleting conversation:", error);
    res.status(500).json({ error: "Failed to delete conversation." });
  }
};
