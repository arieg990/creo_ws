var express = require('express');
var router = express.Router();
var model = require('../models');
var response = require('../config/constant').response;
var auth = require('../config/auth');
const crypto = require('crypto');
const cryptoLocal = require('../config/crypto');
const constant = require('../config/constant.json');
const Sequelize = require("sequelize")
var path = constant.path.vendors

function includeTable(table) {
  var include = []
  if (table.length > 0) {
    for (var i = 0; i < table.length; i++) {
      if (table[i] == "address") {
        var Address = {
          attributes:{
            include: [
            [Sequelize.literal('`addresses->city`.`name`'),'cityName'],
            [Sequelize.literal('`addresses->province`.`name`'),'provinceName'],
            [Sequelize.literal('`addresses->postalCode`.`postalCode`'),'postalCodeArea'],
            [Sequelize.literal('`addresses->subDistrict`.`name`'),'SubDistrictName']
            ]
          },
          model:model.Address, 
          include: [
          {
            model: model.City,
            as:"city",
            attributes: []
          },
          {
            model: model.Province,
            as:"province",
            attributes: []
          },
          {
            model:model.PostalCode,
            as:"postalCode",
            attributes: []
          },
          {
            model:model.SubDistrict,
            as:"subDistrict",
            attributes: []
          }
          ],
          as:"addresses",
          where:{isMain:true},
          required: false
        }
        include.push(Address)
      } else if (table[i] == "socialMedia") {
        var SocialMedia = {model:model.SocialMedia, as:"socialMedia"}
        include.push(SocialMedia)
      } else if (table[i] == "contact") {
        var Contact = {model:model.Contact, as:"contacts"}
        include.push(Contact)
      } else if (table[i] == "gallery") {
        var Gallery = {model:model.Gallery,as:"galleries", where:{isMain:true}}
        include.push(Gallery)
      } else if (table[i] == "package") {
        var Package = {model:model.Package, as:"packages", where:{isMain:true}}
        include.push(Package)
      }
    }
  }

  return include;
}

/* GET users listing. */
router.get('/list', auth.isLoggedIn, async function(req, res, next) {

  var page = 0;
  var perPage = 10;
  var offset = parseInt(req.query.page)
  var limit = parseInt(req.query.perPage)
  var where = {}
  var include = []

  if (offset > 1) {
    page = offset-1
  }

  if (limit > 10) {
    perPage = limit
  }

  if(req.query.categoryId != null) {
    where.categoryId = req.query.categoryId
  }


  if (req.query.include != null) {
    var table = req.query.include.split(",")
    include = includeTable(table)
  }

  try{
    var list = await model.Vendor.findAll({
      offset:page*perPage,
      limit:perPage,
      include:include,
      subQuery:false,
      where: where
    });

    var paging = {
      "currentPage": page+1,
      "limitPerPage": perPage,
    }

    for (var i = list.length - 1; i >= 0; i--) {

      var review = await model.Review.findOne({
        attributes: [
        [Sequelize.fn("COUNT", Sequelize.col('id')), "reviewCount"],
        [Sequelize.fn("AVG", Sequelize.fn('COALESCE',(Sequelize.col("rating")),0.0)), "reviewRating"]
        ],
        where :{
          vendorId: list[i].dataValues.id
        }
      })

      list[i].dataValues.reviewRating = review.dataValues.reviewRating != null ? review.dataValues.reviewRating : 0
      list[i].dataValues.reviewCount = review.dataValues.reviewCount != null ? review.dataValues.reviewCount : 0
    }

    res.status(200).json(response(200,"vendors",list,paging));
  } catch(err) {
    console.log(err)
    res.status(200).json(response(400,"vendors",err));
  }

});

router.post('/', async function(req, res, next) {
  var body = req.body;
  var url = req.protocol + '://' + req.get('host')
  var data = {
    name:body.name,
    categoryId: body.categoryId,
    description: body.description,
    isOfficial: body.isOfficial
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
    description: body.description,
    isOfficial: body.isOfficial
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
      {model:model.Contact},
      {model:model.Gallery},
      {model:model.Package}
      ]
    });

    res.status(200).json(response(200,"vendor",list));

  } catch(err) {
    res.status(200).json(response(400,"vendor",err));
  }

});

module.exports = router;