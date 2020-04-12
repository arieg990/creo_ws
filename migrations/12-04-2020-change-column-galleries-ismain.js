'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('galleries','isMain', {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    });
  }
};