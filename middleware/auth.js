const jwt = require('jsonwebtoken')
const TOKEN_KEY = process.env.TOKEN_KEY

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1]
    const decodedToken = jwt.verify(token, TOKEN_KEY)
    const isAdmin = decodedToken.isAdmin
    const userId = decodedToken.userId
    req.isAdmin = isAdmin
    req.userId = userId
    next()
  } catch(error) {
    res.status(401).json({ message: 'Unauthorized request, need authentification!' })
  }
}