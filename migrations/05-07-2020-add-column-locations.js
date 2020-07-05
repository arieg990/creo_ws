'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('locations','subDistrictId', {
      type: Sequelize.INTEGER(11),
      after:"bookingId",
      references: {
          model: 'sub_districts', // name of Target model
          key: 'id', // key in Target model that we're referencing
        }
      });
  }
};