const branchService = global.requireV2("services/branch/branchService");

class BranchController {
  async list(req, res) {
    try {
      const { page, limit, name, location, is_active, sortBy, sortOrder } =
        req.query;
      const filters = {
        name,
        location,
        is_active: is_active !== undefined ? is_active === "true" : undefined,
      };
      const queryParams = { page, limit, filters, sortBy, sortOrder };
      const result = await branchService.getList(queryParams);
      res.status(200).json({
        total: result.count,
        totalPages: Math.ceil(result.count / (limit || 10)),
        currentPage: parseInt(page || 1, 10),
        pageSize: parseInt(limit || 10, 10),
        data: result.rows,
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error fetching branches", error: error.message });
    }
  }
  async create(req, res) {
    try {
      const newBranch = await branchService.create(req.body);
      res.status(201).json(newBranch);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error creating branch", error: error.message });
    }
  }
  async getById(req, res) {
    try {
      const branch = await branchService.getById(req.params.id);
      if (!branch) {
        return res.status(404).json({ message: "Branch not found" });
      }
      res.status(200).json(branch);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error fetching branch", error: error.message });
    }
  }
  async update(req, res) {
    try {
      const updatedBranch = await branchService.alter(req.params.id, req.body);
      if (!updatedBranch) {
        return res.status(404).json({ message: "Branch not found" });
      }
      res.status(200).json(updatedBranch);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error updating branch", error: error.message });
    }
  }
  async delete(req, res) {
    try {
      const result = await branchService.delete(req.params.id);
      if (!result) {
        return res.status(404).json({ message: "Branch not found" });
      }
      res.status(200).json({ message: "Branch deleted" });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error deleting branch", error: error.message });
    }
  }
}

module.exports = new BranchController();
