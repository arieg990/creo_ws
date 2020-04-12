'use strict';

module.exports = (sequelize, DataTypes) => {
  const projects = sequelize.define('Project', {
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
  },{
    tableName: 'projects',
    freezeTableName: true,
  });

  projects.associate = function(models) {

    projects.hasMany(models.Gallery,{
      foreignKey: 'projectId',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
  };
  return projects;
};