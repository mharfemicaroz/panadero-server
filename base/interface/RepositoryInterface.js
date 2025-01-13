/**
 * Interface for repositories
 * @interface RepositoryInterface
 */
class RepositoryInterface {
  /**
   * Create a new record
   * @param {Object} data
   * @returns {Promise<Object>}
   */
  async create(data) {}

  /**
   * Update a record by Primary Key
   * @param {number|string} id
   * @param {Object} data
   * @returns {Promise<Object|null>}
   */
  async updateByPk(id, data) {}

  /**
   * Get All
   * @return array
   */
  async getAll() {}

  /**
   * Get a record by Primary Key
   * @param {number|string} id
   * @returns {Promise<Object|null>}
   */
  async getByPk(id) {}

  /**
   * Delete a record by Primary Key
   * @param {number|string} id
   * @returns {Promise<boolean>}
   */
  async deleteByPk(id) {}

  /**
   * Get all records
   * @returns {Promise<Array>}
   */
  async getAll() {}
}

module.exports = RepositoryInterface;
