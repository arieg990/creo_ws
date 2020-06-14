'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('projects','bookingId', {
      type: Sequelize.INTEGER(11),
      after:"description",
      references: {
          model: 'bookings', // name of Target model
          key: 'id', // key in Target model that we're referencing
        }
      });
  }
};