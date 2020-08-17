var express = require('express');
var router = express.Router();
var model = require('../models');
var response = require('../config/constant').response;
var auth = require('../config/auth');
const Sequelize = require("sequelize")

/* GET users listing. */
router.get('/list', async function(req, res, next) {

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
    var list = await model.Bank.findAll({
      offset:page*perPage,
      limit:perPage
    });

    var count = await model.Bank.count()

    var totalPage = Math.ceil(count/perPage)

    var paging = {
      "currentPage": page+1,
      "limitPerPage": perPage,
      "totalPage": totalPage
    }

    res.status(200).json(response(200,"banks",list, paging));
  } catch(err) {
    res.status(200).json(response(400,"banks",err));
  }

});

// router.post('/', async function(req, res, next) {
//   var body = req.body;
//   var data = {
//     name: body.name,
//     detail:body.detail,
//     provinceId:body.provinceId,
//     cityId:body.cityId,
//     postalCodeId:body.postalCodeId,
//     subDistrict:body.subDistrictId,
//     isMain: body.isMain,
//     projectId: body.projectId,
//     vendorId: body.vendorId,
//     customerId: body.customerId
//   }

//   try{
//     var list = await model.Address.create(data);

//     res.status(200).json(response(200,"address",list));
//   } catch(err) {
//     res.status(200).json(response(400,"address",err));
//   }
  
// });

// router.put('/', async function(req, res, next) {
//   var body = req.body;
//   var user = user.datalavues
//   var data = {
//     name: body.name,
//     detail:body.detail,
//     provinceId:body.provinceId,
//     cityId:body.cityId,
//     postalCodeId:body.postalCodeId,
//     subDistrict:body.subDistrictId,
//     isMain: body.isMain,
//     projectId: body.projectId,
//     vendorId: body.vendorId,
//     customerId: body.customerId
//   }

//   if (req.user.type == "customer") {
//     data.customerId = user.id
//   } else {
//     data.vendorId = user.id
//   }

//   try{

//     var update = await model.Address.update(data, {
//       where: {
//         id:body.id
//       }
//     });

//     if (update[0] == 1) {
//       update = await model.Address.findByPk(body.id);
//     } else {
//       return res.status(200).json(response(400,"address",update));
//     }

//     res.status(200).json(response(200,"address",update));

//   } catch(err) {
//     res.status(200).json(response(400,"address",err));
//   }

// });

// router.delete('/', async function(req, res, next) {
//   var body = req.body;

//   try{

//     var update = await model.Address.destroy({
//       where: {
//         id:body.id
//       }
//     });

//     res.status(200).json(response(200,"address",update));
    
//   } catch(err) {
//     res.status(200).json(response(400,"address",err));
//   }
  
// });

// router.get('/:id', async function(req, res, next) {

//   try{

//     var list = await model.Address.findByPk(req.params.id,{
//       include: [
//       {
//         model: model.City
//       },
//       {
//         model: model.Province
//       },
//       {
//         model:model.PostalCode
//       },
//       {
//         model:model.SubDistrict
//       }
//       ]
//     });

//     res.status(200).json(response(200,"address",list));

//   } catch(err) {
//     res.status(200).json(response(400,"address",err));
//   }

// });

module.exports = router;