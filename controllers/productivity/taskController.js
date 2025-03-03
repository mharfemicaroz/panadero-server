const taskService = global.requireV2("services/productivity/taskService");

class TaskController {
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

      const result = await taskService.getList(queryParams);
      return res.status(200).json({
        total: result.count,
        totalPages: Math.ceil(result.count / queryParams.limit),
        currentPage: queryParams.page,
        pageSize: queryParams.limit,
        data: result.rows,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Error fetching tasks",
        error: error.message,
      });
    }
  }

  async create(req, res) {
    try {
      const task = await taskService.create(req.body);
      return res.status(201).json(task);
    } catch (error) {
      return res.status(500).json({
        message: "Error creating task",
        error: error.message,
      });
    }
  }

  async getById(req, res) {
    try {
      const task = await taskService.getById(req.params.id);
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }
      return res.status(200).json(task);
    } catch (error) {
      return res.status(500).json({
        message: "Error fetching task",
        error: error.message,
      });
    }
  }

  async update(req, res) {
    try {
      const updatedTask = await taskService.update(req.params.id, req.body);
      if (!updatedTask) {
        return res.status(404).json({ message: "Task not found" });
      }
      return res.status(200).json(updatedTask);
    } catch (error) {
      return res.status(500).json({
        message: "Error updating task",
        error: error.message,
      });
    }
  }

  async delete(req, res) {
    try {
      const result = await taskService.delete(req.params.id);
      if (!result) {
        return res.status(404).json({ message: "Task not found" });
      }
      return res.status(200).json({ message: "Task deleted" });
    } catch (error) {
      return res.status(500).json({
        message: "Error deleting task",
        error: error.message,
      });
    }
  }

  /**
   * Add a comment to a task
   * POST /tasks/:id/comments
   */
  async addComment(req, res) {
    try {
      const newComment = await taskService.addComment(req.params.id, req.body);
      return res.status(201).json(newComment);
    } catch (error) {
      return res.status(500).json({
        message: "Error adding comment",
        error: error.message,
      });
    }
  }
}

module.exports = new TaskController();
