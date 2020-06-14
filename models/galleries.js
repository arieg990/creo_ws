'use strict';

module.exports = (sequelize, DataTypes) => {
  const galleries = sequelize.define('Gallery', {
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: false
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false
    },
    isMain: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  },{
    tableName: 'galleries',
    freezeTableName: true,
  });

  galleries.associate = function(models) {

    galleries.belongsTo(models.Vendor,{
      foreignKey: 'vendorId',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
      as: "vendor"
    });

    galleries.belongsTo(models.Package,{
      foreignKey: 'packageId',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
      as: "package"
    });

    galleries.belongsTo(models.Project,{
      foreignKey: 'projectId',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
      as: "project"
    });
  };
  return galleries;
};