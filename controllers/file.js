const { File } = require('../sequelize')
const fs = require('fs')

exports.getFiles = (req, res) => {
  File.findAll({ order: [['createdAt', 'DESC']]})
    .then(datas => res.status(200).json({datas}))
    .catch((error) => res.status(500).json({ message: `Couldnt GET the files: ${error}`}))
}

exports.getFile = (req, res) => {
  File.findOne({ where: { id: req.params.id }})
    .then(data => {
      if (data) {
        res.status(200).json({data})
      } else {
        res.status(404).json({ message: "There is no file with this id"})
      }
    })
    .catch((error) => res.status(500).json({ message: `Couldn't search for the desired File in the DB: ${error}`}))
}

exports.createFile = (req, res) => {
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
      File.findOne({ where: { name: req.file.originalname }})
        .then((data) => {
          if (data) {
            res.status(400).json({ message: "You allready sent this file!"})
          } else {
            const file = new File({
              file: req.file.buffer,
              name: req.file.originalname
            })
            file.save()
              .then((data) => res.status(201).json({ message: "File uploaded to DB!", data}))
              .catch((error) => res.status(500).json({ message: `Could not save the File into DB: ${error}`}))
          }
        })
        .catch((error) => res.status(500).json({ message: `Couldnt continue the task. problem happenned while checking for unique value constraint: ${error}`}))
    } else {
      res.status(400).json({ message: "This kind of file is not accepted in the db!"})
    }
  }
}

exports.updateFile = (req, res) => {
  let contentType = 'content-type'
  let regExContentType= /^multipart\/form-data;/
  if (regExContentType.test(req.headers[contentType])) {
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
        File.findOne({ where: { id: req.params.id }})
          .then((data) => {
            if (!data) {
              res.status(400).json({ message: "There is no file saved with such id, check id!"})
            } else {
              File.findOne({ where: { name: req.file.originalname }})
                .then((data) => {
                  if (data && data.id !== parseInt(req.params.id)) {
                      res.status(400).json({ message: "You can't save same file multiple times"})
                  } else {
                    File.update({
                      file: req.file.buffer,
                      name: req.file.originalname
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
  } else {
    res.status(400).json({ message: "Send a correct formdata request"})
  }
}

exports.deleteFile = (req, res) => {
  File.findOne({ where: { id: req.params.id }})
    .then((data) => {
      if (data) {
        const fileId = data.id
        const fileName = data.name
        File.destroy({ where: { id: req.params.id }})
            .then(data => res.status(200).json({ message: `${fileName} with id: ${fileId} deleted from DB`}))
            .catch((error) => res.status(500).json({ message: `Trouble deleting the file saved with this id in the db: ${error}`}))
      } else {
        res.status(400).json({ message: "No File found at this id, cant delete nothing!"})
      }
    })
    .catch((error) => res.status(500).json({ message: `Trouble finding the File for destruction: ${error}`}))
  }