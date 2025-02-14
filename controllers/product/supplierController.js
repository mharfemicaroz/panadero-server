const supplierService = global.requireV2("services/product/supplierService");

class SupplierController {
  async list(req, res) {
    try {
      // Extract pagination, sorting, and filter parameters
      const { page, limit, sort, order, name, is_active } = req.query;

      // Build filters object from either req.query.filters or individual query parameters
      let filters = req.query.filters || {};
      if (name) {
        filters.name = name;
      }
      if (is_active !== undefined) {
        filters.is_active = is_active === "true";
      }

      // Build query parameters including sorting info.
      const queryParams = {
        page,
        limit,
        filters,
        sortBy: sort, // defaults handled by service/repository if undefined
        sortOrder: order,
      };

      const result = await supplierService.getList(queryParams);

      res.status(200).json({
        total: result.count,
        totalPages: limit ? Math.ceil(result.count / limit) : null,
        currentPage: limit ? parseInt(page, 10) : null,
        pageSize: limit ? parseInt(limit, 10) : null,
        data: result.rows,
      });
    } catch (error) {
      res.status(500).json({
        message: "Error fetching suppliers",
        error: error.message,
      });
    }
  }

  async create(req, res) {
    try {
      const newSupplier = await supplierService.create(req.body);
      res.status(201).json(newSupplier);
    } catch (error) {
      res.status(500).json({
        message: "Error creating supplier",
        error: error.message,
      });
    }
  }

  async getById(req, res) {
    try {
      const supplier = await supplierService.getById(req.params.id);
      if (supplier) {
        res.status(200).json(supplier);
      } else {
        res.status(404).json({ message: "Supplier not found" });
      }
    } catch (error) {
      res.status(500).json({
        message: "Error fetching supplier",
        error: error.message,
      });
    }
  }

  async update(req, res) {
    try {
      const updatedSupplier = await supplierService.alter(
        req.params.id,
        req.body
      );
      if (updatedSupplier) {
        res.status(200).json(updatedSupplier);
      } else {
        res.status(404).json({ message: "Supplier not found" });
      }
    } catch (error) {
      res.status(500).json({
        message: "Error updating supplier",
        error: error.message,
      });
    }
  }

  async delete(req, res) {
    try {
      const result = await supplierService.delete(req.params.id);
      if (result) {
        return res.status(200).json({ message: "Supplier deleted" });
      } else {
        return res.status(404).json({ message: "Supplier not found" });
      }
    } catch (error) {
      if (error.name === "SequelizeForeignKeyConstraintError") {
        return res.status(409).json({
          message:
            "Cannot delete supplier because it's referenced by other records",
        });
      }
      return res.status(500).json({
        message: "Error deleting supplier",
        error: error.message,
      });
    }
  }
}

module.exports = new SupplierController();
