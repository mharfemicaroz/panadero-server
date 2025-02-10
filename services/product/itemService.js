// services/product/itemService.js
const itemRepository = global.requireV2("repositories/product/itemRepository");

class ItemService {
  async getList(queryParams) {
    return itemRepository.listing(queryParams);
  }

  // New method to get list with history
  async getListWithHistory(queryParams) {
    return itemRepository.listingWithHistory(queryParams);
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
