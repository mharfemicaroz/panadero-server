const Category = require("./category");
const CategoryGroup = require("./categoryGroup");
const Subcategory = require("./subcategory");
const Item = require("./item");
const Inventory = require("./inventory");
const StockTransfer = require("./stockTransfer");
const Order = require("./order");
const OrderItem = require("./orderItem");
const Supplier = require("./supplier");
const Procurement = require("./procurement");
const Notification = require("./notification");
const Return = require("./return");
const Damage = require("./damage");
const Pricing = require("./pricing");
const Discount = require("./discount");
const Sale = require("./sale");
const SaleItem = require("./saleItem");
const StockMovement = require("./stockMovement");

module.exports = (sequelize, DataTypes) => {
  const models = {
    Category: Category(sequelize, DataTypes),
    CategoryGroup: CategoryGroup(sequelize, DataTypes),
    Subcategory: Subcategory(sequelize, DataTypes),
    Item: Item(sequelize, DataTypes),
    Inventory: Inventory(sequelize, DataTypes),
    StockTransfer: StockTransfer(sequelize, DataTypes),
    Order: Order(sequelize, DataTypes),
    OrderItem: OrderItem(sequelize, DataTypes),
    Supplier: Supplier(sequelize, DataTypes),
    Procurement: Procurement(sequelize, DataTypes),
    Notification: Notification(sequelize, DataTypes),
    Return: Return(sequelize, DataTypes),
    Damage: Damage(sequelize, DataTypes),
    Pricing: Pricing(sequelize, DataTypes),
    Discount: Discount(sequelize, DataTypes),
    Sale: Sale(sequelize, DataTypes),
    SaleItem: SaleItem(sequelize, DataTypes),
    StockMovement: StockMovement(sequelize, DataTypes),
  };

  return models;
};
