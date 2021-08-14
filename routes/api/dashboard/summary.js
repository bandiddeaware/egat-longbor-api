var router = require('express').Router();
var passport = require('passport');
var data = require("../../../data/dashboard/dashboard")
var auth = require("../../auth")

var Summary = require("../../../mysql/Dashboard/Summary")

router.post('/summary', auth.required, async function(req, res, next) {

  if (!req.body.start_time){
    return res.status(400).json({errors: {message: "start_time can't be blank"}});
  }
  if (!req.body.stop_time){
    return res.status(400).json({errors: {message: "stop_time can't be blank"}});
  }

  const result = await Summary.TatalPersonVehicle(req.body.start_time, req.body.stop_time)
  if (result.isError === false)
    return res.status(200).json({ data: result.data[0], status: true })
  else
    return res.status(200).json({ data: data, status: false })
})

module.exports = router;