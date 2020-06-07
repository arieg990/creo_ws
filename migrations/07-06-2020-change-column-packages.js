'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('packages','price', {
      type: Sequelize.DOUBLE(13, 4),
      allowNull: false,
    });
  }
};