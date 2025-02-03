const db = require("@models");
const User = db.User;
const AbstractRepository = require("@base/AbstractRepository");

class UserRepository extends AbstractRepository {
  constructor() {
    super(User);
  }

  async listing() {
    return await User.findAll();
  }

  async create(data) {
    return await User.create(data);
  }

  async getById(id) {
    return await User.findByPk(id);
  }

  async getByEmail(email) {
    return await User.findOne({ where: { email } });
  }

  async update(id, userData) {
    const user = await User.findByPk(id);
    if (user) {
      return await user.update(userData);
    }
    return null;
  }

  async delete(id) {
    const user = await User.findByPk(id);
    if (user) {
      return await user.destroy();
    }
    return null;
  }
}

module.exports = new UserRepository();
