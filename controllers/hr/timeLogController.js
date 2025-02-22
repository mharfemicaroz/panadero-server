const timeLogService = global.requireV2("services/hr/timeLogService");
const employeeService = global.requireV2("services/hr/employeeService");
const { faceapi } = require("../../faceApiSetup");
const canvas = require("canvas");
const fs = require("fs");
const path = require("path");
const db = global.requireV2("models");

class TimeLogController {
  async list(req, res) {
    try {
      const {
        page = 1,
        limit = 10,
        sort = "created_at",
        order = "DESC",
        employeeId,
      } = req.query;

      let filters = req.query.filters || {};

      if (employeeId) {
        filters.employeeId = parseInt(employeeId, 10);
      }

      const queryParams = {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        filters,
        sortBy: sort,
        sortOrder: order,
      };

      const result = await timeLogService.getList(queryParams);

      res.status(200).json({
        total: result.count,
        totalPages: Math.ceil(result.count / limit),
        currentPage: parseInt(page, 10),
        pageSize: parseInt(limit, 10),
        data: result.rows,
      });
    } catch (error) {
      res.status(500).json({
        message: "Error fetching employees",
        error: error.message,
      });
    }
  }

  async create(req, res) {
    try {
      const newTimeLog = await timeLogService.create(req.body);
      res.status(201).json(newTimeLog);
    } catch (error) {
      res.status(500).json({
        message: "Error creating time log",
        error: error.message,
      });
    }
  }

  async getById(req, res) {
    try {
      const timeLog = await timeLogService.getById(req.params.id);
      if (timeLog) {
        res.status(200).json(timeLog);
      } else {
        res.status(404).json({ message: "Time log not found" });
      }
    } catch (error) {
      res.status(500).json({
        message: "Error fetching time log",
        error: error.message,
      });
    }
  }

  async update(req, res) {
    try {
      const updatedTimeLog = await timeLogService.update(
        req.params.id,
        req.body
      );
      if (updatedTimeLog) {
        res.status(200).json(updatedTimeLog);
      } else {
        res.status(404).json({ message: "Time log not found" });
      }
    } catch (error) {
      res.status(500).json({
        message: "Error updating time log",
        error: error.message,
      });
    }
  }

  async delete(req, res) {
    try {
      const result = await timeLogService.delete(req.params.id);
      if (result) {
        res.status(200).json({ message: "Time log deleted" });
      } else {
        res.status(404).json({ message: "Time log not found" });
      }
    } catch (error) {
      res.status(500).json({
        message: "Error deleting time log",
        error: error.message,
      });
    }
  }

