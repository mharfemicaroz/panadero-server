const leaveBalanceService = global.requireV2("services/hr/leaveBalanceService");

class LeaveBalanceController {
  async list(req, res) {
    try {
      const result = await leaveBalanceService.getList(req.query);
      res.status(200).json({
        total: result.count,
        totalPages: Math.ceil(result.count / (req.query.limit || 10)),
        currentPage: parseInt(req.query.page || 1, 10),
        pageSize: parseInt(req.query.limit || 10, 10),
        data: result.rows,
      });
    } catch (error) {
      res.status(500).json({
        message: "Error fetching leave balances",
        error: error.message,
      });
    }
  }

  async create(req, res) {
    try {
      const newLeaveBalance = await leaveBalanceService.create(req.body);
      res.status(201).json(newLeaveBalance);
    } catch (error) {
      res.status(500).json({
        message: "Error creating leave balance",
        error: error.message,
      });
    }
  }

  async getById(req, res) {
    try {
      const leaveBalance = await leaveBalanceService.getById(req.params.id);
      if (leaveBalance) {
        res.status(200).json(leaveBalance);
      } else {
        res.status(404).json({ message: "Leave balance not found" });
      }
    } catch (error) {
      res.status(500).json({
        message: "Error fetching leave balance",
        error: error.message,
      });
    }
  }

  async update(req, res) {
    try {
      const updatedLeaveBalance = await leaveBalanceService.update(
        req.params.id,
        req.body
      );
      if (updatedLeaveBalance) {
        res.status(200).json(updatedLeaveBalance);
      } else {
        res.status(404).json({ message: "Leave balance not found" });
      }
    } catch (error) {
      res.status(500).json({
        message: "Error updating leave balance",
        error: error.message,
      });
    }
  }

  async delete(req, res) {
    try {
      const result = await leaveBalanceService.delete(req.params.id);
      if (result) {
        res.status(200).json({ message: "Leave balance deleted" });
      } else {
        res.status(404).json({ message: "Leave balance not found" });
      }
    } catch (error) {
      res.status(500).json({
        message: "Error deleting leave balance",
        error: error.message,
      });
    }
  }

  async getEmployeeLeaveBalance(req, res) {
    try {
      const leaveBalance = await leaveBalanceService.getEmployeeLeaveBalance(
        req.params.employeeId
      );
      if (leaveBalance) {
        res.status(200).json(leaveBalance);
      } else {
        res.status(404).json({ message: "Leave balance not found" });
      }
    } catch (error) {
      res.status(500).json({
        message: "Error fetching leave balance",
        error: error.message,
      });
    }
  }

  async carryForward(req, res) {
    try {
      const result = await leaveBalanceService.carryForwardLeaveBalance(
        req.params.employeeId,
        req.params.leaveTypeId
      );
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({
        message: "Error carrying forward leave balance",
        error: error.message,
      });
    }
  }
}

module.exports = new LeaveBalanceController();
