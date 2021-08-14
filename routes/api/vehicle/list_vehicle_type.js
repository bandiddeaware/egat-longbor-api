var router = require('express').Router();
var passport = require('passport');
var auth = require("../../auth")

var ListVehicleType  = require('../../../mysql/ListVehicleType')

router.post('/type', auth.required, async function(req, res, next) {
  const result = await ListVehicleType()
  if (result.isError === false){
    return res.status(200).json({ data: result.data, status: true })
  } else {
    return res.status(500).json( {data: result.data, status: false} )
  }
})

module.exports = router;