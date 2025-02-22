const employeeService = global.requireV2("services/hr/employeeService");
const path = require("path");
const fs = require("fs");

class EmployeeController {
  async list(req, res) {
    try {
      const {
        page = 1,
        limit = 10,
        sort = "created_at",
        order = "DESC",
        departmentId,
        is_active,
      } = req.query;

      let filters = req.query.filters || {};

      if (departmentId) {
        filters.departmentId = parseInt(departmentId, 10);
      }
      if (is_active !== undefined) {
        filters.is_active = is_active === "true";
      }

      const queryParams = {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        filters,
        sortBy: sort,
        sortOrder: order,
      };

      const result = await employeeService.getList(queryParams);

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
      if (req.body.picture) {
        const base64Data = req.body.picture.replace(
          /^data:image\/\w+;base64,/,
          ""
        );
        const buffer = Buffer.from(base64Data, "base64");
        const filename = `employee_${Date.now()}.jpg`;

        // Ensure the upload directory exists
        const uploadDir = path.join(
          __dirname,
          "../../public/uploads/employees"
        );
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }

        const uploadPath = path.join(uploadDir, filename);
        fs.writeFileSync(uploadPath, buffer);
        req.body.picture = `/uploads/employees/${filename}`;
      }

      const newUser = await employeeService.create(req.body);
      res.status(201).json(newUser);
    } catch (error) {
      res.status(500).json({
        message: "Error creating employee",
        error: error.message,
      });
    }
  }

  async getById(req, res) {
    try {
      const employee = await employeeService.getById(req.params.id);
      if (employee) {
        res.status(200).json(employee);
      } else {
        res.status(404).json({ message: "Employee not found" });
      }
    } catch (error) {
      res.status(500).json({
        message: "Error fetching employee",
        error: error.message,
      });
    }
  }

  async update(req, res) {
    try {
      if (req.body.picture) {
        const base64Data = req.body.picture.replace(
          /^data:image\/\w+;base64,/,
          ""
        );
        const buffer = Buffer.from(base64Data, "base64");
        const filename = `employee_${Date.now()}.jpg`;

        // Ensure the upload directory exists
        const uploadDir = path.join(
          __dirname,
          "../../public/uploads/employees"
        );
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }

        const uploadPath = path.join(uploadDir, filename);
        fs.writeFileSync(uploadPath, buffer);
        req.body.picture = `/uploads/employees/${filename}`;
      }

      const updatedEmployee = await employeeService.update(
        req.params.id,
        req.body
      );
      if (updatedEmployee) {
        res.status(200).json(updatedEmployee);
      } else {
        res.status(404).json({ message: "Employee not found" });
      }
    } catch (error) {
      res.status(500).json({
        message: "Error updating employee",
        error: error.message,
      });
    }
  }

  async delete(req, res) {
    try {
      const result = await employeeService.delete(req.params.id);
      if (result) {
        res.status(200).json({ message: "Employee deleted" });
      } else {
        res.status(404).json({ message: "Employee not found" });
      }
    } catch (error) {
      res.status(500).json({
        message: "Error deleting employee",
        error: error.message,
      });
    }
  }
}

module.exports = new EmployeeController();
