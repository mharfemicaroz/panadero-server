const userService = require("../../services/user/userService");

class UserController {
  async list(req, res) {
    try {
      const users = await userService.getList();
      res.status(200).json(users);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error fetching users", error: error.message });
    }
  }

  async create(req, res) {
    try {
      const newUser = await userService.create(req.body);
      res.status(201).json(newUser);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error creating user", error: error.message });
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
      res
        .status(500)
        .json({ message: "Error fetching user", error: error.message });
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
      res
        .status(500)
        .json({ message: "Error updating user", error: error.message });
    }
  }

  async delete(req, res) {
    try {
      const result = await userService.delete(req.params.id);
      if (result) {
        res.status(200).json({ message: "User deleted" });
      } else {
        res.status(404).json({ message: "User not found" });
      }
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error deleting user", error: error.message });
    }
  }
}

module.exports = new UserController();
