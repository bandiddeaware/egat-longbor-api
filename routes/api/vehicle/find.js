var router = require('express').Router();
var auth = require("../../auth")

var vehicle = require("../../../mysql/Vehicle/Find")

router.post('/', auth.required, async function(req, res, next) {
  if (!req.body.offset){
    return res.status(400).json({errors: {message: "offset can't be blank"}});
  }
  if (!req.body.limit){
    return res.status(400).json({errors: {message: "limit can't be blank"}});
  }
  const result = await vehicle.Find(
    req.body.card_id,
    req.body.license,
    req.body.uhf_id,
    req.body.mifare_id,
    req.body.company_name,
    req.body.is_card_number,
    req.body.is_expire_card,
    req.body.is_accept_mine,
    req.body.offset,
    req.body.limit 
  )

  if (result.isError === false){
    return res.status(200).json({ data: result.data, length: result.count[0].length, status: true })
  } else {
    return res.status(500).json( {data: result.data, status: false} )
  }
})

module.exports = router;