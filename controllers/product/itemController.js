const itemService = require("@services/product/itemService");

class ItemController {
  async list(req, res) {
    try {
      const {
        page,
        limit,
        name,
        sku,
        warehouse_id,
        category_id,
        subcategory_id,
        sold_by,
        sortBy,
        sortOrder,
      } = req.query;

      const filters = {
        name,
        sku,
        warehouse_id: warehouse_id ? parseInt(warehouse_id, 10) : undefined,
        category_id: category_id ? parseInt(category_id, 10) : undefined,
        subcategory_id: subcategory_id
          ? parseInt(subcategory_id, 10)
          : undefined,
        sold_by,
      };

      const queryParams = { page, limit, filters, sortBy, sortOrder };
      const result = await itemService.getList(queryParams);

      res.status(200).json({
        total: result.count,
        totalPages: Math.ceil(result.count / limit),
        currentPage: parseInt(page, 10),
        pageSize: parseInt(limit, 10),
        data: result.rows.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          beginning_qty: item.beginning_qty,
          sku: item.sku,
          barcode: item.barcode,
          cost: item.cost,
          unit_of_measurement: item.unit_of_measurement,
          sold_by: item.sold_by,
          image: item.image,
          warehouse: {
            id: item.warehouse.id,
            name: item.warehouse.name,
          },
          category: {
            id: item.category.id,
            name: item.category.name,
          },
          ...(item.subcategory && {
            subcategory: {
              id: item.subcategory.id,
              name: item.subcategory.name,
              description: item.subcategory.description,
            },
          }),
        })),
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error fetching items", error: error.message });
    }
  }

  async create(req, res) {
    try {
      const newItem = await itemService.create(req.body);
      res.status(201).json(newItem);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error creating item", error: error.message });
    }
  }

  async getById(req, res) {
    try {
      const item = await itemService.getById(req.params.id);
      if (item) {
        res.status(200).json(item);
      } else {
        res.status(404).json({ message: "Item not found" });
      }
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error fetching item", error: error.message });
    }
  }

  async update(req, res) {
    try {
      const updatedItem = await itemService.alter(req.params.id, req.body);
      if (updatedItem) {
        res.status(200).json(updatedItem);
      } else {
        res.status(404).json({ message: "Item not found" });
      }
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error updating item", error: error.message });
    }
  }

  async delete(req, res) {
    try {
      const result = await itemService.delete(req.params.id);
      if (result) {
        res.status(200).json({ message: "Item deleted" });
      } else {
        res.status(404).json({ message: "Item not found" });
      }
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error deleting item", error: error.message });
    }
  }
}

module.exports = new ItemController();
