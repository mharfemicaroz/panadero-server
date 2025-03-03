const db = global.requireV2("models");
const Task = db.Task;
const AbstractRepository = global.requireV2("base/AbstractRepository");

class TaskRepository extends AbstractRepository {
  constructor() {
    super(Task);
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

    if (filters.project_id) {
      where.project_id = filters.project_id;
    }
    if (filters.assigned_to) {
      where.assigned_to = filters.assigned_to;
    }
    if (filters.status) {
      where.status = filters.status;
    }
    if (filters.priority) {
      where.priority = filters.priority;
    }

    return Task.findAndCountAll({
      where,
      distinct: true,
      order: [[sortBy, sortOrder.toUpperCase()]],
      limit: parseInt(limit, 10),
      offset,
      include: [
        {
          model: db.Project,
          as: "project",
          attributes: ["id", "name", "description", "status"],
        },
        {
          model: db.Employee,
          as: "assignee",
          attributes: ["id", "first_name", "last_name", "email"],
        },
      ],
    });
  }

  // Retrieve a single task by ID with comments
  async getFullById(id) {
    return Task.findByPk(id, {
      include: [
        {
          model: db.Project,
          as: "project",
        },
        {
          model: db.Employee,
          as: "assignee",
        },
        {
          model: db.TaskComment,
          as: "comments",
          include: [
            {
              model: db.Employee,
              as: "employee",
            },
          ],
        },
      ],
    });
  }
}

module.exports = new TaskRepository();
