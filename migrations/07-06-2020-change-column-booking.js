'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('bookings','total', {
      type: Sequelize.DOUBLE(12,6),
      allowNull: false,
    });
  }
};