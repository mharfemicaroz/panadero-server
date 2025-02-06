const subcategoryService = global.requireV2(
  "services/product/subcategoryService"
);

class SubcategoryController {
  /**
   * List all subcategories with pagination, sorting, and filters
   */
  async list(req, res) {
    try {
      const { page, limit, sort, order } = req.query;
      let filters = req.query.filters || {};

      const queryParams = {
        page,
        limit,
        filters,
        sortBy: sort,
        sortOrder: order,
      };

      const result = await subcategoryService.getList(queryParams);

      res.status(200).json({
        total: result.count,
        totalPages: limit ? Math.ceil(result.count / limit) : null,
        currentPage: limit ? parseInt(page, 10) : null,
        pageSize: limit ? parseInt(limit, 10) : null,
        data: result.rows,
      });
    } catch (error) {
      res.status(500).json({
        message: "Error fetching subcategories",
        error: error.message,
      });
    }
  }

  /**
   * List subcategories by category ID
   */
  async listByCategory(req, res) {
    try {
      const { page, limit, sort, order } = req.query;
      const categoryId = parseInt(req.params.id, 10);

      if (isNaN(categoryId)) {
        return res.status(400).json({ message: "Invalid category ID" });
      }

      const queryParams = {
        page,
        limit,
        filters: { categoryId },
        sortBy: sort,
        sortOrder: order,
      };

      const result = await subcategoryService.getList(queryParams);

      res.status(200).json({
        total: result.count,
        totalPages: limit ? Math.ceil(result.count / limit) : null,
        currentPage: limit ? parseInt(page, 10) : null,
        pageSize: limit ? parseInt(limit, 10) : null,
        data: result.rows,
      });
    } catch (error) {
      res.status(500).json({
        message: "Error fetching subcategories",
        error: error.message,
      });
    }
  }

  /**
   * Create a new subcategory
   */
  async create(req, res) {
    try {
      const newSubcategory = await subcategoryService.create(req.body);
      res.status(201).json(newSubcategory);
    } catch (error) {
      res.status(500).json({
        message: "Error creating subcategory",
        error: error.message,
      });
    }
  }

  /**
   * Get a subcategory by ID
   */
  async getById(req, res) {
    try {
      const subcategory = await subcategoryService.getById(req.params.id);
      if (subcategory) {
        res.status(200).json(subcategory);
      } else {
        res.status(404).json({ message: "Subcategory not found" });
      }
    } catch (error) {
      res.status(500).json({
        message: "Error fetching subcategory",
        error: error.message,
      });
    }
  }

  /**
   * Update an existing subcategory
   */
  async update(req, res) {
    try {
      const updatedSubcategory = await subcategoryService.alter(
        req.params.id,
        req.body
      );
      if (updatedSubcategory) {
        res.status(200).json(updatedSubcategory);
      } else {
        res.status(404).json({ message: "Subcategory not found" });
      }
    } catch (error) {
      res.status(500).json({
        message: "Error updating subcategory",
        error: error.message,
      });
    }
  }

  /**
   * Delete a subcategory
   */
  async delete(req, res) {
    try {
      const result = await subcategoryService.delete(req.params.id);
      if (result) {
        res.status(200).json({ message: "Subcategory deleted" });
      } else {
        res.status(404).json({ message: "Subcategory not found" });
      }
    } catch (error) {
      if (error.name === "SequelizeForeignKeyConstraintError") {
        return res.status(409).json({
          message:
            "Cannot delete subcategory because it's referenced by other records",
        });
      }
      res.status(500).json({
        message: "Error deleting subcategory",
        error: error.message,
      });
    }
  }
}

module.exports = new SubcategoryController();
