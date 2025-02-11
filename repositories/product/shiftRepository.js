const { Op } = require("sequelize");
const db = global.requireV2("models");
const Shift = db.Shift;
const User = db.User;

class ShiftRepository {
  async listing({
    page = 1,
    limit = 10,
    filters = {},
    sortBy = "created_at", // Default sort column.
    sortOrder = "DESC", // Default sort order.
  } = {}) {
    const offset = (page - 1) * limit;
    const where = {};

    // Example filters – adjust as needed.
    if (filters.userId) {
      where.userId = filters.userId;
    }
    if (filters.branchId) {
      where.branchId = filters.branchId;
    }
    if (filters.status) {
      where.status = filters.status;
    }
    if (filters.start_time) {
      // Filter shifts starting at or after a certain date.
      where.start_time = { [Op.gte]: filters.start_time };
    }

    return await Shift.findAndCountAll({
      distinct: true,
      where,
      order: [[sortBy, sortOrder.toUpperCase()]],
      limit: parseInt(limit, 10),
      offset,
      include: [
        {
          model: User,
          as: "user",
          attributes: [
            "id",
            "username",
            "email",
            "first_name",
            "last_name",
            "role",
          ],
        },
      ],
    });
  }

  async create(data) {
    return await Shift.create(data);
  }

  async getById(id) {
    return await Shift.findByPk(id);
  }

  async update(id, shiftData) {
    const shift = await Shift.findByPk(id);
    if (shift) {
      return await shift.update(shiftData);
    }
    return null;
  }

  async delete(id) {
    const shift = await Shift.findByPk(id);
    if (shift) {
      return await shift.destroy();
    }
    return null;
  }
}

module.exports = new ShiftRepository();
