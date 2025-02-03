const pricingService = require("@services/product/pricingService");

class PricingController {
  async list(req, res) {
    try {
      const {
        page,
        limit,
        item_id,
        is_active,
        effective_date,
        sortBy,
        sortOrder,
      } = req.query;
      const filters = {
        item_id: item_id ? parseInt(item_id, 10) : undefined,
        is_active: is_active !== undefined ? is_active === "true" : undefined,
        effective_date: effective_date || undefined,
      };
      const queryParams = { page, limit, filters, sortBy, sortOrder };
      const result = await pricingService.getList(queryParams);
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
        .json({ message: "Error fetching pricing", error: error.message });
    }
  }

  async create(req, res) {
    try {
      const record = await pricingService.create(req.body);
      res.status(201).json(record);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error creating pricing", error: error.message });
    }
  }

  async getById(req, res) {
    try {
      const record = await pricingService.getById(req.params.id);
      if (!record)
        return res.status(404).json({ message: "Pricing not found" });
      res.status(200).json(record);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error fetching pricing", error: error.message });
    }
  }

  async update(req, res) {
    try {
      const updated = await pricingService.alter(req.params.id, req.body);
      if (!updated)
        return res.status(404).json({ message: "Pricing not found" });
      res.status(200).json(updated);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error updating pricing", error: error.message });
    }
  }

  async delete(req, res) {
    try {
      const result = await pricingService.delete(req.params.id);
      if (!result)
        return res.status(404).json({ message: "Pricing not found" });
      res.status(200).json({ message: "Pricing deleted" });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error deleting pricing", error: error.message });
    }
  }
}

module.exports = new PricingController();
