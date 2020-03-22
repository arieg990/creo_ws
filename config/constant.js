'use strict';

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
		response = {
      		"error":list,
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