const express = require("express");
const {
  getNotifications,
  markNotificationRead,
  createNotification,
} = require("../controllers/notificationController");
const { authenticate } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", authenticate, getNotifications);
router.patch("/:id", authenticate, markNotificationRead);
router.post("/", authenticate, createNotification);

module.exports = router;
