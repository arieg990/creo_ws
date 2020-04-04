var express = require('express');
var router = express.Router();
var model = require('../models');
var response = require('../config/constant').response;
var auth = require('../config/auth');
const Sequelize = require('sequelize');

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
    var list = await model.Role.findAll({
      offset:page*perPage,
      limit: perPage,
      include: [
      {model: models.Category}
      ]
    });

    var paging = {
      "currentPage": page+1,
      "limitPerPage": perPage,
    }

    res.status(200).json(response(200,"roles",list, paging));
  } catch(err) {
    res.status(200).json(response(400,"roles",err));
  }

});

router.post('/', async function(req, res, next) {
  var body = req.body;
  var data = {
    role: body.role,
    name: body.name
  }

  try{
    var list = await model.Role.create(data);

    res.status(200).json(response(200,"role",list));
  } catch(err) {
      res.status(200).json(response(400,"role",err));
  }
  
});

router.post('/:role', async function(req, res, next) {
  var body = req.body;
  var data = {
    role: body.role,
    name: body.name
  }

  try{

    var update = await model.Role.update(data, {
      where: {
        type:req.params.type
      }
    });

    res.status(200).json(response(200,"role",update));

  } catch(err) {
      res.status(200).json(response(400,"role",err));
  }

});

router.delete('/', async function(req, res, next) {
  var body = req.body;

  try{

    var update = await model.Role.destroy({
      where: {
        role:body.role
      }
    });

    res.status(200).json(response(200,"role",update));
    
  } catch(err) {
    res.status(200).json(response(400,"role",err));
  }
  
});

router.get('/:role', async function(req, res, next) {

  try{

    var list = await model.Role.findByPk(req.params.role,{
      include: [
      {model: models.Category}
      ]
    });

    res.status(200).json(response(200,"role",list));

  } catch(err) {
    res.status(200).json(response(400,"role",err));
  }

});

module.exports = router;