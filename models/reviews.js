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
      onUpdate: 'CASCADE',
      as: "customer"
    });

    reviews.belongsTo(models.Vendor,{
      foreignKey: 'vendorId',
      as: "vendor"
    });

    reviews.belongsTo(models.Package,{
      foreignKey: 'packageId',
      as: "package"
    });
  };
  return reviews;
};