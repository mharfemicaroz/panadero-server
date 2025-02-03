const inventoryRepository = require("@repositories/product/inventoryRepository");
const notificationService = require("./notificationService");

class InventoryService {
  async getList(queryParams) {
    return inventoryRepository.listing(queryParams);
  }

  async create(data) {
    return inventoryRepository.create(data);
  }

  async getById(id) {
    return inventoryRepository.getById(id);
  }

  async alter(id, data) {
    return inventoryRepository.update(id, data);
  }

  async delete(id) {
    return inventoryRepository.delete(id);
  }

  /**
   * Adjusts the current_quantity for a given inventory record.
   * Before updating, checks if the resulting quantity would fall below the minimum_quantity.
   * If so, throws an error without processing the update.
   * Otherwise, updates the quantity and, if needed, sends a low-stock alert.
   * quantityChange: positive value for stock IN, negative value for stock OUT.
   */
  async adjustQuantity(inventoryId, quantityChange) {
    const record = await inventoryRepository.getById(inventoryId);
    if (!record) throw new Error("Inventory record not found");

    // Check if the new quantity would fall below the minimum allowed quantity.
    const newQuantity = record.current_quantity + quantityChange;
    if (newQuantity < record.minimum_quantity) {
      throw new Error(
        `Insufficient stock: operation would reduce stock to ${newQuantity}, which is below the minimum required level of ${record.minimum_quantity}.`
      );
    }

    // Update the quantity.
    record.current_quantity = newQuantity;
    const updatedRecord = await record.save();

    // Check if the updated quantity falls below the reorder level for alert purposes.
    const lowStock = await notificationService.checkLowStock(record.item_id);
    if (lowStock) {
      await notificationService.sendLowStockAlert(
        record.item_id,
        record.warehouse_id,
        `Low stock alert: ${
          record.item ? record.item.name : "Item"
        } is below the reorder level.`
      );
    }

    return updatedRecord;
  }

  /**
   * Adjusts inventory for a given item in a specified warehouse.
   * Finds the inventory record by item_id and warehouse_id, then adjusts its quantity.
   */
  async adjustItemInWarehouse(item_id, warehouse_id, quantityChange) {
    const record = await inventoryRepository.findByItemAndWarehouse(
      item_id,
      warehouse_id
    );
    if (!record) {
      throw new Error(
        `No inventory found for item_id=${item_id}, warehouse_id=${warehouse_id}`
      );
    }
    return this.adjustQuantity(record.id, quantityChange);
  }
}

module.exports = new InventoryService();
