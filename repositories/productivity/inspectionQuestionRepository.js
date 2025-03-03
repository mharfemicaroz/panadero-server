const db = global.requireV2("models");
const InspectionQuestion = db.InspectionQuestion;
const AbstractRepository = global.requireV2("base/AbstractRepository");

class InspectionQuestionRepository extends AbstractRepository {
  constructor() {
    super(InspectionQuestion);
  }
}

module.exports = new InspectionQuestionRepository();
