'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.renameColumn('mst_codes','categoryCode', 'categoryCodeId');
  }
};