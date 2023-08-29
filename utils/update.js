const { Project } = require('../sequelize')
const fs = require('fs')

function handleUpdateOfImage(req, res, project) {
  const projectObject = JSON.parse(req.body.project)
  const updateProject = new Project({
    
  })
}