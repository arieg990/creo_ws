'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('payments','total', {
      type: Sequelize.DOUBLE(13, 4),
      allowNull: false,
    });
  }
};