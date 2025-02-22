const express = require("express");
const {
  sendMessage,
  getConversations,
  getConversation,
  searchUsers,
} = require("../controllers/messageController");
const { authenticate } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authenticate, sendMessage);
router.get("/", authenticate, getConversations);
router.get("/:otherUserId", authenticate, getConversation);
router.get("/users/search", authenticate, searchUsers);

module.exports = router;
