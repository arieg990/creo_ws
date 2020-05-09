'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('packages','detail', {
      type: Sequelize.TEXT,
      after:"name"
      });
  }
};