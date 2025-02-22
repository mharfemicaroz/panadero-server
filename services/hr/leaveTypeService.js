const leaveTypeRepository = global.requireV2(
  "repositories/hr/leaveTypeRepository"
);

class LeaveTypeService {
  async getList(queryParams) {
    return leaveTypeRepository.listing(queryParams);
  }

  async getById(id) {
    return leaveTypeRepository.getById(id);
  }

  async create(data) {
    return leaveTypeRepository.create(data);
  }

  async update(id, data) {
    return leaveTypeRepository.update(id, data);
  }

  async delete(id) {
    return leaveTypeRepository.delete(id);
  }
}

module.exports = new LeaveTypeService();
