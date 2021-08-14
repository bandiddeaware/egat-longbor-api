var router = require('express').Router();
var passport = require('passport');
var auth = require("../../auth")

var province  = require('../../../mysql/ListProvince')


router.post('/province', auth.required, async function(req, res, next) {
  const result = await province.Find()
  if (result.isError === false){
    return res.status(200).json({ data: result.data, length: result.data.length, status: true })
  } else {
    return res.status(500).json( {data: result.data, status: false} )
  }
})

module.exports = router;