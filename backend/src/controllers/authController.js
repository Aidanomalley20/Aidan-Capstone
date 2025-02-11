const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

const prisma = new PrismaClient();

exports.register = async (req, res) => {
  const { firstName, lastName, email, phone, username, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        phone,
        username,
        password: hashedPassword,
      },
    });
    res.status(201).json(user);
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Failed to register user" });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ error: "User not found" });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword)
      return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        email: user.email,
        phone: user.phone,
        bio: user.bio,
        profilePicture: user.profilePicture,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Login failed" });
  }
};

exports.logout = async (req, res) => {
  try {
    if (!req.headers.authorization) {
      return res.status(401).json({ error: "Unauthorized logout attempt" });
    }

    res.clearCookie("token");
    return res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({ message: "Logout failed" });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        username: true,
        bio: true,
        profilePicture: true,
        createdAt: true,
      },
    });

    if (!user) return res.status(404).json({ error: "User not found" });

    res.json(user);
  } catch (error) {
    console.error("Failed to fetch user profile:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const followers = await prisma.follow.count({
      where: { followingId: userId },
    });
    const following = await prisma.follow.count({
      where: { followerId: userId },
    });

    const posts = await prisma.post.count({ where: { userId: userId } });

    res.json({ followers, following, posts });
  } catch (error) {
    console.error("Failed to fetch user stats:", error);
    res.status(500).json({ error: "Failed to fetch user stats" });
  }
};
exports.deleteAccount = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ message: "User not found" });

    await prisma.user.delete({ where: { id: userId } });

    res.status(200).json({ message: "Account deleted successfully" });
  } catch (error) {
    console.error("Error deleting account:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
exports.updateProfile = async (req, res) => {
  try {
    const { username, email, password, bio } = req.body;
    const userId = req.user.id;

    const updateData = {};

    if (username) updateData.username = username;
    if (email) updateData.email = email;
    if (bio) updateData.bio = bio;

    if (password && password.trim() !== "") {
      console.log("🔄 Hashing new password...");
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password = hashedPassword;
      console.log("✅ NEW Hashed Password:", hashedPassword);
    }

    if (req.file) {
      updateData.profilePicture = `/uploads/${req.file.filename}`;
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    res
      .status(200)
      .json({ message: "Profile updated successfully", updatedUser });
  } catch (error) {
    console.error("❌ Profile update failed:", error);
    res.status(500).json({ message: "Failed to update profile" });
  }
};
exports.getUserById = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: { id: Number(userId) },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        username: true,
        email: true,
        bio: true,
        profilePicture: true,
        createdAt: true,
        posts: {
          select: {
            id: true,
            content: true,
            image: true,
            createdAt: true,
          },
        },
        followers: {
          select: { followerId: true },
        },
        following: {
          select: { followingId: true },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Failed to fetch user profile:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
