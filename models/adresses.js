'use strict';

module.exports = (sequelize, DataTypes) => {
  const addresses = sequelize.define('Address', {
    name:  {
      type: DataTypes.STRING,
      allowNull: false
    },
    detail: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    lat: {
      type: DataTypes.STRING,
      allowNull: false
    }
    lng: {
      type: DataTypes.STRING,
      allowNull: false
    },
    isMain: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
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
      onUpdate: 'CASCADE',
      as: "province"
    });

    addresses.belongsTo(models.City,{
      foreignKey: 'cityId',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      as: "city"
    });

    addresses.belongsTo(models.PostalCode,{
      foreignKey: 'postalCodeId',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      as: "postalCode"
    });

    addresses.belongsTo(models.SubDistrict,{
      foreignKey: 'subDistrictId',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      as: "subDistrict"
    });

    addresses.belongsTo(models.Customer,{
      foreignKey: 'customerId',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      as: "customer"
    });

    addresses.belongsTo(models.Vendor,{
      foreignKey: 'vendorId',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      as: "vendor"
    });
  };
  return addresses;
};