const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

exports.createPost = async (req, res) => {
  const { content, image } = req.body;
  const userId = req.user.id;

  try {
    const post = await prisma.post.create({
      data: { content, image, userId },
    });
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ error: "Failed to create post" });
  }
};

exports.getPosts = async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      include: { user: true },
    });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch posts" });
  }
};
