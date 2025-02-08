const { Op } = require("sequelize");
const db = global.requireV2("models");
const Sale = db.Sale;
const SaleItem = db.SaleItem;
const User = db.User;
const Branch = db.Branch;
const Warehouse = db.Warehouse;
const Customer = db.Customer;
const Item = db.Item;

class SaleRepository {
  async listing({
    page = 1,
    limit = 10,
    filters = {},
    sortBy = "created_at",
    sortOrder = "DESC",
  }) {
    const offset = (page - 1) * limit;
    const where = {};

    // Other direct filters
    if (filters.user_id) where.user_id = filters.user_id;
    if (filters.branch_id) where.branch_id = filters.branch_id;
    if (filters.warehouse_id) where.warehouse_id = filters.warehouse_id;
    if (filters.customer_id) where.customer_id = filters.customer_id;
    // if (filters.customer_name)
    //   where.customer_name = { [Op.like]: `%${filters.customer_name}%` };
    // if (filters.status) where.status = { [Op.like]: `%${filters.status}%` };
    // if (filters.payment_type)
    //   where.payment_type = { [Op.like]: `%${filters.payment_type}%` };

    if (filters.search) {
      where[db.Sequelize.Op.or] = [
        { status: { [db.Sequelize.Op.like]: `%${filters.search}%` } },
        { payment_type: { [db.Sequelize.Op.like]: `%${filters.search}%` } },
        { customer_name: { [db.Sequelize.Op.like]: `%${filters.search}%` } },
      ];
    } else {
      if (filters.status) where.status = filters.status;
      if (filters.payment_type) where.payment_type = filters.payment_type;
      if (filters.customer_name)
        where.customer_name = { [Op.like]: `%${filters.customer_name}%` };
    }

    // Date filters
    if (filters.start_date && filters.end_date) {
      where.sale_date = {
        [db.Sequelize.Op.between]: [filters.start_date, filters.end_date],
      };
    } else if (filters.start_date) {
      where.sale_date = { [db.Sequelize.Op.gte]: filters.start_date };
    } else if (filters.end_date) {
      where.sale_date = { [db.Sequelize.Op.lte]: filters.end_date };
    }

    return await Sale.findAndCountAll({
      distinct: true,
      where,
      include: [
        { model: User, as: "user" },
        { model: Branch, as: "branch" },
        { model: Warehouse, as: "warehouse" },
        { model: Customer, as: "customer" },
        {
          model: SaleItem,
          as: "saleItems",
          include: [{ model: Item, as: "item" }],
        },
      ],
      order: [[sortBy, sortOrder.toUpperCase()]],
      limit: parseInt(limit, 10),
      offset,
    });
  }

  async createWithItems(saleData, itemsData) {
    return await db.sequelize.transaction(async (t) => {
      const newSale = await Sale.create(saleData, { transaction: t });
      const saleItems = itemsData.map((it) => ({ ...it, sale_id: newSale.id }));
      await SaleItem.bulkCreate(saleItems, { transaction: t });
      return newSale;
    });
  }

  async getById(id) {
    return await Sale.findByPk(id, {
      include: [
        { model: User, as: "user" },
        { model: Branch, as: "branch" },
        { model: Warehouse, as: "warehouse" },
        { model: Customer, as: "customer" },
        {
          model: SaleItem,
          as: "saleItems",
          include: [{ model: Item, as: "item" }],
        },
      ],
    });
  }

  async update(id, data) {
    const sale = await this.getById(id);
    if (!sale) return null;
    return await sale.update(data);
  }

  async delete(id) {
    const sale = await this.getById(id);
    if (!sale) return null;
    return await sale.destroy();
  }
}

module.exports = new SaleRepository();
