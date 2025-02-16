const userService = global.requireV2("services/user/userService");

class UserController {
  async list(req, res) {
    try {
      // Extract pagination and sorting parameters with optional defaults
      const { page, limit, sort, order } = req.query;

      // If filters are provided using the filters[...] syntax, use them
      let filters = req.query.filters || {};

      // Build query params including sorting info
      const queryParams = {
        page,
        limit,
        filters,
        sortBy: sort, // will default to repository default if undefined
        sortOrder: order, // will default to repository default if undefined
      };

      const result = await userService.getList(queryParams);

      res.status(200).json({
        total: result.count,
        totalPages: limit ? Math.ceil(result.count / limit) : null,
        currentPage: limit ? parseInt(page, 10) : null,
        pageSize: limit ? parseInt(limit, 10) : null,
        data: result.rows,
      });
    } catch (error) {
      res.status(500).json({
        message: "Error fetching users",
        error: error.message,
      });
    }
  }

  async create(req, res) {
    try {
      const newUser = await userService.create(req.body);
      res.status(201).json(newUser);
    } catch (error) {
      res.status(500).json({
        message: "Error creating user",
        error: error.message,
      });
    }
  }

  async getById(req, res) {
    try {
      const user = await userService.getById(req.params.id);
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({ message: "User not found" });
      }
    } catch (error) {
      res.status(500).json({
        message: "Error fetching user",
        error: error.message,
      });
    }
  }

  async update(req, res) {
    try {
      const updatedUser = await userService.alter(req.params.id, req.body);
      if (updatedUser) {
        res.status(200).json(updatedUser);
      } else {
        res.status(404).json({ message: "User not found" });
      }
    } catch (error) {
      res.status(500).json({
        message: "Error updating user",
        error: error.message,
      });
    }
  }

  async delete(req, res) {
    try {
      const result = await userService.delete(req.params.id);
      if (result) {
        return res.status(200).json({ message: "User deleted" });
      } else {
        return res.status(404).json({ message: "User not found" });
      }
    } catch (error) {
      // Check if it's a foreign key constraint error (Sequelize example)
      if (error.name === "SequelizeForeignKeyConstraintError") {
        return res.status(409).json({
          message:
            "Cannot delete user because they are referenced by other records",
        });
      }

      // For all other errors, return a generic 500 error
      return res.status(500).json({
        message: "Error deleting user",
        error: error.message,
      });
    }
  }
}

module.exports = new UserController();
