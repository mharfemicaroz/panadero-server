const leaveBalanceRepository = global.requireV2(
  "repositories/hr/leaveBalanceRepository"
);
const leaveTypeRepository = global.requireV2(
  "repositories/hr/leaveTypeRepository"
);

class LeaveBalanceService {
  async getList(queryParams) {
    return leaveBalanceRepository.listing(queryParams);
  }

  async create(data) {
    return leaveBalanceRepository.create(data);
  }

  async getById(id) {
    return leaveBalanceRepository.getById(id);
  }

  async update(id, data) {
    return leaveBalanceRepository.update(id, data);
  }

  async delete(id) {
    return leaveBalanceRepository.delete(id);
  }

  async getEmployeeLeaveBalance(employeeId) {
    return leaveBalanceRepository.getEmployeeLeaveBalance(employeeId);
  }

  async deductLeaveBalance(employeeId, leaveTypeId, days) {
    const leaveBalance = await leaveBalanceRepository.getEmployeeLeaveBalance(
      employeeId,
      leaveTypeId
    );
    if (!leaveBalance) {
      throw new Error("Leave balance not found");
    }

    if (leaveBalance.remaining_days < days) {
      throw new Error("Insufficient leave balance");
    }

    leaveBalance.used_days += days;
    leaveBalance.remaining_days -= days;

    return leaveBalance.save();
  }

  async carryForwardLeaveBalance(employeeId, leaveTypeId) {
    const leaveBalance = await leaveBalanceRepository.getEmployeeLeaveBalance(
      employeeId,
      leaveTypeId
    );
    if (!leaveBalance) {
      throw new Error("Leave balance not found");
    }

    const leaveType = await leaveTypeRepository.getById(leaveTypeId);
    const carryForwardDays = Math.min(
      leaveBalance.remaining_days,
      leaveType.carry_forward_limit
    );

    if (carryForwardDays > 0) {
      leaveBalance.carry_forward_days = carryForwardDays;
      leaveBalance.remaining_days = 0;
      await leaveBalance.save();
    }

    return leaveBalance;
  }

  async restoreLeaveBalance(employeeId, leaveTypeId, days) {
    const leaveBalance = await leaveBalanceRepository.getEmployeeLeaveBalance(
      employeeId,
      leaveTypeId
    );
    if (!leaveBalance) {
      throw new Error("Leave balance not found");
    }

    leaveBalance.used_days -= days;
    leaveBalance.remaining_days += days;

    return leaveBalance.save();
  }
}

module.exports = new LeaveBalanceService();
