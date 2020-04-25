'use strict';
var promise = require('promise')
module.exports = {
	up: (queryInterface, Sequelize) => {
		return Promise.all([ 
			queryInterface.changeColumn('tokens','token', {
				type:Sequelize.STRING
			}),
			queryInterface.addColumn('tokens','id', id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        }),
			])
	}
};