'use strict';
module.exports = (sequelize, DataTypes) => {
  const categories = sequelize.define('Category', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: false
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false
    },
    color:{
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    tableName: 'categories',
  });
  categories.associate = function(models) {

  };
  return categories;
};