const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const authRoutes = require('./routes/authRoutes')
const { initializeFirebase } = require('./services/firebaseService')

const app = express()
const PORT = process.env.PORT || 3000

// Initialize Firebase
initializeFirebase()

const corsOptions = {
  origin: ['http://localhost:5173', 'https://panadero.area51.ph'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}

app.use(cors(corsOptions))
app.use(bodyParser.json())

// Middleware to protect routes
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  if (!token) return res.sendStatus(401)

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403)
    req.user = user
    next()
  })
}

app.use('/api/auth', authRoutes)

app.listen(PORT, () => {
  console.log(`Running at ${PORT}`)
})
