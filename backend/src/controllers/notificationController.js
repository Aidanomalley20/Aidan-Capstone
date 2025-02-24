const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.getNotifications = async (req, res) => {
  try {
    const recipientId = req.user.id;

    const allNotifications = await prisma.notification.findMany();

    const notifications = await prisma.notification.findMany({
      where: { recipientId },
      orderBy: { createdAt: "desc" },
      include: {
        sender: {
          select: { id: true, username: true, profilePicture: true },
        },
      },
    });

    res.json(notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
};

exports.markNotificationRead = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await prisma.notification.update({
      where: { id: Number(id) },
      data: { read: true },
    });

    res.json(notification);
  } catch (error) {
    console.error("Error marking notification read:", error);
    res.status(500).json({ error: "Failed to mark notification as read" });
  }
};

exports.createNotification = async (req, res) => {
  try {
    const { recipientId, senderId, type, postId, messageId } = req.body;

    if (!recipientId || !type) {
      return res
        .status(400)
        .json({ error: "Recipient ID and type are required." });
    }

    const notification = await prisma.notification.create({
      data: {
        recipientId,
        senderId,
        type,
        postId,
        messageId,
      },
    });

    res.status(201).json(notification);
  } catch (error) {
    console.error("Error creating notification:", error);
    res.status(500).json({ error: "Failed to create notification" });
  }
};
