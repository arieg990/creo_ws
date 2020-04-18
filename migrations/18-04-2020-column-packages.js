'use strict';
var promise = require('promise')
module.exports = {
	up: (queryInterface, Sequelize) => {
		return Promise.all([ 
			queryInterface.addColumn('packages','imageUrl2', {
				type: Sequelize.STRING,
				after:"url"
			}),
			queryInterface.addColumn('packages','url2', {
				type: Sequelize.STRING,
				after:"imageUrl2"
			}),
			queryInterface.addColumn('packages','imageUrl3', {
				type: Sequelize.STRING,
				after:"url2"
			}),
			queryInterface.addColumn('packages','url3', {
				type: Sequelize.STRING,
				after:"imageUrl3"
			}),
			queryInterface.addColumn('packages','imageUrl4', {
				type: Sequelize.STRING,
				after:"url3"
			}),
			queryInterface.addColumn('packages','url4', {
				type: Sequelize.STRING,
				after:"imageUrl3"
			}),
			queryInterface.addColumn('packages','isMain', {
				type: Sequelize.BOOLEAN,
				after:"url4"
			}),
			queryInterface.renameColumn('packages','imageUrl', 'imageUrl1'),
			queryInterface.renameColumn('packages','url', 'url1')
			])
	}
};