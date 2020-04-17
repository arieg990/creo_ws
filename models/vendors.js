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
    isOfficial: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
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
      foreignKey: 'vendorId',
      as: "addresses"
    });

    vendors.hasMany(models.Package,{
      foreignKey: 'vendorId',
      as: "packages"
    });

    vendors.hasMany(models.SocialMedia,{
      foreignKey: 'vendorId',
      as: "socialMedia"
    });

    vendors.hasMany(models.Contact,{
      foreignKey: 'vendorId',
      as: "contacts"
    });

    vendors.belongsTo(models.Category, {
      foreignKey: 'categoryId',
      as: "category"
    })

     vendors.hasMany(models.Gallery, {
      foreignKey: 'vendorId',
      as: "galleries"
    })

     vendors.hasMany(models.Review, {
      foreignKey: 'vendorId',
      as: "reviews"
    })
  };
  return vendors;
};