const leaveRequestService = global.requireV2("services/hr/leaveRequestService");

class LeaveRequestController {
  async list(req, res) {
    try {
      const result = await leaveRequestService.getList(req.query);
      res.status(200).json({
        total: result.count,
        totalPages: Math.ceil(result.count / (req.query.limit || 10)),
        currentPage: parseInt(req.query.page || 1, 10),
        pageSize: parseInt(req.query.limit || 10, 10),
        data: result.rows,
      });
    } catch (error) {
      res.status(500).json({
        message: "Error fetching leave requests",
        error: error.message,
      });
    }
  }

  async create(req, res) {
    try {
      const newLeaveRequest = await leaveRequestService.create(req.body);
      res.status(201).json(newLeaveRequest);
    } catch (error) {
      res.status(500).json({
        message: "Error creating leave request",
        error: error.message,
      });
    }
  }

  async getById(req, res) {
    try {
      const leaveRequest = await leaveRequestService.getById(req.params.id);
      if (leaveRequest) {
        res.status(200).json(leaveRequest);
      } else {
        res.status(404).json({ message: "Leave request not found" });
      }
    } catch (error) {
      res.status(500).json({
        message: "Error fetching leave request",
        error: error.message,
      });
    }
  }

  async update(req, res) {
    try {
      const updatedLeaveRequest = await leaveRequestService.update(
        req.params.id,
        req.body
      );
      if (updatedLeaveRequest) {
        res.status(200).json(updatedLeaveRequest);
      } else {
        res.status(404).json({ message: "Leave request not found" });
      }
    } catch (error) {
      res.status(500).json({
        message: "Error updating leave request",
        error: error.message,
      });
    }
  }

  async delete(req, res) {
    try {
      const result = await leaveRequestService.delete(req.params.id);
      if (result) {
        res.status(200).json({ message: "Leave request deleted" });
      } else {
        res.status(404).json({ message: "Leave request not found" });
      }
    } catch (error) {
      res.status(500).json({
        message: "Error deleting leave request",
        error: error.message,
      });
    }
  }

  async reject(req, res) {
    try {
      const updatedLeaveRequest = await leaveRequestService.reject(
        req.params.id,
        req.body.reason
      );
      if (updatedLeaveRequest) {
        res.status(200).json(updatedLeaveRequest);
      } else {
        res.status(404).json({ message: "Leave request not found" });
      }
    } catch (error) {
      res.status(500).json({
        message: "Error rejecting leave request",
        error: error.message,
      });
    }
  }

  async escalate(req, res) {
    try {
      const updatedLeaveRequest = await leaveRequestService.escalate(
        req.params.id,
        req.body.approver_id
      );
      if (updatedLeaveRequest) {
        res.status(200).json(updatedLeaveRequest);
      } else {
        res.status(404).json({ message: "Leave request not found" });
      }
    } catch (error) {
      res.status(500).json({
        message: "Error escalating leave request",
        error: error.message,
      });
    }
  }

  async approve(req, res) {
    try {
      const updatedLeaveRequest = await leaveRequestService.update(
        req.params.id,
        { status: "approved" }
      );
      if (updatedLeaveRequest) {
        res.status(200).json(updatedLeaveRequest);
      } else {
        res.status(404).json({ message: "Leave request not found" });
      }
    } catch (error) {
      res.status(500).json({
        message: "Error approving leave request",
        error: error.message,
      });
    }
  }
}

module.exports = new LeaveRequestController();
