const subcategoryService = global.requireV2(
  "services/product/subcategoryService"
);

class SubcategoryController {
  async list(req, res) {
    try {
      const { page, limit, name, categoryId, is_active, sortBy, sortOrder } =
        req.query;

      const filters = {
        name,
        categoryId: categoryId ? parseInt(categoryId, 10) : undefined,
        is_active: is_active !== undefined ? is_active === "true" : undefined,
      };

      const queryParams = { page, limit, filters, sortBy, sortOrder };

      const result = await subcategoryService.getList(queryParams);

      res.status(200).json({
        total: result.count,
        totalPages: Math.ceil(result.count / limit),
        currentPage: parseInt(page, 10),
        pageSize: parseInt(limit, 10),
        data: result.rows,
      });
    } catch (error) {
      res.status(500).json({
        message: "Error fetching subcategories",
        error: error.message,
      });
    }
  }

  async listByCategory(req, res) {
    try {
      const { page, limit, sortBy, sortOrder } = req.query;
      const categoryId = parseInt(req.params.id, 10);

      if (isNaN(categoryId)) {
        return res.status(400).json({ message: "Invalid category ID" });
      }

      const queryParams = {
        page,
        limit,
        filters: { categoryId },
        sortBy,
        sortOrder,
      };

      const result = await subcategoryService.getList(queryParams);

      res.status(200).json({
        total: result.count,
        totalPages: Math.ceil(result.count / limit),
        currentPage: parseInt(page, 10),
        pageSize: parseInt(limit, 10),
        data: result.rows,
      });
    } catch (error) {
      res.status(500).json({
        message: "Error fetching subcategories",
        error: error.message,
      });
    }
  }

  async create(req, res) {
    try {
      const newSubcategory = await subcategoryService.create(req.body);
      res.status(201).json(newSubcategory);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error creating subcategory", error: error.message });
    }
  }

  async getById(req, res) {
    try {
      const subcategory = await subcategoryService.getById(req.params.id);
      if (subcategory) {
        res.status(200).json(subcategory);
      } else {
        res.status(404).json({ message: "Subcategory not found" });
      }
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error fetching subcategory", error: error.message });
    }
  }

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
      res
        .status(500)
        .json({ message: "Error updating subcategory", error: error.message });
    }
  }

  async delete(req, res) {
    try {
      const result = await subcategoryService.delete(req.params.id);
      if (result) {
        res.status(200).json({ message: "Subcategory deleted" });
      } else {
        res.status(404).json({ message: "Subcategory not found" });
      }
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error deleting subcategory", error: error.message });
    }
  }
}

module.exports = new SubcategoryController();
