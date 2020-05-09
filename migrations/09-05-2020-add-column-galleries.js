'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('galleries','packageId', {
      type: Sequelize.INTEGER(11),
      after:"vendorId",
      references: {
          model: 'packages', // name of Target model
          key: 'id', // key in Target model that we're referencing
        }
      });
  }
};