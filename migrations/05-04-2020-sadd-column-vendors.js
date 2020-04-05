'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('vendors','url', {
      type: Sequelize.STRING,
      after:"imageUrl"
      });
  }
};