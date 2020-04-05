'use strict';
var Promise = require('promise')
module.exports = {
	up: (queryInterface, Sequelize) => {
		return Promise.all([
			queryInterface.addColumn('packages','imageUrl', {
				type: Sequelize.STRING,
				after:"capacity"
			}),
			queryInterface.addColumn('packages','url', {
				type: Sequelize.STRING,
				after:"imageUrl"
			})
			])
	}
};