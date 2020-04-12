'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('galleries','isMain', {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    });
  }
};