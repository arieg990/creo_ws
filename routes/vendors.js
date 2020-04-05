var express = require('express');
var router = express.Router();
var model = require('../models');
var response = require('../config/constant').response;
var auth = require('../config/auth');
const crypto = require('crypto');
const cryptoLocal = require('../config/crypto');
const constant = require('../config/constant.json');
var path = constant.path.vendors

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
    var list = await model.Vendor.findAll({
      offset:page*perPage,
      limit:perPage,
      attributes: { exclude: ['password'] },
      include:[
      {model:model.Address},
      {model:model.SocialMedia},
      {model:model.Contact}
      ]
    });

    var paging = {
      "currentPage": page+1,
      "limitPerPage": perPage,
    }

    res.status(200).json(response(200,"vendors",list,paging));
  } catch(err) {
    res.status(200).json(response(400,"vendors",err));
  }

});

router.post('/', async function(req, res, next) {
  var body = req.body;
  var url = req.protocol + '://' + req.get('host')
  var data = {
    name:body.name,
    categoryId: body.categoryId,
    description: body.description
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
    var list = await model.Vendor.create(data);

    res.status(200).json(response(200,"vendor",list));
  } catch(err) {
    res.status(200).json(response(400,"vendor",err));
  }
  
});

router.put('/', async function(req, res, next) {
  var body = req.body;
  var url = req.protocol + '://' + req.get('host')
  var data = {
    name:body.name,
    categoryId: body.categoryId,
    description: body.description
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

    var update = await model.Vendor.update(data, {
      where: {
        id:body.id
      }
    });

    res.status(200).json(response(200,"vendor",update));

  } catch(err) {
    res.status(200).json(response(400,"vendor",err));
  }

});

// router.put('/changePassword', async function(req, res, next) {
//   var body = req.body;
//   var data = {
//     name:body.name,
//     phoneNumber:body.phoneNumber,
//     gender:body.gender
//   }

//   model.Customer.findOne({
//         where: { email: username }
//     }).then((user) => {
//       if (!user) {
//         return done(null, false,  {
//           "message": "Incorrect email.",
//             "path": "email",
//             "value": username
//         });
//       }
//       if (!user.validPassword(body.oldPassword)) {
//         var response = { 
//             "message": "Incorrect password.",
//             "path": "oldPassword",
//             "value": body.oldPassword 
//           }
//       res.status(200).json(response(400,"customer",response));
//         return done(null, false, );
//       }

//       delete user.dataValues.password
//       res.status(200).json(response(200,"customer",update));

//     });

//   try{

//   } catch(err) {
//     res.status(200).json(response(400,"customer",err.errors));
//   }

// });

router.delete('/', async function(req, res, next) {
  var body = req.body;

  try{

    var update = await model.Vendor.destroy({
      where: {
        id:body.id
      }
    });

    res.status(200).json(response(200,"vendor",update));
    
  } catch(err) {
    res.status(200).json(response(400,"vendor",err));
  }
  
});

router.get('/:id', async function(req, res, next) {

  try{

    var list = await model.Vendor.findByPk(req.params.id,{
      attributes: { exclude: ['password'] },
      include:[
      {model:model.Address},
      {model:model.SocialMedia},
      {model:model.Contact}
      ]
    });

    res.status(200).json(response(200,"vendor",list));

  } catch(err) {
    res.status(200).json(response(400,"vendor",err));
  }

});

module.exports = router;