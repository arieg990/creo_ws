'use strict';
var promise = require('promise')
module.exports = {
	up: (queryInterface, Sequelize) => {
		return Promise.all([ 
			queryInterface.changeColumn('addresses','lat', {
				type: Sequelize.DOUBLE
			}),
			queryInterface.changeColumn('addresses','lng', {
				type: Sequelize.DOUBLE
			}),
			queryInterface.changeColumn('locations','lat', {
				type: Sequelize.DOUBLE
			}),
			queryInterface.changeColumn('locations','lng', {
				type: Sequelize.DOUBLE
			})
			])
	}
};