'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('users','picture', {
      type: Sequelize.STRING,
      after:"password"
      });
  }
};