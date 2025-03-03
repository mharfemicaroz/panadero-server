const db = global.requireV2("models");
const InspectionResponse = db.InspectionResponse;
const AbstractRepository = global.requireV2("base/AbstractRepository");

class InspectionResponseRepository extends AbstractRepository {
  constructor() {
    super(InspectionResponse);
  }
}

module.exports = new InspectionResponseRepository();
