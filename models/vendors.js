'use strict';
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const randomString = require(__dirname + '/../config/randomString');
const crypto = require('crypto');

module.exports = (sequelize, DataTypes) => {
  const vendors = sequelize.define('Vendor', {
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    imageUrl: DataTypes.STRING,
    url: DataTypes.STRING,
    rating: DataTypes.INTEGER,
    isOfficial: DataTypes.isOfficial
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

  vendors.associate = function(models) {
    vendors.hasMany(models.Address,{
      foreignKey: 'vendorId'
    });

    vendors.hasMany(models.Package,{
      foreignKey: 'vendorId'
    });

    vendors.hasMany(models.SocialMedia,{
      foreignKey: 'vendorId'
    });

    vendors.hasMany(models.Contact,{
      foreignKey: 'vendorId'
    });

    vendors.belongsTo(models.Category, {
      foreignKey: 'categoryId'
    })

     vendors.hasMany(models.Gallery, {
      foreignKey: 'vendorId'
    })
  };
  return vendors;
};