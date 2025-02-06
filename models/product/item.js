"use strict";

module.exports = (sequelize, DataTypes) => {
  const Item = sequelize.define(
    "Item",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      beginning_qty: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      sku: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      barcode: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
      },
      cost: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      unit_of_measurement: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      sold_by: {
        type: DataTypes.ENUM("each", "weight"),
        allowNull: false,
      },
      image: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      warehouse_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "warehouses",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      category_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "categories",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      subcategory_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "subcategories",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
    },
    {
      tableName: "items",
      underscored: true,
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  Item.associate = function (models) {
    Item.belongsTo(models.Warehouse, {
      foreignKey: "warehouse_id",
      as: "warehouse",
    });
    Item.belongsTo(models.Category, {
      foreignKey: "category_id",
      as: "category",
    });
    Item.belongsTo(models.Subcategory, {
      foreignKey: "subcategory_id",
      as: "subcategory",
    });
    Item.hasMany(models.Inventory, {
      foreignKey: "item_id",
      as: "inventories",
    });
  };

  // Automatically create an Inventory record for this item after creation
  Item.afterCreate(async (item, options) => {
    try {
      const inventoryModel = sequelize.models.Inventory;
      await inventoryModel.create({
        item_id: item.id,
        warehouse_id: item.warehouse_id,
        current_quantity: item.beginning_qty,
      });
    } catch (error) {
      console.error("Inventory creation failed for item ID:", item.id, error);
    }
  });

  return Item;
};
