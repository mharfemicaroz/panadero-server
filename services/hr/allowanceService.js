const allowanceRepository = global.requireV2(
  "repositories/hr/allowanceRepository"
);

class AllowanceService {
  async getList(queryParams) {
    return allowanceRepository.listing(queryParams);
  }

  async create(data) {
    return allowanceRepository.create(data);
  }

  async getById(id) {
    return allowanceRepository.getById(id);
  }

  async update(id, data) {
    return allowanceRepository.update(id, data);
  }

  async delete(id) {
    return allowanceRepository.delete(id);
  }

  async getActiveAllowances() {
    return allowanceRepository.getActiveAllowances();
  }

  async getRecurringAllowances() {
    return allowanceRepository.getRecurringAllowances();
  }

  async getTaxableAllowances() {
    return allowanceRepository.getTaxableAllowances();
  }

  async getNonTaxableAllowances() {
    return allowanceRepository.getNonTaxableAllowances();
  }
}

module.exports = new AllowanceService();
