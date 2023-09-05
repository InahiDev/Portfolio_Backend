const { Cv } = require('../sequelize')
const fs = require('fs')

exports.getCvs = (req, res) => {
  Cv.findAll({ order: [['createdAt', 'DESC']]})
    .then(cvs => res.status(200).json(cvs))
    .catch((error) => res.status(500).json({ message: `Couldnt GET the cvs: ${error}`}))
}

exports.getSpecific = (req, res) => {
  Cv.findOne({ where: { id: req.params.id }})
    .then(data => {
      if (data) {
        const cv = data.cv
        res.status(200).json({cv})
      } else {
        res.status(404).json({ message: "There is no cv with this id"})
      }
    })
    .catch((error) => res.status(500).json({ message: `Couldn't search for the desired CV in the DB: ${error}`}))
}

exports.createCv = (req, res) => {
  if (req.file) {
    const cv = new Cv({
      file: req.file.buffer,
      name: req.file.originalname
    })
    cv.save()
      .then((data) => res.status(201).json({ message: "CV uploaded to DB!", data}))
      .catch((error) => res.status(500).json({ message: `Could not save the Cv into DB: ${error}`}))
  }
}

exports.updateSpecific= (req, res) => {
  res.status(200).json({message: "Endpoint not yet implemented"})
}

exports.deleteSpecific = (req, res) => {
  res.status(200).json({message: "Endpoint not yet implemented"})
}