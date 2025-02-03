const subcategoryRepository = global.requireV2(
  "repositories/product/subcategoryRepository"
);

class SubcategoryService {
  async getList(queryParams) {
    return subcategoryRepository.listing(queryParams);
  }

  async create(data) {
    return subcategoryRepository.create(data);
  }

  async getById(id) {
    return subcategoryRepository.getById(id);
  }

  async alter(id, data) {
    return subcategoryRepository.update(id, data);
  }

  async delete(id) {
    return subcategoryRepository.delete(id);
  }
}

module.exports = new SubcategoryService();
