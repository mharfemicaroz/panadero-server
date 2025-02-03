const authService = require("@services/auth/authService");

class AuthController {
  async login(req, res) {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);

      if (result.requires2FA) {
        return res.status(200).json({
          requires2FA: true,
          tempToken: result.tempToken,
        });
      }

      return res.status(200).json({
        message: "Login successful",
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
        userdata: {
          id: result.id,
          email: result.email,
          role: result.role,
        },
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error logging in", error: error.message });
    }
  }

  async verify2FA(req, res) {
    try {
      const { otp, tempToken } = req.body;
      const tokens = await authService.verify2FA(tempToken, otp);

      if (!tokens) {
        return res.status(401).json({ message: "Invalid 2FA OTP" });
      }

      res.status(200).json({
        message: "2FA verification successful",
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        userdata: {
          id: tokens.id,
          email: tokens.email,
          role: tokens.role,
          twoFAEnabled: tokens.twoFAEnabled,
        },
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error verifying 2FA", error: error.message });
    }
  }

  async enable2FA(req, res) {
    try {
      const { userId } = req.body;
      const { qrCode, secret } = await authService.enable2FA(userId);

      res
        .status(200)
        .json({ message: "2FA enabled successfully", qrCode, secret });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error enabling 2FA", error: error.message });
    }
  }

  async disable2FA(req, res) {
    try {
      const { userId } = req.body;
      await authService.disable2FA(userId);

      res.status(200).json({ message: "2FA disabled successfully" });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error disabling 2FA", error: error.message });
    }
  }

  async refresh(req, res) {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
        return res.status(400).json({ message: "Refresh token required" });
      }

      const newAccessToken = await authService.refreshToken(refreshToken);
      res.status(200).json({ accessToken: newAccessToken });
    } catch (error) {
      res.status(401).json({ message: "Invalid or expired refresh token" });
    }
  }

  async register(req, res) {
    try {
      const { email, password, username, role } = req.body;
      const user = await authService.register({
        email,
        password,
        username,
        role,
      });
      res.status(201).json({ message: "User created successfully", user });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error registering user", error: error.message });
    }
  }

  async logout(req, res) {
    try {
      // Here we typically instruct the client to remove the token
      res.status(200).json({ message: "Logout successful" });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error logging out", error: error.message });
    }
  }

  async forgotPassword(req, res) {
    try {
      const { email } = req.body;
      const resetToken = await authService.generatePasswordResetToken(email);
      if (resetToken) {
        // Send the token via email (you'd implement email sending here)
        res
          .status(200)
          .json({ message: "Password reset token sent to your email" });
      } else {
        res.status(404).json({ message: "User not found" });
      }
    } catch (error) {
      res.status(500).json({
        message: "Error processing forgot password",
        error: error.message,
      });
    }
  }

  async resetPassword(req, res) {
    try {
      const { resetToken, newPassword } = req.body;
      const success = await authService.resetPassword(resetToken, newPassword);
      if (success) {
        res.status(200).json({ message: "Password reset successfully" });
      } else {
        res.status(400).json({ message: "Invalid or expired reset token" });
      }
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error resetting password", error: error.message });
    }
  }
}

module.exports = new AuthController();
