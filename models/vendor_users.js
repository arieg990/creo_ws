'use strict';
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const randomString = require(__dirname + '/../config/randomString');
const crypto = require('crypto');

module.exports = (sequelize, DataTypes) => {
  const vendorUsers = sequelize.define('VendorUser', {
    name: DataTypes.STRING,
    email: {
      type:DataTypes.STRING,
      validate: {
        isEmail: {
                    msg: "Email address must be valid"
                },
         notEmpty: {
                    msg: "Email cannot be empty"
                }
      },
      unique: {
        args: true,
        msg: 'Email address already in use!'
      },
    },
    password: DataTypes.STRING,
    phone: {
      type:DataTypes.STRING,
      validate: {
         notEmpty: {
                    msg: "Phone Number cannot be empty"
                }
      },
      unique: {
        args: true,
        msg: 'Phone Number already in use!'
      },
    },
    picture: DataTypes.STRING,
    gender: {
      type: DataTypes.ENUM,
      values: ['male','female']
    },
  },{
    tableName: 'vendor_users',
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

  vendorUsers.prototype.validPassword = function(password) {
    const hmac = crypto.createHmac('sha256', config.secret);
    var encrypt = hmac.update(password);

    password = encrypt.digest('hex');

    return password === this.password ? true : false;
  }

  vendorUsers.associate = function(models) {
    vendorUsers.belongsTo(models.Role,{
      foreignKey: 'role'
    });
  };

  return vendorUsers;
};