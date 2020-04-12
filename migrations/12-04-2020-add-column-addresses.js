'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('addresses','isMain', {
      type: Sequelize.BOOLEAN,
      after:"lng"
      });
  }
};