  async recordTimeLog(req, res) {
    try {
      const { employeeId } = req.params;
      const { type, base64Image, storedPicturePath } = req.body;

      // Validate type
      if (!["time_in", "time_out"].includes(type)) {
        return res.status(400).json({ message: "Invalid time log type." });
      }

      // Convert Base64 to buffer
      if (!base64Image) {
        return res.status(400).json({ message: "No captured image provided" });
      }
      const capturedBase64 = base64Image.replace(
        /^data:image\/\w+;base64,/,
        ""
      );
      const capturedBuffer = Buffer.from(capturedBase64, "base64");

      // Read the employee's stored image from disk
      if (!storedPicturePath) {
        return res
          .status(400)
          .json({ message: "No stored picture path provided" });
      }
      const storedPath = path.join(
        __dirname,
        "../../public",
        storedPicturePath
      );
      if (!fs.existsSync(storedPath)) {
        return res.status(400).json({ message: "Stored image not found" });
      }
      const storedBuffer = fs.readFileSync(storedPath);

      // Create canvas images
      const capturedImg = new canvas.Image();
      capturedImg.src = capturedBuffer;

      const storedImg = new canvas.Image();
      storedImg.src = storedBuffer;

      // Detect and get face descriptors
      const capturedResult = await faceapi
        .detectSingleFace(capturedImg, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptor();

      const storedResult = await faceapi
        .detectSingleFace(storedImg, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (!capturedResult || !storedResult) {
        return res
          .status(400)
          .json({ message: "No face detected in one or both images" });
      }

      // Compare descriptors
      const distance = faceapi.euclideanDistance(
        capturedResult.descriptor,
        storedResult.descriptor
      );

      const THRESHOLD = 0.6; // typical threshold
      if (distance > THRESHOLD) {
        return res.status(400).json({
          message: "Faces do not match",
          distance,
        });
      }

      // If faces match, record the time log
      const timeLog = await timeLogService.recordTimeLog(employeeId, type);
      res.status(201).json({ timeLog, distance });
    } catch (err) {
      res.status(500).json({
        message: "Error recording time log with face recognition",
        error: err.message,
      });
    }
  }

  /**
   * faceVerifyTimeLog
   * 1) Receives { base64Image, type } from the client
   * 2) Compares the face to all employees' stored photos in /uploads/employees
   * 3) If there's a match (distance < threshold), record the time log for that employee
   * 4) Return the matched employee + time log. If no match, return an error.
   */
  async faceVerifyTimeLog(req, res) {
    try {
      const { base64Image, type } = req.body;

      if (!base64Image) {
        return res.status(400).json({ message: "No base64Image provided" });
      }
      if (!["time_in", "time_out"].includes(type)) {
        return res
          .status(400)
          .json({ message: "Invalid type. Must be 'time_in' or 'time_out'." });
      }

      // Convert the base64 string to a Buffer
      const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, "");
      const capturedBuffer = Buffer.from(base64Data, "base64");

      // Create a canvas Image from the captured photo
      const capturedImg = new canvas.Image();
      capturedImg.src = capturedBuffer;

      // Compute face descriptor for the submitted image
      const capturedResult = await faceapi
        .detectSingleFace(capturedImg, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (!capturedResult) {
        return res
          .status(400)
          .json({ message: "No face detected in captured image" });
      }

      // 1) Fetch employees that have a 'picture' column set
      //    (Assuming 'picture' is the field that holds the path to their photo)
      const employeesWithPhotos = await db.Employee.findAll({
        where: {
          picture: {
            [db.Sequelize.Op.ne]: null, // not null
          },
        },
      });

      let bestMatch = null;
      let bestDistance = Infinity;

      // 2) For each employee, read their stored picture, compute descriptor, compare
      for (const emp of employeesWithPhotos) {
        const photoPath = emp.picture; // e.g. "/uploads/employees/employee_1740185819821.jpg"
        const absolutePath = path.join(__dirname, "../../public", photoPath);

        if (!fs.existsSync(absolutePath)) {
          // skip if file doesn't exist
          continue;
        }

        const storedBuffer = fs.readFileSync(absolutePath);
        const storedImg = new canvas.Image();
        storedImg.src = storedBuffer;

        const storedResult = await faceapi
          .detectSingleFace(storedImg, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks()
          .withFaceDescriptor();

        if (!storedResult) {
          // no face in the stored image, skip
          continue;
        }

        // Compare descriptors
        const distance = faceapi.euclideanDistance(
          capturedResult.descriptor,
          storedResult.descriptor
        );

        // Track the best (lowest) distance
        if (distance < bestDistance) {
          bestDistance = distance;
          bestMatch = emp; // store the employee record
        }
      }

      // 3) Check if best match is under a threshold
      const THRESHOLD = 0.6;
      if (!bestMatch || bestDistance > THRESHOLD) {
        return res
          .status(200)
          .json({ message: "No match found", distance: bestDistance });
      }

      // 4) We have a match. Let's record the time log for bestMatch employee
      const timeLog = await timeLogService.recordTimeLog(bestMatch.id, type);

      return res.status(200).json({
        message: "Match found",
        distance: bestDistance,
        employee: bestMatch, // the matched employee
        timeLog,
      });
    } catch (error) {
      console.error("Error in faceVerifyTimeLog:", error);
      return res.status(500).json({
        message: "Error verifying face and recording time log",
        error: error.message,
      });
    }
  }

  async getDailyLogs(req, res) {
    try {
      // Extract query parameters with defaults.
      const {
        page = 1,
        limit = 10,
        sort = "created_at",
        order = "DESC",
        filters = {},
        date,
      } = req.query;

      const { employeeId } = req.params;
      if (employeeId) {
        filters.employee_id = parseInt(employeeId, 10);
      }

      // If date is not provided, default to today's date.
      let dailyDate = date;
      if (!dailyDate) {
        dailyDate = new Date().toISOString().split("T")[0];
      }

      const queryParams = {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        sortBy: sort,
        sortOrder: order,
        filters,
        date: dailyDate,
      };

      const result = await timeLogService.getDailyLogs(queryParams);

      res.status(200).json({
        total: result.count,
        totalPages: Math.ceil(result.count / queryParams.limit),
        currentPage: queryParams.page,
        pageSize: queryParams.limit,
        data: result.rows,
      });
    } catch (error) {
      res.status(500).json({
        message: "Error fetching daily logs",
        error: error.message,
      });
    }
  }
}

module.exports = new TimeLogController();
