'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.renameColumn('social_media','code', 'codeId');
  }
};