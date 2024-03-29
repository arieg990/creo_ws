'use strict';

module.exports = (sequelize, DataTypes) => {
  const postal_codes = sequelize.define('PostalCode', {
    postalCode: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
  },{
    tableName: 'postal_codes',
    freezeTableName: true,
  });

  postal_codes.associate = function(models) {
    postal_codes.belongsTo(models.SubDistrict,{
      foreignKey: {
        name: 'subDistrictId',
        allowNull: false
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      as: "subDistrict"
    });
  };
  return postal_codes;
};