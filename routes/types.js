var express = require('express');
var router = express.Router();
var model = require('../models');
var response = require('../config/constant').response;
var auth = require('../config/auth');
const Sequelize = require('sequelize');

/* GET users listing. */
router.get('/list', auth.isLoggedIn, async function(req, res, next) {

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
    var list = await model.Type.findAll({
      offset:page*perPage,
      limit: perPage,
      include: [
      {model: models.Category}
      ]
    });

    var count = await model.Type.count()

    var totalPage = Math.ceil(count/perPage)

    var paging = {
      "currentPage": page+1,
      "limitPerPage": perPage,
      "totalPage": totalPage
    }

    res.status(200).json(response(200,"types",list, paging));
  } catch(err) {
    res.status(200).json(response(400,"types",err));
  }

});

router.post('/', async function(req, res, next) {
  var body = req.body;
  var data = {
    type: body.type,
    name: body.name,
    category: body.category,
    color: body.color,
  }

  try{
    var list = await model.Type.create(data);

    res.status(200).json(response(200,"type",list));
  } catch(err) {
      res.status(200).json(response(400,"type",err));
  }
  
});

router.post('/', async function(req, res, next) {
  var body = req.body;
  var data = {
    name: body.name,
    category: body.category,
    color: body.color,
  }

  try{

    var update = await model.Type.update(data, {
      where: {
        type:body.type
      }
    });

    if (update[0] == 1) {
      update = await model.Type.findByPk(body.id);
    } else {
      return res.status(200).json(response(400,"type",update));
    }

    res.status(200).json(response(200,"type",update));

  } catch(err) {
      res.status(200).json(response(400,"type",err));
  }

});

router.delete('/', async function(req, res, next) {
  var body = req.body;

  try{

    var update = await model.Type.destroy({
      where: {
        type:body.type
      }
    });

    res.status(200).json(response(200,"type",update));
    
  } catch(err) {
    res.status(200).json(response(400,"type",err));
  }
  
});

router.get('/:type', async function(req, res, next) {

  try{

    var list = await model.Type.findByPk(req.params.type,{
      include: [
      {model: models.Category}
      ]
    });

    res.status(200).json(response(200,"type",list));

  } catch(err) {
    res.status(200).json(response(400,"type",err));
  }

});

module.exports = router;