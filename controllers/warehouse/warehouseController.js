const warehouseService = global.requireV2(
  "services/warehouse/warehouseService"
);

class WarehouseController {
  /**
   * List all warehouses with pagination, filters, and sorting
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

      const result = await warehouseService.getList(queryParams);

      res.status(200).json({
        total: result.count,
        totalPages: limit ? Math.ceil(result.count / limit) : null,
        currentPage: limit ? parseInt(page, 10) : null,
        pageSize: limit ? parseInt(limit, 10) : null,
        data: result.rows,
      });
    } catch (error) {
      res.status(500).json({
        message: "Error fetching warehouses",
        error: error.message,
      });
    }
  }

  /**
   * Create a new warehouse
   */
  async create(req, res) {
    try {
      const newWarehouse = await warehouseService.create(req.body);
      res.status(201).json(newWarehouse);
    } catch (error) {
      res.status(500).json({
        message: "Error creating warehouse",
        error: error.message,
      });
    }
  }

  /**
   * Get a warehouse by ID
   */
  async getById(req, res) {
    try {
      const warehouse = await warehouseService.getById(req.params.id);
      if (warehouse) {
        res.status(200).json(warehouse);
      } else {
        res.status(404).json({ message: "Warehouse not found" });
      }
    } catch (error) {
      res.status(500).json({
        message: "Error fetching warehouse",
        error: error.message,
      });
    }
  }

  /**
   * Update an existing warehouse
   */
  async update(req, res) {
    try {
      const updatedWarehouse = await warehouseService.alter(
        req.params.id,
        req.body
      );
      if (updatedWarehouse) {
        res.status(200).json(updatedWarehouse);
      } else {
        res.status(404).json({ message: "Warehouse not found" });
      }
    } catch (error) {
      res.status(500).json({
        message: "Error updating warehouse",
        error: error.message,
      });
    }
  }

  /**
   * Delete a warehouse
   */
  async delete(req, res) {
    try {
      const result = await warehouseService.delete(req.params.id);
      if (result) {
        res.status(200).json({ message: "Warehouse deleted" });
      } else {
        res.status(404).json({ message: "Warehouse not found" });
      }
    } catch (error) {
      if (error.name === "SequelizeForeignKeyConstraintError") {
        return res.status(409).json({
          message:
            "Cannot delete warehouse because it's referenced by other records",
        });
      }
      res.status(500).json({
        message: "Error deleting warehouse",
        error: error.message,
      });
    }
  }
}

module.exports = new WarehouseController();
