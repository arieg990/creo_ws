var express = require('express');
var router = express.Router();
var model = require('../models');
var response = require('../config/constant').response;
var auth = require('../config/auth');
var constant = require('../config/constant.json');
var path = constant.path.stories

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
    var list = await model.Story.findAll({
      offset:page*perPage,
      limit:perPage,
      attributes: { exclude: ['password'] }
    });

    var paging = {
      "currentPage": page+1,
      "limitPerPage": perPage,
    }

    res.status(200).json(response(200,"stories",list,paging));
  } catch(err) {
    res.status(200).json(response(400,"stories",err));
  }

});

router.post('/', async function(req, res, next) {
	var body = req.body;
  var url = req.protocol + '://' + req.get('host')
	var data = {
		title: body.title,
		description:body.description,
		publishDate:body.publishDate,
		publishEndDate:body.publishEndDate,
    url:url
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
    var list = await model.Story.create(data);

    res.status(200).json(response(200,"story",list));
  } catch(err) {
    res.status(200).json(response(400,"story",err));
  }
  
});

router.put('/', async function(req, res, next) {
  var body = req.body;
  var url = req.protocol + '://' + req.get('host')
  var path = constant.path.categories
  var data = {
    title: body.title,
    description:body.description,
    publishDate:body.publishDate,
    publishEndDate:body.publishEndDate,
    url:url
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

    var update = await model.Story.update(data, {
      where: {
        id:body.id
      }
    });

    res.status(200).json(response(200,"story",update));

  } catch(err) {
    res.status(200).json(response(400,"story",err));
  }

});

router.delete('/', async function(req, res, next) {
  var body = req.body;

  try{

    var update = await model.Story.destroy({
      where: {
        id:body.id
      }
    });

    res.status(200).json(response(200,"story",update));
    
  } catch(err) {
    res.status(200).json(response(400,"story",err));
  }
  
});

router.get('/:id', async function(req, res, next) {

  try{

    var list = await model.Story.findByPk(req.params.id,{
      attributes: { exclude: ['password'] }
    });

    res.status(200).json(response(200,"story",list));

  } catch(err) {
    res.status(200).json(response(400,"story",err));
  }

});

module.exports = router;