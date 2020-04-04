'use strict';
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const randomString = require(__dirname + '/../config/randomString');
const crypto = require('crypto');

module.exports = (sequelize, DataTypes) => {
  const customers = sequelize.define('Customer', {
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
    imageUrl: DataTypes.STRING,
    url:DataTypes.STRING,
    gender: {
      type: DataTypes.ENUM,
      values: ['male','female']
    },
    dob: DataTypes.DATEONLY,
    pod: DataTypes.STRING(20),
    googleId: DataTypes.STRING,
    provider: DataTypes.STRING(20),

  },{
    tableName: 'customers',
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

  customers.prototype.validPassword = function(password) {
    const hmac = crypto.createHmac('sha256', config.secret);
    var encrypt = hmac.update(password);

    password = encrypt.digest('hex');

    return password === this.password ? true : false;
  }

  customers.associate = function(models) {
    customers.hasMany(models.Address,{
      foreignKey: 'customerId'
    });
  };
  return customers;
};