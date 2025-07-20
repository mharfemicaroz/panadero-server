// repositories/product/procurementRepository.js
const { Op } = require("sequelize");
const db = global.requireV2("models");
const Procurement = db.Procurement;
const User = db.User;

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

    if (filters.user_id) where.user_id = filters.user_id;
    if (filters.supplier_id) where.supplier_id = filters.supplier_id;
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
        { association: "user", attributes: ["id", "username"] },
        { association: "supplier" },
        { association: "warehouse" },
        {
          association: "items",
          include: [{ association: "item" }],
        },
      ],
    });
  }

  async create(data) {
    return await Procurement.create(data);
  }

  async getById(id) {
    return await Procurement.findByPk(id, {
      include: [
        { association: "user", attributes: ["id", "username"] },
        { association: "supplier" },
        { association: "warehouse" },
        {
          association: "items",
          include: [{ association: "item" }],
        },
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

  // New method to create a procurement item
  async createProcurementItem(data) {
    const ProcurementItem = db.ProcurementItem;
    return await ProcurementItem.create(data);
  }

  // Mark a procurement as completed by updating its status
  async complete(id) {
    const procurement = await Procurement.findByPk(id, {
      include: [
        { association: "user", attributes: ["id", "username"] },
        { association: "supplier" },
        { association: "warehouse" },
        {
          association: "items",
          include: [{ association: "item" }],
        },
      ],
    });
    if (!procurement) return null;
    return await procurement.update({ status: "received" });
  }
}

module.exports = new ProcurementRepository();
