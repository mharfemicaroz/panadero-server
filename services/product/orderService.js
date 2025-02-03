const orderRepository = require("../../repositories/product/orderRepository");
const inventoryService = require("./inventoryService");
const db = require("../../models");

class OrderService {
  async getList(queryParams) {
    return await orderRepository.listing(queryParams);
  }
  async create(data) {
    const { user_id, customer_id, status, total_amount, order_date, items } =
      data;
    const orderData = {
      user_id,
      customer_id: customer_id || null,
      status: status || "pending",
      total_amount: total_amount || 0,
      order_date: order_date || new Date(),
    };
    const itemsData = items || [];
    return await orderRepository.createWithItems(orderData, itemsData);
  }
  async getById(id) {
    return await orderRepository.getById(id);
  }
  async alter(id, data) {
    const existing = await orderRepository.getById(id);
    if (!existing) return null;
    const updated = await orderRepository.update(id, data);
    if (existing.status !== "completed" && data.status === "completed") {
      const finalOrder = await orderRepository.getById(id);
      await this.processCompletedOrder(finalOrder);
    }
    return updated;
  }
  async delete(id) {
    return await orderRepository.delete(id);
  }
  async processCompletedOrder(orderRecord) {
    const t = await db.sequelize.transaction();
    try {
      for (const oi of orderRecord.orderItems) {
        await inventoryService.adjustItemInWarehouse(
          oi.item_id,
          orderRecord.user.warehouse_id || 1,
          -oi.quantity
        );
      }
      await t.commit();
    } catch (err) {
      await t.rollback();
      throw err;
    }
  }
  async completeOrder(id) {
    const order = await orderRepository.getById(id);
    if (!order) return null;
    if (order.status === "completed") return order;
    const updatedOrder = await orderRepository.update(id, {
      status: "completed",
    });
    const finalOrder = await orderRepository.getById(id);
    await this.processCompletedOrder(finalOrder);
    return updatedOrder;
  }
}

module.exports = new OrderService();
