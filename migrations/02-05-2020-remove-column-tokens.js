'use strict';
module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.removeColumn('tokens','token')
	}
};