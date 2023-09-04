module.exports = (sequelize, type) => {
  return sequelize.define('picture', {
    id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    imageType: {
      type: type.STRING,
    },
    path: {
      type: type.STRING
    }
  })
}