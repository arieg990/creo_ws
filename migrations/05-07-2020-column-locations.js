'use strict';
module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.addColumn('locations','villageId', {
			type: Sequelize.UUID,
			references: {
          model: 'villages', // name of Target model
          key: 'id', // key in Target model that we're referencing
      }
  })
	}
};