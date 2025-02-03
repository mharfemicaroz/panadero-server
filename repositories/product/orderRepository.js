const db = require("@models");
const Order = db.Order;
const OrderItem = db.OrderItem;
const User = db.User;
const Customer = db.Customer;
const Item = db.Item;

class OrderRepository {
  async listing({
    page = 1,
    limit = 10,
    filters = {},
    sortBy = "created_at",
    sortOrder = "DESC",
  }) {
    const offset = (page - 1) * limit;
    const where = {};
    if (filters.status) where.status = filters.status;
    if (filters.user_id) where.user_id = filters.user_id;
    if (filters.customer_id) where.customer_id = filters.customer_id;
    if (filters.start_date && filters.end_date) {
      where.order_date = {
        [db.Sequelize.Op.between]: [filters.start_date, filters.end_date],
      };
    }
    return await Order.findAndCountAll({
      where,
      include: [
        { model: User, as: "user" },
        { model: Customer, as: "customer" },
        {
          model: OrderItem,
          as: "orderItems",
          include: [{ model: Item, as: "item" }],
        },
      ],
      order: [[sortBy, sortOrder.toUpperCase()]],
      limit: parseInt(limit, 10),
      offset,
    });
  }
  async createWithItems(orderData, itemsData) {
    return await db.sequelize.transaction(async (t) => {
      const newOrder = await Order.create(orderData, { transaction: t });
      const orderItems = itemsData.map((it) => ({
        ...it,
        order_id: newOrder.id,
      }));
      await OrderItem.bulkCreate(orderItems, { transaction: t });
      return newOrder;
    });
  }
  async getById(id) {
    return await Order.findByPk(id, {
      include: [
        { model: User, as: "user" },
        { model: Customer, as: "customer" },
        {
          model: OrderItem,
          as: "orderItems",
          include: [{ model: Item, as: "item" }],
        },
      ],
    });
  }
  async update(id, data) {
    const order = await this.getById(id);
    if (!order) return null;
    return await order.update(data);
  }
  async delete(id) {
    const order = await this.getById(id);
    if (!order) return null;
    return await order.destroy();
  }
}

module.exports = new OrderRepository();
