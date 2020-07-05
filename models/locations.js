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

    locations.belongsTo(models.SubDistrict, {
      foreignKey: {
        name: 'subDistrictId',
        allowNull: false
      },
      onUpdate:'CASCADE',
      as: "subDistrict"
    })
  };
  return locations;
};