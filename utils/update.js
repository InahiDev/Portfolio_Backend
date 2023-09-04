const { Project } = require('../sequelize')
const fs = require('fs')

function updateProjectPicturesField(req, updatedProject, field1, field2) {
  if (req.query.field1 !== "1") {
    if (req.query.field2 === "1") {
      updatedProject.field1 = ""
      updatedProject.field2 = `${req.protocol}://${req.get('host')}/images/${req.files[0].filename}`
    } else if (req.query.field2 !=="1") {
      updatedProject.field1 = ""
      updatedProject.field2 = ""
    }
  } else if (req.query.field1 === "1") {
    if (req.query.field2 === "1") {
      updatedProject.field1 = `${req.protocol}://${req.get('host')}/images/${req.files[0].filename}`
      updatedProject.field2 = `${req.protocol}://${req.get('host')}/images/${req.files[1].filename}`
    } else if (req.query.field2 !== "1") {
      updatedProject.field1 = `${req.protocol}://${req.get('host')}/images/${req.files[0].filename}`
      updatedProject.field2 = ""
    }
  }
  return updatedProject
}


function deletePictureWhenNeeded(req, reqField, project) {
  if (req.query.reqField !== "0" && project.reqField) {
    const filename = project.reqField.split('/images/')[1]
    fs.unlink(`images/${filename}`,(error) => {
      if (error) {
        console.log(error)
      } else {
        return project
      }})
  }
}

function checkDeleteOnFields(req, project, field1, field2) {
  deletePictureWhenNeeded(req, field1, project)
  deletePictureWhenNeeded(req, field2, project)
  return project
}

function updatePictures(req, projectFromDB, updatedProject, field1, field2) {
  checkDeleteOnFields(req, projectFromDB, field1, field2)
  updateProjectPicturesField(req, updatedProject, field1, field2)
  return updatedProject
}

function handleProjectUpdate(req, res, projectFromDB, field1, field2) {
  const projectObject = JSON.parse(req.body.project)
  let updatedProject = new Project({ ...projectObject })
  updatedProject = updatePictures(req, projectFromDB, updatedProject, field1, field2)
  updatedProject.update({ where: { id: req.params.id }})
    .then((data) => res.status(200).json({ message: "Project Updated and previous Overview and Image deleted if needed", data}))
    .catch((error) => res.status(500).json({ message: `An error has occured: ${error}`}))
}




















/*
function handlePictureUpdating(req, project, updateProject, picField, picNumber = 0) {
  if (project.picField && req.query.picField === "1") {
    const filename = project.imageField.split('/images/')[1]
    fs.unlink(`images/${filename}`, (error) => { if (error) { console.log(error) }})
    updateProject.picField = `${req.protocol}://${req.get('host')}/images/${req.files[picNumber].filename}`
    return updateProject
  } else if (!project.picField && req.query.picField === "1") {
    updateProject.picField = `${req.protocol}://${req.get('host')}/images/${req.files[picNumber].filename}`
  }
}


function linkPictureFromFileNumber(project, imageField, numberOfFile) {
  project.imageField = `${req.protocol}://${req.get('host')}/images/${req.files[numberOfFile].filename}`
  return project
}

function selectingFileNumber(project, req) {
  if (req.query.overview === ("add" || "update")) {
    linkPictureFromFileNumber(project, image, 1)
  } else {
    linkPictureFromFileNumber(project, image, 0)
  }
  return project
}

function unlinkTargetedFile(project, imageField) {
  const filename = project.imageField.split('/images/')[1]
  fs.unlink(`images/${filename}`, (error) => { if (error) { console.log(error) }})
}

function handleUpdateOfProject(req, res, project) {
  const projectObject = JSON.parse(req.body.project)
  let updateProject = new Project({
    ...projectObject
  })
  switch (req.query.overview) {
    case "add" :
      linkPictureFromFileNumber(updateProject, overview, 0)
      break
    case "update" :
      linkPictureFromFileNumber(updateProject, overview, 0)
      unlinkTargetedFile(project, overview)
      break
    case "delete" :
      unlinkTargetedFile(project, overview)
      break
  }
  switch (req.query.image) {
    case "add" :
      selectingFileNumber(updateProject, req)
      break
    case "update" :
      selectingFileNumber(updateProject, req)
      unlinkTargetedFile(project, image)
      break
    case "delete" :
      unlinkTargetedFile(project, image)
      break
  }
  Project.update({ ...updateProject }, { where: { id: req.params.id }})
    .then((data) => res.status(200).json({ message: "Update Completed", data }))
    .catch((error) => res.status(500).json({ message: `Update failed: ${error}`})) 
}
*/
module.exports = { handleProjectUpdate }