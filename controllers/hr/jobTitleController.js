const jobTitleService = global.requireV2("services/hr/jobTitleService");

class JobTitleController {
  async list(req, res) {
    try {
      // Extract parameters with defaults
      const {
        page = 1,
        limit = 10,
        sort = "created_at",
        order = "DESC",
        departmentId,
        is_active,
      } = req.query;

      // Use req.query.filters if provided; otherwise build filters from individual query params
      let filters = req.query.filters || {};

      // If some filters are provided as top-level parameters, add them
      if (departmentId) {
        filters.departmentId = parseInt(departmentId, 10);
      }
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
      const result = await jobTitleService.getList(queryParams);

      res.status(200).json({
        total: result.count,
        totalPages: Math.ceil(result.count / limit),
        currentPage: parseInt(page, 10),
        pageSize: parseInt(limit, 10),
        data: result.rows,
      });
    } catch (error) {
      res.status(500).json({
        message: "Error fetching job titles",
        error: error.message,
      });
    }
  }

  async create(req, res) {
    try {
      const newJobTitle = await jobTitleService.create(req.body);
      res.status(201).json(newJobTitle);
    } catch (error) {
      res.status(500).json({
        message: "Error creating job title",
        error: error.message,
      });
    }
  }

  async getById(req, res) {
    try {
      const jobTitle = await jobTitleService.getById(req.params.id);
      if (jobTitle) {
        res.status(200).json(jobTitle);
      } else {
        res.status(404).json({ message: "Job title not found" });
      }
    } catch (error) {
      res.status(500).json({
        message: "Error fetching job title",
        error: error.message,
      });
    }
  }

  async update(req, res) {
    try {
      const updatedJobTitle = await jobTitleService.update(
        req.params.id,
        req.body
      );
      if (updatedJobTitle) {
        res.status(200).json(updatedJobTitle);
      } else {
        res.status(404).json({ message: "Job title not found" });
      }
    } catch (error) {
      res.status(500).json({
        message: "Error updating job title",
        error: error.message,
      });
    }
  }

  async delete(req, res) {
    try {
      const result = await jobTitleService.delete(req.params.id);
      if (result) {
        res.status(200).json({ message: "Job title deleted" });
      } else {
        res.status(404).json({ message: "Job title not found" });
      }
    } catch (error) {
      res.status(500).json({
        message: "Error deleting job title",
        error: error.message,
      });
    }
  }
}

module.exports = new JobTitleController();
