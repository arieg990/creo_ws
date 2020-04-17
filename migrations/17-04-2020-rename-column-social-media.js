'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('social_media','codeId', {
    	type:Sequelize.STRING,
    	references: {
          model: 'mst_codes', // name of Target model
          key: 'code', // key in Target model that we're referencing
        }
    });
  },
  down: (queryInterface, Sequelize) => {
  	return queryInterface.removeColumn('social_media','code');
  }
};