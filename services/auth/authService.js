const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const authRepository = require("../../repositories/auth/authRepository");
require("dotenv").config();

class AuthService {
  async login(email, password) {
    const user = await authRepository.getByEmail(email);
    if (!user || !user.password) {
      // If user is not found or password is missing, throw an error or return null
      throw new Error("User not found or password not available");
    }
    // Compare provided password with stored hash
    if (bcrypt.compareSync(password, user.password)) {
      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET || "panaderopanadero",
        { expiresIn: "1h" }
      );
      return token;
    }
    return null;
  }

  async register(data) {
    const hashedPassword = bcrypt.hashSync(data.password, 10);
    const user = await authRepository.create({
      ...data,
      password: hashedPassword,
    });
    return user;
  }

  async logout() {
    // Logout logic if needed
  }

  async generatePasswordResetToken(email) {
    const user = await authRepository.getByEmail(email);
    if (user) {
      const resetToken = crypto.randomBytes(20).toString("hex");
      await authRepository.storeResetToken(user.id, resetToken);
      return resetToken;
    }
    return null;
  }

  async resetPassword(resetToken, newPassword) {
    const user = await authRepository.getByResetToken(resetToken);
    if (user) {
      const hashedPassword = bcrypt.hashSync(newPassword, 10);
      await authRepository.updatePassword(user.id, hashedPassword);
      return true;
    }
    return false;
  }
}

module.exports = new AuthService();
