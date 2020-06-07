'use strict';

module.exports = (sequelize, DataTypes) => {
  const banners = sequelize.define('Banner', {
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    imageUrl:  {
      type: DataTypes.STRING,
      allowNull: false
    },
    url:  {
      type: DataTypes.STRING,
      allowNull: false
    },
    publishDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    publishEndDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
  },{
    tableName: 'banners',
    freezeTableName: true,
  });

  banners.associate = function(models) {

    banners.belongsTo(models.User,{
      foreignKey: {
        name: 'userId',
        allowNull: false
      },
      onUpdate: 'CASCADE',
      as: "user"
    });
  };
  return banners;
};