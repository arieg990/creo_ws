'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('customers','url', {
      type: Sequelize.STRING,
      after:"picture"
      });
  }
};