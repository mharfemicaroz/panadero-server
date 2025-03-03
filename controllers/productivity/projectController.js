const projectService = global.requireV2("services/productivity/projectService");

class ProjectController {
  async list(req, res) {
    try {
      const {
        page = 1,
        limit = 10,
        sort = "created_at",
        order = "DESC",
        ...rest
      } = req.query;

      const filters = { ...rest };
      const queryParams = {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        sortBy: sort,
        sortOrder: order,
        filters,
      };

      const result = await projectService.getList(queryParams);
      return res.status(200).json({
        total: result.count,
        totalPages: Math.ceil(result.count / queryParams.limit),
        currentPage: queryParams.page,
        pageSize: queryParams.limit,
        data: result.rows,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Error fetching projects",
        error: error.message,
      });
    }
  }

  async create(req, res) {
    try {
      const project = await projectService.create(req.body);
      return res.status(201).json(project);
    } catch (error) {
      return res.status(500).json({
        message: "Error creating project",
        error: error.message,
      });
    }
  }

  async getById(req, res) {
    try {
      const project = await projectService.getById(req.params.id);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      return res.status(200).json(project);
    } catch (error) {
      return res.status(500).json({
        message: "Error fetching project",
        error: error.message,
      });
    }
  }

  async update(req, res) {
    try {
      const updatedProject = await projectService.update(
        req.params.id,
        req.body
      );
      if (!updatedProject) {
        return res.status(404).json({ message: "Project not found" });
      }
      return res.status(200).json(updatedProject);
    } catch (error) {
      return res.status(500).json({
        message: "Error updating project",
        error: error.message,
      });
    }
  }

  async delete(req, res) {
    try {
      const result = await projectService.delete(req.params.id);
      if (!result) {
        return res.status(404).json({ message: "Project not found" });
      }
      return res.status(200).json({ message: "Project deleted" });
    } catch (error) {
      return res.status(500).json({
        message: "Error deleting project",
        error: error.message,
      });
    }
  }

  /**
   * Create a Task for this Project
   * POST /projects/:id/tasks
   */
  async createTask(req, res) {
    try {
      const newTask = await projectService.createTask(req.params.id, req.body);
      return res.status(201).json(newTask);
    } catch (error) {
      return res.status(500).json({
        message: "Error creating task for project",
        error: error.message,
      });
    }
  }
}

module.exports = new ProjectController();
