'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('types','color', {
      type: Sequelize.STRING,
      after:"name"
      });
  }
};