'use strict';
module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.addColumn('locations','villageId', {
			type: Sequelize.INTEGER(11),
			references: {
          model: 'villages', // name of Target model
          key: 'id', // key in Target model that we're referencing
      }
  })
	},
	down: (queryInterface, Sequelize) => {
		return queryInterface.removeColumn('locations','subDistrictId')
	}
};