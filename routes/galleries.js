var express = require('express');
var router = express.Router();
var model = require('../models');
var response = require('../config/constant').response;
const crypto = require('crypto');
const cryptoLocal = require('../config/crypto');
const Sequelize = require("sequelize")
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
  var where = {}
  var whereCount = {}

  if (offset > 1) {
    page = offset-1
  }

  if (limit >= 1) {
    perPage = limit
  }


  if(req.query.type != null) {
    const type = req.query.type
    if (type == "vendor") {
      where.vendorId = req.query.id
      whereCount.vendorId = req.query.id
    } else if (type == "package") {
      where.packageId = req.query.id
      whereCount.packageId = req.query.id
    }
  }

  try{
    var list = await model.Gallery.findAll({
      offset:page*perPage,
      limit:perPage,
      where: where,
      attributes:{
        include: [
        [Sequelize.literal('`vendor`.`name`'),'vendorName'],
        [Sequelize.literal('`project`.`title`'),'projectTitle'],
        [Sequelize.literal('`package`.`name`'),'packageName']
        ]
      },
      include: [
      {
        model:model.Vendor,
        as: 'vendor',
        attributes: [],
        required: false
      },
      {
        model:model.Package,
        as: 'package',
        attributes: [],
        required: false
      },
      {
        model:model.Project,
        as: 'project',
        attributes: [],
        required: false
      }
      ]
    });

    var count = await model.Gallery.count({
      where:whereCount
    })

    var totalPage = Math.ceil(count/perPage)

    var paging = {
      "currentPage": page+1,
      "limitPerPage": perPage,
      "totalPage": totalPage
    }

    res.status(200).json(response(200,"galleries",list,paging));
  } catch(err) {
    console.log(err)
    res.status(200).json(response(400,"galleries",err));
  }

});

router.post('/', async function(req, res, next) {
	var body = req.body;
  var url = req.protocol + '://' + req.get('host')
  var err = []
  var data = {
    vendorId: body.vendorId,
    packageId: body.packageId,
    isMain: body.isMain
  }

  try{

    if (typeof body.image == "undefined") {
      var errId = {
        "message":"id not found",
        "path":"id",
        "value": null
      }
      err.push(errId)

      return res.status(200).json(response(400,"booking",err));
    } else {
      var decode = cryptoLocal.decodeBase64Image(body.image)
      var img = crypto.randomBytes(32).toString('hex') +'.'+ decode.type;

      data.imageUrl = path + img

      var upload = await uploadFile(path+img,decode)
      if (upload) {
       data.url = urlGoogle
       data.imageUrl = path + img
     }
   }

   var list = await model.Gallery.create(data);

   res.status(200).json(response(200,"gallery",list));
 } catch(err) {
  res.status(200).json(response(400,"gallery",err));
}

});

router.put('/', async function(req, res, next) {
  var body = req.body;
  var url = req.protocol + '://' + req.get('host')
  var path = constant.path.categories
  var data = {
    vendorId: body.vendorId,
    packageId: body.packageId,
    isMain: body.isMain
  }

  try{

    if (typeof body.image != "undefined") {
      var decode = cryptoLocal.decodeBase64Image(body.image)
      var img = crypto.randomBytes(32).toString('hex') +'.'+ decode.type;

      data.imageUrl = path + img

      var upload = await uploadFile(path+img,decode)
      if (upload) {
       data.url = urlGoogle
       data.imageUrl = path + img
     }
   }

   var update = await model.Gallery.update(data, {
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

    var update = await model.Gallery.destroy({
      where: {
        id:body.id
      }
    });

    res.status(200).json(response(200,"gallery",update));
    
  } catch(err) {
    res.status(200).json(response(400,"gallery",err));
  }
  
});

router.get('/:id', async function(req, res, next) {

  try{

    var list = await model.Gallery.findByPk(req.params.id, {
      attributes:{
        include: [
        [Sequelize.literal('`vendor`.`name`'),'vendorName'],
        [Sequelize.literal('`project`.`title`'),'projectTitle'],
        [Sequelize.literal('`package`.`name`'),'packageName']
        ]
      },
      include: [
      {
        model:model.Vendor,
        as: 'vendor',
        attributes: [],
        required: false
      },
      {
        model:model.Package,
        as: 'package',
        attributes: [],
        required: false
      },
      {
        model:model.Project,
        as: 'project',
        attributes: [],
        required: false
      }
      ]
    });

    res.status(200).json(response(200,"gallery",list));

  } catch(err) {
    res.status(200).json(response(400,"gallery",err));
  }

});

module.exports = router;