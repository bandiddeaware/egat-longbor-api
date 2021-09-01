var router = require('express').Router();
var passport = require('passport');
var auth = require("./../auth")
var hookapi = require("./../../hook")

router.post('/hook/hrapi', auth.required, async function(req, res, next) {
  const res_ = await hookapi.hookHR(req.body.mifare)
  return res.status(200).json(res_.data);
})
module.exports = router;