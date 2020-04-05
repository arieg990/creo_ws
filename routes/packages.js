var express = require('express');
var router = express.Router();
var model = require('../models');
var response = require('../config/constant').response;
var auth = require('../config/auth');
const crypto = require('crypto');
const cryptoLocal = require('../config/crypto');
const constant = require('../config/constant.json');
var path = constant.path.packages

/* GET users listing. */
router.get('/list', async function(req, res, next) {

  var page = 0;
  var perPage = 10;
  var offset = parseInt(req.query.page)
  var limit = parseInt(req.query.perPage)

  var category = req.query.category

  if (offset > 1) {
    page = offset-1
  }

  if (limit > 10) {
    perPage = limit
  }

  try{
    var list = await model.Package.findAll({
      offset:page*perPage,
      limit:perPage,
      include: [
      {
        model: model.City
      },
      {
        model: model.Province
      },
      {
        model:model.Vendor,
        exclude:["password"],
        include: [
        {model:model.Category}
        ],
        where: {
          category:category
        }
      }
      ]
    });

    var paging = {
      "currentPage": page+1,
      "limitPerPage": perPage,
    }

    res.status(200).json(response(200,"packages",list, paging));
  } catch(err) {
    res.status(200).json(response(400,"packages",err));
  }

});

router.post('/', auth.isVendor, async function(req, res, next) {
  var body = req.body;
  var url = req.protocol + '://' + req.get('host')
  var data = {
    name: body.name,
    price:body.price,
    capacity:body.capacity,
    provinceId:body.provinceId,
    cityId:body.cityId,
    vendorId:req.user.id
  }

  if (body.image != null) {


    var decode = cryptoLocal.decodeBase64Image(body.image)
    var img = crypto.randomBytes(32).toString('hex') +'.'+ decode.type;
    require("fs").writeFile("public/"+path+img, decode.data, function(err) {
      console.log(err)
    });

    data.imageUrl = path + img
    data.url = url
  }

  try{
    var list = await model.Package.create(data);

    res.status(200).json(response(200,"package",list));
  } catch(err) {
    res.status(200).json(response(400,"package",err));
  }
  
});

router.put('/:id', auth.isVendor, async function(req, res, next) {
  var body = req.body;
  var url = req.protocol + '://' + req.get('host')
  var data = {
    name: body.name,
    price:body.price,
    capacity:body.capacity,
    provinceId:body.provinceId,
    cityId:body.cityId,
    vendorId:req.user.id
  }

  if (body.image != null) {


    var decode = cryptoLocal.decodeBase64Image(body.image)
    var img = crypto.randomBytes(32).toString('hex') +'.'+ decode.type;
    require("fs").writeFile("public/"+path+img, decode.data, function(err) {
      console.log(err)
    });

    data.imageUrl = path + img
    data.url = url
  }

  try{

    var update = await model.Package.update(data, {
      where: {
        id:req.params.id
      }
    });

    res.status(200).json(response(200,"package",update));

  } catch(err) {

    res.status(200).json(response(400,"package",err));
  }

});

router.delete('/', auth.isVendor, async function(req, res, next) {
  var body = req.body;

  try{

    var update = await model.Package.destroy({
      where: {
        id:body.id
      }
    });

    res.status(200).json(response(200,"package",update));
    
  } catch(err) {
    res.status(200).json(response(400,"package",err));
  }
  
});

router.get('/:id', async function(req, res, next) {

  try{

    var list = await model.Package.findByPk(req.params.id,{
      include: [
      {
        model: model.City
      },
      {
        model: model.Province
      },
      {
        model:model.Vendor,
        exclude:["password"]
      }
      ]
    });

    res.status(200).json(response(200,"package",list));

  } catch(err) {
    res.status(200).json(response(400,"package",err));
  }

});

module.exports = router;