var express = require('express');
var router = express.Router();
var model = require('../models');
var constant = require('../config/constant');
var auth = require('../config/auth');
var response; 

/* GET users listing. */
router.get('/getList', async function(req, res, next) {
  var list = await model.roles.findAll();

  response = {
      "roles": list,
      "status": constant.status(200,"ok");
    }

  res.status(200).json(constant.data(response));

});

router.put('/addRole', async function(req, res, next) {
  var body = req.body;
  var data = {
    name: body.name,
    type: body.type
  }

  var list = await model.roles.create(data);

  if (list != null) {
    res.status(201).json(response(201,"data_created",list));
  } else {
    res.status(400).json(response(400,"bad_request",null));
  }
  
});

router.post('/editRole', async function(req, res, next) {
  var body = req.body;
  var data = {
    name:body.name,
  }

  var update = await model.roles.update(data, {
    where: {
      type:body.type
    }
  });

  if (update != null) {
    res.status(200).json(response(200,"data_updated",list));
  } else {
    res.status(400).json(response(400,"bad_request",null));
  }
  
});

router.delete('/deleteRole', async function(req, res, next) {
  var body = req.body;

  var update = await model.roles.destroy({
    where: {
      type:body.type
    }
  });

  if (update != null) {
    res.status(200).json(response(200,"data_deleted",list));
  } else {
    res.status(400).json(response(400,"bad_request",null));
  }
  
});

router.get('/:type', async function(req, res, next) {

  var list = await model.roles.findByPk(req.params.type);

  if (list != null) {
    res.status(200).json(response(200,"data_found",list));
  } else {
    res.status(404).json(response(404,"data_not_found",null));
  }
  
});

module.exports = router;
