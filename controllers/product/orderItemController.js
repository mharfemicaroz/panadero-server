const orderItemService = require("@services/product/orderItemService");

class OrderItemController {
  async getById(req, res) {
    try {
      const record = await orderItemService.getById(req.params.id);
      if (!record) {
        return res.status(404).json({ message: "Order item not found" });
      }
      res.status(200).json(record);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error fetching order item", error: error.message });
    }
  }

  async update(req, res) {
    try {
      const updated = await orderItemService.alter(req.params.id, req.body);
      if (!updated) {
        return res.status(404).json({ message: "Order item not found" });
      }
      res.status(200).json(updated);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error updating order item", error: error.message });
    }
  }

  async delete(req, res) {
    try {
      const result = await orderItemService.delete(req.params.id);
      if (!result) {
        return res.status(404).json({ message: "Order item not found" });
      }
      res.status(200).json({ message: "Order item deleted" });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error deleting order item", error: error.message });
    }
  }
}

module.exports = new OrderItemController();
