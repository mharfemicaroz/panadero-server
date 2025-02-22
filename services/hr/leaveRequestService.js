const leaveRequestRepository = global.requireV2(
  "repositories/hr/leaveRequestRepository"
);
const leaveBalanceRepository = global.requireV2(
  "repositories/hr/leaveBalanceRepository"
);
const leaveBalanceService = global.requireV2("services/hr/leaveBalanceService");
const leaveTypeRepository = global.requireV2(
  "repositories/hr/leaveTypeRepository"
);

class LeaveRequestService {
  async getList(queryParams) {
    return leaveRequestRepository.listing(queryParams);
  }

  async create(data) {
    // Check leave balance before creating a leave request
    const leaveBalance = await leaveBalanceRepository.getEmployeeLeaveBalance(
      data.employee_id
    );
    const leaveType = await leaveTypeRepository.getById(data.leave_type_id);

    if (
      !leaveBalance ||
      leaveBalance.remaining_days < data.end_date - data.start_date + 1
    ) {
      throw new Error("Insufficient leave balance");
    }

    return leaveRequestRepository.create(data);
  }

  async getById(id) {
    return leaveRequestRepository.getById(id);
  }

  async update(id, data) {
    const leaveRequest = await leaveRequestRepository.getById(id);
    if (!leaveRequest) return null;

    // If the status is being updated to "approved"
    if (data.status === "approved" && leaveRequest.status !== "approved") {
      const leaveBalance = await leaveBalanceRepository.getEmployeeLeaveBalance(
        leaveRequest.employee_id
      );
      const leaveDays =
        Math.ceil(
          (new Date(leaveRequest.end_date) -
            new Date(leaveRequest.start_date)) /
            (1000 * 60 * 60 * 24)
        ) + 1;

      if (!leaveBalance || leaveBalance.remaining_days < leaveDays) {
        throw new Error("Insufficient leave balance");
      }

      // Deduct leave balance
      await leaveBalanceRepository.deductLeaveBalance(
        leaveRequest.employee_id,
        leaveRequest.leave_type_id,
        leaveDays
      );
    }

    return leaveRequestRepository.update(id, data);
  }

  async delete(id) {
    const leaveRequest = await leaveRequestRepository.getById(id);
    if (!leaveRequest) return null;

    // Restore leave balance if the leave request was approved
    if (leaveRequest.status === "approved") {
      const leaveDays =
        Math.ceil(
          (new Date(leaveRequest.end_date) -
            new Date(leaveRequest.start_date)) /
            (1000 * 60 * 60 * 24)
        ) + 1;
      await leaveBalanceService.restoreLeaveBalance(
        leaveRequest.employee_id,
        leaveRequest.leave_type_id,
        leaveDays
      );
    }

    return leaveRequestRepository.delete(id);
  }

  async reject(id, reason) {
    const leaveRequest = await leaveRequestRepository.getById(id);
    if (!leaveRequest) return null;

    // Restore leave balance if the leave request was approved
    if (leaveRequest.status === "approved") {
      const leaveDays =
        Math.ceil(
          (new Date(leaveRequest.end_date) -
            new Date(leaveRequest.start_date)) /
            (1000 * 60 * 60 * 24)
        ) + 1;
      await leaveBalanceService.restoreLeaveBalance(
        leaveRequest.employee_id,
        leaveRequest.leave_type_id,
        leaveDays
      );
    }

    return leaveRequestRepository.update(id, {
      status: "rejected",
      remarks: reason,
    });
  }

  async escalate(id, approverId) {
    const leaveRequest = await leaveRequestRepository.getById(id);
    if (!leaveRequest) return null;

    return leaveRequestRepository.update(id, { approver_id: approverId });
  }
}

module.exports = new LeaveRequestService();
