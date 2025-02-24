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

    // Only calculate total hours on a time_out log
    if (type === "time_out") {
      // Fetch daily logs with an ample limit and ensure sorting by log_time
      const dailyLogsResult = await timeLogRepository.getDailyLogs({
        page: 1,
        limit: 1000, // adjust limit as needed
        filters: { employee_id: employeeId },
        date: today,
        sortBy: "log_time",
        sortOrder: "ASC",
      });

      // Sort logs in ascending order of log_time
      const sortedLogs = dailyLogsResult.rows.sort(
        (a, b) => new Date(a.log_time) - new Date(b.log_time)
      );

      // Find the first time_in entry
      const firstTimeIn = sortedLogs.find((log) => log.type === "time_in");

      let totalHours = 0;
      if (firstTimeIn) {
        // Find the first time_out entry that occurs after the first time_in
        const firstTimeOut = sortedLogs.find(
          (log) =>
            log.type === "time_out" &&
            new Date(log.log_time) > new Date(firstTimeIn.log_time)
        );

        if (firstTimeOut) {
          totalHours = moment(firstTimeOut.log_time).diff(
            moment(firstTimeIn.log_time),
            "hours",
            true
          );
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
          overtime_hours: Math.max(0, totalHours - 8),
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
