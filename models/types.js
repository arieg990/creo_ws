'use strict';
module.exports = (sequelize, DataTypes) => {
  const types = sequelize.define('Type', {
    type: {
      type:DataTypes.STRING,
    },
    color: DataTypes.STRING,
  }, {
    tableName: 'types',
    freezeTableName: true,
  });
  types.associate = function(models) {
  };
  return types;
};