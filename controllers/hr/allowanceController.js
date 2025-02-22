const allowanceService = global.requireV2("services/hr/allowanceService");

class AllowanceController {
  async list(req, res) {
    try {
      const result = await allowanceService.getList(req.query);
      res.status(200).json({
        total: result.count,
        totalPages: Math.ceil(result.count / (req.query.limit || 10)),
        currentPage: parseInt(req.query.page || 1, 10),
        pageSize: parseInt(req.query.limit || 10, 10),
        data: result.rows,
      });
    } catch (error) {
      res.status(500).json({
        message: "Error fetching allowances",
        error: error.message,
      });
    }
  }

  async create(req, res) {
    try {
      const newAllowance = await allowanceService.create(req.body);
      res.status(201).json(newAllowance);
    } catch (error) {
      res.status(500).json({
        message: "Error creating allowance",
        error: error.message,
      });
    }
  }

  async getById(req, res) {
    try {
      const allowance = await allowanceService.getById(req.params.id);
      if (allowance) {
        res.status(200).json(allowance);
      } else {
        res.status(404).json({ message: "Allowance not found" });
      }
    } catch (error) {
      res.status(500).json({
        message: "Error fetching allowance",
        error: error.message,
      });
    }
  }

  async update(req, res) {
    try {
      const updatedAllowance = await allowanceService.update(
        req.params.id,
        req.body
      );
      if (updatedAllowance) {
        res.status(200).json(updatedAllowance);
      } else {
        res.status(404).json({ message: "Allowance not found" });
      }
    } catch (error) {
      res.status(500).json({
        message: "Error updating allowance",
        error: error.message,
      });
    }
  }

  async delete(req, res) {
    try {
      const result = await allowanceService.delete(req.params.id);
      if (result) {
        res.status(200).json({ message: "Allowance deleted" });
      } else {
        res.status(404).json({ message: "Allowance not found" });
      }
    } catch (error) {
      res.status(500).json({
        message: "Error deleting allowance",
        error: error.message,
      });
    }
  }
}

module.exports = new AllowanceController();
