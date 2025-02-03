const stockTransferService = require("@services/product/stockTransferService");

class StockTransferController {
  /**
   * List all stock transfers (paginated).
   */
  async list(req, res) {
    try {
      const {
        page,
        limit,
        item_id,
        status,
        source_warehouse_id,
        destination_warehouse_id,
        start_date,
        end_date,
        sortBy,
        sortOrder,
      } = req.query;

      const filters = {
        item_id: item_id ? parseInt(item_id, 10) : undefined,
        status: status || undefined, // e.g., "pending", "completed", "canceled"
        source_warehouse_id: source_warehouse_id
          ? parseInt(source_warehouse_id, 10)
          : undefined,
        destination_warehouse_id: destination_warehouse_id
          ? parseInt(destination_warehouse_id, 10)
          : undefined,
        start_date: start_date || undefined,
        end_date: end_date || undefined,
      };

      const queryParams = {
        page,
        limit,
        filters,
        sortBy,
        sortOrder,
      };

      const result = await stockTransferService.getList(queryParams);

      res.status(200).json({
        total: result.count,
        totalPages: Math.ceil(result.count / limit),
        currentPage: parseInt(page || 1, 10),
        pageSize: parseInt(limit || 10, 10),
        data: result.rows,
      });
    } catch (error) {
      res.status(500).json({
        message: "Error fetching stock transfers",
        error: error.message,
      });
    }
  }

  /**
   * Create a new stock transfer (default status = "pending").
   */
  async create(req, res) {
    try {
      const newTransfer = await stockTransferService.create(req.body);
      res.status(201).json(newTransfer);
    } catch (error) {
      res.status(500).json({
        message: "Error creating stock transfer",
        error: error.message,
      });
    }
  }

  /**
   * Get a stock transfer by ID.
   */
  async getById(req, res) {
    try {
      const transfer = await stockTransferService.getById(req.params.id);
      if (transfer) {
        res.status(200).json(transfer);
      } else {
        res.status(404).json({ message: "Stock transfer not found" });
      }
    } catch (error) {
      res.status(500).json({
        message: "Error fetching stock transfer",
        error: error.message,
      });
    }
  }

  /**
   * Update a stock transfer. If status changes to completed, inventory is adjusted.
   */
  async update(req, res) {
    try {
      const updatedTransfer = await stockTransferService.alter(
        req.params.id,
        req.body
      );
      if (updatedTransfer) {
        res.status(200).json(updatedTransfer);
      } else {
        res.status(404).json({ message: "Stock transfer not found" });
      }
    } catch (error) {
      res.status(500).json({
        message: "Error updating stock transfer",
        error: error.message,
      });
    }
  }

  /**
   * Delete a stock transfer. If it's pending or canceled, no inventory changes needed.
   * If it was completed, a domain rule might say "Cannot delete" or "Reverse the inventory" if allowed.
   */
  async delete(req, res) {
    try {
      const result = await stockTransferService.delete(req.params.id);
      if (result) {
        res.status(200).json({ message: "Stock transfer deleted" });
      } else {
        res.status(404).json({ message: "Stock transfer not found" });
      }
    } catch (error) {
      res.status(500).json({
        message: "Error deleting stock transfer",
        error: error.message,
      });
    }
  }

  /**
   * Explicit endpoint to "complete" a transfer.
   * This sets status to completed and adjusts inventory.
   */
  async complete(req, res) {
    try {
      const transferId = req.params.id;
      const updatedTransfer = await stockTransferService.completeTransfer(
        transferId
      );

      if (!updatedTransfer) {
        return res.status(404).json({ message: "Stock transfer not found" });
      }

      res.status(200).json(updatedTransfer);
    } catch (error) {
      res.status(500).json({
        message: "Error completing stock transfer",
        error: error.message,
      });
    }
  }
}

module.exports = new StockTransferController();
