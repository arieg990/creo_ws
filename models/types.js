'use strict';
module.exports = (sequelize, DataTypes) => {
  const types = sequelize.define('Type', {
    type: {
      type:DataTypes.STRING,
    },
    color: DataTypes.STRING,
  }, {});
  types.associate = function(models) {
  };
  return types;
};