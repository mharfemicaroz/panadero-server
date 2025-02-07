const inventoryService = global.requireV2("services/product/inventoryService");

class InventoryController {
  /**
   * Fetch paginated list of inventory records with optional filters.
   */
  async list(req, res) {
    try {
      const {
        page = 1,
        limit = 10,
        sort = "created_at",
        order = "DESC",
        item_id,
        warehouse_id,
      } = req.query;

      // Build filters
      const filters = {
        item_id: item_id ? parseInt(item_id, 10) : undefined,
        warehouse_id: warehouse_id ? parseInt(warehouse_id, 10) : undefined,
      };

      // Query parameters including sorting
      const queryParams = {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        filters,
        sortBy: sort,
        sortOrder: order,
      };

      const result = await inventoryService.getList(queryParams);

      res.status(200).json({
        total: result.count,
        totalPages: Math.ceil(result.count / limit),
        currentPage: parseInt(page, 10),
        pageSize: parseInt(limit, 10),
        data: result.rows,
      });
    } catch (error) {
      res.status(500).json({
        message: "Error fetching inventory records",
        error: error.message,
      });
    }
  }

  /**
   * Create a new inventory record.
   */
  async create(req, res) {
    try {
      const newRecord = await inventoryService.create(req.body);
      res.status(201).json(newRecord);
    } catch (error) {
      res.status(500).json({
        message: "Error creating inventory record",
        error: error.message,
      });
    }
  }

  /**
   * Fetch an inventory record by ID.
   */
  async getById(req, res) {
    try {
      const record = await inventoryService.getById(req.params.id);
      if (record) {
        res.status(200).json(record);
      } else {
        res.status(404).json({ message: "Inventory record not found" });
      }
    } catch (error) {
      res.status(500).json({
        message: "Error fetching inventory record",
        error: error.message,
      });
    }
  }

  /**
   * Update an inventory record.
   */
  async update(req, res) {
    try {
      const updatedRecord = await inventoryService.alter(
        req.params.id,
        req.body
      );
      if (updatedRecord) {
        res.status(200).json(updatedRecord);
      } else {
        res.status(404).json({ message: "Inventory record not found" });
      }
    } catch (error) {
      res.status(500).json({
        message: "Error updating inventory record",
        error: error.message,
      });
    }
  }

  /**
   * Delete an inventory record.
   */
  async delete(req, res) {
    try {
      const result = await inventoryService.delete(req.params.id);
      if (result) {
        res.status(200).json({ message: "Inventory record deleted" });
      } else {
        res.status(404).json({ message: "Inventory record not found" });
      }
    } catch (error) {
      // Handle foreign key constraint error
      if (error.name === "SequelizeForeignKeyConstraintError") {
        return res.status(409).json({
          message:
            "Cannot delete inventory record because it is referenced by other records",
        });
      }

      res.status(500).json({
        message: "Error deleting inventory record",
        error: error.message,
      });
    }
  }

  /**
   * Adjust inventory quantity: expects { quantityChange } in body.
   * Positive value means stock IN, negative value means stock OUT.
   */
  async adjustQuantity(req, res) {
    try {
      const { quantityChange } = req.body;
      if (typeof quantityChange !== "number") {
        return res
          .status(400)
          .json({ message: "quantityChange must be a number" });
      }
      // Assuming your auth middleware attaches the user to req.user
      const userId = req.user ? req.user.id : null;
      const updatedInventory = await inventoryService.adjustQuantity(
        req.params.id,
        quantityChange,
        userId
      );
      if (!updatedInventory) {
        return res.status(404).json({ message: "Inventory record not found" });
      }
      res.status(200).json(updatedInventory);
    } catch (error) {
      res.status(500).json({
        message: "Error adjusting inventory quantity",
        error: error.message,
      });
    }
  }
}

module.exports = new InventoryController();
