'use strict';
module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.changeColumn('customers','gender', {
    type:Sequelize.STRING,
    unique:false
  });
	}
};