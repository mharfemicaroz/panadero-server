const stockMovementService = global.requireV2(
  "services/product/stockMovementService"
);

class StockMovementController {
  /**
   * List stock movement records with pagination.
   */
  async list(req, res) {
    try {
      const {
        page = 1,
        limit = 10,
        sort = "created_at",
        order = "DESC",
      } = req.query;
      const queryParams = {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        sortBy: sort,
        sortOrder: order,
      };
      const result = await stockMovementService.getList(queryParams);
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
        .json({
          message: "Error fetching stock movements",
          error: error.message,
        });
    }
  }

  /**
   * Create a new stock movement record.
   */
  async create(req, res) {
    try {
      const newRecord = await stockMovementService.create(req.body);
      res.status(201).json(newRecord);
    } catch (error) {
      res
        .status(500)
        .json({
          message: "Error creating stock movement",
          error: error.message,
        });
    }
  }

  /**
   * Fetch a stock movement record by ID.
   */
  async getById(req, res) {
    try {
      const record = await stockMovementService.getById(req.params.id);
      if (record) {
        res.status(200).json(record);
      } else {
        res.status(404).json({ message: "Stock movement not found" });
      }
    } catch (error) {
      res
        .status(500)
        .json({
          message: "Error fetching stock movement",
          error: error.message,
        });
    }
  }

  /**
   * Update a stock movement record.
   */
  async update(req, res) {
    try {
      const updatedRecord = await stockMovementService.update(
        req.params.id,
        req.body
      );
      if (updatedRecord) {
        res.status(200).json(updatedRecord);
      } else {
        res.status(404).json({ message: "Stock movement not found" });
      }
    } catch (error) {
      res
        .status(500)
        .json({
          message: "Error updating stock movement",
          error: error.message,
        });
    }
  }

  /**
   * Delete a stock movement record.
   */
  async delete(req, res) {
    try {
      const result = await stockMovementService.delete(req.params.id);
      if (result) {
        res.status(200).json({ message: "Stock movement deleted" });
      } else {
        res.status(404).json({ message: "Stock movement not found" });
      }
    } catch (error) {
      res
        .status(500)
        .json({
          message: "Error deleting stock movement",
          error: error.message,
        });
    }
  }
}

module.exports = new StockMovementController();
