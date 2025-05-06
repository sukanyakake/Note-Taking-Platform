import jwt from "jsonwebtoken";
import User from "../models/User.js";

const middleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "Access denied. No token provided." });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, "secretkey123@"); // Use env variable in real apps
    if (!decoded?.id) {
      return res.status(403).json({ success: false, message: "Invalid token payload." });
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    // ✅ Expanded user context
    req.user = {
      id: user._id,        // legacy support
      _id: user._id,       // for ObjectId matching
      name: user.name,
      email: user.email    // for querying sharedWith
    };

    next();

  } catch (error) {
    console.error("❌ Auth Middleware Error:", error.message);

    const message =
      error.name === "JsonWebTokenError" ? "Invalid token." :
      error.name === "TokenExpiredError" ? "Token expired." :
      "Authentication failed.";

    res.status(401).json({ success: false, message });
  }
};

export default middleware;
