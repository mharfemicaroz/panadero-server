const customerService = require("@services/customer/customerService");

class CustomerController {
  async list(req, res) {
    try {
      const {
        page,
        limit,
        first_name,
        last_name,
        email,
        phone,
        is_active,
        sortBy,
        sortOrder,
      } = req.query;

      const filters = {
        first_name,
        last_name,
        email,
        phone,
        is_active: is_active !== undefined ? is_active === "true" : undefined,
      };

      const queryParams = { page, limit, filters, sortBy, sortOrder };
      const result = await customerService.getList(queryParams);

      res.status(200).json({
        total: result.count,
        totalPages: Math.ceil(result.count / (limit || 10)),
        currentPage: parseInt(page || 1, 10),
        pageSize: parseInt(limit || 10, 10),
        data: result.rows,
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error fetching customers", error: error.message });
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
      res
        .status(500)
        .json({ message: "Error deleting customer", error: error.message });
    }
  }
}

module.exports = new CustomerController();
