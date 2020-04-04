'use strict';

module.exports = (sequelize, DataTypes) => {
  const galleries = sequelize.define('Gallery', {
    imageUrl: DataTypes.STRING,
    url: DataTypes.STRING,
  },{
    tableName: 'galleries',
    freezeTableName: true,
  });

  galleries.associate = function(models) {

    galleries.belongsTo(models.Vendor,{
      foreignKey: 'vendorId',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
  };
  return galleries;
};