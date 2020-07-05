'use strict';
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const randomString = require(__dirname + '/../config/randomString');
const crypto = require('crypto');

module.exports = (sequelize, DataTypes) => {
  const sub_districts = sequelize.define('SubDistrict', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },{
    tableName: 'sub_districts',
    freezeTableName: true,
  });

  sub_districts.associate = function(models) {
    sub_districts.belongsTo(models.City,{
      foreignKey: {
        name:'cityId',
        allowNull: false
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      as: "city"
    });

    sub_districts.hasOne(models.PostalCode,{
      foreignKey: {
        name: 'subDistrictId',
        allowNull:false
      },
      as:'postalCode'
    });

    sub_districts.hasMany(models.Village,{
      foreignKey: {
        name:'subDistrictId',
        allowNull: false
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      as: "villages"
    });

    sub_districts.hasOne(models.Village,{
      foreignKey: {
        name: 'subDistrictId',
        allowNull:false
      },
      as:'village'
    });
  };

  return sub_districts;
};