'use strict';
module.exports = (sequelize, DataTypes) => {
  const reviews = sequelize.define('Review', {
    rating: DataTypes.DOUBLE(10,1),
    description:DataTypes.TEXT
  }, {});
  reviews.associate = function(models) {
    reviews.belongsTo(models.Customer,{
      foreignKey: 'customerId',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });

    reviews.belongsTo(models.Vendor,{
      foreignKey: 'vendorId',
    });

    reviews.belongsTo(models.Package,{
      foreignKey: 'packageId',
    });
  };
  return reviews;
};