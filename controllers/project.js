const { Project, Picture } = require('../sequelize')
const fs = require('fs')
const {  handleImageDeletion } = require('../utils/creation')
const { handleProjectUpdate } = require('../utils/update')

exports.getAllProjects = (req, res) => {
  Project.findAll({ order: [['createdAt', 'DESC']]})
    .then(projects => res.status(200).json(projects))
    .catch((error) => res.status(500).json({ message: `Had some trouble searching in DB for the Projects: ${error}`}))
}

exports.getSpecific = (req, res) => {
  Project.findOne({ where: { id: req.params.id }})
    .then(data => {
      if(data) {
        const project = data.dataValues
        res.status(200).json({ project })
      } else {
        res.status(404).json({ message: "There is no such project in the DB!"})
      }
    })
    .catch((error) => res.status(500).json({ message: `Had some trouble accessing the specific project: ${error}`}))
}

exports.getSamples = (req, res) => {
  const samples = parseInt(req.query.count)
  Project.count()
    .then(numberOfProjects => {
      if (numberOfProjects >= samples) {
        Project.findAll({ order: [['createdAt', 'ASC']], offset: (numberOfProjects - samples), limit: samples})
          .then(data => {
            res.status(200).json(data)
          })
          .catch((error) => res.status(500).json({message:`Error selecting the required sample count :${error}`}))
      } else {
        Project.findAll({ order: [['createdAt', 'DESC']] })
          .then(projects => res.status(200).json(projects))
          .catch((error) => res.status(500).json({message:`Had some trouble finding the few samples needed: ${error}`}))
      }
    })
    .catch((error) => res.status(500).json({message: `Had trouble counting the projects in the DB: ${error}`}))
}

exports.createProject = (req, res, next) => {
  const project = new Project({
    ...req.body
  })
  if (Array.isArray(req.body.stacks)) {
    for (let stack of req.body.stacks) {
      project[stack] = true
    }
  }
  project.save()
    .then((data) => res.status(201).json({ message: "Text part of the project saved into DB", data}))
    .catch((error) => res.status(500).json({ message: `Error occured while saving the project into DB: ${error}`}))
} 

exports.addPicture = (req, res) => {
  Picture.findOne({ where: { projectId: req.params.id, imageType: req.body.imageType }})
    .then((data) => {
      let imageTypeRegex = /^overview$|^image$/gm
      const isImageTypeCorrect = imageTypeRegex.test(req.body.imageType)
      if (data)  {
        handleImageDeletion(req, res, "One image of this type is allready linked and saved with this project")
      } else if (!isImageTypeCorrect) {
        handleImageDeletion(req, res, "ImageType not recognized")
      } else if (isImageTypeCorrect && !data) {
        const pictureObject = new Picture({
          imageType: req.body.imageType,
          path: `${req.protocol}://${req.get('host')}/images/${req.files[0].filename}`,
          projectId: req.params.id
        })
        pictureObject.save()
          .then((data) => res.status(201).json({ message: "Picture linked and saved with project!", data}))
          .catch((error) => res.status(500).json({ message: `Have trouble saving your picture in database: ${error}`}))
      }
    })
    .catch((error) => res.status(500).json({ message: `An error has occured while looking for pre-saved pictures for this project: ${error}`}))
}

exports.editProject = (req, res) => {
  Project.findOne({ where: { id: req.params.id }})
    .then(data => {
      console.log(data)
      const project = data.dataValue
    })
    .catch((error) => res.status(500).json({ message: `Something happened while looking for the project to update: ${error}`}))
}

exports.editProjectPicture = (req, res) => {
  Project.findOne({ where: { is: req.params.id }})
    .then((data) => {

    })
}

exports.deleteProject = (req, res) => {
  res.status(200).json({message: "Endpoint not yet implemented"})
} 