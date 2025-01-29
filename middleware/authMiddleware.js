const jwt = require("jsonwebtoken");
require("dotenv").config(); // Ensure dotenv is loaded

// Middleware function to protect routes
const authMiddleware = (req, res, next) => {
  // Extract the token from the Authorization header
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, "panaderopanadero");

    req.user = decoded; // Attach the decoded user info to the request object

    next(); // Call the next middleware or route handler
  } catch (error) {
    console.log("Token verification failed:", error);
    res.status(401).json({ message: "Token is not valid" });
  }
};

module.exports = authMiddleware;
