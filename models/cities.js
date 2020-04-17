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
      foreignKey: 'cityId',
      as:'postalCodes'
    });

    cities.hasMany(models.SubDistrict,{
      foreignKey: 'cityId',
      as:'subDistricts'
    });

    cities.belongsTo(models.Province,{
      foreignKey: 'provinceId',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      as: "province"
    });
  };
  return cities;
};