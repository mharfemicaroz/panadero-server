const inspectionService = global.requireV2(
  "services/productivity/inspectionService"
);

class InspectionController {
  async list(req, res) {
    try {
      const {
        page = 1,
        limit = 10,
        sort = "created_at",
        order = "DESC",
        ...rest
      } = req.query;

      const filters = { ...rest };
      const queryParams = {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        sortBy: sort,
        sortOrder: order,
        filters,
      };

      const result = await inspectionService.getList(queryParams);

      return res.status(200).json({
        total: result.count,
        totalPages: Math.ceil(result.count / queryParams.limit),
        currentPage: queryParams.page,
        pageSize: queryParams.limit,
        data: result.rows,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Error fetching inspections",
        error: error.message,
      });
    }
  }

  async create(req, res) {
    try {
      const inspection = await inspectionService.create(req.body);
      return res.status(201).json(inspection);
    } catch (error) {
      return res.status(500).json({
        message: "Error creating inspection",
        error: error.message,
      });
    }
  }

  async getById(req, res) {
    try {
      const inspection = await inspectionService.getById(req.params.id);
      if (!inspection) {
        return res.status(404).json({ message: "Inspection not found" });
      }
      return res.status(200).json(inspection);
    } catch (error) {
      return res.status(500).json({
        message: "Error fetching inspection",
        error: error.message,
      });
    }
  }

  async update(req, res) {
    try {
      const updated = await inspectionService.update(req.params.id, req.body);
      if (!updated) {
        return res.status(404).json({ message: "Inspection not found" });
      }
      return res.status(200).json(updated);
    } catch (error) {
      return res.status(500).json({
        message: "Error updating inspection",
        error: error.message,
      });
    }
  }

  async delete(req, res) {
    try {
      const result = await inspectionService.delete(req.params.id);
      if (!result) {
        return res.status(404).json({ message: "Inspection not found" });
      }
      return res.status(200).json({ message: "Inspection deleted" });
    } catch (error) {
      return res.status(500).json({
        message: "Error deleting inspection",
        error: error.message,
      });
    }
  }

  async addQuestion(req, res) {
    try {
      const newQuestion = await inspectionService.addQuestion(
        req.params.id,
        req.body
      );
      return res.status(201).json(newQuestion);
    } catch (error) {
      return res.status(500).json({
        message: "Error adding question",
        error: error.message,
      });
    }
  }

  async addResponse(req, res) {
    try {
      const newResponse = await inspectionService.addResponse(
        req.params.id,
        req.body
      );
      return res.status(201).json(newResponse);
    } catch (error) {
      return res.status(500).json({
        message: "Error adding response",
        error: error.message,
      });
    }
  }

  async addIssue(req, res) {
    try {
      const newIssue = await inspectionService.addIssue(
        req.params.id,
        req.body
      );
      return res.status(201).json(newIssue);
    } catch (error) {
      return res.status(500).json({
        message: "Error adding issue",
        error: error.message,
      });
    }
  }

  async updateIssue(req, res) {
    try {
      const updatedIssue = await inspectionService.updateIssue(
        req.params.issueId,
        req.body
      );
      if (!updatedIssue) {
        return res.status(404).json({ message: "Inspection issue not found" });
      }
      return res.status(200).json(updatedIssue);
    } catch (error) {
      return res.status(500).json({
        message: "Error updating issue",
        error: error.message,
      });
    }
  }
}

module.exports = new InspectionController();
