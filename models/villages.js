'use strict';

const Sequelize = require("sequelize")

module.exports = (sequelize, DataTypes) => {
  const villages = sequelize.define('Village', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
       primaryKey: true,
    },
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