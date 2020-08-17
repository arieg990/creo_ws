var express = require('express');
var router = express.Router();
var model = require('../models');
var response = require('../config/constant').response;
var auth = require('../config/auth');
const crypto = require('crypto');
const cryptoLocal = require('../config/crypto');
const constant = require('../config/constant.json');
const Sequelize = require("sequelize")
var path = constant.path.packages
const {uploadFile} = require('../config/uploadFile');
var urlGoogle = constant.url.googleStorage

/* GET users listing. */
router.get('/list', async function(req, res, next) {

  var page = 0;
  var perPage = 10;
  var offset = parseInt(req.query.page)
  var limit = parseInt(req.query.limit)
  var where = {}
  var whereCount = {}

  if (offset > 1) {
    page = offset-1
  }

  if (limit >= 1) {
    perPage = limit
  }

  if(req.query.vendorId != null) {
    where.vendorId = req.query.vendorId
    whereCount.vendorId = req.query.vendorId
  }

  try{
    var list = await model.Package.findAll({
      offset:page*perPage,
      limit:perPage,
      where: where,
      subQuery:false,
      attributes:{
            include: [
            [Sequelize.literal('`city`.`name`'),'cityName'],
            [Sequelize.literal('`province`.`name`'),'provinceName']
            ]
          },
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
      }
      ]
    });

    var count = await model.Package.count({
      where:whereCount
    })

    var totalPage = Math.ceil(count/perPage)

    var paging = {
      "currentPage": page+1,
      "limitPerPage": perPage,
      "totalPage": totalPage
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

    res.status(200).json(response(200,"packages",list, paging));
  } catch(err) {
    console.log(err)
    res.status(200).json(response(400,"packages",err));
  }

});

router.post('/', auth.isUserOrVendor, async function(req, res, next) {
  var body = req.body;
  var url = req.protocol + '://' + req.get('host')
  var user = req.user
  var data = {
    name: body.name,
    price:body.price,
    capacity:body.capacity,
    provinceId:body.provinceId,
    isMain: body.isMain,
    cityId:body.cityId
  }

  if (user.userType == "user") {
    data.vendorId = body.vendorId
  } else {
    data.vendorId = user.vendorId
  }

  if (body.image1 != null) {

    var decode = cryptoLocal.decodeBase64Image(body.image1)
    var img = crypto.randomBytes(32).toString('hex') +'.'+ decode.type;
    // require("fs").writeFile("public/"+path+img, decode.data, function(err) {
    //   console.log(err)
    // });

    // data.imageUrl = path + img

    var upload = await uploadFile(path+img,decode)
    if (upload) {
     data.url1 = urlGoogle
     data.imageUrl1 = path + img
   } else {

    res.status(200).json(response(400,"category",error("image")));
  }
}

if (body.image2 != null) {

  var decode = cryptoLocal.decodeBase64Image(body.image2)
  var img = crypto.randomBytes(32).toString('hex') +'.'+ decode.type;
    // require("fs").writeFile("public/"+path+img, decode.data, function(err) {
    //   console.log(err)
    // });

    // data.imageUrl = path + img

    var upload = await uploadFile(path+img,decode)
    if (upload) {
     data.url2 = urlGoogle
     data.imageUrl2 = path + img
   } else {

    res.status(200).json(response(400,"category",error("image")));
  }
}

if (body.image3 != null) {

  var decode = cryptoLocal.decodeBase64Image(body.image3)
  var img = crypto.randomBytes(32).toString('hex') +'.'+ decode.type;
    // require("fs").writeFile("public/"+path+img, decode.data, function(err) {
    //   console.log(err)
    // });

    // data.imageUrl = path + img

    var upload = await uploadFile(path+img,decode)
    if (upload) {
     data.url3 = urlGoogle
     data.imageUrl3 = path + img
   } else {

    res.status(200).json(response(400,"category",error("image")));
  }
}

if (body.image4 != null) {

  var decode = cryptoLocal.decodeBase64Image(body.image4)
  var img = crypto.randomBytes(32).toString('hex') +'.'+ decode.type;
    // require("fs").writeFile("public/"+path+img, decode.data, function(err) {
    //   console.log(err)
    // });

    // data.imageUrl = path + img

    var upload = await uploadFile(path+img,decode)
    if (upload) {
     data.url4 = urlGoogle
     data.imageUrl4 = path + img
   } else {

    res.status(200).json(response(400,"category",error("image")));
  }
}

try{
  var list = await model.Package.create(data);

  res.status(200).json(response(200,"package",list));
} catch(err) {
  res.status(200).json(response(400,"package",err));
}

});

