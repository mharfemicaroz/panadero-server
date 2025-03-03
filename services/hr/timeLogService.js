const timeLogRepository = global.requireV2("repositories/hr/timeLogRepository");
const attendanceRepository = global.requireV2(
  "repositories/hr/attendanceRepository"
);
const moment = require("moment");
const holidayCache = {};

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

    // Only calculate total hours, night differential, and holiday info on a time_out log
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
      let nightDifferentialHours = 0;
      if (firstTimeIn) {
        // Find the first time_out entry that occurs after the first time_in
        const firstTimeOut = sortedLogs.find(
          (log) =>
            log.type === "time_out" &&
            new Date(log.log_time) > new Date(firstTimeIn.log_time)
        );

        if (firstTimeOut) {
          // Compute total hours worked (including fractions)
          totalHours = moment(firstTimeOut.log_time).diff(
            moment(firstTimeIn.log_time),
            "hours",
            true
          );

          // Calculate night differential hours
          // Assume night differential period is from 22:00 to 06:00
          const timeInMoment = moment(firstTimeIn.log_time);
          const timeOutMoment = moment(firstTimeOut.log_time);

          // Define the night differential window based on the time_in day
          const nightStart = moment(timeInMoment).set({
            hour: 22,
            minute: 0,
            second: 0,
            millisecond: 0,
          });
          const nightEnd = moment(timeInMoment).add(1, "day").set({
            hour: 6,
            minute: 0,
            second: 0,
            millisecond: 0,
          });

          // Calculate the overlap of [timeInMoment, timeOutMoment] with [nightStart, nightEnd]
          const effectiveStart = moment.max(timeInMoment, nightStart);
          const effectiveEnd = moment.min(timeOutMoment, nightEnd);
          nightDifferentialHours = effectiveEnd.diff(
            effectiveStart,
            "hours",
            true
          );
          if (nightDifferentialHours < 0) {
            nightDifferentialHours = 0;
          }
        }
      }

      // Check if today is a public holiday using the cache
      const year = moment(now).format("YYYY");
      let isHoliday = false;
      try {
        let holidays;
        if (holidayCache[year]) {
          // Use cached holiday data
          holidays = holidayCache[year];
        } else {
          // Fetch holiday data and store it in cache
          const holidayApiUrl = `https://date.nager.at/api/v3/PublicHolidays/${year}/PH`;
          const response = await fetch(holidayApiUrl);
          if (response.ok) {
            holidays = await response.json();
            holidayCache[year] = holidays; // Cache the result
          }
        }

        if (holidays) {
          // The API returns holidays with a date string in YYYY-MM-DD format
          isHoliday = holidays.some((holiday) => holiday.date === today);
        }
      } catch (error) {
        console.error("Holiday fetch error:", error);
        // Proceed with isHoliday as false if the API fails
      }

      // Determine attendance status (you may choose different logic for holidays)
      let status = totalHours >= 8 ? "present" : "half_day";
      if (isHoliday) {
        // For example, you might still mark the employee as "present" on holidays
        status = "present";
      }

      // Get or create attendance record for the day, now including new computed fields
      let attendance = await attendanceRepository.findByEmployeeAndDate(
        employeeId,
        today
      );

      const attendanceData = {
        status: status,
        total_hours: totalHours,
        overtime_hours: Math.max(0, totalHours - 8),
        night_differential_hours: nightDifferentialHours,
        is_holiday: isHoliday,
      };

      if (!attendance) {
        attendance = await attendanceRepository.create({
          employee_id: employeeId,
          date: today,
          ...attendanceData,
        });
      } else {
        await attendance.update(attendanceData);
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
