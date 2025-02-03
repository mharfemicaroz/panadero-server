const categoryRepository = require("@repositories/product/categoryRepository");

class CategoryService {
  async getList(queryParams) {
    return categoryRepository.listing(queryParams);
  }

  async getAllWithProducts(warehouseId) {
    return categoryRepository.getAllWithProducts(warehouseId);
  }

  async create(data) {
    return await categoryRepository.create(data);
  }

  async getById(id) {
    return await categoryRepository.getById(id);
  }

  async alter(id, data) {
    return await categoryRepository.update(id, data);
  }

  async delete(id) {
    return await categoryRepository.delete(id);
  }
}

module.exports = new CategoryService();
