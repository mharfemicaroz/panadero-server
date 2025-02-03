const userRepository = global.requireV2("repositories/user/userRepository");

class UserService {
  async getList() {
    // Fetch all users
    return await userRepository.getAll();
  }

  async create(data) {
    // Create a new user
    return await userRepository.create(data);
  }

  async getById(id) {
    // Fetch a user by their ID
    return await userRepository.getById(id);
  }

  async alter(id, data) {
    // Update a user by their ID
    return await userRepository.update(id, data);
  }

  async delete(id) {
    // Delete a user by their ID
    return await userRepository.delete(id);
  }
}

module.exports = new UserService();
