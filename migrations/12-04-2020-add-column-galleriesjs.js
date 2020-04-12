'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('galleries','isMain', {
      type: Sequelize.BOOLEAN,
      after:"url"
      });
  }
};