const shiftService = global.requireV2("services/product/shiftService");

class ShiftController {
  async list(req, res) {
    try {
      // Extract pagination and sorting parameters with optional defaults.
      const { page, limit, sort, order } = req.query;
      // Use filters if provided.
      let filters = req.query.filters || {};

      // Build query parameters.
      const queryParams = {
        page,
        limit,
        filters,
        sortBy: sort,
        sortOrder: order,
      };

      const result = await shiftService.getList(queryParams);

      res.status(200).json({
        total: result.count,
        totalPages: limit ? Math.ceil(result.count / limit) : null,
        currentPage: limit ? parseInt(page, 10) : null,
        pageSize: limit ? parseInt(limit, 10) : null,
        data: result.rows,
      });
    } catch (error) {
      res.status(500).json({
        message: "Error fetching shifts",
        error: error.message,
      });
    }
  }

  async create(req, res) {
    try {
      const newShift = await shiftService.create(req.body);
      res.status(201).json(newShift);
    } catch (error) {
      res.status(500).json({
        message: "Error creating shift",
        error: error.message,
      });
    }
  }

  async getById(req, res) {
    try {
      const shift = await shiftService.getById(req.params.id);
      if (shift) {
        res.status(200).json(shift);
      } else {
        res.status(404).json({ message: "Shift not found" });
      }
    } catch (error) {
      res.status(500).json({
        message: "Error fetching shift",
        error: error.message,
      });
    }
  }

  async update(req, res) {
    try {
      const updatedShift = await shiftService.alter(req.params.id, req.body);
      if (updatedShift) {
        res.status(200).json(updatedShift);
      } else {
        res.status(404).json({ message: "Shift not found" });
      }
    } catch (error) {
      res.status(500).json({
        message: "Error updating shift",
        error: error.message,
      });
    }
  }

  async delete(req, res) {
    try {
      const result = await shiftService.delete(req.params.id);
      if (result) {
        return res.status(200).json({ message: "Shift deleted" });
      } else {
        return res.status(404).json({ message: "Shift not found" });
      }
    } catch (error) {
      // Handle potential foreign key constraint errors.
      if (error.name === "SequelizeForeignKeyConstraintError") {
        return res.status(409).json({
          message:
            "Cannot delete shift because it's referenced by other records",
        });
      }
      return res.status(500).json({
        message: "Error deleting shift",
        error: error.message,
      });
    }
  }
}

module.exports = new ShiftController();
