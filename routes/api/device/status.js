var router = require('express').Router();
var passport = require('passport');
var data = require("../../../data/device/devices")
var auth = require("../../auth")

var device = require("../../../mysql/Device/status")

router.post('/', auth.required, async function(req, res, next) {

  var result = await device.Status();
  if (result.isError === false)
    return res.status(200).json({ data: result.data , length: result.length, status: true})
  else
    return res.status(200).json({data: result.data, status: false})
})

module.exports = router;