const rateLimit = require("express-rate-limit");

/**
 * throttle Middleware
 *
 * @param {number} maxRequests - Max number of requests allowed in the time window
 * @param {number} windowMs - Time window in milliseconds
 * @returns {Function} Rate Limit middleware function
 */
function throttle(maxRequests = 100, windowMs = 15 * 60 * 1000) {
  return rateLimit({
    windowMs,
    max: maxRequests,
    message: "Too many requests from this IP, please try again later.",
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  });
}

module.exports = throttle;
