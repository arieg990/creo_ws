'use strict';
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const randomString = require(__dirname + '/../config/randomString');
const crypto = require('crypto');

module.exports = (sequelize, DataTypes) => {
  const sub_districts = sequelize.define('SubDistrict', {
    name: DataTypes.STRING,
  },{
    tableName: 'sub_districts',
    freezeTableName: true,
  });

  sub_districts.associate = function(models) {
    sub_districts.belongsTo(models.City,{
      foreignKey: 'cityId',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      as: "city"
    });
  };
  return sub_districts;
};