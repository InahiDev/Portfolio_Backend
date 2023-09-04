module.exports = (sequelize, type) => {
  return sequelize.define('project', {
    id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    /*overView: {
      type: type.STRING
    },
    image: {
      type: type.STRING
    },*/
    description: {
      type: type.TEXT('medium')
    },
    teaching: {
      type: type.STRING
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
  })
}

