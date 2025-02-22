const db = global.requireV2("models");
const TimeLog = db.TimeLog;
const AbstractRepository = global.requireV2("base/AbstractRepository");

class TimeLogRepository extends AbstractRepository {
  constructor() {
    super(TimeLog);
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
    if (filters.type) where.type = filters.type;
    if (filters.start_date && filters.end_date) {
      where.log_time = {
        [db.Sequelize.Op.between]: [filters.start_date, filters.end_date],
      };
    }

    return TimeLog.findAndCountAll({
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

  async getById(id) {
    return TimeLog.findByPk(id, {
      include: [
        {
          model: db.Employee,
          as: "employee",
          attributes: ["first_name", "last_name", "email"],
        },
      ],
    });
  }

  async getLatestLogByEmployee(employeeId, type) {
    return TimeLog.findOne({
      where: {
        employee_id: employeeId,
        type,
      },
      order: [["log_time", "DESC"]],
    });
  }

  async getDailyLogs({
    page = 1,
    limit = 10,
    filters = {},
    sortBy = "created_at",
    sortOrder = "DESC",
    date,
  }) {
    // If date is not provided, use today's date in "YYYY-MM-DD" format.
    if (!date) {
      date = new Date().toISOString().split("T")[0];
    }

    // Calculate start and end of the day.
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    // Build where clause
    const where = {};
    if (filters.employee_id) {
      where.employee_id = filters.employee_id;
    }
    where.log_time = {
      [db.Sequelize.Op.between]: [startOfDay, endOfDay],
    };

    const offset = (page - 1) * limit;

    const result = await TimeLog.findAndCountAll({
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

    return result;
  }

  async create(data) {
    return TimeLog.create(data);
  }

  async update(id, data) {
    const timeLog = await this.getById(id);
    if (!timeLog) return null;
    return timeLog.update(data);
  }

  async delete(id) {
    const timeLog = await this.getById(id);
    if (!timeLog) return null;
    return timeLog.destroy();
  }
}

module.exports = new TimeLogRepository();
