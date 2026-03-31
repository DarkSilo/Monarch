const jwt = require("jsonwebtoken");

function resolveJwtSecret() {
  return process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET;
}

const verifyAdmin = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const secret = resolveJwtSecret();
    if (!secret) {
      return res.status(500).json({ message: "Server authentication configuration is invalid" });
    }

    const decoded = jwt.verify(token, secret);

    if (decoded.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    req.user = {
      ...decoded,
      userId: decoded.sub || decoded.userId || decoded.id || decoded.customerId,
      role: decoded.role,
    };
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = { verifyAdmin };
