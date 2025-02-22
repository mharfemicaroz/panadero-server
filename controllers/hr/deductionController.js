const deductionService = global.requireV2("services/hr/deductionService");

class DeductionController {
  async list(req, res) {
    try {
      const result = await deductionService.getList(req.query);
      res.status(200).json({
        total: result.count,
        totalPages: Math.ceil(result.count / (req.query.limit || 10)),
        currentPage: parseInt(req.query.page || 1, 10),
        pageSize: parseInt(req.query.limit || 10, 10),
        data: result.rows,
      });
    } catch (error) {
      res.status(500).json({
        message: "Error fetching deductions",
        error: error.message,
      });
    }
  }

  async create(req, res) {
    try {
      const newDeduction = await deductionService.create(req.body);
      res.status(201).json(newDeduction);
    } catch (error) {
      res.status(500).json({
        message: "Error creating deduction",
        error: error.message,
      });
    }
  }

  async getById(req, res) {
    try {
      const deduction = await deductionService.getById(req.params.id);
      if (deduction) {
        res.status(200).json(deduction);
      } else {
        res.status(404).json({ message: "Deduction not found" });
      }
    } catch (error) {
      res.status(500).json({
        message: "Error fetching deduction",
        error: error.message,
      });
    }
  }

  async update(req, res) {
    try {
      const updatedDeduction = await deductionService.update(
        req.params.id,
        req.body
      );
      if (updatedDeduction) {
        res.status(200).json(updatedDeduction);
      } else {
        res.status(404).json({ message: "Deduction not found" });
      }
    } catch (error) {
      res.status(500).json({
        message: "Error updating deduction",
        error: error.message,
      });
    }
  }

  async delete(req, res) {
    try {
      const result = await deductionService.delete(req.params.id);
      if (result) {
        res.status(200).json({ message: "Deduction deleted" });
      } else {
        res.status(404).json({ message: "Deduction not found" });
      }
    } catch (error) {
      res.status(500).json({
        message: "Error deleting deduction",
        error: error.message,
      });
    }
  }
}

module.exports = new DeductionController();
