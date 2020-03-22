'use strict';
module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.changeColumn('users','provider', {
			type:Sequelize.STRING("20")
		});
	}
};