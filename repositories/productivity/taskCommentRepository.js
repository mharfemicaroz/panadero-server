const db = global.requireV2("models");
const TaskComment = db.TaskComment;
const AbstractRepository = global.requireV2("base/AbstractRepository");

class TaskCommentRepository extends AbstractRepository {
  constructor() {
    super(TaskComment);
  }

  // Add any custom queries if needed
}

module.exports = new TaskCommentRepository();
