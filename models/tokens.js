'use strict';

const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];

module.exports = (sequelize, DataTypes) => {
  const tokens = sequelize.define('Token', {
    token: {
      type:DataTypes.STRING,
      primaryKey:true,
      unique: true
    },
  }, {});

  tokens.prototype.isExpired = function(token) {

    return Math.round((Date.now()-token.createdAt)/1000) > config.tokenLife;
  }

  tokens.associate = function(models) {

    tokens.belongsTo(models.Customer,{
      foreignKey: 'customerId',
    });
  };
  return tokens;
};