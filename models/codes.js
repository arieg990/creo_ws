'use strict';
module.exports = (sequelize, DataTypes) => {
  const codes = sequelize.define('Code', {
    code: {
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
    tableName: 'mst_codes',
  });
  codes.associate = function(models) {

    codes.belongsTo(models.CategoryCode,{
      foreignKey: 'categoryCodeId',
      as: "categoryCode"
    });
  };
  return codes;
};