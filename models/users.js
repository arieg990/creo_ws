'use strict';
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const randomString = require(__dirname + '/../config/randomString');
const crypto = require('crypto');

module.exports = (sequelize, DataTypes) => {
  const users = sequelize.define('User', {
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
    tableName: 'users',
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

  users.prototype.validPassword = function(password) {
    const hmac = crypto.createHmac('sha256', config.secret);
    var encrypt = hmac.update(password);

    password = encrypt.digest('hex');

    return password === this.password ? true : false;
  }

  users.associate = function(models) {
    users.belongsTo(models.Role,{
      foreignKey: 'roleId',
      as: "role"
    });
  };

  return users;
};