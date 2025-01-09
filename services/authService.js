const AuthRepository = require('../repositories/authRepository')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const SECRET_KEY = 'your_jwt_secret_key' // Use environment variables in production

const AuthService = {
  register: async (userData) => {
    if (!userData.password) {
      throw new Error('Password is required')
    }
    const hashedPassword = await bcrypt.hash(userData.password, 10) // Hash password securely
    const user = await AuthRepository.createUser({
      ...userData,
      password: hashedPassword
    })
    return { id: user.id, email: user.email } // Do not expose password
  },

  login: async (email, password) => {
    const user = await AuthRepository.findUserByEmail(email)
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new Error('Invalid email or password')
    }
    const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, {
      expiresIn: '1h'
    })
    return {
      token, // Return only the token here
      name: user.name,
      email: user.email
    }
  },

  logout: (token) => {
    // Blacklist the token upon logout
    if (!token) throw new Error('No token provided')
    AuthRepository.blacklistToken(token)
  },

  verifyToken: (token) => {
    // Token verification logic
    return new Promise((resolve, reject) => {
      if (AuthRepository.isTokenBlacklisted(token)) {
        return reject(new Error('Token has been blacklisted'))
      }

      jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) {
          return reject(new Error('Invalid or expired token'))
        }
        resolve(user) // Return user data if token is valid
      })
    })
  }
}

module.exports = AuthService
