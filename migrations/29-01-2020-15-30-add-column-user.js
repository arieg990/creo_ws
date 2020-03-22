'use strict';
module.exports = {
	up: (queryInterface, Sequelize) => {
		return Promise.all([
			queryInterface.addColumn('users','google_id', {
				type: Sequelize.INTEGER,
				after:"id"
			}),
			queryInterface.addColumn('users','provide', {
				type: Sequelize.INTEGER,
				after:"email"
			})
			]);
	}
};