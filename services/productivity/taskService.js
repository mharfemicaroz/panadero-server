const db = global.requireV2("models");
const taskRepository = global.requireV2(
  "repositories/productivity/taskRepository"
);
const taskCommentRepository = global.requireV2(
  "repositories/productivity/taskCommentRepository"
);

class TaskService {
  async getList(queryParams) {
    return taskRepository.listing(queryParams);
  }

  async create(data) {
    return taskRepository.create(data);
  }

  async getById(id) {
    return taskRepository.getFullById(id);
  }

  async update(id, data) {
    return taskRepository.update(id, data);
  }

  async delete(id) {
    return taskRepository.delete(id);
  }

  /**
   * Comments
   */
  async addComment(taskId, commentData) {
    commentData.task_id = taskId;
    return taskCommentRepository.create(commentData);
  }
}

module.exports = new TaskService();
