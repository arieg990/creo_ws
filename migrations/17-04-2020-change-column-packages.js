'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('packages','price', {
      type: Sequelize.INTEGER,
      defaultValue: false
    });
  }
};