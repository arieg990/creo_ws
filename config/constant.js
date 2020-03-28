'use strict';
const Sequelize = require('sequelize');

function status(code,message) {
  var status = {
    "code":code,
    "message":message,
  }
  return status;
}

function data(data) {
  var data = {
    "data":data
  }

  return data;
}

function response(code,type,list, page = null) {
	var response;
	var array;
	if (code == 200) {
		array = {
      		[type]: list,
      		"status": status(code,"ok")
    	}

    	if (page != null) {
    		array = Object.assign({ paging: page }, array);
    	}

    	response = data(array);
	} else if(code == 400) {
    var message;

    if (list instanceof Sequelize.ForeignKeyConstraintError) {

      message = [{
        "message": "not found",
        "path": list.fields[0],
        "value": list.value
      }]

    } else if (list instanceof Sequelize.UniqueConstraintError || 
      list instanceof Sequelize.ValidationError) {
      message = list.errors
    } else if(list instanceof Sequelize.DatabaseError) {
      var msg = list.parent.sqlMessage
      message = [{
        "message": msg,
        "path": msg.substring(msg.lastIndexOf("'"),msg.indexOf("'")+1),
        "value": ""
      }]
    } else {
      message = list
    }

		response = {
      		"error":message,
      		"status": status(code,"error")
    	}

	} else if(code == 401) {
    response = {
          "data":{},
          "status": status(code,"unauthorized")
      }
  }

  return response;
}

module.exports = {response};