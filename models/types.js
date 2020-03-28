'use strict';
module.exports = (sequelize, DataTypes) => {
  const types = sequelize.define('Type', {
    type: {
      type:DataTypes.STRING,
      primaryKey:true,
      isUppercase: true,
      validate: {
        isAlphanumeric: {
                    msg: "Alphanumeric allowed"
                }
      }
    },
    name: DataTypes.STRING,
  }, {});
  types.associate = function(models) {
    types.belongsTo(models.Category,{
      foreignKey: 'category',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  };
  return types;
};