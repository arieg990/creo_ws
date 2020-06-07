'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('packages','price', {
      type: Sequelize.DOUBLE(12,6),
      allowNull: false,
    });
  }
};