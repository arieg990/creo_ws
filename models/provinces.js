'use strict';
module.exports = (sequelize, DataTypes) => {
  const provinces = sequelize.define('Province', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
  },{
    tableName: 'provinces',
    freezeTableName: true,
  });

  provinces.associate = function(models) {
    provinces.hasMany(models.City,{
      foreignKey: {
        name: 'provinceId',
        allowNull: false
      },
      as: "cities"
    });
  };
  return provinces;
};