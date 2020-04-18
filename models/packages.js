'use strict';

module.exports = (sequelize, DataTypes) => {
  const packages = sequelize.define('Package', {
    name: DataTypes.STRING,
    price: DataTypes.INTEGER,
    capacity: DataTypes.INTEGER,
    imageUrl1: DataTypes.STRING,
    url1: DataTypes.STRING,
    imageUrl2: DataTypes.STRING,
    url2: DataTypes.STRING,
    imageUrl3: DataTypes.STRING,
    url3: DataTypes.STRING,
    imageUrl4: DataTypes.STRING,
    url4: DataTypes.STRING,
    isMain: DataTypes.BOOLEAN
  },{
    tableName: 'packages',
    freezeTableName: true,
  });

  packages.associate = function(models) {

    packages.hasMany(models.Service,{
      foreignKey: 'packageId',
      as: "services"
    });

    packages.belongsTo(models.Province,{
      foreignKey: 'provinceId',
      as: "province"
    });

    packages.belongsTo(models.Vendor,{
      foreignKey: 'vendorId',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      as: "vendor"
    });

    packages.belongsTo(models.City,{
      foreignKey: 'cityId',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      as: "city"
    });
  };
  return packages;
};