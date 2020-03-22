'use strict';
module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.renameColumn('users','provide', "provider");
	}
};