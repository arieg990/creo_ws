'use strict';

const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];

module.exports = (sequelize, DataTypes) => {
  const tokens = sequelize.define('Token', {
    token: {
      type:DataTypes.STRING,
    },
  }, {});

  tokens.prototype.isExpired = function(token) {

    return Math.round((Date.now()-token.updatedAt)/1000) > config.tokenLife;
  }

  tokens.associate = function(models) {

    tokens.belongsTo(models.Customer,{
      foreignKey: 'customerId',
      as: "customer"
    });

    tokens.belongsTo(models.VendorUser,{
      foreignKey: 'vendorUserId',
      as: "vendorUser"
    });

    tokens.belongsTo(models.User,{
      foreignKey: 'userId',
      as: "user"
    });
  };
  return tokens;
};