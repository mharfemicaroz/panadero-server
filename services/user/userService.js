const userRepository = global.requireV2("repositories/user/userRepository");

class UserService {
  async getList(queryParams) {
    // Fetch all users
    return await userRepository.listing(queryParams);
  }

  async create(data) {
    // Create a new user
    return await userRepository.create(data);
  }

  async getById(id) {
    // Fetch a user by their ID
    return await userRepository.getById(id);
  }

  async getByEmail(email) {
    // Fetch a user by their ID
    return await userRepository.getByEmail(email);
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
