const db = global.requireV2("models");
const Project = db.Project;
const AbstractRepository = global.requireV2("base/AbstractRepository");

class ProjectRepository extends AbstractRepository {
  constructor() {
    super(Project);
  }

  // Example custom listing method with pagination & filters
  async listing({
    page = 1,
    limit = 10,
    sortBy = "created_at",
    sortOrder = "DESC",
    filters = {},
  }) {
    const offset = (page - 1) * limit;
    const where = {};

    if (filters.status) {
      where.status = filters.status;
    }
    if (filters.manager_id) {
      where.manager_id = filters.manager_id;
    }

    return Project.findAndCountAll({
      where,
      distinct: true,
      order: [[sortBy, sortOrder.toUpperCase()]],
      limit: parseInt(limit, 10),
      offset,
      include: [
        {
          model: db.Employee,
          as: "manager",
          attributes: ["id", "first_name", "last_name", "email"],
        },
      ],
    });
  }

  // Retrieve a single project by ID with tasks
  async getFullById(id) {
    return Project.findByPk(id, {
      include: [
        {
          model: db.Employee,
          as: "manager",
        },
        {
          model: db.Task,
          as: "tasks",
          include: [
            {
              model: db.Employee,
              as: "assignee",
            },
          ],
        },
      ],
    });
  }
}

module.exports = new ProjectRepository();
