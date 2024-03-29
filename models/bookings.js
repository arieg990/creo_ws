'use strict';

module.exports = (sequelize, DataTypes) => {
  const bookings = sequelize.define('Booking', {
    qty: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    invoiceNumber: DataTypes.STRING,
    note: DataTypes.TEXT,
    total: {
      type: DataTypes.DOUBLE(13, 4),
      allowNull: false,
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endDate: DataTypes.DATE,
  },{
    tableName: 'bookings',
    freezeTableName: true,
  });

  bookings.associate = function(models) {

    bookings.belongsTo(models.Package,{
      foreignKey: {
        name:'packageId',
        allowNull: false
      },
      onUpdate: 'CASCADE',
      as: "package"
    });

    bookings.belongsTo(models.Vendor,{
      foreignKey: {
        name:'vendorId',
        allowNull: false
      },
      onUpdate: 'CASCADE',
      as: "vendor"
    });

    bookings.hasMany(models.Payment,{
      foreignKey: 'bookingId',
      onUpdate: 'CASCADE',
      as: "payments"
    });

    bookings.hasOne(models.Location,{
      foreignKey: 'bookingId',
      onUpdate: 'CASCADE',
      as: "location"
    });

    bookings.hasOne(models.Project,{
      foreignKey: 'bookingId',
      onUpdate: 'CASCADE',
      as: "project"
    });

    bookings.belongsTo(models.Code,{
      foreignKey: {
        name:'statusCode',
        allowNull: false,
        defaultValue: 'BKSVTG'
      },
      onUpdate: 'CASCADE',
      as: "status"
    });

    bookings.belongsTo(models.Customer,{
      foreignKey: {
        name:'customerId',
        allowNull: false
      },
      onUpdate: 'CASCADE',
      as: "customer"
    });
  };
  return bookings;
};