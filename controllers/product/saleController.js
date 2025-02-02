const saleService = require("../../services/product/saleService");

class SaleController {
  async list(req, res) {
    try {
      const {
        page,
        limit,
        user_id,
        branch_id,
        warehouse_id,
        customer_id,
        status,
        start_date,
        end_date,
        sortBy,
        sortOrder,
        payment_type,
      } = req.query;

      const filters = {
        user_id: user_id ? parseInt(user_id, 10) : undefined,
        branch_id: branch_id ? parseInt(branch_id, 10) : undefined,
        warehouse_id: warehouse_id ? parseInt(warehouse_id, 10) : undefined,
        customer_id: customer_id ? parseInt(customer_id, 10) : undefined,
        status: status || undefined,
        start_date: start_date || undefined,
        end_date: end_date || undefined,
        payment_type: payment_type || undefined,
      };

      const queryParams = { page, limit, filters, sortBy, sortOrder };
      const result = await saleService.getList(queryParams);

      res.status(200).json({
        total: result.count,
        totalPages: Math.ceil(result.count / (limit || 10)),
        currentPage: parseInt(page || 1, 10),
        pageSize: parseInt(limit || 10, 10),
        data: result.rows,
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error fetching sales", error: error.message });
    }
  }

  async create(req, res) {
    try {
      const newSale = await saleService.create(req.body);
      res.status(201).json(newSale);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error creating sale", error: error.message });
    }
  }
  async getById(req, res) {
    try {
      const sale = await saleService.getById(req.params.id);
      if (!sale) return res.status(404).json({ message: "Sale not found" });
      res.status(200).json(sale);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error fetching sale", error: error.message });
    }
  }
  async update(req, res) {
    try {
      const updatedSale = await saleService.update(req.params.id, req.body);
      if (!updatedSale)
        return res.status(404).json({ message: "Sale not found" });
      res.status(200).json(updatedSale);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error updating sale", error: error.message });
    }
  }
  async delete(req, res) {
    try {
      const result = await saleService.delete(req.params.id);
      if (!result) return res.status(404).json({ message: "Sale not found" });
      res.status(200).json({ message: "Sale deleted" });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error deleting sale", error: error.message });
    }
  }
  async complete(req, res) {
    try {
      const completedSale = await saleService.completeSale(req.params.id);
      if (!completedSale)
        return res.status(404).json({ message: "Sale not found" });
      res.status(200).json(completedSale);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error completing sale", error: error.message });
    }
  }
}

module.exports = new SaleController();
