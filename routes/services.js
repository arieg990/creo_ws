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

  if (limit >= 1) {
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

router.put('/', auth.isVendor, async function(req, res, next) {
  var body = req.body;
  var data = {
    title: body.title,
    detail:body.detail,
    packageId:body.packageId,
  }

  try{

    var update = await model.Service.update(data, {
      where: {
        id:body.id
      }
    });

    if (update[0] == 1) {
      update = await model.Service.findByPk(body.id);
    } else {
      return res.status(200).json(response(400,"service",update));
    }

    res.status(200).json(response(200,"service",update));

  } catch(err) {

    res.status(200).json(response(400,"service",err));
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
    res.status(200).json(response(400,"service",err));
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
    res.status(200).json(response(400,"service",err));
  }

});

module.exports = router;