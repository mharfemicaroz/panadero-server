const notificationRepository = global.requireV2(
  "repositories/product/notificationRepository"
);
const inventoryRepository = global.requireV2(
  "repositories/product/inventoryRepository"
);

class NotificationService {
  async getAll(queryParams) {
    return notificationRepository.getAll(queryParams);
  }

  async sendLowStockAlert(itemId, warehouseId, message) {
    // Create a notification record indicating low stock.
    return notificationRepository.create({
      type: "LOW_STOCK",
      message,
      related_item_id: itemId,
      warehouse_id: warehouseId,
    });
  }

  async markAsRead(id) {
    return notificationRepository.markAsRead(id);
  }

  /**
   * Checks if the given item is low on stock.
   * It queries the inventory records for that item (using listing with a filters object)
   * and returns true if any record's current_quantity is below its reorder_level.
   */
  async checkLowStock(item_id) {
    // Use the listing method with a filter for item_id.
    const result = await inventoryRepository.listing({
      page: 1,
      limit: 100,
      filters: { item_id },
    });
    const lowStockRecords = result.rows; // listing returns an object with { count, rows }
    for (const inv of lowStockRecords) {
      if (inv.current_quantity < inv.reorder_level) {
        return true;
      }
    }
    return false;
  }
}

module.exports = new NotificationService();
