const discountRepository = require("@repositories/product/discountRepository");
const pricingService = require("./pricingService");
const db = require("@models");

class DiscountService {
  async getList(queryParams) {
    return discountRepository.listing(queryParams);
  }

  async create(data) {
    const discountRecord = await discountRepository.create(data);
    await this.applyDiscount(discountRecord);
    return discountRecord;
  }

  async getById(id) {
    return discountRepository.getById(id);
  }

  async alter(id, data) {
    const existing = await discountRepository.getById(id);
    if (!existing) return null;
    const updated = await discountRepository.update(id, data);
    await this.applyDiscount(updated);
    return updated;
  }

  async delete(id) {
    return discountRepository.delete(id);
  }

  async applyDiscount(discountRecord) {
    const { item_id, discount_type, discount_value } = discountRecord;
    const dbModels = db.sequelize.models;
    const Item = dbModels.Item;
    const item = await Item.findByPk(item_id);
    if (item) {
      let newPrice = parseFloat(item.price);
      if (discount_type === "amount") {
        newPrice = newPrice - parseFloat(discount_value);
      } else if (discount_type === "percentage") {
        newPrice = newPrice * (1 - parseFloat(discount_value) / 100);
      }
      newPrice = newPrice < 0 ? 0 : newPrice;
      await item.update({ price: newPrice });
    }
  }
}

module.exports = new DiscountService();
