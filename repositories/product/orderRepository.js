const { Op } = require("sequelize");
const db = global.requireV2("models");
const Order = db.Order;
const OrderItem = db.OrderItem;

class OrderRepository {
  async listing({
    page = 1,
    limit = 10,
    filters = {},
    sortBy = "created_at",
    sortOrder = "DESC",
  } = {}) {
    const offset = (page - 1) * limit;
    const where = {};
    if (filters.status) where.status = filters.status;
    if (filters.user_id) where.user_id = filters.user_id;
    if (filters.customer_id) where.customer_id = filters.customer_id;
    if (filters.start_date && filters.end_date) {
      where.order_date = {
        [Op.between]: [filters.start_date, filters.end_date],
      };
    }
    return await Order.findAndCountAll({
      distinct: true,
      where,
      order: [[sortBy, sortOrder.toUpperCase()]],
      limit: parseInt(limit, 10),
      offset,
      include: [
        { association: "user" },
        { association: "customer" },
        {
          association: "orderItems",
          include: [{ association: "item" }],
        },
      ],
    });
  }

  async create(data) {
    // Expect data to contain an orderItems array with details for each item.
    const { orderItems, ...orderData } = data;
    return await db.sequelize.transaction(async (t) => {
      const newOrder = await Order.create(orderData, { transaction: t });
      if (orderItems && orderItems.length > 0) {
        // Instead of bulkCreate, loop through each order item and create individually.
        for (const item of orderItems) {
          await this.createOrderItem(
            {
              order_id: newOrder.id,
              item_id: item.item_id,
              quantity: item.quantity,
              price: item.price,
              discount: item.discount || 0,
            },
            t
          );
        }
      }
      return newOrder;
    });
  }

  // New method to create a single order item.
  async createOrderItem(data, transaction) {
    return await OrderItem.create(data, { transaction });
  }

  async getById(id) {
    return await Order.findByPk(id, {
      include: [
        { association: "user" },
        { association: "customer" },
        {
          association: "orderItems",
          include: [{ association: "item" }],
        },
      ],
    });
  }

  async update(id, data) {
    const order = await Order.findByPk(id);
    if (order) {
      return await order.update(data);
    }
    return null;
  }

  async delete(id) {
    const order = await Order.findByPk(id);
    if (order) {
      return await order.destroy();
    }
    return null;
  }

  // Mark an order as completed (e.g., when payment is confirmed and order is fulfilled).
  // In your business logic, this would also deduct the ordered quantities from inventory.
  async complete(id) {
    const order = await Order.findByPk(id, {
      include: [
        { association: "user" },
        { association: "customer" },
        {
          association: "orderItems",
          include: [{ association: "item" }],
        },
      ],
    });
    if (!order) return null;
    return await order.update({ status: "completed" });
  }
}

module.exports = new OrderRepository();
