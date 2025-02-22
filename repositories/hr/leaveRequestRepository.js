const db = global.requireV2("models");
const LeaveRequest = db.LeaveRequest;
const AbstractRepository = global.requireV2("base/AbstractRepository");

class LeaveRequestRepository extends AbstractRepository {
  constructor() {
    super(LeaveRequest);
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
    if (filters.status) where.status = filters.status;

    return LeaveRequest.findAndCountAll({
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
    return LeaveRequest.findByPk(id, {
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

  async create(data) {
    return LeaveRequest.create(data);
  }

  async update(id, data) {
    const leaveRequest = await this.getById(id);
    if (!leaveRequest) return null;
    return leaveRequest.update(data);
  }

  async delete(id) {
    const leaveRequest = await this.getById(id);
    if (!leaveRequest) return null;
    return leaveRequest.destroy();
  }

  async reject(id, reason) {
    const leaveRequest = await this.getById(id);
    if (!leaveRequest) return null;
    return leaveRequest.update({ status: "rejected", remarks: reason });
  }

  async escalate(id, approverId) {
    const leaveRequest = await this.getById(id);
    if (!leaveRequest) return null;
    return leaveRequest.update({ approver_id: approverId });
  }
}

module.exports = new LeaveRequestRepository();
