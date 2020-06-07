'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('bookings','total', {
      type: Sequelize.DOUBLE(13, 4),
      allowNull: false,
    });
  }
};