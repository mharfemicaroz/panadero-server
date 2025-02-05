const categoryService = global.requireV2("services/product/categoryService");

class CategoryController {
  async list(req, res) {
    try {
      // Extract parameters with defaults
      const {
        page = 1,
        limit = 10,
        sort = "created_at", // default column to sort by
        order = "DESC", // default sort order
        categoryGroupId,
        is_active,
      } = req.query;

      // Use req.query.filters if provided; otherwise build filters from individual query params.
      let filters = req.query.filters || {};

      // If some filters are provided as top-level parameters, add them.
      if (categoryGroupId) {
        filters.categoryGroupId = parseInt(categoryGroupId, 10);
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
      const result = await categoryService.getList(queryParams);

      res.status(200).json({
        total: result.count,
        totalPages: Math.ceil(result.count / limit),
        currentPage: parseInt(page, 10),
        pageSize: parseInt(limit, 10),
        data: result.rows,
      });
    } catch (error) {
      res.status(500).json({
        message: "Error fetching categories",
        error: error.message,
      });
    }
  }

  async showAll(req, res) {
    try {
      const { warehouse_id } = req.query;
      const warehouseId = warehouse_id ? parseInt(warehouse_id, 10) : undefined;
      const categories = await categoryService.getAllWithProducts(warehouseId);
      const formattedResponse = {
        total: categories.length,
        totalPages: null,
        currentPage: null,
        pageSize: null,
        data: {
          categories: categories.map((category) => ({
            name: category.name,
            subcategories: category.subcategories.map((subcategory) => ({
              name: subcategory.name,
              products: subcategory.products.map((product) => ({
                id: product.id,
                name: product.name,
                price: parseFloat(product.price),
                inventories: product.inventories.map((inv) => ({
                  warehouse: inv.warehouse
                    ? {
                        id: inv.warehouse.id,
                        name: inv.warehouse.name,
                      }
                    : null,
                  current_quantity: inv.current_quantity,
                  minimum_quantity: inv.minimum_quantity,
                  maximum_quantity: inv.maximum_quantity,
                  reorder_level: inv.reorder_level,
                })),
              })),
            })),
            products: category.products.map((product) => ({
              id: product.id,
              name: product.name,
              price: parseFloat(product.price),
              inventories: product.inventories.map((inv) => ({
                warehouse: inv.warehouse
                  ? {
                      id: inv.warehouse.id,
                      name: inv.warehouse.name,
                    }
                  : null,
                current_quantity: inv.current_quantity,
                minimum_quantity: inv.minimum_quantity,
                maximum_quantity: inv.maximum_quantity,
                reorder_level: inv.reorder_level,
              })),
            })),
          })),
        },
      };
      res.status(200).json(formattedResponse);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error fetching categories", error: error.message });
    }
  }

  async create(req, res) {
    try {
      const newCategory = await categoryService.create(req.body);
      res.status(201).json(newCategory);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error creating category", error: error.message });
    }
  }

  async getById(req, res) {
    try {
      const category = await categoryService.getById(req.params.id);
      if (category) {
        res.status(200).json(category);
      } else {
        res.status(404).json({ message: "Category not found" });
      }
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error fetching category", error: error.message });
    }
  }

  async update(req, res) {
    try {
      const updatedCategory = await categoryService.alter(
        req.params.id,
        req.body
      );
      if (updatedCategory) {
        res.status(200).json(updatedCategory);
      } else {
        res.status(404).json({ message: "Category not found" });
      }
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error updating category", error: error.message });
    }
  }

  async delete(req, res) {
    try {
      const result = await categoryService.delete(req.params.id);
      if (result) {
        res.status(200).json({ message: "Category deleted" });
      } else {
        res.status(404).json({ message: "Category not found" });
      }
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error deleting category", error: error.message });
    }
  }
}

module.exports = new CategoryController();
