'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('projects','vendorId', {
      type: Sequelize.INTEGER(11),
      after:"bookingId",
      references: {
          model: 'vendors', // name of Target model
          key: 'id', // key in Target model that we're referencing
        }
      });
  }
};