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
    var list = await model.PostalCode.findAll({
      offset:page*perPage,
      limit:perPage,
      include: [
      {
        model:models.City,
        include: [
        {
          model: model.Province
        },
        {
          model:model.SubDistrict
        }
        ]
      }
      ]
    });

    var paging = {
      "currentPage": page+1,
      "limitPerPage": perPage,
    }

    res.status(200).json(response(200,"postalCodes",list, paging));
  } catch(err) {
    res.status(200).json(response(400,"postalCodes",err));
  }

});

router.post('/', auth.isUser, async function(req, res, next) {
  var body = req.body;
  var data = {
    postalCode: body.postalCode,
    subDistrictId:body.subDistrictId
  }

  try{
    var list = await model.PostalCode.create(data);

    res.status(200).json(response(200,"postalCode",list));
  } catch(err) {
    res.status(200).json(response(400,"postalCode",err));
  }
  
});

router.put('/', auth.isUser, async function(req, res, next) {
  var body = req.body;
  var data = {
    postalCode: body.postalCode,
    subDistrictId:body.subDistrictId
  }

  try{

    var update = await model.PostalCode.update(data, {
      where: {
        id:body.id
      }
    });

    if (update[0] == 1) {
      update = await model.PostalCode.findByPk(body.id);
    } else {
      return res.status(200).json(response(400,"postalCode",update));
    }

    res.status(200).json(response(200,"postalCode",update));

  } catch(err) {

    res.status(200).json(response(400,"postalCode",err));
  }

});

router.delete('/', auth.isUser, async function(req, res, next) {
  var body = req.body;

  try{

    var update = await model.PostalCode.destroy({
      where: {
        id:body.id
      }
    });

    res.status(200).json(response(200,"postalCode",update));
    
  } catch(err) {
    res.status(200).json(response(400,"postalCode",err));
  }
  
});

router.get('/:id', async function(req, res, next) {

  try{

    var list = await model.PostalCode.findByPk(req.params.id,{
      include: [
      {
        model:model.City,
        include: [
        {
          model: model.Province
        },
        {
          model:model.SubDistrict
        }
        ]
      }
      ]
    });

    res.status(200).json(response(200,"postalCode",list));

  } catch(err) {
    res.status(200).json(response(400,"postalCode",err));
  }

});

module.exports = router;