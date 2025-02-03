const orderItemRepository = global.requireV2(
  "repositories/product/orderItemRepository"
);

class OrderItemService {
  async getById(id) {
    return orderItemRepository.getById(id);
  }

  async alter(id, data) {
    return orderItemRepository.update(id, data);
  }

  async delete(id) {
    return orderItemRepository.delete(id);
  }
}

module.exports = new OrderItemService();
