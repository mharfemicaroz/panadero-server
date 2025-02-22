const db = global.requireV2("models");
const Employee = db.Employee;
const AbstractRepository = global.requireV2("base/AbstractRepository");

class EmployeeRepository extends AbstractRepository {
  constructor() {
    super(Employee);
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

    if (filters.first_name)
      where.first_name = { [db.Sequelize.Op.like]: `%${filters.first_name}%` };
    if (filters.last_name)
      where.last_name = { [db.Sequelize.Op.like]: `%${filters.last_name}%` };
    if (filters.email) where.email = filters.email;
    if (filters.status) where.status = filters.status;

    return Employee.findAndCountAll({
      distinct: true,
      where,
      order: [[sortBy, sortOrder.toUpperCase()]],
      include: [
        {
          model: db.Department,
          as: "department",
          attributes: ["name", "description"],
        },
        {
          model: db.JobTitle,
          as: "jobTitle",
          attributes: ["title", "description"],
        },
      ],
      limit: parseInt(limit, 10),
      offset,
    });
  }

  async getById(id) {
    return await Employee.findByPk(id);
  }

  async create(data) {
    return await Employee.create(data);
  }

  async update(id, data) {
    const employee = await this.getById(id);
    if (!employee) return null;
    return await employee.update(data);
  }

  async delete(id) {
    const employee = await this.getById(id);
    if (!employee) return null;
    return await employee.destroy();
  }
}

module.exports = new EmployeeRepository();
