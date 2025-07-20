const { Op } = require("sequelize");
const db = global.requireV2("models");
const Sale = db.Sale;
const SaleItem = db.SaleItem;
const User = db.User;
const Branch = db.Branch;
const Warehouse = db.Warehouse;
const Customer = db.Customer;
const Item = db.Item;
const Category = db.Category;
const Subcategory = db.Subcategory;
const Inventory = db.Inventory;
const Shift = db.Shift; // Added Shift model

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

    // Direct filters
    if (filters.user_id) where.user_id = filters.user_id;
    if (filters.branch_id) where.branch_id = filters.branch_id;
    if (filters.warehouse_id) where.warehouse_id = filters.warehouse_id;
    if (filters.customer_id) where.customer_id = filters.customer_id;
    if (filters.shift_id) where.shift_id = filters.shift_id; // New filter for shift_id

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
        { model: Shift, as: "shift" }, // Include the associated shift
        {
          model: SaleItem,
          as: "saleItems",
          include: [
            {
              model: Item,
              as: "item",
              include: [
                { model: Category, as: "category" },
                { model: Subcategory, as: "subcategory" },
                {
                  model: Inventory,
                  as: "inventories",
                },
              ],
            },
          ],
        },
      ],
      order: [[sortBy, sortOrder.toUpperCase()]],
      limit: parseInt(limit, 10),
      offset,
    });
  }

  // Updated method: accepts an external transaction via options.
  async createWithItems(saleData, itemsData, options = {}) {
    if (options.transaction) {
      const newSale = await Sale.create(saleData, {
        transaction: options.transaction,
      });
      const saleItems = itemsData.map((it) => ({ ...it, sale_id: newSale.id }));
      await SaleItem.bulkCreate(saleItems, {
        transaction: options.transaction,
      });
      return newSale;
    } else {
      return await db.sequelize.transaction(async (t) => {
        const newSale = await Sale.create(saleData, { transaction: t });
        const saleItems = itemsData.map((it) => ({
          ...it,
          sale_id: newSale.id,
        }));
        await SaleItem.bulkCreate(saleItems, { transaction: t });
        return newSale;
      });
    }
  }

  async getById(id) {
    return await Sale.findByPk(id, {
      include: [
        { model: User, as: "user" },
        { model: Branch, as: "branch" },
        { model: Warehouse, as: "warehouse" },
        { model: Customer, as: "customer" },
        { model: Shift, as: "shift" }, // Include associated shift
        {
          model: SaleItem,
          as: "saleItems",
          include: [
            {
              model: Item,
              as: "item",
              include: [
                { model: Category, as: "category" },
                { model: Subcategory, as: "subcategory" },
              ],
            },
          ],
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

  // New method: Get the total sales for a given shift.
  async getSalesTotalForShift(shiftId) {
    const result = await Sale.findOne({
      attributes: [
        [
          db.Sequelize.fn("SUM", db.Sequelize.col("total_amount")),
          "totalSales",
        ],
      ],
      where: { shift_id: shiftId },
      raw: true,
    });
    return result.totalSales || 0;
  }
}

module.exports = new SaleRepository();
