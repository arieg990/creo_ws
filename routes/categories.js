var express = require('express');
var router = express.Router();
var model = require('../models');
var response = require('../config/constant').response;
var auth = require('../config/auth');

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
    var list = await model.Category.findAll({
      offset: page*perPage,
      limit:perPage,
      include: [
      {model: model.Type}
      ]
    });

    var paging = {
      "currentPage": page+1,
      "limitPerPage": perPage,
    }

    res.status(200).json(response(200,"categories",list,paging));
  } catch(err) {
    console.log(err)
    res.status(200).json(response(400,"categories",err.errors));
  }

});

router.post('/', async function(req, res, next) {
  var body = req.body;
  var data = {
    name: body.name,
    category: body.category,
  }

  try{
    var list = await model.Category.create(data);

    res.status(200).json(response(200,"category",list));
  } catch(err) {
    res.status(200).json(response(400,"category",err.errors));
  }
  
});

router.put('/:category', async function(req, res, next) {
  var body = req.body;
  var data = {
    name: body.name,
    category: body.category,
  }

  try{

    var update = await model.Category.update(data, {
      where: {
        category:req.params.category
      }
    });

    res.status(200).json(response(200,"category",update));

  } catch(err) {
    console.log("masuk")

    console.log(err)
    res.status(200).json(response(400,"category",err.errors));
  }

});

router.delete('/', async function(req, res, next) {
  var body = req.body;

  try{

    var update = await model.Category.destroy({
      where: {
        category:body.category
      }
    });

    res.status(200).json(response(200,"category",update));
    
  } catch(err) {
    res.status(200).json(response(400,"category",err.errors));
  }
  
});

router.get('/:category', async function(req, res, next) {

  try{

    var list = await model.Category.findByPk(req.params.category,{
      include: [
      {model: model.Type}
      ]
    });

    res.status(200).json(response(200,"category",list));

  } catch(err) {
    res.status(200).json(response(400,"category",err.errors));
  }

});

module.exports = router;