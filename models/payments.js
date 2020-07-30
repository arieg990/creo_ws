'use strict';

module.exports = (sequelize, DataTypes) => {
  const payments = sequelize.define('Payment', {
    invoiceNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    total: {
      type: DataTypes.DOUBLE(13, 4),
      allowNull: false,
    },
    imageUrl: DataTypes.STRING,
    url:DataTypes.STRING,
    expiredDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
  },{
    tableName: 'payments',
    freezeTableName: true,
  });

  payments.associate = function(models) {

    payments.belongsTo(models.Booking,{
      foreignKey: {
        name:'bookingId',
        allowNull: false
      },
      onUpdate: 'CASCADE',
      as: "booking"
    });

    payments.belongsTo(models.Code,{
     foreignKey: {
      name:'paymentTypeCode',
      allowNull: false
    },
    onUpdate: 'CASCADE',
    as: "paymentType"
  });

    payments.belongsTo(models.Code,{
      foreignKey: {
        name:'statusCode',
        allowNull: false,
        defaultValue: 'PTSWTG'
      },
      onUpdate: 'CASCADE',
      as: "status"
    });
  };
  return payments;
};