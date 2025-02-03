const discountService = global.requireV2("services/product/discountService");

class DiscountController {
  async list(req, res) {
    try {
      const {
        page,
        limit,
        item_id,
        is_active,
        start_date,
        end_date,
        sortBy,
        sortOrder,
      } = req.query;
      const filters = {
        item_id: item_id ? parseInt(item_id, 10) : undefined,
        is_active: is_active !== undefined ? is_active === "true" : undefined,
        start_date: start_date || undefined,
        end_date: end_date || undefined,
      };
      const queryParams = { page, limit, filters, sortBy, sortOrder };
      const result = await discountService.getList(queryParams);
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
        .json({ message: "Error fetching discounts", error: error.message });
    }
  }

  async create(req, res) {
    try {
      const record = await discountService.create(req.body);
      res.status(201).json(record);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error creating discount", error: error.message });
    }
  }

  async getById(req, res) {
    try {
      const record = await discountService.getById(req.params.id);
      if (!record)
        return res.status(404).json({ message: "Discount not found" });
      res.status(200).json(record);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error fetching discount", error: error.message });
    }
  }

  async update(req, res) {
    try {
      const updated = await discountService.alter(req.params.id, req.body);
      if (!updated)
        return res.status(404).json({ message: "Discount not found" });
      res.status(200).json(updated);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error updating discount", error: error.message });
    }
  }

  async delete(req, res) {
    try {
      const result = await discountService.delete(req.params.id);
      if (!result)
        return res.status(404).json({ message: "Discount not found" });
      res.status(200).json({ message: "Discount deleted" });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error deleting discount", error: error.message });
    }
  }
}

module.exports = new DiscountController();
