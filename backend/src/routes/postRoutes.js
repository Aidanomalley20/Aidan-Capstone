const express = require("express");
const {
  createPost,
  getPosts,
  getMyPosts,
  getPostById,
  likePost,
  commentOnPost,
  deletePost,
} = require("../controllers/postController");

const { authenticate } = require("../middleware/authMiddleware");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

const router = express.Router();

router.post("/", authenticate, upload.single("image"), createPost);
router.get("/", getPosts);
router.get("/my-posts", authenticate, getMyPosts);
router.get("/:postId", authenticate, getPostById);
router.post("/:postId/like", authenticate, likePost);
router.post("/:postId/comments", authenticate, commentOnPost);
router.delete("/:postId", authenticate, deletePost);

module.exports = router;
