const db = global.requireV2("models");
const projectRepository = global.requireV2(
  "repositories/productivity/projectRepository"
);
const taskRepository = global.requireV2(
  "repositories/productivity/taskRepository"
);

class ProjectService {
  async getList(queryParams) {
    return projectRepository.listing(queryParams);
  }

  async create(data) {
    return projectRepository.create(data);
  }

  async getById(id) {
    return projectRepository.getFullById(id);
  }

  async update(id, data) {
    return projectRepository.update(id, data);
  }

  async delete(id) {
    return projectRepository.delete(id);
  }

  /**
   * Example: createTask within a project
   */
  async createTask(projectId, taskData) {
    // Ensure the task references the project ID
    taskData.project_id = projectId;
    return taskRepository.create(taskData);
  }
}

module.exports = new ProjectService();
