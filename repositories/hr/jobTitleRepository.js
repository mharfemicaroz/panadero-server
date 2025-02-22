const db = global.requireV2("models");
const JobTitle = db.JobTitle;
const AbstractRepository = global.requireV2("base/AbstractRepository");

class JobTitleRepository extends AbstractRepository {
  constructor() {
    super(JobTitle);
  }

  async listing({
    page = 1,
    limit = 10,
    filters = {},
    sortBy = "created_at",
    sortOrder = "DESC",
  }) {
    const offset = (page - 1) * limit;
    const where = {};

    if (filters.title)
      where.title = { [db.Sequelize.Op.like]: `%${filters.title}%` };

    return JobTitle.findAndCountAll({
      distinct: true,
      where,
      order: [[sortBy, sortOrder.toUpperCase()]],
      limit: parseInt(limit, 10),
      offset,
    });
  }

  async create(data) {
    return await JobTitle.create(data);
  }

  async getById(id) {
    return await JobTitle.findByPk(id);
  }

  async update(id, data) {
    const jobTitle = await this.getById(id);
    if (!jobTitle) return null;
    return await jobTitle.update(data);
  }

  async delete(id) {
    const jobTitle = await this.getById(id);
    if (!jobTitle) return null;
    return await jobTitle.destroy();
  }
}

module.exports = new JobTitleRepository();
