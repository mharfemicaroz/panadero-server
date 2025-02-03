const supplierRepository = require("../../repositories/product/supplierRepository");

class SupplierService {
  async getList(queryParams) {
    return supplierRepository.listing(queryParams);
  }

  async create(data) {
    return supplierRepository.create(data);
  }

  async getById(id) {
    return supplierRepository.getById(id);
  }

  async alter(id, data) {
    return supplierRepository.update(id, data);
  }

  async delete(id) {
    return supplierRepository.delete(id);
  }
}

module.exports = new SupplierService();
