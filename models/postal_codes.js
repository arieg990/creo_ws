'use strict';

module.exports = (sequelize, DataTypes) => {
  const postal_codes = sequelize.define('PostalCode', {
    postalCode: DataTypes.INTEGER,
  },{
    tableName: 'postal_codes',
    freezeTableName: true,
  });

  postal_codes.associate = function(models) {
    postal_codes.belongsTo(models.City,{
      foreignKey: 'cityId',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      as: "city"
    });
  };
  return postal_codes;
};