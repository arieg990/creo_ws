'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('vendor_users','roleId', {
    	type:Sequelize.STRING,
    	references: {
          model: 'roles', // name of Target model
          key: 'role', // key in Target model that we're referencing
        }
    });
  },
  down: (queryInterface, Sequelize) => {
  	return queryInterface.removeColumn('vendor_users','role');
  }
};