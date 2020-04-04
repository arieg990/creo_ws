var express = require('express');
var router = express.Router();
var model = require('../models');
var response = require('../config/constant').response;
var auth = require('../config/auth');

/* GET users listing. */
router.get('/list', auth.isLoggedIn, async function(req, res, next) {

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
    var list = await model.VendorUser.findAll({
      offset:page*perPage,
      limit:perPage,
      attributes: { exclude: ['password'] }
    });

    var paging = {
      "currentPage": page+1,
      "limitPerPage": perPage,
    }

    res.status(200).json(response(200,"vendorUsers",list,paging));
  } catch(err) {
    res.status(200).json(response(400,"vendorUsers",err));
  }

});

router.post('/', async function(req, res, next) {
	var body = req.body;
	var data = {
		email: body.email,
		password:body.password,
		name:body.name,
		phone:body.phone,
		gender:body.gender,
    role:body.role
	}

  try{
    var list = await model.VendorUser.create(data);

    res.status(200).json(response(200,"vendorUser",list));
  } catch(err) {
    res.status(200).json(response(400,"vendorUser",err));
  }
  
});

router.put('/', auth.isLoggedIn, async function(req, res, next) {
  var body = req.body;
  var data = {
    name:body.name,
    phone:body.phone,
    gender:body.gender,
    role:body.role
  }

  try{

    var update = await model.VendorUser.update(data, {
      where: {
        id:body.id
      }
    });

    res.status(200).json(response(200,"vendorUser",update));

  } catch(err) {
    res.status(200).json(response(400,"vendorUser",err));
  }

});

router.put('/profile', auth.isLoggedIn, async function(req, res, next) {
  var body = req.body;
  var url = req.protocol + '://' + req.get('host')
  var path = constant.path.vendorUsers

  var decode = cryptoLocal.decodeBase64Image(body.image)
  var img = crypto.randomBytes(32).toString('hex')+'.'+decode.type;
  require("fs").writeFile("public/"+path+img, decode.data, function(err) {
  });

  var data = {
    imageUrl: path + img,
    url:url
  }

  try{

    var update = await model.VendorUser.update(data, {
      where: {
        id:req.user.id
      }
    });

    res.status(200).json(response(200,"vendorUser",update));

  } catch(err) {
    res.status(200).json(response(400,"vendorUser",err));
  }

});

router.delete('/', auth.isLoggedIn, async function(req, res, next) {
  var body = req.body;

  try{

    var update = await model.VendorUser.destroy({
      where: {
        id:body.id
      }
    });

    res.status(200).json(response(200,"vendorUser",update));
    
  } catch(err) {
    res.status(200).json(response(400,"vendorUser",err));
  }
  
});

router.get('/:id', auth.isLoggedIn, async function(req, res, next) {

  try{

    var list = await model.VendorUser.findByPk(req.params.id,{
      attributes: { exclude: ['password'] }
    });

    res.status(200).json(response(200,"vendorUser",list));

  } catch(err) {
    res.status(200).json(response(400,"vendorUser",err));
  }

});

module.exports = router;