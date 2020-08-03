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
  	var project = await model.Project.findOne({
		where: {
			id: body.projectId
		},
		include: [
		{
			model:model.Booking,
			as:'booking',
			attributes: ['packageId','vendorId']
		}
		]
	})

  	project = project.get()
	var data = {
		rating: body.rating,
		description:body.description,
		projectId:body.projectId,
		bookingId:project.bookingId,
		vendorId:project.booking.vendorId,
    	packageId:project.booking.packageId,
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
