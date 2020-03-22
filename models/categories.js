'use strict';
module.exports = (sequelize, DataTypes) => {
  const categories = sequelize.define('Category', {
    category: {
      type:DataTypes.STRING(10),
      primaryKey:true,
      unique: true,
      isUppercase: true,
    },
    name: DataTypes.STRING,
  }, {});
  categories.associate = function(models) {

    categories.hasMany(models.Type,{
      foreignKey: 'category',
    });
  };
  return categories;
};