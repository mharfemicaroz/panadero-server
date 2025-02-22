const deductionRepository = global.requireV2(
  "repositories/hr/deductionRepository"
);

class DeductionService {
  async getList(queryParams) {
    return deductionRepository.listing(queryParams);
  }

  async create(data) {
    return deductionRepository.create(data);
  }

  async getById(id) {
    return deductionRepository.getById(id);
  }

  async update(id, data) {
    return deductionRepository.update(id, data);
  }

  async delete(id) {
    return deductionRepository.delete(id);
  }

  async getActiveDeductions() {
    return deductionRepository.getActiveDeductions();
  }

  async getRequiredDeductions() {
    return deductionRepository.getRequiredDeductions();
  }

  async getDeductionsByFrequency(frequency) {
    return deductionRepository.getDeductionsByFrequency(frequency);
  }
}

module.exports = new DeductionService();
