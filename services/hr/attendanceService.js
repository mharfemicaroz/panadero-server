const attendanceRepository = global.requireV2(
  "repositories/hr/attendanceRepository"
);
const moment = require("moment");

class AttendanceService {
  async getList(queryParams) {
    return attendanceRepository.listing(queryParams);
  }

  async create(data) {
    return attendanceRepository.create(data);
  }

  async getById(id) {
    return attendanceRepository.getById(id);
  }

  async update(id, data) {
    return attendanceRepository.update(id, data);
  }

  async delete(id) {
    return attendanceRepository.delete(id);
  }

  async computeHours(employeeId, date) {
    const timeLogs = await attendanceRepository.getTimeLogs(employeeId, date);
    let totalHours = 0;
    let lastTimeIn = null;

    // Sort logs by time to ensure proper pairing
    timeLogs.sort((a, b) => a.log_time - b.log_time);

    // Calculate total hours by pairing time_in with time_out
    for (const log of timeLogs) {
      if (log.type === "time_in") {
        lastTimeIn = log.log_time;
      } else if (log.type === "time_out" && lastTimeIn) {
        const duration = moment.duration(
          moment(log.log_time).diff(moment(lastTimeIn))
        );
        totalHours += duration.asHours();
        lastTimeIn = null;
      }
    }

    // Round to 2 decimal places
    totalHours = Math.round(totalHours * 100) / 100;

    // Calculate overtime (assuming 8-hour standard workday)
    const standardHours = 8;
    const overtimeHours = Math.max(0, totalHours - standardHours);

    // Determine status based on total hours
    let status = "absent";
    if (totalHours >= standardHours) {
      status = "present";
    } else if (totalHours >= standardHours / 2) {
      status = "half_day";
    } else if (totalHours > 0) {
      status = "late";
    }

    return {
      total_hours: totalHours,
      overtime_hours: overtimeHours,
      status,
    };
  }

  async updateAttendanceFromTimeLogs(employeeId, date) {
    // Find or create attendance record
    let attendance = await attendanceRepository.findByEmployeeAndDate(
      employeeId,
      date
    );
    const computedHours = await this.computeHours(employeeId, date);

    if (!attendance) {
      attendance = await attendanceRepository.create({
        employee_id: employeeId,
        date: date,
        ...computedHours,
      });
    } else {
      attendance = await attendanceRepository.update(
        attendance.id,
        computedHours
      );
    }

    return attendance;
  }

  async getDailyAttendance(employeeId, date) {
    const attendance = await attendanceRepository.findByEmployeeAndDate(
      employeeId,
      date
    );
    if (!attendance) {
      return null;
    }

    const timeLogs = await attendanceRepository.getTimeLogs(employeeId, date);
    return {
      ...attendance.toJSON(),
      time_logs: timeLogs,
    };
  }
}

module.exports = new AttendanceService();
