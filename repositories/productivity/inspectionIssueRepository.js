const db = global.requireV2("models");
const InspectionIssue = db.InspectionIssue;
const AbstractRepository = global.requireV2("base/AbstractRepository");

class InspectionIssueRepository extends AbstractRepository {
  constructor() {
    super(InspectionIssue);
  }
}

module.exports = new InspectionIssueRepository();
