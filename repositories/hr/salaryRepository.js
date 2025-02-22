const db = global.requireV2("models");
const Salary = db.Salary;
const AbstractRepository = global.requireV2("base/AbstractRepository");

class SalaryRepository extends AbstractRepository {
  constructor() {
    super(Salary);
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

    if (filters.employee_id) where.employee_id = filters.employee_id;
    if (filters.is_active !== undefined) where.is_active = filters.is_active;
    if (filters.effective_date) where.effective_date = filters.effective_date;

    return Salary.findAndCountAll({
      distinct: true,
      where,
      include: [
        {
          model: db.Employee,
          as: "employee",
          attributes: ["first_name", "last_name", "email"],
          include: [
            {
              model: db.Department,
              as: "department",
              attributes: ["name"],
            },
            {
              model: db.JobTitle,
              as: "jobTitle",
              attributes: ["title"],
            },
          ],
        },
      ],
      order: [[sortBy, sortOrder.toUpperCase()]],
      limit: parseInt(limit, 10),
      offset,
    });
  }

  async getById(id) {
    return Salary.findByPk(id, {
      include: [
        {
          model: db.Employee,
          as: "employee",
          attributes: ["first_name", "last_name", "email"],
          include: [
            {
              model: db.Department,
              as: "department",
              attributes: ["name"],
            },
            {
              model: db.JobTitle,
              as: "jobTitle",
              attributes: ["title"],
            },
          ],
        },
      ],
    });
  }

  async getCurrentSalary(employeeId) {
    return Salary.findOne({
      where: {
        employee_id: employeeId,
        is_active: true,
        effective_date: {
          [db.Sequelize.Op.lte]: new Date(),
        },
      },
      order: [["effective_date", "DESC"]],
    });
  }

  async create(data) {
    // Deactivate current active salary if exists
    await Salary.update(
      { is_active: false },
      {
        where: {
          employee_id: data.employee_id,
          is_active: true,
        },
      }
    );

    return Salary.create(data);
  }

  async update(id, data) {
    const salary = await this.getById(id);
    if (!salary) return null;
    return salary.update(data);
  }

  async delete(id) {
    const salary = await this.getById(id);
    if (!salary) return null;
    return salary.destroy();
  }

  async getSalaryHistory(employeeId) {
    return Salary.findAll({
      where: {
        employee_id: employeeId,
      },
      order: [["effective_date", "DESC"]],
    });
  }
}

module.exports = new SalaryRepository();
