const stockTransferRepository = require("@repositories/product/stockTransferRepository");
const inventoryService = require("./inventoryService"); // or wherever it's located

class StockTransferService {
  async getList(queryParams) {
    return stockTransferRepository.listing(queryParams);
  }

  async create(data) {
    // data = { item_id, source_warehouse_id, destination_warehouse_id, quantity, transfer_date, status, ... }
    return stockTransferRepository.create(data);
  }

  async getById(id) {
    return stockTransferRepository.getById(id);
  }

  /**
   * Update a stock transfer. If the status is updated to "completed",
   * we proceed to adjust inventory. If it's "canceled", do nothing.
   */
  async alter(id, data) {
    const existingRecord = await stockTransferRepository.getById(id);
    if (!existingRecord) return null;

    const updatedRecord = await stockTransferRepository.update(id, data);

    // Check if status changed from "pending" to "completed"
    if (existingRecord.status !== "completed" && data.status === "completed") {
      // Perform the actual stock adjustments
      // Note: We re-fetch the updated record to get the final data
      const finalRecord = await stockTransferRepository.getById(id);

      await this.processStockTransfer(finalRecord);
    }

    return updatedRecord;
  }

  async delete(id) {
    return stockTransferRepository.delete(id);
  }

  /**
   * If we want a special endpoint to "complete" a transfer without
   * manually setting the status in a normal update, we can do it here.
   */
  async completeTransfer(id) {
    const record = await stockTransferRepository.getById(id);
    if (!record) return null;

    // If already completed or canceled, do nothing
    if (record.status !== "pending") return record;

    // Update status to "completed"
    const updatedRecord = await stockTransferRepository.update(id, {
      status: "completed",
    });

    // Then process the stock
    await this.processStockTransfer(updatedRecord);

    return updatedRecord;
  }

  /**
   * Responsible for adjusting inventory for a completed transfer.
   */
  async processStockTransfer(transferRecord) {
    if (transferRecord.status !== "completed") return;

    const { item_id, source_warehouse_id, destination_warehouse_id, quantity } =
      transferRecord;

    // Decrement from source warehouse
    await inventoryService.adjustItemInWarehouse(
      item_id,
      source_warehouse_id,
      -quantity
    );

    // Increment destination warehouse
    await inventoryService.adjustItemInWarehouse(
      item_id,
      destination_warehouse_id,
      +quantity
    );

    // Additional logs or further logic can be added here
  }
}

module.exports = new StockTransferService();
