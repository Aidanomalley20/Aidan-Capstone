const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

exports.getUserProfile = async (req, res) => {
  const { userId } = req.params;
  const currentUserId = req.user?.id;

  if (!userId || isNaN(userId)) {
    console.error("Invalid user ID:", userId);
    return res.status(400).json({ error: "Invalid user ID" });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: Number(userId) },
      select: {
        id: true,
        username: true,
        firstName: true,
        lastName: true,
        bio: true,
        profilePicture: true,
      },
    });

    if (!user) {
      console.error(`User with ID ${userId} not found.`);
      return res.status(404).json({ error: "User not found" });
    }

    const isFollowing = await prisma.follow.findFirst({
      where: { followerId: Number(currentUserId), followingId: Number(userId) },
    });

    res.json({
      ...user,
      isFollowing: !!isFollowing,
      profilePicture: user.profilePicture
        ? `/uploads/${user.profilePicture.replace("uploads/", "")}`
        : null, 
    });
  } catch (error) {
    console.error("Failed to fetch user profile:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getUserStats = async (req, res) => {
  const { userId } = req.params;

  try {
    const followers = await prisma.follow.count({
      where: { followingId: Number(userId) },
    });
    const following = await prisma.follow.count({
      where: { followerId: Number(userId) },
    });
    const posts = await prisma.post.count({
      where: { userId: Number(userId) },
    });

    res.json({ followers, following, posts });
  } catch (error) {
    console.error("Failed to fetch stats:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.followUser = async (req, res) => {
  const { userId } = req.params;
  const currentUserId = req.user.id;

  if (Number(userId) === currentUserId) {
    return res.status(400).json({ error: "You cannot follow yourself" });
  }

  try {
    const existingFollow = await prisma.follow.findFirst({
      where: { followerId: currentUserId, followingId: Number(userId) },
    });

    if (existingFollow) {
      await prisma.follow.delete({ where: { id: existingFollow.id } });
      return res.json({ message: "Unfollowed user", isFollowing: false });
    } else {
      await prisma.follow.create({
        data: { followerId: currentUserId, followingId: Number(userId) },
      });
      return res.json({ message: "Followed user", isFollowing: true });
    }
  } catch (error) {
    console.error("Failed to follow/unfollow:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getFollowers = async (req, res) => {
  const { userId } = req.params;

  try {
    const followers = await prisma.follow.findMany({
      where: { followingId: Number(userId) },
      include: { follower: { select: { id: true, username: true } } },
    });

    res.json(followers.map((f) => f.follower));
  } catch (error) {
    console.error("Failed to fetch followers:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getFollowing = async (req, res) => {
  const { userId } = req.params;

  try {
    const following = await prisma.follow.findMany({
      where: { followerId: Number(userId) },
      include: { following: { select: { id: true, username: true } } },
    });

    res.json(following.map((f) => f.following));
  } catch (error) {
    console.error("Failed to fetch following:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
exports.searchUsers = async (req, res) => {
  try {
    const query = req.query.query;
    if (!query) {
      return res.status(400).json({ error: "Search query is required." });
    }

    const users = await prisma.user.findMany({
      where: {
        OR: [
          { username: { contains: query, mode: "insensitive" } },
          { firstName: { contains: query, mode: "insensitive" } },
          { lastName: { contains: query, mode: "insensitive" } },
        ],
      },
      select: { id: true, username: true, profilePicture: true },
    });

    console.log("Backend Search Results:", users); 
    res.json(users);
  } catch (error) {
    console.error("Error searching users:", error);
    res.status(500).json({ error: "Failed to search users" });
  }
};
