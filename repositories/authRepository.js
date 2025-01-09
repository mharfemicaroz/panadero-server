const { writeData, readData } = require('../services/firebaseService')

const AuthRepository = {
  createUser: async (userData) => {
    const userId = Date.now()
    await writeData(`users/${userId}`, userData)
    return { id: userId, ...userData }
  },

  findUserByEmail: async (email) => {
    const users = await readData('users')
    if (!users) return null

    return Object.values(users).find((user) => user.email === email)
  },

  blacklistToken: async (token) => {
    const blacklistId = Date.now()
    await writeData(`blacklist/${blacklistId}`, { token })
  },

  isTokenBlacklisted: async (token) => {
    const blacklist = await readData('blacklist')
    if (!blacklist) return false

    return Object.values(blacklist).some((entry) => entry.token === token)
  }
}

module.exports = AuthRepository
