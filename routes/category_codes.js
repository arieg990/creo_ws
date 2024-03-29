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
  var limit = parseInt(req.query.limit)

  if (offset > 1) {
    page = offset-1
  }

  if (limit >= 1) {
    perPage = limit
  }

  try{
    var list = await model.CategoryCode.findAll({
      offset: page*perPage,
      limit:perPage,
    });

    var count = await model.CategoryCode.count()

    var totalPage = Math.ceil(count/perPage)

    var paging = {
      "currentPage": page+1,
      "limitPerPage": perPage,
      "totalPage": totalPage
    }

    res.status(200).json(response(200,"categoryCodes",list,paging));
  } catch(err) {
    res.status(200).json(response(400,"categoryCodes",err));
  }

});

router.post('/', auth.isUser, async function(req, res, next) {
  var body = req.body;

  var data = {
    categoryCode: body.categoryCode,
    name:body.name
  }

  try{
    var list = await model.CategoryCode.create(data);

    res.status(200).json(response(200,"categoryCode",list));
  } catch(err) {
    res.status(200).json(response(400,"categoryCode",err));
  }
  
});

router.put('/', auth.isUser, async function(req, res, next) {
  var body = req.body;
  var data = {
    name: body.name
  }

  try{

    var update = await model.CategoryCode.update(data, {
      where: {
        categoryCode:body.categoryCode
      }
    });

    if (update[0] == 1) {
      update = await model.CategoryCode.findByPk(body.categoryCode);
    } else {
      return res.status(200).json(response(400,"categoryCode",update));
    }

    res.status(200).json(response(200,"categoryCode",update));

  } catch(err) {
    console.log(err)
    res.status(200).json(response(400,"categoryCode",err));
  }

});

router.delete('/', auth.isUser, async function(req, res, next) {
  var body = req.body;

  try{

    var update = await model.CategoryCode.destroy({
      where: {
        categoryCode:body.categoryCode
      }
    });

    res.status(200).json(response(200,"categoryCode",update));
    
  } catch(err) {
    res.status(200).json(response(400,"categoryCode",err));
  }
  
});

router.get('/:categoryCode', async function(req, res, next) {

  try{

    var list = await model.CategoryCode.findByPk(req.params.categoryCode);

    res.status(200).json(response(200,"categoryCode",list));

  } catch(err) {
    res.status(200).json(response(400,"categoryCode",err));
  }

});

module.exports = router;