const itemRepository = global.requireV2("repositories/product/itemRepository");
const inventoryService = global.requireV2("services/product/inventoryService");

class ItemService {
  async getList(queryParams) {
    return itemRepository.listing(queryParams);
  }

  async create(data) {
    // Create the item first
    const newItem = await itemRepository.create(data);
    // Create a corresponding inventory record using beginning_qty
    await inventoryService.create({
      item_id: newItem.id,
      warehouse_id: newItem.warehouse_id,
      current_quantity: newItem.beginning_qty,
    });
    return newItem;
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
