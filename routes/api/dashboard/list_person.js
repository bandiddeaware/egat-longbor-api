var router = require('express').Router();
var passport = require('passport');
var auth = require("../../auth")
var ListPerson = require("../../../mysql/Dashboard/List_person")

router.post('/list/person', auth.required, async function(req, res, next) {
  if (!req.body.start_time){
    return res.status(400).json({errors: {message: "start_time can't be blank"}});
  }
  if (!req.body.stop_time){
    return res.status(400).json({errors: {message: "stop_time can't be blank"}});
  }
  if (!req.body.offset){
    return res.status(400).json({errors: {message: "offset can't be blank"}});
  }
  if (!req.body.limit){
    return res.status(400).json({errors: {message: "limit can't be blank"}});
  }
  if (isNaN(req.body.offset)){
    return res.status(400).json({errors: {message: "offset can't be number"}});
  }
  if (isNaN(req.body.limit)){
    return res.status(400).json({errors: {message: "limit can't be number"}});
  }
  if (!req.body.sort_type){
    return res.status(400).json({errors: {message: "sort_type can't be blank"}});
  }
  if (!req.body.sort){
    return res.status(400).json({errors: {message: "sort can't be blank"}});
  }
  var result = await ListPerson.FindLog(
    req.body.start_time, 
    req.body.stop_time,
    req.body.entrance_id,
    req.body.firstname,
    req.body.lastname,
    req.body.company_id,
    req.body.company_name,
    req.body.ACCESS_GRANTED ,
    req.body.PERMISSION_DENIED ,
    req.body.CARD_EXPIRED ,
    req.body.NO_CARD_EXISTED,
    req.body.INVALID_CHANNEL_TYPE ,
    req.body.CARD_NOT_ACTIVATED ,
    req.body.PASSBACK_VIOLATION ,
    req.body.NOT_AVAILABLE_SYS ,
    req.body.offset, 
    req.body.limit,
    req.body.sort,
    req.body.sort_type,
  )
  if (result.isError === false)
    return res.status(200).json({ data: result.data , length: result.length, status: true})
  else
    return res.status(200).json({data: result.data, status: false})
})

module.exports = router;