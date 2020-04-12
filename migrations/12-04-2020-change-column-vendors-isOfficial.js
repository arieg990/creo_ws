'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('vendors','isOfficial', {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    });
  }
};