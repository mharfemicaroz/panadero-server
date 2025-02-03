const supplierService = require("../../services/product/supplierService");

class SupplierController {
  async list(req, res) {
    try {
      const { page, limit, name, is_active, sortBy, sortOrder } = req.query;

      const filters = {
        name: name || undefined,
        is_active: is_active !== undefined ? is_active === "true" : undefined,
      };

      const queryParams = { page, limit, filters, sortBy, sortOrder };
      const result = await supplierService.getList(queryParams);

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
        .json({ message: "Error fetching suppliers", error: error.message });
    }
  }

  async create(req, res) {
    try {
      const record = await supplierService.create(req.body);
      res.status(201).json(record);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error creating supplier", error: error.message });
    }
  }

  async getById(req, res) {
    try {
      const record = await supplierService.getById(req.params.id);
      if (!record) {
        return res.status(404).json({ message: "Supplier not found" });
      }
      res.status(200).json(record);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error fetching supplier", error: error.message });
    }
  }

  async update(req, res) {
    try {
      const updated = await supplierService.alter(req.params.id, req.body);
      if (!updated) {
        return res.status(404).json({ message: "Supplier not found" });
      }
      res.status(200).json(updated);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error updating supplier", error: error.message });
    }
  }

  async delete(req, res) {
    try {
      const result = await supplierService.delete(req.params.id);
      if (!result) {
        return res.status(404).json({ message: "Supplier not found" });
      }
      res.status(200).json({ message: "Supplier deleted" });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error deleting supplier", error: error.message });
    }
  }
}

module.exports = new SupplierController();
