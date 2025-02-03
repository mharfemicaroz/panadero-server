const procurementRepository = require("@repositories/product/procurementRepository");
const inventoryService = require("./inventoryService");

class ProcurementService {
  async getList(queryParams) {
    return procurementRepository.listing(queryParams);
  }

  async create(data) {
    return procurementRepository.create(data);
  }

  async getById(id) {
    return procurementRepository.getById(id);
  }

  async alter(id, data) {
    const existing = await procurementRepository.getById(id);
    if (!existing) return null;
    const updated = await procurementRepository.update(id, data);
    if (existing.status !== "received" && data.status === "received") {
      await this.processProcurement(updated);
    }
    return updated;
  }

  async delete(id) {
    return procurementRepository.delete(id);
  }

  async processProcurement(procurementRecord) {
    if (procurementRecord.status !== "received") return;
    const { item_id, warehouse_id, quantity } = procurementRecord;
    await inventoryService.adjustItemInWarehouse(
      item_id,
      warehouse_id,
      +quantity
    );
  }

  async completeProcurement(id) {
    const record = await procurementRepository.getById(id);
    if (!record) return null;
    if (record.status !== "pending") return record;
    const updated = await procurementRepository.update(id, {
      status: "received",
    });
    await this.processProcurement(updated);
    return updated;
  }
}

module.exports = new ProcurementService();
