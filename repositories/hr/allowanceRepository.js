const db = global.requireV2("models");
const Allowance = db.Allowance;
const AbstractRepository = global.requireV2("base/AbstractRepository");

class AllowanceRepository extends AbstractRepository {
  constructor() {
    super(Allowance);
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

    if (filters.type) where.type = filters.type;
    if (filters.is_recurring !== undefined)
      where.is_recurring = filters.is_recurring;
    if (filters.is_taxable !== undefined) where.is_taxable = filters.is_taxable;
    if (filters.frequency) where.frequency = filters.frequency;
    if (filters.is_active !== undefined) where.is_active = filters.is_active;

    return Allowance.findAndCountAll({
      distinct: true,
      where,
      order: [[sortBy, sortOrder.toUpperCase()]],
      limit: parseInt(limit, 10),
      offset,
    });
  }

  async getById(id) {
    return Allowance.findByPk(id);
  }

  async create(data) {
    return Allowance.create(data);
  }

  async update(id, data) {
    const allowance = await this.getById(id);
    if (!allowance) return null;
    return allowance.update(data);
  }

  async delete(id) {
    const allowance = await this.getById(id);
    if (!allowance) return null;
    return allowance.destroy();
  }

  async getActiveAllowances() {
    return Allowance.findAll({
      where: {
        is_active: true,
      },
      order: [
        ["type", "ASC"],
        ["name", "ASC"],
      ],
    });
  }

  async getAllowancesByFrequency(frequency) {
    return Allowance.findAll({
      where: {
        frequency,
        is_active: true,
      },
      order: [["name", "ASC"]],
    });
  }

  async getTaxableAllowances() {
    return Allowance.findAll({
      where: {
        is_taxable: true,
        is_active: true,
      },
      order: [["name", "ASC"]],
    });
  }

  async getNonTaxableAllowances() {
    return Allowance.findAll({
      where: {
        is_taxable: false,
        is_active: true,
      },
      order: [["name", "ASC"]],
    });
  }

  async getEmployeeAllowances(employeeId, payrollId) {
    return db.PayrollAllowance.findAll({
      where: {
        payroll_id: payrollId,
      },
      include: [
        {
          model: db.Allowance,
          as: "allowance",
          where: {
            is_active: true,
          },
        },
      ],
    });
  }

  async getRecurringAllowances() {
    return Allowance.findAll({
      where: {
        is_recurring: true,
        is_active: true,
      },
      order: [["name", "ASC"]],
    });
  }
}

module.exports = new AllowanceRepository();
