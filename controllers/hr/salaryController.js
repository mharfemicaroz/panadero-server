const salaryService = global.requireV2("services/hr/salaryService");

class SalaryController {
  async list(req, res) {
    try {
      const result = await salaryService.getList(req.query);
      res.status(200).json({
        total: result.count,
        totalPages: Math.ceil(result.count / (req.query.limit || 10)),
        currentPage: parseInt(req.query.page || 1, 10),
        pageSize: parseInt(req.query.limit || 10, 10),
        data: result.rows,
      });
    } catch (error) {
      res.status(500).json({
        message: "Error fetching salary records",
        error: error.message,
      });
    }
  }

  async create(req, res) {
    try {
      // Validate salary change
      const validation = await salaryService.validateSalaryChange(
        req.body.employee_id,
        req.body.basic_salary
      );

      if (!validation.valid) {
        return res.status(400).json({
          message: validation.message,
        });
      }

      const newSalary = await salaryService.create(req.body);
      res.status(201).json(newSalary);
    } catch (error) {
      res.status(500).json({
        message: "Error creating salary record",
        error: error.message,
      });
    }
  }

  async getById(req, res) {
    try {
      const salary = await salaryService.getById(req.params.id);
      if (salary) {
        res.status(200).json(salary);
      } else {
        res.status(404).json({ message: "Salary record not found" });
      }
    } catch (error) {
      res.status(500).json({
        message: "Error fetching salary record",
        error: error.message,
      });
    }
  }

  async update(req, res) {
    try {
      // If basic salary is being updated, validate the change
      if (req.body.basic_salary) {
        const validation = await salaryService.validateSalaryChange(
          req.body.employee_id,
          req.body.basic_salary
        );

        if (!validation.valid) {
          return res.status(400).json({
            message: validation.message,
          });
        }
      }

      const updatedSalary = await salaryService.update(req.params.id, req.body);
      if (updatedSalary) {
        res.status(200).json(updatedSalary);
      } else {
        res.status(404).json({ message: "Salary record not found" });
      }
    } catch (error) {
      res.status(500).json({
        message: "Error updating salary record",
        error: error.message,
      });
    }
  }

  async delete(req, res) {
    try {
      const result = await salaryService.delete(req.params.id);
      if (result) {
        res.status(200).json({ message: "Salary record deleted" });
      } else {
        res.status(404).json({ message: "Salary record not found" });
      }
    } catch (error) {
      res.status(500).json({
        message: "Error deleting salary record",
        error: error.message,
      });
    }
  }

  async getCurrentSalary(req, res) {
    try {
      const salary = await salaryService.getCurrentSalary(
        req.params.employeeId
      );
      if (salary) {
        res.status(200).json(salary);
      } else {
        res.status(404).json({ message: "No active salary record found" });
      }
    } catch (error) {
      res.status(500).json({
        message: "Error fetching current salary",
        error: error.message,
      });
    }
  }

  async getSalaryHistory(req, res) {
    try {
      const history = await salaryService.getSalaryHistory(
        req.params.employeeId
      );
      res.status(200).json(history);
    } catch (error) {
      res.status(500).json({
        message: "Error fetching salary history",
        error: error.message,
      });
    }
  }

  async calculateRates(req, res) {
    try {
      const { basic_salary } = req.body;
      if (!basic_salary) {
        return res.status(400).json({
          message: "Basic salary is required",
        });
      }

      const rates = await salaryService.calculateSalaryRates(basic_salary);
      res.status(200).json(rates);
    } catch (error) {
      res.status(500).json({
        message: "Error calculating salary rates",
        error: error.message,
      });
    }
  }
}

module.exports = new SalaryController();
