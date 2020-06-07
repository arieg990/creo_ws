'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('payments','total', {
      type: Sequelize.DOUBLE(12,6),
      allowNull: false,
    });
  }
};