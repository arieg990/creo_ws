var express = require('express');
var router = express.Router();
var model = require('../models');
var response = require('../config/constant').response;
var auth = require('../config/auth');
const crypto = require('crypto');
const cryptoLocal = require('../config/crypto');
var constant = require('../config/constant.json');
const {uploadFile} = require('../config/uploadFile');
var urlGoogle = constant.url.googleStorage

/* GET users listing. */
router.get('/list', auth.isLoggedIn, async function(req, res, next) {

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
    var list = await model.User.findAll({
      offset:page*perPage,
      limit:perPage,
      attributes: { exclude: ['password'] }
    });

    var count = await model.User.count()

    var totalPage = Math.ceil(count/perPage)

    var paging = {
      "currentPage": page+1,
      "limitPerPage": perPage,
      "totalPage": totalPage
    }

    res.status(200).json(response(200,"users",list,paging));
  } catch(err) {
    res.status(200).json(response(400,"users",err));
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
    var list = await model.User.create(data);

    res.status(200).json(response(200,"user",list));
  } catch(err) {
    res.status(200).json(response(400,"user",err));
  }
  
});

router.put('/', auth.isUser, async function(req, res, next) {
  var body = req.body;
  var data = {
    name:body.name,
    phone:body.phone,
    gender:body.gender,
    role:body.role
  }

  try{

    var update = await model.User.update(data, {
      where: {
        id: req.user.id
      }
    });

    if (update[0] == 1) {
      update = await model.User.findByPk(req.user.id);
    } else {
      return res.status(200).json(response(400,"user",update));
    }

    res.status(200).json(response(200,"user",update));

  } catch(err) {
    res.status(200).json(response(400,"user",err));
  }

});

router.put('/profile', auth.isUser, async function(req, res, next) {
  var body = req.body;
  var url = req.protocol + '://' + req.get('host')
  var path = constant.path.users
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

  try{

    var update = await model.User.update(data, {
      where: {
        id:req.user.id
      }
    });

    if (update[0] == 1) {
      update = await model.User.findByPk(req.user.id);
    } else {
      return res.status(200).json(response(400,"user",update));
    }

    res.status(200).json(response(200,"user",update));

  } catch(err) {
    res.status(200).json(response(400,"user",err));
  }

});

router.delete('/', auth.isUser, async function(req, res, next) {
  var body = req.body;

  try{

    var update = await model.User.destroy({
      where: {
        id:body.id
      }
    });

    res.status(200).json(response(200,"user",update));
    
  } catch(err) {
    res.status(200).json(response(400,"user",err));
  }
  
});

router.get('/:id', auth.isUser, async function(req, res, next) {

  try{

    var list = await model.User.findByPk(req.params.id,{
      attributes: { exclude: ['password'] }
    });

    res.status(200).json(response(200,"user",list));

  } catch(err) {
    res.status(200).json(response(400,"user",err));
  }

});

module.exports = router;