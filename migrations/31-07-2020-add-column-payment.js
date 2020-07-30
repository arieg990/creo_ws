'use strict';
var promise = require('promise')
module.exports = {
	up: (queryInterface, Sequelize) => {
		return Promise.all([ 
			queryInterface.addColumn('payments','url', {
				type: Sequelize.STRING,
				after:"expiredDate"
			}),
			queryInterface.addColumn('payments','imageUrl', {
				type: Sequelize.STRING,
				after:"url"
			})
			])
	}
};