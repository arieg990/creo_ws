'use strict';
module.exports = (sequelize, DataTypes) => {
  const provinces = sequelize.define('Province', {
    name: DataTypes.STRING,
  },{
    tableName: 'provinces',
    freezeTableName: true,
  });

  provinces.associate = function(models) {
    provinces.hasMany(models.City,{
      foreignKey: 'provinceId'
    });
  };
  return provinces;
};