'use strict';
module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.changeColumn('users','google_id', {
			type:Sequelize.STRING
		});
	}
};