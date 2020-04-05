'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('categories','url', {
      type: Sequelize.STRING,
      after:"picture"
      });
  }
};