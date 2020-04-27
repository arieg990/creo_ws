var express = require('express');
var router = express.Router();
var model = require('../models');
var response = require('../config/constant').response;
const crypto = require('crypto');
const cryptoLocal = require('../config/crypto');
var constant = require('../config/constant.json');
var auth = require('../config/auth');
var path = constant.path.banners
const {uploadFile} = require('../config/uploadFile');
var urlGoogle = constant.url.googleStorage

/* GET users listing. */
router.get('/list', auth.isUser, async function(req, res, next) {

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
    var list = await model.Banner.findAll({
      offset:page*perPage,
      limit:perPage,
      attributes: { exclude: ['password'] }
    });

    var paging = {
      "currentPage": page+1,
      "limitPerPage": perPage,
    }

    res.status(200).json(response(200,"banners",list,paging));
  } catch(err) {
    res.status(200).json(response(400,"banners",err));
  }

});

router.post('/', auth.isUser, async function(req, res, next) {
	var body = req.body;
  var url = req.protocol + '://' + req.get('host')
	var data = {
		title: body.title,
		description:body.description,
		publishDate:body.publishDate,
		publishEndDate:body.publishEndDate,
		startDate:body.startDate,
    endDate:body.endDate
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
    var list = await model.Banner.create(data);

    res.status(200).json(response(200,"banner",list));
  } catch(err) {
    res.status(200).json(response(400,"banner",err));
  }
  
});

router.put('/', auth.isUser, async function(req, res, next) {
  var body = req.body;
  var url = req.protocol + '://' + req.get('host')
  var path = constant.path.categories
  var data = {
    title: body.title,
    description:body.description,
    publishDate:body.publishDate,
    publishEndDate:body.publishEndDate,
    startDate:body.startDate,
    endDate:body.endDate
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
     data.url = urlGoogle
     data.imageUrl = path + img
   } else {

    res.status(200).json(response(400,"category",error("image")));
  }
}

  try{

    var update = await model.Banner.update(data, {
      where: {
        id:body.id
      }
    });

    res.status(200).json(response(200,"banner",update));

  } catch(err) {
    res.status(200).json(response(400,"banner",err));
  }

});

router.delete('/', auth.isUser, async function(req, res, next) {
  var body = req.body;

  try{

    var update = await model.Banner.destroy({
      where: {
        id:body.id
      }
    });

    res.status(200).json(response(200,"banner",update));
    
  } catch(err) {
    res.status(200).json(response(400,"banner",err));
  }
  
});

router.get('/:id', auth.isUser, async function(req, res, next) {

  try{

    var list = await model.Banner.findByPk(req.params.id,{
      attributes: { exclude: ['password'] }
    });

    res.status(200).json(response(200,"banner",list));

  } catch(err) {
    res.status(200).json(response(400,"banner",err));
  }

});

module.exports = router;