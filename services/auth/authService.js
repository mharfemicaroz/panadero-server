const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const speakeasy = require("speakeasy");
const qrcode = require("qrcode");
const authRepository = global.requireV2("repositories/auth/authRepository");
require("dotenv").config();

class AuthService {
  async login(email, password) {
    const user = await authRepository.getByEmail(email);

    if (!user || !user.password) {
      throw new Error("User not found or password not available");
    }

    // Compare provided password with stored hash
    if (!bcrypt.compareSync(password, user.password)) {
      throw new Error("Invalid credentials");
    }

    // ✅ Check if user has 2FA enabled
    if (user.twoFAEnabled) {
      // ✅ Generate temporary token for 2FA validation
      const tempToken = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "5m" } // Short-lived token for 2FA
      );

      return { requires2FA: true, tempToken };
    }

    return this.generateTokens(user);
  }

  async verify2FA(tempToken, otp) {
    try {
      const decoded = jwt.verify(tempToken, process.env.JWT_SECRET);
      const user = await authRepository.getById(decoded.id);

      if (!user || !user.twoFAEnabled) {
        throw new Error("User not found or 2FA not enabled");
      }

      const isValid = speakeasy.totp.verify({
        secret: user.twoFASecret,
        encoding: "base32",
        token: otp,
        window: 1,
      });

      if (!isValid) {
        throw new Error("Invalid 2FA OTP");
      }

      return this.generateTokens(user);
    } catch (error) {
      throw new Error("Invalid or expired 2FA verification token");
    }
  }

  async enable2FA(userId) {
    const secret = speakeasy.generateSecret({ name: "MyApp" });

    await authRepository.updateUser(userId, {
      twoFAEnabled: true,
      twoFASecret: secret.base32,
    });

    const qrCode = await qrcode.toDataURL(secret.otpauth_url);
    return { qrCode, secret: secret.base32 };
  }

  async disable2FA(userId) {
    await authRepository.updateUser(userId, {
      twoFAEnabled: false,
      twoFASecret: null,
    });
  }

  async refreshToken(oldRefreshToken) {
    try {
      const decoded = jwt.verify(
        oldRefreshToken,
        process.env.JWT_REFRESH_SECRET
      );

      const user = await authRepository.getById(decoded.id);
      if (!user || user.refreshToken !== oldRefreshToken) {
        throw new Error("Invalid refresh token");
      }

      return this.generateTokens(user);
    } catch (error) {
      throw new Error("Invalid or expired refresh token");
    }
  }

  async register(data) {
    const hashedPassword = bcrypt.hashSync(data.password, 10);
    const user = await authRepository.create({
      ...data,
      password: hashedPassword,
    });
    return user;
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

  generateTokens(user) {
    const accessToken = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    const refreshToken = jwt.sign(
      { id: user.id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    authRepository.storeRefreshToken(user.id, refreshToken);

    return {
      accessToken,
      refreshToken,
      email: user.email,
      role: user.role,
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      twoFAEnabled: user.twoFAEnabled,
    };
  }
}

module.exports = new AuthService();
