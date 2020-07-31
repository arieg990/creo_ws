'use strict';

module.exports = (sequelize, DataTypes) => {
  const banks = sequelize.define('Bank', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    accountName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    accountNumber: {
      type: DataTypes.STRING,
      allowNull: false
    },
    imageUrl:  {
      type: DataTypes.STRING,
      allowNull: false
    },
  },{
    tableName: 'banks',
    freezeTableName: true,
  });

  banks.associate = function(models) {

  };
  return banks;
};