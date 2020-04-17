'use strict';

module.exports = (sequelize, DataTypes) => {
  const stories = sequelize.define('Story', {
    title: DataTypes.STRING,
    Description: DataTypes.TEXT,
    imageUrl: DataTypes.STRING,
    publishDate: DataTypes.DATE,
    publishEndDate : DataTypes.DATE,
    url: DataTypes.STRING,
  },{
    tableName: 'stories',
    freezeTableName: true,
  });

  stories.associate = function(models) {

    stories.belongsTo(models.User,{
      foreignKey: 'userId',
      onUpdate: 'CASCADE',
      as: "user"
    });
  };
  return stories;
};