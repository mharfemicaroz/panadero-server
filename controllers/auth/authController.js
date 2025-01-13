const authService = require("../../services/auth/authService");

class AuthController {
  async login(req, res) {
    try {
      const { email, password } = req.body;
      const token = await authService.login(email, password);
      if (token) {
        res.status(200).json({ message: "Login successful", token });
      } else {
        res.status(401).json({ message: "Invalid credentials" });
      }
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error logging in", error: error.message });
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
