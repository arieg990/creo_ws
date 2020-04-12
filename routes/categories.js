var express = require('express');
var router = express.Router();
var model = require('../models');
var response = require('../config/constant').response;
var auth = require('../config/auth');
const Sequelize = require('sequelize');
const crypto = require('crypto');
const cryptoLocal = require('../config/crypto');
const constant = require('../config/constant.json');
var path = constant.path.categories

/* GET users listing. */
router.get('/list', async function(req, res, next) {

  var page = 0;
  var perPage = 10;
  var offset = parseInt(req.query.page)
  var limit = parseInt(req.query.limit)
  var orderDirection = req.query.orderDirection

  if (offset > 1) {
    page = offset-1
  }

  if (limit > 10) {
    perPage = limit
  }

  if (orderDirection == null) {
    orderDirection = "ASC"
  }

  try{
    var list = await model.Category.findAll({
      offset: page*perPage,
      limit:perPage,
      order: "id "+orderDirection
    });

    var paging = {
      "currentPage": page+1,
      "limitPerPage": perPage,
    }

    res.status(200).json(response(200,"categories",list,paging));
  } catch(err) {
    res.status(200).json(response(400,"categorie",err));
  }

});

router.post('/', auth.isUser, async function(req, res, next) {
  var body = req.body;
  var url = req.protocol + '://' + req.get('host')

  var data = {
    category: body.category,
    color:body.color,
    url:url
  }

  if (body.image != null) {

    var decode = cryptoLocal.decodeBase64Image(body.image)
    var img = crypto.randomBytes(32).toString('hex') +'.'+ decode.type;
    require("fs").writeFile("public/"+path+img, decode.data, function(err) {
      console.log(err)
    });

    data.imageUrl = path + img
  }

  try{
    var list = await model.Category.create(data);

    res.status(200).json(response(200,"category",list));
  } catch(err) {
    res.status(200).json(response(400,"category",err));
  }
  
});

router.put('/:id', auth.isUser, async function(req, res, next) {
  var body = req.body;
  var url = req.protocol + '://' + req.get('host')
  var data = {
    name: body.name,
    color:body.color
  }

  if (body.image != null) {


    var decode = cryptoLocal.decodeBase64Image(body.image)
    var img = crypto.randomBytes(32).toString('hex') +'.'+ decode.type;
    require("fs").writeFile("~/public/"+path+img, decode.data, function(err) {
      console.log(err)
    });

    data.imageUrl = path + img
    data.url = url
  }

  try{

    var update = await model.Category.update(data, {
      where: {
        id:req.params.id
      }
    });

    res.status(200).json(response(200,"category",update));

  } catch(err) {
    res.status(200).json(response(400,"category",err));
  }

});

router.delete('/', auth.isUser, async function(req, res, next) {
  var body = req.body;

  try{

    var update = await model.Category.destroy({
      where: {
        name:body.name
      }
    });

    res.status(200).json(response(200,"category",update));
    
  } catch(err) {
    res.status(200).json(response(400,"category",err));
  }
  
});

router.get('/:id', async function(req, res, next) {

  try{

    var list = await model.Category.findByPk(req.params.id);

    res.status(200).json(response(200,"category",list));

  } catch(err) {
    res.status(200).json(response(400,"category",err));
  }

});

module.exports = router;