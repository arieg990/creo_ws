'use strict';

module.exports = (sequelize, DataTypes) => {
  const projects = sequelize.define('Project', {
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
  },{
    tableName: 'projects',
    freezeTableName: true,
  });

  projects.associate = function(models) {

    projects.hasMany(models.Gallery,{
      foreignKey: {
        name: 'projectId',
        allowNull: false
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
      as: "galleries"
    });

    projects.hasOne(models.Review,{
      foreignKey: {
        name: 'projectId',
        allowNull: false
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
      as: "review"
    });

    projects.belongsTo(models.Booking, {
      foreignKey: {
        name: 'bookingId',
        allowNull: false
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
      as: "booking"
    })

  };
  return projects;
};