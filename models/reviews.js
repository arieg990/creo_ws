'use strict';
module.exports = (sequelize, DataTypes) => {
  const reviews = sequelize.define('Review', {
    rating: {
      type: DataTypes.DOUBLE(10,1),
      allowNull: false
    },
    description:DataTypes.TEXT
  }, {});
  reviews.associate = function(models) {
    reviews.belongsTo(models.Customer,{
      foreignKey: {
        name: 'customerId',
        allowNull: false
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      as: "customer"
    });

    reviews.belongsTo(models.Vendor,{
      foreignKey: {
        name: 'vendorId',
        allowNull: false
      },
      as: "vendor"
    });

    reviews.belongsTo(models.Package,{
      foreignKey: {
        name: 'packageId',
        allowNull: false
      },
      as: "package"
    });

    reviews.belongsTo(models.Project,{
      foreignKey: {
        name: 'projectId',
        allowNull: false
      },
      as: "project"
    });
  };
  return reviews;
};