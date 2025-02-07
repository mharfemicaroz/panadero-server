const db = global.requireV2("models");
const StockMovement = db.StockMovement;
const AbstractRepository = global.requireV2("base/AbstractRepository");

class StockMovementRepository extends AbstractRepository {
  constructor() {
    super(StockMovement);
  }

  /**
   * Lists stock movement records with pagination and optional filters.
   *
   * @param {Object} options - The listing options.
   * @param {number} [options.page=1] - The page number.
   * @param {number} [options.limit=10] - The number of records per page.
   * @param {Object} [options.filters={}] - Optional filters.
   * @param {string} [options.sortBy="created_at"] - The field to sort by.
   * @param {string} [options.sortOrder="DESC"] - The sort order ("ASC" or "DESC").
   * @returns {Promise<Object>} An object with count and rows.
   */
  async listing({
    page = 1,
    limit = 10,
    filters = {},
    sortBy = "created_at",
    sortOrder = "DESC",
  }) {
    const offset = (page - 1) * limit;
    const where = {};

    // Example: add filtering by type if provided
    if (filters.type) {
      where.type = filters.type;
    }
    // Add additional filter criteria as needed

    return StockMovement.findAndCountAll({
      where,
      order: [[sortBy, sortOrder.toUpperCase()]],
      limit: parseInt(limit, 10),
      offset,
      include: [
        { association: "inventory" },
        { association: "warehouse" },
        { association: "user" },
      ],
    });
  }

  /**
   * Retrieves a single stock movement record by its ID.
   *
   * @param {number} id - The ID of the stock movement.
   * @returns {Promise<Object|null>} The stock movement record, or null if not found.
   */
  async getById(id) {
    return StockMovement.findByPk(id, {
      include: [
        { association: "inventory" },
        { association: "warehouse" },
        { association: "user" },
      ],
    });
  }

  /**
   * Creates a new stock movement record.
   *
   * @param {Object} data - The data for the new record.
   * @returns {Promise<Object>} The newly created stock movement.
   */
  async create(data) {
    return StockMovement.create(data);
  }

  /**
   * Updates an existing stock movement record.
   *
   * @param {number} id - The ID of the stock movement to update.
   * @param {Object} data - The updated data.
   * @returns {Promise<Object|null>} The updated record, or null if not found.
   */
  async update(id, data) {
    const record = await StockMovement.findByPk(id);
    if (!record) return null;
    return record.update(data);
  }

  /**
   * Deletes a stock movement record.
   *
   * @param {number} id - The ID of the record to delete.
   * @returns {Promise<Object|null>} The deleted record, or null if not found.
   */
  async delete(id) {
    const record = await StockMovement.findByPk(id);
    if (!record) return null;
    return record.destroy();
  }
}

module.exports = new StockMovementRepository();
