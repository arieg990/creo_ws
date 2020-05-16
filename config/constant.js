'use strict';
const Sequelize = require('sequelize');
const moment = require('moment');

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

function error(err) {
  var error = []
  if (err === "image") {
    error.push({
      "message":"Failed upload image to google",
      "path":"image",
      "value":""
    })
  }

  return error
}

function response(code,type,list, page = null, token = null) {
	var response;

  if (Array.isArray(list)) {
    // if (list.length < 1) {
    //   code = 404
    // } 
    // else {
    //   if (Integer.isInteger(list[0])) {
    //     if (list[0] == 1) {

    //     }
    //   }
    // }
  }

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
      "error":list,
      "status": status(code,"unauthorized")
    }
  } else if (code == 404) {
    response = {
      "error":list,
      "status": status(code,"data empty")
    }
  }

  return response;
}

function invoiceGenerator(number) {
  var now = moment().format("YYYYMMDD")

  return "CROINV/"+now+"/"+number
}

module.exports = {response,error, invoiceGenerator};