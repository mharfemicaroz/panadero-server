const departmentService = global.requireV2("services/hr/departmentService");

class DepartmentController {
  async list(req, res) {
    try {
      // Extract parameters with defaults
      const {
        page = 1,
        limit = 10,
        sort = "created_at",
        order = "DESC",
        is_active,
      } = req.query;

      // Use req.query.filters if provided; otherwise build filters from individual query params
      let filters = req.query.filters || {};

      // If some filters are provided as top-level parameters, add them
      if (is_active !== undefined) {
        filters.is_active = is_active === "true";
      }

      // Build query params using the new sort parameters
      const queryParams = {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        filters,
        sortBy: sort,
        sortOrder: order,
      };

      // Call the service to get the list
      const result = await departmentService.getList(queryParams);

      res.status(200).json({
        total: result.count,
        totalPages: Math.ceil(result.count / limit),
        currentPage: parseInt(page, 10),
        pageSize: parseInt(limit, 10),
        data: result.rows,
      });
    } catch (error) {
      res.status(500).json({
        message: "Error fetching departments",
        error: error.message,
      });
    }
  }

  async create(req, res) {
    try {
      const newDepartment = await departmentService.create(req.body);
      res.status(201).json(newDepartment);
    } catch (error) {
      res.status(500).json({
        message: "Error creating department",
        error: error.message,
      });
    }
  }

  async getById(req, res) {
    try {
      const department = await departmentService.getById(req.params.id);
      if (department) {
        res.status(200).json(department);
      } else {
        res.status(404).json({ message: "Department not found" });
      }
    } catch (error) {
      res.status(500).json({
        message: "Error fetching department",
        error: error.message,
      });
    }
  }

  async update(req, res) {
    try {
      const updatedDepartment = await departmentService.update(
        req.params.id,
        req.body
      );
      if (updatedDepartment) {
        res.status(200).json(updatedDepartment);
      } else {
        res.status(404).json({ message: "Department not found" });
      }
    } catch (error) {
      res.status(500).json({
        message: "Error updating department",
        error: error.message,
      });
    }
  }

  async delete(req, res) {
    try {
      const result = await departmentService.delete(req.params.id);
      if (result) {
        res.status(200).json({ message: "Department deleted" });
      } else {
        res.status(404).json({ message: "Department not found" });
      }
    } catch (error) {
      res.status(500).json({
        message: "Error deleting department",
        error: error.message,
      });
    }
  }
}

module.exports = new DepartmentController();
