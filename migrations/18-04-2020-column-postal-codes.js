'use strict';
module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.addColumn('postal_codes','subDistrictId', {
			type: Sequelize.INTEGER(11),
			references: {
          model: 'sub_districts', // name of Target model
          key: 'id', // key in Target model that we're referencing
      }
  })
	},
	down: (queryInterface, Sequelize) => {
		return queryInterface.removeColumn('postal_codes','cityId')
	}
};