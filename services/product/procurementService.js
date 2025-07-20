// services/product/procurementService.js
const procurementRepository = global.requireV2(
  "repositories/product/procurementRepository"
);
const inventoryService = require("./inventoryService");

class ProcurementService {
  async getList(queryParams) {
    return procurementRepository.listing(queryParams);
  }

  async create(data) {
    const { items, ...procurementData } = data;
    const procurementRecord = await procurementRepository.create(
      procurementData
    );
    if (items && items.length > 0) {
      for (const item of items) {
        console.log("Creating procurement item with:", item);
        // Here, we expect item.item_id to be defined.
        await procurementRepository.createProcurementItem({
          procurement_id: procurementRecord.id,
          item_id: item.item_id, // This should be 8 as logged
          quantity: item.quantity,
          cost: item.purchase_cost,
        });
      }
    }
    return await procurementRepository.getById(procurementRecord.id);
  }

  async getById(id) {
    return procurementRepository.getById(id);
  }

  async alter(id, data) {
    const existing = await procurementRepository.getById(id);
    if (!existing) return null;
    const updated = await procurementRepository.update(id, data);
    // If the status is changed to "received" from a non-received state, process the procurement.
    if (existing.status !== "received" && data.status === "received") {
      await this.processProcurement(await procurementRepository.getById(id));
    }
    return updated;
  }

  async delete(id) {
    return procurementRepository.delete(id);
  }

  async processProcurement(procurementRecord) {
    if (procurementRecord.status !== "received") return;
    // For each procurement item, adjust the inventory.
    for (const procItem of procurementRecord.items) {
      await inventoryService.adjustItemInWarehouse(
        procItem.item_id,
        procurementRecord.warehouse_id,
        +procItem.quantity,
        procurementRecord.user_id,
        "purchased"
      );
    }
  }

  async completeProcurement(id) {
    const record = await procurementRepository.getById(id);
    if (!record) return null;
    if (record.status !== "pending") return record;
    const updated = await procurementRepository.update(id, {
      status: "received",
    });
    // Re-fetch the record with items and process the procurement.
    const fullRecord = await procurementRepository.getById(id);
    await this.processProcurement(fullRecord);
    return fullRecord;
  }
}

module.exports = new ProcurementService();
