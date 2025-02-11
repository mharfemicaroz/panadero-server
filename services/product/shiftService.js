const shiftRepository = global.requireV2(
  "repositories/product/shiftRepository"
);

class ShiftService {
  async getList(queryParams) {
    return await shiftRepository.listing(queryParams);
  }

  async create(data) {
    return await shiftRepository.create(data);
  }

  async getById(id) {
    return await shiftRepository.getById(id);
  }

  async alter(id, data) {
    return await shiftRepository.update(id, data);
  }

  async delete(id) {
    return await shiftRepository.delete(id);
  }
}

module.exports = new ShiftService();
