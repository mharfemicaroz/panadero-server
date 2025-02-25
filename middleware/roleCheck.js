/**
 * roleCheck Middleware
 *
 * @param {string[]} allowedRoles - Array of roles permitted to access the route
 * @returns {Function} - An Express middleware function
 */
function roleCheck(allowedRoles = []) {
  return (req, res, next) => {
    const user = req.user; // Populated by authMiddleware

    // If there's no user on req, it means authMiddleware didn't find/verify a token
    if (!user) {
      return res
        .status(401)
        .json({ message: "Unauthorized - No user context." });
    }

    // Check if the user's role is included among the allowed roles
    if (allowedRoles.includes(user.role)) {
      return next(); // Proceed if role is allowed
    }

    // Otherwise, deny access
    return res
      .status(403)
      .json({ message: "Forbidden - Your role does not have access." });
  };
}

module.exports = roleCheck;
