const cashRegisterRepository = global.requireV2(
  "repositories/product/cashRegisterRepository"
);

class CashRegisterService {
  async getList(queryParams) {
    return await cashRegisterRepository.listing(queryParams);
  }

  async create(data) {
    return await cashRegisterRepository.create(data);
  }

  async getById(id) {
    return await cashRegisterRepository.getById(id);
  }

  async alter(id, data) {
    return await cashRegisterRepository.update(id, data);
  }

  async delete(id) {
    return await cashRegisterRepository.delete(id);
  }
}

module.exports = new CashRegisterService();
