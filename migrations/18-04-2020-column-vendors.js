'use strict';
var promise = require('promise')
module.exports = {
	up: (queryInterface, Sequelize) => {
		return Promise.all([ 
			queryInterface.renameColumn('vendors','imageUrl', 'avatarImageUrl'),
			queryInterface.renameColumn('vendors','url', 'avatarUrl'),
			queryInterface.addColumn('vendors','backgroundImageUrl', {
				type: Sequelize.STRING,
			}),
			queryInterface.addColumn('vendors','backgroundUrl', {
				type: Sequelize.STRING,
			}),
			])
	}
};