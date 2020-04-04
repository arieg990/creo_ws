'use strict';
module.exports = (sequelize, DataTypes) => {
  const categoryCodes = sequelize.define('CategoryCode', {
    categoryCode: {
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
    name:DataTypes.STRING
  }, {
    tableName: 'mst_category_codes',
  });
  categoryCodes.associate = function(models) {

    categoryCodes.hasMany(models.Code,{
      foreignKey: 'categoryCode',
    });
  };
  return categoryCodes;
};