'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('tokens','vendorUserId', {
      type: Sequelize.INTEGER(11),
      after:"customerId",
      references: {
          model: 'vendor_users', // name of Target model
          key: 'id', // key in Target model that we're referencing
        }
      });
  }
};