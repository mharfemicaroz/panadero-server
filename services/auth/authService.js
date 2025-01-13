const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto"); // For generating reset tokens
const userRepository = require("../../repositories/user/UserRepository");
require("dotenv").config(); // Make sure dotenv is loaded

// Log the JWT_SECRET to debug
console.log("JWT_SECRET in authService: ", process.env.JWT_SECRET);

class AuthService {
  async login(email, password) {
    const user = await userRepository.getByEmail(email);
    if (user && bcrypt.compareSync(password, user.password)) {
      // Sign the token using the plain JWT secret from .env
      const token = jwt.sign(
        { id: user.id, email: user.email },
        "mharfenelsongwapo", // Use JWT_SECRET from environment variables
        { expiresIn: "1h" }
      );
      return token;
    }
    return null;
  }

  async register(data) {
    const hashedPassword = bcrypt.hashSync(data.password, 10);
    const user = await userRepository.create({
      ...data,
      password: hashedPassword,
    });
    return user;
  }

  async logout() {
    // In case of server-side token management, this is where we would invalidate it.
    // But usually, this happens on the client-side where the token is simply removed.
  }

  async generatePasswordResetToken(email) {
    const user = await userRepository.getByEmail(email);
    if (user) {
      const resetToken = crypto.randomBytes(20).toString("hex");
      // Store the reset token (with expiration) in the database
      await userRepository.storeResetToken(user.id, resetToken);
      // Ideally, send the token to the user's email here
      return resetToken;
    }
    return null;
  }

  async resetPassword(resetToken, newPassword) {
    // Find the user by reset token
    const user = await userRepository.getByResetToken(resetToken);
    if (user) {
      const hashedPassword = bcrypt.hashSync(newPassword, 10);
      await userRepository.updatePassword(user.id, hashedPassword);
      return true;
    }
    return false;
  }
}

module.exports = new AuthService();
