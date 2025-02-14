const { Op } = require("sequelize");
const db = global.requireV2("models");
const Supplier = db.Supplier;

class SupplierRepository {
  async listing({
    page = 1,
    limit = 10,
    filters = {},
    sortBy = "created_at", // default sort column
    sortOrder = "DESC", // default sort order
  } = {}) {
    const offset = (page - 1) * limit;
    const where = {};

    // Apply filter on name if provided.
    if (filters.name) {
      where.name = { [Op.like]: `%${filters.name}%` };
    }

    // Apply filter on is_active if provided.
    if (filters.is_active !== undefined) {
      where.is_active = filters.is_active;
    }

    return await Supplier.findAndCountAll({
      distinct: true,
      where,
      order: [[sortBy, sortOrder.toUpperCase()]],
      limit: parseInt(limit, 10),
      offset,
    });
  }

  async create(data) {
    return await Supplier.create(data);
  }

  async getById(id) {
    return await Supplier.findByPk(id);
  }

  async update(id, supplierData) {
    const supplier = await Supplier.findByPk(id);
    if (supplier) {
      return await supplier.update(supplierData);
    }
    return null;
  }

  async delete(id) {
    const supplier = await Supplier.findByPk(id);
    if (supplier) {
      return await supplier.destroy();
    }
    return null;
  }
}

module.exports = new SupplierRepository();
