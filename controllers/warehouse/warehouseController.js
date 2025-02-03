const warehouseService = global.requireV2(
  "services/warehouse/warehouseService"
);

class WarehouseController {
  async list(req, res) {
    try {
      const { page, limit, name, location, is_active, sortBy, sortOrder } =
        req.query;

      const filters = {
        name,
        location,
        is_active: is_active !== undefined ? is_active === "true" : undefined,
      };

      const queryParams = { page, limit, filters, sortBy, sortOrder };

      const result = await warehouseService.getList(queryParams);

      res.status(200).json({
        total: result.count,
        totalPages: Math.ceil(result.count / limit),
        currentPage: parseInt(page, 10),
        pageSize: parseInt(limit, 10),
        data: result.rows,
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error fetching warehouses", error: error.message });
    }
  }

  async create(req, res) {
    try {
      const newWarehouse = await warehouseService.create(req.body);
      res.status(201).json(newWarehouse);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error creating warehouse", error: error.message });
    }
  }

  async getById(req, res) {
    try {
      const warehouse = await warehouseService.getById(req.params.id);
      if (warehouse) {
        res.status(200).json(warehouse);
      } else {
        res.status(404).json({ message: "Warehouse not found" });
      }
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error fetching warehouse", error: error.message });
    }
  }

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
      res
        .status(500)
        .json({ message: "Error updating warehouse", error: error.message });
    }
  }

  async delete(req, res) {
    try {
      const result = await warehouseService.delete(req.params.id);
      if (result) {
        res.status(200).json({ message: "Warehouse deleted" });
      } else {
        res.status(404).json({ message: "Warehouse not found" });
      }
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error deleting warehouse", error: error.message });
    }
  }
}

module.exports = new WarehouseController();
