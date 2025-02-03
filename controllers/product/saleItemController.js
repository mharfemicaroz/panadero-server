const saleItemService = global.requireV2("services/product/saleItemService");

class SaleItemController {
  async getById(req, res) {
    try {
      const saleItem = await saleItemService.getById(req.params.id);
      if (!saleItem)
        return res.status(404).json({ message: "Sale item not found" });
      res.status(200).json(saleItem);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error fetching sale item", error: error.message });
    }
  }

  async update(req, res) {
    try {
      const updated = await saleItemService.update(req.params.id, req.body);
      if (!updated)
        return res.status(404).json({ message: "Sale item not found" });
      res.status(200).json(updated);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error updating sale item", error: error.message });
    }
  }

  async delete(req, res) {
    try {
      const result = await saleItemService.delete(req.params.id);
      if (!result)
        return res.status(404).json({ message: "Sale item not found" });
      res.status(200).json({ message: "Sale item deleted" });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error deleting sale item", error: error.message });
    }
  }
}

module.exports = new SaleItemController();
