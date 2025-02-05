const categoryGroupRepository = global.requireV2(
  "repositories/product/categoryGroupRepository"
);

class CategoryGroupService {
  async getList(queryParams) {
    return await categoryGroupRepository.listing(queryParams);
  }

  async create(data) {
    return await categoryGroupRepository.create(data);
  }

  async getById(id) {
    return await categoryGroupRepository.getById(id);
  }

  async alter(id, data) {
    return await categoryGroupRepository.update(id, data);
  }

  async delete(id) {
    return await categoryGroupRepository.delete(id);
  }
}

module.exports = new CategoryGroupService();
