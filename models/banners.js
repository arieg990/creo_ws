'use strict';

module.exports = (sequelize, DataTypes) => {
  const banners = sequelize.define('Banner', {
    title: DataTypes.STRING,
    Description: DataTypes.TEXT,
    imageUrl: DataTypes.STRING,
    publishDate: DataTypes.DATE,
    publishEndDate: DataTypes.DATE,
    startDate: DataTypes.DATE,
    endDate: DataTypes.DATE,
    url: DataTypes.STRING,
  },{
    tableName: 'banners',
    freezeTableName: true,
  });

  banners.associate = function(models) {

    banners.belongsTo(models.User,{
      foreignKey: 'userId',
      onUpdate: 'CASCADE'
    });
  };
  return banners;
};