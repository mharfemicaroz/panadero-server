const db = global.requireV2("models");
const Deduction = db.Deduction;
const AbstractRepository = global.requireV2("base/AbstractRepository");

class DeductionRepository extends AbstractRepository {
  constructor() {
    super(Deduction);
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
    if (filters.is_required !== undefined)
      where.is_required = filters.is_required;
    if (filters.frequency) where.frequency = filters.frequency;
    if (filters.is_active !== undefined) where.is_active = filters.is_active;

    return Deduction.findAndCountAll({
      distinct: true,
      where,
      order: [[sortBy, sortOrder.toUpperCase()]],
      limit: parseInt(limit, 10),
      offset,
    });
  }

  async getById(id) {
    return Deduction.findByPk(id);
  }

  async create(data) {
    return Deduction.create(data);
  }

  async update(id, data) {
    const deduction = await this.getById(id);
    if (!deduction) return null;
    return deduction.update(data);
  }

  async delete(id) {
    const deduction = await this.getById(id);
    if (!deduction) return null;
    return deduction.destroy();
  }

  async getActiveDeductions() {
    return Deduction.findAll({
      where: {
        is_active: true,
      },
      order: [
        ["is_required", "DESC"],
        ["name", "ASC"],
      ],
    });
  }

  async getRequiredDeductions() {
    return Deduction.findAll({
      where: {
        is_required: true,
        is_active: true,
      },
      order: [["name", "ASC"]],
    });
  }

  async getDeductionsByFrequency(frequency) {
    return Deduction.findAll({
      where: {
        frequency,
        is_active: true,
      },
      order: [["name", "ASC"]],
    });
  }

  async getEmployeeDeductions(employeeId, payrollId) {
    return db.PayrollDeduction.findAll({
      where: {
        payroll_id: payrollId,
      },
      include: [
        {
          model: db.Deduction,
          as: "deduction",
          where: {
            is_active: true,
          },
        },
      ],
    });
  }
}

module.exports = new DeductionRepository();
