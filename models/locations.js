'use strict';

module.exports = (sequelize, DataTypes) => {
  const locations = sequelize.define('Location', {
    detail: DataTypes.TEXT,
    total: DataTypes.INTEGER,
    lat: DataTypes.STRING,
    lng: DataTypes.STRING,
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