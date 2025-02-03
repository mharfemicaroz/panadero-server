const db = require("../../models");
const User = db.User;

class AuthRepository {
  async getByEmail(email) {
    return await User.unscoped().findOne({ where: { email } });
  }

  async getById(userId) {
    return await User.unscoped().findByPk(userId);
  }

  async create(data) {
    return await User.create(data);
  }

  async storeRefreshToken(userId, refreshToken) {
    const user = await this.getById(userId);
    if (user) {
      user.refreshToken = refreshToken;
      await user.save();
    }
  }

  async storeResetToken(userId, resetToken) {
    const user = await this.getById(userId);
    if (user) {
      user.resetToken = resetToken;
      user.resetTokenExpiry = Date.now() + 3600000; // 1 hour expiry
      await user.save();
    }
  }

  async getByResetToken(resetToken) {
    return await User.unscoped().findOne({
      where: {
        resetToken: resetToken,
        resetTokenExpiry: { [db.Sequelize.Op.gt]: Date.now() },
      },
    });
  }

  async updatePassword(userId, newPassword) {
    const user = await this.getById(userId);
    if (user) {
      user.password = newPassword;
      await user.save();
    }
  }

  // ✅ Added updateUser function
  async updateUser(userId, updates) {
    const user = await this.getById(userId);
    if (!user) throw new Error("User not found");

    await user.update(updates);
    return user;
  }
}

module.exports = new AuthRepository();
