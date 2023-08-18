module.exports = (sequelize, type) => {
  return sequelize.define('project', {
    id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    overView: {
      type: type.STRING
    },
    image: {
      type: type.STRING
    },
    description: {
      type: type.TEXT('medium')
    },
    teaching: {
      type: type.STRING
    }
  })
}

