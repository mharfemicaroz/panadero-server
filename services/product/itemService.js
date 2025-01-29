const itemRepository = require("../../repositories/product/itemRepository");

class ItemService {
  async getList(queryParams) {
    return itemRepository.listing(queryParams);
  }

  async create(data) {
    return itemRepository.create(data);
  }

  async getById(id) {
    return itemRepository.getById(id);
  }

  async alter(id, data) {
    return itemRepository.update(id, data);
  }

  async delete(id) {
    return itemRepository.delete(id);
  }
}

module.exports = new ItemService();
