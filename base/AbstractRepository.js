const RepositoryInterface = require("./interface/RepositoryInterface");

class AbstractRepository {
  constructor(model) {
    this.model = model;
  }

  async create(data) {
    return await this.model.create(data);
  }

  async updateByPk(id, data) {
    const record = await this.getByPk(id);
    if (!record) return null;
    return await record.update(data);
  }

  async getByPk(id, options = {}) {
    return await this.model.findByPk(id, options); // Ensure the options (include) are passed
  }

  async getAll(options = {}) {
    return await this.model.findAll({
      ...options,
      limit: 15,
    });
  }

  async deleteByPk(id) {
    const record = await this.getByPk(id);
    if (!record) return false;
    await record.destroy();
    return true;
  }
}

// Enforce adherence to RepositoryInterface
Object.setPrototypeOf(
  AbstractRepository.prototype,
  RepositoryInterface.prototype
);

module.exports = AbstractRepository;
