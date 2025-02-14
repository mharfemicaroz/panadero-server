const customerService = global.requireV2("services/customer/customerService");

class CustomerController {
  async list(req, res) {
    try {
      // Extract parameters with defaults
      const {
        page = 1,
        limit = 10,
        sort = "created_at", // default column to sort by
        order = "DESC", // default sort order
        first_name,
        last_name,
        email,
        phone,
        is_active,
      } = req.query;

      // Use req.query.filters if provided; otherwise start with empty object
      let filters = req.query.filters || {};

      // Add individual filter parameters to filters
      if (first_name !== undefined) filters.first_name = first_name;
      if (last_name !== undefined) filters.last_name = last_name;
      if (email !== undefined) filters.email = email;
      if (phone !== undefined) filters.phone = phone;
      if (is_active !== undefined) filters.is_active = is_active === "true";

      // Build query parameters
      const queryParams = {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        filters,
        sortBy: sort,
        sortOrder: order,
      };

      // Get results from service
      const result = await customerService.getList(queryParams);

      res.status(200).json({
        total: result.count,
        totalPages: Math.ceil(result.count / limit),
        currentPage: parseInt(page, 10),
        pageSize: parseInt(limit, 10),
        data: result.rows,
      });
    } catch (error) {
      res.status(500).json({
        message: "Error fetching customers",
        error: error.message,
      });
    }
  }

  async create(req, res) {
    try {
      const newCustomer = await customerService.create(req.body);
      res.status(201).json(newCustomer);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error creating customer", error: error.message });
    }
  }

  async getById(req, res) {
    try {
      const customer = await customerService.getById(req.params.id);
      if (customer) {
        res.status(200).json(customer);
      } else {
        res.status(404).json({ message: "Customer not found" });
      }
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error fetching customer", error: error.message });
    }
  }

  async update(req, res) {
    try {
      const updatedCustomer = await customerService.alter(
        req.params.id,
        req.body
      );
      if (updatedCustomer) {
        res.status(200).json(updatedCustomer);
      } else {
        res.status(404).json({ message: "Customer not found" });
      }
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error updating customer", error: error.message });
    }
  }

  async delete(req, res) {
    try {
      const result = await customerService.delete(req.params.id);
      if (result) {
        res.status(200).json({ message: "Customer deleted" });
      } else {
        res.status(404).json({ message: "Customer not found" });
      }
    } catch (error) {
      // Handle foreign key constraint error (Sequelize example)
      if (error.name === "SequelizeForeignKeyConstraintError") {
        return res.status(409).json({
          message:
            "Cannot delete customer because it's referenced by other records",
        });
      }

      res.status(500).json({
        message: "Error deleting customer",
        error: error.message,
      });
    }
  }
}

module.exports = new CustomerController();
