'use strict';
module.exports = (sequelize, DataTypes) => {
  const categories = sequelize.define('Category', {
    name: {
      type:DataTypes.STRING,
    },
    imageUrl: DataTypes.STRING,
    url: DataTypes.STRING,
    color:DataTypes.STRING
  }, {});
  categories.associate = function(models) {

  };
  return categories;
};