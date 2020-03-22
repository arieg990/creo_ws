'use strict';

module.exports = (sequelize, DataTypes) => {
  const packages = sequelize.define('Package', {
    name: DataTypes.STRING,
    price: DataTypes.FLOAT(6),
    capacity: DataTypes.INTEGER,
  },{
    tableName: 'packages',
    freezeTableName: true,
  });

  packages.associate = function(models) {

    packages.hasMany(models.Service,{
      foreignKey: 'packageId'
    });

    packages.belongsTo(models.Province,{
      foreignKey: 'provinceId'
    });

    packages.belongsTo(models.Vendor,{
      foreignKey: 'vendorId',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });

    packages.belongsTo(models.City,{
      foreignKey: 'cityId',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  };
  return packages;
};