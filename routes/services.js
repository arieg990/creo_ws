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
    var list = await model.Service.findAll({
      offset:page*perPage,
      limit:perPage,
      include: [
      {
        model: model.Package
      }
      ]
    });

    var paging = {
      "currentPage": page+1,
      "limitPerPage": perPage,
    }

    res.status(200).json(response(200,"services",list, paging));
  } catch(err) {
    res.status(200).json(response(400,"services",err.errors));
  }

});

router.post('/', auth.isVendor, async function(req, res, next) {
  var body = req.body;
  var data = {
    title: body.title,
    detail:body.detail,
    packageId:body.packageId,
  }

  try{
    var list = await model.Service.create(data);

    res.status(200).json(response(200,"service",list));
  } catch(err) {
    res.status(200).json(response(400,"service",err.errors));
  }
  
});

router.put('/:id', auth.isVendor, async function(req, res, next) {
  var body = req.body;
  var data = {
    title: body.title,
    detail:body.detail,
    packageId:body.packageId,
  }

  try{

    var update = await model.Service.update(data, {
      where: {
        id:req.params.id
      }
    });

    res.status(200).json(response(200,"service",update));

  } catch(err) {

    res.status(200).json(response(400,"service",err.errors));
  }

});

router.delete('/', auth.isVendor, async function(req, res, next) {
  var body = req.body;

  try{

    var update = await model.Service.destroy({
      where: {
        id:body.id
      }
    });

    res.status(200).json(response(200,"service",update));
    
  } catch(err) {
    res.status(200).json(response(400,"service",err.errors));
  }
  
});

router.get('/:id', async function(req, res, next) {

  try{

    var list = await model.Service.findByPk(req.params.id,{
      include: [
      {
        model: model.Package
      }
      ]
    });

    res.status(200).json(response(200,"service",list));

  } catch(err) {
    res.status(200).json(response(400,"service",err.errors));
  }

});

module.exports = router;