var express = require('express');
var router = express.Router();
var model = require('../models');
var response = require('../config/constant').response;
const crypto = require('crypto');
const cryptoLocal = require('../config/crypto');
var constant = require('../config/constant.json');
var auth = require('../config/auth');
var path = constant.path.galleries
const {uploadFile} = require('../config/uploadFile');
var urlGoogle = constant.url.googleStorage

/* GET users listing. */
router.get('/list', async function(req, res, next) {

  var page = 0;
  var perPage = 10;
  var offset = parseInt(req.query.page)
  var limit = parseInt(req.query.limit)
  var user = req.user
  var where = {}
  var whereCount = {}

  if (offset > 1) {
    page = offset-1
  }

  if (limit >= 1) {
    perPage = limit
  }


  if (user.userType == "customer") {
    where.customerId = user.id
    whereCount.customerId = user.id
  }

  if (user.userType == "vendor") {
    where.vendorId = user.vendorId
    whereCount.vendorId = user.vendorId
  }

  try{
    var list = await model.Project.findAll({
      offset:page*perPage,
      limit:perPage,
      include: [
      {
        model:model.Booking,
        as:"booking",
        where:where
      }
      ]
    });

    var count = await model.Project.count({
      include: [
      {
        model:model.Booking,
        as:"booking",
        where:where
      }
      ]
    })

    var totalPage = Math.ceil(count/perPage)

    var paging = {
      "currentPage": page+1,
      "limitPerPage": perPage,
      "totalPage": totalPage,
      "total": count
    }

    res.status(200).json(response(200,"projects",list,paging));
  } catch(err) {
    console.log(err)
    res.status(200).json(response(400,"projects",err));
  }

});

// router.post('/', async function(req, res, next) {
// 	var body = req.body;
//   var url = req.protocol + '://' + req.get('host')
//   var data = {
//     vendorId: body.vendorId,
//     packageId: body.packageId,
//     isMain: body.isMain
//   }

//   try{
//     var list = await model.Gallery.create(data);

//     res.status(200).json(response(200,"gallery",list));
//   } catch(err) {
//     res.status(200).json(response(400,"gallery",err));
//   }
  
// });

router.put('/', auth.isUserOrVendor, async function(req, res, next) {
  var body = req.body;
  var url = req.protocol + '://' + req.get('host')
  var path = constant.path.categories
  var data = {
    title: body.title,
    description: body.description
  }

  try{

    var update = await model.Project.update(data, {
      where: {
        id:body.id
      }
    });

    if (update[0] == 1) {
      update = await model.Gallery.findByPk(body.id);
    } else {
      return res.status(200).json(response(400,"gallery",update));
    }

    res.status(200).json(response(200,"gallery",update));

  } catch(err) {
    res.status(200).json(response(400,"gallery",err));
  }

});

router.delete('/', async function(req, res, next) {
  var body = req.body;

  try{

    var update = await model.Project.destroy({
      where: {
        id:body.id
      }
    });

    res.status(200).json(response(200,"project",update));
    
  } catch(err) {
    res.status(200).json(response(400,"project",err));
  }
  
});

router.get('/:id', async function(req, res, next) {

  try{

    var list = await model.Project.findByPk(req.params.id,{
      include: [
      {
        model:model.Booking,
        as:"booking",
        include: [
        {
          model: model.Customer,
          as: 'customer',
        },
        {
          model: model.Location,
          as: 'location'
        }
        ]
      }
      ]
    });

    res.status(200).json(response(200,"project",list));

  } catch(err) {
    res.status(200).json(response(400,"project",err));
  }

});

module.exports = router;