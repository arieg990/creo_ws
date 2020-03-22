'use strict';
module.exports = (sequelize, DataTypes) => {
  const roles = sequelize.define('roles', {
    type: {
      type:DataTypes.STRING(10),
      primaryKey:true,
      unique: true,
      isUppercase: true,
    },
    name: DataTypes.STRING,
  }, {});
  roles.associate = function(models) {
  };
  return roles;
};