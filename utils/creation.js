const { Project } = require('../sequelize')

//-----------------------------------------------------------------------------------------------//
//-----------------------------------------------Utility functions-------------------------------//
//-----------------------------------------------------------------------------------------------//

function updateObjectStacks(project, projectObject) {
  if (Array.isArray(projectObject.stacks)) {
    for (const stack of projectObject.stacks) {
      project[stack] = true
    }
  }
  return project
}

function updateCorrectPictureField(req, project) {
  switch (req.query.imageType) {
    case 'image' :
      project.image = `${req.protocol}://${req.get('host')}/images/${req.files[0].filename}`
      break
    case 'overview' :
      project.overView = `${req.protocol}://${req.get('host')}/images/${req.files[0].filename}`
      break
  }
  return project
}

//-----------------------------------------------------------------------------------------------//
//------------------------Creation of projects / Case with 2/1/0 files---------------------------//
//-----------------------------------------------------------------------------------------------//

function creationWithTwofiles(req, res) {
  const projectObject = JSON.parse(req.body.project)
  let project = new Project({
    description: projectObject.description,
    teaching: projectObject.teaching,
    overView: `${req.protocol}://${req.get('host')}/images/${req.files[0].filename}`,
    image: `${req.protocol}://${req.get('host')}/images/${req.files[1].filename}`
  })
  project = updateObjectStacks(project, projectObject)
  project.save()
    .then((data) => res.status(201).json({ message: "Project created with overview and image linked!", data}))
    .catch((error) => res.status(500).json({ message: `Creation of project failed: ${error}`}))
}

function creationWithOneFile(req, res) {
  const projectObject = JSON.parse(req.body.project)
  let project = new Project({
    description: projectObject.description,
    teaching: projectObject.teaching
  })
  project = updateObjectStacks(project, projectObject)
  project = updateCorrectPictureField(req, project)
  project.save()
    .then((data) => res.status(201).json({ message: "Content created with only one image on two possible", data}))
    .catch((error) => res.status(500).json({ message: `Creation of project failed: ${error}`}))
}

function creationWithNoFile(req, res) {
  let projectObject = JSON.parse(req.body.project)
  let project = new Project({
    ...req.body
  })
  project = updateObjectStacks(project, projectObject)
  project.save()
    .then((data) => res.status(201).json({ message: "Project created without overview nor image linked!", data}))
    .catch((error) => res.status(500).json({ message: `Creation of project failed: ${error}`}))
}

function handleCreation(req, res) {
  if (req.files) {
    if (req.files.length > 1) {
      creationWithTwofiles(req, res)
    } else if (req.files.length === 1) {
      creationWithOneFile(req, res)
    } else if (req.files.length === 0) {
      creationWithNoFile(req, res)
    }
  }
}

module.exports = { handleCreation }