const express = require('express')
const AuthService = require('../services/authService')

const router = express.Router()

router.post('/register', async (req, res) => {
  try {
    const user = await AuthService.register(req.body)
    res.status(201).json(user)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    const response = await AuthService.login(email, password) // Get the full response
    res.json(response) // Return the response directly
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

router.post('/logout', async (req, res) => {
  try {
    AuthService.logout(req.headers.authorization) // Pass the token from the Authorization header
    res.json({ message: 'Logged out successfully' })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

// New route to verify token
router.post('/verify-token', async (req, res) => {
  try {
    const { token } = req.body
    const user = await AuthService.verifyToken(token) // Verify token
    res.json({ user }) // Return user data if token is valid
  } catch (error) {
    res.status(401).json({ error: error.message }) // Token verification failed
  }
})

module.exports = router
