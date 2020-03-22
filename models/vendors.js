'use strict';
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const randomString = require(__dirname + '/../config/randomString');
const crypto = require('crypto');

module.exports = (sequelize, DataTypes) => {
  const vendors = sequelize.define('Vendor', {
    name: DataTypes.STRING,
    email: {
      type:DataTypes.STRING,
      isEmail: true,
    },
    password: DataTypes.STRING,
    phoneNumber: DataTypes.STRING,
    picture: DataTypes.STRING,
    gender: DataTypes.INTEGER(2),
    googleId: DataTypes.STRING,
    provider: DataTypes.STRING(20),

  },{
    tableName: 'vendors',
    hooks: {
      beforeCreate: (user,option) => {
        const hmac = crypto.createHmac('sha256', config.secret);
        if (user.password == null) {
          user.password = randomString.generateAlphaNumericSymbol()
        }
        user.password = hmac.update(user.password).digest('hex');
      }
    },
    freezeTableName: true,
  });

  vendors.prototype.validPassword = function(password) {
    const hmac = crypto.createHmac('sha256', config.secret);
    var encrypt = hmac.update(password);

    password = encrypt.digest('hex');

    return password === this.password ? true : false;
  }

  vendors.associate = function(models) {
    vendors.hasMany(models.Address,{
      foreignKey: 'vendorId'
    });

    vendors.hasMany(models.Package,{
      foreignKey: 'vendorId'
    });
  };
  return vendors;
};