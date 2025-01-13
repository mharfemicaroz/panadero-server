class TableEntity {
  // Private static properties
  static #data = null;
  static #total = null;

  /**
   * Sets the data.
   * @param {Array} data - The data to be set.
   */
  static setData(data) {
    if (!Array.isArray(data)) {
      throw new TypeError("Data must be an array.");
    }
    this.#data = data;
  }

  /**
   * Gets the data.
   * @returns {Array|null} - The current data.
   */
  static getData() {
    return this.#data;
  }

  /**
   * Sets the total.
   * @param {number} total - The total to be set.
   */
  static setTotal(total) {
    if (typeof total !== "number") {
      throw new TypeError("Total must be a number.");
    }
    this.#total = total;
  }

  /**
   * Gets the total.
   * @returns {number|null} - The current total.
   */
  static getTotal() {
    return this.#total;
  }
}

module.exports = TableEntity;
