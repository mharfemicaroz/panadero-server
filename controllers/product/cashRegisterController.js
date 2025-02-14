const cashRegisterService = global.requireV2(
  "services/product/cashRegisterService"
);

class CashRegisterController {
  async list(req, res) {
    try {
      // Extract pagination and sorting parameters with optional defaults.
      const { page, limit, sort, order } = req.query;
      // Use filters if provided.
      let filters = req.query.filters || {};

      // Build query parameters.
      const queryParams = {
        page,
        limit,
        filters,
        sortBy: sort,
        sortOrder: order,
      };

      const result = await cashRegisterService.getList(queryParams);

      res.status(200).json({
        total: result.count,
        totalPages: limit ? Math.ceil(result.count / limit) : null,
        currentPage: limit ? parseInt(page, 10) : null,
        pageSize: limit ? parseInt(limit, 10) : null,
        data: result.rows,
      });
    } catch (error) {
      res.status(500).json({
        message: "Error fetching cash register entries",
        error: error.message,
      });
    }
  }

  async create(req, res) {
    try {
      const newEntry = await cashRegisterService.create(req.body);
      res.status(201).json(newEntry);
    } catch (error) {
      res.status(500).json({
        message: "Error creating cash register entry",
        error: error.message,
      });
    }
  }

  async getById(req, res) {
    try {
      const entry = await cashRegisterService.getById(req.params.id);
      if (entry) {
        res.status(200).json(entry);
      } else {
        res.status(404).json({ message: "Cash register entry not found" });
      }
    } catch (error) {
      res.status(500).json({
        message: "Error fetching cash register entry",
        error: error.message,
      });
    }
  }

  async update(req, res) {
    try {
      const updatedEntry = await cashRegisterService.alter(
        req.params.id,
        req.body
      );
      if (updatedEntry) {
        res.status(200).json(updatedEntry);
      } else {
        res.status(404).json({ message: "Cash register entry not found" });
      }
    } catch (error) {
      res.status(500).json({
        message: "Error updating cash register entry",
        error: error.message,
      });
    }
  }

  async delete(req, res) {
    try {
      const result = await cashRegisterService.delete(req.params.id);
      if (result) {
        res.status(200).json({ message: "Cash register entry deleted" });
      } else {
        res.status(404).json({ message: "Cash register entry not found" });
      }
    } catch (error) {
      if (error.name === "SequelizeForeignKeyConstraintError") {
        res.status(409).json({
          message:
            "Cannot delete cash register entry because it's referenced by other records",
        });
      } else {
        res.status(500).json({
          message: "Error deleting cash register entry",
          error: error.message,
        });
      }
    }
  }
}

module.exports = new CashRegisterController();
