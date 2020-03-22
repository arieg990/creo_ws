'use strict';

module.exports = (sequelize, DataTypes) => {
  const addresses = sequelize.define('Address', {
    name: DataTypes.STRING,
    address: DataTypes.TEXT,
    lat: DataTypes.STRING,
    lng: DataTypes.STRING,
  },{
    tableName: 'addresses',
    freezeTableName: true,
    // getterMethods: {
    //   detail() {
    //     if (this.lastName != null) {
    //       return this.firstName+' '+this.lastName;
    //     }
    //     return this.firstName;
    //   },
    // }
  });

  addresses.associate = function(models) {

    addresses.belongsTo(models.Province,{
      foreignKey: 'provinceId',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });

    addresses.belongsTo(models.City,{
      foreignKey: 'cityId',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });

    addresses.belongsTo(models.PostalCode,{
      foreignKey: 'postalCodeId',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });

    addresses.belongsTo(models.SubDistrict,{
      foreignKey: 'subDistrictId',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });

    addresses.belongsTo(models.Customer,{
      foreignKey: 'customerId',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });

    addresses.belongsTo(models.Vendor,{
      foreignKey: 'vendor_id',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  };
  return addresses;
};