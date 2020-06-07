'use strict';

module.exports = (sequelize, DataTypes) => {
  const locations = sequelize.define('Location', {
    detail: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lat: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lng: {
      type: DataTypes.STRING,
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
  };
  return locations;
};