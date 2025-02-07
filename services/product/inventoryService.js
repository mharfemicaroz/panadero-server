const inventoryRepository = global.requireV2(
  "repositories/product/inventoryRepository"
);
const stockMovementService = require("./stockMovementService");
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
   * Before updating, checks if the new quantity would fall below minimum_quantity.
   * After saving, creates a stock movement record.
   *
   * @param {number} inventoryId - The inventory record ID.
   * @param {number} quantityChange - Positive for IN, negative for OUT.
   * @param {number|null} userId - (Optional) The ID of the user performing the adjustment.
   * @returns {Object} The updated inventory record.
   * @throws {Error} If the inventory record is not found or the adjustment is invalid.
   */
  async adjustQuantity(inventoryId, quantityChange, userId = null) {
    const record = await inventoryRepository.getById(inventoryId);
    if (!record) throw new Error("Inventory record not found");

    // Calculate new quantity and check against minimum_quantity
    const newQuantity = record.current_quantity + quantityChange;
    if (newQuantity < record.minimum_quantity) {
      throw new Error(
        `Insufficient stock: operation would reduce stock to ${newQuantity}, which is below the minimum required level of ${record.minimum_quantity}.`
      );
    }

    // Update the inventory quantity and save the record
    record.current_quantity = newQuantity;
    const updatedRecord = await record.save();

    // Optionally send a low-stock notification if below reorder level
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

    // Create a stock movement record automatically
    await stockMovementService.createStockMovement({
      inventory_id: inventoryId,
      type: quantityChange > 0 ? "IN" : "OUT",
      quantity_change: Math.abs(quantityChange),
      new_quantity: updatedRecord.current_quantity,
      warehouse_id: record.warehouse_id,
      user_id: userId,
      // You can include additional fields (e.g., note) if needed.
    });

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

  /**
   * Checks if the inventory for the specified item in the given warehouse
   * can be adjusted by the quantityChange without falling below the minimum_quantity.
   *
   * @param {number} item_id - The ID of the item.
   * @param {number} warehouse_id - The ID of the warehouse.
   * @param {number} quantityChange - The change in quantity (use a negative value for stock out).
   * @returns {Promise<Object>} The inventory record if the adjustment is allowed.
   * @throws {Error} If the inventory record is not found or the adjustment is not allowed.
   */
  async checkAvailabilityForItemInWarehouse(
    item_id,
    warehouse_id,
    quantityChange
  ) {
    const record = await inventoryRepository.findByItemAndWarehouse(
      item_id,
      warehouse_id
    );
    if (!record) {
      throw new Error(
        `No inventory record found for item_id=${item_id} in warehouse_id=${warehouse_id}`
      );
    }
    const newQuantity = record.current_quantity + quantityChange;
    if (newQuantity < record.minimum_quantity) {
      throw new Error(
        `Insufficient stock for item_id=${item_id}. Current quantity is ${record.current_quantity} with a minimum of ${record.minimum_quantity}. ` +
          `The requested change of ${quantityChange} would leave ${newQuantity}.`
      );
    }
    return record;
  }
}

module.exports = new InventoryService();
