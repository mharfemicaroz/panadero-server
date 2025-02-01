const notificationService = require("../../services/product/notificationService");

class NotificationController {
  async list(req, res) {
    try {
      const result = await notificationService.getAll(req.query);
      res.status(200).json(result);
    } catch (error) {
      res
        .status(500)
        .json({
          message: "Error fetching notifications",
          error: error.message,
        });
    }
  }

  async markAsRead(req, res) {
    try {
      await notificationService.markAsRead(req.params.id);
      res.status(200).json({ message: "Notification marked as read" });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error updating notification", error: error.message });
    }
  }
}

module.exports = new NotificationController();
