'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('vendors','isOfficial', {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    });
  }
};