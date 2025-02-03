const damageService = require("@services/product/damageService");

class DamageController {
  async list(req, res) {
    try {
      const {
        page,
        limit,
        item_id,
        warehouse_id,
        status,
        start_date,
        end_date,
        sortBy,
        sortOrder,
      } = req.query;
      const filters = {
        item_id: item_id ? parseInt(item_id, 10) : undefined,
        warehouse_id: warehouse_id ? parseInt(warehouse_id, 10) : undefined,
        status: status || undefined,
        start_date: start_date || undefined,
        end_date: end_date || undefined,
      };
      const queryParams = { page, limit, filters, sortBy, sortOrder };
      const result = await damageService.getList(queryParams);
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
        .json({ message: "Error fetching damages", error: error.message });
    }
  }

  async create(req, res) {
    try {
      const record = await damageService.create(req.body);
      res.status(201).json(record);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error creating damage", error: error.message });
    }
  }

  async getById(req, res) {
    try {
      const record = await damageService.getById(req.params.id);
      if (!record) return res.status(404).json({ message: "Damage not found" });
      res.status(200).json(record);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error fetching damage", error: error.message });
    }
  }

  async update(req, res) {
    try {
      const updated = await damageService.alter(req.params.id, req.body);
      if (!updated)
        return res.status(404).json({ message: "Damage not found" });
      res.status(200).json(updated);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error updating damage", error: error.message });
    }
  }

  async delete(req, res) {
    try {
      const result = await damageService.delete(req.params.id);
      if (!result) return res.status(404).json({ message: "Damage not found" });
      res.status(200).json({ message: "Damage deleted" });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error deleting damage", error: error.message });
    }
  }

  async complete(req, res) {
    try {
      const updated = await damageService.completeDamage(req.params.id);
      if (!updated)
        return res.status(404).json({ message: "Damage not found" });
      res.status(200).json(updated);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error completing damage", error: error.message });
    }
  }
}

module.exports = new DamageController();
