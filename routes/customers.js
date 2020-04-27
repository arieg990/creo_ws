var express = require('express');
var router = express.Router();
const crypto = require('crypto');
const cryptoLocal = require('../config/crypto');
var model = require('../models');
var response = require('../config/constant').response;
var auth = require('../config/auth');
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

  if (limit > 10) {
    perPage = limit
  }

  try{
    var list = await model.Customer.findAll({
      offset:page*perPage,
      limit:perPage,
      attributes: { exclude: ['password'] },
      include:[
      {model:model.Address}
      ]
    });

    var paging = {
      "currentPage": page+1,
      "limitPerPage": perPage,
    }

    res.status(200).json(response(200,"customers",list,paging));
  } catch(err) {
    res.status(200).json(response(400,"customers",err));
  }

});

router.post('/', async function(req, res, next) {
  var body = req.body;
  var data = {
    email: body.email,
    password:body.password,
    name:body.name,
    phone:body.phone,
    gender:body.gender
  }

  try{
    var list = await model.Customer.create(data);

    res.status(200).json(response(200,"customer",list));
  } catch(err) {
    res.status(200).json(response(400,"customer",err));
  }
  
});

router.put('/:id', auth.isLoggedIn, async function(req, res, next) {
  var body = req.body;
  var id = req.params.id
  var data = {
    name:body.name,
    phone:body.phone,
    gender:body.gender
  }

  if (user.userType == "customer") {
    id = user.id
  }

  try{

    var update = await model.Customer.update(data, {
      where: {
        id:id
      }
    });

    res.status(200).json(response(200,"customer",update));

  } catch(err) {
    res.status(200).json(response(400,"customer",err));
  }

});

router.put('/profile/:id', auth.isLoggedIn, async function(req, res, next) {
  var body = req.body;
  var url = req.protocol + '://' + req.get('host')
  var path = constant.path.customers
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

  if (user.userType == "customer") {
    id = user.id
  }

  try{

    var update = await model.Customer.update(data, {
      where: {
        id:id
      }
    });

    res.status(200).json(response(200,"customer",update));

  } catch(err) {
    res.status(200).json(response(400,"customer",err));
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

router.delete('/', auth.isLoggedIn, async function(req, res, next) {
  var body = req.body;

  try{

    var update = await model.Customer.destroy({
      where: {
        id:body.id
      }
    });

    res.status(200).json(response(200,"customer",update));
    
  } catch(err) {
    res.status(200).json(response(400,"customer",err));
  }
  
});

router.get('/:id', auth.isLoggedIn, async function(req, res, next) {

  try{

    var list = await model.Customer.findByPk(req.params.id,{
      attributes: { exclude: ['password'] },
      include:[
      {model:model.Address}
      ]
    });

    res.status(200).json(response(200,"customer",list));

  } catch(err) {
    res.status(200).json(response(400,"customer",err));
  }

});

module.exports = router;