const saleItemRepository = global.requireV2(
  "repositories/product/saleItemRepository"
);

class SaleItemService {
  async getById(id) {
    return await saleItemRepository.getById(id);
  }

  async update(id, data) {
    return await saleItemRepository.update(id, data);
  }

  async delete(id) {
    return await saleItemRepository.delete(id);
  }
}

module.exports = new SaleItemService();
