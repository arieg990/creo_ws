var express = require('express');
var router = express.Router();
var model = require('../models');
var response = require('../config/constant').response;
var auth = require('../config/auth');

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
    var list = await model.Province.findAll({
      offset:page*perPage,
      limit:perPage
    });

    var count = await model.Province.count()

    var totalPage = Math.ceil(count/perPage)

    var paging = {
      "currentPage": page+1,
      "limitPerPage": perPage,
      "totalPage": totalPage
    }

    res.status(200).json(response(200,"provinces",list,paging));
  } catch(err) {
    res.status(200).json(response(400,"provinces",err));
  }

});

router.post('/', auth.isUser, async function(req, res, next) {
  var body = req.body;
  var data = {
    name: body.name,
  }

  try{
    var list = await model.Province.create(data);

    res.status(200).json(response(200,"province",list));
  } catch(err) {
    res.status(200).json(response(400,"province",err));
  }
  
});

router.put('/', auth.isUser, async function(req, res, next) {
  var body = req.body;
  var data = {
    name: body.name,
  }

  try{

    var update = await model.Province.update(data, {
      where: {
        id:body.id
      }
    });

    if (update[0] == 1) {
      update = await model.Province.findByPk(body.id);
    } else {
      return res.status(200).json(response(400,"province",update));
    }

    res.status(200).json(response(200,"province",update));

  } catch(err) {

    res.status(200).json(response(400,"province",err));
  }

});

router.delete('/', auth.isUser, async function(req, res, next) {
  var body = req.body;

  try{

    var update = await model.Province.destroy({
      where: {
        id:body.id
      }
    });

    res.status(200).json(response(200,"province",update));
    
  } catch(err) {
    res.status(200).json(response(400,"province",err));
  }
  
});

router.get('/:id', async function(req, res, next) {

  try{

    var list = await model.Province.findByPk(req.params.id,{
      include: [
      {
        model: model.City,
        include: [
        {
          model:model.PostalCode
        },
        {
          model:model.SubDistrict
        }
        ]
      }
      ]
    });

    res.status(200).json(response(200,"province",list));

  } catch(err) {
    res.status(200).json(response(400,"province",err));
  }

});

module.exports = router;