'use strict';
module.exports = (sequelize, DataTypes) => {
  const categories = sequelize.define('Category', {
    category: {
      type:DataTypes.STRING,
      primaryKey:true,
      unique: true,
      isUppercase: true,
      validate: {
        isAlphanumeric: {
                    msg: "Alphanumeric allowed"
                }
      }
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