module.exports = (sequelize, type) => {
  return sequelize.define('stack', {
    id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    HTML5: {
      type: type.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    CSS3: {
      type: type.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    Sass: {
      type: type.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    JavaScript: {
      type: type.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    VueJs: {
      type: type.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    NodeJs: {
      type: type.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    ExpressJs: {
      type: type.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    NoSQL: {
      type: type.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    SQL: {
      type: type.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    }
  },{
    timestamps: false
  })
}