'use strict';
module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.changeColumn('customers','dob',  {
			type: Sequelize.DATEONLY,
			allowNull:true
		});
	}
};