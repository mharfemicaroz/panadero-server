const returnRepository = require("../../repositories/product/returnRepository");
const inventoryService = require("./inventoryService");

class ReturnService {
  async getList(queryParams) {
    return returnRepository.listing(queryParams);
  }

  async create(data) {
    return returnRepository.create(data);
  }

  async getById(id) {
    return returnRepository.getById(id);
  }

  async alter(id, data) {
    const existing = await returnRepository.getById(id);
    if (!existing) return null;
    const updated = await returnRepository.update(id, data);
    if (existing.status !== "accepted" && data.status === "accepted") {
      await this.processReturn(updated);
    }
    return updated;
  }

  async delete(id) {
    return returnRepository.delete(id);
  }

  async processReturn(returnRecord) {
    if (returnRecord.status !== "accepted") return;
    const { item_id, warehouse_id, quantity } = returnRecord;
    await inventoryService.adjustItemInWarehouse(
      item_id,
      warehouse_id,
      +quantity
    );
  }

  async completeReturn(id) {
    const record = await returnRepository.getById(id);
    if (!record) return null;
    if (record.status !== "pending") return record;
    const updated = await returnRepository.update(id, { status: "accepted" });
    await this.processReturn(updated);
    return updated;
  }
}

module.exports = new ReturnService();
