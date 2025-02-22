const departmentRepository = global.requireV2(
  "repositories/hr/departmentRepository"
);

class DepartmentService {
  async getList(queryParams) {
    return departmentRepository.listing(queryParams);
  }

  async create(data) {
    return departmentRepository.create(data);
  }

  async getById(id) {
    return departmentRepository.getById(id);
  }

  async update(id, data) {
    return departmentRepository.update(id, data);
  }

  async delete(id) {
    return departmentRepository.delete(id);
  }
}

module.exports = new DepartmentService();
