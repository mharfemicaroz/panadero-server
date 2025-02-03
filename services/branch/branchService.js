const branchRepository = require("../../repositories/branch/branchRepository");

class BranchService {
  async getList(queryParams) {
    return await branchRepository.listing(queryParams);
  }
  async create(data) {
    return await branchRepository.create(data);
  }
  async getById(id) {
    return await branchRepository.getById(id);
  }
  async alter(id, data) {
    return await branchRepository.update(id, data);
  }
  async delete(id) {
    return await branchRepository.delete(id);
  }
}

module.exports = new BranchService();
