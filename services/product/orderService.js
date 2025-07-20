const orderRepository = global.requireV2(
  "repositories/product/orderRepository"
);
const saleRepository = global.requireV2("repositories/product/saleRepository");
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
      await this.completeOrderTransaction(finalOrder);
    }
    return updated;
  }

  async delete(id) {
    return await orderRepository.delete(id);
  }

  // Wrap inventory adjustments and sale record creation in a single transaction.
  async completeOrderTransaction(orderRecord) {
    const t = await db.sequelize.transaction();
    try {
      // Adjust inventory for each order item.
      for (const oi of orderRecord.orderItems) {
        await inventoryService.adjustItemInWarehouse(
          oi.item_id,
          orderRecord.user && orderRecord.user.warehouse_id
            ? orderRecord.user.warehouse_id
            : 1,
          -oi.quantity
        );
      }
      // Create a sale record from the completed order.
      await this.createSaleRecordFromOrder(orderRecord, t);
      await t.commit();
    } catch (err) {
      await t.rollback();
      throw err;
    }
  }

  // Public method to complete an order.
  async completeOrder(id) {
    const order = await orderRepository.getById(id);
    if (!order) return null;
    if (order.status === "completed") return order;
    // Update order status.
    await orderRepository.update(id, { status: "completed" });
    const finalOrder = await orderRepository.getById(id);
    // Process inventory adjustments and sale record creation.
    await this.completeOrderTransaction(finalOrder);
    return finalOrder;
  }

  // Helper method: Map order data to sale data and create the sale record.
  async createSaleRecordFromOrder(orderRecord, transaction) {
    const saleData = {
      user_id: orderRecord.user_id,
      branch_id:
        orderRecord.user && orderRecord.user.branch_id
          ? orderRecord.user.branch_id
          : 1, // Adjust default as needed.
      warehouse_id:
        orderRecord.user && orderRecord.user.warehouse_id
          ? orderRecord.user.warehouse_id
          : 1,
      customer_id: orderRecord.customer_id || null,
      customer_name: orderRecord.customer ? orderRecord.customer.name : null,
      status: "completed",
      sale_date: new Date(),
      total_amount: orderRecord.total_amount,
      discount_total: 0, // Adjust if you have discounts.
      remarks: orderRecord.remarks,
      payment_type: "Cash", // Or map based on your order/payment logic.
      // Optionally include shift_id if available:
      shift_id:
        orderRecord.user && orderRecord.user.shift_id
          ? orderRecord.user.shift_id
          : null,
    };

    // Map order items to sale items.
    const itemsData = orderRecord.orderItems.map((oi) => ({
      item_id: oi.item_id,
      quantity: oi.quantity,
      price: oi.price,
      discount: oi.discount || 0,
    }));

    // Use saleRepository to create the sale record with its items.
    await saleRepository.createWithItems(saleData, itemsData, { transaction });
  }
}

module.exports = new OrderService();
