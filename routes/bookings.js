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
  var limit = parseInt(req.query.limit)
  var where = {}
  var whereCount = {}

  if (offset > 1) {
    page = offset-1
  }

  if (limit >= 1) {
    perPage = limit
  }

  if (req.query.status) {
    where.statusCode = req.query.status
    whereCount.statusCode = req.query.status
  }

  // req.user.id = 1
  // req.user.userType = "customer"

  if (req.user.userType == "customer") {
    where.customerId = req.user.id
    whereCount.customerId = req.user.id
  }

  if (req.user.userType == "vendor") {
    where.vendorId = req.user.vendorId
    whereCount.vendorId = req.user.vendorId
  }

  try{
    var list = await model.Booking.findAll({
      offset:page*perPage,
      limit:perPage,
      order:[
      ["createdAt","DESC"]
      ],
      // subQuery:false,
      attributes:{
        include: [
        [Sequelize.col('status.name'),'statusName'],
        [Sequelize.col('package.name'),'packageName'],
        [Sequelize.col('package.url1'),'packageUrl'],
        [Sequelize.col('package.imageUrl1'),'packageImageUrl'],
        [Sequelize.col('package.price'),'packagePrice'],
        [Sequelize.col('package.capacity'),'packageCapacity']
        ]
      },
      include: [
      {
        model:model.Package,
        as:'package',
        attributes: []
      },
      {
        model:model.Code,
        as:'status',
        attributes: []
      }
      ],
      where : where
    });

    for (var i = 0; i < list.length; i++) {
      list[i].get().payments = await list[i].getPayments()
    }

    var count = await model.Booking.count({
      where: whereCount
    })

    var totalPage = Math.ceil(count/perPage)

    var paging = {
      "currentPage": page+1,
      "limitPerPage": perPage,
      "totalPage": totalPage
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
    customerId:req.user.id,
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
      villageId: body.villageId,
      lat:body.lat,
      lng:body.lng
    }

    var location = await model.Location.create(locationData);
    booking.location = location

    var data = await model.Booking.findOne({
      subQuery:false,
      attributes:{
        include: [
        [Sequelize.literal('`status`.`name`'),'statusName'],
        [Sequelize.literal('`package`.`name`'),'packageName'],
        [Sequelize.literal('`package`.`url1`'),'packageUrl'],
        [Sequelize.literal('`package`.`imageUrl1`'),'packageImageUrl'],
        [Sequelize.literal('`package`.`price`'),'packagePrice'],
        [Sequelize.literal('`package`.`capacity`'),'packageCapacity']
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
        as:'payments',
        required: false
      },
      {
        model:model.Code,
        as:'status',
        attributes: []
      },
      {
        model:model.Location,
        as:'location'
      }
      ],
      where : {
        id:booking.id
      }
    });

    res.status(200).json(response(200,"booking",data));
  } catch(err) {
    console.log(err)
    res.status(200).json(response(400,"booking",err));
  }
  
});

router.put('/', auth.isUserOrVendor, async function(req, res, next) {
  var body = req.body;
  var url = req.protocol + '://' + req.get('host')
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

router.put('/updateStatus', auth.isUserOrVendor, async function(req, res, next) {
  var body = req.body;
  var user = req.user;
  var url = req.protocol + '://' + req.get('host')
  var total = 0
  var dp = 0
  var bookingStatus = ""
  var repayment = 0
  var where = {}
  var err = []
  var paymentBulk = []
  var data = {
    statusCode: body.statusCode
  }

  if (typeof body.id == "undefined") {
    var errId = {
      "message":"id not found",
      "path":"id",
      "value": null
    }
    err.push(errId)

    return res.status(200).json(response(400,"booking",err));
  }

  where.id = body.id

  var booking = await model.Booking.findByPk(body.id, {
    attributes: ["statusCode", "total"]
  });
  total = booking.get().total
  bookingStatus = booking.get().statusCode

  if (user.userType == "vendor") {
    where.vendorId = req.user.vendorId
  } 

  try{

    if (bookingStatus == "BKSVTG" && body.statusCode == "BKSWDP") {

      if (typeof body.title == "undefined" || typeof body.description == "undefined") {
        if (typeof body.title == "undefined") {
          var errTitle = {
            "message":"title not found",
            "path":"title",
            "value": null
          }
          err.push(errTitle)
        }

        if (typeof body.description == "undefined") {
          var errTitle = {
            "message":"description not found",
            "path":"description",
            "value": null
          }
          err.push(errTitle)
        }

        return res.status(200).json(response(400,"booking",err));
      }

      var insertData = {
        bookingId: body.id,
        title: body.title,
        description: body.description
      }
      console.log(insertData)

      var invoice = invoiceGenerator(body.id)
      data.invoiceNumber = invoice

      dp = total * 30 / 100
      repayment = total - dp

      paymentDP = {
        invoiceNumber:invoice,
        total:dp,
        bookingId:body.id,
        expiredDate: new Date(),
        paymentTypeCode: "PTTDP"
      }

      paymentRPT = {
        invoiceNumber:invoice,
        total:repayment,
        bookingId:body.id,
        expiredDate: new Date(),
        paymentTypeCode: "PTTRPT"
      }
      paymentBulk.push(paymentDP)
      paymentBulk.push(paymentRPT)

      var insertProject = await model.Project.create(insertData)
      var insertPayment = await model.Payment.bulkCreate(paymentBulk)

    }

    var update = await model.Booking.update(data, {
      where: where
    });

    if (update[0] == 1) {
      update = await model.Booking.findByPk(body.id,{
        subQuery:false,
        attributes:{
          include: [
          [Sequelize.literal('`status`.`name`'),'statusName'],
          [Sequelize.literal('`package`.`name`'),'packageName'],
          [Sequelize.literal('`package`.`url1`'),'packageUrl'],
          [Sequelize.literal('`package`.`imageUrl1`'),'packageImageUrl'],
          [Sequelize.literal('`package`.`price`'),'packagePrice'],
          [Sequelize.literal('`package`.`capacity`'),'packageCapacity']
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
          as:'payments',
          required: false
        },
        {
          model:model.Code,
          as:'status',
          attributes: []
        },
        {
          model:model.Location,
          as:'location'
        }
        ]
      });

    } else {
      var err = {
        "message":"update failed",
        "path":"id",
        "value": body.id
      }

      return res.status(200).json(response(400,"booking",err));
    }

    res.status(200).json(response(200,"booking",update));

  } catch(err) {
    console.log(err)
    res.status(200).json(response(400,"booking",err));
  }

});

router.delete('/', async function(req, res, next) {
  var body = req.body;

  try{

    var update = await model.Booking.destroy({
      where: {
        id:body.id,
        customerId:req.user.id
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
        [Sequelize.literal('`package`.`imageUrl1`'),'packageImageUrl'],
        [Sequelize.literal('`package`.`price`'),'packagePrice'],
        [Sequelize.literal('`package`.`capacity`'),'packageCapacity']


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
        model:model.Location,
        as:'location'
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