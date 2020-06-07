var express = require('express');
var router = express.Router();
var model = require('../models');
var response = require('../config/constant').response;
var invoiceGenerator = require('../config/constant').invoiceGenerator;
const Sequelize = require("sequelize")
const crypto = require('crypto');
const cryptoLocal = require('../config/crypto');
var constant = require('../config/constant.json');
var auth = require('../config/auth');
var path = constant.path.banners
const {uploadFile} = require('../config/uploadFile');
var urlGoogle = constant.url.googleStorage

/* GET users listing. */
router.get('/list', async function(req, res, next) {

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
    var list = await model.Booking.findAll({
      offset:page*perPage,
      limit:perPage,
      subQuery:false,
      attributes:{
        include: [
        [Sequelize.literal('`status`.`name`'),'statusName'],
        [Sequelize.literal('`package`.`name`'),'packageName'],
        [Sequelize.literal('`package`.`url1`'),'packageUrl'],
        [Sequelize.literal('`package`.`imageUrl1`'),'packageImageUrl']

        ]
      },
      include: [
      {
        model:model.Package,
        as:'package',
        attributes: []
      },
      {
        model:model.Payment,
        as:'payments'
      },
      {
        model:model.Code,
        as:'status',
        attributes: []
      }
      ]
    });

    var paging = {
      "currentPage": page+1,
      "limitPerPage": perPage,
    }

    res.status(200).json(response(200,"bookings",list,paging));
  } catch(err) {
    console.log(err)
    res.status(200).json(response(400,"bookings",err));
  }

});

router.post('/', async function(req, res, next) {
	var body = req.body;
  var total = 0
  var dp = 0
  var repayment = 0
  var paymentBulk = []

  var data = {
    qty: body.qty,
    note:body.note,
    packageId:body.packageId,
    customerId:body.customerId,
    startDate:body.startDate,
    endDate:body.endDate
  }

  try{

    var packageCreate = await model.Package.findByPk(body.packageId)
    var package = packageCreate.dataValues

    if (package != null) {
      total = package.price * body.qty
      dp = total * 30 / 100
      repayment = total - dp

      data.vendorId = package.vendorId
      data.total = total
    } else {
      var err = {
        "message":"Package not found",
        "path":"packageId",
        "value":body.packageId
      }
      return res.status(200).json(response(400,"booking",err));
    }


    var list = await model.Booking.create(data);
    var booking = list.dataValues

    var locationData = {
      detail:body.locationDetail,
      bookingId:booking.id,
      lat:body.lat,
      lng:body.lng
    }

    var location = await model.Location.create(locationData);
    booking.location = location
    var invoice = invoiceGenerator(booking.id)

    paymentDP = {
      invoiceNumber:invoice,
      total:dp,
      bookingId:booking.id,
      expiredDate: new Date(),
      paymentTypeCode: "PTTDP"
    }

    paymentRPT = {
      invoiceNumber:invoice,
      total:repayment,
      bookingId:booking.id,
      expiredDate: new Date(),
      paymentTypeCode: "PTTRPT"
    }
    paymentBulk.push(paymentDP)
    paymentBulk.push(paymentRPT)

    await model.Payment.bulkCreate(paymentBulk)

    var update = await model.Booking.update({
      invoiceNumber:invoice
    }, {
      where: {
        id:booking.id
      }
    });

    res.status(200).json(response(200,"booking",booking));
  } catch(err) {
    console.log(err)
    res.status(200).json(response(400,"booking",err));
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
    startDate:body.startDate,
    endDate:body.endDate
  }

  try{

    var update = await model.Booking.update(data, {
      where: {
        id:body.id
      }
    });

    res.status(200).json(response(200,"booking",update));

  } catch(err) {
    res.status(200).json(response(400,"booking",err));
  }

});

router.delete('/', async function(req, res, next) {
  var body = req.body;

  try{

    var update = await model.Booking.destroy({
      where: {
        id:body.id
      }
    });

    res.status(200).json(response(200,"booking",update));
    
  } catch(err) {
    res.status(200).json(response(400,"booking",err));
  }
  
});

router.get('/:id', async function(req, res, next) {

  try{

    var list = await model.Booking.findByPk(req.params.id,{
      attributes:{
        include: [
        [Sequelize.literal('`status`.`name`'),'statusName'],
        [Sequelize.literal('`package->vendor`.`name`'),'vendorName'],
        [Sequelize.literal('`package`.`name`'),'packageName'],
        [Sequelize.literal('`package`.`url1`'),'packageUrl'],
        [Sequelize.literal('`package`.`imageUrl1`'),'packageImageUrl']

        ]
      },
      subQuery:false,
      include: [
      {
        model:model.Package,
        as:'package',
        attributes: [],
        include: [
        {
          model:model.Vendor,
          as:'vendor',
          attributes: []
        }
        ]
      },
      {
        model:model.Payment,
        as:'payments'
      },
      {
        model:model.Code,
        as:'status',
        attributes: []
      }
      ]
    });

    res.status(200).json(response(200,"booking",list));

  } catch(err) {
    console.log(err)
    res.status(200).json(response(400,"booking",err));
  }

});

module.exports = router;