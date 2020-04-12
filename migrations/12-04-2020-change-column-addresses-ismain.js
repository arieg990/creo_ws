'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('addresses','isMain', {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    });
  }
};