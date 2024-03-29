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
  var limit = parseInt(req.query.limit)

  if (offset > 1) {
    page = offset-1
  }

  if (limit >= 1) {
    perPage = limit
  }

  try{
    var list = await model.SubDistrict.findAll({
      offset: page*perPage, 
      limit: perPage,
      include: [
      {
        model:model.City,
        include: [
        {
          model: model.Province
        },
        {
          model:model.PostalCode
        }
        ]
      }
      ]
    });

    var count = await model.SubDistrict.count()

    var totalPage = Math.ceil(count/perPage)

    var paging = {
      "currentPage": page+1,
      "limitPerPage": perPage,
      "totalPage": totalPage
    }

    res.status(200).json(response(200,"subDistricts",list,paging));
  } catch(err) {
    console.log(err)
    res.status(200).json(response(400,"subDistricts",err));
  }

});

router.post('/', auth.isUser, async function(req, res, next) {
  var body = req.body;
  var data = {
    name: body.name,
    cityId:body.cityId
  }

  try{
    var list = await model.SubDistrict.create(data);

    res.status(200).json(response(200,"subDistrict",list));
  } catch(err) {
    res.status(200).json(response(400,"subDistrict",err));
  }
  
});

router.put('/', auth.isUser, async function(req, res, next) {
  var body = req.body;
  var data = {
    name: body.name,
    cityId:body.cityId
  }

  try{

    var update = await model.SubDistrict.update(data, {
      where: {
        id:req.body.id
      }
    });

    if (update[0] == 1) {
      update = await model.SubDistrict.findByPk(body.id);
    } else {
      return res.status(200).json(response(400,"subDistrict",update));
    }

    res.status(200).json(response(200,"subDistrict",update));

  } catch(err) {

    res.status(200).json(response(400,"subDistrict",err));
  }

});

router.delete('/', auth.isUser, async function(req, res, next) {
  var body = req.body;

  try{

    var update = await model.SubDistrict.destroy({
      where: {
        id:body.id
      }
    });

    res.status(200).json(response(200,"subDistrict",update));
    
  } catch(err) {
    res.status(200).json(response(400,"subDistrict",err));
  }
  
});

router.get('/:id', async function(req, res, next) {

  try{

    var list = await model.SubDistrict.findByPk(req.params.id,{
      include: [
      {
        model:model.City,
        include: [
        {
          model: model.Province
        },
        {
          model:model.PostalCode
        }
        ]
      }
      ]
    });

    res.status(200).json(response(200,"subDistrict",list));

  } catch(err) {
    res.status(200).json(response(400,"subDistrict",err));
  }

});

module.exports = router;