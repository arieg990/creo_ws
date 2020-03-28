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
    var list = await model.City.findAll({
      offset:page*perPage,
      limit:perPage,
      include: [
      {
        model: model.Province
      },
      {
        model:model.PostalCode
      },
      {
        model:model.SubDistrict
      }
      ]
    });

    var paging = {
      "currentPage": page+1,
      "limitPerPage": perPage,
    }

    res.status(200).json(response(200,"cities",list, paging));
  } catch(err) {
    res.status(200).json(response(400,"cities",err));
  }

});

router.post('/', async function(req, res, next) {
  var body = req.body;
  var data = {
    name: body.name,
    provinceId:body.provinceId
  }

  try{
    var list = await model.City.create(data);

    res.status(200).json(response(200,"city",list));
  } catch(err) {
    res.status(200).json(response(400,"city",err));
  }
  
});

router.put('/:id', async function(req, res, next) {
  var body = req.body;
  var data = {
    name: body.name,
    provinceId:body.provinceId
  }

  try{

    var update = await model.City.update(data, {
      where: {
        id:req.params.id
      }
    });

    res.status(200).json(response(200,"city",update));

  } catch(err) {
    res.status(200).json(response(400,"city",err));
  }

});

router.delete('/', async function(req, res, next) {
  var body = req.body;

  try{

    var update = await model.City.destroy({
      where: {
        id:body.id
      }
    });

    res.status(200).json(response(200,"city",update));
    
  } catch(err) {
    res.status(200).json(response(400,"city",err));
  }
  
});

router.get('/:id', async function(req, res, next) {

  try{

    var list = await model.City.findByPk(req.params.id,{
      include: [
      {
        model: model.Province
      },
      {
        model:model.PostalCode
      },
      {
        model:model.SubDistrict
      }
      ]
    });

    res.status(200).json(response(200,"city",list));

  } catch(err) {
    res.status(200).json(response(400,"city",err));
  }

});

module.exports = router;