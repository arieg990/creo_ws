'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('payments','bankId', {
      type: Sequelize.INTEGER(11),
      after:"bookingId",
      references: {
          model: 'banks', // name of Target model
          key: 'id', // key in Target model that we're referencing
        }
      });
  }
};