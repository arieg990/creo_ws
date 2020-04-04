'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('tokens','userId', {
      type: Sequelize.INTEGER(11),
      after:"vendorUserId",
      references: {
          model: 'users', // name of Target model
          key: 'id', // key in Target model that we're referencing
        }
      });
  }
};