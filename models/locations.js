'use strict';

module.exports = (sequelize, DataTypes) => {
  const locations = sequelize.define('Location', {
    detail: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lat: {
      type: DataTypes.DOUBLE,
      allowNull: false
    },
    lng: {
      type: DataTypes.DOUBLE,
      allowNull: false
    },
  },{
    tableName: 'locations',
    freezeTableName: true,
  });

  locations.associate = function(models) {

    locations.belongsTo(models.Booking,{
      foreignKey: {
        name:'bookingId',
        allowNull: false
      },
      onUpdate: 'CASCADE',
      as: "booking"
    });

    locations.belongsTo(models.Village, {
      foreignKey: {
        name: 'villageId',
        allowNull: false
      },
      onUpdate:'CASCADE',
      as: "village"
    })
  };
  return locations;
};