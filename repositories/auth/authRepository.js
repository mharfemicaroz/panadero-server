const db = require("../../models");
const User = db.User;

class AuthRepository {
  async getByEmail(email) {
    return await User.findOne({ where: { email } });
  }

  async create(data) {
    return await User.create(data);
  }

  async storeResetToken(userId, resetToken) {
    const user = await User.findByPk(userId);
    if (user) {
      user.resetToken = resetToken;
      user.resetTokenExpiry = Date.now() + 3600000; // Token expiry (1 hour)
      await user.save();
    }
  }

  async getByResetToken(resetToken) {
    return await User.findOne({
      where: {
        resetToken: resetToken,
        resetTokenExpiry: { [db.Sequelize.Op.gt]: Date.now() }, // Token still valid
      },
    });
  }

  async updatePassword(userId, newPassword) {
    const user = await User.findByPk(userId);
    if (user) {
      user.password = newPassword;
      await user.save();
    }
  }
}

module.exports = new AuthRepository();
