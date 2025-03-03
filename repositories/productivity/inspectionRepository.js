const db = global.requireV2("models");
const Inspection = db.Inspection;
const AbstractRepository = global.requireV2("base/AbstractRepository");

class InspectionRepository extends AbstractRepository {
  constructor() {
    super(Inspection);
  }

  async listing({
    page = 1,
    limit = 10,
    sortBy = "created_at",
    sortOrder = "DESC",
    filters = {},
  }) {
    const offset = (page - 1) * limit;
    const where = {};

    if (filters.department_id) {
      where.department_id = filters.department_id;
    }
    if (filters.manager_id) {
      where.manager_id = filters.manager_id;
    }
    if (filters.status) {
      where.status = filters.status;
    }
    if (filters.is_scheduled !== undefined) {
      where.is_scheduled = filters.is_scheduled;
    }

    return Inspection.findAndCountAll({
      where,
      distinct: true,
      order: [[sortBy, sortOrder.toUpperCase()]],
      limit: parseInt(limit, 10),
      offset,
      include: [
        {
          model: db.Department, // from models/hr
          as: "department",
          attributes: ["id", "name"],
        },
        {
          model: db.Employee, // from models/hr
          as: "manager",
          attributes: ["id", "first_name", "last_name", "email"],
        },
      ],
    });
  }

  async getFullById(id) {
    return Inspection.findByPk(id, {
      include: [
        { model: db.Department, as: "department" },
        { model: db.Employee, as: "manager" },
        { model: db.InspectionQuestion, as: "questions" },
        { model: db.InspectionResponse, as: "responses" },
        { model: db.InspectionIssue, as: "issues" },
      ],
    });
  }
}

module.exports = new InspectionRepository();
