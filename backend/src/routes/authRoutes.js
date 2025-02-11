const express = require("express");
const multer = require("multer");
const {
  register,
  login,
  getProfile,
  getStats,
  logout,
  deleteAccount,
  updateProfile,
  getUserById, 
} = require("../controllers/authController");
const { authenticate } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", authenticate, getProfile);
router.get("/stats", authenticate, getStats);
router.post("/logout", authenticate, logout);
router.delete("/delete", authenticate, deleteAccount);


router.get("/users/:userId", authenticate, getUserById);


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

router.put(
  "/update",
  authenticate,
  upload.single("profilePicture"),
  updateProfile
);

module.exports = router;
