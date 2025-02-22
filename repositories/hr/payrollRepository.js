const db = global.requireV2("models");
const Payroll = db.Payroll;
const AbstractRepository = global.requireV2("base/AbstractRepository");

class PayrollRepository extends AbstractRepository {
  constructor() {
    super(Payroll);
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
    if (filters.status) where.status = filters.status;
    if (filters.payment_method) where.payment_method = filters.payment_method;
    if (filters.start_date && filters.end_date) {
      where.payroll_date = {
        [db.Sequelize.Op.between]: [filters.start_date, filters.end_date],
      };
    }

    return Payroll.findAndCountAll({
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
        {
          model: db.PayrollDeduction,
          as: "payroll_deductions",
          include: [
            {
              model: db.Deduction,
              as: "deduction",
            },
          ],
        },
        {
          model: db.PayrollAllowance,
          as: "payroll_allowances",
          include: [
            {
              model: db.Allowance,
              as: "allowance",
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
    return Payroll.findByPk(id, {
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
        {
          model: db.PayrollDeduction,
          as: "payroll_deductions",
          include: [
            {
              model: db.Deduction,
              as: "deduction",
            },
          ],
        },
        {
          model: db.PayrollAllowance,
          as: "payroll_allowances",
          include: [
            {
              model: db.Allowance,
              as: "allowance",
            },
          ],
        },
      ],
    });
  }

  async create(payrollData, deductions = [], allowances = []) {
    const result = await db.sequelize.transaction(async (t) => {
      // Create payroll record
      const payroll = await Payroll.create(payrollData, { transaction: t });

      // Create payroll deductions
      if (deductions.length > 0) {
        const payrollDeductions = deductions.map((d) => ({
          ...d,
          payroll_id: payroll.id,
        }));
        await db.PayrollDeduction.bulkCreate(payrollDeductions, {
          transaction: t,
        });
      }

      // Create payroll allowances
      if (allowances.length > 0) {
        const payrollAllowances = allowances.map((a) => ({
          ...a,
          payroll_id: payroll.id,
        }));
        await db.PayrollAllowance.bulkCreate(payrollAllowances, {
          transaction: t,
        });
      }

      return payroll;
    });

    return this.getById(result.id);
  }

  async update(id, payrollData, deductions = [], allowances = []) {
    const result = await db.sequelize.transaction(async (t) => {
      const payroll = await Payroll.findByPk(id);
      if (!payroll) return null;

      // Update payroll record
      await payroll.update(payrollData, { transaction: t });

      // Update deductions
      if (deductions.length > 0) {
        await db.PayrollDeduction.destroy({
          where: { payroll_id: id },
          transaction: t,
        });
        const payrollDeductions = deductions.map((d) => ({
          ...d,
          payroll_id: id,
        }));
        await db.PayrollDeduction.bulkCreate(payrollDeductions, {
          transaction: t,
        });
      }

      // Update allowances
      if (allowances.length > 0) {
        await db.PayrollAllowance.destroy({
          where: { payroll_id: id },
          transaction: t,
        });
        const payrollAllowances = allowances.map((a) => ({
          ...a,
          payroll_id: id,
        }));
        await db.PayrollAllowance.bulkCreate(payrollAllowances, {
          transaction: t,
        });
      }

      return payroll;
    });

    return this.getById(id);
  }

  async delete(id) {
    return db.sequelize.transaction(async (t) => {
      const payroll = await Payroll.findByPk(id);
      if (!payroll) return null;

      // Delete associated records
      await db.PayrollDeduction.destroy({
        where: { payroll_id: id },
        transaction: t,
      });
      await db.PayrollAllowance.destroy({
        where: { payroll_id: id },
        transaction: t,
      });

      // Delete payroll record
      return payroll.destroy({ transaction: t });
    });
  }
}

module.exports = new PayrollRepository();
