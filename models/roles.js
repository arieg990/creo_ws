'use strict';
module.exports = (sequelize, DataTypes) => {
  const roles = sequelize.define('Role', {
    role: {
      type:DataTypes.STRING(10),
      primaryKey:true,
      unique: true,
      isUppercase: true,
    },
    name: DataTypes.STRING,
  }, {
    tableName:"roles"
  });
  roles.associate = function(models) {

  };
  return roles;
};