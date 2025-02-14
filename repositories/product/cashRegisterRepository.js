const { Op } = require("sequelize");
const db = global.requireV2("models");
const CashRegister = db.CashRegister;
const Sale = db.Sale;
const Shift = db.Shift;

class CashRegisterRepository {
  async listing({
    page = 1,
    limit = 10,
    filters = {},
    sortBy = "created_at", // Default sort column.
    sortOrder = "DESC", // Default sort order.
  } = {}) {
    const offset = (page - 1) * limit;
    const where = {};

    // Example filters – adjust as needed.
    if (filters.sale_id) {
      where.sale_id = filters.sale_id;
    }
    if (filters.shift_id) {
      where.shift_id = filters.shift_id;
    }
    if (filters.type) {
      where.type = filters.type;
    }
    // Date filters using transaction_date field.
    if (filters.start_date && filters.end_date) {
      where.transaction_date = {
        [Op.between]: [filters.start_date, filters.end_date],
      };
    } else if (filters.start_date) {
      where.transaction_date = { [Op.gte]: filters.start_date };
    } else if (filters.end_date) {
      where.transaction_date = { [Op.lte]: filters.end_date };
    }

    return await CashRegister.findAndCountAll({
      distinct: true,
      where,
      order: [[sortBy, sortOrder.toUpperCase()]],
      limit: parseInt(limit, 10),
      offset,
      include: [
        {
          model: Sale,
          as: "sale",
          attributes: ["id", "total_amount"], // Include relevant sale attributes.
        },
        {
          model: Shift,
          as: "shift",
          attributes: ["id", "start_time", "end_time"], // Include relevant shift attributes.
        },
      ],
    });
  }

  async create(data) {
    return await CashRegister.create(data);
  }

  async getById(id) {
    return await CashRegister.findByPk(id, {
      include: [
        {
          model: Sale,
          as: "sale",
          attributes: ["id", "total_amount"],
        },
        {
          model: Shift,
          as: "shift",
          attributes: ["id", "start_time", "end_time"],
        },
      ],
    });
  }

  async update(id, cashRegisterData) {
    const entry = await CashRegister.findByPk(id);
    if (entry) {
      return await entry.update(cashRegisterData);
    }
    return null;
  }

  async delete(id) {
    const entry = await CashRegister.findByPk(id);
    if (entry) {
      return await entry.destroy();
    }
    return null;
  }
}

module.exports = new CashRegisterRepository();
