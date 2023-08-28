const express = require('express')
const path = require('path')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
const cors = require('cors')
const dotenv = require('dotenv')

dotenv.config()

const projectRoutes = require('./routes/project')
const userRoutes = require('./routes/user')
const cvRoutes = require('./routes/cv')

const app = express()

const limiter = rateLimit({
  windowMs: 15*60*1000,
  max: 1000,
  standardHeaders: true,
  legacyHeaders: false
})

app.use(express.json())

app.use('/images', express.static(path.join(__dirname, 'images')))
app.use(cors())
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: false
}))

app.use('/api/v1/auth', userRoutes)
app.use('/api/v1/project', projectRoutes)
app.use('/api/v1/cv', cvRoutes)

module.exports = app