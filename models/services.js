'use strict';
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const randomString = require(__dirname + '/../config/randomString');
const crypto = require('crypto');

module.exports = (sequelize, DataTypes) => {
  const services = sequelize.define('Service', {
    title: DataTypes.STRING,
    detail: DataTypes.TEXT,
  },{
    tableName: 'services',
    freezeTableName: true,
  });

  services.associate = function(models) {

    services.belongsTo(models.Package,{
      foreignKey: 'packageId',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      as: "package"
    });
  };
  return services;
};