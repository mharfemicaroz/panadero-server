const timeLogRepository = global.requireV2("repositories/hr/timeLogRepository");
const attendanceRepository = global.requireV2(
  "repositories/hr/attendanceRepository"
);
const moment = require("moment");

class TimeLogService {
  async getList(queryParams) {
    return timeLogRepository.listing(queryParams);
  }

  async create(data) {
    return timeLogRepository.create(data);
  }

  async getById(id) {
    return timeLogRepository.getById(id);
  }

  async update(id, data) {
    return timeLogRepository.update(id, data);
  }

  async delete(id) {
    return timeLogRepository.delete(id);
  }

  async recordTimeLog(employeeId, type) {
    const now = new Date();
    const today = moment(now).format("YYYY-MM-DD");

    // Create the time log
    const timeLog = await timeLogRepository.create({
      employee_id: employeeId,
      type: type,
      log_time: now,
    });

    // Get all logs for the day
    const dailyLogs = await timeLogRepository.getDailyLogs(employeeId, today);

    // Calculate total hours if this is a time_out log
    if (type === "time_out") {
      let totalHours = 0;
      let lastTimeIn = null;

      for (const log of dailyLogs) {
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

      // Get or create attendance record for the day
      let attendance = await attendanceRepository.findByEmployeeAndDate(
        employeeId,
        today
      );

      if (!attendance) {
        attendance = await attendanceRepository.create({
          employee_id: employeeId,
          date: today,
          status: totalHours >= 8 ? "present" : "half_day",
          total_hours: totalHours,
          overtime_hours: Math.max(0, totalHours - 8), // Assuming 8 hours is standard workday
        });
      } else {
        await attendance.update({
          status: totalHours >= 8 ? "present" : "half_day",
          total_hours: totalHours,
          overtime_hours: Math.max(0, totalHours - 8),
        });
      }
    }

    return timeLog;
  }

  async getDailyLogs(queryParams) {
    return timeLogRepository.getDailyLogs(queryParams);
  }

  async getLatestLogByEmployee(employeeId, type) {
    return timeLogRepository.getLatestLogByEmployee(employeeId, type);
  }
}

module.exports = new TimeLogService();
