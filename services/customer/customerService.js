const customerRepository = require("../../repositories/customer/customerRepository");

class CustomerService {
  async getList(queryParams) {
    return customerRepository.listing(queryParams);
  }

  async create(data) {
    return customerRepository.create(data);
  }

  async getById(id) {
    return customerRepository.getById(id);
  }

  async alter(id, data) {
    return customerRepository.update(id, data);
  }

  async delete(id) {
    return customerRepository.delete(id);
  }
}

module.exports = new CustomerService();
