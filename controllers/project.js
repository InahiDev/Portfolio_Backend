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
  if (req.files) {
    if (req.files.length > 1) {
      const projectObject = JSON.parse(req.body.project)
      const project = new Project({
        description: projectObject.description,
        teaching: projectObject.teaching,
        overView: `${req.protocol}://${req.get('host')}/images/${req.files[0].filename}`,
        image: `${req.protocol}://${req.get('host')}/images/${req.files[1].filename}`
      })
      if (projectObject.stacks.length) {
        for (const stack of projectObject.stacks) {
          project[stack] = true
        }
      }
      project.save()
        .then((data) => res.status(201).json({ message: "Project created with overview and image linked!", data}))
        .catch((error) => res.status(500).json({ message: `Creation of project failed: ${error}`}))
    } else if (req.files.length === 1) {
        const projectObject = JSON.parse(req.body.project)
        const project = new Project({
          description: projectObject.description,
          teaching: projectObject.teaching
        })
        if (projectObject.stacks.length) {
          for (stack of projectObject.stacks) {
            project[stack] = true
          }
        }
        if (req.query.imageType === "image") {
          project.image = `${req.protocol}://${req.get('host')}/images/${req.files[0].filename}`
        } else if (req.query.imageType === "overview") {
          project.overView = `${req.protocol}://${req.get('host')}/images/${req.files[0].filename}`
        }
        project.save()
          .then((data) => res.status(201).json({ message: "Content created with only one image on two possible", data}))
          .catch((error) => res.status(500).json({ message: `Creation of project failed: ${error}`}))
    } 
  } else {
    const project = new Project({
      ...req.body
    })
    console.log(project)
    if (req.body.stacks.length) {
      let stacks = req.body.stacks
        for (const stack of stacks) {
          project[stack] = true
        }
    }
    project.save()
      .then((data) => res.status(201).json({ message: "Project created without overview nor image linked!", data}))
      .catch((error) => res.status(500).json({ message: `Creation of project failed: ${error}`}))
  }
}

exports.editSpecific = (req, res) => {
  res.status(200).json({message: "Endpoint not yet implemented"})
}

exports.deleteProject = (req, res) => {
  res.status(200).json({message: "Endpoint not yet implemented"})
} 