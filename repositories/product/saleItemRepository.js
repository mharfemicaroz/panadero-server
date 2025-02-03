const db = global.requireV2("models");
const SaleItem = db.SaleItem;
const Item = db.Item;

class SaleItemRepository {
  async getById(id) {
    return await SaleItem.findByPk(id, {
      include: [{ model: Item, as: "item" }],
    });
  }

  async update(id, data) {
    const saleItem = await SaleItem.findByPk(id);
    if (!saleItem) return null;
    return await saleItem.update(data);
  }

  async delete(id) {
    const saleItem = await SaleItem.findByPk(id);
    if (!saleItem) return null;
    return await saleItem.destroy();
  }
}

module.exports = new SaleItemRepository();
