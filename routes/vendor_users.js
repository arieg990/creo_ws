var express = require('express');
var router = express.Router();
var model = require('../models');
var response = require('../config/constant').response;
var auth = require('../config/auth');
const cryptoLocal = require('../config/crypto');
const crypto = require('crypto');
var constant = require('../config/constant.json');
const {uploadFile} = require('../config/uploadFile');
var urlGoogle = constant.url.googleStorage

/* GET users listing. */
router.get('/list', auth.isLoggedIn, async function(req, res, next) {

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

router.post('/', auth.isUserOrVendor, async function(req, res, next) {
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

router.put('/:id', auth.isUserOrVendor, async function(req, res, next) {
  var body = req.body;
  var user = req.user.dataValues
  var id = req.params.id
  var data = {
    name:body.name,
    phone:body.phone,
    gender:body.gender,
    role:body.role
  }

  if (user.userType == "vendor") {
    id = user.id
  }

  try{

    var update = await model.VendorUser.update(data, {
      where: {
        id:id
      }
    });

    if (update[0] == 1) {
      update = await model.VendorUser.findByPk(req.user.dataValues.id);
    } else {
      return res.status(200).json(response(400,"vendorUser",update));
    }

    res.status(200).json(response(200,"vendorUser",update));

  } catch(err) {
    res.status(200).json(response(400,"vendorUser",err));
  }

});

router.put('/profile/:id', auth.isUserOrVendor, async function(req, res, next) {
  var body = req.body;
  var url = req.protocol + '://' + req.get('host')
  var path = constant.path.vendorUsers
  var user = req.user.dataValues
  var id = req.params.id
  var data = {}

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

  if (user.userType == "vendor") {
    id = user.id
  }

  try{

    var update = await model.VendorUser.update(data, {
      where: {
        id:id
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