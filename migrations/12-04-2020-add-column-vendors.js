'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('vendors','isOfficial', {
      type: Sequelize.BOOLEAN,
      after:"rating"
      });
  }
};