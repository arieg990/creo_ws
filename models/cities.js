'use strict';

module.exports = (sequelize, DataTypes) => {
  const cities = sequelize.define('City', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
  },{
    tableName: 'cities',
    freezeTableName: true,
  });

  cities.associate = function(models) {

    cities.hasMany(models.PostalCode,{
      foreignKey: {
        name: 'cityId',
        allowNull:false
      },
      as:'postalCodes'
    });

    cities.hasMany(models.SubDistrict,{
      foreignKey: {
        name: 'cityId',
        allowNull:false
      },
      as:'subDistricts'
    });

    cities.hasOne(models.SubDistrict,{
      foreignKey: {
        name: 'cityId',
        allowNull:false
      },
      as:'subDistrict'
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