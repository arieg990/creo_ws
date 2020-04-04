'use strict';
module.exports = (sequelize, DataTypes) => {
  const contacts = sequelize.define('Contact', {
    name: DataTypes.STRING,
    contact: DataTypes.STRING,
  }, {
    tableName:'contacts'
  });
  contacts.associate = function(models) {

    contacts.belongsTo(models.Code,{
      foreignKey: 'code',
    });
  };
  return contacts;
};