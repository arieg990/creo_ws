'use strict';
module.exports = (sequelize, DataTypes) => {
  const categories = sequelize.define('Category', {
    category: {
      type:DataTypes.STRING,
      primaryKey:true,
      unique: true,
      validate: {
        isAlphanumeric: {
                    msg: "Alphanumeric allowed"
                },
        isUppercase: {
          msg: "Uppercase Allowed"
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