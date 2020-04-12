'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('galleries','projectId', {
      type: Sequelize.INTEGER(11),
      after:"url",
      references: {
          model: 'projects', // name of Target model
          key: 'id', // key in Target model that we're referencing
        }
      });
  }
};