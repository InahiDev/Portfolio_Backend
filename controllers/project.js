const { Project } = require('../sequelize')
const fs = require('fs')
const { handleCreation } = require('../utils/creation')

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
  const samples = req.query.count
  Project.count()
    .then(numberOfProjects => {
      if (numberOfProjects >= samples) {
        Project.findAll({ order: [['createdAt', 'DESC']], offset: (numberOfProjects - samples), limit: samples})
          .then(data => {
            res.status(200).json(data)})
          .catch((error) => res.status(500).json({message:`Error selecting the required sample count :${error}`}))
      } else {
        Project.findAll({ order: [['createdAt', 'DESC']] })
          .then(projects => res.status(200).json(projects))
          .catch((error) => res.status(500).json({message:`Had some trouble finding the few samples needed: ${error}`}))
      }
    })
    .catch((error) => res.status(500).json({message: `Had trouble counting the projects in the DB: ${error}`}))
}

exports.createProject = (req, res) => {
  handleCreation(req, res)
}

exports.editSpecific = (req, res) => {
  res.status(200).json({message: "Endpoint not yet implemented"})
}

exports.deleteProject = (req, res) => {
  res.status(200).json({message: "Endpoint not yet implemented"})
} 