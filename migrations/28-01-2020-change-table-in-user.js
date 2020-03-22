'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('users','hashedPassword', {
      type: Sequelize.STRING
      }).then(() => {
        queryInterface.renameColumn('users','hashedPassword', 'password')
      });
  }
};