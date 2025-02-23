const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  console.log("🔹 Incoming Request Headers:", req.headers);

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.error("❌ Missing or invalid Authorization header:", authHeader);
    return res.status(401).json({ error: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    console.log("🔹 Decoding token:", token);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("✅ Token successfully decoded:", decoded);

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user) {
      console.error("❌ Token valid but user not found in DB:", decoded);
      return res.status(401).json({ error: "Invalid token: User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("❌ JWT verification failed:", error.message);
    return res.status(401).json({ error: "Invalid token" });
  }
};
