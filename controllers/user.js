const { User } = require('../sequelize')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const validator = require('validator')
const TOKEN_KEY = process.env.TOKEN_KEY

// module.exports.signup = (req, res) => {
//   if (validator.isEmail(req.body.email)) {
//     User.findAll({ where: { email: req.body.email }})
//       .then(data => {
//         if (data.length !== 0) {
//           return res.status(400).json({ message: "User allready registered" })
//         } else {
//           bcrypt.hash(req.body.password, 10)
//             .then(hash => {
//               const user = new User({
//                 email: req.body.email,
//                 password: hash
//               })
//               user.save()
//                 .then(() => res.status(201).json({ message: "User account created succesfully!"}))
//                 .catch((error) => res.status(500).json({message: `An error as occured while registering your acocun into DB: ${error}`}))
//             })
//             .catch((error) => res.status(500).json({ message: `An error as occured while protecting your password ${error}`}))
//         }
//       })
//       .catch((error) => res.status(500).json({ message: `An error has occured querying the DB: ${error}`}))
//   } else {
//     res.status(400).json({ message: "Try to put a real email buddy!"})
//   }
//}

module.exports.login = (req, res) => {
  if (validator.isEmail(req.body.email)) {
    User.findAll({ where: { email: req.body.email }})
      .then(data => {
        if (data.length === 0) {
          res.status(404).json({ message: "User not registered!" })
        } else {
          const user = data[0]
          bcrypt.compare(req.body.password, user.password)
            .then(valid => {
              if (!valid) {
                return res.status(401).json({ message: "Unvalid Password!" })
              } else {
                res.status(200).json({
                  userId: user.id,
                  token: jwt.sign(
                    { userId: user.id,
                    isAdmin: user.isAdmin,
                    email: user.email },
                    TOKEN_KEY,
                    { expiresIn: '4h' }
                  )
                })
              }
            })
            .catch((error) => res.status(500).json({ message: `Something happened during the validation of your password: ${error}`}))
        }
      })
      .catch((error) => res.status(500).json({ message: `Something happenned while we were looking for you in the DB: ${error}`}))
  } else {
    res.status(401).json({ message: "Try this with a real email buddy!" })
  }
}

module.exports.relog = (req, res) => {
  User.findAll({ where: { id: req.userId }})
    .then((data) => {
      if (data.length === 0) {
        res.status(404).json({ message: "We did not find you again in the DB, did you delete your account?" })
      } else {
        res.status(200).json({ message: "Relog succesfull", data: {
          userId: data[0].dataValues.id,
          isAdmin: data[0].dataValues.isAdmin,
          email: data[0].dataValues.email,
          token: req.headers.authorization.split(" ")[1]
        }})
      }
    })
    .catch((error) => res.status(500).json({ message: `Server had some trouble finding you AGAIN in the DB, apologies!: ${error}`}))
}