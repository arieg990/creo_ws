var express = require('express');
var router = express.Router();
var model = require('../models');
var response = require('../config/constant').response;
var auth = require('../config/auth');
const cryptoLocal = require('../config/crypto');
const crypto = require('crypto');
var constant = require('../config/constant.json');
const {uploadFile} = require('../config/uploadFile');
var urlGoogle = constant.url.googleStorage

router.post('/', async function(req, res, next) {
	var body = req.body;
	var user = req.user;

  try{
  	var booking = await model.Booking.findOne({
		where: {
			id: body.bookingId
		},
		include: [
		{
			model:model.Project,
			as:'project',
		}
		]
	})

  	booking = booking.get()
	var data = {
		rating: body.rating,
		description:body.description,
		projectId:booking.project.id,
		bookingId:booking.id,
		vendorId:booking.vendorId,
    	packageId:booking.packageId,
    	customerId: user.id
  }

    var list = await model.Review.create(data);

    res.status(200).json(response(200,"review",list));
  } catch(err) {
  	console.log(err)
    res.status(200).json(response(400,"review",err));
  }
  
});

module.exports = router;
