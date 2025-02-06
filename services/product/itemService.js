const itemRepository = global.requireV2("repositories/product/itemRepository");
const inventoryService = global.requireV2("services/product/inventoryService");

class ItemService {
  async getList(queryParams) {
    return itemRepository.listing(queryParams);
  }

  async create(data) {
    // Create the item first
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
