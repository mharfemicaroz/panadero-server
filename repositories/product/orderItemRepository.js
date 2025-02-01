const db = require("../../models");
const OrderItem = db.OrderItem;
const Item = db.Item;
const AbstractRepository = require("../../base/AbstractRepository");

class OrderItemRepository extends AbstractRepository {
  constructor() {
    super(OrderItem);
  }

  async getById(id) {
    return OrderItem.findByPk(id, {
      include: [{ model: Item, as: "item" }],
    });
  }

  async update(id, data) {
    const record = await OrderItem.findByPk(id);
    if (!record) return null;
    return record.update(data);
  }

  async delete(id) {
    const record = await OrderItem.findByPk(id);
    if (!record) return null;
    return record.destroy();
  }
}

module.exports = new OrderItemRepository();
