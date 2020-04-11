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

function response(code,type,list, page = null, token = null) {
	var response;
	if (code == 200) {
    response = {
          "data":{
            [type]: list
          },
          "status": status(code,"ok")
      }

    	if (page != null) {
    		response.data = Object.assign({ paging: page }, response.data);
    	}

      if (token != null) {
        response.data = Object.assign({ token: token }, response.data);
      }

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
          "error":list
          "data":{},
          "status": status(code,"unauthorized")
      }
  }

  return response;
}

module.exports = {response};