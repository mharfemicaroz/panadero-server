const db = require("../../models");
const Notification = db.Notification;
const Item = db.Item;
const Warehouse = db.Warehouse;

class NotificationRepository {
  async getAll({ page = 1, limit = 10, is_read }) {
    // Convert page and limit to numbers
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const offset = (pageNumber - 1) * limitNumber;

    const where = {};
    // Optionally convert is_read to a boolean if it's provided as a string
    if (is_read !== undefined) {
      // This will set is_read to true if the query is "true", else false.
      where.is_read = is_read === "true" || is_read === true;
    }

    return Notification.findAndCountAll({
      where,
      include: [
        { model: Item, as: "productItem", attributes: ["name", "sku"] },
        { model: Warehouse, as: "warehouse", attributes: ["name"] },
      ],
      limit: limitNumber, // Use the numeric value
      offset,
    });
  }

  async create(data) {
    return Notification.create(data);
  }

  async markAsRead(id) {
    const record = await Notification.findByPk(id);
    if (record) return record.update({ is_read: true });
    return null;
  }
}

module.exports = new NotificationRepository();
