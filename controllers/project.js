const { Project, Picture } = require('../sequelize')
const fs = require('fs')
const {  handleWrongImageDeletion } = require('../utils/creation')

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
    .catch((error) => res.status(500).json({ message: `Had some trouble accessing the specific project: ${error}`}), error)
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
  if (req.files && req.files.length !== 0 && req.body.imageType) {
    Project.findOne({ where: { id: req.params.id }})
    .then((project) => {
      if (project) {
        Picture.findOne({ where: { projectId: req.params.id, imageType: req.body.imageType }})
          .then((data) => {
            let imageTypeRegex = /^overview$|^image$/gm
            const isImageTypeCorrect = imageTypeRegex.test(req.body.imageType)
            if (data)  {
              console.log(data)
              handleWrongImageDeletion(req, res, "One image of this type is allready linked and saved with this project")
            } else if (!isImageTypeCorrect) {
              handleWrongImageDeletion(req, res, "ImageType not recognized")
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
      } else {
        handleWrongImageDeletion(req, res, "There is no such project in DB!")
      }
    })
    .catch((error) => res.status(500).json({ message: `Could not search correctly in DB: ${error}`}))
  } else if (req.files && req.files.length !== 0 && !req.body.imageType) {
    const uploadedImage = `${req.protocol}://${req.get('host')}/images/${req.files[0].filename}`
    const filename = uploadedImage.split('/images/')[1]
    fs.unlink(`images/${filename}`, () => {
      res.status(400).json({ message: "Check fields! There is no imageType to save in this request" })
    })
  } else if (req.files && req.files.length === 0 && req.body.imageType) {
    res.status(400).json({ message: "There is no file to upload in this request!"})
  } else {
    res.status(400).json({ message: "There is no correct fields in this request!"})
  }
}

exports.editProject = (req, res) => {
  let updatedStacks = new Project({
    HTML5: false,
    CSS3: false
  })
  if (Array.isArray(req.body.stacks)) {
    for (let stack of req.body.stacks) {
      updatedStacks[stack] = true
    }
  }
  Project.update({
    description: req.body.description,
    teaching: req.body.teaching,
    HTML5: updatedStacks.HTML5,
    CSS3: updatedStacks.CSS3,
    Sass: updatedStacks.Sass,
    JavaScript: updatedStacks.JavaScript,
    VueJs: updatedStacks.VueJs,
    NodeJs: updatedStacks.NodeJs,
    ExpressJs: updatedStacks.ExpressJs,
    NoSQL: updatedStacks.NoSQL,
    SQL: updatedStacks.SQL
  },{
    where: {
      id: req.params.id
    }
  })
    .then((data) => res.status(200).json({ message: "Project updated"}))
    .catch((error) => res.status(500).json( { message: `Error occured while updating project: ${error}` }))
}

exports.editProjectPicture = (req, res) => {
  if (req.files && req.files.length !== 0 && req.body.imageType) {
    Project.findOne({ where: { id: req.params.id }})
    .then((data) => {
      if (data) {
        Picture.findOne({ where: { projectId: req.params.id, imageType: req.body.imageType }})
          .then((picture) => {
            let newPath = `${req.protocol}://${req.get('host')}/images/${req.files[0].filename}`
            let imageTypeRegex = /^overview$|^image$/gm
            const isImageTypeCorrect = imageTypeRegex.test(req.body.imageType)
            if (picture) {
              let filename = picture.path.split('/images/')[1]
              fs.unlink(`images/${filename}`, () => {
                Picture.update({ path: newPath }, { where: { projectId: req.params.id, imageType: req.body.imageType }})
                  .then((data) => res.status(200).json({ message: "Picture updated and previous picture deleted" }))
                  .catch((error) => res.status(500).json({ message: `Something happened while updating Picture.path in the DB! : ${error}`}))
              })
            } else {
              if (isImageTypeCorrect) {
                let newPicture = new Picture({
                  path: newPath,
                  id: req.params.id,
                  imageType: req.body.imageType
                })
                newPicture.save()
                  .then((data) => res.status(201).json({ message: "New Picture added to the project with correct imageType"}))
                  .catch((error) => res.status(500).json({ message: `Error during the saving of a new Picture: ${error}`}))
              } else {
                handleWrongImageDeletion(req, res, "ImageType not recognized")
              }
            }
          })
          .catch((error) => res.status(500).json({ message: `Trouble during the search for a picture corresponding to the id in DB: ${error}`}))
      } else {
        handleWrongImageDeletion(req, res, "There is no project in DB to link the picture with, check the id you gave me!" )
      }
    })
    .catch((error) => res.status(500).json({ message: `Something went wrong while looking for a previous picture in the DB: ${error}`}))
  } else if (req.files && req.files.length !== 0 && !req.body.imageType) {
    handleWrongImageDeletion(req, res, "Bad request, check fields of request, there is no imageType specified with this picture!")
  } else if (req.files && req.files.length === 0 && req.body.imageType) {
    res.status(400).json({ message: "There is no file to upload in this request!"})
  } else {
    res.status(400).json({ message: "No correct fields in this request!"})
  }
}

exports.deleteProject = (req, res) => {
  Project.findOne({ where: { id: req.params.id }})
    .then((data) => {
      if (data) {
        const projectToDelete = data
        Picture.findAll({ where: { projectId: req.params.id }})
          .then((pictures) => {
            if (pictures.length === 0) {
              Project.destroy({ where: { id: req.params.id }})
                .then((data) => res.status(200).json({ message: "Project without pictures deleted!"}))
                .catch((error) => res.status(500).json({ message: `Error occured during deletion of the project without image: ${error}`}))
            } else if (pictures.length !== 0) {
              for (let picture of pictures) {
                const path = picture.path
                const filename = path.split('/images/')[1]
                fs.unlink(`images/${filename}`, (error) => {
                  if (error) {
                    console.log(error)
                  }
                })
              }
              Project.destroy({ where: { id: req.params.id }})
                .then(() => res.status(200).json({ message: "Pictures and Project destroyed"}))
                .catch((error) => res.status(500).json({ message: `Trouble destroying project: ${error}`}))
            }
          })
      } else {
        res.status(400).json({ message: "Could not find the project you aiimed to destroy!"})
      }
    })
    .catch((error) => res.status(500).json({ message: `Had some trouble finding the project to destroy: ${error}`}))
} 