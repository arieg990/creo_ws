var express = require('express');
var router = express.Router();
var model = require('../models');
var response = require('../config/constant').response;
var auth = require('../config/auth');
const Sequelize = require('sequelize');
const crypto = require('crypto');
const cryptoLocal = require('../config/crypto');

/* GET users listing. */
router.get('/list', async function(req, res, next) {

  var page = 0;
  var perPage = 10;
  var offset = parseInt(req.query.page)
  var limit = parseInt(req.query.perPage)

  if (offset > 1) {
    page = offset-1
  }

  if (limit >= 1) {
    perPage = limit
  }

  try{
    var list = await model.Code.findAll({
      offset: page*perPage,
      limit:perPage,
    });

    var paging = {
      "currentPage": page+1,
      "limitPerPage": perPage,
    }

    res.status(200).json(response(200,"codes",list,paging));
  } catch(err) {
    res.status(200).json(response(400,"codes",err));
  }

});

router.post('/', auth.isUser, async function(req, res, next) {
  var body = req.body;

  var data = {
    code: body.code,
    name:body.name
  }

  try{
    var list = await model.Code.create(data);

    res.status(200).json(response(200,"code",list));
  } catch(err) {
    res.status(200).json(response(400,"code",err));
  }
  
});

router.put('/', auth.isUser, async function(req, res, next) {
  var body = req.body;
  var data = {
    name: body.name
  }

  try{

    var update = await model.Code.update(data, {
      where: {
        code:body.code
      }
    });

    if (update[0] == 1) {
      update = await model.Code.findByPk(body.code);
    } else {
      return res.status(200).json(response(400,"city",update));
    }

    res.status(200).json(response(200,"code",update));

  } catch(err) {
    res.status(200).json(response(400,"code",err));
  }

});

router.delete('/', auth.isUser, async function(req, res, next) {
  var body = req.body;

  try{

    var update = await model.Code.destroy({
      where: {
        code:body.code
      }
    });

    res.status(200).json(response(200,"code",update));
    
  } catch(err) {
    res.status(200).json(response(400,"code",err));
  }
  
});

router.get('/:code', async function(req, res, next) {

  try{

    var list = await model.Code.findByPk(req.params.code);

    res.status(200).json(response(200,"code",list));

  } catch(err) {
    res.status(200).json(response(400,"code",err));
  }

});

module.exports = router;