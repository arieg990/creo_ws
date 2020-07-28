'use strict';
module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.changeColumn('customers','gender',  {
    type: Sequelize.ENUM,
    values: ['male','female'],
    allowNull: true
  });
	}
};