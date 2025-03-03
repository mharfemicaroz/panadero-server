const db = global.requireV2("models");
const inspectionRepository = global.requireV2(
  "repositories/productivity/inspectionRepository"
);
const inspectionQuestionRepository = global.requireV2(
  "repositories/productivity/inspectionQuestionRepository"
);
const inspectionResponseRepository = global.requireV2(
  "repositories/productivity/inspectionResponseRepository"
);
const inspectionIssueRepository = global.requireV2(
  "repositories/productivity/inspectionIssueRepository"
);

class InspectionService {
  async getList(queryParams) {
    return inspectionRepository.listing(queryParams);
  }

  async create(data) {
    const t = await db.sequelize.transaction();
    try {
      // 1) Create the main inspection
      const inspection = await inspectionRepository.create(data, {
        transaction: t,
      });

      // 2) Create questions if provided
      if (data.questions && Array.isArray(data.questions)) {
        for (const q of data.questions) {
          await inspectionQuestionRepository.create(
            {
              inspection_id: inspection.id,
              question_text: q.question_text,
              question_type: q.question_type,
              options: q.options,
            },
            { transaction: t }
          );
        }
      }

      await t.commit();
      return inspection;
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }

  async getById(id) {
    return inspectionRepository.getFullById(id);
  }

  async update(id, data) {
    return inspectionRepository.update(id, data);
  }

  async delete(id) {
    return inspectionRepository.delete(id);
  }

  // --------------- Questions & Responses ---------------
  async addQuestion(inspectionId, questionData) {
    questionData.inspection_id = inspectionId;
    return inspectionQuestionRepository.create(questionData);
  }

  async addResponse(inspectionId, responseData) {
    responseData.inspection_id = inspectionId;
    return inspectionResponseRepository.create(responseData);
  }

  // --------------- Issues ---------------
  async addIssue(inspectionId, issueData) {
    issueData.inspection_id = inspectionId;
    return inspectionIssueRepository.create(issueData);
  }

  async updateIssue(issueId, data) {
    return inspectionIssueRepository.update(issueId, data);
  }
}

module.exports = new InspectionService();
