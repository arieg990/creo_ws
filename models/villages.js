'use strict';

module.exports = (sequelize, DataTypes) => {
  const villages = sequelize.define('Village', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
  },{
    tableName: 'villages',
    freezeTableName: true,
  });

  villages.associate = function(models) {
    villages.belongsTo(models.SubDistrict,{
      foreignKey: 'subDistrictId',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      as: "subDistrict"
    });
  };
  return villages;
};