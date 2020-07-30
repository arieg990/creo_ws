'use strict';
module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.changeColumn('customers','pod', {
			type: Sequelize.STRING(20),
			allowNull:true
		});
	}
};