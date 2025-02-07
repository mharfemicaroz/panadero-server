const stockMovementRepository = global.requireV2(
  "repositories/product/stockMovementRepository"
);

class StockMovementService {
  async getList(queryParams) {
    return stockMovementRepository.listing(queryParams);
  }

  async getById(id) {
    return stockMovementRepository.getById(id);
  }

  async create(data) {
    return stockMovementRepository.create(data);
  }

  async update(id, data) {
    return stockMovementRepository.update(id, data);
  }

  async delete(id) {
    return stockMovementRepository.delete(id);
  }

  /**
   * A convenience method to create a stock movement record.
   * Expects an object with:
   * { inventory_id, type, quantity_change, new_quantity, warehouse_id, user_id, note }
   */
  async createStockMovement(data) {
    return stockMovementRepository.create(data);
  }
}

module.exports = new StockMovementService();
