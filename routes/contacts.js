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
    var list = await model.Contact.findAll({
      offset: page*perPage,
      limit:perPage,
    });

    var paging = {
      "currentPage": page+1,
      "limitPerPage": perPage,
    }

    res.status(200).json(response(200,"contacts",list,paging));
  } catch(err) {
    res.status(200).json(response(400,"contacts",err));
  }

});

router.post('/', async function(req, res, next) {
  var body = req.body;

  var data = {
    contact: body.contact,
    name:body.name,
    vendorId:body.vendorId
  }

  try{
    var list = await model.Contact.create(data);

    res.status(200).json(response(200,"contact",list));
  } catch(err) {
    res.status(200).json(response(400,"contact",err));
  }
  
});

router.put('/', async function(req, res, next) {
  var body = req.body;
  var data = {
    name: body.name,
    contact: body.contact,
    vendorId: body.vendorId
  }

  try{

    var update = await model.Contact.update(data, {
      where: {
        id:body.id
      }
    });

    if (update[0] == 1) {
      update = await model.Contact.findByPk(body.id);
    } else {
      return res.status(200).json(response(400,"contact",update));
    }

    res.status(200).json(response(200,"contact",update));

  } catch(err) {
    res.status(200).json(response(400,"contact",err));
  }

});

router.delete('/', async function(req, res, next) {
  var body = req.body;

  try{

    var update = await model.Contact.destroy({
      where: {
        id:body.id
      }
    });

    res.status(200).json(response(200,"contact",update));
    
  } catch(err) {
    res.status(200).json(response(400,"contact",err));
  }
  
});

router.get('/:id', async function(req, res, next) {

  try{

    var list = await model.Contact.findByPk(req.params.id);

    res.status(200).json(response(200,"contact",list));

  } catch(err) {
    res.status(200).json(response(400,"contact",err));
  }

});

module.exports = router;