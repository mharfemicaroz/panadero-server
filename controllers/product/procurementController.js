const procurementService = global.requireV2(
  "services/product/procurementService"
);

class ProcurementController {
  async list(req, res) {
    try {
      // Extract pagination, sorting, and filter parameters with optional defaults
      const {
        page,
        limit,
        sort,
        order,
        user_id,
        supplier_id,
        item_id,
        warehouse_id,
        status,
        start_date,
        end_date,
      } = req.query;

      // If filters are provided using the filters[...] syntax, use them.
      let filters = req.query.filters || {};

      // Apply additional filters if provided.
      if (user_id) {
        filters.user_id = parseInt(user_id, 10);
      }
      if (supplier_id) {
        filters.supplier_id = parseInt(supplier_id, 10);
      }
      if (item_id) {
        filters.item_id = parseInt(item_id, 10);
      }
      if (warehouse_id) {
        filters.warehouse_id = parseInt(warehouse_id, 10);
      }
      if (status) {
        filters.status = status;
      }
      if (start_date) {
        filters.start_date = start_date;
      }
      if (end_date) {
        filters.end_date = end_date;
      }

      // Build query params including sorting info.
      const queryParams = {
        page,
        limit,
        filters,
        sortBy: sort, // Will default to service/repository default if undefined
        sortOrder: order, // Will default to service/repository default if undefined
      };

      const result = await procurementService.getList(queryParams);

      res.status(200).json({
        total: result.count,
        totalPages: limit ? Math.ceil(result.count / limit) : null,
        currentPage: limit ? parseInt(page, 10) : null,
        pageSize: limit ? parseInt(limit, 10) : null,
        data: result.rows,
      });
    } catch (error) {
      res.status(500).json({
        message: "Error fetching procurements",
        error: error.message,
      });
    }
  }

  async create(req, res) {
    try {
      const newProcurement = await procurementService.create(req.body);
      res.status(201).json(newProcurement);
    } catch (error) {
      res.status(500).json({
        message: "Error creating procurement",
        error: error.message,
      });
    }
  }

  async getById(req, res) {
    try {
      const procurement = await procurementService.getById(req.params.id);
      if (procurement) {
        res.status(200).json(procurement);
      } else {
        res.status(404).json({ message: "Procurement not found" });
      }
    } catch (error) {
      res.status(500).json({
        message: "Error fetching procurement",
        error: error.message,
      });
    }
  }

  async update(req, res) {
    try {
      const updatedProcurement = await procurementService.alter(
        req.params.id,
        req.body
      );
      if (updatedProcurement) {
        res.status(200).json(updatedProcurement);
      } else {
        res.status(404).json({ message: "Procurement not found" });
      }
    } catch (error) {
      res.status(500).json({
        message: "Error updating procurement",
        error: error.message,
      });
    }
  }

  async delete(req, res) {
    try {
      const deleted = await procurementService.delete(req.params.id);
      if (deleted) {
        res.status(200).json({ message: "Procurement deleted" });
      } else {
        res.status(404).json({ message: "Procurement not found" });
      }
    } catch (error) {
      res.status(500).json({
        message: "Error deleting procurement",
        error: error.message,
      });
    }
  }

  async complete(req, res) {
    try {
      const completed = await procurementService.completeProcurement(
        req.params.id
      );
      if (completed) {
        res.status(200).json(completed);
      } else {
        res.status(404).json({ message: "Procurement not found" });
      }
    } catch (error) {
      res.status(500).json({
        message: "Error completing procurement",
        error: error.message,
      });
    }
  }
}

module.exports = new ProcurementController();
