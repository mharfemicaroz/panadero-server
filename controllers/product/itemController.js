const itemService = global.requireV2("services/product/itemService");

class ItemController {
  /**
   * Fetch paginated list of items with optional filters
   */
  async list(req, res) {
    try {
      // Extract parameters with defaults
      const {
        page = 1,
        limit = 10,
        sort = "created_at",
        order = "DESC",
        name,
        sku,
        warehouse_id,
        category_id,
        subcategory_id,
        sold_by,
      } = req.query;

      // Build filters
      let filters = req.query.filters || {};

      if (name) filters.name = name;
      if (sku) filters.sku = sku;
      if (warehouse_id) filters.warehouse_id = parseInt(warehouse_id, 10);
      if (category_id) filters.category_id = parseInt(category_id, 10);
      if (subcategory_id) filters.subcategory_id = parseInt(subcategory_id, 10);
      if (sold_by) filters.sold_by = sold_by;

      // Query parameters including sorting
      const queryParams = {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        filters,
        sortBy: sort,
        sortOrder: order,
      };

      const result = await itemService.getList(queryParams);

      res.status(200).json({
        total: result.count,
        totalPages: Math.ceil(result.count / limit),
        currentPage: parseInt(page, 10),
        pageSize: parseInt(limit, 10),
        data: result.rows.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          beginning_qty: item.beginning_qty,
          sku: item.sku,
          barcode: item.barcode,
          cost: item.cost,
          unit_of_measurement: item.unit_of_measurement,
          sold_by: item.sold_by,
          image: item.image,
          warehouse: item.warehouse
            ? { id: item.warehouse.id, name: item.warehouse.name }
            : null,
          category: item.category
            ? { id: item.category.id, name: item.category.name }
            : null,
          subcategory: item.subcategory
            ? {
                id: item.subcategory.id,
                name: item.subcategory.name,
                description: item.subcategory.description,
              }
            : null,
        })),
      });
    } catch (error) {
      res.status(500).json({
        message: "Error fetching items",
        error: error.message,
      });
    }
  }

  /**
   * Fetch items by category
   */
  async listByCategory(req, res) {
    try {
      const {
        page = 1,
        limit = 10,
        sort = "created_at",
        order = "DESC",
      } = req.query;
      const categoryId = parseInt(req.params.id, 10);

      if (isNaN(categoryId)) {
        return res.status(400).json({ message: "Invalid category ID" });
      }

      const queryParams = {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        filters: { category_id: categoryId },
        sortBy: sort,
        sortOrder: order,
      };

      const result = await itemService.getList(queryParams);

      res.status(200).json({
        total: result.count,
        totalPages: Math.ceil(result.count / limit),
        currentPage: parseInt(page, 10),
        pageSize: parseInt(limit, 10),
        data: result.rows,
      });
    } catch (error) {
      res.status(500).json({
        message: "Error fetching items by category",
        error: error.message,
      });
    }
  }

  /**
   * Create a new item
   */
  async create(req, res) {
    try {
      const newItem = await itemService.create(req.body);
      res.status(201).json(newItem);
    } catch (error) {
      res.status(500).json({
        message: "Error creating item",
        error: error.message,
      });
    }
  }

  /**
   * Fetch an item by ID
   */
  async getById(req, res) {
    try {
      const item = await itemService.getById(req.params.id);
      if (item) {
        res.status(200).json(item);
      } else {
        res.status(404).json({ message: "Item not found" });
      }
    } catch (error) {
      res.status(500).json({
        message: "Error fetching item",
        error: error.message,
      });
    }
  }

  /**
   * Update an item by ID
   */
  async update(req, res) {
    try {
      const updatedItem = await itemService.alter(req.params.id, req.body);
      if (updatedItem) {
        res.status(200).json(updatedItem);
      } else {
        res.status(404).json({ message: "Item not found" });
      }
    } catch (error) {
      res.status(500).json({
        message: "Error updating item",
        error: error.message,
      });
    }
  }

  /**
   * Delete an item by ID
   */
  async delete(req, res) {
    try {
      const result = await itemService.delete(req.params.id);
      if (result) {
        res.status(200).json({ message: "Item deleted" });
      } else {
        res.status(404).json({ message: "Item not found" });
      }
    } catch (error) {
      // Handle foreign key constraint error
      if (error.name === "SequelizeForeignKeyConstraintError") {
        return res.status(409).json({
          message:
            "Cannot delete item because it is referenced by other records",
        });
      }

      res.status(500).json({
        message: "Error deleting item",
        error: error.message,
      });
    }
  }
}

module.exports = new ItemController();
