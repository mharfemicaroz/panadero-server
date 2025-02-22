const jobTitleRepository = global.requireV2(
  "repositories/hr/jobTitleRepository"
);

class JobTitleService {
  async getList(queryParams) {
    return jobTitleRepository.listing(queryParams);
  }

  async create(data) {
    return jobTitleRepository.create(data);
  }

  async getById(id) {
    return jobTitleRepository.getById(id);
  }

  async update(id, data) {
    return jobTitleRepository.update(id, data);
  }

  async delete(id) {
    return jobTitleRepository.delete(id);
  }
}

module.exports = new JobTitleService();
