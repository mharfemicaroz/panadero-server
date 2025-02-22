const employeeRepository = global.requireV2(
  "repositories/hr/employeeRepository"
);

class EmployeeService {
  async getList(queryParams) {
    return employeeRepository.listing(queryParams);
  }

  async create(data) {
    return employeeRepository.create(data);
  }

  async getById(id) {
    return employeeRepository.getById(id);
  }

  async update(id, data) {
    return employeeRepository.update(id, data);
  }

  async delete(id) {
    return employeeRepository.delete(id);
  }
}

module.exports = new EmployeeService();
