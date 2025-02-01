const inventoryService = require("../../services/product/inventoryService");

class InventoryController {
  /**
   * List all inventory records (paginated).
   */
  async list(req, res) {
    try {
      const { page, limit, item_id, warehouse_id, sortBy, sortOrder } =
        req.query;

      const filters = {
        item_id: item_id ? parseInt(item_id, 10) : undefined,
        warehouse_id: warehouse_id ? parseInt(warehouse_id, 10) : undefined,
      };

      const queryParams = { page, limit, filters, sortBy, sortOrder };

      const result = await inventoryService.getList(queryParams);

      res.status(200).json({
        total: result.count,
        totalPages: Math.ceil(result.count / limit),
        currentPage: parseInt(page || 1, 10),
        pageSize: parseInt(limit || 10, 10),
        data: result.rows,
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error fetching inventory", error: error.message });
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
      res
        .status(500)
        .json({ message: "Error creating inventory", error: error.message });
    }
  }

  /**
   * Get an inventory record by ID.
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
      res
        .status(500)
        .json({ message: "Error fetching inventory", error: error.message });
    }
  }

  /**
   * Update an inventory record (PUT).
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
      res
        .status(500)
        .json({ message: "Error updating inventory", error: error.message });
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
      res
        .status(500)
        .json({ message: "Error deleting inventory", error: error.message });
    }
  }

  /**
   * Adjust quantity: expects { quantityChange } in body
   * e.g. +10 means stock IN, -5 means stock OUT
   */
  async adjustQuantity(req, res) {
    try {
      const { quantityChange } = req.body;
      if (typeof quantityChange !== "number") {
        return res
          .status(400)
          .json({ message: "quantityChange must be a number" });
      }

      const updatedInventory = await inventoryService.adjustQuantity(
        req.params.id,
        quantityChange
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
