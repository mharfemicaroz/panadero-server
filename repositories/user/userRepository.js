const { Op } = require("sequelize");
const db = global.requireV2("models");
const User = db.User;

class UserRepository {
  async listing({
    page = 1,
    limit = 10,
    filters = {},
    sortBy = "created_at", // default sort column
    sortOrder = "DESC", // default sort order
  } = {}) {
    const offset = (page - 1) * limit;
    const where = {};

    // Apply filter on name if provided
    if (filters.username) {
      where.username = { [Op.like]: `%${filters.username}%` };
    }

    // Apply filter on email if provided
    if (filters.email) {
      where.email = { [Op.like]: `%${filters.email}%` };
    }

    // Apply filter on is_active if provided
    if (filters.is_active !== undefined) {
      where.is_active = filters.is_active;
    }

    return await User.findAndCountAll({
      distinct: true,
      where,
      order: [[sortBy, sortOrder.toUpperCase()]], // apply sorting here
      limit: parseInt(limit, 10),
      offset,
    });
  }

  async create(data) {
    return await User.create(data);
  }

  async getById(id) {
    return await User.findByPk(id);
  }

  async getByEmail(email) {
    return await User.findOne({ where: { email } });
  }

  async update(id, userData) {
    const user = await User.findByPk(id);
    if (user) {
      return await user.update(userData);
    }
    return null;
  }

  async delete(id) {
    const user = await User.findByPk(id);
    if (user) {
      return await user.destroy();
    }
    return null;
  }
}

module.exports = new UserRepository();
