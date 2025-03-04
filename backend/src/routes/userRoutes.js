const express = require("express");
const { authenticate } = require("../middleware/authMiddleware");
const {
  getUserProfile,
  getUserStats,
  followUser,
  getFollowers,
  getFollowing,
  searchUsers, 
} = require("../controllers/userController");

const router = express.Router();

router.get("/search", authenticate, searchUsers);
router.get("/:userId", authenticate, getUserProfile);
router.get("/:userId/stats", authenticate, getUserStats);
router.post("/follow/:userId", authenticate, followUser);
router.get("/:userId/followers", authenticate, getFollowers);
router.get("/:userId/following", authenticate, getFollowing);

module.exports = router;
