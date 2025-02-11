const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

exports.createPost = async (req, res) => {
  const { content } = req.body;
  const userId = req.user.id;
  const image = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    const post = await prisma.post.create({
      data: { content, image, userId },
    });
    res.status(201).json(post);
  } catch (error) {
    console.error("Failed to create post:", error);
    res.status(500).json({ error: "Failed to create post" });
  }
};

exports.getPosts = async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      include: {
        user: {
          select: { id: true, username: true, firstName: true, lastName: true },
        },
      },
    });
    res.json(posts);
  } catch (error) {
    console.error("Failed to fetch posts:", error);
    res.status(500).json({ error: "Failed to fetch posts" });
  }
};

exports.getMyPosts = async (req, res) => {
  try {
    const userId = req.user.id;

    const posts = await prisma.post.findMany({
      where: { userId: userId },
      select: {
        id: true,
        content: true,
        image: true,
        createdAt: true,
      },
    });

    res.json(posts);
  } catch (error) {
    console.error("Failed to fetch user posts:", error);
    res.status(500).json({ error: "Failed to fetch user posts" });
  }
};
exports.getPostById = async (req, res) => {
  const { postId } = req.params;
  const userId = req.user.id;

  try {
    if (!postId || isNaN(postId)) {
      return res.status(400).json({ error: "Invalid post ID" });
    }

    const post = await prisma.post.findUnique({
      where: { id: Number(postId) },
      include: {
        user: { select: { id: true, username: true } },
        comments: {
          include: {
            user: { select: { id: true, username: true } },
          },
        },
        likes: {
          select: { userId: true },
        },
      },
    });

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const likedByUser = post.likes.some((like) => like.userId === userId);
    res.json({ ...post, likedByUser, likes: post.likes.length });
  } catch (error) {
    console.error("⚠️ Failed to fetch post:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.likePost = async (req, res) => {
  const { postId } = req.params;
  const userId = req.user.id;

  try {
    const existingLike = await prisma.like.findFirst({
      where: { postId: Number(postId), userId: userId },
    });

    if (existingLike) {
      await prisma.like.delete({
        where: { id: existingLike.id },
      });
      return res.json({ message: "Post unliked" });
    } else {
      await prisma.like.create({
        data: { postId: Number(postId), userId: userId },
      });
      return res.json({ message: "Post liked" });
    }
  } catch (error) {
    console.error("Failed to like post:", error);
    res.status(500).json({ error: "Failed to like post" });
  }
};
exports.commentOnPost = async (req, res) => {
  const { postId } = req.params;
  const { text } = req.body;
  const userId = req.user.id;

  if (!text.trim()) {
    return res.status(400).json({ error: "Comment cannot be empty" });
  }

  try {
    const post = await prisma.post.findUnique({
      where: { id: Number(postId) },
    });

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const comment = await prisma.comment.create({
      data: {
        postId: Number(postId),
        text,
        userId,
      },
      include: {
        user: { select: { id: true, username: true } },
      },
    });

    res.status(201).json(comment);
  } catch (error) {
    console.error("Failed to add comment:", error);
    res.status(500).json({ error: "Failed to add comment" });
  }
};

exports.deletePost = async (req, res) => {
  const { postId } = req.params;
  const userId = req.user.id;

  try {
    const post = await prisma.post.findUnique({
      where: { id: Number(postId) },
    });

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (post.userId !== userId) {
      return res
        .status(403)
        .json({ error: "Unauthorized to delete this post" });
    }

    await prisma.post.delete({
      where: { id: Number(postId) },
    });

    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Failed to delete post:", error);
    res.status(500).json({ error: "Failed to delete post" });
  }
};
