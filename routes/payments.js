var express = require('express');
var router = express.Router();
const crypto = require('crypto');
const cryptoLocal = require('../config/crypto');
var model = require('../models');
const Sequelize = require("sequelize")
var response = require('../config/constant').response;
var auth = require('../config/auth');
var constant = require('../config/constant.json');
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

  try{
    var list = await model.Payment.findAll({
      offset:page*perPage,
      limit:perPage,
      where: where,
      attributes:{
        include: [
        [Sequelize.literal('`status`.`name`'),'statusName'],
        [Sequelize.literal('`paymentType`.`name`'),'paymentTypeName']
        ]
      },
      include: [
      {
        model:model.Code,
        as:'status',
        attributes:[]
      },
      {
        model:model.Code,
        as:'paymentType',
        attributes:[]
      }
      ]
    });

    var count = await model.Payment.count({
      where:whereCount
    })

    var totalPage = Math.ceil(count/perPage)

    var paging = {
      "currentPage": page+1,
      "limitPerPage": perPage,
      "totalPage": totalPage
    }

    res.status(200).json(response(200,"payments",list,paging));
  } catch(err) {
    console.log(err)
    res.status(200).json(response(400,"payments",err));
  }

});

router.put('/upload', async function(req, res, next) {
  var body = req.body;
  var user = req.user
  var path = constant.path.customers
  var id
  var data = {}

  try{

    var payments = await model.Payment.findAll({
      where: {
        bookingId:body.bookingId,
      }
    })

    if (payments.length < 1) {
      var message = [{
        "message": "payment not found",
        "path": "bookingId",
        "value": body.bookingId
      }]

      return res.status(200).json(response(400,"payment",message));
    }

    var dp = payments.find(payment => payment.paymentTypeCode === "PTTDP")
    var repayment = payments.find(payment => payment.paymentTypeCode === "PTTRPT")


    if (typeof dp == "undefined" && typeof repayment == "undefined") {
     var message = [{
      "message": "payment not found",
      "path": "bookingId",
      "value": body.bookingId
    }]

    return res.status(200).json(response(400,"payment",message));
  }

  if (dp.statusCode != "PTSVRD") {
    id = dp.dataValues.id
    var decode = cryptoLocal.decodeBase64Image(body.image)
    var img = crypto.randomBytes(32).toString('hex') +'.'+ decode.type;

    // require("fs").writeFile("public/"+path+img, decode.data, function(err) {
    //   console.log(err)
    // });

    data.imageUrl = path + img

    var upload = await uploadFile(path+img,decode)
    if (upload) {
     data.url = urlGoogle
     data.imageUrl = path + img
     data.statusCode = "PTSVRF"
     data.bankId = body.bankId

     var update = await model.Booking.update({
      statusCode:"BKSVDP",
    }, {
      where: {
        id:body.bookingId
      }
    });

   } else {
    return res.status(200).json(response(400,"payment",error("image")));
  }
} else if (repayment.statusCode != "PTSVRD") {
  id = repayment.dataValues.id
  var decode = cryptoLocal.decodeBase64Image(body.image)
  var img = crypto.randomBytes(32).toString('hex') +'.'+ decode.type;

    // require("fs").writeFile("public/"+path+img, decode.data, function(err) {
    //   console.log(err)
    // });

    data.imageUrl = path + img

    var upload = await uploadFile(path+img,decode)
    if (upload) {
     data.url = urlGoogle
     data.imageUrl = path + img
     data.statusCode = "PTSVRF"
     data.bankId = body.bankId

     var update = await model.Booking.update({
      statusCode:"BKSVRP",
    }, {
      where: {
        id:body.bookingId
      }
    });

   } else {
    return res.status(200).json(response(400,"payment",error("image")));
  }


}

var update = await model.Payment.update(data, {
  where: {
    id:id
  }
});

if (update[0] == 1) {
  update = await model.Payment.findByPk(id);
} else {
  return res.status(200).json(response(400,"payment",update));
}

res.status(200).json(response(200,"payment",update));

} catch(err) {
  console.log(err)
  res.status(200).json(response(400,"payment",err));
}

});

router.put('/updateStatus', auth.isUser, async function(req, res, next) {
  var body = req.body;
  var err = []

  try {

    if (typeof body.id == "undefined" || typeof body.statusCode == "undefined") {
      if (typeof body.id == "undefined") {
        var errId = {
          "message":"id not found",
          "path":"id",
          "value": null
        }

        err.push(errId)
      }

      if (typeof body.paymentStatusCode == "undefined") {
        var errtype = {
          "message":"statusCode not found",
          "path":"statusCode",
          "value": null
        }

        err.push(errtype)
      }

      return res.status(200).json(response(400,"payment",err));
    }

    var payment = await model.Payment.findByPk(body.id)

    if (!payment) {
      var errId = {
        "message":"payment not found",
        "path":"id",
        "value": null
      }
      err.push(errId)

      return res.status(200).json(response(400,"payment",err));
    }

    var booking = await payment.getBooking()

    var data = {
      statusCode: body.statusCode
    }

    if (payment.paymentTypeCode == "PTTDP") {
      if (body.statusCode == "PTSVRD") {
        updateBooking = {
          statusCode: "BKSWRP"
        }

        await booking.update(updateBooking)
      }
    } else if (payment.paymentTypeCode == "PTTRPT") {
      if (body.statusCode == "PTSVRD") {
        updateBooking = {
          statusCode: "BKSWTG"
        }

        await booking.update(updateBooking)
      }
    }

    var update = await payment.update(data)

    res.status(200).json(response(200,"payment",update));

  } catch(err) {
    console.log(err)
    res.status(200).json(response(400,"payment",err));
  }

})

router.get('/:id', async function(req, res, next) {

  try{

    var list = await model.Payment.findByPk(req.params.id, {
      attributes:{
        include: [
        [Sequelize.literal('`status`.`name`'),'statusName'],
        [Sequelize.literal('`paymentType`.`name`'),'paymentTypeName']
        ]
      },
      include: [
      {
        model:model.Code,
        as:'status',
        attributes:[]
      },
      {
        model:model.Code,
        as:'paymentType',
        attributes:[]
      }
      ]
    });

    res.status(200).json(response(200,"payment",list));

  } catch(err) {
    res.status(200).json(response(400,"payment",err));
  }

});

module.exports = router;
