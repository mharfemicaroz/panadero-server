const orderRepository = global.requireV2(
  "repositories/product/orderRepository"
);
const inventoryService = require("./inventoryService");
const db = global.requireV2("models");

class OrderService {
  async getList(queryParams) {
    return await orderRepository.listing(queryParams);
  }

  async create(data) {
    // Destructure items from the order data.
    const { items, ...orderData } = data;
    // Create the base order record.
    const orderRecord = await orderRepository.create(orderData);
    // Create associated order items.
    if (items && items.length > 0) {
      for (const item of items) {
        console.log("Creating order item with:", item);
        // Expect orderRepository.createOrderItem to create a single order item.
        await orderRepository.createOrderItem({
          order_id: orderRecord.id,
          item_id: item.item_id,
          quantity: item.quantity,
          price: item.price,
          discount: item.discount || 0,
        });
      }
    }
    // Return the complete order with its items.
    return await orderRepository.getById(orderRecord.id);
  }

  async getById(id) {
    return await orderRepository.getById(id);
  }

  async alter(id, data) {
    const existing = await orderRepository.getById(id);
    if (!existing) return null;
    const updated = await orderRepository.update(id, data);
    // When the status changes to "completed", process the order.
    if (existing.status !== "completed" && data.status === "completed") {
      const finalOrder = await orderRepository.getById(id);
      await this.processCompletedOrder(finalOrder);
    }
    return updated;
  }

  async delete(id) {
    return await orderRepository.delete(id);
  }

  // Deduct the ordered quantities from inventory.
  async processCompletedOrder(orderRecord) {
    // Begin a transaction so that inventory adjustments are atomic.
    const t = await db.sequelize.transaction();
    try {
      for (const oi of orderRecord.orderItems) {
        await inventoryService.adjustItemInWarehouse(
          oi.item_id,
          // Deduct items from inventory.
          // Assume the warehouse ID is retrieved from orderRecord.user.warehouse_id
          // or use a default value (e.g. 1) if not defined.
          orderRecord.user && orderRecord.user.warehouse_id
            ? orderRecord.user.warehouse_id
            : 1,
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
