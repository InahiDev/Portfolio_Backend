const { Cv } = require('../sequelize')
const fs = require('fs')

exports.getCvs = (req, res) => {
  Cv.findAll({ order: [['createdAt', 'DESC']]})
    .then(datas => res.status(200).json({datas}))
    .catch((error) => res.status(500).json({ message: `Couldnt GET the cvs: ${error}`}))
}

exports.getSpecific = (req, res) => {
  Cv.findOne({ where: { id: req.params.id }})
    .then(data => {
      if (data) {
        const cv = data.cv
        res.status(200).json({cv})
      } else {
        res.status(404).json({ message: "There is no file with this id"})
      }
    })
    .catch((error) => res.status(500).json({ message: `Couldn't search for the desired CV in the DB: ${error}`}))
}

exports.createCv = (req, res) => {
  if (req.file) {
    ACCEPTED_MIME_TYPES = {
      'application/pdf': 'pdf',
      'application/zip': 'zip',
      'application/x-7z-compressed': '7z',
      'application/x-rar-compressed': 'rar',
      'application/octet-stream': 'arc',
      'application/msword': 'doc'
    }
    if (ACCEPTED_MIME_TYPES.hasOwnProperty(req.file.mimetype)) {
      Cv.findOne({ where: { name: req.file.originalname }})
        .then((data) => {
          if (data) {
            res.status(400).json({ message: "You allready sent this file!"})
          } else {
            const cv = new Cv({
              file: req.file.buffer,
              name: req.file.originalname
            })
            cv.save()
              .then((data) => res.status(201).json({ message: "CV uploaded to DB!", data}))
              .catch((error) => res.status(500).json({ message: `Could not save the Cv into DB: ${error}`}))
          }
        })
        .catch((error) => res.status(500).json({ message: `Couldnt continue the task. problem happenned while checking for unique value constraint: ${error}`}))
    } else {
      res.status(400).json({ message: "This kind of file is not accepted in the db!"})
    }
  }
}

exports.updateSpecific= (req, res) => {
  console.log(req.params.id)
  if (req.file) {
    ACCEPTED_MIME_TYPES = {
      'application/pdf': 'pdf',
      'application/zip': 'zip',
      'application/x-7z-compressed': '7z',
      'application/x-rar-compressed': 'rar',
      'application/octet-stream': 'arc',
      'application/msword': 'doc'
    }
    if (ACCEPTED_MIME_TYPES.hasOwnProperty(req.file.mimetype)) {
      Cv.findOne({ where: { id: req.params.id }})
        .then((data) => {
          if (!data) {
            res.status(400).json({ message: "There is no file saved with such id, check id!"})
          } else {
            Cv.findOne({ where: { name: req.file.originalname }})
              .then((data) => {
                if (data) {
                  res.status(400).json({ message: "You can't save same file multiple times"})
                } else {
                  Cv.update({
                    file: req.file.buffer,
                    name: req.file.originalname,
                    updatedAt: Date.now()
                  },{
                    where: {
                      id: req.params.id
                    }
                  })
                    .then((data) => res.status(200).json({ message: "File updated correctly"}))
                    .catch((error) => res.status(500).json({ message: `Error happenned while updating your file in the db at the given id: ${error}`}))
                }
              })
              .catch((error) => res.status(500).json({ message: `Trouble finding a file with same originalname in the db: ${error}`}))
          }
        })
        .catch((error) => res.status(500).json({ message: `Trouble finding a file saved with same id in the db: ${error}`}))
    } else {
      res.status(400).json({ message: "This type of fiile is not accepted in the database"})
    }
  } else {
    res.status(400).json({ message: "Please send a file to proceed an update!"})
  }
}

exports.deleteSpecific = (req, res) => {
  res.status(200).json({message: "Endpoint not yet implemented"})
}