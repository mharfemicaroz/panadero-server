const attendanceService = global.requireV2("services/hr/attendanceService");

class AttendanceController {
  async list(req, res) {
    try {
      // Extract pagination and sorting parameters with optional defaults
      const { page, limit, sort, order } = req.query;

      // Use filters from req.query.filters if provided; otherwise, use an empty object.
      const filters = req.query.filters || {};

      // Build query parameters including sorting information.
      const queryParams = {
        page,
        limit,
        filters,
        sortBy: sort, // will default to repository default if undefined
        sortOrder: order, // will default to repository default if undefined
      };

      const result = await attendanceService.getList(queryParams);

      res.status(200).json({
        total: result.count,
        totalPages: limit ? Math.ceil(result.count / limit) : null,
        currentPage: limit ? parseInt(page, 10) : null,
        pageSize: limit ? parseInt(limit, 10) : null,
        data: result.rows,
      });
    } catch (error) {
      res.status(500).json({
        message: "Error fetching attendance records",
        error: error.message,
      });
    }
  }

  async create(req, res) {
    try {
      const newAttendance = await attendanceService.create(req.body);
      res.status(201).json(newAttendance);
    } catch (error) {
      res.status(500).json({
        message: "Error creating attendance record",
        error: error.message,
      });
    }
  }

  async getById(req, res) {
    try {
      const attendance = await attendanceService.getById(req.params.id);
      if (attendance) {
        res.status(200).json(attendance);
      } else {
        res.status(404).json({ message: "Attendance record not found" });
      }
    } catch (error) {
      res.status(500).json({
        message: "Error fetching attendance record",
        error: error.message,
      });
    }
  }

  async update(req, res) {
    try {
      const updatedAttendance = await attendanceService.update(
        req.params.id,
        req.body
      );
      if (updatedAttendance) {
        res.status(200).json(updatedAttendance);
      } else {
        res.status(404).json({ message: "Attendance record not found" });
      }
    } catch (error) {
      res.status(500).json({
        message: "Error updating attendance record",
        error: error.message,
      });
    }
  }

  async delete(req, res) {
    try {
      const result = await attendanceService.delete(req.params.id);
      if (result) {
        res.status(200).json({ message: "Attendance record deleted" });
      } else {
        res.status(404).json({ message: "Attendance record not found" });
      }
    } catch (error) {
      res.status(500).json({
        message: "Error deleting attendance record",
        error: error.message,
      });
    }
  }

  async getDailyAttendance(req, res) {
    try {
      const { employeeId } = req.params;
      const { date } = req.query;

      if (!date) {
        return res.status(400).json({ message: "Date parameter is required" });
      }

      const attendance = await attendanceService.getDailyAttendance(
        employeeId,
        date
      );

      if (!attendance) {
        return res.status(404).json({
          message: "No attendance record found for this date",
        });
      }

      res.status(200).json(attendance);
    } catch (error) {
      res.status(500).json({
        message: "Error fetching daily attendance",
        error: error.message,
      });
    }
  }

  async computeAttendance(req, res) {
    try {
      const { employeeId } = req.params;
      const { date } = req.query;

      if (!date) {
        return res.status(400).json({ message: "Date parameter is required" });
      }

      const attendance = await attendanceService.updateAttendanceFromTimeLogs(
        employeeId,
        date
      );

      res.status(200).json(attendance);
    } catch (error) {
      res.status(500).json({
        message: "Error computing attendance",
        error: error.message,
      });
    }
  }
}

module.exports = new AttendanceController();
