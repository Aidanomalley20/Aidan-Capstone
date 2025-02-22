const jwt = require("jsonwebtoken");

exports.authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.error("🚨 No token found in headers!");
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    console.error("🚨 Token is missing after 'Bearer'");
    return res.status(401).json({ error: "Token missing." });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    console.log("✅ User authenticated:", verified);
    next();
  } catch (error) {
    console.error("❌ Invalid token:", error.message);
    return res.status(401).json({ error: "Invalid or expired token." });
  }
};
