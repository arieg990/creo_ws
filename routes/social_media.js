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

  if (limit > 10) {
    perPage = limit
  }

  try{
    var list = await model.SocialMedia.findAll({
      offset: page*perPage,
      limit:perPage,
    });

    var paging = {
      "currentPage": page+1,
      "limitPerPage": perPage,
    }

    res.status(200).json(response(200,"socialMedia",list,paging));
  } catch(err) {
    res.status(200).json(response(400,"socialMedia",err));
  }

});

router.post('/', async function(req, res, next) {
  var body = req.body;

  var data = {
    url: body.url,
    name:body.name,
    vendorId:body.vendorId
  }

  try{
    var list = await model.SocialMedia.create(data);

    res.status(200).json(response(200,"socialMedia",list));
  } catch(err) {
    res.status(200).json(response(400,"socialMedia",err));
  }
  
});

router.put('/:id', async function(req, res, next) {
  var body = req.body;
  var data = {
    name: body.name,
    url: body.url,
    vendorId: body.vendorId
  }

  try{

    var update = await model.SocialMedia.update(data, {
      where: {
        id:req.params.id
      }
    });

    res.status(200).json(response(200,"socialMedia",update));

  } catch(err) {
    res.status(200).json(response(400,"socialMedia",err));
  }

});

router.delete('/', async function(req, res, next) {
  var body = req.body;

  try{

    var update = await model.SocialMedia.destroy({
      where: {
        id:body.id
      }
    });

    res.status(200).json(response(200,"socialMedia",update));
    
  } catch(err) {
    res.status(200).json(response(400,"socialMedia",err));
  }
  
});

router.get('/:id', async function(req, res, next) {

  try{

    var list = await model.SocialMedia.findByPk(req.params.id);

    res.status(200).json(response(200,"socialMedia",list));

  } catch(err) {
    res.status(200).json(response(400,"socialMedia",err));
  }

});

module.exports = router;