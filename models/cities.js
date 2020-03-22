'use strict';

module.exports = (sequelize, DataTypes) => {
  const cities = sequelize.define('City', {
    name: DataTypes.STRING,
  },{
    tableName: 'cities',
    freezeTableName: true,
  });

  cities.associate = function(models) {

    cities.hasMany(models.PostalCode,{
      foreignKey: 'cityId'
    });

    cities.hasMany(models.SubDistrict,{
      foreignKey: 'cityId'
    });

    cities.belongsTo(models.Province,{
      foreignKey: 'provinceId',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  };
  return cities;
};