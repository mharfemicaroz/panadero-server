const payrollService = global.requireV2("services/hr/payrollService");

class PayrollController {
  async list(req, res) {
    try {
      const result = await payrollService.getList(req.query);
      res.status(200).json({
        total: result.count,
        totalPages: Math.ceil(result.count / (req.query.limit || 10)),
        currentPage: parseInt(req.query.page || 1, 10),
        pageSize: parseInt(req.query.limit || 10, 10),
        data: result.rows,
      });
    } catch (error) {
      res.status(500).json({
        message: "Error fetching payroll records",
        error: error.message,
      });
    }
  }

  async create(req, res) {
    try {
      const newPayroll = await payrollService.create(req.body);
      res.status(201).json(newPayroll);
    } catch (error) {
      res.status(500).json({
        message: "Error creating payroll record",
        error: error.message,
      });
    }
  }

  async getById(req, res) {
    try {
      const payroll = await payrollService.getById(req.params.id);
      if (payroll) {
        res.status(200).json(payroll);
      } else {
        res.status(404).json({ message: "Payroll record not found" });
      }
    } catch (error) {
      res.status(500).json({
        message: "Error fetching payroll record",
        error: error.message,
      });
    }
  }

  async update(req, res) {
    try {
      const updatedPayroll = await payrollService.update(
        req.params.id,
        req.body
      );
      if (updatedPayroll) {
        res.status(200).json(updatedPayroll);
      } else {
        res.status(404).json({ message: "Payroll record not found" });
      }
    } catch (error) {
      res.status(500).json({
        message: "Error updating payroll record",
        error: error.message,
      });
    }
  }

  async delete(req, res) {
    try {
      const result = await payrollService.delete(req.params.id);
      if (result) {
        res.status(200).json({ message: "Payroll record deleted" });
      } else {
        res.status(404).json({ message: "Payroll record not found" });
      }
    } catch (error) {
      res.status(500).json({
        message: "Error deleting payroll record",
        error: error.message,
      });
    }
  }

  async calculatePayroll(req, res) {
    try {
      const { employee_id, start_date, end_date } = req.body;

      if (!employee_id || !start_date || !end_date) {
        return res.status(400).json({
          message: "Employee ID, start date, and end date are required",
        });
      }

      const calculation = await payrollService.calculatePayroll(
        employee_id,
        start_date,
        end_date
      );

      res.status(200).json(calculation);
    } catch (error) {
      res.status(500).json({
        message: "Error calculating payroll",
        error: error.message,
      });
    }
  }

  async generatePayroll(req, res) {
    try {
      const { employee_id, start_date, end_date } = req.body;

      if (!employee_id || !start_date || !end_date) {
        return res.status(400).json({
          message: "Employee ID, start date, and end date are required",
        });
      }

      const payroll = await payrollService.generatePayroll(
        employee_id,
        start_date,
        end_date
      );

      res.status(201).json(payroll);
    } catch (error) {
      res.status(500).json({
        message: "Error generating payroll",
        error: error.message,
      });
    }
  }

  async approvePayroll(req, res) {
    try {
      const payroll = await payrollService.approvePayroll(req.params.id);
      if (payroll) {
        res.status(200).json(payroll);
      } else {
        res.status(404).json({ message: "Payroll record not found" });
      }
    } catch (error) {
      res.status(500).json({
        message: "Error approving payroll",
        error: error.message,
      });
    }
  }

  async markAsPaid(req, res) {
    try {
      const { payment_method, remarks } = req.body;

      if (!payment_method) {
        return res.status(400).json({
          message: "Payment method is required",
        });
      }

      const payroll = await payrollService.markAsPaid(req.params.id, {
        method: payment_method,
        remarks,
      });

      if (payroll) {
        res.status(200).json(payroll);
      } else {
        res.status(404).json({ message: "Payroll record not found" });
      }
    } catch (error) {
      res.status(500).json({
        message: "Error marking payroll as paid",
        error: error.message,
      });
    }
  }
}

module.exports = new PayrollController();
