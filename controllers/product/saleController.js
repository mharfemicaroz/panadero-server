const saleService = global.requireV2("services/product/saleService");

class SaleController {
  async list(req, res) {
    try {
      // Extract pagination and sorting parameters with optional defaults
      const { page, limit, sort, order } = req.query;

      // Use filters from req.query.filters if provided; otherwise, use an empty object.
      const filters = req.query.filters || {};

      // Build query parameters including sorting information.
      const queryParams = {
        page,
        limit,
        filters,
        sortBy: sort, // will default to repository default if undefined
        sortOrder: order, // will default to repository default if undefined
      };

      const result = await saleService.getList(queryParams);

      res.status(200).json({
        total: result.count,
        totalPages: limit ? Math.ceil(result.count / limit) : null,
        currentPage: limit ? parseInt(page, 10) : null,
        pageSize: limit ? parseInt(limit, 10) : null,
        data: result.rows,
      });
    } catch (error) {
      res.status(500).json({
        message: "Error fetching sales",
        error: error.message,
      });
    }
  }

  async create(req, res) {
    try {
      const newSale = await saleService.create(req.body);
      res.status(201).json(newSale);
    } catch (error) {
      res.status(500).json({
        message: "Error creating sale",
        error: error.message,
      });
    }
  }

  async getById(req, res) {
    try {
      const sale = await saleService.getById(req.params.id);
      if (sale) {
        res.status(200).json(sale);
      } else {
        res.status(404).json({ message: "Sale not found" });
      }
    } catch (error) {
      res.status(500).json({
        message: "Error fetching sale",
        error: error.message,
      });
    }
  }

  async update(req, res) {
    try {
      const updatedSale = await saleService.update(req.params.id, req.body);
      if (updatedSale) {
        res.status(200).json(updatedSale);
      } else {
        res.status(404).json({ message: "Sale not found" });
      }
    } catch (error) {
      res.status(500).json({
        message: "Error updating sale",
        error: error.message,
      });
    }
  }

  async delete(req, res) {
    try {
      const result = await saleService.delete(req.params.id);
      if (result) {
        res.status(200).json({ message: "Sale deleted" });
      } else {
        res.status(404).json({ message: "Sale not found" });
      }
    } catch (error) {
      res.status(500).json({
        message: "Error deleting sale",
        error: error.message,
      });
    }
  }

  async complete(req, res) {
    try {
      const completedSale = await saleService.completeSale(req.params.id);
      if (completedSale) {
        res.status(200).json(completedSale);
      } else {
        res.status(404).json({ message: "Sale not found" });
      }
    } catch (error) {
      res.status(500).json({
        message: "Error completing sale",
        error: error.message,
      });
    }
  }
}

module.exports = new SaleController();
