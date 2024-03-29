var express = require('express');
var router = express.Router();
var model = require('../models');
var response = require('../config/constant').response;
var error = require('../config/constant').error;
var auth = require('../config/auth');
const Sequelize = require('sequelize');
const crypto = require('crypto');
const cryptoLocal = require('../config/crypto');
const {uploadFile} = require('../config/uploadFile');
const constant = require('../config/constant.json');
var path = constant.path.categories
var urlGoogle = constant.url.googleStorage

/* GET users listing. */
router.get('/list', async function(req, res, next) {

  var page = 0;
  var perPage = 10;
  var offset = parseInt(req.query.page)
  var limit = parseInt(req.query.limit)
  var orderDirection = req.query.orderDirection

  if (offset > 1) {
    page = offset-1
  }

  if (limit >= 1) {
    perPage = limit
  }

  if (orderDirection == null) {
    orderDirection = "ASC"
  }

  try{
    var list = await model.Category.findAll({
      offset: page*perPage,
      limit:perPage,
      order: [
      ['id',orderDirection]
      ]
    });

    var count = await model.Category.count()

    var totalPage = Math.ceil(count/perPage)

    var paging = {
      "currentPage": page+1,
      "limitPerPage": perPage,
      "totalPage": totalPage
    }

    res.status(200).json(response(200,"categories",list,paging));
  } catch(err) {
    console.log(err)
    res.status(200).json(response(400,"categories",err));
  }

});

router.post('/', auth.isUser, async function(req, res, next) {
  var body = req.body;
  var url = req.protocol + '://' + req.get('host')

  var data = {
    name: body.name,
    color:body.color
  }

  try{
    if (body.image != null) {

      var decode = cryptoLocal.decodeBase64Image(body.image)
      var img = crypto.randomBytes(32).toString('hex') +'.'+ decode.type;
    // require("fs").writeFile("public/"+path+img, decode.data, function(err) {
    //   console.log(err)
    // });

    // data.imageUrl = path + img

    var upload = await uploadFile(path+img,decode)
    if (upload) {
     data.imageUrl = path + img
     data.url = urlGoogle
   } else {

    res.status(200).json(response(400,"category",error("image")));
  }
}

var list = await model.Category.create(data);

res.status(200).json(response(200,"category",list));
} catch(err) {
  res.status(200).json(response(400,"category",err));
}

});

router.put('/', auth.isUser, async function(req, res, next) {
  var body = req.body;
  var url = req.protocol + '://' + req.get('host')
  var data = {
    name: body.name,
    color:body.color
  }

  if (body.image != null) {

      var decode = cryptoLocal.decodeBase64Image(body.image)
      var img = crypto.randomBytes(32).toString('hex') +'.'+ decode.type;
    // require("fs").writeFile("public/"+path+img, decode.data, function(err) {
    //   console.log(err)
    // });

    // data.imageUrl = path + img

    var upload = await uploadFile(path+img,decode)
    if (upload) {
     data.imageUrl = path + img
     data.url = urlGoogle
   } else {

    res.status(200).json(response(400,"category",error("image")));
  }
}

  try{

    var update = await model.Category.update(data, {
      where: {
        id:body.id
      }
    });

    if (update[0] == 1) {
      update = await model.Category.findByPk(body.id);
    } else {
      return res.status(200).json(response(400,"category",update));
    }

    res.status(200).json(response(200,"category",update));

  } catch(err) {
    res.status(200).json(response(400,"category",err));
  }

});

router.delete('/', auth.isUser, async function(req, res, next) {
  var body = req.body;

  try{

    var update = await model.Category.destroy({
      where: {
        name:body.name
      }
    });

    res.status(200).json(response(200,"category",update));
    
  } catch(err) {
    res.status(200).json(response(400,"category",err));
  }
  
});

router.get('/:id', async function(req, res, next) {

  try{

    var list = await model.Category.findByPk(req.params.id);

    res.status(200).json(response(200,"category",list));

  } catch(err) {
    res.status(200).json(response(400,"category",err));
  }

});

module.exports = router;