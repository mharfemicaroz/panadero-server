const categoryGroupService = global.requireV2(
  "services/product/categoryGroupService"
);

class CategoryGroupController {
  async list(req, res) {
    try {
      // Extract pagination and sorting parameters with optional defaults
      const { page, limit, sort, order } = req.query;

      // If filters are provided using the filters[...] syntax, use them.
      let filters = req.query.filters || {};

      // Build query params including sorting info.
      const queryParams = {
        page,
        limit,
        filters,
        sortBy: sort, // will default to repository default if undefined
        sortOrder: order, // will default to repository default if undefined
      };

      const result = await categoryGroupService.getList(queryParams);

      res.status(200).json({
        total: result.count,
        totalPages: limit ? Math.ceil(result.count / limit) : null,
        currentPage: limit ? parseInt(page, 10) : null,
        pageSize: limit ? parseInt(limit, 10) : null,
        data: result.rows,
      });
    } catch (error) {
      res.status(500).json({
        message: "Error fetching category groups",
        error: error.message,
      });
    }
  }

  async create(req, res) {
    try {
      const newCategoryGroup = await categoryGroupService.create(req.body);
      res.status(201).json(newCategoryGroup);
    } catch (error) {
      res.status(500).json({
        message: "Error creating category group",
        error: error.message,
      });
    }
  }

  async getById(req, res) {
    try {
      const categoryGroup = await categoryGroupService.getById(req.params.id);
      if (categoryGroup) {
        res.status(200).json(categoryGroup);
      } else {
        res.status(404).json({ message: "Category group not found" });
      }
    } catch (error) {
      res.status(500).json({
        message: "Error fetching category group",
        error: error.message,
      });
    }
  }

  async update(req, res) {
    try {
      const updatedCategoryGroup = await categoryGroupService.alter(
        req.params.id,
        req.body
      );
      if (updatedCategoryGroup) {
        res.status(200).json(updatedCategoryGroup);
      } else {
        res.status(404).json({ message: "Category group not found" });
      }
    } catch (error) {
      res.status(500).json({
        message: "Error updating category group",
        error: error.message,
      });
    }
  }

  async delete(req, res) {
    try {
      const result = await categoryGroupService.delete(req.params.id);
      if (result) {
        return res.status(200).json({ message: "Category group deleted" });
      } else {
        return res.status(404).json({ message: "Category group not found" });
      }
    } catch (error) {
      // Check if it’s a foreign key constraint error (Sequelize example)
      if (error.name === "SequelizeForeignKeyConstraintError") {
        // You can return a 400 or 409 depending on how you want to handle this conflict
        return res.status(409).json({
          message:
            "Cannot delete category group because it's referenced by other records",
        });
      }

      // For all other errors, return a generic 500 error
      return res.status(500).json({
        message: "Error deleting category group",
        error: error.message,
      });
    }
  }
}

module.exports = new CategoryGroupController();
