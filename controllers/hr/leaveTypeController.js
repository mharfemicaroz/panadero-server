const leaveTypeService = global.requireV2("services/hr/leaveTypeService");

class LeaveTypeController {
  async list(req, res) {
    try {
      const result = await leaveTypeService.getList(req.query);
      res.status(200).json({
        total: result.count,
        totalPages: Math.ceil(result.count / (req.query.limit || 10)),
        currentPage: parseInt(req.query.page || 1, 10),
        pageSize: parseInt(req.query.limit || 10, 10),
        data: result.rows,
      });
    } catch (error) {
      res.status(500).json({
        message: "Error fetching leave types",
        error: error.message,
      });
    }
  }

  async create(req, res) {
    try {
      const newLeaveType = await leaveTypeService.create(req.body);
      res.status(201).json(newLeaveType);
    } catch (error) {
      res.status(500).json({
        message: "Error creating leave type",
        error: error.message,
      });
    }
  }

  async getById(req, res) {
    try {
      const leaveType = await leaveTypeService.getById(req.params.id);
      if (leaveType) {
        res.status(200).json(leaveType);
      } else {
        res.status(404).json({ message: "Leave type not found" });
      }
    } catch (error) {
      res.status(500).json({
        message: "Error fetching leave type",
        error: error.message,
      });
    }
  }

  async update(req, res) {
    try {
      const updatedLeaveType = await leaveTypeService.update(
        req.params.id,
        req.body
      );
      if (updatedLeaveType) {
        res.status(200).json(updatedLeaveType);
      } else {
        res.status(404).json({ message: "Leave type not found" });
      }
    } catch (error) {
      res.status(500).json({
        message: "Error updating leave type",
        error: error.message,
      });
    }
  }

  async delete(req, res) {
    try {
      const result = await leaveTypeService.delete(req.params.id);
      if (result) {
        res.status(200).json({ message: "Leave type deleted" });
      } else {
        res.status(404).json({ message: "Leave type not found" });
      }
    } catch (error) {
      res.status(500).json({
        message: "Error deleting leave type",
        error: error.message,
      });
    }
  }
}

module.exports = new LeaveTypeController();
