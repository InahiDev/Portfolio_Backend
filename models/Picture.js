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
      allowNull: false
    },
    path: {
      type: type.STRING
    },
    alt: {
      type: type.STRING
    }
  })
}