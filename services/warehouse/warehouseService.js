const warehouseRepository = require("@repositories/warehouse/warehouseRepository");

class WarehouseService {
  async getList(queryParams) {
    return warehouseRepository.listing(queryParams);
  }

  async create(data) {
    return warehouseRepository.create(data);
  }

  async getById(id) {
    return warehouseRepository.getById(id);
  }

  async alter(id, data) {
    return warehouseRepository.update(id, data);
  }

  async delete(id) {
    return warehouseRepository.delete(id);
  }
}

module.exports = new WarehouseService();
