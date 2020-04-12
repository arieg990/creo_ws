var express = require('express');
var router = express.Router();
var model = require('../models');
var response = require('../config/constant').response;
const crypto = require('crypto');
const cryptoLocal = require('../config/crypto');
var constant = require('../config/constant.json');
var auth = require('../config/auth');
var path = constant.path.galleries

/* GET users listing. */
router.get('/list', async function(req, res, next) {

  var page = 0;
  var perPage = 10;
  var offset = parseInt(req.query.page)
  var limit = parseInt(req.query.perPage)
  var where = {}

  if (offset > 1) {
    page = offset-1
  }

  if (limit > 10) {
    perPage = limit
  }


  if(req.query.categoryId != null) {
    where.categoryId = req.query.categoryId
  }

  try{
    var list = await model.Gallery.findAll({
      offset:page*perPage,
      limit:perPage,
      include: [
      {
        model:model.Vendor,
        required: req.query.categoryId != null ? true :false,
        where: where
      }
      ]
    });

    var paging = {
      "currentPage": page+1,
      "limitPerPage": perPage,
    }

    res.status(200).json(response(200,"galleries",list,paging));
  } catch(err) {
    console.log(err)
    res.status(200).json(response(400,"galleries",err));
  }

});

router.post('/', async function(req, res, next) {
	var body = req.body;
  var url = req.protocol + '://' + req.get('host')
  var data = {
    vendorId: body.vendorId,
    url:url,
    isMain: body.isMain
  }

  if (body.image != null) {

    var decode = cryptoLocal.decodeBase64Image(body.image)
    var img = crypto.randomBytes(32).toString('hex') +'.'+ decode.type;
    require("fs").writeFile("public/"+path+img, decode.data, function(err) {
      console.log(err)
    });

    data.imageUrl = path + img
  }

  try{
    var list = await model.Gallery.create(data);

    res.status(200).json(response(200,"gallery",list));
  } catch(err) {
    res.status(200).json(response(400,"gallery",err));
  }
  
});

router.put('/', async function(req, res, next) {
  var body = req.body;
  var url = req.protocol + '://' + req.get('host')
  var path = constant.path.categories
  var data = {
    vendorId: body.vendorId,
    url:url,
    isMain: body.isMain
  }

  if (body.image != null) {

    var decode = cryptoLocal.decodeBase64Image(body.image)
    var img = crypto.randomBytes(32).toString('hex') +'.'+ decode.type;
    require("fs").writeFile("public/"+path+img, decode.data, function(err) {
      console.log(err)
    });

    data.imageUrl = path + img
  }

  try{

    var update = await model.Gallery.update(data, {
      where: {
        id:body.id
      }
    });

    res.status(200).json(response(200,"gallery",update));

  } catch(err) {
    res.status(200).json(response(400,"gallery",err));
  }

});

router.delete('/', async function(req, res, next) {
  var body = req.body;

  try{

    var update = await model.Gallery.destroy({
      where: {
        id:body.id
      }
    });

    res.status(200).json(response(200,"gallery",update));
    
  } catch(err) {
    res.status(200).json(response(400,"gallery",err));
  }
  
});

router.get('/:id', async function(req, res, next) {

  try{

    var list = await model.Gallery.findByPk(req.params.id);

    res.status(200).json(response(200,"gallery",list));

  } catch(err) {
    res.status(200).json(response(400,"gallery",err));
  }

});

module.exports = router;