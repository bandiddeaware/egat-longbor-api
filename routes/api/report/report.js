var router = require('express').Router();
var passport = require('passport');
var data = require("../../../data/report")
var auth = require("../../auth")

var report = require("../../../mysql/Report")

router.post('/', auth.required, async function(req, res, next) {
  if (!req.body.start_time){
    return res.status(400).json({errors: {message: "start_time can't be blank"}});
  }
  if (!req.body.stop_time){
    return res.status(400).json({errors: {message: "stop_time can't be blank"}});
  }

  const result = await report.summary_day(req.body.start_time, req.body.stop_time)
  if (result.isError === false)
    return res.status(200).json({ data: result.data , status: true})
  else
    return res.status(200).json({data: result.data, status: false})
})

router.post('/all/day', auth.required, async function(req, res, next) {

  const result = await report.report_all_day(req.body.start_time, req.body.stop_time)
  if (result.isError === false)
    return res.status(200).json({ data: result.data , status: true})
  else
    return res.status(200).json({data: result.data, status: false})

})

router.post('/all/month', auth.required, async function(req, res, next) {

  const result = await report.report_all_month(req.body.start_time, req.body.stop_time)
  if (result.isError === false)
    return res.status(200).json({ data: result.data , status: true})
  else
    return res.status(200).json({data: result.data, status: false})

})

module.exports = router;