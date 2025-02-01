const orderService = require("../../services/product/orderService");

class OrderController {
  async list(req, res) {
    try {
      const {
        page,
        limit,
        user_id,
        customer_id,
        status,
        start_date,
        end_date,
        sortBy,
        sortOrder,
      } = req.query;
      const filters = {
        user_id: user_id ? parseInt(user_id, 10) : undefined,
        customer_id: customer_id ? parseInt(customer_id, 10) : undefined,
        status: status || undefined,
        start_date: start_date || undefined,
        end_date: end_date || undefined,
      };
      const queryParams = { page, limit, filters, sortBy, sortOrder };
      const result = await orderService.getList(queryParams);
      res.status(200).json({
        total: result.count,
        totalPages: Math.ceil(result.count / (limit || 10)),
        currentPage: parseInt(page || 1, 10),
        pageSize: parseInt(limit || 10, 10),
        data: result.rows,
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error fetching orders", error: error.message });
    }
  }
  async create(req, res) {
    try {
      const newOrder = await orderService.create(req.body);
      res.status(201).json(newOrder);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error creating order", error: error.message });
    }
  }
  async getById(req, res) {
    try {
      const order = await orderService.getById(req.params.id);
      if (!order) return res.status(404).json({ message: "Order not found" });
      res.status(200).json(order);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error fetching order", error: error.message });
    }
  }
  async update(req, res) {
    try {
      const updated = await orderService.alter(req.params.id, req.body);
      if (!updated) return res.status(404).json({ message: "Order not found" });
      res.status(200).json(updated);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error updating order", error: error.message });
    }
  }
  async delete(req, res) {
    try {
      const result = await orderService.delete(req.params.id);
      if (!result) return res.status(404).json({ message: "Order not found" });
      res.status(200).json({ message: "Order deleted" });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error deleting order", error: error.message });
    }
  }
  async complete(req, res) {
    try {
      const completedOrder = await orderService.completeOrder(req.params.id);
      if (!completedOrder)
        return res.status(404).json({ message: "Order not found" });
      res.status(200).json(completedOrder);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error completing order", error: error.message });
    }
  }
}

module.exports = new OrderController();
