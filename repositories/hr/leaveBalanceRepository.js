const db = global.requireV2("models");
const LeaveBalance = db.LeaveBalance;
const AbstractRepository = global.requireV2("base/AbstractRepository");

class LeaveBalanceRepository extends AbstractRepository {
  constructor() {
    super(LeaveBalance);
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
    if (filters.leave_type_id) where.leave_type_id = filters.leave_type_id;
    if (filters.is_active) where.is_active = filters.is_active;

    return LeaveBalance.findAndCountAll({
      distinct: true,
      where,
      include: [
        {
          model: db.Employee,
          as: "employee",
          attributes: ["first_name", "last_name", "email"],
        },
        {
          model: db.LeaveType,
          as: "leaveType",
          attributes: ["name"],
        },
      ],
      order: [[sortBy, sortOrder.toUpperCase()]],
      limit: parseInt(limit, 10),
      offset,
    });
  }

  async getById(id) {
    return LeaveBalance.findByPk(id);
  }

  async create(data) {
    return LeaveBalance.create(data);
  }

  async update(id, data) {
    const leaveBalance = await this.getById(id);
    if (!leaveBalance) return null;
    return leaveBalance.update(data);
  }

  async delete(id) {
    const leaveBalance = await this.getById(id);
    if (!leaveBalance) return null;
    return leaveBalance.destroy();
  }

  async getEmployeeLeaveBalance(employeeId) {
    return LeaveBalance.findOne({
      where: { employee_id: employeeId },
      include: [
        {
          model: db.Employee,
          as: "employee",
          attributes: ["first_name", "last_name", "email"],
        },
        {
          model: db.LeaveType,
          as: "leaveType",
          attributes: ["name"],
        },
      ],
    });
  }

  async deductLeaveBalance(employeeId, leaveTypeId, days) {
    const leaveBalance = await LeaveBalance.findOne({
      where: { employee_id: employeeId, leave_type_id: leaveTypeId },
    });

    if (!leaveBalance) {
      throw new Error("Leave balance not found");
    }

    if (leaveBalance.remaining_days < days) {
      throw new Error("Insufficient leave balance");
    }

    leaveBalance.used_days += days;
    leaveBalance.remaining_days -= days;

    return leaveBalance.save();
  }
}

module.exports = new LeaveBalanceRepository();
