const db = global.requireV2("models");
const Attendance = db.Attendance;
const AbstractRepository = global.requireV2("base/AbstractRepository");

class AttendanceRepository extends AbstractRepository {
  constructor() {
    super(Attendance);
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
    if (filters.date) where.date = filters.date;
    if (filters.status) where.status = filters.status;
    if (filters.start_date && filters.end_date) {
      where.date = {
        [db.Sequelize.Op.between]: [filters.start_date, filters.end_date],
      };
    }

    return Attendance.findAndCountAll({
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
          ],
        },
      ],
      order: [[sortBy, sortOrder.toUpperCase()]],
      limit: parseInt(limit, 10),
      offset,
    });
  }

  async findByEmployeeAndDate(employeeId, date) {
    return Attendance.findOne({
      where: {
        employee_id: employeeId,
        date: date,
      },
    });
  }

  async findByEmployeeAndDateRange(employeeId, startDate, endDate) {
    return Attendance.findAll({
      where: {
        employee_id: employeeId,
        date: {
          [db.Sequelize.Op.between]: [startDate, endDate],
        },
      },
    });
  }

  async getById(id) {
    return Attendance.findByPk(id, {
      include: [
        {
          model: db.Employee,
          as: "employee",
          attributes: ["first_name", "last_name", "email"],
        },
      ],
    });
  }

  async create(data) {
    return Attendance.create(data);
  }

  async update(id, data) {
    const attendance = await this.getById(id);
    if (!attendance) return null;
    return attendance.update(data);
  }

  async delete(id) {
    const attendance = await this.getById(id);
    if (!attendance) return null;
    return attendance.destroy();
  }

  async getTimeLogs(employeeId, date) {
    return db.TimeLog.findAll({
      where: {
        employee_id: employeeId,
        log_time: {
          [db.Sequelize.Op.between]: [`${date} 00:00:00`, `${date} 23:59:59`],
        },
      },
      order: [["log_time", "ASC"]],
    });
  }
}

module.exports = new AttendanceRepository();
