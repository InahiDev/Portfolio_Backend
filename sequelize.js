const Sequelize = require('sequelize');
const UserModel = require('./models/User');
const ProjectModel = require('./models/Project')
const PictureModel = require('./models/Picture')
const FileModel = require('./models/File')
const dotenv = require('dotenv')
dotenv.config()

const USERNAME = process.env.DB_USERNAME
const PSWD = process.env.DB_PSWD
const DB_PORT = process.env.DB_PORT
const DB_DIALECT = process.env.DB_DIALECT
const sequelize = new Sequelize('portfolio_gabriel_delaigue_db', USERNAME, PSWD, {
  port: DB_PORT,
  dialect: DB_DIALECT
})

const User = UserModel(sequelize, Sequelize)
const Project = ProjectModel(sequelize, Sequelize)
const Picture = PictureModel(sequelize, Sequelize)
const File = FileModel(sequelize, Sequelize)

Project.hasMany(Picture, {
  foreignKey: 'projectId',
  onDelete: 'CASCADE'
})
Picture.belongsTo(Project)

sequelize.authenticate()
  .then(() => console.log('Database connexion correct'))
  .catch((error) => console.log(`Database connexion failed: ${error}`))

sequelize.sync()
  .then(() => console.log('Table created and/or updtated with Models!'))
  .catch((error) => console.log(`Update or creation of Tables failed: ${error}`))

module.exports = { User, Project, Picture, File }