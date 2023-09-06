module.exports = (sequelize, type) => {
  return sequelize.define('file', {
    id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    file: {
      type: type.BLOB('long'),
      allowNull: false
    },
    name: {
      type: type.STRING,
      allowNull: false,
      unique: true
    }
  })
}