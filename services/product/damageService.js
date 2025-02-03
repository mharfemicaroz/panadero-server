const damageRepository = global.requireV2(
  "repositories/product/damageRepository"
);
const inventoryService = require("./inventoryService");

class DamageService {
  async getList(queryParams) {
    return damageRepository.listing(queryParams);
  }

  async create(data) {
    return damageRepository.create(data);
  }

  async getById(id) {
    return damageRepository.getById(id);
  }

  async alter(id, data) {
    const existing = await damageRepository.getById(id);
    if (!existing) return null;
    const updated = await damageRepository.update(id, data);
    if (existing.status !== "processed" && data.status === "processed") {
      await this.processDamage(updated);
    }
    return updated;
  }

  async delete(id) {
    return damageRepository.delete(id);
  }

  async processDamage(damageRecord) {
    if (damageRecord.status !== "processed") return;
    const { item_id, warehouse_id, quantity } = damageRecord;
    await inventoryService.adjustItemInWarehouse(
      item_id,
      warehouse_id,
      -quantity
    );
  }

  async completeDamage(id) {
    const record = await damageRepository.getById(id);
    if (!record) return null;
    if (record.status !== "pending") return record;
    const updated = await damageRepository.update(id, { status: "processed" });
    await this.processDamage(updated);
    return updated;
  }
}

module.exports = new DamageService();
