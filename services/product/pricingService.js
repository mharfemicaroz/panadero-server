const pricingRepository = require("@repositories/product/pricingRepository");

class PricingService {
  async getList(queryParams) {
    return pricingRepository.listing(queryParams);
  }

  async create(data) {
    return pricingRepository.create(data);
  }

  async getById(id) {
    return pricingRepository.getById(id);
  }

  async alter(id, data) {
    return pricingRepository.update(id, data);
  }

  async delete(id) {
    return pricingRepository.delete(id);
  }
}

module.exports = new PricingService();
