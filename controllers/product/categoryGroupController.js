const categoryGroupService = global.requireV2(
  "services/product/categoryGroupService"
);

class CategoryGroupController {
  async list(req, res) {
    try {
      const categoryGroups = await categoryGroupService.getList();
      res.status(200).json(categoryGroups);
    } catch (error) {
      res.status(500).json({
        message: "Error fetching category groups",
        error: error.message,
      });
    }
  }

  async create(req, res) {
    try {
      const newCategoryGroup = await categoryGroupService.create(req.body);
      res.status(201).json(newCategoryGroup);
    } catch (error) {
      res.status(500).json({
        message: "Error creating category group",
        error: error.message,
      });
    }
  }

  async getById(req, res) {
    try {
      const categoryGroup = await categoryGroupService.getById(req.params.id);
      if (categoryGroup) {
        res.status(200).json(categoryGroup);
      } else {
        res.status(404).json({ message: "Category group not found" });
      }
    } catch (error) {
      res.status(500).json({
        message: "Error fetching category group",
        error: error.message,
      });
    }
  }

  async update(req, res) {
    try {
      const updatedCategoryGroup = await categoryGroupService.alter(
        req.params.id,
        req.body
      );
      if (updatedCategoryGroup) {
        res.status(200).json(updatedCategoryGroup);
      } else {
        res.status(404).json({ message: "Category group not found" });
      }
    } catch (error) {
      res.status(500).json({
        message: "Error updating category group",
        error: error.message,
      });
    }
  }

  async delete(req, res) {
    try {
      const result = await categoryGroupService.delete(req.params.id);
      if (result) {
        res.status(200).json({ message: "Category group deleted" });
      } else {
        res.status(404).json({ message: "Category group not found" });
      }
    } catch (error) {
      res.status(500).json({
        message: "Error deleting category group",
        error: error.message,
      });
    }
  }
}

module.exports = new CategoryGroupController();
