'use strict';

module.exports = (sequelize, DataTypes) => {
  const stories = sequelize.define('Story', {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    publishDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    publishEndDate : {
      type: DataTypes.DATE,
      allowNull: false,
    }
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