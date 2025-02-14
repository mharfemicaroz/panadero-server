const { Op } = require("sequelize");
const db = global.requireV2("models");
const Procurement = db.Procurement;

class ProcurementRepository {
  async listing({
    page = 1,
    limit = 10,
    filters = {},
    sortBy = "created_at",
    sortOrder = "DESC",
  } = {}) {
    const offset = (page - 1) * limit;
    const where = {};

    if (filters.supplier_id) where.supplier_id = filters.supplier_id;
    if (filters.item_id) where.item_id = filters.item_id;
    if (filters.warehouse_id) where.warehouse_id = filters.warehouse_id;
    if (filters.status) where.status = filters.status;
    if (filters.start_date && filters.end_date) {
      where.procurement_date = {
        [Op.between]: [filters.start_date, filters.end_date],
      };
    }

    return await Procurement.findAndCountAll({
      distinct: true,
      where,
      order: [[sortBy, sortOrder.toUpperCase()]],
      limit: parseInt(limit, 10),
      offset,
      include: [
        { association: "supplier" },
        { association: "item" },
        { association: "warehouse" },
      ],
    });
  }

  async create(data) {
    return await Procurement.create(data);
  }

  async getById(id) {
    return await Procurement.findByPk(id, {
      include: [
        { association: "supplier" },
        { association: "item" },
        { association: "warehouse" },
      ],
    });
  }

  async update(id, procurementData) {
    const procurement = await Procurement.findByPk(id);
    if (procurement) {
      return await procurement.update(procurementData);
    }
    return null;
  }

  async delete(id) {
    const procurement = await Procurement.findByPk(id);
    if (procurement) {
      return await procurement.destroy();
    }
    return null;
  }

  // Mark a procurement as completed by updating its status
  async complete(id) {
    const procurement = await Procurement.findByPk(id);
    if (!procurement) return null;
    return await procurement.update({ status: "completed" });
  }
}

module.exports = new ProcurementRepository();
