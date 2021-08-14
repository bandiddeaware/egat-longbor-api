var router = require('express').Router();
var passport = require('passport');
var auth = require("../../auth")
var data = require("./../../../data/list_contract")

router.post('/contract', auth.required, function(req, res, next) {
  return res.status(200).json(data)
})

module.exports = router;