const { DataTypes } = require('sequelize')

module.exports = (sequelize, type) => {
  return User = sequelize.define('user', {
    id: {
      type: DataTypes.UUIDV4,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    email: {
      type: type.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: type.STRING,
      allowNull: false,
    },
    isAdmin: {
      type: type.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  },{
    timestamps: false
  })
}