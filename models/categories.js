'use strict';
module.exports = (sequelize, DataTypes) => {
  const categories = sequelize.define('Category', {
    category: {
      type:DataTypes.STRING,
    },
    imageUrl: DataTypes.STRING,
    url: DataTypes.STRING,
    color:DataTypes.STRING
  }, {});
  categories.associate = function(models) {

    // categories.hasMany(models.Type,{
    //   foreignKey: 'category',
    // });
  };
  return categories;
};