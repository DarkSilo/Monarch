const jwt = require("jsonwebtoken");

function resolveJwtSecret() {
  return process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET;
}

function decodeToken(token) {
  const secret = resolveJwtSecret();
  if (!secret) {
    const err = new Error("JWT secret is not configured");
    err.code = "JWT_SECRET_MISSING";
    throw err;
  }
  return jwt.verify(token, secret);
}

const verifyUser = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = decodeToken(token);
    req.user = {
      ...decoded,
      userId: decoded.sub || decoded.userId || decoded.id || decoded.customerId,
      role: decoded.role || "customer",
    };
    next();
  } catch (error) {
    if (error.code === "JWT_SECRET_MISSING") {
      return res.status(500).json({ message: "Server authentication configuration is invalid" });
    }
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = { verifyUser };
