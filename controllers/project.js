const { Project } = require('../sequelize')
const fs = require('fs')

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
  const samples = 4
  Project.count()
    .then(numberOfProjects => {
      if (numberOfProjects >= samples) {
        Project.findAll({ order: [['createdAt', 'DESC']], offset: (numberOfProjects - samples), limit: samples})
          .then(data => {
            res.status(200).json(data)})
          .catch((error) => res.status(500).json({message:`Erreur lors de la sélection du nombre désiré de samples ${error}`}))
      } else {
        Project.findAll({ order: [['createdAt', 'DESC']] })
          .then(projects => res.status(200).json(projects))
          .catch((error) => res.status(500).json({message:`Had some trouble finding the few samples needed: ${error}`}))
      }
    })
    .catch((error) => res.status(500).json({message: `Had trouble counting the projects inth DB: ${error}`}))
}

exports.createProject= (req, res) => {
  if (req.files) {
    const projectObject = JSON.parse(req.body.project)
    const project = new Project({
      description: projectObject.description,
      stacks: projectObject.stacks,
      teaching: projectObject.teaching,
      overView: `${req.protocol}://${req.get('host')}/images/${req.files[0].filename}`,
      image: `${req.protocol}://${req.get('host')}/images/${req.files[1].filename}`
    })
    project.save()
      .then((data) => res.status(201).json({ message: "Project created with overview and image linked!", data}))
      .catch((error) => res.status(500).json({ message: `Creation of project failed: ${error}`}))
  }  
}

exports.editSpecific = (req, res) => {
  res.status(200).json({message: "Endpoint not yet implemented"})
}

exports.deleteProject = (req, res) => {
  res.status(200).json({message: "Endpoint not yet implemented"})
} 