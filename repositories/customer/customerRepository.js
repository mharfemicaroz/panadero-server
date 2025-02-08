const { Op } = require("sequelize");
const db = global.requireV2("models");
const Customer = global.requireV2("models/customer/customer")(
  db.sequelize,
  db.Sequelize.DataTypes
);

class CustomerRepository {
  /**
   * List customers with pagination and optional filters.
   */
  async listing({
    page = 1,
    limit = 10,
    filters = {},
    sortBy = "created_at",
    sortOrder = "DESC",
  }) {
    const offset = (page - 1) * limit;
    const where = {};

    if (filters.first_name) {
      where.first_name = { [Op.like]: `%${filters.first_name}%` };
    }
    if (filters.last_name) {
      where.last_name = { [Op.like]: `%${filters.last_name}%` };
    }
    if (filters.email) {
      where.email = filters.email;
    }
    if (filters.phone) {
      where.phone = { [Op.like]: `%${filters.phone}%` };
    }
    if (filters.is_active !== undefined) {
      where.is_active = filters.is_active;
    }

    const result = await Customer.findAndCountAll({
      distinct: true,
      where,
      order: [[sortBy, sortOrder.toUpperCase()]],
      limit: parseInt(limit, 10),
      offset,
    });
    return result;
  }

  /**
   * Creates a new customer.
   */
  async create(data) {
    return await Customer.create(data);
  }

  /**
   * Retrieves a customer by ID.
   */
  async getById(id) {
    return await Customer.findByPk(id);
  }

  /**
   * Updates a customer by ID.
   */
  async update(id, data) {
    const customer = await Customer.findByPk(id);
    if (!customer) return null;
    return await customer.update(data);
  }

  /**
   * Deletes a customer by ID.
   */
  async delete(id) {
    const customer = await Customer.findByPk(id);
    if (!customer) return null;
    return await customer.destroy();
  }
}

module.exports = new CustomerRepository();
