'use strict';
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const randomString = require(__dirname + '/../config/randomString');
const crypto = require('crypto');

module.exports = (sequelize, DataTypes) => {
  const services = sequelize.define('Service', {
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    detail: {
      type: DataTypes.TEXT,
      allowNull: false
    },
  },{
    tableName: 'services',
    freezeTableName: true,
  });

  services.associate = function(models) {

    services.belongsTo(models.Package,{
      foreignKey: {
        name: 'packageId',
        allowNull: false
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      as: "package"
    });
  };
  return services;
};