router.put('/', auth.isUserOrVendor, async function(req, res, next) {
  var body = req.body;
  var url = req.protocol + '://' + req.get('host')
  var user = req.user
  var data = {
    name: body.name,
    price:body.price,
    capacity:body.capacity,
    provinceId:body.provinceId,
    isMain: body.isMain,
    cityId:body.cityId
  }

  if (body.image1 != null) {

    var decode = cryptoLocal.decodeBase64Image(body.image1)
    var img = crypto.randomBytes(32).toString('hex') +'.'+ decode.type;
    // require("fs").writeFile("public/"+path+img, decode.data, function(err) {
    //   console.log(err)
    // });

    // data.imageUrl = path + img

    var upload = await uploadFile(path+img,decode)
    if (upload) {
     data.url1 = urlGoogle
     data.imageUrl1 = path + img
   } else {

    res.status(200).json(response(400,"category",error("image")));
  }
}

if (body.image2 != null) {

  var decode = cryptoLocal.decodeBase64Image(body.image2)
  var img = crypto.randomBytes(32).toString('hex') +'.'+ decode.type;
    // require("fs").writeFile("public/"+path+img, decode.data, function(err) {
    //   console.log(err)
    // });

    // data.imageUrl = path + img

    var upload = await uploadFile(path+img,decode)
    if (upload) {
     data.url2 = urlGoogle
     data.imageUrl2 = path + img
   } else {

    res.status(200).json(response(400,"category",error("image")));
  }
}

if (body.image3 != null) {

  var decode = cryptoLocal.decodeBase64Image(body.image3)
  var img = crypto.randomBytes(32).toString('hex') +'.'+ decode.type;
    // require("fs").writeFile("public/"+path+img, decode.data, function(err) {
    //   console.log(err)
    // });

    // data.imageUrl = path + img

    var upload = await uploadFile(path+img,decode)
    if (upload) {
     data.url3 = urlGoogle
     data.imageUrl3 = path + img
   } else {

    res.status(200).json(response(400,"category",error("image")));
  }
}

if (body.image4 != null) {

  var decode = cryptoLocal.decodeBase64Image(body.image4)
  var img = crypto.randomBytes(32).toString('hex') +'.'+ decode.type;
    // require("fs").writeFile("public/"+path+img, decode.data, function(err) {
    //   console.log(err)
    // });

    // data.imageUrl = path + img

    var upload = await uploadFile(path+img,decode)
    if (upload) {
     data.url4 = urlGoogle
     data.imageUrl4 = path + img
   } else {

    res.status(200).json(response(400,"package",error("image")));
  }
}

  try{

    var update = await model.Package.update(data, {
      where: {
        id:body.id
      }
    });

    if (update[0] == 1) {
      update = await model.Package.findByPk(body.id);
    } else {
      return res.status(200).json(response(400,"package",update));
    }

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
     subQuery:false, 
     attributes:{
            include: [
            [Sequelize.literal('`city`.`name`'),'cityName'],
            [Sequelize.literal('`province`.`name`'),'provinceName']
            ]
          },
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
        model: model.Service,
        as:"services"
      },
      {
        model:model.Vendor,
        required: req.query.categoryId != null ? true :false,
        as:"vendor"
      }
      ]
    });

    var review = await model.Review.findOne({
      attributes: [
      [Sequelize.fn("COUNT", Sequelize.col('id')), "reviewCount"],
      [Sequelize.fn("AVG", Sequelize.fn('COALESCE',(Sequelize.col("rating")),0.0)), "reviewRating"]
      ],
      where :{
        vendorId: list.dataValues.id
      }
    })

    list.dataValues.reviewRating = review.dataValues.reviewRating != null ? review.dataValues.reviewRating : 0
    list.dataValues.reviewCount = review.dataValues.reviewCount != null ? review.dataValues.reviewCount : 0

    res.status(200).json(response(200,"package",list));

  } catch(err) {
    console.log(err)
    res.status(200).json(response(400,"package",err));
  }

});

module.exports = router;